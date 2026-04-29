// ============================================================
// LOGIC - Text-to-Speech
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
