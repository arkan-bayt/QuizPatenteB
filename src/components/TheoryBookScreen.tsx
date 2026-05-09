'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useStore } from '@/store/useStore';
import { speakContinuous, stopSpeech, isSpeaking } from '@/logic/ttsEngine';

// ============================================================
// SIGNAL IMAGE MAPPING
// Maps Italian road sign heading names → /img_sign/ images
// Sign chapters (2-11): Each heading IS a sign name → mapped correctly
// Theory chapters (1, 12-30): Only keep if the sign IS directly relevant
// Theory headings without a relevant sign → show generic category icon (null)
// ============================================================
const HEADING_SIGN_IMAGE: Record<string, string> = {
  // ═══════════════════════════════════════════════════════════
  // LESSON 1: Definizioni Stradali e di Traffico
  // Theory chapter about road definitions — headings are NOT sign names
  // All removed: showing a random sign would be misleading
  // ═══════════════════════════════════════════════════════════

  // ═══════════════════════════════════════════════════════════
  // LESSON 2: Segnali di Pericolo (fig 1-39)
  // ═══════════════════════════════════════════════════════════
  'STRADA DEFORMATA': '/img_sign/1.png',
  'DOSSO': '/img_sign/2.png',
  'CUNETTA': '/img_sign/3.png',
  'CURVA A DESTRA': '/img_sign/4.png',
  'CURVA A SINISTRA': '/img_sign/5.png',
  'DOPPIA CURVA, LA PRIMA A DESTRA': '/img_sign/6.png',
  'DOPPIA CURVA, LA PRIMA A SINISTRA': '/img_sign/7.png',
  'PASSAGGIO A LIVELLO CON BARRIERE O SEMIBARRIERE': '/img_sign/8.png',
  'PASSAGGIO A LIVELLO SENZA BARRIERE': '/img_sign/9.png',
  'INCROCIO': '/img_sign/10.png',
  'CROCE DI S. ANDREA': '/img_sign/11.png',
  'DOPPIA CROCE DI S. ANDREA': '/img_sign/11.png',
  'GALLERIA': '/img_sign/13.png',
  'PANNELLI DISTANZIOMETRICI': '/img_sign/34.png',
  'LAVORI': '/img_sign/13.png',
  'ATTRAVERSAMENTO TRANVIARIO': '/img_sign/14.png',
  'ATTRAVERSAMENTO PEDONALE': '/img_sign/15.png',
  'ATTRAVERSAMENTO CICLABILE': '/img_sign/16.png',
  'DISCESA PERICOLOSA CON PENDENZA DEL 10 %': '/img_sign/17.png',
  'SALITA RIPIDA CON PENDENZA DEL 10 %': '/img_sign/18.png',
  'STRETTOIA SIMMETRICA': '/img_sign/19.png',
  'STRETTOIA ASIMMETRICA A SINISTRA': '/img_sign/20.png',
  'STRETTOIA ASIMMETRICA A DESTRA': '/img_sign/21.png',
  'PONTE MOBILE': '/img_sign/22.png',
  'BANCHINA PERICOLOSA': '/img_sign/23.png',
  'STRADA SDRUCCIOLEVOLE': '/img_sign/24.png',
  'ATTENZIONE AI BAMBINI': '/img_sign/25.png',
  'ATTENZIONE AGLI ANIMALI DOMESTICI VAGANTI (LIBERI)': '/img_sign/26.png',
  'ATTENZIONE AGLI ANIMALI SELVATICI VAGANTI (LIBERI)': '/img_sign/27.png',
  'DOPPIO SENSO DI CIRCOLAZIONE': '/img_sign/28.png',
  'ROTATORIA': '/img_sign/29.png',
  'PREAVVISO DI CIRCOLAZIONE ROTATORIA': '/img_sign/30.png',
  'SBOCCO SU MOLO O SU ARGINE': '/img_sign/31.png',
  'MATERIALE INSTABILE SULLA STRADA': '/img_sign/33.png',
  'PIETRISCO': '/img_sign/31.png',
  'CADUTA MASSI DA SINISTRA': '/img_sign/32.png',
  'CADUTA MASSI DA DESTRA': '/img_sign/33.png',
  'PREAVVISO DI SEMAFORO VERTICALE': '/img_sign/34.png',
  'PREAVVISO DI SEMAFORO ORIZZONTALE': '/img_sign/35.png',
  'AEROMOBILI A BASSA QUOTA': '/img_sign/36.png',
  'FORTE VENTO LATERALE': '/img_sign/37.png',
  'PERICOLO DI INCENDIO': '/img_sign/38.png',
  'ALTRI PERICOLI': '/img_sign/39.png',

  // ═══════════════════════════════════════════════════════════
  // LESSON 3: Segnali di Precedenza (fig 40-53)
  // ═══════════════════════════════════════════════════════════
  'DARE PRECEDENZA': '/img_sign/40.png',
  'FERMARSI E DARE PRECEDENZA (STOP)': '/img_sign/41.png',
  'PREAVVISO DI DARE PRECEDENZA': '/img_sign/42.png',
  'PREAVVISO DI FERMARSI E DARE PRECEDENZA (STOP)': '/img_sign/43.png',
  'INTERSEZIONE CON PRECEDENZA A DESTRA': '/img_sign/44.png',
  'INTERSEZIONE CON PRECEDENZA A SINISTRA': '/img_sign/47.png',
  'INTERSEZIONE CON DIRITTO DI PRECEDENZA': '/img_sign/48.png',
  'INTERSEZIONE A "T" CON DIRITTO DI PRECEDENZA A DESTRA': '/img_sign/49.png',
  'INTERSEZIONE A "T" CON DIRITTO DI PRECEDENZA A SINISTRA': '/img_sign/50.png',
  'CONFLUENZA A DESTRA': '/img_sign/51.png',
  'CONFLUENZA A SINISTRA': '/img_sign/51.png',
  'DIRITTO DI PRECEDENZA': '/img_sign/52.png',
  'FINE DEL DIRITTO DI PRECEDENZA': '/img_sign/46.png',
  'DARE PRECEDENZA NEI SENSI UNICI ALTERNATI': '/img_sign/45.png',
  'DIRITTO DI PRECEDENZA NEI SENSI UNICI ALTERNATI': '/img_sign/53.png',

  // ═══════════════════════════════════════════════════════════
  // LESSON 4: Segnali di Divieto (fig 54-89)
  // ═══════════════════════════════════════════════════════════
  'DIVIETO DI TRANSITO': '/img_sign/54.png',
  'DIVIETO DI TRANSITO PER AUTOTRENI ED AUTOARTICOLATI': '/img_sign/55.png',
  'SENSO VIETATO': '/img_sign/56.png',
  'DIVIETO DI SORPASSO': '/img_sign/57.png',
  'DIVIETO DI INVERSIONE DEL SENSO DI MARCIA': '/img_sign/57.png',
  'LIMITE MASSIMO DI VELOCITÀ DI 80 KM/H': '/img_sign/58.png',
  'DIVIETO DI SEGNALAZIONI ACUSTICHE': '/img_sign/59.png',
  'DIVIETO DI SOSTA': '/img_sign/60.png',
  'PASSO CARRABILE': '/img_sign/61.png',
  'DIVIETO DI FERMATA': '/img_sign/61.png',
  'DIVIETO DI RETROMARCIA': '/img_sign/61.png',
  'FINE DEL DIVIETO DI SORPASSO': '/img_sign/82.png',
  'DIVIETO DI TRANSITO AI PEDONI': '/img_sign/62.png',
  'DIVIETO DI TRANSITO AI VELOCIPEDI (BICICLETTE)': '/img_sign/63.png',
  'DIVIETO DI TRANSITO AI MOTOCICLI': '/img_sign/64.png',
  'DIVIETO DI TRANSITO AI VEICOLI A BRACCIA': '/img_sign/65.png',
  'DIVIETO DI TRANSITO AI VEICOLI A TRAZIONE ANIMALE': '/img_sign/66.png',
  'DIVIETO DI TRANSITO AGLI AUTOBUS': '/img_sign/67.png',
  'DIVIETO DI TRANSITO AI VEICOLI A MOTORE TRAINANTI UN RIMORCHIO': '/img_sign/68.png',
  'DIVIETO DI TRANSITO AGLI AUTOVEICOLI E MOTOVEICOLI CON 3 O PIÙ RUOTE': '/img_sign/69.png',
  'DIVIETO DI SOSTA TEMPORANEO': '/img_sign/70.png',
  'VIA LIBERA': '/img_sign/80.png',
  'FINE DEL LIMITE MASSIMO DI VELOCITÀ DI 50 KM/H': '/img_sign/81.png',
  'PARCHEGGIO': '/img_sign/86.png',
  'PREAVVISO DI PARCHEGGIO': '/img_sign/86.png',
  'SOSTA CONSENTITA A PARTICOLARI CATEGORIE': '/img_sign/89.png',
  'DISTANZIAMENTO MINIMO OBBLIGATORIO DI 70 METRI': '/img_sign/74.png',
  'DIVIETO DI SORPASSO PER GLI AUTOCARRI CHE SUPERANO 3,5 T.': '/img_sign/60.png',
  'FINE DEL DIVIETO DI SORPASSO PER GLI AUTOCARRI CHE SUPERANO 3,5 T.': '/img_sign/82.png',
  'DIVIETO DI TRANSITO AGLI AUTOCARRI CHE SUPERANO 3,5 T.': '/img_sign/68.png',
  'DIVIETO DI TRANSITO AGLI AUTOCARRI CHE SUPERANO 6,5 T.': '/img_sign/69.png',
  'DIVIETO DI TRANSITO ALLE MACCHINE AGRICOLE': '/img_sign/71.png',
  'DIVIETO DI TRANSITO AI VEICOLI CHE TRASPORTANO MERCI PERICOLOSE': '/img_sign/72.png',
  'DIVIETO DI TRANSITO AI VEICOLI CHE TRASPORTANO ESPLOSIVI O PRODOTTI': '/img_sign/73.png',
  'FACILMENTE INFIAMMABILI': '/img_sign/73.png',
  'DIVIETO DI TRANSITO AI VEICOLI CHE TRASPORTANO PRODOTTI SUSCETTIBI-': '/img_sign/72.png',
  'LI DI CONTAMINARE L\'ACQUA': '/img_sign/72.png',
  'DIVIETO DI TRANSITO A TUTTI I VEICOLI AVENTI LARGHEZZA SUPERIORE A': '/img_sign/76.png',
  '2,30 METRI': '/img_sign/76.png',
  'DIVIETO DI TRANSITO A TUTTI I VEICOLI AVENTI ALTEZZA SUPERIORE A 3,50': '/img_sign/77.png',
  'METRI': '/img_sign/77.png',
  'DIVIETO DI TRANSITO A TUTTI I VEICOLI, O COMPLESSI DI VEICOLI, AVENTI': '/img_sign/77.png',
  'LUNGHEZZA SUPERIORE A 10 METRI': '/img_sign/77.png',
  'DIVIETO DI TRANSITO A TUTTI I VEICOLI AVENTI UNA MASSA SUPERIORE A': '/img_sign/78.png',
  'DIVIETO DI TRANSITO A TUTTI I VEICOLI AVENTI MASSA PER ASSE SUPERIORE': '/img_sign/79.png',
  'REGOLAZIONE FLESSIBILE DELLA SOSTA IN CENTRO ABITATO': '/img_sign/92.png',

  // ═══════════════════════════════════════════════════════════
  // LESSON 5: Segnali di Obbligo (fig 90-114)
  // ═══════════════════════════════════════════════════════════
  'DIREZIONE OBBLIGATORIA DIRITTO': '/img_sign/93.png',
  'DIREZIONE OBBLIGATORIA A SINISTRA': '/img_sign/94.png',
  'DIREZIONE OBBLIGATORIA A DESTRA': '/img_sign/95.png',
  'PREAVVISO DI DIREZIONE OBBLIGATORIA A DESTRA': '/img_sign/96.png',
  'PREAVVISO DI DIREZIONE OBBLIGATORIA A SINISTRA': '/img_sign/97.png',
  'PREAVVISO DI DEVIAZIONE OBBLIGATORIA PER AUTOCARRI IN TRANSITO': '/img_sign/99.png',
  'DIREZIONI CONSENTITE DESTRA E SINISTRA': '/img_sign/98.png',
  'DIREZIONI CONSENTITE DIRITTO E DESTRA': '/img_sign/99.png',
  'DIREZIONI CONSENTITE DIRITTO E SINISTRA': '/img_sign/100.png',
  'PASSAGGIO OBBLIGATORIO A SINISTRA': '/img_sign/101.png',
  'PASSAGGIO OBBLIGATORIO A DESTRA': '/img_sign/102.png',
  'PASSAGGI CONSENTITI': '/img_sign/103.png',
  'LIMITE MINIMO DI VELOCITÀ DI 30 KM/H': '/img_sign/105.png',
  'FINE DEL LIMITE MINIMO DI VELOCITÀ DI 30 KM/H': '/img_sign/106.png',
  'CATENE DA NEVE OBBLIGATORIE': '/img_sign/107.png',
  'PERCORSO PEDONALE': '/img_sign/108.png',
  'FINE DEL PERCORSO PEDONALE': '/img_sign/109.png',
  'PISTA CICLABILE': '/img_sign/112.png',
  'FINE PISTA CICLABILE': '/img_sign/114.png',
  'PISTA CICLABILE CONTIGUA (ACCANTO) AL MARCIAPIEDE': '/img_sign/113.png',
  'FINE DELLA PISTA CICLABILE CONTIGUA (ACCANTO) AL MARCIAPIEDE': '/img_sign/114.png',
  'PERCORSO UNICO PEDONALE E CICLABILE': '/img_sign/110.png',
  'FINE DEL PERCORSO PEDONALE E CICLABILE': '/img_sign/111.png',
  'PERCORSO RISERVATO AI QUADRUPEDI DA SOMA E DA SELLA': '/img_sign/90.png',
  'FINE DEL PERCORSO RISERVATO AI QUADRUPEDI DA SOMA E DA SELLA': '/img_sign/91.png',
  'ALT-DOGANA': '/img_sign/118.png',
  'CONFINE DI STATO TRA PAESI DELLA COMUNITÀ EUROPEA': '/img_sign/116.png',
  'PREAVVISO DI CONFINE DI STATO TRA PAESI DELLA COMUNITÀ EUROPEA': '/img_sign/164.png',
  'ALT-POLIZIA': '/img_sign/119.png',
  'ALT-STAZIONE': '/img_sign/120.png',
  'ROTATORIA (OBBLIGATORIA)': '/img_sign/104.png',

  // ═══════════════════════════════════════════════════════════
  // LESSON 6: Segnali di Indicazione (fig 116+)
  // ═══════════════════════════════════════════════════════════
  'SENSO UNICO PARALLELO': '/img_sign/152.png',
  'SENSO UNICO FRONTALE': '/img_sign/153.png',
  'PREAVVISO DI DIRAMAZIONE URBANA': '/img_sign/166.png',
  'SEGNALE DI PREAVVISO DI INTERSEZIONE URBANA': '/img_sign/166.png',
  'SEGNALE DI PREAVVISO DI INTERSEZIONI RAVVICINATE URBANE': '/img_sign/167.png',
  'SEGNALE DI PREAVVISO DI INTERSEZIONE URBANA CON ROTATORIA': '/img_sign/168.png',
  'SEGNALE DI PREAVVISO DI INTERSEZIONE URBANA, CON DIVIETO DI TRANSI-': '/img_sign/169.png',
  'TO PER UNA CATEGORIA DI VEICOLI SU UN RAMO DELL\'INTERSEZIONE': '/img_sign/169.png',
  'SEGNALE DI PREAVVISO DI INTERSEZIONE EXTRAURBANA CON PASSAGGIO A': '/img_sign/170.png',
  'LIVELLO SU UN RAMO DELL\'INTERSEZIONE': '/img_sign/170.png',
  'PREAVVISO DI DIRAMAZIONE AUTOSTRADALE': '/img_sign/200.png',
  'SEGNALE DI PRESELEZIONE EXTRAURBANO': '/img_sign/174.png',
  'SEGNALE DI PRESELEZIONE URBANO': '/img_sign/174.png',
  'PROGRESSIVA DISTANZIOMETRICA AUTOSTRADALE': '/img_sign/201.png',
  'SEGNALE DI ITINERARIO EXTRAURBANO': '/img_sign/182.png',
  'INIZIO CENTRO ABITATO': '/img_sign/207.png',
  'FINE CENTRO ABITATO': '/img_sign/183.png',
  'SEGNALE DI CONFERMA AUTOSTRADALE': '/img_sign/182.png',
  'SEGNALE DI IDENTIFICAZIONE ITINERARIO INTERNAZIONALE': '/img_sign/199.png',
  'SEGNALE DI IDENTIFICAZIONE AUTOSTRADA': '/img_sign/184.png',
  'SEGNALE DI IDENTIFICAZIONE STRADA STATALE': '/img_sign/203.png',
  'SEGNALE DI IDENTIFICAZIONE STRADA COMUNALE': '/img_sign/203.png',
  'ZONA A TRAFFICO LIMITATO': '/img_sign/187.png',
  'TRANSITABILITÀ (PASSO APERTO CON OBBLIGO DI CATENE O PNEUMATICI DA': '/img_sign/189.png',
  'NEVE)': '/img_sign/189.png',
  'TRANSITABILITÀ (TRATTO TERMINALE DELLA STRADA O PASSO CHIUSO)': '/img_sign/189.png',
  'INIZIO STRADA EXTRAURBANA PRINCIPALE': '/img_sign/194.png',
  'INVERSIONE DI MARCIA': '/img_sign/200.png',
  'LIMITI DI VELOCITÀ GENERALI': '/img_sign/193.png',
  'PRONTO SOCCORSO': '/img_sign/210.png',
  'OSPEDALE': '/img_sign/214.png',
  'SEGNALE DI LOCALIZZAZIONE TERRITORIALE (NOME FIUME)': '/img_sign/216.png',
  'PREAVVISO DI INFORMAZIONI TURISTICO-ALBERGHIERE': '/img_sign/199.png',
  'SCUOLABUS': '/img_sign/219.png',
  'FERMATA AUTOBUS': '/img_sign/256.png',
  'PARCHEGGIO DI SCAMBIO CON LINEE AUTOBUS': '/img_sign/265.png',
  'S.O.S.': '/img_sign/220.png',
  'STRADA SENZA USCITA': '/img_sign/224.png',
  'PREAVVISO DI STRADA SENZA USCITA': '/img_sign/225.png',
  'VELOCITÀ CONSIGLIATA': '/img_sign/226.png',
  'STRADA RISERVATA AI VEICOLI A MOTORE': '/img_sign/228.png',
  'GALLERIA AUTOSTRADALE': '/img_sign/230.png',
  'PONTE': '/img_sign/239.png',
  'SVOLTA A SINISTRA INDIRETTA': '/img_sign/240.png',
  'PIAZZOLA SU VIABILITÀ ORDINARIA': '/img_sign/243.png',
  'USO CORSIE': '/img_sign/245.png',
  'VARIAZIONE CORSIE DISPONIBILI (IN AUMENTO)': '/img_sign/247.png',
  'VARIAZIONE CORSIE DISPONIBILI (IN DIMINUZIONE)': '/img_sign/248.png',
  'PREAVVISO DI DEVIAZIONE CONSIGLIATA': '/img_sign/282.png',
  'ASSISTENZA MECCANICA': '/img_sign/252.png',
  'TELEFONO': '/img_sign/253.png',
  'RIFORNIMENTO': '/img_sign/254.png',
  'DISTRIBUTORE CARBURANTE': '/img_sign/254.png',
  'CAMPEGGIO': '/img_sign/260.png',
  'AUTO AL SEGUITO': '/img_sign/272.png',
  'POSTEGGIO PER TAXI': '/img_sign/272.png',
  'AREA ATTREZZATA CON IMPIANTI DI SCARICO': '/img_sign/274.png',
  'POLIZIA STRADALE': '/img_sign/275.png',

  // ═══════════════════════════════════════════════════════════
  // LESSON 7: Segnali Temporanei e di Cantiere
  // ═══════════════════════════════════════════════════════════
  'PREAVVISO DI SEMAFORO TEMPORANEO': '/img_sign/276.png',
  'DIREZIONE CONSIGLIATA AGLI AUTOCARRI': '/img_sign/283.png',
  'DIREZIONE OBBLIGATORIA PER AUTOTRENI ED AUTOARTICOLATI': '/img_sign/284.png',
  'PREAVVISO DI DEVIAZIONE': '/img_sign/282.png',
  'SEGNALE DI CORSIA CHIUSA (CHIUSURA CORSIA DI DESTRA)': '/img_sign/285.png',
  'USO CORSIE DISPONIBILI': '/img_sign/288.png',

  // ═══════════════════════════════════════════════════════════
  // LESSON 8: Segnali Complementari
  // ═══════════════════════════════════════════════════════════
  'BARRIERE NORMALI': '/img_sign/301.png',
  'CONO': '/img_sign/278.png',
  'DELINEATORI NORMALI DI MARGINE PER STRADE A DOPPIO SENSO': '/img_sign/289.png',
  'DELINEATORI NORMALI DI MARGINE PER STRADE A SENSO UNICO': '/img_sign/290.png',
  'DELINEATORI PER GALLERIE A SENSO UNICO': '/img_sign/291.png',
  'DELINEATORE PER STRADE DI MONTAGNA': '/img_sign/292.png',
  'DELINEATORE DI CURVA STRETTA O DI TORNANTE': '/img_sign/293.png',
  'DELINEATORI MODULARI DI CURVA': '/img_sign/295.png',
  'DELINEATORE PER INTERSEZIONE (INCROCIO) A "T"': '/img_sign/294.png',
  'DELINEATORE SPECIALE DI OSTACOLO': '/img_sign/297.png',

  // ═══════════════════════════════════════════════════════════
  // LESSON 9: Pannelli Integrativi dei Segnali
  // ═══════════════════════════════════════════════════════════
  'DISTANZA': '/img_sign/121.png',
  'ESTESA': '/img_sign/129.png',
  'FASCE ORARIE DI TUTTI I GIORNI': '/img_sign/123.png',
  'FASCE ORARIE DEI GIORNI FESTIVI': '/img_sign/125.png',
  'FASCE ORARIE DEI GIORNI LAVORATIVI': '/img_sign/124.png',
  'LIMITAZIONE': '/img_sign/126.png',
  'ECCEZIONE': '/img_sign/127.png',
  'INIZIO': '/img_sign/128.png',
  'CONTINUAZIONE': '/img_sign/130.png',
  'FINE': '/img_sign/131.png',
  'SEGNALE DI CORSIA': '/img_sign/132.png',
  'SEGNI ORIZZONTALI IN RIFACIMENTO': '/img_sign/133.png',
  'INCIDENTE': '/img_sign/134.png',
  'ATTRAVERSAMENTO DI BINARI': '/img_sign/135.png',
  'SGOMBRANEVE IN AZIONE': '/img_sign/136.png',
  'ZONA SOGGETTA AD ALLAGAMENTO': '/img_sign/138.png',
  'CODA': '/img_sign/136.png',
  'MEZZI DI LAVORO IN AZIONE': '/img_sign/137.png',
  'STRADA SDRUCCIOLEVOLE PER GHIACCIO': '/img_sign/142.png',
  'STRADA SDRUCCIOLEVOLE PER PIOGGIA': '/img_sign/140.png',
  'AUTOCARRI IN RALLENTAMENTO': '/img_sign/139.png',
  'ZONA RIMOZIONE COATTA': '/img_sign/141.png',
  'TORNANTE': '/img_sign/143.png',
  'NUMERO DEL TORNANTE': '/img_sign/144.png',
  'PULIZIA MECCANICA DELLA STRADA': '/img_sign/145.png',
  'ANDAMENTO DELLA STRADA PRINCIPALE': '/img_sign/146.png',

  // ═══════════════════════════════════════════════════════════
  // LESSON 10: Semafori e Segnali degli Agenti
  // ═══════════════════════════════════════════════════════════
  'LANTERNA SEMAFORICA VEICOLARE NORMALE': '/img_sign/154.png',
  'LA LUCE ROSSA DEL SEMAFORO': '/img_sign/154.png',
  'QUANDO IL SEMAFORO EMETTE LUCE VERDE NELLA NOSTRA DIREZIONE:': '/img_sign/154.png',
  'LA LUCE GIALLA FISSA DEL SEMAFORO': '/img_sign/154.png',
  'POSSIAMO TROVARE UNA LUCE GIALLA LAMPEGGIANTE': '/img_sign/160.png',
  'LANTERNE SEMAFORICHE GIALLE LAMPEGGIANTI': '/img_sign/160.png',
  'INCONTRANDO IL SEMAFORO A TRE LUCI È CONSENTITO IL PASSAGGIO:': '/img_sign/154.png',
  'SEMAFORI VEICOLARI DI CORSIA': '/img_sign/155.png',
  'LANTERNE SEMAFORICHE PER CORSIE REVERSIBILI': '/img_sign/159.png',
  'SEMAFORO PEDONALE': '/img_sign/157.png',
  'SEMAFORO PER VELOCIPEDI (BICICLETTE)': '/img_sign/158.png',
  'LANTERNE SEMAFORICHE SPECIALI DI ONDA VERDE': '/img_sign/161.png',
  'SEMAFORI PER VEICOLI DI TRASPORTO PUBBLICO': '/img_sign/156.png',
  'LE LUCI ROSSE LAMPEGGIANTI ALTERNATIVAMENTE': '/img_sign/160.png',
  'VIGILE IN POSIZIONE DI ALT': '/img_sign/385.png',
  'VIGILE IN POSIZIONE DI AVANTI': '/img_sign/383.png',
  'VIGILE IN POSIZIONE DI ATTENZIONE': '/img_sign/384.png',
  'VIGILE CON LE BRACCIA DISTESE ORIZZONTALMENTE A 90 GRADI': '/img_sign/386.png',
  'SUONO PROLUNGATO DEL FISCHIETTO DA PARTE DEL VIGILE': '/img_sign/386.png',

  // ═══════════════════════════════════════════════════════════
  // LESSON 11: Segnaletica Orizzontale
  // ═══════════════════════════════════════════════════════════
  'LE STRISCE LUNGO L\'ASSE (IL CENTRO) DELLA CARREGGIATA': '/img_sign/245.png',
  'LA STRISCIA BIANCA CONTINUA': '/img_sign/250.png',
  'LA STRISCIA BIANCA DISCONTINUA (TRATTEGGIATA)': '/img_sign/251.png',
  'IN UNA STRADA A DOPPIO SENSO LA STRISCIA BIANCA DISCONTINUA': '/img_sign/251.png',
  'IN UNA STRADA A SENSO UNICO CON LA STRISCIA BIANCA DISCONTINUA': '/img_sign/251.png',
  'STRISCIA LONGITUDINALE CONTINUA E DISCONTINUA': '/img_sign/250.png',
  'STRISCIA LONGITUDINALE DISCONTINUA E CONTINUA': '/img_sign/250.png',
  'LA DOPPIA STRISCIA CONTINUA': '/img_sign/250.png',
  'STRADA EXTRAURBANA A DOPPIO SENSO CON QUATTRO CORSIE': '/img_sign/245.png',
  'STRADA A TRE CARREGGIATE E OTTO CORSIE': '/img_sign/245.png',
  'LE STRISCE BIANCHE CONTINUE AI MARGINI (BORDI) DELLA CARREGGIATA': '/img_sign/250.png',
  'LE STRISCE BIANCHE LATERALI DISCONTINUE (TRATTEGGIATE)': '/img_sign/251.png',
  'STRISCE DI GUIDA SULLE INTERSEZIONI': '/img_sign/245.png',
  'ZEBRATURE SULLA PAVIMENTAZIONE STRADALE (ISOLA DI TRAFFICO)': '/img_sign/29.png',
  'ATTRAVERSAMENTI PEDONALI (DIRETTI ED OBLIQUI)': '/img_sign/218.png',
  'SIMBOLO DI PASSAGGIO A LIVELLO SULLA PAVIMENTAZIONE (P e L)': '/img_sign/135.png',
  'LA SCRITTA "STOP" SULLA PAVIMENTAZIONE': '/img_sign/41.png',
  'STRISCIA TRASVERSALE CONTINUA': '/img_sign/250.png',
  'CORSIE DI CANALIZZAZIONE': '/img_sign/245.png',
  'FRECCE BIANCHE DIREZIONALI': '/img_sign/245.png',
  'FRECCE DI RIENTRO': '/img_sign/245.png',
  'STRISCIA DI DELIMITAZIONE': '/img_sign/250.png',
  'ISCRIZIONI E SIMBOLI SULLA PAVIMENTAZIONE STRADALE': '/img_sign/245.png',
  'SEGNI GIALLI E NERI': '/img_sign/250.png',
  'SEGNI A STRISCE OBLIQUE BIANCHE E NERE ALTERNATE POSSONO INDICARE:': '/img_sign/250.png',

  // ═══════════════════════════════════════════════════════════
  // LESSON 12: Pericolo, Intralcio e Velocita
  // Theory chapter — headings are NOT sign names → all removed
  // ═══════════════════════════════════════════════════════════

  // ═══════════════════════════════════════════════════════════
  // LESSON 13: Posizione dei Veicoli sulla Carreggiata
  // Theory chapter — headings are NOT sign names → all removed
  // ═══════════════════════════════════════════════════════════

  // ═══════════════════════════════════════════════════════════
  // LESSON 14: Norme sulla Precedenza (Incroci)
  // All headings ARE about precedence rules → 40.png (dare precedenza) is correct
  // ═══════════════════════════════════════════════════════════
  'È OBBLIGATORIO DARE LA PRECEDENZA A DESTRA E A SINISTRA:': '/img_sign/40.png',
  'ORDINE DI PRECEDENZA:': '/img_sign/40.png',
  'ORDINE DI PRECEDENZA: R - A - T.': '/img_sign/40.png',
  'ORDINE DI PRECEDENZA: L - C - H.': '/img_sign/40.png',
  'ORDINE DI PRECEDENZA: R - D - F.': '/img_sign/40.png',
  'ORDINE DI PRECEDENZA: B - T - S.': '/img_sign/40.png',
  'ORDINE DI PRECEDENZA: R - A - C.': '/img_sign/40.png',
  'ORDINE DI PRECEDENZA: E - C - L.': '/img_sign/40.png',
  'ORDINE DI PRECEDENZA: R - B - D - T.': '/img_sign/40.png',
  'ORDINE DI PRECEDENZA: S - B - L - D.': '/img_sign/40.png',
  'ORDINE DI PRECEDENZA: R - D - B.': '/img_sign/40.png',
  'ORDINE DI PRECEDENZA: P - B - C.': '/img_sign/40.png',
  'ORDINE DI PRECEDENZA: A - E - B.': '/img_sign/40.png',
  'ORDINE DI PRECEDENZA: E - C - M.': '/img_sign/40.png',
  'ORDINE DI PRECEDENZA: D - C - A - H.': '/img_sign/40.png',
  'ORDINE DI PRECEDENZA: D - P - B - N.': '/img_sign/40.png',
  'ORDINE DI PRECEDENZA: H - D - B - L.': '/img_sign/40.png',
  'ORDINE DI PRECEDENZA: P - D - B - L.': '/img_sign/40.png',
  'ORDINE DI PRECEDENZA: L - E - N - R.': '/img_sign/40.png',
  'ORDINE DI PRECEDENZA: H - A - F - L.': '/img_sign/40.png',
  'ORDINE DI PRECEDENZA: A - C - L.': '/img_sign/40.png',
  'ORDINE DI PRECEDENZA: H - D - B.': '/img_sign/40.png',
  'ORDINE DI PRECEDENZA: T - P - M.': '/img_sign/40.png',
  'ORDINE DI PRECEDENZA: T - O - A.': '/img_sign/40.png',
  'ORDINE DI PRECEDENZA: T - A - S.': '/img_sign/40.png',
  'ORDINE DI PRECEDENZA: T - G - P - B.': '/img_sign/40.png',
  'ORDINE DI PRECEDENZA: N - A - R.': '/img_sign/40.png',
  'ORDINE DI PRECEDENZA: C - R - A - H.': '/img_sign/40.png',
  'ORDINE DI PRECEDENZA: S - A - E - R.': '/img_sign/40.png',
  'ORDINE DI PRECEDENZA: R - D - A.': '/img_sign/40.png',
  'ORDINE DI PRECEDENZA: B - H - C.': '/img_sign/40.png',
  'ORDINE DI PRECEDENZA: A - E - V - H - C.': '/img_sign/40.png',
  'ORDINE DI PRECEDENZA: C - A - L - R - E.': '/img_sign/40.png',

  // ═══════════════════════════════════════════════════════════
  // LESSON 15: Sorpasso
  // All headings ARE about overtaking → 57.png (divieto di sorpasso) is correct
  // ═══════════════════════════════════════════════════════════
  'SORPASSO': '/img_sign/57.png',
  'LO SPAZIO PER LA MANOVRA DI SORPASSO:': '/img_sign/57.png',
  'NELLA FASE DI RIENTRO DAL SORPASSO BISOGNA:': '/img_sign/57.png',
  'L\'ELEVATA PERICOLOSITÀ DEL SORPASSO È DETERMINATA DA:': '/img_sign/57.png',
  'QUANDO SI VIENE SORPASSATI BISOGNA:': '/img_sign/57.png',
  'IN CASO DI SORPASSO DI NOTTE SU STRADA A DOPPIO SENSO:': '/img_sign/57.png',
  'IL SORPASSO È VIETATO:': '/img_sign/57.png',
  'IL SORPASSO A DESTRA È CONSENTITO:': '/img_sign/57.png',
  'IL SORPASSO IN PROSSIMITÀ DI UN INCROCIO È CONSENTITO:': '/img_sign/57.png',
  'IL SORPASSO IN PROSSIMITÀ DI UN DOSSO È CONSENTITO:': '/img_sign/57.png',

  // ═══════════════════════════════════════════════════════════
  // LESSON 16: Fermata e Sosta
  // All headings ARE about parking/stopping → signs 60/61/86 are relevant
  // ═══════════════════════════════════════════════════════════
  'LA FERMATA': '/img_sign/61.png',
  'LA SOSTA': '/img_sign/60.png',
  'LA SOSTA È VIETATA': '/img_sign/60.png',
  'LA SOSTA DI AUTOVEICOLI IN DOPPIA FILA': '/img_sign/60.png',
  'IL DIVIETO DI SOSTA PUÒ ESSERE SEGNALATO CON:': '/img_sign/60.png',
  'UN PARCHEGGIO AUTORIZZATO': '/img_sign/86.png',
  'PER ARRESTARE IL VEICOLO NEL MINOR SPAZIO POSSIBILE OCCORRE:': '/img_sign/61.png',
  'LO SPAZIO MINIMO DI ARRESTO DI UN VEICOLO:': '/img_sign/61.png',
  'ALLA PARTENZA DAL MARGINE DELLA CARREGGIATA OCCORRE:': '/img_sign/61.png',
  'IL VEICOLO S MUOVENDOSI IN RETROMARCIA DEVE:': '/img_sign/61.png',

  // ═══════════════════════════════════════════════════════════
  // LESSON 17: Ingombro della Carreggiata
  // Both headings are about road obstruction signs → relevant
  // ═══════════════════════════════════════════════════════════
  'INGOMBRO DELLA CARREGGIATA': '/img_sign/39.png',
  'SEGNALE MOBILE TRIANGOLARE DI PERICOLO': '/img_sign/276.png',

  // ═══════════════════════════════════════════════════════════
  // LESSON 18: Circolazione sulle Strade Extraurbane
  // All headings ARE about highway/motorway rules → 184/194 are relevant
  // ═══════════════════════════════════════════════════════════
  'STRADA EXTRAURBANA PRINCIPALE': '/img_sign/194.png',
  'AUTOSTRADA': '/img_sign/184.png',
  'SONO AMMESSI A CIRCOLARE IN AUTOSTRADA:': '/img_sign/184.png',
  'SONO ESCLUSI DALLA CIRCOLAZIONE IN AUTOSTRADA:': '/img_sign/184.png',
  'NELLE AUTOSTRADE È VIETATO:': '/img_sign/184.png',
  'VEDENDO UN AUTOMOBILISTA IN PANNE (DIFFICOLTÀ) NELLA CORSIA DI E-': '/img_sign/184.png',
  'MERGENZA': '/img_sign/184.png',

  // ═══════════════════════════════════════════════════════════
  // LESSON 19: Dispositivi di Equipaggiamento
  // Most headings about vehicle lights/maintenance → NOT sign images
  // Kept only: ACCENSIONE DELLE LUCI (154=traffic light, about lights),
  // NEI/FUORI CENTRI ABITATI (road signs), DISPOSITIVI DI SEGNALAZIONE ACUSTICA (59=horn sign)
  // ═══════════════════════════════════════════════════════════
  'ACCENSIONE DELLE LUCI': '/img_sign/154.png',
  'NEI CENTRI ABITATI': '/img_sign/207.png',
  'FUORI DEI CENTRI ABITATI': '/img_sign/194.png',
  'DISPOSITIVI DI SEGNALAZIONE ACUSTICA (CLACSON, TROMBE)': '/img_sign/59.png',

  // ═══════════════════════════════════════════════════════════
  // LESSON 20: Spie e Simboli sui Comandi
  // Dashboard symbols — NOT road signs → all removed
  // ═══════════════════════════════════════════════════════════

  // ═══════════════════════════════════════════════════════════
  // LESSON 21: Cinture di Sicurezza e Airbag
  // Safety equipment — NOT road signs → all removed
  // ═══════════════════════════════════════════════════════════

  // ═══════════════════════════════════════════════════════════
  // LESSON 22: Trasporto di Persone e Carico
  // Keep only: vehicle panel signs (301-304), cantieri (280), traino (275)
  // Remove: TRASPORTO DI PERSONE (not a sign topic)
  // ═══════════════════════════════════════════════════════════
  'IL CARICO DEVE ESSERE SISTEMATO SUL VEICOLO IN MODO DA:': '/img_sign/302.png',
  'SPOSTAMENTO DEL CARICO IN AVANTI': '/img_sign/302.png',
  'PANNELLO PER CARICHI SPORGENTI': '/img_sign/302.png',
  'PANNELLI ARANCIONI PER TRASPORTO MERCI PERICOLOSE': '/img_sign/303.png',
  'PANNELLI POSTERIORI PER AUTOVEICOLI ADIBITI AL TRASPORTO DI COSE DI': '/img_sign/304.png',
  'MASSA A PIENO CARICO OLTRE 3,5 T.': '/img_sign/304.png',
  'PANNELLI POSTERIORI PER RIMORCHI E SEMIRIMORCHI ADIBITI AL TRA-': '/img_sign/304.png',
  'SPORTO COSE DI MASSA A PIENO CARICO OLTRE 3,5 T.': '/img_sign/304.png',
  'SEGNALI DI VELOCITÀ DA APPLICARE SUI VEICOLI': '/img_sign/301.png',
  'PANNELLO APPLICATO SUI VEICOLI OPERATRICI': '/img_sign/301.png',
  'PRESEGNALE DI CANTIERE MOBILE': '/img_sign/280.png',
  'IL TRAINO DI UN VEICOLO IN AVARIA (GUASTO)': '/img_sign/275.png',

  // ═══════════════════════════════════════════════════════════
  // LESSON 23: Patenti di Guida
  // License topics — NOT road signs → all removed
  // ═══════════════════════════════════════════════════════════

  // ═══════════════════════════════════════════════════════════
  // LESSON 24: Obblighi e Documenti di Guida
  // Keep only: police-related headings (275=polizia)
  // Remove: USO DELLE LENTI (not a sign topic)
  // ═══════════════════════════════════════════════════════════
  'CIÒ CHE CONTRADDISTINGUE GLI ADDETTI AL SERVIZIO DI POLIZIA È:': '/img_sign/275.png',
  'DOCUMENTI DA ESIBIRE AGLI AGENTI:': '/img_sign/275.png',

  // ═══════════════════════════════════════════════════════════
  // LESSON 25: Cause di Incidenti Stradali
  // Keep relevant: weather signs (37), slippery road (24), gallery (13),
  // pedestrian (15), lanes (245), no overtaking (57), intersection (10),
  // speed (58), traffic light (154 for the actual traffic light heading)
  // Remove: fog (154=traffic light is wrong for fog topic)
  // ═══════════════════════════════════════════════════════════
  'CAUSE PRINCIPALI DI INCIDENTI POSSONO ESSERE:': '/img_sign/39.png',
  'PER EVITARE IL PRODURSI DI INCIDENTI BISOGNA CONTROLLARE:': '/img_sign/39.png',
  'IN CASO DI MAL TEMPO PRIMA DI PARTIRE BISOGNA:': '/img_sign/37.png',
  'CONDIZIONI AVVERSE DEL TEMPO': '/img_sign/37.png',
  'IN CASO DI PIOGGIA OCCORRE:': '/img_sign/24.png',
  'SU STRADA SDRUCCIOLEVOLE, COPERTA DI NEVE O GHIACCIO BISOGNA:': '/img_sign/24.png',
  'IN CASO DI FORTE VENTO LATERALE È OPPORTUNO:': '/img_sign/37.png',
  'ALL\'INGRESSO E ALL\'USCITA DELLE GALLERIE È OPPORTUNO:': '/img_sign/13.png',
  'L\'USO CORRETTO DELLA STRADA COMPORTA CHE:': '/img_sign/245.png',
  'SU TUTTE LE STRADE È VIETATO:': '/img_sign/57.png',
  'SE, GIUNGENDO AD UN INCROCIO, SI SBAGLIA CORSIA OCCORRE:': '/img_sign/10.png',
  'ALLA LUCE VERDE DEL SEMAFORO SE UN VEICOLO TARDA A RIPARTIRE BISO-': '/img_sign/154.png',
  'CHI GUIDA UN VEICOLO AD ELEVATE PRESTAZIONI DEVE COMUNQUE:': '/img_sign/58.png',
  'IN CASO DI TRAFFICO INTENSO IL CONDUCENTE DEVE:': '/img_sign/58.png',
  'SE UN PEDONE, FUORI DELLE STRISCE, NON CI DA LA PRECEDENZA BISOGNA:': '/img_sign/15.png',

  // ═══════════════════════════════════════════════════════════
  // LESSON 26: Comportamento in Caso di Incidente
  // Keep: accident-related (220=SOS) and police (275) headings
  // Remove: insurance/civil responsibility headings (no relevant sign)
  // ═══════════════════════════════════════════════════════════
  'IN CASO DI INCIDENTE STRADALE IL CONDUCENTE DEVE:': '/img_sign/220.png',
  'DOPO UN INCIDENTE STRADALE OCCORRE:': '/img_sign/220.png',
  'PER INDIVIDUARE PERSONE E/O VEICOLI COINVOLTI IN UN INCIDENTE': '/img_sign/220.png',
  'PER INDIVIDUARE I TESTIMONI PRESENTI AL SINISTRO (INCIDENTE STRADALE)': '/img_sign/220.png',
  'DOPO UN INCIDENTE STRADALE SI DEVE CHIAMARE LA POLIZIA:': '/img_sign/275.png',

  // ═══════════════════════════════════════════════════════════
  // LESSON 27: Stato Fisico ed Effetti dell'Alcool
  // Keep: first aid headings (210=pronto soccorso), danger (39)
  // Remove: fatigue/drug/alcohol/SOS headings (no relevant sign)
  // ═══════════════════════════════════════════════════════════
  'IL MANCATO SENSO DEL PERICOLO DURANTE LA GUIDA PUÒ ESSERE DATO DA:': '/img_sign/39.png',
  'PRIMO SOCCORSO': '/img_sign/210.png',
  'CORPO ESTRANEO IN UN OCCHIO': '/img_sign/210.png',
  'FRATTURA AGLI ARTI (GAMBE O BRACCIA)': '/img_sign/210.png',
  'USTIONI (BRUCIATURE)': '/img_sign/210.png',
  'FERITA SANGUINANTE (EMORRAGIA)': '/img_sign/210.png',
  'STATO DI SHOCK': '/img_sign/210.png',
  'TRAUMA ALLA GABBIA TORACICA': '/img_sign/210.png',
  'STATO DI INCOSCIENZA': '/img_sign/210.png',

  // ═══════════════════════════════════════════════════════════
  // LESSON 28: Consumi e Inquinamento
  // Fuel (254) and noise/horn (59) signs are somewhat relevant → keep
  // ═══════════════════════════════════════════════════════════
  'PER LIMITARE I CONSUMI DI CARBURANTE OCCORRE:': '/img_sign/254.png',
  'INQUINAMENTO ATMOSFERICO PRODOTTO DAI VEICOLI': '/img_sign/254.png',
  'INQUINAMENTO PRODOTTO DAI VEICOLI CON MOTORE A SCOPPIO (BENZINA)': '/img_sign/254.png',
  'L\'INQUINAMENTO PRODOTTO DAI VEICOLI CON MOTORE A SCOPPIO (BENZI-': '/img_sign/254.png',
  'NA) DIPENDE': '/img_sign/254.png',
  'L\'INQUINAMENTO ATMOSFERICO PRODOTTO DAI VEICOLI CON MOTORE DIESEL': '/img_sign/254.png',
  'SONO CAUSA DI RUMORE:': '/img_sign/59.png',
  'INQUINAMENTO DA RUMORE': '/img_sign/59.png',
  'PER RIDURRE IL RUMORE È NECESSARIO:': '/img_sign/59.png',

  // ═══════════════════════════════════════════════════════════
  // LESSON 29: Elementi Costitutivi del Veicolo
  // Vehicle parts (tires, brakes, steering) — NOT road signs → all removed
  // ═══════════════════════════════════════════════════════════

  // ═══════════════════════════════════════════════════════════
  // LESSON 30: Stabilita e Tenuta di Strada
  // Vehicle stability topics — NOT road signs → all removed
  // ═══════════════════════════════════════════════════════════
};

// Lesson-specific image overrides (same heading, different image per lesson)
const LESSON_IMAGE_OVERRIDE: Record<string, Record<string, string>> = {
  2: { 'LAVORI': '/img_sign/13.png' },      // Lesson 2: danger sign for road works
  6: { 'ATTRAVERSAMENTO PEDONALE': '/img_sign/218.png', 'ATTRAVERSAMENTO CICLABILE': '/img_sign/236.png' },
  7: { 'LAVORI': '/img_sign/279.png' },     // Lesson 7: temporary works sign
};

// EXACT MATCH with fallback to continuation heading detection
function getSignImage(heading: string, lessonId?: number): string | null {
  if (!heading) return null;
  // 0. Check lesson-specific overrides first
  if (lessonId && LESSON_IMAGE_OVERRIDE[lessonId]?.[heading]) {
    return LESSON_IMAGE_OVERRIDE[lessonId][heading];
  }
  // 1. Exact match first
  if (HEADING_SIGN_IMAGE[heading]) return HEADING_SIGN_IMAGE[heading];
  // 2. Check if heading is a continuation (starts with common prefixes)
  const h = heading.trim().toUpperCase();
  if (h.startsWith('LI DI CONTAMINARE')) return '/img_sign/72.png';
  if (h.startsWith('2,30 METRI')) return '/img_sign/76.png';
  if (h.startsWith('METRI')) return '/img_sign/77.png';
  if (h.startsWith('LUNGHEZZA')) return '/img_sign/77.png';
  if (h.startsWith('NEVE)')) return '/img_sign/189.png';
  if (h.startsWith('TO PER UNA CATEGORIA')) return '/img_sign/169.png';
  if (h.startsWith('LIVELLO SU UN RAMO')) return '/img_sign/170.png';
  if (h.startsWith('NA) DIPENDE')) return '/img_sign/254.png';
  if (h.startsWith('MASSA A PIENO')) return '/img_sign/304.png';
  if (h.startsWith('SPORTO COSE')) return '/img_sign/304.png';
  // 3. Fallback: match by first word for generic categorization
  if (h.startsWith('ORDINE DI PRECEDENZA')) return '/img_sign/40.png';
  if (h.startsWith('LIMITI MASSIMI')) return '/img_sign/193.png';
  return null;
}

// ============================================================
// LESSON INDEX - 30 lessons from the official theory book
// "Manuale di Teoria per le patenti A1, A e B"
// by Valerio Platia & Roberto Mastri
// ============================================================

interface BookLesson {
  id: number;
  title: string;
  shortTitle: string;
  icon: string;
  hasImages: boolean;
}

interface Section {
  heading: string | null;
  paragraphs: string[];
  images: string[];
}

const LESSONS: BookLesson[] = [
  { id: 1, title: 'Definizioni Stradali e di Traffico', shortTitle: 'تعريفات الطرق', icon: '📖', hasImages: false },
  { id: 2, title: 'Segnali di Pericolo', shortTitle: 'إشارات الخطر', icon: '⚠️', hasImages: true },
  { id: 3, title: 'Segnali di Precedenza', shortTitle: 'إشارات الأسبقية', icon: '🔻', hasImages: true },
  { id: 4, title: 'Segnali di Divieto', shortTitle: 'إشارات المنع', icon: '🚫', hasImages: true },
  { id: 5, title: 'Segnali di Obbligo', shortTitle: 'إشارات الإلزام', icon: '🔵', hasImages: true },
  { id: 6, title: 'Segnali di Indicazione', shortTitle: 'إشارات الدلالة', icon: '📋', hasImages: true },
  { id: 7, title: 'Segnali Temporanei e di Cantiere', shortTitle: 'إشارات مؤقتة', icon: '🚧', hasImages: true },
  { id: 8, title: 'Segnali Complementari', shortTitle: 'إشارات مكملة', icon: '📌', hasImages: true },
  { id: 9, title: 'Pannelli Integrativi dei Segnali', shortTitle: 'لوحات تكميلية', icon: '🏷️', hasImages: true },
  { id: 10, title: 'Semafori e Segnali degli Agenti', shortTitle: 'إشارات المرور', icon: '🚦', hasImages: true },
  { id: 11, title: 'Segnaletica Orizzontale', shortTitle: 'الشارات الأفقية', icon: '➖', hasImages: true },
  { id: 12, title: 'Pericolo, Intralcio e Velocita', shortTitle: 'الخطر والسرعة', icon: '⚡', hasImages: false },
  { id: 13, title: 'Posizione dei Veicoli sulla Carreggiata', shortTitle: 'موقع المركبات', icon: '🚗', hasImages: false },
  { id: 14, title: 'Norme sulla Precedenza (Incroci)', shortTitle: 'قواعد الأسبقية', icon: '↔️', hasImages: true },
  { id: 15, title: 'Sorpasso', shortTitle: 'التجاوز', icon: '🔄', hasImages: false },
  { id: 16, title: 'Fermata e Sosta', shortTitle: 'التوقف والانتظار', icon: '🅿️', hasImages: true },
  { id: 17, title: 'Ingombro della Carreggiata', shortTitle: 'سد الطريق', icon: '🚷', hasImages: false },
  { id: 18, title: 'Circolazione sulle Strade Extraurbane', shortTitle: 'الطرق الخارجية', icon: '🛣️', hasImages: false },
  { id: 19, title: 'Dispositivi di Equipaggiamento', shortTitle: 'أجهزة المركبات', icon: '💡', hasImages: true },
  { id: 20, title: 'Spie e Simboli sui Comandi', shortTitle: 'مؤشرات القيادة', icon: '🎛️', hasImages: true },
  { id: 21, title: 'Cinture di Sicurezza e Airbag', shortTitle: 'الأحزمة والأكياس الهوائية', icon: '🛡️', hasImages: false },
  { id: 22, title: 'Trasporto di Persone e Carico', shortTitle: 'نقل الأشخاص والأحمال', icon: '📦', hasImages: true },
  { id: 23, title: 'Patenti di Guida', shortTitle: 'رخص القيادة', icon: '🪪', hasImages: false },
  { id: 24, title: 'Obblighi e Documenti di Guida', shortTitle: 'وثائق القيادة', icon: '📋', hasImages: false },
  { id: 25, title: 'Cause di Incidenti Stradali', shortTitle: 'أسباب الحوادث', icon: '💥', hasImages: false },
  { id: 26, title: 'Comportamento in Caso di Incidente', shortTitle: 'التصرف عند الحوادث', icon: '🚑', hasImages: false },
  { id: 27, title: "Stato Fisico ed Effetti dell'Alcool", shortTitle: 'الكحول والقيادة', icon: '🍺', hasImages: false },
  { id: 28, title: 'Consumi e Inquinamento', shortTitle: 'الاستهلاك والتلوث', icon: '🌱', hasImages: false },
  { id: 29, title: 'Elementi Costitutivi del Veicolo', shortTitle: 'أجزاء المركبة', icon: '🔧', hasImages: false },
  { id: 30, title: 'Stabilita e Tenuta di Strada', shortTitle: 'ثبات المركبة', icon: '🎯', hasImages: false },
];

// ============================================================
// COLORS per lesson category (signs vs theory)
// ============================================================
function getLessonColor(lessonId: number): string {
  if (lessonId >= 2 && lessonId <= 9) return '#EF4444';    // Signs: red
  if (lessonId >= 10 && lessonId <= 11) return '#F59E0B';   // Traffic lights, horizontal: amber
  if (lessonId >= 12 && lessonId <= 18) return '#3B82F6';   // Driving rules: blue
  if (lessonId >= 19 && lessonId <= 20) return '#8B5CF6';   // Vehicle equipment: purple
  if (lessonId >= 21 && lessonId <= 22) return '#059669';   // Safety: green
  if (lessonId >= 23 && lessonId <= 24) return '#6366F1';   // License/docs: indigo
  if (lessonId >= 25 && lessonId <= 28) return '#EC4899';   // Incidents: pink
  return '#4F46E5'; // Definitions, vehicle parts: default indigo
}

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function TheoryBookScreen() {
  const store = useStore();
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  // Per-section translations: secIdx -> translation string
  const [arabicTranslations, setArabicTranslations] = useState<Record<number, string>>({});
  const [translatingSection, setTranslatingSection] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  // Per-section visibility of translation
  const [visibleTranslations, setVisibleTranslations] = useState<Set<number>>(new Set());
  const [translationError, setTranslationError] = useState<string | null>(null);
  const [playingSection, setPlayingSection] = useState<number | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const stopRef = useRef(false);
  const cancelTokenRef = useRef({ cancelled: false });

  // Load lesson content when selected
  useEffect(() => {
    if (selectedLesson === null) {
      setSections([]);
      setArabicTranslations({});
      return;
    }

    setLoading(true);
    setArabicTranslations({});
    setVisibleTranslations(new Set());
    setTranslationError(null);
    stopSpeech();
    setPlayingSection(null);

    fetch('/bookLessonsStructured.json')
      .then(r => r.json())
      .then((lessons) => {
        const lesson = (lessons as any[]).find((l: any) => l.id === selectedLesson);
        if (lesson && lesson.sections) {
          setSections(lesson.sections);
        }
        setLoading(false);
      })
      .catch(() => {
        // Fallback to old format
        fetch('/bookLessons.json')
          .then(r => r.json())
          .then((lessons) => {
            const lesson = (lessons as any[]).find((l: any) => l.id === selectedLesson);
            if (lesson) {
              const fallbackSections: Section[] = [{
                heading: null,
                paragraphs: lesson.content.split('\n').filter((p: string) => p.trim()),
                images: lesson.images || [],
              }];
              setSections(fallbackSections);
            }
            setLoading(false);
          })
          .catch(() => setLoading(false));
      });
  }, [selectedLesson]);

  // Scroll to top when lesson changes
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [selectedLesson]);

  // Cleanup speech on unmount
  useEffect(() => {
    return () => { stopSpeech(); };
  }, []);

  // ============================================================
  // TTS - speak a full section (chunked sequential playback)
  // FIX: Removed the broken isSpeaking() check between chunks
  // ============================================================
  const handleSpeakSection = useCallback(async (sectionIdx: number) => {
    const section = sections[sectionIdx];
    if (!section) return;

    const text = [
      ...(section.heading ? [section.heading] : []),
      ...section.paragraphs,
    ].join('. ');

    if (!text.trim()) return;

    // Toggle if already playing this section
    if (playingSection === sectionIdx) {
      cancelTokenRef.current.cancelled = true;
      stopSpeech();
      setPlayingSection(null);
      return;
    }

    stopSpeech();
    stopRef.current = false;
    cancelTokenRef.current.cancelled = false;
    setPlayingSection(sectionIdx);

    // Use speakContinuous - Web Speech only, no voice switching
    await speakContinuous(text, 'it-IT', cancelTokenRef.current);
    setPlayingSection(null);
  }, [sections, playingSection]);

  // Stop all speech
  const handleStopAll = useCallback(() => {
    cancelTokenRef.current.cancelled = true;
    stopSpeech();
    setPlayingSection(null);
  }, []);

  // ============================================================
  // CLIENT-SIDE GOOGLE TRANSLATE FALLBACK
  // When the server API fails, translate directly from client
  // ============================================================
  // ============================================================
  // PER-SECTION TRANSLATION (server-side Google Translate proxy)
  // ============================================================
  const handleTranslateSection = useCallback(async (sectionIdx: number) => {
    // If already translated, toggle visibility
    if (arabicTranslations[sectionIdx]) {
      setVisibleTranslations(prev => {
        const next = new Set(prev);
        if (next.has(sectionIdx)) {
          next.delete(sectionIdx);
        } else {
          next.add(sectionIdx);
        }
        return next;
      });
      return;
    }

    const section = sections[sectionIdx];
    if (!section) return;

    const text = [
      ...(section.heading ? [section.heading] : []),
      ...section.paragraphs,
    ].join('\n');

    if (text.length < 20) return;

    setTranslatingSection(sectionIdx);
    setTranslationError(null);

    // Helper to save and show a successful translation
    const showTranslation = (translation: string) => {
      setArabicTranslations(prev => ({ ...prev, [sectionIdx]: translation }));
      setVisibleTranslations(prev => {
        const next = new Set(prev);
        next.add(sectionIdx);
        return next;
      });
    };

    try {
      // METHOD 1: Server API (ZAI SDK + Google Translate fallback)
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'translateText',
          text: text.substring(0, 3000),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.translation && data.translation.length > 5) {
          showTranslation(data.translation);
          setTranslatingSection(null);
          return;
        }
      }

      // METHOD 2: Server-side Google Translate proxy (no CORS issues)
      console.log('[Translation] Server AI failed, trying server-side Google Translate');
      const translateRes = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: text.substring(0, 3000),
          from: 'it',
          to: 'ar',
        }),
      });

      if (translateRes.ok) {
        const translateData = await translateRes.json();
        if (translateData.translation && translateData.translation.length > 5) {
          showTranslation(translateData.translation);
          setTranslatingSection(null);
          return;
        }
      }

      setTranslationError('فشلت الترجمة، تحقق من الإنترنت وحاول مرة أخرى');
    } catch (e) {
      console.error('Translation error for section', sectionIdx, ':', e);

      // Last resort: try server-side Google Translate even on network error
      try {
        const translateRes = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: text.substring(0, 3000),
            from: 'it',
            to: 'ar',
          }),
        });

        if (translateRes.ok) {
          const translateData = await translateRes.json();
          if (translateData.translation && translateData.translation.length > 5) {
            showTranslation(translateData.translation);
            setTranslatingSection(null);
            return;
          }
        }
      } catch { /* ignore */ }

      setTranslationError('فشل الاتصال، تحقق من الإنترنت وحاول مرة أخرى');
    }

    setTranslatingSection(null);
  }, [sections, arabicTranslations]);

  // ============================================================
  // LESSON LIST VIEW
  // ============================================================
  if (selectedLesson === null) {
    return (
      <div className="min-h-screen bg-mesh pb-8">
        {/* Header */}
        <div className="sticky top-0 z-30 glass-header">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 py-3.5 flex items-center gap-3">
            <button onClick={() => store.goHome()}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl transition-colors"
              style={{ color: 'var(--text-secondary)', background: 'var(--bg-secondary)' }}>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Indietro
            </button>
            <div className="flex-1 text-center">
              <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                Libro di Teoria
              </span>
            </div>
            <div className="w-16" />
          </div>
        </div>

        {/* Book Info */}
        <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-5">
          <div className="card p-5 mb-5 anim-up" style={{ animationDelay: '0ms' }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                style={{ background: 'rgba(79, 70, 229, 0.1)' }}>
                📘
              </div>
              <div>
                <h2 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                  Manuale di Teoria
                </h2>
                <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                  Patenti A1, A e B — Valerio Platia & Roberto Mastri
                </p>
              </div>
            </div>
            <div className="flex gap-4 text-[11px]" style={{ color: 'var(--text-muted)' }}>
              <span>30 Lezioni</span>
              <span>128 Pagine</span>
              <span>327 Figure</span>
            </div>
          </div>
        </div>

        {/* Lesson Grid */}
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {LESSONS.map((lesson, idx) => (
              <button key={lesson.id}
                onClick={() => setSelectedLesson(lesson.id)}
                className="card p-4 text-left transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] anim-up"
                style={{ animationDelay: `${idx * 30}ms` }}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center text-base flex-shrink-0"
                    style={{ background: 'var(--bg-tertiary)' }}>
                    {lesson.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                        style={{ background: 'rgba(79, 70, 229, 0.1)', color: '#4F46E5' }}>
                        {lesson.id}
                      </span>
                      {lesson.hasImages && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded"
                          style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#059669' }}>
                          FIGURE
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-semibold mt-0.5 truncate" style={{ color: 'var(--text-primary)' }}
                      dir="ltr">
                      {lesson.title}
                    </p>
                    <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }} dir="rtl">
                      {lesson.shortTitle}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // LESSON DETAIL VIEW
  // ============================================================
  const lesson = LESSONS.find(l => l.id === selectedLesson)!;
  const prevLesson = selectedLesson > 1 ? selectedLesson - 1 : null;
  const nextLesson = selectedLesson < 30 ? selectedLesson + 1 : null;
  const lessonColor = getLessonColor(selectedLesson);

  return (
    <div className="min-h-screen bg-mesh pb-8">
      {/* Header */}
      <div className="sticky top-0 z-30 glass-header">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-3.5 flex items-center gap-3">
          <button onClick={() => { setSelectedLesson(null); handleStopAll(); }}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl transition-colors"
            style={{ color: 'var(--text-secondary)', background: 'var(--bg-secondary)' }}>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Lezioni
          </button>
          <div className="flex-1 min-w-0 text-center">
            <span className="text-[10px] font-bold block" style={{ color: lessonColor }}>
              Lezione {lesson.id}/30
            </span>
            <p className="text-xs font-bold truncate" style={{ color: 'var(--text-primary)' }} dir="ltr">
              {lesson.title}
            </p>
          </div>
          {playingSection !== null && (
            <button onClick={handleStopAll}
              className="flex items-center gap-1 text-xs font-semibold px-2 py-1.5 rounded-lg transition-colors"
              style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444' }}>
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            </button>
          )}
          <div className="w-12" />
        </div>
      </div>

      {/* Content */}
      <div ref={contentRef} className="max-w-2xl mx-auto px-4 sm:px-6 pt-5 space-y-5">

        {/* Lesson Title Card */}
        <div className="card p-5 anim-up" style={{ borderColor: `${lessonColor}22` }}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
              style={{ background: `${lessonColor}15`, border: `2px solid ${lessonColor}30` }}>
              {lesson.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-bold leading-tight" style={{ color: 'var(--text-primary)' }} dir="ltr">
                Lezione {lesson.id}. {lesson.title}
              </h1>
              <p className="text-sm font-semibold mt-0.5" style={{ color: lessonColor }} dir="rtl">
                {lesson.shortTitle}
              </p>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="card p-8 flex flex-col items-center gap-3">
            <svg className="w-6 h-6 animate-spin" style={{ color: lessonColor }} fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Caricamento lezione...</span>
          </div>
        )}

        {/* Sections */}
        {!loading && sections.map((section, secIdx) => {
          const isIntroSection = !section.heading;
          const isPlaying = playingSection === secIdx;
          const hasTranslation = !!arabicTranslations[secIdx];
          const showTranslation = visibleTranslations.has(secIdx);
          const isTranslatingThis = translatingSection === secIdx;

          return (
            <div key={secIdx} className="anim-up" style={{ animationDelay: `${Math.min(secIdx * 50, 300)}ms` }}>
              <div className="card overflow-hidden" style={{
                borderColor: section.heading ? `${lessonColor}22` : undefined,
              }}>

                {/* ─── SIGN / TOPIC HEADER (large, prominent) ─── */}
                {section.heading && (
                  <div
                    className="px-5 py-4"
                    style={{
                      background: `linear-gradient(135deg, ${lessonColor}12 0%, ${lessonColor}05 100%)`,
                      borderBottom: `2px solid ${lessonColor}20`,
                    }}>
                    {/* Main heading + image */}
                    <div className="flex items-start gap-4">
                      {/* Only show clean sign image from /img_sign/ when matched; otherwise show generic icon */}
                      {(() => {
                        const signImg = getSignImage(section.heading || '', selectedLesson);
                        if (signImg) {
                          return (
                            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden flex-shrink-0 border-2 bg-white"
                              style={{ borderColor: `${lessonColor}30` }}>
                              <img
                                src={signImg}
                                alt={section.heading || ''}
                                className="w-full h-full object-contain p-1.5"
                                loading="lazy"
                                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                              />
                            </div>
                          );
                        }
                        // No sign image match → show generic category icon placeholder
                        return (
                          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl flex-shrink-0 flex items-center justify-center border-2"
                            style={{ background: `${lessonColor}08`, borderColor: `${lessonColor}18` }}>
                            <span className="text-4xl sm:text-5xl opacity-40">{lesson.icon}</span>
                          </div>
                        );
                      })()}

                      {/* Heading text - LARGE & BOLD like the book */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md"
                            style={{ background: `${lessonColor}18`, color: lessonColor }}>
                            {secIdx + 1}
                          </span>
                        </div>
                        <h2 className="text-xl sm:text-2xl font-extrabold leading-tight tracking-tight"
                          style={{ color: lessonColor }}
                          dir="ltr">
                          {section.heading}
                        </h2>
                      </div>
                    </div>

                    {/* Action buttons row: Play + Translate */}
                    <div className="flex items-center gap-2 mt-3">
                      {/* TTS Play button */}
                      <button
                        onClick={() => handleSpeakSection(secIdx)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all duration-200 hover:scale-105 active:scale-95"
                        style={{
                          background: isPlaying ? 'rgba(239, 68, 68, 0.12)' : `${lessonColor}15`,
                          border: `1px solid ${isPlaying ? 'rgba(239, 68, 68, 0.25)' : `${lessonColor}25`}`,
                          color: isPlaying ? '#EF4444' : lessonColor,
                        }}>
                        {isPlaying ? (
                          <svg className="w-3.5 h-3.5 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                            <rect x="6" y="4" width="4" height="16" rx="1" />
                            <rect x="14" y="4" width="4" height="16" rx="1" />
                          </svg>
                        ) : (
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                          </svg>
                        )}
                        {isPlaying ? 'إيقاف' : 'استمع 🇮🇹'}
                      </button>

                      {/* Translate button */}
                      <button
                        onClick={() => handleTranslateSection(secIdx)}
                        disabled={isTranslatingThis}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-60"
                        style={{
                          background: hasTranslation
                            ? (showTranslation ? 'rgba(16, 185, 129, 0.12)' : 'rgba(16, 185, 129, 0.05)')
                            : 'rgba(79, 70, 229, 0.1)',
                          border: `1px solid ${hasTranslation
                            ? (showTranslation ? 'rgba(16, 185, 129, 0.25)' : 'rgba(16, 185, 129, 0.15)')
                            : 'rgba(79, 70, 229, 0.2)'}`,
                          color: hasTranslation ? '#059669' : '#4F46E5',
                        }}>
                        {isTranslatingThis ? (
                          <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                        ) : (
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802" />
                          </svg>
                        )}
                        {isTranslatingThis
                          ? 'جاري الترجمة...'
                          : hasTranslation
                            ? (showTranslation ? 'إخفاء الترجمة' : 'عرض الترجمة')
                            : 'ترجمة عربي'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Book scan gallery removed — only clean /img_sign/ images shown when matched */}

                {/* ─── SECTION CONTENT (paragraphs) ─── */}
                {section.paragraphs.length > 0 && (
                  <div className="p-5 space-y-3" dir="ltr">
                    {section.paragraphs.map((para, pIdx) => (
                      <p key={pIdx} className="text-[13px] leading-[1.9]" style={{ color: 'var(--text-secondary)' }}>
                        {para}
                      </p>
                    ))}
                  </div>
                )}

                {/* ─── INTRO SECTION: Play button for text without heading ─── */}
                {isIntroSection && section.paragraphs.length > 0 && (
                  <div className="px-5 pb-4">
                    <button
                      onClick={() => handleSpeakSection(secIdx)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all duration-200 hover:scale-105 active:scale-95"
                      style={{
                        background: isPlaying ? 'rgba(239, 68, 68, 0.12)' : `${lessonColor}15`,
                        border: `1px solid ${isPlaying ? 'rgba(239, 68, 68, 0.25)' : `${lessonColor}25`}`,
                        color: isPlaying ? '#EF4444' : lessonColor,
                      }}>
                      {isPlaying ? (
                        <svg className="w-3.5 h-3.5 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                          <rect x="6" y="4" width="4" height="16" rx="1" />
                          <rect x="14" y="4" width="4" height="16" rx="1" />
                        </svg>
                      ) : (
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                        </svg>
                      )}
                      {isPlaying ? 'إيقاف' : 'استمع 🇮🇹'}
                    </button>

                    {/* Translate button for intro */}
                    <button
                      onClick={() => handleTranslateSection(secIdx)}
                      disabled={translatingSection === secIdx}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-60 ml-2"
                      style={{
                        background: arabicTranslations[secIdx]
                          ? (visibleTranslations.has(secIdx) ? 'rgba(16, 185, 129, 0.12)' : 'rgba(16, 185, 129, 0.05)')
                          : 'rgba(79, 70, 229, 0.1)',
                        border: `1px solid ${arabicTranslations[secIdx]
                          ? (visibleTranslations.has(secIdx) ? 'rgba(16, 185, 129, 0.25)' : 'rgba(16, 185, 129, 0.15)')
                          : 'rgba(79, 70, 229, 0.2)'}`,
                        color: arabicTranslations[secIdx] ? '#059669' : '#4F46E5',
                      }}>
                      {translatingSection === secIdx ? (
                        <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                      ) : (
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802" />
                        </svg>
                      )}
                      {translatingSection === secIdx
                        ? 'جاري الترجمة...'
                        : arabicTranslations[secIdx]
                          ? (visibleTranslations.has(secIdx) ? 'إخفاء الترجمة' : 'عرض الترجمة')
                          : 'ترجمة عربي'}
                    </button>
                  </div>
                )}

                {/* ─── TRANSLATION ERROR ─── */}
                {translationError && translatingSection === null && !arabicTranslations[secIdx] && (
                  <div className="px-5 pb-3">
                    <div className="text-[11px] font-medium px-3 py-2 rounded-lg"
                      style={{ background: 'rgba(239, 68, 68, 0.08)', color: '#EF4444', border: '1px solid rgba(239, 68, 68, 0.15)' }}>
                      {translationError}
                    </div>
                  </div>
                )}

                {/* ─── ARABIC TRANSLATION (per section) ─── */}
                {showTranslation && arabicTranslations[secIdx] && (
                  <div className="px-5 pb-5" style={{
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.04) 0%, rgba(16, 185, 129, 0.01) 100%)',
                    borderTop: `2px dashed rgba(16, 185, 129, 0.2)`,
                  }}>
                    <div className="flex items-center gap-2 pt-4 mb-3">
                      <span className="text-sm">🇸🇦</span>
                      <span className="text-[11px] font-bold" style={{ color: '#059669' }}>
                        الترجمة العربية
                      </span>
                    </div>
                    <div className="text-[13px] leading-[2.2] font-medium" dir="rtl" style={{ color: 'var(--text-primary)' }}>
                      {arabicTranslations[secIdx].split('\n').filter(p => p.trim()).map((para, pIdx) => (
                        <p key={pIdx} className="mb-2">{para.trim()}</p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Navigation between lessons */}
        {!loading && (
          <div className="flex justify-between items-center pt-4 pb-2">
            {prevLesson ? (
              <button onClick={() => { setSelectedLesson(prevLesson); handleStopAll(); }}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl transition-all hover:scale-105"
                style={{ color: lessonColor, background: `${lessonColor}10`, border: `1px solid ${lessonColor}20` }}>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Lezione {prevLesson}
              </button>
            ) : <div />}
            {nextLesson && (
              <button onClick={() => { setSelectedLesson(nextLesson); handleStopAll(); }}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl transition-all hover:scale-105"
                style={{ color: lessonColor, background: `${lessonColor}10`, border: `1px solid ${lessonColor}20` }}>
                Lezione {nextLesson}
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
