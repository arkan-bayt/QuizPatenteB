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
    setMsg(text); setMsgType(type); setTimeout(() => setMsg(''), 3000);
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

  const activeAssignments = assignments.filter((a) => a.is_active && a._student_status && ['pending', 'in_progress'].includes(a._student_status));
  const completedAssignments = assignments.filter((a) => a._student_status === 'completed' || (a._best_result && a._best_result.score !== undefined));

  const handleStart = async (assignment: Assignment) => {
    const res = await startAssignment(assignment.id, studentId);
    if (res.ok) showMsg('Quiz iniziato! Buona fortuna!', 'success');
    else showMsg(res.msg, 'error');
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-12">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-3.5 flex items-center gap-3">
          <button onClick={() => store.goHome()} className="p-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <div className="flex-1">
            <h1 className="text-base font-bold text-gray-900">Il Mio Dashboard</h1>
            <p className="text-[11px] text-gray-400">{user?.full_name || user?.username || ''}</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {msg && (
          <div className={`p-4 rounded-xl text-sm text-center anim-slide-down ${msgType === 'success' ? 'bg-emerald-50 border border-emerald-100 text-emerald-700' : 'bg-red-50 border border-red-100 text-red-700'}`}>
            {msg}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 anim-up stagger">
          <StatCard icon="📋" value={totalAnswered} label="Risposte" color="#4F46E5" border="border-l-indigo-400" />
          <StatCard icon="✅" value={`${accuracy}%`} label="Corrette" color="#059669" border="border-l-emerald-400" />
          <StatCard icon="🔥" value={stats.streak} label="Serie" color="#D97706" border="border-l-amber-400" />
          <StatCard icon="❌" value={wrong.total} label="Da ripassare" color="#DC2626" border="border-l-red-400" />
        </div>

        {/* Active Assignments */}
        <div className="anim-up">
          <div className="flex items-center gap-2 mb-3 px-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500">Compiti Assegnati ({assignments.filter((a) => a.is_active).length})</h2>
          </div>

          {loading ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
              <div className="w-6 h-6 rounded-full border-2 animate-spin mx-auto border-gray-200 border-t-[#4F46E5]" />
              <p className="text-xs mt-3 text-gray-400">Caricamento...</p>
            </div>
          ) : assignments.filter((a) => a.is_active).length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
              <div className="text-3xl mb-3">🎉</div>
              <p className="text-sm font-medium text-gray-500">Nessun compito assegnato</p>
              <p className="text-xs mt-1 text-gray-400">Il tuo insegnante non ha ancora creato compiti</p>
            </div>
          ) : (
            <div className="space-y-2">
              {assignments.filter((a) => a.is_active).map((a, i) => {
                const status = a._student_status || 'pending';
                const attemptsUsed = a._student_attempts || 0;
                const maxAttempts = a.config.max_attempts;
                const attemptsLeft = Math.max(0, maxAttempts - attemptsUsed);
                const bestResult = a._best_result;
                const canStart = status !== 'completed' && attemptsLeft > 0;
                const canRetry = status === 'completed' && attemptsLeft > 0;

                return (
                  <div key={a.id} className="bg-white rounded-xl border border-gray-100 p-4 anim-up" style={{ animationDelay: `${i * 30}ms` }}>
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg flex-shrink-0 ${
                        status === 'completed'
                          ? (bestResult && bestResult.score >= 21 ? 'bg-emerald-50' : 'bg-red-50')
                          : status === 'in_progress' ? 'bg-amber-50' : 'bg-indigo-50'
                      }`}>
                        {status === 'completed' ? (bestResult && bestResult.score >= 21 ? '✅' : '❌') : status === 'in_progress' ? '🔄' : '📝'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900">{a.title}</p>
                        {a.description && <p className="text-xs text-gray-400 mt-0.5 truncate">{a.description}</p>}
                        <div className="flex items-center gap-3 mt-2 flex-wrap">
                          <span className="text-[10px] text-gray-400">📋 {a.config.number_of_questions > 0 ? `${a.config.number_of_questions} domande` : 'Tutti i capitoli'}</span>
                          {a.config.chapters && a.config.chapters.length > 0 && <span className="text-[10px] text-gray-400">📚 Cap. {a.config.chapters.join(', ')}</span>}
                          {a.config.time_limit_minutes && <span className="text-[10px] text-gray-400">⏱️ {a.config.time_limit_minutes} min</span>}
                          <span className="text-[10px] text-gray-400">🔄 {attemptsLeft}/{maxAttempts} rimasti</span>
                        </div>
                        {bestResult && (
                          <div className="mt-2 flex items-center gap-2">
                            <span className={`text-xs font-bold ${bestResult.score >= 21 ? 'text-emerald-600' : 'text-red-600'}`}>
                              Punteggio: {bestResult.score}/30
                            </span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${bestResult.score >= 21 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                              {bestResult.score >= 21 ? 'SUPERATO' : 'NON SUPERATO'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="mt-3">
                      {canStart && (
                        <button onClick={() => handleStart(a)} className="w-full py-3 text-white font-bold text-[13px] rounded-xl bg-emerald-600 hover:bg-emerald-700 transition-colors">▶ Inizia</button>
                      )}
                      {canRetry && (
                        <button onClick={() => handleStart(a)} className="w-full py-3 text-white font-bold text-[13px] rounded-xl bg-amber-600 hover:bg-amber-700 transition-colors">🔄 Riprova ({attemptsLeft} rimasti)</button>
                      )}
                      {status === 'completed' && attemptsLeft === 0 && (
                        <div className="text-center py-2"><span className="text-xs text-gray-400">Tentativi esauriti</span></div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Completed */}
        {completedAssignments.length > 0 && (
          <div className="anim-up">
            <div className="flex items-center gap-2 mb-3 px-1">
              <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500">Completati ({completedAssignments.length})</h2>
            </div>
            <div className="space-y-2">
              {completedAssignments.map((a, i) => {
                const bestResult = a._best_result;
                const passed = bestResult ? bestResult.score >= 21 : false;
                return (
                  <div key={a.id} className="bg-white rounded-xl border border-gray-100 p-3.5 flex items-center gap-3 anim-up" style={{ animationDelay: `${i * 25}ms` }}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0 ${passed ? 'bg-emerald-50' : 'bg-red-50'}`}>
                      {passed ? '✅' : '❌'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-900 truncate">{a.title}</p>
                      <p className="text-[10px] text-gray-400">
                        {bestResult ? `Punteggio: ${bestResult.score}/30` : ''}
                        {a._student_assigned_at ? ` · ${new Date(a._student_assigned_at).toLocaleDateString('it')}` : ''}
                      </p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full flex-shrink-0 ${passed ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                      {passed ? 'SUPERATO' : 'NON SUPERATO'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div className="grid grid-cols-2 gap-3 anim-up">
          <button onClick={() => store.setScreen('wrong')} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-left hover:shadow-md hover:border-gray-200 transition-all">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-lg mb-2">🔄</div>
            <p className="text-sm font-bold text-gray-900">Le Mie Risposte Sbagliate</p>
            <p className="text-xs text-gray-400 mt-0.5">{wrong.total} da ripassare</p>
          </button>

          <button onClick={() => store.goHome()} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-left hover:shadow-md hover:border-gray-200 transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-lg mb-2">📚</div>
            <p className="text-sm font-bold text-gray-900">Tutti i Capitoli</p>
            <p className="text-xs text-gray-400 mt-0.5">25 capitoli di studio</p>
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, value, label, color, border }: { icon: string; value: number | string; label: string; color: string; border: string }) {
  return (
    <div className={`bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center transition-all hover:shadow-md ${border} border-l-[3px]`}>
      <span className="text-base mb-0.5 block">{icon}</span>
      <p className="text-lg font-bold tabular-nums" style={{ color }}>{value}</p>
      <p className="text-[10px] mt-0.5 font-semibold uppercase tracking-wider text-gray-400">{label}</p>
    </div>
  );
}
