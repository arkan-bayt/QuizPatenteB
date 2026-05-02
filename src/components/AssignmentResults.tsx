'use client';
import React, { useEffect, useState } from 'react';
import { useStore } from '@/store/useStore';
import { getAssignmentResults } from '@/logic/assignmentEngine';
import { AssignmentResultDetail, AssignmentResultsResponse } from '@/logic/assignmentEngine';

export default function AssignmentResults() {
  const store = useStore();
  const { user, activeAssignmentId } = store;
  const teacherId = user?.id || '';

  const [results, setResults] = useState<AssignmentResultsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!activeAssignmentId) return;
    const load = async () => {
      setLoading(true);
      const data = await getAssignmentResults(activeAssignmentId, teacherId);
      setResults(data);
      setLoading(false);
    };
    load();
  }, [activeAssignmentId, teacherId]);

  const summary = results?.summary;
  const students = results?.students || [];
  const assignmentInfo = results?.assignment;

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div className="min-h-screen bg-mesh pb-12">
      {/* Header */}
      <div className="sticky top-0 z-30 glass-header">
        <div className="max-w-2xl mx-auto px-5 py-4 flex items-center gap-3">
          <button onClick={() => store.openTeacherDashboard()}
            className="btn-ghost p-2" style={{ borderRadius: 12 }}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-[16px] font-bold truncate" style={{ color: 'var(--text-primary)' }}>
              {assignmentInfo?.title || 'Risultati Compito'}
            </h1>
            <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
              Risultati degli studenti
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-5 pt-6 space-y-6">
        {loading ? (
          <div className="glass p-10 text-center anim-up">
            <div className="w-10 h-10 rounded-full border-2 animate-spin mx-auto" style={{ borderColor: 'var(--primary-150)', borderTopColor: 'var(--primary-light)' }} />
            <p className="text-[13px] mt-4" style={{ color: 'var(--text-muted)' }}>Caricamento risultati...</p>
          </div>
        ) : !results?.ok ? (
          <div className="glass p-10 text-center anim-up">
            <div className="text-4xl mb-3">❌</div>
            <h2 className="text-[18px] font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Errore</h2>
            <p className="text-[13px]" style={{ color: 'var(--text-muted)' }}>{results?.msg || 'Impossibile caricare i risultati'}</p>
            <button onClick={() => store.openTeacherDashboard()}
              className="mt-5 px-6 py-3 text-white font-semibold text-[13px] transition-all duration-300 hover:scale-[1.05]"
              style={{ background: 'linear-gradient(135deg, var(--primary), var(--primary-light))', borderRadius: 'var(--radius-xl)' }}>
              Torna al Dashboard
            </button>
          </div>
        ) : (
          <>
            {/* Assignment Config Info */}
            {assignmentInfo && (
              <div className="glass p-5 anim-up">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)' }}>
                    📝
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-bold" style={{ color: 'var(--text-primary)' }}>{assignmentInfo.title}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[10px] font-semibold" style={{ color: 'var(--text-muted)' }}>
                        📋 {assignmentInfo.config.number_of_questions > 0 ? `${assignmentInfo.config.number_of_questions} domande` : 'Tutti i capitoli'}
                      </span>
                      {assignmentInfo.config.time_limit_minutes && (
                        <span className="text-[10px] font-semibold" style={{ color: 'var(--text-muted)' }}>
                          ⏱️ {assignmentInfo.config.time_limit_minutes} min
                        </span>
                      )}
                      <span className="text-[10px] font-semibold" style={{ color: 'var(--text-muted)' }}>
                        🔄 Max {assignmentInfo.config.max_attempts} tentativi
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Summary Stats */}
            {summary && (
              <div className="grid grid-cols-4 gap-3 anim-up stagger">
                <SummaryStatCard icon="👥" value={summary.total_students} label="Assegnati" color="var(--primary-light)" glow="stat-glow-blue" />
                <SummaryStatCard icon="✅" value={summary.completed} label="Completati" color="var(--success)" glow="stat-glow-green" />
                <SummaryStatCard icon="📊" value={summary.avg_score > 0 ? `${summary.avg_score.toFixed(1)}` : '—'} label="Media" color="var(--accent)" glow="stat-glow-amber" />
                <SummaryStatCard icon="🏆" value={summary.pass_rate > 0 ? `${summary.pass_rate.toFixed(0)}%` : '—'} label="Pass rate" color="#8B5CF6" glow="stat-glow-amber" />
              </div>
            )}

            {/* Pending count */}
            {summary && summary.pending > 0 && (
              <div className="glass p-3 anim-up flex items-center gap-2">
                <svg className="w-4 h-4" style={{ color: 'var(--accent)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-[12px]" style={{ color: 'var(--text-muted)' }}>
                  <span className="font-semibold" style={{ color: 'var(--accent)' }}>{summary.pending}</span> studenti in attesa &middot;{' '}
                  <span className="font-semibold" style={{ color: 'var(--primary-light)' }}>{summary.in_progress}</span> in corso
                </p>
              </div>
            )}

            {/* Student Results List */}
            <div className="anim-up" style={{ animationDelay: '100ms' }}>
              <div className="flex items-center gap-2.5 mb-4 px-1">
                <div className="icon-box icon-box-green w-7 h-7">
                  <svg className="w-3.5 h-3.5" style={{ color: 'var(--success)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-[12px] font-bold uppercase tracking-[0.12em]" style={{ color: 'var(--text-muted)' }}>
                  Risultati Studenti
                </h2>
              </div>

              {students.length === 0 ? (
                <div className="glass p-10 text-center">
                  <div className="text-4xl mb-3">📋</div>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Nessun risultato disponibile</p>
                  <p className="text-[11px] mt-1" style={{ color: 'var(--text-muted)' }}>I risultati appariranno quando gli studenti completano il compito</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {students.map((student, i) => {
                    const statusColor = student.status === 'completed'
                      ? (student.best_score >= 21 ? 'var(--success)' : 'var(--danger)')
                      : student.status === 'in_progress'
                        ? 'var(--accent)'
                        : 'var(--text-muted)';

                    const statusBg = student.status === 'completed'
                      ? (student.best_score >= 21 ? 'rgba(34, 197, 94, 0.12)' : 'rgba(239, 68, 68, 0.12)')
                      : student.status === 'in_progress'
                        ? 'rgba(245, 158, 11, 0.12)'
                        : 'var(--bg-tertiary)';

                    const statusLabel = student.status === 'completed'
                      ? (student.best_score >= 21 ? 'SUPERATO' : 'NON SUPERATO')
                      : student.status === 'in_progress'
                        ? 'IN CORSO'
                        : 'IN ATTESA';

                    const statusIcon = student.status === 'completed'
                      ? (student.best_score >= 21 ? '✅' : '❌')
                      : student.status === 'in_progress'
                        ? '🔄'
                        : '⏳';

                    return (
                      <div key={student.student_id} className="glass p-4 anim-up" style={{ animationDelay: `${i * 40}ms` }}>
                        <div className="flex items-center gap-3">
                          {/* Avatar */}
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                            style={{
                              background: student.status === 'completed'
                                ? (student.best_score >= 21
                                  ? 'linear-gradient(135deg, #22C55E, #16A34A)'
                                  : 'linear-gradient(135deg, #EF4444, #DC2626)')
                                : student.status === 'in_progress'
                                  ? 'linear-gradient(135deg, #F59E0B, #D97706)'
                                  : 'linear-gradient(135deg, #94A3B8, #64748B)',
                            }}>
                            {statusIcon}
                          </div>

                          {/* Student Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-[14px] font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                                {student.full_name || student.username}
                              </p>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0" style={{
                                background: statusBg,
                                color: statusColor,
                              }}>
                                {statusLabel}
                              </span>
                            </div>
                            <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>@{student.username}</p>
                          </div>

                          {/* Score */}
                          <div className="text-right flex-shrink-0">
                            {student.status === 'completed' && student.result_count > 0 ? (
                              <>
                                <p className="text-[18px] font-extrabold tabular-nums" style={{ color: statusColor }}>
                                  {student.best_score}/30
                                </p>
                                <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                                  {student.best_correct} corrette · {formatTime(student.best_time)}
                                </p>
                              </>
                            ) : (
                              <>
                                <p className="text-[14px] font-bold" style={{ color: 'var(--text-muted)' }}>—</p>
                                <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                                  {student.attempts > 0 ? `${student.attempts} tentativi` : 'Non iniziato'}
                                </p>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Attempt history */}
                        {student.results && student.results.length > 1 && (
                          <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                            <p className="text-[10px] font-bold mb-1.5 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Cronologia tentativi</p>
                            <div className="flex flex-wrap gap-1.5">
                              {student.results.map((r, ri) => {
                                const passed = r.score >= 21;
                                return (
                                  <span key={ri} className="text-[10px] font-semibold px-2 py-1 rounded-lg"
                                    style={{
                                      background: passed ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                      color: passed ? 'var(--success)' : 'var(--danger)',
                                    }}>
                                    #{ri + 1}: {r.score}/30
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ============================================================
// SUMMARY STAT CARD
// ============================================================
function SummaryStatCard({ icon, value, label, color, glow }: { icon: string; value: number | string; label: string; color: string; glow: string }) {
  return (
    <div className={`glass ${glow} p-4 text-center transition-all duration-300 hover:scale-[1.03]`}>
      <span className="text-lg mb-1 block">{icon}</span>
      <p className="text-xl font-extrabold tabular-nums" style={{ color }}>{value}</p>
      <p className="text-[10px] mt-1 font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{label}</p>
    </div>
  );
}
