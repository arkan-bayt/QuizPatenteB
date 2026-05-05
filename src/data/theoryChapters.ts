// ============================================================
// THEORY CHAPTERS DATA - Guida completa alla Patente B
// Italiano soltanto — nessun campo in altre lingue
// ============================================================

export interface TheoryChapter {
  id: number;
  title: string;
  topicGroup: string;
  icon: string;
  color: string;
  overview: string;
  keyPoints: { title: string; description: string }[];
  rules: { title: string; description: string }[];
  commonMistakes: string[];
  memoryTips: string[];
  importantNumbers: { label: string; value: string }[];
}

export interface TheoryTopic {
  name: string;
  icon: string;
  description: string;
  color: string;
}

export const THEORY_TOPICS: TheoryTopic[] = [
  { name: 'Conoscenze generali', icon: '\u{1F4D6}', description: 'Nozioni fondamentali sulla strada, veicoli e comportamento di guida sicuro.', color: '#3B82F6' },
  { name: 'Segnali stradali', icon: '\u{1F6A6}', description: 'Tutti i tipi di segnali stradali: pericolo, divieto, obbligo, precedenza, indicazione e pannelli.', color: '#EF4444' },
  { name: 'Norme di circolazione', icon: '\u{1F6E3}\uFE0F', description: 'Velocit\u00E0, distanze, sorpasso, precedenza, sosta, autostrade e regole di circolazione.', color: '#10B981' },
  { name: 'Equipaggiamento e sicurezza', icon: '\u{1F6BA}', description: 'Luci, cinture di sicurezza, caschi e dispositivi di protezione.', color: '#F59E0B' },
  { name: 'Documenti e norme', icon: '\u{1F4C4}', description: 'Patente a punti, documenti, infortunistica, alcol, responsabilit\u00E0 e ambiente.', color: '#8B5CF6' },
];

export const THEORY_CHAPTERS: TheoryChapter[] = [
  // ============================================================
  // CAPITOLO 1 - Definizioni generali e Doveri del conducente
  // ============================================================
  {
    id: 1,
    title: 'Definizioni generali e Doveri del conducente',
    topicGroup: 'Conoscenze generali',
    icon: '\u{1F4D6}',
    color: '#3B82F6',
    overview: 'Questo capitolo copre le nozioni fondamentali che ogni conducente deve conoscere per ottenere la patente B. Include la classificazione delle strade secondo il Codice della Strada, la classificazione dei veicoli in base alla massa e alla destinazione d\'uso, le posizioni di guida corrette, i diritti e doveri del conducente, e le regole sull\'uso dei dispositivi elettronici. \u00C8 il capitolo pi\u00F9 ampio del quiz con 531 domande e rappresenta la base su cui si costruiscono tutte le altre conoscenze per la patente.',
    keyPoints: [
      { title: 'Classificazione delle strade', description: 'Le strade italiane si dividono in 6 categorie: A (autostrade), B (strade extraurbane principali), C (strade extraurbane secondarie), D (strade urbane di scorrimento), E (strade urbane di quartiere), F (strade locali). Ogni categoria ha limiti di velocit\u00E0 specifici e regole diverse per la circolazione.' },
      { title: 'Classificazione dei veicoli', description: 'I veicoli si classificano in categorie europee: M (trasporto persone fino a 8 posti), N (trasporto merci), O (rimorchi), L (veicoli a 2-3 ruote). La patente B copre la categoria M1 (autovetture fino a 3500 kg con max 8 passeggeri).' },
      { title: 'Posizione di guida corretta', description: 'Il conducente deve sedersi con le braccia leggermente flesse sul volante, le gambe con piegatura naturale sui pedali, lo schienale inclinato a 100-110 gradi. Gli specchietti retrovisori (interno + due esterni) devono essere regolati correttamente per garantire la massima visibilit\u00E0.' },
      { title: 'Diritti e doveri del conducente', description: 'Ogni conducente ha il dovere di guidare con prudenza e rispetto delle regole. Deve avere la patente valida, i documenti del veicolo (libretto di circolazione) e l\'assicurazione RCA. In caso di incidente deve fermarsi, prestare soccorso e fornire le proprie generalit\u00E0.' },
      { title: 'Uso del telefono cellulare', description: '\u00C8 vietato l\'uso del telefono cellulare durante la guida, anche con il vivavoce se non \u00E8 a mani libere. Il navigatore satellitare \u00E8 consentito se montato su supporto fisso e non richiede manipolazione prolungata. Le cuffie auricolari sono vietate in entrambe le orecchie.' },
      { title: 'Patente B: cosa si pu\u00F2 guidare', description: 'La patente B permette di guidare veicoli con massa massima 3500 kg e massimo 8 posti a sedere oltre al conducente. Con rimorchio: max 750 kg se il complesso non supera 4250 kg. Non permette di guidare autobus, camion o motocicli.' },
    ],
    rules: [
      { title: 'Et\u00E0 minima per la patente B', description: '18 anni compiuti. Per i minorenni \u00E8 possibile iniziare la pratica a 17 anni ma la patente diventa valida a 18 anni. Per la patente AM (microcar) l\'et\u00E0 minima \u00E8 14 anni.' },
      { title: 'Documenti obbligatori a bordo', description: 'Patente di guida in corso di validit\u00E0, libretto di circolazione del veicolo, certificato di assicurazione RCA. La mancanza anche di uno solo comporta sanzioni.' },
      { title: 'Divieto di uso del telefono', description: 'Multa da 165 a 661 euro e decurtazione di 5 punti della patente. In caso di incidente con lesioni gravi: sospensione della patente da 1 a 3 mesi.' },
      { title: 'Cinture di sicurezza', description: 'Obbligatorie per conducente e tutti i passeggeri. Multa da 80 a 323 euro e decurtazione di 5 punti per chi non le allaccia.' },
      { title: 'Condizioni psicofisiche', description: '\u00C8 vietato guidare in stato di ubriachezza, sotto effetto di sostanze stupefacenti, o in condizioni fisiche o psichiche inadeguate (stanchezza eccessiva, assunzione di farmaci). Il conducente deve valutare oggettivamente la propria capacit\u00E0.' },
      { title: 'Revisione del veicolo', description: 'La prima revisione \u00E8 obbligatoria dopo 4 anni dall\'immatricolazione, poi ogni 2 anni. La mancata revisione comporta multe da 173 a 694 euro e ritiro del documento di circolazione.' },
    ],
    commonMistakes: [
      'Confondere le categorie di strade (A, B, C, D, E, F) e i rispettivi limiti di velocit\u00E0.',
      'Non ricordare che la patente B copre solo veicoli fino a 3500 kg con rimorchio fino a 750 kg.',
      'Credere che il telefono con vivavoce sia sempre consentito (deve essere a mani libere integrate).',
      'Sottovalutare l\'importanza della posizione di guida corretta per la sicurezza attiva.',
      'Dimenticare che il conducente deve sempre avere con s\u00E9 patente, libretto e assicurazione.',
      'Non sapere che le cuffie sono vietate in entrambe le orecchie (una sola \u00E8 permessa).',
    ],
    memoryTips: [
      'Patente B = 3500 kg + 8 posti. Ricorda "3-5-0-8" come numero di telefono.',
      'Strade: A = Autostrada, B = Buona strada, C = Campagna, D = Decollo urbano veloce, E = Entrata citt\u00E0, F = Fuori mano.',
      'A bordo servono sempre 3 documenti: Patente + Libretto + Assicurazione = PLA.',
      'Telefono = Vietato (manipolazione). Navigatore = Consentito (supporto fisso).',
    ],
    importantNumbers: [
      { label: 'Massa max patente B', value: '3.500 kg' },
      { label: 'Posti max patente B', value: '8 passeggeri + conducente' },
      { label: 'Et\u00E0 minima patente B', value: '18 anni' },
      { label: 'Punti iniziali patente', value: '20 punti' },
      { label: 'Rimorchio max patente B', value: '750 kg' },
      { label: 'Revisione dopo immatricolazione', value: '4 anni, poi ogni 2' },
    ],
  },

  // ============================================================
  // CAPITOLO 2 - Segnali di pericolo
  // ============================================================
  {
    id: 2,
    title: 'Segnali di pericolo',
    topicGroup: 'Segnali stradali',
    icon: '\u26A0\uFE0F',
    color: '#EF4444',
    overview: 'I segnali di pericolo hanno forma triangolare equilatera con il vertice verso l\'alto, bordo rosso e sfondo bianco con simbolo nero. Segnalano pericoli o situazioni di rischio per la circolazione stradale. Devono essere posizionati a distanza adeguata dal pericolo: almeno 150 metri fuori dai centri abitati. Il conducente deve aumentare l\'attenzione, ridurre la velocit\u00E0 e prepararsi a manovra di emergenza.',
    keyPoints: [
      { title: 'Forma e caratteristiche', description: 'Triangolo equilatero con bordo rosso, sfondo bianco e simbolo nero. Il vertice \u00E8 rivolto verso l\'alto. Devono essere posti in modo visibile e non ostruito dalla vegetazione o altri ostacoli. La distanza di posizionamento varia: 150m fuori centro abitato, meno in centro.' },
      { title: 'Segnali di curva', description: 'Esistono diversi tipi: curva sinistra, curva destra, doppia curva (successione di curve in direzioni opposte), curva a gomito, curva ad S. La differenza tra curva singola e doppia \u00E8 che la doppia richiede cautela su entrambe le curve.' },
      { title: 'Passaggio a livello', description: 'Il segnale indica l\'attraversamento di binari ferroviari. Le sbarre in movimento o le luci lampeggianti obbligano alla fermata. Non attraversare MAI con le sbarre in movimento. Se il veicolo si ferma sui binari, far scendere tutti e avvisare.' },
      { title: 'Altri segnali importanti', description: 'Caduta massi, attraversamento pedonale, bambini, lavori stradali, strada scivolosa, galleria, ponte mobile, incrocio, discesa pericolosa, salita ripida, restringimento, rotatoria, animali selvatici e domestici, dosso, cunetta, neve/ghiaccio, vento laterale, incendio boschivo.' },
      { title: 'Pannelli integrativi per i segnali di pericolo', description: 'I segnali di pericolo possono essere completati da pannelli integrativi che indicano la distanza, la durata del pericolo o la validit\u00E0 temporale del segnale. Il pannello con la distanza indica quanti metri mancano al pericolo.' },
    ],
    rules: [
      { title: 'Distanza di posizionamento fuori centro abitato', description: 'Almeno 150 metri prima del pericolo. In alcuni casi (alte velocit\u00E0) pu\u00F2 essere maggiore.' },
      { title: 'Distanza in centro abitato', description: 'La distanza pu\u00F2 essere ridotta in centro abitato, ma il segnale deve comunque essere visibile in tempo utile.' },
      { title: 'Presegnalamento di curve', description: 'Le curve pericolose devono essere presegnalate con il triangolo di pericolo. Il conducente deve ridurre la velocit\u00E0 PRIMA della curva, non durante.' },
    ],
    commonMistakes: [
      'Confondere una curva singola con una doppia curva nel segnale.',
      'Non rispettare la distanza di posizionamento del segnale (150m fuori centro abitato).',
      'Credere che i segnali di pericolo siano quadrati (sono TRIANGOLARI!).',
      'Ridurre la velocit\u00E0 durante la curva invece che prima.',
      'Ignorare i segnali temporanei di pericolo per lavori stradali.',
    ],
    memoryTips: [
      'Pericolo = TRIANGOLO Rosso Bianco Nero. Ricorda: TRIANGOLO = Pericolo!',
      'I segnali di pericolo PRECEDONO il pericolo, non lo indicano sul posto.',
      'Passaggio a livello = FERMATI sempre, GUARDA entrambe le direzioni, ASCOLTA.',
    ],
    importantNumbers: [
      { label: 'Forma', value: 'Triangolo equilatero' },
      { label: 'Distanza minima fuori centro', value: '150 metri' },
      { label: 'Colore bordo', value: 'Rosso' },
      { label: 'Colore sfondo', value: 'Bianco' },
      { label: 'Colore simbolo', value: 'Nero' },
    ],
  },

  // ============================================================
  // CAPITOLO 3 - Segnali di divieto
  // ============================================================
  {
    id: 3,
    title: 'Segnali di divieto',
    topicGroup: 'Segnali stradali',
    icon: '\u{1F6AB}',
    color: '#DC2626',
    overview: 'I segnali di divieto sono rotondi con bordo rosso, sfondo bianco e simbolo nero. Vietano comportamenti specifici: accesso, sosta, sorpasso, limiti di velocit\u00E0. Il rosso significa "vietato" senza eccezioni salvo diversamente indicato da un pannello integrativo. Sono tra i segnali pi\u00F9 importanti per la sicurezza e le infrazioni comportano sanzioni severe.',
    keyPoints: [
      { title: 'Divieto di accesso', description: 'Cerchio rosso pieno con sfondo bianco. Vieta l\'accesso a TUTTI i veicoli a motore. Non riguarda i pedoni. Non confonderlo con il senso vietato che vieta solo una direzione.' },
      { title: 'Senso vietato', description: 'Cerchio rosso con freccia rossa su sfondo bianco. Vieta solo la direzione indicata dalla freccia. Non vieta l\'accesso dalla direzione opposta.' },
      { title: 'Limiti di velocit\u00E0', description: 'Cerchio bianco con bordo rosso e numero nero. Indica la velocit\u00E0 massima in km/h. Valido fino a diversa segnalazione o al segnale di fine limite.' },
      { title: 'Divieto di sosta vs fermata', description: 'Sosta (linea rossa): vietato lasciare il veicolo fermo. La fermata breve per salita/discesa \u00E8 consentita. Fermata (blu): vietata qualsiasi fermata, anche brevissima. \u00C8 il divieto pi\u00F9 restrittivo.' },
      { title: 'ZTL - Zona a Traffico Limitato', description: 'Accesso limitato a determinati orari o categorie. Spesso controllata da telecamere. I residenti hanno accesso con permesso speciale. L\'ingresso non autorizzato comporta multa automatica.' },
      { title: 'Segnali di fine prescrizione', description: 'Cerchio grigio con barra diagonale nera: fine di ogni divieto. Fine limite velocit\u00E0: fine del limite precedente. Fine divieto sorpasso: il sorpasso \u00E8 nuovamente consentito.' },
    ],
    rules: [
      { title: 'Multa per accesso non autorizzato ZTL', description: 'Circa 80-100 euro. La telecamera registra la targa e la multa viene inviata automaticamente al proprietario del veicolo.' },
      { title: 'Multa per divieto di sosta', description: 'Da 42 a 173 euro. In caso di rimozione: costo di carro attrezzi + deposito. In zone disco orario: rispettare le fasce orarie.' },
      { title: 'Eccesso di velocit\u00E0', description: 'Fino a 10 km/h sopra il limite: multa da 42 a 173 euro. Oltre 40 km/h: sospensione della patente da 1 a 3 mesi. Oltre 60 km/h: revoca della patente.' },
      { title: 'Divieto di sorpasso', description: 'Multa e decurtazione punti. Se causa incidente: responsabilit\u00E0 penale. Il divieto vale per i veicoli a motore; biciclette e trattori possono essere sorpassati in alcuni casi.' },
    ],
    commonMistakes: [
      'Confondere divieto di sosta (rosso) con divieto di fermata (blu).',
      'Pensare che il divieto di accesso riguardi solo alcuni veicoli (riguarda TUTTI i veicoli a motore).',
      'Non distinguere il divieto di accesso dal senso vietato.',
      'Dimenticare che il divieto di sorpasso vale per i veicoli a motore.',
      'Non verificare gli orari di attivazione della ZTL prima di accedere.',
    ],
    memoryTips: [
      'Divieto = Cerchio ROSSO. Rosso = STOP, vietato!',
      'Sosta = linee ROSSE (come "no parking"). Fermata = linee BLU (pi\u00F9 grave).',
      'ZTL = sempre verificare gli orari! Le telecamere non dormono mai.',
      'Fine prescrizione = cerchio GRIGIO con barra nera = fine del divieto.',
    ],
    importantNumbers: [
      { label: 'Multa ZTL', value: '80-100 \u20AC' },
      { label: 'Multa sosta', value: '42-173 \u20AC' },
      { label: 'Multa divieto di fermata', value: '80-328 \u20AC' },
      { label: 'Eccesso >40 km/h', value: 'Sospensione patente 1-3 mesi' },
      { label: 'Eccesso >60 km/h', value: 'Revoca patente' },
    ],
  },

  // ============================================================
  // CAPITOLO 4 - Segnali di obbligo
  // ============================================================
  {
    id: 4,
    title: 'Segnali di obbligo',
    topicGroup: 'Segnali stradali',
    icon: '\u{1F535}',
    color: '#2563EB',
    overview: 'I segnali di obbligo sono rotondi con bordo blu e sfondo bianco, con simbolo nero. Impongono un comportamento specifico: direzione obbligatoria, tipo di percorso, equipaggiamento obbligatorio. Il colore blu significa "obbligatorio". L\'eccezione \u00E8 il senso unico che ha forma rettangolare. Non rispettare un segnale di obbligo comporta multe e decurtazione punti.',
    keyPoints: [
      { title: 'Senso unico di circolazione', description: 'Rettangolo blu con freccia bianca. Obbliga a procedere nella direzione indicata. \u00C8 l\'unico segnale di obbligo con forma rettangolare, non rotonda. Circolare nel verso opposto \u00E8 una grave infrazione.' },
      { title: 'Pista ciclabile', description: 'Cerchio con bordo blu e simbolo bicicletta bianca. I ciclisti DEVONO usare la pista se presente. Vietata la circolazione di altri veicoli sulla pista. Solo attraversamento per accedere a propriet\u00E0 laterali.' },
      { title: 'Direzione obbligatoria', description: 'Cerchio con bordo blu e freccia: obbligo di proseguire dritto, a sinistra o a destra. Vietato svoltare in direzioni diverse. In caso di strada con pista ciclabile, i ciclisti devono usarla.' },
      { title: 'Catene da neve', description: 'Cerchio con bordo blu e simbolo catena. Obbligo di montare catene da neve su almeno due ruote motrici. In alternativa pneumatici invernali con simbolo M+S o 3PMSF.' },
      { title: 'Limite minimo di velocit\u00E0', description: 'Cerchio blu con numero bianco. Indica la velocit\u00E0 minima obbligatoria. Si applica su autostrade e tangenziali. Non circolare sotto questo limite salvo cause di forza maggiore.' },
    ],
    rules: [
      { title: 'Obbligo pista ciclabile', description: 'Il ciclista che non usa la pista ciclabile quando presente rischia una multa. Il veicolo a motore che usa la pista ciclabile rischia una multa pi\u00F9 elevata.' },
      { title: 'Senso contromano', description: 'Circolare nel senso opposto al senso unico \u00E8 un\'infrazione grave: multa da 163 a 658 euro e decurtazione di 5 punti. Se causa incidente: responsabilit\u00E0 penale.' },
      { title: 'Catene da neve', description: 'In presenza del segnale, chi non monta le catene (o pneumatici invernali) non pu\u00F2 proseguire. La multa \u00E8 prevista anche per chi circola senza catene in presenza di neve o ghiaccio.' },
    ],
    commonMistakes: [
      'Confondere il senso unico (rettangolare) con l\'obbligo di direzione (rotondo).',
      'Pensare che la pista ciclabile sia solo una raccomandazione (è OBBLIGATORIA per i ciclisti).',
      'Non distinguere tra obbligo (blu) e divieto (rosso).',
      'Dimenticare che le catene servono su almeno 2 ruote motrici.',
    ],
    memoryTips: [
      'Obbligo = Cerchio BLU. Blu = Basta! Devi farlo! Obbligatorio!',
      'Senso unico = Rettangolo BLU (diverso dai segnali di obbligo che sono rotondi).',
      'Blu = Obbligo, Rosso = Divieto. La differenza \u00E8 nel colore del bordo.',
    ],
    importantNumbers: [
      { label: 'Forma', value: 'Cerchio (eccetto senso unico)' },
      { label: 'Colore bordo', value: 'Blu' },
      { label: 'Colore sfondo', value: 'Bianco' },
      { label: 'Multe senso contromano', value: '163-658 \u20AC + 5 punti' },
    ],
  },

  // ============================================================
  // CAPITOLO 5 - Segnali di precedenza
  // ============================================================
  {
    id: 5,
    title: 'Segnali di precedenza',
    topicGroup: 'Segnali stradali',
    icon: '\u{1F53A}',
    color: '#F59E0B',
    overview: 'I segnali di precedenza stabiliscono chi ha il diritto di passare per primo negli incroci. Il segnale "dare precedenza" (triangolo rovesciato) obbliga a cedere il passo rallentando. Il segnale "stop" (ottagono rosso) obbliga alla fermata completa. La strada prioritaria (rombo giallo) indica chi ha il diritto di precedenza. La regola generale "dalla destra" si applica negli incroci non segnalati.',
    keyPoints: [
      { title: 'Dare precedenza', description: 'Triangolo rovesciato con bordo rosso e sfondo bianco. Obbliga a dare la precedenza ai veicoli sulla strada prioritaria. Rallentare e fermarsi se necessario. Non c\'\u00E8 obbligo di fermata completa (a differenza dello stop).' },
      { title: 'Stop', description: 'Ottagono rosso con scritta STOP bianca. Obbligo di FERMARSI COMPLETAMENTE (ruote immobili). Guardare in entrambe le direzioni. Procedere solo se la strada \u00E8 libera. Lo stop \u00E8 pi\u00F9 restrittivo della precedenza.' },
      { title: 'Strada prioritaria', description: 'Rombo giallo su sfondo bianco. Indica che la strada ha la priorit\u00E0. Chi viaggia su questa strada ha la precedenza negli incroci non segnalati. Il segnale "fine strada prioritaria" indica la fine della priorit\u00E0.' },
      { title: 'Regola "dalla destra"', description: 'Negli incroci non segnalati, chi proviene dalla destra ha la precedenza. Eccezioni: strada prioritaria, segnaletica verticale, agenti del traffico, semafori. In incrocio a T, la strada continuata ha la precedenza.' },
      { title: 'Preavviso di precedenza e stop', description: 'Il preavviso (triangolo con triangolo rovesciato dentro, o triangolo con ottagono dentro) indica che a breve distanza c\'\u00E8 un segnale di precedenza o stop. Il conducente deve iniziare a rallentare.' },
    ],
    rules: [
      { title: 'Fermata allo STOP', description: 'Obbligo di fermarsi completamente. Le ruote devono essere immobili. Non \u00E8 sufficiente rallentare molto: DEVI fermarti. La linea di arresto indica dove fermarsi.' },
      { title: 'Precedenza ai pedoni', description: 'Sempre dare la precedenza ai pedoni sugli attraversamenti pedonali (zebra) e ai ciclisti sulle piste ciclabili. Anche senza segnale, il conducente deve dare la precedenza ai pedoni che stanno attraversando.' },
      { title: 'Confluenza', description: 'Il segnale di confluenza indica che una strada si immette nella principale. Non indica chi ha la precedenza: il conducente sulla strada principale non ha obbligo di fermarsi, ma deve prestare attenzione.' },
    ],
    commonMistakes: [
      'Non fermarsi completamente allo STOP (le ruote devono fermarsi!).',
      'Dimenticare la regola "dalla destra" negli incroci non segnalati.',
      'Confondere dare precedenza (rallentare se necessario) con stop (fermarsi SEMPRE).',
      'Pensare di avere la precedenza dopo il segnale "fine strada prioritaria" (la precedenza FINISCE!).',
      'Non dare la precedenza ai pedoni sugli attraversamenti.',
    ],
    memoryTips: [
      'STOP = Ottagono ROSSO = Fermati SEMPRE. Precedenza = Triangolo rovesciato = Rallenta.',
      'Dalla destra: chi viene da destra passa per primo (senza altri segnali).',
      'Strada prioritaria = Rombo GIALLO. Fine = Rombo con barra NERA.',
      'Preavviso = triangolo con segnale dentro = "preparati a cedere il passo".',
    ],
    importantNumbers: [
      { label: 'Forma STOP', value: 'Ottagono' },
      { label: 'Forma precedenza', value: 'Triangolo rovesciato' },
      { label: 'Forma strada prioritaria', value: 'Rombo (diamante)' },
    ],
  },

  // ============================================================
  // CAPITOLO 6 - Segnaletica orizzontale e ostacoli
  // ============================================================
  {
    id: 6,
    title: 'Segnaletica orizzontale e ostacoli',
    topicGroup: 'Segnali stradali',
    icon: '\u{1F4CF}',
    color: '#8B5CF6',
    overview: 'La segnaletica orizzontale comprende tutte le marcature sull\'asfalto: linee di margine, linee di corsia, passaggi pedonali, linee di arresto, frecce direzionali e isole di traffico. I colori hanno significati specifici: bianco per la divisione e l\'indicazione, giallo per il divieto e la temporaneit\u00E0, azzurro per gli stalli di parcheggio. La segnaletica orizzontale completa e integra quella verticale.',
    keyPoints: [
      { title: 'Linea continua vs tratteggiata', description: 'Linea continua bianca: NON si pu\u00F2 attraversare (n\u00E9 sorpassare n\u00E9 cambiare corsia). Linea tratteggiata bianca: si pu\u00F2 attraversare per sorpassare o cambiare corsia. Doppia linea continua: assolutamente vietato attraversarla in qualsiasi caso.' },
      { title: 'Linea continua + tratteggiata', description: 'Se il lato tratteggiato \u00E8 dal tuo lato, puoi attraversare. Se il lato continuo \u00E8 dal tuo lato, NON puoi attraversare. La linea continua \u00E8 sempre il lato vietato.' },
      { title: 'Passaggio pedonale (zebra)', description: 'Strisce bianche orizzontali: il conducente deve dare la precedenza ai pedoni. Fermarsi almeno 5 metri prima del passaggio. Non sostare mai sopra le strisce pedonali.' },
      { title: 'Linee di arresto', description: 'Linea bianca continua trasversale: indica dove fermarsi a stop, semaforo o incrocio. Linea gialla: indica divieto di fermata (non superare per fermarsi). Linee gialle a zigzag: fermata dei tram.' },
      { title: 'Corsie reversibili', description: 'Le frecce di corsia (disegnate sull\'asfalto o tramite semafori) indicano la direzione obbligatoria nella corsia. Il conducente deve seguire la direzione indicata.' },
    ],
    rules: [
      { title: 'Attraversamento linea continua', description: 'Multa da 42 a 173 euro e decurtazione di 2 punti. Se causa incidente: responsabilit\u00E0 penale e decurtazione fino a 10 punti.' },
      { title: 'Distanza dal passaggio pedonale', description: 'Almeno 5 metri prima del passaggio pedonale per la fermata. Non accostare mai il veicolo in modo da ostruire il passaggio.' },
      { title: 'Sosta su linee gialle', description: 'Le linee gialle indicano divieto di fermata. Sostare su linee gialle comporta multa elevata e possibile rimozione del veicolo.' },
    ],
    commonMistakes: [
      'Non distinguere tra linea continua (non attraversare) e tratteggiata (pu\u00F2 attraversare).',
      'Sorpassare su doppia linea continua (sempre vietato).',
      'Non fermarsi prima della linea di arresto (fermarsi sopra o oltre la linea).',
      'Confondere la linea gialla (divieto) con la bianca (arresto).',
      'Sostare sul passaggio pedonale o a meno di 5 metri da esso.',
    ],
    memoryTips: [
      'Continua = NON attraversare. Tratteggiata = PUOI attraversare.',
      'Gialla = Vietato fermarsi. Bianca = Linea di arresto.',
      'Zebra = Pedoni. Fermati E dai la precedenza!',
      'Doppia continua = MAI attraversare, da nessun lato.',
    ],
    importantNumbers: [
      { label: 'Distanza min dal passaggio pedonale', value: '5 metri' },
      { label: 'Sanzione linea continua', value: '42-173 \u20AC + 2 punti' },
    ],
  },

  // ============================================================
  // CAPITOLO 7 - Semafori e segnali dei vigili
  // ============================================================
  {
    id: 7,
    title: 'Semafori e segnali dei vigili',
    topicGroup: 'Segnali stradali',
    icon: '\u{1F6A6}',
    color: '#10B981',
    overview: 'I semafori sono dispositivi di segnalazione luminosa che regolano la circolazione con tre colori: rosso (arresto), giallo (attenzione) e verde (via libera). Esistono semafori veicolari, pedonali, per ciclisti e per tram. I segnali del vigile urbano hanno sempre la priorit\u00E0 sui semafori. Il giallo lampeggiante indica cautela, il rosso lampeggiante equivale allo stop.',
    keyPoints: [
      { title: 'Significato dei colori', description: 'Rosso fisso: STOP obbligatorio. Giallo fisso: arresto se possibile farlo in sicurezza (NON accelerare!). Verde: si pu\u00F2 procedere ma con cautela. Rosso + giallo insieme: prepararsi alla partenza. Verde lampeggiante: via libera con cautela.' },
      { title: 'Giallo lampeggiante e rosso lampeggiante', description: 'Giallo lampeggiante: procedere con estrema cautela, dando la precedenza. Si applica la regola "dalla destra". Rosso lampeggiante: equivale allo STOP, fermarsi completamente. Spesso usati di notte o con poco traffico.' },
      { title: 'Frecce semaforiche', description: 'Freccia verde: consentito il passaggio in quella direzione. Freccia rossa: vietata la direzione. Se c\'\u00E8 luce verde generica + freccia verde, il verde \u00E8 SOLO per la direzione della freccia. Freccia gialla: fine della fase protetta.' },
      { title: 'Segnali del vigile', description: 'Braccio alzato (verticale): STOP per tutti (equivale al rosso). Braccio orizzontale: VIA per chi proviene da destra e sinistra, STOP per chi proviene da davanti/dietro. Braccio abbassato: PRECEDENZA per chi proviene dalla direzione indicata dal vigile.' },
      { title: 'Semafori pedonali', description: 'Verde pedonale: i pedoni possono attraversare. Rosso pedonale: i pedoni non possono attraversare. Verde lampeggiante pedonale: non iniziare l\'attraversamento; se gi\u00E0 iniziato, completalo rapidamente.' },
    ],
    rules: [
      { title: 'Passare con il giallo', description: 'Se il semaforo diventa giallo quando sei troppo vicino per fermarti in sicurezza, puoi proseguire. Ma se puoi fermarti, DEVI farlo. Non accelerare per passare con il giallo.' },
      { title: 'Priorit\u00E0 del vigile', description: 'I segnali del vigile urbano hanno SEMPRE priorit\u00E0 su qualsiasi semaforo o segnaletica verticale. Anche se il semaforo \u00E8 verde, se il vigile ordina lo stop, devi fermarti.' },
    ],
    commonMistakes: [
      'Accelerare quando il semaforo diventa giallo per passare (DEVII fermarti se puoi).',
      'Non fermarsi completamente al rosso lampeggiante (equivale a STOP).',
      'Confondere verde lampeggiante (cautela) con verde fisso (via libera).',
      'Non dare la precedenza al vigile quando il semaforo \u00E8 verde.',
    ],
    memoryTips: [
      'Rosso = Stop, Giallo = Attenzione, Verde = Vai.',
      'Giallo = FERMATI se puoi. NON accelerare MAI.',
      'Rosso lampeggiante = STOP completo (come il segnale di stop).',
      'Vigile braccio alzato = STOP per TUTTI (come rosso).',
    ],
    importantNumbers: [
      { label: 'Giallo', value: 'Fermati se puoi in sicurezza' },
      { label: 'Rosso lampeggiante', value: 'Equivale a STOP' },
    ],
  },

  // ============================================================
  // CAPITOLO 8 - Segnali di indicazione
  // ============================================================
  {
    id: 8,
    title: 'Segnali di indicazione',
    topicGroup: 'Segnali stradali',
    icon: '\u{1FA9A}',
    color: '#06B6D4',
    overview: 'I segnali di indicazione forniscono informazioni utili al conducente: direzioni, distanze, localit\u00E0, servizi e informazioni sulla strada. Sono generalmente rettangolari. Il colore dello sfondo indica il tipo: verde per autostrade, blu per servizi, bianco per strade urbane, marrone per turismo. Completano la segnaletica di pericolo, divieto e obbligo.',
    keyPoints: [
      { title: 'Colori di sfondo', description: 'Blu: servizi generici e direzioni urbane. Verde: autostrade e strade extraurbane principali. Bianco: informazioni urbane. Marrone: attrazioni turistiche e culturali. Giallo: indicazioni temporanee per lavori.' },
      { title: 'Autostrada e fine autostrada', description: 'Segnale rettangolare verde con simbolo autostrada: inizio autostrada. Regole specifiche: minimo 80 km/h, massimo 130 km/h, vietati pedoni e veicoli lenti. Fine autostrada: i limiti cambiano.' },
      { title: 'Servizi: parcheggio, ospedale, area di servizio', description: 'Parcheggio (P blu): area di sosta. Ospedale: vicinanza di pronto soccorso, non sostare davanti. Area di servizio: distributore, ristorante, servizi igienici sulle autostrade.' },
      { title: 'Presegnalamento e conferma', description: 'Il presegnalamento avvisa in anticipo della direzione. La conferma (post-segnalamento) verifica che si \u00E8 sulla strada corretta dopo un incrocio. Entrambi sono fondamentali per la navigazione.' },
      { title: 'Altri segnali di indicazione', description: 'Inizio/fine centro abitato, strada senza uscita, velocit\u00E0 consigliata, area pedonale, fermata autobus, parcheggio, area di sosta per camion, telefono di emergenza, campeggio.' },
    ],
    rules: [
      { title: 'Autostrada: regole specifiche', description: 'Minimo 80 km/h (se non diversamente indicato), massimo 130 km/h. Vietati pedoni, biciclette, veicoli lenti. Divieto di inversione di marcia e retromarcia.' },
    ],
    commonMistakes: [
      'Non comprendere il significato dei colori di sfondo dei segnali.',
      'Non rispettare la velocit\u00E0 minima in autostrada (80 km/h) quando non c\'\u00E8 traffico.',
      'Confondere il verde (autostrada) con il blu (servizi).',
    ],
    memoryTips: [
      'Verde = Autostrada (via veloce). Blu = Servizi. Marrone = Turismo.',
      'Presegnalamento = "preparati". Conferma = "sei sulla strada giusta".',
    ],
    importantNumbers: [
      { label: 'Velocit\u00E0 max autostrada', value: '130 km/h' },
      { label: 'Velocit\u00E0 min autostrada', value: '80 km/h' },
    ],
  },

  // ============================================================
  // CAPITOLO 9 - Segnali complementari e di cantiere
  // ============================================================
  {
    id: 9,
    title: 'Segnali complementari e di cantiere',
    topicGroup: 'Segnali stradali',
    icon: '\u{1F6A7}',
    color: '#F97316',
    overview: 'I segnali complementari includono i segnali temporanei per lavori stradali e i segnali di cantiere. Hanno sfondo giallo/arancione e la stessa validit\u00E0 dei segnali permanenti. I segnali temporanei hanno la PRIORIT\u00C0 su quelli permanenti: se c\'\u00E8 conflitto, vince il segnale temporaneo. Indicano cantieri, deviazioni, restringimenti o ostacoli temporanei.',
    keyPoints: [
      { title: 'Segnali temporanei (giallo)', description: 'I segnali temporanei con sfondo giallo hanno la PRIORIT\u00C0 assoluta sui segnali permanenti. Se un segnale temporaneo di divieto e uno permanente di obbligo sono in conflitto, il temporaneo vince sempre.' },
      { title: 'Cantieri stradali', description: 'I cantieri possono restringere la carreggiata, deviare il traffico o creare ostacoli temporanei. Possibile presenza di operai e macchinari. Ridurre la velocit\u00E0 e prestare massima attenzione.' },
      { title: 'Deviazioni temporanee', description: 'Le deviazioni sono segnalate con frecce gialle e possono modificare temporaneamente il percorso abituale. Seguire sempre le indicazioni dei cartelli e del personale preposto.' },
    ],
    rules: [
      { title: 'Priorit\u00E0 segnali temporanei', description: 'I segnali temporanei (giallo) VINCONO sempre su quelli permanenti. Anche se c\'\u00E8 un segnale permanente contrario, il temporaneo ha la precedenza.' },
    ],
    commonMistakes: [
      'Non dare la priorit\u00E0 ai segnali temporanei rispetto a quelli permanenti.',
      'Ignorare i segnali di cantiere pensando che non siano vincolanti.',
    ],
    memoryTips: [
      'Segnale temporaneo (GIALLO) VINCE sempre su permanente. Giallo = "Attenzione, lavori in corso!".',
    ],
    importantNumbers: [],
  },

  // ============================================================
  // CAPITOLO 10 - Pannelli integrativi
  // ============================================================
  {
    id: 10,
    title: 'Pannelli integrativi',
    topicGroup: 'Segnali stradali',
    icon: '\u{1F4CB}',
    color: '#6366F1',
    overview: 'I pannelli integrativi sono rettangolari con sfondo bianco e bordo nero. Completano, modificano o limitano la validit\u00E0 dei segnali principali. Forniscono informazioni su distanze, orari, direzioni ed eccezioni. Hanno valore SOLO se associati a un segnale principale. Possono indicare l\'estensione spaziale (distanza) o temporale (giorni/orari) della prescrizione.',
    keyPoints: [
      { title: 'Tipi di pannelli', description: 'Pannello di distanza: indica i metri fino al pericolo. Pannello direzionale: indica la direzione di applicazione. Pannello di validit\u00E0 temporale: giorni e orari in cui il segnale \u00E8 valido. Pannello di eccezione: casi in cui il segnale non si applica.' },
      { title: 'Pannelli di estensione', description: 'I pannelli con frecce indicano l\'estensione spaziale della prescrizione. La freccia pu\u00F2 indicare la direzione e la lunghezza del tratto interessato.' },
      { title: 'Validit\u00E0 temporale', description: 'Esempi: "Lun-Ven 8-18", "Giorni festivi", "Tutti i giorni". Fuori dagli orari indicati, il segnale principale NON ha validit\u00E0.' },
    ],
    rules: [
      { title: 'Pannelli senza segnale principale', description: 'I pannelli integrativi NON hanno valore se non sono associati a un segnale principale. Un pannello da solo non impone obblighi n\u00E9 divieti.' },
    ],
    commonMistakes: [
      'Ignorare i pannelli integrativi pensando che non siano vincolanti.',
      'Non leggere i giorni/orari di validit\u00E0 del pannello.',
    ],
    memoryTips: [
      'Pannello = Integrativo. Non ha valore da SOLO, solo con il segnale principale.',
    ],
    importantNumbers: [],
  },

  // ============================================================
  // CAPITOLO 11 - Limiti di velocità
  // ============================================================
  {
    id: 11,
    title: 'Limiti di velocit\u00E0',
    topicGroup: 'Norme di circolazione',
    icon: '\u26A1',
    color: '#EF4444',
    overview: 'I limiti di velocit\u00E0 sono fondamentali per la sicurezza stradale. Variano in base al tipo di strada, alle condizioni atmosferiche e all\'esperienza del conducente. Il Codice della Strada stabilisce limiti generici per ogni tipo di strada, ma i segnali possono modificarli. Le sanzioni per eccesso di velocit\u00E0 sono proporzionali all\'entit\u00E0 del superamento.',
    keyPoints: [
      { title: 'Limiti generici di velocit\u00E0', description: 'Centro abitato: 50 km/h. Strada extraurbana secondaria: 90 km/h. Strada extraurbana principale: 110 km/h. Autostrada: 130 km/h. Questi sono i limiti generici in condizioni normali.' },
      { title: 'Neopatentati (primi 3 anni)', description: 'I neopatentati hanno limiti ridotti: 100 km/h in autostrada (invece di 130), 90 km/h sulle extraurbane principali (invece di 110), 70 km/h sulle extraurbane secondarie (invece di 90). Il limite in centro abitato resta 50 km/h.' },
      { title: 'Condizioni atmosferiche avverse', description: 'In caso di pioggia, neve o ghiaccio, i limiti si riducono: autostrada 110 km/h (invece di 130), extraurbane principali 90 km/h (invece di 110). Il conducente deve sempre adattare la velocit\u00E0 alle condizioni effettive.' },
      { title: 'Velocit\u00E0 congrua', description: 'Oltre ai limiti massimi, il conducente deve mantenere una velocit\u00E0 "congrua" alle condizioni del traffico, della visibilit\u00E0, dello stato della strada e delle condizioni atmosferiche. Anche se non si supera il limite, una velocit\u00E0 eccessiva per le condizioni \u00E8 sanzionabile.' },
    ],
    rules: [
      { title: 'Centro abitato: 50 km/h', description: 'Valido in tutte le strade urbane salvo diversa segnalazione. Il limite scatta all\'insegna "inizio centro abitato" e termina a "fine centro abitato".' },
      { title: 'Eccesso fino a 10 km/h', description: 'Multa da 42 a 173 euro. Nessuna decurtazione punti se entro 10 km/h sopra il limite.' },
      { title: 'Eccesso da 10 a 40 km/h', description: 'Multa da 173 a 695 euro e decurtazione di 3 punti.' },
      { title: 'Eccesso oltre 40 km/h', description: 'Multa da 845 a 3.382 euro, decurtazione di 10 punti, sospensione patente da 1 a 3 mesi.' },
      { title: 'Eccesso oltre 60 km/h', description: 'Multa da 1.278 a 5.103 euro, decurtazione di 10 punti, sospensione patente da 6 a 12 mesi o revoca.' },
    ],
    commonMistakes: [
      'Non sapere i limiti generici per ogni tipo di strada.',
      'Dimenticare che i neopatentati hanno limiti ridotti per 3 anni.',
      'Non ridurre la velocit\u00E0 in caso di pioggia o neve.',
      'Credere che il limite in centro abitato sia 30 km/h (è 50 km/h salvo diversamente indicato).',
    ],
    memoryTips: [
      '50-90-110-130: centro-extraurbana secondaria-extraurbana principale-autostrada.',
      'Neopatentati = limiti ridotti per 3 anni (100-90-70).',
      'Pioggia = -20 km/h in autostrada (130 \u2192 110).',
      'Velocit\u00E0 congrua = sempre adattare alla situazione, non solo al limite.',
    ],
    importantNumbers: [
      { label: 'Centro abitato', value: '50 km/h' },
      { label: 'Extraurbana secondaria', value: '90 km/h' },
      { label: 'Extraurbana principale', value: '110 km/h' },
      { label: 'Autostrada', value: '130 km/h' },
      { label: 'Autostrada (pioggia)', value: '110 km/h' },
      { label: 'Neopatentati autostrada', value: '100 km/h' },
      { label: 'Neopatentati extraurbana principale', value: '90 km/h' },
      { label: 'Neopatentati extraurbana secondaria', value: '70 km/h' },
    ],
  },

  // ============================================================
  // CAPITOLO 12 - Distanza di sicurezza
  // ============================================================
  {
    id: 12,
    title: 'Distanza di sicurezza',
    topicGroup: 'Norme di circolazione',
    icon: '\u{1F4CF}',
    color: '#3B82F6',
    overview: 'La distanza di sicurezza \u00E8 lo spazio che deve intercorrere tra veicoli in movimento per evitare collisioni in caso di frenata improvvisa. Dipende dalla velocit\u00E0, dalle condizioni della strada e atmosferiche, e dallo stato del veicolo. La regola generale \u00E8 quella dei "2 secondi" di distanza temporale, che raddoppia a 4 secondi in caso di pioggia.',
    keyPoints: [
      { title: 'Regola dei 2 secondi', description: 'Il conducente deve mantenere una distanza tale che, al veicolo che lo precede, possano intercorrere almeno 2 secondi. Si misura fissando un punto di riferimento e contando "milleuno, milleto" (2 secondi). In caso di pioggia, neve o ghiaccio: almeno 4 secondi.' },
      { title: 'Spazio di frenata', description: 'Lo spazio di frenata \u00E8 la distanza percorsa dal veicolo dal momento in cui il conducente preme il freno fino all\'arresto completo. Dipende dalla velocit\u00E0 (si quadruplica raddoppiando la velocit\u00E0), dallo stato della strada (asciutta/bagnata) e dallo stato dei freni/pneumatici.' },
      { title: 'Spazio di arresto', description: 'Spazio di arresto = spazio di percorrenza (reazione) + spazio di frenata. Lo spazio di percorrenza \u00E8 la distanza percorsa nel tempo di reazione del conducente (circa 1 secondo). Aumentare la distanza se la visibilit\u00E0 \u00E8 ridotta o la strada \u00E8 bagnata.' },
      { title: 'Distanza laterale', description: 'Quando si sorpassa un ciclista o un pedone, la distanza laterale minima \u00E8 di 1 metro in citt\u00E0 e 1,5 metri fuori citt\u00E0. Quando si sorpassa un ciclista in corsia, mantenere almeno 1 metro.' },
    ],
    rules: [
      { title: 'Distanza minima dal veicolo precedente', description: 'Non esiste un numero fisso di metri, ma la regola dei 2 secondi \u00E8 la riferimento legale. A 130 km/h in 2 secondi si percorrono circa 72 metri.' },
      { title: 'Colonna di veicoli', description: 'In colonna, il veicolo deve mantenere una distanza sufficiente per permettere il superamento da parte di veicoli che intendono sorpassare la colonna.' },
    ],
    commonMistakes: [
      'Non mantenere la distanza di 2 secondi (soprattutto in autostrada).',
      'Non raddoppiare la distanza in caso di pioggia o neve (4 secondi).',
      'Non calcolare lo spazio di frenata in base alla velocit\u00E0 (raddoppiando velocit\u00E0 = x4 frenata).',
      'Non mantenere la distanza laterale di 1m dai ciclisti.',
    ],
    memoryTips: [
      '2 secondi = distanza minima. 4 secondi = pioggia/neve/ghiaccio.',
      'A 130 km/h in 2 secondi = circa 72 metri di distanza.',
      'Spazio di arresto = reazione + frenata. Pi\u00F9 velocit\u00E0 = molto pi\u00F9 spazio.',
      'Ciclisti: 1 metro in citt\u00E0, 1,5 metri fuori citt\u00E0.',
    ],
    importantNumbers: [
      { label: 'Distanza temporale minima', value: '2 secondi' },
      { label: 'Distanza temporale (pioggia)', value: '4 secondi' },
      { label: 'Distanza laterale ciclista (citt\u00E0)', value: '1 metro' },
      { label: 'Distanza laterale ciclista (fuori)', value: '1,5 metri' },
      { label: 'Tempo di reazione medio', value: '~1 secondo' },
    ],
  },

  // ============================================================
  // CAPITOLO 13 - Norme di circolazione
  // ============================================================
  {
    id: 13,
    title: 'Norme di circolazione',
    topicGroup: 'Norme di circolazione',
    icon: '\u{1F6E3}\uFE0F',
    color: '#10B981',
    overview: 'Le norme di circolazione regolano il comportamento dei conducenti sulla strada. Include regole sulla posizione sulla carreggiata, uso delle corsie, inversione di marcia, retromarcia, attraversamento di intersezioni, circolazione nei centri abitati e fuori, e regole specifiche per autostrade e tangenziali.',
    keyPoints: [
      { title: 'Posizione sulla carreggiata', description: 'Il conducente deve tenere il lato destro della carreggiata. Sulle strade a senso unico, pu\u00F2 utilizzare qualsiasi corsia. Sulle strade a doppio senso, deve restare sulla corsia di destra.' },
      { title: 'Cambio di corsia', description: 'Il cambio di corsia \u00E8 consentito solo dove la linea \u00E8 tratteggiata e dopo aver dato la precedenza ai veicoli nella corsia di destinazione. Usare sempre l\'indicatore di direzione prima di cambiare corsia.' },
      { title: 'Inversione di marcia', description: 'Vietata nelle curve, sui dossi, in prossimit\u00E0 di intersezioni e dossi, in gallerie, sotto i passaggi a livello, sulle strade extraurbane principali e autostrade. Vietata anche quando la visibilit\u00E0 \u00E8 inferiore a 100 metri.' },
      { title: 'Retromarcia', description: 'Consentita solo in caso di necessit\u00E0 e per brevi tratti. Vietata in autostrada, su strade extraurbane principali e in tutti i casi in cui potrebbe costituire pericolo per gli altri utenti della strada.' },
      { title: 'Autostrade: regole specifiche', description: 'Vietata la circolazione di pedoni, biciclette, ciclomotori e veicoli lenti. Vietata l\'inversione di marcia e la retromarcia. L\'accesso avviene tramite le rampa di accelerazione, l\'uscita tramite le rampa di decelerazione.' },
    ],
    rules: [
      { title: 'Visibilit\u00E0 per inversione', description: 'L\'inversione di marcia \u00E8 consentita solo con visibilit\u00E0 superiore a 100 metri e non in prossimit\u00E0 di intersezioni, curve o dossi.' },
      { title: 'Rampa di accelerazione', description: 'In autostrada, usare la rampa di accelerazione per raggiungere una velocit\u00E0 compatibile con il flusso del traffico prima di immettersi nella carreggiata.' },
    ],
    commonMistakes: [
      'Cambiare corsia senza usare l\'indicatore di direzione.',
      'Effettuare inversione di marcia in condizioni di visibilit\u00E0 ridotta.',
      'Non rispettare le regole di accesso alle autostrade (rampa di accelerazione).',
    ],
    memoryTips: [
      'Destra = posizione corretta. Sempre tenere la destra.',
      'Inversione = NO curve, NO dossi, NO intersezioni, NO gallerie.',
      'Autostrada = NO inversione, NO retromarcia, NO pedoni, NO bici.',
    ],
    importantNumbers: [
      { label: 'Visibilit\u00E0 minima inversione', value: '100 metri' },
    ],
  },

  // ============================================================
  // CAPITOLO 14 - Precedenza e incroci
  // ============================================================
  {
    id: 14,
    title: 'Precedenza e incroci',
    topicGroup: 'Norme di circolazione',
    icon: '\u{1F500}',
    color: '#F59E0B',
    overview: 'Le regole di precedenza agli incroci sono fondamentali per la sicurezza. La regola generale \u00E8 "dalla destra": chi proviene da destra ha la precedenza negli incroci non segnalati. Le eccezioni includono strade prioritarie, segnaletica verticale, semafori e agenti del traffico. La mancata osservanza delle regole di precedenza \u00E8 una delle cause principali di incidenti.',
    keyPoints: [
      { title: 'Regola "dalla destra"', description: 'Negli incroci non segnalati da semafori, segnali verticali o vigili, chi proviene da destra ha la precedenza. Vale per tutti i tipi di veicoli. Non vale se un veicolo proviene da una strada sterrata (non asfaltata).' },
      { title: 'Strada prioritaria', description: 'Il segnale di strada prioritaria (rombo giallo) d\u00E0 la precedenza a chi viaggia su quella strada. Il fine strada prioritaria indica che da quel punto la precedenza non \u00E8 pi\u00F9 garantita.' },
      { title: 'Incrocio a T', description: 'Nell\'incrocio a T (strada interrotta), la strada continuata ha la precedenza. Chi proviene dalla strada interrotta deve dare la precedenza, a meno che non ci sia segnaletica diversa.' },
      { title: 'Rotatoria', description: 'All\'interno della rotatoria vige la precedenza per chi vi circola. Chi entra deve dare la precedenza. Non usare la freccia a sinistra all\'interno della rotatoria. Usare la freccia destra per uscire.' },
      { title: 'Segnale "dare precedenza" vs "stop"', description: 'Dare precedenza: rallentare e cedere il passo se necessario. Stop: FERMARSI COMPLETAMENTE sempre. Lo stop \u00E8 pi\u00F9 restrittivo.' },
    ],
    rules: [
      { title: 'Veicoli da strada sterrata', description: 'I veicoli provenienti da strade sterrate (non asfaltate) devono sempre dare la precedenza ai veicoli su strade asfaltate, indipendentemente dalla direzione di provenienza.' },
      { title: 'Veicoli di emergenza', description: 'Semaforo lampeggiante blu o sirena: fare spazio e fermarsi per far passare i veicoli di emergenza (ambulanze, vigili del fuoco, polizia). Non ostacolare il loro passaggio.' },
    ],
    commonMistakes: [
      'Non dare la precedenza "dalla destra" negli incroci non segnalati.',
      'Non fermarsi completamente allo STOP.',
      'Entrare nella rotatoria senza dare la precedenza a chi ci circola dentro.',
      'Non dare la precedenza ai veicoli di emergenza con sirena.',
    ],
    memoryTips: [
      'Dalla destra = regola generale negli incroci non segnalati.',
      'Rotatoria = chi \u00E8 dentro ha la precedenza. Freccia destra per uscire.',
      'Strada sterrata = SEMPRE dare precedenza alla strada asfaltata.',
      'Veicoli emergenza = fai spazio, fermati, lascia passare.',
    ],
    importantNumbers: [],
  },

  // ============================================================
  // CAPITOLO 15 - Sorpasso
  // ============================================================
  {
    id: 15,
    title: 'Sorpasso',
    topicGroup: 'Norme di circolazione',
    icon: '\u{1F504}',
    color: '#06B6D4',
    overview: 'Il sorpasso \u00E8 una manovra pericolosa che deve essere eseguita con cautela. \u00C8 consentito solo dove la linea \u00E8 tratteggiata e con visibilit\u00E0 sufficiente. \u00C8 vietato in prossimit\u00E0 di curve, dossi, intersezioni e passaggi pedonali. Il conducente deve segnalare la manovra con l\'indicatore di direzione e tornare nella corsia di destra dopo il sorpasso.',
    keyPoints: [
      { title: 'Quando \u00E8 vietato sorpassare', description: 'Su linea continua, in prossimit\u00E0 di curve, dosi, gallerie, intersezioni, passaggi pedonali e a livello. Con visibilit\u00E0 inferiore a 100 metri. Quando il veicolo che precede sta segnalando di sorpassare. Su strade con divieto di sorpasso.' },
      { title: 'Come eseguire il sorpasso', description: '1) Controllare gli specchietti. 2) Usare l\'indicatore sinistro. 3) Controllare l\'angolo morto. 4) Sorpassare con accelerazione adeguata. 5) Usare l\'indicatore destro. 6) Tornare nella corsia di destra mantenendo una distanza di sicurezza.' },
      { title: 'Sorpasso a destra', description: 'Generalmente vietato. Consentito solo: su strade a pi\u00F9 corsie (sorpasso nella corsia di destra), se il veicolo che precede segnala intenzione di svoltare a sinistra, su autostrade a pi\u00F9 corsie.' },
      { title: 'Veicoli lenti', description: 'I veicoli lenti (trattori, biciclette, mezzi d\'opera) possono essere sorpassati anche in presenza di linea continua se la velocit\u00E0 del veicolo lento \u00E8 inferiore a met\u00E0 del limite massimo, ma con estrema cautela.' },
    ],
    rules: [
      { title: 'Sorpasso su linea continua', description: 'Vietato. Sanzione: multa da 85 a 338 euro e decurtazione di 5 punti. Se causa incidente: responsabilit\u00E0 penale.' },
      { title: 'Visibilit\u00E0 insufficiente', description: 'Non sorpassare se la visibilit\u00E0 \u00E8 inferiore a 100 metri (curva, dosso, nebbia, pioggia intensa). Il conducente deve valutare oggettivamente le condizioni.' },
    ],
    commonMistakes: [
      'Sorpassare su linea continua.',
      'Non controllare l\'angolo morto prima di sorpassare.',
      'Non usare l\'indicatore di direzione durante il sorpasso.',
      'Sorpassare in prossimit\u00E0 di un passaggio pedonale.',
      'Rientrare troppo presto nella corsia di destra dopo il sorpasso.',
    ],
    memoryTips: [
      'Sorpasso = linea tratteggiata + visibilit\u00E0 + indicatore + angolo morto.',
      'Vietato: curve, dossi, intersezioni, passaggi pedonali, gallerie, linea continua.',
      'A destra = vietato (salvo strade a pi\u00F9 corsie o se il veicolo svolta a sinistra).',
    ],
    importantNumbers: [
      { label: 'Visibilit\u00E0 minima per sorpasso', value: '100 metri' },
      { label: 'Multa sorpasso linea continua', value: '85-338 \u20AC + 5 punti' },
    ],
  },

  // ============================================================
  // CAPITOLO 16 - Fermata, sosta e arresto
  // ============================================================
  {
    id: 16,
    title: 'Fermata, sosta e arresto',
    topicGroup: 'Norme di circolazione',
    icon: '\u{1F17F}\uFE0F',
    color: '#8B5CF6',
    overview: 'La sosta \u00E8 la fermata del veicolo con o senza conducente a bordo. La fermata \u00E8 la sosta breve per salita/discesa di passeggeri o carico/scarico di merci. L\'arresto \u00E8 la fermata per cause di forza maggiore. Esistono regole specifiche su dove \u00E8 consentito o vietato fermarsi/sostare, con sanzioni diverse per le infrazioni.',
    keyPoints: [
      { title: 'Differenza tra sosta e fermata', description: 'Sosta: veicolo fermo per qualsiasi motivo, anche senza conducente. Fermata: sosta breve (max 3 minuti) per salita/discesa passeggeri o carico/scarico merci. Divieto di sosta: la fermata breve \u00E8 consentita. Divieto di fermata: VIETATA qualsiasi fermata.' },
      { title: 'Dove \u00E8 vietato sostare', description: 'Su marciapiedi, passaggi pedonali, intersezioni, curve, dossi, in galleria, su ponti, vicino ai passaggi a livello, davanti a idranti, in doppia fila (se blocca il traffico), nelle corsie riservate, sulle strisce gialle.' },
      { title: 'Dove \u00E8 vietato fermarsi', description: 'Nei punti ciechi, in galleria, sotto i passaggi a livello, vicino ai passaggi pedonali (meno di 5 metri), in prossimit\u00E0 di curve e dossi, dove le strisce gialle lo indicano.' },
      { title: 'Parcheggio', description: 'Le aree di parcheggio sono segnalate con il cartello P blu. Rispettare le strisce delimitate, gli orari (zona disco) e le tariffe. Le stalli riservate ai disabili sono contrassegnate e la loro occupazione non autorizzata comporta multe elevate.' },
    ],
    rules: [
      { title: 'Multa per sosta vietata', description: 'Da 42 a 173 euro. Rimozione forzata: costo aggiuntivo di carro attrezzi e deposito. In zona disco orario: rispettare le fasce orarie indicate.' },
      { title: 'Multa per fermata vietata', description: 'Da 80 a 328 euro. Rimozione forzata possibile.' },
      { title: 'Parcheggio su stalli disabili', description: 'Multa da 80 a 328 euro e decurtazione di 2 punti. Prevista anche la sanzione amministrativa accessoria.' },
    ],
    commonMistakes: [
      'Confondere sosta e fermata (sosta = qualsiasi fermata, fermata = breve per salita/discesa).',
      'Sostare vicino ai passaggi pedonali (meno di 5 metri).',
      'Non rispettare le fasce orarie nella zona disco.',
      'Occupare le stalli riservate ai disabili senza permesso.',
    ],
    memoryTips: [
      'Sosta = lunga, Fermata = breve (3 min). Divieto sosta = fermata OK. Divieto fermata = TUTTO vietato.',
      '5 metri = distanza minima dal passaggio pedonale.',
      'Giallo = niente fermata. Marrone = turismo. Blu = servizi.',
    ],
    importantNumbers: [
      { label: 'Tempo max fermata', value: '3 minuti' },
      { label: 'Distanza min passaggio pedonale', value: '5 metri' },
      { label: 'Multa sosta vietata', value: '42-173 \u20AC' },
      { label: 'Multa fermata vietata', value: '80-328 \u20AC' },
    ],
  },

  // ============================================================
  // CAPITOLO 17 - Norme varie, autostrade e pannelli
  // ============================================================
  {
    id: 17,
    title: 'Norme varie, autostrade e pannelli',
    topicGroup: 'Norme di circolazione',
    icon: '\u{1F6E4}\uFE0F',
    color: '#64748B',
    overview: 'Questo capitolo copre le norme specifiche per le autostrade, le tangenziali e le strade extraurbane principali. Include regole di accesso, circolazione e uscita, norme sulle corsie di emergenza, divieti specifici delle autostrade, e norme varie sulla circolazione.',
    keyPoints: [
      { title: 'Accesso e uscita dall\'autostrada', description: 'L\'accesso avviene tramite rampa di accelerazione: il conducente deve accelerare per raggiungere la velocit\u00E0 del flusso. L\'uscita tramite rampa di decelerazione: ridurre la velocit\u00E0 gradualmente. Non attraversare mai la linea continua dell\'area di decelerazione.' },
      { title: 'Corsia di emergenza', description: 'La corsia di emergenza \u00E8 riservata alle emergenze. Si pu\u00F2 usarla solo in caso di guasto, incidente o malore. Vietato usarla per sorpassare o per fermarsi a riposare. In caso di guasto: usare la corsia di emergenza, accendere le luci di emergenza e indossare il giubbotto riflettente.' },
      { title: 'Divieti in autostrada', description: 'Vietati: pedoni, biciclette, ciclomotori, veicoli lenti, inversione di marcia, retromarcia, retrocedere, fermarsi (salvo emergenza), sorpassare dalla destra su strada a 2 corsie (consentito su 3+ corsie). La velocit\u00E0 minima \u00E8 80 km/h se non diversamente indicato.' },
      { title: 'Tangenziali', description: 'Le tangenziali urbane sono strade a scorrimento veloce con caratteristiche simili alle autostrade. Stesse regole per accesso e uscita. I limiti di velocit\u00E0 possono essere inferiori alle autostrade.' },
    ],
    rules: [
      { title: 'Guasto in autostrada', description: '1) Portare il veicolo sulla corsia di emergenza. 2) Accendere le luci di emergenza. 3) Indossare il giubbotto riflettente PRIMA di scendere. 4) Posizionare il triangolo di emergenza a 100 metri dal veicolo. 5) Chiamare il soccorso (113 o numero verde autostrada).' },
    ],
    commonMistakes: [
      'Non usare la rampa di accelerazione per raggiungere la velocit\u00E0 del traffico.',
      'Usare la corsia di emergenza per fermarsi a riposare (riservata alle emergenze).',
      'Non indossare il giubbotto riflettente prima di scendere dal veicolo in autostrada.',
    ],
    memoryTips: [
      'Autostrada: accelerazione in entrata, decelerazione in uscita.',
      'Corsia emergenza = SOLO emergenze. NON per riposare o sorpassare.',
      'Guasto = emergenze accese + giubbotto riflettente + triangolo a 100m + chiamata soccorso.',
    ],
    importantNumbers: [
      { label: 'Velocit\u00E0 min autostrada', value: '80 km/h' },
      { label: 'Triangolo emergenza distanza', value: '100 metri' },
    ],
  },

  // ============================================================
  // CAPITOLO 18 - Luci e dispositivi acustici
  // ============================================================
  {
    id: 18,
    title: 'Luci e dispositivi acustici',
    topicGroup: 'Equipaggiamento e sicurezza',
    icon: '\u{1F4A1}',
    color: '#FBBF24',
    overview: 'Le luci del veicolo sono essenziali per la sicurezza attiva e passiva. Il Codice della Strada impone l\'uso delle luci anabbaglianti in diverse situazioni: in galleria, in caso di pioggia, nebbia o neve, e dal tramonto all\'alba. Le luci di posizione (posizione), gli abbaglianti e le luci di emergenza hanno ciascuna una funzione specifica.',
    keyPoints: [
      { title: 'Luci anabbaglianti (low beam)', description: 'Obbligatorie: in galleria, in caso di pioggia, nebbia, neve o fitta oscurit\u00E0, dal tramonto all\'alba, nei passaggi a livello non presidiati. Non abbagliare i conducenti dei veicoli che precedono.' },
      { title: 'Luci abbaglianti (high beam)', description: 'Consentite fuori dai centri abitati su strade non illuminate, quando non ci sono veicoli provenienti dalla direzione opposta a meno di 100 metri. Disattivare quando si incontra un veicolo o si \u00E8 a meno di 100m dal veicolo che precede.' },
      { title: 'Luci di posizione', description: 'Obbligatorie in caso di fermata o sosta in condizioni di scarsa visibilit\u00E0. Si accendono con la prima rotazione della chiave. Non sufficienti per la circolazione notturna.' },
      { title: 'Luci di emergenza (freccia triangolare)', description: 'Si usano per segnalare un\'emergenza, un pericolo o una fermata improvvisa. Obbligatorie in caso di guasto, incidente o marcia a velocit\u00E0 eccezionalmente ridotta.' },
      { title: 'Luci nebbia', description: 'Anabbaglianti antinebbia (anteriore): consentite in caso di nebbia fitta con visibilit\u00E0 inferiore a 50 metri. Posteriori: consentite solo in caso di nebbia fitta o neve. Non usarle in condizioni normali.' },
      { title: 'Clacson (dispositivo acustico)', description: 'Obbligatorio ma da usare SOLO in caso di pericolo imminente. Vietato l\'uso del clacson in centro abitato salvo emergenza. Vietato l\'uso di clacson non originali o eccessivamente rumorosi.' },
    ],
    rules: [
      { title: 'Multa per luci spente in galleria', description: 'Da 42 a 173 euro. La mancanza di luci in galleria \u00E8 una delle infrazioni pi\u00F9 comuni e pericolose.' },
      { title: 'Luci di giorno', description: 'Non obbligatorie in condizioni di buona visibilit\u00E0 su strade urbane. Consigliate per la sicurezza passiva (DRL). Obbligatorie in autostrada per i veicoli immatricolati dopo 2011.' },
    ],
    commonMistakes: [
      'Non accendere le luci anabbaglianti in galleria o in caso di pioggia.',
      'Tenere gli abbaglianti accesi con veicoli provenienti dalla direzione opposta.',
      'Non usare le luci di emergenza per segnalare una frenata brusca.',
      'Usare le luci nebbia in condizioni normali (non in nebbia).',
    ],
    memoryTips: [
      'Anabbaglianti OBBLIGATORIE: galleria, pioggia, nebbia, neve, notte.',
      'Abbaglianti: SOLO fuori centro abitato + no veicoli opposti a meno di 100m.',
      'Emergenze = triangolo lampeggiante = pericolo o guasto.',
      'Nebbia anteriore: visibilit\u00E0 < 50m. Nebbia posteriore: solo nebbia fitta.',
    ],
    importantNumbers: [
      { label: 'Distanza abbaglianti veicolo opposto', value: '100 metri' },
      { label: 'Visibilit\u00E0 per nebbia anteriore', value: '< 50 metri' },
    ],
  },

  // ============================================================
  // CAPITOLO 19 - Cinture, casco e sicurezza
  // ============================================================
  {
    id: 19,
    title: 'Cinture, casco e sicurezza',
    topicGroup: 'Equipaggiamento e sicurezza',
    icon: '\u{1F6BA}',
    color: '#F97316',
    overview: 'I dispositivi di sicurezza sono obbligatori per proteggere conducente e passeggeri. Le cinture di sicurezza sono obbligatorie per tutti gli occupanti del veicolo. Per i bambini esistono sistemi di ritenuta specifici in base all\'altezza e al peso. Il casco \u00E8 obbligatorio per i motociclisti e i ciclomotori.',
    keyPoints: [
      { title: 'Cinture di sicurezza', description: 'Obbligatorie per conducente e tutti i passeggeri, sia davanti che dietro. La cintura a 3 punti \u00E8 il sistema standard. Non allacciare la cintura comporta multa e decurtazione punti per il conducente e per ciascun passeggero senza cintura.' },
      { title: 'Seggiolini per bambini', description: 'Obbligatorio per bambini di statura inferiore a 150 cm. Sistemi omologati secondo il regolamento ECE R44/04 o i-Size (R129). Direzione del seggiolino: fino a 15 mesi, DEVE essere rivolto all\'indietro (anti-imbardamento). Non mai sul sedile anteriore con airbag attivo.' },
      { title: 'Casco per motociclisti', description: 'Obbligatorio per conducente e passeggero di motocicli e ciclomotori. Deve essere omologato (marchio ECE 22.05 o successivo). La visiera deve essere pulita e chiusa durante la marcia. Il casco deve essere sostituito dopo un urto anche se apparentemente integro.' },
      { title: 'Giubbotto riflettente', description: 'Fortemente consigliato per motociclisti e ciclisti. In caso di fermata in autostrada, OBBLIGATORIO indossarlo prima di scendere dal veicolo. Aumenta la visibilit\u00E0 e riduce il rischio di investimento.' },
      { title: 'Airbag', description: 'L\'airbag \u00E8 un dispositivo di sicurezza passiva che si attiva in caso di urto. Il conducente deve mantenere una distanza di almeno 25 cm dal volante. Non montare seggiolini per bambini rivolti avanti sul sedile con airbag attivo senza disattivatore.' },
    ],
    rules: [
      { title: 'Multa per passeggeri senza cintura', description: 'Da 80 a 323 euro per il conducente (se minorenni) o per ogni passeggero maggiorenne senza cintura. Decurtazione di 5 punti dal conducente.' },
      { title: 'Bambini senza seggiolino', description: 'Multa da 80 a 323 euro e decurtazione di 5 punti. Il seggiolino deve essere adeguato al peso e all\'altezza del bambino.' },
    ],
    commonMistakes: [
      'Non allacciare la cintura sui sedili posteriori.',
      'Mettere un seggiolino per bambini sul sedile anteriore con airbag attivo.',
      'Non usare il seggiolino rivolto all\'indietro per bambini fino a 15 mesi.',
      'Non indossare il casco per brevi tragitti in ciclomotore.',
    ],
    memoryTips: [
      'Cintura = SEMPRE, per TUTTI, davanti e dietro.',
      'Bambini < 150cm = seggiolino obbligatorio. < 15 mesi = verso l\'indietro.',
      'Casco = obbligatorio per moto e ciclomotoro. Omologazione ECE 22.05.',
      'Giubbotto riflettente = obbligatorio in autostrada se scendi dal veicolo.',
    ],
    importantNumbers: [
      { label: 'Altezza max senza seggiolino', value: '150 cm' },
      { label: 'Et\u00E0 max seggiolino all\'indietro', value: '15 mesi' },
      { label: 'Distanza min dal volante', value: '25 cm (airbag)' },
    ],
  },

  // ============================================================
  // CAPITOLO 20 - Patente a punti e documenti
  // ============================================================
  {
    id: 20,
    title: 'Patente a punti e documenti',
    topicGroup: 'Documenti e norme',
    icon: '\u{1F4C4}',
    color: '#A855F7',
    overview: 'Il sistema della patente a punti assegna a ogni conducente 20 punti iniziali. Le infrazioni al Codice della Strada comportano la decurtazione di punti. Quando i punti si azzerano, la patente viene sospesa. \u00C8 possibile recuperare punti frequentando corsi specifici o con l\'assenza di infrazioni. I documenti obbligatori sono patente, libretto e assicurazione.',
    keyPoints: [
      { title: 'Punti iniziali', description: '20 punti per tutti i conducenti. I neopatentati (primi 3 anni) partono con 20 punti ma ogni infrazione comporta il doppio della decurtazione prevista.' },
      { title: 'Decurtazione punti', description: 'Varia in base all\'infrazione: uso cellulare = 5 punti, eccesso di velocit\u00E0 >40km/h = 10 punti, non uso cinture = 5 punti, guida in stato di ebbrezza = 10 punti. I punti vengono sottratti quando la multa diventa definitiva.' },
      { title: 'Azzeramento punti', description: 'Se i punti arrivano a 0: la patente viene revocata. Il conducente deve ripetere l\'esame teorico e pratico per riottenere la patente. Non \u00E8 possibile guidare con 0 punti.' },
      { title: 'Recupero punti', description: 'Due modi: 1) Frequentando corsi di aggiornamento presso autoscuole o ACI (+6 punti, massimo una volta ogni 2 anni). 2) Comportamento corretto: se non si commettono infrazioni per 2 anni, si torna a 20 punti automaticamente.' },
      { title: 'Documenti obbligatori', description: 'Patente di guida (valida), libretto di circolazione, certificato di assicurazione RCA. In caso di controllo, la mancanza di un documento comporta sanzioni specifiche.' },
    ],
    rules: [
      { title: 'Guida senza patente', description: 'Se la patente \u00E8 scaduta, sospesa o revocata: arresto da 6 mesi a 1 anno e multa da 5.000 a 30.000 euro. Se la patente non \u00E8 mai stata ottenuta: sanzione da 2.257 a 9.032 euro.' },
      { title: 'Patente scaduta', description: 'La patente ha validit\u00E0 di 10 anni (rinnovabile). Guidare con patente scaduta \u00E8 un reato penale. Il rinnovo deve avvenire prima della scadenza.' },
    ],
    commonMistakes: [
      'Non sapere che i neopatentati subiscono il DOSSO della decurtazione punti.',
      'Pensare che la patente scaduta sia valida per un periodo di grazia (non \u00E8 vero).',
      'Non sapere che i punti si azzerano solo quando la multa diventa definitiva.',
      'Dimenticare che il recupero punti avviene automaticamente dopo 2 anni senza infrazioni.',
    ],
    memoryTips: [
      '20 punti = inizio. 0 punti = revoca patente.',
      'Neopatentati = punti decurtati x2 per i primi 3 anni.',
      'Corso recupero = +6 punti (una volta ogni 2 anni).',
      'Nessuna infrazione per 2 anni = ritorno automatico a 20 punti.',
    ],
    importantNumbers: [
      { label: 'Punti iniziali', value: '20' },
      { label: 'Punti azzeramento = revoca', value: '0' },
      { label: 'Recupero corso', value: '+6 punti' },
      { label: 'Recupero automatico', value: '2 anni senza infrazioni' },
      { label: 'Validit\u00E0 patente B', value: '10 anni' },
    ],
  },

  // ============================================================
  // CAPITOLO 21 - Incidenti Stradali
  // ============================================================
  {
    id: 21,
    title: 'Incidenti stradali Comportamenti',
    topicGroup: 'Documenti e norme',
    icon: '\u{1F691}',
    color: '#DC2626',
    overview: 'In caso di incidente stradale, il conducente ha obblighi precisi: fermarsi, prestare soccorso, fornire le proprie generalit\u00E0 e non allontanarsi. Le procedure variano a seconda che l\'incidente sia con o senza feriti. La constatazione amichevole (modulo blu) \u00E8 possibile solo in caso di incidenti senza feriti.',
    keyPoints: [
      { title: 'Obblighi del conducente', description: 'Fermarsi immediatamente, prestare soccorso agli eventuali feriti, fornire le proprie generalit\u00E0 (nome, indirizzo, patente, assicurazione). Non allontanarsi dal luogo dell\'incidente. Rimosso il veicolo solo se ostacola il traffico e dopo aver documentato la scena.' },
      { title: 'Incidente senza feriti', description: 'Se non ci sono feriti: 1) Spostare i veicoli se ostacolano il traffico. 2) Compilare la constatazione ampievole (modulo blu). 3) Scambiare i dati assicurativi. 4) Se non c\'\u00E8 accordo, chiamare le forze dell\'ordine (112).' },
      { title: 'Incidente con feriti', description: '1) Chiamare subito il 112 (soccorso medico). 2) NON spostare i feriti (rischio di peggiorare le lesioni). 3) Non rimuovere il casco ai motociclisti feriti. 4) Segnalare l\'incidente ai veicoli in arrivo (triangolo a 50m, luci emergenza). 5) Attendere i soccorsi.' },
      { title: 'Pronto soccorso: emorragia', description: 'Se un ferito sanguina: coprire la ferita con materiale pulito e premere. Se l\'emorragia \u00E8 a un arto, sollevare l\'arto. Non usare laccui emostatici se non hai formazione specifica. Mantenere il ferito calmo e cosciente.' },
      { title: 'Omicidio stradale', description: 'Se l\'incidente causa la morte di una persona: reato penale. Il conducente che si allontana dal luogo dell\'incidente con vittime \u00E8 punito con la reclusione da 2 a 7 anni. Se il conducente \u00E8 in stato di ebbrezza: pena aggravata.' },
    ],
    rules: [
      { title: 'Fuga dopo incidente con feriti', description: 'Reclusione da 6 mesi a 3 anni. Se ci sono lesioni gravi o morte: da 2 a 7 anni. La patente viene sospesa da 1 a 3 anni.' },
      { title: 'Non soccorrere i feriti', description: '\u00C8 un reato (omissione di soccorso, art. 593 CP): reclusione fino a 1 anno o multa fino a 2.500 euro. Se le lesioni sono gravi: la pena aumenta.' },
    ],
    commonMistakes: [
      'Spostare i feriti dopo un incidente (puoi peggiorare le lesioni).',
      'Non chiamare il 112 in caso di incidente con feriti.',
      'Rimuovere il casco a un motociclista ferito (puoi causare danni alla colonna vertebrale).',
      'Allontanarsi dal luogo dell\'incidente (anche se non hai colpa).',
    ],
    memoryTips: [
      'Incidente = Fermati, Soccorri, Identifica, Non fuggire.',
      'Senza feriti = modulo blu + sposta i veicoli.',
      'Con feriti = 112 + NON spostare feriti + NON togliere casco.',
      'Fuga = reato penale (6 mesi - 7 anni a seconda della gravit\u00E0).',
    ],
    importantNumbers: [
      { label: 'Numero emergenza', value: '112' },
      { label: 'Triangolo incidente (feriti)', value: '50 metri' },
    ],
  },

  // ============================================================
  // CAPITOLO 22 - Alcool, Droga e Primo Soccorso
  // ============================================================
  {
    id: 22,
    title: 'Alcool Droga Primo Soccorso',
    topicGroup: 'Documenti e norme',
    icon: '\u{1F378}',
    color: '#BE185D',
    overview: 'La guida in stato di ebbrezza \u00E8 una delle principali cause di incidenti mortali. Il Codice della Strada stabilisce tassi massimi di alcol nel sangue: 0,5 g/l per i conducenti normali, 0,0 g/l per i neopatentati e i conducenti professionali. Le sanzioni aumentano progressivamente con il tasso di alcolemia. L\'uso di sostanze stupefacenti \u00E8 sempre vietato.',
    keyPoints: [
      { title: 'Tassi alcolemia', description: 'Conducente normale: max 0,5 g/l (grammi per litro di sangue). Neopatentati (primi 3 anni): 0,0 g/l (tolleranza zero). Conducenti professionali (autobus, taxi, camion): 0,0 g/l. Il tasso si raggiunge rapidamente: 2-3 birre possono bastare.' },
      { title: 'Sanzioni per alcol', description: '0,5-0,8 g/l: multa 527-2.108 euro + 10 punti + possibile sospensione (da 3 a 6 mesi). 0,8-1,5 g/l: multa 800-3.200 euro + 20 punti + sospensione 6 mesi-1 anno + confisca veicolo. Oltre 1,5 g/l: multa 1.500-6.000 euro + revoca patente + arresto fino a 6 mesi + confisca veicolo.' },
      { title: 'Rifiuto dell\'etilometro', description: 'Rifiutare di sottoporsi all\'alcoltest comporta le stesse sanzioni del tasso superiore a 1,5 g/l: revoca della patente, arresto fino a 6 mesi, confisca del veicolo e multa fino a 6.000 euro.' },
      { title: 'Sostanze stupefacenti', description: 'Guidare sotto effetto di droghe \u00E8 sempre un reato, a qualsiasi quantit\u00E0. Le sanzioni includono: arresto, sospensione della patente da 1 a 3 anni, confisca del veicolo e multa da 1.500 a 6.000 euro. Il conducente sottoposto a controllo conpositivo positivo perde immediatamente la patente.' },
      { title: 'Primo soccorso', description: 'In caso di incidente: ABC della rianimazione. A = Airway (liberare le vie aeree), B = Breathing (controllare la respirazione), C = Circulation (controllare il polso). Posizione laterale di sicurezza per il ferito incosciente che respira.' },
    ],
    rules: [
      { title: '0,0 g/l (tolleranza zero)', description: 'Neopatentati (primi 3 anni dalla patente), conducenti di et\u00E0 inferiore a 21 anni, conducenti professionali. Anche una singola birra pu\u00F2 far superare il limite.' },
      { title: 'Confisca del veicolo', description: 'In caso di tasso alcolemia superiore a 0,8 g/l o uso di droghe, il veicolo viene confiscato. In caso di recidiva, la confisca \u00E8 definitiva.' },
    ],
    commonMistakes: [
      'Credere di poter bere "un po\'" prima di guidare (anche un bicchiere pu\u00F2 bastare).',
      'Non sapere che i neopatentati hanno tolleranza ZERO (0,0 g/l).',
      'Rifiutare l\'etilometro (peggio che un tasso alto).',
      'Sottovalutare l\'effetto delle droghe (sanzioni uguali o peggiori dell\'alcol).',
    ],
    memoryTips: [
      '0,5 = limite normale. 0,0 = neopatentati e professionali.',
      'Rifiuto etilometro = come se avessi > 1,5 g/l (il massimo!).',
      '0,5-0,8 = punti e multa. 0,8-1,5 = punti + sospensione. > 1,5 = revoca + arresto.',
      'Droghe = SEMPRE reato. Nessun limite accettabile.',
    ],
    importantNumbers: [
      { label: 'Limite alcolemia normale', value: '0,5 g/l' },
      { label: 'Limite neopatentati', value: '0,0 g/l' },
      { label: 'Sanzione 0,5-0,8', value: '527-2.108 \u20AC + 10 pt' },
      { label: 'Sanzione 0,8-1,5', value: '800-3.200 \u20AC + 20 pt + sosp.' },
      { label: 'Sanzione > 1,5', value: 'Revoca + arresto + confisca' },
    ],
  },

  // ============================================================
  // CAPITOLO 23 - Responsabilità Civile, Penale e Assicurazione
  // ============================================================
  {
    id: 23,
    title: 'Responsabilit\u00E0 Civile Penale e Assicurazione',
    topicGroup: 'Documenti e norme',
    icon: '\u2696\uFE0F',
    color: '#475569',
    overview: 'La responsabilit\u00E0 civile e penale in caso di incidente stradale pu\u00F2 comportare conseguenze legali e finanziarie gravi. L\'assicurazione RCA (Responsabilit\u00E0 Civile Auto) \u00E8 obbligatoria per tutti i veicoli a motore. Circolare senza assicurazione \u00E8 un reato penale con sanzioni severe.',
    keyPoints: [
      { title: 'Assicurazione RCA obbligatoria', description: 'Ogni veicolo a motore deve essere coperto da assicurazione RCA. Copre i danni causati a terzi (persone e cose). NON copre i danni al veicolo del conducente responsabile. La mancata assicurazione \u00E8 un reato penale.' },
      { title: 'Circolazione senza assicurazione', description: 'Sequestro amministrativo del veicolo per 3 mesi. Multa da 849 a 3.396 euro. Il conducente che circola senza assicurazione rischia anche il ritiro della patente. Se si ripete: confisca del veicolo.' },
      { title: 'Responsabilit\u00E0 civile', description: 'Il conducente responsabile di un incidente deve risarcire i danni alle persone e alle cose. L\'assicurazione RCA copre il risarcimento fino al massimale contrattuale. Per i danni oltre il massimale, il conducente \u00E8 personalmente responsabile.' },
      { title: 'Responsabilit\u00E0 penale', description: 'Omicidio stradale: da 2 a 7 anni (fino a 18 se in stato di ebbrezza o con patente sospesa). Lesioni personali: da 3 a 18 mesi (fino a 4 anni se gravi). La fuga dal luogo del fatto \u00E8 un aggravante.' },
      { title: 'Constatazione amichevole', description: 'In caso di incidente senza feriti, le parti possono compilare il modulo CID (constatazione amichevole). Se le parti non sono d\'accordo, chiamare le forze dell\'ordine. Il modulo accelera il risarcimento.' },
    ],
    rules: [
      { title: 'Massimale RCA', description: 'L\'assicurazione copre i danni fino al massimale indicato nel contratto. Per i danni a persone: 1.070.000 euro per sinistro. Per i danni a cose: 500.000 euro per sinistro.' },
    ],
    commonMistakes: [
      'Credere che l\'assicurazione copra i danni al proprio veicolo (serve la polizza Kasko).',
      'Non sapere che circolare senza assicurazione \u00E8 un reato penale.',
      'Non compilare la constatazione ampievole dopo un incidente senza feriti.',
    ],
    memoryTips: [
      'RCA = obbligatoria. Copre danni a terzi, non al tuo veicolo.',
      'Senza RCA = sequestro veicolo + multa fino a 3.396 \u20AC.',
      'Omicidio stradale = 2-7 anni (fino a 18 se ebbrezza).',
      'Constatazione ampievole = modulo blu = pi\u00F9 veloce risarcimento.',
    ],
    importantNumbers: [
      { label: 'Multa senza RCA', value: '849-3.396 \u20AC' },
      { label: 'Sequestro veicolo', value: '3 mesi' },
    ],
  },

  // ============================================================
  // CAPITOLO 24 - Consumi, Ambiente e Inquinamento
  // ============================================================
  {
    id: 24,
    title: 'Consumi Ambiente Inquinamento',
    topicGroup: 'Documenti e norme',
    icon: '\u{1F33F}',
    color: '#059669',
    overview: 'Questo capitolo copre le norme sulle emissioni dei veicoli, l\'impatto ambientale della circolazione stradale e le buone pratiche per ridurre consumi e inquinamento. Include le norme sui controlli delle emissioni (bollino blu, revisione), i divieti di circolazione per i veicoli inquinanti e le regole sul trasporto di merci pericolose.',
    keyPoints: [
      { title: 'Controlli delle emissioni', description: 'I veicoli devono superare i controlli delle emissioni durante la revisione periodica. I veicoli che non superano i limiti non possono circolare. Le Zone a Basse Emissioni (ZFE/ZBE) vietano l\'accesso ai veicoli pi\u00F9 inquinanti.' },
      { title: 'Revisione e emissioni', description: 'La revisione include il controllo delle emissioni (CO, HC, NOx, particolato). La mancata revisione comporta il ritiro del documento di circolazione e l\'impossibilit\u00E0 di circolare legalmente.' },
      { title: 'Trasporto di merci pericolose', description: 'Il trasporto di merci pericolose (esplosivi, infiammabili, tossiche) \u00E8 regolamentato dall\'ADR. I veicoli devono avere la documentazione specifica, le targhe arancione e i dispositivi di sicurezza richiesti.' },
      { title: 'Accensione del motore fermo', description: 'Vietato tenere il motore acceso quando il veicolo \u00E8 fermo per periodi prolungati (soprattutto in centro abitato). Vietato anche l\'uso del riscaldamento con motore acceso se non si sta per ripartire.' },
      { title: 'Risparmio carburante', description: 'Guida fluida (evitare accelerate e frenate brusche), mantenere la velocit\u00E0 costante, controllare la pressione degli pneumatici (sotto-inflazione aumenta il consumo), rimuovere portapacchi non utilizzati, spegnere l\'aria condizionata quando non serve.' },
    ],
    rules: [
      { title: 'Emissioni:Revisione', description: 'La revisione verifica le emissioni. Veicoli benzina/Euro 6 e diesel/Euro 6 rispettano le norme attuali. Veicoli pi\u00F9 vecchi possono essere esclusi da certe aree urbane.' },
    ],
    commonMistakes: [
      'Non effettuare la revisione nei termini previsti.',
      'Tenere il motore acceso con il veicolo fermo in centro abitato.',
      'Non controllare la pressione degli pneumatici (aumenta consumo e usura).',
    ],
    memoryTips: [
      'Revisione = emissioni + sicurezza. Ogni 2 anni dopo i primi 4.',
      'Motore acceso fermo = vietato (inquinamento e spreco).',
      'Pneumatici gonfi = meno consumo. Sotto-gonfiati = pi\u00F9 consumo.',
    ],
    importantNumbers: [
      { label: 'Prima revisione', value: '4 anni' },
      { label: 'Revisione successiva', value: 'Ogni 2 anni' },
    ],
  },

  // ============================================================
  // CAPITOLO 25 - Elementi Veicolo, Manutenzione e Comportamenti
  // ============================================================
  {
    id: 25,
    title: 'Elementi Veicolo Manutenzione Comportamenti',
    topicGroup: 'Documenti e norme',
    icon: '\u{1F527}',
    color: '#B45309',
    overview: 'Questo capitolo copre gli elementi fondamentali del veicolo, la manutenzione ordinaria e straordinaria, e i comportamenti corretti del conducente per la sicurezza. Include le caratteristiche principali del veicolo (motore, trasmissione, freni, sospensioni, pneumatici), la manutenzione preventiva e i controlli pre-partenza.',
    keyPoints: [
      { title: 'Pneumatici', description: 'La profondit\u00E0 minima del battistrada \u00E8 1,6 mm (leggermente superiore a 4 euro). Gli pneumatici devono essere della stessa misura e tipo sullo stesso asse. Pressione di gonfiaggio: rispettare i valori indicati dal costruttore (sulla portiera o nel manuale). Sotto-gonfiaggio = consumo + usura + pericolo.' },
      { title: 'Freni', description: 'Il sistema frenante \u00E8 fondamentale per la sicurezza. Controllo: pedalino non deve essere "spugnoso" (freno idraulico). Le pastiglie devono avere uno spessore minimo. Liquido freni: verificare il livello periodicamente. In caso di frenata lunga in discesa: usare il freno motore.' },
      { title: 'Motore e olio', description: 'L\'olio motore deve essere cambiato secondo le indicazioni del costruttore (generalmente ogni 15.000-30.000 km o ogni anno). Verificare periodicamente il livello dell\'olio, del liquido di raffreddamento e del liquido lavavetro.' },
      { title: 'Controlli pre-partenza', description: 'Prima di ogni viaggio: pneumatici (pressione e usura), luci (tutte funzionanti), freni, livelli (olio, liquido raffreddamento, lavavetro), carburante, documenti. In inverno: aggiungere liquido antigelo al lavavetro.' },
      { title: 'Equipaggiamento obbligatorio', description: 'Giubbbotto riflettente (obbligatorio in autostrada se si scende dal veicolo), triangolo di emergenza, estintore (per i veicoli > 3,5t). Consigliato: kit di primo soccorso, ruota di scorta o kit di riparazione, cavi di avviamento.' },
    ],
    rules: [
      { title: 'Pneumatici lisci', description: 'Multa da 422 a 1.682 euro e decurtazione di 1 punto. In caso di neve o ghiaccio con pneumatici non idonei: sanzioni aggiuntive. I pneumatici invernali (M+S o 3PMSF) sono obbligatori in caso di neve o ghiaccio.' },
      { title: 'Luci non funzionanti', description: 'Multa da 42 a 173 euro per ogni luce non funzionante. Il conducente \u00E8 responsabile del buono stato dei dispositivi di illuminazione.' },
    ],
    commonMistakes: [
      'Guidare con pneumatici usurati (battistrada < 1,6 mm).',
      'Non verificare la pressione degli pneumatici regolarmente.',
      'Non usare il freno motore in discesa (rischio surriscaldamento freni).',
      'Dimenticare il giubbotto riflettente nel veicolo.',
    ],
    memoryTips: [
      'Pneumatici: 1,6 mm = minimo legale. Controllare spesso la pressione.',
      'Controlli pre-partenza: pneumatici + luci + freni + livelli + documenti.',
      'Discesa = freno motore (riduci marcia), non solo freno.',
      'Giubbotto riflettente = obbligatorio in autostrada.',
    ],
    importantNumbers: [
      { label: 'Battistrada minimo', value: '1,6 mm' },
      { label: 'Multa pneumatici lisci', value: '422-1.682 \u20AC + 1 pt' },
      { label: 'Cambio olio', value: '15.000-30.000 km o 1 anno' },
    ],
  },
];

export function getTheoryChapter(id: number): TheoryChapter | undefined {
  return THEORY_CHAPTERS.find(ch => ch.id === id);
}

export function getChaptersByTopic(topic: string): TheoryChapter[] {
  return THEORY_CHAPTERS.filter(ch => ch.topicGroup === topic);
}
