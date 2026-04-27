# Quiz Patente B 🇮🇹

Applicazione web per l'allenamento all'esame della patente B italiana.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8)
![License](https://img.shields.io/badge/License-MIT-green)

## Funzionalita

- **7.139 quiz ufficiali** organizzati in 25 capitoli
- **Quiz infiniti** — rispondi a tutte le domande di un capitolo senza limiti
- **Multi-capitolo** — seleziona 2, 3 o piu capitoli per un esame combinato
- **Esame completo** — affronta tutti i 7.139 quiz in una sola sessione
- **Argomenti specifici** — scegli singoli argomenti all'interno di ogni capitolo
- **Ripeti errori** — rivedi solo le domande sbagliate (per capitolo o totale)
- **Correzione istantanea** — feedback immediato con risposta corretta
- **Sintesi vocale (TTS)** — ascolta ogni domanda in italiano
- **Modalita scura** — tema chiaro/scuro con un clic
- **Progresso salvato** — i tuoi progressi vengono salvati automaticamente nel browser
- **Design responsivo** — ottimizzato per smartphone e desktop
- **413 immagini di segnali stradali** incluse

## Screenshot

La homepage mostra tutti i 25 capitoli con statistiche di progresso, pulsanti per l'esame multi-capitolo, l'esame completo e la ripetizione degli errori.

## Installazione

### Prerequisiti

- [Node.js](https://nodejs.org/) 18+ o [Bun](https://bun.sh/)
- [npm](https://www.npmjs.com/) o [bun](https://bun.sh/)

### Setup

```bash
# Clona il repository
git clone https://github.com/TUO-USERNAME/quiz-patente-b.git
cd quiz-patente-b

# Installa le dipendenze
npm install
# oppure: bun install

# Avvia il server di sviluppo
npm run dev
# oppure: bun run dev
```

Apri [http://localhost:3000](http://localhost:3000) nel browser.

### Build per produzione

```bash
npm run build
npm run start
```

## Struttura del progetto

```
src/
├── app/
│   ├── globals.css          # Stili globali + tema scuro
│   ├── layout.tsx           # Layout principale
│   └── page.tsx             # Pagina principale
├── components/
│   ├── QuizApp.tsx          # Componente principale dell'app
│   ├── ThemeProvider.tsx     # Provider per il tema scuro/chiaro
│   └── ui/                  # Componenti shadcn/ui
├── lib/
│   ├── types.ts             # Tipi TypeScript
│   ├── chapters.ts          # Definizione dei 25 capitoli
│   └── quiz-store.ts        # Stato dell'app (Zustand)
public/
├── quizData.json            # Database dei quiz (7.139 domande)
└── img_sign/                # 413 immagini di segnali stradali
```

## Tecnologie

- **Next.js 16** — Framework React con App Router
- **TypeScript** — Tipizzazione statica
- **Tailwind CSS 4** — Styling utility-first
- **shadcn/ui** — Componenti UI accessibili
- **Zustand** — Gestione dello stato
- **Web Speech API** — Sintesi vocale in italiano

## Dati dei quiz

I quiz provengono dal progetto open source [Ed0ardo/QuizPatenteB](https://github.com/Ed0ardo/QuizPatenteB), concesso sotto licenza MIT.

Ogni quiz e una domanda con risposta VERO/FALSO, il formato ufficiale dell'esame della patente B italiana.

## I 25 capitoli

1. Definizioni Generali e Doveri
2. Segnali di Pericolo
3. Segnali di Divieto
4. Segnali di Obbligo
5. Segnali di Precedenza
6. Segnaletica Orizzontale
7. Semafori e Vigili
8. Segnali di Indicazione
9. Segnali Complementari
10. Pannelli Integrativi
11. Limiti di Velocita
12. Distanza di Sicurezza
13. Norme di Circolazione
14. Precedenza e Incroci
15. Sorpasso
16. Fermata e Sosta
17. Autostrade
18. Luci e Dispositivi
19. Cinture e Casco
20. Patente e Punti
21. Incidenti Stradali
22. Alcool, Droga e Soccorso
23. Responsabilita e Assicurazione
24. Ambiente e Inquinamento
25. Manutenzione Veicolo

## Licenza

[MIT](LICENSE)

## Ringraziamenti

- [Ed0ardo/QuizPatenteB](https://github.com/Ed0ardo/QuizPatenteB) per il database dei quiz
- [Next.js](https://nextjs.org/), [Tailwind CSS](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/)
