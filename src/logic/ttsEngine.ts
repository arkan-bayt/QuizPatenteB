// ============================================================
// LOGIC - Text-to-Speech (Universal)
// Works on ALL devices and browsers
// Strategy: Try Web Speech API first, fall back to Google TTS API
// ============================================================
let _utt: SpeechSynthesisUtterance | null = null;
let _fallbackAudio: HTMLAudioElement | null = null;
let _speechAvailable: boolean | null = null;
let _fallbackAvailable: boolean | null = null;

// ============================================================
// CHECK BROWSER SUPPORT
// ============================================================
function isSpeechSupported(): boolean {
  if (_speechAvailable !== null) return _speechAvailable;
  _speechAvailable = typeof window !== 'undefined' && !!window.speechSynthesis;
  return _speechAvailable;
}

// ============================================================
// WEB SPEECH API - Advanced Voice Loader
// ============================================================
function getVoicesSync(): SpeechSynthesisVoice[] {
  if (!window.speechSynthesis) return [];
  return window.speechSynthesis.getVoices();
}

function findBestVoice(voices: SpeechSynthesisVoice[], langPrefix: string): SpeechSynthesisVoice | null {
  // 1. Local service voice for exact language
  const local = voices.find((v) => v.lang.startsWith(langPrefix) && v.localService);
  if (local) return local;

  // 2. Any voice for the language
  const any = voices.find((v) => v.lang.startsWith(langPrefix));
  if (any) return any;

  // 3. Broader match
  if (langPrefix === 'it') {
    return voices.find((v) => v.lang.includes('it')) || null;
  }
  if (langPrefix === 'ar') {
    return voices.find((v) => v.lang.includes('ar')) || null;
  }

  return null;
}

// Chrome bug fix: speechSynthesis pauses after ~15 seconds on Android
// Solution: speak a tiny silent utterance to keep it alive
let _keepAliveInterval: ReturnType<typeof setInterval> | null = null;

function startKeepAlive() {
  if (_keepAliveInterval || typeof window === 'undefined' || !window.speechSynthesis) return;
  _keepAliveInterval = setInterval(() => {
    try {
      if (window.speechSynthesis.speaking) return;
      const u = new SpeechSynthesisUtterance('');
      u.volume = 0;
      u.rate = 10;
      window.speechSynthesis.speak(u);
    } catch (e) {
      // Ignore errors from keep-alive
    }
  }, 14000);
}

// ============================================================
// WEB SPEECH API - Speak
// ============================================================
function speakNative(text: string, lang: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (!window.speechSynthesis) {
      resolve(false);
      return;
    }

    // Chrome bug fix: cancel and resume
    window.speechSynthesis.cancel();
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }

    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    u.rate = 0.85;
    u.volume = 1;
    u.pitch = 1;

    const voices = getVoicesSync();
    if (voices.length > 0) {
      const voice = findBestVoice(voices, lang.startsWith('it') ? 'it' : 'ar');
      if (voice) {
        u.voice = voice;
        u.lang = voice.lang;
      }
    }

    let finished = false;

    u.onstart = () => {
      finished = false;
    };

    u.onend = () => {
      finished = true;
      _utt = null;
      resolve(true);
    };

    u.onerror = (e) => {
      if (!finished) {
        finished = true;
        _utt = null;
        console.warn('[TTS] Native speech error:', e.error, 'for lang:', lang);
        resolve(false);
      }
    };

    // Timeout: if speech doesn't start within 3 seconds, reject
    setTimeout(() => {
      if (!finished) {
        finished = true;
        _utt = null;
        window.speechSynthesis.cancel();
        resolve(false);
      }
    }, 3000);

    _utt = u;
    window.speechSynthesis.speak(u);
  });
}

// ============================================================
// GOOGLE TTS API FALLBACK - Speak via server proxy
// ============================================================
async function speakFallback(text: string, lang: string): Promise<boolean> {
  try {
    stopFallbackAudio();

    const langCode = lang.startsWith('ar') ? 'ar' : 'it';
    const maxLen = 200;
    const trimmed = text.trim().substring(0, maxLen);

    const audioUrl = `/api/tts?text=${encodeURIComponent(trimmed)}&lang=${langCode}`;

    const audio = new Audio();
    audio.volume = 1;
    audio.preload = 'auto';

    return new Promise((resolve) => {
      let finished = false;

      audio.oncanplaythrough = () => {
        audio.play().then(() => {
          // Playing successfully
        }).catch((err) => {
          console.warn('[TTS] Audio play error:', err.message);
          if (!finished) {
            finished = true;
            resolve(false);
          }
        });
      };

      audio.onended = () => {
        finished = true;
        _fallbackAudio = null;
        resolve(true);
      };

      audio.onerror = () => {
        if (!finished) {
          finished = true;
          _fallbackAudio = null;
          console.warn('[TTS] Audio load error');
          resolve(false);
        }
      };

      // Timeout: if audio doesn't load within 8 seconds, reject
      setTimeout(() => {
        if (!finished) {
          finished = true;
          audio.pause();
          _fallbackAudio = null;
          resolve(false);
        }
      }, 8000);

      audio.src = audioUrl;
      _fallbackAudio = audio;
    });
  } catch (e: any) {
    console.warn('[TTS] Fallback error:', e.message);
    return false;
  }
}

function stopFallbackAudio() {
  if (_fallbackAudio) {
    try {
      _fallbackAudio.pause();
      _fallbackAudio.currentTime = 0;
      _fallbackAudio.src = '';
    } catch (e) {
      // Ignore
    }
    _fallbackAudio = null;
  }
}

// ============================================================
// PUBLIC API - speakText (main function)
// ============================================================
export async function speakText(text: string, lang = 'it-IT'): Promise<void> {
  if (typeof window === 'undefined') return;

  // 1. Try native Web Speech API first
  if (isSpeechSupported()) {
    startKeepAlive();
    const success = await speakNative(text, lang);
    if (success) return;

    // Native failed, try fallback
    console.log('[TTS] Native speech failed, trying fallback...');
  }

  // 2. Fall back to Google TTS API
  const fallbackSuccess = await speakFallback(text, lang);
  if (fallbackSuccess) return;

  // 3. Both failed - try one more time with native using default voice
  if (isSpeechSupported()) {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    u.rate = 0.85;
    u.onerror = () => {};
    _utt = u;
    window.speechSynthesis.speak(u);
  }
}

// ============================================================
// PUBLIC API - stopSpeech
// ============================================================
export function stopSpeech(): void {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    try {
      window.speechSynthesis.cancel();
    } catch (e) {
      // Ignore
    }
  }
  _utt = null;
  stopFallbackAudio();
}

// ============================================================
// PUBLIC API - preloadVoices (called on app start)
// ============================================================
export async function preloadVoices(): Promise<void> {
  if (typeof window === 'undefined') return;

  // Try Web Speech API voices
  if (window.speechSynthesis) {
    // Immediate check
    const voices = getVoicesSync();
    if (voices.length > 0) {
      _speechAvailable = true;
      console.log('[TTS] Voices loaded:', voices.length);
      logAvailableVoices(voices);
    } else {
      // Wait for async loading (Chrome)
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => {
          const v = getVoicesSync();
          if (v.length > 0) {
            _speechAvailable = true;
            console.log('[TTS] Voices loaded (async):', v.length);
            logAvailableVoices(v);
          }
        };
      }
    }

    // Test if speech actually works
    startKeepAlive();
  }
}

function logAvailableVoices(voices: SpeechSynthesisVoice[]) {
  const itVoices = voices.filter((v) => v.lang.startsWith('it'));
  const arVoices = voices.filter((v) => v.lang.startsWith('ar'));
  if (itVoices.length > 0) {
    console.log('[TTS] Italian:', itVoices.map((v) => `${v.name} (${v.lang}, ${v.localService ? 'local' : 'remote'})`));
  } else {
    console.log('[TTS] No Italian voices - will use fallback API');
  }
  if (arVoices.length > 0) {
    console.log('[TTS] Arabic:', arVoices.map((v) => `${v.name} (${v.lang}, ${v.localService ? 'local' : 'remote'})`));
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
// PUBLIC API - hasVoiceForLang
// ============================================================
export function hasVoiceForLang(lang: 'it' | 'ar'): boolean {
  if (!isSpeechSupported()) return false;
  const voices = getVoicesSync();
  return voices.some((v) => v.lang.startsWith(lang));
}

// ============================================================
// PUBLIC API - getAvailableVoices
// ============================================================
export function getAvailableVoices(): { lang: string; name: string; local: boolean }[] {
  if (!isSpeechSupported()) return [];
  return getVoicesSync().map((v) => ({
    lang: v.lang,
    name: v.name,
    local: v.localService,
  }));
}
