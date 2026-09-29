/* Wspólne funkcje strony */
(function () {
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const ROLE_ORDER = ['FIGHTER', 'MAGE', 'MARKSMAN', 'ASSASSIN', 'TANK', 'SUPPORT'];
  const ROLE_PL = { FIGHTER: 'Wojownik', MAGE: 'Mag', MARKSMAN: 'Strzelec', ASSASSIN: 'Zabójca', TANK: 'Tank', SUPPORT: 'Wsparcie' };
  const TREE_PL = { Precision: 'Precyzja', Domination: 'Dominacja', Sorcery: 'Czarnoksięstwo', Resolve: 'Determinacja' };
  const LANES = ['Baron', 'Dżungla', 'Mid', 'Dragon', 'Support'];

  const champImg = (slug) => `img/champions/${slug}.webp`;
  const abilityImg = (slug, i) => `img/abilities/${slug}-${i}.webp`;
  const gold = (n) => n.toLocaleString('pl-PL');

  let runeIdx = null;
  function runeIndex() {
    if (runeIdx) return runeIdx;
    const RUNES = window.WR_RUNES;
    runeIdx = {};
    Object.entries(RUNES.keystones).forEach(([k, r]) => { runeIdx[k] = { ...r, tree: 'Keystone' }; });
    Object.entries(RUNES.trees).forEach(([tree, rows]) => rows.forEach((row, i) => Object.entries(row).forEach(([k, r]) => {
      runeIdx[k] = { ...r, tree, row: i + 1 };
    })));
    return runeIdx;
  }

  /* Formatuje dokładne wartości (umiejętności, efekty przedmiotów): koloruje skalowanie AD/AP/HP,
     wartości na poziomach i typy obrażeń. Wejście to czysty tekst – najpierw jest escapowany. */
  const N = String.raw`\d+(?:\.\d+)?`;
  const PCTS = String.raw`[+]?${N}%(?:\s*[-–/~]\s*${N}%)*`;
  const RX = new RegExp([
    String.raw`(?<ad>${PCTS}\s*(?:dod\.\s*|bazowego\s*)?AD\b)`,
    String.raw`(?<ap>${PCTS}\s*(?:dod\.\s*)?AP\b)`,
    String.raw`(?<hp>${PCTS}\s*(?:maks\.\s*|dod\.\s*)?(?:HP\b|zdrowia|dodatkowego zdrowia|dod\. zdrowia))`,
    String.raw`(?<armor>${PCTS}\s*(?:dod\.\s*)?(?:pancerza|odporności na magię))`,
    String.raw`(?<lvl>${N}%?(?:\s*/\s*${N}%?)+)`,
    String.raw`(?<dmg>obrażeń (?:fizycznych|magicznych|nieuchronnych)|obrażenia (?:fizyczne|magiczne|nieuchronne))`,
  ].join('|'), 'g');
  function fmtVals(text) {
    return esc(text).replace(RX, (m, ...args) => {
      const g = args[args.length - 1];
      if (g.ad) return `<span class="sc sc-ad">${m}</span>`;
      if (g.ap) return `<span class="sc sc-ap">${m}</span>`;
      if (g.hp) return `<span class="sc sc-hp">${m}</span>`;
      if (g.armor) return `<span class="sc sc-res">${m}</span>`;
      if (g.lvl) return `<b class="lvl">${m}</b>`;
      const t = /fizyczn/.test(m) ? 'phys' : /magiczn/.test(m) ? 'mag' : 'true';
      return `<span class="dt dt-${t}">${m}</span>`;
    });
  }

  function tipHtml(key) {
    const [type, code] = key.split(':');
    if (type === 'item') {
      const it = window.WR_ITEMS.items[code];
      const cls = it.cls ? `<div class="tcls">Tylko dla klas: ${it.cls.map((c) => ROLE_PL[c]).join(', ')}</div>` : '';
      return `<h5>${esc(it.name)}</h5><div class="tcost">${gold(it.cost)} złota</div>${cls}
        <ul>${it.stats.map((s) => `<li>${esc(s)}</li>`).join('')}</ul><p>${esc(it.desc)}</p>
        ${it.effect ? `<div class="eff"><b>Efekt:</b>\n${fmtVals(it.effect)}</div>` : ''}`;
    }
    if (type === 'boots') {
      const b = window.WR_ITEMS.boots[code];
      return `<h5>${esc(b.name)}</h5><div class="tcost">${gold(b.cost)} złota · ${esc(b.desc)}</div>
        <ul>${b.stats.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>
        ${b.effect ? `<div class="eff">${fmtVals(b.effect)}</div>` : ''}
        <div class="t3box"><b>Tier 3 (od 10:00): ${esc(b.t3.name)}</b> – ${gold(b.t3.cost)} złota łącznie
        <ul>${b.t3.stats.map((s) => `<li>${esc(s)}</li>`).join('')}</ul><p>${fmtVals(b.t3.effect)}</p></div>`;
    }
    const r = runeIndex()[code];
    const where = r.tree === 'Keystone' ? 'Keystone (runa główna)' : `${TREE_PL[r.tree]} · rząd ${r.row}`;
    return `<h5>${esc(r.name)}</h5><div class="tcost">${where}</div><p>${esc(r.desc)}</p>`;
  }

  /* Tooltip dla elementów z atrybutem data-tip="item:kod" | "boots:kod" | "rune:kod" */
  function initTooltips(root) {
    let tip = document.getElementById('tip');
    if (!tip) {
      tip = document.createElement('div');
      tip.id = 'tip'; tip.className = 'tip'; tip.setAttribute('role', 'tooltip');
      document.body.appendChild(tip);
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
    root.addEventListener('mouseover', (e) => { const el = e.target.closest('[data-tip]'); if (el && el !== current) show(el); });
    root.addEventListener('mouseout', (e) => { const el = e.target.closest('[data-tip]'); if (el && !el.contains(e.relatedTarget)) hide(); });
    root.addEventListener('focusin', (e) => { const el = e.target.closest('[data-tip]'); if (el) show(el); });
    root.addEventListener('focusout', hide);
    root.addEventListener('click', (e) => {
      const el = e.target.closest('[data-tip]');
      if (el) { if (current === el) hide(); else show(el); }
    });
    document.addEventListener('click', (e) => { if (!e.target.closest('[data-tip]')) hide(); });
    window.addEventListener('scroll', hide, { passive: true });
  }

  window.WR = { esc, fmtVals, ROLE_ORDER, ROLE_PL, TREE_PL, LANES, champImg, abilityImg, gold, runeIndex, tipHtml, initTooltips, PATCH: '7.3' };
})();
