import { ChapterInfo, QuizData } from './types';

export const CHAPTERS: ChapterInfo[] = [
  { id: '1', slug: 'definizioni-generali-doveri-strada', name: 'Definizioni Generali e Doveri', icon: 'BookOpen', questionCount: 531 },
  { id: '2', slug: 'segnali-pericolo', name: 'Segnali di Pericolo', icon: 'AlertTriangle', questionCount: 662 },
  { id: '3', slug: 'segnali-divieto', name: 'Segnali di Divieto', icon: 'Ban', questionCount: 521 },
  { id: '4', slug: 'segnali-obbligo', name: 'Segnali di Obbligo', icon: 'ShieldCheck', questionCount: 433 },
  { id: '5', slug: 'segnali-precedenza', name: 'Segnali di Precedenza', icon: 'ArrowRightLeft', questionCount: 243 },
  { id: '6', slug: 'segnaletica-orizzontale-ostacoli', name: 'Segnaletica Orizzontale', icon: 'Minus', questionCount: 260 },
  { id: '7', slug: 'semafori-vigili', name: 'Semafori e Vigili', icon: 'TrafficCone', questionCount: 253 },
  { id: '8', slug: 'segnali-indicazione', name: 'Segnali di Indicazione', icon: 'MapPin', questionCount: 603 },
  { id: '9', slug: 'segnali-complementari-cantiere', name: 'Segnali Complementari', icon: 'Construction', questionCount: 181 },
  { id: '10', slug: 'pannelli-integrativi', name: 'Pannelli Integrativi', icon: 'LayoutGrid', questionCount: 263 },
  { id: '11', slug: 'limiti-di-velocita', name: 'Limiti di Velocita', icon: 'Gauge', questionCount: 256 },
  { id: '12', slug: 'distanza-di-sicurezza', name: 'Distanza di Sicurezza', icon: 'MoveHorizontal', questionCount: 135 },
  { id: '13', slug: 'norme-di-circolazione', name: 'Norme di Circolazione', icon: 'Route', questionCount: 379 },
  { id: '14', slug: 'precedenza-incroci', name: 'Precedenza e Incroci', icon: 'GitBranch', questionCount: 415 },
  { id: '15', slug: 'sorpasso', name: 'Sorpasso', icon: 'ArrowRight', questionCount: 156 },
  { id: '16', slug: 'fermata-sosta-arresto', name: 'Fermata e Sosta', icon: 'ParkingCircle', questionCount: 191 },
  { id: '17', slug: 'norme-varie-autostrade-pannelli', name: 'Autostrade', icon: 'Road', questionCount: 332 },
  { id: '18', slug: 'luci-dispositivi-acustici', name: 'Luci e Dispositivi', icon: 'Lightbulb', questionCount: 176 },
  { id: '19', slug: 'cinture-casco-sicurezza', name: 'Cinture e Casco', icon: 'HardHat', questionCount: 135 },
  { id: '20', slug: 'patente-punti-documenti', name: 'Patente e Punti', icon: 'CreditCard', questionCount: 234 },
  { id: '21', slug: 'incidenti-stradali-comportamenti', name: 'Incidenti Stradali', icon: 'AlertCircle', questionCount: 102 },
  { id: '22', slug: 'alcool-droga-primo-soccorso', name: 'Alcool, Droga e Soccorso', icon: 'Heart', questionCount: 141 },
  { id: '23', slug: 'responsabilita-civile-penale-e-assicurazione', name: 'Responsabilita e Assicurazione', icon: 'Scale', questionCount: 149 },
  { id: '24', slug: 'consumi-ambiente-inquinamento', name: 'Ambiente e Inquinamento', icon: 'Leaf', questionCount: 103 },
  { id: '25', slug: 'elementi-veicolo-manutenzione-comportamenti', name: 'Manutenzione Veicolo', icon: 'Wrench', questionCount: 285 },
];

/** Get all topic names for a given chapter from quizData */
export function getTopicsForChapter(quizData: QuizData, chapterSlug: string): string[] {
  const chapter = quizData[chapterSlug];
  if (!chapter) return [];
  return Object.keys(chapter);
}

/** Format a slug to display name */
export function slugToName(slug: string): string {
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}
