// ============================================================
// AI API - Explain wrong answers + Analyze user performance
// Uses z-ai-web-dev-sdk for free AI inference
// ============================================================
import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

let zaiInstance: Awaited<ReturnType<typeof ZAI.create>> | null = null;

async function getZAI() {
  if (!zaiInstance) {
    zaiInstance = await ZAI.create();
  }
  return zaiInstance;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    if (action === 'explain') {
      return handleExplain(body);
    } else if (action === 'analyze') {
      return handleAnalyze(body);
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// ---- Explain why an answer is wrong ----
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
  const chapterInfo = chapterName ? `Capitolo: ${chapterName}` : '';
  const subtopicInfo = subtopic ? `Argomento: ${subtopic}` : '';
  const imageInfo = hasImage ? 'Questa domanda ha un immagine di un segnale stradale.' : '';

  const prompt = `Sei un istruttore di guida esperto per la patente B in Italia. Spiega PERCHÉ la risposta dell'utente è sbagliata in modo semplice e chiaro.

Domanda: "${question}"
${chapterInfo}
${subtopicInfo}
${imageInfo}
Risposta corretta: ${correctText}
Risposta dell'utente: ${userText}

Regole IMPORTANTI:
- Rispondi SEMPRE in italiano
- Massimo 3 frasi
- Sii diretto e semplice
- Spiega la regola del codice della strada in modo chiaro
- Non usare formule o markdown
- Inizia direttamente con la spiegazione, no introduzioni`;

  try {
    const zai = await getZAI();
    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'Sei un istruttore di patente B italiano. Rispondi sempre in italiano in modo semplice e chiaro. Massimo 3 frasi.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 150,
    });

    const explanation = completion.choices[0]?.message?.content || 'Spiegazione non disponibile.';

    return NextResponse.json({
      explanation: explanation.trim(),
      correctAnswer: correctText,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('AI Explain error:', msg);
    return NextResponse.json({
      explanation: `La risposta corretta è ${correctText}. Ripassa questo argomento nel capitolo delle regole della strada.`,
      correctAnswer: correctText,
      fallback: true,
    });
  }
}

// ---- Analyze user performance ----
async function handleAnalyze(body: {
  action: string;
  username: string;
  stats: {
    totalAnswered: number;
    totalCorrect: number;
    totalWrong: number;
    streak: number;
    bestStreak: number;
    examsPassed: number;
    examsFailed: number;
  };
  chapters: {
    id: number;
    name: string;
    answered: number;
    correct: number;
    wrong: number;
    total: number;
    pct: number;
  }[];
  wrongTopics: string[];
}) {
  const { username, stats, chapters, wrongTopics } = body;

  const accuracy = stats.totalAnswered > 0 ? Math.round((stats.totalCorrect / stats.totalAnswered) * 100) : 0;

  // Sort chapters by weakness (most wrong answers first)
  const weakChapters = chapters
    .filter(c => c.wrong > 0)
    .sort((a, b) => (b.wrong / b.total) - (a.wrong / a.total))
    .slice(0, 5);

  // Sort chapters by strength (highest accuracy first)
  const strongChapters = chapters
    .filter(c => c.answered > 0 && c.correct > 0)
    .sort((a, b) => (b.correct / b.total) - (a.correct / a.total))
    .slice(0, 5);

  const chaptersList = chapters.map(c => `Cap.${c.id} ${c.name}: ${c.answered}/${c.total} risposte, ${c.correct} corrette, ${c.wrong} sbagliate (${c.total > 0 && c.answered > 0 ? Math.round((c.correct / c.answered) * 100) : 0}%)`).join('\n');

  const weakList = weakChapters.map(c => `Cap.${c.id} ${c.name} (${c.wrong} errori su ${c.answered} risposte)`).join(', ');
  const strongList = strongChapters.map(c => `Cap.${c.id} ${c.name} (${Math.round((c.correct / c.answered) * 100)}% accuratezza)`).join(', ');

  const prompt = `Sei un istruttore di patente B esperto in Italia. Analizza le prestazioni dello studente e fornisci un report dettagliato in italiano.

DATI DELLO STUDENTE:
- Utente: ${username}
- Risposte totali: ${stats.totalAnswered}
- Corrette: ${stats.totalCorrect}
- Sbagliate: ${stats.totalWrong}
- Accuratezza: ${accuracy}%
- Serie migliore: ${stats.bestStreak}
- Esami superati: ${stats.examsPassed} su ${stats.examsPassed + stats.examsFailed}

PROGRESSO PER CAPITOLO:
${chaptersList}

ARGOMENTI CON PIÙ ERRORI: ${wrongTopics.join(', ') || 'Nessun dato disponibile'}

Analizza e rispondi in questo formato ESATTO (JSON valido):
{
  "level": "principiante|intermedio|avanzato|esperto",
  "levelEmoji": "🌱|📈|🎯|🏆",
  "levelTitle": "titolo del livello",
  "overallScore": numero da 0 a 100,
  "summary": "2-3 frasi di riassunto generale",
  "strengths": [
    {"chapter": "nome capitolo", "text": "perché è un punto di forza (1 frase)"}
  ],
  "weaknesses": [
    {"chapter": "nome capitolo", "text": "perché è un punto debole (1 frase)"}
  ],
  "recommendations": [
    "raccomandazione 1",
    "raccomandazione 2",
    "raccomandazione 3"
  ],
  "tips": [
    "consiglio pratico 1",
    "consiglio pratico 2"
  ],
  "motivation": "frase motivazionale breve"
}

Regole IMPORTANTI:
- Tutti i testi in ITALIANO
- level basato su: <30% principiante, 30-60% intermedio, 60-80% avanzato, >80% esperto
- Se lo studente ha meno di 50 risposte, suggerisci di fare più pratica
- Massimo 3 punti di forza e 3 di debolezza
- Le raccomandazioni devono essere specifiche e azionabili
- Il JSON deve essere valido, senza caratteri speciali nelle stringhe
- Nessun markdown, solo JSON puro`;

  try {
    const zai = await getZAI();
    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'Sei un istruttore di patente B italiano esperto nell\'analisi delle prestazioni degli studenti. Rispondi solo con JSON valido, senza markdown o backticks.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.4,
      max_tokens: 1000,
    });

    let content = completion.choices[0]?.message?.content || '';

    // Clean up JSON response
    content = content.trim();
    if (content.startsWith('```')) {
      content = content.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    }

    const analysis = JSON.parse(content);

    return NextResponse.json(analysis);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('AI Analyze error:', msg);

    // Return a basic fallback analysis
    const level = accuracy < 30 ? 'principiante' : accuracy < 60 ? 'intermedio' : accuracy < 80 ? 'avanzato' : 'esperto';
    const levelEmoji = accuracy < 30 ? '🌱' : accuracy < 60 ? '📈' : accuracy < 80 ? '🎯' : '🏆';

    return NextResponse.json({
      level,
      levelEmoji,
      levelTitle: `Livello ${level}`,
      overallScore: accuracy,
      summary: `Hai risposto correttamente al ${accuracy}% delle domande. Continua a esercitarti per migliorare il tuo livello!`,
      strengths: strongChapters.slice(0, 3).map(c => ({
        chapter: c.name,
        text: `Hai un'ottima accuratezza in questo capitolo con ${Math.round((c.correct / c.answered) * 100)}% di risposte corrette.`
      })),
      weaknesses: weakChapters.slice(0, 3).map(c => ({
        chapter: c.name,
        text: `Devi ripassare questo argomento: hai ${c.wrong} errori su ${c.answered} domande.`
      })),
      recommendations: [
        'Concentrati sui capitoli con più errori',
        'Fai almeno 30 domande al giorno',
        'Ripeti le domande sbagliate regolarmente',
      ],
      tips: [
        'Leggi attentamente ogni domanda prima di rispondere',
        'Presta attenzione ai segnali stradali e alle eccezioni',
      ],
      motivation: 'Ogni errore è un\'opportunità per imparare qualcosa di nuovo!',
      fallback: true,
    });
  }
}
