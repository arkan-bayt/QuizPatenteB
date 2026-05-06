// ============================================================
// API Route - Text-to-Speech Proxy
// Converts text to audio using Google Translate TTS
// Works on ALL devices and browsers (fallback for Web Speech API)
// ============================================================
import { NextRequest, NextResponse } from 'next/server';

const MAX_TEXT_LENGTH = 200;

export async function GET(request: NextRequest) {
  const text = request.nextUrl.searchParams.get('text') || '';
  const lang = request.nextUrl.searchParams.get('lang') || 'it';

  if (!text.trim()) {
    return NextResponse.json({ error: 'Missing text parameter' }, { status: 400 });
  }

  const trimmed = text.trim().substring(0, MAX_TEXT_LENGTH);

  try {
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(trimmed)}&tl=${lang}&client=tw-ob&ttsspeed=0.8`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'audio/mpeg, audio/*',
        'Accept-Language': 'it-IT,it;q=0.9,en;q=0.8',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      // Try alternate client parameter
      const altUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(trimmed)}&tl=${lang}&client=at&ttsspeed=0.8`;
      const altResponse = await fetch(altUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
        cache: 'no-store',
      });

      if (!altResponse.ok) {
        return NextResponse.json({ error: 'TTS service unavailable' }, { status: 503 });
      }

      return new NextResponse(altResponse.body, {
        headers: {
          'Content-Type': 'audio/mpeg',
          'Cache-Control': 'no-store',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    return new NextResponse(response.body, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'no-store',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error: any) {
    console.error('[TTS API] Error:', error.message);
    return NextResponse.json({ error: 'TTS generation failed' }, { status: 500 });
  }
}
