import {
  Credentials,
  SendMessageResponse,
  Notification,
  InstanceState,
  CheckAccountResponse,
} from '../types';

class GreenApiService {
  private apiUrl: string;
  private idInstance: string;
  private apiTokenInstance: string;

  constructor(credentials: Credentials) {
    this.apiUrl = credentials.apiUrl.replace(/\/$/, '');
    this.idInstance = credentials.idInstance;
    this.apiTokenInstance = credentials.apiTokenInstance;
  }

  private base(): string {
    if (import.meta.env.DEV) {
      const host = this.apiUrl.replace(/^https?:\/\//, '');
      return `/api/green-api-proxy/${host}/waInstance${this.idInstance}`;
    }
    return `${this.apiUrl}/waInstance${this.idInstance}`;
  }

  private token(): string {
    return this.apiTokenInstance;
  }

  private async handleError(res: Response): Promise<never> {
    if (res.status === 401 || res.status === 403) {
      throw new Error('Неверные учётные данные (idInstance или apiTokenInstance)');
    }
    let reason = `Ошибка сервера (${res.status})`;
    try {
      const body = await res.json() as { reason?: string; message?: string };
      if (body?.reason) reason = body.reason;
      else if (body?.message) reason = body.message;
    } catch { /* ignore */ }
    throw new Error(reason);
  }

  // POST /setSettings/{token}
  async setSettings(): Promise<void> {
    const res = await fetch(`${this.base()}/setSettings/${this.token()}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        webhookUrl: '',
        outgoingWebhook: 'yes',
        stateWebhook: 'yes',
        incomingWebhook: 'yes',
      }),
    });
    if (!res.ok) await this.handleError(res);
  }

  // POST /checkAccount/{token}  body: { phoneNumber }
  async checkAccount(phoneNumber: string): Promise<CheckAccountResponse> {
    const digits = phoneNumber.replace(/\D/g, '');
    const res = await fetch(`${this.base()}/checkAccount/${this.token()}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber: parseInt(digits, 10) }),
    });
    if (!res.ok) await this.handleError(res);
    return res.json() as Promise<CheckAccountResponse>;
  }

  // POST /sendMessage/{token}
  async sendMessage(chatId: string, message: string): Promise<SendMessageResponse> {
    const res = await fetch(`${this.base()}/sendMessage/${this.token()}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chatId, message }),
    });
    if (!res.ok) await this.handleError(res);
    return res.json() as Promise<SendMessageResponse>;
  }

  // GET /receiveNotification/{token}
  async receiveNotification(): Promise<Notification | null> {
    const res = await fetch(`${this.base()}/receiveNotification/${this.token()}`);
    if (!res.ok) {
      if (res.status === 401 || res.status === 403) throw new Error('Неверные учётные данные');
      return null;
    }
    const text = await res.text();
    if (!text || text.trim() === 'null' || text.trim() === '') return null;
    try {
      return JSON.parse(text) as Notification;
    } catch {
      return null;
    }
  }

  // DELETE /deleteNotification/{token}/{receiptId}
  async deleteNotification(receiptId: number): Promise<void> {
    await fetch(
      `${this.base()}/deleteNotification/${this.token()}/${receiptId}`,
      { method: 'DELETE' }
    );
  }

  // GET /checkState/{token}
  async checkInstance(): Promise<InstanceState | null> {
    const res = await fetch(`${this.base()}/checkState/${this.token()}`);
    if (!res.ok) await this.handleError(res);
    return res.json() as Promise<InstanceState>;
  }
}

export default GreenApiService;
