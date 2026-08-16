const TELEGRAM_BOT_TOKEN = '8228362514:AAFN-ypxmQdsCYfekvvZrCOxz8_TFnRVECk';
const TELEGRAM_CHAT_ID = '1457057474';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Метод не поддерживается' });

  try {
    const body = req.body || {};
    const name = String(body.name || '').trim().slice(0, 80);
    const email = String(body.email || '').trim().toLowerCase().slice(0, 160);
    const phone = String(body.phone || '').trim().slice(0, 40);

    if (!name || !email || !phone) {
      return res.status(400).json({ error: 'Заполните имя, email и телефон.' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Некорректный email.' });
    }
    if (phone.replace(/\D/g, '').length !== 11) {
      return res.status(400).json({ error: 'Некорректный номер телефона.' });
    }

    const text = [
      '🦈 НОВАЯ РЕГИСТРАЦИЯ',
      '',
      `👤 Имя: ${name}`,
      `✉️ Email: ${email}`,
      `📱 Телефон: ${phone}`,
      `🕐 Дата: ${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })}`,
      '',
      '🔐 Пароль не отправляется.'
    ].join('\n');

    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text,
          disable_web_page_preview: true
        })
      }
    );

    const telegramData = await telegramResponse.json().catch(() => ({}));

    if (!telegramResponse.ok || !telegramData.ok) {
      console.error('Telegram API error:', telegramData);
      return res.status(502).json({
        error: 'Не удалось отправить уведомление в Telegram. Проверьте настройки бота.'
      });
    }

    return res.status(200).json({
      ok: true,
      user: { name, email, phone }
    });
  } catch (error) {
    console.error('register error:', error);
    return res.status(500).json({ error: 'Внутренняя ошибка сервера. Попробуйте ещё раз.' });
  }
}
