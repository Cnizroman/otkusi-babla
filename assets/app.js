const menu = document.querySelector('.menu');
const links = document.querySelector('.links');

if (menu && links) {
  links.id = links.id || 'main-navigation';
  menu.setAttribute('type', 'button');
  menu.setAttribute('aria-controls', links.id);
  menu.setAttribute('aria-expanded', 'false');
  menu.setAttribute('aria-label', 'Открыть меню');

  const setMenu = open => {
    links.classList.toggle('open', open);
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
  };
  menu.addEventListener('click', () => setMenu(!links.classList.contains('open')));
  links.addEventListener('click', event => {
    if (event.target.closest('a')) setMenu(false);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && links.classList.contains('open')) {
      setMenu(false);
      menu.focus();
    }
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 980) setMenu(false);
  });
}

// These forms do not have a submission endpoint; never report a false success.
document.querySelectorAll('[data-submit]').forEach(button => {
  button.addEventListener('click', () => {
    let notice = button.parentElement.querySelector('.submit-notice');
    if (!notice) {
      notice = document.createElement('p');
      notice.className = 'submit-notice';
      notice.setAttribute('role', 'status');
      button.insertAdjacentElement('afterend', notice);
    }
    notice.textContent = 'Отправка формы пока не подключена. Свяжитесь с нами через Telegram.';
  });
});

document.querySelectorAll('[data-range]').forEach(range => {
  const output = document.querySelector(range.dataset.range);
  const update = () => {
    if (output) output.textContent = Number(range.value).toLocaleString('ru-RU') + ' ₽';
  };
  range.addEventListener('input', update);
  update();
});
