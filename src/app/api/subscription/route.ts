// ============================================================
// API Route - Subscription Management
// Handles subscription tier checks, upgrades, and feature gating
// FREE TIER: 50 questions/day, no AI explanations, limited TTS
// PREMIUM TIER: Unlimited everything
// ============================================================
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifySession } from '@/lib/auth';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const FREE_DAILY_LIMIT = parseInt(process.env.NEXT_PUBLIC_FREE_DAILY_QUESTIONS || '50');

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ============================================================
// GET - Check subscription status and daily usage
// ============================================================
export async function GET(request: NextRequest) {
  const user = await verifySession(request.headers.get('Authorization'));
  if (!user) {
    return NextResponse.json({ error: 'Non autenticato' }, { status: 401 });
  }

  const isPremium = user.subscription_tier === 'premium' || user.role === 'super_admin' || user.role === 'teacher';

  // Get today's question count from question_progress
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const { count } = await supabase
    .from('question_progress')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.username)
    .gte('created_at', todayStart.toISOString());

  const todayCount = count || 0;
  const remainingFree = isPremium ? Infinity : Math.max(0, FREE_DAILY_LIMIT - todayCount);

  return NextResponse.json({
    ok: true,
    subscription_tier: isPremium ? 'premium' : 'free',
    is_premium: isPremium,
    daily_limit: FREE_DAILY_LIMIT,
    today_answered: todayCount,
    remaining_today: remainingFree,
    can_answer: isPremium || todayCount < FREE_DAILY_LIMIT,
    features: {
      unlimited_questions: isPremium,
      ai_explanations: isPremium,
      arabic_tts: isPremium,
      full_stats: isPremium,
      exam_simulation: true,
      signals_guide: true,
    },
  });
}

// ============================================================
// POST - Subscription actions
// ============================================================
export async function POST(request: NextRequest) {
  const user = await verifySession(request.headers.get('Authorization'));
  if (!user) {
    return NextResponse.json({ error: 'Non autenticato' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'check_limit': return handleCheckLimit(user);
      case 'get_info': return handleGetInfo(user);
      case 'admin_upgrade': return handleAdminUpgrade(user, body);
      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// ============================================================
// CHECK LIMIT — Can the user answer more questions today?
// ============================================================
async function handleCheckLimit(user: any) {
  const isPremium = user.subscription_tier === 'premium' || user.role === 'super_admin' || user.role === 'teacher';

  if (isPremium) {
    return NextResponse.json({ ok: true, can_answer: true, remaining: -1 });
  }

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const { count } = await supabase
    .from('question_progress')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.username)
    .gte('created_at', todayStart.toISOString());

  const todayCount = count || 0;
  const canAnswer = todayCount < FREE_DAILY_LIMIT;

  return NextResponse.json({
    ok: true,
    can_answer: canAnswer,
    remaining: Math.max(0, FREE_DAILY_LIMIT - todayCount),
    today_count: todayCount,
    daily_limit: FREE_DAILY_LIMIT,
  });
}

// ============================================================
// GET INFO — Full subscription info
// ============================================================
async function handleGetInfo(user: any) {
  const isPremium = user.subscription_tier === 'premium' || user.role === 'super_admin' || user.role === 'teacher';

  return NextResponse.json({
    ok: true,
    tier: isPremium ? 'premium' : 'free',
    is_premium: isPremium,
    free_daily_limit: FREE_DAILY_LIMIT,
  });
}

// ============================================================
// ADMIN UPGRADE — Admin can manually upgrade a user to premium
// ============================================================
async function handleAdminUpgrade(user: any, body: { target_username: string; tier: 'free' | 'premium' }) {
  if (user.role !== 'super_admin') {
    return NextResponse.json({ ok: false, msg: 'Non autorizzato' }, { status: 403 });
  }

  const { target_username, tier } = body;
  if (!target_username || !tier) {
    return NextResponse.json({ ok: false, msg: 'Parametri mancanti' });
  }

  const { error } = await supabase
    .from('app_users')
    .update({ subscription_tier: tier })
    .eq('username', target_username.toLowerCase());

  if (error) {
    return NextResponse.json({ ok: false, msg: 'Errore aggiornamento abbonamento' }, { status: 500 });
  }

  return NextResponse.json({ ok: true, msg: `Abbonamento aggiornato a ${tier}` });
}
