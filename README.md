# GREEN-API Chat

Тестовое задание: UI для отправки и получения текстовых сообщений в мессенджере MAX через [GREEN-API](https://green-api.com/max).

## Стек

- React 19 + TypeScript
- Vite 8
- Tailwind CSS v4

## Локальный запуск

### Требования

- Node.js 20+
- pnpm 9+

Если используете [mise](https://mise.jdx.dev/), версии подтянутся автоматически из `.mise.toml`.

### Установка и запуск

```bash
pnpm install
pnpm dev
```

Приложение откроется на `http://localhost:8443`.

> Переменная `PORT` переопределяет порт: `PORT=3000 pnpm dev`

### Сборка

```bash
pnpm build      # собирает в папку dist/
pnpm preview    # локальный предпросмотр сборки
```

## Вход в приложение

В форме входа заполните три поля — данные берутся из личного кабинета GREEN-API ([console.green-api.com](https://console.green-api.com)):

| Поле | Пример |
|---|---|
| `apiUrl` | `https://3100.api.green-api.com` |
| `idInstance` | `310022750891` |
| `apiTokenInstance` | `a2f9599b...` |

Данные сохраняются в `localStorage` — повторный вход не нужен.

### Авторизация инстанса

Если статус «Неавторизован»:

1. Зайдите в [console.green-api.com](https://console.green-api.com)
2. Выберите инстанс → кнопка **QR**
3. Отсканируйте QR-код приложением **MAX** на телефоне

## Реализованный функционал

- **Авторизация** — вход по `apiUrl`, `idInstance`, `apiTokenInstance`
- **Отправка сообщений** — метод `sendMessage`; оптимистичное обновление UI (сообщение появляется сразу, откатывается при ошибке)
- **Получение сообщений** — последовательный поллинг `receiveNotification` / `deleteNotification` каждые 3 секунды
- **Создание чата** — по номеру телефона; проверка существования аккаунта через `checkAccount`
- **Статус подключения** — `checkState` при входе, индикатор в навигации
- **Автонастройка** — `setSettings` с `webhookUrl: ""` вызывается автоматически при первом входе, чтобы уведомления приходили через HTTP API

## CORS

В режиме разработки все запросы к `*.green-api.com` проксируются через встроенный Vite-middleware — CORS не блокирует вызовы. Настройка не требуется.

В продакшен-сборке приложение обращается к GREEN-API напрямую. Для работы без CORS-ошибок необходим собственный reverse-proxy или заголовки `Access-Control-Allow-Origin` на стороне сервера.

## Структура проекта

```
src/
├── components/
│   ├── Login.tsx          # форма входа
│   ├── ChatLayout.tsx     # корневой layout чата, поллинг
│   ├── NavRail.tsx        # левая навигационная панель
│   ├── Sidebar.tsx        # список чатов, поиск, создание чата
│   ├── ChatWindow.tsx     # окно переписки
│   └── MessageInput.tsx   # поле ввода сообщения
├── context/
│   └── AuthContext.tsx    # хранение credentials, экземпляр сервиса
├── hooks/
│   └── usePolling.ts      # последовательный поллинг с backoff
├── services/
│   └── greenApi.ts        # обёртка над GREEN-API REST
└── types/
    └── index.ts           # общие типы
```
