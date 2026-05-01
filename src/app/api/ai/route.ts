// ============================================================
// AI API - Full AI Suite for Quiz Patente B
// Actions: explain, analyze, chat, hint, studyPlan, translate
// Uses z-ai-web-dev-sdk for free AI inference with smart fallbacks
// ============================================================
import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    if (action === 'explain') return handleExplain(body);
    if (action === 'analyze') return handleAnalyze(body);
    if (action === 'chat') return handleChat(body);
    if (action === 'hint') return handleHint(body);
    if (action === 'studyPlan') return handleStudyPlan(body);
    if (action === 'translate') return handleTranslate(body);
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// ============================================================
// SMART LOCAL EXPLANATION ENGINE (works offline)
// ============================================================
function generateSmartExplanation(question: string, correctAnswer: boolean, userAnswer: boolean, chapterName: string | undefined, subtopic: string | undefined, hasImage: boolean): string {
  const q = question.toLowerCase();
  const correctText = correctAnswer ? 'VERO' : 'FALSO';
  const parts: string[] = [];

  if (hasImage) {
    if (q.includes('obbligo') || q.includes('obbligatorio') || q.includes('dovere')) {
      parts.push('Il segnale nell\'immagine e\' un segnale di obbligo.');
      if (q.includes('destra') || q.includes('dx')) parts.push('Indica che devi svoltare o andare a destra.');
      else if (q.includes('sinistra') || q.includes('sx')) parts.push('Indica che devi svoltare o andare a sinistra.');
      else if (q.includes('dritto') || q.includes('avanti') || q.includes('rettilineo')) parts.push('Indica che devi proseguire dritto.');
      else parts.push('Indica una direzione obbligatoria che devi seguire.');
      parts.push('I segnali di obbligo sono di forma circolare con sfondo blu.');
    } else if (q.includes('divieto') || q.includes('vietato') || q.includes('non puo') || q.includes('non possibile')) {
      parts.push('Il segnale nell\'immagine e\' un segnale di divieto.');
      if (q.includes('sosta') || q.includes('parchegg')) parts.push('Il divieto di sosta significa che non puoi fermarti o parcheggiare in quella zona, ma puoi fare una fermata breve per salire/scendere passeggeri.');
      else if (q.includes('accesso') || q.includes('entrare') || q.includes('ingresso')) parts.push('Questo segnale vieta l\'accesso a tutti i veicoli in quella strada o area.');
      else if (q.includes('sorpasso') || q.includes('supera')) parts.push('Il divieto di sorpasso significa che non puoi superare il veicolo che ti precede.');
      else parts.push('Indica un\'azione che non puoi fare in quella zona.');
      parts.push('I segnali di divieto sono rotondi con bordo rosso e sfondo bianco.');
    } else if (q.includes('precedenza') || q.includes('dare la precedence') || q.includes('deve fermarsi') || q.includes('stop')) {
      if (q.includes('dare') || q.includes('cedere') || q.includes('deve dare')) {
        parts.push('Questo segnale indica che devi dare la precedenza agli altri veicoli.');
        parts.push('Devi rallentare e fermarti se necessario per lasciar passare gli altri veicoli.');
      } else {
        parts.push('Questo segnale indica che hai la precedenza.');
        parts.push('Gli altri veicoli devono darti strada.');
      }
      parts.push('Il segnale di precedenza e\' un triangolo rovesciato con bordo rosso.');
    } else if (q.includes('zona') && (q.includes('30') || q.includes('50') || q.includes('velocita') || q.includes('km'))) {
      parts.push('Questo segnale indica una zona con limite di velocita\' specifico.');
      parts.push('Il limite di velocita\' in zona urbana e\' generalmente 50 km/h.');
      parts.push('Devi rispettare il limite indicato per tutta la durata della zona.');
    } else if (q.includes('parchegg') || q.includes('sosta')) {
      parts.push('Questo segnale indica un\'area di parcheggio.');
      if (q.includes('parallelo')) parts.push('Le auto devono essere parcheggiate in parallelo al marciapiede.');
      else if (q.includes('obliquo') || q.includes('diagonale')) parts.push('Le auto devono essere parcheggiate in diagonale rispetto al marciapiede.');
      else parts.push('Puoi parcheggiare solo nell\'area indicata dal segnale.');
    } else if (q.includes('sentiero') || q.includes('ciclabile') || q.includes('biciclet') || q.includes('pedonale')) {
      parts.push('Questo segnale indica una pista o un\'area riservata.');
      parts.push('I veicoli a motore non possono circolare in quest\'area.');
      parts.push('E\' riservata ai pedoni o alle biciclette.');
    } else if (q.includes('strada') && (q.includes('sterrata') || q.includes('terrac') || q.includes('ghiaia'))) {
      parts.push('Questo segnale indica una strada sterrata.');
      parts.push('La superficie non e\' asfaltata e puo\' essere scivolosa o dissestata.');
      parts.push('Devi ridurre la velocita\' e prestare attenzione.');
    } else if (q.includes('curva') || q.includes('tornante') || q.includes('girare')) {
      parts.push('Questo segnale indica un pericolo legato alla geometria della strada.');
      parts.push('Devi ridurre la velocita\' prima della curva o del tornante.');
      parts.push('Mantieni la destra e non frenare bruscamente durante la curva.');
    } else if (q.includes('passaggio') && (q.includes('livello') || q.includes('ferroviari') || q.includes('treno'))) {
      parts.push('Questo segnale indica un passaggio a livello con i binari del treno.');
      parts.push('Devi fermarti prima delle barriere e guardare entrambe le direzioni.');
      parts.push('Non attraversare mai se le luci lampeggiano o le barriere stanno chiudendosi.');
    } else if (q.includes('autovelox') || q.includes('tutor') || q.includes('speed') || q.includes('multa')) {
      parts.push('Questo segnale indica la presenza di un dispositivo di controllo della velocita\'.');
      parts.push('Rispetta il limite di velocita\' indicato per evitare sanzioni.');
    } else if (q.includes('campeggio') || q.includes('area di sosta')) {
      parts.push('Questo segnale indica un\'area di sosta o campeggio.');
      parts.push('Puoi fermarti e sostare in quest\'area per un periodo limitato.');
      parts.push('Non e\' una zona di parcheggio normale, rispetta le regole specifiche dell\'area.');
    } else if (q.includes('fine') || q.includes('fine del')) {
      parts.push('Questo segnale indica la fine di una restrizione precedente.');
      parts.push('Da questo punto in poi, la regola indicata non si applica piu\'.');
      parts.push(`La risposta corretta e' ${correctText}.`);
    } else if (q.includes('direzion') || q.includes('freccia') || q.includes('indicazione')) {
      parts.push('Questo segnale di indicazione fornisce informazioni sulla direzione o destinazione.');
      parts.push('Segui le indicazioni per raggiungere la destinazione desiderata.');
      parts.push(`La risposta corretta e' ${correctText}.`);
    } else if (q.includes('pericolo') || q.includes('peligro') || q.includes('attenzione')) {
      parts.push('Questo e\' un segnale di pericolo (triangolo con bordo bianco e sfondo giallo/rosso).');
      parts.push('Indica un pericolo potenziale sulla strada. Devi prestare attenzione e ridurre la velocita\'.');
      parts.push(`La risposta corretta e' ${correctText}.`);
    } else {
      parts.push('Questo segnale stradale fornisce un\'informazione o un\'indicazione importante.');
      parts.push('Osserva bene la forma e il colore del segnale per capirne la categoria.');
      parts.push(`La risposta corretta e' ${correctText}.`);
    }
  } else {
    if (q.includes('velocita') || q.includes('km/h') || q.includes('kmh') || q.includes('limite')) {
      if (q.includes('urbana') || q.includes('citta') || q.includes('centro')) {
        parts.push('Il limite di velocita\' in area urbana e\' 50 km/h.');
        parts.push('Questo vale per tutte le strade all\'interno dei centri abitati.');
        parts.push(`La risposta corretta e' ${correctText} secondo il Codice della Strada.`);
      } else if (q.includes('extraurbana') || q.includes('fuori') || q.includes('statale') || q.includes('principale')) {
        parts.push('Il limite di velocita\' sulle strade extraurbane principali e\' 110 km/h per le auto.');
        parts.push('Sulle strade extraurbane secondarie il limite e\' 90 km/h.');
        parts.push(`La risposta corretta e' ${correctText}.`);
      } else if (q.includes('autostrada') || q.includes('highway')) {
        parts.push('Il limite di velocita\' in autostrada e\' 130 km/h per le auto.');
        parts.push('In caso di pioggia il limite scende a 110 km/h.');
        parts.push(`La risposta corretta e' ${correctText}.`);
      } else {
        parts.push('I limiti di velocita\' variano in base al tipo di strada.');
        parts.push('In citta\' 50 km/h, strade extraurbane 90-110 km/h, autostrada 130 km/h.');
        parts.push(`La risposta corretta e' ${correctText}.`);
      }
    } else if (q.includes('alcol') || q.includes('tasso') || q.includes('bere') || q.includes('birra') || q.includes('vino')) {
      parts.push('Il tasso di alcol consentito in Italia per chi guida e\' 0.5 g/l.');
      parts.push('Per i neopatentati e i conducenti professionali il limite e\' 0.0 g/l (tasso zero).');
      parts.push('Superare il limite e\' un reato penale e comporta la revoca della patente.');
    } else if (q.includes('drog') || q.includes('sostanz') || q.includes('spinell') || q.includes('cannabin')) {
      parts.push('Guidare sotto l\'effetto di sostanze stupefacenti e\' un reato grave.');
      parts.push('La patente viene sospesa da 6 mesi a 2 anni e ci sono sanzioni penali.');
      parts.push('I test possono essere effettuati con prelievo di sangue, urina o saliva.');
    } else if (q.includes('cintura') || q.includes('seggiolino') || q.includes('casco') || q.includes('protezione')) {
      if (q.includes('cintura')) {
        parts.push('La cintura di sicurezza e\' obbligatoria per tutti i passeggeri, sia davanti che dietro.');
        parts.push('I bambini di statura inferiore a 150 cm devono usare un seggiolino appropriato.');
        parts.push('La mancata uso della cintura comporta una multa e la decurtazione di punti dalla patente.');
      } else if (q.includes('casco')) {
        parts.push('Il casco e\' obbligatorio per tutti i conducenti e passeggeri di ciclomotori e motocicli.');
        parts.push('Deve essere omologato e assicurato correttamente.');
        parts.push('La mancata uso del casco comporta una multa e la fermata del veicolo.');
      }
    } else if (q.includes('telefono') || q.includes('cellulare') || q.includes('smartphone') || q.includes('chiamare')) {
      parts.push('E\' vietato usare il telefono cellulare mentre si guida.');
      parts.push('Puoi usare il viva-voce o auricolari, ma non puoi tenere il telefono in mano.');
      parts.push('La violazione comporta una multa di 165-660 euro e la decurtazione di 5 punti dalla patente.');
    } else if (q.includes('pedone') || q.includes('attraversamento') || q.includes('striscia')) {
      parts.push('I pedoni hanno sempre la precedenza sugli attraversamenti strisciate.');
      parts.push('Il conducente deve fermarsi e aspettare che il pedone completi l\'attraversamento.');
      parts.push('Anche fuori dagli attraversamenti, il conducente deve prestare attenzione ai pedoni.');
    } else if (q.includes('precedenza') || q.includes('dare la precedence') || q.includes('incrocio') || q.includes('rotatoria') || q.includes('roundabout')) {
      if (q.includes('rotatoria')) {
        parts.push('Nella rotatoria, chi e\' gia\' all\'interno ha la precedenza.');
        parts.push('Devi inserirti nella rotatoria quando c\'e\' uno spazio sufficiente.');
        parts.push('Usa la freccia per segnalare l\'uscita dalla rotatoria.');
      } else if (q.includes('destra')) {
        parts.push('In assenza di segnaletica, si deve dare la precedenza ai veicoli che provengono da destra.');
        parts.push('Questa regola si applica agli incroci non regolamentati.');
        parts.push(`La risposta corretta e' ${correctText}.`);
      } else {
        parts.push('Le regole di precedenza dipendono dalla segnaletica presente.');
        parts.push('In assenza di segnali, la precedenza e\' a destra.');
        parts.push(`La risposta corretta e' ${correctText}.`);
      }
    } else if (q.includes('document') || q.includes('patente') || q.includes('libretto') || q.includes('assicurazione')) {
      if (q.includes('patente') && (q.includes('anni') || q.includes('eta') || q.includes('eta\''))) {
        parts.push('La patente B si puo\' ottenere a 18 anni compiuti.');
        parts.push('Per guidare i ciclomotori (50 cc) basta avere 14 anni con il patentino.');
        parts.push('La patente A per le moto si puo\' ottenere a 18 anni (A2) o 20 anni (A).');
      } else {
        parts.push('Per guidare devi sempre avere con te: patente, libretto di circolazione e certificato di assicurazione.');
        parts.push('Guidare senza documenti validi comporta sanzioni.');
        parts.push(`La risposta corretta e' ${correctText}.`);
      }
    } else if (q.includes('gomma') || q.includes('pneumatico') || q.includes('ruota') || q.includes('bordi') || q.includes('gomme lisc')) {
      parts.push('La profondita\' minima del battistrada delle gomme e\' 1.6 mm.');
      parts.push('Gomme lisce aumentano lo spazio di frenata e il rischio di aquaplaning.');
      parts.push('Controlla le gomme regolarmente e sostituiscile quando sono usurate.');
    } else if (q.includes('nebbia') || q.includes('pioggia') || q.includes('neve') || q.includes('ghiaccio') || q.includes('meteo') || q.includes('visibilita')) {
      if (q.includes('nebbia')) {
        parts.push('In caso di nebbia fitta, usa gli anabbaglianti anteriore e posteriore.');
        parts.push('Riduci la velocita\' e aumenta la distanza di sicurezza dal veicolo precedente.');
        parts.push('Non usare gli abbaglianti nella nebbia perche\' creano riflessi.');
      } else {
        parts.push('In caso di condizioni meteorologiche avverse, riduci la velocita\' e aumenta la distanza di sicurezza.');
        parts.push('Usa i fari appropriati (anabbaglianti in caso di pioggia o nebbia).');
        parts.push(`La risposta corretta e' ${correctText}.`);
      }
    } else if (q.includes('luci') || q.includes('fari') || q.includes('abbaglianti') || q.includes('anabbaglianti')) {
      if (q.includes('anabbaglianti')) {
        parts.push('Gli anabbaglianti devono essere usati in presenza di altri veicoli, in citta\' e in caso di nebbia.');
        parts.push('Devono illuminare almeno 100 metri avanti senza abbagliare gli altri conducenti.');
      } else {
        parts.push('I fari anabbaglianti sono obbligatori nelle gallerie, al buio e in caso di nebbia.');
        parts.push('Gli abbaglianti si usano solo fuori dai centri abitati quando non ci sono altri veicoli.');
      }
    } else if (q.includes('sorpasso') || q.includes('supera') || q.includes('doppiaggio')) {
      parts.push('Il sorpasso si effettua sempre dalla sinistra del veicolo da superare.');
      parts.push('E\' vietato sorpassare in curva, in prossimita\' di incroci, e dove c\'e\' la linea continua.');
      parts.push('Devi usare l\'indicatore di direzione prima e dopo il sorpasso.');
    } else if (q.includes('parchegg') || q.includes('sosta') || (q.includes('ferm') && !q.includes('fren'))) {
      parts.push('La sosta e\' la fermata prolungata del veicolo.');
      parts.push('La fermata e\' la temporanea interruzione della marcia per salire/scendere passeggeri.');
      parts.push('Non puoi parcheggiare nei passi carrabili, sugli attraversamenti pedonali o in doppia fila.');
    } else if (q.includes('frena') || q.includes('fren') || (q.includes('distanza') && q.includes('sicurezza'))) {
      parts.push('La distanza di sicurezza dipende dalla velocita\' e dalle condizioni della strada.');
      parts.push('A 50 km/h servono almeno 25 metri, a 130 km/h almeno 130 metri.');
      parts.push('In caso di pioggia o neve, la distanza deve essere almeno il doppio.');
    } else if (q.includes('bambino') || q.includes('minore') || q.includes('seggiolino') || q.includes('posteriore')) {
      parts.push('I bambini di statura inferiore a 150 cm devono viaggiare con un seggiolino appropriato.');
      parts.push('Non usare mai il seggiolino sul sedile anteriore se l\'airbag e\' attivo.');
      parts.push('I bambini sotto i 12 anni non possono sedersi davanti se non in casi specifici.');
    } else if (q.includes('incendio') || q.includes('estintore') || q.includes('triangolo') || q.includes('giubbotto')) {
      parts.push('Estintore, triangolo di emergenza e giubbotto riflettente sono obbligatori in alcuni casi.');
      parts.push('Il triangolo va posizionato almeno 50 metri prima del veicolo in caso di fermata d\'emergenza.');
      parts.push('Il giubbotto riflettente deve essere usato quando scendi dal veicolo di notte o in galleria.');
    } else if (q.includes('punto') && (q.includes('patente') || q.includes('decurtazione') || q.includes('recupero'))) {
      parts.push('La patente ha 20 punti iniziali per i neopatentati e 20 punti per tutti.');
      parts.push('Ogni infrazione toglie da 2 a 10 punti. Sotto i 20 punti ci sono corsi di recupero.');
      parts.push('Se i punti arrivano a zero, la patente viene revocata.');
    } else if (q.includes('galleria') || q.includes('tunnel')) {
      parts.push('In galleria sono obbligatori gli anabbaglianti accesi.');
      parts.push('Rispetta il limite di velocita\' indicato e mantieni la distanza di sicurezza.');
      parts.push('Non fermarti in galleria se non per emergenza assoluta.');
    } else if (q.includes('marciapiede') || q.includes('cordolo') || q.includes('banchina')) {
      parts.push('E\' vietato circolare sul marciapiede, eccetto per accesso a proprietà o garage.');
      parts.push('La banchina non e\' parte della carreggiata e non va usata per la circolazione.');
      parts.push(`La risposta corretta e' ${correctText}.`);
    } else if (q.includes('autobus') || q.includes('tram') || q.includes('mezzi pubblici')) {
      parts.push('I mezzi pubblici hanno precedenza quando ripartono dalla fermata.');
      parts.push('Non puoi sorpassare un autobus fermato per far salire/scendere passeggeri.');
      parts.push(`La risposta corretta e' ${correctText}.`);
    } else if (q.includes('ambulanza') || q.includes('vigili') || q.includes('polizia') || q.includes('emergenza') || q.includes('sirena')) {
      parts.push('I veicoli d\'emergenza con sirena accesa hanno sempre la precedenza.');
      parts.push('Devi fare strada e fermarti se necessario per lasciarli passare.');
      parts.push('Non seguirli mai a breve distanza.');
    } else if (q.includes('targa') || q.includes('numero') || q.includes('riconoscimento')) {
      parts.push('La targa deve essere ben leggibile, non coperta e non sporca.');
      parts.push('Le targhe sono obbligatorie sia davanti che dietro per le auto.');
      parts.push(`La risposta corretta e' ${correctText}.`);
    } else {
      if (chapterName) parts.push(`Questa domanda fa parte del capitolo "${chapterName}".`);
      if (subtopic && subtopic !== chapterName) parts.push(`L'argomento trattato e' "${subtopic}".`);
      parts.push(`La risposta corretta e' ${correctText}, non ${userAnswer === true ? 'VERO' : 'FALSO'}.`);
      parts.push('Leggi attentamente la domanda e ricorda le regole del codice della strada relative a questo argomento.');
    }
  }

  return parts.join(' ');
}

// ============================================================
// HINT ENGINE - Smart hints for current question
// ============================================================
function generateSmartHint(question: string, chapterName: string | undefined, subtopic: string | undefined, hasImage: boolean): string {
  const q = question.toLowerCase();
  const parts: string[] = [];

  if (hasImage) {
    parts.push('Osserva attentamente il segnale nell\'immagine.');
    if (q.includes('obbligo') || q.includes('obbligatorio')) {
      parts.push('I segnali di obbligo hanno forma circolare con sfondo blu.');
      parts.push('Indicano qualcosa che DEVI fare, non che e\' vietato.');
    } else if (q.includes('divieto') || q.includes('vietato')) {
      parts.push('I segnali di divieto sono rotondi con bordo rosso e sfondo bianco/rosso.');
      parts.push('Indicano qualcosa che NON puoi fare.');
    } else if (q.includes('precedenza')) {
      parts.push('Il segnale di precedenza e\' un triangolo rovesciato con bordo rosso.');
      parts.push('Pensa a chi deve dare la precedenza.');
    } else {
      parts.push('Presta attenzione alla forma (cerchio, triangolo, rettangolo) e al colore del segnale.');
      parts.push('Il colore e la forma ti dicono la categoria del segnale.');
    }
  } else {
    if (q.includes('velocita') || q.includes('km/h')) {
      parts.push('Ricorda i limiti di velocita\' base:');
      parts.push('Zona urbana: 50 km/h - Extraurbana secondaria: 90 km/h - Extraurbana principale: 110 km/h - Autostrada: 130 km/h.');
      parts.push('In caso di pioggia, autostrada scende a 110 km/h e extraurbane di 20 km/h.');
    } else if (q.includes('sempre') || q.includes('mai')) {
      parts.push('Attenzione alle parole assolute! "Sempre" e "mai" rendono la domanda molto rigida.');
      parts.push('Pensa se esiste almeno un\'eccezione. Se si, la risposta e\' probabilmente FALSO.');
    } else if (q.includes('alcol')) {
      parts.push('Limite normale: 0.5 g/l. Neopatentati e professionisti: 0.0 g/l.');
      parts.push('Chi supera il limite commette un reato.');
    } else if (q.includes('precedenza') || q.includes('incrocio')) {
      parts.push('Regola generale: precedenza a destra se non ci sono segnali.');
      parts.push('Nella rotatoria, chi e\' gia\' dentro ha la precedenza.');
      parts.push('Il segnale STOP richiede sempre la fermata completa.');
    } else if (q.includes('parchegg') || q.includes('sosta')) {
      parts.push('Sosta = fermata prolungata. Fermata = salire/scendere passeggeri o carico/scarico.');
      parts.push('Non puoi parcheggiare su passi carrabili, strisce pedonali, curve, incroci.');
    } else if (q.includes('luci') || q.includes('fari')) {
      parts.push('Anabbaglianti: sempre in citta\', gallerie, nebbia, pioggia.');
      parts.push('Abbaglianti: solo fuori centro e senza veicoli davanti.');
    } else {
      parts.push('Pensa alla situazione reale di guida.');
      parts.push('Concentrati sulle parole chiave della domanda.');
      if (subtopic) parts.push(`L'argomento e': ${subtopic}.`);
    }
  }

  return parts.join(' ');
}

// ============================================================
// LANGUAGE DETECTION ENGINE
// ============================================================
function detectLanguage(msg: string): 'ar' | 'it' {
  const arabicRegex = /[\u0600-\u06FF]/;
  const arabicWords = ['شرح', 'ايش', 'اي', 'ماذا', 'كيف', 'لماذا', 'متى', 'اين', 'هل', 'السرعة', 'العلامات', 'الرخصة', 'الامتحان', 'الامان', 'الحزام', 'الكرسي', 'الخوذة', 'الاتجاه', 'المرور', 'السائق', 'الشارع', 'الطريق', 'عربي', 'بالايطالي', 'بالايطال'];
  const lower = msg.toLowerCase();
  if (arabicRegex.test(msg) || arabicWords.some(w => lower.includes(w))) return 'ar';
  return 'it';
}

function wantsArabicResponse(msg: string): boolean {
  const lower = msg.toLowerCase();
  const arabicIndicators = ['بالايطالي', 'بالايطال'];
  if (arabicIndicators.some(w => lower.includes(w))) return false;
  return detectLanguage(msg) === 'ar';
}

// ============================================================
// ARABIC KEYWORDS MAP (Arabic topic → Italian topic)
// ============================================================
const ARABIC_TOPIC_MAP: Record<string, string[]> = {
  speed: ['سرعة', 'السرعة', 'كيلو', 'كم/س', 'محدود', 'حد السرعة', 'سريع'],
  alcohol: ['كحول', 'خمر', 'بيرة', 'نبيذ', 'شراب', 'سكران', 'الكحول'],
  documents: ['وثيقة', 'رخصة', 'تأمين', 'وثائق', 'ورق', 'الرخصة'],
  signs: ['علامة', 'لافتة', 'اشارة', 'إشارة', 'اشارات', 'العلامات', 'لافتات'],
  parking: ['موقف', 'ركن', 'باركينج', 'صف', 'وقوف', 'المواقف', 'مواقف'],
  priority: ['أولوية', 'اولوية', 'دور', 'تقاطع', 'دوار', 'الأولوية', 'الافضلية'],
  lights: ['نور', 'أنوار', 'إضاءة', 'اضاءة', 'فوانيس', 'النور', 'مصابيح'],
  safety: ['حزام', 'أمان', 'خوذة', 'جاكيت', 'طفاية', 'مثلث', 'الأمان', 'سلامة'],
  exam: ['امتحان', 'اختبار', 'كويز', 'الامتحان', 'الاختبار', 'متت'],
  tires: ['إطار', 'اطار', 'كفر', 'كفارات', 'الإطارات', 'الاطارات'],
  distance: ['مسافة', 'فرامل', 'توقف', 'مسافة أمان', 'فرملة', 'المسافة'],
  phone: ['هاتف', 'جوال', 'موبايل', 'اتصال', 'الهاتف', 'الجوال'],
  children: ['أطفال', 'اطفال', 'كرسي', 'الأطفال', 'مقعد'],
  drugs: ['مخدرات', 'حبوب', 'حشيش', 'المخدرات'],
  tunnel: ['نفق', 'أنفاق', 'النفق', 'الأنفاق'],
  bus: ['حافلة', 'أوتوبوس', 'باص', 'نقل', 'الحافلة'],
  emergency: ['إسعاف', 'اسعاف', 'شرطة', 'طوارئ', 'سيرينا', 'الطوارئ'],
  overtaking: ['تجاوز', 'التفاف', 'تجاوز', 'دوران'],
  pedestrian: ['مشاة', 'رصيف', 'مشي', 'المشاة', 'عابر'],
  weather: ['ضباب', 'مطر', 'ثلج', 'جليد', 'الضباب', 'المطر'],
  direction: ['اتجاه', 'الاتجاه', 'إتجاه', 'احادي', 'احادي الاتجاه', 'واحد'],
};

function matchArabicTopic(msg: string): string | null {
  for (const [topic, keywords] of Object.entries(ARABIC_TOPIC_MAP)) {
    if (keywords.some(k => msg.includes(k))) return topic;
  }
  return null;
}

// ============================================================
// BILINGUAL KNOWLEDGE BASE
// ============================================================
function generateChatAnswer(userMessage: string): string {
  const msg = userMessage.toLowerCase();
  const lang = detectLanguage(userMessage);
  const replyArabic = wantsArabicResponse(userMessage);
  const topic = matchArabicTopic(userMessage);
  const parts: string[] = [];

  if (replyArabic) {
    // === ARABIC RESPONSES ===
    if (topic === 'speed' || msg.includes('velocita') || msg.includes('km/h')) {
      parts.push('حدود السرعة في إيطاليا لرخصة القيادة B:');
      parts.push('- المناطق السكنية: 50 كم/س');
      parts.push('- الطرق الخارجية الثانوية: 90 كم/س');
      parts.push('- الطرق الخارجية الرئيسية: 110 كم/س');
      parts.push('- الطرق السريعة: 130 كم/س (110 كم/س في حال المطر)');
      parts.push('- حاملو الرخصة الجديدة: 100 كم/س على الطرق الخارجية والسريعة');
      parts.push('تجاوز الحد يعني غرامة من 42 إلى 3,366 يورو وخصم نقاط.');
    } else if (topic === 'alcohol' || msg.includes('alcol') || msg.includes('bere')) {
      parts.push('قواعد الكحول والقيادة في إيطاليا:');
      parts.push('- الحد المسموح العادي: 0.5 غ/ل');
      parts.push('- حاملو الرخصة الجديدة والسائقون المحترفون: 0.0 غ/ل (صفر مطلق)');
      parts.push('- من 0.5 إلى 0.8: غرامة وخصم 5 نقاط');
      parts.push('- من 0.8 إلى 1.5: غرامة، 10 نقاط، تعليق الرخصة حتى 6 أشهر');
      parts.push('- أكثر من 1.5: جريمة جنائية، اعتقال، سحب الرخصة');
    } else if (topic === 'documents' || msg.includes('document') || msg.includes('assicurazione')) {
      parts.push('الوثائق الإجبارية للقيادة:');
      parts.push('1. رخصة القيادة سارية المفعول');
      parts.push('2. دفتر السيارة (Carta di circolazione)');
      parts.push('3. شهادة التأمين RCA');
      parts.push('العقوبات في حالة عدم وجود الوثائق:');
      parts.push('- بدون رخصة: غرامة من 5,000 إلى 30,000 يورو ومصادرة السيارة');
      parts.push('- بدون تأمين: غرامة من 866 إلى 3,466 يورو ومصادرة السيارة');
    } else if (topic === 'signs' || msg.includes('segnal') || msg.includes('cartello')) {
      parts.push('أنواع العلامات المرورية في إيطاليا:');
      parts.push('1. علامات إلزامية - شكل دائري، خلفية زرقاء (مثل: اتجاه إلزامي، طريق واحد)');
      parts.push('2. علامات منع - شكل دائري، حافة حمراء، خلفية بيضاء (مثل: منع الدخول، منع الوقوف)');
      parts.push('3. علامات خطر - شكل مثلث، حافة بيضاء، خلفية حمراء (مثل: منعطف، ضيق، ممر سكة حديدية)');
      parts.push('4. علامات الأفضلية - مثلث مقلوب (أعط الأفضلية) أو ثماني (STOP)');
      parts.push('5. علامات إرشادية - مستطيلة، توفر معلومات مفيدة');
      parts.push('6. لوحات تكميلية - مستطيلة، تكمل العلامة الرئيسية');
      parts.push('7. علامات مؤقتة - خلفية صفراء، تُستخدم في مواقع العمل');
    } else if (topic === 'parking' || msg.includes('parchegg') || msg.includes('sosta')) {
      parts.push('قواعد الوقوف والركن:');
      parts.push('يُمنع الركن في:');
      parts.push('- مداخل المباني (Passi carrabili)');
      parts.push('- ممرات المشاة (الخطوط)');
      parts.push('- الصف المزدوج');
      parts.push('- بالقرب من المنعطفات والتقاطعات');
      parts.push('- أمام منحدرات ذوي الإعاقة');
      parts.push('- المناطق ذات الخطوط الصفراء (وقوف محجوز)');
      parts.push('الخطوط الزرقاء = موقف مدفوع، الخطوط البيضاء = موقف مجاني.');
    } else if (topic === 'priority' || msg.includes('precedenza') || msg.includes('rotatoria')) {
      parts.push('قواعد الأفضلية:');
      parts.push('1. الأفضلية لليمين: في التقاطعات بدون إشارات');
      parts.push('2. إشارة STOP: يجب التوقف تماماً وإعطاء الأفضلية');
      parts.push('3. إشارة "أعط الأفضلية": ابطئ وأعط الطريق بدون توقف إجباري');
      parts.push('4. الدوار: من هو بالداخل له الأفضلية على من يريد الدخول');
      parts.push('5. الطريق ذو الأولوية: يُشير إليه إشارة مربعة مائلة');
      parts.push('6. مركبات الطوارئ مع السيرينا: دائماً لهم الأفضلية');
      parts.push('7. الحافلات: لهم الأفضلية عند الانطلاق من المحطة');
      parts.push('8. المشاة: دائماً الأفضلية على ممرات المشاة');
    } else if (topic === 'lights' || msg.includes('luci') || msg.includes('fari')) {
      parts.push('قواعد استخدام الأنوار:');
      parts.push('أنوار التمانح (إجبارية):');
      parts.push('- من الغسق إلى الفجر');
      parts.push('- في الأنفاق');
      parts.push('- في حال الضباب والمطر والثلج');
      parts.push('أنوار المواجهة (عند الإمكان فقط):');
      parts.push('- خارج المناطق السكنية بدون سيارات أمامك');
      parts.push('- لا تستخدمها في الضباب (تسبب انعكاس)');
      parts.push('- لا تستخدمها مع سيارات أمامية أو قادمة من الاتجاه المعاكس');
      parts.push('أنوار التمييز: تُستخدم فقط عند الوقوف');
    } else if (topic === 'safety' || msg.includes('cintura') || msg.includes('casco')) {
      parts.push('معدات السلامة الإجبارية:');
      parts.push('حزام الأمان:');
      parts.push('- إجباري لجميع الركاب (أمام وخلف)');
      parts.push('- الأطفال أقل من 150 سم: مقعد مناسب');
      parts.push('- الغرامة: 80-323 يورو + 5 نقاط');
      parts.push('الخوذة: إجبارية للدراجات النارية والسكوتر');
      parts.push('الجاكيت العاكس: إجباري خارج المناطق السكنية ليلاً وفي الأنفاق');
      parts.push('مثلث الطوارئ: على الأقل 50 متر قبل السيارة');
    } else if (topic === 'exam' || msg.includes('esame') || msg.includes('quiz')) {
      parts.push('امتحان رخصة القيادة B:');
      parts.push('1. اختبار نظري: 30 سؤال صح/خطأ');
      parts.push('2. الوقت: 30 دقيقة');
      parts.push('3. للنجاح: أقصى 3 أخطاء (يجب الإجابة على 27 صح على الأقل)');
      parts.push('4. المواضيع: العلامات، القواعد، الأفضلية، السرعة، الوثائق، الإسعافات الأولية');
      parts.push('5. إذا رسخت يمكنك إعادة المحاولة بعد شهر واحد');
      parts.push('نصيحة: أجب بهدوء، اقرأ كلمات "دائماً" و"أبداً" بعناية.');
    } else if (topic === 'tires' || msg.includes('gomma') || msg.includes('pneumatico')) {
      parts.push('قواعد الإطارات:');
      parts.push('- الحد الأدنى لعمق المداس: 1.6 مم');
      parts.push('- الإطارات البالية: خطر الانزلاق على الماء وزيادة مسافة الفرملة');
      parts.push('- إطارات الشتاء: إجبارية من 15 نوفمبر إلى 15 أبريل في مناطق كثيرة');
      parts.push('- سلاسل الثلج: بديل لإطارات الشتاء');
      parts.push('- ضغط الهواء: تحقق مرة واحدة شهرياً على الأقل');
    } else if (topic === 'distance' || msg.includes('distanza') || msg.includes('fren')) {
      parts.push('مسافات الأمان والفرملة:');
      parts.push('مسافة الأمان الدنيا:');
      parts.push('- عند 50 كم/س: 25 متر');
      parts.push('- عند 90 كم/س: 60 متر');
      parts.push('- عند 110 كم/س: 100 متر');
      parts.push('- عند 130 كم/س: 130 متر');
      parts.push('في حال المطر أو الثلج، اضرب المسافة في 2!');
      parts.push('القاعدة العملية: حافظ على مسافة ثانيتين على الأقل من السيارة التي أمامك.');
    } else if (topic === 'phone' || msg.includes('telefon') || msg.includes('cellular')) {
      parts.push('قواعد استخدام الهاتف أثناء القيادة:');
      parts.push('- يُمنع استخدام الهاتف المحمول باليد أثناء القيادة');
      parts.push('- يمكنك استخدام السماعة أو البلوتوث');
      parts.push('- الغرامة: 165-660 يورو وخصم 5 نقاط');
      parts.push('- في حالة تكرار المخالفة: تعليق الرخصة حتى 3 أشهر');
    } else if (topic === 'direction') {
      parts.push('علامات الاتجاه الإلزامي:');
      parts.push('- شكلها دائري بخلفية زرقاء');
      parts.push('- اتجاه واحد (Senso unico): يجب أن تسلك الاتجاه المشار إليه');
      parts.push('- الانعطاف الإلزامي لليمين/اليسار: يجب الانعطاف بالاتجاه المحدد');
      parts.push('- المضي قدماً إلزامياً: يجب المتابعة بشكل مستقيم');
      parts.push('اسمها بالايطالي: Segnali di obbligo');
    } else if (topic === 'children' || msg.includes('bambin') || msg.includes('seggiolin')) {
      parts.push('قواعد الأطفال في السيارة:');
      parts.push('- الأطفال أقل من 150 سم يجب أن يجلسوا في مقعد مناسب');
      parts.push('- لا تستخدم المقعد أماماً إذا كان الوسادة الهوائية مفعلة');
      parts.push('- الأطفال أقل من 12 سنة لا يجلسون أماماً إلا في حالات محددة');
    } else if (topic === 'drugs' || msg.includes('drog')) {
      parts.push('المخدرات والقيادة:');
      parts.push('- القيادة تحت تأثير المخدرات جريمة خطيرة');
      parts.push('- تعليق الرخصة من 6 أشهر إلى سنتين');
      parts.push('- يتم الفحص بتحليل الدم أو البول أو اللعاب');
      parts.push('- عقوبات جنائية وغرامات كبيرة');
    } else if (topic === 'tunnel' || msg.includes('galleria')) {
      parts.push('قواعد الأنفاق:');
      parts.push('- أنوار التمانح إجبارية');
      parts.push('- احترم حد السرعة المشار إليه');
      parts.push('- حافظ على مسافة الأمان');
      parts.push('- لا تتوقف داخل النفق إلا للطوارئ');
    } else if (topic === 'bus' || msg.includes('autobus')) {
      parts.push('قواعد وسائل النقل العام:');
      parts.push('- الحافلات لها الأفضلية عند الانطلاق من المحطة');
      parts.push('- لا تتجاوز حافلة متوقفة لصعود/نزول الركاب');
    } else if (topic === 'emergency' || msg.includes('emergenza') || msg.includes('ambulanza')) {
      parts.push('مركبات الطوارئ:');
      parts.push('- الإسعاف والشرطة والدرك مع السيرينا: دائماً الأفضلية');
      parts.push('- يجب التنحي والتوقف عند الضرورة');
      parts.push('- لا تتبعها أبداً عن قرب');
    } else if (topic === 'overtaking' || msg.includes('sorpass')) {
      parts.push('قواعد التجاوز:');
      parts.push('- التجاوز دائماً من اليسار');
      parts.push('- يُمنع التجاوز في المنعطفات والتقاطعات والخط المستمر');
      parts.push('- استخدم مؤشر الاتجاه قبل وبعد التجاوز');
    } else if (topic === 'pedestrian' || msg.includes('pedon')) {
      parts.push('قواعد المشاة:');
      parts.push('- المشاة لهم دائماً الأفضلية على ممرات المشاة');
      parts.push('- يجب التوقف وانتظار إكمال العبور');
    } else if (topic === 'weather' || msg.includes('nebbia') || msg.includes('pioggia')) {
      parts.push('القيادة في الظروف الجوية السيئة:');
      parts.push('- ضباب: استخدم أنوار التمانح، قلل السرعة، زد مسافة الأمان');
      parts.push('- مطر: السرعة على الطريق السريعة تنخفض إلى 110 كم/س');
      parts.push('- لا تستخدم أنوار المواجهة في الضباب');
    } else {
      // Smart conversational fallback - try to extract any useful context
      const greetings = ['مرحبا', 'مرحب', 'سلام', 'هلا', 'اهلا', 'أهلا', 'مساء', 'صباح', 'هاي', 'الو'];
      const isGreeting = greetings.some(g => msg.includes(g));

      if (isGreeting) {
        parts.push('أهلاً وسهلاً! 🙋‍♂️');
        parts.push('أنا جاهز لمساعدتك في رخصة القيادة B الإيطالية!');
        parts.push('يمكنك سؤالي عن أي موضوع مثل: السرعة، العلامات، الأفضلية، الامتحان، الكحول، الوثائق...');
        parts.push('اكتب سؤالك وسأجيبك مباشرة!');
      } else {
        parts.push('سؤال جيد! 🤔 للأسف لم أتمكن من تحليل سؤالك بدقة.');
        parts.push('يمكنك تجربة السؤال بشكل آخر، مثل:');
        parts.push('- "كم سرعة الطريق السريع؟"');
        parts.push('- "ما هي أنواع العلامات؟"');
        parts.push('- "شرح الأفضلية في الدوار"');
        parts.push('- "ما عقوبة الكحول؟"');
        parts.push('أو اكتب موضوع محدد وسأساعدك فوراً!');
      }
    }
  } else {
    // === ITALIAN RESPONSES ===
    if (topic === 'speed' || msg.includes('velocita') || msg.includes('km/h') || msg.includes('limite di velocita')) {
      parts.push('Ecco i limiti di velocita\' in Italia per la patente B:');
      parts.push('- Zona urbana: 50 km/h');
      parts.push('- Strada extraurbana secondaria: 90 km/h');
      parts.push('- Strada extraurbana principale: 110 km/h');
      parts.push('- Autostrada: 130 km/h (110 km/h in caso di pioggia)');
      parts.push('- Neopatentati: 100 km/h su strade extraurbane e autostrada');
      parts.push('Superare il limite comporta multe da 42 a 3.366 euro e decurtazione punti.');
    } else if (topic === 'alcohol' || msg.includes('alcol') || msg.includes('bere') || msg.includes('birra') || msg.includes('vino') || msg.includes('tasso')) {
      parts.push('Norme sull\'alcol alla guida in Italia:');
      parts.push('- Tasso normale consentito: 0.5 g/l');
      parts.push('- Neopatentati e conducenti professionali: 0.0 g/l (tasso zero assoluto)');
      parts.push('- Da 0.5 a 0.8 g/l: multa e 5 punti in meno');
      parts.push('- Da 0.8 a 1.5 g/l: multa, 10 punti, sospensione patente fino a 6 mesi');
      parts.push('- Oltre 1.5 g/l: reato penale, arresto, revoca patente');
      parts.push('Il tasso si misura con l\'etilometro. Puoi rifiutarti ma la sanzione e\' piu\' grave.');
    } else if (topic === 'documents' || msg.includes('document') || msg.includes('assicurazione') || msg.includes('libretto')) {
      parts.push('Documenti obbligatori per guidare:');
      parts.push('1. Patente di guida in corso di validita\'');
      parts.push('2. Libretto di circolazione (carta di circolazione)');
      parts.push('3. Certificato di assicurazione RCA');
      parts.push('La mancanza di documenti comporta:');
      parts.push('- Senza patente: sanzione da 5.000 a 30.000 euro e sequestro del veicolo');
      parts.push('- Senza assicurazione: multa da 866 a 3.466 euro e sequestro del veicolo');
    } else if (topic === 'signs' || msg.includes('segnal') || msg.includes('cartello') || msg.includes('tipo') || msg.includes('categoria')) {
      parts.push('Le categorie dei segnali stradali italiani:');
      parts.push('1. Segnali di obbligo - forma circolare, sfondo blu (es. senso obbligatorio, direzione obbligatoria)');
      parts.push('2. Segnali di divieto - forma circolare, bordo rosso, sfondo bianco (es. divieto di accesso, divieto di sosta)');
      parts.push('3. Segnali di pericolo - forma triangolare, bordo bianco, sfondo rosso (es. curva, strettoia, passaggio a livello)');
      parts.push('4. Segnali di precedenza - triangolo rovesciato (dare precedenza) o ottagono (STOP)');
      parts.push('5. Segnali di indicazione - rettangolari, forniscono informazioni utili');
      parts.push('6. Pannelli integrativi - rettangolari, completano il segnale principale');
      parts.push('7. Segnali temporanei - sfondo giallo, usati in cantieri');
    } else if (topic === 'parking' || msg.includes('parchegg') || msg.includes('sosta') || msg.includes('dove posso')) {
      parts.push('Regole su parcheggio e sosta:');
      parts.push('E\' VIETATO parcheggiare:');
      parts.push('- Sui passi carrabili');
      parts.push('- Sugli attraversamenti pedonali (strisce)');
      parts.push('- In doppia fila');
      parts.push('- Nei pressi di curve, incroci e passaggi a livello');
      parts.push('- Davanti a rampe per disabili');
      parts.push('- In zone con strisce gialle (sosta riservata)');
      parts.push('Le strisce blu indicano parcheggio a pagamento, le bianche parcheggio libero.');
      parts.push('La sosta e\' consentita nel senso di marcia, non contromano.');
    } else if (topic === 'priority' || msg.includes('precedenza') || msg.includes('chi passa') || msg.includes('incrocio') || msg.includes('rotatoria')) {
      parts.push('Regole di precedenza:');
      parts.push('1. Precedenza a DESTRA: vale negli incroci non regolamentati (senza segnali)');
      parts.push('2. Segnale STOP: devi FERMARTI completamente e dare la precedenza');
      parts.push('3. Segnale "Dare precedenza": rallenta e dai strada, senza fermarti obbligatoriamente');
      parts.push('4. ROTATORIA: chi e\' gia\' dentro ha la precedenza su chi vuole entrare');
      parts.push('5. Strada prioritaria: indicata dal segnale quadrato diamantato');
      parts.push('6. Mezzi d\'emergenza (ambulanza, vigili, polizia) con sirena: sempre precedenza');
      parts.push('7. Autobus: hanno precedenza quando ripartono dalla fermata');
      parts.push('8. Pedoni: sempre precedenza sugli attraversamenti pedonali');
    } else if (topic === 'lights' || msg.includes('luci') || msg.includes('fari') || msg.includes('abbagliant') || msg.includes('anabbagliant')) {
      parts.push('Regole sull\'uso delle luci:');
      parts.push('ANABBAGLIANTI (obbligatori):');
      parts.push('- Tra il tramonto e l\'alba');
      parts.push('- In gallerie');
      parts.push('- In caso di nebbia, pioggia, neve');
      parts.push('- In tutti i casi di visibilita\' ridotta');
      parts.push('ABBAGLIANTI (solo quando possibile):');
      parts.push('- Fuori dai centri abitati se non ci sono veicoli davanti');
      parts.push('- NON usarli in nebbia (creano effetto specchio)');
      parts.push('- NON usarli se ci sono veicoli davanti o in senso opposto');
      parts.push('LUCI DI POSIZIONE: usate solo in sosta o fermata');
    } else if (topic === 'safety' || msg.includes('cintura') || msg.includes('seggiolino') || msg.includes('casco') || msg.includes('equipaggiamento') || msg.includes('giubbotto')) {
      parts.push('Equipaggiamento di sicurezza obbligatorio:');
      parts.push('CINTURA DI SICUREZZA:');
      parts.push('- Obbligatoria per tutti i passeggeri (davanti e dietro)');
      parts.push('- Bambini sotto 150 cm: seggiolino omologato');
      parts.push('- Multa: 80-323 euro + 5 punti');
      parts.push('CASCO:');
      parts.push('- Obbligatorio per ciclomotori e motocicli');
      parts.push('- Deve essere omologato ECE 22.05');
      parts.push('GIUBBOTTO RIFLETTENTE:');
      parts.push('- Obbligatorio fuori dal centro abitato, di notte o in galleria');
      parts.push('- Deve essere indossato quando si scende dal veicolo');
      parts.push('TRIANGOLO D\'EMERGENZA: almeno 50 metri prima del veicolo');
      parts.push('ESTINTORE: obbligatorio per veicoli con piu\' di 9 posti');
    } else if (topic === 'exam' || msg.includes('esame') || msg.includes('quiz') || msg.includes('prova') || msg.includes('come si')) {
      parts.push('L\'esame della patente B:');
      parts.push('1. Quiz teorico: 30 domande vero/falso');
      parts.push('2. Tempo: 30 minuti');
      parts.push('3. Per superare: max 3 errori (devi farne almeno 27 giuste)');
      parts.push('4. Argomenti: segnali, norme, precedenze, velocita\', documenti, primo soccorso');
      parts.push('5. Se fallisci puoi riprovare dopo 1 mese');
      parts.push('6. Puoi esercitarti con i quiz ministeriali ufficiali');
      parts.push('Consiglio: rispondi con calma, leggi bene le parole "sempre" e "mai".');
    } else if (topic === 'tires' || msg.includes('gomma') || msg.includes('pneumatico') || msg.includes('ruota') || msg.includes('inverno')) {
      parts.push('Regole sui pneumatici:');
      parts.push('- Battistrada minimo: 1.6 mm di profondita\'');
      parts.push('- Gomme lisce: rischio di aquaplaning e aumento spazio di frenata');
      parts.push('- Gomme invernali: obbligatorie dal 15 novembre al 15 aprile in molte zone');
      parts.push('- Catene da neve: alternative alle gomme invernali, da tenere sul veicolo');
      parts.push('- Pressione: controlla almeno una volta al mese');
      parts.push('- Gomme mischiate (estate+inverno): vietate sullo stesso asse');
    } else if (topic === 'distance' || msg.includes('distanza') || msg.includes('fren') || msg.includes('spazio')) {
      parts.push('Distanze di sicurezza e frenata:');
      parts.push('La distanza di sicurezza MINIMA e\':');
      parts.push('- A 50 km/h: 25 metri');
      parts.push('- A 90 km/h: 60 metri');
      parts.push('- A 110 km/h: 100 metri');
      parts.push('- A 130 km/h: 130 metri');
      parts.push('In caso di pioggia o neve, raddoppia la distanza!');
      parts.push('Regola pratica: mantieni almeno 2 secondi di distanza dal veicolo precedente.');
    } else if (topic === 'phone' || msg.includes('telefon')) {
      parts.push('Regole sull\'uso del telefono:');
      parts.push('- Vietato usare il cellulare in mano mentre si guida');
      parts.push('- Puoi usare viva-voce o auricolari Bluetooth');
      parts.push('- Multa: 165-660 euro + 5 punti');
    } else if (topic === 'direction') {
      parts.push('Segnali di obbligo direzionale:');
      parts.push('- Forma circolare con sfondo blu');
      parts.push('- Senso unico: devi seguire la direzione indicata');
      parts.push('- Curva obbligatoria destra/sinistra: devi girare nella direzione indicata');
      parts.push('- Dritto obbligatorio: devi proseguire in avanti');
    } else {
      // Smart conversational fallback for Italian
      const greetings = ['ciao', 'buongiorno', 'buonasera', 'salve', 'hey'];
      const isGreeting = greetings.some(g => msg.includes(g));

      if (isGreeting) {
        parts.push('Ciao! 👋');
        parts.push('Sono pronto ad aiutarti con la patente B!');
        parts.push('Chiedimi qualsiasi cosa: velocita\', segnali, precedenze, esame, alcol, documenti...');
        parts.push('Scrivi la tua domanda e ti rispondo subito!');
      } else {
        parts.push('Buona domanda! 🤔 Non sono riuscito ad analizzarla con precisione.');
        parts.push('Prova a chiedere in modo diverso, ad esempio:');
        parts.push('- "Qual e\' il limite di velocita\' in autostrada?"');
        parts.push('- "Quanti tipi di segnali esistono?"');
        parts.push('- "Spiegami le precedenze nella rotatoria"');
        parts.push('- "Qual e\' la sanzione per l\'alcol?"');
        parts.push('Scrivi un argomento specifico e ti aiuto subito!');
      }
    }
  }

  return parts.join('\n');
}

// ============================================================
// STUDY PLAN ENGINE
// ============================================================
function generateStudyPlan(chapters: { id: number; name: string; answered: number; correct: number; wrong: number; total: number; pct: number }[], totalAnswered: number, accuracy: number): { plan: { day: string; chapterId: number; chapterName: string; reason: string; questionCount: number }[]; summary: string } {
  // Sort by error rate (chapters with most errors first)
  const weak = chapters.filter(c => c.wrong > 0 && c.answered > 0).sort((a, b) => {
    const rateA = a.wrong / a.answered;
    const rateB = b.wrong / b.answered;
    return rateB - rateA;
  });

  const unstarted = chapters.filter(c => c.answered === 0);

  const days = ['Lunedi', 'Martedi', 'Mercoledi', 'Giovedi', 'Venerdi', 'Sabato', 'Domenica'];
  const plan: { day: string; chapterId: number; chapterName: string; reason: string; questionCount: number }[] = [];

  // Priority 1: Chapters with most errors (repeat them)
  for (const ch of weak.slice(0, 3)) {
    const errRate = Math.round((ch.wrong / ch.answered) * 100);
    plan.push({
      day: days[plan.length % 7],
      chapterId: ch.id,
      chapterName: ch.name,
      reason: `Tasso di errore: ${errRate}% (${ch.wrong} errori su ${ch.answered} domande). Ripassa per migliorare.`,
      questionCount: ch.total,
    });
  }

  // Priority 2: Unstarted chapters
  for (const ch of unstarted.slice(0, 2)) {
    plan.push({
      day: days[plan.length % 7],
      chapterId: ch.id,
      chapterName: ch.name,
      reason: 'Non hai ancora risposto a nessuna domanda di questo capitolo. Inizia a esercitarti!',
      questionCount: ch.total,
    });
  }

  // Priority 3: Chapters with partial progress
  const partial = chapters.filter(c => c.pct > 0 && c.pct < 100 && !weak.includes(c)).sort((a, b) => a.pct - b.pct);
  for (const ch of partial.slice(0, 2)) {
    plan.push({
      day: days[plan.length % 7],
      chapterId: ch.id,
      chapterName: ch.name,
      reason: `Hai completato solo il ${ch.pct}% di questo capitolo. Continua per finirlo.`,
      questionCount: ch.total - ch.answered,
    });
  }

  const summary = accuracy >= 80
    ? 'Ottimo lavoro! Il tuo livello e\' gia\' avanzato. Concentrati solo sui capitoli deboli e fai test simulati regolarmente.'
    : accuracy >= 60
    ? 'Buon livello! Segui il piano di studio per consolidare i tuoi punti deboli e raggiungere il livello da esame.'
    : accuracy >= 30
    ? 'Sei a meta\' strada. Segui il piano di studio giorno per giorno per costruire le tue conoscenze.'
    : 'Non preoccuparti, tutti iniziano da qui! Segui il piano e vedrai miglioramenti rapidi. Rispondi ad almeno 20 domande al giorno.';

  return { plan, summary };
}

// ============================================================
// API HANDLERS
// ============================================================

// ---- 1. Explain wrong answer ----
async function handleExplain(body: {
  action: string;
  question: string;
  correctAnswer: boolean;
  userAnswer: boolean;
  chapterName?: string;
  subtopic?: string;
  hasImage: boolean;
}) {
  const { question, correctAnswer, userAnswer, chapterName, subtopic, hasImage } = body;
  const correctText = correctAnswer ? 'VERO' : 'FALSO';
  const userText = userAnswer ? 'VERO' : 'FALSO';

  try {
    const zai = await ZAI.create();
    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'system', content: `Sei un istruttore di patente B esperto. Quando spieghi un errore, dai SEMPRE informazioni reali e specifiche. Se la domanda riguarda un segnale stradale (ha immagine), identifica il segnale e spiega cosa significa e il suo nome. Se parla di una regola, spiega la regola. Mai dire "rivedi il capitolo" o "studia l'argomento". Rispondi in italiano, massimo 4 frasi, testo semplice, nessun markdown. Dai solo la spiegazione, niente introduzioni.` },
        { role: 'user', content: `Domanda: "${question}"\nCapitolo: ${chapterName || '-'}\nArgomento: ${subtopic || '-'}\nHa immagine di segnale: ${hasImage ? 'SI' : 'NO'}\nRisposta corretta: ${correctText}\nRisposta utente: ${userText}\n\nSpiega PERCHE' la risposta corretta e' ${correctText}. Se c'e' un segnale, spiega il nome del segnale e cosa significa. Dai informazioni reali e utili.` }
      ],
      temperature: 0.2,
      max_tokens: 250,
    });
    const explanation = completion.choices[0]?.message?.content;
    if (explanation && explanation.trim().length > 20 && !explanation.toLowerCase().includes('ripass') && !explanation.toLowerCase().includes('rivedi')) {
      return NextResponse.json({ explanation: explanation.trim(), correctAnswer: correctText });
    }
  } catch (error: unknown) {
    console.error('AI Explain error:', error instanceof Error ? error.message : 'Unknown');
  }

  const smartExplanation = generateSmartExplanation(question, correctAnswer, userAnswer, chapterName, subtopic, hasImage);
  return NextResponse.json({ explanation: smartExplanation, correctAnswer: correctText, fallback: true });
}

// ---- 2. Analyze user performance ----
async function handleAnalyze(body: {
  action: string;
  username: string;
  stats: { totalAnswered: number; totalCorrect: number; totalWrong: number; streak: number; bestStreak: number; examsPassed: number; examsFailed: number };
  chapters: { id: number; name: string; answered: number; correct: number; wrong: number; total: number; pct: number }[];
  wrongTopics: string[];
}) {
  const { username, stats, chapters, wrongTopics } = body;
  const accuracy = stats.totalAnswered > 0 ? Math.round((stats.totalCorrect / stats.totalAnswered) * 100) : 0;
  const weakChapters = chapters.filter(c => c.wrong > 0).sort((a, b) => (b.wrong / b.total) - (a.wrong / a.total)).slice(0, 5);
  const strongChapters = chapters.filter(c => c.answered > 0 && c.correct > 0).sort((a, b) => (b.correct / b.total) - (a.correct / a.total)).slice(0, 5);
  const chaptersList = chapters.map(c => `Cap.${c.id} ${c.name}: ${c.answered}/${c.total} risposte, ${c.correct} corrette, ${c.wrong} sbagliate (${c.total > 0 && c.answered > 0 ? Math.round((c.correct / c.answered) * 100) : 0}%)`).join('\n');

  try {
    const zai = await ZAI.create();
    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'system', content: 'Sei un istruttore di patente B italiano esperto nell\'analisi delle prestazioni. Rispondi solo con JSON valido, senza markdown o backticks.' },
        { role: 'user', content: `Analizza le prestazioni dello studente ${username}.\nRisposte: ${stats.totalAnswered}, Corrette: ${stats.totalCorrect}, Sbagliate: ${stats.totalWrong}, Accuratezza: ${accuracy}%\nSerie migliore: ${stats.bestStreak}, Esami: ${stats.examsPassed}/${stats.examsPassed + stats.examsFailed}\nArgomenti con piu\' errori: ${wrongTopics.join(', ') || 'Nessuno'}\n${chaptersList}\n\nRispondi in JSON valido con questo formato:\n{"level":"principiante|intermedio|avanzato|esperto","levelEmoji":"emoji","levelTitle":"titolo","overallScore":0-100,"summary":"riassunto","strengths":[{"chapter":"nome","text":"testo"}],"weaknesses":[{"chapter":"nome","text":"testo"}],"recommendations":["r1","r2","r3"],"tips":["t1","t2"],"motivation":"frase","examScore":0-30}\nTutto in italiano. Massimo 3 strengths e 3 weaknesses. examScore e\' il punteggio previsto all\'esame (su 30 domande, 30 = perfetto).` }
      ],
      temperature: 0.4,
      max_tokens: 1000,
    });
    let content = completion.choices[0]?.message?.content || '';
    content = content.trim();
    if (content.startsWith('```')) content = content.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    const analysis = JSON.parse(content);
    if (analysis.level && analysis.summary) return NextResponse.json(analysis);
    throw new Error('Invalid AI response');
  } catch (error: unknown) {
    console.error('AI Analyze error:', error instanceof Error ? error.message : 'Unknown');
  }

  const level = accuracy < 30 ? 'principiante' : accuracy < 60 ? 'intermedio' : accuracy < 80 ? 'avanzato' : 'esperto';
  const levelEmoji = accuracy < 30 ? '\uD83C\uDF31' : accuracy < 60 ? '\uD83D\uDCC8' : accuracy < 80 ? '\uD83C\uDFAF' : '\uD83C\uDFC6';
  const predictedExamScore = accuracy >= 90 ? 30 : accuracy >= 85 ? 29 : accuracy >= 80 ? 28 : accuracy >= 75 ? 26 : accuracy >= 70 ? 24 : accuracy >= 60 ? 20 : accuracy >= 50 ? 16 : 10;

  return NextResponse.json({
    level, levelEmoji,
    levelTitle: `Livello ${level.charAt(0).toUpperCase() + level.slice(1)}`,
    overallScore: accuracy,
    examScore: predictedExamScore,
    summary: stats.totalAnswered < 50
      ? `Hai risposto solo ${stats.totalAnswered} domande finora. Esercitati di piu' per avere un'analisi precisa! Al momento la tua accuratezza e' del ${accuracy}%.`
      : `Hai risposto a ${stats.totalAnswered} domande con un'accuratezza del ${accuracy}%. ${accuracy >= 70 ? 'Ottimo lavoro! Sei sulla strada giusta per superare l\'esame.' : 'Continua a esercitarti, concentrati sui capitoli piu\' difficili.'}`,
    strengths: strongChapters.slice(0, 3).map(c => ({ chapter: c.name, text: `Ottima performance: ${Math.round((c.correct / c.answered) * 100)}% di risposte corrette su ${c.answered} domande.` })),
    weaknesses: weakChapters.slice(0, 3).map(c => ({ chapter: c.name, text: `${c.wrong} errori su ${c.answered} domande (${Math.round((c.wrong / c.answered) * 100)}% di errori). Concentrati su questo capitolo.` })),
    recommendations: weakChapters.length > 0
      ? [`Pratica il capitolo "${weakChapters[0].name}" che ha il tasso di errore piu' alto`, `Ripeti le domande che hai sbagliato`, stats.totalAnswered < 50 ? 'Rispondi ad almeno 50 domande per una valutazione piu\' precisa' : 'Fai un test simulato di 30 domande per verificare il tuo livello']
      : ['Continua a esercitarti su tutti i capitoli', 'Fai almeno 30 domande al giorno', 'Ripeti periodicamente le domande sbagliate'],
    tips: ['Presta attenzione alle parole chiave nella domanda come "sempre", "mai", "eccezione"', 'Quando vedi un segnale stradale, osserva la forma, il colore e la categoria', 'Immagina la situazione reale di guida mentre rispondi alla domanda'],
    motivation: accuracy >= 70 ? 'Sei quasi pronto per l\'esame! Un\'ultimo sforzo e ce la farai!' : 'Ogni domanda che rispondi ti avvicina al tuo obiettivo. Non arrenderti!',
    fallback: true,
  });
}

// ---- 3. AI Chat ----
async function handleChat(body: { action: string; message: string; history?: { role: string; content: string }[] }) {
  const { message, history = [] } = body;
  const replyArabic = wantsArabicResponse(message);

  // Build system prompt based on detected language
  const systemPrompt = replyArabic
    ? `أنت مساعد ذكي ومتخصص في امتحان رخصة القيادة B في إيطاليا. أنت تفاعلي وودود.

قواعد مهمة:
- أجب ALWAYS باللغة العربية
- كن تفاعلي: اعترف بسؤال المستخدم أولاً ثم أجب
- أضف أمثلة عملية من الحياة اليومية
- اذكر المصطلحات الإيطالية بين قوسين للمساعدة في التعلم
- استخدم النقاط والإيموجي المناسبة لتنظيم الإجابة
- إذا سأل عن شيء غير متعلق برخصة القيادة، رد بلطف ووجهه للمواضيع المتاحة
- لا تقل أبداً "مرحباً أنا مساعدك" أو تعطي قائمة عامة - أجب مباشرة على السؤال
- كن محدداً: أعطِ أرقاماً وقوانين حقيقية

مجال تخصصك الكامل:
- قانون الطريق الإيطالي (Codice della Strada)
- العلامات المرورية بجميع أنواعها (7 أنواع)
- حدود السرعة (50/90/110/130)
- قواعد الأفضلية والحوارات
- الكحول والمخدرات (0.5 غ/ل عادي، 0.0 للجدد)
- الوثائق (رخصة، دفتر سيارة، تأمين)
- الإسعافات الأولية ومعدات السلامة
- الإطارات والأنوار واستخدام الهاتف
- امتحان رخصة القيادة (30 سؤال، 3 أخطاء كحد أقصى)
- قواعد التجاوز والوقوف والركن
- القيادة في الظروف الجوية السيئة
- نقاط الرخصة والعقوبات`
    : `Sei un assistente virtuale esperto e interattivo per l'esame della patente B in Italia.

Regole importanti:
- Rispondi SEMPRE in italiano
- Sii interattivo: riconosci la domanda dell'utente prima di rispondere
- Aggiungi esempi pratici dalla vita quotidiana
- Usa elenchi puntati e emoji per organizzare la risposta
- Se la domanda non riguarda la guida, rispondi cortesemente e reindirizza agli argomenti disponibili
- NON dire mai "Ciao! Sono il tuo assistente" o dare una lista generica - rispondi direttamente alla domanda
- Sii specifico: dai numeri e leggi reali

Il tuo ambito di competenza:
- Codice della Strada italiano
- Segnali stradali di tutti i tipi (7 categorie)
- Limiti di velocità (50/90/110/130)
- Regole di precedenza e rotatorie
- Alcol e droghe (0.5 g/l normale, 0.0 neopatentati)
- Documenti (patente, libretto, assicurazione)
- Primo soccorso ed equipaggiamento di sicurezza
- Pneumatici, luci, uso del telefono
- Esame patente B (30 domande, max 3 errori)
- Sorpasso, sosta, parcheggio
- Guida in condizioni meteorologiche avverse
- Punti patente e sanzioni`;

  // === PRIMARY: Use AI SDK for true conversational response ===
  try {
    const zai = await ZAI.create();
    const messages: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
      { role: 'system', content: systemPrompt },
      ...history.slice(-8) as { role: 'system' | 'user' | 'assistant'; content: string }[],
      { role: 'user', content: message },
    ];
    const completion = await zai.chat.completions.create({
      messages,
      temperature: 0.6,
      max_tokens: 800,
    });
    const reply = completion.choices[0]?.message?.content;
    if (reply && reply.trim().length > 15) {
      // Verify language matches user expectation
      if (replyArabic && !/[\u0600-\u06FF]/.test(reply)) {
        console.log('AI replied in wrong language, using fallback');
      } else {
        return NextResponse.json({ reply: reply.trim(), fallback: false });
      }
    }
  } catch (error: unknown) {
    console.error('AI Chat error, using smart fallback:', error instanceof Error ? error.message : 'Unknown');
  }

  // === SMART FALLBACK: Contextual keyword-based responses ===
  const smartReply = generateChatAnswer(message);
  return NextResponse.json({ reply: smartReply, fallback: true });
}

// ---- 4. Hint for current question ----
async function handleHint(body: { action: string; question: string; chapterName?: string; subtopic?: string; hasImage: boolean }) {
  const { question, chapterName, subtopic, hasImage } = body;

  try {
    const zai = await ZAI.create();
    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'system', content: `Sei un istruttore di patente B. Dai un INDIZIO breve per aiutare lo studente a rispondere correttamente. NON dire la risposta corretta (VERO/FALSO). Usa max 2 frasi. Rispondi in italiano. Se c'e' un'immagine di segnale, suggerisci di osservare la forma e il colore. Nessun markdown.` },
        { role: 'user', content: `Domanda: "${question}"\nCapitolo: ${chapterName || '-'}\nArgomento: ${subtopic || '-'}\nHa immagine: ${hasImage ? 'SI' : 'NO'}\n\nDai un indizio breve che aiuti a capire la risposta senza rivelarla.` }
      ],
      temperature: 0.3,
      max_tokens: 150,
    });
    const hint = completion.choices[0]?.message?.content;
    if (hint && hint.trim().length > 15 && !hint.toLowerCase().includes('vero') && !hint.toLowerCase().includes('falso')) {
      return NextResponse.json({ hint: hint.trim(), fallback: false });
    }
  } catch (error: unknown) {
    console.error('AI Hint error:', error instanceof Error ? error.message : 'Unknown');
  }

  const smartHint = generateSmartHint(question, chapterName, subtopic, hasImage);
  return NextResponse.json({ hint: smartHint, fallback: true });
}

// ---- 5. Study Plan ----
async function handleStudyPlan(body: {
  action: string;
  username: string;
  stats: { totalAnswered: number; totalCorrect: number; totalWrong: number; streak: number; bestStreak: number; examsPassed: number; examsFailed: number };
  chapters: { id: number; name: string; answered: number; correct: number; wrong: number; total: number; pct: number }[];
  wrongTopics: string[];
}) {
  const { stats, chapters } = body;
  const accuracy = stats.totalAnswered > 0 ? Math.round((stats.totalCorrect / stats.totalAnswered) * 100) : 0;
  const { plan, summary } = generateStudyPlan(chapters, stats.totalAnswered, accuracy);

  return NextResponse.json({
    plan,
    summary,
    accuracy,
    totalAnswered: stats.totalAnswered,
    fallback: false,
  });
}

// ============================================================
// 6. LOCAL ITALIAN → ARABIC DICTIONARY
// ============================================================
const IT_AR_DICT: Record<string, string> = {
  // Direzione / movement
  destra: 'يمين', sinistra: 'يسار', avanti: 'أمام', indietro: 'خلف',
  rettilineo: 'خط مستقيم', curva: 'منعطف', tornante: 'منعطف حاد',
  svolta: 'انعطاف', svoltare: 'ينعطف', girare: 'يدور',
  direzione: 'اتجاه', senso: 'اتجاه', verso: 'نحو', diretta: 'مباشر',
  entrare: 'دخول', uscire: 'خروج',
  attraversare: 'يعبر', salita: 'صعود', discesa: 'هبوط',
  superare: 'يتجاوز', sorpasso: 'تجاوز', sorpassare: 'يتجاوز',

  // Veicoli / vehicles
  veicolo: 'مركبة', auto: 'سيارة', automobile: 'سيارة',
  autobus: 'حافلة', tram: 'ترام', camion: 'شاحنة', moto: 'دراجة نارية',
  motociclo: 'دراجة نارية', ciclomotore: 'سكوتر', bicicletta: 'دراجة هوائية',
  furgone: 'شاحنة صغيرة', rimorchio: 'مقطورة', carrello: 'عربة',

  // Strada / road
  strada: 'طريق', carreggiata: 'مسار', corsia: 'حارة',
  marciapiede: 'رصيف', banchina: 'جانب الطريق', cordolo: 'حافة الرصيف',
  incrocio: 'تقاطع', rotatoria: 'دوار', svincolo: 'مخرج',
  autostrada: 'طريق سريع', viadotto: 'جسر',
  ponte: 'جسر', galleria: 'نفق', tunnel: 'نفق',
  rampa: 'منحدر',

  // Segnali / signs
  segnale: 'إشارة', cartello: 'لافتة', segnali: 'إشارات',
  divieto: 'منع', vietato: 'ممنوع', obbligo: 'إلزام',
  obbligatorio: 'إلزامي', precedenza: 'أولوية', pericolo: 'خطر',
  attenzione: 'انتباه', stop: 'قف', indicazione: 'إرشاد',

  // Velocità / speed
  velocita: 'سرعة', veloce: 'سريع', lento: 'بطيء',
  limite: 'حد', accelerare: 'تسريع', rallentare: 'تبطيء',
  frenare: 'فرملة', freno: 'فرامل', frenata: 'كبح',
  km: 'كم', chilometro: 'كيلومتر',

  // Distanza / distance
  distanza: 'مسافة', spazio: 'مسافة', vicino: 'قريب', lontano: 'بعيد',
  metri: 'أمتار', metro: 'متر',

  // Sicurezza / safety
  sicurezza: 'سلامة', casco: 'خوذة', cintura: 'حزام',
  giubbotto: 'جاكيت', seggiolino: 'مقعد', airbag: 'وسادة هوائية',
  estintore: 'طفاية', triangolo: 'مثلث', emergenza: 'طوارئ',

  // Parcheggio / parking
  parcheggio: 'موقف', sosta: 'وقوف', fermare: 'توقف',
  fermata: 'محطة', parcheggiare: 'ركن', posteggio: 'موقف',

  // Luci / lights
  luci: 'أنوار', fari: 'مصابيح', abbaglianti: 'أنوار مواجهة',
  anabbaglianti: 'أنوار تمانح', frecce: 'مؤشرات', indicatori: 'مؤشرات',

  // Pedoni / pedestrians
  pedone: 'مشاة', pedoni: 'مشاة',
  strisce: 'خطوط', passaggio: 'ممر',

  // Documenti / documents
  patente: 'رخصة قيادة', documento: 'وثيقة', libretto: 'دفتر',
  assicurazione: 'تأمين', targa: 'لوحة رقمية',

  // Meteo / weather
  nebbia: 'ضباب', pioggia: 'مطر', neve: 'ثلج', ghiaccio: 'جليد',
  vento: 'رياح', visibilita: 'رؤية',

  // Alcol / substances
  alcol: 'كحول', droga: 'مخدرات', tasso: 'نسبة',

  // Altro / other
  sempre: 'دائماً', mai: 'أبدا', solo: 'فقط', anche: 'أيضاً',
  quando: 'عندما', prima: 'قبل', dopo: 'بعد', durante: 'أثناء',
  tra: 'بين', fino: 'حتى', da: 'من', per: 'لكل / لـ',
  con: 'مع', senza: 'بدون', su: 'على', sotto: 'تحت',
  dentro: 'داخل', fuori: 'خارج', sopra: 'فوق',
  tutti: 'الجميع', nessuno: 'لا أحد', altro: 'آخر',
  puo: 'يمكن', deve: 'يجب', possibile: 'ممكن',
  permesso: 'مسموح', consentito: 'مسموح',
  sufficiente: 'كافي',
  minimo: 'أدنى', massimo: 'أقصى', inferiore: 'أقل', superiore: 'أكثر',
  numero: 'رقم', valore: 'قيمة', grado: 'درجة',
  parte: 'جزء', zona: 'منطقة', area: 'منطقة', luogo: 'مكان',
  tempo: 'وقت', momento: 'لحظة', ora: 'ساعة',
  notte: 'ليل', giorno: 'نهار',
  rosso: 'أحمر', verde: 'أخضر', blu: 'أزرق', giallo: 'أصفر', bianco: 'أبيض', nero: 'أسود',
  alto: 'عالي', basso: 'منخفض', grande: 'كبير', piccolo: 'صغير',
  nuovo: 'جديد', vecchio: 'قديم',
  diritto: 'حق', dovere: 'واجب', responsabilita: 'مسؤولية',
  multa: 'غرامة', sanzione: 'عقوبة', infrazione: 'مخالفة',
  incidente: 'حادث', collisione: 'تصادم', urto: 'ارتطام',
  traffico: 'مرور', congestione: 'ازدحام', coda: 'طابور',
  integrato: 'مدمج', dispositivo: 'جهاز', sistema: 'نظام',
  controllo: 'تحكم', rilevatore: 'كاشف', autovelox: 'كاميرا سرعة',
  stradale: 'مروري', urbano: 'حضري', extraurbano: 'خارج المدينة',
  sterrata: 'غير معبدة', asfalto: 'أسفلت', ghiaia: 'حصى',
  cricca: 'شق', buca: 'حفرة', dissestato: 'متضرر',
  retromarcia: 'رجوع', inversione: 'انعطاف عكسي',
  parziale: 'جزئي', totale: 'كلي',
  regolare: 'منتظم', irregolare: 'غير منتظم',
  temporaneo: 'مؤقت', permanente: 'دائم',
  continuo: 'مستمر', discontinuo: 'متقطع',
  positivo: 'إيجابي', negativo: 'سلبي',
  primo: 'أول', secondo: 'ثاني', terzo: 'ثالث',
  entrambi: 'كلاهما',
  bambini: 'أطفال', bambino: 'طفل', minore: 'قاصر',
  donna: 'امرأة', uomo: 'رجل', persona: 'شخص',
  passeggero: 'راكب', conducente: 'سائق', guidatore: 'سائق',
  pneumatico: 'إطار', gomma: 'إطار', ruota: 'عجلة',
  motore: 'محرك', carburante: 'وقود', benzina: 'بنزين',
  gasolio: 'ديزل', elettrico: 'كهربائي',
  specchio: 'مرآة', retrovisore: 'مرآة خلفية', parabrezza: 'زجاج أمامي',
  portiera: 'باب', finestrino: 'نافذة', cofano: 'غطاء المحرك',
  baule: 'صندوق خلفي', clacson: 'بوق', sirena: 'سيرينا',
  amblianza: 'إسعاف', ambulanza: 'إسعاف', polizia: 'شرطة',
  vigili: 'شرطة بلدية', carabinieri: 'درك',
  passeggeri: 'ركاب', conducenti: 'سائقون',
  accessibile: 'يمكن الوصول', accessibilita: 'إمكانية الوصول',
  disabili: 'ذوي الإعاقة', handicap: 'إعاقة',
  restringimento: 'تضييق', allargamento: 'توسيع',
  sovrappasso: 'جسر علوي', sottopasso: 'نفق سفلي',
  livello: 'مستوى', ferroviario: 'سكة حديدية',
  barriere: 'حواجز', cancellata: 'سور', recinto: 'سياج',
  bretella: 'رابط', raccordo: 'وصلة',
};

function hasArabicChars(text: string): boolean {
  return /[\u0600-\u06FF]/.test(text);
}

async function handleTranslate(body: { action: string; word: string }) {
  const { word } = body;
  if (!word || word.trim().length === 0) {
    return NextResponse.json({ translation: '' });
  }

  const cleaned = word.trim().toLowerCase().replace(/[.,;:!?"'()]/g, '');

  // 1. Check local dictionary first (instant, no API call)
  if (IT_AR_DICT[cleaned]) {
    return NextResponse.json({ translation: IT_AR_DICT[cleaned], source: 'local' });
  }

  // 2. Try AI translation
  try {
    const zai = await ZAI.create();
    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `أنت مترجم من الإيطالية إلى العربية. ترجم الكلمة الإيطالية التالية إلى العربية فقط. أجب بالترجمة العربية فقط بدون أي شرح أو حروف إنجليزية. إذا كانت الكلمة رقماً أو علامة ترقيم أعد الكلمة نفسها. الحد الأقصى 3 كلمات عربية.`
        },
        {
          role: 'user',
          content: cleaned
        }
      ],
      temperature: 0.1,
      max_tokens: 30,
    });

    const translation = completion.choices[0]?.message?.content?.trim() || '';
    // Only accept if it contains actual Arabic characters
    if (translation && hasArabicChars(translation)) {
      return NextResponse.json({ translation, source: 'ai' });
    }
  } catch (error: unknown) {
    console.error('AI Translate error:', error instanceof Error ? error.message : 'Unknown');
  }

  // 3. Fallback: return original word (client should NOT cache this)
  return NextResponse.json({ translation: cleaned, fallback: true });
}
