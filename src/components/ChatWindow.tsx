import { useEffect, useRef, Fragment } from 'react';
import { Message } from '../types';
import MessageInput from './MessageInput';

interface Props {
  chatId: string | null;
  messages: Message[];
  onSendMessage: (chatId: string, text: string) => Promise<string | null>;
}

function fmtTime(ts: number) {
  if (!ts) return '';
  return new Date(ts * 1000).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
}

function fmtDate(ts: number) {
  if (!ts) return '';
  return new Date(ts * 1000).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
}

const wallpaperStyle: React.CSSProperties = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect width='400' height='400' fill='%2314151f'/%3E%3Ccircle cx='40' cy='40' r='1' fill='%23ffffff18'/%3E%3Ccircle cx='120' cy='80' r='0.8' fill='%23ffffff14'/%3E%3Ccircle cx='200' cy='30' r='1.2' fill='%23ffffff10'/%3E%3Ccircle cx='300' cy='60' r='0.8' fill='%23ffffff18'/%3E%3Ccircle cx='370' cy='100' r='1' fill='%23ffffff12'/%3E%3Ccircle cx='60' cy='160' r='0.6' fill='%23ffffff16'/%3E%3Ccircle cx='150' cy='200' r='1' fill='%23ffffff0e'/%3E%3Ccircle cx='250' cy='150' r='0.8' fill='%23ffffff14'/%3E%3Ccircle cx='340' cy='200' r='1.2' fill='%23ffffff10'/%3E%3Ccircle cx='80' cy='280' r='1' fill='%23ffffff18'/%3E%3Ccircle cx='180' cy='320' r='0.6' fill='%23ffffff12'/%3E%3Ccircle cx='280' cy='280' r='1' fill='%23ffffff16'/%3E%3Ccircle cx='360' cy='340' r='0.8' fill='%23ffffff0e'/%3E%3Ccircle cx='30' cy='360' r='1.2' fill='%23ffffff14'/%3E%3Ccircle cx='130' cy='380' r='0.6' fill='%23ffffff18'/%3E%3Ccircle cx='220' cy='360' r='1' fill='%23ffffff12'/%3E%3Ccircle cx='320' cy='380' r='0.8' fill='%23ffffff16'/%3E%3C/svg%3E")`,
  backgroundSize: '400px 400px',
};

export default function ChatWindow({ chatId, messages, onSendMessage }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!chatId) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-8" style={{ ...wallpaperStyle, backgroundColor: '#14151f' }}>
        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4">
          <svg viewBox="0 0 24 24" className="w-9 h-9 fill-[#5c6070]">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
          </svg>
        </div>
        <h2 className="text-white/70 text-xl font-light">GREEN-API Chat</h2>
        <p className="text-[#5c6070] text-sm mt-1">Выберите чат или создайте новый диалог</p>
      </div>
    );
  }

  const displayPhone = chatId.replace('@c.us', '');

  return (
    <div className="flex-1 flex flex-col min-w-0" style={{ backgroundColor: '#14151f' }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-2.5 bg-[#1e1f2e] border-b border-white/5">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#7b61ff] to-[#a78bfa] flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
          {displayPhone.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white leading-tight">{displayPhone}</p>
          <p className="text-xs text-[#5c6070]">MAX / WhatsApp</p>
        </div>
        <div className="flex items-center gap-1">
          {[
            { title: 'Позвонить', path: 'M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z' },
            { title: 'Видеозвонок', path: 'M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z' },
            { title: 'Поиск', path: 'M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z' },
          ].map(btn => (
            <button key={btn.title} title={btn.title} className="w-9 h-9 rounded-full flex items-center justify-center text-[#5c6070] hover:text-white hover:bg-white/10 transition-colors">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d={btn.path} /></svg>
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1" style={wallpaperStyle}>
        {messages.length === 0 && (
          <div className="flex justify-center pt-8">
            <span className="bg-black/30 backdrop-blur-sm text-[#8a8a9a] text-xs rounded-xl px-4 py-2">
              Начните диалог, отправив первое сообщение
            </span>
          </div>
        )}

        {messages.map((msg, i) => {
          const prev = messages[i - 1];
          const showDate = !prev || fmtDate(msg.timestamp) !== fmtDate(prev.timestamp);
          const isTemp = msg.id.startsWith('temp_');

          return (
            <Fragment key={msg.id}>
              {showDate && msg.timestamp > 0 && (
                <div className="flex justify-center my-3">
                  <span className="bg-black/40 backdrop-blur-sm text-[#8a8a9a] text-xs rounded-xl px-4 py-1.5">
                    {fmtDate(msg.timestamp)}
                  </span>
                </div>
              )}
              <div className={`flex ${msg.incoming ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[60%] rounded-2xl px-3.5 py-2 ${
                  msg.incoming
                    ? 'bg-[#2a2b3d] text-white rounded-tl-sm'
                    : 'bg-[#7b61ff] text-white rounded-tr-sm'
                } ${isTemp ? 'opacity-70' : ''}`}>
                  <p className="text-sm leading-relaxed break-words">{msg.text}</p>
                  <div className="flex items-center justify-end gap-1 mt-0.5">
                    <span className="text-[10px] opacity-60">{fmtTime(msg.timestamp)}</span>
                    {!msg.incoming && (
                      isTemp
                        ? <svg viewBox="0 0 24 24" className="w-3 h-3 fill-white/50"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" /></svg>
                        : <svg viewBox="0 0 16 11" className="w-3.5 h-2.5 fill-white/70"><path d="M11.071.653a.5.5 0 0 0-.708 0L4.501 6.515 2.222 4.236a.5.5 0 0 0-.708.707l2.633 2.633a.5.5 0 0 0 .708 0L11.07 1.36a.5.5 0 0 0 0-.707zM15.32.653a.5.5 0 0 0-.707 0L8.75 6.515l-.914-.914a.5.5 0 0 0-.707.707l1.267 1.267a.5.5 0 0 0 .707 0L15.32 1.36a.5.5 0 0 0 0-.707z" /></svg>
                    )}
                  </div>
                </div>
              </div>
            </Fragment>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <MessageInput onSend={text => onSendMessage(chatId, text)} />
    </div>
  );
}
