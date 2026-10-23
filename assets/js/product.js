/* Страница товара: галерея с увеличением, варианты, расчёт итоговой стоимости, подробная информация. */
(() => {
  const { $, $$, img, srcset, fmt, ic, store } = MM;
  const id = new URLSearchParams(location.search).get('id');
  const p = MM.byId(id) || MM.products[0];
  const cat = MM.catById(p.cat);
  const S = { i: 0, color: p.color, size: p.size, qty: 1, lift: 'house', floor: 2, asm: MM.state.assembly, where: 'village' };

  document.title = `${p.name} — купить за ${fmt(MM.unitPrice(p)).replace(' ', ' ')} | Мир мебели`;
  $('meta[name=description]').content = `${p.name}: ${p.short.join(', ')}. Цена ${fmt(MM.unitPrice(p))}, доставка ежедневно от 1 000 ₽, сборка, гарантия 18 месяцев. Мир мебели, с. Верхние Киги.`;
  const ld = document.createElement('script'); ld.type = 'application/ld+json';
  ld.textContent = JSON.stringify({ '@context': 'https://schema.org', '@type': 'Product', name: p.name, sku: p.sku, image: p.gallery.map((g) => img(g, 1200)), description: p.desc, category: cat.name, brand: { '@type': 'Brand', name: 'Мир мебели' }, offers: { '@type': 'Offer', priceCurrency: 'RUB', price: MM.unitPrice(p), availability: p.inStock ? 'https://schema.org/InStock' : 'https://schema.org/PreOrder' } });
  document.head.append(ld);

  $('[data-crumbs]').innerHTML = `<li><a href="index.html">Главная</a></li><li><a href="catalog.html">Каталог</a></li><li><a href="catalog.html?cat=${cat.id}">${cat.name}</a></li><li aria-current="page">${p.name}</li>`;

  const sale = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
  const unit = () => MM.unitPrice(p, S.size);
  const lift = () => (S.lift === 'house' ? 0 : S.lift === 'lift' ? 500 : 200 * Math.max(0, S.floor - 1));
  const asm = () => (S.asm ? MM.assemblyCost(unit() * S.qty) : 0);
  const total = () => unit() * S.qty + store.delivery + lift() + asm();

  /* ---------- Верх страницы: галерея + покупка ---------- */
  $('[data-pdp]').innerHTML = `
    <div class="gallery">
      <div class="gallery__thumbs" role="list">${p.gallery.map((g, i) => `<button class="gallery__thumb" role="listitem" data-thumb="${i}" aria-current="${i === 0}" aria-label="Фото ${i + 1}"><img src="${img(g, 200, 200)}" alt="" width="88" height="88"></button>`).join('')}</div>
      <div>
        <div class="gallery__main" data-main tabindex="0" aria-label="Открыть фото на весь экран" role="button">
          <img data-main-img src="${img(p.gallery[0], 1200, 1056)}" srcset="${srcset(p.gallery[0], 1200 / 1056)}" sizes="(max-width: 900px) 100vw, 55vw" alt="${p.name}, фото 1" width="1200" height="1056" fetchpriority="high">
          <button class="gallery__nav gallery__nav--prev" data-step="-1" aria-label="Предыдущее фото">${ic('left')}</button>
          <button class="gallery__nav gallery__nav--next" data-step="1" aria-label="Следующее фото">${ic('right')}</button>
          <span class="gallery__zoom">${ic('zoom')}Увеличить</span>
        </div>
        <div class="gallery__dots" aria-hidden="true">${p.gallery.map((_, i) => `<span class="${i ? '' : 'is-on'}"></span>`).join('')}</div>
      </div>
    </div>

    <div class="buy">
      <div style="display:grid;gap:var(--sp-3)">
        <div class="card__badges" style="position:static">${sale ? `<span class="tag tag--sale">−${sale}%</span>` : ''}<span class="tag" style="background:var(--beige)">${cat.name}</span></div>
        <h1 class="buy__title">${p.name}</h1>
        <div class="buy__meta"><span>Арт. ${p.sku}</span><span class="stock"><span class="stock__dot${p.inStock ? '' : ' stock__dot--order'}">${p.stock}</span></span><span>Доставка ежедневно</span></div>
      </div>
      <div class="buy__price"><span class="price__now" data-unit>${fmt(unit())}</span>${p.oldPrice && !p.sizes ? `<span class="price__old" style="font-size:1rem">${fmt(p.oldPrice)}</span>` : ''}${p.oldPrice && p.sizes ? `<span class="price__old" style="font-size:1rem" data-old>${fmt(p.oldPrice)}</span>` : ''}</div>
      <p class="muted">${p.desc}</p>

      <div class="opt">
        <span class="opt__label">Цвет: <span data-color-name>${MM.colors[S.color].name}</span></span>
        <div class="opt__list">${p.colors.map((c) => `<button class="swatch" style="background:${MM.colors[c].hex}" data-pick-color="${c}" aria-pressed="${c === S.color}" aria-label="${MM.colors[c].name}" title="${MM.colors[c].name}"></button>`).join('')}</div>
      </div>
      ${p.sizes ? `<div class="opt"><span class="opt__label">Размер</span><div class="opt__list">${p.sizes.map((s, i) => `<button class="opt__btn" data-pick-size="${i}" aria-pressed="${i === S.size}">${s.label} · ${fmt(s.price)}</button>`).join('')}</div></div>` : ''}

      <dl class="buy__specs">
        <div><dt>Габариты (Ш × Г × В)</dt><dd>${p.w} × ${p.d} × ${p.h} см</dd></div>
        <div><dt>Материал</dt><dd>${p.material}</dd></div>
        ${p.short.slice(1, 3).map((s, i) => `<div><dt>${i ? 'Удобство' : 'Главное'}</dt><dd>${s}</dd></div>`).join('')}
      </dl>

      <div class="buy__actions">
        <div class="qty"><button data-q="-1" aria-label="Меньше">−</button><output data-qty>1</output><button data-q="1" aria-label="Больше">+</button></div>
        <button class="btn btn--primary" data-buy>Добавить в корзину</button>
        <button class="icon-btn" data-fav="${p.id}" aria-pressed="false" aria-label="В избранное">${ic('heart')}</button>
        <button class="icon-btn icon-btn--compare" data-cmp="${p.id}" aria-pressed="false" aria-label="Сравнить">${ic('compare')}</button>
      </div>

      <div class="deliv" aria-label="Итоговая стоимость">
        <div class="deliv__row"><span>Товар${'<span data-qty-note></span>'}</span><b data-sum-goods></b></div>
        <div class="deliv__row"><span>Доставка по с. Верхние Киги</span><b>${fmt(store.delivery)}</b></div>
        <div class="deliv__calc">
          <div class="form__row">
            <div class="field"><label for="d-where">Куда доставить</label>
              <select class="select input" id="d-where" data-where><option value="village">с. Верхние Киги</option><option value="district">Другое село района</option></select></div>
            <div class="field"><label for="d-lift">Подъём</label>
              <select class="select input" id="d-lift" data-lift><option value="house">Частный дом / 1 этаж</option><option value="lift">Квартира, есть лифт</option><option value="stairs">Квартира без лифта</option></select></div>
          </div>
          <div class="field" data-floor-field hidden><label for="d-floor">Этаж</label><input class="input" id="d-floor" type="number" min="2" max="16" value="2" data-floor></div>
          <div data-district hidden style="display:grid;gap:var(--sp-2)">
            <p class="form__note">Стоимость по району зависит от расстояния. Укажите адрес — менеджер назовёт точную цену по телефону в течение 30 минут.</p>
            <div style="display:grid;grid-template-columns:1fr auto;gap:var(--sp-2)"><label class="sr-only" for="d-addr">Адрес</label><input class="input" id="d-addr" placeholder="Село, улица, дом" data-addr><button class="btn btn--dark btn--sm" style="min-height:44px" data-calc-addr>Рассчитать</button></div>
          </div>
          <label class="check"><input type="checkbox" data-asm-p ${S.asm ? 'checked' : ''}><span>Сборка мастером — <b data-asm-price></b></span></label>
        </div>
        <div class="deliv__row" data-lift-row><span>Подъём</span><b data-sum-lift></b></div>
        <div class="deliv__row deliv__total"><span>Итого с доставкой<span data-total-note></span></span><b data-total></b></div>
      </div>
      <p class="form__note">Оплата при получении — после того как проверите мебель. Гарантия 18 месяцев.</p>
    </div>`;

  /* ---------- Подробная информация ---------- */
  const blocks = [
    ['dims', 'Размеры и материалы', `<table class="spec-table"><tbody>${Object.entries(p.specs).map(([k, v]) => `<tr><th scope="row">${k}</th><td>${v}</td></tr>`).join('')}<tr><th scope="row">Доступные цвета</th><td>${p.colors.map((c) => MM.colors[c].name).join(', ')}</td></tr></tbody></table>`],
    ['kit', 'Комплектация', `<ul class="ticks">${p.kit.map((k) => `<li>${k}</li>`).join('')}</ul>`],
    ['stock', 'Наличие и сроки', `<div class="info-cards">
        <div class="info-card"><b>${p.stock}</b><p>${p.inStock ? 'Модель на складе в Верхних Кигах. Привезём в удобный день — доставка работает ежедневно.' : 'Изготовим и привезём за 5–7 рабочих дней. Точную дату назовём при подтверждении заказа.'}</p></div>
        <div class="info-card"><b>Доставка ежедневно</b><p>С 9:00 до 17:00, в согласованный двухчасовой интервал. Водитель позвонит за 30 минут.</p></div></div>`],
    ['delivery', 'Доставка и подъём', `<div class="info-cards">
        <div class="info-card"><b>По с. Верхние Киги — ${fmt(store.delivery)}</b><p>Фиксированная цена, независимо от количества товаров в заказе.</p></div>
        <div class="info-card"><b>По Кигинскому району</b><p>Рассчитываем по адресу. Укажите адрес в калькуляторе выше или позвоните — назовём цену сразу.</p></div>
        <div class="info-card"><b>Подъём с лифтом — 500 ₽</b><p>Без лифта — 200 ₽ за каждый этаж начиная со второго. В частный дом — бесплатно.</p></div>
        <div class="info-card"><b>Вывоз упаковки</b><p>Бесплатно при заказе сборки.</p></div></div>`],
    ['assembly', 'Сборка', `<div class="info-cards">
        <div class="info-card"><b>Для этой модели — ${fmt(MM.assemblyCost(unit()))}</b><p>7% от стоимости, минимум 1 500 ₽. Мастер приедет в день доставки или в удобный вам день.</p></div>
        <div class="info-card"><b>Гарантия на сборку 12 месяцев</b><p>Если что-то разболталось или перекосилось — приедем и подтянем бесплатно.</p></div></div>`],
    ['pay', 'Оплата, гарантия и возврат', `<div class="info-cards">
        <div class="info-card"><b>Оплата при получении</b><p>Наличными, картой или переводом. Предоплата не нужна для товаров в наличии.</p></div>
        <div class="info-card"><b>Рассрочка 0% на 6 месяцев</b><p>Без переплаты, оформление по паспорту за 15 минут.</p></div>
        <div class="info-card"><b>Гарантия 18 месяцев</b><p>На производственные дефекты. Заменим деталь или весь товар за наш счёт.</p></div>
        <div class="info-card"><b>Возврат в течение 14 дней</b><p>Если мебель не подошла по размеру или цвету и сохранила товарный вид.</p></div></div>`],
    ['contacts', 'Остались вопросы?', `<div class="info-cards">
        <div class="info-card"><b>Позвоните консультанту</b><p>Уточним размеры, покажем ткани и материалы на фото или видео.</p><a class="btn btn--dark btn--sm" style="justify-self:start;margin-top:var(--sp-2)" href="${store.phoneHref}">${store.phone}</a></div>
        <div class="info-card"><b>Или оставьте номер</b><p>Перезвоним в течение 30 минут. ${store.hours}.</p><button class="btn btn--ghost btn--sm" style="justify-self:start;margin-top:var(--sp-2)" data-open="consult">Заказать звонок</button></div></div>`],
  ];
  $('[data-info]').innerHTML = `
    <nav class="pdp-info__nav" aria-label="Разделы описания">${blocks.map(([k, t]) => `<a href="#i-${k}">${t}</a>`).join('')}</nav>
    <div>${blocks.map(([k, t, html]) => `<section class="info-block" id="i-${k}" aria-labelledby="h-${k}"><h2 id="h-${k}">${t}</h2><div>${html}</div></section>`).join('')}</div>`;

  /* ---------- Мобильная панель покупки ---------- */
  $('[data-buybar]').innerHTML = `<span class="buybar__price"><small>Итого с доставкой</small><b data-total-bar></b></span><button class="icon-btn" data-fav="${p.id}" aria-pressed="false" aria-label="В избранное">${ic('heart')}</button><button class="btn btn--primary" data-buy>В корзину</button>`;

  /* ---------- Пересчёт ---------- */
  function update() {
    $('[data-unit]').textContent = fmt(unit());
    const old = $('[data-old]'); if (old) old.hidden = S.size !== p.size;
    $('[data-qty]').textContent = S.qty;
    $('[data-qty-note]').textContent = S.qty > 1 ? ` × ${S.qty}` : '';
    $('[data-sum-goods]').textContent = fmt(unit() * S.qty);
    $('[data-asm-price]').textContent = fmt(MM.assemblyCost(unit() * S.qty));
    $('[data-floor-field]').hidden = S.lift !== 'stairs';
    $('[data-district]').hidden = S.where !== 'district';
    $('[data-sum-lift]').textContent = lift() ? fmt(lift()) : 'Бесплатно';
    const t = fmt(total());
    $('[data-total]').textContent = S.where === 'district' ? `от ${t}` : t;
    $('[data-total-note]').innerHTML = S.asm ? '<br><small class="muted" style="font-weight:500">со сборкой</small>' : '';
    $('[data-total-bar]').textContent = S.where === 'district' ? `от ${t}` : t;
    $('[data-color-name]').textContent = MM.colors[S.color].name;
    $$('[data-pick-color]').forEach((b) => b.setAttribute('aria-pressed', b.dataset.pickColor === S.color));
    $$('[data-pick-size]').forEach((b) => b.setAttribute('aria-pressed', +b.dataset.pickSize === S.size));
  }

  document.addEventListener('click', (e) => {
    const t = e.target.closest('button, [data-main]'); if (!t) return;
    const d = t.dataset;
    if (d.pickColor) { S.color = d.pickColor; update(); }
    else if (d.pickSize) { S.size = +d.pickSize; update(); }
    else if (d.q) { S.qty = Math.max(1, Math.min(20, S.qty + +d.q)); update(); }
    else if ('buy' in d) {
      if (S.asm !== MM.state.assembly) { MM.state.assembly = S.asm; try { localStorage.setItem('mm_asm', JSON.stringify(S.asm)); } catch {} }
      MM.addToCart(p.id, S.qty, { color: S.color, size: S.size });
    }
    else if (d.thumb) show(+d.thumb);
    else if (d.step) { e.stopPropagation(); show(S.i + +d.step); }
    else if ('calcAddr' in d) {
      const a = $('[data-addr]').value.trim();
      MM.openLayer('consult');
      $('#c-msg').value = `Рассчитайте доставку: ${p.name}${a ? ', адрес: ' + a : ''}`;
    }
    else if ('main' in d && !e.target.closest('.gallery__nav')) openLightbox(S.i);
  });
  $('[data-main]').addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(S.i); } });
  $('[data-lift]').addEventListener('change', (e) => { S.lift = e.target.value; update(); });
  $('[data-where]').addEventListener('change', (e) => { S.where = e.target.value; update(); });
  $('[data-floor]').addEventListener('input', (e) => { S.floor = Math.max(2, Math.min(16, +e.target.value || 2)); update(); });
  $('[data-asm-p]').addEventListener('change', (e) => { S.asm = e.target.checked; update(); });

  /* ---------- Галерея ---------- */
  const n = p.gallery.length;
  function show(i) {
    S.i = (i + n) % n;
    const im = $('[data-main-img]'); const g = p.gallery[S.i];
    im.style.opacity = 0.4;
    im.src = img(g, 1200, 1056); im.srcset = srcset(g, 1200 / 1056); im.alt = `${p.name}, фото ${S.i + 1}`;
    im.onload = () => (im.style.opacity = 1);
    $$('[data-thumb]').forEach((b, k) => b.setAttribute('aria-current', k === S.i));
    $$('.gallery__dots span').forEach((s, k) => s.classList.toggle('is-on', k === S.i));
  }
  const swipe = (el, fn) => {
    let x0 = null, y0 = null;
    el.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
    el.addEventListener('touchend', (e) => {
      if (x0 == null) return; const dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) fn(dx < 0 ? 1 : -1); x0 = null;
    });
  };
  swipe($('[data-main]'), (s) => show(S.i + s));

  /* Лайтбокс с увеличением */
  const lb = $('#lightbox'); const lbImg = $('img', lb); let li = 0;
  function lbShow(i) {
    li = (i + n) % n; lbImg.classList.remove('is-zoomed');
    lbImg.src = img(p.gallery[li], 2000); lbImg.alt = `${p.name}, фото ${li + 1}`;
    $('.lightbox__count', lb).textContent = `${li + 1} / ${n}`;
  }
  function openLightbox(i) { lbShow(i); MM.openLayer('lightbox'); }
  $('.lightbox__prev', lb).addEventListener('click', () => lbShow(li - 1));
  $('.lightbox__next', lb).addEventListener('click', () => lbShow(li + 1));
  lbImg.addEventListener('click', (e) => {
    const r = lbImg.getBoundingClientRect();
    lbImg.style.transformOrigin = `${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`;
    lbImg.classList.toggle('is-zoomed');
  });
  lb.addEventListener('click', (e) => { if (e.target === lb) MM.closeAll(); });
  document.addEventListener('keydown', (e) => {
    if (!lb.classList.contains('is-open')) return;
    if (e.key === 'ArrowRight') lbShow(li + 1); if (e.key === 'ArrowLeft') lbShow(li - 1);
  });
  swipe(lb, (s) => { if (!lbImg.classList.contains('is-zoomed')) lbShow(li + s); });

  /* Подсветка текущего раздела в навигации описания */
  const links = $$('.pdp-info__nav a');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((ents) => ents.forEach((en) => {
      if (en.isIntersecting) links.forEach((a) => a.classList.toggle('is-active', a.hash === '#' + en.target.id));
    }), { rootMargin: '-30% 0px -60% 0px' });
    $$('.info-block').forEach((b) => io.observe(b));
  }

  /* Похожие товары */
  const rel = [...MM.products.filter((x) => x.cat === p.cat && x.id !== p.id), ...MM.products.filter((x) => x.cat !== p.cat)].slice(0, 4);
  $('[data-related]').innerHTML = rel.map((x, i) => MM.card(x, i)).join('');

  update(); MM.refresh(); MM.observeReveal();
})();
