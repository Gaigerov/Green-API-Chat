import { useState, FormEvent } from 'react';
import { ChatsMap, ConnectionStatus, Message } from '../types';
import GreenApiService from '../services/greenApi';

const STATUS_DOT: Record<ConnectionStatus, string> = {
  authorized: 'bg-[#25d366]',
  notAuthorized: 'bg-amber-400',
  connecting: 'bg-blue-400',
  error: 'bg-red-400',
  unknown: 'bg-[#aebac1]',
};

const STATUS_LABEL: Record<ConnectionStatus, string> = {
  authorized: 'Подключено',
  notAuthorized: 'Не авторизован',
  connecting: 'Подключение…',
  error: 'Ошибка',
  unknown: 'Неизвестно',
};

interface Props {
  chats: ChatsMap;
  activeChatId: string | null;
  onSelectChat: (id: string) => void;
  onAddChat: (chatId: string) => void;
  connectionStatus: ConnectionStatus;
  apiService: GreenApiService | null;
}

function fmtTime(ts: number) {
  if (!ts) return '';
  return new Date(ts * 1000).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
}

export default function Sidebar({
  chats, activeChatId, onSelectChat, onAddChat, connectionStatus, apiService,
}: Props) {
  const [showForm, setShowForm] = useState(false);
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(false);
  const [search, setSearch] = useState('');

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault();
    const digits = phone.replace(/\D/g, '');
    if (!digits) return setError('Введите номер телефона');
    if (!/^\d{10,15}$/.test(digits)) return setError('Неверный формат (10–15 цифр)');

    if (!apiService) return setError('Нет подключения к API');

    setChecking(true);
    setError('');
    try {
      const result = await apiService.checkAccount(digits);

      if (result.status === false) {
        // Instance not ready
        setError(result.reason || 'Инстанс не авторизован');
        return;
      }

      if (!result.exist || !result.chatId) {
        setError('У этого номера нет аккаунта MAX');
        return;
      }

      onAddChat(result.chatId);
      setPhone('');
      setShowForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка проверки номера');
    } finally {
      setChecking(false);
    }
  };

  const entries = Object.entries(chats).filter(([id]) =>
    search ? id.toLowerCase().includes(search.toLowerCase()) : true
  );

  return (
    <div className="w-[320px] flex-shrink-0 flex flex-col bg-[#1e1f2e] border-r border-white/5">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <h1 className="text-white font-semibold text-lg">Чаты</h1>
        <button
          onClick={() => { setShowForm(v => !v); setError(''); }}
          className="w-8 h-8 rounded-full bg-[#7b61ff] hover:bg-[#6a50ee] flex items-center justify-center transition-colors shadow-lg"
          title="Новый чат"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
          </svg>
        </button>
      </div>

      {/* Status */}
      <div className="flex items-center gap-2 px-4 pb-2">
        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${STATUS_DOT[connectionStatus]}`} />
        <span className="text-xs text-[#5c6070]">{STATUS_LABEL[connectionStatus]}</span>
      </div>

      {/* Search */}
      <div className="px-3 pb-2">
        <div className="flex items-center gap-2 bg-[#2a2b3d] rounded-xl px-3 py-2">
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#5c6070] flex-shrink-0">
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Найти"
            className="bg-transparent text-sm text-white placeholder-[#5c6070] focus:outline-none w-full"
          />
        </div>
      </div>

      {/* New chat form */}
      {showForm && (
        <form onSubmit={handleAdd} className="mx-3 mb-2 p-3 bg-[#2a2b3d] rounded-xl">
          <p className="text-xs text-[#5c6070] mb-2">
            Введите номер в международном формате (для РФ/РБ)
          </p>
          <input
            autoFocus
            type="tel"
            value={phone}
            onChange={e => { setPhone(e.target.value); setError(''); }}
            placeholder="79991234567"
            disabled={checking}
            className="w-full px-3 py-2 text-sm rounded-lg bg-[#1e1f2e] text-white placeholder-[#5c6070] focus:outline-none border border-white/10 focus:border-[#7b61ff] disabled:opacity-60"
          />
          {error && <p className="text-red-400 text-xs mt-1.5 px-1">{error}</p>}
          <div className="flex gap-2 mt-2">
            <button
              type="submit"
              disabled={checking}
              className="flex-1 py-1.5 text-sm rounded-lg bg-[#7b61ff] text-white hover:bg-[#6a50ee] disabled:opacity-60 transition-colors flex items-center justify-center gap-1.5"
            >
              {checking ? (
                <>
                  <svg className="w-3.5 h-3.5 animate-spin fill-white" viewBox="0 0 24 24">
                    <path d="M12 4V2A10 10 0 0 0 2 12h2a8 8 0 0 1 8-8z" />
                  </svg>
                  Проверка…
                </>
              ) : 'Создать'}
            </button>
            <button
              type="button"
              onClick={() => { setShowForm(false); setPhone(''); setError(''); }}
              className="flex-1 py-1.5 text-sm rounded-lg bg-white/10 text-white hover:bg-white/15 transition-colors"
            >
              Отмена
            </button>
          </div>
        </form>
      )}

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto">
        {entries.length === 0 && !showForm && (
          <div className="flex flex-col items-center justify-center h-full text-center px-8 py-12">
            <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mb-3">
              <svg viewBox="0 0 24 24" className="w-7 h-7 fill-[#5c6070]">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
              </svg>
            </div>
            <p className="text-sm text-[#8a8a9a]">Нет активных чатов</p>
            <p className="text-xs text-[#5c6070] mt-1">Нажмите + чтобы начать</p>
          </div>
        )}

        {entries.map(([chatId, messages]) => {
          const last: Message | undefined = messages[messages.length - 1];
          const isActive = chatId === activeChatId;
          const unread = messages.filter(m => m.incoming).length;

          return (
            <button
              key={chatId}
              onClick={() => onSelectChat(chatId)}
              className="w-full flex items-center gap-3 px-3 py-3 hover:bg-white/5 transition-colors text-left border-b border-white/[0.04]"
              style={{ background: isActive ? 'rgba(255,255,255,0.06)' : undefined }}
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#7b61ff] to-[#a78bfa] flex items-center justify-center text-white font-semibold text-base flex-shrink-0 select-none">
                {chatId.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white truncate">{chatId}</span>
                  <span className="text-[11px] text-[#5c6070] flex-shrink-0 ml-1">
                    {last ? fmtTime(last.timestamp) : ''}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-0.5">
                  <p className="text-xs text-[#8a8a9a] truncate">
                    {last ? (last.incoming ? last.text : `✓ ${last.text}`) : 'Нет сообщений'}
                  </p>
                  {unread > 0 && !isActive && (
                    <span className="ml-1 flex-shrink-0 min-w-[18px] h-[18px] rounded-full bg-[#7b61ff] text-white text-[10px] font-medium flex items-center justify-center px-1">
                      {unread}
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
