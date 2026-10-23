/* Общие элементы сайта: шапка, подвал, поиск, избранное, сравнение, корзина, формы, анимации. */
(() => {
  const { store, fmt, img, srcset } = MM;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  MM.$ = $; MM.$$ = $$;

  /* ---------- Иконки ---------- */
  const P = {
    search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',
    heart: '<path class="ic-heart" d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',
    cart: '<path d="M5 7h14l-1.2 11.1a2 2 0 0 1-2 1.9H8.2a2 2 0 0 1-2-1.9L5 7z"/><path d="M9 7V6a3 3 0 0 1 6 0v1"/>',
    compare: '<path d="M7 4v16M17 4v16M3 8h8M13 16h8"/>',
    phone: '<path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 6 6L15 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
    pin: '<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    grid: '<rect x="4" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h10"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    left: '<path d="M15 6l-6 6 6 6"/>',
    right: '<path d="M9 6l6 6-6 6"/>',
    home: '<path d="M4 11l8-7 8 7v8a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1v-8z"/>',
    chat: '<path d="M4 5h16v11H9l-5 4V5z"/>',
    zoom: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5M11 8v6M8 11h6"/>',
    truck: '<path d="M3 6h11v10H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/>',
    tools: '<path d="M14.5 6.5a4 4 0 0 0-5.3 5.3L4 17l3 3 5.2-5.2a4 4 0 0 0 5.3-5.3l-2.4 2.4-2.6-.6-.6-2.6 2.6-2.2z"/>',
    stairs: '<path d="M4 20h4v-4h4v-4h4V8h4V4"/>',
    card: '<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18M7 15h3"/>',
    shield: '<path d="M12 3l7 3v5c0 4.5-3 8.3-7 10-4-1.7-7-5.5-7-10V6l7-3z"/><path d="M9 12l2 2 4-4"/>',
    filter: '<path d="M4 6h16M7 12h10M10 18h4"/>',
    check: '<path d="M5 12l5 5L20 7"/>',
    ruler: '<path d="M3 17L17 3l4 4L7 21z"/><path d="M7 13l2 2M10 10l2 2M13 7l2 2"/>',
  };
  const ic = (n, cls = '') => `<svg class="${cls}" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n]}</svg>`;
  MM.ic = ic;

  const logoMark = `<svg class="logo__mark" viewBox="0 0 40 40" aria-hidden="true"><rect width="40" height="40" rx="11" fill="#2A2926"/><path d="M10 27V17.5a3.5 3.5 0 0 1 7 0V22h6v-4.5a3.5 3.5 0 0 1 7 0V27" fill="none" stroke="#C49A6C" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 27h22" stroke="#F7F3EC" stroke-width="2.6" stroke-linecap="round"/></svg>`;
  const logo = (tag = true) => `<a class="logo" href="index.html" aria-label="Мир мебели — на главную">${logoMark}<span class="logo__text"><span class="logo__name">МИР МЕБЕЛИ</span>${tag ? '<span class="logo__tag">мебель для всего дома</span>' : ''}</span></a>`;

  const page = document.body.dataset.page;
  const curCat = new URLSearchParams(location.search).get('cat');

  /* ---------- Шапка ---------- */
  const navLinks = [
    ['kitchens', 'Кухни'], ['sofas', 'Диваны'], ['bedrooms', 'Спальни'],
    ['wardrobes', 'Шкафы и прихожие', true], ['living', 'Гостиные', true], ['kids', 'Детская мебель', true],
  ];
  const header = `
  <header class="site-header" id="top">
    <div class="topbar"><div class="container topbar__in">
      <span class="topbar__item">${ic('pin')}с. Верхние Киги, Кигинский район, Республика Башкортостан</span>
      <span class="topbar__item topbar__hours">${ic('clock')}${store.hours}</span>
      <span class="topbar__spacer"></span>
      <a class="topbar__item topbar__phone" href="${store.phoneHref}">${ic('phone')}${store.phone}</a>
      <button class="btn btn--dark btn--sm" data-open="consult">Связаться с консультантом</button>
    </div></div>
    <div class="mainbar"><div class="container mainbar__in">
      <button class="icon-btn burger" data-open="menu" aria-label="Открыть меню">${ic('menu')}</button>
      ${logo()}
      <nav class="nav" aria-label="Основная навигация">
        <button class="btn btn--dark btn--sm nav__catalog" aria-expanded="false" aria-controls="mega" data-mega>${ic('grid')}Каталог мебели</button>
        <div class="nav__links">
          ${navLinks.map(([id, n, opt]) => `<a class="nav__link${opt ? ' nav__link--opt' : ''}" href="catalog.html?cat=${id}"${curCat === id ? ' aria-current="page"' : ''}>${n}</a>`).join('')}
          <a class="nav__link nav__link--sale" href="catalog.html?sale=1">Акции</a>
        </div>
      </nav>
      <div class="header-actions">
        <button class="search-trigger" data-open="search" aria-label="Поиск по каталогу">${ic('search')}<span>Найти диван, шкаф, кухню…</span></button>
        <a class="icon-btn header-call" href="${store.phoneHref}" aria-label="Позвонить">${ic('phone')}</a>
        <button class="icon-btn icon-btn--compare" data-open="compare" aria-label="Сравнение">${ic('compare')}<span class="badge-count" data-count="cmp"></span></button>
        <button class="icon-btn icon-btn--fav" data-open="fav" aria-label="Избранное">${ic('heart')}<span class="badge-count" data-count="fav"></span></button>
        <button class="icon-btn icon-btn--cart" data-open="cart" aria-label="Корзина">${ic('cart')}<span class="badge-count" data-count="cart"></span></button>
      </div>
    </div>
    <div class="mega" id="mega" role="region" aria-label="Каталог мебели">
      <div class="container mega__in" style="padding-left:var(--gutter);padding-right:var(--gutter)">
        <div class="mega__grid">
          ${MM.categories.map((c) => `<a class="mega__cat" href="catalog.html?cat=${c.id}"><img src="${img(c.img, 320, 240)}" alt="" loading="lazy" width="320" height="240"><span><b>${c.name}</b><br><span>${c.note} · от ${fmt(c.from)}</span></span></a>`).join('')}
          <a class="mega__cat" href="catalog.html" style="background:var(--beige);align-content:center;justify-items:start;padding:var(--sp-5)"><b>Весь каталог</b><span>${MM.products.length} моделей · фильтры по цене и размерам</span><span class="link-arrow">Смотреть ${ic('arrow')}</span></a>
        </div>
        <div class="mega__promo">
          <div style="display:grid;gap:var(--sp-3)"><span class="eyebrow">Помощь с выбором</span><p class="h3">Не знаете, что подойдёт? Пришлите размеры комнаты</p><p class="muted">Консультант подберёт 2–3 варианта под ваш бюджет и посчитает доставку со сборкой.</p></div>
          <button class="btn btn--primary" data-open="consult">Подобрать мебель</button>
        </div>
      </div>
    </div></div>
  </header>`;

  const tabbar = `
  <nav class="tabbar" aria-label="Быстрая навигация">
    <a class="tabbar__item" href="index.html"${page === 'home' ? ' aria-current="page"' : ''}>${ic('home')}Главная</a>
    <a class="tabbar__item" href="catalog.html"${page === 'catalog' ? ' aria-current="page"' : ''}>${ic('grid')}Каталог</a>
    <button class="tabbar__item" data-open="search">${ic('search')}Поиск</button>
    <button class="tabbar__item" data-open="fav">${ic('heart')}Избранное<span class="badge-count" data-count="fav"></span></button>
    <button class="tabbar__item" data-open="cart">${ic('cart')}Корзина<span class="badge-count" data-count="cart"></span></button>
  </nav>`;

  const footer = `
  <footer class="footer">
    <div class="container">
      <div class="footer__grid">
        <div style="display:grid;gap:var(--sp-4);align-content:start">
          ${logo()}
          <p style="max-width:340px">Мебель для кухни, гостиной, спальни и детской с доставкой по Кигинскому району. Подъём, сборка и гарантия — в одном месте.</p>
        </div>
        <div><h3>Каталог</h3><ul>${MM.categories.map((c) => `<li><a href="catalog.html?cat=${c.id}">${c.name}</a></li>`).join('')}</ul></div>
        <div><h3>Покупателям</h3><ul>
          <li><a href="index.html#service">Доставка и сборка</a></li>
          <li><a href="index.html#service">Оплата</a></li>
          <li><a href="index.html#service">Гарантия и возврат</a></li>
          <li><a href="catalog.html?sale=1">Акции</a></li>
          <li><button data-open="consult">Помощь с выбором</button></li>
        </ul></div>
        <div><h3>Контакты</h3><ul>
          <li><a href="${store.phoneHref}" style="color:#fff;font-weight:700;font-size:1.1rem">${store.phone}</a></li>
          <li>${store.hours}</li>
          <li>${store.address}</li>
        </ul></div>
      </div>
      <div class="footer__bottom"><span>© 2026 «Мир мебели». Цены на сайте указаны в рублях и действительны при заказе онлайн.</span><span>Не является публичной офертой</span></div>
    </div>
  </footer>`;

  const layers = `
  <div class="overlay" data-close></div>

  <aside class="drawer" id="drawer-menu" aria-label="Меню" aria-hidden="true">
    <div class="drawer__head">${logo(false)}<button class="icon-btn" data-close aria-label="Закрыть">${ic('close')}</button></div>
    <div class="drawer__body" style="display:grid;gap:var(--sp-5);align-content:start">
      <button class="search-trigger" data-open="search" style="width:100%;min-width:0">${ic('search')}<span style="display:inline">Поиск по каталогу</span></button>
      <ul style="display:grid;gap:var(--sp-1)">
        ${MM.categories.map((c) => `<li><a class="room-item" style="grid-template-columns:56px 1fr auto" href="catalog.html?cat=${c.id}"><img src="${img(c.img, 160, 120)}" alt="" style="width:56px;height:46px" loading="lazy"><span><b>${c.name}</b><span>от ${fmt(c.from)}</span></span>${ic('right')}</a></li>`).join('')}
        <li><a class="room-item" style="grid-template-columns:1fr auto" href="catalog.html?sale=1"><b style="color:var(--accent)">Акции и скидки</b>${ic('right')}</a></li>
      </ul>
      <div style="display:grid;gap:var(--sp-2);font-size:var(--fs-sm)">
        <a href="${store.phoneHref}" style="font-weight:700;font-size:1.25rem">${store.phone}</a>
        <span class="muted">${store.hours}</span>
        <span class="muted">${store.address}</span>
      </div>
      <button class="btn btn--primary" data-open="consult">Связаться с консультантом</button>
    </div>
  </aside>

  <aside class="drawer" id="drawer-cart" aria-label="Корзина" aria-hidden="true">
    <div class="drawer__head"><h2>Корзина</h2><button class="icon-btn" data-close aria-label="Закрыть">${ic('close')}</button></div>
    <div class="drawer__body" data-cart-body></div>
    <div class="drawer__foot" data-cart-foot></div>
  </aside>

  <aside class="drawer" id="drawer-fav" aria-label="Избранное" aria-hidden="true">
    <div class="drawer__head"><h2>Избранное</h2><button class="icon-btn" data-close aria-label="Закрыть">${ic('close')}</button></div>
    <div class="drawer__body" data-fav-body></div>
  </aside>

  <aside class="drawer drawer--wide" id="drawer-compare" aria-label="Сравнение" aria-hidden="true">
    <div class="drawer__head"><h2>Сравнение моделей</h2><button class="icon-btn" data-close aria-label="Закрыть">${ic('close')}</button></div>
    <div class="drawer__body" data-compare-body style="overflow:auto"></div>
  </aside>

  <div class="search" id="search" role="dialog" aria-modal="true" aria-label="Поиск" aria-hidden="true">
    <div class="container">
      <form class="search__bar" action="catalog.html" role="search">
        ${ic('search')}
        <label class="sr-only" for="q">Поиск по каталогу</label>
        <input class="search__input" id="q" name="q" type="search" placeholder="Диван, шкаф-купе, кровать 160…" autocomplete="off">
        <button type="button" class="icon-btn" data-close aria-label="Закрыть поиск">${ic('close')}</button>
      </form>
      <div class="search__hints"><span class="muted">Часто ищут:</span>
        ${['Диван-кровать', 'Шкаф-купе', 'Кухня', 'Кровать 160', 'Прихожая', 'Детская'].map((t) => `<button type="button" class="chip" data-hint="${t}">${t}</button>`).join('')}
      </div>
      <div class="search__results" data-search-results></div>
    </div>
  </div>

  <div class="modal" id="consult" role="dialog" aria-modal="true" aria-labelledby="consult-title" aria-hidden="true">
    <div class="modal__backdrop" data-close></div>
    <div class="modal__box">
      <button class="icon-btn modal__close" data-close aria-label="Закрыть">${ic('close')}</button>
      <div style="display:grid;gap:var(--sp-3)">
        <span class="eyebrow">Консультант</span>
        <h2 class="h3" id="consult-title" style="font-size:1.75rem">Поможем выбрать мебель</h2>
        <p class="muted">Перезвоним в рабочее время в течение 30 минут. Расскажем о наличии, размерах и точной стоимости доставки.</p>
      </div>
      <form class="form" data-form novalidate>
        <div class="field"><label for="c-name">Как к вам обращаться</label><input class="input" id="c-name" name="name" autocomplete="name" required placeholder="Имя"></div>
        <div class="field"><label for="c-phone">Телефон</label><input class="input" id="c-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" required placeholder="+7 (___) ___-__-__" data-phone></div>
        <div class="field"><label for="c-msg">Что ищете? <span class="muted">(необязательно)</span></label><textarea class="textarea" id="c-msg" name="msg" placeholder="Например: шкаф в прихожую, ширина ниши 120 см"></textarea></div>
        <button class="btn btn--primary btn--block" type="submit">Жду звонка</button>
        <p class="form__note">Нажимая кнопку, вы соглашаетесь на обработку персональных данных.</p>
        <div class="form__success" role="status">Спасибо! Консультант перезвонит вам в ближайшее время.</div>
      </form>
      <a class="btn btn--ghost btn--block" href="${store.phoneHref}">${ic('phone')}Позвонить: ${store.phone}</a>
    </div>
  </div>

  <div class="lightbox" id="lightbox" role="dialog" aria-modal="true" aria-label="Просмотр фото" aria-hidden="true">
    <img alt="">
    <button class="lightbox__btn lightbox__close" data-close aria-label="Закрыть">${ic('close')}</button>
    <button class="lightbox__btn lightbox__prev" aria-label="Предыдущее фото">${ic('left')}</button>
    <button class="lightbox__btn lightbox__next" aria-label="Следующее фото">${ic('right')}</button>
    <span class="lightbox__count"></span>
  </div>

  <div class="toast" role="status" aria-live="polite"><span data-toast-text></span><button class="btn btn--light" data-toast-action>Открыть</button></div>`;

  $('#site-header').outerHTML = header;
  $('#site-footer').outerHTML = footer + tabbar + layers;

  /* ---------- Хранилище (localStorage с защитой) ---------- */
  const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
  const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };
  const state = { cart: load('mm_cart', []), fav: load('mm_fav', []), cmp: load('mm_cmp', []), assembly: load('mm_asm', false) };
  MM.state = state;

  MM.unitPrice = (p, sizeIdx) => (p.sizes ? p.sizes[sizeIdx ?? p.size].price : p.price);
  MM.assemblyCost = (sum) => Math.max(1500, Math.round((sum * 0.07) / 100) * 100);

  const counts = () => {
    const n = { cart: state.cart.reduce((a, i) => a + i.qty, 0), fav: state.fav.length, cmp: state.cmp.length };
    $$('[data-count]').forEach((el) => { const v = n[el.dataset.count]; el.textContent = v; el.classList.toggle('is-on', v > 0); });
    $$('[data-fav]').forEach((b) => b.setAttribute('aria-pressed', state.fav.includes(b.dataset.fav)));
    $$('[data-cmp]').forEach((b) => b.setAttribute('aria-pressed', state.cmp.includes(b.dataset.cmp)));
  };
  MM.refresh = () => { counts(); renderCart(); renderFav(); renderCompare(); };

  /* ---------- Тост ---------- */
  let toastT;
  const toast = (text, action, label = 'Открыть') => {
    const t = $('.toast');
    $('[data-toast-text]', t).textContent = text;
    const b = $('[data-toast-action]', t);
    b.hidden = !action; b.textContent = label; b.onclick = () => { t.classList.remove('is-on'); action && action(); };
    t.classList.add('is-on'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('is-on'), 3200);
  };
  MM.toast = toast;

  MM.addToCart = (id, qty = 1, opt = {}) => {
    const p = MM.byId(id); if (!p) return;
    const size = opt.size ?? p.size; const color = opt.color ?? p.color;
    const key = `${id}|${size ?? ''}|${color}`;
    const ex = state.cart.find((i) => i.key === key);
    if (ex) ex.qty += qty; else state.cart.push({ key, id, qty, size, color });
    save('mm_cart', state.cart); MM.refresh();
    toast(`«${p.name}» в корзине`, () => openLayer('cart'), 'Корзина');
  };
  const toggle = (list, id, key, onMsg, offMsg) => {
    const i = state[list].indexOf(id);
    if (i > -1) state[list].splice(i, 1); else {
      if (list === 'cmp' && state.cmp.length >= 4) { toast('Сравнивать можно до 4 моделей'); return; }
      state[list].push(id);
    }
    save(key, state[list]); MM.refresh();
    toast(i > -1 ? offMsg : onMsg, i > -1 ? null : () => openLayer(list === 'fav' ? 'fav' : 'compare'));
  };
  MM.toggleFav = (id) => toggle('fav', id, 'mm_fav', 'Добавлено в избранное', 'Удалено из избранного');
  MM.toggleCmp = (id) => toggle('cmp', id, 'mm_cmp', 'Добавлено к сравнению', 'Убрано из сравнения');

  /* ---------- Карточка товара ---------- */
  MM.card = (p, i = 0) => {
    const cat = MM.catById(p.cat);
    const sale = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
    return `
    <article class="card reveal" style="--d:${(i % 4) * 0.06}s">
      <div class="card__media">
        <img src="${img(p.img, 600, 510)}" srcset="${srcset(p.img, 600 / 510)}" sizes="(max-width: 900px) 50vw, 25vw" alt="${p.name}" loading="lazy" width="600" height="510">
        <div class="card__badges">${sale ? `<span class="tag tag--sale">−${sale}%</span>` : ''}${p.inStock ? '' : '<span class="tag">Под заказ</span>'}</div>
        <div class="card__tools">
          <button class="card__tool" data-fav="${p.id}" aria-pressed="false" aria-label="В избранное">${ic('heart')}</button>
          <button class="card__tool card__tool--compare" data-cmp="${p.id}" aria-pressed="false" aria-label="Сравнить">${ic('compare')}</button>
        </div>
      </div>
      <div class="card__body">
        <span class="card__cat">${cat.name}</span>
        <h3 class="card__title"><a href="product.html?id=${p.id}">${p.name}</a></h3>
        <ul class="card__specs">${p.short.map((s) => `<li>${s}</li>`).join('')}</ul>
        <div class="stock"><span class="stock__dot${p.inStock ? '' : ' stock__dot--order'}">${p.stock}</span><span>Доставка ежедневно</span></div>
        <div class="card__foot">
          <div class="price"><span class="price__now">${p.sizes ? 'от ' + fmt(p.sizes[0].price) : fmt(p.price)}</span>${p.oldPrice ? `<span class="price__old">${fmt(p.oldPrice)}</span>` : ''}</div>
          <a class="btn btn--ghost btn--sm" href="product.html?id=${p.id}" tabindex="-1">Подробнее</a>
        </div>
      </div>
    </article>`;
  };

  /* ---------- Корзина ---------- */
  const cartTotals = () => {
    const sub = state.cart.reduce((a, i) => a + MM.unitPrice(MM.byId(i.id), i.size) * i.qty, 0);
    const deliv = state.cart.length ? store.delivery : 0;
    const asm = state.assembly && sub ? MM.assemblyCost(sub) : 0;
    return { sub, deliv, asm, total: sub + deliv + asm };
  };
  let checkout = false;
  function renderCart(footOnly = false) {
    const body = $('[data-cart-body]'); const foot = $('[data-cart-foot]');
    if (!body) return;
    if (!state.cart.length) {
      body.innerHTML = `<div class="drawer__empty">${ic('cart')}<p>В корзине пока пусто.<br>Загляните в каталог — там более ${MM.products.length} моделей для всего дома.</p><a class="btn btn--primary" href="catalog.html">Перейти в каталог</a></div>`;
      foot.hidden = true; checkout = false; return;
    }
    foot.hidden = false;
    const t = cartTotals();
    if (footOnly) {
      /* тело корзины не трогаем, чтобы не стереть введённые данные */
    } else if (checkout) {
      body.innerHTML = `
        <button class="link-arrow" data-back style="margin-bottom:var(--sp-5)">${ic('left')} Вернуться к товарам</button>
        <form class="form" data-form data-checkout novalidate>
          <h3 class="h3">Оформление заказа</h3>
          <div class="field"><label for="o-name">Имя и фамилия</label><input class="input" id="o-name" name="name" required autocomplete="name"></div>
          <div class="field"><label for="o-phone">Телефон</label><input class="input" id="o-phone" name="phone" type="tel" required data-phone placeholder="+7 (___) ___-__-__" autocomplete="tel"></div>
          <div class="field"><label for="o-addr">Адрес доставки</label><input class="input" id="o-addr" name="address" required placeholder="Село, улица, дом, квартира" autocomplete="street-address"></div>
          <div class="form__row">
            <div class="field"><label for="o-floor">Этаж</label><input class="input" id="o-floor" name="floor" inputmode="numeric" placeholder="1"></div>
            <div class="field"><label for="o-lift">Лифт</label><select class="select input" id="o-lift" name="lift"><option>Нет</option><option>Пассажирский</option><option>Грузовой</option></select></div>
          </div>
          <div class="field"><label for="o-pay">Оплата</label><select class="select input" id="o-pay" name="pay"><option>Картой или наличными при получении</option><option>Переводом после звонка менеджера</option><option>Рассрочка 0% на 6 месяцев</option></select></div>
          <p class="form__note">Менеджер перезвонит, чтобы подтвердить заказ и согласовать время доставки. Предоплата не требуется.</p>
          <div class="form__success" role="status">Заказ принят! Мы позвоним в течение 30 минут в рабочее время, чтобы подтвердить детали.</div>
        </form>`;
    } else {
      body.innerHTML = state.cart.map((i) => {
        const p = MM.byId(i.id);
        const opts = [MM.colors[i.color]?.name, p.sizes ? p.sizes[i.size].label : ''].filter(Boolean).join(' · ');
        return `<div class="line-item">
          <a href="product.html?id=${p.id}"><img src="${img(p.img, 200, 170)}" alt="" loading="lazy"></a>
          <div>
            <a class="line-item__title" href="product.html?id=${p.id}">${p.name}</a>
            <div class="line-item__meta">${opts}</div>
            <div class="line-item__row">
              <div class="qty"><button data-qty="-1" data-key="${i.key}" aria-label="Меньше">−</button><output>${i.qty}</output><button data-qty="1" data-key="${i.key}" aria-label="Больше">+</button></div>
              <b>${fmt(MM.unitPrice(p, i.size) * i.qty)}</b>
            </div>
            <button class="line-item__remove" data-remove="${i.key}">Удалить</button>
          </div>
        </div>`;
      }).join('');
    }
    foot.innerHTML = `
      <label class="check"><input type="checkbox" data-asm ${state.assembly ? 'checked' : ''}><span>Нужна сборка мастером (7%, от 1 500 ₽)</span></label>
      <div class="sum-row"><span>Товары</span><span>${fmt(t.sub)}</span></div>
      <div class="sum-row"><span>Доставка по селу</span><span>${fmt(t.deliv)}</span></div>
      ${t.asm ? `<div class="sum-row"><span>Сборка</span><span>${fmt(t.asm)}</span></div>` : ''}
      <div class="sum-row sum-row--total"><span>Итого</span><span>${fmt(t.total)}</span></div>
      ${checkout ? '<button class="btn btn--primary btn--block" data-submit-order>Подтвердить заказ</button>' : '<button class="btn btn--primary btn--block" data-checkout-start>Оформить заказ</button>'}`;
  }

  function renderFav() {
    const body = $('[data-fav-body]'); if (!body) return;
    if (!state.fav.length) { body.innerHTML = `<div class="drawer__empty">${ic('heart')}<p>Добавляйте понравившиеся модели в избранное, чтобы вернуться к ним позже или показать семье.</p><a class="btn btn--primary" href="catalog.html">Перейти в каталог</a></div>`; return; }
    body.innerHTML = state.fav.map((id) => {
      const p = MM.byId(id); if (!p) return '';
      return `<div class="line-item">
        <a href="product.html?id=${p.id}"><img src="${img(p.img, 200, 170)}" alt="" loading="lazy"></a>
        <div><a class="line-item__title" href="product.html?id=${p.id}">${p.name}</a>
          <div class="line-item__row"><b>${fmt(MM.unitPrice(p))}</b><button class="btn btn--dark btn--sm" data-add="${p.id}">В корзину</button></div>
          <button class="line-item__remove" data-fav-remove="${p.id}">Удалить</button></div>
      </div>`;
    }).join('');
  }

  function renderCompare() {
    const body = $('[data-compare-body]'); if (!body) return;
    if (!state.cmp.length) { body.innerHTML = `<div class="drawer__empty">${ic('compare')}<p>Нажмите значок сравнения на карточке товара, чтобы сопоставить до 4 моделей по цене, размерам и материалам.</p><a class="btn btn--primary" href="catalog.html">Перейти в каталог</a></div>`; return; }
    const ps = state.cmp.map(MM.byId).filter(Boolean);
    const row = (label, f) => `<tr><th scope="row">${label}</th>${ps.map((p) => `<td>${f(p)}</td>`).join('')}</tr>`;
    body.innerHTML = `<table class="compare">
      <tr><th></th>${ps.map((p) => `<td><a href="product.html?id=${p.id}"><img src="${img(p.img, 400, 300)}" alt=""><b>${p.name}</b></a></td>`).join('')}</tr>
      ${row('Цена', (p) => `<b>${p.sizes ? 'от ' + fmt(p.sizes[0].price) : fmt(p.price)}</b>`)}
      ${row('Раздел', (p) => MM.catById(p.cat).name)}
      ${row('Габариты, Ш×Г×В', (p) => `${p.w} × ${p.d} × ${p.h} см`)}
      ${row('Материал', (p) => p.material)}
      ${row('Цвета', (p) => p.colors.map((c) => MM.colors[c].name).join(', '))}
      ${row('Наличие', (p) => p.stock)}
      ${row('Главное', (p) => p.short.join('<br>'))}
      ${row('', (p) => `<div style="display:grid;gap:6px"><button class="btn btn--dark btn--sm" data-add="${p.id}">В корзину</button><button class="line-item__remove" data-cmp-remove="${p.id}">Убрать</button></div>`)}
    </table>`;
  }

  /* ---------- Слои: открытие и закрытие ---------- */
  const overlay = $('.overlay');
  let lastFocus = null;
  const layerEl = (name) => ({ menu: '#drawer-menu', cart: '#drawer-cart', fav: '#drawer-fav', compare: '#drawer-compare', search: '#search', consult: '#consult', lightbox: '#lightbox' })[name];
  function openLayer(name) {
    closeAll(true);
    const el = $(layerEl(name)); if (!el) return;
    lastFocus = document.activeElement;
    el.classList.add('is-open'); el.setAttribute('aria-hidden', 'false');
    if (!['consult', 'lightbox'].includes(name)) overlay.classList.add('is-open');
    document.body.classList.add('is-locked');
    if (name === 'search') setTimeout(() => $('#q').focus(), 50);
    else setTimeout(() => (el.querySelector('input, button:not([data-close]), a') || el).focus({ preventScroll: true }), 60);
  }
  function closeAll(silent) {
    $$('.drawer.is-open, .search.is-open, .modal.is-open, .lightbox.is-open, .filters.is-open').forEach((el) => { el.classList.remove('is-open'); el.setAttribute('aria-hidden', 'true'); });
    overlay.classList.remove('is-open'); document.body.classList.remove('is-locked');
    closeMega();
    if (!silent && lastFocus) lastFocus.focus({ preventScroll: true });
  }
  MM.openLayer = openLayer; MM.closeAll = closeAll;

  /* Мегаменю */
  const megaBtn = $('[data-mega]'); const mega = $('#mega');
  function closeMega() { mega?.classList.remove('is-open'); megaBtn?.setAttribute('aria-expanded', 'false'); }
  megaBtn?.addEventListener('click', (e) => { e.stopPropagation(); const o = !mega.classList.contains('is-open'); mega.classList.toggle('is-open', o); megaBtn.setAttribute('aria-expanded', o); });
  document.addEventListener('click', (e) => { if (mega?.classList.contains('is-open') && !mega.contains(e.target)) closeMega(); });

  /* ---------- Делегирование кликов ---------- */
  document.addEventListener('click', (e) => {
    const t = e.target.closest('button, a, [data-close]'); if (!t) return;
    const d = t.dataset;
    if (d.open) { e.preventDefault(); openLayer(d.open); }
    else if ('close' in d) { e.preventDefault(); closeAll(); }
    else if (d.fav) { e.preventDefault(); MM.toggleFav(d.fav); }
    else if (d.cmp) { e.preventDefault(); MM.toggleCmp(d.cmp); }
    else if (d.add) { e.preventDefault(); MM.addToCart(d.add); }
    else if (d.favRemove) { MM.toggleFav(d.favRemove); }
    else if (d.cmpRemove) { MM.toggleCmp(d.cmpRemove); }
    else if (d.remove) { state.cart = state.cart.filter((i) => i.key !== d.remove); save('mm_cart', state.cart); MM.refresh(); }
    else if (d.qty && d.key) {
      const it = state.cart.find((i) => i.key === d.key); if (!it) return;
      it.qty = Math.max(1, Math.min(20, it.qty + +d.qty)); save('mm_cart', state.cart); MM.refresh();
    }
    else if ('checkoutStart' in d) { checkout = true; renderCart(); $('#o-name')?.focus(); }
    else if ('back' in d) { checkout = false; renderCart(); }
    else if ('submitOrder' in d) { $('[data-checkout]')?.requestSubmit(); }
    else if (d.hint) { $('#q').value = d.hint; runSearch(); $('#q').focus(); }
  });
  document.addEventListener('change', (e) => {
    if (e.target.matches('[data-asm]')) { state.assembly = e.target.checked; save('mm_asm', state.assembly); renderCart(true); }
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeAll(); });

  /* ---------- Поиск ---------- */
  const norm = (s) => s.toLowerCase().replace(/ё/g, 'е');
  MM.match = (p, q) => {
    const hay = norm([p.name, MM.catById(p.cat).name, p.material, p.short.join(' '), p.desc, p.colors.map((c) => MM.colors[c].name).join(' ')].join(' '));
    return norm(q).split(/\s+/).filter(Boolean).every((w) => hay.includes(w.replace(/(ы|и|а|я|ов|ей)$/, '')));
  };
  function runSearch() {
    const q = $('#q').value.trim(); const box = $('[data-search-results]');
    if (!q) { box.innerHTML = MM.categories.map((c) => `<a class="search-hit" href="catalog.html?cat=${c.id}"><img src="${img(c.img, 160, 130)}" alt="" loading="lazy"><span><b>${c.name}</b><span class="muted">от ${fmt(c.from)}</span></span></a>`).join(''); return; }
    const hits = MM.products.filter((p) => MM.match(p, q)).sort((a, b) => norm(b.name).includes(norm(q).slice(0, 4)) - norm(a.name).includes(norm(q).slice(0, 4)));
    box.innerHTML = hits.length
      ? hits.map((p) => `<a class="search-hit" href="product.html?id=${p.id}"><img src="${img(p.img, 160, 130)}" alt="" loading="lazy"><span><b>${p.name}</b><span>${fmt(MM.unitPrice(p))}</span></span></a>`).join('') + `<a class="search-hit" href="catalog.html?q=${encodeURIComponent(q)}" style="grid-template-columns:1fr;font-weight:600">Все результаты в каталоге →</a>`
      : `<p class="muted">По запросу «${q.replace(/[<>&]/g, '')}» ничего не нашлось. Попробуйте другое слово или <button class="link-arrow" data-open="consult">спросите консультанта</button>.</p>`;
  }
  $('#q').addEventListener('input', runSearch); runSearch();

  /* ---------- Формы ---------- */
  const fmtPhone = (v) => {
    let d = v.replace(/\D/g, ''); if (!d) return '';
    if (d[0] === '8') d = '7' + d.slice(1); if (d[0] !== '7') d = '7' + d; d = d.slice(0, 11);
    let r = '+7'; if (d.length > 1) r += ' (' + d.slice(1, 4); if (d.length >= 4) r += ')';
    if (d.length > 4) r += ' ' + d.slice(4, 7); if (d.length > 7) r += '-' + d.slice(7, 9); if (d.length > 9) r += '-' + d.slice(9, 11);
    return r;
  };
  document.addEventListener('input', (e) => { if (e.target.matches('[data-phone]')) e.target.value = fmtPhone(e.target.value); });
  document.addEventListener('submit', (e) => {
    const f = e.target; if (!f.matches('[data-form]')) return;
    e.preventDefault();
    let ok = true;
    $$('[required]', f).forEach((inp) => {
      const bad = inp.matches('[data-phone]') ? inp.value.replace(/\D/g, '').length < 11 : !inp.value.trim();
      inp.classList.toggle('is-error', bad); inp.setAttribute('aria-invalid', bad); if (bad && ok) { inp.focus(); ok = false; }
    });
    if (!ok) return;
    // Здесь заявку нужно отправить в CRM, на почту или в Telegram магазина.
    f.classList.add('is-sent');
    if (f.matches('[data-checkout]')) {
      state.cart = []; save('mm_cart', state.cart); counts();
      $('[data-cart-foot]').hidden = true;
      setTimeout(() => { checkout = false; }, 0);
    }
  });

  /* ---------- Шапка при прокрутке, появление, параллакс ---------- */
  const hdr = $('.site-header');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const par = $$('[data-parallax]');
  let ticking = false;
  const onScroll = () => {
    hdr.classList.toggle('is-scrolled', scrollY > 8);
    if (!reduce) par.forEach((el) => {
      const r = el.parentElement.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      const k = parseFloat(el.dataset.parallax) || 0.08;
      el.style.transform = `translate3d(0, ${((r.top + r.height / 2 - innerHeight / 2) * -k).toFixed(1)}px, 0)`;
    });
    ticking = false;
  };
  addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(onScroll); ticking = true; } }, { passive: true });
  onScroll();

  MM.observeReveal = (root = document) => {
    const els = $$('.reveal:not(.is-in)', root);
    if (reduce || !('IntersectionObserver' in window)) { els.forEach((el) => el.classList.add('is-in')); return; }
    const io = new IntersectionObserver((ents) => ents.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } }), { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    els.forEach((el) => io.observe(el));
  };

  document.addEventListener('DOMContentLoaded', () => { MM.refresh(); MM.observeReveal(); });
  if (document.readyState !== 'loading') { MM.refresh(); MM.observeReveal(); }
})();
