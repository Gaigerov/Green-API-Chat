export interface Credentials {
  apiUrl: string;
  idInstance: string;
  apiTokenInstance: string;
}

export interface Message {
  id: string;
  text: string;
  timestamp: number;
  incoming: boolean;
}

export interface ChatsMap {
  [chatId: string]: Message[];
}

export interface SendMessageResponse {
  idMessage: string;
}

export interface NotificationBody {
  typeWebhook: string;
  senderData: {
    chatId: string;
    sender: string;
    senderName?: string;
  };
  messageData: {
    typeMessage: string;
    textMessageData: {
      textMessage: string;
    };
  };
  timestamp: number;
}

export interface Notification {
  receiptId: number;
  body: NotificationBody;
}

export interface InstanceState {
  stateInstance: string;
}

export interface CheckAccountResponse {
  exist: boolean;
  chatId: string;
  fromCache: boolean;

  status?: boolean;
  reason?: string;
}

export type ConnectionStatus =
  | 'authorized'
  | 'notAuthorized'
  | 'connecting'
  | 'error'
  | 'unknown';
