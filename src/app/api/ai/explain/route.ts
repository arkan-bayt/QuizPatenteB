import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { question, correctAnswer, userAnswer, explanation } = await request.json();

    if (!question) {
      return NextResponse.json({ error: 'Domanda richiesta' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Servizio AI non disponibile' },
        { status: 503 }
      );
    }

    const userAnsText = userAnswer ? 'VERO' : 'FALSO';
    const correctAnsText = correctAnswer ? 'VERO' : 'FALSO';

    const prompt = `Sei un istruttore di scuola guida italiana esperto. Spiega brevemente (2-4 frasi) perché la risposta è sbagliata.

Domanda del quiz patente B: "${question}"
Risposta corretta: ${correctAnsText}
Risposta dell'utente: ${userAnsText}
${explanation ? `Spiegazione aggiuntiva: ${explanation}` : ''}

Rispondi SOLO in italiano, max 80 parole. Sii chiaro e diretto. Non usare formule o intestazioni.`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 200,
          },
        }),
      }
    );

    if (!res.ok) {
      const err = await res.text();
      console.error('Gemini API error:', err);
      return NextResponse.json({ error: 'Errore del servizio AI' }, { status: 500 });
    }

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Spiacente, non sono riuscito a generare una spiegazione.';

    return NextResponse.json({ explanation: text.trim() });
  } catch (error) {
    console.error('AI explain error:', error);
    return NextResponse.json({ error: 'Errore del server' }, { status: 500 });
  }
}
