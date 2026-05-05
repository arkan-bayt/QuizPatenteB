// ============================================================
// LOGIC - Text-to-Speech (HYBRID Engine)
// Primary: Web Speech API (free, browser-native)
// Fallback: Google TTS via server proxy (universal compatibility)
// Automatically falls back if Web Speech API is not available
// ============================================================

let _speaking = false;
let _fallbackAudio: HTMLAudioElement | null = null;
let _webSpeechAvailable: boolean | null = null;

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
// STOP SPEECH (both engines)
// ============================================================
export function stopSpeech(): void {
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
// ============================================================
function speakWebSpeech(text: string, langCode: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (!isWebSpeechAvailable()) { resolve(false); return; }

    stopSpeech();

    const utterance = new SpeechSynthesisUtterance(text.trim().substring(0, 500));
    utterance.rate = 0.85;
    utterance.pitch = 1;
    utterance.volume = 1;

    // Map language codes
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
        _speaking = false;
        resolve(success);
      }
    };

    utterance.onend = () => finish(true);
    utterance.onerror = () => finish(false);

    // Timeout: if speech doesn't start within 5 seconds
    setTimeout(() => {
      if (!resolved) {
        try { window.speechSynthesis.cancel(); } catch (e) { /* ignore */ }
        finish(false);
      }
    }, 5000);

    try {
      window.speechSynthesis.speak(utterance);
      _speaking = true;
    } catch (e) {
      finish(false);
    }
  });
}

// ============================================================
// SPEAK via Google TTS fallback (server proxy)
// ============================================================
function speakGoogleTTS(text: string, langCode: string): Promise<boolean> {
  return new Promise((resolve) => {
    stopSpeech();

    const trimmed = text.trim().substring(0, 200);
    const audioUrl = `/api/tts?text=${encodeURIComponent(trimmed)}&lang=${langCode}`;

    const audio = new Audio();
    audio.volume = 1;
    audio.preload = 'auto';

    let resolved = false;

    const finish = (success: boolean) => {
      if (!resolved) {
        resolved = true;
        _speaking = false;
        _fallbackAudio = null;
        resolve(success);
      }
    };

    audio.onended = () => finish(true);
    audio.onerror = () => finish(false);
    audio.oncanplaythrough = () => {
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
// Tries Web Speech API first, falls back to Google TTS
// ============================================================
export async function speakText(text: string, lang = 'it-IT'): Promise<void> {
  if (typeof window === 'undefined') return;
  if (!text || text.trim().length === 0) return;

  const langCode = lang.startsWith('ar') ? 'ar' : 'it';

  // Try Web Speech API first (free, offline)
  if (isWebSpeechAvailable()) {
    const success = await speakWebSpeech(text, langCode);
    if (success) return;
  }

  // Fallback to Google TTS server proxy
  await speakGoogleTTS(text, langCode);
}

// ============================================================
// PUBLIC API - speakWord
// ============================================================
export async function speakWord(word: string, lang: 'it' | 'ar' = 'it'): Promise<void> {
  if (typeof window === 'undefined') return;
  if (!word || word.trim().length === 0) return;

  const langCode = lang === 'ar' ? 'ar' : 'it';

  // Try Web Speech API first
  if (isWebSpeechAvailable()) {
    const success = await speakWebSpeech(word.trim(), langCode);
    if (success) return;
  }

  // Fallback to Google TTS
  await speakGoogleTTS(word.trim(), langCode);
}

// ============================================================
// PUBLIC API - isSpeaking
// ============================================================
export function isSpeaking(): boolean {
  return _speaking;
}

// ============================================================
// PUBLIC API - preloadVoices
// Preloads Web Speech API voices for faster first use
// ============================================================
export function preloadVoices(): void {
  if (typeof window === 'undefined') return;
  if (window.speechSynthesis) {
    // Loading voices triggers async voice list population
    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.getVoices();
    };
  }
}

// ============================================================
// PUBLIC API - hasVoiceForLang
// Checks if a voice is available for the given language
// ============================================================
export function hasVoiceForLang(lang: 'it' | 'ar'): boolean {
  if (typeof window === 'undefined') return false;

  // If Web Speech API available, check for voices
  if (isWebSpeechAvailable() && window.speechSynthesis) {
    const voices = window.speechSynthesis.getVoices();
    const langPrefix = lang === 'ar' ? 'ar' : 'it';
    if (voices.some(v => v.lang.startsWith(langPrefix))) return true;
  }

  // Google TTS fallback supports all languages
  return true;
}

// Type declarations for Web Speech API are built-in
