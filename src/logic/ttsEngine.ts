// ============================================================
// LOGIC - Text-to-Speech
// Supports Italian and Arabic pronunciation
// ============================================================
let _utt: SpeechSynthesisUtterance | null = null;

export function speakText(text: string, lang = 'it-IT'): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  stopSpeech();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang; u.rate = 0.9;
  const v = window.speechSynthesis.getVoices().find((x) => x.lang.startsWith('it') && x.localService) || window.speechSynthesis.getVoices().find((x) => x.lang.startsWith('it'));
  if (v) u.voice = v;
  _utt = u;
  window.speechSynthesis.speak(u);
}

export function stopSpeech(): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  _utt = null;
}

export function preloadVoices(): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  window.speechSynthesis.getVoices();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
  }
}

/**
 * Speak a single word in Italian or Arabic
 * @param word - The word to pronounce
 * @param lang - 'it' for Italian, 'ar' for Arabic
 */
export function speakWord(word: string, lang: 'it' | 'ar' = 'it'): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  if (!word || word.trim().length === 0) return;
  stopSpeech();

  const u = new SpeechSynthesisUtterance(word.trim());
  u.rate = 0.75; // Slower for word pronunciation
  u.volume = 1;

  if (lang === 'ar') {
    u.lang = 'ar-SA'; // Modern Standard Arabic
    // Try to find an Arabic voice
    const voices = window.speechSynthesis.getVoices();
    const arVoice = voices.find((v) => v.lang.startsWith('ar') && v.localService)
      || voices.find((v) => v.lang.startsWith('ar'))
      || voices.find((v) => v.lang.includes('ar'));
    if (arVoice) u.voice = arVoice;
  } else {
    u.lang = 'it-IT';
    const voices = window.speechSynthesis.getVoices();
    const itVoice = voices.find((v) => v.lang.startsWith('it') && v.localService)
      || voices.find((v) => v.lang.startsWith('it'));
    if (itVoice) u.voice = itVoice;
  }

  _utt = u;
  window.speechSynthesis.speak(u);
}

/**
 * Check if a specific language voice is available
 */
export function hasVoiceForLang(lang: 'it' | 'ar'): boolean {
  if (typeof window === 'undefined' || !window.speechSynthesis) return false;
  const voices = window.speechSynthesis.getVoices();
  return voices.some((v) => v.lang.startsWith(lang));
}
