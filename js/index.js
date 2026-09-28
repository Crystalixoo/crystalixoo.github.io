/* Strona główna – siatka championów */
(function () {
  const { esc, ROLE_ORDER, ROLE_PL, LANES, champImg } = window.WR;
  const champs = (window.WR_CHAMPIONS || []).slice().sort((a, b) => a.name.localeCompare(b.name, 'pl'));
  const BUILDS = window.WR_BUILDS || {};
  const NEW = new Set(['hwei']);

  const grid = document.getElementById('grid');
  const q = document.getElementById('q');
  const rolesEl = document.getElementById('roles');
  const lanesEl = document.getElementById('lanes');
  const countEl = document.getElementById('count');

  const load = (k, def) => { try { return sessionStorage.getItem(k) || def; } catch (e) { return def; } };
  const save = (k, v) => { try { sessionStorage.setItem(k, v); } catch (e) { /* brak dostępu do storage */ } };
  let role = load('wr-role', 'ALL');
  let lane = load('wr-lane', 'ALL');

  const chips = (list, active, attr) => list
    .map(([k, v]) => `<button type="button" class="chip${k === active ? ' active' : ''}" data-${attr}="${k}" aria-pressed="${k === active}">${v}</button>`)
    .join('');
  rolesEl.innerHTML = chips([['ALL', 'Wszystkie role'], ...ROLE_ORDER.map((r) => [r, ROLE_PL[r]])], role, 'role');
  lanesEl.innerHTML = chips([['ALL', 'Wszystkie linie'], ...LANES.map((l) => [l, l])], lane, 'lane');

  const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '');

  function render() {
    const term = norm(q.value || '');
    const list = champs.filter((c) => (role === 'ALL' || c.roles.includes(role))
      && (lane === 'ALL' || (BUILDS[c.slug] && BUILDS[c.slug].lanes.includes(lane)))
      && (!term || norm(c.name).includes(term)));
    grid.innerHTML = list
      .map((c) => `<a class="champ-card" href="champion.html?c=${c.slug}" title="${esc(c.name)} – ${esc(c.title)}">
          <img src="${champImg(c.slug)}" alt="${esc(c.name)}" loading="lazy" width="285" height="323" />
          ${NEW.has(c.slug) ? '<span class="new">NOWY</span>' : ''}
          <span class="name">${esc(c.name)}</span>
        </a>`)
      .join('') || '<p class="empty">Brak championów pasujących do wyszukiwania.</p>';
    countEl.textContent = `${list.length} z ${champs.length} championów`;
  }

  function bind(el, attr, set) {
    el.addEventListener('click', (e) => {
      const b = e.target.closest(`[data-${attr}]`);
      if (!b) return;
      set(b.dataset[attr]);
      el.querySelectorAll('.chip').forEach((c) => { const on = c === b; c.classList.toggle('active', on); c.setAttribute('aria-pressed', on); });
      render();
    });
  }
  bind(rolesEl, 'role', (v) => { role = v; save('wr-role', v); });
  bind(lanesEl, 'lane', (v) => { lane = v; save('wr-lane', v); });
  q.addEventListener('input', render);
  render();
})();
