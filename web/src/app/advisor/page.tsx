'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Business, ChatMessage } from '@/lib/types';
import { marked } from 'marked';

const SUGGESTED = [
  'What is my business worth?',
  'How can I improve my valuation?',
  'What are the best exit strategies for my business?',
  'How do I prepare for due diligence?',
];

export default function AdvisorPage() {
  const supabase = createClient();
  const [business, setBusiness] = useState<Business | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const [{ data: biz }, { data: hist }] = await Promise.all([
        supabase.from('businesses').select('*').eq('user_id', user.id).single(),
        supabase.from('chat_history').select('*').eq('user_id', user.id).order('created_at', { ascending: true }).limit(50),
      ]);
      if (biz) setBusiness(biz as Business);
      if (hist) setMessages(hist as ChatMessage[]);
      setInitialLoad(false);
    }
    load();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  async function send(text: string) {
    if (!text.trim() || !business || loading) return;
    setInput('');

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: text, created_at: new Date().toISOString() };
    setMessages(m => [...m, userMsg]);
    setLoading(true);

    // Save user message
    await supabase.from('chat_history').insert({ role: 'user', content: text, user_id: (await supabase.auth.getUser()).data.user?.id });

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'advisor',
          message: text,
          history: messages.slice(-10).map(m => ({ role: m.role, content: m.content })),
          business,
        }),
      });
      const data = await res.json();
      const content = data.result || data.error || 'Sorry, I encountered an error.';
      const aiMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'assistant', content, created_at: new Date().toISOString() };
      setMessages(m => [...m, aiMsg]);

      const { data: { user } } = await supabase.auth.getUser();
      if (user) await supabase.from('chat_history').insert({ role: 'assistant', content, user_id: user.id });
    } catch {
      setMessages(m => [...m, { id: Date.now().toString(), role: 'assistant', content: 'Network error. Please try again.', created_at: new Date().toISOString() }]);
    }
    setLoading(false);
  }

  function handleKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  }

  function handleInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }

  if (initialLoad) {
    return <div style={{ padding: '2rem', color: 'var(--text-secondary)' }}>Loading...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Header */}
      <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', background: 'var(--bg-surface)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <div style={{ width: 32, height: 32, background: 'var(--green)', borderRadius: '0.375rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.75rem', color: '#000' }}>CT</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>AI Advisor</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>Powered by Claude · M&A & Financial Intelligence</div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {messages.length === 0 && (
          <div style={{ margin: 'auto', textAlign: 'center', maxWidth: 400 }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Your AI Financial Advisor</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Ask me anything about your business valuation, exit strategy, or financial health.</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              {SUGGESTED.map(q => (
                <button key={q} onClick={() => send(q)} className="btn-secondary" style={{ fontSize: '0.75rem', textAlign: 'left', padding: '0.625rem 0.75rem', whiteSpace: 'normal' }}>
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map(msg => (
          <div key={msg.id} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}>
            {msg.role === 'assistant' && (
              <div style={{ width: 28, height: 28, background: 'var(--green)', borderRadius: '0.375rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.65rem', color: '#000', flexShrink: 0, marginTop: 2 }}>CT</div>
            )}
            <div style={{
              maxWidth: '70%',
              background: msg.role === 'user' ? 'var(--green)' : 'var(--bg-surface)',
              color: msg.role === 'user' ? '#000' : 'var(--text-primary)',
              borderRadius: msg.role === 'user' ? '1rem 1rem 0 1rem' : '1rem 1rem 1rem 0',
              padding: '0.75rem 1rem',
              fontSize: '0.875rem',
              lineHeight: 1.6,
              border: msg.role === 'assistant' ? '1px solid var(--border)' : 'none',
            }}>
              {msg.role === 'assistant' ? (
                <div className="prose-dark" dangerouslySetInnerHTML={{ __html: marked(msg.content) as string }} />
              ) : msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <div style={{ width: 28, height: 28, background: 'var(--green)', borderRadius: '0.375rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.65rem', color: '#000', flexShrink: 0 }}>CT</div>
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '1rem 1rem 1rem 0', padding: '0.75rem 1rem', display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--text-tertiary)', animation: `bounce 0.8s ease ${i * 0.15}s infinite alternate` }} />
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border)', background: 'var(--bg-surface)', flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '0.75rem', padding: '0.5rem 0.75rem' }}>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInput}
            onKeyDown={handleKey}
            placeholder="Ask anything about your business..."
            rows={1}
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: '0.875rem', resize: 'none', maxHeight: 160, lineHeight: 1.5, fontFamily: 'inherit' }}
          />
          <button
            onClick={() => send(input)}
            disabled={!input.trim() || loading}
            style={{
              background: input.trim() && !loading ? 'var(--green)' : 'var(--bg-overlay)',
              border: 'none', borderRadius: '0.5rem', padding: '0.4rem 0.75rem',
              color: input.trim() && !loading ? '#000' : 'var(--text-tertiary)',
              fontWeight: 700, fontSize: '0.8rem', cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
              flexShrink: 0, transition: 'background 0.15s ease',
            }}
          >
            Send
          </button>
        </div>
        <div style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', marginTop: '0.375rem', textAlign: 'center' }}>
          Enter to send · Shift+Enter for new line
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          from { transform: translateY(0); }
          to { transform: translateY(-4px); }
        }
      `}</style>
    </div>
  );
}
