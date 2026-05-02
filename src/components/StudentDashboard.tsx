'use client';
import React, { useEffect, useState } from 'react';
import { useStore } from '@/store/useStore';
import { useOverallStats, useUserStats, useWrongAnswers } from './hooks';
import { getStudentAssignments, startAssignment } from '@/logic/assignmentEngine';
import { Assignment } from '@/data/supabaseClient';

export default function StudentDashboard() {
  const store = useStore();
  const { user } = store;
  const studentId = user?.id || '';

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState<'success' | 'error'>('success');

  const { totalAnswered, totalCorrect } = useOverallStats();
  const stats = useUserStats();
  const wrong = useWrongAnswers();

  const accuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

  const showMsg = (text: string, type: 'success' | 'error') => {
    setMsg(text);
    setMsgType(type);
    setTimeout(() => setMsg(''), 3000);
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await getStudentAssignments(studentId);
      setAssignments(data);
      setLoading(false);
    };
    load();
  }, [studentId]);

  const activeAssignments = assignments.filter((a) =>
    a.is_active && a._student_status && ['pending', 'in_progress'].includes(a._student_status)
  );
  const completedAssignments = assignments.filter((a) =>
    a._student_status === 'completed' || (a._best_result && a._best_result.score !== undefined)
  );
  const pendingAssignments = assignments.filter((a) =>
    a.is_active && (!a._student_status || a._student_status === 'pending')
  );

  const handleStart = async (assignment: Assignment) => {
    const res = await startAssignment(assignment.id, studentId);
    if (res.ok) {
      showMsg('Quiz iniziato! Buona fortuna!', 'success');
    } else {
      showMsg(res.msg, 'error');
    }
  };

  return (
    <div className="min-h-screen bg-mesh pb-12">
      {/* Header */}
      <div className="sticky top-0 z-30 glass-header">
        <div className="max-w-2xl mx-auto px-5 py-4 flex items-center gap-3">
          <button onClick={() => store.goHome()}
            className="btn-ghost p-2" style={{ borderRadius: 12 }}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <div className="flex-1">
            <h1 className="text-[16px] font-bold" style={{ color: 'var(--text-primary)' }}>
              Il Mio Dashboard
            </h1>
            <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
              {user?.full_name || user?.username || ''}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-5 pt-6 space-y-6">
        {/* Message toast */}
        {msg && (
          <div className={`p-4 rounded-2xl text-sm text-center anim-slide-down flex items-center justify-center gap-2 ${msgType === 'success' ? 'feedback-correct' : 'feedback-wrong'}`}>
            <span style={{ color: msgType === 'success' ? 'var(--success)' : 'var(--danger)' }}>{msg}</span>
          </div>
        )}

        {/* My Progress Stats */}
        <div className="grid grid-cols-4 gap-3 anim-up stagger">
          <StatCard icon="📋" value={totalAnswered} label="Risposte" color="var(--primary-light)" glow="stat-glow-blue" />
          <StatCard icon="✅" value={`${accuracy}%`} label="Corrette" color="var(--success)" glow="stat-glow-green" />
          <StatCard icon="🔥" value={stats.streak} label="Serie" color="var(--accent)" glow="stat-glow-amber" />
          <StatCard icon="❌" value={wrong.total} label="Da ripassare" color="var(--danger)" glow="stat-glow-red" />
        </div>

        {/* Active Assignments Section */}
        <div className="anim-up" style={{ animationDelay: '80ms' }}>
          <div className="flex items-center gap-2.5 mb-4 px-1">
            <div className="icon-box icon-box-green w-7 h-7">
              <svg className="w-3.5 h-3.5" style={{ color: 'var(--success)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-[12px] font-bold uppercase tracking-[0.12em]" style={{ color: 'var(--text-muted)' }}>
              Compiti Assegnati ({assignments.filter((a) => a.is_active).length})
            </h2>
          </div>

          {loading ? (
            <div className="glass p-8 text-center">
              <div className="w-8 h-8 rounded-full border-2 animate-spin mx-auto" style={{ borderColor: 'var(--primary-150)', borderTopColor: 'var(--primary-light)' }} />
              <p className="text-[12px] mt-3" style={{ color: 'var(--text-muted)' }}>Caricamento...</p>
            </div>
          ) : assignments.filter((a) => a.is_active).length === 0 ? (
            <div className="glass p-8 text-center">
              <div className="text-4xl mb-3">🎉</div>
              <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Nessun compito assegnato</p>
              <p className="text-[11px] mt-1" style={{ color: 'var(--text-muted)' }}>Il tuo insegnante non ha ancora creato compiti</p>
            </div>
          ) : (
            <div className="space-y-3">
              {assignments.filter((a) => a.is_active).map((a, i) => {
                const status = a._student_status || 'pending';
                const attemptsUsed = a._student_attempts || 0;
                const maxAttempts = a.config.max_attempts;
                const attemptsLeft = Math.max(0, maxAttempts - attemptsUsed);
                const bestResult = a._best_result;
                const canStart = status !== 'completed' && attemptsLeft > 0;
                const canRetry = status === 'completed' && attemptsLeft > 0;

                return (
                  <div key={a.id} className="glass p-4 anim-up" style={{ animationDelay: `${i * 40}ms` }}>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                        style={{
                          background: status === 'completed'
                            ? (bestResult && bestResult.score >= 21 ? 'linear-gradient(135deg, #22C55E, #16A34A)' : 'linear-gradient(135deg, #EF4444, #DC2626)')
                            : status === 'in_progress'
                              ? 'linear-gradient(135deg, #F59E0B, #D97706)'
                              : 'linear-gradient(135deg, #3B82F6, #2563EB)',
                        }}>
                        {status === 'completed' ? (bestResult && bestResult.score >= 21 ? '✅' : '❌') : status === 'in_progress' ? '🔄' : '📝'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[14px] font-bold" style={{ color: 'var(--text-primary)' }}>{a.title}</p>
                        {a.description && (
                          <p className="text-[11px] mt-0.5 truncate" style={{ color: 'var(--text-muted)' }}>{a.description}</p>
                        )}
                        <div className="flex items-center gap-3 mt-2 flex-wrap">
                          <span className="text-[10px] font-semibold" style={{ color: 'var(--text-muted)' }}>
                            📋 {a.config.number_of_questions > 0 ? `${a.config.number_of_questions} domande` : 'Tutti i capitoli'}
                          </span>
                          {a.config.chapters && a.config.chapters.length > 0 && (
                            <span className="text-[10px] font-semibold" style={{ color: 'var(--text-muted)' }}>
                              📚 Cap. {a.config.chapters.join(', ')}
                            </span>
                          )}
                          {a.config.time_limit_minutes && (
                            <span className="text-[10px] font-semibold" style={{ color: 'var(--text-muted)' }}>
                              ⏱️ {a.config.time_limit_minutes} min
                            </span>
                          )}
                          <span className="text-[10px] font-semibold" style={{ color: 'var(--text-muted)' }}>
                            🔄 {attemptsLeft}/{maxAttempts} rimasti
                          </span>
                        </div>

                        {/* Score if completed */}
                        {bestResult && (
                          <div className="mt-2 flex items-center gap-2">
                            <span className="text-[12px] font-bold" style={{
                              color: bestResult.score >= 21 ? 'var(--success)' : 'var(--danger)',
                            }}>
                              Punteggio: {bestResult.score}/{bestResult.total_questions * 1}30
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{
                              background: bestResult.score >= 21 ? 'rgba(34, 197, 94, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                              color: bestResult.score >= 21 ? 'var(--success)' : 'var(--danger)',
                            }}>
                              {bestResult.score >= 21 ? 'SUPERATO' : 'NON SUPERATO'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="mt-3">
                      {canStart && (
                        <button onClick={() => handleStart(a)}
                          className="w-full py-3 text-white font-bold text-[13px] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                          style={{ background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)', borderRadius: 'var(--radius-xl)', boxShadow: '0 4px 15px rgba(34, 197, 94, 0.35)' }}>
                          ▶ Inizia
                        </button>
                      )}
                      {canRetry && (
                        <button onClick={() => handleStart(a)}
                          className="w-full py-3 text-white font-bold text-[13px] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                          style={{ background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)', borderRadius: 'var(--radius-xl)', boxShadow: '0 4px 15px rgba(245, 158, 11, 0.35)' }}>
                          🔄 Riprova ({attemptsLeft} rimasti)
                        </button>
                      )}
                      {status === 'completed' && attemptsLeft === 0 && (
                        <div className="text-center py-2">
                          <span className="text-[11px] font-medium" style={{ color: 'var(--text-muted)' }}>Tentativi esauriti</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Completed Assignments Section */}
        {completedAssignments.length > 0 && (
          <div className="anim-up" style={{ animationDelay: '120ms' }}>
            <div className="flex items-center gap-2.5 mb-4 px-1">
              <div className="icon-box icon-box-purple w-7 h-7">
                <svg className="w-3.5 h-3.5" style={{ color: 'var(--purple)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-[12px] font-bold uppercase tracking-[0.12em]" style={{ color: 'var(--text-muted)' }}>
                Completati ({completedAssignments.length})
              </h2>
            </div>
            <div className="space-y-2">
              {completedAssignments.map((a, i) => {
                const bestResult = a._best_result;
                const passed = bestResult ? bestResult.score >= 21 : false;
                return (
                  <div key={a.id} className="glass p-3 flex items-center gap-3 anim-up" style={{ animationDelay: `${i * 30}ms` }}>
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0`}
                      style={{ background: passed ? 'linear-gradient(135deg, #22C55E, #16A34A)' : 'linear-gradient(135deg, #EF4444, #DC2626)' }}>
                      {passed ? '✅' : '❌'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{a.title}</p>
                      <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                        {bestResult ? `Punteggio: ${bestResult.score}/30` : ''}
                        {a._student_assigned_at ? ` · ${new Date(a._student_assigned_at).toLocaleDateString('it')}` : ''}
                      </p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-1 rounded-full flex-shrink-0" style={{
                      background: passed ? 'rgba(34, 197, 94, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                      color: passed ? 'var(--success)' : 'var(--danger)',
                    }}>
                      {passed ? 'SUPERATO' : 'NON SUPERATO'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div className="grid grid-cols-2 gap-3 anim-up" style={{ animationDelay: '160ms' }}>
          <button onClick={() => store.setScreen('wrong')}
            className="relative overflow-hidden p-4 text-left transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
            style={{ background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)', borderRadius: 'var(--radius-xl)', boxShadow: '0 4px 20px rgba(239, 68, 68, 0.25)' }}>
            <div className="absolute inset-0 opacity-10" style={{ background: 'radial-gradient(circle at 80% 80%, rgba(255,255,255,0.3), transparent 60%)' }} />
            <div className="relative z-10">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg mb-2" style={{ background: 'rgba(255,255,255,0.2)' }}>
                🔄
              </div>
              <p className="text-[13px] font-bold text-white">Le Mie Risposte Sbagliate</p>
              <p className="text-[10px] mt-0.5 font-medium" style={{ color: 'rgba(255,255,255,0.8)' }}>{wrong.total} da ripassare</p>
            </div>
          </button>

          <button onClick={() => store.goHome()}
            className="relative overflow-hidden p-4 text-left transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
            style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', borderRadius: 'var(--radius-xl)', boxShadow: '0 4px 20px rgba(16, 185, 129, 0.25)' }}>
            <div className="absolute inset-0 opacity-10" style={{ background: 'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.3), transparent 60%)' }} />
            <div className="relative z-10">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg mb-2" style={{ background: 'rgba(255,255,255,0.2)' }}>
                📚
              </div>
              <p className="text-[13px] font-bold text-white">Tutti i Capitoli</p>
              <p className="text-[10px] mt-0.5 font-medium" style={{ color: 'rgba(255,255,255,0.8)' }}>25 capitoli di studio</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// STAT CARD
// ============================================================
function StatCard({ icon, value, label, color, glow }: { icon: string; value: number | string; label: string; color: string; glow: string }) {
  return (
    <div className={`glass ${glow} p-4 text-center transition-all duration-300 hover:scale-[1.03]`}>
      <span className="text-lg mb-1 block">{icon}</span>
      <p className="text-xl font-extrabold tabular-nums" style={{ color }}>{value}</p>
      <p className="text-[10px] mt-1 font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{label}</p>
    </div>
  );
}
