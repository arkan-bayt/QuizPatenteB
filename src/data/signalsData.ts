// ============================================================
// SIGNALS DATA - Guida ai Segnali Stradali Italiani
// Italiano soltanto — nessun campo in altre lingue
// ============================================================

export interface SignalCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  signals: SignalInfo[];
}

export interface SignalInfo {
  id: string;
  name: string;
  shape: string;
  description: string;
  whenToObeyIt: string;
  whatHappensIfIgnored: string;
  imageNumber?: number;
}

export const SIGNAL_CATEGORIES: SignalCategory[] = [
  // ─────────────────────────────────────────────────────────────
  //  SEGNALI DI PERICOLO
  // ─────────────────────────────────────────────────────────────
  {
    id: 'pericolo',
    name: 'Segnali di pericolo',
    icon: '⚠️',
    color: '#EF4444',
    description:
      'Segnali a forma di triangolo equilatero con bordo rosso e sfondo bianco. Segnalano pericoli o situazioni di rischio sulla strada. Il conducente deve aumentare l\'attenzione e ridurre la velocità.',
    signals: [
      {
        id: 'curva-sinistra',
        name: 'Curva pericolosa a sinistra',
        shape: 'Triangolo con freccia curva a sinistra',
        description:
          'Indica la presenza di una curva pericolosa verso sinistra. Il conducente deve ridurre la velocità prima della curva e mantenere la posizione corretta sulla carreggiata (lato destro).',
        whenToObeyIt:
          'Appena il segnale diventa visibile, prima di raggiungere la curva.',
        whatHappensIfIgnored:
          'Rischio di uscire di strada, perdere il controllo del veicolo o invadere la corsia opposta.',
      },
      {
        id: 'curva-destra',
        name: 'Curva pericolosa a destra',
        shape: 'Triangolo con freccia curva a destra',
        description:
          'Indica la presenza di una curva pericolosa verso destra. Il conducente deve ridurre la velocità e rimanere nel centro della propria corsia.',
        whenToObeyIt: 'Appena il segnale diventa visibile, prima della curva.',
        whatHappensIfIgnored:
          'Rischio di sbandare, collisione con il guardrail o uscita di strada.',
      },
      {
        id: 'doppia-curva',
        name: 'Doppia curva (successione di curve)',
        shape: 'Triangolo con due frecce curve alternate',
        description:
          'Indica due curve ravvicinate in direzioni opposte. Richiede particolare cautela e riduzione della velocità già prima della prima curva.',
        whenToObeyIt:
          'Lontano dalla prima curva (almeno 150 m fuori centro abitato).',
        whatHappensIfIgnored:
          'Rischio di perdere il controllo sulle due curve, specialmente con manto stradale bagnato.',
      },
      {
        id: 'passaggio-livello',
        name: 'Passaggio a livello senza barriere',
        shape: 'Triangolo con simbolo di treno',
        description:
          'Indica un attraversamento di binari ferroviari senza barriere. Il conducente deve fermarsi, guardare in entrambe le direzioni e attraversare solo se il treno non sta arrivando. Non sostare sui binari!',
        whenToObeyIt:
          'Sempre quando si avvicina ai binari. Fermarsi, guardare, ascoltare.',
        whatHappensIfIgnored:
          'Rischio di collisione con il treno. Conseguenze potenzialmente letali.',
      },
      {
        id: 'incrocio',
        name: 'Incrocio',
        shape: 'Triangolo con due frecce convergenti',
        description:
          'Segnala la presenza di un incrocio. Non indica chi ha la precedenza (per questo servono i segnali di precedenza). Richiede cautela e riduzione della velocità.',
        whenToObeyIt:
          'Avvicinandosi all\'incrocio, con anticipo sufficiente per rallentare.',
        whatHappensIfIgnored:
          'Rischio di collisione laterale con altri veicoli.',
      },
      {
        id: 'pedoni',
        name: 'Attraversamento pedonale',
        shape: 'Triangolo con simbolo pedone',
        description:
          'Indica un attraversamento pedonale nelle vicinanze. Il conducente deve dare la precedenza ai pedoni e ridurre la velocità.',
        whenToObeyIt:
          'Appena visibile il segnale, mantenere l\'attenzione sui pedoni.',
        whatHappensIfIgnored:
          'Rischio di investimento pedonale con gravi conseguenze legali e penali.',
      },
      {
        id: 'bambini',
        name: 'Bambini',
        shape: 'Triangolo con simbolo bambini',
        description:
          'Indica zone frequentate da bambini (scuole, parchi giochi). La velocità deve essere molto ridotta e l\'attenzione massima: i bambini possono improvvisamente attraversare la strada.',
        whenToObeyIt: 'Sempre, specialmente negli orari scolastici.',
        whatHappensIfIgnored:
          'Rischio gravissimo di investimento minori. Sanzioni penali severissime.',
      },
      {
        id: 'lavori',
        name: 'Lavori stradali',
        shape: 'Triangolo con simbolo persona che lavora con pala',
        description:
          'Indica lavori in corso sulla strada. Possibile restringimento della carreggiata, presenza di operai e macchinari. Ridurre la velocità e prestare massima attenzione.',
        whenToObeyIt: 'Appena visibile il segnale dei lavori.',
        whatHappensIfIgnored:
          'Rischio di investimento operai, danni al veicolo o incidenti.',
      },
      {
        id: 'scivolosa',
        name: 'Strada scivolosa',
        shape: 'Triangolo con simbolo auto che slitta',
        description:
          'La strada può essere scivolosa, specialmente con pioggia o ghiaccio. Ridurre la velocità, evitare frenate e accelerate brusche.',
        whenToObeyIt:
          'Sempre, con attenzione particolare in caso di pioggia o gelo.',
        whatHappensIfIgnored:
          'Perdita di aderenza, sbandata, uscita di strada.',
      },
      {
        id: 'caduta-massi',
        name: 'Caduta massi',
        shape: 'Triangolo con simbolo pietra che cade',
        description:
          'Indica zona a rischio caduta massi o detriti. Mantenere la velocità ridotta e non sostare.',
        whenToObeyIt: 'Attraversando tutta la zona a rischio.',
        whatHappensIfIgnored:
          'Rischio di essere colpiti da massi con conseguenze letali.',
      },
      {
        id: 'galleria',
        name: 'Galleria',
        shape: 'Triangolo con simbolo di arco (galleria)',
        description:
          'Indica l\'ingresso in una galleria. Accendere le luci anabbaglianti. Ridurre la velocità al limite previsto (max 90 km/h).',
        whenToObeyIt: 'Prima dell\'ingresso della galleria.',
        whatHappensIfIgnored:
          'Multa per luci spente, rischio di incidenti nella galleria per scarsa visibilità.',
      },
      {
        id: 'ponte-mobile',
        name: 'Ponte mobile',
        shape: 'Triangolo con simbolo ponte che si solleva',
        description:
          'Il ponte può essere sollevato per il passaggio di navi. Rispettare la segnaletica e le eventuali barriere. Non attraversare con il ponte sollevato.',
        whenToObeyIt: 'Avvicinandosi al ponte.',
        whatHappensIfIgnored:
          'Rischio di caduta nel fiume o canale con il veicolo.',
      },
      {
        id: 'vento',
        name: 'Vento laterale forte',
        shape: 'Triangolo con simbolo vento',
        description:
          'Rischio di spinte laterali dovute al vento. Mantenere saldamente il volante, ridurre la velocità. Particolare attenzione per i veicoli alti (camion, furgoni).',
        whenToObeyIt:
          'Nelle zone esposte al vento (ponti, zone aperte).',
        whatHappensIfIgnored:
          'Sbandata laterale, perdita di controllo, uscita di strada.',
      },
      {
        id: 'discesa-pericolosa',
        name: 'Discesa pericolosa',
        shape: 'Triangolo con percentuale di pendenza',
        description:
          'Indica una discesa con pendenza significativa. Il conducente deve ridurre la velocità, utilizzare il freno motore e evitare frenate prolungate per non surriscaldare i freni.',
        whenToObeyIt: 'Appena il segnale diventa visibile, prima della discesa.',
        whatHappensIfIgnored:
          'Rischio di surriscaldamento dei freni, perdita di efficienza frenante, impossibilità di fermarsi.',
      },
      {
        id: 'salita-ripida',
        name: 'Salita ripida',
        shape: 'Triangolo con percentuale di pendenza',
        description:
          'Indica una salita con pendenza significativa. I veicoli lenti possono procedere con difficoltà. Mantenere una marcia adeguata e prestare attenzione ai veicoli che procedono lentamente.',
        whenToObeyIt: 'Appena il segnale diventa visibile, prima della salita.',
        whatHappensIfIgnored:
          'Rischio di stallo del motore, collisioni con veicoli lenti o fermi nella salita.',
      },
      {
        id: 'strada-dissestata',
        name: 'Strada dissestata',
        shape: 'Triangolo con simbolo di buche o irregolarità',
        description:
          'Indica che il manto stradale è in cattive condizioni, con buche, avvallamenti o irregolarità. Ridurre la velocità per evitare danni al veicolo e perdita di controllo.',
        whenToObeyIt: 'Su tutto il tratto dissestato.',
        whatHappensIfIgnored:
          'Danni alle sospensioni o agli pneumatici, perdita di controllo del veicolo.',
      },
      {
        id: 'restringimento',
        name: 'Restringimento della carreggiata',
        shape: 'Triangolo con fianchi che si restringono',
        description:
          'Indica che la carreggiata si restringe progressivamente. È necessario adattare la velocità e, se necessario, alternate la precedenza con i veicoli provenienti dalla direzione opposta.',
        whenToObeyIt:
          'Appena il segnale diventa visibile, prima del restringimento.',
        whatHappensIfIgnored:
          'Rischio di collisione laterale, uscita di strada o blocco del traffico.',
      },
      {
        id: 'rotatoria',
        name: 'Rotatoria',
        shape: 'Triangolo con frecce che indicano senso rotatorio',
        description:
          'Indica la presenza di una rotatoria (rot traffic circle). All\'interno della rotatoria vige la precedenza per chi vi circola. Chi entra deve dare la precedenza. Non usare la freccia a sinistra all\'interno.',
        whenToObeyIt: 'Avvicinandosi alla rotatoria.',
        whatHappensIfIgnored:
          'Rischio di collisione, mancata precedenza, sanzioni e punti.',
      },
      {
        id: 'animali-selvatici',
        name: 'Animali selvatici',
        shape: 'Triangolo con silhouette di cervo o animale selvatico',
        description:
          'Indica una zona di possibile attraversamento di animali selvatici (cervi, cinghiali, ecc.). Rallentare e prestare massima attenzione, specialmente al crepuscolo e di notte.',
        whenToObeyIt:
          'Su tutto il tratto segnalato, con attenzione particolare di notte.',
        whatHappensIfIgnored:
          'Rischio di collisione grave con animali, danni al veicolo e pericolo per gli occupanti.',
      },
      {
        id: 'animali-domestici',
        name: 'Animali domestici',
        shape: 'Triangolo con silhouette di cavallo o animale domestico',
        description:
          'Indica una zona dove possono attraversare la strada animali domestici (cavalli, cani, gatti, bestiame). Rallentare e prestare attenzione.',
        whenToObeyIt: 'Su tutto il tratto segnalato.',
        whatHappensIfIgnored:
          'Rischio di investimento di animali, incidente e responsabilità civile.',
      },
      {
        id: 'pericolo-generico',
        name: 'Pericolo generico',
        shape: 'Triangolo con punto esclamativo',
        description:
          'Segnale di pericolo generico quando non esiste un segnale specifico per il tipo di pericolo presente. Richiede cautela generale e riduzione della velocità.',
        whenToObeyIt: 'Appena il segnale diventa visibile.',
        whatHappensIfIgnored:
          'Rischio di non prepararsi adeguatamente a un pericolo non specificato.',
      },
      {
        id: 'banchina-cedevole',
        name: 'Banchina cedevole',
        shape: 'Triangolo con simbolo di banchina che cede',
        description:
          'Indica che la banchina non è consolidata e potrebbe cedere sotto il peso del veicolo. Non usare la banchina per la sosta o l\'emergenza.',
        whenToObeyIt: 'Su tutto il tratto interessato.',
        whatHappensIfIgnored:
          'Rischio di sprofondamento del veicolo nella banchina, incidente.',
      },
      {
        id: 'cunetta',
        name: 'Cunetta',
        shape: 'Triangolo con profilo a V di cunetta',
        description:
          'Indica la presenza di una cunetta (scavo di drenaggio) ai bordi della strada. Mantenere la carreggiata e non uscire dalla sede stradale.',
        whenToObeyIt: 'Su tutto il tratto interessato.',
        whatHappensIfIgnored:
          'Rischio di cadere nella cunetta con il veicolo, danni e blocco.',
      },
      {
        id: 'dosso',
        name: 'Dosso',
        shape: 'Triangolo con profilo del dosso',
        description:
          'Indica la presenza di un dosso o speed bump sulla strada. Ridurre la velocità per non danneggiare il veicolo e non perdere il controllo.',
        whenToObeyIt: 'Appena il segnale diventa visibile.',
        whatHappensIfIgnored:
          'Danni alle sospensioni, perdita di aderenza, rischio di sbandata.',
      },
      {
        id: 'attraversamento-tram',
        name: 'Attraversamento tram',
        shape: 'Triangolo con simbolo di tram',
        description:
          'Indica un attraversamento di binari tranviari. Prestare attenzione ai tram in transito e non fermarsi sui binari.',
        whenToObeyIt: 'Avvicinandosi all\'attraversamento.',
        whatHappensIfIgnored:
          'Rischio di collisione con il tram, danni al veicolo e pericolo per gli occupanti.',
      },
      {
        id: 'attraversamento-ciclabile',
        name: 'Attraversamento ciclabile',
        shape: 'Triangolo con simbolo di bicicletta',
        description:
          'Indica la presenza di un attraversamento ciclabile nelle vicinanze. Il conducente deve dare la precedenza ai ciclisti e ridurre la velocità.',
        whenToObeyIt:
          'Appena visibile il segnale, mantenere l\'attenzione sui ciclisti.',
        whatHappensIfIgnored:
          'Rischio di investimento di un ciclista con gravi conseguenze.',
      },
      {
        id: 'doppio-senso',
        name: 'Doppio senso di circolazione',
        shape: 'Triangolo con due frecce opposte',
        description:
          'Indica che si sta per immettere in un tratto stradale a doppio senso di circolazione (dopo un tratto a senso unico). Prestare attenzione ai veicoli provenienti dalla direzione opposta.',
        whenToObeyIt: 'Appena visibile il segnale.',
        whatHappensIfIgnored:
          'Rischio di collisione frontale con veicoli contromano, incidente grave.',
      },
      {
        id: 'banchina-portuale',
        name: 'Banchina portuale',
        shape: 'Triangolo con simbolo di banchina e acqua',
        description:
          'Indica la presenza di una banchina portuale o di un argine senza protezione. Prestare la massima attenzione, specialmente per i veicoli pesanti.',
        whenToObeyIt: 'Su tutto il tratto interessato.',
        whatHappensIfIgnored:
          'Rischio di caduta in acqua con il veicolo, conseguenze potenzialmente letali.',
      },
      {
        id: 'pietrisco',
        name: 'Pietrisco',
        shape: 'Triangolo con simbolo di sassi',
        description:
          'Indica la presenza di pietrisco o detriti sulla carreggiata. Rischio di perdita di aderenza e proiezione di sassi. Aumentare la distanza di sicurezza dal veicolo precedente.',
        whenToObeyIt: 'Su tutto il tratto segnalato.',
        whatHappensIfIgnored:
          'Perdita di aderenza, danni al parabrezza o alla carrozzeria da pietre proiettate.',
      },
      {
        id: 'pericolo-incendio',
        name: 'Pericolo di incendio',
        shape: 'Triangolo con simbolo di fiamma',
        description:
          'Indica una zona a rischio incendio boschivo. Vietato gettare mozziconi di sigaretta o materiali infiammabili. In caso di incendio, chiamare il 115.',
        whenToObeyIt: 'Su tutto il tratto segnalato.',
        whatHappensIfIgnored:
          'Rischio di provocare un incendio boschivo con conseguenze legali gravissime.',
      },
      {
        id: 'aeroplani',
        name: 'Aeroplani (sorvolo a bassa quota)',
        shape: 'Triangolo con simbolo di aeroplano',
        description:
          'Indica la possibilità di sorvoli a bassa quota di aeroplani. Non indica un pericolo diretto per la guida, ma segnala la vicinanza di un aeroporto o di una base aerea.',
        whenToObeyIt: 'Informativo, nessun comportamento specifico richiesto.',
        whatHappensIfIgnored:
          'Non applicabile — è un segnale puramente informativo.',
      },
      {
        id: 'passaggio-livello-barriere',
        name: 'Passaggio a livello con barriere',
        shape: 'Triangolo con simbolo di treno e barriere semichiuse',
        description:
          'Indica un attraversamento di binari ferroviari protetto da barriere o semibarriere. Quando le barriere si abbassano, è obbligatorio fermarsi. Non attraversare mai con le barriere in movimento o abbassate, anche se il treno non è visibile.',
        whenToObeyIt:
          'Sempre quando ci si avvicina al passaggio a livello. Fermarsi quando le barriere sono chiuse o in movimento.',
        whatHappensIfIgnored:
          'Rischio di essere investiti dal treno con conseguenze quasi sempre letali. È una delle infrazioni più pericolose del Codice della Strada.',
      },
          {
        id: 'semaforo',
        name: 'Semaforo',
        shape: 'Triangolo con simbolo di semaforo con tre luci',
        description:
          'Indica la presenza di un impianto semaforico non lontano dal punto in cui il segnale e collocato. Il conducente deve ridurre la velocita e prepararsi a un possibile arresto. Il semaforo puo essere a tre luci (rosso, giallo, verde) disposte in verticale o in orizzontale.',
        whenToObeyIt:
          'Appena il segnale diventa visibile, riducendo la velocita in avvicinamento all\'impianto semaforico.',
        whatHappensIfIgnored:
          'Rischio di non fermarsi in tempo al semaforo, con conseguente attraversamento con luce rossa, multa e decurtazione punti dalla patente.',
      },
      {
        id: 'semaforo-orizzontale',
        name: 'Semaforo con disposizione orizzontale',
        shape: 'Triangolo con simbolo di semaforo con luci disposte in orizzontale',
        description:
          'Indica la presenza di un impianto semaforico con le luci disposte in senso orizzontale anziche verticale. La disposizione orizzontale delle luci e utilizzata su alcune strade urbane o in prossimita di intersezioni particolari. Il significato delle luci (rosso, giallo, verde) rimane invariato rispetto alla disposizione verticale.',
        whenToObeyIt:
          'Appena visibile il segnale, prepararsi ad un possibile arresto all\'impianto semaforico orizzontale.',
        whatHappensIfIgnored:
          'Rischio di attraversamento con luce rossa del semaforo. Sanzioni previste dal Codice della Strada con decurtazione punti.',
      },
],
  },

  // ─────────────────────────────────────────────────────────────
  //  SEGNALI DI DIVIETO
  // ─────────────────────────────────────────────────────────────
  {
    id: 'divieto',
    name: 'Segnali di divieto',
    icon: '🚫',
    color: '#DC2626',
    description:
      'Segnali rotondi con bordo rosso, sfondo bianco e simbolo nero. Vietano comportamenti specifici come accesso, sosta, sorpasso o limiti di velocità. Il rosso significa "vietato" senza eccezioni (salvo diversamente indicato).',
    signals: [
      {
        id: 'divieto-accesso',
        name: 'Divieto di accesso',
        shape: 'Cerchio rosso pieno con sfondo bianco',
        description:
          'Vietato l\'accesso a TUTTI i veicoli a motore. Non riguarda i pedoni. Vietato entrare nella strada nella direzione indicata.',
        whenToObeyIt: 'All\'ingresso della strada con divieto.',
        whatHappensIfIgnored:
          'Multa, possibile ritiro punti. Se causa incidente: responsabilità penale.',
      },
      {
        id: 'senso-vietato',
        name: 'Senso vietato',
        shape: 'Cerchio rosso con freccia rossa su sfondo bianco',
        description:
          'Vietato procedere nella direzione indicata dalla freccia. Valido solo per la direzione specifica, non per l\'intera strada.',
        whenToObeyIt: 'All\'inizio della strada con divieto di senso.',
        whatHappensIfIgnored:
          'Rischio di circolare nella direzione opposta al traffico. Multa e punti.',
      },
      {
        id: 'divieto-sosta',
        name: 'Divieto di sosta',
        shape: 'Cerchio rosso con croce rossa e barra blu',
        description:
          'Vietata la sosta (veicolo fermo con o senza conducente). La fermata breve per salita/discesa è consentita (salvo altra segnalazione). Linee gialle sul bordo strada.',
        whenToObeyIt: 'Su tutto il tratto dove è esposto il segnale.',
        whatHappensIfIgnored:
          'Multa da 42 a 173 euro. Rischio di rimozione forzata del veicolo.',
      },
      {
        id: 'divieto-fermata',
        name: 'Divieto di fermata',
        shape: 'Cerchio rosso con due croci rosse',
        description:
          'Vietata qualsiasi fermata, anche breve per salita/discesa passeggeri. È il divieto più restrittivo. Riguarda tutti i veicoli.',
        whenToObeyIt: 'Sempre, nessuna eccezione per fermate brevi.',
        whatHappensIfIgnored:
          'Multa elevata. Rischio di rimozione del veicolo e problemi di traffico.',
      },
      {
        id: 'limite-velocita',
        name: 'Limite massimo di velocità',
        shape: 'Cerchio bianco con bordo rosso e numero nero',
        description:
          'Indica la velocità massima consentita in km/h. Il limite è valido fino a diversa segnalazione o al successivo segnale di fine limite.',
        whenToObeyIt: 'Dal punto del segnale fino alla fine della validità.',
        whatHappensIfIgnored:
          'Multa proporzionale all\'eccesso. Decurtazione punti (3-10). Sospensione patente per eccessi gravi.',
      },
      {
        id: 'divieto-sorpasso',
        name: 'Divieto di sorpasso',
        shape:
          'Cerchio bianco con bordo rosso e due auto nere (una rossa barrata)',
        description:
          'Vietato sorpassare per i veicoli a motore. Il sorpasso tra veicoli lenti (biciclette, trattori) può essere consentito in alcuni casi.',
        whenToObeyIt: 'Su tutto il tratto segnalato.',
        whatHappensIfIgnored:
          'Multa e decurtazione punti. Se causa incidente: responsabilità penale.',
      },
      {
        id: 'divieto-sorpasso-camion',
        name: 'Divieto di sorpasso per i camion',
        shape:
          'Cerchio bianco con bordo rosso e simbolo di camion rosso barrato',
        description:
          'Vietato il sorpasso per i veicoli pesanti con massa a pieno carico superiore a 3,5 t. Il divieto si applica solo ai mezzi pesanti, non alle autovetture.',
        whenToObeyIt: 'Su tutto il tratto segnalato, per i veicoli pesanti.',
        whatHappensIfIgnored:
          'Multa per il conducente del mezzo pesante. Se causa incidente: responsabilità penale.',
      },
      {
        id: 'divieto-transito-pedoni',
        name: 'Divieto di transito per i pedoni',
        shape:
          'Cerchio rotondo con bordo rosso e simbolo di pedone nero barrato',
        description:
          'Vietato il transito ai pedoni sulla strada indicata. I pedoni devono utilizzare le aree alternative previste per attraversare o transitare.',
        whenToObeyIt: 'All\'ingresso della strada con il divieto.',
        whatHappensIfIgnored:
          'I pedoni che trasgrediscono rischiano di essere investiti e possono ricevere sanzioni.',
      },
      {
        id: 'divieto-transito-bici',
        name: 'Divieto di transito per le biciclette',
        shape:
          'Cerchio rotondo con bordo rosso e simbolo di bicicletta nera barrata',
        description:
          'Vietato il transito delle biciclette sulla strada indicata. I ciclisti devono utilizzare percorsi alternativi come piste ciclabili.',
        whenToObeyIt: 'All\'ingresso della strada con il divieto.',
        whatHappensIfIgnored:
          'Multa per il ciclista e rischio di incidente con veicoli a motore.',
      },
      {
        id: 'divieto-transito-moto',
        name: 'Divieto di transito per i motocicli',
        shape:
          'Cerchio rotondo con bordo rosso e simbolo di motocicletta nera barrata',
        description:
          'Vietato il transito dei motocicli sulla strada indicata. Il divieto si applica a tutti i motocicli e ciclomotori.',
        whenToObeyIt: 'All\'ingresso della strada con il divieto.',
        whatHappensIfIgnored:
          'Multa per il motociclista e possibile ritiro della patente.',
      },
      {
        id: 'mezzi-pesanti',
        name: 'Divieto di transito per i mezzi pesanti',
        shape:
          'Cerchio rotondo con bordo rosso e simbolo di camion nero barrato',
        description:
          'Vietato il transito ai veicoli con massa a pieno carico superiore al limite indicato (es. 3,5 t o 7,5 t). Si applica a camion, autobus e mezzi pesanti.',
        whenToObeyIt: 'All\'ingresso della strada con il divieto.',
        whatHappensIfIgnored:
          'Multa elevata per il conducente e per l\'impresa di trasporto.',
      },
      {
        id: 'trasporto-esplosivi',
        name: 'Divieto di transito per veicoli con materie esplosive',
        shape:
          'Cerchio rotondo con bordo rosso e simbolo di esplosivo nero barrato',
        description:
          'Vietato il transito ai veicoli che trasportano merci esplosive o infiammabili. Serve a proteggere aree sensibili come gallerie, ponti e centri abitati.',
        whenToObeyIt: 'All\'ingresso della strada con il divieto.',
        whatHappensIfIgnored:
          'Sanzioni gravissime, sequestro del veicolo e responsabilità penale.',
      },
      {
        id: 'fine-prescrizione',
        name: 'Fine prescrizione',
        shape:
          'Cerchio grigio con bordo grigio e barra diagonale nera',
        description:
          'Indica la fine di tutti i divieti precedentemente imposti (divieto di accesso, senso vietato, ecc.). Da questo punto in poi, si riprende la normale circolazione.',
        whenToObeyIt:
          'Appena superato il segnale, si applicano le regole di normali circolazione.',
        whatHappensIfIgnored:
          'Non applicabile — è un segnale di fine prescrizione, non un obbligo.',
      },
      {
        id: 'fine-limite-velocita',
        name: 'Fine limite di velocità',
        shape: 'Cerchio bianco con bordo grigio e barra diagonale grigia',
        description:
          'Indica la fine del limite di velocità precedente. Da questo punto si applica il limite generale di velocità previsto dal Codice della Strada per il tipo di strada.',
        whenToObeyIt:
          'Appena superato il segnale, riprendere i limiti generali di velocità.',
        whatHappensIfIgnored:
          'Non applicabile — riprendono i limiti generali (es. 90 km/h sulle extraurbane principali).',
      },
      {
        id: 'fine-divieto-sorpasso',
        name: 'Fine divieto di sorpasso',
        shape:
          'Cerchio bianco con bordo grigio e simbolo di auto con barra grigia',
        description:
          'Indica la fine del divieto di sorpasso precedentemente segnalato. Dal questo punto è nuovamente consentito sorpassare, se le condizioni lo permettono in sicurezza.',
        whenToObeyIt:
          'Appena superato il segnale, il sorpasso è nuovamente consentito in sicurezza.',
        whatHappensIfIgnored:
          'Non applicabile — è un segnale che ripristina un diritto, non un obbligo.',
      },
      {
        id: 'divieto-inversione',
        name: 'Divieto di inversione del senso di marcia',
        shape: 'Cerchio rosso con freccia a U rossa su sfondo bianco',
        description:
          'Vietato effettuare l\'inversione del senso di marcia (girarsi) nel punto in cui è installato il segnale. Il divieto mira a evitare manovre pericolose su strade trafficate, curve, dossi o in prossimità di incroci.',
        whenToObeyIt:
          'In corrispondenza del segnale e nel tratto immediatamente successivo, dove la manovra risulterebbe pericolosa.',
        whatHappensIfIgnored:
          'Multa e decurtazione punti. Se l\'inversione causa un incidente, si applica la responsabilità penale.',
      },
      {
        id: 'divieto-retromarcia',
        name: 'Divieto di retromarcia',
        shape: 'Cerchio rosso con freccia retromarcia rossa su sfondo bianco',
        description:
          'Vietato effettuare la manovra di retromarcia nel tratto indicato. Il divieto è posto in situazioni dove la retromarcia rappresenta un pericolo per gli altri utenti della strada, come in gallerie, ponti o strade strette.',
        whenToObeyIt:
          'In corrispondenza del segnale e per l\'intero tratto in cui è valida la prescrizione.',
        whatHappensIfIgnored:
          'Multa e decurtazione punti sulla patente. In caso di incidente durante la manovra, la responsabilità è interamente del conducente.',
      },
      {
        id: 'accesso-pedoni',
        name: 'Accesso vietato ai veicoli a motore (pedoni ammessi)',
        shape: 'Cerchio rosso pieno con simbolo di auto nera barrata',
        description:
          'Vietato l\'accesso a tutti i veicoli a motore. Il segnale èposto nelle zone pedonali, aree verdi o piazze riservate. I pedoni possono transitare liberamente, mentre i veicoli a motore non possono accedere in nessun caso.',
        whenToObeyIt:
          'All\'ingresso della zona pedonale o dell\'area riservata ai pedoni.',
        whatHappensIfIgnored:
          'Multa elevata e decurtazione punti. In caso di investimento di un pedone, si applicano sanzioni penali gravissime.',
      },
      {
        id: 'divieto-rimorchio',
        name: 'Divieto di transito per veicoli con rimorchio',
        shape: 'Cerchio rosso con simbolo di auto con rimorchio nero barrato',
        description:
          'Vietato il transito ai veicoli che trainano un rimorchio, una carrozzetta o un altro veicolo. Il divieto è comunemente esposto su strade strette, curve pericolose o zone residenziali dove la manovra con rimorchio risulta difficoltosa.',
        whenToObeyIt:
          'All\'ingresso della strada con il divieto, per tutti i veicoli con rimorchio agganciato.',
        whatHappensIfIgnored:
          'Multa per il conducente. Se il transito causa difficoltà o incidenti, la responsabilità è totale del conducente del veicolo con rimorchio.',
      },
      {
        id: 'divieto-carri-funebri',
        name: 'Divieto di transito per carri funebri',
        shape: 'Cerchio rosso con simbolo di carro funebre nero barrato',
        description:
          'Vietato il transito ai carri funebri sulla strada indicata. Questo segnale è posto su strade dove il passaggio dei carri funebri potrebbe creare problemi alla circolazione o non è consentito per motivi di decoro urbano.',
        whenToObeyIt:
          'All\'ingresso della strada con il divieto, per tutti i veicoli adibiti al trasporto di salme.',
        whatHappensIfIgnored:
          'Multa e possibile ritiro del permesso di circolazione. Sanzioni accessorie per l\'impresa di onoranze funebri.',
      },
      {
        id: 'divieto-merci-pericolose',
        name: 'Divieto di transito per merci pericolose (ADR)',
        shape: 'Cerchio rosso con simbolo ADR (rombo arancione) barrato',
        description:
          'Vietato il transito ai veicoli che trasportano merci pericolose secondo la normativa ADR (esplosivi, infiammabili, tossici, corrosivi, ecc.). Il divieto protegge aree sensibili come gallerie, ponti, centri abitati e zone ambientali.',
        whenToObeyIt:
          'All\'ingresso della strada o dell\'area con il divieto, per tutti i veicoli con cartellonatura ADR.',
        whatHappensIfIgnored:
          'Sanzioni gravissime, possibile sequestro del veicolo e della merce, responsabilità penale in caso di incidente.',
      },
      {
        id: 'divieto-veicoli-agricoli',
        name: 'Divieto di transito per veicoli agricoli',
        shape: 'Cerchio rosso con simbolo di trattore nero barrato',
        description:
          'Vietato il transito ai veicoli agricoli (trattori, mietitrebbiatrici, macchine operatrici) sulla strada indicata. Il divieto è posto su strade dove la lentezza dei mezzi agricoli creerebbe pericolo o intralcio alla circolazione.',
        whenToObeyIt:
          'All\'ingresso della strada con il divieto, per tutti i veicoli con targa agricola o macchine operatrici.',
        whatHappensIfIgnored:
          'Multa per il conducente del veicolo agricolo e possibile ritiro dell\'autorizzazione alla circolazione su strada.',
      },
      {
        id: 'divieto-autocarri',
        name: 'Divieto di transito per autocarri',
        shape: 'Cerchio rosso con simbolo di autocarro nero barrato',
        description:
          'Vietato il transito agli autocarri (veicoli per il trasporto di merci con massa complessiva superiore a 3,5 tonnellate). Il divieto è tipicamente esposto in centri storici, zone residenziali o strade con limitazioni di carico.',
        whenToObeyIt:
          'All\'ingresso della strada con il divieto, per tutti gli autocarri con massa superiore al limite indicato.',
        whatHappensIfIgnored:
          'Multa elevata per il conducente e per l\'impresa di trasporto. Possibile ritiro della carta di circolazione.',
      },
      {
        id: 'divieto-massa',
        name: 'Divieto di transito per massa superiore a X tonnellate',
        shape: 'Cerchio rosso con numero di tonnellate barrato',
        description:
          'Vietato il transito ai veicoli la cui massa complessiva a pieno carico supera il limite indicato sul segnale (es. 7,5 t, 10 t, ecc.). Il divieto è posto su ponti, strade deboli o centri abitati per proteggere le infrastrutture.',
        whenToObeyIt:
          'All\'ingresso della strada, verificando che la massa complessiva del proprio veicolo sia inferiore al limite indicato.',
        whatHappensIfIgnored:
          'Multa molto elevata, possibile sequestro del veicolo e responsabilità per eventuali danni all\'infrastruttura stradale.',
      },
      {
        id: 'divieto-carico-asse',
        name: 'Divieto di transito per carico per asse superiore',
        shape: 'Cerchio rosso con simbolo di asse e tonnellate barrato',
        description:
          'Vietato il transito ai veicoli il cui carico per asse supera il limite indicato sul segnale (es. 6 t per asse). Serve a proteggere i ponti e le strutture stradali dal sovraccarico che potrebbe causare cedimenti strutturali.',
        whenToObeyIt:
          'All\'ingresso della strada, verificando che il carico per ogni asse del veicolo rispetti il limite indicato.',
        whatHappensIfIgnored:
          'Multa gravissima, sequestro del veicolo e risarcimento dei danni all\'infrastruttura. In caso di cedimento del ponte, responsabilità penale.',
      },
      {
        id: 'divieto-clacson',
        name: 'Divieto di suono del clacson',
        shape: 'Cerchio rosso con simbolo di corno o clacson barrato',
        description:
          'Vietato l\'uso del clacson o di qualsiasi segnale acustico nel tratto indicato. Il divieto è tipicamente esposto vicino ad ospedali, scuole, zone residenziali o luoghi di culto, dove il rumore è causa di disturbo.',
        whenToObeyIt:
          'Su tutto il tratto segnalato. In caso di emergenza, il clacson può essere usato solo per evitare un incidente imminente.',
        whatHappensIfIgnored:
          'Multa per disturbo acustico. Ripetute violazioni possono comportare sanzioni più elevate.',
      },
      {
        id: 'divieto-fumare',
        name: 'Vietato fumare (gallerie/serbatoi)',
        shape: 'Cerchio rosso con sigaretta barrata',
        description:
          'Vietato fumare nell\'area indicata, tipicamente gallerie, aree di servizio con serbatoi di carburante o zone a rischio esplosione o incendio. Il divieto esteso riguarda anche l\'accensione di fiamme libere o l\'uso di accendini.',
        whenToObeyIt:
          'In tutta l\'area segnalata, spegnere sigarette e sigari prima di entrare nella zona a rischio.',
        whatHappensIfIgnored:
          'Multa elevata. In caso di incendio provocato, si applicano responsabilità penali gravissime fino al carcere.',
      },
    
      {
        id: 'parcheggio',
        name: 'Parcheggio',
        shape: 'Quadrato blu con bordo blu e lettera P bianca',
        description:
          'Indica un\'area di parcheggio. Possono essere associati pannelli con orari, tariffe o categorie (disabili, camper, ecc.). Il segnale autorizza la sosta nell\'area indicata.',
        whenToObeyIt: 'Per trovare un parcheggio autorizzato.',
        whatHappensIfIgnored:
          'Parcheggiare fuori dagli spazi previsti può comportare multe e rimozione.',
      },
      {
        id: 'divieto-transito-braccia',
        name: 'Divieto di transito per veicoli a braccia',
        shape: 'Cerchio rosso con simbolo di veicolo a braccia barrato',
        description:
          'Vietato il transito ai veicoli a braccia (carriole, carretti a mano e altri veicoli non a motore spinti o trainati a braccia). Il divieto e posto su strade dove la presenza di veicoli lenti a braccia potrebbe creare pericolo o intralcio alla circolazione. Sono consentiti il transito delle biciclette e dei pedoni.',
        whenToObeyIt:
          'All\'ingresso della strada con il divieto, per tutti i veicoli a braccia.',
        whatHappensIfIgnored:
          'Multa per chi transita con veicoli a braccia nella zona interdetta.',
      },
      {
        id: 'divieto-transito-autobus',
        name: 'Divieto di transito per autobus',
        shape: 'Cerchio rosso con simbolo di autobus barrato',
        description:
          'Vietato il transito agli autobus e ai veicoli adibiti al trasporto pubblico di persone sulla strada indicata. Il divieto e tipicamente posto in strade strette, centri storici o zone residenziali dove il passaggio degli autobus creerebbe problemi alla circolazione o all\'ambiente urbano. Restano consentiti il transito delle autovetture e degli altri veicoli privati.',
        whenToObeyIt:
          'All\'ingresso della strada con il divieto, per tutti gli autobus e veicoli di trasporto pubblico.',
        whatHappensIfIgnored:
          'Multa per il conducente dell\'autobus e possibile sanzione per l\'azienda di trasporto pubblico.',
      },
      {
        id: 'divieto-transito-trainati',
        name: 'Divieto di transito per veicoli trainati',
        shape: 'Cerchio rosso con simbolo di veicolo trainato barrato',
        description:
          'Vietato il transito ai veicoli trainati, compresi i rimorchi leggeri, le carrette e i veicoli sprovvisti di motore che vengono trainati. Il divieto si applica anche ai veicoli trainati da animali. E comunemente esposto prima di strettoie, gallerie o ponti dove lo spazio non consente il transito sicuro di veicoli con traino.',
        whenToObeyIt:
          'All\'ingresso della strada con il divieto, per tutti i veicoli trainati.',
        whatHappensIfIgnored:
          'Multa per il conducente del veicolo trainante. Rischio di blocco della circolazione in spazi stretti.',
      },
      {
        id: 'divieto-transito-altezza',
        name: 'Divieto di transito per veicoli con altezza superiore',
        shape: 'Cerchio rosso con numero di altezza in metri barrato',
        description:
          'Vietato il transito ai veicoli la cui altezza complessiva, compreso il carico, supera il limite indicato sul segnale in metri (es. 3,50 m). Il divieto e posto in corrispondenza di sottopassi, gallerie, ponti o altre strutture con altezza limitata. Il conducente deve verificare l\'altezza del proprio veicolo, includendo eventuali carichi sul tetto.',
        whenToObeyIt:
          'All\'ingresso della struttura con altezza limitata, verificando l\'altezza del proprio veicolo.',
        whatHappensIfIgnored:
          'Rischio di collisione del veicolo contro la struttura con conseguenze gravi, danni al veicolo e all\'infrastruttura.',
      },
      {
        id: 'divieto-transito-lunghezza',
        name: 'Divieto di transito per veicoli con lunghezza superiore',
        shape: 'Cerchio rosso con numero di lunghezza in metri barrato',
        description:
          'Vietato il transito ai veicoli la cui lunghezza complessiva supera il limite indicato sul segnale in metri (es. 10 m). Il divieto si applica all\'intero convoglio, compresi eventuali rimorchi. E posto in corrispondenza di curve strette, incroci con spazio limitato o strade dove i veicoli lunghi non potrebbero effettuare manovre in sicurezza.',
        whenToObeyIt:
          'All\'ingresso della strada con il divieto, verificando la lunghezza complessiva del proprio veicolo.',
        whatHappensIfIgnored:
          'Multa e rischio di blocco del traffico se il veicolo non puo percorrere o invertire la marcia nella strada.',
      },
],
  },

  // ─────────────────────────────────────────────────────────────
  //  SEGNALI DI OBBLIGO
  // ─────────────────────────────────────────────────────────────
  {
    id: 'obbligo',
    name: 'Segnali di obbligo',
    icon: '🔵',
    color: '#2563EB',
    description:
      'Segnali rotondi con bordo blu e sfondo bianco. Impongono un comportamento specifico: direzione, percorso, equipaggiamento. Il blu significa "obbligatorio".',
    signals: [
      {
        id: 'pista-ciclabile',
        name: 'Pista ciclabile',
        shape: 'Cerchio con bordo blu e simbolo bicicletta bianca',
        description:
          'I ciclisti devono usare la pista ciclabile. Vietata la circolazione di altri veicoli. Solo attraversamento per accedere a proprietà laterali.',
        whenToObeyIt:
          'I ciclisti devono salire sulla pista appena possibile.',
        whatHappensIfIgnored:
          'Multa per il ciclista se non usa la pista. Multa per il veicolo se la usa impropriamente.',
      },
      {
        id: 'dritto',
        name: 'Obbligo di proseguire dritto',
        shape: 'Cerchio con bordo blu e freccia dritta bianca',
        description:
          'È obbligatorio proseguire nella direzione indicata. Vietato svoltare a destra o sinistra.',
        whenToObeyIt: 'All\'incrocio dove è presente il segnale.',
        whatHappensIfIgnored:
          'Multa e possibile pericolo di incidente.',
      },
      {
        id: 'catene-neve',
        name: 'Obbligo di catene da neve',
        shape: 'Cerchio con bordo blu e simbolo catena',
        description:
          'Obbligo di montare catene da neve su almeno due ruote motrici. Le catene devono essere a bordo del veicolo e montate quando necessario.',
        whenToObeyIt:
          'In presenza di neve o ghiaccio su strade di montagna.',
        whatHappensIfIgnored:
          'Multa, impossibilità di proseguire, rischio di incidente.',
      },
      {
        id: 'direzione-sinistra',
        name: 'Obbligo di direzione sinistra',
        shape: 'Cerchio con bordo blu e freccia curva verso sinistra bianca',
        description:
          'Obbliga a svoltare a sinistra alla prossima intersezione. Non è possibile proseguire dritto o svoltare a destra.',
        whenToObeyIt: 'All\'intersezione dove è presente il segnale.',
        whatHappensIfIgnored:
          'Multa, possibile pericolo di incidente e infrazione al Codice della Strada.',
      },
      {
        id: 'direzione-destra',
        name: 'Obbligo di direzione destra',
        shape: 'Cerchio con bordo blu e freccia curva verso destra bianca',
        description:
          'Obbliga a svoltare a destra alla prossima intersezione. Non è possibile proseguire dritto o svoltare a sinistra.',
        whenToObeyIt: 'All\'intersezione dove è presente il segnale.',
        whatHappensIfIgnored:
          'Multa, possibile pericolo di incidente e infrazione al Codice della Strada.',
      },
      {
        id: 'limite-minimo',
        name: 'Limite minimo di velocità',
        shape: 'Cerchio blu con numero bianco',
        description:
          'Indica la velocità minima obbligatoria in km/h. Si applica su strade come autostrade e tangenziali. Non circolare a velocità inferiore al limite indicato, salvo condizioni di traffico eccezionali.',
        whenToObeyIt:
          'Su tutto il tratto segnalato, salvo cause di forza maggiore (traffico, nebbia).',
        whatHappensIfIgnored:
          'Multa per aver circolato sotto la velocità minima senza giustificato motivo.',
      },
      {
        id: 'rotatoria-obbligo',
        name: 'Obbligo di rotatoria',
        shape: 'Cerchio con bordo blu e frecce circolari bianche',
        description:
          'Obbliga a circolare in senso antiorario all\'interno della rotatoria. Non è consentito attraversare la rotatoria in linea retta.',
        whenToObeyIt: 'All\'ingresso della rotatoria.',
        whatHappensIfIgnored:
          'Multa e rischio grave di incidente con altri veicoli all\'interno della rotatoria.',
      },
      {
        id: 'percorso-pedonale',
        name: 'Percorso pedonale',
        shape: 'Cerchio con bordo blu e simbolo di pedone bianco',
        description:
          'Indica un percorso obbligatorio per i pedoni. I pedoni devono utilizzare questo percorso. Vietato il transito ai veicoli a motore.',
        whenToObeyIt: 'Per i pedoni, su tutto il tratto segnalato.',
        whatHappensIfIgnored:
          'Multa per i veicoli che transitano. Per i pedoni è un percorso consigliato, non strettamente obbligatorio.',
      },
      {
        id: 'percorso-bici',
        name: 'Percorso ciclabile',
        shape:
          'Cerchio con bordo blu e simbolo di bicicletta e pedone bianchi',
        description:
          'Indica un percorso obbligatorio per i ciclisti e consentito ai pedoni. Vietato il transito ai veicoli a motore. I ciclisti devono rispettare i pedoni.',
        whenToObeyIt: 'Per i ciclisti, su tutto il tratto segnalato.',
        whatHappensIfIgnored:
          'Multa per il ciclista se utilizza la carreggiata invece del percorso dedicato.',
      },
      {
        id: 'direzione-retta-destra',
        name: 'Obbligo di proseguire dritto o a destra',
        shape: 'Cerchio con bordo blu e frecce bianche (dritto e destra)',
        description:
          'Obbliga il conducente a proseguire dritto o svoltare a destra all\'intersezione successiva. Vietata la svolta a sinistra e l\'inversione di marcia. Questo segnale viene utilizzato negli incroci dove la svolta a sinistra creerebbe pericolo o conflitti con il traffico opposto.',
        whenToObeyIt:
          'All\'intersezione dove è installato il segnale, prima di svoltare.',
        whatHappensIfIgnored:
          'Multa per infrazione al Codice della Strada e rischio di collisione con veicoli provenienti dalla direzione opposta.',
      },
      {
        id: 'direzione-retta-sinistra',
        name: 'Obbligo di proseguire dritto o a sinistra',
        shape: 'Cerchio con bordo blu e frecce bianche (dritto e sinistra)',
        description:
          'Obbliga il conducente a proseguire dritto o svoltare a sinistra all\'intersezione successiva. Vietata la svolta a destra. Questo segnale è comune negli incroci dove la svolta a destra porterebbe su una strada a senso unico opposto o in area riservata.',
        whenToObeyIt:
          'All\'intersezione dove è installato il segnale, prima di svoltare.',
        whatHappensIfIgnored:
          'Multa per violazione dell\'obbligo e possibile ingresso in una strada contromano con rischio di incidente frontale.',
      },
      {
        id: 'passaggio-destra',
        name: 'Obbligo di passaggio a destra',
        shape: 'Cerchio con bordo blu e frecce bianche verso destra',
        description:
          'Obbliga il conducente a passare sul lato destro di un ostacolo o di un\'isola spartitraffico. Questo segnale viene posizionato in corrispondenza di restringimenti, opere stradali o dossi spartitraffico. Il passaggio a sinistra è severamente vietato.',
        whenToObeyIt:
          'Appena il segnale è visibile, prima di raggiungere l\'ostacolo o il restringimento.',
        whatHappensIfIgnored:
          'Multa e rischio grave di collisione frontale con veicoli che procedono regolarmente nel verso opposto.',
      },
      {
        id: 'passaggio-sinistra',
        name: 'Obbligo di passaggio a sinistra',
        shape: 'Cerchio con bordo blu e frecce bianche verso sinistra',
        description:
          'Obbliga il conducente a passare sul lato sinistro di un ostacolo o di un\'isola spartitraffico. Utilizzato quando l\'ostacolo si trova sul lato destro della carreggiata o in situazioni particolari di cantiere stradale. Il passaggio a destra è vietato.',
        whenToObeyIt:
          'Appena il segnale è visibile, prima di raggiungere l\'ostacolo o l\'isola.',
        whatHappensIfIgnored:
          'Multa e rischio di incidente con possibile impatto contro l\'ostacolo o il guardrail.',
      },
      {
        id: 'pneumatici-invernali',
        name: 'Obbligo di pneumatici invernali',
        shape: 'Cerchio con bordo blu e simbolo di pneumatico con fiocco di neve (M+S)',
        description:
          'Obbliga a circolare con pneumatici invernali omologati (marcatura M+S o 3PMSF) montati su tutte le ruote del veicolo. Il segnale è valido nel periodo indicato dal pannello integrativo associato, generalmente dal 15 novembre al 15 aprile. I pneumatici quattro stagioni con marcatura M+S sono ammessi.',
        whenToObeyIt:
          'Su tutto il tratto stradale segnalato, durante il periodo di validità indicato.',
        whatHappensIfIgnored:
          'Multa da 41 a 168 euro, decurtazione di 3 punti dalla patente e obbligo di montare le catene o i pneumatici prima di proseguire.',
      },
      {
        id: 'rotonda-destra',
        name: 'Rotatoria senso orario',
        shape: 'Cerchio con bordo blu e frecce circolari bianche in senso orario',
        description:
          'Obbliga a circolare in senso orario all\'interno della rotatoria. Questo tipo di rotatoria è raro in Italia ed è tipico di paesi come il Regno Unito, ma può essere presente in alcune intersezioni specifiche. Il conducente deve entrare e percorrere la rotatoria seguendo il senso indicato dalle frecce.',
        whenToObeyIt:
          'All\'ingresso della rotatoria, seguendo il senso di circolazione indicato.',
        whatHappensIfIgnored:
          'Multa severa e rischio gravissimo di incidente frontale con veicoli che circolano nel verso corretto.',
      },
    
      {
        id: 'parcheggio-coperto',
        name: 'Parcheggio coperto',
        shape: 'Rettangolo blu con simbolo P e icona di tetto/struttura coperta',
        description:
          'Indica la presenza di un parcheggio multipiano o sotterraneo nelle vicinanze. Il parcheggio coperto offre protezione dalle intemperie ed è generalmente a pagamento. Spesso indicato con pannelli che mostrano i posti disponibili in tempo reale.',
        whenToObeyIt: 'Informativo, per trovare un parcheggio al coperto nelle vicinanze.',
        whatHappensIfIgnored: 'Non applicabile — è informativo. Parcheggiare in divieto di sosta comporta multe.',
      },

      {
        id: 'parcheggio-disabili',
        name: 'Parcheggio per disabili',
        shape: 'Rettangolo blu con simbolo P e simbolo di disabile',
        description:
          'Indica stalli di parcheggio riservati esclusivamente ai veicoli con contrassegno disabili. L\'occupazione abusiva di questi posti è punita con sanzioni molto severe. Il contrassegno deve essere esposto in modo ben visibile sul parabrezza.',
        whenToObeyIt: 'Solo i veicoli con regolare contrassegno disabili possono utilizzare questi stalli.',
        whatHappensIfIgnored:
          'Multa da 80 a 328 euro e decurtazione di 2 punti dalla patente. Possibile rimozione del veicolo.',
      },
      {
        id: 'fine-obbligo-dritto',
        name: 'Fine dell\'obbligo di proseguire dritto',
        shape: 'Cerchio grigio con bordo grigio e freccia dritta grigia',
        description:
          'Indica la fine dell\'obbligo di proseguire dritto precedentemente imposto. Da questo punto in poi, il conducente puo svoltare a destra o a sinistra, secondo le normali regole della circolazione. Il segnale eposto subito dopo l\'ultimo incrocio in cui valeva l\'obbligo.',
        whenToObeyIt:
          'Appena superato il segnale, si riprende la liberta di svoltare secondo le regole normali.',
        whatHappensIfIgnored:
          'Non applicabile: e un segnale che conclude una prescrizione e ripristina la liberta di manovra.',
      },
      {
        id: 'fine-obbligo-direzione',
        name: 'Fine dell\'obbligo di direzione',
        shape: 'Cerchio grigio con bordo grigio e freccia curva grigia',
        description:
          'Indica la fine dell\'obbligo di direzione (destra o sinistra) precedentemente imposto. Da questo punto il conducente puo proseguire in qualsiasi direzione, secondo le normali regole. Il segnale ha la stessa forma del segnale di obbligo ma con colori grigi, a indicare la fine della prescrizione.',
        whenToObeyIt:
          'Appena superato il segnale, riprendere la liberta di scelta della direzione.',
        whatHappensIfIgnored:
          'Non applicabile: ripristina la normale liberta di circolazione.',
      },
      {
        id: 'zona-sosta-regolamentata',
        name: 'Zona di sosta regolamentata',
        shape: 'Rettangolo blu con bordo bianco e simbolo di sosta',
        description:
          'Indica l\'inizio di una zona in cui la sosta e regolamentata. Le condizioni della sosta (orari, durata, categorie ammesse) sono indicate dai pannelli integrativi associati. Il conducente deve rispettare le regole di sosta indicate nei pannelli. Il segnale non vieta la sosta ma la subordina a specifiche condizioni.',
        whenToObeyIt:
          'All\'ingresso della zona, verificare le condizioni di sosta indicate dai pannelli integrativi.',
        whatHappensIfIgnored:
          'Multa per sosta non conforme alle condizioni indicate, rischio di rimozione del veicolo.',
      },
      {
        id: 'parcheggio-a-tempo',
        name: 'Parcheggio a tempo determinato (disco orario)',
        shape: 'Rettangolo blu con simbolo di parcheggio e disco orario',
        description:
          'Indica un\'area di parcheggio dove la sosta e consentita per un tempo limitato. Il conducente deve esporre il disco orario sul cruscotto, indicando l\'ora di arrivo. La durata massima e indicata dal pannello integrativo (es. 1 ora, 2 ore). Superato il tempo consentito, il veicolo deve essere spostato.',
        whenToObeyIt:
          'All\'atto della sosta, posizionando il disco orario in modo visibile dall\'esterno.',
        whatHappensIfIgnored:
          'Multa per sosta oltre il tempo consentito o senza disco orario esposto. Possibile rimozione del veicolo.',
      },
      {
        id: 'preavviso-direzione-destra',
        name: 'Preavviso di obbligo di direzione destra',
        shape: 'Cerchio blu con bordo tratteggiato e freccia curva verso destra',
        description:
          'Preannuncia la presenza, a breve distanza, di un segnale che obbliga a svoltare a destra. Il conducente deve prepararsi alla svolta obbligatoria posizionandosi nella corsia di destra. Non e consentito proseguire dritto ne svoltare a sinistra. Il bordo tratteggiato distingue questo preavviso dal segnale di obbligo definitivo.',
        whenToObeyIt:
          'Appena visibile il preavviso, posizionarsi nella corsia di destra per prepararsi alla svolta.',
        whatHappensIfIgnored:
          'Non prepararsi in tempo alla svolta obbligatoria, con rischio di manovre pericolose dell\'ultimo momento.',
      },
      {
        id: 'preavviso-direzione-sinistra',
        name: 'Preavviso di obbligo di direzione sinistra',
        shape: 'Cerchio blu con bordo tratteggiato e freccia curva verso sinistra',
        description:
          'Preannuncia la presenza, a breve distanza, di un segnale che obbliga a svoltare a sinistra. Il conducente deve prepararsi alla svolta obbligatoria posizionandosi nella corsia di sinistra o al centro della carreggiata. Non e consentito proseguire dritto ne svoltare a destra.',
        whenToObeyIt:
          'Appena visibile il preavviso, posizionarsi nella corsia di sinistra per prepararsi alla svolta.',
        whatHappensIfIgnored:
          'Non prepararsi in tempo alla svolta obbligatoria, con rischio di attraversamento della carreggiata pericoloso.',
      },
      {
        id: 'direzione-destra-sinistra',
        name: 'Obbligo di direzione destra o sinistra',
        shape: 'Cerchio con bordo blu e due frecce curve (destra e sinistra) bianche',
        description:
          'Obbliga il conducente a svoltare a destra o a sinistra alla prossima intersezione. E vietato proseguire dritto. Questo segnale viene utilizzato negli incroci a T o in situazioni dove la prosecuzione dritta non e possibile o e riservata a categorie specifiche di veicoli.',
        whenToObeyIt:
          'All\'intersezione, il conducente deve obbligatoriamente svoltare a destra o a sinistra.',
        whatHappensIfIgnored:
          'Multa per proseguimento dritto non consentito. Rischio di immettersi in una strada pericolosa o non percorribile.',
      },
      {
        id: 'passaggio-destra-sinistra',
        name: 'Obbligo di passaggio a destra o sinistra',
        shape: 'Cerchio con bordo blu e frecce verso destra e sinistra bianche',
        description:
          'Obbliga il conducente a passare a destra o a sinistra di un ostacolo o di un\'isola spartitraffico. Non e consentito passare dritto o dall\'altra parte. Il segnale e posizionato in corrispondenza di restringimenti, isole spartitraffico o lavori stradali dove il passaggio diretto e ostruito.',
        whenToObeyIt:
          'Appena il segnale e visibile, prepararsi a passare a destra o a sinistra dell\'ostacolo.',
        whatHappensIfIgnored:
          'Rischio di impatto contro l\'ostacolo o l\'isola spartitraffico, con possibili danni al veicolo.',
      },
      {
        id: 'fine-limite-minimo',
        name: 'Fine del limite minimo di velocita',
        shape: 'Cerchio grigio con numero bianco e barra diagonale grigia',
        description:
          'Indica la fine del limite minimo di velocita precedentemente imposto. Da questo punto non e piu obbligatorio mantenere la velocita minima. Si applicano i limiti generali di velocita per il tipo di strada. Il segnale ha la stessa forma del limite minimo ma con colori grigi.',
        whenToObeyIt:
          'Appena superato il segnale, riprendere la velocita secondo i limiti generali.',
        whatHappensIfIgnored:
          'Non applicabile: ripristina la liberta di scelta della velocita secondo i limiti generali.',
      },
      {
        id: 'fine-percorso-pedonale',
        name: 'Fine percorso pedonale',
        shape: 'Cerchio grigio con bordo grigio e simbolo di pedone grigio barrato',
        description:
          'Indica il punto in cui finisce il percorso pedonale obbligatorio. I pedoni non sono piu obbligati a utilizzare il percorso dedicato e possono camminare sul marciapiede normale. Il segnale e posto in corrispondenza della fine del viale o del percorso riservato ai pedoni.',
        whenToObeyIt:
          'In corrispondenza del segnale, i pedoni possono riprendere la normale circolazione sui marciapiedi.',
        whatHappensIfIgnored:
          'Non applicabile: conclude l\'obbligo del percorso pedonale.',
      },
      {
        id: 'fine-pista-ciclabile',
        name: 'Fine pista ciclabile',
        shape: 'Cerchio grigio con bordo grigio e simbolo di bicicletta grigia barrata',
        description:
          'Indica il punto in cui finisce la pista ciclabile. I ciclisti non sono piu obbligati a utilizzare la pista e devono immettersi sulla carreggiata normale, rispettando le regole di circolazione previste per le biciclette sulla strada. Il segnale e posto alla fine della infrastruttura ciclabile.',
        whenToObeyIt:
          'In corrispondenza del segnale, il ciclista deve immettersi sulla carreggiata con prudenza.',
        whatHappensIfIgnored:
          'Non applicabile: conclude l\'obbligo di utilizzare la pista ciclabile.',
      },
      {
        id: 'percorso-pedonale-ciclabile',
        name: 'Percorso pedonale e ciclabile',
        shape: 'Cerchio con bordo blu e simboli di pedone e bicicletta bianchi',
        description:
          'Indica un percorso condiviso obbligatorio per pedoni e ciclisti. Entrambi devono utilizzare questo percorso e non la carreggiata. I ciclisti devono mantenere una velocita moderata e dare la precedenza ai pedoni. Il percorso e identificato dalla doppia segnaletica orizzontale (pedone e bicicletta).',
        whenToObeyIt:
          'Su tutto il tratto del percorso misto, sia per i pedoni che per i ciclisti.',
        whatHappensIfIgnored:
          'Multa per chi utilizza la carreggiata invece del percorso dedicato. Rischio di incidente tra pedoni e ciclisti.',
      },
      {
        id: 'fine-pista-ciclabile-pedonale',
        name: 'Fine della pista ciclabile con percorso pedonale',
        shape: 'Cerchio grigio con simboli di bicicletta e pedone grigi barrati',
        description:
          'Indica la fine della pista ciclabile che era affiancata da un percorso pedonale. I ciclisti devono immettersi sulla carreggiata normale. Il percorso pedonale potrebbe continuare come marciapiede normale. Il segnale e posto nel punto dove termina la parte ciclabile dell\'infrastruttura.',
        whenToObeyIt:
          'In corrispondenza del segnale, il ciclista deve lasciare la pista e immettersi sulla carreggiata.',
        whatHappensIfIgnored:
          'Non applicabile: conclude la pista ciclabile. Il pedone puo continuare sul percorso dedicato se presente.',
      },
      {
        id: 'fine-percorso-pedonale-ciclabile',
        name: 'Fine del percorso pedonale e ciclabile',
        shape: 'Cerchio grigio con simboli di pedone e bicicletta grigi barrati',
        description:
          'Indica la fine contemporanea del percorso condiviso pedonale e ciclabile. Sia i pedoni che i ciclisti devono riprendere la normale circolazione: i pedoni sui marciapiedi e i ciclisti sulla carreggiata. Il segnale e posto alla fine del viale misto.',
        whenToObeyIt:
          'In corrispondenza del segnale, sia pedoni che ciclisti riprendono le normali regole di circolazione.',
        whatHappensIfIgnored:
          'Non applicabile: conclude l\'obbligo del percorso misto per entrambe le categorie.',
      },
],
  },

  // ─────────────────────────────────────────────────────────────
  //  SEGNALI DI PRECEDENZA
  // ─────────────────────────────────────────────────────────────
  {
    id: 'precedenza',
    name: 'Segnali di precedenza',
    icon: '🔺',
    color: '#F59E0B',
    description:
      'Stabiliscono chi ha il diritto di passare per primo. Includono: dare precedenza (triangolo rovesciato), stop (ottagono), strada prioritaria (rombo giallo). Fondamentali per la sicurezza agli incroci.',
    signals: [
      {
        id: 'dare-precedenza',
        name: 'Dare precedenza',
        shape: 'Triangolo rovesciato con bordo rosso e sfondo bianco',
        description:
          'Obbligo di dare la precedenza ai veicoli sulla strada prioritaria o che provengono da destra. Rallentare e, se necessario, fermarsi.',
        whenToObeyIt: 'Avvicinandosi all\'incrocio.',
        whatHappensIfIgnored:
          'Rischio di collisione. Responsabilità totale in caso di incidente.',
      },
      {
        id: 'stop',
        name: 'Stop',
        shape: 'Ottagono rosso con scritta STOP bianca',
        description:
          'Obbligo di fermarsi COMPLETAMENTE (ruote immobili). Guardare in entrambe le direzioni. Procedere solo se sicuro.',
        whenToObeyIt:
          'Sempre. Fermarsi completamente prima della linea di arresto.',
        whatHappensIfIgnored:
          'Multa severa. Se causa incidente: responsabilità penale.',
      },
      {
        id: 'strada-prioritaria',
        name: 'Strada prioritaria',
        shape: 'Rombo giallo su sfondo bianco con bordo bianco',
        description:
          'Indica che la strada ha la priorità. Chi viaggia su questa strada ha la precedenza negli incroci non segnalati.',
        whenToObeyIt:
          'Sempre durante la percorrenza della strada prioritaria.',
        whatHappensIfIgnored:
          'Non applicabile — è un vantaggio, non un obbligo. Ma non dà diritto a sfrecciare.',
      },
      {
        id: 'fine-prioritaria',
        name: 'Fine strada prioritaria',
        shape: 'Rombo giallo con barra nera diagonale su sfondo bianco',
        description:
          'La strada prioritaria sta per finire. Da questo punto in poi, applicare le regole normali di precedenza ("dalla destra" salvo diversamente segnalato).',
        whenToObeyIt:
          'Appena visibile il segnale, prepararsi a cedere la precedenza.',
        whatHappensIfIgnored:
          'Credere di avere ancora la precedenza può causare incidenti gravi.',
      },
      {
        id: 'sensi-unici-alternati',
        name: 'Sensi unici alternati',
        shape:
          'Rettangolo con due frecce rosse alternate su sfondo bianco',
        description:
          'Indica un tratto di strada troppo stretto per il doppio senso. Il transito è regolato da semaforo o da segnale di dare precedenza. Attraversare solo quando consentito.',
        whenToObeyIt:
          'All\'ingresso del tratto a senso unico alternato, rispettare il semaforo o il segnale.',
        whatHappensIfIgnored:
          'Rischio di incastro con veicoli provenienti dalla direzione opposta. Impossibilità di proseguire.',
      },
      {
        id: 'confluenza-destra',
        name: 'Confluenza da destra',
        shape:
          'Triangolo con freccia che si unisce da destra alla carreggiata principale',
        description:
          'Indica che una strada si immette da destra. Il conducente deve prestare attenzione ai veicoli che confluiscono. Non indica chi ha la precedenza.',
        whenToObeyIt:
          'Avvicinandosi al punto di confluenza.',
        whatHappensIfIgnored:
          'Rischio di collisione con veicoli che si immettono dalla strada laterale.',
      },
      {
        id: 'confluenza-sinistra',
        name: 'Confluenza da sinistra',
        shape:
          'Triangolo con freccia che si unisce da sinistra alla carreggiata principale',
        description:
          'Indica che una strada si immette da sinistra. Il conducente deve prestare attenzione ai veicoli che confluiscono. Non indica chi ha la precedenza.',
        whenToObeyIt:
          'Avvicinandosi al punto di confluenza.',
        whatHappensIfIgnored:
          'Rischio di collisione con veicoli che si immettono dalla strada laterale.',
      },
      {
        id: 'preavviso-precedenza',
        name: 'Preavviso di dare precedenza',
        shape:
          'Triangolo con bordo rosso e due triangoli rovesciati all\'interno',
        description:
          'Preavvisa la presenza di un segnale di dare precedenza a breve distanza. Il conducente deve iniziare a rallentare e prepararsi a cedere il passo.',
        whenToObeyIt:
          'Appena visibile il preavviso, prima di raggiungere il segnale di dare precedenza.',
        whatHappensIfIgnored:
          'Non prepararsi in tempo alla cessione di precedenza, con rischio di collisione.',
      },
      {
        id: 'preavviso-stop',
        name: 'Preavviso di stop',
        shape:
          'Triangolo con bordo rosso e ottagono all\'interno',
        description:
          'Preavvisa la presenza di un segnale di stop a breve distanza. Il conducente deve iniziare a rallentare e prepararsi alla fermata completa.',
        whenToObeyIt:
          'Appena visibile il preavviso, prima di raggiungere il segnale di stop.',
        whatHappensIfIgnored:
          'Non prepararsi in tempo alla fermata, con rischio di attraversare l\'incrocio senza fermarsi.',
      },
      {
        id: 'precedenza-opposti-discesa',
        name: 'Precedenza ai veicoli opposti in discesa',
        shape: 'Rettangolo con due frecce: una grande (discesa) e una piccola (salita)',
        description:
          'Indica che i veicoli che procedono in discesa hanno la precedenza rispetto ai veicoli che risalgono la stessa strada. Questo segnale viene posizionato nelle strade di montagna strette e ripide dove il passaggio contemporaneo non è possibile. Il conducente in salita deve fermarsi e attendere il passaggio del veicolo in discesa.',
        whenToObeyIt:
          'Su tutto il tratto stradale segnalato, quando si incontra un veicolo proveniente dalla direzione opposta.',
        whatHappensIfIgnored:
          'Multa e rischio di collisione o di blocco del traffico in una strada stretta con veicoli impossibilitati a retrocedere.',
      },
      {
        id: 'incrocio-prioritaria',
        name: 'Incrocio con strada prioritaria',
        shape: 'Triangolo con croce e linea spessa su un braccio',
        description:
          'Indica un incrocio in cui la strada trasversale ha la precedenza. Il conducente deve rallentare e dare la precedenza ai veicoli provenienti dalla strada principale. Non fermarsi se la visibilità è sufficiente e non ci sono veicoli in arrivo.',
        whenToObeyIt:
          'Avvicinandosi all\'incrocio, ridurre la velocità e valutare il traffico sulla strada prioritaria.',
        whatHappensIfIgnored:
          'Rischio di collisione laterale con veicoli che hanno la precedenza. In caso di incidente, la responsabilità è totale per chi non ha dato la precedenza.',
      },
      {
        id: 'semincrocio',
        name: 'Semincrocio',
        shape: 'Triangolo con una freccia e un ramo secondario',
        description:
          'Indica la presenza di un semincrocio, ovvero un incrocio in cui solo una delle strade è prioritaria. Il conducente proveniente dalla strada secondaria deve dare la precedenza ai veicoli sulla strada principale, mentre chi percorre la strada prioritaria può proseguire senza fermarsi.',
        whenToObeyIt:
          'Avvicinandosi al semincrocio, controllare i veicoli sulla strada principale e cedere il passo se necessario.',
        whatHappensIfIgnored:
          'Rischio di collisione con veicoli che transitano sulla strada prioritaria, con conseguenze gravi e responsabilità totale in caso di incidente.',
      },
          {
        id: 'preavviso-strada-prioritaria-destra',
        name: 'Preavviso di strada prioritaria da destra',
        shape: 'Triangolo con simbolo di incrocio e linea spessa sul braccio destro',
        description:
          'Preannuncia la presenza di un incrocio in cui la strada principale proveniente da destra ha la precedenza. Il conducente deve ridurre la velocita e prepararsi a cedere il passo ai veicoli che provengono dalla strada prioritaria sulla destra. Questo segnale e posizionato a una distanza adeguata dall\'incrocio per permettere al conducente di reagire in tempo.',
        whenToObeyIt:
          'Appena visibile il segnale, ridurre la velocita e avvicinarsi all\'incrocio con prudenza, pronto a cedere la precedenza.',
        whatHappensIfIgnored:
          'Rischio di collisione laterale con veicoli che hanno la precedenza sulla strada principale. Responsabilita totale in caso di incidente.',
      },
      {
        id: 'preavviso-strada-prioritaria-sinistra',
        name: 'Preavviso di strada prioritaria da sinistra',
        shape: 'Triangolo con simbolo di incrocio e linea spessa sul braccio sinistro',
        description:
          'Preannuncia la presenza di un incrocio in cui la strada principale proveniente da sinistra ha la precedenza. Il conducente deve ridurre la velocita e prepararsi a cedere il passo ai veicoli che provengono dalla strada prioritaria sulla sinistra. Questo segnale e posizionato a una distanza adeguata dall\'incrocio.',
        whenToObeyIt:
          'Appena visibile il segnale, ridurre la velocita e avvicinarsi all\'incrocio con prudenza.',
        whatHappensIfIgnored:
          'Rischio di collisione laterale con veicoli provenienti dalla strada prioritaria a sinistra. Sanzioni e responsabilita in caso di incidente.',
      },
],
  },

  // ─────────────────────────────────────────────────────────────
  //  SEGNALI DI INDICAZIONE
  // ─────────────────────────────────────────────────────────────
  {
    id: 'indicazione',
    name: 'Segnali di indicazione',
    icon: '🪧',
    color: '#06B6D4',
    description:
      'Forniscono informazioni utili: direzioni, distanze, servizi, attrazioni turistiche. Il colore dello sfondo indica il tipo di informazione: blu (servizi), verde (autostrade), bianco (strade urbane), marrone (turismo).',
    signals: [
      {
        id: 'autostrada',
        name: 'Inizio autostrada',
        shape: 'Rettangolo verde con simbolo autostrada bianco',
        description:
          'Indica l\'inizio di un\'autostrada. Applicano le regole specifiche: minimo 80 km/h (se non diversamente indicato), massimo 130 km/h, vietati pedoni e veicoli lenti.',
        whenToObeyIt:
          'All\'ingresso dell\'autostrada, dopo la rampa di accelerazione.',
        whatHappensIfIgnored:
          'Non applicabile — è informativo. Ma le regole dell\'autostrada sono obbligatorie.',
      },
      {
        id: 'fine-autostrada',
        name: 'Fine autostrada',
        shape: 'Rettangolo verde con simbolo autostrada barrato',
        description:
          'Indica la fine dell\'autostrada. I limiti di velocità cambiano: da 130 km/h al limite della strada che si immette. Ridurre la velocità gradualmente.',
        whenToObeyIt:
          'Appena visibile il segnale, iniziare a rallentare.',
        whatHappensIfIgnored:
          'Multa per eccesso di velocità al di fuori dell\'autostrada.',
      },
      {
        id: 'ospedale',
        name: 'Ospedale',
        shape: 'Rettangolo blu con simbolo ospedale bianco',
        description:
          'Indica la vicinanza di un ospedale o pronto soccorso. Non sostare davanti all\'ingresso degli ospedali per non ostacolare le ambulanze.',
        whenToObeyIt: 'Informativo, per orientarsi.',
        whatHappensIfIgnored: 'Non applicabile — è informativo.',
      },
      {
        id: 'area-servizio',
        name: 'Area di servizio',
        shape: 'Rettangolo blu con simbolo benzina e ristorante',
        description:
          'Indica un\'area di servizio con distributore carburante, ristorante, servizi igienici. Posizionata sulle autostrade e strade extraurbane principali.',
        whenToObeyIt: 'Informativo, per pianificare le fermate.',
        whatHappensIfIgnored: 'Non applicabile — è informativo.',
      },
      {
        id: 'inizio-centro-abitato',
        name: 'Inizio centro abitato',
        shape: 'Rettangolo bianco con nome del paese e bordo nero',
        description:
          'Indica l\'ingresso in un centro abitato. Il limite generale di velocità scende a 50 km/h. Vietato l\'uso della tromba (clacson). Divieto di sorpasso per i mezzi pesanti.',
        whenToObeyIt:
          'Appena superato il segnale, rispettare il limite di 50 km/h.',
        whatHappensIfIgnored:
          'Multa per eccesso di velocità. In centro abitato il rischio per pedoni è massimo.',
      },
      {
        id: 'fine-centro-abitato',
        name: 'Fine centro abitato',
        shape:
          'Rettangolo bianco con nome del paese barrato e bordo nero',
        description:
          'Indica l\'uscita dal centro abitato. Il limite di velocità aumenta a 90 km/h sulle strade extraurbane secondarie o 110 km/h sulle extraurbane principali.',
        whenToObeyIt:
          'Appena superato il segnale, riprendere i limiti di velocità extraurbani.',
        whatHappensIfIgnored:
          'Non applicabile — riprendono i limiti generali per le strade extraurbane.',
      },
      {
        id: 'strada-senza-uscita',
        name: 'Strada senza uscita',
        shape: 'Rettangolo bianco con simbolo di strada chiusa e bordo rosso',
        description:
          'Indica che la strada non ha uscita. Il conducente non può proseguire oltre e deve fare inversione di marcia.',
        whenToObeyIt: 'Appena visibile il segnale.',
        whatHappensIfIgnored:
          'Spreco di tempo, impossibilità di proseguire e necessità di inversione di marcia.',
      },
      {
        id: 'velocita-consigliata',
        name: 'Velocità consigliata',
        shape: 'Rettangolo blu con bordo blu e numero bianco',
        description:
          'Indica la velocità consigliata per percorrere in sicurezza il tratto di strada, tenendo conto delle sue caratteristiche. Non è un limite obbligatorio, ma una raccomandazione.',
        whenToObeyIt:
          'Su tutto il tratto segnalato, come indicazione per una guida sicura.',
        whatHappensIfIgnored:
          'Non applicabile — è un consiglio. Ma non rispettarlo può essere pericoloso.',
      },
      {
        id: 'inizio-galleria',
        name: 'Inizio galleria (indicazione)',
        shape:
          'Rettangolo blu con simbolo di galleria e eventuale nome',
        description:
          'Indica l\'inizio di una galleria con il suo nome. Accendere le luci anabbaglianti e rispettare il limite di velocità interno (max 90 km/h).',
        whenToObeyIt: 'Prima dell\'ingresso della galleria.',
        whatHappensIfIgnored:
          'Multa per luci spente, rischio di incidenti per scarsa visibilità.',
      },
      {
        id: 'area-pedonale',
        name: 'Area pedonale',
        shape: 'Rettangolo blu con simbolo di pedone',
        description:
          'Indica una zona riservata ai pedoni. Vietato il transito ai veicoli a motore, salvo autorizzazioni specifiche (residenti, carico/scarico).',
        whenToObeyIt: 'All\'ingresso dell\'area pedonale.',
        whatHappensIfIgnored:
          'Multa elevata. I veicoli non autorizzati non possono transitare.',
      },
      {
        id: 'traffico-limitato',
        name: 'Zona a traffico limitato',
        shape: 'Rettangolo bianco con simbolo e bordo rosso',
        description:
          'Indica una zona dove il traffico è limitato a determinate categorie di veicoli e orari. Spesso usata nei centri storici. I veicoli non autorizzati non possono accedere.',
        whenToObeyIt:
          'All\'ingresso della zona. Verificare sempre orari e categorie ammesse.',
        whatHappensIfIgnored:
          'Multa automatica tramite telecamere. Sanzione da 80 a 300 euro.',
      },
      {
        id: 'scuolabus',
        name: 'Fermata scuolabus',
        shape: 'Rettangolo blu con simbolo di scuolabus',
        description:
          'Indica una fermata dello scuolabus. Prestare attenzione: quando lo scuolabus è fermo con lampeggianti accesi, è vietato sorpassare e i pedoni hanno la precedenza.',
        whenToObeyIt: 'Avvicinandosi alla fermata, con attenzione agli orari scolastici.',
        whatHappensIfIgnored:
          'Multa e decurtazione punti se non si ferma allo scuolabus con lampeggianti.',
      },
      {
        id: 'pronto-soccorso',
        name: 'Pronto soccorso',
        shape: 'Rettangolo blu con simbolo di croce e stella bianca',
        description:
          'Indica la direzione per raggiungere il pronto soccorso o la guardia medica più vicina. Utile in caso di emergenza sanitaria.',
        whenToObeyIt: 'Informativo, per orientarsi in caso di emergenza.',
        whatHappensIfIgnored: 'Non applicabile — è informativo.',
      },
      {
        id: 'fermata-autobus',
        name: 'Fermata autobus',
        shape: 'Rettangolo blu con simbolo di autobus',
        description:
          'Indica una fermata del trasporto pubblico. Non sostare nelle vicinanze della fermata per non ostacolare la salita e discesa dei passeggeri.',
        whenToObeyIt: 'Informativo. Non sostare vicino alla fermata.',
        whatHappensIfIgnored:
          'Multa per sosta vicino alla fermata autobus. Ostacolo al trasporto pubblico.',
      },
      {
        id: 'telefono',
        name: 'Telefono',
        shape: 'Rettangolo blu con simbolo di telefono',
        description:
          'Indica la presenza di un telefono di emergenza nelle vicinanze. Utile in caso di guasto o incidente su strade extraurbane.',
        whenToObeyIt: 'Informativo, per sapere dove trovare un telefono di emergenza.',
        whatHappensIfIgnored: 'Non applicabile — è informativo.',
      },
      {
        id: 'campeggio',
        name: 'Campeggio',
        shape: 'Rettangolo marrone con simbolo di tenda e albero',
        description:
          'Indica la presenza di un\'area di campeggio nelle vicinanze. Utilizzato come segnale turistico-informativo.',
        whenToObeyIt: 'Informativo, per orientarsi.',
        whatHappensIfIgnored: 'Non applicabile — è informativo.',
      },
      {
        id: 'itinerario-turistico',
        name: 'Itinerario turistico',
        shape: 'Rettangolo marrone con simbolo o nome dell\'itinerario',
        description:
          'Segnale di indicazione turistica che contrassegna un itinerario di interesse paesaggistico, storico o culturale. Il colore marrone distingue i segnali turistici da quelli di normale indicazione. Guida il conducente lungo un percorso che tocca luoghi di particolare interesse.',
        whenToObeyIt: 'Informativo, seguire le indicazioni per rimanere sull\'itinerario turistico.',
        whatHappensIfIgnored: 'Non applicabile — è puramente informativo e di orientamento.',
      },
      {
        id: 'parcheggio-scambiatore',
        name: 'Parcheggio scambiatore',
        shape: 'Rettangolo blu con simbolo P e icona di mezzi pubblici',
        description:
          'Indica un parcheggio collegato a una rete di trasporto pubblico (metropolitana, treno, autobus). Il conducente può lasciare il veicolo e continuare il viaggio con i mezzi pubblici. Spesso situati alle periferie delle grandi città per ridurre il traffico nel centro urbano.',
        whenToObeyIt: 'Informativo, utile per chi cerca parcheggio con collegamento ai mezzi pubblici.',
        whatHappensIfIgnored: 'Non applicabile — è informativo. Parcheggiare altrove può comportare costi maggiori.',
      },
      {
        id: 'area-sosta-camper',
        name: 'Area di sosta per camper',
        shape: 'Rettangolo blu con simbolo di camper',
        description:
          'Indica un\'area attrezzata per la sosta di camper e veicoli ricreazionali. Può essere dotata di servizi come carico/scarico acqua, punti di scarico delle acque reflue e collegamento elettrico. Riservata esclusivamente ai camper.',
        whenToObeyIt: 'Solo per i conducenti di camper, come area di sosta autorizzata.',
        whatHappensIfIgnored: 'Non applicabile — è informativo. Sostare con camper fuori dalle aree designate può comportare multe.',
      },
      {
        id: 'area-sosta',
        name: 'Area di sosta',
        shape: 'Rettangolo blu con simbolo di parcheggio e lettera S o simbolo specifico',
        description:
          'Indica un\'area attrezzata per la sosta temporanea dei veicoli. L\'area può essere gratuita o a pagamento, con limiti di tempo o senza. Le condizioni specifiche sono indicate dai pannelli integrativi associati al segnale.',
        whenToObeyIt: 'Informativo, per trovare un\'area di sosta autorizzata.',
        whatHappensIfIgnored: 'Non applicabile — è informativo. Sostare fuori dalle aree indicate può comportare multe.',
      },
      {
        id: 'uscita-autostrada',
        name: 'Uscita autostrada',
        shape: 'Rettangolo verde con freccia bianca verso il basso e numero uscita',
        description:
          'Segnale di preavviso che indica la prossima uscita autostradale. Il numero dell\'uscita è riportato sul segnale per facilitarne l\'identificazione. Il conducente deve posizionarsi in anticipo nella corsia di destra per effettuare l\'uscita in sicurezza.',
        whenToObeyIt:
          'Appena il segnale è visibile, iniziare a posizionarsi nella corsia di destra.',
        whatHappensIfIgnored:
          'Rischio di perdere l\'uscita, manovre pericolose di ultima istante e possibile collisione.',
      },
      {
        id: 'scambio-autostrada',
        name: 'Biforcazione/scambio autostradale',
        shape: 'Rettangolo verde con frecce direzionali multiple e nomi delle destinazioni',
        description:
          'Indica un bivio o uno svincolo autostradale dove il conducente deve scegliere la direzione corretta. Ogni freccia indica una destinazione diversa con il relativo nome. Il conducente deve scegliere in anticipo la corsia corrispondente alla propria destinazione.',
        whenToObeyIt:
          'Appena il segnale è visibile, posizionarsi nella corsia della destinazione desiderata.',
        whatHappensIfIgnored:
          'Rischio di prendere la direzione sbagliata con conseguente perdita di tempo e percorrenza di chilometri extra.',
      },
      {
        id: 'stazione-fs',
        name: 'Stazione ferroviaria',
        shape: 'Rettangolo blu con simbolo di treno',
        description:
          'Indica la presenza di una stazione ferroviaria nelle vicinanze. Utile per chi cerca collegamenti con il trasporto su rotaia. Il segnale può essere associato a pannelli che indicano la distanza in chilometri.',
        whenToObeyIt: 'Informativo, per orientarsi verso la stazione ferroviaria.',
        whatHappensIfIgnored: 'Non applicabile — è un segnale puramente informativo.',
      },
      {
        id: 'aeroporto-indicazione',
        name: 'Aeroporto',
        shape: 'Rettangolo blu con simbolo di aeroplano',
        description:
          'Indica la direzione per raggiungere l\'aeroporto più vicino. Il segnale può essere accompagnato dal nome dell\'aeroporto e dalla distanza. Generalmente posizionato sulle strade di collegamento principali.',
        whenToObeyIt: 'Informativo, seguire le indicazioni per raggiungere l\'aeroporto.',
        whatHappensIfIgnored: 'Non applicabile — è un segnale puramente informativo.',
      },
      {
        id: 'distributore',
        name: 'Distributore di carburante',
        shape: 'Rettangolo blu con simbolo di benzinaio o erogatore',
        description:
          'Indica la presenza di un distributore di carburante nelle vicinanze. Utile per pianificare il rifornimento durante lunghi tragitti. Il distributore può servire benzina, diesel, GPL o metano.',
        whenToObeyIt: 'Informativo, utile per pianificare il rifornimento di carburante.',
        whatHappensIfIgnored: 'Non applicabile — è un segnale puramente informativo.',
      },
      {
        id: 'ristorante-indicazione',
        name: 'Ristorante/area di ristoro',
        shape: 'Rettangolo blu con simbolo di forchetta e coltello o piatto',
        description:
          'Indica la presenza di un\'area di ristoro, ristorante o autogrill nelle vicinanze. Comune sulle autostrade e sulle strade extraurbane principali. Possono essere indicate le distanze e i servizi disponibili.',
        whenToObeyIt: 'Informativo, per trovare un punto di ristoro durante il viaggio.',
        whatHappensIfIgnored: 'Non applicabile — è un segnale puramente informativo.',
      },
      {
        id: 'albergo',
        name: 'Albergo/dormitorio',
        shape: 'Rettangolo blu con simbolo di letto o edificio',
        description:
          'Indica la presenza di un albergo, hotel o struttura ricettiva nelle vicinanze. Utilizzato come segnale di servizio per i conducenti in viaggio che cercano alloggio. Il segnale può indicare la distanza alla struttura.',
        whenToObeyIt: 'Informativo, per trovare alloggio nella zona.',
        whatHappensIfIgnored: 'Non applicabile — è un segnale puramente informativo.',
      },
      {
        id: 'taxi-stand',
        name: 'Posteggio taxi',
        shape: 'Rettangolo blu con simbolo di taxi (TAXI)',
        description:
          'Indica l\'area di sosta riservata ai taxi in attesa di clienti. I taxi possono fermarsi in questa area per attendere chiamate o passeggeri. Vietata la sosta ad altri veicoli nello spazio riservato ai taxi.',
        whenToObeyIt: 'Riservato ai taxi. Gli altri veicoli non devono sostare in quest\'area.',
        whatHappensIfIgnored:
          'Multa per sosta non autorizzata in area riservata ai taxi e possibile rimozione del veicolo.',
      },
      {
        id: 'fermata-tram',
        name: 'Fermata del tram',
        shape: 'Rettangolo blu con simbolo di tram',
        description:
          'Indica la posizione di una fermata del tram. I pedoni possono salire e scendere dal tram in questo punto. I conducenti devono prestare attenzione ai pedoni che attraversano per raggiungere la fermata e non sostare negli spazi riservati.',
        whenToObeyIt: 'Informativo per i pedoni. I conducenti devono prestare attenzione.',
        whatHappensIfIgnored: 'Non applicabile — è un segnale informativo. Attenzione alla fermata.',
      },
      {
        id: 'soccorso-stradale',
        name: 'Soccorso stradale',
        shape: 'Rettangolo blu con simbolo di croce o chiave inglese',
        description:
          'Indica la presenza di un servizio di soccorso stradale o di un\'officina meccanica nelle vicinanze. Utile in caso di guasto o incidente. Il servizio può fornire assistenza, traino o riparazioni sul posto.',
        whenToObeyIt: 'Informativo, utile in caso di guasto o emergenza stradale.',
        whatHappensIfIgnored: 'Non applicabile — è un segnale puramente informativo.',
      },
      {
        id: 'telefono-emergenza',
        name: 'Telefono di emergenza (SOS)',
        shape: 'Rettangolo blu con simbolo di telefono e scritta SOS',
        description:
          'Indica la presenza di un colonnina di emergenza SOS o di un telefono per chiamare i soccorsi. Disponibile sulle autostrade e su alcune strade extraurbane. Permette di contattare direttamente la polizia stradale, i vigili del fuoco o il pronto soccorso.',
        whenToObeyIt: 'Informativo, da utilizzare in caso di emergenza, guasto o incidente.',
        whatHappensIfIgnored: 'Non applicabile — è un segnale informativo salvavita.',
      },
      {
        id: 'passaggio-sotto-livello',
        name: 'Passaggio a livello sottostrada',
        shape: 'Rettangolo blu con simbolo di strada che passa sotto i binari',
        description:
          'Indica la presenza di un passaggio a livello sottostrada, ovvero una strada che attraversa i binari ferroviari passando sotto di essi tramite un sottopasso. Non è necessario fermarsi in quanto non c\'è intersezione con i binari alla stessa quota.',
        whenToObeyIt: 'Informativo, il conducente può procedere senza fermarsi.',
        whatHappensIfIgnored: 'Non applicabile — è un segnale informativo che indica la tipologia dell\'infrastruttura.',
      },
      {
        id: 'strada-riservata',
        name: 'Strada riservata (solo bus/taxi)',
        shape: 'Rettangolo blu con simbolo di bus o taxi',
        description:
          'Indica una strada o una corsia riservata esclusivamente ai mezzi di trasporto pubblico (bus, tram, taxi). I veicoli privati non possono transitare su questa strada. Il divieto è segnalato anche da appositi segnali di divieto. L\'accesso è consentito solo ai veicoli autorizzati.',
        whenToObeyIt: 'I veicoli non autorizzati non devono accedere alla strada riservata.',
        whatHappensIfIgnored:
          'Multa da 80 a 328 euro e decurtazione di 2 punti dalla patente. Telecamere spesso posizionate per il controllo.',
      },
      {
        id: 'pista-ciclabile-indicazione',
        name: 'Pista ciclabile di indicazione',
        shape: 'Rettangolo blu con simbolo di bicicletta',
        description:
          'Indica la presenza di una pista ciclabile nelle vicinanze. A differenza del segnale di obbligo (cerchio blu), questo segnale di indicazione informa i ciclisti dell\'esistenza di un percorso ciclabile consigliato. I ciclisti non sono obbligati a utilizzarlo.',
        whenToObeyIt: 'Informativo per i ciclisti, indica un percorso ciclabile disponibile.',
        whatHappensIfIgnored: 'Non applicabile — è un segnale informativo, non prescrittivo.',
      },
      {
        id: 'sens-unico',
        name: 'Senso unico di circolazione',
        shape: 'Rettangolo blu con freccia bianca',
        description:
          'Indica una strada a senso unico: tutti i veicoli devono procedere nella direzione indicata dalla freccia. Il conducente non può circolare nel verso opposto. Il segnale è rettangolare (non rotondo come gli altri segnali di obbligo) ed è posizionato all\'inizio della strada a senso unico.',
        whenToObeyIt: 'All\'inizio della strada a senso unico.',
        whatHappensIfIgnored:
          'Circolare nel verso opposto = multa grave e rischio di incidente frontale.',
      },
      {
        id: 'strada-pericolosa',
        name: 'Strada pericolosa (preavviso)',
        shape: 'Rettangolo bianco con bordo rosso e simbolo di pericolo',
        description:
          'Segnale di preavviso che indica un tratto di strada particolarmente pericoloso. Il conducente deve ridurre la velocità e prestare la massima attenzione. Questo segnale è tipicamente utilizzato in zone montane o in presenza di tratti stradali con rischi specifici come frane, smottamenti o strade strette.',
        whenToObeyIt:
          'All\'ingresso del tratto stradale pericoloso, mantenendo la massima prudenza.',
        whatHappensIfIgnored:
          'Rischio di incidenti dovuti alle condizioni pericolose della strada non previste.',
      },
    
      {
        id: 'curva-gomito-destra',
        name: 'Curva a gomito a destra',
        shape: 'Triangolo con freccia che forma un angolo retto a destra',
        description:
          'Indica la presenza di una curva molto stretta a gomito verso destra, con un cambio di direzione brusco di circa 90 gradi. Il conducente deve ridurre notevolmente la velocità prima della curva e mantenere la posizione corretta sulla carreggiata.',
        whenToObeyIt:
          'Appena il segnale diventa visibile, rallentare prima della curva per mantenere il controllo del veicolo.',
        whatHappensIfIgnored:
          'Rischio di sbandare, urtare il guardrail o uscire di strada con il rischio di collisione frontale o laterale.',
      },

      {
        id: 'curva-gomito-sinistra',
        name: 'Curva a gomito a sinistra',
        shape: 'Triangolo con freccia che forma un angolo retto a sinistra',
        description:
          'Indica la presenza di una curva molto stretta a gomito verso sinistra, con un cambio di direzione brusco di circa 90 gradi. Il conducente deve ridurre notevolmente la velocità prima della curva e tenersi il più possibile a destra nella propria corsia.',
        whenToObeyIt:
          'Appena il segnale diventa visibile, rallentare in anticipo prima di raggiungere la curva.',
        whatHappensIfIgnored:
          'Rischio di uscire di strada, invadere la corsia opposta o perdere il controllo del veicolo con possibili collisioni gravi.',
      },

      {
        id: 'curve-ad-s',
        name: 'Curve a S',
        shape: 'Triangolo con due frecce curve che formano una S',
        description:
          'Indica la presenza di una successione di curve alternate (destra-sinistra o sinistra-destra) ravvicinate, simili alla forma della lettera S. Richiede grande prudenza, velocità ridotta e mantenimento costante della propria corsia senza tagliare le curve.',
        whenToObeyIt:
          'Appena il segnale diventa visibile, prima di imboccare la prima curva della successione.',
        whatHappensIfIgnored:
          'Rischio di perdere il controllo del veicolo sulle curve alternate, specialmente in condizioni di manto stradale bagnato o con visibilità ridotta.',
      },

      {
        id: 'deposito-materiale',
        name: 'Deposito di materiale',
        shape: 'Triangolo con simbolo di pietre o materiale accatastato',
        description:
          'Indica la possibile presenza di materiale depositato ai bordi della carreggiata o sulla strada. Il conducente deve ridurre la velocità e prestare attenzione al possibile restringimento della carreggiata o alla presenza di detriti sparsi sulla via.',
        whenToObeyIt:
          'Su tutto il tratto segnalato, mantenendo la velocità ridotta e la massima attenzione.',
        whatHappensIfIgnored:
          'Rischio di collisione con il materiale depositato, danni al veicolo, perdita di controllo o blocco della circolazione.',
      },

      {
        id: 'incrocio-tram',
        name: 'Incrocio con tram',
        shape: 'Triangolo con simbolo di tram e frecce di incrocio',
        description:
          'Indica un incrocio dove i binari del tram attraversano la carreggiata. Il conducente deve prestare massima attenzione ai tram in transito, dare loro la precedenza quando necessario e non fermarsi sui binari in nessun caso.',
        whenToObeyIt:
          'Avvicinandosi all\'incrocio, verificare in tutte le direzioni la presenza di tram.',
        whatHappensIfIgnored:
          'Rischio di collisione con il tram che, data la sua massa, può causare danni enormi al veicolo e pericolo grave per gli occupanti.',
      },

      {
        id: 'muro-costone',
        name: 'Muro o costone laterale',
        shape: 'Triangolo con profilo di muro o parete verticale',
        description:
          'Indica la presenza di un muro, di un costone roccioso o di una parete verticale a ridosso della carreggiata. Il conducente deve mantenere la distanza di sicurezza dal bordo e non uscire dalla carreggiata. Particolare attenzione per i veicoli alti o con carico sporgente.',
        whenToObeyIt:
          'Su tutto il tratto segnalato, mantenendo la corsia e la distanza di sicurezza laterale.',
        whatHappensIfIgnored:
          'Rischio di urto contro il muro o il costone, con danni al veicolo, possibili lesioni per gli occupanti e blocco della strada.',
      },

      {
        id: 'neve-ghiaccio',
        name: 'Neve o ghiaccio',
        shape: 'Triangolo con fiocco di neve',
        description:
          'Possibilità di neve o ghiaccio sulla strada. È possibile che sia obbligatorio montare catene o pneumatici invernali. Ridurre la velocità in modo significativo.',
        whenToObeyIt:
          'Appena visibile, prepararsi con catene o pneumatici invernali.',
        whatHappensIfIgnored:
          'Perdita di controllo, sbandata, incidente multiplo.',
      },

      {
        id: 'ponte-stretto',
        name: 'Ponte stretto',
        shape: 'Triangolo con simbolo di ponte con restringimento laterale',
        description:
          'Indica la presenza di un ponte con carreggiata più stretta rispetto alla strada ordinaria. Il conducente deve ridurre la velocità prima di immettersi sul ponte. Se il ponte non consente il passaggio simultaneo di due veicoli, si applica la precedenza dal diritto diresso.',
        whenToObeyIt:
          'Prima di immettersi sul ponte, verificando le dimensioni del proprio veicolo e la larghezza del ponte.',
        whatHappensIfIgnored:
          'Rischio di collisione con veicoli provenienti dalla direzione opposta, danni al veicolo contro le balaustre del ponte o caduta nel vuoto.',
      },

      {
        id: 'slittamento',
        name: 'Slittamento',
        shape: 'Triangolo con simbolo di veicolo che slitta lateralmente',
        description:
          'Indica un tratto di strada particolarmente soggetto a slittamento dei veicoli, spesso a causa di asfalto liscio, fango, foglie umide o sudiciume sulla carreggiata. Il conducente deve procedere a velocità molto ridotta, evitando brusche frenate, accelerate o sterzate.',
        whenToObeyIt:
          'Su tutto il tratto segnalato, con attenzione particolarmente elevata in caso di pioggia o umidità.',
        whatHappensIfIgnored:
          'Perdita di aderenza del veicolo con sbandata laterale, uscita di strada, testacoda o capottamento.',
      },

      {
        id: 'traffico-convergente',
        name: 'Traffico convergente',
        shape: 'Triangolo con frecce che convergono verso il centro',
        description:
          'Indica che due o più corsie si uniscono in un\'unica carreggiata, costringendo i veicoli a fondersi. Il conducente deve adattare la velocità e alternarsi con cortesia con gli altri veicoli, rispettando la regola della cremagliera.',
        whenToObeyIt:
          'Avvicinandosi al punto di convergenza, riducendo la velocità e inserendosi nel traffico con prudenza.',
        whatHappensIfIgnored:
          'Rischio di collisione laterale con i veicoli che confluiscono, code pericolose e situazioni di blocco del traffico.',
      },

      {
        id: 'fine-zona-30',
        name: 'Fine zona 30',
        shape: 'Rettangolo bianco con bordo grigio e scritta "FINE ZONA 30" barrata',
        description:
          'Indica la fine della zona a traffico limitato a 30 km/h. Da questo punto in poi si applicano i limiti di velocità generali previsti dal Codice della Strada per il tipo di strada che si sta percorrendo.',
        whenToObeyIt:
          'Appena superato il segnale, riprendere la velocità consentita per il tipo di strada (es. 50 km/h in centro abitato).',
        whatHappensIfIgnored:
          'Non applicabile — è un segnale che conclude una prescrizione e ripristina i limiti generali.',
      },

      {
        id: 'zona-30',
        name: 'Zona 30 (limite 30 km/h)',
        shape: 'Rettangolo bianco con bordo rosso e scritta "ZONA 30"',
        description:
          'Indica l\'inizio di una zona a traffico limitato dove la velocità massima consentita è di 30 km/h per tutti i veicoli. Tipicamente istituita in centri storici, zone scolastiche o aree residenziali per proteggere pedoni e ciclisti.',
        whenToObeyIt:
          'Da quando si entra nella zona 30 fino al segnale di fine zona 30. Il limite si applica a tutta la zona, non solo alla strada dove è esposto il segnale.',
        whatHappensIfIgnored:
          'Multa proporzionale all\'eccesso di velocità. In zona 30, anche piccoli eccessi sono pericolosi per pedoni e ciclisti.',
      },

      {
        id: 'ztl',
        name: 'Zona a traffico limitato (ZTL)',
        shape: 'Cerchio bianco con bordo rosso e scritta ZTL',
        description:
          'Accesso limitato a determinati orari o categorie di veicoli. Spesso controllata da telecamere. I residenti e autorizzati hanno accesso con permesso.',
        whenToObeyIt:
          'Verificare sempre gli orari di attivazione e la categoria del proprio veicolo.',
        whatHappensIfIgnored:
          'Multa automatica (circa 80-100 euro). Le telecamere registrano la targa.',
      },

      {
        id: 'fermata-obbligatoria',
        name: 'Fermata obbligatoria davanti al passaggio a livello',
        shape: 'Rettangolo con bordo rosso e scritta FERMATA OBBLIGATORIA',
        description:
          'Obbliga il conducente a fermarsi completamente davanti al passaggio a livello, anche in assenza di barriere chiuse o segnale di stop. Il conducente deve verificare visivamente e uditivamente l\'assenza di treni prima di attraversare i binari. Non sostare mai sui binari.',
        whenToObeyIt:
          'Sempre quando ci si avvicina al passaggio a livello, fermarsi completamente prima dei binari.',
        whatHappensIfIgnored:
          'Multa molto severa e rischio gravissimo di collisione con un treno, con conseguenze quasi sempre letali.',
      },

      {
        id: 'precedenza-strada-stretta',
        name: 'Precedenza nel tratto stretto (veicolo opposto)',
        shape: 'Rettangolo con frecce che indicano la direzione del veicolo prioritario',
        description:
          'Stabilisce quale direzione ha la precedenza in un tratto di strada troppo stretto per consentire il passaggio contemporaneo di veicoli provenienti da entrambe le direzioni. Il segnale indica con una freccia più grande la direzione che deve passare per prima. Il conducente dalla direzione non prioritaria deve fermarsi e attendere.',
        whenToObeyIt:
          'Avvicinandosi al tratto stretto, se la freccia grande indica la direzione opposta.',
        whatHappensIfIgnored:
          'Multa e rischio di incastro con veicoli provenienti dalla direzione opposta, con possibile necessità di manovre di retromarcia pericolose.',
      },
      {
        id: 'divieto-accesso-categorie',
        name: 'Divieto di accesso per determinate categorie di veicoli',
        shape: 'Rettangolo blu con simboli di categorie di veicoli barrati',
        description:
          'Indica che l\'accesso alla strada e vietato per le categorie di veicoli rappresentate nel segnale (motocicli, biciclette, veicoli elettrici, ecc.). Il divieto si applica solo alle categorie mostrate nel pannello. Le altre categorie di veicoli possono transitare liberamente.',
        whenToObeyIt:
          'All\'ingresso della strada, verificare se la propria categoria di veicolo e tra quelle escluse.',
        whatHappensIfIgnored:
          'Multa per le categorie di veicoli non ammesse. Possibile ritiro punti dalla patente.',
      },
      {
        id: 'fine-percorso-animali',
        name: 'Fine del percorso per animali da soma o da sella',
        shape: 'Rettangolo blu con simbolo di cavallo barrato',
        description:
          'Indica la fine del percorso riservato al transito di animali da soma o da sella (cavalli, asini, muli). Da questo punto gli animali non hanno piu un percorso dedicato e i cavalieri devono immettersi sulla carreggiata con le dovute cautele, rispettando le regole del Codice della Strada.',
        whenToObeyIt:
          'In corrispondenza del segnale, riprendere la circolazione sulla carreggiata secondo le regole generali.',
        whatHappensIfIgnored:
          'Non applicabile: conclude il percorso riservato agli animali.',
      },
      {
        id: 'varco-doganale',
        name: 'Varco doganale',
        shape: 'Rettangolo blu con confini nazionali e scritta DOGANA',
        description:
          'Indica la presenza di un varco doganale alla frontiera tra due Stati. Il conducente e obbligato ad arrestarsi per il controllo doganale delle merci e dei documenti. Il mancato arresto costituisce violazione delle leggi doganali. Il segnale e posto prima del confine di Stato su strade internazionali.',
        whenToObeyIt:
          'Arrestarsi obbligatoriamente al varco doganale per il controllo documentale e merceologico.',
        whatHappensIfIgnored:
          'Sanzioni penali e amministrative molto gravi per il mancato arresto al varco doganale.',
      },
      {
        id: 'posto-blocco',
        name: 'Posto di blocco stradale',
        shape: 'Rettangolo blu con scritta e simbolo di forza dell\'ordine',
        description:
          'Indica la presenza di un posto di blocco stradale istituito dalle forze dell\'ordine (Polizia, Carabinieri, Polizia Stradale). Il conducente e obbligato ad arrestarsi e sottoporsi al controllo. I posti di blocco sono istituiti per la sicurezza pubblica e il controllo del territorio. Il mancato arresto e un reato.',
        whenToObeyIt:
          'Arrestarsi obbligatoriamente al posto di blocco e seguire le indicazioni delle forze dell\'ordine.',
        whatHappensIfIgnored:
          'Reato di resistenza e oltraggio a pubblico ufficiale. Conseguenze penali gravissime.',
      },
      {
        id: 'semaforo-veicolare',
        name: 'Semaforo veicolare',
        shape: 'Semaforo con tre luci (rossa, gialla, verde) disposte in verticale',
        description:
          'Regola la circolazione dei veicoli mediante tre luci colorate. La luce rossa impone l\'arresto completo. La luce gialla invita ad arrestarsi se possibile o a liberare l\'incrocio. La luce verde consente il passaggio. Le luci sono disposte in verticale: rosso in alto, giallo al centro, verde in basso.',
        whenToObeyIt:
          'Sempre, rispettando il colore della luce accesa: fermarsi al rosso, procedere al verde.',
        whatHappensIfIgnored:
          'Multa da 163 a 652 euro e decurtazione di 6 punti per il passaggio con luce rossa.',
      },
      {
        id: 'semaforo-frecce',
        name: 'Semaforo con frecce direzionali',
        shape: 'Semaforo con luci a forma di freccia direzionale',
        description:
          'Semaforo che regola la circolazione nelle diverse direzioni mediante frecce luminose. Le frecce verdi accese indicano le direzioni in cui e consentito proseguire. Le frecce rosse indicano le direzioni vietate. Le frecce gialle fisse indicano di liberare l\'intersezione.',
        whenToObeyIt:
          'Rispettare le frecce luminose: procedere solo nelle direzioni indicate dalla freccia verde.',
        whatHappensIfIgnored:
          'Multa e punti per il passaggio nella direzione indicata dalla freccia rossa.',
      },
      {
        id: 'semaforo-trasporto-pubblico',
        name: 'Semaforo per mezzi di trasporto pubblico',
        shape: 'Semaforo con luce bianca orizzontale o verticale',
        description:
          'Semaforo riservato ai veicoli del trasporto pubblico (autobus, tram). La luce bianca accesa autorizza il passaggio ai mezzi pubblici. Gli altri veicoli devono ignorare questo semaforo e seguire la normale segnaletica.',
        whenToObeyIt:
          'Solo per i conducenti di mezzi di trasporto pubblico. Gli altri veicoli non devono considerarli.',
        whatHappensIfIgnored:
          'Non applicabile agli altri veicoli. Per i conducenti di mezzi pubblici, sanzioni in caso di violazione.',
      },
      {
        id: 'semaforo-pedonale',
        name: 'Semaforo pedonale',
        shape: 'Semaforo con luci verde e rossa per pedoni',
        description:
          'Regola l\'attraversamento pedonale delle strade. La luce verde consente ai pedoni di attraversare. La luce rossa vieta l\'attraversamento. Spesso e associato a un segnale acustico per i non vedenti. I pedoni devono comunque verificare con attenzione prima di attraversare.',
        whenToObeyIt:
          'I pedoni devono rispettare le luci: attraversare solo con luce verde.',
        whatHappensIfIgnored:
          'Multa per il pedone che attraversa con luce rossa. Rischio di investimento.',
      },
      {
        id: 'semaforo-ciclisti',
        name: 'Semaforo per ciclisti',
        shape: 'Semaforo con simbolo di bicicletta e luci colorate',
        description:
          'Semaforo riservato ai ciclisti, posto all\'uscita di piste ciclabili o in corrispondenza di attraversamenti ciclabili. La luce rossa impone l\'arresto ai ciclisti. La luce verde consente il passaggio. Gli altri veicoli non devono tenere conto di questo semaforo.',
        whenToObeyIt:
          'Solo per i ciclisti: fermarsi al rosso, procedere al verde.',
        whatHappensIfIgnored:
          'Multa per il ciclista che non rispetta il semaforo. Rischio di incidente con veicoli a motore.',
      },
      {
        id: 'semaforo-corsie-reversibili',
        name: 'Semaforo per corsie reversibili',
        shape: 'Semaforo con luci a forma di X e freccia verde',
        description:
          'Regola l\'uso delle corsie reversibili, che possono cambiare direzione di percorrenza. La luce verde a forma di freccia indica che la corsia puo essere utilizzata nella direzione indicata. La luce rossa a forma di X indica che la corsia e chiusa e non deve essere occupata.',
        whenToObeyIt:
          'Rispettare le luci: occupare la corsia solo con freccia verde, non occuparla con X rossa.',
        whatHappensIfIgnored:
          'Rischio di circolare in senso contrario con conseguenze gravissime. Multa e punti.',
      },
      {
        id: 'semaforo-giallo-lampeggiante',
        name: 'Semaforo a luce gialla lampeggiante',
        shape: 'Semaforo con unica luce gialla lampeggiante',
        description:
          'Il lampeggio giallo indica un segnale di pericolo generico. Invita i conducenti a moderare la velocita e a procedere con particolare prudenza. Non impone l\'arresto ma richiede massima attenzione. E usato in corrispondenza di incroci pericolosi, cantieri stradali o tratti con visibilita ridotta.',
        whenToObeyIt:
          'Ridurre la velocita e procedere con estrema cautela nel tratto segnalato.',
        whatHappensIfIgnored:
          'Rischio di incidente per eccesso di velocita in un tratto pericoloso.',
      },
      {
        id: 'semaforo-onda-verde',
        name: 'Semaforo a onda verde',
        shape: 'Semaforo con frecce verdi e indicazione della velocita consigliata',
        description:
          'Indica la velocita consigliata da mantenere per trovare la luce verde ai semafori successivi. E usato su strade urbane con piu incroci distanziati, dove la sincronizzazione dei semafori (onda verde) permette di percorrere il tratto senza fermate.',
        whenToObeyIt:
          'Mantenere la velocita consigliata, se possibile, per ottimizzare il percorso senza fermate.',
        whatHappensIfIgnored:
          'Non rispettare la velocita consigliata comporta fermate ai semafori successivi, ma non sanzioni.',
      },
      {
        id: 'preavviso-confine-ue',
        name: 'Preavviso di confine di Stato (Unione Europea)',
        shape: 'Rettangolo blu con simboli dell\'Unione Europea',
        description:
          'Preannuncia l\'avvicinamento al confine di Stato con un Paese membro dell\'Unione Europea. Le formalita doganali sono semplificate tra Paesi UE. Il conducente deve comunque essere in possesso di tutti i documenti necessari.',
        whenToObeyIt:
          'Informativo: prepararsi al passaggio del confine nazionale.',
        whatHappensIfIgnored:
          'Non applicabile: e un segnale puramente informativo.',
      },
      {
        id: 'preavviso-incrocio-urbano',
        name: 'Preavviso di incrocio urbano',
        shape: 'Rettangolo blu con nomi delle localita e frecce direzionali',
        description:
          'Preannuncia la presenza di un incrocio urbano con le indicazioni delle direzioni possibili e i nomi delle localita raggiungibili. Il conducente deve ridurre la velocita e posizionarsi nella corsia corretta in base alla propria destinazione.',
        whenToObeyIt:
          'Avvicinandosi all\'incrocio, posizionarsi nella corsia della propria destinazione.',
        whatHappensIfIgnored:
          'Rischio di prendere la direzione sbagliata o effettuare manovre pericolose dell\'ultimo momento.',
      },
      {
        id: 'preavviso-due-incroci',
        name: 'Preavviso di due incroci vicini',
        shape: 'Rettangolo blu con frecce e nomi di due incroci successivi',
        description:
          'Preannuncia la presenza di due incroci ravvicinati. Il segnale mostra le destinazioni raggiungibili al primo e al secondo incrocio, aiutando il conducente a posizionarsi nella corsia corretta fin dal primo incrocio.',
        whenToObeyIt:
          'Posizionarsi nella corsia corretta in anticipo, considerando entrambi gli incroci.',
        whatHappensIfIgnored:
          'Rischio di manovre pericolose se si cambia corsia tra i due incroci.',
      },
      {
        id: 'preavviso-incrocio-rotatoria',
        name: 'Preavviso di incrocio con rotatoria',
        shape: 'Rettangolo blu con simbolo di rotatoria e frecce direzionali',
        description:
          'Preannuncia un incrocio con rotatoria. Il conducente deve prepararsi a entrare nella rotatoria, dando la precedenza ai veicoli gia circolanti al suo interno. Le frecce indicano le direzioni disponibili nella rotatoria.',
        whenToObeyIt:
          'Ridurre la velocita e prepararsi a entrare nella rotatoria con la dovuta cautela.',
        whatHappensIfIgnored:
          'Rischio di collisione all\'ingresso della rotatoria per mancato rispetto della precedenza.',
      },
      {
        id: 'preavviso-incrocio-extraurbano',
        name: 'Preavviso di incrocio extraurbano',
        shape: 'Rettangolo blu con frecce direzionali e nome della localita',
        description:
          'Preannuncia la presenza di un incrocio su strada extraurbana, con indicazione delle direzioni disponibili e dei nomi delle localita raggiungibili. Il conducente deve ridurre la velocita, essendo le velocita piu elevate sulle strade extraurbane.',
        whenToObeyIt:
          'Ridurre la velocita e posizionarsi nella corsia corretta prima dell\'incrocio.',
        whatHappensIfIgnored:
          'Rischio di attraversamento pericoloso dell\'incrocio a velocita eccessiva.',
      },
      {
        id: 'inizio-strada-extraurbana',
        name: 'Inizio strada extraurbana principale',
        shape: 'Rettangolo blu con simbolo di strada extraurbana principale',
        description:
          'Indica l\'inizio di una strada extraurbana principale. Su queste strade si applicano limiti di velocita specifici (massimo 110 km/h). Il segnale e posto all\'inizio del tratto classificato come strada extraurbana principale secondo il Codice della Strada.',
        whenToObeyIt:
          'All\'inizio della strada extraurbana principale, rispettare i limiti di velocita previsti.',
        whatHappensIfIgnored:
          'Multa per eccesso di velocita rispetto al limite specifico della strada extraurbana.',
      },
      {
        id: 'strada-comunale',
        name: 'Identificazione di strada comunale',
        shape: 'Rettangolo bianco con sigla SC e nome della strada',
        description:
          'Identifica una strada di competenza comunale. La sigla SC (Strada Comunale) indica che la manutenzione e la gestione della strada sono a carico del Comune. Il segnale e posto all\'inizio della strada comunale e alle intersezioni principali.',
        whenToObeyIt:
          'Informativo, per identificare il tipo di strada e l\'ente responsabile.',
        whatHappensIfIgnored:
          'Non applicabile: e un segnale puramente informativo e identificativo.',
      },
      {
        id: 'nome-fiume',
        name: 'Nome del fiume',
        shape: 'Rettangolo bianco con il nome del fiume',
        description:
          'Indica il nome del fiume che attraversa la strada o che scorre nelle vicinanze. Il segnale e tipicamente posto in corrispondenza di ponti o passaggi a livello sui fiumi. E un segnale puramente informativo che aiuta l\'orientamento geografico.',
        whenToObeyIt:
          'Informativo, per orientarsi e identificare il corso d\'acqua attraversato.',
        whatHappensIfIgnored:
          'Non applicabile: e un segnale puramente informativo.',
      },
      {
        id: 'cavalcavia',
        name: 'Cavalcavia o sottopassaggio per inversione di marcia',
        shape: 'Rettangolo con simbolo di ponte e freccia di inversione',
        description:
          'Indica la presenza di un cavalcavia o di un sottopassaggio che consente di invertire il senso di marcia. E posto su strade a carreggiate separate (autostrade, tangenziali) dove l\'inversione diretta non e possibile. Il conducente deve uscire e utilizzare l\'infrastruttura indicata.',
        whenToObeyIt:
          'All\'avvicinarsi dell\'uscita, seguire le indicazioni per raggiungere il cavalcavia o sottopassaggio.',
        whatHappensIfIgnored:
          'Non utilizzare le corsie di accelerazione o decelerazione per invertire il senso di marcia.',
      },
      {
        id: 'corsie-riservate',
        name: 'Corsie riservate per categoria di veicoli',
        shape: 'Rettangolo con simboli di veicoli diversi su corsie separate',
        description:
          'Indica come devono essere utilizzate le diverse corsie della carreggiata. Ogni corsia e riservata a una specifica categoria di veicoli (autobus, autovetture, ecc.). Il conducente deve utilizzare solo la corsia destinata alla propria categoria.',
        whenToObeyIt:
          'Posizionarsi nella corsia corretta per la propria categoria di veicolo fin dall\'avvicinamento.',
        whatHappensIfIgnored:
          'Multa per circolazione nella corsia riservata a un\'altra categoria di veicoli.',
      },
      {
        id: 'cambiamento-corsie',
        name: 'Cambiamento del numero di corsie',
        shape: 'Rettangolo con frecce che mostrano aumento o diminuzione di corsie',
        description:
          'Indica un cambiamento del numero di corsie disponibili sulla carreggiata. Puo indicare un aumento o una diminuzione del numero di corsie. Il conducente deve adattare la propria posizione e velocita in base alla nuova configurazione.',
        whenToObeyIt:
          'Avvicinandosi al punto di cambiamento, posizionarsi nella corsia corretta.',
        whatHappensIfIgnored:
          'Rischio di collisione laterale durante la riduzione del numero di corsie.',
      },
      {
        id: 'officina-meccanica',
        name: 'Officina meccanica per veicoli',
        shape: 'Rettangolo blu con simbolo di chiave inglese',
        description:
          'Indica la presenza di un\'officina meccanica per la riparazione di veicoli nelle vicinanze. Utile in caso di guasto o avaria durante il viaggio.',
        whenToObeyIt:
          'Informativo, utile in caso di guasto o necessita di assistenza meccanica.',
        whatHappensIfIgnored:
          'Non applicabile: e un segnale puramente informativo.',
      },
      {
        id: 'cono-lavoro',
        name: 'Cono da lavoro (segnaletica mobile)',
        shape: 'Cono retroriflettente arancione',
        description:
          'Il cono da lavoro e un dispositivo di segnaletica mobile utilizzato per delimitare provvisoriamente zone di lavoro, deviazioni o ostacoli sulla carreggiata. E retroriflettente per essere visibile anche di notte. Puo essere utilizzato singolarmente o in serie per creare corridoi di sicurezza.',
        whenToObeyIt:
          'Rispettare sempre la delimitazione segnalata dai coni e mantenere la distanza di sicurezza.',
        whatHappensIfIgnored:
          'Rischio di incidente se si attraversa l\'area delimitata dai coni.',
      },
      {
        id: 'segnale-veicolo-lavori',
        name: 'Segnale su veicolo per lavori stradali',
        shape: 'Pannello giallo con freccia retroriflettente',
        description:
          'Segnale applicato su veicoli fermi o in lento movimento per lavori stradali. Indica il lato dal quale il veicolo deve essere sorpassato. La freccia direzionale e retroriflettente per la visibilita notturna. E obbligatorio sui veicoli di manutenzione stradale.',
        whenToObeyIt:
          'Sorpassare il veicolo lavori dal lato indicato dalla freccia, mantenendo una distanza di sicurezza.',
        whatHappensIfIgnored:
          'Rischio di collisione con il veicolo lavori o con gli operai che lavorano nelle vicinanze.',
      },
      {
        id: 'cantiere-mobile',
        name: 'Cantiere mobile con restringimento',
        shape: 'Pannello con simbolo di restringimento e veicolo cantiere',
        description:
          'Indica la presenza di un cantiere mobile con restringimento della carreggiata. Il cantiere mobile si sposta lungo la strada durante i lavori. Il conducente deve prestare attenzione ai movimenti del cantiere e agli operai presenti.',
        whenToObeyIt:
          'Ridurre la velocita e prestare attenzione al cantiere mobile e agli operai.',
        whatHappensIfIgnored:
          'Rischio di incidente con il cantiere mobile o gli operai. Multa per eccesso di velocita in zona cantiere.',
      },
      {
        id: 'preavviso-deviazione',
        name: 'Preavviso di deviazione temporanea',
        shape: 'Rettangolo con freccia di deviazione e indicazione della distanza',
        description:
          'Preannuncia una deviazione temporanea della normale traiettoria stradale, generalmente per lavori in corso. Il segnale indica la direzione della deviazione e la distanza. Il conducente deve seguire le indicazioni per il percorso alternativo.',
        whenToObeyIt:
          'Seguire le indicazioni di deviazione e posizionarsi nella corsia corretta.',
        whatHappensIfIgnored:
          'Rischio di smarrimento o immissione su tratti stradali non adatti al proprio veicolo.',
      },
      {
        id: 'chiusura-corsia',
        name: 'Chiusura di corsia per lavori',
        shape: 'Rettangolo con rappresentazione delle corsie e freccia di riduzione',
        description:
          'Indica la chiusura di una corsia per lavori in corso, con conseguente riduzione del numero di corsie disponibili. Il conducente deve posizionarsi in anticipo nella corsia rimasta aperta e non tentare di utilizzare la corsia chiusa.',
        whenToObeyIt:
          'Posizionarsi nella corsia aperta in anticipo, prima del punto di chiusura effettivo.',
        whatHappensIfIgnored:
          'Rischio di collisione con le macchine da cantiere o con gli altri veicoli.',
      },
      {
        id: 'delineatore-senso-unico',
        name: 'Delineatore per strada a senso unico',
        shape: 'Paletto retroriflettente con strisce bianche e rosse',
        description:
          'Il delineatore e un segnale complementare posto ai margini della carreggiata per evidenziare il percorso della strada, specialmente in condizioni di scarsa visibilita (notte, nebbia, pioggia). Su strade a senso unico, i delineatori indicano la direzione corretta di marcia.',
        whenToObeyIt:
          'Utilizzare i delineatori come riferimento per mantenere la posizione corretta sulla carreggiata.',
        whatHappensIfIgnored:
          'Rischio di uscire di strada in condizioni di scarsa visibilita senza il riferimento dei delineatori.',
      },
      {
        id: 'delineatore-doppio-senso',
        name: 'Delineatore per strada a doppio senso',
        shape: 'Paletto retroriflettente a doppia faccia per doppio senso',
        description:
          'Delineatore a doppia faccia utilizzato su strade a doppio senso di circolazione. E posto ai margini della carreggiata ed e utile soprattutto in caso di scarsa visibilita. La doppia faccia permette di essere visibile da entrambe le direzioni di marcia.',
        whenToObeyIt:
          'Utilizzare i delineatori come riferimento per la posizione e la direzione, specialmente di notte.',
        whatHappensIfIgnored:
          'Rischio di invadere la corsia opposta in condizioni di visibilita ridotta.',
      },
      {
        id: 'delineatore-montagna',
        name: 'Delineatore per strade di montagna',
        shape: 'Paletto retroriflettente con asta per neve',
        description:
          'Delineatore specifico per strade di montagna soggette a innevamento. E dotato di un\'asta metallica retroriflettente che emerge dalla neve per rimanere visibile anche quando il manto stradale e coperto. Aiuta il conducente a individuare i margini della carreggiata.',
        whenToObeyIt:
          'Prestare attenzione ai delineatori come riferimento del percorso, specialmente con neve.',
        whatHappensIfIgnored:
          'Rischio di uscire di strada in condizioni di innevamento senza il riferimento dei delineatori.',
      },
      {
        id: 'delineatore-curva',
        name: 'Delineatore per curve pericolose',
        shape: 'Paletto retroriflettente posizionato nelle curve',
        description:
          'Delineatore posto nelle curve strette e con scarsa visibilita per migliorare la percezione della curva. Il delineatore di colore bianco e rosso indica una curva provvisoria, mentre quello bianco indica una curva permanente. E generalmente posizionato dopo il segnale di curva pericolosa.',
        whenToObeyIt:
          'Utilizzare i delineatori come guida visiva per affrontare la curva in sicurezza.',
        whatHappensIfIgnored:
          'Rischio di uscire di strada nella curva per mancanza di riferimento visivo.',
      },
      {
        id: 'delineatore-incrocio-t',
        name: 'Delineatore per incrocio a T',
        shape: 'Paletto retroriflettente con frecce direzionali',
        description:
          'Delineatore posizionato in corrispondenza di incroci a forma di T per indicare le direzioni possibili. Le punte delle frecce segnalano le uniche direzioni in cui e possibile svoltare.',
        whenToObeyIt:
          'Utilizzare le frecce del delineatore per orientarsi all\'incrocio a T.',
        whatHappensIfIgnored:
          'Rischio di finire contro un ostacolo o fuori strada se non si seguono le indicazioni.',
      },
      {
        id: 'delineatore-ostacolo',
        name: 'Delineatore per ostacolo sulla carreggiata',
        shape: 'Paletto retroriflettente posizionato a bordo di un ostacolo',
        description:
          'Delineatore retroriflettente posizionato all\'interno della carreggiata in presenza di un ostacolo (lavori, incidenti, detriti). Il delineatore deve essere montato sull\'ostacolo stesso o nei pressi per segnalare la presenza del pericolo ai conducenti.',
        whenToObeyIt:
          'Evitare l\'ostacolo segnalato dal delineatore, mantenendo una distanza di sicurezza adeguata.',
        whatHappensIfIgnored:
          'Rischio di impatto contro l\'ostacolo non segnalato, con possibili danni al veicolo.',
      },
      {
        id: 'contrassegno-velocita-veicolo',
        name: 'Contrassegno di velocita sul veicolo',
        shape: 'Pannello circolare con velocita massima applicato sul veicolo',
        description:
          'Contrassegno applicato sulla parte posteriore di alcuni veicoli (autobus, autocarri) che indica la velocita massima consentita al veicolo stesso. Aiuta i conducenti dei veicoli che seguono a capire la velocita massima del veicolo che precede.',
        whenToObeyIt:
          'Informativo, per i veicoli che seguono: rispettare la velocita del veicolo che precede.',
        whatHappensIfIgnored:
          'Non applicabile direttamente: e un\'informazione per la circolazione.',
      },
      {
        id: 'pannello-carico-sporgente',
        name: 'Pannello per carico sporgente',
        shape: 'Pannello a strisce diagonali rosse e bianche con palla',
        description:
          'Pannello obbligatorio applicato posteriormente ai veicoli il cui carico sporge oltre il sagoma del veicolo. La sporgenza longitudinale fino a 3/10 della lunghezza del veicolo deve essere segnalata. Il pannello ha strisce diagonali rosse e bianche e una palla retroriflettente.',
        whenToObeyIt:
          'Applicare il pannello ogni volta che il carico sporge posteriormente.',
        whatHappensIfIgnored:
          'Multa e responsabilita in caso di incidente causato da carico sporgente non segnalato.',
      },
      {
        id: 'pannello-merci-pericolose-adr',
        name: 'Pannello per trasporto merci pericolose',
        shape: 'Pannello arancione retroriflettente',
        description:
          'Pannello arancione retroriflettente obbligatorio per i veicoli che trasportano merci pericolose secondo la normativa ADR. E collocato posteriormente e lateralmente sul veicolo. Aiuta a identificare rapidamente il tipo di pericolo in caso di incidente.',
        whenToObeyIt:
          'Applicare il pannello in modo visibile su tutti i lati del veicolo durante il trasporto.',
        whatHappensIfIgnored:
          'Sanzioni gravissime in caso di trasporto di merci pericolose senza pannello identificativo.',
      },
      {
        id: 'pannello-rimorchio-pesante',
        name: 'Pannello per rimorchio pesante',
        shape: 'Pannello retroriflettente con targhetta di velocita',
        description:
          'Pannello obbligatorio applicato posteriormente ai rimorchi e semirimorchi con massa a pieno carico superiore a 3,5 tonnellate. Il pannello include la targhetta indicante la velocita massima del convoglio. E retroriflettente per la visibilita notturna.',
        whenToObeyIt:
          'Verificare che il pannello sia correttamente applicato e la targhetta sia aggiornata.',
        whatHappensIfIgnored:
          'Multa e possibile fermo del veicolo in caso di mancanza del pannello obbligatorio.',
      },
      {
        id: 'via-fuga-galleria',
        name: 'Via di fuga in galleria',
        shape: 'Rettangolo con simbolo di uscita di emergenza',
        description:
          'Pannello posto all\'interno di una galleria che indica la presenza di una via di fuga. La via di fuga e un percorso sicuro per evacuare la galleria in caso di incendio o altra emergenza. Il conducente deve conoscere la posizione delle vie di fuga prima di entrare in gallerie lunghe.',
        whenToObeyIt:
          'In caso di emergenza, seguire le indicazioni per raggiungere la via di fuga piu vicina.',
        whatHappensIfIgnored:
          'Non conoscere la posizione delle vie di fuga in galleria puo essere pericoloso in caso di emergenza.',
      },
      {
        id: 'estintore-galleria',
        name: 'Estintore in galleria',
        shape: 'Rettangolo con simbolo di estintore',
        description:
          'Pannello posto all\'interno di una galleria che indica la presenza di un estintore. Gli estintori in galleria sono posizionati a intervalli regolari per permettere un intervento rapido in caso di incendio.',
        whenToObeyIt:
          'Informativo: utile per localizzare rapidamente un estintore in caso di incendio in galleria.',
        whatHappensIfIgnored:
          'Non applicabile: e un\'indicazione per la sicurezza in caso di emergenza.',
      },
      {
        id: 'vigile-braccia-aperte',
        name: 'Vigile con braccia aperte (divieto di transito)',
        shape: 'Figura del vigile urbano con entrambe le braccia aperte in avanti',
        description:
          'Il vigile urbano disposto con le braccia aperte orizzontalmente verso i veicoli in arrivo equivale al semaforo rosso: il transito e vietato. I veicoli devono arrestarsi prima della linea di arresto. Questa posizione del vigile ha priorita assoluta su qualsiasi altro segnale stradale o semaforo.',
        whenToObeyIt:
          'Arrestarsi completamente quando il vigile e in questa posizione, rispettando la priorita assoluta.',
        whatHappensIfIgnored:
          'Multa severa e possibile ritiro della patente per il mancato arresto.',
      },
      {
        id: 'vigile-profilo',
        name: 'Vigile di profilo con braccia aperte',
        shape: 'Figura del vigile urbano di profilo con le braccia aperte',
        description:
          'Il vigile disposto di profilo rispetto alla direzione del traffico, con le braccia aperte, equivale al semaforo verde: il transito e consentito. Il vigile in questa posizione permette anche la svolta verso di lui. La priorita del vigile e assoluta.',
        whenToObeyIt:
          'Proseguire nella direzione consentita, potendo anche svoltare verso il vigile.',
        whatHappensIfIgnored:
          'Non applicabile direttamente: e un segnale di consenso al transito.',
      },
      {
        id: 'vigile-braccio-alzato',
        name: 'Vigile con braccio alzato (attenzione)',
        shape: 'Figura del vigile urbano con un braccio verticalmente alzato',
        description:
          'Il vigile con un braccio alzato verticalmente equivale al semaforo giallo: impone l\'obbligo di arrestarsi se non e gia passato il punto di non ritorno, altrimenti di liberare velocemente l\'intersezione.',
        whenToObeyIt:
          'Arrestarsi se possibile, altrimenti liberare rapidamente l\'intersezione.',
        whatHappensIfIgnored:
          'Multa per non aver rispettato l\'ordine del vigile. Rischio di incidente nell\'intersezione.',
      },
      {
        id: 'vigile-angolo-retto',
        name: 'Vigile con braccia ad angolo retto',
        shape: 'Figura del vigile urbano con le braccia formanti un angolo retto',
        description:
          'Il vigile disposto con le braccia formanti un angolo retto regola il traffico consentendo la svolta a sinistra e fermando i veicoli provenienti dalla direzione opposta. La posizione del vigile ha sempre priorita assoluta su semafori e altri segnali.',
        whenToObeyIt:
          'Seguire le indicazioni del vigile: svolta a sinistra consentita, diritto vietato dalla direzione opposta.',
        whatHappensIfIgnored:
          'Multa per non aver rispettato gli ordini del vigile urbano.',
      },
],
  },

  // ─────────────────────────────────────────────────────────────
  //  PANNELLI INTEGRATIVI
  // ─────────────────────────────────────────────────────────────
  {
    id: 'pannelli',
    name: 'Pannelli integrativi',
    icon: '📋',
    color: '#6366F1',
    description:
      'Pannelli rettangolari che completano o modificano il significato dei segnali principali. Forniscono informazioni su distanze, orari, direzioni, eccezioni. Hanno valore SOLO se associati a un segnale principale.',
    signals: [
      {
        id: 'pannello-distanza',
        name: 'Pannello di distanza',
        shape: 'Rettangolo bianco con bordo nero e numero',
        description:
          'Indica la distanza del pericolo o della prescrizione dal punto del segnale principale. Spesso usato con segnali di pericolo (es. "200 m" dopo un segnale di curve).',
        whenToObeyIt: 'Insieme al segnale principale associato.',
        whatHappensIfIgnored:
          'Non prepararsi in tempo al pericolo.',
      },
      {
        id: 'pannello-direzione',
        name: 'Pannello direzionale',
        shape: 'Rettangolo con freccia',
        description:
          'Indica la direzione in cui si applica la prescrizione del segnale principale. La freccia può puntare a sinistra, destra o entrambe le direzioni.',
        whenToObeyIt: 'Insieme al segnale principale associato.',
        whatHappensIfIgnored:
          'Non capire in quale direzione si applica il segnale.',
      },
      {
        id: 'pannello-validita',
        name: 'Pannello di validità temporale',
        shape: 'Rettangolo con giorni e/o orari',
        description:
          'Indica i giorni e/o gli orari in cui il segnale principale è valido. Esempi: "Lun-Ven 8-18", "Giorni festivi".',
        whenToObeyIt:
          'Solo negli orari e giorni indicati. Fuori da questi, il segnale non vale.',
        whatHappensIfIgnored:
          'Rischiare multe non necessarie o non rispettare regole valide.',
      },
      {
        id: 'presenza-code',
        name: 'Presenza di code',
        shape: 'Rettangolo con simbolo di file di veicoli',
        description:
          'Pannello integrativo che segnala la probabilità di code o traffico intenso. Consiglia di ridurre la velocità e mantenere la distanza di sicurezza.',
        whenToObeyIt:
          'Insieme al segnale principale, quando il traffico è intenso.',
        whatHappensIfIgnored:
          'Rischio di tamponamenti a catena e incidenti per traffico intenso.',
      },
      {
        id: 'zona-allagamento',
        name: 'Zona di allagamento',
        shape: 'Rettangolo con simbolo di acqua e veicolo',
        description:
          'Pannello che segnala una zona soggetta ad allagamenti. In caso di piogge intense, l\'acqua può coprire la carreggiata. Non attraversare se l\'acqua è alta.',
        whenToObeyIt: 'Insieme al segnale principale, specialmente in caso di piogge.',
        whatHappensIfIgnored:
          'Rischio di acquaplaning, blocco del motore o trascinamento del veicolo dalla corrente.',
      },
      {
        id: 'zona-rimozione',
        name: 'Zona di rimozione',
        shape: 'Rettangolo con simbolo di gru o rimorchiatore',
        description:
          'Pannello integrativo associato al divieto di sosta che indica che i veicoli in divieto saranno rimossi a spese del proprietario. Sanzione aggiuntiva alla multa.',
        whenToObeyIt: 'Insieme al divieto di sosta o fermata.',
        whatHappensIfIgnored:
          'Rimozione forzata del veicolo, spese di rimozione e deposito a carico del proprietario.',
      },
      {
        id: 'mezzi-lavoro',
        name: 'Presenza di mezzi di lavoro',
        shape: 'Rettangolo con simbolo di escavatore o mezzo d\'opera',
        description:
          'Pannello integrativo che indica la presenza di mezzi di lavoro sulla carreggiata. Prestare attenzione agli operai e ai macchinari, ridurre la velocità.',
        whenToObeyIt: 'Insieme al segnale di lavori stradali o pericolo.',
        whatHappensIfIgnored:
          'Rischio di incidente con mezzi pesanti d\'opera o investimento di operai.',
      },
      {
        id: 'strada-ghiacciata',
        name: 'Strada ghiacciata',
        shape: 'Rettangolo con simbolo di fiocco di neve o ghiaccio',
        description:
          'Pannello integrativo che segnala un tratto di strada soggetto a ghiaccio. La strada può essere estremamente scivolosa. Montare pneumatici invernali o catene.',
        whenToObeyIt:
          'Insieme al segnale di neve o ghiaccio o come indicazione autonoma.',
        whatHappensIfIgnored:
          'Perdita totale di aderenza, sbandata, incidente grave.',
      },
      {
        id: 'pannello-km',
        name: 'Distanza in chilometri',
        shape: 'Rettangolo bianco con numero e scritta km',
        description:
          'Pannello integrativo che indica la distanza in chilometri dal punto dove è posizionato il segnale principale. Utilizzato insieme ai segnali di precedenza, pericolo o indicazione per fornire la distanza precisa dell\'ostacolo o della destinazione. Aiuta il conducente a calcolare il tempo e lo spazio necessario per reagire.',
        whenToObeyIt: 'Insieme al segnale principale, per valutare la distanza e prepararsi.',
        whatHappensIfIgnored:
          'Non valutare correttamente la distanza può portare a reazioni tardive o inadeguate.',
      },
      {
        id: 'pannello-nome-localita',
        name: 'Nome della località',
        shape: 'Rettangolo bianco con nome della località in nero',
        description:
          'Pannello integrativo che indica il nome di una località, comune o frazione. Viene posizionato all\'ingresso del centro abitato o lungo la strada per confermare la località in cui ci si trova. Aiuta il conducente a orientarsi e a verificare di essere sulla strada corretta.',
        whenToObeyIt: 'Informativo, per confermare la propria posizione e l\'itinerario seguito.',
        whatHappensIfIgnored: 'Non applicabile — è puramente informativo.',
      },
      {
        id: 'pannello-direzioni-multiple',
        name: 'Direzioni multiple (più destinazioni)',
        shape: 'Rettangolo con frecce multiple e nomi delle destinazioni',
        description:
          'Pannello che indica più destinazioni raggiungibili dalle diverse direzioni all\'incrocio. Ogni freccia corrisponde a una destinazione specifica con la relativa distanza. Il conducente deve selezionare la direzione corretta in base alla propria destinazione.',
        whenToObeyIt: 'All\'incrocio, per scegliere la direzione corretta verso la propria destinazione.',
        whatHappensIfIgnored:
          'Rischio di prendere la direzione sbagliata con perdita di tempo e chilometri extra.',
      },
      {
        id: 'pannello-conferma-direzione',
        name: 'Conferma di direzione',
        shape: 'Rettangolo con freccia dritta e nome della destinazione',
        description:
          'Pannello che conferma la direzione di marcia e la destinazione sulla strada attuale. Generalmente posizionato dopo un incrocio o uno svincolo per rassicurare il conducente che sta procedendo nella direzione corretta. Mostra il nome della località e spesso la distanza rimanente.',
        whenToObeyIt: 'Informativo, per confermare di essere sulla strada giusta.',
        whatHappensIfIgnored: 'Non applicabile — è puramente informativo.',
      },
      {
        id: 'pannello-numero-uscita',
        name: 'Numero uscita autostradale',
        shape: 'Rettangolo con numero dell\'uscita',
        description:
          'Pannello che indica il numero identificativo di un\'uscita autostradale. Ogni uscita ha un numero progressivo che cresce lungo il percorso dell\'autostrada. Aiuta il conducente a identificare rapidamente l\'uscita desiderata, specialmente quando si utilizza il navigatore.',
        whenToObeyIt: 'Informativo, per identificare l\'uscita autostradale corretta.',
        whatHappensIfIgnored:
          'Non applicabile — è informativo. Non identificare l\'uscita può portare a perdere lo svincolo desiderato.',
      },
      {
        id: 'pannello-estensione',
        name: 'Estensione del divieto (frecce)',
        shape: 'Rettangolo con frecce che indicano l\'estensione del divieto',
        description:
          'Pannello integrativo che indica la lunghezza o l\'estensione spaziale di un divieto o di un obbligo. Le frecce possono indicare che il divieto si estende per un certo numero di metri o fino a un punto specifico. Fondamentale per capire esattamente dove inizia e dove finisce la prescrizione.',
        whenToObeyIt: 'Insieme al segnale principale, per comprendere l\'estensione della validità.',
        whatHappensIfIgnored:
          'Rischiare di violare il divieto o di non rispettarlo per l\'intera lunghezza prevista.',
      },
      {
        id: 'pannello-mesi',
        name: 'Mesi di validità (dicembre-aprile, ecc.)',
        shape: 'Rettangolo con nomi dei mesi',
        description:
          'Pannello integrativo che indica il periodo di validità di un segnale, specificando i mesi in cui è in vigore. Molto comune per i segnali di obbligo di pneumatici invernali o catene da neve, generalmente valido da novembre ad aprile. Al di fuori del periodo indicato, il segnale non ha valore.',
        whenToObeyIt: 'Rispettare il segnale solo nei mesi indicati sul pannello.',
        whatHappensIfIgnored:
          'Non rispettare il segnale nel periodo di validità comporta sanzioni. Fuori periodo, il segnale non è efficace.',
      },
      {
        id: 'pannello-giorni-festivi',
        name: 'Giorni festivi',
        shape: 'Rettangolo con scritta GIORNI FESTIVI',
        description:
          'Pannello integrativo che indica che il segnale principale è valido (o non valido) solo nei giorni festivi. Utilizzato per esempio per indicare divieti di transito o limitazioni di velocità che si applicano esclusivamente nei giorni di festa e prefestivi.',
        whenToObeyIt: 'Applicare il segnale principale solo nei giorni festivi indicati.',
        whatHappensIfIgnored:
          'Non rispettare il divieto nei giorni festivi comporta multe. Rispettarlo nei giorni feriali è comunque consentito.',
      },
      {
        id: 'pannello-pedoni',
        name: 'Pedoni',
        shape: 'Rettangolo con simbolo di pedone',
        description:
          'Pannello integrativo che indica la presenza di pedoni o che il segnale principale si applica ai pedoni. Può indicare un attraversamento pedonale, un marciapiede o una zona frequentata da pedoni. Aiuta il conducente a prestare particolare attenzione alle persone a piedi.',
        whenToObeyIt: 'Insieme al segnale principale, prestare attenzione ai pedoni nella zona.',
        whatHappensIfIgnored:
          'Rischio di investimento pedonale con gravi conseguenze legali, penali e morali.',
      },
      {
        id: 'disco-orario',
        name: 'Disco orario (sosta a tempo)',
        shape: 'Cerchio blu con freccia e simbolo di orologio',
        description:
          'Indica una zona di sosta regolamentata con limite di tempo. Il conducente deve esporre il disco orario sul cruscotto, indicando l\'ora di arrivo. La durata massima della sosta è indicata dal pannello integrativo (es. 1 ora, 2 ore). Questo pannello è sempre associato a un segnale di parcheggio o di sosta.',
        whenToObeyIt:
          'All\'atto della sosta, posizionando il disco orario in modo visibile dal esterno del veicolo.',
        whatHappensIfIgnored:
          'Multa per sosta irregolare se il disco non è esposto o se si supera il tempo consentito. Rimozione del veicolo in caso di violazione ripetuta.',
      },
    ],
  },
];

// ─────────────────────────────────────────────────────────────
//  UTILITY FUNCTIONS
// ─────────────────────────────────────────────────────────────

/** Trova una categoria di segnali per ID */
export function getSignalCategory(id: string): SignalCategory | undefined {
  return SIGNAL_CATEGORIES.find((cat) => cat.id === id);
}

/** Trova un segnale specifico per ID in tutte le categorie */
export function getSignalById(
  signalId: string
): { signal: SignalInfo; category: SignalCategory } | undefined {
  for (const category of SIGNAL_CATEGORIES) {
    const signal = category.signals.find((s) => s.id === signalId);
    if (signal) return { signal, category };
  }
  return undefined;
}

/** Restituisce tutti i segnali di tutte le categorie in un array piatto */
export function getAllSignals(): {
  signal: SignalInfo;
  category: SignalCategory;
}[] {
  return SIGNAL_CATEGORIES.flatMap((category) =>
    category.signals.map((signal) => ({ signal, category }))
  );
}
