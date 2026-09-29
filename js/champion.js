/* Strona championa – informacje, buildy i przedmioty sytuacyjne */
(function () {
  const WR = window.WR;
  const { esc, fmtVals, ROLE_PL, TREE_PL, champImg, abilityImg, gold } = WR;
  const ITEMS = window.WR_ITEMS.items;
  const BOOTS = window.WR_ITEMS.boots;
  const app = document.getElementById('app');

  const slug = new URLSearchParams(location.search).get('c');
  const champ = (window.WR_CHAMPIONS || []).find((c) => c.slug === slug);
  const data = (window.WR_BUILDS || {})[slug];

  if (!champ) {
    app.innerHTML = '<a class="back" href="index.html">← Wszyscy championowie</a><p class="empty">Nie znaleziono championa.</p>';
    return;
  }
  document.title = `${champ.name} – buildy Wild Rift (patch 7.3)`;

  const RUNE_INDEX = WR.runeIndex();

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

  // ---------- analiza buildu ----------
  const STAT_SHORT = {
    'obrażeń od ataku': 'AD', 'mocy umiejętności': 'AP', 'zdrowia': 'Zdrowie', 'pancerza': 'Pancerz',
    'odporności na magię': 'Odporność na magię', 'prędkości ataku': 'Prędkość ataku', 'szansy na trafienie krytyczne': 'Szansa na kryt',
    'przyspieszenia umiejętności': 'Przyspieszenie umiejętności', 'prędkości ruchu': 'Prędkość ruchu', 'many': 'Mana',
    'siły leczenia i tarcz': 'Siła leczenia i tarcz', 'przebicia pancerza': 'Przebicie pancerza', 'przebicia odporności na magię': 'Przebicie magii',
    'nieustępliwości': 'Nieustępliwość', 'kradzieży życia': 'Kradzież życia', 'wampiryzmu fizycznego': 'Wampiryzm fizyczny',
    'regeneracji zdrowia': 'Regeneracja zdrowia', 'podstawowej regeneracji many': 'Regeneracja many',
  };
  const STAT_ORDER = ['AD', 'AP', 'Zdrowie', 'Pancerz', 'Odporność na magię', 'Prędkość ataku', 'Szansa na kryt', 'Przyspieszenie umiejętności'];
  function sumStats(list) {
    const acc = new Map();
    list.forEach((line) => {
      const m = /^\+?(\d+(?:[.,]\d+)?)(%?)\s+(.+)$/.exec(line.trim());
      if (!m) return;
      const label = STAT_SHORT[m[3]] || m[3];
      const key = label + m[2];
      const cur = acc.get(key) || { label, pct: m[2], v: 0 };
      cur.v += parseFloat(m[1].replace(',', '.'));
      acc.set(key, cur);
    });
    const rank = (x) => { const i = STAT_ORDER.indexOf(x.label); return i < 0 ? 99 : i; };
    return [...acc.values()].sort((a, b) => rank(a) - rank(b));
  }
  const statVal = (stats, label) => stats.filter((x) => x.label === label && !x.pct).reduce((s, x) => s + x.v, 0);

  // Cechy wynikające z przedmiotów: [klucz, mocna strona, przeciw czemu, kody przedmiotów]
  const TRAITS = [
    ['antiheal', 'Antyleczenie (Głębokie Rany)', 'wrogom, którzy dużo się leczą (Soraka, Aatrox, Vladimir, Dr. Mundo, Yuumi)', ['chem', 'mr', 'morello', 'thorn']],
    ['antitank', 'Przebicie i obrażenia zależne od zdrowia', 'tankom i postaciom z dużą ilością zdrowia, pancerza lub odporności na magię', ['bc', 'ldr', 'sery', 'mr', 'bork', 'term', 'kraken', 'sunderer', 'void', 'liandry', 'bloodletter', 'abyssal']],
    ['antishield', 'Osłabianie tarcz', 'drużynom z tarczami (Janna, Lulu, Karma, Sterak\'s, Immortal Shieldbow)', ['fang', 'ocean']],
    ['anticc', 'Ochrona przed kontrolą tłumu', 'składom z ogłuszeniami, tłumieniem i unieruchomieniami', ['qss', 'scimitar', 'banshee', 'eon', 'mikael']],
    ['antiburst', 'Przeżywalność przeciw burstowi', 'zabójcom i drużynom zadającym dużo obrażeń naraz', ['ga', 'zhonya', 'shieldbow', 'sterak', 'maw', 'dd', 'mantle', 'kaenic', 'garg', 'locket']],
    ['vsad', 'Obrona przed obrażeniami fizycznymi', 'strzelcom, zabójcom AD i bruiserom', ['fh', 'randuin', 'thorn']],
    ['vsap', 'Obrona przed obrażeniami magicznymi', 'magom i drużynom z dużą ilością obrażeń magicznych', ['fon', 'kaenic', 'maw', 'wits', 'banshee']],
    ['aoe', 'Obrażenia obszarowe', 'grupującym się wrogom i w teamfightach', ['titanic', 'runaan', 'shiv', 'luden', 'liandry', 'sunfire', 'hollow', 'gore', 'torch', 'malig', 'despair']],
    ['slow', 'Spowolnienia z przedmiotów', 'mobilnym, uciekającym celom', ['rylai', 'sery', 'bork', 'iceborn', 'stride', 'dmp', 'fh', 'zeke']],
    ['mobility', 'Dodatkowa mobilność', 'gdy trzeba dogonić cel lub szybko się przemieścić', ['belt', 'gale', 'stride', 'ghost', 'dmp', 'cosmic', 'surge', 'shurelya', 'storm', 'hexplate']],
    ['utility', 'Wzmocnienie drużyny', 'w walkach drużynowych, gdzie liczy się ochrona sojuszników', ['locket', 'zeke', 'virtue', 'shurelya', 'redemp', 'mikael', 'harmonic', 'censer', 'sfw', 'helia', 'abyssal', 'bloodletter', 'mandate', 'trap', 'vow', 'dawn']],
  ];
  const TRAIT = Object.fromEntries(TRAITS.map((t) => [t[0], t]));
  const itemLink = (c) => `<span class="ilink" tabindex="0" data-tip="item:${c}">${esc(ITEMS[c].name)}</span>`;
  const bootsLink = (c) => `<span class="ilink" tabindex="0" data-tip="boots:${c}">${esc(BOOTS[c].name)}</span>`;
  const runeLink = (c) => `<span class="ilink" tabindex="0" data-tip="rune:${c}">${esc(RUNE_INDEX[c].name)}</span>`;
  const list = (arr) => arr.length < 2 ? arr.join('') : `${arr.slice(0, -1).join(', ')} i ${arr[arr.length - 1]}`;

  function analysisHtml(b) {
    const stats = sumStats([...b.items.flatMap((c) => ITEMS[c].stats), ...BOOTS[b.boots].stats]);
    const has = {};
    TRAITS.forEach(([k, , , codes]) => { has[k] = b.items.filter((c) => codes.includes(c)); });
    const armor = statVal(stats, 'Pancerz'), mr = statVal(stats, 'Odporność na magię');
    const hpSum = statVal(stats, 'Zdrowie');
    if (b.boots === 'mercs') has.anticc = [...has.anticc, 'boots:mercs'];
    if (b.boots === 'steel') has.vsad = [...has.vsad, 'boots:steel'];
    if (b.boots === 'mercs') has.vsap = [...has.vsap, 'boots:mercs'];
    const link = (c) => (c.startsWith('boots:') ? bootsLink(c.slice(6)) : itemLink(c));
    const isTanky = /Tank|Wsparcie|Support/.test(b.lane) || ['support', 'tank'].some((x) => (b.name || '').toLowerCase().includes(x)) ||
      b.items.filter((c) => ['tank', 'supp'].includes(ITEMS[c].cat)).length >= 3;

    const strengths = TRAITS.filter(([k]) => has[k].length).map(([k, name, vs]) =>
      `<li><b>${name}</b> – ${list(has[k].map(link))}. Pomaga przeciw: ${vs}.</li>`);
    if (armor >= 60 && !has.vsad.length) strengths.push(`<li><b>Dużo pancerza</b> (+${armor}) – dobre przeciw strzelcom i zabójcom AD.</li>`);
    if (mr >= 60 && !has.vsap.length) strengths.push(`<li><b>Dużo odporności na magię</b> (+${mr}) – dobre przeciw magom.</li>`);

    // Słabe strony + zamienniki z listy sytuacyjnej championa
    const sit = (data.situational || []).filter((c) => !b.items.includes(c));
    const swap = (k) => {
      const alt = sit.filter((c) => TRAIT[k][3].includes(c));
      return alt.length ? ` Zamiennik z listy sytuacyjnej: ${list(alt.slice(0, 3).map(itemLink))}.` : '';
    };
    const weak = [];
    if (!has.antiheal.length) weak.push(`<li><b>Brak antyleczenia</b> – przeciw ${TRAIT.antiheal[2]} warto zamienić ostatni przedmiot.${swap('antiheal')}</li>`);
    if (!isTanky && !has.antitank.length) weak.push(`<li><b>Brak przebicia / obrażeń % zdrowia</b> – build słabnie przeciw składom z 2+ tankami.${swap('antitank')}</li>`);
    if (!has.anticc.length) weak.push(`<li><b>Brak ochrony przed kontrolą tłumu</b> – przeciw wielu ogłuszeniom rozważ Mercury's Treads lub przedmiot oczyszczający.${swap('anticc')}</li>`);
    if (!isTanky && !has.antiburst.length && armor + mr < 60) weak.push(`<li><b>Mała przeżywalność</b> – build jest „szklany”, wymaga dobrej pozycji za frontem.${swap('antiburst')}</li>`);
    if (isTanky && !has.vsap.length && mr < 40) weak.push(`<li><b>Mało odporności na magię</b> – przeciw magom zamień jeden przedmiot na obronny.${swap('vsap')}</li>`);
    if (isTanky && !has.vsad.length && armor < 40) weak.push(`<li><b>Mało pancerza</b> – przeciw strzelcom i zabójcom AD zamień jeden przedmiot.${swap('vsad')}</li>`);

    const t2 = b.items.slice(0, 2).reduce((s, c) => s + ITEMS[c].cost, 0) + BOOTS[b.boots].cost;
    const t3 = t2 + ITEMS[b.items[2]].cost;
    const statChips = stats.map((x) => `<span class="stat"><b>+${Math.round(x.v * 10) / 10}${x.pct}</b> ${esc(x.label)}</span>`).join('');
    const dmgType = (() => {
      const ad = statVal(stats, 'AD'), ap = statVal(stats, 'AP');
      if (ad && ap && Math.min(ad, ap) / Math.max(ad, ap) > 0.35) return 'hybrydowe (AD + AP)';
      if (ap > ad) return 'magiczne (AP)';
      if (ad) return 'fizyczne (AD)';
      return hpSum ? 'wytrzymałość i użyteczność' : 'użyteczność';
    })();

    const items = b.items.map((c) => `<li>${itemLink(c)} <small>${gold(ITEMS[c].cost)} zł.</small> – ${esc(ITEMS[c].desc)}</li>`).join('');
    const boots = `<li>${bootsLink(b.boots)} → ${esc(BOOTS[b.boots].t3.name)} (tier 3 od 10:00) – ${esc(BOOTS[b.boots].desc)}</li>`;
    const runes = [b.keystone, ...b.primary, b.secondary].map((r, k) => {
      const tag = k === 0 ? 'Keystone' : k <= 3 ? `${TREE_PL[b.tree]}` : `${TREE_PL[b.secTree]} (dodatkowa)`;
      return `<li><b>${runeLink(r)}</b> <small>${tag}</small> – ${esc(RUNE_INDEX[r].desc)}</li>`;
    }).join('');

    return `<details class="analysis">
      <summary>Analiza buildu – dlaczego ten zestaw i kiedy go wybrać</summary>
      <div class="an-body">
        <div class="an-grid">
          <section class="an-when"><h5>Kiedy się sprawdza</h5><p>${esc(b.when)}</p></section>
          <section class="an-avoid"><h5>Kiedy wybrać inny wariant</h5><p>${esc(b.avoid)}</p></section>
        </div>
        <section><h5>Profil po ukończeniu</h5>
          <p class="an-note">Główne obrażenia: <b>${dmgType}</b>. Pierwszy skok mocy po 2 przedmiotach + butach (<b>${gold(t2)}</b> zł.), kolejny po 3. przedmiocie (<b>${gold(t3)}</b> zł.).</p>
          <div class="stats-sum">${statChips}</div>
          <p class="an-note">Suma statystyk 5 przedmiotów i butów tier 2 (bez run i statystyk bohatera).</p></section>
        ${strengths.length ? `<section><h5>Mocne strony zestawu</h5><ul class="an-list good">${strengths.join('')}</ul></section>` : ''}
        ${weak.length ? `<section><h5>Na co uważać</h5><ul class="an-list warn">${weak.join('')}</ul></section>` : ''}
        <section><h5>Rola każdego przedmiotu (kolejność zakupu)</h5><ol class="an-list">${items}${boots}</ol></section>
        <section><h5>Dlaczego te runy</h5><ul class="an-list">${runes}</ul></section>
      </div></details>`;
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
      ${b.when ? analysisHtml(b) : ''}
    </article>`;
  }

  const abilitiesHtml = champ.abilities.map((a, i) => {
    const meta = [a.cd ? `<span>Odnowienie: <b>${esc(a.cd)}</b> s</span>` : '', a.cost ? `<span>Koszt: <b>${esc(a.cost)}</b></span>` : ''].join('');
    const body = a.vals
      ? `<p class="vals">${fmtVals(a.vals)}</p><details class="off"><summary>Opis ogólny</summary><p>${esc(a.desc)}</p></details>`
      : `<p>${esc(a.desc)}</p>`;
    return `<div class="ability">
      <img src="${abilityImg(champ.slug, i)}" alt="" width="48" height="48" loading="lazy" />
      <div><div class="slot">${SLOT_PL[a.slot] || esc(a.slot)}</div><h4>${esc(a.name)}</h4>
        ${meta ? `<div class="ab-meta">${meta}</div>` : ''}${body}</div>
    </div>`;
  }).join('');
  const legend = `<div class="legend">Wartości dla kolejnych poziomów umiejętności oddzielone „/”.
    Skalowanie: <span class="sc sc-ad">% AD</span> <span class="sc sc-ap">% AP</span> <span class="sc sc-hp">% zdrowia</span> <span class="sc sc-res">% pancerza / odp.</span>
    · Typ obrażeń: <span class="dt dt-phys">fizyczne</span> <span class="dt dt-mag">magiczne</span> <span class="dt dt-true">nieuchronne</span>.
    „dod.” = tylko dodatkowe (z przedmiotów i run).</div>`;

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
    ${legend}
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

  WR.initTooltips(app);
})();
