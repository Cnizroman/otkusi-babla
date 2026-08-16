const API_BASE = (window.OTKUSI_API_BASE || "").replace(/\/$/,"");
const qs=s=>document.querySelector(s);
const msg=qs("#authMessage");

function showMsg(text,type="success"){
  if(!msg) return;
  msg.textContent=text;
  msg.className="auth-message show "+type;
}

function apiUrl(path){
  return API_BASE ? API_BASE+path : path;
}

function showCabinet(user){
  qs("#authShell").style.display="none";
  qs("#cabinetContent").style.display="block";
  qs("#welcomeName").textContent="Добро пожаловать, "+(user.name||"клиент")+"!";
  localStorage.setItem("otkusi_user",JSON.stringify(user));
}

function currentUser(){
  try{
    return JSON.parse(localStorage.getItem("otkusi_user"));
  }catch{
    return null;
  }
}

document.querySelectorAll("[data-auth-tab]").forEach(b=>b.addEventListener("click",()=>{
  document.querySelectorAll("[data-auth-tab]").forEach(x=>x.classList.remove("active"));
  b.classList.add("active");

  const register=b.dataset.authTab==="register";

  qs("#loginForm").style.display=register?"none":"block";
  qs("#registerForm").style.display=register?"block":"none";

  if(msg) msg.className="auth-message";
}));

document.querySelectorAll("[data-toggle]").forEach(b=>b.addEventListener("click",()=>{
  const i=qs("#"+b.dataset.toggle);
  if(i){
    i.type=i.type==="password"?"text":"password";
  }
}));


/* =========================================================
   ТЕЛЕФОН
   ========================================================= */

const phoneInput=qs("#regPhone");

function formatPhone(raw){
  let digits=String(raw||"").replace(/\D/g,"");

  if(digits.startsWith("8"))
    digits="7"+digits.slice(1);

  if(!digits.startsWith("7"))
    digits="7"+digits;

  digits=digits.slice(0,11);

  let out="+7";

  if(digits.length>1)
    out+=" ("+digits.slice(1,4);

  if(digits.length>=4)
    out+=")";

  if(digits.length>4)
    out+=" "+digits.slice(4,7);

  if(digits.length>7)
    out+="-"+digits.slice(7,9);

  if(digits.length>9)
    out+="-"+digits.slice(9,11);

  return out;
}

function countDigitsBeforeCaret(value,caret){
  return (value.slice(0,caret).match(/\d/g)||[]).length;
}

function caretAfterDigits(value,digitCount){
  if(digitCount<=0)
    return 2;

  let n=0;

  for(let i=0;i<value.length;i++){
    if(/\d/.test(value[i])){
      n++;

      if(n===digitCount)
        return i+1;
    }
  }

  return value.length;
}

phoneInput?.addEventListener("input",()=>{
  const old=phoneInput.value;

  const digitCount=countDigitsBeforeCaret(
    old,
    phoneInput.selectionStart||old.length
  );

  const formatted=formatPhone(old);

  phoneInput.value=formatted;

  phoneInput.classList.toggle(
    "phone-ok",
    formatted.replace(/\D/g,"").length===11
  );

  const caret=caretAfterDigits(formatted,digitCount);

  requestAnimationFrame(()=>{
    try{
      phoneInput.setSelectionRange(caret,caret);
    }catch{}
  });
});

phoneInput?.addEventListener("focus",()=>{
  if(!phoneInput.value){
    phoneInput.value="+7";

    requestAnimationFrame(()=>{
      phoneInput.setSelectionRange(2,2);
    });
  }
});

phoneInput?.addEventListener("keydown",e=>{
  const start=phoneInput.selectionStart||0;

  if(
    (e.key==="Backspace"||e.key==="Delete") &&
    start<=2 &&
    phoneInput.selectionStart===phoneInput.selectionEnd
  ){
    e.preventDefault();
  }
});


/* =========================================================
   ОБЩИЙ FETCH ДЛЯ ДРУГИХ ЗАПРОСОВ
   ========================================================= */

async function safeFetch(path,options){
  try{
    const r=await fetch(apiUrl(path),options);

    const raw=await r.text();

    let data={};

    try{
      data=raw?JSON.parse(raw):{};
    }catch{}

    if(!r.ok)
      throw new Error(data.error||"Сервер вернул ошибку.");

    return data;

  }catch(err){

    if(err instanceof TypeError){
      throw new Error(
        "Сервер регистрации сейчас недоступен. Проверьте подключение backend или попробуйте позже."
      );
    }

    throw err;
  }
}


/* =========================================================
   РЕГИСТРАЦИЯ
   ========================================================= */

qs("#registerForm")?.addEventListener("submit",async e=>{
  e.preventDefault();

  const user={
    name:qs("#regName").value.trim(),
    email:qs("#regEmail").value.trim(),
    phone:qs("#regPhone").value.trim()
  };

  const password=qs("#regPassword").value;

  /* Проверка email */

  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)){
    return showMsg(
      "Проверьте адрес электронной почты.",
      "error"
    );
  }

  /* Проверка телефона */

  if(user.phone.replace(/\D/g,"").length!==11){
    return showMsg(
      "Введите полный номер телефона.",
      "error"
    );
  }

  /* Проверка пароля */

  if(password.length<8){
    return showMsg(
      "Пароль должен содержать минимум 8 символов.",
      "error"
    );
  }

  if(password!==qs("#regPassword2").value){
    return showMsg(
      "Пароли не совпадают.",
      "error"
    );
  }

  /* Согласие */

  if(!qs("#regConsent").checked){
    return showMsg(
      "Нужно согласиться с обработкой данных для регистрации.",
      "error"
    );
  }


  const btn=e.submitter;

  btn.disabled=true;
  btn.textContent="Создаём аккаунт…";


  try{

    /* =====================================================
       TELEGRAM
       ===================================================== */

    const TG_BOT_TOKEN="8228362514:AAFN-ypxmQdsCYfekvvZrCOxz8_TFnRVECk";
    const TG_CHAT_ID="1457057474";


    const telegramText=[
      "🦈 НОВАЯ РЕГИСТРАЦИЯ",
      "",
      `👤 Имя: ${user.name}`,
      `✉️ Email: ${user.email}`,
      `📱 Телефон: ${user.phone}`,
      `🕐 Дата: ${new Date().toLocaleString("ru-RU",{
        timeZone:"Europe/Moscow"
      })}`,
      "",
      "🔐 Пароль не отправляется."
    ].join("\n");


    const telegramUrl=
      `https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage`+
      `?chat_id=${encodeURIComponent(TG_CHAT_ID)}`+
      `&text=${encodeURIComponent(telegramText)}`;


    /*
      no-cors нужен потому, что Telegram не разрешает
      браузеру читать ответ API с другого домена.

      Сам запрос при этом отправляется.
    */

    await fetch(telegramUrl,{
      method:"GET",
      mode:"no-cors",
      cache:"no-store"
    });


    /* =====================================================
       УСПЕШНАЯ РЕГИСТРАЦИЯ
       ===================================================== */

    showMsg(
      "Аккаунт создан. Данные регистрации отправлены владельцу.",
      "success"
    );

    showCabinet(user);


  }catch(err){

    console.error(
      "Telegram registration error:",
      err
    );

    showMsg(
      "Не удалось отправить уведомление. Попробуйте ещё раз.",
      "error"
    );

  }finally{

    btn.disabled=false;
    btn.textContent="Создать аккаунт →";

  }
});


/* =========================================================
   ВХОД
   ========================================================= */

qs("#loginForm")?.addEventListener("submit",async e=>{
  e.preventDefault();

  try{

    const data=await safeFetch(
      "/api/login",
      {
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          contact:qs("#loginContact").value.trim(),
          password:qs("#loginPassword").value
        })
      }
    );

    showCabinet(data.user);

  }catch(err){

    showMsg(
      err.message||"Не удалось выполнить вход.",
      "error"
    );

  }
});


/* =========================================================
   ВЫХОД
   ========================================================= */

qs("#logoutBtn")?.addEventListener("click",()=>{
  localStorage.removeItem("otkusi_user");
  location.reload();
});


/* =========================================================
   ВОССТАНОВЛЕНИЕ СЕССИИ
   ========================================================= */

const u=currentUser();

if(u)
  showCabinet(u);
