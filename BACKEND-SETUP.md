# Настройка backend: регистрация → Telegram

Frontend может быть размещён на GitHub Pages, а серверные функции — на Vercel. GitHub Pages не запускает Node.js API.

## 1. Разверните backend

Импортируйте репозиторий в Vercel. Функции находятся в папке `api/`, конфигурация — в `vercel.json`.

## 2. Добавьте переменные окружения Vercel

В **Settings → Environment Variables** добавьте:

- `TELEGRAM_BOT_TOKEN` — токен Telegram-бота.
- `TELEGRAM_CHAT_ID` — ID чата для уведомлений.

После сохранения выполните Redeploy. Не вставляйте токен в frontend или файлы репозитория.

## 3. Подключите frontend

Если сайт работает на GitHub Pages, откройте `assets/config.js` и укажите URL backend:

```js
window.OTKUSI_API_BASE = "https://ВАШ-ПРОЕКТ.vercel.app";
```

Если frontend и API размещены на одном домене Vercel, оставьте значение пустым.

## 4. Важные ограничения

- `api/register.js` отправляет имя, email и телефон в Telegram; пароль не отправляется.
- `api/login.js` пока заглушка и не реализует хранение пользователей или вход. Отправка формы не создаёт аккаунт и не авторизует пользователя.
- Если старый токен уже был включён в архив или опубликован, отзовите его через @BotFather и замените переменную `TELEGRAM_BOT_TOKEN` в Vercel.
- Не используйте реальные персональные данные на демонстрационном сайте.
