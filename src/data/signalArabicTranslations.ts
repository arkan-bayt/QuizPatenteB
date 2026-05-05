// ============================================================
// ARABIC TRANSLATIONS — All Signals
// Combines all signal translations from 3 parts
// ============================================================

export interface SignalArabicTranslation {
  name: string;
  description: string;
  whenToObeyIt: string;
  whatHappensIfIgnored: string;
}

import { signalArabicTranslationsPart1 } from './signalArabicTranslations_part1';
import { signalArabicTranslationsPart2 } from './signalArabicTranslations_part2';
import { signalArabicTranslationsPart3 } from './signalArabicTranslations_part3';

export const signalArabicTranslations: Record<string, SignalArabicTranslation> = {
  ...signalArabicTranslationsPart1,
  ...signalArabicTranslationsPart2,
  ...signalArabicTranslationsPart3,
};
