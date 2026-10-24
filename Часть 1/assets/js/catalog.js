/* Каталог: фильтры по типу, цене, ширине, цвету, материалу, наличию; сортировка; состояние в адресе. */
(() => {
  const { $, $$, fmt, ic } = MM;
  const params = new URLSearchParams(location.search);
  const minP = Math.min(...MM.products.map((p) => MM.unitPrice(p, p.sizes ? 0 : undefined)));
  const maxP = Math.max(...MM.products.map((p) => (p.sizes ? p.sizes[p.sizes.length - 1].price : p.price)));
  const F = {
    cats: new Set((params.get('cat') || '').split(',').filter(Boolean)),
    colors: new Set(), mats: new Set(),
    pmin: null, pmax: null, wmin: null, wmax: null,
    stock: false, sale: params.get('sale') === '1', q: params.get('q') || '', sort: 'pop',
  };
  const form = $('[data-filters]');
  const count = (fn) => MM.products.filter(fn).length;

  /* Разметка фильтров */
  $('[data-catnav]').innerHTML = `<a class="catnav__item${!F.cats.size && !F.sale ? ' is-active' : ''}" href="catalog.html">Все</a>` +
    MM.categories.map((c) => `<a class="catnav__item${F.cats.size === 1 && F.cats.has(c.id) ? ' is-active' : ''}" href="catalog.html?cat=${c.id}">${c.name}</a>`).join('') +
    `<a class="catnav__item${F.sale ? ' is-active' : ''}" href="catalog.html?sale=1" style="color:${F.sale ? '#fff' : 'var(--accent)'}">Акции</a>`;
  $('[data-f-cats]').innerHTML = MM.categories.map((c) => `<label class="check"><input type="checkbox" name="cat" value="${c.id}" ${F.cats.has(c.id) ? 'checked' : ''}><span>${c.name}</span><span>${count((p) => p.cat === c.id)}</span></label>`).join('');
  const usedColors = [...new Set(MM.products.flatMap((p) => p.colors))];
  $('[data-f-colors]').innerHTML = usedColors.map((k) => `<button type="button" class="swatch" style="background:${MM.colors[k].hex}" data-color="${k}" aria-pressed="false" aria-label="${MM.colors[k].name}" title="${MM.colors[k].name}"></button>`).join('');
  const mats = [...new Set(MM.products.map((p) => p.material))].sort();
  $('[data-f-mats]').innerHTML = mats.map((m) => `<label class="check"><input type="checkbox" name="mat" value="${m}"><span>${m}</span><span>${count((p) => p.material === m)}</span></label>`).join('');
  form.sale.checked = F.sale;

  /* Ползунок цены */
  const rmin = $('[data-rmin]'), rmax = $('[data-rmax]'), fill = $('[data-fill]');
  [rmin, rmax].forEach((r) => { r.min = minP; r.max = maxP; r.step = 1000; });
  rmin.value = minP; rmax.value = maxP;
  const paintFill = () => {
    const a = ((rmin.value - minP) / (maxP - minP)) * 100, b = ((rmax.value - minP) / (maxP - minP)) * 100;
    fill.style.left = a + '%'; fill.style.width = b - a + '%';
  };
  paintFill();
  rmin.addEventListener('input', () => { if (+rmin.value > +rmax.value) rmin.value = rmax.value; form.pmin.value = +rmin.value > minP ? rmin.value : ''; paintFill(); read(); });
  rmax.addEventListener('input', () => { if (+rmax.value < +rmin.value) rmax.value = rmin.value; form.pmax.value = +rmax.value < maxP ? rmax.value : ''; paintFill(); read(); });

  const num = (v) => { const n = parseInt(String(v).replace(/\D/g, ''), 10); return Number.isFinite(n) ? n : null; };
  function read() {
    F.cats = new Set($$('[name=cat]:checked', form).map((i) => i.value));
    F.mats = new Set($$('[name=mat]:checked', form).map((i) => i.value));
    F.pmin = num(form.pmin.value); F.pmax = num(form.pmax.value);
    F.wmin = num(form.wmin.value); F.wmax = num(form.wmax.value);
    F.stock = form.stock.checked; F.sale = form.sale.checked;
    render();
  }
  form.addEventListener('input', (e) => { if (!e.target.matches('[type=range]')) read(); });
  form.addEventListener('change', (e) => {
    if (e.target === form.pmin) { rmin.value = F.pmin ?? minP; paintFill(); }
    if (e.target === form.pmax) { rmax.value = F.pmax ?? maxP; paintFill(); }
  });
  $('[data-f-colors]').addEventListener('click', (e) => {
    const b = e.target.closest('[data-color]'); if (!b) return;
    const k = b.dataset.color; F.colors.has(k) ? F.colors.delete(k) : F.colors.add(k);
    b.setAttribute('aria-pressed', F.colors.has(k)); render();
  });
  $('[data-sort]').addEventListener('change', (e) => { F.sort = e.target.value; render(); });
  $('[data-reset]').addEventListener('click', reset);
  function reset() {
    form.reset(); $$('input[type=checkbox]', form).forEach((i) => (i.checked = false)); F.colors.clear(); F.q = ''; $$('[data-color]').forEach((b) => b.setAttribute('aria-pressed', 'false'));
    rmin.value = minP; rmax.value = maxP; paintFill(); read();
  }

  /* Фильтрация */
  const priceRange = (p) => (p.sizes ? [p.sizes[0].price, p.sizes[p.sizes.length - 1].price] : [p.price, p.price]);
  const pass = (p) => {
    const [lo, hi] = priceRange(p);
    if (F.cats.size && !F.cats.has(p.cat)) return false;
    if (F.mats.size && !F.mats.has(p.material)) return false;
    if (F.colors.size && !p.colors.some((c) => F.colors.has(c))) return false;
    if (F.pmin != null && hi < F.pmin) return false;
    if (F.pmax != null && lo > F.pmax) return false;
    if (F.wmin != null && p.w < F.wmin) return false;
    if (F.wmax != null && p.w > F.wmax) return false;
    if (F.stock && !p.inStock) return false;
    if (F.sale && !p.oldPrice) return false;
    if (F.q && !MM.match(p, F.q)) return false;
    return true;
  };
  const plural = (n, a, b, c) => { const m = n % 10, h = n % 100; return m === 1 && h !== 11 ? a : m >= 2 && m <= 4 && (h < 10 || h >= 20) ? b : c; };

  function render() {
    let list = MM.products.filter(pass);
    const order = MM.products.map((p) => p.id);
    const sorters = {
      pop: (a, b) => order.indexOf(a.id) - order.indexOf(b.id),
      asc: (a, b) => priceRange(a)[0] - priceRange(b)[0],
      desc: (a, b) => priceRange(b)[0] - priceRange(a)[0],
      sale: (a, b) => (b.oldPrice ? 1 : 0) - (a.oldPrice ? 1 : 0),
    };
    list.sort(sorters[F.sort]);

    const n = list.length;
    $('[data-count-text]').textContent = `${n} ${plural(n, 'модель', 'модели', 'моделей')}`;
    $('[data-apply]').textContent = `Показать ${n} ${plural(n, 'модель', 'модели', 'моделей')}`;

    const single = F.cats.size === 1 ? MM.catById([...F.cats][0]) : null;
    const title = F.q ? `Поиск: «${F.q}»` : single ? single.name : F.sale && !F.cats.size ? 'Акции и скидки' : 'Каталог мебели';
    $('[data-title]').textContent = title;
    $('[data-crumb]').innerHTML = single || F.sale || F.q ? `<a href="catalog.html">Каталог</a></li><li>${title}` : 'Каталог';
    document.title = `${title} — купить в Верхних Кигах | Мир мебели`;

    /* Активные фильтры — чипсы */
    const chips = [];
    F.cats.forEach((id) => chips.push([MM.catById(id).name, () => { form.querySelector(`[name=cat][value="${id}"]`).checked = false; read(); }]));
    F.colors.forEach((k) => chips.push([MM.colors[k].name, () => { F.colors.delete(k); $(`[data-color="${k}"]`).setAttribute('aria-pressed', 'false'); render(); }]));
    F.mats.forEach((m) => chips.push([m, () => { form.querySelector(`[name=mat][value="${m}"]`).checked = false; read(); }]));
    if (F.pmin != null || F.pmax != null) chips.push([`${F.pmin != null ? 'от ' + fmt(F.pmin) : ''} ${F.pmax != null ? 'до ' + fmt(F.pmax) : ''}`.trim(), () => { form.pmin.value = form.pmax.value = ''; rmin.value = minP; rmax.value = maxP; paintFill(); read(); }]);
    if (F.wmin != null || F.wmax != null) chips.push([`Ширина ${F.wmin ?? ''}–${F.wmax ?? ''} см`, () => { form.wmin.value = form.wmax.value = ''; read(); }]);
    if (F.stock) chips.push(['В наличии', () => { form.stock.checked = false; read(); }]);
    if (F.sale) chips.push(['Со скидкой', () => { form.sale.checked = false; read(); }]);
    if (F.q) chips.push([`«${F.q}»`, () => { F.q = ''; render(); }]);
    const box = $('[data-chips]'); box.innerHTML = '';
    chips.forEach(([label, fn]) => { const b = document.createElement('button'); b.className = 'chip'; b.innerHTML = `${label} ${ic('close')}`; b.setAttribute('aria-label', `Убрать фильтр: ${label}`); b.onclick = fn; box.append(b); });
    if (chips.length > 1) { const b = document.createElement('button'); b.className = 'chip'; b.style.background = 'none'; b.style.textDecoration = 'underline'; b.textContent = 'Сбросить всё'; b.onclick = reset; box.append(b); }

    $('[data-grid]').innerHTML = n
      ? list.map((p, i) => MM.card(p, i)).join('')
      : `<div class="empty" style="grid-column:1/-1"><b class="h3">Под эти условия ничего не нашлось</b><p class="muted">Попробуйте расширить диапазон цены или убрать часть фильтров. Или спросите консультанта — часть моделей можно сделать под заказ.</p><div style="display:flex;gap:var(--sp-2);flex-wrap:wrap;justify-content:center"><button class="btn btn--dark" data-reset2>Сбросить фильтры</button><button class="btn btn--ghost" data-open="consult">Спросить консультанта</button></div></div>`;
    $('[data-reset2]')?.addEventListener('click', reset);
    MM.refresh(); MM.observeReveal($('[data-grid]'));

    /* Состояние в адресной строке */
    const u = new URLSearchParams();
    if (F.cats.size) u.set('cat', [...F.cats].join(','));
    if (F.sale) u.set('sale', '1');
    if (F.q) u.set('q', F.q);
    history.replaceState(null, '', u.toString() ? `?${u}` : location.pathname);
  }

  /* Фильтры на телефоне — нижняя шторка */
  const panel = $('#filters');
  $('[data-open-filters]').addEventListener('click', () => { panel.classList.add('is-open'); $('.overlay').classList.add('is-open'); document.body.classList.add('is-locked'); });
  $$('[data-close-filters]').forEach((b) => b.addEventListener('click', () => MM.closeAll()));

  render();
})();
