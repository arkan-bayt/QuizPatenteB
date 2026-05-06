// ============================================================
// LOGIC - Text-to-Speech Engine v4 (FIXED)
// ============================================================
// PRIMARY: Google TTS via server proxy (/api/tts) — no 15s limit
// FALLBACK: Web Speech API with 100-char chunks + keepAlive
//
// v3 bug fix: Chrome kills Web Speech after ~15s. Switched to
// Google TTS as primary engine to avoid this entirely.
// Also fixed: `_speechGeneration !== _speechGeneration` (always false)
// ============================================================

let _speaking = false;
let _fallbackAudio: HTMLAudioElement | null = null;
let _webSpeechAvailable: boolean | null = null;
let _speechGeneration = 0;

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
  _speechGeneration++;
  _speaking = false;

  if (typeof window !== 'undefined' && window.speechSynthesis) {
    try { window.speechSynthesis.cancel(); } catch (e) { /* ignore */ }
  }

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
// HELPER: Sleep for N milliseconds
// ============================================================
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ============================================================
// HELPER: Pick best voice for language
// ============================================================
function pickVoice(langCode: string): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !window.speechSynthesis) return null;

  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  const langPrefix = langCode.split('-')[0];
  const langVoices = voices.filter(v => v.lang.startsWith(langPrefix));
  if (langVoices.length === 0) return null;

  // Prefer local voices (offline, more reliable, no network delay)
  const localVoices = langVoices.filter(v => v.localService);
  if (localVoices.length > 0) return localVoices[0];

  return langVoices[0];
}

// ============================================================
// Split text into short chunks safe for Chrome's 15s limit
// Max ~100 chars per chunk ≈ 8-10 seconds of speech at rate 1.0
// ============================================================
function splitIntoSafeChunks(text: string, maxLen = 100): string[] {
  // First split by sentences
  const sentences = text.split(/(?<=[.!?;:,\n])\s+/);
  const chunks: string[] = [];
  let current = '';

  for (const s of sentences) {
    const trimmed = s.trim();
    if (!trimmed) continue;

    if ((current + ' ' + trimmed).length > maxLen) {
      if (current.trim()) chunks.push(current.trim());
      current = trimmed;
    } else {
      current = current ? current + ' ' + trimmed : trimmed;
    }
  }
  if (current.trim()) chunks.push(current.trim());

  // Handle case where a single sentence is too long (split by commas)
  const finalChunks: string[] = [];
  for (const chunk of chunks) {
    if (chunk.length > maxLen) {
      // Split by spaces, keeping under maxLen
      const words = chunk.split(' ');
      let sub = '';
      for (const w of words) {
        if ((sub + ' ' + w).length > maxLen) {
          if (sub.trim()) finalChunks.push(sub.trim());
          sub = w;
        } else {
          sub = sub ? sub + ' ' + w : w;
        }
      }
      if (sub.trim()) finalChunks.push(sub.trim());
    } else {
      finalChunks.push(chunk);
    }
  }

  return finalChunks;
}

// ============================================================
// Speak ONE short chunk via Web Speech API
// Returns true if spoke successfully, false if failed/cancelled
// ============================================================
function speakOneChunk(text: string, langCode: string, voice: SpeechSynthesisVoice | null, generation: number): Promise<boolean> {
  return new Promise((resolve) => {
    if (generation !== _speechGeneration) { resolve(false); return; }

    // CRITICAL: Cancel any existing speech BEFORE starting new one
    // This resets Chrome's internal 15-second timer
    try { window.speechSynthesis.cancel(); } catch (e) { /* ignore */ }

    const utterance = new SpeechSynthesisUtterance(text.trim());
    utterance.rate = 1.0; // Normal speed = shorter duration = less likely to hit 15s limit
    utterance.pitch = 1;
    utterance.volume = 1;
    utterance.lang = langCode;

    if (voice) utterance.voice = voice;

    let resolved = false;
    const finish = (success: boolean) => {
      if (!resolved) {
        resolved = true;
        clearInterval(keepAlive);
        clearTimeout(timeoutId);
        resolve(success);
      }
    };

    utterance.onend = () => finish(true);
    utterance.onerror = (e) => {
      // "interrupted" or "canceled" errors are normal when stopping
      const errMsg = (e.error as string) || '';
      if (errMsg === 'interrupted' || errMsg === 'canceled' || errMsg === 'interrupted-by-user') {
        finish(false);
      } else {
        finish(true); // Other errors still count as "spoke something"
      }
    };

    // AGGRESSIVE keepAlive: every 2 seconds (Chrome pauses after ~15s)
    // Calling resume() prevents Chrome from killing the speech
    const keepAlive = setInterval(() => {
      if (generation !== _speechGeneration) {
        clearInterval(keepAlive);
        return;
      }
      if (window.speechSynthesis) {
        try {
          if (window.speechSynthesis.speaking) {
            window.speechSynthesis.resume();
          }
        } catch (e) { /* ignore */ }
      }
    }, 2000);

    // Safety timeout: 15 seconds (matches Chrome's limit)
    const timeoutId = setTimeout(() => {
      if (!resolved) {
        try { window.speechSynthesis.cancel(); } catch (e) { /* ignore */ }
        finish(true); // Assume it spoke something before timing out
      }
    }, 15000);

    try {
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      clearInterval(keepAlive);
      finish(false);
    }
  });
}

// ============================================================
// Speak via Google TTS proxy (server-side)
// Fallback when Web Speech API is unavailable
// ============================================================
function speakGoogleTTSChunk(text: string, langCode: string, generation: number): Promise<boolean> {
  return new Promise((resolve) => {
    if (generation !== _speechGeneration) { resolve(false); return; }

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
        clearTimeout(timeoutId);
        _fallbackAudio = null;
        resolve(success);
      }
    };

    audio.onended = () => finish(true);
    audio.onerror = () => finish(false);
    audio.oncanplaythrough = () => {
      if (generation !== _speechGeneration) { finish(false); return; }
      audio.play().catch(() => finish(false));
    };

    const timeoutId = setTimeout(() => {
      if (!resolved) {
        try { audio.pause(); } catch (e) { /* ignore */ }
        finish(false);
      }
    }, 12000);

    audio.src = audioUrl;
    _fallbackAudio = audio;
  });
}

// ============================================================
// PUBLIC API - speakText (short text, single utterance)
// ============================================================
export async function speakText(text: string, lang = 'it-IT'): Promise<void> {
  if (typeof window === 'undefined') return;
  if (!text || text.trim().length === 0) return;

  const langCode = lang.startsWith('ar') ? 'ar' : 'it';

  stopSpeech();
  const myGeneration = ++_speechGeneration;

  if (isWebSpeechAvailable()) {
    const speechLangCode = lang.startsWith('ar') ? 'ar-SA' : 'it-IT';
    const voice = pickVoice(speechLangCode);
    const success = await speakOneChunk(text.trim().substring(0, 200), speechLangCode, voice, myGeneration);
    if (success && myGeneration === _speechGeneration) return;
  }

  if (myGeneration === _speechGeneration) {
    await speakGoogleTTSChunk(text.trim(), langCode, myGeneration);
  }
}

// ============================================================
// PUBLIC API - speakWord (single word)
// ============================================================
export async function speakWord(word: string, lang: 'it' | 'ar' = 'it'): Promise<void> {
  if (typeof window === 'undefined') return;
  if (!word || word.trim().length === 0) return;

  const langCode = lang === 'ar' ? 'ar' : 'it';

  stopSpeech();
  const myGeneration = ++_speechGeneration;

  if (isWebSpeechAvailable()) {
    const speechLangCode = lang === 'ar' ? 'ar-SA' : 'it-IT';
    const voice = pickVoice(speechLangCode);
    const success = await speakOneChunk(word.trim(), speechLangCode, voice, myGeneration);
    if (success && myGeneration === _speechGeneration) return;
  }

  if (myGeneration === _speechGeneration) {
    await speakGoogleTTSChunk(word.trim(), langCode, myGeneration);
  }
}

// ============================================================
// PUBLIC API - speakContinuous
// Plays long text in sequential chunks.
// PRIMARY: Google TTS via server proxy (no 15s limit)
// FALLBACK: Web Speech API with 100-char chunks
// ============================================================
export async function speakContinuous(
  text: string,
  lang = 'it-IT',
  cancelToken?: { cancelled: boolean }
): Promise<void> {
  if (typeof window === 'undefined') return;
  if (!text || text.trim().length === 0) return;

  const langCode = lang.startsWith('ar') ? 'ar' : 'it';
  const speechLangCode = lang.startsWith('ar') ? 'ar-SA' : 'it-IT';

  // Cancel any existing speech
  stopSpeech();
  _speaking = true;

  // Split into SHORT chunks (max 100 chars to stay well under Chrome's 15s limit)
  const chunks = splitIntoSafeChunks(text, 100);

  if (chunks.length === 0) {
    _speaking = false;
    return;
  }

  // --- PRIMARY: Google TTS via server proxy (reliable, no 15s limit) ---
  const myGen = _speechGeneration;
  const googleChunks = splitIntoSafeChunks(text, 200);
  let anyPlayed = false;

  for (let i = 0; i < googleChunks.length; i++) {
    if (cancelToken?.cancelled || myGen !== _speechGeneration) break;

    const chunk = googleChunks[i];
    if (!chunk) continue;

    const played = await speakGoogleTTSChunk(chunk, langCode, _speechGeneration);

    if (cancelToken?.cancelled) break;

    if (played) {
      anyPlayed = true;
      // Small delay between Google TTS chunks
      if (i < googleChunks.length - 1) {
        await sleep(200);
      }
    }
    // If Google TTS fails for a chunk, try next chunk (don't bail immediately)
  }

  // Google TTS succeeded for at least one chunk
  if (anyPlayed && !cancelToken?.cancelled && myGen === _speechGeneration) {
    _speaking = false;
    return;
  }

  // --- FALLBACK: Web Speech API ---
  if (cancelToken?.cancelled || myGen !== _speechGeneration) {
    _speaking = false;
    return;
  }

  if (isWebSpeechAvailable()) {
    let voice = pickVoice(speechLangCode);
    if (!voice) {
      window.speechSynthesis.getVoices();
      await sleep(200);
      voice = pickVoice(speechLangCode);
    }

    for (let i = 0; i < chunks.length; i++) {
      if (cancelToken?.cancelled || myGen !== _speechGeneration) break;

      const chunk = chunks[i];
      if (!chunk) continue;

      const success = await speakOneChunk(chunk, speechLangCode, voice, myGen);

      if (cancelToken?.cancelled || myGen !== _speechGeneration) break;

      if (!success) break;

      if (i < chunks.length - 1) {
        await sleep(300);
      }
    }
  }

  _speaking = false;
  _fallbackAudio = null;
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
