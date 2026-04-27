import { NextRequest, NextResponse } from 'next/server';
import { registerUser, createToken } from '@/lib/auth-utils';

export async function POST(request: NextRequest) {
  try {
    const { email, name, password } = await request.json();

    if (!email || !name || !password) {
      return NextResponse.json(
        { error: 'Tutti i campi sono obbligatori' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'La password deve avere almeno 6 caratteri' },
        { status: 400 }
      );
    }

    if (!email.includes('@') || !email.includes('.')) {
      return NextResponse.json(
        { error: 'Inserisci un indirizzo email valido' },
        { status: 400 }
      );
    }

    const user = await registerUser(email, name, password);
    const token = createToken(user.id, user.email, user.name);

    const response = NextResponse.json({
      success: true,
      user: { userId: user.id, email: user.email, name: user.name },
    });

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Errore durante la registrazione';
    if (message === 'QUESTA_EMAIL_GIA_REGISTRATA') {
      return NextResponse.json(
        { error: 'Questa email è già registrata' },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
