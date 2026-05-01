'use client';
import React, { useState } from 'react';

interface QuestionCountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (count: number | 'all') => void;
  totalAvailable: number;
  title: string;
  subtitle?: string;
}

export default function QuestionCountModal({ isOpen, onClose, onConfirm, totalAvailable, title, subtitle }: QuestionCountModalProps) {
  const [customInput, setCustomInput] = useState('');
  const [selectedOption, setSelectedOption] = useState<'30' | 'all' | 'custom' | null>(null);

  if (!isOpen) return null;

  const has30 = totalAvailable >= 30;

  const handleCustomChange = (val: string) => {
    // Only allow digits
    const digits = val.replace(/\D/g, '');
    if (digits.length <= 4) {
      setCustomInput(digits);
      setSelectedOption('custom');
    }
  };

  const handleConfirm = () => {
    if (selectedOption === '30' && has30) {
      onConfirm(30);
    } else if (selectedOption === 'all') {
      onConfirm('all');
    } else if (selectedOption === 'custom') {
      const num = parseInt(customInput, 10);
      if (num > 0 && num <= totalAvailable) {
        onConfirm(num);
      }
    }
  };

  const canConfirm = () => {
    if (selectedOption === '30') return has30;
    if (selectedOption === 'all') return true;
    if (selectedOption === 'custom') {
      const num = parseInt(customInput, 10);
      return num > 0 && num <= totalAvailable;
    }
    return false;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm anim-fade" />

      {/* Modal */}
      <div
        className="relative w-full max-w-md mx-4 mb-4 sm:mb-0 anim-up"
        style={{ borderRadius: 'var(--radius-2xl)', background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-xl)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 pb-4" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)', boxShadow: '0 4px 12px rgba(245, 158, 11, 0.25)' }}>
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
              </svg>
            </div>
            <div>
              <h2 className="text-[16px] font-bold" style={{ color: 'var(--text-primary)' }}>{title}</h2>
              {subtitle && <p className="text-[12px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{subtitle}</p>}
            </div>
          </div>
        </div>

        {/* Options */}
        <div className="p-5 space-y-3">
          {/* Available info */}
          <div className="flex items-center gap-2 mb-2 px-1">
            <div className="w-2 h-2 rounded-full" style={{ background: 'var(--primary-light)' }} />
            <span className="text-[11px] font-medium" style={{ color: 'var(--text-muted)' }}>
              {totalAvailable} domanda/e disponibile/i
            </span>
          </div>

          {/* Option 1: 30 questions */}
          <button
            onClick={() => setSelectedOption('30')}
            disabled={!has30}
            className="w-full p-4 rounded-xl text-left transition-all duration-200"
            style={{
              background: selectedOption === '30' ? 'var(--primary-100)' : 'var(--bg-tertiary)',
              border: selectedOption === '30' ? '2px solid var(--primary-light)' : '2px solid transparent',
              opacity: has30 ? 1 : 0.4,
              cursor: has30 ? 'pointer' : 'not-allowed',
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                  style={{ background: selectedOption === '30' ? 'var(--primary-200)' : 'rgba(255,255,255,0.05)' }}>
                  30
                </div>
                <div>
                  <p className="text-[14px] font-bold" style={{ color: 'var(--text-primary)' }}>30 سؤال</p>
                  <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>امتحان قياسي (30 سؤال)</p>
                </div>
              </div>
              <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: selectedOption === '30' ? 'var(--primary-light)' : 'transparent', border: selectedOption === '30' ? '2px solid var(--primary-light)' : '2px solid var(--border)' }}>
                {selectedOption === '30' && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                )}
              </div>
            </div>
          </button>

          {/* Option 2: All questions */}
          <button
            onClick={() => setSelectedOption('all')}
            className="w-full p-4 rounded-xl text-left transition-all duration-200"
            style={{
              background: selectedOption === 'all' ? 'var(--primary-100)' : 'var(--bg-tertiary)',
              border: selectedOption === 'all' ? '2px solid var(--primary-light)' : '2px solid transparent',
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: selectedOption === 'all' ? 'var(--primary-200)' : 'rgba(255,255,255,0.05)' }}>
                  <svg className="w-5 h-5" style={{ color: 'var(--accent)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[14px] font-bold" style={{ color: 'var(--text-primary)' }}>كل الأسئلة</p>
                  <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{totalAvailable} سؤال كامل</p>
                </div>
              </div>
              <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: selectedOption === 'all' ? 'var(--primary-light)' : 'transparent', border: selectedOption === 'all' ? '2px solid var(--primary-light)' : '2px solid var(--border)' }}>
                {selectedOption === 'all' && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                )}
              </div>
            </div>
          </button>

          {/* Option 3: Custom number */}
          <button
            onClick={() => { setSelectedOption('custom'); }}
            className="w-full p-4 rounded-xl text-left transition-all duration-200"
            style={{
              background: selectedOption === 'custom' ? 'var(--primary-100)' : 'var(--bg-tertiary)',
              border: selectedOption === 'custom' ? '2px solid var(--primary-light)' : '2px solid transparent',
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: selectedOption === 'custom' ? 'var(--primary-200)' : 'rgba(255,255,255,0.05)' }}>
                  <svg className="w-5 h-5" style={{ color: '#8B5CF6' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-[14px] font-bold" style={{ color: 'var(--text-primary)' }}>عدد مخصص</p>
                  <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>اختر عدد الأسئلة</p>
                </div>
              </div>
              <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: selectedOption === 'custom' ? 'var(--primary-light)' : 'transparent', border: selectedOption === 'custom' ? '2px solid var(--primary-light)' : '2px solid var(--border)' }}>
                {selectedOption === 'custom' && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                )}
              </div>
            </div>

            {/* Custom input - only show when custom is selected */}
            {selectedOption === 'custom' && (
              <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={customInput}
                    onChange={(e) => handleCustomChange(e.target.value)}
                    placeholder="أدخل عدد الأسئلة..."
                    className="flex-1 px-4 py-3 rounded-xl text-[14px] font-semibold text-center tabular-nums"
                    style={{
                      background: 'var(--bg-primary)',
                      border: '2px solid var(--primary-200)',
                      color: 'var(--text-primary)',
                      outline: 'none',
                    }}
                    autoFocus
                  />
                </div>
                {customInput && (parseInt(customInput, 10) <= 0 || parseInt(customInput, 10) > totalAvailable) && (
                  <p className="text-[11px] mt-2 text-center" style={{ color: 'var(--danger)' }}>
                    يجب أن يكون العدد بين 1 و {totalAvailable}
                  </p>
                )}
              </div>
            )}
          </button>
        </div>

        {/* Actions */}
        <div className="p-5 pt-2 flex gap-3" style={{ borderTop: '1px solid var(--border)' }}>
          <button
            onClick={onClose}
            className="flex-1 py-3.5 rounded-xl text-[13px] font-semibold transition-all duration-200 hover:scale-[1.02]"
            style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
          >
            إلغاء
          </button>
          <button
            onClick={handleConfirm}
            disabled={!canConfirm()}
            className="flex-1 py-3.5 rounded-xl text-[13px] font-bold text-white transition-all duration-200 hover:scale-[1.02]"
            style={{
              background: canConfirm() ? 'linear-gradient(135deg, #F59E0B, #D97706)' : 'var(--bg-tertiary)',
              boxShadow: canConfirm() ? '0 4px 15px rgba(245, 158, 11, 0.35)' : 'none',
              opacity: canConfirm() ? 1 : 0.5,
              cursor: canConfirm() ? 'pointer' : 'not-allowed',
            }}
          >
            ابدأ الامتحان
          </button>
        </div>
      </div>
    </div>
  );
}
