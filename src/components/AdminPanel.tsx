'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { useStore } from '@/store/useStore';
import { AppUser } from '@/data/supabaseClient';
import { authenticatedFetch } from '@/lib/api';

// ============================================================
// Types
// ============================================================
type Role = 'super_admin' | 'teacher' | 'student';

interface Teacher {
  id: string;
  username: string;
  full_name?: string | null;
  student_count?: number;
}

// ============================================================
// Constants
// ============================================================
// ⛔ super_admin CANNOT be created via UI — only teacher and student
const ROLES: Role[] = ['teacher', 'student'];
const ALL_ROLES: Role[] = ['super_admin', 'teacher', 'student']; // For display only

const ROLE_LABELS: Record<Role, string> = {
  super_admin: 'Super Admin',
  teacher: 'Insegnante',
  student: 'Studente',
};

const ROLE_COLORS: Record<Role, { bg: string; color: string; border: string }> = {
  super_admin: {
    bg: 'rgba(217, 119, 6, 0.12)',
    color: '#D97706',
    border: 'rgba(217, 119, 6, 0.2)',
  },
  teacher: {
    bg: 'rgba(79, 70, 229, 0.10)',
    color: '#818CF8',
    border: 'rgba(79, 70, 229, 0.18)',
  },
  student: {
    bg: 'rgba(5, 150, 105, 0.10)',
    color: '#059669',
    border: 'rgba(5, 150, 105, 0.18)',
  },
};

const ROLE_ICONS: Record<Role, string> = {
  super_admin: '👑',
  teacher: '🎓',
  student: '👤',
};

// ============================================================
// Component
// ============================================================
export default function AdminPanel() {
  const store = useStore();
  const { user } = store;

  // --- State ---
  const [users, setUsers] = useState<AppUser[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState<'success' | 'error'>('success');

  // Add user form
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newFullName, setNewFullName] = useState('');
  const [newRole, setNewRole] = useState<Role>('student');

  // Role change dialog
  const [roleDialogUser, setRoleDialogUser] = useState<AppUser | null>(null);
  const [roleDialogTarget, setRoleDialogTarget] = useState<Role>('student');

  // Delete confirmation dialog
  const [deleteDialogUser, setDeleteDialogUser] = useState<AppUser | null>(null);

  // ============================================================
  // Access control
  // ============================================================
  if (user?.role !== 'super_admin') {
    return (
      <div className="min-h-screen bg-mesh flex items-center justify-center px-4">
        <div className="card p-10 text-center anim-up" style={{ maxWidth: 400 }}>
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: 'var(--danger-100)', border: '1px solid var(--danger-150)' }}
          >
            <svg className="w-8 h-8" style={{ color: 'var(--danger)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
          </div>
          <h1 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Accesso negato</h1>
          <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
            Non hai i permessi necessari per accedere a questa pagina. Solo i Super Admin possono gestire gli utenti.
          </p>
          <button onClick={() => store.goHome()} className="btn-primary w-full text-sm">
            ← Torna alla Home
          </button>
        </div>
      </div>
    );
  }

  // ============================================================
  // Helpers
  // ============================================================
  const showMsg = (text: string, type: 'success' | 'error') => {
    setMsg(text);
    setMsgType(type);
    setTimeout(() => setMsg(''), 3500);
  };

  const getTeacherName = (ownerId: string | null | undefined): string => {
    if (!ownerId) return '';
    const t = teachers.find((t) => t.id === ownerId);
    return t ? (t.full_name || t.username) : '';
  };

  // ============================================================
  // Data fetching
  // ============================================================
  const loadTeachers = useCallback(async (): Promise<Teacher[]> => {
    try {
      const res = await authenticatedFetch('/api/auth', {
        method: 'POST',
        body: JSON.stringify({ action: 'get_teachers' }),
      });
      const data = await res.json();
      return data.teachers || [];
    } catch {
      return [];
    }
  }, []);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const [usersRes, teachersList] = await Promise.all([
        authenticatedFetch('/api/auth', {
          method: 'POST',
          body: JSON.stringify({ action: 'list_users' }),
        }).then((r) => r.json()),
        loadTeachers(),
      ]);
      setUsers(usersRes.users || []);
      setTeachers(teachersList);
    } catch {
      showMsg('Errore nel caricamento dei dati', 'error');
    } finally {
      setLoading(false);
    }
  }, [loadTeachers]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // ============================================================
  // Actions
  // ============================================================
  const handleAddUser = async () => {
    if (!newUsername.trim() || !newPassword.trim()) {
      showMsg('Username e password sono obbligatori', 'error');
      return;
    }
    setBusy(true);
    try {
      const payload: Record<string, any> = {
        action: 'add_user',
        username: newUsername.trim(),
        password: newPassword,
        role: newRole,
        full_name: newFullName.trim() || undefined,
      };
      const res = await authenticatedFetch('/api/auth', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.ok) {
        showMsg(`${ROLE_LABELS[newRole]} creato con successo!`, 'success');
        setNewUsername('');
        setNewPassword('');
        setNewFullName('');
        setNewRole('student');
        loadUsers();
      } else {
        showMsg(data.msg || 'Errore nella creazione', 'error');
      }
    } catch {
      showMsg('Errore di connessione', 'error');
    }
    setBusy(false);
  };

  const handleToggleActive = async (u: AppUser) => {
    try {
      const res = await authenticatedFetch('/api/auth', {
        method: 'POST',
        body: JSON.stringify({ action: 'toggle_active', user_id: u.id }),
      });
      const data = await res.json();
      if (data.ok) {
        showMsg(`${u.username} ${u.is_active ? 'disattivato' : 'riattivato'}`, 'success');
        loadUsers();
      } else {
        showMsg(data.msg || 'Errore', 'error');
      }
    } catch {
      showMsg('Errore di connessione', 'error');
    }
  };

  const handleRoleChangeConfirm = async () => {
    if (!roleDialogUser) return;
    setBusy(true);
    try {
      const payload: Record<string, any> = {
        action: 'toggle_role',
        user_id: roleDialogUser.id,
        new_role: roleDialogTarget,
      };
      const res = await authenticatedFetch('/api/auth', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.ok) {
        showMsg(`Ruolo di ${roleDialogUser.username} aggiornato a ${ROLE_LABELS[roleDialogTarget]}`, 'success');
        setRoleDialogUser(null);
        loadUsers();
      } else {
        showMsg(data.msg || 'Errore nell\'aggiornamento', 'error');
      }
    } catch {
      showMsg('Errore di connessione', 'error');
    }
    setBusy(false);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialogUser) return;
    setBusy(true);
    try {
      const res = await authenticatedFetch('/api/auth', {
        method: 'POST',
        body: JSON.stringify({ action: 'delete_user', user_id: deleteDialogUser.id }),
      });
      const data = await res.json();
      if (data.ok) {
        showMsg(`${deleteDialogUser.username} è stato disattivato`, 'success');
        setDeleteDialogUser(null);
        loadUsers();
      } else {
        showMsg(data.msg || 'Errore', 'error');
      }
    } catch {
      showMsg('Errore di connessione', 'error');
    }
    setBusy(false);
  };

  const openRoleDialog = (u: AppUser) => {
    setRoleDialogUser(u);
    setRoleDialogTarget(u.role as Role);
  };

  const openDeleteDialog = (u: AppUser) => {
    setDeleteDialogUser(u);
  };

  // ============================================================
  // Computed
  // ============================================================
  const stats = {
    total: users.length,
    super_admins: users.filter((u) => u.role === 'super_admin').length,
    teachers: users.filter((u) => u.role === 'teacher').length,
    students: users.filter((u) => u.role === 'student').length,
    active: users.filter((u) => u.is_active).length,
    inactive: users.filter((u) => !u.is_active).length,
  };

  // ============================================================
  // Sub-components
  // ============================================================
  const RoleBadge = ({ role }: { role: string }) => {
    const r = (role as Role) || 'student';
    const c = ROLE_COLORS[r] || ROLE_COLORS.student;
    return (
      <span
        className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider"
        style={{ color: c.color, background: c.bg, border: `1px solid ${c.border}` }}
      >
        <span className="text-[11px]">{ROLE_ICONS[r]}</span>
        {ROLE_LABELS[r]}
      </span>
    );
  };

  const ActiveBadge = ({ active }: { active: boolean }) => (
    <span
      className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider"
      style={{
        color: active ? '#059669' : '#DC2626',
        background: active ? 'rgba(5,150,105,0.08)' : 'rgba(220,38,38,0.08)',
        border: `1px solid ${active ? 'rgba(5,150,105,0.15)' : 'rgba(220,38,38,0.15)'}`,
      }}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-green-500' : 'bg-red-500'}`} />
      {active ? 'Attivo' : 'Inattivo'}
    </span>
  );

  const StatCard = ({
    icon,
    label,
    value,
    accentColor,
    delay,
  }: {
    icon: React.ReactNode;
    label: string;
    value: number;
    accentColor: string;
    delay: number;
  }) => (
    <div
      className="stat-card flex items-center gap-3 anim-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{
          background: `${accentColor}12`,
          border: `1px solid ${accentColor}20`,
        }}
      >
        {icon}
      </div>
      <div>
        <p className="text-xl font-bold leading-none" style={{ color: 'var(--text-primary)' }}>
          {value}
        </p>
        <p className="text-[11px] mt-1" style={{ color: 'var(--text-muted)' }}>
          {label}
        </p>
      </div>
    </div>
  );

  // ============================================================
  // Render
  // ============================================================
  return (
    <div className="min-h-screen bg-mesh pb-12">
      {/* ===== Header ===== */}
      <div className="sticky top-0 z-30 glass-header">
        <div className="max-w-3xl mx-auto px-5 py-4 flex items-center gap-3">
          <button
            onClick={() => store.goHome()}
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105 cursor-pointer"
            style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border)' }}
          >
            <svg className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <div className="flex items-center gap-2.5">
            <div className="icon-box icon-box-primary w-8 h-8">
              <svg className="w-4 h-4" style={{ color: 'var(--primary-light)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h1 className="text-[15px] font-bold" style={{ color: 'var(--text-primary)' }}>
              Pannello Amministrazione
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-5 pt-6 space-y-6">
        {/* ===== Message Toast ===== */}
        {msg && (
          <div
            className={`p-4 rounded-2xl text-sm text-center anim-slide-down flex items-center justify-center gap-2 ${
              msgType === 'success' ? 'feedback-correct' : 'feedback-wrong'
            }`}
          >
            {msgType === 'success' ? (
              <svg className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--success)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--danger)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            )}
            <span style={{ color: msgType === 'success' ? 'var(--success)' : 'var(--danger)' }}>
              {msg}
            </span>
          </div>
        )}

        {/* ===== Stats Overview ===== */}
        <div className="grid grid-cols-3 gap-3">
          <StatCard
            icon={<span className="text-lg">👥</span>}
            label="Utenti totali"
            value={stats.total}
            accentColor="#818CF8"
            delay={0}
          />
          <StatCard
            icon={<span className="text-lg">🎓</span>}
            label="Insegnanti"
            value={stats.teachers}
            accentColor="#818CF8"
            delay={30}
          />
          <StatCard
            icon={<span className="text-lg">👤</span>}
            label="Studenti"
            value={stats.students}
            accentColor="#059669"
            delay={60}
          />
        </div>

        {/* ===== Add User Section ===== */}
        <div className="glass p-6 anim-up" style={{ boxShadow: 'var(--shadow-lg)', animationDelay: '80ms' }}>
          <div className="flex items-center gap-2.5 mb-5">
            <div className="icon-box icon-box-success w-8 h-8">
              <svg className="w-4 h-4" style={{ color: 'var(--success)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
              </svg>
            </div>
            <h2 className="text-[14px] font-bold" style={{ color: 'var(--text-primary)' }}>
              Aggiungi Utente
            </h2>
          </div>

          {/* Username + Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-[10px] font-bold mb-2 uppercase tracking-[0.15em]" style={{ color: 'var(--text-muted)' }}>
                Username *
              </label>
              <input
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="input-modern text-sm"
                placeholder="nome.utente"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold mb-2 uppercase tracking-[0.15em]" style={{ color: 'var(--text-muted)' }}>
                Password *
              </label>
              <input
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                type="password"
                className="input-modern text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Full Name */}
          <div className="mb-3">
            <label className="block text-[10px] font-bold mb-2 uppercase tracking-[0.15em]" style={{ color: 'var(--text-muted)' }}>
              Nome completo
            </label>
            <input
              value={newFullName}
              onChange={(e) => setNewFullName(e.target.value)}
              className="input-modern text-sm"
              placeholder="Nome e cognome"
            />
          </div>

          {/* Role selector */}
          <div className="mb-5">
            <label className="block text-[10px] font-bold mb-2 uppercase tracking-[0.15em]" style={{ color: 'var(--text-muted)' }}>
              Ruolo
            </label>
            <div className="flex flex-wrap gap-2">
              {/* ⛔ super_admin option is HIDDEN — cannot be created via UI */}
              {ROLES.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setNewRole(r)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 border cursor-pointer"
                  style={
                    newRole === r
                      ? { background: ROLE_COLORS[r].bg, color: ROLE_COLORS[r].color, borderColor: ROLE_COLORS[r].border }
                      : { background: 'transparent', color: 'var(--text-muted)', borderColor: 'var(--border)' }
                  }
                >
                  {ROLE_ICONS[r]} {ROLE_LABELS[r]}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleAddUser}
            disabled={busy || !newUsername.trim() || !newPassword.trim()}
            className="btn-primary w-full text-sm flex items-center justify-center gap-2"
          >
            {busy ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Creazione in corso...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Crea {ROLE_LABELS[newRole]}
              </>
            )}
          </button>
        </div>

        {/* ===== User Management ===== */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1 anim-up" style={{ animationDelay: '120ms' }}>
            <div className="flex items-center gap-2">
              <div className="icon-box icon-box-purple w-7 h-7">
                <svg className="w-3.5 h-3.5" style={{ color: 'var(--purple)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
              </div>
              <h2 className="text-[12px] font-bold uppercase tracking-[0.12em]" style={{ color: 'var(--text-muted)' }}>
                Gestione Utenti ({stats.active} attivi / {stats.inactive} inattivi)
              </h2>
            </div>
          </div>

          {/* Loading skeleton */}
          {loading && (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="glass p-4 flex items-center gap-4">
                  <div className="w-11 h-11 rounded-2xl skeleton flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-32 skeleton rounded" />
                    <div className="h-3 w-48 skeleton rounded" />
                  </div>
                  <div className="h-6 w-20 skeleton rounded-full" />
                </div>
              ))}
            </div>
          )}

          {/* User cards */}
          {!loading && users.length === 0 && (
            <div className="glass p-10 text-center anim-up">
              <svg className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--text-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
              <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
                Nessun utente trovato
              </p>
            </div>
          )}

          {!loading &&
            users.map((u, i) => {
              const role = (u.role as Role) || 'student';
              const c = ROLE_COLORS[role] || ROLE_COLORS.student;

              return (
                <div
                  key={u.id}
                  className="glass p-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 anim-up"
                  style={{
                    animationDelay: `${120 + i * 40}ms`,
                    opacity: u.is_active ? 1 : 0.55,
                  }}
                >
                  {/* Avatar */}
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: c.bg,
                      border: `1px solid ${c.border}`,
                    }}
                  >
                    <span className="text-sm font-bold" style={{ color: c.color }}>
                      {(u.username)[0].toUpperCase()}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-[14px] font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {u.username}
                      </p>
                      <RoleBadge role={role} />
                      <ActiveBadge active={u.is_active} />
                    </div>
                    <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      @{u.username}
                      {' · '}
                      {u.created_at
                        ? new Date(u.created_at).toLocaleDateString('it-IT', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })
                        : 'N/A'}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 flex-shrink-0 sm:flex-row">
                    {/* Toggle active */}
                    <button
                      onClick={() => handleToggleActive(u)}
                      className="px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-all duration-200 border cursor-pointer flex items-center gap-1"
                      style={{
                        color: u.is_active ? 'var(--accent)' : 'var(--success)',
                        background: u.is_active ? 'var(--accent-50)' : 'var(--success-50)',
                        borderColor: u.is_active ? 'var(--accent-150)' : 'var(--success-150)',
                      }}
                      title={u.is_active ? 'Disattiva utente' : 'Riattiva utente'}
                    >
                      {u.is_active ? (
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                        </svg>
                      ) : (
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                      <span className="hidden sm:inline">{u.is_active ? 'Disattiva' : 'Riattiva'}</span>
                    </button>

                    {/* Change role */}
                    <button
                      onClick={() => openRoleDialog(u)}
                      className="px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-all duration-200 border cursor-pointer flex items-center gap-1"
                      style={{ color: 'var(--text-muted)', borderColor: 'var(--border)' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'var(--bg-tertiary)';
                        e.currentTarget.style.color = 'var(--text-secondary)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = 'var(--text-muted)';
                      }}
                      title="Cambia ruolo"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
                      </svg>
                      <span className="hidden sm:inline">Ruolo</span>
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => openDeleteDialog(u)}
                      className="w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 border cursor-pointer"
                      style={{ color: 'var(--text-muted)', borderColor: 'transparent' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'var(--danger-100)';
                        e.currentTarget.style.color = 'var(--danger)';
                        e.currentTarget.style.borderColor = 'var(--danger-150)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = 'var(--text-muted)';
                        e.currentTarget.style.borderColor = 'transparent';
                      }}
                      title="Disattiva utente"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* ===== Role Change Dialog ===== */}
      {roleDialogUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 anim-fade"
          style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
          onClick={() => setRoleDialogUser(null)}
        >
          <div
            className="card p-6 w-full anim-up"
            style={{ maxWidth: 420 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2.5 mb-5">
              <div className="icon-box icon-box-primary w-8 h-8">
                <svg className="w-4 h-4" style={{ color: 'var(--primary-light)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
                </svg>
              </div>
              <div>
                <h3 className="text-[14px] font-bold" style={{ color: 'var(--text-primary)' }}>
                  Cambia Ruolo
                </h3>
                <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                  @{roleDialogUser.username} — Attuale: {ROLE_LABELS[roleDialogUser.role as Role]}
                </p>
              </div>
            </div>

            <label className="block text-[10px] font-bold mb-2 uppercase tracking-[0.15em]" style={{ color: 'var(--text-muted)' }}>
              Nuovo ruolo
            </label>
            {/* ⛔ super_admin option is HIDDEN — cannot be assigned via UI */}
            <div className="flex flex-wrap gap-2 mb-4">
              {ROLES.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => {
                    setRoleDialogTarget(r);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 border cursor-pointer"
                  style={
                    roleDialogTarget === r
                      ? { background: ROLE_COLORS[r].bg, color: ROLE_COLORS[r].color, borderColor: ROLE_COLORS[r].border }
                      : { background: 'transparent', color: 'var(--text-muted)', borderColor: 'var(--border)' }
                  }
                >
                  {ROLE_ICONS[r]} {ROLE_LABELS[r]}
                </button>
              ))}
              {roleDialogUser.role === 'super_admin' && (
                <div
                  className="px-4 py-2 rounded-xl text-[11px] font-semibold"
                  style={{
                    background: 'rgba(217, 119, 6, 0.08)',
                    color: '#D97706',
                    border: '1px solid rgba(217, 119, 6, 0.2)',
                  }}
                >
                  👑 Super Admin (protetto)
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setRoleDialogUser(null)}
                className="btn-ghost flex-1 text-sm"
              >
                Annulla
              </button>
              <button
                onClick={handleRoleChangeConfirm}
                disabled={busy}
                className="btn-primary flex-1 text-sm flex items-center justify-center gap-2"
              >
                {busy ? (
                  <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                ) : null}
                Conferma
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== Delete Confirmation Dialog ===== */}
      {deleteDialogUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 anim-fade"
          style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
          onClick={() => setDeleteDialogUser(null)}
        >
          <div
            className="card p-6 w-full anim-up"
            style={{ maxWidth: 400 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2.5 mb-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'var(--danger-100)', border: '1px solid var(--danger-150)' }}
              >
                <svg className="w-5 h-5" style={{ color: 'var(--danger)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
              <div>
                <h3 className="text-[14px] font-bold" style={{ color: 'var(--text-primary)' }}>
                  Conferma disattivazione
                </h3>
                <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                  Questa azione è reversibile
                </p>
              </div>
            </div>

            <p className="text-sm mb-5" style={{ color: 'var(--text-secondary)' }}>
              Sei sicuro di voler disattivare{' '}
              <span className="font-bold" style={{ color: 'var(--text-primary)' }}>
                {deleteDialogUser.full_name || deleteDialogUser.username}
              </span>
              ? L&apos;utente non potrà più accedere al sistema, ma i suoi dati saranno conservati.
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => setDeleteDialogUser(null)}
                className="btn-ghost flex-1 text-sm"
              >
                Annulla
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={busy}
                className="btn-danger flex-1 text-sm flex items-center justify-center gap-2"
              >
                {busy ? (
                  <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                ) : null}
                Disattiva
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
