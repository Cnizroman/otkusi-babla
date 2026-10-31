// Shared range outputs used by the product pages.
document.querySelectorAll('[data-range]').forEach(range => {
  const output = document.querySelector(range.dataset.range);
  const update = () => { if (output) output.textContent = Number(range.value).toLocaleString('ru-RU') + ' ₽'; };
  range.addEventListener('input', update);
  update();
});
