/* ============================================================
   SILNIK BUILDÓW – Wild Rift patch 7.2
   Struktura run: 1 Keystone + Primary Path (Slot1/Slot2/Slot3) + Secondary (1 runa)
   Primary Path: Precision | Sorcery | Domination | Resolve
   Secondary Path: inna niż Primary, 1 dowolna runa
   Każdy archetyp: 2 zestawy klasyczne + 2 zestawy URF
   ============================================================

   Precision  Slot1: battle-zeal / brutal / triumph
              Slot2: cut-down / last-stand
              Slot3: legend-alacrity / legend-bloodline

   Sorcery    Slot1: botanist / absolute-focus / axiom-arcanist / manaflow-band / hextech-flashtraption
              Slot2: transcendence / celerity
              Slot3: gathering-storm / scorch

   Domination Slot1: cheap-shot / empowered-attack / sudden-impact
              Slot2: hubris
              Slot3: eyeball-collector / ingenious-hunter / zombie-ward

   Resolve    Slot1: font-of-life / demolish / courage-of-the-colossus
              Slot2: second-wind / bone-plating / unshakeable
              Slot3: overgrowth / revitalize / nimbus-cloak
   ============================================================ */

const ARCH_OVERRIDE = {
  "vayne":"ad_onhit_mm","kaisa":"ad_onhit_mm","kogmaw":"ad_onhit_mm",
  "varus":"ad_onhit_mm","twitch":"ad_onhit_mm","kindred":"ad_onhit_mm","kalista":"ad_onhit_mm",
  "kayle":"ap_onhit","teemo":"ap_onhit",
  "jhin":"ad_lethality","akshan":"ad_lethality","graves":"ad_lethality",
  "yasuo":"ad_crit","tryndamere":"ad_crit",
  "jax":"onhit_fighter","irelia":"onhit_fighter","camille":"onhit_fighter",
  "master-yi":"onhit_fighter","nilah":"onhit_fighter","viego":"onhit_fighter","fiora":"onhit_fighter",
  "gragas":"ap_fighter","rumble":"ap_fighter","mordekaiser":"ap_fighter",
  "vladimir":"ap_fighter","swain":"ap_fighter","singed":"ap_fighter","lillia":"ap_fighter",
  "akali":"ap_assassin","diana":"ap_assassin","ekko":"ap_assassin","fizz":"ap_assassin",
  "katarina":"ap_assassin","kassadin":"ap_assassin","evelynn":"ap_assassin","nidalee":"ap_assassin",
  "leona":"support_engage","nautilus":"support_engage","alistar":"support_engage",
  "braum":"support_engage","rell":"support_engage","blitzcrank":"support_engage",
  "thresh":"support_engage","bard":"support_engage","rakan":"support_engage","maokai":"support_engage",
  "yuumi":"enchanter","sona":"enchanter","soraka":"enchanter","janna":"enchanter",
  "lulu":"enchanter","nami":"enchanter","milio":"enchanter","karma":"enchanter",
  "seraphine":"enchanter","zilean":"enchanter"
};

function archetypeOf(champ) {
  if (ARCH_OVERRIDE[champ.slug]) return ARCH_OVERRIDE[champ.slug];
  const cls = CHAMP_CLASS[champ.slug] || "";
  const txt = (champ.abilities || []).map((a) => a.desc || "").join(" ").toLowerCase();
  const ap = (txt.match(/ability power|magic damage/g) || []).length;
  const ad = (txt.match(/attack damage|physical damage/g) || []).length;
  const heal = /(heal|shield)/.test(txt);
  switch (cls) {
    case "Mag": return "ap_mage";
    case "Zabójca": return ap > ad ? "ap_assassin" : "ad_lethality";
    case "Strzelec": return "ad_crit";
    case "Wojownik": return ap > ad * 1.3 ? "ap_fighter" : "ad_bruiser";
    case "Tank": return "tank";
    case "Wsparcie": return heal ? "enchanter" : "support_engage";
    default: return "ad_bruiser";
  }
}

const ARCH = {
  ap_mage: {
    label: "Mag (AP)",
    normal: [
      {
        title: "Burst AP 7.2",
        keystone: "electrocute",
        primaryPath: "Domination",
        minors: ["sudden-impact", "hubris", "eyeball-collector"],
        secondaryPath: "Sorcery",
        secondary: "transcendence",
        items: ["ludens-echo", "rabadons-deathcap", "infinity-orb", "horizon-focus", "rylais-crystal-scepter", "ionian-boots-of-lucidity"],
        analysis: "W patchu 7.2 {N} najlepiej gra przez szybki burst i kontrolę mapy. Electrocute i Sudden Impact dają mocny pierwszy kontakt, a Transcendence i Horizon Focus pozwalają szybko wracać do kolejnych skilli."
      },
      {
        title: "Poke i sustain",
        keystone: "phase-rush",
        primaryPath: "Sorcery",
        minors: ["manaflow-band", "transcendence", "gathering-storm"],
        secondaryPath: "Resolve",
        secondary: "second-wind",
        items: ["liandrys-torment", "riftmaker", "rylais-crystal-scepter", "rabadons-deathcap", "crown-of-the-shattered-queen", "ionian-boots-of-lucidity"],
        analysis: "Jeśli {N} ma grać przez dłuższe wymiany i poke, Phase Rush daje mu świetny ruch po każdej wymianie. Manaflow Band, Gathering Storm i Second Wind utrzymują sustain i skalowanie w całej grze."
      }
    ],
    urf: [
      {
        title: "URF: burst co sekundę",
        keystone: "first-strike",
        primaryPath: "Sorcery",
        minors: ["absolute-focus", "transcendence", "scorch"],
        secondaryPath: "Domination",
        secondary: "eyeball-collector",
        items: ["malignance", "ludens-echo", "cosmic-drive", "rabadons-deathcap", "infinity-orb", "ionian-boots-of-lucidity"],
        analysis: "W URF {N} robi największą różnicę przy nieustannym spamie skilli. Absolute Focus i Scorch dają ogromny AP w pełnym HP, a First Strike i Eyeball Collector podtrzymują tempo z każdej walki."
      },
      {
        title: "URF: DoT i lawina obrażeń",
        keystone: "dark-harvest",
        primaryPath: "Domination",
        minors: ["cheap-shot", "hubris", "eyeball-collector"],
        secondaryPath: "Sorcery",
        secondary: "gathering-storm",
        items: ["liandrys-torment", "riftmaker", "cosmic-drive", "malignance", "rabadons-deathcap", "ionian-boots-of-lucidity"],
        analysis: "Dark Harvest świetnie działa w URF, gdy {N} ma stale zbierać stacki. Liandry's i Riftmaker tworzą mocny DoT, a Gathering Storm sprawia, że late game jest jeszcze groźniejszy."
      }
    ]
  },

  ap_assassin: {
    label: "Zabójca AP",
    normal: [
      {
        title: "Burst assassin 7.2",
        keystone: "electrocute",
        primaryPath: "Domination",
        minors: ["sudden-impact", "hubris", "eyeball-collector"],
        secondaryPath: "Sorcery",
        secondary: "transcendence",
        items: ["ludens-echo", "infinity-orb", "lich-bane", "rabadons-deathcap", "rylais-crystal-scepter", "ionian-boots-of-lucidity"],
        analysis: "{N} najlepiej działa przy agresywnym wejściu i szybkiej sekwencji skilli. Electrocute i Sudden Impact dają błyskawiczny burst, a Lich Bane i Infinity Orb kończą walkę po udanym wejściu."
      },
      {
        title: "Snowball i przewaga w walce",
        keystone: "dark-harvest",
        primaryPath: "Domination",
        minors: ["cheap-shot", "hubris", "eyeball-collector"],
        secondaryPath: "Resolve",
        secondary: "bone-plating",
        items: ["ludens-echo", "crown-of-the-shattered-queen", "infinity-orb", "rabadons-deathcap", "rylais-crystal-scepter", "ionian-boots-of-lucidity"],
        analysis: "Jeśli {N} ma grać agresywnie od pierwszych minut, Dark Harvest daje mu świetny snowball. Cheap Shot i Hubris pomagają zamykać pojedynki, a Bone Plating daje dodatkowe bezpieczeństwo przy pierwszym wejściu."
      }
    ],
    urf: [
      {
        title: "URF: resety co kilka sekund",
        keystone: "electrocute",
        primaryPath: "Domination",
        minors: ["sudden-impact", "hubris", "eyeball-collector"],
        secondaryPath: "Precision",
        secondary: "triumph",
        items: ["malignance", "ludens-echo", "lich-bane", "rabadons-deathcap", "infinity-orb", "ionian-boots-of-lucidity"],
        analysis: "W URF {N} nie potrzebuje długiego setupu. Electrocute i Sudden Impact dają ogromne bursty prawie bez przerwy, a Triumph pozwala szybko wracać po każdym zabójstwie."
      },
      {
        title: "URF: kolekcjoner stacków",
        keystone: "dark-harvest",
        primaryPath: "Domination",
        minors: ["sudden-impact", "hubris", "zombie-ward"],
        secondaryPath: "Sorcery",
        secondary: "transcendence",
        items: ["malignance", "ludens-echo", "cosmic-drive", "rabadons-deathcap", "lich-bane", "ionian-boots-of-lucidity"],
        analysis: "Dark Harvest w URF staje się źródłem szybkich resetów i stacków. Zombie Ward i Hubris podtrzymują jego tempo, a Cosmic Drive daje mobilność przy kolejnych wejściach."
      }
    ]
  },

  ap_fighter: {
    label: "Battlemage (AP wojownik)",
    normal: [
      {
        title: "Battlemage 7.2",
        keystone: "conqueror",
        primaryPath: "Precision",
        minors: ["triumph", "last-stand", "legend-bloodline"],
        secondaryPath: "Resolve",
        secondary: "second-wind",
        items: ["riftmaker", "liandrys-torment", "rylais-crystal-scepter", "rabadons-deathcap", "goredrinker", "ionian-boots-of-lucidity"],
        analysis: "Conqueror jest świetny dla {N}, który ma wejść w walkę i wygrać ją dzięki długiemu sustainowi. Triumph i Legend Bloodline dają mu życie w teamfightie, a Liandry's i Goredrinker pomagają utrzymać presję."
      },
      {
        title: "Tanky AP",
        keystone: "grasp-of-the-undying",
        primaryPath: "Resolve",
        minors: ["font-of-life", "second-wind", "overgrowth"],
        secondaryPath: "Precision",
        secondary: "triumph",
        items: ["riftmaker", "rod-of-ages", "abyssal-mask", "rylais-crystal-scepter", "force-of-nature", "ionian-boots-of-lucidity"],
        analysis: "Jeśli {N} ma być twardszy na początku i w środkowej fazie gry, Grasp i Resolve dają stabilny sustain. Abyssal Mask i Riftmaker wzmacniają jego moc w zwarciu i w walce z innymi magami."
      }
    ],
    urf: [
      {
        title: "URF: Conqueror bez końca",
        keystone: "conqueror",
        primaryPath: "Precision",
        minors: ["triumph", "last-stand", "legend-bloodline"],
        secondaryPath: "Sorcery",
        secondary: "transcendence",
        items: ["riftmaker", "liandrys-torment", "cosmic-drive", "rabadons-deathcap", "force-of-nature", "ionian-boots-of-lucidity"],
        analysis: "W URF Conqueror działa jak permanentny buff na cały fight. Triumph, Transcendence i Cosmic Drive podtrzymują tempo, a Liandry's i Riftmaker robią z {N} potężną maszynę do walki."
      },
      {
        title: "URF: burst w walce",
        keystone: "dark-harvest",
        primaryPath: "Domination",
        minors: ["cheap-shot", "hubris", "eyeball-collector"],
        secondaryPath: "Sorcery",
        secondary: "gathering-storm",
        items: ["malignance", "liandrys-torment", "riftmaker", "rabadons-deathcap", "force-of-nature", "ionian-boots-of-lucidity"],
        analysis: "Dark Harvest daje {N} świetny burst przy ciągłym spamie skilli. Malignance i Liandry's zamieniają jego walkę w lawinę obrażeń, a Gathering Storm podnosi moc w późnej fazie."
      }
    ]
  },

  ap_onhit: {
    label: "Hybryda on-hit AP",
    normal: [
      {
        title: "On-hit AP 7.2",
        keystone: "lethal-tempo",
        primaryPath: "Precision",
        minors: ["triumph", "last-stand", "legend-alacrity"],
        secondaryPath: "Sorcery",
        secondary: "transcendence",
        items: ["nashors-tooth", "lich-bane", "rabadons-deathcap", "riftmaker", "rylais-crystal-scepter", "berserkers-greaves"],
        analysis: "Jeśli {N} ma grać przez ataki i skille jednocześnie, Lethal Tempo i Legend Alacrity dają świetny DPS. Nashor's Tooth i Lich Bane zamieniają każdy cykl atak-skill w mocne obrażenia magiczne."
      },
      {
        title: "Burst hybryda",
        keystone: "electrocute",
        primaryPath: "Domination",
        minors: ["cheap-shot", "hubris", "eyeball-collector"],
        secondaryPath: "Precision",
        secondary: "legend-alacrity",
        items: ["nashors-tooth", "lich-bane", "infinity-orb", "rabadons-deathcap", "horizon-focus", "ionian-boots-of-lucidity"],
        analysis: "Ten wariant jest najlepszy, gdy {N} ma wejść w konflikt od razu i szybko wykończyć cel. Electrocute i Cheap Shot pomagają na wejściu, a Lich Bane i Horizon Focus kończą wymianę."
      }
    ],
    urf: [
      {
        title: "URF: on-hit bez przerwy",
        keystone: "lethal-tempo",
        primaryPath: "Precision",
        minors: ["triumph", "cut-down", "legend-alacrity"],
        secondaryPath: "Sorcery",
        secondary: "transcendence",
        items: ["nashors-tooth", "lich-bane", "riftmaker", "rabadons-deathcap", "cosmic-drive", "berserkers-greaves"],
        analysis: "W URF {N} może po prostu spamować ataki i skille bez większego planowania. Lethal Tempo i Transcendence trzymają tempo na maksymalnym poziomie, a Lich Bane robi resztę."
      },
      {
        title: "URF: burst na pełnym tempie",
        keystone: "electrocute",
        primaryPath: "Domination",
        minors: ["sudden-impact", "hubris", "eyeball-collector"],
        secondaryPath: "Sorcery",
        secondary: "gathering-storm",
        items: ["nashors-tooth", "lich-bane", "malignance", "rabadons-deathcap", "infinity-orb", "ionian-boots-of-lucidity"],
        analysis: "Ten build dobrze działa, gdy {N} ma grać agresywnie przez cały fight. Electrocute i Malignance dają ogromny burst, a Gathering Storm pozwala mu rosnąć po każdej następnej wymianie."
      }
    ]
  },

  ad_crit: {
    label: "Strzelec (crit)",
    normal: [
      {
        title: "Crit ADC 7.2",
        keystone: "lethal-tempo",
        primaryPath: "Precision",
        minors: ["triumph", "cut-down", "legend-alacrity"],
        secondaryPath: "Domination",
        secondary: "eyeball-collector",
        items: ["infinity-edge", "phantom-dancer", "bloodthirster", "runaans-hurricane", "lord-dominiks-regard", "berserkers-greaves"],
        analysis: "Dla {N} opierającego się na critach i szybkim DPS najlepszy jest klasyczny build Precyzji. Lethal Tempo i Legend Alacrity pozwalają utrzymać stałe tempo ataków, a Infinity Edge i Phantom Dancer dają ogromną moc krytyczną."
      },
      {
        title: "Crit z przeżywalnością",
        keystone: "fleet-footwork",
        primaryPath: "Precision",
        minors: ["battle-zeal", "last-stand", "legend-bloodline"],
        secondaryPath: "Resolve",
        secondary: "bone-plating",
        items: ["infinity-edge", "phantom-dancer", "bloodthirster", "guardian-angel", "mortal-reminder", "berserkers-greaves"],
        analysis: "Jeśli {N} ma być bardziej bezpieczny przy walce z assassynami i dive'ami, Fleet Footwork i Guardian Angel dają świetny sustain i drugie życie. Bone Plating i Mortal Reminder pomagają wytrzymać pierwsze trafienia."
      }
    ],
    urf: [
      {
        title: "URF: crit na pełnym tempie",
        keystone: "lethal-tempo",
        primaryPath: "Precision",
        minors: ["triumph", "last-stand", "legend-alacrity"],
        secondaryPath: "Sorcery",
        secondary: "transcendence",
        items: ["infinity-edge", "navori-quickblades", "phantom-dancer", "bloodthirster", "lord-dominiks-regard", "berserkers-greaves"],
        analysis: "W URF Navori i Lethal Tempo sprawiają, że {N} ma praktycznie niekończące się tempo ataków. Triumph i Transcendence daje dodatkowy sustain, a Infinity Edge jest kluczowe do przejmowania walk."
      },
      {
        title: "URF: First Strike burst",
        keystone: "first-strike",
        primaryPath: "Domination",
        minors: ["sudden-impact", "hubris", "eyeball-collector"],
        secondaryPath: "Precision",
        secondary: "triumph",
        items: ["the-collector", "infinity-edge", "navori-quickblades", "youmuus-ghostblade", "lord-dominiks-regard", "ionian-boots-of-lucidity"],
        analysis: "First Strike plus burst z The Collector i Youmuu's Ghostblade pozwalają {N} szybko przejmować inicjatywę. W URF każdy pierwszy kontakt jest bardzo mocny, a Triumph daje powrót do walki po każdym fragu."
      }
    ]
  },

  ad_onhit_mm: {
    label: "Strzelec (on-hit)",
    normal: [
      {
        title: "On-hit DPS 7.2",
        keystone: "lethal-tempo",
        primaryPath: "Precision",
        minors: ["brutal", "last-stand", "legend-alacrity"],
        secondaryPath: "Domination",
        secondary: "eyeball-collector",
        items: ["blade-of-the-ruined-king", "kraken-slayer", "guinsoos-rageblade", "runaans-hurricane", "terminus", "berserkers-greaves"],
        analysis: "Dla {N} opierającego się na on-hitach i atakach w ruchu najlepiej sprawdza się klasyczny build z Lethal Tempo. Brutal i Legend Alacrity pomagają budować stały DPS, a BotRK i Kraken Slayer robią resztę."
      },
      {
        title: "On-hit z przewagą żywotności",
        keystone: "fleet-footwork",
        primaryPath: "Precision",
        minors: ["battle-zeal", "last-stand", "legend-bloodline"],
        secondaryPath: "Resolve",
        secondary: "second-wind",
        items: ["blade-of-the-ruined-king", "kraken-slayer", "infinity-edge", "runaans-hurricane", "mortal-reminder", "berserkers-greaves"],
        analysis: "Ten build jest najlepszy, gdy {N} ma grać agresywnie, ale nie zamykać się na pierwszy kontakt. Fleet Footwork i Second Wind dają mu lepszy sustain, a Infinity Edge i Kraken podwajają efekty on-hit."
      }
    ],
    urf: [
      {
        title: "URF: on-hit lawina",
        keystone: "lethal-tempo",
        primaryPath: "Precision",
        minors: ["triumph", "cut-down", "legend-alacrity"],
        secondaryPath: "Sorcery",
        secondary: "transcendence",
        items: ["blade-of-the-ruined-king", "kraken-slayer", "guinsoos-rageblade", "runaans-hurricane", "terminus", "berserkers-greaves"],
        analysis: "W URF każde uderzenie {N} jest już prawie końcem walki. Lethal Tempo i Guinsoo's dają nieprawdopodobne tempo, a Terminus i Kraken Slayer robią z niego ścianę obrażeń."
      },
      {
        title: "URF: Navori on-hit",
        keystone: "conqueror",
        primaryPath: "Precision",
        minors: ["triumph", "cut-down", "legend-alacrity"],
        secondaryPath: "Sorcery",
        secondary: "transcendence",
        items: ["guinsoos-rageblade", "nashors-tooth", "blade-of-the-ruined-king", "navori-quickblades", "terminus", "berserkers-greaves"],
        analysis: "Conqueror i Navori świetnie sprawdzają się przy długiej walce, bo {N} nie przestaje atakować i stale buduje przewagę. Transcendence i Triumph podtrzymują jego tempo przez cały fight."
      }
    ]
  },

  ad_lethality: {
    label: "Zabójca AD (lethality)",
    normal: [
      {
        title: "Lethality assassin 7.2",
        keystone: "electrocute",
        primaryPath: "Domination",
        minors: ["sudden-impact", "hubris", "eyeball-collector"],
        secondaryPath: "Sorcery",
        secondary: "transcendence",
        items: ["youmuus-ghostblade", "duskblade-of-draktharr", "the-collector", "seryldas-grudge", "edge-of-night", "ionian-boots-of-lucidity"],
        analysis: "{N} grający na lethality najlepiej działa przez szybkie wejścia i mocne bursty. Sudden Impact i Electrocute dają czysty przebicie pancerza, a Youmuu's i Duskblade pozwalają wejść w cel bezpośrednio po inicjacji."
      },
      {
        title: "Snowball i szybkie zabójstwa",
        keystone: "dark-harvest",
        primaryPath: "Domination",
        minors: ["cheap-shot", "hubris", "eyeball-collector"],
        secondaryPath: "Precision",
        secondary: "triumph",
        items: ["youmuus-ghostblade", "eclipse", "the-collector", "seryldas-grudge", "edge-of-night", "ionian-boots-of-lucidity"],
        analysis: "Dark Harvest dobrze wspiera {N} przy agresywnej grze od pierwszych minut. Cheap Shot i Eclipse dają dodatkową siłę przy pierwszym wejściu, a Triumph pomaga wracać do kolejnych walk po każdym fragie."
      }
    ],
    urf: [
      {
        title: "URF: reset egzekucji",
        keystone: "electrocute",
        primaryPath: "Domination",
        minors: ["sudden-impact", "hubris", "eyeball-collector"],
        secondaryPath: "Precision",
        secondary: "triumph",
        items: ["eclipse", "youmuus-ghostblade", "the-collector", "serpents-fang", "seryldas-grudge", "ionian-boots-of-lucidity"],
        analysis: "W URF {N} ma idealne warunki do ciągłego wejścia na przeciwników i zabijania ich zanim zdążą się obronić. Electrocute i Triumph dają lekkie resety, a Serpent's Fang łamie tarcze i pancerz."
      },
      {
        title: "URF: First Strike spam",
        keystone: "first-strike",
        primaryPath: "Domination",
        minors: ["sudden-impact", "hubris", "zombie-ward"],
        secondaryPath: "Precision",
        secondary: "triumph",
        items: ["eclipse", "youmuus-ghostblade", "the-collector", "serpents-fang", "seryldas-grudge", "ionian-boots-of-lucidity"],
        analysis: "First Strike świetnie wspiera {N} przy każdej pierwszej wymianie. Działa to jeszcze lepiej w URF, bo tempo walki jest bardzo wysokie, a Triumph pozwala utrzymać przewagę po każdym zabójstwie."
      }
    ]
  },

  ad_bruiser: {
    label: "Wojownik (AD bruiser)",
    normal: [
      {
        title: "AD bruiser 7.2",
        keystone: "conqueror",
        primaryPath: "Precision",
        minors: ["triumph", "last-stand", "legend-alacrity"],
        secondaryPath: "Resolve",
        secondary: "bone-plating",
        items: ["trinity-force", "black-cleaver", "deaths-dance", "steraks-gage", "goredrinker", "plated-steelcaps"],
        analysis: "Conqueror i Precyzja dobrze wspierają {N}, który wchodzi w zwarcie i walczy długo. Black Cleaver i Death's Dance pozwalają mu łatwo przejść przez pancerz, a Goredrinker zwiększa sustain i moc w walce."
      },
      {
        title: "Tank-bruiser",
        keystone: "grasp-of-the-undying",
        primaryPath: "Resolve",
        minors: ["demolish", "second-wind", "overgrowth"],
        secondaryPath: "Precision",
        secondary: "triumph",
        items: ["trinity-force", "sunfire-aegis", "deaths-dance", "steraks-gage", "force-of-nature", "plated-steelcaps"],
        analysis: "Jeśli {N} ma być twardy w walce i nadal zadawać dużo obrażeń, Grasp i Resolve dają świetny balans między HP a dmg. Sunfire Aegis i Sterak's Gage czują się bardzo naturalnie w takich buildach."
      }
    ],
    urf: [
      {
        title: "URF: Conqueror i spam skilli",
        keystone: "conqueror",
        primaryPath: "Precision",
        minors: ["triumph", "last-stand", "legend-alacrity"],
        secondaryPath: "Sorcery",
        secondary: "transcendence",
        items: ["stridebreaker", "spear-of-shojin", "black-cleaver", "steraks-gage", "deaths-dance", "plated-steelcaps"],
        analysis: "W URF {N} ma świetne warunki do szybkiego wchodzenia w walki i utrzymywania przewagi. Conqueror i Spear of Shojin dają mu stale rosnący dmg i ogromną mobilność, a Stridebreaker pomaga zamykać cele."
      },
      {
        title: "URF: burst fighter",
        keystone: "first-strike",
        primaryPath: "Domination",
        minors: ["sudden-impact", "hubris", "eyeball-collector"],
        secondaryPath: "Precision",
        secondary: "triumph",
        items: ["eclipse", "black-cleaver", "youmuus-ghostblade", "spear-of-shojin", "steraks-gage", "ionian-boots-of-lucidity"],
        analysis: "First Strike i Eclipse dobrze wspierają agresywne wejścia {N}. W URF first contact daje mocny burst, a Spear of Shojin i Triumph pozwalają szybko kontynuować walkę."
      }
    ]
  },

  onhit_fighter: {
    label: "Wojownik on-hit (duelant)",
    normal: [
      {
        title: "On-hit bruiser 7.2",
        keystone: "conqueror",
        primaryPath: "Precision",
        minors: ["triumph", "last-stand", "legend-alacrity"],
        secondaryPath: "Domination",
        secondary: "eyeball-collector",
        items: ["blade-of-the-ruined-king", "trinity-force", "guinsoos-rageblade", "deaths-dance", "steraks-gage", "plated-steelcaps"],
        analysis: "{N} grający przez on-hit i walkę w zwarciu najlepiej zyskuje z Conquerora i Precyzji. Triumph daje sustain po fragach, a Guinsoo's i Trinity Force zamieniają każdy kontakt w serię obrażeń."
      },
      {
        title: "On-hit DPS",
        keystone: "lethal-tempo",
        primaryPath: "Precision",
        minors: ["brutal", "last-stand", "legend-alacrity"],
        secondaryPath: "Resolve",
        secondary: "second-wind",
        items: ["blade-of-the-ruined-king", "kraken-slayer", "guinsoos-rageblade", "terminus", "steraks-gage", "berserkers-greaves"],
        analysis: "Lethal Tempo i Brutal dobrze pasują do {N}, który ma walczyć szybko i stale. Kraken Slayer i Terminus pomagają mu utrzymać przewagę w długiej wymianie i w teamfightie."
      }
    ],
    urf: [
      {
        title: "URF: on-hit Trinity spam",
        keystone: "lethal-tempo",
        primaryPath: "Precision",
        minors: ["triumph", "last-stand", "legend-alacrity"],
        secondaryPath: "Sorcery",
        secondary: "transcendence",
        items: ["blade-of-the-ruined-king", "trinity-force", "guinsoos-rageblade", "kraken-slayer", "deaths-dance", "berserkers-greaves"],
        analysis: "W URF {N} może po prostu wchodzić w walkę i spamować wszystkie swoje zdolności. Trinity Force i Guinsoo's robią z niego bardzo mocny on-hit machine, a Triumph daje mu utrzymanie presji."
      },
      {
        title: "URF: Conqueror duelant",
        keystone: "conqueror",
        primaryPath: "Precision",
        minors: ["triumph", "cut-down", "legend-alacrity"],
        secondaryPath: "Sorcery",
        secondary: "transcendence",
        items: ["trinity-force", "spear-of-shojin", "guinsoos-rageblade", "steraks-gage", "deaths-dance", "ionian-boots-of-lucidity"],
        analysis: "Conqueror i Spear of Shojin sprawiają, że {N} przez długi czas nie traci tempa. W URF ten wariant daje ogromną przewagę przy każdym dłuższym starciu."
      }
    ]
  },

  tank: {
    label: "Tank",
    normal: [
      {
        title: "Tank inicjacja 7.2",
        keystone: "grasp-of-the-undying",
        primaryPath: "Resolve",
        minors: ["font-of-life", "bone-plating", "overgrowth"],
        secondaryPath: "Precision",
        secondary: "triumph",
        items: ["sunfire-aegis", "thornmail", "force-of-nature", "warmogs-armor", "kaenic-rookern", "plated-steelcaps"],
        analysis: "{N} jako tank powinien budować przewagę przez liczne wejścia w zwarcie. Grasp i Overgrowth dają mu ogromne HP, a Font of Life i Triumph pomagają drużynie w teamfightie."
      },
      {
        title: "Tank z mocnym CC",
        keystone: "ice-overlord",
        primaryPath: "Resolve",
        minors: ["courage-of-the-colossus", "bone-plating", "overgrowth"],
        secondaryPath: "Domination",
        secondary: "cheap-shot",
        items: ["sunfire-aegis", "iceborn-gauntlet", "hollow-radiance", "thornmail", "force-of-nature", "plated-steelcaps"],
        analysis: "Dla {N}, który ma przerzucać walkę przez CC i spowolnienia, Ice Overlord i Iceborn Gauntlet są bardzo mocne. Courage of the Colossus i Bone Plating wspierają wejście i przetrwanie po pierwszym kontakcie."
      }
    ],
    urf: [
      {
        title: "URF: lodowy front",
        keystone: "ice-overlord",
        primaryPath: "Resolve",
        minors: ["courage-of-the-colossus", "unshakeable", "overgrowth"],
        secondaryPath: "Sorcery",
        secondary: "transcendence",
        items: ["iceborn-gauntlet", "frozen-heart", "sunfire-aegis", "hollow-radiance", "force-of-nature", "ionian-boots-of-lucidity"],
        analysis: "W URF {N} potrafi zamienić całą linię w pole zatorów dzięki Ice Overlord i Iceborn Gauntlet. Frozen Heart i Hollow Radiance dają jeszcze większą kontrolę nad walką i obroną."
      },
      {
        title: "URF: Grasp i trwałość",
        keystone: "grasp-of-the-undying",
        primaryPath: "Resolve",
        minors: ["demolish", "bone-plating", "overgrowth"],
        secondaryPath: "Sorcery",
        secondary: "transcendence",
        items: ["iceborn-gauntlet", "sunfire-aegis", "abyssal-mask", "hollow-radiance", "force-of-nature", "ionian-boots-of-lucidity"],
        analysis: "Dla {N}, który ma wytrzymać wiele kontaktów, Grasp i Resolve dają bardzo stabilny sustain. Abyssal Mask i Hollow Radiance zamieniają jego trwałość w realne obrażenia dla całej drużyny."
      }
    ]
  },

  enchanter: {
    label: "Wsparcie (wzmacniacz)",
    normal: [
      {
        title: "Enchanter klasyczny 7.2",
        keystone: "aery",
        primaryPath: "Sorcery",
        minors: ["manaflow-band", "transcendence", "gathering-storm"],
        secondaryPath: "Resolve",
        secondary: "revitalize",
        items: ["staff-of-flowing-water", "ardent-censer", "harmonic-echo", "redemption", "locket", "ionian-boots-of-lucidity"],
        analysis: "Dla {N} wspierającego carry i utrzymującego tempo walki Aery i Sorcery są idealne. Staff of Flowing Water, Ardent Censer i Harmonic Echo dają sojusznikom dodatkową moc i sustain w każdej wymianie."
      },
      {
        title: "Guardian i ochrona",
        keystone: "guardian",
        primaryPath: "Resolve",
        minors: ["font-of-life", "second-wind", "revitalize"],
        secondaryPath: "Sorcery",
        secondary: "transcendence",
        items: ["staff-of-flowing-water", "ardent-censer", "harmonic-echo", "redemption", "cosmic-drive", "ionian-boots-of-lucidity"],
        analysis: "{N} z Guardianem ma bardzo silną rolę obrończą. Font of Life i Revitalize wspierają leczenie i tarcze, a Transcendence daje dodatkowe tempo po każdym rzucie umiejętności."
      }
    ],
    urf: [
      {
        title: "URF: tarcze bez końca",
        keystone: "aery",
        primaryPath: "Sorcery",
        minors: ["axiom-arcanist", "transcendence", "gathering-storm"],
        secondaryPath: "Resolve",
        secondary: "revitalize",
        items: ["staff-of-flowing-water", "ardent-censer", "harmonic-echo", "cosmic-drive", "redemption", "ionian-boots-of-lucidity"],
        analysis: "W URF {N} jest w stanie bez przerwy wspierać drużynę tarczami i healem. Aery i Axiom Arcanist dają świetną wartość przy każdej aktywności, a Cosmic Drive dodaje mobilność."
      },
      {
        title: "URF: burst support",
        keystone: "aery",
        primaryPath: "Sorcery",
        minors: ["absolute-focus", "celerity", "scorch"],
        secondaryPath: "Precision",
        secondary: "triumph",
        items: ["ludens-echo", "malignance", "staff-of-flowing-water", "cosmic-drive", "rabadons-deathcap", "ionian-boots-of-lucidity"],
        analysis: "Jeśli {N} ma grać bardziej ofensywnie, ten build pozwala mu dać drużynie ogromny burst i nadal być wsparciem. Absolute Focus i Scorch robią dużą różnicę przy każdym poke'u."
      }
    ]
  },

  support_engage: {
    label: "Wsparcie (inicjacja / tank)",
    normal: [
      {
        title: "Tank engage 7.2",
        keystone: "ice-overlord",
        primaryPath: "Resolve",
        minors: ["courage-of-the-colossus", "bone-plating", "overgrowth"],
        secondaryPath: "Domination",
        secondary: "cheap-shot",
        items: ["locket", "sunfire-aegis", "knights-vow", "thornmail", "force-of-nature", "plated-steelcaps"],
        analysis: "Dla {N} inicjującego walkę Ice Overlord i Resolve dają świetną kontrolę przez CC. Courage of the Colossus i Bone Plating chronią go po wejściu, a Knight's Vow daje dodatkową ochronę carry."
      },
      {
        title: "Guardian / warden",
        keystone: "guardian",
        primaryPath: "Resolve",
        minors: ["font-of-life", "second-wind", "revitalize"],
        secondaryPath: "Precision",
        secondary: "triumph",
        items: ["zekes-convergence", "knights-vow", "redemption", "locket", "force-of-nature", "ionian-boots-of-lucidity"],
        analysis: "Guardian i Resolve sprawiają, że {N} bardzo dobrze wspiera drużynę przy wejściach i obronie. Zeke's Convergence i Locket dają ekstra bezpieczeństwo, a Triumph daje mu sustain po teamfightach."
      }
    ],
    urf: [
      {
        title: "URF: engage non-stop",
        keystone: "ice-overlord",
        primaryPath: "Resolve",
        minors: ["courage-of-the-colossus", "unshakeable", "overgrowth"],
        secondaryPath: "Sorcery",
        secondary: "transcendence",
        items: ["iceborn-gauntlet", "locket", "sunfire-aegis", "knights-vow", "force-of-nature", "ionian-boots-of-lucidity"],
        analysis: "W URF {N} może inicjować praktycznie bez przerwy. Ice Overlord i Iceborn Gauntlet dają ogromną kontrolę mapy, a Locket i Knight's Vow sprawiają, że walka jest jeszcze bardziej kontrolowana."
      },
      {
        title: "URF: damage initiator",
        keystone: "electrocute",
        primaryPath: "Domination",
        minors: ["sudden-impact", "hubris", "eyeball-collector"],
        secondaryPath: "Resolve",
        secondary: "bone-plating",
        items: ["psychic-projector", "ludens-echo", "cosmic-drive", "malignance", "force-of-nature", "ionian-boots-of-lucidity"],
        analysis: "Jeśli {N} ma grać bardziej ofensywnie, Electrocute i Psychic Projector dają świetny burst i dużo dodatkowej mocy. Bone Plating i Force of Nature pomagają przetrwać po wejściu."
      }
    ]
  }
};

function generateBuilds(champ) {
  const arch = archetypeOf(champ);
  const def = ARCH[arch] || ARCH.ad_bruiser;
  const fill = s => (s || "").replace(/\{N\}/g, champ.name);

  const mapSet = (b, idx, kind) => ({
    title: b.title + (kind === 'urf' ? ` (${idx + 1})` : ''),
    analysis: fill(b.analysis),
    items: b.items || [],
    keystone: b.keystone,
    primaryPath: b.primaryPath,
    minors: b.minors,
    secondaryPath: b.secondaryPath,
    secondary: b.secondary
  });

  const normalBase = (def.normal && def.normal.length) ? def.normal[0] : null;
  const normal = normalBase ? [mapSet(normalBase, 0, 'normal')] : [];

  const urfBase = def.urf || [];
  const urf = [];
  if (urfBase.length === 0) {
    if (normalBase) {
      for (let i = 0; i < 3; i++) urf.push(mapSet(normalBase, i, 'urf'));
    }
  } else {
    for (let i = 0; i < 3; i++) {
      const base = urfBase[i % urfBase.length];
      urf.push(mapSet(base, i, 'urf'));
    }
  }

  return {
    archetype: arch,
    label: def.label,
    normal,
    urf
  };
}

try {
  const VALID_ITEMS = typeof ITEM_INFO !== 'undefined' ? Object.keys(ITEM_INFO) : null;
  const VALID_RUNES = typeof RUNE_INFO !== 'undefined' ? Object.keys(RUNE_INFO) : null;
  const _origGenerate = generateBuilds;
  generateBuilds = function(champ) {
    const out = _origGenerate(champ);
    if (out.normal && out.normal.length > 0) {
      out.normal = out.normal.map(b => validateBuild(b, VALID_ITEMS, VALID_RUNES, out));
    }
    if (out.urf && out.urf.length > 0) {
      out.urf = out.urf.map(b => validateBuild(b, VALID_ITEMS, VALID_RUNES, out));
    }
    return out;
  };

  function validateBuild(b, validItems, validRunes, out) {
    const res = Object.assign({}, b);
    if (validRunes) {
      if (!validRunes.includes(res.keystone)) res.keystone = Object.keys(RUNE_INFO)[0];
      if (Array.isArray(res.minors)) {
        res.minors = res.minors.map(m => validRunes.includes(m) ? m : Object.keys(RUNE_INFO)[0]);
      } else {
        res.minors = [Object.keys(RUNE_INFO)[0], Object.keys(RUNE_INFO)[0], Object.keys(RUNE_INFO)[0]];
      }
      if (!validRunes.includes(res.secondary)) res.secondary = Object.keys(RUNE_INFO)[0];
      if (!res.primaryPath) res.primaryPath = 'Precision';
      if (!res.secondaryPath) res.secondaryPath = 'Sorcery';
    }

    const basePool = [];
    if (out && out.archetype) {
      const archDef = ARCH[out.archetype] || {};
      if (archDef.normal) archDef.normal.forEach(x => (x.items || []).forEach(it => basePool.push(it)));
      if (archDef.urf) archDef.urf.forEach(x => (x.items || []).forEach(it => basePool.push(it)));
    }
    let items = Array.isArray(res.items) ? res.items.filter(it => !validItems || validItems.includes(it)) : [];
    for (const it of basePool) {
      if (items.length >= 6) break;
      if ((!validItems || validItems.includes(it)) && !items.includes(it)) items.push(it);
    }
    if (validItems) {
      for (const it of validItems) {
        if (items.length >= 6) break;
        if (!items.includes(it)) items.push(it);
      }
    }
    res.items = items.slice(0, 6);
    return res;
  }
} catch (e) {
  // If ITEM_INFO or RUNE_INFO aren't available at runtime, skip validation silently.
}
