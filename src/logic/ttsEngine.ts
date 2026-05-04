// ============================================================
// LOGIC - Text-to-Speech (ONE Voice Engine)
// Uses ONLY Google TTS via server proxy.
// Works on ALL devices and browsers (Chrome, Safari, Firefox, iOS, Android)
// NO Web Speech API — no dual voices, no overlap.
// ============================================================

let _speaking = false;
let _audio: HTMLAudioElement | null = null;

// ============================================================
// STOP SPEECH
// ============================================================
export function stopSpeech(): void {
  _speaking = false;
  if (_audio) {
    try {
      _audio.pause();
      _audio.currentTime = 0;
      _audio.src = '';
    } catch (e) { /* ignore */ }
    _audio = null;
  }
}

// ============================================================
// SPEAK - using Google TTS via server proxy (universal)
// ============================================================
function playAudio(text: string, langCode: string): Promise<boolean> {
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
        _audio = null;
        resolve(success);
      }
    };

    audio.onended = () => finish(true);

    audio.onerror = () => {
      console.warn('[TTS] Audio error');
      finish(false);
    };

    audio.oncanplaythrough = () => {
      audio.play().catch(() => finish(false));
    };

    // Timeout: if audio doesn't start within 12 seconds
    setTimeout(() => {
      if (!resolved) {
        try { audio.pause(); } catch (e) { /* ignore */ }
        finish(false);
      }
    }, 12000);

    audio.src = audioUrl;
    _audio = audio;
    _speaking = true;
  });
}

// ============================================================
// PUBLIC API - speakText
// ============================================================
export async function speakText(text: string, lang = 'it-IT'): Promise<void> {
  if (typeof window === 'undefined') return;
  if (!text || text.trim().length === 0) return;

  const langCode = lang.startsWith('ar') ? 'ar' : 'it';
  await playAudio(text, langCode);
}

// ============================================================
// PUBLIC API - speakWord
// ============================================================
export async function speakWord(word: string, lang: 'it' | 'ar' = 'it'): Promise<void> {
  if (typeof window === 'undefined') return;
  if (!word || word.trim().length === 0) return;

  const langCode = lang === 'ar' ? 'ar' : 'it';
  await playAudio(word.trim(), langCode);
}

// ============================================================
// PUBLIC API - isSpeaking
// ============================================================
export function isSpeaking(): boolean {
  return _speaking;
}

// ============================================================
// PUBLIC API - preloadVoices (no-op, kept for compatibility)
// ============================================================
export function preloadVoices(): void {
  // No-op — Google TTS doesn't need voice preloading
}

// ============================================================
// PUBLIC API - hasVoiceForLang (always true — Google TTS supports all)
// ============================================================
export function hasVoiceForLang(_lang: 'it' | 'ar'): boolean {
  return true;
}
