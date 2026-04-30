'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '@/store/useStore';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  fallback?: boolean;
}

// Helper: detect if text contains Arabic
function isArabicMessage(text: string): boolean {
  const arabicRegex = /[\u0600-\u06FF]/;
  return arabicRegex.test(text);
}

const QUICK_QUESTIONS_IT = [
  { icon: '🚗', text: 'Limiti di velocita\'' },
  { icon: '🛑', text: 'Segnali stradali' },
  { icon: '🔄', text: 'Regole di precedenza' },
  { icon: '🍺', text: 'Alcol alla guida' },
  { icon: '📝', text: 'Esame patente B' },
  { icon: '🅿️', text: 'Regole parcheggio' },
  { icon: '💡', text: 'Luci e fari' },
  { icon: '🛡️', text: 'Equipaggiamento sicurezza' },
];

const QUICK_QUESTIONS_AR = [
  { icon: '🚗', text: 'حدود السرعة' },
  { icon: '🛑', text: 'العلامات المرورية' },
  { icon: '🔄', text: 'قواعد الأفضلية' },
  { icon: '🍺', text: 'الكحول والقيادة' },
  { icon: '📝', text: 'امتحان رخصة B' },
  { icon: '🅿️', text: 'قواعد الركن' },
  { icon: '💡', text: 'الأنوار' },
  { icon: '🛡️', text: 'معدات السلامة' },
  { icon: '📱', text: 'استخدام الهاتف' },
  { icon: '↔️', text: 'علامات الاتجاه الإلزامي' },
];

export default function AIChatScreen() {
  const store = useStore();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isArabic, setIsArabic] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // Add welcome message
    if (messages.length === 0) {
      setMessages([{
        id: 'welcome',
        role: 'assistant',
        content: 'مرحباً! أنا مساعدك الذكي لرخصة القيادة B 🇮🇹\n\nيمكنك سؤالي بأي لغة!\n- اكتب بالعربي ← أجيب بالعربي\n- اكتب بالايطالي ← أجيب بالايطالي\n- اكتب "بالايتالي" ← أجيب بالايطالي حتى لو كتبت بالعربي\n\nاسألني عن العلامات، السرعة، الأفضلية، الامتحان وأي شيء آخر!',
      }]);
    }
  }, []);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    // Auto-detect language
    const arabicRegex = /[\u0600-\u06FF]/;
    const arWords = ['شرح', 'ايش', 'ماذا', 'كيف', 'لماذا', 'متى', 'اين', 'هل', 'السرعة', 'العلامات', 'الرخصة', 'الامتحان', 'حدود', 'قواعد', 'الكحول', 'الأنوار', 'معدات', 'الاتجاه'];
    if (arabicRegex.test(text) || arWords.some(w => text.includes(w))) {
      setIsArabic(true);
    } else if (!/[\u0600-\u06FF]/.test(text) && /[a-zA-ZàèéìòùÀÈÉÌÒÙ]/.test(text)) {
      setIsArabic(false);
    }
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: text.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const history = messages.slice(-8).map(m => ({ role: m.role, content: m.content }));
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'chat', message: text.trim(), history }),
      });
      const data = await res.json();
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply || 'Non ho capito. Puoi ripetere la domanda?',
        fallback: data.fallback,
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Errore di connessione. Riprova.',
      }]);
    }
    setLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="min-h-screen bg-mesh flex flex-col">
      {/* Header */}
      <div className="glass-header px-5 py-4 sticky top-0 z-20">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button onClick={() => store.setScreen('home')}
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-xl transition-all duration-200 hover:scale-105"
            style={{ color: 'var(--text-muted)', background: 'var(--bg-tertiary)' }}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            Indietro
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)' }}>
              <span className="text-sm">🤖</span>
            </div>
            <div>
              <p className="text-[13px] font-bold" style={{ color: 'var(--text-primary)' }}>Assistente IA</p>
              <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Patente B</p>
            </div>
          </div>
          <button onClick={() => { setMessages([]); }}
            className="text-xs px-3 py-2 rounded-xl transition-all duration-200 hover:scale-105"
            style={{ color: 'var(--text-muted)', background: 'var(--bg-tertiary)' }}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
            </svg>
          </button>
          {/* Language Toggle */}
          <button onClick={() => { setIsArabic(!isArabic); setMessages([]); }}
            className="text-xs px-3 py-2 rounded-xl transition-all duration-200 hover:scale-105 font-bold"
            style={{ color: isArabic ? '#8B5CF6' : 'var(--text-muted)', background: isArabic ? 'rgba(139,92,246,0.15)' : 'var(--bg-tertiary)', border: isArabic ? '1px solid rgba(139,92,246,0.3)' : '1px solid transparent' }}>
            {isArabic ? 'عربي' : 'IT'}
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4" style={{ paddingBottom: '200px' }}>
        <div className="max-w-2xl mx-auto space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} anim-fade`}>
              <div className={`max-w-[85%] p-3.5 rounded-2xl ${
                msg.role === 'user'
                  ? 'text-white'
                  : ''
              }`}
                style={msg.role === 'user'
                  ? { background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)', borderBottomRightRadius: 6 }
                  : { background: 'var(--bg-card)', border: '1px solid var(--border)', borderBottomLeftRadius: 6 }
                }>
                {msg.role === 'assistant' && (
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-5 h-5 rounded-lg flex items-center justify-center" style={{ background: 'var(--primary-100)' }}>
                      <span className="text-[10px]">🤖</span>
                    </div>
                    <span className="text-[10px] font-semibold" style={{ color: 'var(--text-muted)' }}>Assistente IA</span>
                    {msg.fallback && (
                      <span className="text-[8px] px-1.5 py-0.5 rounded-full font-medium" style={{ background: 'var(--accent-100)', color: 'var(--accent)' }}>Offline</span>
                    )}
                  </div>
                )}
                <p className={`text-[13px] leading-relaxed whitespace-pre-line ${msg.role === 'user' ? 'font-medium' : ''}`}
                  style={{ color: msg.role === 'user' ? 'white' : 'var(--text-primary)', direction: isArabicMessage(msg.content) ? 'rtl' : 'ltr', textAlign: isArabicMessage(msg.content) ? 'right' : 'left' }}
                  dir={isArabicMessage(msg.content) ? 'rtl' : 'ltr'}>
                  {msg.content}
                </p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start anim-fade">
              <div className="p-3.5 rounded-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderBottomLeftRadius: 6 }}>
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-5 h-5 rounded-lg flex items-center justify-center" style={{ background: 'var(--primary-100)' }}>
                    <span className="text-[10px]">🤖</span>
                  </div>
                  <span className="text-[10px] font-semibold" style={{ color: 'var(--text-muted)' }}>Assistente IA</span>
                </div>
                <div className="flex items-center gap-1.5 py-1">
                  {[0, 1, 2].map(i => (
                    <div key={i} className="w-2 h-2 rounded-full animate-bounce" style={{ background: 'var(--primary-light)', animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick Questions + Input */}
      <div className="fixed bottom-0 left-0 right-0 z-40" style={{ background: 'linear-gradient(to top, var(--bg-primary) 75%, transparent)', paddingTop: 16, paddingBottom: 20 }}>
        <div className="max-w-2xl mx-auto px-5">
          {/* Quick Questions */}
          {messages.length <= 2 && (
            <div className="flex flex-wrap gap-2 mb-3 anim-up">
              {(isArabic ? QUICK_QUESTIONS_AR : QUICK_QUESTIONS_IT).map((q, i) => (
                <button key={i} onClick={() => sendMessage(q.text)}
                  className="px-3 py-2 rounded-xl text-[11px] font-medium transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-1.5"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-secondary)', animationDelay: `${i * 50}ms` }}>
                  <span className="text-xs">{q.icon}</span>
                  {q.text}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isArabic ? 'اسأل أي شيء عن رخصة القيادة...' : 'Chiedi qualsiasi cosa sulla patente...'}
              className="flex-1 px-4 py-3.5 rounded-2xl text-[14px] outline-none transition-all duration-200"
              style={{ background: 'var(--bg-card)', border: '1.5px solid var(--border)', color: 'var(--text-primary)' }}
              onFocus={(e) => e.target.style.borderColor = '#8B5CF6'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
            />
            <button type="submit" disabled={!input.trim() || loading}
              className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100"
              style={{ background: input.trim() ? 'linear-gradient(135deg, #8B5CF6, #7C3AED)' : 'var(--bg-tertiary)', boxShadow: input.trim() ? '0 4px 15px rgba(139,92,246,0.35)' : 'none' }}>
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
