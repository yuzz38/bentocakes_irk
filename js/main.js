/* bentocakes_irk — landing scripts
   © 2026 Полунин Лев. Все права защищены. */
(function () {
  'use strict';
  document.documentElement.classList.add('js');

  var TG = 'https://t.me/sofiaageeva';
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- toast ---------- */
  var toastEl = $('#toast'), toastT;
  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('is-show');
    clearTimeout(toastT);
    toastT = setTimeout(function () { toastEl.classList.remove('is-show'); }, 2800);
  }

  /* ---------- header + burger ---------- */
  var header = $('#header'), burger = $('#burger'), nav = $('#nav'), fab = $('.fab');
  function onScroll() {
    var y = window.pageYOffset || document.documentElement.scrollTop;
    header.classList.toggle('is-scrolled', y > 20);
    if (fab) fab.classList.toggle('is-visible', y > window.innerHeight * 0.9);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  function setMenu(open) {
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    nav.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
    header.classList.toggle('is-scrolled', open || window.pageYOffset > 20);
  }
  burger.addEventListener('click', function () { setMenu(burger.getAttribute('aria-expanded') !== 'true'); });
  $$('a', nav).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { setMenu(false); closeLightbox(); } });
  window.addEventListener('resize', function () { if (window.innerWidth > 1080) setMenu(false); });

  /* ---------- cake designer ---------- */
  var cake = $('#cake'), cakeText = $('#cakeText'), input = $('#cakeInput');
  var hearts = $('#hearts');
  if (hearts) {
    var NS = 'http://www.w3.org/2000/svg', n = 12;
    for (var i = 0; i < n; i++) {
      var a = (i / n) * Math.PI * 2 + Math.PI / n * 0.15;
      var x = 100 + Math.cos(a) * 84, y = 100 + Math.sin(a) * 84;
      var p = document.createElementNS(NS, 'path');
      p.setAttribute('d', 'M0 4C-4 1-6-1-6-3a3 3 0 0 1 6-1 3 3 0 0 1 6 1c0 2-2 4-6 7Z');
      p.setAttribute('transform', 'translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ') rotate(' + (a * 180 / Math.PI + 90).toFixed(0) + ')');
      hearts.appendChild(p);
    }
  }
  var RAINBOW = ['#E2332E', '#F08A24', '#F4C542', '#9BC53D', '#2BB3C0', '#7D4FB3', '#F28DB2'];

  function wordsCount(t) { return t.trim() ? t.trim().split(/\s+/).length : 0; }

  function renderCake(pop) {
    var t = (input.value || '').trim() || 'ваша надпись';
    var color = cake.getAttribute('data-color');
    cakeText.innerHTML = '';
    if (color === 'grey') {
      var k = 0;
      t.split(/\s+/).forEach(function (word, wi) {
        if (wi) cakeText.appendChild(document.createTextNode(' '));
        var w = document.createElement('span');
        w.className = 'w';
        word.split('').forEach(function (ch) {
          var s = document.createElement('span');
          s.className = 'l'; s.textContent = ch; s.style.color = RAINBOW[k++ % RAINBOW.length];
          w.appendChild(s);
        });
        cakeText.appendChild(w);
      });
    } else {
      cakeText.textContent = t;
    }
    var len = t.length;
    var w = cake.getBoundingClientRect().width || 300;
    var base = len <= 10 ? 0.12 : len <= 18 ? 0.1 : len <= 28 ? 0.085 : len <= 40 ? 0.072 : 0.06;
    cakeText.style.fontSize = Math.round(w * base) + 'px';
    var wc = wordsCount(input.value);
    var name = $('#tierName'), price = $('#tierPrice'), hint = $('#tierHint');
    if (wc <= 5) { name.textContent = 'Простой дизайн'; price.textContent = '1300 ₽'; hint.textContent = 'До 5 слов, сердечки и посыпка — до 3 цветов.'; }
    else if (wc <= 12) { name.textContent = 'Средняя сложность'; price.textContent = '1400 ₽'; hint.textContent = 'Больше 5 слов — это уже средняя сложность.'; }
    else { name.textContent = 'Сложный дизайн'; price.textContent = 'от 1500 ₽'; hint.textContent = 'Длинная надпись по всему торту — сложный дизайн.'; }
    if (pop) { cake.classList.remove('is-pop'); void cake.offsetWidth; cake.classList.add('is-pop'); }
  }

  function setColor(c) {
    cake.setAttribute('data-color', c);
    $$('.swatches button').forEach(function (b) { b.setAttribute('aria-checked', b.getAttribute('data-color') === c ? 'true' : 'false'); });
    renderCake(true);
  }

  if (cake && input) {
    input.addEventListener('input', function () { renderCake(false); });
    $$('.swatches button').forEach(function (b) { b.addEventListener('click', function () { setColor(b.getAttribute('data-color')); }); });
    $$('#chips button').forEach(function (b) {
      b.addEventListener('click', function () {
        input.value = b.getAttribute('data-text');
        setColor(b.getAttribute('data-color') || cake.getAttribute('data-color'));
      });
    });
    window.addEventListener('resize', function () { renderCake(false); });
    renderCake(false);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { renderCake(false); });

    $('#orderText').addEventListener('click', function () {
      var colorName = ($('.swatches [aria-checked="true"]') || {}).getAttribute ? $('.swatches [aria-checked="true"]').getAttribute('aria-label') : '';
      var msg = 'Здравствуйте! Хочу бенто-торт с надписью «' + (input.value.trim() || '…') + '», цвет: ' + colorName.toLowerCase() + '. Дата: ';
      copyText(msg, function (ok) {
        toast(ok ? 'Текст заказа скопирован — вставьте его в чат' : 'Откройте чат и напишите вашу надпись');
        setTimeout(function () { window.open(TG, '_blank', 'noopener'); }, 450);
      });
    });
  }

  function copyText(text, cb) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(function () { cb(true); }, function () { cb(fallbackCopy(text)); });
    } else { cb(fallbackCopy(text)); }
  }
  function fallbackCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text; ta.setAttribute('readonly', '');
    ta.style.position = 'fixed'; ta.style.top = '-1000px'; ta.style.fontSize = '16px';
    document.body.appendChild(ta);
    var range = document.createRange(); range.selectNodeContents(ta);
    var sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(range);
    ta.setSelectionRange(0, text.length);
    var ok = false; try { ok = document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(ta);
    return ok;
  }

  /* ---------- flavors ---------- */
  var FLAV = {
    'caramel-peanut': {
      choco: ['Карамель-арахис на шоколаде', 'Тягучая карамель с хрустящим арахисом между влажными шоколадными бисквитами. Самое «шоколадно-батончиковое» сочетание в меню.'],
      vanilla: ['Карамель-арахис на ванили', 'Та же карамель с арахисом, но на светлых ванильных бисквитах — мягче и нежнее, отлично для тех, кто не очень любит шоколад.']
    },
    'strawberry': {
      choco: ['Клубника на шоколаде', 'Яркий клубничный конфитюр с кислинкой и шоколадный бисквит. Классика, которая нравится почти всем.'],
      vanilla: ['Клубника на ванили', 'Лёгкое летнее сочетание: ванильный бисквит, сливочный крем и густой клубничный конфитюр.']
    },
    'caramel-banana': {
      choco: ['Карамель-банан на шоколаде', 'Кусочки банана в карамели и шоколадный бисквит — сытно, уютно, как десерт из детства.'],
      vanilla: ['Карамель-банан на ванили', 'Банан, карамель и ванильный бисквит — сливочный, мягкий вкус для любителей банановых десертов.']
    }
  };
  var IMG = {
    'caramel-peanut': { choco: 'cut-caramel-peanut-choco', vanilla: 'cut-caramel-peanut-vanilla' },
    'strawberry': { choco: 'cut-strawberry-choco', vanilla: 'cut-strawberry-vanilla' },
    'caramel-banana': { choco: 'cut-caramel-banana-choco', vanilla: 'cut-caramel-banana-vanilla' }
  };
  var sliceImg = $('#sliceImg'), sliceWebp = $('#sliceWebp');
  function updateFlavor() {
    var f = ($('input[name="filling"]:checked') || {}).value || 'caramel-peanut';
    var s = ($('input[name="sponge"]:checked') || {}).value || 'choco';
    var d = FLAV[f][s], file = IMG[f][s];
    $('#flavorName').textContent = d[0];
    $('#flavorText').textContent = d[1];
    sliceImg.classList.add('is-fading');
    var pre = new Image();
    pre.onload = pre.onerror = function () {
      setTimeout(function () {
        sliceWebp.srcset = 'img/' + file + '-640.webp 640w, img/' + file + '-1200.webp 1200w';
        sliceImg.src = 'img/' + file + '.jpg';
        sliceImg.alt = 'Разрез бенто-торта: ' + d[0].toLowerCase();
        sliceImg.classList.remove('is-fading');
      }, 180);
    };
    pre.src = 'img/' + file + '.jpg';
  }
  $$('input[name="filling"], input[name="sponge"]').forEach(function (r) { r.addEventListener('change', updateFlavor); });
  // preload all cuts after page load
  window.addEventListener('load', function () {
    setTimeout(function () {
      Object.keys(IMG).forEach(function (f) { ['choco', 'vanilla'].forEach(function (s) { new Image().src = 'img/' + IMG[f][s] + '.jpg'; }); });
    }, 2500);
  });

  /* ---------- price tabs ---------- */
  var tabs = $$('[role="tab"]', $('.tabs'));
  function selectTab(tab, focus) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      var panel = document.getElementById(t.getAttribute('aria-controls'));
      if (panel) {
        panel.hidden = !on;
        $$('video', panel).forEach(function (v) { if (!on) v.pause(); });
      }
    });
    if (focus) tab.focus();
    tab.scrollIntoView && tab.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
    var p = document.getElementById(tab.getAttribute('aria-controls'));
    $$('video.autovideo', p).forEach(function (v) { loadAndPlay(v); });
  }
  tabs.forEach(function (t, idx) {
    t.addEventListener('click', function () { selectTab(t); });
    t.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        var n = (idx + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
        selectTab(tabs[n], true);
      }
    });
  });

  /* ---------- videos: play only in view ---------- */
  function loadAndPlay(v) {
    if (v.preload === 'none') { v.preload = 'auto'; }
    var pr = v.play(); if (pr && pr.catch) pr.catch(function () {});
  }
  var vids = $$('video.autovideo');
  if ('IntersectionObserver' in window) {
    var vio = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) loadAndPlay(e.target); else e.target.pause();
      });
    }, { threshold: 0.35 });
    vids.forEach(function (v) { v.muted = true; vio.observe(v); });
  }

  /* ---------- reveal ---------- */
  var rev = $$('.reveal');
  if ('IntersectionObserver' in window) {
    var rio = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); rio.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    rev.forEach(function (el) { rio.observe(el); });
  } else { rev.forEach(function (el) { el.classList.add('is-in'); }); }

  /* ---------- reviews slider ---------- */
  var track = $('#track'), slider = $('#slider'), dotsWrap = $('#dots');
  if (track) {
    var slides = $$('.review', track), index = 0, perView = 3, timer;
    function calcPer() { var w = window.innerWidth; return w <= 600 ? 1 : w <= 1080 ? 2 : 3; }
    function maxIndex() { return Math.max(0, slides.length - perView); }
    function buildDots() {
      dotsWrap.innerHTML = '';
      for (var d = 0; d <= maxIndex(); d++) {
        (function (d) {
          var b = document.createElement('button');
          b.type = 'button'; b.setAttribute('role', 'tab');
          b.setAttribute('aria-label', 'Отзыв ' + (d + 1));
          b.addEventListener('click', function () { go(d); restart(); });
          dotsWrap.appendChild(b);
        })(d);
      }
    }
    function go(i) {
      index = Math.max(0, Math.min(i, maxIndex()));
      var gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 20;
      var off = slides[0].getBoundingClientRect().width + gap;
      track.style.transform = 'translate3d(' + (-index * off) + 'px,0,0)';
      $$('button', dotsWrap).forEach(function (b, k) { b.setAttribute('aria-selected', k === index ? 'true' : 'false'); });
    }
    function next() { go(index >= maxIndex() ? 0 : index + 1); }
    function prev() { go(index <= 0 ? maxIndex() : index - 1); }
    function restart() { clearInterval(timer); timer = setInterval(next, 6500); }
    $('#revNext').addEventListener('click', function () { next(); restart(); });
    $('#revPrev').addEventListener('click', function () { prev(); restart(); });
    function setup() { perView = calcPer(); buildDots(); go(Math.min(index, maxIndex())); }
    setup(); restart();
    var rt; window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(setup, 150); });
    slider.addEventListener('mouseenter', function () { clearInterval(timer); });
    slider.addEventListener('mouseleave', restart);

    // touch swipe
    var sx = 0, sy = 0, dx = 0, drag = false, horiz = null;
    slider.addEventListener('touchstart', function (e) {
      sx = e.touches[0].clientX; sy = e.touches[0].clientY; dx = 0; drag = true; horiz = null;
      clearInterval(timer); track.style.transition = 'none';
    }, { passive: true });
    slider.addEventListener('touchmove', function (e) {
      if (!drag) return;
      var mx = e.touches[0].clientX - sx, my = e.touches[0].clientY - sy;
      if (horiz === null) horiz = Math.abs(mx) > Math.abs(my);
      if (!horiz) return;
      dx = mx;
      var gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 20;
      var off = slides[0].getBoundingClientRect().width + gap;
      track.style.transform = 'translate3d(' + (-index * off + dx) + 'px,0,0)';
    }, { passive: true });
    slider.addEventListener('touchend', function () {
      drag = false; track.style.transition = '';
      if (horiz && Math.abs(dx) > 50) { dx < 0 ? next() : prev(); } else { go(index); }
      restart();
    });
  }

  /* ---------- lightbox ---------- */
  var lb = $('#lightbox'), lbImg = $('#lightboxImg'), lastFocus;
  function openLightbox(src, alt) {
    lastFocus = document.activeElement;
    lbImg.src = src; lbImg.alt = alt || '';
    lb.hidden = false; document.body.style.overflow = 'hidden';
    $('.lightbox__close').focus();
  }
  function closeLightbox() {
    if (!lb || lb.hidden) return;
    lb.hidden = true; document.body.style.overflow = ''; lbImg.src = '';
    if (lastFocus) lastFocus.focus();
  }
  $$('#gallery button[data-full]').forEach(function (b) {
    b.addEventListener('click', function () {
      var img = $('img', b);
      var webp = document.createElement('canvas').toDataURL && document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0;
      openLightbox(webp ? b.getAttribute('data-full') : img.currentSrc || img.src, img.alt);
    });
  });
  if (lb) lb.addEventListener('click', function (e) { if (e.target !== lbImg) closeLightbox(); });

  /* ---------- lazy map ---------- */
  var map = $('#map');
  if (map) {
    var loadMap = function () {
      if (map.querySelector('iframe')) return;
      var f = document.createElement('iframe');
      f.src = map.getAttribute('data-src');
      f.title = 'Карта: Иркутск, ул. Маяковского, 65';
      f.loading = 'lazy';
      f.setAttribute('allowfullscreen', '');
      map.appendChild(f);
    };
    if ('IntersectionObserver' in window) {
      var mio = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { loadMap(); mio.disconnect(); } }, { rootMargin: '400px' });
      mio.observe(map);
    } else loadMap();
  }

  var yr = $('#year'); if (yr) yr.textContent = new Date().getFullYear();
})();
