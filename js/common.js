/* Wspólne funkcje strony */
(function () {
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const ROLE_ORDER = ['FIGHTER', 'MAGE', 'MARKSMAN', 'ASSASSIN', 'TANK', 'SUPPORT'];
  const ROLE_PL = { FIGHTER: 'Wojownik', MAGE: 'Mag', MARKSMAN: 'Strzelec', ASSASSIN: 'Zabójca', TANK: 'Tank', SUPPORT: 'Wsparcie' };
  const TREE_PL = { Precision: 'Precyzja', Domination: 'Dominacja', Sorcery: 'Czarnoksięstwo', Resolve: 'Determinacja' };

  const champImg = (slug) => `img/champions/${slug}.webp`;
  const abilityImg = (slug, i) => `img/abilities/${slug}-${i}.webp`;

  window.WR = { esc, ROLE_ORDER, ROLE_PL, TREE_PL, champImg, abilityImg, PATCH: '7.3' };
})();
