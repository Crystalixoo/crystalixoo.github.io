/* Strona główna – siatka championów */
(function () {
  const { esc, ROLE_ORDER, ROLE_PL, champImg } = window.WR;
  const champs = (window.WR_CHAMPIONS || []).slice().sort((a, b) => a.name.localeCompare(b.name, 'pl'));
  const NEW = new Set(['hwei']);

  const grid = document.getElementById('grid');
  const q = document.getElementById('q');
  const rolesEl = document.getElementById('roles');
  const countEl = document.getElementById('count');

  let role = 'ALL';
  try {
    const saved = sessionStorage.getItem('wr-role');
    if (saved) role = saved;
  } catch (e) { /* brak dostępu do storage */ }

  const roles = [['ALL', 'Wszyscy'], ...ROLE_ORDER.map((r) => [r, ROLE_PL[r]])];
  rolesEl.innerHTML = roles
    .map(([k, v]) => `<button type="button" class="chip${k === role ? ' active' : ''}" data-role="${k}">${v}</button>`)
    .join('');

  const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '');

  function render() {
    const term = norm(q.value || '');
    const list = champs.filter((c) => (role === 'ALL' || c.roles.includes(role)) && (!term || norm(c.name).includes(term)));
    grid.innerHTML = list
      .map((c) => `<a class="champ-card" href="champion.html?c=${c.slug}" title="${esc(c.name)} – ${esc(c.title)}">
          <img src="${champImg(c.slug)}" alt="${esc(c.name)}" loading="lazy" width="285" height="323" />
          ${NEW.has(c.slug) ? '<span class="new">NOWY</span>' : ''}
          <span class="name">${esc(c.name)}</span>
        </a>`)
      .join('') || '<p class="empty">Brak championów pasujących do wyszukiwania.</p>';
    countEl.textContent = `${list.length} z ${champs.length} championów`;
  }

  rolesEl.addEventListener('click', (e) => {
    const b = e.target.closest('[data-role]');
    if (!b) return;
    role = b.dataset.role;
    try { sessionStorage.setItem('wr-role', role); } catch (err) { /* ignoruj */ }
    rolesEl.querySelectorAll('.chip').forEach((c) => c.classList.toggle('active', c === b));
    render();
  });
  q.addEventListener('input', render);
  render();
})();
