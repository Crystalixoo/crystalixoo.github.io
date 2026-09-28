/* Strona championa – informacje, buildy i przedmioty sytuacyjne */
(function () {
  const { esc, ROLE_PL, TREE_PL, champImg, abilityImg } = window.WR;
  const ITEMS = window.WR_ITEMS.items;
  const BOOTS = window.WR_ITEMS.boots;
  const RUNES = window.WR_RUNES;
  const app = document.getElementById('app');

  const slug = new URLSearchParams(location.search).get('c');
  const champ = (window.WR_CHAMPIONS || []).find((c) => c.slug === slug);
  const data = (window.WR_BUILDS || {})[slug];

  if (!champ) {
    app.innerHTML = '<a class="back" href="index.html">← Wszyscy championowie</a><p class="empty">Nie znaleziono championa.</p>';
    return;
  }
  document.title = `${champ.name} – buildy Wild Rift (patch 7.3)`;

  // ---------- indeks run ----------
  const RUNE_INDEX = {};
  Object.entries(RUNES.keystones).forEach(([k, r]) => { RUNE_INDEX[k] = { ...r, tree: 'Keystone' }; });
  Object.entries(RUNES.trees).forEach(([tree, rows]) => rows.forEach((row, i) => Object.entries(row).forEach(([k, r]) => {
    RUNE_INDEX[k] = { ...r, tree, row: i + 1 };
  })));

  const SLOT_PL = { PASSIVE: 'Umiejętność bierna', ULTIMATE: 'Superumiejętność', 1: 'Umiejętność 1', 2: 'Umiejętność 2', 3: 'Umiejętność 3' };
  const MODES = [
    ['normal', 'Tryb zwykły', 'Summoner\'s Rift', 'Buildy na mecze rankingowe i normalne na Summoner\'s Rift – 5 przedmiotów + buty. Buty tier 3 (oznaczone „T3”) można ulepszyć od 10. minuty.'],
    ['aram', 'ARAM', 'Howling Abyss', 'ARAM to jedna linia i ciągłe walki drużynowe – liczy się przeżywalność, leczenie, antyleczenie i obrażenia obszarowe. Sklep jest dostępny tylko po śmierci, więc kolejność zakupów ma znaczenie.'],
    ['urf', 'URF', 'Ultra Rapid Fire', 'W URF mana jest nieskończona, a czasy odnowienia bardzo krótkie – przedmioty dające manę i przyspieszenie tracą wartość, liczą się czyste obrażenia, przebicie i wytrzymałość.'],
  ];

  // ---------- render ----------
  const diffDots = '<span class="dots">' + [1, 2, 3].map((i) => `<i class="${i <= champ.diff ? 'on' : ''}"></i>`).join('') + '</span>';
  const lanes = data ? data.lanes : [];

  function itemSlot(code, i) {
    const it = ITEMS[code];
    return `<div class="item-slot" tabindex="0" data-tip="item:${code}">
      <span class="order">${i}</span>
      <img src="${it.img}" alt="${esc(it.name)}" width="52" height="52" loading="lazy" />
      <div class="iname">${esc(it.name)}</div></div>`;
  }
  function bootsSlot(code) {
    const b = BOOTS[code];
    return `<div class="item-slot boots" tabindex="0" data-tip="boots:${code}">
      <img src="${b.img}" alt="${esc(b.name)}" width="52" height="52" loading="lazy" />
      <span class="t3">T3</span>
      <div class="iname">${esc(b.name)} → ${esc(b.t3.name)}</div></div>`;
  }
  function runeEl(code, cls) {
    const r = RUNE_INDEX[code];
    return `<div class="${cls}" tabindex="0" data-tip="rune:${code}">
      <img src="${r.img}" alt="${esc(r.name)}" loading="lazy" />
      <div class="rname">${esc(r.name)}</div></div>`;
  }

  function buildCard(b, i, mode) {
    const total = b.items.reduce((s, c) => s + ITEMS[c].cost, 0) + BOOTS[b.boots].cost;
    const totalT3 = total - BOOTS[b.boots].cost + BOOTS[b.boots].t3.cost;
    return `<article class="build">
      <div class="build-head">
        <div><div class="num">Build ${i + 1} · ${mode}</div><h3>${esc(b.name)}</h3></div>
        <span class="tag lane">${esc(b.lane)}</span>
      </div>
      <div>
        <div class="label">Przedmioty (kolejność zakupu)</div>
        <div class="items-row">${b.items.map((c, k) => itemSlot(c, k + 1)).join('')}<span class="plus">+</span>${bootsSlot(b.boots)}</div>
        <div class="cost">Koszt pełnego buildu: <b>${total.toLocaleString('pl-PL')}</b> złota (z butami T3: ${totalT3.toLocaleString('pl-PL')})</div>
      </div>
      <div>
        <div class="label">Runy</div>
        <div class="runes">
          ${runeEl(b.keystone, 'keystone')}
          <div class="rune-trees">
            <div class="rune-tree t-${b.tree}"><div class="tname">${TREE_PL[b.tree]} (główne)</div>
              <div class="list">${b.primary.map((r) => runeEl(r, 'rune')).join('')}</div></div>
            <div class="rune-tree t-${b.secTree}"><div class="tname">${TREE_PL[b.secTree]}</div>
              <div class="list">${runeEl(b.secondary, 'rune')}</div></div>
          </div>
        </div>
      </div>
      <p class="build-desc">${esc(b.desc)}</p>
    </article>`;
  }

  const abilitiesHtml = champ.abilities.map((a, i) => `<div class="ability">
      <img src="${abilityImg(champ.slug, i)}" alt="" width="48" height="48" loading="lazy" />
      <div><div class="slot">${SLOT_PL[a.slot] || esc(a.slot)}</div><h4>${esc(a.name)}</h4><p>${esc(a.desc)}</p></div>
    </div>`).join('');

  let html = `<a class="back" href="index.html">← Wszyscy championowie</a>
    <section class="champ-hero">
      <div class="portrait"><img src="${champImg(champ.slug)}" alt="${esc(champ.name)}" width="285" height="323" /></div>
      <div>
        <h1>${esc(champ.name)}</h1>
        <div class="subtitle">${esc(champ.title)}</div>
        <div class="tags">
          ${champ.roles.map((r) => `<span class="tag">${ROLE_PL[r]}</span>`).join('')}
          ${lanes.map((l) => `<span class="tag lane">${esc(l)}</span>`).join('')}
          <span class="tag diff">Trudność: ${esc(champ.difficulty)} ${diffDots}</span>
        </div>
      </div>
      ${data ? `<p class="about">${esc(data.about)}</p>` : ''}
    </section>
    <h2 class="section-title">Umiejętności</h2>
    <div class="abilities">${abilitiesHtml}</div>`;

  if (!data) {
    html += '<h2 class="section-title">Buildy</h2><p class="empty">Buildy dla tego championa są w przygotowaniu.</p>';
    app.innerHTML = html;
    return;
  }

  html += `<h2 class="section-title" id="buildy">Rekomendowane buildy</h2>
    <div class="tabs" role="tablist">
      ${MODES.map(([k, n, sub]) => `<button type="button" class="tab" role="tab" data-mode="${k}">${n}<span class="sub">${sub}</span></button>`).join('')}
    </div>
    <p class="mode-info" id="mode-info"></p>
    <div class="builds" id="builds"></div>
    <div class="rules"><b>Jak czytać build:</b> 5 przedmiotów w kolejności zakupu + buty (tier 2, a po 10. minucie ulepszenie do tier 3). Runy: <b>keystone</b> (runa główna) + <b>3 runy</b> z jednego drzewa (po jednej z każdego rzędu) + <b>1 runa</b> z innego drzewa. Najedź lub dotknij ikonę, aby zobaczyć statystyki.</div>
    <h2 class="section-title">Przedmioty sytuacyjne</h2>
    <p class="mode-info">Przedmioty pasujące do championa, którymi możesz zastąpić elementy buildu zależnie od składu wrogiej drużyny.</p>
    <div class="situational">${data.situational.map((c) => {
      const it = ITEMS[c];
      return `<div class="sit" tabindex="0" data-tip="item:${c}"><img src="${it.img}" alt="" width="44" height="44" loading="lazy" />
        <div><h4>${esc(it.name)} <small>${it.cost.toLocaleString('pl-PL')} zł.</small></h4><p>${esc(it.desc)}</p></div></div>`;
    }).join('')}</div>`;
  app.innerHTML = html;

  const buildsEl = document.getElementById('builds');
  const infoEl = document.getElementById('mode-info');
  const tabs = app.querySelectorAll('.tab');
  function setMode(m) {
    const def = MODES.find((x) => x[0] === m) || MODES[0];
    tabs.forEach((t) => { const on = t.dataset.mode === def[0]; t.classList.toggle('active', on); t.setAttribute('aria-selected', on); });
    infoEl.textContent = def[3];
    buildsEl.innerHTML = data[def[0]].map((b, i) => buildCard(b, i, def[1])).join('');
    if (location.hash.slice(1) !== def[0]) history.replaceState(null, '', `#${def[0]}`);
  }
  app.querySelector('.tabs').addEventListener('click', (e) => {
    const t = e.target.closest('[data-mode]');
    if (t) setMode(t.dataset.mode);
  });
  setMode(location.hash.slice(1) || 'normal');

  // ---------- tooltip ----------
  const tip = document.getElementById('tip');
  function tipHtml(key) {
    const [type, code] = key.split(':');
    if (type === 'item') {
      const it = ITEMS[code];
      return `<h5>${esc(it.name)}</h5><div class="tcost">${it.cost.toLocaleString('pl-PL')} złota</div>
        <ul>${it.stats.map((s) => `<li>${esc(s)}</li>`).join('')}</ul><p>${esc(it.desc)}</p>
        ${it.passive ? `<div class="en">${esc(it.passive)}</div>` : ''}`;
    }
    if (type === 'boots') {
      const b = BOOTS[code];
      return `<h5>${esc(b.name)}</h5><div class="tcost">${b.cost.toLocaleString('pl-PL')} złota · ${esc(b.desc)}</div>
        <ul>${b.stats.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>
        <div class="t3box"><b>Tier 3 (od 10:00): ${esc(b.t3.name)}</b> – ${b.t3.cost.toLocaleString('pl-PL')} złota łącznie
        <ul>${b.t3.stats.map((s) => `<li>${esc(s)}</li>`).join('')}</ul><p>${esc(b.t3.effect)}</p></div>`;
    }
    const r = RUNE_INDEX[code];
    const where = r.tree === 'Keystone' ? 'Keystone (runa główna)' : `${TREE_PL[r.tree]} · rząd ${r.row}`;
    return `<h5>${esc(r.name)}</h5><div class="tcost">${where}</div><p>${esc(r.desc)}</p>`;
  }
  let current = null;
  function show(el) {
    current = el;
    tip.innerHTML = tipHtml(el.dataset.tip);
    tip.classList.add('show');
    const rc = el.getBoundingClientRect();
    const tw = tip.offsetWidth, th = tip.offsetHeight;
    let x = rc.left + rc.width / 2 - tw / 2;
    x = Math.max(12, Math.min(x, window.innerWidth - tw - 12));
    let y = rc.top - th - 10;
    if (y < 70) y = rc.bottom + 10;
    if (y + th > window.innerHeight - 8) y = Math.max(8, window.innerHeight - th - 8);
    tip.style.left = `${x}px`;
    tip.style.top = `${y}px`;
  }
  function hide() { current = null; tip.classList.remove('show'); }
  app.addEventListener('mouseover', (e) => { const el = e.target.closest('[data-tip]'); if (el && el !== current) show(el); });
  app.addEventListener('mouseout', (e) => { const el = e.target.closest('[data-tip]'); if (el && !el.contains(e.relatedTarget)) hide(); });
  app.addEventListener('focusin', (e) => { const el = e.target.closest('[data-tip]'); if (el) show(el); });
  app.addEventListener('focusout', hide);
  app.addEventListener('click', (e) => {
    const el = e.target.closest('[data-tip]');
    if (el) { if (current === el) hide(); else show(el); }
  });
  document.addEventListener('click', (e) => { if (!e.target.closest('[data-tip]')) hide(); });
  window.addEventListener('scroll', hide, { passive: true });
})();
