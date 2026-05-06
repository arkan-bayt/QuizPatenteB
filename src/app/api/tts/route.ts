// ============================================================
// API Route - Text-to-Speech Proxy
// Converts text to audio using Google Translate TTS
// Multiple fallback endpoints for reliability
// ============================================================
import { NextRequest, NextResponse } from 'next/server';

const MAX_TEXT_LENGTH = 200;

// Multiple TTS endpoints to try (different client params for reliability)
const TTS_ENDPOINTS = [
  (text: string, lang: string) =>
    `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${lang}&client=tw-ob&ttsspeed=0.9`,
  (text: string, lang: string) =>
    `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${lang}&client=at&ttsspeed=0.9`,
  (text: string, lang: string) =>
    `https://translate.google.com/translate_tts?ie=UTF-8&tl=${lang}&q=${encodeURIComponent(text)}&client=ivann`,
  (text: string, lang: string) =>
    `https://translate.googleapis.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${lang}&client=dict-chrome-ex`,
];

export async function GET(request: NextRequest) {
  const text = request.nextUrl.searchParams.get('text') || '';
  const lang = request.nextUrl.searchParams.get('lang') || 'it';

  if (!text.trim()) {
    return NextResponse.json({ error: 'Missing text parameter' }, { status: 400 });
  }

  const trimmed = text.trim().substring(0, MAX_TEXT_LENGTH);

  // User-Agent mimicking a real browser
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
    'Accept': 'audio/mpeg, audio/*; q=0.9, */*; q=0.8',
    'Accept-Language': 'it-IT,it;q=0.9,en;q=0.8',
    'Referer': 'https://translate.google.com/',
  };

  // Try each endpoint until one works
  for (const makeUrl of TTS_ENDPOINTS) {
    try {
      const url = makeUrl(trimmed, lang);

      const response = await fetch(url, {
        headers,
        cache: 'no-store',
        signal: AbortSignal.timeout(8000),
      });

      if (response.ok) {
        const contentType = response.headers.get('content-type') || '';
        // Only return if the response is actually audio (not an error page)
        if (contentType.includes('audio') || contentType.includes('mpeg')) {
          return new NextResponse(response.body, {
            headers: {
              'Content-Type': 'audio/mpeg',
              'Cache-Control': 'no-store',
              'Access-Control-Allow-Origin': '*',
            },
          });
        }

        // If we got a response but wrong content type, try next endpoint
        continue;
      }
    } catch {
      // This endpoint failed, try next
      continue;
    }
  }

  return NextResponse.json({ error: 'TTS service unavailable' }, { status: 503 });
}
