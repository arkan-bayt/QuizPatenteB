// ============================================================
// EXPLANATIONS DATA - Detailed explanations for all 25 chapters
// ============================================================

export interface ChapterExplanation {
  id: number;
  titleIt: string;
  titleAr: string;
  topicIt: string;
  topicAr: string;
  icon: string;
  color: string;
  overview: { it: string; ar: string };
  keyPoints: { titleIt: string; titleAr: string; descIt: string; descAr: string }[];
  commonMistakes: { it: string; ar: string }[];
  memoryTips: { it: string; ar: string }[];
}

export interface TopicInfo {
  nameIt: string;
  nameAr: string;
  icon: string;
  descriptionIt: string;
  descriptionAr: string;
  color: string;
}

export const TOPICS_INFO: TopicInfo[] = [
  {
    nameIt: 'Conoscenze generali',
    nameAr: 'المعارف العامة',
    icon: '📖',
    descriptionIt: 'Nozioni fondamentali sulla strada, veicoli e comportamento di guida sicuro.',
    descriptionAr: 'المفاهيم الأساسية عن الطريق والمركبات والسلوك الآمن أثناء القيادة.',
    color: '#3B82F6',
  },
  {
    nameIt: 'Segnali stradali',
    nameAr: 'الإشارات المرورية',
    icon: '🚦',
    descriptionIt: 'Tutti i tipi di segnali: pericolo, divieto, obbligo, precedenza, indicazione e pannelli integrativi.',
    descriptionAr: 'جميع أنواع الإشارات: الخطر، المنع، الإلزام، الأولوية، الإرشاد، واللوحات التكميلية.',
    color: '#EF4444',
  },
  {
    nameIt: 'Norme di circolazione',
    nameAr: 'قواعد السير',
    icon: '🛣️',
    descriptionIt: 'Velocità, distanze, sorpasso, precedenza, sosta, autostrade e regole di circolazione.',
    descriptionAr: 'السرعة، المسافات، التجاوز، الأولوية، الوقوف، الطرق السريعة وقواعد المرور.',
    color: '#10B981',
  },
  {
    nameIt: 'Equipaggiamento e sicurezza',
    nameAr: 'المعدات والسلامة',
    icon: '🦺',
    descriptionIt: 'Luci, cinture di sicurezza, caschi e dispositivi di protezione per conducente e passeggeri.',
    descriptionAr: 'الأضواء، أحزمة الأمان، الخوذ ومعدات الحماية للسائق والركاب.',
    color: '#F59E0B',
  },
  {
    nameIt: 'Documenti e norme',
    nameAr: 'الوثائق والقوانين',
    icon: '📄',
    descriptionIt: 'Patente di guida, documenti del veicolo, punti della patente e assicurazione.',
    descriptionAr: 'رخصة القيادة، وثائق المركبة، نقاط رخصة القيادة والتأمين.',
    color: '#8B5CF6',
  },
  {
    nameIt: 'Altro',
    nameAr: 'مواضيع أخرى',
    icon: '📚',
    descriptionIt: 'Infortunistica stradale, alcol e droghe, responsabilità civile, ambiente e manutenzione.',
    descriptionAr: 'حوادث الطريق، الكحول والمخدرات، المسؤولية المدنية، البيئة والصيانة.',
    color: '#6366F1',
  },
];

export const CHAPTER_EXPLANATIONS: ChapterExplanation[] = [
  {
    id: 1,
    titleIt: 'Conoscenze generali',
    titleAr: 'المعارف العامة',
    topicIt: 'Conoscenze generali',
    topicAr: 'المعارف العامة',
    icon: '📖',
    color: '#3B82F6',
    overview: {
      it: 'Questo capitolo copre le nozioni fondamentali che ogni conducente deve conoscere. Include concetti sulla struttura della strada, la classificazione dei veicoli, il comportamento del conducente, i diritti e doveri sulla strada, e le nozioni base di meccanica necessarie per una guida sicura. È il capitolo più ampio del quiz (531 domande) e rappresenta la base su cui si costruiscono tutte le altre conoscenze.',
      ar: 'يغطي هذا الفصل المفاهيم الأساسية التي يجب على كل سائق معرفتها. يشمل مفاهيم عن هيكل الطريق وتصنيف المركبات وسلوك السائق وحقوق وواجبات المستخدم للطريق والمفاهيم الأساسية في الميكانيكا اللازمة لقيادة آمنة. هو أكبر فصل في الاختبار (531 سؤال) ويمثل الأساس الذي تُبنى عليه جميع المعارف الأخرى.',
    },
    keyPoints: [
      {
        titleIt: 'Classificazione delle strade',
        titleAr: 'تصنيف الطرق',
        descIt: 'Le strade si dividono in: autostrade (A), strade extraurbane principali (B), strade extraurbane secondarie (C), strade urbane di scorrimento (D) e strade urbane (E), strade locali (F). Ogni tipo ha limiti di velocità e regole specifiche.',
        descAr: 'تُقسم الطرق إلى: طرق سريعة (A)، طرق خارج المدينة رئيسية (B)، طرق خارج المدينة ثانوية (C)، طرق داخل المدينة سريعة (D)، طرق حضرية (E)، وطرق محلية (F). لكل نوع حدود سرعة وقواعد محددة.',
      },
      {
        titleIt: 'Classificazione dei veicoli',
        titleAr: 'تصنيف المركبات',
        descIt: 'I veicoli si classificano in base alla massa, al numero di assi e alla destinazione d\'uso. Categoria M (autoveicoli per trasporto persone), N (autoveicoli per trasporto cose), O (rimorchi), L (veicoli a due o tre ruote). La patente B copre veicoli con massa max 3500 kg e max 8 posti.',
        descAr: 'تُصنف المركبات حسب الكتلة وعدد المحاور والاستخدام. فئة M (مركبات نقل الأشخاص)، N (مركبات نقل البضائع)، O (مقطورات)، L (مركبات بعجلتين أو ثلاث). تغطي رخصة الفئة B مركبات بكتلة قصوى 3500 كغ و8 مقاعد كحد أقصى.',
      },
      {
        titleIt: 'Posizioni di guida',
        titleAr: 'وضعيات القيادة',
        descIt: 'Il conducente deve sedersi in posizione corretta: braccia leggermente flesse sul volante, gambe con piegatura naturale sui pedali, schienale inclinato a 100-110 gradi. Specchietti retrovisori regolati correttamente: interno e due esterni. Le cinture di sicurezza devono essere sempre allacciate.',
        descAr: 'يجلس السائق في وضع صحيح: الذراعان مثنيتان قليلاً على عجلة القيادة، الساقان بثني طبيعي على الدواسات، مسند الظهر مائل 100-110 درجة. مرايا الرجوع مضبوطة بشكل صحيح: داخلية واثنتان خارجيتان. أحزمة الأمان يجب أن تكون مربوطة دائمًا.',
      },
      {
        titleIt: 'Diritti e doveri del conducente',
        titleAr: 'حقوق وواجبات السائق',
        descIt: 'Ogni conducente ha il dovere di guidare con prudenza, rispettando le regole del codice della strada. Deve mantenere il controllo del veicolo, avere la patente valida, i documenti del veicolo e l\'assicurazione. In caso di incidente, deve fermarsi e prestare soccorso.',
        descAr: 'لكل سائق واجب القيادة بحذر مع احترام قواعد قانون السير. يجب عليه الحفاظ على التحكم بالمركبة وحمل رخصة القيادة سارية ووثائق المركبة والتأمين. في حالة الحادث، يجب التوقف وتقديم المساعدة.',
      },
      {
        titleIt: 'Uso dei dispositivi',
        titleAr: 'استخدام الأجهزة',
        descIt: 'È vietato l\'uso del telefono cellulare durante la guida (anche col vivavoce se non a mani libere). Il navigatore satellitare è consentito se non richiede manipolazione prolungata. Le cuffie auricolari sono vietate. Solo dispositivi a mani libere integrati sono ammessi.',
        descAr: 'يُمنع استخدام الهاتف المحمول أثناء القيادة (حتى مع مكبر الصوت إذا لم يكن بلا يدين). يُسمح بجهاز الملاحة إذا لم يتطلب استخدامًا مطولًا. السماعات الأذنية ممنوعة. يُسمح فقط بالأجهزة اللاسلكية المدمجة.',
      },
    ],
    commonMistakes: [
      { it: 'Confondere le categorie di strade (A, B, C, D, E, F) e i rispettivi limiti di velocità.', ar: 'الخلط بين فئات الطرق (A, B, C, D, E, F) وحدود السرعة الخاصة بكل منها.' },
      { it: 'Non ricordare che la patente B copre solo veicoli fino a 3500 kg con rimorchio fino a 750 kg.', ar: 'عدم تذكر أن رخصة B تغطي فقط مركبات حتى 3500 كغ مع مقطورة حتى 750 كغ.' },
      { it: 'Credere che il telefono con vivavoce sia sempre consentito (deve essere a mani libere).', ar: 'الاعتقاد بأن الهاتف مع مكبر الصوت مسموح دائمًا (يجب أن يكون بلا يدين).' },
      { it: 'Sottovalutare l\'importanza della posizione di guida corretta per la sicurezza.', ar: 'التقليل من أهمية وضعية القيادة الصحيحة للسلامة.' },
    ],
    memoryTips: [
      { it: 'Per le categorie stradali: "A = Autostrada, B = Buona strada, C = Campagna, D = Decollo urbano, E = Entrata città, F = Fuori mano".', ar: 'لفئات الطرق: "A = Autostrada، B = Buona strada، C = Campagna، D = Decollo urbano، E = Entrata città، F = Fuori mano".' },
      { it: 'La patente B = 3500 kg + 8 posti. Ricorda: "3-5-0-8" come numero di telefono!', ar: 'رخصة B = 3500 كغ + 8 مقاعد. تذكر "3-5-0-8" كرقم هاتف!' },
    ],
  },
  {
    id: 2,
    titleIt: 'Segnali di pericolo',
    titleAr: 'إشارات الخطر',
    topicIt: 'Segnali stradali',
    topicAr: 'الإشارات المرورية',
    icon: '⚠️',
    color: '#EF4444',
    overview: {
      it: 'I segnali di pericolo sono a forma di triangolo equilatero con il vertice verso l\'alto, bordo rosso e sfondo bianco. Segnalano pericoli o situazioni di rischio per la circolazione. Devono essere sempre rispettati e richiedono un aumento dell\'attenzione del conducente. In presenza di neve o ghiaccio, il segnale di pericolo "ghiaccio/neve" può essere completato da un pannello integrativo.',
      ar: 'إشارات الخطر بشكل مثلث متساوي الأضلاع قمته للأعلى، حوافها حمراء وخلفيتها بيضاء. تنبه عن أخطار أو مواقف خطر للمرور. يجب احترامها دائمًا وتتطلب زيادة انتباه السائق. في وجود ثلج أو جليد، يمكن إكمال إشارة "ثلج/جليد" بلوحة تكميلية.',
    },
    keyPoints: [
      {
        titleIt: 'Forma e colore',
        titleAr: 'الشكل واللون',
        descIt: 'Triangolo equilatero, bordo rosso, sfondo bianco con simbolo nero. Devono essere posti a una distanza adeguata dal pericolo: almeno 150 metri fuori dai centri abitati, meno in centro abitato. Il cartello deve essere visibile e non ostruito dalla vegetazione o altri ostacoli.',
        descAr: 'مثلث متساوي الأضلاع، حواف حمراء، خلفية بيضاء مع رمز أسود. يجب وضعها على مسافة كافية من الخطر: 150 متر على الأقل خارج المدن، أقل داخل المدينة. يجب أن تكون اللوحة مرئية وغير معرقلة بالأشجار أو عوائق أخرى.',
      },
      {
        titleIt: 'Segnali di curva',
        titleAr: 'إشارات المنعطفات',
        descIt: 'Esistono diversi tipi: curva sinistra, curva destra, doppia curva (a sinistra o a destra), curva a gomito, curva ad S. La differenza tra curva e doppia curva è che nella doppia curva il veicolo deve affrontare due curve ravvicinate in direzioni opposte.',
        descAr: 'توجد عدة أنواع: منعطف يسار، منعطف يمين، منعطف مزدوج (يسار أو يمين)، منعطف زاوية حادة، منعطف حرف S. الفرق بين المنعطف والمنعطف المزدوج أن الأخير يتطلب مواجهة منعطفين متقاربين في اتجاهين متعاكسين.',
      },
      {
        titleIt: 'Passaggio a livello',
        titleAr: 'المعبر السككي',
        descIt: 'Il segnale di pericolo "passaggio a livello" indica l\'attraversamento di binari ferroviari. Quando le sbarre si abbassano o le luci lampeggiano, è obbligatorio fermarsi prima della linea di arresto. Non attraversare MAI con le sbarre in movimento. Se il veicolo si ferma sui binari, far allontanare subito tutti i passeggeri e avvisare.',
        descAr: 'إشارة خطر "المعبر السككي" تشير إلى عبور سكك حديدية. عندما تنزل الحواجز أو تومض الأضواء، من الضروري التوقف قبل خط التوقف. لا تعبر أبدًا أثناء حركة الحواجز. إذا توقفت المركبة على السكك، أزل جميع الركاب فورًا وحذر الآخرين.',
      },
      {
        titleIt: 'Altri segnali importanti',
        titleAr: 'إشارات مهمة أخرى',
        descIt: 'Caduta massi, attraversamento pedonale, bambini, lavori, strada scivolosa, galleria, ponte mobile, incrocio, contrassegno di fine zona. Ogni segnale richiede un comportamento specifico: ridurre la velocità, aumentare l\'attenzione, o prepararsi a fermarsi.',
        descAr: 'سقوط صخور، معبر مشاة، أطفال، أعمال، طريق زلقة، نفق، جسر متحرك، تقاطع، إشارة نهاية المنطقة. كل إشارة تتطلب سلوكًا محددًا: تقليل السرعة، زيادة الانتباه، أو الاستعداد للتوقف.',
      },
    ],
    commonMistakes: [
      { it: 'Confondere una curva singola con una doppia curva.', ar: 'الخلط بين منعطف مفرد ومنعطف مزدوج.' },
      { it: 'Non rispettare la distanza di posizionamento del segnale (150 metri fuori centro abitato).', ar: 'عدم احترام مسافة وضع الإشارة (150 متر خارج المدن).' },
      { it: 'Credere che i segnali di pericolo siano quadrati (sono triangolari!).', ar: 'الاعتقاد بأن إشارات الخطر مربعة (هي مثلثة!).' },
      { it: 'Ignorare i segnali temporanei di pericolo per lavori.', ar: 'تجاهل إشارات الخطر المؤقتة للأعمال.' },
    ],
    memoryTips: [
      { it: 'Pericolo = Triangolo Rosso Bianco Nero. "TRIANGOLO = Tutto Ritorna In Analisi A Guadagnare Oliv" → Triangolo = Pericolo!', ar: 'الخطر = مثلث أحمر أبيض أسود. تذكر: المثلث = خطر!' },
      { it: 'I segnali di pericolo PRECEDONO il pericolo, non lo indicano sul posto.', ar: 'إشارات الخطر تسبق الخطر، لا تشير إليه في مكانه.' },
    ],
  },
  {
    id: 3,
    titleIt: 'Segnali di divieto',
    titleAr: 'إشارات المنع',
    topicIt: 'Segnali stradali',
    topicAr: 'الإشارات المرورية',
    icon: '🚫',
    color: '#DC2626',
    overview: {
      it: 'I segnali di divieto sono generalmente rotondi con bordo rosso, sfondo bianco e simbolo nero (o solo bordo rosso con sfondo bianco per il divieto generico). Vietano comportamenti specifici: accesso, sosta, sorpasso, ecc. Il divieto di accesso (cerchio rosso) è uno dei segnali più importanti: indica che l\'accesso è vietato a TUTTI i veicoli, non solo a quelli del tipo indicato.',
      ar: 'إشارات المنع عادة دائرية بحواف حمراء وخلفية بيضاء ورمز أسود (أو حواف حمراء فقط وخلفية بيضاء للمنع العام). تمنع سلوكيات محددة: الدخول، الوقوف، التجاوز، إلخ. إشارة منع الدخول (دائرة حمراء) من أهم الإشارات: تدل على أن الدخول ممنوع لجميع المركبات، وليس فقط للنوع المحدد.',
    },
    keyPoints: [
      {
        titleIt: 'Divieto di accesso',
        titleAr: 'منع الدخول',
        descIt: 'Il segnale rotondo con bordo rosso pieno e sfondo bianco vieta l\'accesso a TUTTI i veicoli. Non riguarda solo i pedoni. Non va confuso con il senso vietato (freccia rossa su sfondo bianco) che vieta solo una direzione di marcia.',
        descAr: 'الإشارة الدائرية بحواف حمراء وخلفية بيضاء تمنع دخول جميع المركبات. لا تشمل المشاة فقط. لا تُخلط مع إشارة الاتجاه الممنوع (سهم أحمر على خلفية بيضاء) التي تمنع اتجاه سير واحد فقط.',
      },
      {
        titleIt: 'Limiti di velocità',
        titleAr: 'حدود السرعة',
        descIt: 'Il segnale rotondo con il numero indica il limite massimo di velocità in km/h. Valore tondo = limite generico. All\'interno dei centri abitati il limite generico è 50 km/h, ma può essere modificato con segnali specifici.',
        descAr: 'الإشارة الدائرية مع الرقم تحدد الحد الأقصى للسرعة بالكم/س. الرقم = الحد العام. داخل المدن الحد العام 50 كم/س، لكن يمكن تعديله بإشارات محددة.',
      },
      {
        titleIt: 'Divieto di sosta e fermata',
        titleAr: 'منع الوقوف والتوقف',
        descIt: 'Divieto di sosta: linea rossa incrociata. Divieto di fermata: linea blu incrociata. La differenza: sosta = veicolo fermo con conducente a bordo o meno; fermata = veicolo fermo brevemente per salita/discesa passeggeri o carico/scarico merci. Il divieto di fermata è più restrittivo.',
        descAr: 'منع الوقوف: خط أحمر متقاطع. منع التوقف: خط أزرق متقاطع. الفرق: الوقوف = مركبة متوقفة مع السائق أو بدونه؛ التوقف = توقف قصير لصعود/نزول الركاب أو تحميل/تفريغ البضائع. منع التوقف أكثر تقييدًا.',
      },
      {
        titleIt: 'Zona a traffico limitato (ZTL)',
        titleAr: 'منطقة مرور محدود (ZTL)',
        descIt: 'La ZTL è un\'area urbana dove l\'accesso è limitato a determinate categorie di veicoli e/o orari. L\'ingresso non autorizzato comporta sanzioni. Spesso controllata da telecamere. I residenti e i veicoli autorizzati hanno accesso con permesso speciale.',
        descAr: 'ZTL هي منطقة حضرية يُقيد فيها الدخول لفئات معينة من المركبات و/أو أوقات معينة. الدخول غير المصرح به يترتب عليه غرامات. غالبًا تُراقب بالكاميرات. السكان والمركبات المصرح لها دخول بتصريح خاص.',
      },
    ],
    commonMistakes: [
      { it: 'Confondere divieto di sosta con divieto di fermata (rosso vs blu).', ar: 'الخلط بين منع الوقوف ومنع التوقف (أحمر مقابل أزرق).' },
      { it: 'Pensare che il divieto di accesso riguardi solo alcuni veicoli.', ar: 'الاعتقاد بأن منع الدخول يخص بعض المركبات فقط.' },
      { it: 'Non distinguere il divieto generico dal senso vietato.', ar: 'عدم التمييز بين المنع العام والاتجاه الممنوع.' },
      { it: 'Dimenticare che il divieto di sorpasso vale per i veicoli a motore.', ar: 'نسيان أن منع التجاوز يسري على المركبات المزودة بمحرك.' },
    ],
    memoryTips: [
      { it: 'Divieto = Cerchio ROSSO. Rosso = STOP, vietato! Più rosso vedi, più è vietato.', ar: 'المنع = دائرة حمراء. الأحمر = توقف، ممنوع! كلما رأيت أحمر أكثر، كلما كان المنع أقوى.' },
      { it: 'Sosta = linee ROSSE incrociate (come "no parking" rosso). Fermata = linee BLU (meno grave della sosta).', ar: 'الوقوف = خطوط حمراء متقاطعة. التوقف = خطوط زرقاء (أقل خطورة من الوقوف).' },
    ],
  },
  {
    id: 4,
    titleIt: 'Segnali di obbligo',
    titleAr: 'إشارات الإلزام',
    topicIt: 'Segnali stradali',
    topicAr: 'الإشارات المرورية',
    icon: '🔵',
    color: '#2563EB',
    overview: {
      it: 'I segnali di obbligo sono rotondi con bordo blu e sfondo bianco, con simbolo nero (o solo bordo blu per l\'obbligo generico). Impongono un comportamento specifico: direzione obbligatoria, tipo di percorso, equipaggiamento obbligatorio. Il sens unico ha una forma specifica: rettangolo bianco con bordo blu e freccia nera.',
      ar: 'إشارات الإلزام دائرية بحواف زرقاء وخلفية بيضاء مع رمز أسود (أو حواف زرقاء فقط للإلزام العام). تفرض سلوكًا محددًا: اتجاه إجباري، نوع طريق، معدات إجبارية. اتجاه واحد له شكل محدد: مستطيل أبيض بحواف زرقاء وسهم أسود.',
    },
    keyPoints: [
      {
        titleIt: 'Sens unico e percorsi obbligati',
        titleAr: 'اتجاه واحد والمسارات الإجبارية',
        descIt: 'Il segnale di senso unico (rettangolare) obbliga a procedere nella direzione indicata dalla freccia. È diverso dal segnale rotondo di obbligo di direzione. Le corsie obbligatorie (frecce su sfondo blu) indicano la direzione da tenere in quella corsia specifica.',
        descAr: 'إشارة اتجاه واحد (مستطيلة) تلزم بالسير في الاتجاه المحدد بالسهم. تختلف عن الإشارة الدائرية لإلزام الاتجاه. المسارات الإجبارية (أسهم على خلفية زرقاء) تحدد الاتجاه الواجب اتباعه في المسار المحدد.',
      },
      {
        titleIt: 'Pista ciclabile',
        titleAr: 'مسار الدراجات',
        descIt: 'Il segnale di pista ciclabile obbliga i ciclisti a utilizzare la pista e vieta la circolazione di altri veicoli su di essa. Possono attraversarla solo per accedere a proprietà o aree laterali. I pedoni possono camminarci solo se non c\'è marciapiede.',
        descAr: 'إشارة مسار الدراجات تلزم راكبي الدراجات باستخدام المسار وتمنع سير مركبات أخرى عليه. يمكن عبوره فقط للوصول إلى ممتلكات أو مناطق جانبية. يمكن للمشاة المشي عليه فقط إذا لم يكن هناك رصيف.',
      },
      {
        titleIt: 'Obbligo di attrezzature',
        titleAr: 'إلزام المعدات',
        descIt: 'Alcuni segnali impongono l\'uso di attrezzature: catene da neve, pneumatici invernali, ecc. Il segnale con catene indica l\'obbligo di montare catene neve su almeno due ruote motrici.',
        descAr: 'بعض الإشارات تفرض استخدام معدات: سلاسل ثلج، إطارات شتوية، إلخ. الإشارة مع السلاسل تدل على إلزام تركيب سلاسل ثلج على عجلتين محركيتين على الأقل.',
      },
    ],
    commonMistakes: [
      { it: 'Confondere il senso unico (rettangolare) con l\'obbligo di direzione (rotondo).', ar: 'الخلط بين اتجاه واحد (مستطيل) وإلزام الاتجاه (دائري).' },
      { it: 'Pensare che la pista ciclabile sia solo una raccomandazione.', ar: 'الاعتقاد بأن مسار الدراجات مجرد توصية.' },
      { it: 'Non distinguere tra obbligo (blu) e divieto (rosso).', ar: 'عدم التمييز بين الإلزام (أزرق) والمنع (أحمر).' },
    ],
    memoryTips: [
      { it: 'Obbligo = Cerchio BLU. Blu = Basta! Devi farlo! Obbligatorio!', ar: 'الإلزام = دائرة زرقاء. الأزرق = لازم! يجب فعله! إجباري!' },
      { it: 'Sens unico = Rettangolo BLU (diverso dai segnali di obbligo che sono rotondi).', ar: 'اتجاه واحد = مستطيل أزرق (يختلف عن إشارات الإلزام الدائرية).' },
    ],
  },
  {
    id: 5,
    titleIt: 'Segnali di precedenza',
    titleAr: 'إشارات الأولوية',
    topicIt: 'Segnali stradali',
    topicAr: 'الإشارات المرورية',
    icon: '🔺',
    color: '#F59E0B',
    overview: {
      it: 'I segnali di precedenza stabiliscono chi ha il diritto di passare per primo negli incroci. Il segnale "dare precedenza" (triangolo rovesciato bianco con bordo rosso) obbliga a cedere il passo. Il segnale "stop" (ottagono rosso con scritta STOP) obbliga a fermarsi completamente prima di procedere. La precedenza è fondamentale per la sicurezza stradale.',
      ar: 'إشارات الأولوية تحدد من له الحق في المرور أولاً عند التقاطعات. إشارة "أعطِ الأولوية" (مثلث مقلوب أبيض بحواف حمراء) تلزم بتقديم الطريق. إشارة "توقف" (ثماني أحمر مع كلمة STOP) تلزم بالتوقف الكامل قبل المتابعة. الأولوية أساسية للسلامة على الطريق.',
    },
    keyPoints: [
      {
        titleIt: 'Dare precedenza vs Stop',
        titleAr: 'أعطِ الأولوية مقابل توقف',
        descIt: 'Dare precedenza: rallentare e fermarsi se necessario, dare la precedenza ai veicoli sulla strada prioritaria. Stop: fermarsi COMPLETAMENTE (ruote immobili), guardare bene e poi procedere solo se la strada è libera. Lo stop è più restrittivo della precedenza.',
        descAr: 'أعطِ الأولوية: تبطيء والتوقف إذا لزم الأمر، تقديم الأولوية للمركبات على الطريق ذي الأولوية. توقف: توقف كامل (العجلات ساكنة)، انظر جيدًا ثم تابع فقط إذا كانت الطريق خالية. إشارة التوقف أكثر تقييدًا من إشارة الأولوية.',
      },
      {
        titleIt: 'Strada prioritaria',
        titleAr: 'الطريق ذو الأولوية',
        descIt: 'Il segnale rombo giallo su sfondo bianco indica strada prioritaria. Chi viaggia su strada prioritaria ha sempre la precedenza negli incroci non segnalati. Il segnale "fine strada prioritaria" indica che la priorità sta per finire.',
        descAr: 'إشارة معين أصفر على خلفية بيضاء تدل على طريق ذي أولوية. من يسافر على طريق ذي أولوية له الأولوية دائمًا في التقاطعات غير المُشار إليها. إشارة "نهاية طريق ذي أولوية" تدل على أن الأولوية على وشك الانتهاء.',
      },
      {
        titleIt: 'Precedenza negli incroci',
        titleAr: 'الأولوية في التقاطعات',
        descIt: 'Dalla destra: chi proviene dalla destra ha la precedenza (salvo diversa segnalazione). Eccezioni: strada prioritaria, segnaletica verticale, agenti del traffico, semafori. In caso di incrocio a T, la strada continua ha la precedenza.',
        descAr: 'من اليمين: من يأتي من اليمين له الأولوية (ما لم تكن هناك إشارة مختلفة). استثناءات: طريق ذي أولوية، إشارات عمودية، عناصر مرور، إشارات ضوئية. في تقاطع على شكل T، الطريق المستمر له الأولوية.',
      },
    ],
    commonMistakes: [
      { it: 'Non fermarsi completamente allo STOP (le ruote devono fermarsi).', ar: 'عدم التوقف الكامل عند إشارة STOP (العجلات يجب أن تتوقف).' },
      { it: 'Dimenticare la regola "dalla destra" negli incroci non segnalati.', ar: 'نسيان قاعدة "من اليمين" في التقاطعات غير المُشار إليها.' },
      { it: 'Confondere dare precedenza (decelerare se necessario) con stop (fermarsi sempre).', ar: 'الخلط بين تقديم الأولوية (التسريع إذا لزم) والتوقف (التوقف دائمًا).' },
    ],
    memoryTips: [
      { it: 'STOP = Ottagono ROSSO = Fermarsi SEMPRE. Precedenza = Triangolo rovesciato = Rallentare.', ar: 'STOP = ثماني أحمر = توقف دائمًا. الأولوية = مثلث مقلوب = تبطيء.' },
      { it: 'Dalla destra: pensa alla mano destra. Chi viene da destra passa per primo.', ar: 'من اليمين: فكر باليد اليمنى. من يأتي من اليمين يمر أولاً.' },
    ],
  },
  {
    id: 6,
    titleIt: 'Segnali orizzontali',
    titleAr: 'الإشارات الأفقية',
    topicIt: 'Segnali stradali',
    topicAr: 'الإشارات المرورية',
    icon: '📏',
    color: '#8B5CF6',
    overview: {
      it: 'I segnali orizzontali (striscie e simboli sull\'asfalto) completano la segnaletica verticale e regolano la circolazione. Includono linee di margine, linee di corsia, passaggi pedonali, linee di arresto, zebrature, frecce direzionali e isole di traffico. I colori hanno significati specifici: bianco per la divisione, giallo per il divieto, azzurro per gli stalli.',
      ar: 'الإشارات الأفقية (الخطوط والرموز على الإسفلت) تكمل الإشارات العمودية وتنظم المرور. تشمل خطوط الحافة وخطوط المسار ومعابر المشاة وخطوط التوقف والتخطيط والأسهم الاتجاهية وجزر المرور. الألوان لها معانٍ محددة: أبيض للتقسيم، أصفر للمنع، أزرق لمواقف السيارات.',
    },
    keyPoints: [
      {
        titleIt: 'Linee continue e tratteggiate',
        titleAr: 'خطوط متواصلة ومنقطة',
        descIt: 'Linea continua: non si può attraversare (né sorpassare né cambiare corsia). Linea trateggiata: si può attraversare per sorpassare o cambiare corsia. Doppia linea continua: è assolutamente vietato attraversarla. Linea continua a lato tratteggiato: solo il lato tratteggiato può essere attraversato.',
        descAr: 'خط متواصل: لا يمكن عبوره (لا تجاوز ولا تغيير مسار). خط منقط: يمكن عبوره للتجاوز أو تغيير المسار. خط مزدوج متواصل: يمنع تمامًا عبوره. خط متواصل بجانب منقط: فقط الجانب المنقط يمكن عبوره.',
      },
      {
        titleIt: 'Passaggio pedonale (zebra)',
        titleAr: 'معبر المشاة',
        descIt: 'Le strisce bianche orizzontali indicano il passaggio pedonale. Il conducente deve sempre dare la precedenza ai pedoni che stanno attraversando o che manifestano l\'intenzione di farlo. La distanza di arresto prima del passaggio pedonale è di almeno 5 metri.',
        descAr: 'الخطوط البيضاء الأفقية تدل على معبر المشاة. يجب على السائق دائمًا تقديم الأولوية للمشاة الذين يعبرون أو يُبدون نية العبور. مسافة التوقف قبل معبر المشاة لا تقل عن 5 أمتار.',
      },
      {
        titleIt: 'Linee di arresto',
        titleAr: 'خطوط التوقف',
        descIt: 'Linea bianca continua trasversale: indica dove fermarsi a un segnale di stop, semaforo o incrocio. Linea gialla: indica un divieto di fermata (non si deve superare per fermarsi). Le linee di fermata dei tram sono gialle a zigzag.',
        descAr: 'خط أبيض متواصل عرضي: يحدد مكان التوقف عند إشارة توقف أو إشارة ضوئية أو تقاطع. خط أصفر: يدل على منع التوقف. خطوط توقف الترام صفراء متعرجة.',
      },
    ],
    commonMistakes: [
      { it: 'Non distinguere tra linea continua e tratteggiata.', ar: 'عدم التمييز بين الخط المتواصل والمنقط.' },
      { it: 'Sorpassare una doppia linea continua.', ar: 'التجاوز فوق خط مزدوج متواصل.' },
      { it: 'Non fermarsi prima della linea di arresto (fermarsi sopra o oltre la linea).', ar: 'عدم التوقف قبل خط التوقف (التوقف فوق أو بعد الخط).' },
      { it: 'Confondere la linea gialla (divieto) con la bianca (arresto).', ar: 'الخلط بين الخط الأصفر (منع) والأبيض (توقف).' },
    ],
    memoryTips: [
      { it: 'Continua = NO attraversare. Tratteggiata = SI può attraversare. Gialla = Vietato fermarsi.', ar: 'متواصل = لا تَعبر. منقط = يمكن العبور. أصفر = منع التوقف.' },
      { it: 'Zebratura = Pedoni. Fermati e dai la precedenza!', ar: 'التخطيط = مشاة. توقف وقدِّم الأولوية!' },
    ],
  },
  {
    id: 7,
    titleIt: 'Semafori',
    titleAr: 'الإشارات الضوئية',
    topicIt: 'Segnali stradali',
    topicAr: 'الإشارات المرورية',
    icon: '🚦',
    color: '#10B981',
    overview: {
      it: 'I semafori sono dispositivi di segnalazione luminosa che regolano la circolazione mediante tre colori: rosso (arresto), giallo/amber (attenzione/prepararsi) e verde (via libera). Il semaforo giallo lampeggiante indica cautela, il rosso lampeggiante corrisponde allo stop. Esistono semafori pedonali, per ciclisti, per tram e semafori speciali con frecce.',
      ar: 'الإشارات الضوئية أجهزة إشارة ضوئية تنظم المرور بثلاثة ألوان: أحمر (توقف)، أصفر (انتباه/استعداد) وأخضر (انطلق). الأصفر يومض يدل على الحذر، الأحمر يومض يعادل التوقف. توجد إشارات للمشاة والدراجات والترام وإشارات خاصة بأسهم.',
    },
    keyPoints: [
      {
        titleIt: 'Significato dei colori',
        titleAr: 'معنى الألوان',
        descIt: 'Rosso fisso: STOP obbligatorio. Giallo fisso: ARRESTO se possibile farlo in sicurezza (non accelerating per passare!). Verde: si può procedere ma con cautela. Rosso + giallo insieme: prepararsi alla partenza (per i veicoli già fermi). Verde lampeggiante: via libera con cautela.',
        descAr: 'أحمر ثابت: توقف إجباري. أصفر ثابت: توقف إذا أمكن بأمان (لا تُسرّع لتمر!). أخضر: يمكن المتابعة بحذر. أحمر + أصفر معًا: الاستعداد للانطلاق (للمركبات المتوقفة). أخضر يومض: انطلق بحذر.',
      },
      {
        titleIt: 'Semaforo lampeggiante',
        titleAr: 'إشارة يومضة',
        descIt: 'Giallo lampeggiante: si può procedere con estrema cautela, dando la precedenza. Si applica la regola "dalla destra". Rosso lampeggiante: equivale allo STOP, bisogna fermarsi completamente. Spesso usati di notte o in orari con poco traffico.',
        descAr: 'أصفر يومض: يمكن المتابعة بحذر شديد مع تقديم الأولوية. تسري قاعدة "من اليمين". أحمر يومض: يعادل التوقف، يجب التوقف الكامل. غالبًا تُستخدم ليلاً أو في أوقات قليلة المرور.',
      },
      {
        titleIt: 'Frecce semaforiche',
        titleAr: 'أسهم الإشارة الضوئية',
        descIt: 'Frecce verdi: consentono la direzione indicata. Freccia rossa: vietata la direzione indicata. Se c\'è sia una luce verde generica che una freccia verde, la freccia indica che il verde è solo per quella direzione. La freccia gialla indica la fine della fase protetta per quella direzione.',
        descAr: 'أسهم خضراء: تسمح بالاتجاه المحدد. سهم أحمر: الاتجاه المحدد ممنوع. إذا كان هناك ضوء أخضر عام وسهم أخضر، فالسهم يدل على أن الأخضر فقط لذلك الاتجاه. السهم الأصفر يدل على نهاية المرحلة المحمية لذلك الاتجاه.',
      },
    ],
    commonMistakes: [
      { it: 'Accelerare quando il semaforo diventa giallo per passare.', ar: 'التسريع عندما يصبح الضوء أصفر لتمريره.' },
      { it: 'Non fermarsi completamente al rosso lampeggiante (equivale a STOP).', ar: 'عدم التوقف الكامل عند الأحمر يومض (يعادل STOP).' },
      { it: 'Confondere verde lampeggiante (cautela) con verde fisso (via libera).', ar: 'الخلط بين أخضر يومض (حذر) وأخضر ثابت (انطلق).' },
    ],
    memoryTips: [
      { it: 'Rosso = Stop, Giallo = Cura (attenzione!), Verde = Vai. RGV = Ruota, Guarda, Vira.', ar: 'أحمر = توقف، أصفر = انتبه، أخضر = انطلق.' },
      { it: 'Giallo NON significa "accelera per passare"! Giallo = FERMATI se puoi.', ar: 'الأصفر لا يعني "سرّع لتمريره"! الأصفر = توقف إذا استطعت.' },
    ],
  },
  {
    id: 8,
    titleIt: 'Segnali di indicazione',
    titleAr: 'إشارات الإرشاد',
    topicIt: 'Segnali stradali',
    topicAr: 'الإشارات المرورية',
    icon: '🪧',
    color: '#06B6D4',
    overview: {
      it: 'I segnali di indicazione forniscono informazioni utili al conducente: direzioni, distanze, località, servizi (aree di servizio, ospedali, parcheggi), e informazioni sulla strada (autostrade, tangenziali). Sono generalmente rettangolari o quadrati con sfondo blu per le informazioni turistiche, verde per le autostrade, bianco per le strade urbane.',
      ar: 'إشارات الإرشاد توفر معلومات مفيدة للسائق: الاتجاهات والمسافات والمناطق والخدمات (محطات خدمة ومستشفيات ومواقف) ومعلومات عن الطريق (طرق سريعة وطرق دائرية). عادة ما تكون مستطيلة أو مربعة بخلفية زرقاء للمعلومات السياحية وخضراء للطرق السريعة وبيضاء للطرق الحضرية.',
    },
    keyPoints: [
      {
        titleIt: 'Sfondo dei segnali',
        titleAr: 'خلفية الإشارات',
        descIt: 'Blu: servizi generici, direzioni urbane. Verde: autostrade e strade extraurbane principali. Bianco: informazioni urbane. Marrone: attrazioni turistiche e culturali. Giallo: indicazioni temporanee (lavori). Il colore aiuta il conducente a capire il contesto.',
        descAr: 'أزرق: خدمات عامة واتجاهات حضرية. أخضر: طرق سريعة وطرق خارج المدينة رئيسية. أبيض: معلومات حضرية. بني: معالم سياحية وثقافية. أصفر: إشارات مؤقتة (أعمال). اللون يساعد السائق على فهم السياق.',
      },
      {
        titleIt: 'Pannelli integrativi',
        titleAr: 'لوحات تكميلية',
        descIt: 'I pannelli integrativi completano o modificano il significato dei segnali principali. Sono rettangolari, di dimensioni minori e posti sotto il segnale principale. Possono indicare distanze, direzioni, orari di validità, eccezioni o specifiche del segnale.',
        descAr: 'اللوحات التكميلية تُكمل أو تعدل معنى الإشارات الرئيسية. مستطيلة الشكل وأصغر حجمًا وتُوضع تحت الإشارة الرئيسية. يمكن أن تحدد مسافات واتجاهات وأوقات صلاحية أو استثناءات أو تفاصيل الإشارة.',
      },
      {
        titleIt: 'Segnali di conferma',
        titleAr: 'إشارات التأكيد',
        descIt: 'I segnali di conferma confermano la strada che si sta percorrendo. Si trovano dopo gli incroci e nelle intersezioni importanti. Il presegnalamento avvisa in anticipo della direzione da prendere.',
        descAr: 'إشارات التأكيد تؤكد الطريق الذي تسلكه. توجد بعد التقاطعات والتقاطعات المهمة. الإشارة المسبقة تنبه مسبقًا بالاتجاه الواجب اتخاذه.',
      },
    ],
    commonMistakes: [
      { it: 'Non comprendere il significato dei colori di sfondo.', ar: 'عدم فهم معنى ألوان الخلفية.' },
      { it: 'Ignorare i pannelli integrativi (sono parte del segnale!).', ar: 'تجاهل اللوحات التكميلية (هي جزء من الإشارة!).' },
    ],
    memoryTips: [
      { it: 'Verde = Via libera veloce (autostrada). Blu = Città e servizi. Marrone = Turismo.', ar: 'أخضر = طريق سريع. أزرق = مدينة وخدمات. بني = سياحة.' },
    ],
  },
  {
    id: 9,
    titleIt: 'Segnali complementari',
    titleAr: 'إشارات تكميلية',
    topicIt: 'Segnali stradali',
    topicAr: 'الإشارات المرورية',
    icon: '🚧',
    color: '#F97316',
    overview: {
      it: 'I segnali complementari includono i pannelli integrativi e i segnali temporanei per lavori stradali. I pannelli integrativi modificano o completano il segnale principale (distanze, validità, eccezioni). I segnali temporanei (giallo/arancio) indicano cantieri, lavori in corso o deviazioni temporanee. Hanno la stessa validità dei segnali permanenti.',
      ar: 'تشمل الإشارات التكميلية اللوحات التكميلية والإشارات المؤقتة لأعمال الطرق. اللوحات التكميلية تعدل أو تُكمل الإشارة الرئيسية (مسافات، صلاحية، استثناءات). الإشارات المؤقتة (أصفر/برتقالي) تدل على ورش أو أعمال قيد التنفيذ أو انحرافات مؤقتة. لها نفس صلاحية الإشارات الدائمة.',
    },
    keyPoints: [
      {
        titleIt: 'Pannelli integrativi',
        titleAr: 'لوحات تكميلية',
        descIt: 'Pannelli di estensione: indicano la distanza o la durata della prescrizione. Pannelli di eccezione: indicano casi in cui il segnale non si applica (es. residenti). Pannelli direzionali: indicano la direzione del segnale. Pannelli figurati: mostrano il tipo di veicolo interessato.',
        descAr: 'لوحات التمديد: تحدد المسافة أو مدة التوجيه. لوحات الاستثناء: تحدد الحالات التي لا تنطبق فيها الإشارة (مثل السكان). لوحات الاتجاه: تحدد اتجاه الإشارة. لوحات الصور: تُظهر نوع المركبة المعنية.',
      },
      {
        titleIt: 'Segnali temporanei',
        titleAr: 'إشارات مؤقتة',
        descIt: 'I segnali temporanei (sfondo giallo) hanno la PRIORITÀ sui segnali permanenti. Se c\'è un segnale temporaneo di divieto e uno permanente di obbligo, vince il temporaneo. Indicano lavori, deviazioni, restringimenti o ostacoli temporanei sulla strada.',
        descAr: 'الإشارات المؤقتة (خلفية صفراء) لها الأولوية على الإشارات الدائمة. إذا كان هناك إشارة منع مؤقتة وإشارة إلزام دائمة، تُقدَّم المؤقتة. تشير إلى أعمال أو انحرافات أو تضييق أو عوائق مؤقتة على الطريق.',
      },
    ],
    commonMistakes: [
      { it: 'Non dare priorità ai segnali temporanei rispetto a quelli permanenti.', ar: 'عدم تقديم الأولوية للإشارات المؤقتة على الدائمة.' },
      { it: 'Ignorare i pannelli integrativi pensando che non siano vincolanti.', ar: 'تجاهل اللوحات التكميلية لعدم اعتقاد أنها ملزمة.' },
    ],
    memoryTips: [
      { it: 'Segnale temporaneo (giallo) VINCE sempre su quello permanente. Giallo = "Attenzione, lavori in corso!".', ar: 'الإشارة المؤقتة (صفراء) تتفوق دائمًا على الدائمة. أصفر = "انتباه، أعمال قيد التنفيذ!".' },
    ],
  },
  {
    id: 10,
    titleIt: 'Pannelli integrativi',
    titleAr: 'اللوحات التكميلية',
    topicIt: 'Segnali stradali',
    topicAr: 'الإشارات المرورية',
    icon: '📋',
    color: '#6366F1',
    overview: {
      it: 'I pannelli integrativi forniscono informazioni aggiuntive ai segnali di pericolo, divieto, obbligo e indicazione. Sono rettangolari con sfondo bianco e bordo nero. Modificano, limitano o estendono la validità del segnale principale. È fondamentale leggerli SEMPRE insieme al segnale principale per comprendere la prescrizione completa.',
      ar: 'اللوحات التكميلية توفر معلومات إضافية لإشارات الخطر والمنع والإلزام والإرشاد. مستطيلة بخلفية بيضاء وحواف سوداء. تعدل أو تحدد أو تمدد صلاحية الإشارة الرئيسية. من الضروري قراءتها دائمًا مع الإشارة الرئيسية لفهم التوجيه الكامل.',
    },
    keyPoints: [
      {
        titleIt: 'Tipi di pannelli',
        titleAr: 'أنواع اللوحات',
        descIt: 'Estensione spaziale (freccia): indica la direzione o l\'estensione del segnale. Estensione temporale: giorni e orari di validità. Estensione delle eccezioni: casi in cui il segnale non si applica (es. residenti, veicoli autorizzati). Pannello di distanza: quantifica la distanza del pericolo o della prescrizione.',
        descAr: 'تمديد مكاني (سهم): يحدد اتجاه أو مدى الإشارة. تمديد زمني: الأيام والأوقات. تمديد الاستثناءات: الحالات التي لا تنطبق فيها الإشارة (مثل السكان، المركبات المصرح لها). لوحة المسافة: تحدد كم المسافة للخطر أو التوجيه.',
      },
      {
        titleIt: 'Validità e interpretazione',
        titleAr: 'الصلاحية والتفسير',
        descIt: 'Un pannello integrativo ha valore solo se associato a un segnale principale. Se il pannello è danneggiato o illeggibile, il segnale principale mantiene il suo significato originale. Più pannelli possono essere associati a un unico segnale principale.',
        descAr: 'اللوحة التكميلية لا قيمة لها إلا إذا كانت مرتبطة بإشارة رئيسية. إذا كانت اللوحة تالفة أو غير مقروءة، تبقى الإشارة الرئيسية بمعناها الأصلي. يمكن ربط لوحات متعددة بإشارة رئيسية واحدة.',
      },
    ],
    commonMistakes: [
      { it: 'Non leggere i pannelli integrativi (mancano le informazioni complete).', ar: 'عدم قراءة اللوحات التكميلية (تضيع المعلومات الكاملة).' },
      { it: 'Considerare i pannelli integrativi come segnali autonomi.', ar: 'اعتبار اللوحات التكميلية كإشارات مستقلة.' },
    ],
    memoryTips: [
      { it: 'Il pannello integrativo è come una "nota a piè di pagina" del segnale. Spiega sempre meglio!', ar: 'اللوحة التكميلية مثل "الحاشية" للإشارة. تشرح دائمًا بشكل أدق!' },
    ],
  },
  {
    id: 11,
    titleIt: 'Velocità',
    titleAr: 'السرعة',
    topicIt: 'Norme di circolazione',
    topicAr: 'قواعد السير',
    icon: '🏎️',
    color: '#EC4899',
    overview: {
      it: 'Le norme sulla velocità sono tra le più importanti del codice della strada. I limiti di velocità variano secondo il tipo di strada, le condizioni atmosferiche e l\'esperienza del conducente. Il neopatentato (primo anno) ha limiti più restrittivi. Sulle autostrade il limite generico è 130 km/h, fuori centro abitato 90 km/h, in centro abitato 50 km/h.',
      ar: 'قواعد السرعة من أهم قوانين السير. تختلف حدود السرعة حسب نوع الطريق والأحوال الجوية وخبرة السائق. حامل الرخصة الجديد (أول سنة) لديه حدود أكثر صرامة. على الطرق السريعة الحد العام 130 كم/س، خارج المدن 90 كم/س، داخل المدن 50 كم/س.',
    },
    keyPoints: [
      {
        titleIt: 'Limiti di velocità',
        titleAr: 'حدود السرعة',
        descIt: 'Autostrada: 130 km/h (neopatentato: 100). Strada extraurbana principale: 110 km/h (neopatentato: 90). Strada extraurbana secondaria: 90 km/h (neopatentato: 80). Centro abitato: 50 km/h. Con pioggia/nebbia: limiti ridotti. Con neve o ghiaccio: ridurre ulteriormente in base alle condizioni.',
        descAr: 'طريق سريع: 130 كم/س (رخصة جديدة: 100). طريق خارج مدينة رئيسي: 110 كم/س (رخصة جديدة: 90). طريق خارج مدينة ثانوي: 90 كم/س (رخصة جديدة: 80). داخل مدينة: 50 كم/س. مع مطر/ضباب: حدود مخفضة. مع ثلج أو جليد: تخفيض إضافي حسب الظروف.',
      },
      {
        titleIt: 'Neopatentati',
        titleAr: 'حملة الرخصة الجديدة',
        descIt: 'Nel primo anno di patente: max 100 km/h in autostrada, 90 nelle extraurbane principali, 80 nelle extraurbane secondarie. Vietato guidare veicoli con rapporto peso/potenza superiore a 55 kW/ton. Vietato l\'uso del telefono anche a mani libere. Alcol: tasso massimo 0 g/L.',
        descAr: 'في أول سنة من الرخصة: 100 كم/س كحد أقصى على الطريق السريع، 90 على الطرق الخارجية الرئيسية، 80 على الطرق الخارجية الثانوية. يمنع قيادة مركبات بنسبة وزن/قوة تتجاوز 55 كيلوواط/طن. يمنع استخدام الهاتف حتى بلا يدين. الكحول: 0 غ/ل كحد أقصى.',
      },
      {
        titleIt: 'Distanza di sicurezza',
        titleAr: 'مسافة الأمان',
        descIt: 'La distanza di sicurezza dipende dalla velocità: a 50 km/h ≈ 15 metri, a 90 km/h ≈ 36 metri, a 130 km/h ≈ 65 metri. La formula: velocità/2 × 3 = metri di distanza minima. Spazio di frenata: a 50 km/h ≈ 14m, a 90 km/h ≈ 45m, a 130 km/h ≈ 95m. Lo spazio totale di arresto include il tempo di reazione.',
        descAr: 'مسافة الأمان تعتمد على السرعة: 50 كم/س ≈ 15 متر، 90 كم/س ≈ 36 متر، 130 كم/س ≈ 65 متر. المعادلة: السرعة/2 × 3 = أمتار مسافة دنيا. مسافة الكبح: 50 كم/س ≈ 14م، 90 كم/س ≈ 45م، 130 كم/س ≈ 95م. مسافة التوقف الكلية تشمل وقت رد الفعل.',
      },
    ],
    commonMistakes: [
      { it: 'Non conoscere i limiti specifici per i neopatentati.', ar: 'عدم معرفة الحدود المحددة لحملة الرخصة الجديدة.' },
      { it: 'Dimenticare che con pioggia i limiti si riducono (autostrada: 110 km/h).', ar: 'نسيان أن مع المطر تُخفض الحدود (الطريق السريع: 110 كم/س).' },
      { it: 'Sottovalutare la distanza di frenata necessaria ad alte velocità.', ar: 'التقليل من مسافة الكبح اللازمة بسرعات عالية.' },
    ],
    memoryTips: [
      { it: 'Limiti base: 50-90-110-130 (centro-extra2-extra1-autostrada). Neopatentato: -30 in autostrada!', ar: 'الحدود الأساسية: 50-90-110-130 (مدينة-خارج ثانوي-خارج رئيسي-سريع). رخصة جديدة: -30 على الطريق السريع!' },
      { it: 'Distanza di sicurezza = velocità/2 × 3. A 100 km/h = 50 × 3 = 150 metri? No! 100/2 × 3 = 150? Ricorda la formula corretta!', ar: 'مسافة الأمان = السرعة/2 × 3. مثال: 100/2 × 3 = 150? تذكر المعادلة الصحيحة!' },
    ],
  },
  {
    id: 12,
    titleIt: 'Distanze di sicurezza',
    titleAr: 'مسافات الأمان',
    topicIt: 'Norme di circolazione',
    topicAr: 'قواعد السير',
    icon: '📏',
    color: '#14B8A6',
    overview: {
      it: 'La distanza di sicurezza è lo spazio che deve separare il proprio veicolo da quello che precede. È essenziale per potersi fermare in tempo in caso di frenata improvvisa. La distanza minima varia con la velocità, le condizioni della strada e del veicolo. Il codice della strada stabilisce che il conducente deve mantenere una distanza sufficiente per evitare collisioni.',
      ar: 'مسافة الأمان هي الفراغ الذي يجب أن يفصل مركبتك عن المركبة التي أمامك. ضرورية للتمكن من التوقف في الوقت المناسب في حالة فرملة مفاجئة. المسافة الدنيا تختلف حسب السرعة وحالة الطريق والمركبة. يحدد قانون السير أن السائق يجب أن يحافظ على مسافة كافية لتجنب الاصطدامات.',
    },
    keyPoints: [
      {
        titleIt: 'Regola dei secondi',
        titleAr: 'قاعدة الثواني',
        descIt: 'La regola pratica dei 2 secondi: mantenere un intervallo di almeno 2 secondi dal veicolo che precede. Scegliere un punto fisso sulla strada (cartello, ponte) e contare "milleuno, mille Due" dal passaggio del veicolo precedente. Su strada bagnata o sdrucciolevole, raddoppiare a 4 secondi.',
        descAr: 'قاعدة الثانيتين العملية: الحفاظ على فاصل 2 ثانيتين على الأقل من المركبة التي أمامك. اختر نقطة ثابتة على الطريق (إشارة، جسر) وعدّ "ألف واحد، ألف اثنان" من مرور المركبة السابقة. على طريق مبللة أو زلقة، ضعف إلى 4 ثوانٍ.',
      },
      {
        titleIt: 'Frenata d\'emergenza',
        titleAr: 'الفرملة الطارئة',
        descIt: 'Tempo di reazione medio: circa 1 secondo (può arrivare a 2 secondi in condizioni di stanchezza). Spazio di frenata aumenta con il quadrato della velocità: raddoppiando la velocità, lo spazio di frenata quadruplica. A 50 km/h ≈ 14m di frenata, a 100 km/h ≈ 56m, a 130 km/h ≈ 95m.',
        descAr: 'وقت رد الفعل المتوسط: حوالي ثانية واحدة (يمكن أن يصل إلى ثانيتين في حالة التعب). مسافة الكبح تزداد بمربع السرعة: مضاعفة السرعة تضاعف مسافة الكربع أربع مرات. 50 كم/س ≈ 14م كبح، 100 كم/س ≈ 56م، 130 كم/س ≈ 95م.',
      },
      {
        titleIt: 'Caso specifico: mezzi pesanti',
        titleAr: 'حالة خاصة: المركبات الثقيلة',
        descIt: 'I mezzi pesanti hanno spazi di frenata superiori. La distanza di sicurezza deve essere maggiore. Nei tunnel, la distanza minima è di 50 metri per i veicoli con massa > 3,5t. Su strade di montagna, aumentare ulteriormente la distanza.',
        descAr: 'المركبات الثقيلة لها مسافات كبح أكبر. مسافة الأمان يجب أن تكون أكبر. في الأنفاق، المسافة الدنيا 50 متر للمركبات بكتلة > 3,5 طن. على طرق الجبال، زيادة المسافة أكثر.',
      },
    ],
    commonMistakes: [
      { it: 'Non aumentare la distanza di sicurezza con pioggia o neve.', ar: 'عدم زيادة مسافة الأمان مع المطر أو الثلج.' },
      { it: 'Sottovalutare lo spazio di frenata alle alte velocità (cresce col quadrato della velocità).', ar: 'التقليل من مسافة الكبح بسرعات عالية (تزداد بمربع السرعة).' },
      { it: 'Non rispettare la distanza minima nei tunnel.', ar: 'عدم احترام المسافة الدنيا في الأنفاق.' },
    ],
    memoryTips: [
      { it: '2 secondi = minimo. Bagnato = 4 secondi. Tunnel > 50 metri per mezzi pesanti.', ar: 'ثانيتان = الحد الأدنى. مبلل = 4 ثوانٍ. نفق > 50 متر للمركبات الثقيلة.' },
    ],
  },
  {
    id: 13,
    titleIt: 'Norme di circolazione',
    titleAr: 'قواعد السير',
    topicIt: 'Norme di circolazione',
    topicAr: 'قواعد السير',
    icon: '🛣️',
    color: '#0EA5E9',
    overview: {
      it: 'Questo capitolo copre le regole generali di circolazione su strada: posizione del veicolo sulla carreggiata, senso di marcia, uso delle corsie, attraversamento di intersezioni, rotatorie, e comportamento in situazioni speciali. Stabilisce le regole base che ogni conducente deve seguire per circolare in sicurezza e nel rispetto della legge.',
      ar: 'يغطي هذا الفصل قواعد السير العامة على الطريق: وضع المركبة على مسار السير، اتجاه الحركة، استخدام المسارات، عبور التقاطعات، الدوارات، والسلوك في حالات خاصة. يحدد القواعد الأساسية التي يجب على كل سائق اتباعها للسير بأمان وضمن القانون.',
    },
    keyPoints: [
      {
        titleIt: 'Posizione sulla carreggiata',
        titleAr: 'الوضع على مسار السير',
        descIt: 'Il conducente deve tenere il lato destro della carreggiata. Su strade a più corsie, utilizzare la corsia più a destra compatibile con la propria direzione. La corsia di accelerazione serve per immettersi nel flusso; la corsia di decelerazione per uscire. Non circolare sulle corsie di emergenza.',
        descAr: 'يجب على السائق البقاء على الجانب الأيمن من مسار السير. على طرق متعددة المسارات، استخدم المسار الأيمن المتوافق مع اتجاهك. مسار التسريع للانضمام للتيار؛ مسار التباطؤ للخروج. لا تسير على مسارات الطوارئ.',
      },
      {
        titleIt: 'Rotatorie',
        titleAr: 'الدوارات',
        descIt: 'Nelle rotatorie: chi è già nella rotatoria ha la precedenza su chi vuole entrare. Segnalare con la freccia: a sinistra quando si entra, a destra quando si esce. Scegliere la corsia corretta in base all\'uscita desiderata: corsia esterna per la prima uscita, corsia interna per uscite successive.',
        descAr: 'في الدوارات: من هو بالداخل له الأولوية على من يريد الدخول. استخدم الإشارة: يسار عند الدخول، يمين عند الخروج. اختر المسار الصحيح حسب المخرج المطلوب: المسار الخارجي للمخرج الأول، المسار الداخلي للمخارج اللاحقة.',
      },
      {
        titleIt: 'Inversione e retromarcia',
        titleAr: 'الاستدارة والرجوع للخلف',
        descIt: 'L\'inversione di marcia è vietata nelle curve, in prossimità di dossi, in galleria, sui ponti, sulle rampe, sulle corsie di accelerazione/decelerazione e in condizioni di visibilità insufficiente. La retromarcia è ammessa solo per manovre brevi e quando non crea pericolo.',
        descAr: 'يُمنع الاستدارة في المنعطفات وقرب التلال وفي الأنفاق وعلى الجسور وعلى المنحدرات ومسارات التسريع/التباطؤ وفي ظروف رؤية غير كافية. الرجوع للخلف مسموح فقط لمناورات قصيرة عندما لا يُنشئ خطرًا.',
      },
    ],
    commonMistakes: [
      { it: 'Non dare la precedenza a chi è già nella rotatoria.', ar: 'عدم تقديم الأولوية لمن هو بالداخل في الدوارة.' },
      { it: 'Circolare sulla corsia di emergenza.', ar: 'السير على مسار الطوارئ.' },
      { it: 'Invertire la marcia in luoghi vietati (curve, gallerie, ponti).', ar: 'الاستدارة في أماكن ممنوعة (منعطفات، أنفاق، جسور).' },
    ],
    memoryTips: [
      { it: 'Rotatoria = Chi c\'è dentro passa. Come un tondo di boxe: chi è sul ring ha la precedenza!', ar: 'الدوارة = من بالداخل يمر. كحلبة ملاكمة: من على الحلبة له الأولوية!' },
    ],
  },
  {
    id: 14,
    titleIt: 'Precedenza e sorpasso',
    titleAr: 'الأولوية والتجاوز',
    topicIt: 'Norme di circolazione',
    topicAr: 'قواعد السير',
    icon: '🔀',
    color: '#A855F7',
    overview: {
      it: 'Le regole di precedenza e sorpasso sono fondamentali per la sicurezza. Il sorpasso è una manovra pericolosa che va eseguita solo quando è completamente sicuro. È vietato sorpassare sulle linee continue, in curve, in gallerie (se non è permesso), in prossimità di incroci e dossi. La regola base della precedenza: "dalla destra" salvo diversa segnalazione.',
      ar: 'قواعد الأولوية والتجاوز أساسية للسلامة. التجاوز مناورة خطيرة يجب تنفيذها فقط عندما تكون آمنة تمامًا. يُمنع التجاوز على الخطوط المتواصلة وفي المنعطفات وفي الأنفاق (إذا لم يُسمح) وقرب التقاطعات والتلال. قاعدة الأولوية الأساسية: "من اليمين" ما لم تكن هناك إشارة مختلفة.',
    },
    keyPoints: [
      {
        titleIt: 'Quando è vietato sorpassare',
        titleAr: 'متى يُمنع التجاوز',
        descIt: 'Su linea continua o doppia continua, in curva, in galleria (salvo segnaletica che lo consenta), in prossimità di dossi e incroci (con visibilità < 100m), quando il veicolo che precede sta segnalandolo (freccia destra), in caso di nebbia densa o neve, quando un veicolo da sinistra sta sorpassando.',
        descAr: 'على خط متواصل أو مزدوج متواصل، في منعطف، في نفق (ما لم تسمح الإشارة)، قرب التلال والتقاطعات (مع رؤية < 100م)، عندما المركبة الأمامية تُشير لذلك (إشارة يمين)، في حالة ضباب كثيف أو ثلج، عندما مركبة من اليسار تتجاوز.',
      },
      {
        titleIt: 'Come eseguire il sorpasso',
        titleAr: 'كيفية تنفيذ التجاوز',
        descIt: '1) Controllare gli specchietti retrovisori. 2) Controllare l\'angolo morto (over-the-shoulder). 3) Mettere la freccia sinistra. 4) Accelerare e superare. 5) Mettere la freccia destra. 6) Riprendere la corsia mantenendo una distanza di sicurezza. Non superare i limiti di velocità per sorpassare.',
        descAr: '1) تحقق من المرايا. 2) تحقق من الزاوية العمياء. 3) ضع إشارة اليسار. 4) سرّع وتجاوز. 5) ضع إشارة اليمين. 6) عُد للمسار مع الحفاظ على مسافة أمان. لا تتجاوز حدود السرعة للتجاوز.',
      },
      {
        titleIt: 'Precedenza agli incroci',
        titleAr: 'الأولوية في التقاطعات',
        descIt: 'Regola generale: precedenza "dalla destra". Eccezioni: strada prioritaria, segnaletica verticale, semafori, agenti del traffico. Nei roundabout: chi gira ha la precedenza. Nei crois a T: la strada continua ha la precedenza. Nei crois a 4 braccia: si applicano le regole generali.',
        descAr: 'القاعدة العامة: الأولوية "من اليمين". استثناءات: طريق ذي أولوية، إشارات عمودية، إشارات ضوئية، شرطة المرور. في الدوارات: من يدور له الأولوية. في تقاطع T: الطريق المستمر له الأولوية. في التقاطعات الرباعية: تسري القواعد العامة.',
      },
    ],
    commonMistakes: [
      { it: 'Sorpassare su linea continua o doppia continua.', ar: 'التجاوز على خط متواصل أو مزدوج متواصل.' },
      { it: 'Non controllare l\'angolo morto prima di sorpassare.', ar: 'عدم التحقق من الزاوية العميقة قبل التجاوز.' },
      { it: 'Dimenticare la regola della precedenza "dalla destra".', ar: 'نسيان قاعدة الأولوية "من اليمين".' },
      { it: 'Accelerare durante il sorpasso superando il limite di velocità.', ar: 'التسريع أثناء التجاوز وتجاوز حد السرعة.' },
    ],
    memoryTips: [
      { it: 'Prima di sorpassare: Specchietti + Angolo morto + Freccia. S-M-A-F = Sorpasso sicuro!', ar: 'قبل التجاوز: مرايا + زاوية عمياء + إشارة. تذكر دائمًا!' },
      { it: 'Sorpasso vietato: Curva, Continuous line, Galleria, Incrocio, Dosso = "C-C-G-I-D".', ar: 'التجاوز ممنوع: منعطف، خط متواصل، نفق، تقاطع، تل = تذكر!' },
    ],
  },
  {
    id: 15,
    titleIt: 'Sosta e fermata',
    titleAr: 'الوقوف والتوقف',
    topicIt: 'Norme di circolazione',
    topicAr: 'قواعد السير',
    icon: '↗️',
    color: '#22C55E',
    overview: {
      it: 'Le regole di sosta e fermata definiscono dove e come è possibile parcheggiare. La sosta è la fermata prolungata del veicolo (con o senza conducente). La fermata è la sosta breve per salita/discesa passeggeri o carico/scarico merci. Esistono divieti specifici: curve, incroci, passaggi a livello, marciapiedi, piste ciclabili, strisce gialle.',
      ar: 'قواعد الوقوف والتوقف تحدد أين وكيف يمكن ركن السيارة. الوقوف هو توقف طويل للمركبة (مع أو بدون سائق). التوقف هو وقوف قصير لصعود/نزول الركاب أو تحميل/تفريغ البضائع. توجد منوعات محددة: منعطفات، تقاطعات، معابر سككية، أرصفة، مسارات دراجات، خطوط صفراء.',
    },
    keyPoints: [
      {
        titleIt: 'Dove è vietata la sosta',
        titleAr: 'أين يُمنع الوقوف',
        descIt: 'In corrispondenza di passaggi a livello, incroci (entro 5 metri), curve con visibilità < 10m, strade strette, ponti, gallerie, sopra i marciapiedi, sulle piste ciclabili, sugli spazi riservati ai disabili (senza permesso), sulle strisce gialle, davanti agli idranti.',
        descAr: 'عند المعابر السككية، التقاطعات (ضمن 5 أمتار)، منعطفات برؤية < 10م، طرق ضيقة، جسور، أنفاق، فوق الأرصفة، مسارات دراجات، أماكن ذوي الإعاقة (بدون تصريح)، خطوط صفراء، أمام حنفيات الإطفاء.',
      },
      {
        titleIt: 'Parcheggio e stalli',
        titleAr: 'ركن السيارات والأماكن',
        descIt: 'Stalli blu: a pagamento (disco orario o parchimetro). Strisce bianche: libere. Strisce gialle: riservate (residenti, disabili, carico/scarico). Parcheggio in senso contrario alla marcia: vietato. Parcheggio a pettine o in linea: entrambi consentiti se segnalati.',
        descAr: 'أماكن زرقاء: مدفوعة (قرص زمني أو عداد). خطوط بيضاء: حرة. خطوط صفراء: محجوزة (سكان، ذوو إعاقة، تحميل/تفريغ). ركن عكس اتجاه السير: ممنوع. ركن عمودي أو متوازي: كلاهما مسموح إذا أُشير إليه.',
      },
    ],
    commonMistakes: [
      { it: 'Sostare entro 5 metri da un incrocio.', ar: 'الوقوف ضمن 5 أمتار من تقاطع.' },
      { it: 'Parcheggiare in senso contrario alla marcia.', ar: 'الركن عكس اتجاه السير.' },
      { it: 'Non distinguere tra strisce bianche (libere), blu (a pagamento) e gialle (riservate).', ar: 'عدم التمييز بين خطوط بيضاء (حرة)، زرقاء (مدفوعة) وصفراء (محجوزة).' },
    ],
    memoryTips: [
      { it: 'Incrocio = 5 metri di distanza MINIMA. Passaggio a livello = ASSOLUTAMENTE VIETATO.', ar: 'تقاطع = 5 أمتار مسافة دنيا. معبر سككي = ممنوع تمامًا.' },
    ],
  },
  {
    id: 16,
    titleIt: 'Autostrade',
    titleAr: 'الطرق السريعة',
    topicIt: 'Norme di circolazione',
    topicAr: 'قواعد السير',
    icon: '🅿️',
    color: '#3B82F6',
    overview: {
      it: 'Le autostrade sono strade a carreggiate indipendenti senza intersezioni a raso. Il limite di velocità generico è 130 km/h (100 per neopatentati). Sono vietati: pedoni, biciclette, ciclomotori, trattori. L\'accesso è solo attraverso le rampe di accelerazione, l\'uscita attraverso le corsie di decelerazione. È obbligatoria la corsia di emergenza.',
      ar: 'الطرق السريعة طرق بمسارات مستقلة بدون تقاطعات مستوية. حد السرعة العام 130 كم/س (100 للرخصة الجديدة). ممنوع: المشاة، الدراجات، الدراجات النارية الصغيرة، الجرارات. الدخول فقط عبر مسارات التسريع، الخروج عبر مسارات التباطؤ. مسار الطوارئ إجباري.',
    },
    keyPoints: [
      {
        titleIt: 'Regole specifiche',
        titleAr: 'قواعد خاصة',
        descIt: 'Vietato invertire la marcia, fare retromarcia o fermarsi (salvo emergenza). Vietato attraversare la corsia di emergenza. Vietato transitare sulle corsie di accelerazione/decelerazione. Obbligo di accendere le luci anabbaglianti o abbaglianti. Nei casi di coda: accendere le quattro frecce e mantenere la distanza.',
        descAr: 'يُمنع الاستدارة والرجوع للخلف أو التوقف (إلا في حالات الطوارئ). يُمنع عبور مسار الطوارئ. يُمنع السير على مسارات التسريع/التباطؤ. إلزام إضاءة الخفافيش أو الكشافات. في حالة الازدحام: أشعل الأربعة اتجاهات وحافظ على المسافة.',
      },
      {
        titleIt: 'Limiti di velocità',
        titleAr: 'حدود السرعة',
        descIt: 'Tempo sereno: 130 km/h (neopatentato 100). Pioggia: 110 km/h (neopatentato 90). Neve/ghiaccio: ridurre ulteriormente. Nei tratti urbani: 90 km/h. Nei tunnel: 90 km/h. Per i mezzi pesanti: 80 km/h. Per i rimorchi: 80 km/h.',
        descAr: 'طقس صافٍ: 130 كم/س (رخصة جديدة 100). مطر: 110 كم/س (رخصة جديدة 90). ثلج/جليد: تخفيض إضافي. في المناطق الحضرية: 90 كم/س. في الأنفاق: 90 كم/س. للمركبات الثقيلة: 80 كم/س. للمقطورات: 80 كم/س.',
      },
    ],
    commonMistakes: [
      { it: 'Sostare o fermarsi in autostrada senza motivo di emergenza.', ar: 'الوقوف أو التوقف على الطريق السريع بدون سبب طوارئ.' },
      { it: 'Circolare sulla corsia di emergenza.', ar: 'السير على مسار الطوارئ.' },
      { it: 'Non accendere le luci di posizione anabbagliante in autostrada.', ar: 'عدم إضاءة الأضواء الخافتة على الطريق السريعة.' },
    ],
    memoryTips: [
      { it: 'Autostrada = No Stop, No Inversione, No Retromarcia. SOLO emergenza per fermarsi.', ar: 'الطريق السريع = لا توقف، لا استدارة، لا رجوع للخلف. التوقف فقط في حالات الطوارئ.' },
    ],
  },
  {
    id: 17,
    titleIt: 'Strade extraurbane',
    titleAr: 'الطرق خارج المدن',
    topicIt: 'Norme di circolazione',
    topicAr: 'قواعد السير',
    icon: '🛤️',
    color: '#64748B',
    overview: {
      it: 'Le strade extraurbane si dividono in principali (tipo B) e secondarie (tipo C). Le principali hanno due carreggiate separate e limite di 110 km/h. Le secondarie hanno una singola carreggiata e limite di 90 km/h. Le regole di sorpasso, precedenza e sosta si applicano con le stesse modalità generali, con particolare attenzione alla visibilità.',
      ar: 'تنقسم الطرق خارج المدن إلى رئيسية (نوع B) وثانوية (نوع C). الرئيسية لها مساران منفصلان وحد 110 كم/س. الثانوية لها مسار واحد وحد 90 كم/س. تطبق قواعد التجاوز والأولوية والوقوف بنفس الطريقة العامة، مع اهتمام خاص بالرؤية.',
    },
    keyPoints: [
      {
        titleIt: 'Differenze tra principali e secondarie',
        titleAr: 'الفرق بين الرئيسية والثانوية',
        descIt: 'Principali (B): due carreggiate, 110 km/h, corsie di accelerazione/decelerazione. Secondarie (C): singola carreggiata, 90 km/h, senza corsie speciali. Nei centri abitati attraversati: limite 50 km/h. Le strade extraurbane sono soggette a limiti ridotti in caso di cattive condizioni meteorologiche.',
        descAr: 'الرئيسية (B): مساران، 110 كم/س، مسارات تسريع/تباطؤ. الثانوية (C): مسار واحد، 90 كم/س، بدون مسارات خاصة. في المناطق المأهولة: 50 كم/س. الطرق خارج المدن تخضع لحدود مخفضة في حالة سوء الأحوال الجوية.',
      },
    ],
    commonMistakes: [
      { it: 'Confondere i limiti tra strade principali e secondarie.', ar: 'الخلط بين حدود الطرق الرئيسية والثانوية.' },
    ],
    memoryTips: [
      { it: 'Extraurbana principale = 110, Secondaria = 90. B = Bella (110), C = Calma (90).', ar: 'طريق خارجي رئيسي = 110، ثانوي = 90.' },
    ],
  },
  {
    id: 18,
    titleIt: 'Luci e illuminazione',
    titleAr: 'الأضواء والإضاءة',
    topicIt: 'Equipaggiamento e sicurezza',
    topicAr: 'المعدات والسلامة',
    icon: '💡',
    color: '#FBBF24',
    overview: {
      it: 'Il sistema di illuminazione del veicolo è essenziale per la sicurezza. Le luci di posizione (anabbaglianti/abbaglianti, frecce, luci di stop, retromarcia, fendinebbia) servono a vedere ed essere visti. L\'uso corretto delle luci varia secondo le condizioni: di notte, in galleria, con pioggia/nebbia, in autostrada.',
      ar: 'نظام إضاءة المركبة أساسي للسلامة. أضواء الموضع (خفافيش/كشافات، إشارات انعطاف، أضواء فرملة، رجوع للخلف، ضباب) لرؤية الآخرين ورؤيتهم. الاستخدام الصحيح للأضواء يختلف حسب الظروف: ليلاً، في النفق، مع مطر/ضباب، على الطريق السريعة.',
    },
    keyPoints: [
      {
        titleIt: 'Tipi di luci',
        titleAr: 'أنواع الأضواء',
        descIt: 'Luci di posizione (anabbaglianti): uso obbligatorio da mezz\'ora dopo il tramonto a mezz\'ora prima dell\'alba, in galleria, con pioggia/nebbia/neve. Abbaglianti: fuori centro abitato, senza traffico opposto. Frecce: obbligatorie per ogni cambio di direzione. Luci di emergenza (4 frecce): guasto o emergenza.',
        descAr: 'أضواء الموضع (خفافيش): إلزامية من نصف ساعة بعد غروب الشمس لنصف ساعة قبل الشروق، في النفق، مع مطر/ضباب/ثلج. الكشافات: خارج المدن بدون مرور معاكس. إشارات الانعطاف: إجبارية لكل تغيير اتجاه. أضواء الطوارئ (4 اتجاهات): عطل أو حالة طوارئ.',
      },
      {
        titleIt: 'Uso in galleria',
        titleAr: 'الاستخدام في النفق',
        descIt: 'In galleria è obbligatorio l\'uso delle luci anabbaglianti (o abbaglianti se assente traffico opposto). Le luci diurne (DRL) non sostituiscono le luci anabbaglianti. In caso di guasto del veicolo, accendere le 4 frecce e indossare il giubbotto riflettente prima di scendere.',
        descAr: 'في النفق إلزام استخدام الأضواء الخافتة (أو الكشافات إذا لم يكن هناك مرور معاكس). أضواء النهار (DRL) لا تُغني عن الأضواء الخافتة. في حالة عطل المركبة، أشعل 4 الاتجاهات وارتدِ سترة عاكسة قبل النزول.',
      },
      {
        titleIt: 'Fendinebbia e nebbia',
        titleAr: 'أضواء الضباب',
        descIt: 'Fendinebbia anteriore: consentito con nebbia, neve forte o pioggia intensa (visibilità < 50m). Fendinebbia posteriore: obbligatorio con nebbia fitta (visibilità < 50m), vietato in assenza di nebbia. Abbaglianti: vietati con nebbia (riflettono e accecano).',
        descAr: 'ضباب أمامي: مسموح مع ضباب أو ثلج شديد أو مطر غزير (رؤية < 50م). ضباب خلفي: إلزامي مع ضباب كثيف (رؤية < 50م)، ممنوع في غياب الضباب. الكشافات: ممنوعة مع الضباب (تعكس وتُعمي).',
      },
    ],
    commonMistakes: [
      { it: 'Usare le luci diurne (DRL) al posto delle anabbaglianti in galleria o di notte.', ar: 'استخدام أضواء النهار بدلاً من الخافتة في النفق أو ليلاً.' },
      { it: 'Tenere acceso il fendinebbia posteriore senza nebbia.', ar: 'إبقاء ضباب خلفي مضاء بدون ضباب.' },
      { it: 'Usare gli abbaglianti con nebbia (peggiorano la visibilità).', ar: 'استخدام الكشافات مع الضباب (تُفقد الرؤية).' },
    ],
    memoryTips: [
      { it: 'Anabbaglianti = Sempre (notte, galleria, pioggia). Abbaglianti = Fuori città, no traffico opposto. Fendinebbia = < 50m visibilità.', ar: 'خفافيش = دائمًا (ليل، نفق، مطر). كشافات = خارج المدينة، بدون مرور معاكس. ضباب = < 50م رؤية.' },
    ],
  },
  {
    id: 19,
    titleIt: 'Cinture, caschi e dispositivi di sicurezza',
    titleAr: 'الأحزمة والخوذ ومعدات السلامة',
    topicIt: 'Equipaggiamento e sicurezza',
    topicAr: 'المعدات والسلامة',
    icon: '🦺',
    color: '#F43F5E',
    overview: {
      it: 'L\'uso di cinture di sicurezza, caschi e altri dispositivi di protezione è obbligatorio per legge. La cintura deve essere allacciata sia in città che fuori, sia davanti che dietro. I bambini fino a 12 anni o 150 cm devono usare seggiolini adeguati. Il casco è obbligatorio per ciclomotori e motocicli. Le sanzioni sono elevate.',
      ar: 'استخدام أحزمة الأمان والخوذ ومعدات الحماية الأخرى إلزامي بالقانون. يجب ربط الحزام في المدينة وخارجها، أمامًا وخلفًا. الأطفال حتى 12 سنة أو 150 سم يجب أن يستخدموا مقاعد مناسبة. الخوذة إجبارية للدراجات النارية. الغرامات مرتفعة.',
    },
    keyPoints: [
      {
        titleIt: 'Cinture di sicurezza',
        titleAr: 'أحزمة الأمان',
        descIt: 'Obbligatorie per tutti i passeggeri (anteriori e posteriori), su tutte le strade e in tutte le condizioni. Eccezioni: donne in gravidanza (con prescrizione medica), persone con certificato medico. Multa: 80-323 euro + decurtazione punti. I bambini sotto i 150cm devono usare dispositivi di ritenuta adeguati.',
        descAr: 'إجبارية لجميع الركاب (أماميين وخلفيين)، على جميع الطرق وفي جميع الظروف. استثناءات: نساء حوامل (بوصفة طبية)، أشخاص بشهادة طبية. غرامة: 80-323 يورو + خصم نقاط. الأطفال أقل من 150 سم يجب أن يستخدموا أجهزة تقييد مناسبة.',
      },
      {
        titleIt: 'Seggiolini per bambini',
        titleAr: 'مقاعد الأطفال',
        descIt: 'Sotto i 150 cm o 12 anni: obbligatorio il seggiolino. Gruppo 0/0+: fino a 13 kg (navicella). Gruppo 1: 9-18 kg. Gruppo 2/3: 15-36 kg (alzata). Possono viaggiare davanti solo se disattivato l\'airbag passeggero o se il veicolo non ne è dotato.',
        descAr: 'أقل من 150 سم أو 12 سنة: مقعد إجباري. مجموعة 0/0+: حتى 13 كغ (سرير). مجموعة 1: 9-18 كغ. مجموعة 2/3: 15-36 كغ (رفع). يمكنهم السفر أمامًا فقط إذا عُطل الوسادة الهوائية للراكب أو إذا لم تكن المركبة مزودة بها.',
      },
      {
        titleIt: 'Casco per motociclisti',
        titleAr: 'خوذة الدراجات النارية',
        descIt: 'Obbligatorio per conducente e passeggero di ciclomotori e motocicli. Deve essere omologato (marchio E). La cinghia deve essere sempre allacciata. Il casco deve essere sostituito dopo un incidente anche se non presenta danni visibili.',
        descAr: 'إجباري للسائق والراكب على الدراجات النارية والدراجات الصغيرة. يجب أن يكون معتمدًا (علامة E). الحزام يجب أن يكون مربوطًا دائمًا. يجب استبدال الخوذة بعد الحادث حتى لو لم تظهر أضرار ظاهرة.',
      },
    ],
    commonMistakes: [
      { it: 'Non allacciare la cintura dietro (è obbligatoria anche per i passeggeri posteriori).', ar: 'عدم ربط الحزام خلفًا (إجباري أيضًا للركاب الخلفيين).' },
      { it: 'Tenere il bambino in braccio invece che nel seggiolino.', ar: 'حمل الطفل في الحضن بدلاً من وضعه في المقعد.' },
      { it: 'Non sostituire il casco dopo un incidente.', ar: 'عدم استبدال الخوذة بعد الحادث.' },
    ],
    memoryTips: [
      { it: 'Cintura = SEMPRE. Davanti, dietro, città, autostrada. Non esistono eccezioni per pigrizia!', ar: 'الحزام = دائمًا. أمام، خلف، مدينة، طريق سريع. لا استثناءات للكسل!' },
    ],
  },
  {
    id: 20,
    titleIt: 'Documenti e punti della patente',
    titleAr: 'الوثائق ونقاط رخصة القيادة',
    topicIt: 'Documenti e norme',
    topicAr: 'الوثائق والقوانين',
    icon: '📄',
    color: '#78716C',
    overview: {
      it: 'Ogni conducente deve avere con sé: patente di guida, libretto di circolazione (o documento unico), certificato di assicurazione (RC auto). La patente ha un sistema a punti: 20 punti iniziali (più 2 bonus per i neopatentati). Le infrazioni causano decurtazione di punti. A 0 punti la patente viene sospesa. È possibile recuperare punti con corsi di recupero.',
      ar: 'كل سائق يجب أن يحمل: رخصة القيادة، دفتر الدوران (أو وثيقة موحدة)، شهادة التأمين. الرخصة تعمل بنظام النقاط: 20 نقطة أولية (زائد 2 مكافأة للرخص الجديدة). المخالفات تسبب خصم نقاط. عند 0 نقطة تُعلق الرخصة. يمكن استرداد النقاط بدورات استرداد.',
    },
    keyPoints: [
      {
        titleIt: 'Documenti obbligatori',
        titleAr: 'الوثائق الإجبارية',
        descIt: 'Patente di guida: documento personale, verifica identità e abilitazione. Libretto di circolazione: dati del veicolo, proprietario, revisioni. Assicurazione RC auto: obbligatoria per circolare. Revisione: ogni 4 anni fino a 10 anni, poi ogni 2 anni per i veicoli a benzina. GPL/metano: ogni 2 anni.',
        descAr: 'رخصة القيادة: وثيقة شخصية، تتحقق من الهوية والأهلية. دفتر الدوران: بيانات المركبة والمالك والفحوصات. تأمين المسؤولية المدنية: إجباري للسير. المعاينة: كل 4 سنوات حتى 10 سنوات، ثم كل سنتين للمركبات البنزينية. غاز/ميثان: كل سنتين.',
      },
      {
        titleIt: 'Sistema a punti',
        titleAr: 'نظام النقاط',
        descIt: 'Punti iniziali: 20 (+2 bonus neopatentato). Principali decurtazioni: eccesso di velocità (3-10 punti), cellulare (5 punti), cintura non allacciata (5 punti), guida in stato di ebbrezza (10 punti). Recupero: corso gratuito ogni 2 anni (+2 punti), corso a pagamento (+6 punti, max 20). Prima infrazione: non inferiori a 5 punti.',
        descAr: 'النقاط الأولية: 20 (+2 مكافأة رخصة جديدة. خصومات رئيسية: سرعة زائدة (3-10 نقاط)، هاتف (5 نقاط)، حزام غير مربوط (5 نقاط)، قيادة سكران (10 نقاط. الاسترداد: دورة مجانية كل سنتين (+2 نقاط)، دورة مدفوعة (+6 نقاط، كحد أقصى 20). أول مخالفة: لا تقل عن 5 نقاط.',
      },
    ],
    commonMistakes: [
      { it: 'Circolare senza assicurazione RC auto (è un reato penale!).', ar: 'السير بدون تأمين المسؤولية المدنية (جريمة جنائية!).' },
      { it: 'Dimenticare la revisione del veicolo.', ar: 'نسيان معاينة المركبة.' },
      { it: 'Non conoscere le decurtazioni di punti per le infrazioni più comuni.', ar: 'عدم معرفة خصم النقاط للمخالفات الأكثر شيوعًا.' },
    ],
    memoryTips: [
      { it: '20 punti + 2 bonus neopatentato. Cellulare = -5, Cintura = -5, Alcol = -10, Velocità = 3-10.', ar: '20 نقطة + 2 مكافأة رخصة جديدة. هاتف = -5، حزام = -5، كحول = -10، سرعة = 3-10.' },
    ],
  },
  {
    id: 21,
    titleIt: 'Infortunistica stradale',
    titleAr: 'حوادث الطريق',
    topicIt: 'Altro',
    topicAr: 'مواضيع أخرى',
    icon: '📚',
    color: '#7C3AED',
    overview: {
      it: 'L\'infortunistica stradale riguarda le cause, le conseguenze e la prevenzione degli incidenti stradali. In caso di incidente, è obbligatorio fermarsi, prestare soccorso ai feriti, avvisare le forze dell\'ordine (se ci sono feriti) e non alterare le prove. Il soccorso ha sempre la priorità sulle questioni legali e assicurative.',
      ar: 'حوادث الطريق تتناول الأسباب والنتائج والوقاية من الحوادث المرورية. في حالة الحادث، من الضروري التوقف وتقديم الإسعاف للمصابين وإبلاغ الشرطة (إذا كان هناك جرحى) وعدم العبث بالأدلة. الإسعاف له الأولوية دائمًا على المسائل القانونية والتأمينية.',
    },
    keyPoints: [
      {
        titleIt: 'Cosa fare in caso di incidente',
        titleAr: 'ماذا تفعل في حالة الحادث',
        descIt: '1) Fermarsi e mettere il triangolo di emergenza (150m dietro fuori città, 50m in città). 2) Accendere le 4 frecce. 3) Prestare soccorso ai feriti. 4) Chiamare il 112 (o 113 se necessario). 5) Non spostare i veicoli se ci sono feriti gravi (salvo pericolo imminente). 6) Raccogliere informazioni: nomi, assicurazioni, testimonianze.',
        descAr: '1) توقف وضع مثلث الطوارئ (150م خلفك خارج المدينة، 50م في المدينة). 2) أشعل 4 الاتجاهات. 3) قدّم الإسعاف للمصابين. 4) اتصل بـ 112 (أو 113 إذا لزم). 5) لا تنقل المركبات إذا كان هناك إصابات خطيرة (إلا في خطر وهمي). 6) اجمع المعلومات: أسماء، تأمينات، شهادات.',
      },
      {
        titleIt: 'Constatazione amichevole',
        titleAr: 'الإثبات الودي',
        descIt: "Il modulo CID (Constatazione Amichevole di Incidente) è un modulo che le parti compilano insieme sul posto dell'incidente. Non è un'ammissione di colpa. Accelera la liquidazione dell'assicurazione. È consigliabile compilarlo sempre, anche per piccoli incidenti.",
        descAr: 'نموذج CID (إثبات ودي للحادث) هو نموذج تملؤه الأطراف معًا في مكان الحادث. ليس اعترافًا بالذنب. يُسرّع تسوية التأمين. يُنصح بملئه دائمًا، حتى للحوادث الصغيرة.',
      },
    ],
    commonMistakes: [
      { it: 'Non fermarsi dopo un incidente (è un reato penale!).', ar: 'عدم التوقف بعد الحادث (جريمة جنائية!).' },
      { it: 'Spostare i veicoli con feriti gravi a bordo.', ar: 'نقل المركبات مع وجود إصابات خطيرة.' },
      { it: 'Non chiamare i soccorsi quando ci sono feriti.', ar: 'عدم الاتصال بالإسعاف عند وجود جرحى.' },
    ],
    memoryTips: [
      { it: '112 = Numero unico di emergenza. Funziona sempre, gratuito, multilingua.', ar: '112 = رقم الطوارئ الموحد. يعمل دائمًا، مجاني، متعدد اللغات.' },
    ],
  },
  {
    id: 22,
    titleIt: 'Alcol, droghe e pronto soccorso',
    titleAr: 'الكحول والمخدرات والإسعافات الأولية',
    topicIt: 'Altro',
    topicAr: 'مواضيع أخرى',
    icon: '⚗️',
    color: '#BE185D',
    overview: {
      it: 'La guida in stato di ebbrezza o sotto l\'effetto di sostanze stupefacenti è uno dei maggiori fattori di rischio stradale. I limiti di alcol nel sangue sono: 0 g/L per neopatentati e conducenti professionali, 0,5 g/L per conducenti ordinari. Le sanzioni vanno dalla multa alla revoca della patente e all\'arresto.',
      ar: 'القيادة في حالة السكر أو تحت تأثير المخدرات من أكبر عوامل الخطر على الطريق. حدود الكحول في الدم: 0 غ/ل للرخص الجديدة والسائقين المحترفين، 0,5 غ/ل للسائقين العاديين. العقوبات تتراوح بين الغرامة وسحب الرخصة والاعتقال.',
    },
    keyPoints: [
      {
        titleIt: 'Limiti di alcol',
        titleAr: 'حدود الكحول',
        descIt: 'Neopatentati e conducenti professionali: 0,0 g/L (tolleranza zero). Conducenti ordinari: 0,5 g/L. Superamento: 0,5-0,8 = multa + 5 punti, 0,8-1,5 = multa + 10 punti + sospensione, >1,5 = revoca + arresto. Rifiuto dell\'etilometro: sanzione pari al massimo previsto (come >1,5).',
        descAr: 'رخصة جديدة وسائقون محترفون: 0,0 غ/ل (تسامح صفر). سائقون عاديون: 0,5 غ/ل. التجاوز: 0,5-0,8 = غرامة + 5 نقاط، 0,8-1,5 = غرامة + 10 نقاط + تعليق، >1,5 = سحب + اعتقال. رفض جهاز قياس الكحول: عقوبة تساوي الحد الأقصى (أكبر من 1,5).',
      },
      {
        titleIt: 'Droghe e sostanze',
        titleAr: 'المخدرات والمواد',
        descIt: 'Guida sotto effetto di droghe: sanzioni gravi (multa da 1.500 a 6.000 euro, sospensione patente da 6 mesi a 1 anno, arresto). Rifiuto dell\'accertamento: sanzioni equivalenti alla positività. I farmaci che influenzano la capacità di guida richiedono l\'etichetta di attenzione.',
        descAr: 'القيادة تحت تأثير المخدرات: عقوبات صارمة (غرامة 1500-6000 يورو، تعليق الرخصة 6 أشهر إلى سنة، اعتقال. رفض الفحص: عقوبات تعادل الإيجابية. الأدوية التي تؤثر على القدرة على القيادة تتطلب علامة تحذير.',
      },
      {
        titleIt: 'Pronto soccorso',
        titleAr: 'الإسعافات الأولية',
        descIt: 'In caso di incidente: 1) Assicurare la scena (triangolo, frecce). 2) Chiamare il 112. 3) Non muovere i feriti. 4) Controllare respirazione e polso. 5) Se necessario, praticare rianimazione cardio-polmonare (RCP). Le barelle e il kit di pronto soccorso sono obbligatori in alcuni veicoli professionali.',
        descAr: 'في حالة الحادث: 1) تأمين الموقع (مثلث، اتجاهات). 2) اتصل بـ 112. 3) لا تحرك المصابين. 4) تحقق من التنفس والنبض. 5) إذا لزم، نفذ الإنعاش القلبي الرئوي (CPR). النقالات ومجموعة الإسعافات الأولية إجبارية في بعض المركبات المهنية.',
      },
    ],
    commonMistakes: [
      { it: 'Pensare che "un bicchiere non fa male" (anche un bicchiere può superare lo 0,5 g/L).', ar: 'الاعتقاد بأن "كأس واحد لا يضر" (حتى كأس واحد يمكن أن يتجاوز 0,5 غ/ل).' },
      { it: 'Guidare sotto effetto di farmaci che causano sonnolenza.', ar: 'القيادة تحت تأثير أدوية تسبب النعاس.' },
      { it: 'Muovere un ferito grave dopo un incidente.', ar: 'تحريك مصاب خطير بعد الحادث.' },
    ],
    memoryTips: [
      { it: '0,5 g/L = limite per conducenti ordinari. 0,0 = neopatentati. 112 = emergenza sempre!', ar: '0,5 غ/ل = حد للسائقين العاديين. 0,0 = رخصة جديدة. 112 = طوارئ دائمًا!' },
    ],
  },
  {
    id: 23,
    titleIt: 'Responsabilità civile e assicurazione',
    titleAr: 'المسؤولية المدنية والتأمين',
    topicIt: 'Altro',
    topicAr: 'مواضيع أخرى',
    icon: '⚖️',
    color: '#475569',
    overview: {
      it: 'La responsabilità civile in ambito stradale riguarda l\'obbligo di risarcire i danni causati a terzi durante la guida. L\'assicurazione RC auto (Responsabilità Civile Auto) è obbligatoria per tutti i veicoli a motore. Copre i danni causati a persone e cose. In caso di sinistro senza assicurazione, il conducente risponde personalmente.',
      ar: 'المسؤولية المدنية في مجال الطريق تتعلق بإلزام تعويض الأضرار التي يُسببها لآخرين أثناء القيادة. تأمين المسؤولية المدنية للسيارات إجباري لجميع المركبات المزودة بمحرك. يغطي الأضرار التي تُلحق بالأشخاص والأشياء. في حالة حادث بدون تأمين، السائق مسؤول شخصيًا.',
    },
    keyPoints: [
      {
        titleIt: 'Assicurazione RC auto',
        titleAr: 'تأمين المسؤولية المدنية',
        descIt: 'Obbligatoria per circolare. Copre danni a terzi causati dal veicolo assicurato. Non copre i danni al proprio veicolo (serve la "collisione" o "kasko"). La mancanza di assicurazione: multa da 849 a 3.396 euro, confisca del veicolo, sospensione della patente da 1 a 2 mesi.',
        descAr: 'إجباري للسير. يغطي أضرار الغير التي يُسببها المركبة المؤمنة. لا يغطي أضرار مركبتك (تحتاج "تصادم" أو "كاسكو"). غياب التأمين: غرامة 849-3396 يورو، مصادرة المركبة، تعليق الرخصة 1-2 شهر.',
      },
      {
        titleIt: 'Responsabilità del conducente',
        titleAr: 'مسؤولية السائق',
        descIt: 'Il conducente è responsabile dei danni causati durante la guida, anche se il veicolo non è di sua proprietà. Il proprietario del veicolo è responsabile solidale se non ha verificato l\'idoneità del conducente. Minori: responsabilità dei genitori o tutori.',
        descAr: 'السائق مسؤول عن الأضرار التي يسببها أثناء القيادة، حتى لو لم تكن المركبة ملكه. مالك المركبة مسؤول تضامني إذا لم يتحقق من أهلية السائق. القُصّر: مسؤولية الآباء أو الأوصياء.',
      },
    ],
    commonMistakes: [
      { it: 'Guidare senza assicurazione (è un reato con conseguenze gravi).', ar: 'القيادة بدون تأمين (جريمة بعواقب خطيرة).' },
      { it: 'Pensare che l\'assicurazione copra anche i danni al proprio veicolo.', ar: 'الاعتقاد بأن التأمين يغطي أيضًا أضرار مركبتك.' },
    ],
    memoryTips: [
      { it: 'RC Auto = OBBLIGATORIA. Senza = multa + confisca + sospensione patente.', ar: 'تأمين المسؤولية = إجباري. بدونه = غرامة + مصادرة + تعليق رخصة.' },
    ],
  },
  {
    id: 24,
    titleIt: 'Ambiente e inquinamento',
    titleAr: 'البيئة والتلوث',
    topicIt: 'Altro',
    topicAr: 'مواضيع أخرى',
    icon: '🌱',
    color: '#059669',
    overview: {
      it: 'Le norme ambientali nel codice della strada riguardano le emissioni dei veicoli, il controllo dei livelli di inquinamento acustico, la corretta gestione dei rifiuti del veicolo (olio, pneumatici, batterie) e le restrizioni di circolazione per i veicoli più inquinanti (zone ZTL ecologiche, blocchi del traffico per smog).',
      ar: 'القواعد البيئية في قانون السير تتعلق بانبعاثات المركبات والتحكم في مستويات التلوث الصوتي والإدارة الصحيحة لنفايات المركبة (زيت، إطارات، بطاريات) وقيود السير للمركبات الأكثر تلويثًا (مناطق ZTL البيئية، حظر المرور بسبب الضباب الدخاني).',
    },
    keyPoints: [
      {
        titleIt: 'Bollini ambientali',
        titleAr: 'ملصقات بيئية',
        descIt: 'I veicoli sono classificati in base alle emissioni: Euro 1-6 per benzina e diesel. Euro 6 è lo standard più recente e meno inquinante. In molte città sono istituite zone a traffico limitato per i veicoli più inquinanti (pre-Euro, Euro 1-3 diesel). Il bollettino della revisione verifica le emissioni.',
        descAr: 'تُصنف المركبات حسب الانبعاثات: يورو 1-6 للبنزين والديزل. يورو 6 أحدث معيار وأقل تلويثًا. في كثير من المدن تُنشأ مناطق مرور محدود للمركبات الأكثر تلويثًا (قبل يورو، يورو 1-3 ديزل). المعاينة تتحقق من الانبعاثات.',
      },
      {
        titleIt: 'Rifiuti del veicolo',
        titleAr: 'نفايات المركبة',
        descIt: 'L\'olio esausto, le batterie, i pneumatici usati e i filtri devono essere smaltiti presso centri autorizzati. Non è consentito abbandonare rifiuti pericolosi nell\'ambiente. Le multe per smaltimento illegale sono elevate. Molti centri di raccolta offrono il servizio gratuitamente.',
        descAr: 'الزيت المستعمل والبطاريات والإطارات المستعملة والفلاتر يجب التخلص منها في مراكز مرخصة. لا يُسمح بإلقاء نفايات خطيرة في البيئة. غرامات التخلص غير القانوني مرتفعة. كثير من مراكز الجمع تقدم الخدمة مجانًا.',
      },
    ],
    commonMistakes: [
      { it: 'Smettere l\'olio esausto nell\'ambiente o nella fognatura.', ar: 'إلقاء الزيت المستعمل في البيئة أو الصرف الصحي.' },
      { it: 'Non rispettare le restrizioni ZTL ecologiche.', ar: 'عدم احترام قيود ZTL البيئية.' },
    ],
    memoryTips: [
      { it: 'Euro 6 = meno inquinante = più accesso alle zone urbane. Euro 1 = più vecchio = più limitato.', ar: 'يورو 6 = أقل تلويثًا = وصول أكثر للمناطق الحضرية. يورو 1 = أقدم = أكثر تقييدًا.' },
    ],
  },
  {
    id: 25,
    titleIt: 'Manutenzione del veicolo',
    titleAr: 'صيانة المركبة',
    topicIt: 'Altro',
    topicAr: 'مواضيع أخرى',
    icon: '🔧',
    color: '#B45309',
    overview: {
      it: 'La manutenzione regolare del veicolo è obbligatoria per legge e essenziale per la sicurezza. La revisione periodica verifica l\'idoneità del veicolo alla circolazione. Ogni conducente deve verificare periodicamente: pneumatici, luci, freni, olio, liquido refrigerante, tergicristalli, cinture di sicurezza e dispositivi di emergenza.',
      ar: 'صيانة المركبة الدورية إجبارية قانونيًا وضرورية للسلامة. المعاينة الدورية تتحقق من أهلية المركبة للسير. كل سائق يجب أن يتحقق دوريًا: الإطارات والأضواء والفرامل والزيت وسائل التبريد وماسحات الزجاج وأحزمة الأمان وأجهزة الطوارئ.',
    },
    keyPoints: [
      {
        titleIt: 'Revisione periodica',
        titleAr: 'المعاينة الدورية',
        descIt: 'Nuovi veicoli: prima revisione dopo 4 anni. Successivamente: ogni 2 anni. Veicoli con più di 10 anni: ogni anno (per i diesel fino a Euro 5). La revisione controlla freni, sospensioni, emissioni, luci, pneumatici, vetri e altri elementi di sicurezza. Multa per revisione scaduta: da 173 a 694 euro.',
        descAr: 'مركبات جديدة: أول معاينة بعد 4 سنوات. بعد ذلك: كل سنتين. مركبات فوق 10 سنوات: كل سنة (للديزل حتى يورو 5). المعاينة تتحقق من الفرامل والتعليق والانبعاثات والأضواء والإطارات والزجاج وعناصر سلامة أخرى. غرامة معاينة منتهية: 173-694 يورو.',
      },
      {
        titleIt: 'Pneumatici',
        titleAr: 'الإطارات',
        descIt: 'Soglia minima di battistrada: 1,6 mm. Pressione: indicata dal costruttore (trovata sul battente della portiera o nel manuale). Pneumatici invernali: obbligatori in alcune regioni con neve (es. dal 15 novembre al 15 aprile). Catene: obbligatorie dove segnalato. Rotazione pneumatici ogni 10.000-15.000 km.',
        descAr: 'الحد الأدنى لعمق المداس: 1,6 مم. الضغط: محدد من الشركة المصنعة (يوجد على حافة الباب أو في الدليل). إطارات شتوية: إجبارية في بعض المناطق ذات الثلج (مثل من 15 نوفمبر إلى 15 أبريل). السلاسل: إجبارية حيثما تُشار إليها. تدوير الإطارات كل 10,000-15,000 كم.',
      },
      {
        titleIt: 'Dotazioni obbligatorie',
        titleAr: 'المعدات الإجبارية',
        descIt: 'Giubbotto riflettente: obbligatorio per tutti i veicoli. Triangolo di emergenza: obbligatorio. Estintore: obbligatorio per veicoli con GPL/metano e per i veicoli professionali. Kit di pronto soccorso: obbligatorio per veicoli professionali e trasporto persone. Ruota di scorta o kit di riparazione.',
        descAr: 'سترة عاكسة: إجبارية لجميع المركبات. مثلث الطوارئ: إجباري. طفاية حريق: إجبارية لمركبات الغاز/الميثان والمركبات المهنية. مجموعة إسعافات أولية: إجبارية للمركبات المهنية ونقل الأشخاص. عجلة احتياطية أو مجموعة إصلاح.',
      },
    ],
    commonMistakes: [
      { it: 'Circolare con pneumatici lisci (battistrada < 1,6 mm).', ar: 'السير بإطارات ملساء (عمق المداس < 1,6 مم).' },
      { it: 'Non effettuare la revisione periodica.', ar: 'عدم إجراء المعاينة الدورية.' },
      { it: 'Non avere il giubbotto riflettente o il triangolo a bordo.', ar: 'عدم وجود سترة عاكسة أو مثلث في المركبة.' },
    ],
    memoryTips: [
      { it: '1,6 mm = battistrada minimo. Sotto = MULTA + pericolo! Revisione = ogni 2 anni (dopo i primi 4).', ar: '1,6 مم = حد أدنى للمداس. أقل = غرامة + خطر! المعاينة = كل سنتين (بعد أول 4 سنوات).' },
    ],
  },
];

export function getChapterExplanation(id: number): ChapterExplanation | undefined {
  return CHAPTER_EXPLANATIONS.find((ch) => ch.id === id);
}

export function getChaptersByTopicName(topicIt: string): ChapterExplanation[] {
  return CHAPTER_EXPLANATIONS.filter((ch) => ch.topicIt === topicIt);
}
