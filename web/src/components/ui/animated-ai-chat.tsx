'use client';

import { useEffect, useRef, useCallback, useTransition, useState } from 'react';
import { cn } from '@/lib/utils';
import {
  TrendingUp, FileText, CheckSquare, Sparkles,
  Paperclip, SendIcon, XIcon, LoaderIcon, Command,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import * as React from 'react';

interface UseAutoResizeTextareaProps {
  minHeight: number;
  maxHeight?: number;
}

function useAutoResizeTextarea({ minHeight, maxHeight }: UseAutoResizeTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = useCallback((reset?: boolean) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    if (reset) { textarea.style.height = `${minHeight}px`; return; }
    textarea.style.height = `${minHeight}px`;
    const newHeight = Math.max(minHeight, Math.min(textarea.scrollHeight, maxHeight ?? Number.POSITIVE_INFINITY));
    textarea.style.height = `${newHeight}px`;
  }, [minHeight, maxHeight]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) textarea.style.height = `${minHeight}px`;
  }, [minHeight]);

  useEffect(() => {
    const handleResize = () => adjustHeight();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [adjustHeight]);

  return { textareaRef, adjustHeight };
}

interface CommandSuggestion {
  icon: React.ReactNode;
  label: string;
  description: string;
  prefix: string;
}

const sbaSuggestions: CommandSuggestion[] = [
  { icon: <TrendingUp className="w-4 h-4" />, label: 'DSCR Analysis', description: 'Run SBA ratio calculations', prefix: '/dscr' },
  { icon: <FileText className="w-4 h-4" />, label: 'Credit Memo', description: 'Generate AI credit memo draft', prefix: '/memo' },
  { icon: <CheckSquare className="w-4 h-4" />, label: 'Due Diligence', description: '12-category DD assessment', prefix: '/dd' },
  { icon: <Sparkles className="w-4 h-4" />, label: 'Qualify', description: 'Check SBA 7(a) eligibility', prefix: '/qualify' },
];

// ── Standalone full-page demo version ──
export function AnimatedAIChat({
  onSend,
  isExternalLoading = false,
}: {
  onSend?: (msg: string) => void;
  isExternalLoading?: boolean;
}) {
  const [value, setValue] = useState('');
  const [attachments, setAttachments] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [, startTransition] = useTransition();
  const [activeSuggestion, setActiveSuggestion] = useState<number>(-1);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({ minHeight: 60, maxHeight: 200 });
  const commandPaletteRef = useRef<HTMLDivElement>(null);

  const loading = isExternalLoading || isTyping;

  useEffect(() => {
    if (value.startsWith('/') && !value.includes(' ')) {
      setShowCommandPalette(true);
      const idx = sbaSuggestions.findIndex(c => c.prefix.startsWith(value));
      setActiveSuggestion(idx >= 0 ? idx : -1);
    } else {
      setShowCommandPalette(false);
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const btn = document.querySelector('[data-command-button]');
      if (commandPaletteRef.current && !commandPaletteRef.current.contains(e.target as Node) && !btn?.contains(e.target as Node)) {
        setShowCommandPalette(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (showCommandPalette) {
      if (e.key === 'ArrowDown') { e.preventDefault(); setActiveSuggestion(p => p < sbaSuggestions.length - 1 ? p + 1 : 0); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveSuggestion(p => p > 0 ? p - 1 : sbaSuggestions.length - 1); }
      else if (e.key === 'Tab' || e.key === 'Enter') {
        e.preventDefault();
        if (activeSuggestion >= 0) { setValue(sbaSuggestions[activeSuggestion].prefix + ' '); setShowCommandPalette(false); }
      }
      else if (e.key === 'Escape') { e.preventDefault(); setShowCommandPalette(false); }
    } else if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim()) handleSendMessage();
    }
  };

  const handleSendMessage = () => {
    if (!value.trim() || loading) return;
    if (onSend) {
      onSend(value.trim());
      setValue('');
      adjustHeight(true);
    } else {
      startTransition(() => {
        setIsTyping(true);
        setTimeout(() => { setIsTyping(false); setValue(''); adjustHeight(true); }, 2500);
      });
    }
  };

  const selectCommand = (index: number) => {
    setValue(sbaSuggestions[index].prefix + ' ');
    setShowCommandPalette(false);
    textareaRef.current?.focus();
  };

  return (
    <div className="w-full relative">
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-[#00E599]/5 rounded-full filter blur-[100px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-violet-500/5 rounded-full filter blur-[100px] animate-pulse" style={{ animationDelay: '700ms' }} />
      </div>

      <motion.div
        className="relative backdrop-blur-2xl rounded-2xl border shadow-2xl"
        style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)' }}
        initial={{ scale: 0.98, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <AnimatePresence>
          {showCommandPalette && (
            <motion.div
              ref={commandPaletteRef}
              className="absolute left-4 right-4 bottom-full mb-2 rounded-xl z-50 shadow-xl overflow-hidden"
              style={{ background: 'rgba(10,10,10,0.96)', border: '1px solid rgba(255,255,255,0.1)' }}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.15 }}
            >
              {sbaSuggestions.map((s, i) => (
                <div
                  key={s.prefix}
                  className={cn(
                    'flex items-center gap-3 px-4 py-2.5 text-xs cursor-pointer transition-colors',
                    activeSuggestion === i ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5'
                  )}
                  onClick={() => selectCommand(i)}
                >
                  <div className="text-white/50">{s.icon}</div>
                  <span className="font-semibold">{s.label}</span>
                  <span className="text-white/30 font-mono text-[10px]">{s.prefix}</span>
                  <span className="ml-auto text-white/30">{s.description}</span>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="p-4">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => { setValue(e.target.value); adjustHeight(); }}
            onKeyDown={handleKeyDown}
            placeholder="Ask about DSCR, qualification, credit risk… or type / for commands"
            className="w-full px-2 py-2 resize-none bg-transparent border-none text-white/90 text-sm focus:outline-none placeholder:text-white/20 min-h-[60px]"
            style={{ overflow: 'hidden' }}
          />
        </div>

        <AnimatePresence>
          {attachments.length > 0 && (
            <motion.div className="px-4 pb-3 flex gap-2 flex-wrap" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
              {attachments.map((file, i) => (
                <motion.div key={i} className="flex items-center gap-2 text-xs py-1.5 px-3 rounded-lg text-white/70" style={{ background: 'rgba(255,255,255,0.04)' }} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                  <span>{file}</span>
                  <button onClick={() => setAttachments(p => p.filter((_, j) => j !== i))} className="text-white/40 hover:text-white transition-colors"><XIcon className="w-3 h-3" /></button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="p-4 flex items-center justify-between gap-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="flex items-center gap-2">
            <motion.button type="button" onClick={() => setAttachments(p => [...p, `doc-${Math.floor(Math.random() * 999)}.pdf`])} whileTap={{ scale: 0.94 }} className="p-2 text-white/40 hover:text-white/80 rounded-lg transition-colors">
              <Paperclip className="w-4 h-4" />
            </motion.button>
            <motion.button type="button" data-command-button onClick={(e) => { e.stopPropagation(); setShowCommandPalette(p => !p); }} whileTap={{ scale: 0.94 }} className={cn('p-2 text-white/40 hover:text-white/80 rounded-lg transition-colors', showCommandPalette && 'bg-white/10 text-white/90')}>
              <Command className="w-4 h-4" />
            </motion.button>
            <span className="text-[10px] text-white/20 hidden md:block">Type / for SBA commands</span>
          </div>

          <motion.button
            type="button"
            onClick={handleSendMessage}
            whileTap={{ scale: 0.97 }}
            disabled={loading || !value.trim()}
            className={cn(
              'px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2',
              value.trim() && !loading ? 'bg-[#00E599] text-black shadow-lg shadow-[#00E599]/20' : 'text-white/30'
            )}
            style={{ background: value.trim() && !loading ? '#00E599' : 'rgba(255,255,255,0.05)' }}
          >
            {loading ? <LoaderIcon className="w-4 h-4 animate-spin" /> : <SendIcon className="w-4 h-4" />}
            <span>Send</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Quick suggestion chips */}
      <div className="flex flex-wrap gap-2 mt-3">
        {sbaSuggestions.map((s, i) => (
          <motion.button
            key={s.prefix}
            onClick={() => selectCommand(i)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-white/50 hover:text-white/80 transition-all"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            {s.icon}
            <span>{s.label}</span>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {loading && (
          <motion.div
            className="flex items-center gap-3 mt-3 px-4 py-2.5 rounded-full w-fit"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
          >
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold" style={{ background: '#00E599', color: '#000' }}>CT</div>
            <span className="text-xs text-white/60">Analyzing</span>
            <TypingDots />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TypingDots() {
  return (
    <div className="flex items-center gap-0.5">
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: '#00E599' }}
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.1, 0.8] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}
