// ============================================================
// LOGIC - Text-to-Speech (Single Voice Engine)
// ONE voice at a time. No overlap. No dual-engine.
// Strategy: Native first, if fails permanently switch to Google TTS.
// ============================================================

let _speaking = false;
let _currentMethod: 'native' | 'fallback' | 'none' = 'none';
let _fallbackAudio: HTMLAudioElement | null = null;
let _lockedVoice: SpeechSynthesisVoice | null = null;
let _forceFallback = false; // Once native fails, permanently use fallback

// ============================================================
// VOICE PRELOADING
// ============================================================
export function preloadVoices(): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;

  const loadVoices = () => {
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0 && !_lockedVoice) {
      // Lock the best Italian voice immediately
      _lockedVoice = voices.find((v) => v.lang.startsWith('it') && v.localService)
        || voices.find((v) => v.lang.startsWith('it'))
        || null;
    }
  };

  loadVoices();
  if (typeof window.speechSynthesis.onvoiceschanged !== 'undefined') {
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }
}

// ============================================================
// STOP ALL SPEECH
// ============================================================
export function stopSpeech(): void {
  _speaking = false;
  _currentMethod = 'none';

  // Stop native
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    try {
      window.speechSynthesis.cancel();
    } catch (e) { /* ignore */ }
  }

  // Stop fallback audio
  if (_fallbackAudio) {
    try {
      _fallbackAudio.pause();
      _fallbackAudio.currentTime = 0;
      _fallbackAudio.src = '';
    } catch (e) { /* ignore */ }
    _fallbackAudio = null;
  }
}

// ============================================================
// NATIVE SPEECH (Web Speech API) - with lock
// ============================================================
function speakNative(text: string, lang: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (!window.speechSynthesis) {
      resolve(false);
      return;
    }

    _currentMethod = 'native';

    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    u.rate = 0.85;
    u.volume = 1;
    u.pitch = 1;

    // Use LOCKED voice (prevents mid-sentence voice changes)
    const langPrefix = lang.split('-')[0];
    if (_lockedVoice && _lockedVoice.lang.startsWith(langPrefix)) {
      u.voice = _lockedVoice;
      u.lang = _lockedVoice.lang;
    } else {
      const voices = window.speechSynthesis.getVoices();
      const match = voices.find((v) => v.lang.startsWith(langPrefix) && v.localService)
        || voices.find((v) => v.lang.startsWith(langPrefix));
      if (match) {
        u.voice = match;
        u.lang = match.lang;
        if (langPrefix === 'it') _lockedVoice = match;
      }
    }

    let resolved = false;

    u.onend = () => {
      if (!resolved) {
        resolved = true;
        _speaking = false;
        _currentMethod = 'none';
        resolve(true);
      }
    };

    u.onerror = (e) => {
      if (!resolved) {
        resolved = true;
        _speaking = false;
        _currentMethod = 'none';
        console.warn('[TTS] Native error:', e.error);
        resolve(false);
      }
    };

    _speaking = true;
    window.speechSynthesis.speak(u);
  });
}

// ============================================================
// FALLBACK SPEECH (Google TTS via server proxy) - with lock
// ============================================================
function speakFallback(text: string, lang: string): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      stopFallbackAudio();

      const langCode = lang.startsWith('ar') ? 'ar' : 'it';
      const trimmed = text.trim().substring(0, 200);
      const audioUrl = `/api/tts?text=${encodeURIComponent(trimmed)}&lang=${langCode}`;

      const audio = new Audio();
      audio.volume = 1;
      audio.preload = 'auto';

      let resolved = false;

      audio.onended = () => {
        if (!resolved) {
          resolved = true;
          _speaking = false;
          _currentMethod = 'none';
          _fallbackAudio = null;
          resolve(true);
        }
      };

      audio.onerror = () => {
        if (!resolved) {
          resolved = true;
          _speaking = false;
          _currentMethod = 'none';
          _fallbackAudio = null;
          resolve(false);
        }
      };

      audio.oncanplaythrough = () => {
        audio.play().catch(() => {
          if (!resolved) {
            resolved = true;
            _speaking = false;
            _currentMethod = 'none';
            _fallbackAudio = null;
            resolve(false);
          }
        });
      };

      // Timeout: if audio doesn't start within 10 seconds
      setTimeout(() => {
        if (!resolved) {
          resolved = true;
          _speaking = false;
          _currentMethod = 'none';
          try { audio.pause(); } catch (e) { /* ignore */ }
          _fallbackAudio = null;
          resolve(false);
        }
      }, 10000);

      audio.src = audioUrl;
      _fallbackAudio = audio;
      _currentMethod = 'fallback';
      _speaking = true;
    } catch (e) {
      resolve(false);
    }
  });
}

function stopFallbackAudio() {
  if (_fallbackAudio) {
    try {
      _fallbackAudio.pause();
      _fallbackAudio.currentTime = 0;
      _fallbackAudio.src = '';
    } catch (e) { /* ignore */ }
    _fallbackAudio = null;
  }
}

// ============================================================
// PUBLIC API - speakText
// Guarantees: only ONE voice at a time, no overlap
// ============================================================
export async function speakText(text: string, lang = 'it-IT'): Promise<void> {
  if (typeof window === 'undefined') return;
  if (!text || text.trim().length === 0) return;

  // STOP any currently playing speech FIRST
  stopSpeech();

  // Wait a moment to let cancel() fully flush (Chrome bug fix)
  await new Promise((r) => setTimeout(r, 80));

  // Use the method that works (native or fallback)
  // Once fallback is forced, always use it
  if (_forceFallback) {
    await speakFallback(text, lang);
    return;
  }

  // Try native Web Speech API
  if (window.speechSynthesis) {
    // Chrome bug fix: resume if paused
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }

    const success = await speakNative(text, lang);
    if (success) return;

    // Native failed - permanently switch to fallback for this session
    console.log('[TTS] Native failed, switching to Google TTS fallback');
    _forceFallback = true;
    stopSpeech();
    await new Promise((r) => setTimeout(r, 50));
  }

  // Use Google TTS fallback
  if (window.Audio) {
    await speakFallback(text, lang);
  }
}

// ============================================================
// PUBLIC API - speakWord
// ============================================================
export async function speakWord(word: string, lang: 'it' | 'ar' = 'it'): Promise<void> {
  if (typeof window === 'undefined') return;
  if (!word || word.trim().length === 0) return;
  const targetLang = lang === 'ar' ? 'ar-SA' : 'it-IT';
  await speakText(word.trim(), targetLang);
}

// ============================================================
// PUBLIC API - isSpeaking
// ============================================================
export function isSpeaking(): boolean {
  return _speaking;
}

// ============================================================
// PUBLIC API - hasVoiceForLang
// ============================================================
export function hasVoiceForLang(lang: 'it' | 'ar'): boolean {
  if (typeof window === 'undefined' || !window.speechSynthesis) return false;
  return window.speechSynthesis.getVoices().some((v) => v.lang.startsWith(lang));
}

// ============================================================
// PUBLIC API - getAvailableVoices
// ============================================================
export function getAvailableVoices(): { lang: string; name: string; local: boolean }[] {
  if (typeof window === 'undefined' || !window.speechSynthesis) return [];
  return window.speechSynthesis.getVoices().map((v) => ({
    lang: v.lang,
    name: v.name,
    local: v.localService,
  }));
}
