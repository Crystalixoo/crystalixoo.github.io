/* Strona przedmiotów i run */
(function () {
  const { esc, ROLE_PL, TREE_PL, gold } = window.WR;
  const ITEMS = window.WR_ITEMS.items;
  const BOOTS = window.WR_ITEMS.boots;
  const RUNES = window.WR_RUNES;
  const BUILDS = window.WR_BUILDS || {};
  const content = document.getElementById('content');
  const q = document.getElementById('q');
  const catsEl = document.getElementById('cats');

  const NEW_73 = new Set(['yuntal', 'hexop', 'fiend', 'shieldbow', 'storm', 'rfc', 'shiv', 'helia', 'circlet']);
  const REMOVED_73 = ['Magnetic Blaster', 'Soul Transfer', 'Cloak of Agility', "Nashor's Talon", 'Shimmering Spark', 'Searing Crown', 'Surging Scales', 'Stinger'];
  const CATS = [
    ['all', 'Wszystko'], ['ad', 'Fizyczne'], ['mm', 'Strzelec'], ['ap', 'Magia'], ['tank', 'Tank'], ['supp', 'Wsparcie'], ['boots', 'Buty'], ['runes', 'Runy'],
  ];
  const CAT_TITLE = { ad: 'Przedmioty fizyczne (wojownicy i zabójcy)', mm: 'Przedmioty strzelców', ap: 'Przedmioty magiczne', tank: 'Przedmioty defensywne (tank)', supp: 'Przedmioty wsparcia' };

  // ile championów ma dany przedmiot w buildach (dowolny tryb)
  const usage = {};
  Object.values(BUILDS).forEach((d) => {
    const seen = new Set();
    ['normal', 'aram', 'urf'].forEach((m) => d[m].forEach((b) => { b.items.forEach((i) => seen.add(i)); seen.add(`boots:${b.boots}`); }));
    seen.forEach((i) => { usage[i] = (usage[i] || 0) + 1; });
  });
  const runeUsage = {};
  Object.values(BUILDS).forEach((d) => {
    const seen = new Set();
    ['normal', 'aram', 'urf'].forEach((m) => d[m].forEach((b) => [b.keystone, ...b.primary, b.secondary].forEach((r) => seen.add(r))));
    seen.forEach((r) => { runeUsage[r] = (runeUsage[r] || 0) + 1; });
  });

  let cat = 'all';
  catsEl.innerHTML = CATS.map(([k, v]) => `<button type="button" class="chip${k === cat ? ' active' : ''}" data-cat="${k}">${v}</button>`).join('');

  const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const match = (term, ...texts) => !term || texts.some((t) => norm(t).includes(term));

  function itemCard(code, it) {
    const badges = [
      NEW_73.has(code) ? '<span class="badge new">Nowe w 7.3</span>' : '',
      it.cls ? `<span class="badge cls">Tylko: ${it.cls.map((c) => ROLE_PL[c]).join(', ')}</span>` : '',
    ].join('');
    return `<article class="icard">
      <img src="${it.img}" alt="" width="48" height="48" loading="lazy" />
      <div>
        <h4>${esc(it.name)} <small>${gold(it.cost)} zł.</small></h4>
        ${badges ? `<div class="badges">${badges}</div>` : ''}
        <ul class="stats">${it.stats.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>
        <p>${esc(it.desc)}</p>
        ${it.passive ? `<details><summary>Opis z gry (EN)</summary><p class="en">${esc(it.passive)}</p></details>` : ''}
        <div class="usage">W buildach: ${usage[code] || 0} championów</div>
      </div></article>`;
  }
  function bootsCard(code, b) {
    return `<article class="icard boots-card">
      <img src="${b.img}" alt="" width="48" height="48" loading="lazy" />
      <div>
        <h4>${esc(b.name)} <small>${gold(b.cost)} zł.</small></h4>
        <ul class="stats">${b.stats.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>
        <p>${esc(b.desc)}</p>
        <div class="t3line"><b>Tier 3 od 10:00 → ${esc(b.t3.name)}</b> (${gold(b.t3.cost)} zł. łącznie)
          <ul class="stats">${b.t3.stats.map((s) => `<li>${esc(s)}</li>`).join('')}</ul><p>${esc(b.t3.effect)}</p></div>
        <div class="usage">W buildach: ${usage[`boots:${code}`] || 0} championów</div>
      </div></article>`;
  }
  function runeCard(code, r, cls) {
    return `<article class="rcard ${cls}">
      <img src="${r.img}" alt="" width="44" height="44" loading="lazy" />
      <div><h4>${esc(r.name)}</h4><p>${esc(r.desc)}</p><div class="usage">W buildach: ${runeUsage[code] || 0} championów</div></div></article>`;
  }

  function render() {
    const term = norm(q.value.trim());
    let html = '';
    const itemCats = cat === 'all' ? ['ad', 'mm', 'ap', 'tank', 'supp'] : ['ad', 'mm', 'ap', 'tank', 'supp'].filter((c) => c === cat);
    itemCats.forEach((c) => {
      const list = Object.entries(ITEMS).filter(([, it]) => it.cat === c && match(term, it.name, it.desc))
        .sort((a, b) => a[1].name.localeCompare(b[1].name));
      if (list.length) html += `<h2 class="section-title">${CAT_TITLE[c]} <small class="n">${list.length}</small></h2><div class="igrid">${list.map(([k, it]) => itemCard(k, it)).join('')}</div>`;
    });
    if (cat === 'all' || cat === 'boots') {
      const list = Object.entries(BOOTS).filter(([, b]) => match(term, b.name, b.t3.name, b.desc));
      if (list.length) html += `<h2 class="section-title">Buty <small class="n">${list.length}</small></h2>
        <p class="mode-info">Od patcha 7.2 buty nie mają enchantów. Każde buty tier 2 można od 10. minuty ulepszyć do wersji tier 3.</p>
        <div class="igrid">${list.map(([k, b]) => bootsCard(k, b)).join('')}</div>`;
    }
    if (cat === 'all' || cat === 'runes') {
      const keys = Object.entries(RUNES.keystones).filter(([, r]) => match(term, r.name, r.desc));
      let runesHtml = '';
      if (keys.length) runesHtml += `<h3 class="tree-title">Keystone (runa główna)</h3><div class="rgrid">${keys.map(([k, r]) => runeCard(k, r, 'key')).join('')}</div>`;
      Object.entries(RUNES.trees).forEach(([tree, rows]) => {
        const rowsHtml = rows.map((row, i) => {
          const list = Object.entries(row).filter(([, r]) => match(term, r.name, r.desc));
          return list.length ? `<div class="rrow"><div class="rowlabel">Rząd ${i + 1}</div><div class="rgrid">${list.map(([k, r]) => runeCard(k, r, `t-${tree}`)).join('')}</div></div>` : '';
        }).join('');
        if (rowsHtml) runesHtml += `<h3 class="tree-title t-${tree}"><span class="tname">${TREE_PL[tree]} (${tree})</span></h3>${rowsHtml}`;
      });
      if (runesHtml) html += `<h2 class="section-title">Runy</h2>
        <p class="mode-info">Zestaw run: 1 keystone (dowolny) + 3 runy z jednego drzewa (po jednej z każdego rzędu) + 1 runa z innego drzewa (z dowolnego rzędu).</p>${runesHtml}`;
    }
    if (cat === 'all' && !term) {
      html += `<div class="rules"><b>Usunięte w patchu 7.3:</b> ${REMOVED_73.map(esc).join(', ')}. Runa Ingenious Hunter została usunięta, a Legend: Tenacity zastąpiła Legend: Haste. Te przedmioty i runy nie występują w żadnym buildzie.</div>`;
    }
    content.innerHTML = html || '<p class="empty">Nic nie pasuje do wyszukiwania.</p>';
  }

  catsEl.addEventListener('click', (e) => {
    const b = e.target.closest('[data-cat]');
    if (!b) return;
    cat = b.dataset.cat;
    catsEl.querySelectorAll('.chip').forEach((c) => c.classList.toggle('active', c === b));
    render();
  });
  q.addEventListener('input', render);
  render();
})();
