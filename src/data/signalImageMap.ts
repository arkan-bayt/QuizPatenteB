// Maps signal IDs to real quiz sign image paths
// These are the EXACT images used in quiz questions
export const SIGNAL_IMAGE_MAP: Record<string, string[]> = {
  // PERICOLO (Chapter 2)
  'curva-sinistra': ['/img_sign/5.png'],
  'curva-destra': ['/img_sign/4.png'],
  'doppia-curva': ['/img_sign/6.png', '/img_sign/7.png'],
  'passaggio-livello': ['/img_sign/9.png', '/img_sign/8.png'],
  'incrocio': ['/img_sign/10.png', '/img_sign/11.png'],
  'pedoni': ['/img_sign/15.png'],
  'bambini': ['/img_sign/25.png'],
  'scivolosa': ['/img_sign/24.png'],
  'caduta-massi': ['/img_sign/32.png', '/img_sign/33.png'],
  'ponte-mobile': ['/img_sign/22.png'],
  'vento': ['/img_sign/37.png'],
  'discesa-pericolosa': ['/img_sign/17.png'],
  'salita-ripida': ['/img_sign/18.png'],
  'strada-dissestata': ['/img_sign/1.png'],
  'restringimento': ['/img_sign/19.png', '/img_sign/20.png', '/img_sign/21.png'],
  'rotatoria': ['/img_sign/29.png'],
  'animali-selvatici': ['/img_sign/27.png'],
  'animali-domestici': ['/img_sign/26.png'],
  'pericolo-generico': ['/img_sign/39.png'],
  'banchina-cedevole': ['/img_sign/23.png'],
  'cunetta': ['/img_sign/3.png'],
  'dosso': ['/img_sign/2.png'],
  'attraversamento-tram': ['/img_sign/14.png'],
  'attraversamento-ciclabile': ['/img_sign/16.png'],
  'doppio-senso': ['/img_sign/28.png'],
  'banchina-portuale': ['/img_sign/30.png'],
  'pietrisco': ['/img_sign/31.png'],
  'pericolo-incendio': ['/img_sign/38.png'],
  'aeroplani': ['/img_sign/36.png'],

  // DIVIETO (Chapter 3)
  'divieto-accesso': ['/img_sign/54.png'],
  'senso-vietato': ['/img_sign/55.png'],
  'divieto-sosta': ['/img_sign/84.png'],
  'divieto-fermata': ['/img_sign/85.png'],
  'limite-velocita': ['/img_sign/58.png'],
  'divieto-sorpasso': ['/img_sign/56.png'],
  'divieto-sorpasso-camion': ['/img_sign/60.png'],
  'divieto-transito-pedoni': ['/img_sign/62.png'],
  'divieto-transito-bici': ['/img_sign/63.png'],
  'divieto-transito-moto': ['/img_sign/64.png'],
  'mezzi-pesanti': ['/img_sign/69.png'],
  'trasporto-esplosivi': ['/img_sign/73.png'],
  'parcheggio': ['/img_sign/86.png'],
  'ztl': ['/img_sign/187.png'],
  'fine-prescrizione': ['/img_sign/80.png'],
  'fine-limite-velocita': ['/img_sign/81.png'],
  'fine-divieto-sorpasso': ['/img_sign/82.png'],

  // OBBLIGO (Chapter 4)
  'sens-unico': ['/img_sign/152.png', '/img_sign/153.png'],
  'dritto': ['/img_sign/93.png'],
  'direzione-sinistra': ['/img_sign/94.png'],
  'direzione-destra': ['/img_sign/95.png'],
  'pista-ciclabile': ['/img_sign/112.png'],
  'catene-neve': ['/img_sign/107.png'],
  'limite-minimo': ['/img_sign/105.png'],
  'rotatoria-obbligo': ['/img_sign/104.png'],
  'percorso-pedonale': ['/img_sign/108.png'],
  'percorso-bici': ['/img_sign/110.png'],

  // PRECEDENZA (Chapter 5)
  'dare-precedenza': ['/img_sign/40.png'],
  'stop': ['/img_sign/41.png'],
  'strada-prioritaria': ['/img_sign/52.png'],
  'fine-prioritaria': ['/img_sign/46.png'],
  'sensi-unici-alternati': ['/img_sign/45.png'],
  'confluenza-destra': ['/img_sign/50.png'],
  'confluenza-sinistra': ['/img_sign/51.png'],
  'preavviso-precedenza': ['/img_sign/42.png'],
  'preavviso-stop': ['/img_sign/43.png'],

  // INDICAZIONE (Chapter 8)
  'autostrada': ['/img_sign/184.png', '/img_sign/200.png', '/img_sign/206.png'],
  'fine-autostrada': ['/img_sign/183.png'],
  'ospedale': ['/img_sign/214.png'],
  'area-servizio': ['/img_sign/254.png'],
  'inizio-centro-abitato': ['/img_sign/207.png'],
  'fine-centro-abitato': ['/img_sign/183.png'],
  'strada-senza-uscita': ['/img_sign/224.png'],
  'velocita-consigliata': ['/img_sign/226.png'],
  'inizio-galleria': ['/img_sign/230.png'],
  'area-pedonale': ['/img_sign/186.png'],
  'traffico-limitato': ['/img_sign/187.png'],
  'scuolabus': ['/img_sign/219.png'],
  'pronto-soccorso': ['/img_sign/210.png'],
  'fermata-autobus': ['/img_sign/256.png'],
  'telefono': ['/img_sign/253.png'],
  'campeggio': ['/img_sign/260.png'],

  // PANNELLI (Chapter 10)
  'pannello-distanza': ['/img_sign/121.png'],
  'pannello-direzione': ['/img_sign/122.png'],
  'pannello-validita': ['/img_sign/123.png', '/img_sign/124.png', '/img_sign/125.png'],
  'presenza-code': ['/img_sign/136.png'],
  'zona-allagamento': ['/img_sign/135.png'],
  'zona-rimozione': ['/img_sign/141.png'],
  'mezzi-lavoro': ['/img_sign/137.png'],
  'strada-ghiacciata': ['/img_sign/138.png'],
};

export function getSignalImage(signalId: string): string {
  const images = SIGNAL_IMAGE_MAP[signalId];
  return images?.[0] || '';
}

export function getSignalImages(signalId: string): string[] {
  return SIGNAL_IMAGE_MAP[signalId] || [];
}
