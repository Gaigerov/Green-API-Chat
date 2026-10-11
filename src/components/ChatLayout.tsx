import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { usePolling } from '../hooks/usePolling';
import { ChatsMap, Message, ConnectionStatus } from '../types';
import GreenApiService from '../services/greenApi';
import NavRail from './NavRail';
import Sidebar from './Sidebar';
import ChatWindow from './ChatWindow';

export default function ChatLayout() {
  const { apiService, logout } = useAuth();
  const [chats, setChats] = useState<ChatsMap>({});
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connecting');

  useEffect(() => {
    if (!apiService) return;
    let cancelled = false;
    let attempt = 0;

    const check = () => {
      apiService.checkInstance()
        .then(state => {
          if (cancelled) return;
          const raw = state?.stateInstance ?? '';
          // GREEN-API uses 'authorized', 'notAuthorized', 'blocked', 'starting', 'yellowCard'
          const status: ConnectionStatus =
            raw === 'authorized' ? 'authorized' :
            raw === 'notAuthorized' ? 'notAuthorized' :
            (raw === 'starting' || raw === 'yellowCard') ? 'connecting' : 'unknown';
          setConnectionStatus(status);
          if (status === 'authorized') {
            apiService.setSettings().catch(() => {/* non-critical */});
          } else if (status === 'connecting' && attempt < 5) {
            attempt++;
            setTimeout(check, 3000);
          }
        })
        .catch((err: Error) => {
          if (cancelled) return;
          if (err.message.includes('учётные')) {
            setConnectionStatus('notAuthorized');
          } else if (attempt < 3) {
            attempt++;
            setTimeout(check, 4000);
          } else {
            setConnectionStatus('error');
          }
        });
    };

    check();
    return () => { cancelled = true; };
  }, [apiService]);

  const pollNotifications = useCallback(async () => {
    if (!apiService) return;
    const notification = await apiService.receiveNotification();
    if (!notification) return;

    const { receiptId, body } = notification;

    if (
      body?.typeWebhook === 'incomingMessageReceived' &&
      body?.messageData?.typeMessage === 'textMessage'
    ) {
      const senderId = body.senderData?.chatId || body.senderData?.sender;
      const text = body.messageData?.textMessageData?.textMessage;
      if (senderId && text) {
        const msg: Message = {
          id: receiptId.toString(),
          text,
          timestamp: body.timestamp,
          incoming: true,
        };
        setChats(prev => ({
          ...prev,
          [senderId]: [...(prev[senderId] || []), msg],
        }));
      }
    }

    await apiService.deleteNotification(receiptId);
  }, [apiService]);

  usePolling(pollNotifications, 3000, !!apiService && connectionStatus === 'authorized');

  const addChat = useCallback((chatId: string) => {
    setChats(prev => prev[chatId] ? prev : { ...prev, [chatId]: [] });
    setActiveChatId(chatId);
  }, []);

  const sendMessage = useCallback(async (chatId: string, text: string): Promise<string | null> => {
    if (!apiService) return 'Нет подключения к API';

    const tempId = `temp_${Date.now()}`;
    const msg: Message = {
      id: tempId,
      text,
      timestamp: Math.floor(Date.now() / 1000),
      incoming: false,
    };
    setChats(prev => ({ ...prev, [chatId]: [...(prev[chatId] || []), msg] }));

    try {
      const result = await apiService.sendMessage(chatId, text);
      const realId = result.idMessage || tempId;
      setChats(prev => ({
        ...prev,
        [chatId]: (prev[chatId] || []).map(m => m.id === tempId ? { ...m, id: realId } : m),
      }));
      return null;
    } catch (err) {
      setChats(prev => ({
        ...prev,
        [chatId]: (prev[chatId] || []).filter(m => m.id !== tempId),
      }));
      return err instanceof Error ? err.message : 'Ошибка отправки';
    }
  }, [apiService]);

  return (
    <div className="h-screen flex overflow-hidden bg-[#14151f]">
      <NavRail onLogout={logout} connectionStatus={connectionStatus} />
      <Sidebar
        chats={chats}
        activeChatId={activeChatId}
        onSelectChat={setActiveChatId}
        onAddChat={addChat}
        connectionStatus={connectionStatus}
        apiService={apiService}
      />
      <ChatWindow
        chatId={activeChatId}
        messages={activeChatId ? chats[activeChatId] || [] : []}
        onSendMessage={sendMessage}
      />
    </div>
  );
}
