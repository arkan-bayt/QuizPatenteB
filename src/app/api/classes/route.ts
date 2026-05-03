// ============================================================
// API Route - Classes (CRUD)
// Teacher/Super Admin can create, read, update, delete classes
// ============================================================
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifySession, requireTeacherOrAbove, requireSuperAdmin } from '@/lib/auth';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ============================================================
// GET /api/classes?action=list
// GET /api/classes?action=get_students&class_id=xxx
// ============================================================
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'list';

    if (action === 'list') {
      return handleListClasses(request);
    }
    if (action === 'get_students') {
      return handleGetClassStudents(request, searchParams);
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// ============================================================
// POST /api/classes
// ============================================================
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'create': return handleCreateClass(request, body);
      case 'update': return handleUpdateClass(request, body);
      case 'delete': return handleDeleteClass(request, body);
      case 'assign_student': return handleAssignStudent(request, body);
      case 'remove_student': return handleRemoveStudent(request, body);
      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// ============================================================
// LIST CLASSES — Teacher or Super Admin
// ============================================================
async function handleListClasses(request: NextRequest) {
  const user = await verifySession(request.headers.get('Authorization'));
  if (!user) {
    return NextResponse.json({ error: 'Non autenticato' }, { status: 401 });
  }
  if (!requireTeacherOrAbove(user)) {
    return NextResponse.json({ error: 'Accesso negato' }, { status: 403 });
  }

  const { data, error } = await supabase
    .from('school_classes')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('List classes error:', error);
    return NextResponse.json({ ok: false, msg: 'Errore nel caricamento classi' }, { status: 500 });
  }

  // Get student count for each class
  const classesWithCount = await Promise.all((data || []).map(async (cls: any) => {
    const { count } = await supabase
      .from('app_users')
      .select('id', { count: 'exact', head: true })
      .eq('class_id', cls.id)
      .eq('role', 'student')
      .eq('is_active', true);

    return {
      ...cls,
      student_count: count || 0,
    };
  }));

  return NextResponse.json({ ok: true, classes: classesWithCount });
}

// ============================================================
// GET CLASS STUDENTS — Teacher or Super Admin
// ============================================================
async function handleGetClassStudents(request: NextRequest, searchParams: URLSearchParams) {
  const user = await verifySession(request.headers.get('Authorization'));
  if (!user) {
    return NextResponse.json({ error: 'Non autenticato' }, { status: 401 });
  }
  if (!requireTeacherOrAbove(user)) {
    return NextResponse.json({ error: 'Accesso negato' }, { status: 403 });
  }

  const classId = searchParams.get('class_id');
  if (!classId) {
    return NextResponse.json({ ok: false, msg: 'ID classe mancante' });
  }

  const { data, error } = await supabase
    .from('app_users')
    .select('id, username, role, is_active, created_at')
    .eq('class_id', classId)
    .eq('role', 'student')
    .eq('is_active', true)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Get class students error:', error);
    return NextResponse.json({ ok: false, msg: 'Errore nel caricamento studenti' }, { status: 500 });
  }

  return NextResponse.json({ ok: true, students: data || [] });
}

// ============================================================
// CREATE CLASS — Teacher or Super Admin
// ============================================================
async function handleCreateClass(request: NextRequest, body: {
  name: string;
  description?: string;
  image_url?: string;
  color?: string;
  icon?: string;
}) {
  const user = await verifySession(request.headers.get('Authorization'));
  if (!user) {
    return NextResponse.json({ error: 'Non autenticato' }, { status: 401 });
  }
  if (!requireTeacherOrAbove(user)) {
    return NextResponse.json({ error: 'Accesso negato' }, { status: 403 });
  }

  const { name } = body;
  if (!name || name.trim().length === 0) {
    return NextResponse.json({ ok: false, msg: 'Il nome della classe è obbligatorio' });
  }

  const { data, error } = await supabase
    .from('school_classes')
    .insert({
      name: name.trim(),
      description: body.description?.trim() || null,
      image_url: body.image_url || null,
      color: body.color || '#4F46E5',
      icon: body.icon || '📚',
      created_by: user.id,
    })
    .select('*')
    .single();

  if (error) {
    console.error('Create class error:', error);
    return NextResponse.json({ ok: false, msg: 'Errore nella creazione della classe' }, { status: 500 });
  }

  return NextResponse.json({ ok: true, msg: 'Classe creata con successo', class: { ...data, student_count: 0 } });
}

// ============================================================
// UPDATE CLASS — Teacher or Super Admin (creator or super_admin)
// ============================================================
async function handleUpdateClass(request: NextRequest, body: {
  class_id: string;
  name?: string;
  description?: string;
  image_url?: string;
  color?: string;
  icon?: string;
}) {
  const user = await verifySession(request.headers.get('Authorization'));
  if (!user) {
    return NextResponse.json({ error: 'Non autenticato' }, { status: 401 });
  }
  if (!requireTeacherOrAbove(user)) {
    return NextResponse.json({ error: 'Accesso negato' }, { status: 403 });
  }

  const { class_id, name, description, image_url, color, icon } = body;
  if (!class_id) {
    return NextResponse.json({ ok: false, msg: 'ID classe mancante' });
  }

  const updatePayload: Record<string, unknown> = {};
  if (name !== undefined) updatePayload.name = name.trim();
  if (description !== undefined) updatePayload.description = description?.trim() || null;
  if (image_url !== undefined) updatePayload.image_url = image_url || null;
  if (color !== undefined) updatePayload.color = color;
  if (icon !== undefined) updatePayload.icon = icon;

  const { error } = await supabase
    .from('school_classes')
    .update(updatePayload)
    .eq('id', class_id);

  if (error) {
    console.error('Update class error:', error);
    return NextResponse.json({ ok: false, msg: 'Errore nell\'aggiornamento della classe' }, { status: 500 });
  }

  return NextResponse.json({ ok: true, msg: 'Classe aggiornata con successo' });
}

// ============================================================
// DELETE CLASS — Teacher or Super Admin
// ============================================================
async function handleDeleteClass(request: NextRequest, body: { class_id: string }) {
  const user = await verifySession(request.headers.get('Authorization'));
  if (!user) {
    return NextResponse.json({ error: 'Non autenticato' }, { status: 401 });
  }
  if (!requireSuperAdmin(user)) {
    return NextResponse.json({ ok: false, msg: 'Solo il super admin può eliminare classi' }, { status: 403 });
  }

  const { class_id } = body;
  if (!class_id) {
    return NextResponse.json({ ok: false, msg: 'ID classe mancante' });
  }

  // First, remove class_id from all students in this class
  await supabase
    .from('app_users')
    .update({ class_id: null })
    .eq('class_id', class_id);

  // Then delete the class
  const { error } = await supabase
    .from('school_classes')
    .delete()
    .eq('id', class_id);

  if (error) {
    console.error('Delete class error:', error);
    return NextResponse.json({ ok: false, msg: 'Errore nell\'eliminazione della classe' }, { status: 500 });
  }

  return NextResponse.json({ ok: true, msg: 'Classe eliminata con successo' });
}

// ============================================================
// ASSIGN STUDENT TO CLASS — Teacher or Super Admin
// ============================================================
async function handleAssignStudent(request: NextRequest, body: {
  student_id: string;
  class_id: string;
}) {
  const user = await verifySession(request.headers.get('Authorization'));
  if (!user) {
    return NextResponse.json({ error: 'Non autenticato' }, { status: 401 });
  }
  if (!requireTeacherOrAbove(user)) {
    return NextResponse.json({ error: 'Accesso negato' }, { status: 403 });
  }

  const { student_id, class_id } = body;
  if (!student_id || !class_id) {
    return NextResponse.json({ ok: false, msg: 'ID studente e ID classe sono obbligatori' });
  }

  const { error } = await supabase
    .from('app_users')
    .update({ class_id })
    .eq('id', student_id);

  if (error) {
    console.error('Assign student error:', error);
    return NextResponse.json({ ok: false, msg: 'Errore nell\'assegnazione dello studente' }, { status: 500 });
  }

  return NextResponse.json({ ok: true, msg: 'Studente assegnato alla classe' });
}

// ============================================================
// REMOVE STUDENT FROM CLASS — Teacher or Super Admin
// ============================================================
async function handleRemoveStudent(request: NextRequest, body: { student_id: string }) {
  const user = await verifySession(request.headers.get('Authorization'));
  if (!user) {
    return NextResponse.json({ error: 'Non autenticato' }, { status: 401 });
  }
  if (!requireTeacherOrAbove(user)) {
    return NextResponse.json({ error: 'Accesso negato' }, { status: 403 });
  }

  const { student_id } = body;
  if (!student_id) {
    return NextResponse.json({ ok: false, msg: 'ID studente mancante' });
  }

  const { error } = await supabase
    .from('app_users')
    .update({ class_id: null })
    .eq('id', student_id);

  if (error) {
    console.error('Remove student error:', error);
    return NextResponse.json({ ok: false, msg: 'Errore nella rimozione dello studente' }, { status: 500 });
  }

  return NextResponse.json({ ok: true, msg: 'Studente rimosso dalla classe' });
}
