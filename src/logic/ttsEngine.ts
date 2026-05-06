// ============================================================
// LOGIC - Text-to-Speech (HYBRID Engine with Anti-Overlap Lock)
// Primary: Web Speech API (free, browser-native)
// Fallback: Google TTS via server proxy (universal compatibility)
// ============================================================

let _speaking = false;
let _fallbackAudio: HTMLAudioElement | null = null;
let _webSpeechAvailable: boolean | null = null;
let _speechGeneration = 0; // Anti-overlap: increment on each new speech request

// ============================================================
// CHECK WEB SPEECH API AVAILABILITY
// ============================================================
function isWebSpeechAvailable(): boolean {
  if (_webSpeechAvailable !== null) return _webSpeechAvailable;
  if (typeof window === 'undefined') { _webSpeechAvailable = false; return false; }
  _webSpeechAvailable = !!(window.speechSynthesis && typeof window.speechSynthesis.speak === 'function');
  return _webSpeechAvailable;
}

// ============================================================
// STOP SPEECH (both engines + kill generation)
// ============================================================
export function stopSpeech(): void {
  // Increment generation to invalidate any pending speech
  _speechGeneration++;

  _speaking = false;

  // Stop Web Speech API
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    try { window.speechSynthesis.cancel(); } catch (e) { /* ignore */ }
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
// SPEAK via Web Speech API (primary - free, no network needed)
// Uses generation counter to prevent overlap
// ============================================================
function speakWebSpeech(text: string, langCode: string, generation: number): Promise<boolean> {
  return new Promise((resolve) => {
    // If generation changed, another speech started — abort
    if (generation !== _speechGeneration) { resolve(false); return; }
    if (!isWebSpeechAvailable()) { resolve(false); return; }

    // Cancel any existing speech
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      try { window.speechSynthesis.cancel(); } catch (e) { /* ignore */ }
    }

    const utterance = new SpeechSynthesisUtterance(text.trim().substring(0, 500));
    utterance.rate = 0.85;
    utterance.pitch = 1;
    utterance.volume = 1;

    const langMap: Record<string, string> = {
      'it': 'it-IT',
      'ar': 'ar-SA',
      'it-IT': 'it-IT',
      'ar-SA': 'ar-SA',
    };
    utterance.lang = langMap[langCode] || langCode;

    let resolved = false;
    const finish = (success: boolean) => {
      if (!resolved) {
        resolved = true;
        if (generation === _speechGeneration) _speaking = false;
        resolve(success);
      }
    };

    utterance.onend = () => finish(true);
    utterance.onerror = () => finish(false);

    // Chrome bug workaround: speechSynthesis pauses after ~15 seconds
    // Resume periodically to prevent freezing
    const keepAlive = setInterval(() => {
      if (generation !== _speechGeneration) {
        clearInterval(keepAlive);
        return;
      }
      if (window.speechSynthesis && window.speechSynthesis.speaking) {
        try { window.speechSynthesis.resume(); } catch (e) { /* ignore */ }
      }
    }, 8000);

    // Timeout: if speech doesn't start within 30 seconds
    setTimeout(() => {
      clearInterval(keepAlive);
      if (!resolved) {
        try { window.speechSynthesis.cancel(); } catch (e) { /* ignore */ }
        finish(false);
      }
    }, 30000);

    try {
      window.speechSynthesis.speak(utterance);
      _speaking = true;
    } catch (e) {
      clearInterval(keepAlive);
      finish(false);
    }
  });
}

// ============================================================
// SPEAK via Google TTS fallback (server proxy)
// Uses generation counter to prevent overlap
// ============================================================
function speakGoogleTTS(text: string, langCode: string, generation: number): Promise<boolean> {
  return new Promise((resolve) => {
    // If generation changed, another speech started — abort
    if (generation !== _speechGeneration) { resolve(false); return; }

    // Cancel any existing audio
    if (_fallbackAudio) {
      try {
        _fallbackAudio.pause();
        _fallbackAudio.currentTime = 0;
        _fallbackAudio.src = '';
      } catch (e) { /* ignore */ }
      _fallbackAudio = null;
    }

    const trimmed = text.trim().substring(0, 200);
    const audioUrl = `/api/tts?text=${encodeURIComponent(trimmed)}&lang=${langCode}`;

    const audio = new Audio();
    audio.volume = 1;
    audio.preload = 'auto';

    let resolved = false;

    const finish = (success: boolean) => {
      if (!resolved) {
        resolved = true;
        if (generation === _speechGeneration) {
          _speaking = false;
          _fallbackAudio = null;
        }
        resolve(success);
      }
    };

    audio.onended = () => finish(true);
    audio.onerror = () => finish(false);
    audio.oncanplaythrough = () => {
      if (generation !== _speechGeneration) { finish(false); return; }
      audio.play().catch(() => finish(false));
    };

    // Timeout: 12 seconds
    setTimeout(() => {
      if (!resolved) {
        try { audio.pause(); } catch (e) { /* ignore */ }
        finish(false);
      }
    }, 12000);

    audio.src = audioUrl;
    _fallbackAudio = audio;
    _speaking = true;
  });
}

// ============================================================
// PUBLIC API - speakText
// Stops any current speech before starting new one
// Uses generation counter to guarantee no overlap
// ============================================================
export async function speakText(text: string, lang = 'it-IT'): Promise<void> {
  if (typeof window === 'undefined') return;
  if (!text || text.trim().length === 0) return;

  const langCode = lang.startsWith('ar') ? 'ar' : 'it';

  // STOP any current speech and get new generation
  stopSpeech();
  const myGeneration = ++_speechGeneration;

  // Try Web Speech API first (free, offline)
  if (isWebSpeechAvailable()) {
    const success = await speakWebSpeech(text, langCode, myGeneration);
    if (success && myGeneration === _speechGeneration) return;
  }

  // If Web Speech failed or was cancelled, try Google TTS
  if (myGeneration === _speechGeneration) {
    await speakGoogleTTS(text, langCode, myGeneration);
  }
}

// ============================================================
// PUBLIC API - speakWord
// ============================================================
export async function speakWord(word: string, lang: 'it' | 'ar' = 'it'): Promise<void> {
  if (typeof window === 'undefined') return;
  if (!word || word.trim().length === 0) return;

  const langCode = lang === 'ar' ? 'ar' : 'it';

  // STOP any current speech and get new generation
  stopSpeech();
  const myGeneration = ++_speechGeneration;

  // Try Web Speech API first
  if (isWebSpeechAvailable()) {
    const success = await speakWebSpeech(word.trim(), langCode, myGeneration);
    if (success && myGeneration === _speechGeneration) return;
  }

  // If Web Speech failed or was cancelled, try Google TTS
  if (myGeneration === _speechGeneration) {
    await speakGoogleTTS(word.trim(), langCode, myGeneration);
  }
}

// ============================================================
// PUBLIC API - speakContinuous
// Plays long text in sequential chunks using ONLY Web Speech API
// No fallback to Google TTS (prevents voice switching)
// Does NOT call stopSpeech between chunks
// ============================================================
export async function speakContinuous(
  text: string, 
  lang = 'it-IT',
  cancelToken?: { cancelled: boolean }
): Promise<void> {
  if (typeof window === 'undefined') return;
  if (!text || text.trim().length === 0) return;
  if (!isWebSpeechAvailable()) return;

  const langCode = lang.startsWith('ar') ? 'ar-SA' : 'it-IT';

  // Cancel any existing speech before starting
  stopSpeech();

  // Split into chunks at sentence boundaries
  const sentences = text.split(/(?<=[.!?])\s+/);
  const chunks: string[] = [];
  let current = '';
  for (const s of sentences) {
    if ((current + ' ' + s).length > 450) {
      if (current) chunks.push(current.trim());
      current = s;
    } else {
      current = current ? current + ' ' + s : s;
    }
  }
  if (current.trim()) chunks.push(current.trim());

  for (const chunk of chunks) {
    if (cancelToken?.cancelled) break;

    await new Promise<void>((resolve) => {
      if (cancelToken?.cancelled) { resolve(); return; }

      const utterance = new SpeechSynthesisUtterance(chunk.trim().substring(0, 500));
      utterance.rate = 0.85;
      utterance.pitch = 1;
      utterance.volume = 1;
      utterance.lang = langCode;

      let resolved = false;
      const finish = () => {
        if (!resolved) {
          resolved = true;
          resolve();
        }
      };

      utterance.onend = finish;
      utterance.onerror = finish;

      // Chrome keepAlive: resume every 8 seconds
      const keepAlive = setInterval(() => {
        if (cancelToken?.cancelled) {
          clearInterval(keepAlive);
          finish();
          return;
        }
        if (window.speechSynthesis && window.speechSynthesis.speaking) {
          try { window.speechSynthesis.resume(); } catch (e) { /* ignore */ }
        }
      }, 8000);

      // 30-second timeout per chunk
      setTimeout(() => {
        clearInterval(keepAlive);
        if (!resolved) {
          try { window.speechSynthesis.cancel(); } catch (e) { /* ignore */ }
          finish();
        }
      }, 30000);

      try {
        window.speechSynthesis.speak(utterance);
      } catch (e) {
        clearInterval(keepAlive);
        finish();
      }
    });
  }
}

// ============================================================
// PUBLIC API - isSpeaking
// ============================================================
export function isSpeaking(): boolean {
  return _speaking;
}

// ============================================================
// PUBLIC API - preloadVoices
// ============================================================
export function preloadVoices(): void {
  if (typeof window === 'undefined') return;
  if (window.speechSynthesis) {
    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.getVoices();
    };
  }
}

// ============================================================
// PUBLIC API - hasVoiceForLang
// ============================================================
export function hasVoiceForLang(lang: 'it' | 'ar'): boolean {
  if (typeof window === 'undefined') return false;

  if (isWebSpeechAvailable() && window.speechSynthesis) {
    const voices = window.speechSynthesis.getVoices();
    const langPrefix = lang === 'ar' ? 'ar' : 'it';
    if (voices.some(v => v.lang.startsWith(langPrefix))) return true;
  }

  return true;
}
