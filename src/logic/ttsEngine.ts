// ============================================================
// LOGIC LAYER - Text-to-Speech (Web Speech API)
// ============================================================

let currentUtterance: SpeechSynthesisUtterance | null = null;

export function speakText(text: string, lang: string = 'it-IT'): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  stopSpeech();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = 0.9;
  const voices = window.speechSynthesis.getVoices();
  const italianVoice = voices.find((v) => v.lang.startsWith('it') && v.localService) ||
    voices.find((v) => v.lang.startsWith('it'));
  if (italianVoice) utterance.voice = italianVoice;
  currentUtterance = utterance;
  window.speechSynthesis.speak(utterance);
}

export function stopSpeech(): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  currentUtterance = null;
}

export function preloadVoices(): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  window.speechSynthesis.getVoices();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
  }
}
