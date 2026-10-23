/* Главная: категории, подборки по комнатам, популярные модели, отзывы. */
(() => {
  const { $, $$, img, srcset, fmt, ic } = MM;

  $('[data-quickcats]').innerHTML = MM.categories
    .map((c) => `<a class="quickcat" href="catalog.html?cat=${c.id}"><img src="${img(c.img, 96, 96)}" alt="" width="36" height="36" loading="lazy">${c.name}</a>`)
    .join('') + `<a class="quickcat" href="catalog.html?sale=1" style="color:var(--accent);font-weight:700;padding-left:var(--sp-4)">Акции</a>`;

  $('[data-cats]').innerHTML = MM.categories.map((c, i) => {
    const n = MM.products.filter((p) => p.cat === c.id).length;
    return `<a class="cat-tile reveal" style="--d:${(i % 4) * 0.06}s" href="catalog.html?cat=${c.id}">
      <img src="${img(c.img, i === 0 ? 1100 : 640, i === 0 ? 800 : 820)}" srcset="${srcset(c.img, i === 0 ? 1.375 : 0.78)}" sizes="(max-width: 900px) ${i === 0 ? '100vw' : '50vw'}, ${i === 0 ? '50vw' : '25vw'}" alt="${c.name}" loading="lazy">
      <span class="cat-tile__label"><span><b>${c.name}</b><span>${n} модели · от ${fmt(c.from)}</span></span><span class="cat-tile__go">${ic('arrow')}</span></span>
    </a>`;
  }).join('');

  /* Подборки по комнатам — вкладки */
  $('[data-room-tabs]').innerHTML = MM.rooms
    .map((r, i) => `<button class="rooms__tab" role="tab" id="tab-${r.id}" aria-controls="room-${r.id}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${r.name}</button>`)
    .join('');
  $('[data-room-panels]').innerHTML = MM.rooms.map((r, i) => {
    const items = r.items.map(MM.byId);
    const total = items.reduce((a, p) => a + MM.unitPrice(p), 0);
    return `<div class="room" role="tabpanel" id="room-${r.id}" aria-labelledby="tab-${r.id}" ${i ? 'hidden' : ''}>
      <div class="room__media"><img src="${img(r.img, 1100, 820)}" srcset="${srcset(r.img, 1.34)}" sizes="(max-width: 900px) 100vw, 58vw" alt="${r.title}" loading="lazy"></div>
      <div class="room__body">
        <div class="room__intro"><h3 class="h3">${r.title}</h3><p class="muted">${r.text}</p></div>
        <ul class="room__list">${items.map((p) => `<li><a class="room-item" href="product.html?id=${p.id}">
          <img src="${img(p.img, 220, 180)}" alt="" loading="lazy" width="104" height="84">
          <span><b>${p.name}</b><span>${p.short[0]} · ${p.stock}</span></span>
          <strong>${p.sizes ? 'от ' : ''}${fmt(MM.unitPrice(p, p.sizes ? 0 : undefined))}</strong></a></li>`).join('')}</ul>
        <div class="room__total"><span><small>Комплект целиком</small><b>${fmt(total)}</b></span><button class="btn btn--primary btn--sm" data-room-add="${r.id}">Добавить всё в корзину</button></div>
      </div>
    </div>`;
  }).join('');

  const tabs = $$('.rooms__tab');
  const select = (t) => {
    tabs.forEach((x) => { const on = x === t; x.setAttribute('aria-selected', on); x.tabIndex = on ? 0 : -1; $('#' + x.getAttribute('aria-controls')).hidden = !on; });
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => select(t));
    t.addEventListener('keydown', (e) => {
      if (!['ArrowRight', 'ArrowLeft'].includes(e.key)) return;
      const n = tabs[(i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length]; n.focus(); select(n);
    });
  });
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-room-add]'); if (!b) return;
    MM.rooms.find((r) => r.id === b.dataset.roomAdd).items.forEach((id) => MM.addToCart(id));
    MM.toast('Комплект добавлен в корзину', () => MM.openLayer('cart'), 'Корзина');
  });

  $('[data-popular]').innerHTML = ['sofa-verona', 'bed-nordik', 'wardrobe-modern', 'kitchen-skandi'].map((id, i) => MM.card(MM.byId(id), i)).join('');

  $('[data-reviews]').innerHTML = MM.reviews.map((r, i) => `
    <article class="review reveal" style="--d:${i * 0.06}s">
      <div class="review__head">
        <span class="review__avatar" aria-hidden="true">${r.name[0]}</span>
        <span><b>${r.name}</b><span>${r.place} · ${r.date}</span></span>
        <span class="review__product">${r.product}</span>
      </div>
      <p class="review__text">${r.text}</p>
    </article>`).join('');

  MM.refresh(); MM.observeReveal();
})();
