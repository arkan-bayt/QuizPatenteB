// ============================================================
// LOGIC - Text-to-Speech (Improved)
// Supports Italian and Arabic pronunciation
// Fixed: async voice loading, cross-device compatibility
// ============================================================
let _utt: SpeechSynthesisUtterance | null = null;
let _voicesLoaded = false;
let _cachedVoices: SpeechSynthesisVoice[] = [];

// ============================================================
// VOICE LOADING (handles Chrome async bug)
// ============================================================
function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      resolve([]);
      return;
    }

    const tryGet = () => {
      const voices = window.speechSynthesis!.getVoices();
      if (voices.length > 0) {
        _cachedVoices = voices;
        _voicesLoaded = true;
        resolve(voices);
        return true;
      }
      return false;
    };

    // Try immediately
    if (tryGet()) return;

    // Try after a short delay (Chrome loads voices async)
    if (window.speechSynthesis!.onvoiceschanged !== undefined) {
      window.speechSynthesis!.onvoiceschanged = () => {
        tryGet();
      };
    }

    // Fallback: try multiple times with increasing delay
    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      if (tryGet() || attempts > 20) {
        clearInterval(interval);
        resolve(_cachedVoices);
      }
    }, 100);
  });
}

// ============================================================
// FIND BEST VOICE
// ============================================================
function findVoice(voices: SpeechSynthesisVoice[], langPrefix: string): SpeechSynthesisVoice | null {
  // 1. Prefer local service voice for the exact language
  const local = voices.find((v) => v.lang.startsWith(langPrefix) && v.localService);
  if (local) return local;

  // 2. Any voice for the language (including remote/cloud)
  const any = voices.find((v) => v.lang.startsWith(langPrefix));
  if (any) return any;

  // 3. For Italian, try broader match (it vs it-IT, it-CH etc.)
  if (langPrefix === 'it') {
    const broader = voices.find((v) => v.lang.includes('it'));
    if (broader) return broader;
  }

  // 4. For Arabic, try broader match
  if (langPrefix === 'ar') {
    const broader = voices.find((v) => v.lang.includes('ar'));
    if (broader) return broader;
  }

  return null;
}

// ============================================================
// SPEAK TEXT
// ============================================================
export function speakText(text: string, lang = 'it-IT'): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;

  stopSpeech();

  // Chrome bug: need to resume if paused
  if (window.speechSynthesis.paused) {
    window.speechSynthesis.resume();
  }

  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang;
  u.rate = 0.9;
  u.volume = 1;
  u.pitch = 1;

  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) {
    const v = findVoice(voices, 'it');
    if (v) u.voice = v;
  }

  u.onerror = (e) => {
    console.warn('[TTS] Speech error:', e.error);
  };

  _utt = u;
  window.speechSynthesis.speak(u);
}

// ============================================================
// STOP SPEECH
// ============================================================
export function stopSpeech(): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  try {
    window.speechSynthesis.cancel();
  } catch (e) {
    // Ignore cancel errors
  }
  _utt = null;
}

// ============================================================
// PRELOAD VOICES
// ============================================================
export async function preloadVoices(): Promise<void> {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;

  const voices = await loadVoices();
  if (voices.length > 0) {
    console.log('[TTS] Loaded', voices.length, 'voices');

    // Log available Italian and Arabic voices
    const itVoices = voices.filter((v) => v.lang.startsWith('it'));
    const arVoices = voices.filter((v) => v.lang.startsWith('ar'));
    if (itVoices.length > 0) {
      console.log('[TTS] Italian voices:', itVoices.map((v) => `${v.name} (${v.lang})`));
    }
    if (arVoices.length > 0) {
      console.log('[TTS] Arabic voices:', arVoices.map((v) => `${v.name} (${v.lang})`));
    }
  } else {
    console.log('[TTS] No voices available on this device');
  }
}

// ============================================================
// SPEAK A SINGLE WORD (Italian or Arabic)
// ============================================================
export function speakWord(word: string, lang: 'it' | 'ar' = 'it'): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  if (!word || word.trim().length === 0) return;

  stopSpeech();

  // Chrome bug fix: resume if paused
  if (window.speechSynthesis.paused) {
    window.speechSynthesis.resume();
  }

  const u = new SpeechSynthesisUtterance(word.trim());
  u.rate = 0.75;
  u.volume = 1;
  u.pitch = 1;

  const voices = window.speechSynthesis.getVoices();

  if (lang === 'ar') {
    u.lang = 'ar-SA';
    const arVoice = findVoice(voices, 'ar');
    if (arVoice) {
      u.voice = arVoice;
      u.lang = arVoice.lang; // Use the actual voice language
    }
  } else {
    u.lang = 'it-IT';
    const itVoice = findVoice(voices, 'it');
    if (itVoice) {
      u.voice = itVoice;
      u.lang = itVoice.lang;
    }
  }

  u.onerror = (e) => {
    console.warn('[TTS] Speech error:', e.error);
  };

  _utt = u;
  window.speechSynthesis.speak(u);
}

// ============================================================
// CHECK IF VOICE AVAILABLE
// ============================================================
export function hasVoiceForLang(lang: 'it' | 'ar'): boolean {
  if (typeof window === 'undefined' || !window.speechSynthesis) return false;
  const voices = window.speechSynthesis.getVoices();
  return voices.some((v) => v.lang.startsWith(lang));
}

// ============================================================
// GET ALL AVAILABLE VOICES (for debugging)
// ============================================================
export function getAvailableVoices(): { lang: string; name: string; local: boolean }[] {
  if (typeof window === 'undefined' || !window.speechSynthesis) return [];
  return window.speechSynthesis.getVoices().map((v) => ({
    lang: v.lang,
    name: v.name,
    local: v.localService,
  }));
}
