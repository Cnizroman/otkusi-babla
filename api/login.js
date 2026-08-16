export default async function handler(req,res){
  res.setHeader("Access-Control-Allow-Origin","*");
  res.setHeader("Access-Control-Allow-Methods","POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers","Content-Type");
  if(req.method==="OPTIONS") return res.status(204).end();
  return res.status(501).json({error:"Вход в аккаунт требует подключённого хранилища пользователей. Регистрация и Telegram-уведомления работают отдельно."});
}