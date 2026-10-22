/*
  Bloqueo hasta el lanzamiento.
  - Para cambiar la fecha, editá LANZAMIENTO (hora de Argentina, -03:00).
  - Para ver el sitio igual antes del lanzamiento: entrá con ?previa=1 al final de la dirección
    (queda guardado en ese navegador). Para volver a ver el bloqueo: ?previa=0
  - Para sacar el bloqueo del todo: borrá la línea <script src="bloqueo.js"> de cada página.
*/
(function () {
  var LANZAMIENTO = new Date('2026-12-01T00:00:00-03:00').getTime();

  var previa = false;
  try {
    var m = location.search.match(/[?&]previa=([01])/);
    if (m) localStorage.setItem('sw-previa', m[1]);
    previa = localStorage.getItem('sw-previa') === '1';
  } catch (e) {}

  if (previa || Date.now() >= LANZAMIENTO) return;

  var html = document.documentElement;
  html.classList.add('sw-bloqueado');

  var css = document.createElement('style');
  css.textContent = [
    'html.sw-bloqueado, html.sw-bloqueado body { overflow: hidden !important; background: #4A1E26 !important; }',
    'html.sw-bloqueado body > *:not(#sw-bloqueo) { display: none !important; }',
    '#sw-bloqueo { position: fixed; inset: 0; z-index: 2147483647; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 28px; padding: 24px 16px; background: #4A1E26; color: #E6D9C4; text-align: center; font-family: "Hanken Grotesk", "Helvetica Neue", Helvetica, sans-serif; }',
    '#sw-bloqueo .sw-logo { margin: 0; font-family: "Cormorant Garamond", Georgia, serif; font-weight: 600; font-size: clamp(64px, 16vw, 112px); line-height: 1; letter-spacing: 0.04em; color: #C4A574; }',
    '#sw-bloqueo .sw-pronto { margin: 0; font-family: "Cormorant Garamond", Georgia, serif; font-style: italic; font-weight: 500; font-size: clamp(26px, 6vw, 36px); color: #E6D9C4; }',
    '#sw-bloqueo .sw-fecha { margin: -16px 0 0; font-size: 13px; letter-spacing: 0.22em; text-transform: uppercase; color: #C2B39F; }',
    '#sw-bloqueo .sw-contador { display: flex; gap: clamp(14px, 5vw, 36px); margin: 8px 0; }',
    '#sw-bloqueo .sw-unidad { display: flex; flex-direction: column; align-items: center; min-width: 56px; }',
    '#sw-bloqueo .sw-num { font-family: "Cormorant Garamond", Georgia, serif; font-weight: 500; font-size: clamp(40px, 11vw, 64px); line-height: 1; color: #E6D9C4; font-variant-numeric: tabular-nums; }',
    '#sw-bloqueo .sw-etq { margin-top: 8px; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #C2B39F; }',
    '#sw-bloqueo .sw-ig { display: inline-flex; align-items: center; min-height: 44px; padding: 0 24px; border: 1px solid #C4A574; color: #D4BC93; text-decoration: none; font-weight: 500; letter-spacing: 0.06em; }',
    '#sw-bloqueo .sw-ig:hover { background: #C4A574; color: #4A1E26; }',
    '#sw-bloqueo .sw-ig:focus-visible { outline: 2px solid #E6D9C4; outline-offset: 3px; }'
  ].join('\n');
  (document.head || html).appendChild(css);

  function armar() {
    var caja = document.createElement('div');
    caja.id = 'sw-bloqueo';
    caja.setAttribute('role', 'region');
    caja.setAttribute('aria-label', 'Cuenta regresiva para el lanzamiento');
    caja.innerHTML =
      '<p class="sw-logo" aria-label="Scaraffia Wines">SW</p>' +
      '<p class="sw-pronto">Muy pronto</p>' +
      '<p class="sw-fecha">1 de diciembre</p>' +
      '<div class="sw-contador" aria-hidden="true">' +
        '<div class="sw-unidad"><span class="sw-num" data-u="d">00</span><span class="sw-etq">Días</span></div>' +
        '<div class="sw-unidad"><span class="sw-num" data-u="h">00</span><span class="sw-etq">Horas</span></div>' +
        '<div class="sw-unidad"><span class="sw-num" data-u="m">00</span><span class="sw-etq">Min</span></div>' +
        '<div class="sw-unidad"><span class="sw-num" data-u="s">00</span><span class="sw-etq">Seg</span></div>' +
      '</div>' +
      '<a class="sw-ig" href="https://www.instagram.com/scaraffiawines/" rel="noopener">Seguinos en Instagram</a>';
    document.body.appendChild(caja);

    var nums = {};
    ['d', 'h', 'm', 's'].forEach(function (u) { nums[u] = caja.querySelector('[data-u="' + u + '"]'); });
    function dos(n) { return n < 10 ? '0' + n : String(n); }

    function tic() {
      var falta = LANZAMIENTO - Date.now();
      if (falta <= 0) { location.reload(); return; }
      var s = Math.floor(falta / 1000);
      nums.d.textContent = dos(Math.floor(s / 86400));
      nums.h.textContent = dos(Math.floor(s / 3600) % 24);
      nums.m.textContent = dos(Math.floor(s / 60) % 60);
      nums.s.textContent = dos(s % 60);
    }
    tic();
    setInterval(tic, 1000);
  }

  if (document.body) armar();
  else document.addEventListener('DOMContentLoaded', armar);
})();
