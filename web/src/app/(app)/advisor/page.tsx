'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Business, ChatMessage } from '@/lib/types';
import { marked } from 'marked';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedAIChat } from '@/components/ui/animated-ai-chat';
import { Zap, Bot } from 'lucide-react';
import { BackgroundPaths } from '@/components/ui/background-paths';
import { WaveText } from '@/components/ui/wave-text';

const SUGGESTED = [
  'What are the key DSCR risks for this borrower?',
  'Does this borrower qualify for SBA 7(a) financing?',
  'What due diligence documents should I request?',
  'What questions should I ask in the discovery call?',
  'What are the main credit risks in this application?',
];

export default function AdvisorPage() {
  const supabase = createClient();
  const [business, setBusiness] = useState<Business | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

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

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      created_at: new Date().toISOString(),
    };
    setMessages(m => [...m, userMsg]);
    setLoading(true);

    await supabase.from('chat_history').insert({
      role: 'user', content: text,
      user_id: (await supabase.auth.getUser()).data.user?.id,
    });

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'advisor', message: text,
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

  if (initialLoad) {
    return (
      <div className="flex flex-col p-6 gap-3">
        {[60, 120, 60, 80].map((h, i) => (
          <div key={i} className="skeleton rounded-2xl" style={{ height: h }} />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col" style={{ height: '100%', background: 'var(--bg-base)', position: 'relative' }}>
      <div className="opacity-[0.035] pointer-events-none fixed inset-0 z-0"><BackgroundPaths /></div>

      {/* Page header */}
      <div className="flex items-center gap-3 px-6 py-4 flex-shrink-0 relative z-10"
        style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-surface)' }}>
        <div className="w-9 h-9 flex items-center justify-center flex-shrink-0"
          style={{ background: 'var(--accent-dim)', border: '1px solid var(--accent-border)', borderRadius: 6 }}>
          <Bot size={18} style={{ color: 'var(--accent)' }} />
        </div>
        <div>
          <div className="font-black text-sm tracking-tight" style={{ color: 'var(--text-primary)' }}>
            <WaveText text="AI Underwriter Advisor" />
          </div>
          <div className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
            Powered by Claude · SBA 7(a) financial intelligence
          </div>
        </div>
        <div className="ml-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold"
          style={{ background: 'var(--accent-dim)', border: '1px solid var(--accent-border)', color: 'var(--accent)' }}>
          <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--accent)' }} />
          Live
        </div>
      </div>

      {/* Message list */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4" style={{ minHeight: 0 }}>
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-lg mx-auto text-center pt-8"
          >
            <div className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center"
              style={{ background: 'var(--accent-dim)', border: '1px solid var(--accent-border)' }}>
              <Zap size={28} style={{ color: 'var(--accent)' }} />
            </div>
            <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              {business ? `Analyzing ${business.business_name}` : 'Your AI Financial Advisor'}
            </h2>
            <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
              Ask me anything about DSCR, SBA qualification, due diligence, or credit risk.
            </p>
            <div className="grid gap-2">
              {SUGGESTED.map(q => (
                <button key={q} onClick={() => send(q)}
                  className="text-left px-4 py-3 rounded-xl text-sm transition-all duration-150 hover:opacity-80"
                  style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                  {q}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        <AnimatePresence initial={false}>
          {messages.map(msg => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className={`flex gap-3 items-end ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-lg flex-shrink-0 mb-0.5 flex items-center justify-center"
                  style={{ background: 'var(--accent)', boxShadow: '0 2px 8px rgba(69,128,245,0.3)' }}>
                  <Bot size={14} style={{ color: '#fff' }} />
                </div>
              )}
              <div
                className="max-w-[72%] px-4 py-3 text-sm leading-relaxed"
                style={{
                  background: msg.role === 'user' ? 'var(--accent)' : 'var(--bg-surface)',
                  color: msg.role === 'user' ? '#fff' : 'var(--text-primary)',
                  border: msg.role === 'assistant' ? '1px solid var(--border)' : 'none',
                  borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                }}
              >
                {msg.role === 'assistant'
                  ? <div className="prose-dark" dangerouslySetInnerHTML={{ __html: marked(msg.content) as string }} />
                  : msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        <AnimatePresence>
          {loading && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="flex gap-3 items-end">
              <div className="w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center" style={{ background: 'var(--accent)' }}>
                <Bot size={14} style={{ color: '#fff' }} />
              </div>
              <div className="px-4 py-3 flex gap-1 items-center"
                style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '18px 18px 18px 4px' }}>
                {[0, 1, 2].map(i => (
                  <motion.div key={i} className="w-1.5 h-1.5 rounded-full"
                    style={{ background: 'var(--text-tertiary)' }}
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15 }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={bottomRef} />
      </div>

      {/* Animated chat input — dark panel regardless of theme */}
      <div className="flex-shrink-0 px-6 py-4"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(10,10,10,0.75)', backdropFilter: 'blur(20px)' }}>
        <AnimatedAIChat onSend={send} isExternalLoading={loading} />
        <p className="text-center mt-2 text-[10px]" style={{ color: '#444' }}>
          For loan officer review only · Not a credit decision tool
        </p>
      </div>

      <style>{`@keyframes bounce{from{transform:translateY(0)}to{transform:translateY(-4px)}}`}</style>
    </div>
  );
}
