/* Strona bohatera – analiza + wygenerowane zestawy (klasyczne i URF), umiejętności */
(function () {
  const root = document.getElementById("champion-root");
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("id");
  const champ = CHAMPIONS.find((c) => c.slug === slug);

  if (!champ) {
    root.innerHTML =
      '<div class="empty-state"><h1>Nie znaleziono bohatera</h1>' +
      '<p><a class="back-link" href="index.html">← Wróć do listy bohaterów</a></p></div>';
    return;
  }

  document.title = `${champ.name} – Wild Rift Buildy`;
  const cls = CHAMP_CLASS[champ.slug] || "";
  const WRF = "https://wildriftfire.com/images";

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function img(url, alt) {
    return `<img class="ic-img" src="${url}" alt="${esc(alt)}" loading="lazy" onerror="this.style.visibility='hidden';">`;
  }

  /* ---- Czary przywoływacza ---- */
  function spellCard(s) {
    const info = SPELL_INFO[s.slug] || {};
    const tip = info.desc
      ? `<div class="item-tip"><strong>${esc(s.name)}</strong><span class="tip-passive">${esc(info.desc)}</span></div>`
      : "";
    return `<div class="kit-item">
      <span class="kit-ic">${img(`${WRF}/summoners/${s.slug}.png`, s.name)}</span>
      <span class="kit-name">${esc(s.name)}</span>${tip}</div>`;
  }

  /* ---- Runa (keystone lub poboczna) ---- */
  function runeChip(slug, isKey) {
    const info = RUNE_INFO[slug] || {};
    const name = info.name || slug;
    const tip = info.desc
      ? `<div class="item-tip"><strong>${esc(name)}</strong>
           <span class="tip-cat tip-rune">${isKey ? "Keystone" : "Runa"}</span>
           <span class="tip-passive">${esc(info.desc)}</span></div>`
      : "";
    return `<div class="kit-item${isKey ? " keystone" : ""}">
      <span class="kit-ic">${img(`${WRF}/runes/${slug}.png`, name)}</span>
      <span class="kit-name">${esc(name)}</span>${tip}</div>`;
  }

  /* ---- Przedmiot ---- */
  function itemPill(slug) {
    const info = ITEM_INFO[slug] || {};
    const name = info.name || slug;
    const cost = info.cost ? `<span class="tip-cost">${esc(info.cost)} złota</span>` : "";
    const stats = info.stats ? `<span class="tip-stats">${esc(info.stats)}</span>` : "";
    const pass = info.passive ? `<span class="tip-passive">${esc(info.passive)}</span>` : "";
    const tip = (info.cost || info.stats || info.passive)
      ? `<div class="item-tip"><strong>${esc(name)}</strong>${cost}${stats}${pass}</div>`
      : "";
    return `<div class="item-pill">
      <span class="item-ic">${img(`${WRF}/items/${slug}.png`, name)}</span>
      <span class="item-name">${esc(name)}</span>${tip}</div>`;
  }

  /* ---- Karta zestawu ---- */
  function setCard(set, idx, mode) {
    const runes = runeChip(set.keystone, true) + set.minors.map((s) => runeChip(s, false)).join("");
    const items = set.items.map(itemPill).join('<span class="arrow">›</span>');
    const badge = mode === "urf"
      ? `<span class="set-mode mode-urf">URF</span>`
      : "";
    return `<article class="set-card${mode === "urf" ? " set-urf" : ""}">
      <div class="set-head">
        <span class="set-badge">Zestaw ${idx}</span>
        <h3 class="set-title">${esc(set.title)}</h3>
        ${badge}
      </div>
      <p class="set-analysis">${esc(set.analysis)}</p>
      <div class="set-block"><div class="set-label">Runy (${1 + set.minors.length})</div><div class="kit-row">${runes}</div></div>
      <div class="set-block"><div class="set-label">Przedmioty</div><div class="build-row">${items}</div></div>
    </article>`;
  }

  /* ---- Umiejętności ---- */
  function abilities(arr) {
    return arr.map((a) => `
      <div class="ability">
        <span class="ability-ic">${img(a.icon, a.name)}</span>
        ${a.slot ? `<div class="ability-badge">${esc(a.slot)}</div>` : ""}
        <div class="ability-body">
          <h3 class="ability-name">${esc(a.name)}</h3>
          <p class="ability-desc">${esc(a.desc)}</p>
        </div>
      </div>`).join("");
  }

  const gen = generateBuilds(champ);
  const spellsHtml = champ.spells && champ.spells.length
    ? `<div class="kit-row">${champ.spells.map(spellCard).join("")}</div>` : '<p class="muted">Brak danych.</p>';

  root.innerHTML = `
    <div class="champ-hero">
      <div class="hero-icon" id="hero-icon">
        <img id="hero-img" src="${champ.icon}" alt="${esc(champ.name)}" />
      </div>
      <div class="hero-info">
        <h1 class="hero-name">${esc(champ.name)}</h1>
        <div class="hero-chips">
          ${cls ? `<span class="chip chip-role">${esc(cls)}</span>` : ""}
          ${champ.role ? `<span class="chip">${esc(champ.role)}</span>` : ""}
          <span class="chip chip-dmg">Archetyp: ${esc(gen.label)}</span>
        </div>
      </div>
    </div>

    <section class="panel">
      <h2 class="panel-title">Czary przywoływacza</h2>
      ${spellsHtml}
    </section>

    <section class="panel">
      <h2 class="panel-title">Zestawy klasyczne</h2>
      <p class="panel-sub">Jeden zestaw dopasowany do archetypu i umiejętności ${esc(champ.name)} — po 5 run i 6 przedmiotów. Najedź na ikonę po szczegóły.</p>
      <div class="sets">${gen.normal.map((s, i) => setCard(s, i + 1, "normal")).join("")}</div>
    </section>

    ${gen.urf && gen.urf.length ? `<section class="panel">
      <h2 class="panel-title">Zestawy URF <span class="urf-tag">∞ mana · zerowe cooldowny</span></h2>
      <p class="panel-sub">Trzy zestawy pod Ultra Rapid Fire: zero itemów na manę, maksymalny ability haste i pasywki wyzwalane ciągłym castowaniem.</p>
      <div class="sets">${gen.urf.map((s, i) => setCard(s, i + 1, "urf")).join("")}</div>
    </section>` : ""}

    <section class="panel">
      <h2 class="panel-title">Umiejętności</h2>
      <div class="abilities">${champ.abilities && champ.abilities.length ? abilities(champ.abilities) : '<p class="muted">Brak danych.</p>'}</div>
    </section>

    <div class="page-back"><a class="back-link" href="index.html">← Wróć do listy bohaterów</a></div>
  `;

  const heroImg = document.getElementById("hero-img");
  if (heroImg) attachIconFallback(heroImg, document.getElementById("hero-icon"), champ.slug, champ.name.charAt(0));
})();
