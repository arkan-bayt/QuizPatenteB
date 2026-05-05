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
        id: 'parcheggio',
        name: 'Parcheggio',
        shape: 'Quadrato blu con bordo blu e lettera P bianca',
        description:
          'Indica un\'area di parcheggio. Possono essere associati pannelli con orari, tariffe o categorie (disabili, camper, ecc.). Attenzione: è un segnale di divieto di sosta su tutto il resto della strada.',
        whenToObeyIt: 'Per trovare un parcheggio autorizzato.',
        whatHappensIfIgnored:
          'Parcheggiare fuori dagli spazi previsti può comportare multe e rimozione.',
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
        id: 'sens-unico',
        name: 'Senso unico di circolazione',
        shape: 'Rettangolo blu con freccia bianca',
        description:
          'Obbliga a procedere nella direzione indicata dalla freccia. Nota: è rettangolare (non rotondo come gli altri obblighi).',
        whenToObeyIt: 'All\'inizio della strada a senso unico.',
        whatHappensIfIgnored:
          'Circolare nel verso opposto = multa grave e rischio di incidente frontale.',
      },
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
