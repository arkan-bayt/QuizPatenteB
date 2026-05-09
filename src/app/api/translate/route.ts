// ============================================================
// API Route - Translation Proxy (server-side Google Translate)
// Avoids CORS issues by translating server-side
// ============================================================
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { text, from = 'it', to = 'ar' } = await req.json();

    if (!text || text.length < 5) {
      return NextResponse.json({ translation: '' });
    }

    // Split into paragraphs and translate each
    const paragraphs = text.split('\n').filter((p: string) => p.trim().length > 3);
    const translated: string[] = [];

    for (const para of paragraphs) {
      const segments: string[] = [];
      let seg = '';
      for (const sentence of para.split(/(?<=[.!?])\s+/)) {
        if ((seg + ' ' + sentence).length > 800) {
          if (seg.trim()) segments.push(seg.trim());
          seg = sentence;
        } else {
          seg = seg ? seg + ' ' + sentence : sentence;
        }
      }
      if (seg.trim()) segments.push(seg.trim());

      for (const s of segments) {
        try {
          const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURIComponent(s.substring(0, 1000))}`;
          const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
          if (!res.ok) continue;
          const data = await res.json();
          if (Array.isArray(data) && Array.isArray(data[0])) {
            const tr = data[0]
              .filter((entry: any[]) => entry && entry[0])
              .map((entry: any[]) => entry[0] as string)
              .join('');
            if (tr) translated.push(tr);
          }
        } catch { /* skip failed segment */ }
      }
    }

    const result = translated.join('\n\n');
    return NextResponse.json({
      translation: result.trim().length > 5 ? result : ''
    });
  } catch (error) {
    return NextResponse.json({ translation: '' }, { status: 500 });
  }
}
