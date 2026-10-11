import { useState, useRef, useEffect, KeyboardEvent } from 'react';

interface Props {
  onSend: (text: string) => Promise<string | null>;
  disabled?: boolean;
}

export default function MessageInput({ onSend, disabled }: Props) {
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!disabled) ref.current?.focus();
  }, [disabled]);

  const submit = async () => {
    const trimmed = text.trim();
    if (!trimmed || disabled || sending) return;
    setText('');
    if (ref.current) ref.current.style.height = 'auto';
    setError('');
    setSending(true);
    const err = await onSend(trimmed);
    setSending(false);
    if (err) {
      setError(err);
      setText(trimmed);
    }
  };

  const handleKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(); }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    if (error) setError('');
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px';
  };

  return (
    <div className="bg-[#1e1f2e] border-t border-white/5">
      {error && (
        <div className="px-4 pt-2 pb-1 flex items-center gap-2">
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-red-400 flex-shrink-0">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
          <p className="text-red-400 text-xs">{error}</p>
        </div>
      )}
      <div className="flex items-end gap-2 px-4 py-3">
        {/* Attach */}
        <button disabled={disabled || sending} title="Прикрепить"
          className="w-9 h-9 flex-shrink-0 flex items-center justify-center text-[#5c6070] hover:text-[#a78bfa] disabled:opacity-40 transition-colors mb-0.5">
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
            <path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z" />
          </svg>
        </button>

        {/* Textarea */}
        <div className="flex-1 bg-[#2a2b3d] rounded-2xl px-4 py-2.5 flex items-end gap-2">
          <textarea
            ref={ref}
            value={text}
            onChange={handleChange}
            onKeyDown={handleKey}
            placeholder="Сообщение"
            disabled={disabled || sending}
            rows={1}
            className="flex-1 text-sm text-white placeholder-[#5c6070] bg-transparent focus:outline-none max-h-32 leading-5 disabled:opacity-60"
            style={{ height: 'auto' }}
          />
          <button disabled={disabled || sending} title="Эмодзи"
            className="flex-shrink-0 text-[#5c6070] hover:text-[#a78bfa] disabled:opacity-40 transition-colors mb-0.5">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
              <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
            </svg>
          </button>
        </div>

        {/* Send / Mic */}
        {text.trim() || sending ? (
          <button onClick={submit} disabled={disabled || sending} title="Отправить"
            className="w-10 h-10 flex-shrink-0 rounded-full bg-[#7b61ff] hover:bg-[#6a50ee] disabled:opacity-60 flex items-center justify-center transition-colors mb-0.5 shadow-lg">
            {sending ? (
              <svg className="w-4 h-4 animate-spin fill-white" viewBox="0 0 24 24">
                <path d="M12 4V2A10 10 0 0 0 2 12h2a8 8 0 0 1 8-8z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            )}
          </button>
        ) : (
          <button disabled={disabled} title="Голосовое"
            className="w-10 h-10 flex-shrink-0 flex items-center justify-center text-[#5c6070] hover:text-[#a78bfa] disabled:opacity-40 transition-colors mb-0.5">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5zm6 6c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
