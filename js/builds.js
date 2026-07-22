/* ============================================================
   SILNIK BUILDÓW – Wild Rift patch 7.1g
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
  const txt = (champ.abilities || []).map(a => a.desc || "").join(" ").toLowerCase();
  const ap = (txt.match(/ability power|magic damage/g) || []).length;
  const ad = (txt.match(/attack damage|physical damage/g) || []).length;
  const heal = /(heal|shield)/.test(txt);
  switch (cls) {
    case "Mag":      return "ap_mage";
    case "Zabójca":  return ap > ad ? "ap_assassin" : "ad_lethality";
    case "Strzelec": return "ad_crit";
    case "Wojownik": return ap > ad * 1.3 ? "ap_fighter" : "ad_bruiser";
    case "Tank":     return "tank";
    case "Wsparcie": return heal ? "enchanter" : "support_engage";
    default:         return "ad_bruiser";
  }
}

/* ---- Definicje -----------------------------------------------
   primaryPath  – "Precision" | "Sorcery" | "Domination" | "Resolve"
   minors[0]    – Slot 1 z Primary Path
   minors[1]    – Slot 2 z Primary Path
   minors[2]    – Slot 3 z Primary Path
   secondaryPath – inna niż primary
   secondary    – 1 dowolna runa z Secondary Path
   ------------------------------------------------------------- */
const ARCH = {

  /* ═══════════════════ MAG AP ═══════════════════ */
  ap_mage: {
    label: "Mag (AP)",
    normal: [
      {
        title: "Burst AP",
        keystone: "electrocute",
        primaryPath: "Domination",
        minors: ["sudden-impact", "hubris", "eyeball-collector"],
        secondaryPath: "Sorcery",
        secondary: "transcendence",
        items: ["ludens-echo","rabadons-deathcap","infinity-orb","horizon-focus","rylais-crystal-scepter","ionian-boots-of-lucidity"],
        analysis: "Ścieżka Dominacji premiuje agresję {N}: Sudden Impact daje magiczne przebicie tuż po rzuceniu skila z daszem/skokiem, Hubris rośnie z każdym zabójstwem, Eyeball Collector stale dokłada AP. Z Czarostwa bierzemy Transcendence – skraca cooldowny po pełnym kicie. Electrocute detonuje przy trzech trafieniach, Luden's Echo i Infinity Orb kończą robotę."
      },
      {
        title: "Phase Rush / Poke",
        keystone: "phase-rush",
        primaryPath: "Sorcery",
        minors: ["manaflow-band", "transcendence", "gathering-storm"],
        secondaryPath: "Resolve",
        secondary: "second-wind",
        items: ["liandrys-torment","riftmaker","rylais-crystal-scepter","rabadons-deathcap","crown-of-the-shattered-queen","ionian-boots-of-lucidity"],
        analysis: "Czarostwo wspiera sustain i skalowanie {N}: Manaflow Band rozbudowuje pulę many, Transcendence redukuje CD po każdej zabójczej umiejętności, Gathering Storm mnoży moc w późnej fazie. Z Wytrzymałości bierzemy Second Wind – regeneruje HP po harasowaniu. Phase Rush pozwala {N} doskoczyć i uciec, a Rylai's spowalnia każde trafione zaklęcie."
      }
    ],
    urf: [
      {
        title: "URF: Eksplozja co sekund",
        keystone: "first-strike",
        primaryPath: "Sorcery",
        minors: ["absolute-focus", "transcendence", "scorch"],
        secondaryPath: "Domination",
        secondary: "eyeball-collector",
        items: ["malignance","ludens-echo","cosmic-drive","rabadons-deathcap","infinity-orb","ionian-boots-of-lucidity"],
        analysis: "W URF mana jest darmowa, więc rezygnujemy z Manaflow Band na rzecz Absolute Focus (+AP przy pełnym HP) i Scorch (dodatkowe obrażenia po poke przy zerowych CD). First Strike premiuje pierwsze trafienie true damage i złotem, Eyeball Collector stale rośnie z chaotycznych fragów. Malignance i Transcendence utrzymują ulti w trybie ciągłego podpalania."
      },
      {
        title: "URF: DoT lawina",
        keystone: "dark-harvest",
        primaryPath: "Domination",
        minors: ["cheap-shot", "hubris", "eyeball-collector"],
        secondaryPath: "Sorcery",
        secondary: "gathering-storm",
        items: ["liandrys-torment","riftmaker","cosmic-drive","malignance","rabadons-deathcap","ionian-boots-of-lucidity"],
        analysis: "Dark Harvest resetuje CD na 1 sekundę po takedownie – w URF {N} zbiera dusze bez przerwy. Cheap Shot dorzuca true damage do spowolnionych z Rylai's, Hubris nakręca spiralę fragów. Z Czarostwa Gathering Storm stale podnosi AP przez całą grę. Liandry's pali % HP przy każdym z zerowych-CD skilli, Riftmaker dodaje leczenie i true damage."
      }
    ]
  },

  /* ═══════════════════ ZABÓJCA AP ═══════════════════ */
  ap_assassin: {
    label: "Zabójca AP",
    normal: [
      {
        title: "Burst Assassin",
        keystone: "electrocute",
        primaryPath: "Domination",
        minors: ["sudden-impact", "hubris", "eyeball-collector"],
        secondaryPath: "Sorcery",
        secondary: "transcendence",
        items: ["ludens-echo","infinity-orb","lich-bane","rabadons-deathcap","rylais-crystal-scepter","ionian-boots-of-lucidity"],
        analysis: "Dominacja dla {N} to czysta egzekucja: Sudden Impact daje magiczne przebicie dokładnie w momencie wejścia z dasha lub wyjścia ze skradania, Hubris skaluje AP z fragów, Eyeball Collector dokłada je stale. Transcendence z Czarostwa skraca cooldowny po zabiciu. Lich Bane detonuje atak po każdym skilu, Infinity Orb gwarantuje trafienie krytyczne AP przy 35% HP celu."
      },
      {
        title: "Snowball",
        keystone: "dark-harvest",
        primaryPath: "Domination",
        minors: ["cheap-shot", "hubris", "eyeball-collector"],
        secondaryPath: "Resolve",
        secondary: "bone-plating",
        items: ["ludens-echo","crown-of-the-shattered-queen","infinity-orb","rabadons-deathcap","rylais-crystal-scepter","ionian-boots-of-lucidity"],
        analysis: "Dark Harvest zbiera dusze, Hubris rośnie z każdego zabójstwa – {N} staje się lawinowo silniejszy. Cheap Shot dokłada true damage do Rylai's-spowolnionych celów. Z Wytrzymałości Bone Plating blokuje pierwszy zestaw trafień wrogiego maga, bo {N} musi wejść pierwszy. Crown of the Shattered Queen daje dodatkową tarczę na incjację."
      }
    ],
    urf: [
      {
        title: "URF: Oneshot reset",
        keystone: "electrocute",
        primaryPath: "Domination",
        minors: ["sudden-impact", "hubris", "eyeball-collector"],
        secondaryPath: "Precision",
        secondary: "triumph",
        items: ["malignance","ludens-echo","lich-bane","rabadons-deathcap","infinity-orb","ionian-boots-of-lucidity"],
        analysis: "Electrocute w URF proka co kilka sekund – {N} bez przerwy detonuje combo. Triumph przywraca 10% brakującego HP i many po każdym zabójstwie, co przy zerowych CD oznacza permanentne resety. Malignance wzmacnia ulti i podpala cel, Lich Bane proka przy każdym ataku po skilu. Zero itemów na manę, bo mana jest darmowa."
      },
      {
        title: "URF: Dark Harvest kolekcjoner",
        keystone: "dark-harvest",
        primaryPath: "Domination",
        minors: ["sudden-impact", "hubris", "zombie-ward"],
        secondaryPath: "Sorcery",
        secondary: "transcendence",
        items: ["malignance","ludens-echo","cosmic-drive","rabadons-deathcap","lich-bane","ionian-boots-of-lucidity"],
        analysis: "Zombie Ward pasywnie nagradza kontrolę wizji fragmentami Eyeball Collector, podczas gdy Hubris rośnie z zabójstw w trybie niskich CD. Transcendence z Czarostwa skraca cooldowny jeszcze szybciej po każdym kicie. Cosmic Drive daje prędkość ruchu po każdym skilu, więc {N} po wejściu w cel natychmiast się repozycjonuje do następnego."
      }
    ]
  },

  /* ═══════════════════ BATTLEMAGE (AP WOJOWNIK) ═══════════════════ */
  ap_fighter: {
    label: "Battlemage (AP wojownik)",
    normal: [
      {
        title: "Battlemage",
        keystone: "conqueror",
        primaryPath: "Precision",
        minors: ["triumph", "last-stand", "legend-bloodline"],
        secondaryPath: "Resolve",
        secondary: "second-wind",
        items: ["riftmaker","liandrys-torment","rylais-crystal-scepter","rabadons-deathcap","force-of-nature","ionian-boots-of-lucidity"],
        analysis: "Precyzja wspiera {N} w długich walkach w zwarciu: Triumph leczy po każdym zabójstwie, Last Stand daje bonus obrażeń przy niskim HP, Legend Bloodline buduje permanentny wampiryzm. Z Wytrzymałości Second Wind regeneruje HP po harasowaniu. Conqueror osiąga pełne 6 stacków dosłownie po 6 trafieniach, dając leczenie i bonus obrażeń przez całą walkę."
      },
      {
        title: "Tanky AP",
        keystone: "grasp-of-the-undying",
        primaryPath: "Resolve",
        minors: ["font-of-life", "second-wind", "overgrowth"],
        secondaryPath: "Precision",
        secondary: "triumph",
        items: ["riftmaker","rod-of-ages","abyssal-mask","rylais-crystal-scepter","force-of-nature","ionian-boots-of-lucidity"],
        analysis: "Wytrzymałość buduje {N} jako frontliner: Font of Life leczy sojuszników atakujących trafione przez {N} cele, Second Wind regeneruje HP na linii, Overgrowth stale podbija max HP. Z Precyzji Triumph daje reset HP po zabójstwach. Grasp permanentnie nakłada HP i leczy co 4 ataki w walce, Abyssal Mask osłabia odporność na magię pobliskich wrogów."
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
        items: ["riftmaker","liandrys-torment","cosmic-drive","rabadons-deathcap","force-of-nature","ionian-boots-of-lucidity"],
        analysis: "W URF {N} nigdy nie wychodzi z walki – Conqueror jest permanentnie na 6 stackach, dając maksymalne leczenie i obrażenia. Triumph resetuje HP po każdym zabiciu, Legend Bloodline dokłada wampiryzm. Z Czarostwa Transcendence redukuje cooldowny po każdym trafieniu kitem, Cosmic Drive daje prędkość po każdym caście – bez itemów na manę."
      },
      {
        title: "URF: Dark Harvest burst",
        keystone: "dark-harvest",
        primaryPath: "Domination",
        minors: ["cheap-shot", "hubris", "eyeball-collector"],
        secondaryPath: "Sorcery",
        secondary: "gathering-storm",
        items: ["malignance","liandrys-torment","riftmaker","rabadons-deathcap","force-of-nature","ionian-boots-of-lucidity"],
        analysis: "Wariant pod maksymalne obrażenia z ciągłego spamu: Dark Harvest z 1-sekundowym CD po takedownie nagradza każde zabójstwo, Hubris mnoży AP z fragów, Cheap Shot dodaje true damage. Malignance wzmacnia ulti i podpala ziemię pod celem. Gathering Storm z Czarostwa stale rośnie przez całą grę – late game {N} jest nie do zatrzymania."
      }
    ]
  },

  /* ═══════════════════ HYBRYDA ON-HIT AP ═══════════════════ */
  ap_onhit: {
    label: "Hybryda on-hit AP",
    normal: [
      {
        title: "On-hit AP",
        keystone: "lethal-tempo",
        primaryPath: "Precision",
        minors: ["triumph", "last-stand", "legend-alacrity"],
        secondaryPath: "Sorcery",
        secondary: "transcendence",
        items: ["nashors-tooth","lich-bane","rabadons-deathcap","riftmaker","rylais-crystal-scepter","berserkers-greaves"],
        analysis: "Precyzja maksymalizuje DPS {N}: Triumph leczy po zabójstwach, Last Stand daje bonus przy niskim HP, Legend Alacrity buduje permanentną prędkość ataku. Z Czarostwa Transcendence skraca CD po każdym trafieniu kitem. Lethal Tempo przekracza cap AS i daje zasięg. Nashor's Tooth i Lich Bane zamieniają każdy cykl atak-skill-atak w serię obrażeń magicznych."
      },
      {
        title: "Burst hybryda",
        keystone: "electrocute",
        primaryPath: "Domination",
        minors: ["cheap-shot", "hubris", "eyeball-collector"],
        secondaryPath: "Precision",
        secondary: "legend-alacrity",
        items: ["nashors-tooth","lich-bane","infinity-orb","rabadons-deathcap","horizon-focus","ionian-boots-of-lucidity"],
        analysis: "Dominacja pod burstowy styl gry: Cheap Shot dorzuca true damage do Rylai's-spowolnionych celów, Hubris rośnie z fragów, Eyeball Collector dokłada AP. Z Precyzji Legend Alacrity buduje permanentną prędkość ataku bez itemów. Electrocute proka po 3 trafieniach (atak+skill+atak), Infinity Orb finalizuje osłabionych przy 35% HP krytykiem AP."
      }
    ],
    urf: [
      {
        title: "URF: Nieskończony on-hit",
        keystone: "lethal-tempo",
        primaryPath: "Precision",
        minors: ["triumph", "cut-down", "legend-alacrity"],
        secondaryPath: "Sorcery",
        secondary: "transcendence",
        items: ["nashors-tooth","lich-bane","riftmaker","rabadons-deathcap","cosmic-drive","berserkers-greaves"],
        analysis: "Rytm atak–skill–atak bez końca: zero CD oznacza, że Lich Bane jest gotowy przy każdym ataku, Lethal Tempo winduje AS ponad limit. Triumph resetuje HP po zabójstwach w URF-owym chaosie, Cut Down karze cele z pełnym HP. Transcendence z Czarostwa i brak itemów na manę pozwalają {N} bezmyślnie klikać wszystkie przyciski non-stop."
      },
      {
        title: "URF: Hybrydowy burst",
        keystone: "electrocute",
        primaryPath: "Domination",
        minors: ["sudden-impact", "hubris", "eyeball-collector"],
        secondaryPath: "Sorcery",
        secondary: "gathering-storm",
        items: ["nashors-tooth","lich-bane","malignance","rabadons-deathcap","infinity-orb","ionian-boots-of-lucidity"],
        analysis: "Electrocute detonuje co kilka sekund przy spamie skilli, Sudden Impact dokłada magiczne przebicie po każdym dashu. Malignance wzmacnia ulti i podpala cel przy każdym rzucie (a ulti zawsze gotowe w URF). Gathering Storm stale podnosi AP przez całą grę – late game {N} zadaje ogromne obrażenia on-hit i magiczne jednocześnie bez potrzeby many."
      }
    ]
  },

  /* ═══════════════════ STRZELEC CRIT ═══════════════════ */
  ad_crit: {
    label: "Strzelec (crit)",
    normal: [
      {
        title: "Crit ADC",
        keystone: "lethal-tempo",
        primaryPath: "Precision",
        minors: ["triumph", "cut-down", "legend-alacrity"],
        secondaryPath: "Domination",
        secondary: "eyeball-collector",
        items: ["infinity-edge","phantom-dancer","bloodthirster","runaans-hurricane","lord-dominiks-regard","berserkers-greaves"],
        analysis: "Precyzja dla {N} to maksymalny DPS: Triumph leczy po zabójstwach i daje prędkość ruchu, Cut Down karze zdrowych wrogów kupujących HP, Legend Alacrity buduje permanentną prędkość ataku. Z Dominacji Eyeball Collector dokłada AD z każdego fraga. Lethal Tempo przekracza cap AS i daje zasięg, Infinity Edge przy 50%+ cricie daje 205% obrażeń."
      },
      {
        title: "Crit + przeżywalność",
        keystone: "fleet-footwork",
        primaryPath: "Precision",
        minors: ["battle-zeal", "last-stand", "legend-bloodline"],
        secondaryPath: "Resolve",
        secondary: "bone-plating",
        items: ["infinity-edge","phantom-dancer","bloodthirster","guardian-angel","mortal-reminder","berserkers-greaves"],
        analysis: "Fleet Footwork leczy i przyspiesza przy 100 stackach energii – idealne gdy {N} musi kite'ować assassynów. Battle Zeal daje obrażenia adaptacyjne przy każdym trafieniu, Last Stand nagradza walkę przy niskim HP, Legend Bloodline buduje permanentny wampiryzm. Z Wytrzymałości Bone Plating blokuje pierwsze trafienia dive'ującego engage. Guardian Angel daje drugie życie."
      }
    ],
    urf: [
      {
        title: "URF: Crit + Navori",
        keystone: "lethal-tempo",
        primaryPath: "Precision",
        minors: ["triumph", "last-stand", "legend-alacrity"],
        secondaryPath: "Sorcery",
        secondary: "transcendence",
        items: ["infinity-edge","navori-quickblades","phantom-dancer","bloodthirster","lord-dominiks-regard","berserkers-greaves"],
        analysis: "Navori Quickblades to gwóźdź programu URF: każdy atak skraca CD umiejętności o 15%, a przy uncapped AS z Lethal Tempo skille są permanentnie gotowe. Triumph resetuje HP po kill, Last Stand nagradza walkę przy niskim HP. Transcendence z Czarostwa redukuje CD jeszcze bardziej – {N} strzela, używa umiejętności i znowu strzela w kółko bez przerwy."
      },
      {
        title: "URF: First Strike lethality-crit",
        keystone: "first-strike",
        primaryPath: "Domination",
        minors: ["sudden-impact", "hubris", "eyeball-collector"],
        secondaryPath: "Precision",
        secondary: "triumph",
        items: ["the-collector","infinity-edge","navori-quickblades","youmuus-ghostblade","lord-dominiks-regard","ionian-boots-of-lucidity"],
        analysis: "First Strike premiuje pierwsze trafienie – {N} atakuje i dostaje bonus true damage oraz złoto. Sudden Impact dokłada przebicie po repozycjonowaniu, Hubris i Eyeball Collector rosną lawinowo z fragów URF. Triumph z Precyzji resetuje HP po zabójstwach. The Collector egzekutuje cele resztkami HP, Navori zeruje CD skilli między każdym atakiem."
      }
    ]
  },

  /* ═══════════════════ STRZELEC ON-HIT ═══════════════════ */
  ad_onhit_mm: {
    label: "Strzelec (on-hit)",
    normal: [
      {
        title: "On-hit DPS",
        keystone: "lethal-tempo",
        primaryPath: "Precision",
        minors: ["brutal", "last-stand", "legend-alacrity"],
        secondaryPath: "Domination",
        secondary: "eyeball-collector",
        items: ["blade-of-the-ruined-king","kraken-slayer","guinsoos-rageblade","runaans-hurricane","terminus","berserkers-greaves"],
        analysis: "Precyzja daje {N} maszynę do bicia: Brutal dorzuca obrażenia adaptacyjne przy każdym trafieniu, Last Stand nagradza duele przy niskim HP, Legend Alacrity stale buduje AS. Z Dominacji Eyeball Collector dokłada AD. Lethal Tempo i Guinsoo's windują prędkość ataku ponad limit, BotRK i Kraken tną HP celów, Terminus dorzuca magiczne przebicie co drugi atak."
      },
      {
        title: "On-hit + przeżywalność",
        keystone: "fleet-footwork",
        primaryPath: "Precision",
        minors: ["battle-zeal", "last-stand", "legend-bloodline"],
        secondaryPath: "Resolve",
        secondary: "second-wind",
        items: ["blade-of-the-ruined-king","kraken-slayer","infinity-edge","runaans-hurricane","mortal-reminder","berserkers-greaves"],
        analysis: "Fleet Footwork daje sustain i prędkość do kite'owania, Battle Zeal dokłada obrażenia przy każdym trafieniu, Last Stand nagradza walkę na granicy HP, Legend Bloodline buduje permanentny wampiryzm. Z Wytrzymałości Second Wind regeneruje HP po harasowaniu na linii. Infinity Edge sprawia, że ataki Krakena i obszarowe z Runaan's trafią krytycznie."
      }
    ],
    urf: [
      {
        title: "URF: On-hit lawina",
        keystone: "lethal-tempo",
        primaryPath: "Precision",
        minors: ["triumph", "cut-down", "legend-alacrity"],
        secondaryPath: "Sorcery",
        secondary: "transcendence",
        items: ["blade-of-the-ruined-king","kraken-slayer","guinsoos-rageblade","runaans-hurricane","terminus","berserkers-greaves"],
        analysis: "Lethal Tempo przebija limit AS i daje zasięg, Guinsoo's co 3. atak podwaja efekty on-hit, Runaan's rozkłada BotRK, Krakena i Terminus na trzy cele. Triumph resetuje HP po zabójstwach, Cut Down karze tanki z dużym HP. Transcendence z Czarostwa i darmowa mana w URF pozwalają {N} przez całą grę trzymać wciśnięty przycisk ataku."
      },
      {
        title: "URF: Navori on-hit",
        keystone: "conqueror",
        primaryPath: "Precision",
        minors: ["triumph", "cut-down", "legend-alacrity"],
        secondaryPath: "Sorcery",
        secondary: "transcendence",
        items: ["guinsoos-rageblade","nashors-tooth","blade-of-the-ruined-king","navori-quickblades","terminus","berserkers-greaves"],
        analysis: "Navori zeruje CD skilli atakami – a skilli {N} jest mnóstwo. Guinsoo's i Nashor's Tooth dokładają obrażenia magiczne do każdego trafienia, Conqueror zbiera stacki z każdego ataku i daje leczenie w dłuższej walce. Triumph i Legend Alacrity dopełniają Precyzję, Transcendence redukuje CD dalej. Zero itemów na manę – tylko on-hit chaos."
      }
    ]
  },

  /* ═══════════════════ ZABÓJCA AD (LETHALITY) ═══════════════════ */
  ad_lethality: {
    label: "Zabójca AD (lethality)",
    normal: [
      {
        title: "Lethality Assassin",
        keystone: "electrocute",
        primaryPath: "Domination",
        minors: ["sudden-impact", "hubris", "eyeball-collector"],
        secondaryPath: "Sorcery",
        secondary: "transcendence",
        items: ["youmuus-ghostblade","duskblade-of-draktharr","the-collector","seryldas-grudge","edge-of-night","ionian-boots-of-lucidity"],
        analysis: "Dominacja idealnie wspiera styl gry {N}: Sudden Impact daje przebicie pancerza tuż po dashu do celu, Hubris rośnie skokowo z każdym zabójstwem, Eyeball Collector stale dokłada AD. Z Czarostwa Transcendence skraca cooldowny po każdym zabiciu, inicjując resety. Electrocute detonuje przy trzech szybkich trafieniach, Duskblade spowalnia przy pierwszym ciosie, The Collector egzekutuje."
      },
      {
        title: "Snowball",
        keystone: "dark-harvest",
        primaryPath: "Domination",
        minors: ["cheap-shot", "hubris", "eyeball-collector"],
        secondaryPath: "Precision",
        secondary: "triumph",
        items: ["youmuus-ghostblade","eclipse","the-collector","seryldas-grudge","edge-of-night","ionian-boots-of-lucidity"],
        analysis: "Dark Harvest zbiera dusze po każdym zabójstwie i resetuje CD na 1 sekundę, Cheap Shot dorzuca true damage do spowolnionych z Serylda's, Hubris i Eyeball Collector skalują AD lawinowo. Triumph z Precyzji leczy po zabójstwach i pozwala {N} gonić kolejne cele. Eclipse daje tarczę po dwóch trafieniach i % HP – chroni przy pierwszym wejściu."
      }
    ],
    urf: [
      {
        title: "URF: Reset egzekucji",
        keystone: "electrocute",
        primaryPath: "Domination",
        minors: ["sudden-impact", "hubris", "eyeball-collector"],
        secondaryPath: "Precision",
        secondary: "triumph",
        items: ["youmuus-ghostblade","duskblade-of-draktharr","the-collector","eclipse","seryldas-grudge","ionian-boots-of-lucidity"],
        analysis: "Duskblade odświeża się po każdym takedownie – zerowe CD w URF oznaczają, że {N} ma bonus pierwszego ataku na każdy cel. Electrocute proka co kilka sekund, Sudden Impact daje przebicie przy każdym dashu. Triumph z Precyzji to klucz: regeneruje HP i many po każdym zabójstwie, zapewniając nieskończone resety. Hubris i Eyeball Collector czynią {N} coraz groźniejszym."
      },
      {
        title: "URF: First Strike spam",
        keystone: "first-strike",
        primaryPath: "Domination",
        minors: ["sudden-impact", "hubris", "zombie-ward"],
        secondaryPath: "Precision",
        secondary: "triumph",
        items: ["eclipse","youmuus-ghostblade","the-collector","serpents-fang","seryldas-grudge","ionian-boots-of-lucidity"],
        analysis: "First Strike premiuje pierwsze uderzenie – {N} dostaje true damage i złoto za każde otwarcie walki, które w URF powtarza się co kilka sekund. Zombie Ward nadrabia slot Eyeball Collector i nagradza zabijanie wrogich wardów. Serpent's Fang łamie tarcze, których w URF jest dużo (Sterak's, Guardian Angel). Triumph resetuje HP, Triumph + niskie CD = wieczne polowanie."
      }
    ]
  },

  /* ═══════════════════ WOJOWNIK AD BRUISER ═══════════════════ */
  ad_bruiser: {
    label: "Wojownik (AD bruiser)",
    normal: [
      {
        title: "AD Bruiser",
        keystone: "conqueror",
        primaryPath: "Precision",
        minors: ["triumph", "last-stand", "legend-alacrity"],
        secondaryPath: "Resolve",
        secondary: "bone-plating",
        items: ["trinity-force","black-cleaver","deaths-dance","steraks-gage","sundered-sky","plated-steelcaps"],
        analysis: "Precyzja dla {N} to narzędzie długich starć: Triumph leczy po zabójstwach, Last Stand daje bonus obrażeń przy niskim HP, Legend Alacrity buduje AS dla Trinity Force Spellblade. Z Wytrzymałości Bone Plating blokuje pierwsze trafienia engagera. Conqueror po 6 trafieniach daje leczenie i obrażenia przez całą walkę, Black Cleaver łamie 30% pancerza."
      },
      {
        title: "Tank-Bruiser",
        keystone: "grasp-of-the-undying",
        primaryPath: "Resolve",
        minors: ["demolish", "second-wind", "overgrowth"],
        secondaryPath: "Precision",
        secondary: "triumph",
        items: ["trinity-force","sunfire-aegis","deaths-dance","steraks-gage","force-of-nature","plated-steelcaps"],
        analysis: "Wytrzymałość buduje {N} jako inicjatora: Demolish daje bonus obrażeń do wież przy nakładaniu stacków, Second Wind regeneruje HP po wymianie na linii, Overgrowth permanentnie buduje max HP. Triumph z Precyzji leczy po zabójstwach w teamfightach. Grasp leczy i permanentnie dokłada HP co 4 ataki w walce, Sunfire Aegis pali zgrupowanych wrogów."
      }
    ],
    urf: [
      {
        title: "URF: Conqueror Shojin spam",
        keystone: "conqueror",
        primaryPath: "Precision",
        minors: ["triumph", "last-stand", "legend-alacrity"],
        secondaryPath: "Sorcery",
        secondary: "transcendence",
        items: ["stridebreaker","spear-of-shojin","black-cleaver","steraks-gage","deaths-dance","plated-steelcaps"],
        analysis: "Spear of Shojin w URF to marzenie – daje +20 haste do podstawowych skilli i podbija ich obrażenia o 3% za cast (max 4 stacki, zawsze pełne). Conqueror jest permanentnie maxowany w ciągłej walce, Triumph resetuje HP po kill. Transcendence z Czarostwa redukuje CD dalej, Legend Alacrity i Stridebreaker pozwalają {N} łapać cele bez końca – zero itemów na manę."
      },
      {
        title: "URF: First Strike burst-fighter",
        keystone: "first-strike",
        primaryPath: "Domination",
        minors: ["sudden-impact", "hubris", "eyeball-collector"],
        secondaryPath: "Precision",
        secondary: "triumph",
        items: ["eclipse","black-cleaver","youmuus-ghostblade","spear-of-shojin","steraks-gage","ionian-boots-of-lucidity"],
        analysis: "First Strike premiuje agresję – każde otwarcie walki daje {N} bonus true damage i złoto. Sudden Impact dokłada przebicie po każdym dashu do celu, Hubris rośnie lawinowo z fragów. Triumph z Precyzji resetuje HP i many po każdym zabiciu. Spear of Shojin nakręca obrażenia skilli w ciągłym spamie, Eclipse daje tarczę i % HP po dwóch trafieniach."
      }
    ]
  },

  /* ═══════════════════ WOJOWNIK ON-HIT (DUELANT) ═══════════════════ */
  onhit_fighter: {
    label: "Wojownik on-hit (duelant)",
    normal: [
      {
        title: "On-hit Bruiser",
        keystone: "conqueror",
        primaryPath: "Precision",
        minors: ["triumph", "last-stand", "legend-alacrity"],
        secondaryPath: "Domination",
        secondary: "eyeball-collector",
        items: ["blade-of-the-ruined-king","trinity-force","guinsoos-rageblade","deaths-dance","steraks-gage","plated-steelcaps"],
        analysis: "Precyzja dopasowana do duelanta {N}: Triumph leczy po zabójstwach, Last Stand daje bonus obrażeń przy niskim HP, Legend Alacrity buduje AS. Z Dominacji Eyeball Collector dokłada AD z każdego fraga. Conqueror osiąga 6 stacków błyskawicznie w zwarciu, dając leczenie. Guinsoo's co 3. atak podwaja efekty on-hit BotRK, Trinity Force proka Spellblade po każdym skilu."
      },
      {
        title: "On-hit DPS",
        keystone: "lethal-tempo",
        primaryPath: "Precision",
        minors: ["brutal", "last-stand", "legend-alacrity"],
        secondaryPath: "Resolve",
        secondary: "second-wind",
        items: ["blade-of-the-ruined-king","kraken-slayer","guinsoos-rageblade","terminus","steraks-gage","berserkers-greaves"],
        analysis: "Lethal Tempo winduje AS ponad limit i daje zasięg, Brutal dorzuca obrażenia adaptacyjne przy każdym trafieniu, Last Stand nagradza walkę na granicy HP, Legend Alacrity stale buduje AS. Z Wytrzymałości Second Wind regeneruje HP po harasowaniu. Kraken co 3. atak skaluje z brakującym HP, Terminus przeplata ataki dającymi pancerz i przebiciem."
      }
    ],
    urf: [
      {
        title: "URF: On-hit Trinity spam",
        keystone: "lethal-tempo",
        primaryPath: "Precision",
        minors: ["triumph", "last-stand", "legend-alacrity"],
        secondaryPath: "Sorcery",
        secondary: "transcendence",
        items: ["blade-of-the-ruined-king","trinity-force","guinsoos-rageblade","kraken-slayer","deaths-dance","berserkers-greaves"],
        analysis: "Niskie CD ładują Spellblade z Trinity Force po każdym skilu, {N} rzuca skille bez przerwy bo mana jest darmowa. Lethal Tempo + Guinsoo's windują AS ponad limit i podwajają on-hity co 3. atak. Triumph resetuje HP po kill, Transcendence z Czarostwa dogłębnie redukuje CD. BotRK i Kraken topią nawet tanki budujące stosy HP w URF."
      },
      {
        title: "URF: Conqueror Shojin duelant",
        keystone: "conqueror",
        primaryPath: "Precision",
        minors: ["triumph", "cut-down", "legend-alacrity"],
        secondaryPath: "Sorcery",
        secondary: "transcendence",
        items: ["trinity-force","spear-of-shojin","guinsoos-rageblade","steraks-gage","deaths-dance","ionian-boots-of-lucidity"],
        analysis: "Spear of Shojin daje haste do skilli i podbija ich obrażenia za każdy cast – stacki nigdy nie spadają przy zerowych CD. Conqueror jest permanentnie maxowany, Cut Down karze tanki z dużym HP. Triumph resetuje po kill, Transcendence utrzymuje CD na dnie. Guinsoo's miksuje on-hit z obrażeniami magicznymi. Zero itemów na manę – {N} walczy bez zatrzymania."
      }
    ]
  },

  /* ═══════════════════ TANK ═══════════════════ */
  tank: {
    label: "Tank",
    normal: [
      {
        title: "Tank inicjacja",
        keystone: "grasp-of-the-undying",
        primaryPath: "Resolve",
        minors: ["font-of-life", "bone-plating", "overgrowth"],
        secondaryPath: "Precision",
        secondary: "triumph",
        items: ["sunfire-aegis","thornmail","force-of-nature","warmogs-armor","kaenic-rookern","plated-steelcaps"],
        analysis: "Wytrzymałość buduje {N} jako niezniszczalną ścianę: Font of Life leczy sojuszników atakujących trafione przez {N} cele, Bone Plating blokuje pierwsze trafienia przy engage, Overgrowth permanentnie builduje max HP. Triumph z Precyzji leczy po teamfight-owych zabójstwach. Grasp leczy i buduje HP co 4 ataki, Warmog's Heart regeneruje 3.5% HP/s między walkami."
      },
      {
        title: "Tank z obrażeniami",
        keystone: "ice-overlord",
        primaryPath: "Resolve",
        minors: ["courage-of-the-colossus", "bone-plating", "overgrowth"],
        secondaryPath: "Domination",
        secondary: "cheap-shot",
        items: ["sunfire-aegis","iceborn-gauntlet","hollow-radiance","thornmail","force-of-nature","plated-steelcaps"],
        analysis: "Ice Overlord po każdej immobilizacji tworzy lodowe strefy spowalniające, daje tarczę z +35+80% pancerza i wybucha obrażeniami % HP. Courage of the Colossus dorzuca tarczę po CC, Bone Plating blokuje atak, Overgrowth buduje HP. Z Dominacji Cheap Shot dorzuca true damage do wrogów w lodzie. Iceborn Gauntlet tworzy strefę spowalniającą po każdym skilu."
      }
    ],
    urf: [
      {
        title: "URF: Lód bez przerwy",
        keystone: "ice-overlord",
        primaryPath: "Resolve",
        minors: ["courage-of-the-colossus", "unshakeable", "overgrowth"],
        secondaryPath: "Sorcery",
        secondary: "transcendence",
        items: ["iceborn-gauntlet","frozen-heart","sunfire-aegis","hollow-radiance","force-of-nature","ionian-boots-of-lucidity"],
        analysis: "Przy zerowych CD {N} co chwilę rzuca CC – Ice Overlord wybucha, Iceborn Gauntlet tworzy lodowe strefy, Frozen Heart (Slot2 Sorcery: +25 AH, aura -36% AS wrogów) spowalnia cały front. Courage of the Colossus daje tarczę po każdej immobilizacji, Unshakeable chroni {N} przed CC przy wejściu. Transcendence z Czarostwa redukuje CD jeszcze bardziej. Pole bitwy staje się lodownią."
      },
      {
        title: "URF: Grasp obrażenia",
        keystone: "grasp-of-the-undying",
        primaryPath: "Resolve",
        minors: ["demolish", "bone-plating", "overgrowth"],
        secondaryPath: "Sorcery",
        secondary: "transcendence",
        items: ["iceborn-gauntlet","sunfire-aegis","abyssal-mask","hollow-radiance","force-of-nature","ionian-boots-of-lucidity"],
        analysis: "Grasp w URF proka co 4 ataki – przy ciągłej walce {N} stale leczy i buduje HP. Demolish co 30s daje ogromny bonus do wieży, Bone Plating blokuje trafienia, Overgrowth stale rośnie. Transcendence z Czarostwa redukuje CD. Abyssal Mask i Hollow Radiance dokładają magiczne obrażenia do spamu {N}, łącząc niezniszczalność z realnym zagrożeniem."
      }
    ]
  },

  /* ═══════════════════ ENCHANTER ═══════════════════ */
  enchanter: {
    label: "Wsparcie (wzmacniacz)",
    normal: [
      {
        title: "Enchanter klasyczny",
        keystone: "aery",
        primaryPath: "Sorcery",
        minors: ["manaflow-band", "transcendence", "gathering-storm"],
        secondaryPath: "Resolve",
        secondary: "revitalize",
        items: ["staff-of-flowing-water","ardent-censer","harmonic-echo","redemption","locket","ionian-boots-of-lucidity"],
        analysis: "Czarostwo wspiera zdolności healingowe {N}: Manaflow Band rozbudowuje manę na długie gry, Transcendence redukuje CD po każdym kicie leczenia/tarczy, Gathering Storm stale podbija AP. Z Wytrzymałości Revitalize amplifikuje każde leczenie o 5-15%. Aery nieustannie lata między {N} a sojusznikami, Staff i Ardent dają sojusznikom obrażenia i haste przy każdym heal/shield."
      },
      {
        title: "Guardian / ochrona",
        keystone: "guardian",
        primaryPath: "Resolve",
        minors: ["font-of-life", "second-wind", "revitalize"],
        secondaryPath: "Sorcery",
        secondary: "transcendence",
        items: ["staff-of-flowing-water","ardent-censer","harmonic-echo","redemption","cosmic-drive","ionian-boots-of-lucidity"],
        analysis: "Wytrzymałość pod aktywną ochronę carry: Font of Life leczy sojuszników atakujących oznaczone przez {N} cele, Second Wind regeneruje HP po harasowaniu, Revitalize amplifikuje leczenie. Transcendence z Czarostwa skraca CD po każdym rzucie umiejętności. Guardian aktywuje tarczę dla {N} i ochranianego sojusznika gdy jedno z nich dostanie za dużo obrażeń."
      }
    ],
    urf: [
      {
        title: "URF: Permanentne tarcze",
        keystone: "aery",
        primaryPath: "Sorcery",
        minors: ["axiom-arcanist", "transcendence", "gathering-storm"],
        secondaryPath: "Resolve",
        secondary: "revitalize",
        items: ["staff-of-flowing-water","ardent-censer","harmonic-echo","cosmic-drive","redemption","ionian-boots-of-lucidity"],
        analysis: "W URF mana jest darmowa – {N} leje heale i tarcze non-stop. Axiom Arcanist zwiększa efekty ulti o 10% i skraca CD po takedownach, Transcendence redukuje CD po każdym kicie. Revitalize z Wytrzymałości amplifikuje każdy heal. Aery non-stop lata do sojuszników. Staff, Ardent i Harmonic Echo nakładają buffa obrażeń i leczenia przy każdej tarczy, która teraz trafia dosłownie co chwilę."
      },
      {
        title: "URF: AP support burst",
        keystone: "aery",
        primaryPath: "Sorcery",
        minors: ["absolute-focus", "celerity", "scorch"],
        secondaryPath: "Precision",
        secondary: "triumph",
        items: ["ludens-echo","malignance","staff-of-flowing-water","cosmic-drive","rabadons-deathcap","ionian-boots-of-lucidity"],
        analysis: "Wariant ofensywny: Absolute Focus daje bonus AP przy pełnym HP, Celerity wzmacnia prędkość ruchu z Cosmic Drive, Scorch dorzuca obrażenia po każdym poke (a poke przy zerowych CD jest stały). Luden's i Malignance zamieniają {N} w realne źródło bursta. Triumph z Precyzji leczy po kill, Staff zachowuje wsparcie dla sojuszników – {N} bije jak mid i buffuje drużynę."
      }
    ]
  },

  /* ═══════════════════ SUPPORT ENGAGE ═══════════════════ */
  support_engage: {
    label: "Wsparcie (inicjacja / tank)",
    normal: [
      {
        title: "Tank-Engage",
        keystone: "ice-overlord",
        primaryPath: "Resolve",
        minors: ["courage-of-the-colossus", "bone-plating", "overgrowth"],
        secondaryPath: "Domination",
        secondary: "cheap-shot",
        items: ["locket","sunfire-aegis","knights-vow","thornmail","force-of-nature","plated-steelcaps"],
        analysis: "Wytrzymałość buduje {N} jako inicjatora: Courage of the Colossus daje tarczę 25-45+1% HP po CC, Bone Plating blokuje kontratak po engage, Overgrowth permanentnie buduje HP. Z Dominacji Cheap Shot dorzuca true damage do unieruchomionych. Ice Overlord po CC tworzy lodowe strefy, daje tarczę +35+80% pancerza i wybucha obrażeniami % HP. Knight's Vow chroni carry."
      },
      {
        title: "Guardian / warden",
        keystone: "guardian",
        primaryPath: "Resolve",
        minors: ["font-of-life", "second-wind", "revitalize"],
        secondaryPath: "Precision",
        secondary: "triumph",
        items: ["zekes-convergence","knights-vow","redemption","locket","force-of-nature","ionian-boots-of-lucidity"],
        analysis: "Wytrzymałość pod ochronę carry: Font of Life leczy sojuszników atakujących przez {N} oznaczone cele, Second Wind regeneruje HP na linii, Revitalize amplifikuje leczenie. Triumph z Precyzji leczy {N} po teamfight-owych assist. Guardian aktywuje tarczę gdy {N} lub ochrabiany sojusznik dostaje za dużo. Zeke's Convergence co 30s otacza {N} blizzardem po ulti."
      }
    ],
    urf: [
      {
        title: "URF: Engage non-stop",
        keystone: "ice-overlord",
        primaryPath: "Resolve",
        minors: ["courage-of-the-colossus", "unshakeable", "overgrowth"],
        secondaryPath: "Sorcery",
        secondary: "transcendence",
        items: ["iceborn-gauntlet","locket","sunfire-aegis","knights-vow","force-of-nature","ionian-boots-of-lucidity"],
        analysis: "Niskie CD pozwalają {N} inicjować dosłownie co kilka sekund – Ice Overlord i Iceborn Gauntlet pokrywają pole bitwy lodem przy każdym skilu. Courage of the Colossus daje tarczę po każdym CC, Unshakeable chroni {N} przed kontrowanym CC po engage. Transcendence z Czarostwa redukuje CD dalej. {N} jest wieczną maszyną do zaczepiania walk bez troski o manę."
      },
      {
        title: "URF: Damage initiator",
        keystone: "electrocute",
        primaryPath: "Domination",
        minors: ["sudden-impact", "hubris", "eyeball-collector"],
        secondaryPath: "Resolve",
        secondary: "bone-plating",
        items: ["psychic-projector","ludens-echo","cosmic-drive","malignance","force-of-nature","ionian-boots-of-lucidity"],
        analysis: "Psychic Projector zamienia ogromne HP {N} w moc umiejętności (+3.5% AP z bonus HP), Luden's i Malignance przy zerowych CD zamieniają inicjację w lawinę eksplozji. Sudden Impact daje magiczne przebicie po każdym CC-dashu, Hubris rośnie z chaos-fragów. Bone Plating z Wytrzymałości blokuje kontratak po engage. {N} inicjuje, wybucha obrażeniami i tankuje – wszystko bez many."
      }
    ]
  }
};

function generateBuilds(champ) {
  // Determine archetype and base definition
  const arch = archetypeOf(champ);
  const def = ARCH[arch] || ARCH.ad_bruiser;
  const fill = s => (s || "").replace(/\{N\}/g, champ.name);

  // Map a build entry to the public format and optionally add a small variation suffix
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

  // Clear existing builds conceptually by always generating a fresh, deterministic set:
  // - exactly 1 normal build (take the first available)
  // - exactly 3 URF builds (repeat/rotate base URF entries if fewer than 3)
  const normalBase = (def.normal && def.normal.length) ? def.normal[0] : null;
  const normal = normalBase ? [mapSet(normalBase, 0, 'normal')] : [];

  const urfBase = def.urf || [];
  const urf = [];
  if (urfBase.length === 0) {
    // fallback: reuse normal build as URF variations if no URF definitions present
    if (normalBase) {
      for (let i = 0; i < 3; i++) urf.push(mapSet(normalBase, i, 'urf'));
    }
  } else {
    for (let i = 0; i < 3; i++) {
      // rotate through available urfBase entries to create up to 3 distinct builds
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

// Helper: validate runes and items against meta lists (if present on page)
try {
  const VALID_ITEMS = typeof ITEM_INFO !== 'undefined' ? Object.keys(ITEM_INFO) : null;
  const VALID_RUNES = typeof RUNE_INFO !== 'undefined' ? Object.keys(RUNE_INFO) : null;
  // Wrap original generateBuilds to post-process and ensure availability
  const _origGenerate = generateBuilds;
  generateBuilds = function(champ) {
    const out = _origGenerate(champ);

    // Validate normal build
    if (out.normal && out.normal.length > 0) {
      out.normal = out.normal.map(b => validateBuild(b, VALID_ITEMS, VALID_RUNES, out));
    }

    // Validate urf builds
    if (out.urf && out.urf.length > 0) {
      out.urf = out.urf.map(b => validateBuild(b, VALID_ITEMS, VALID_RUNES, out));
    }
    return out;
  };

  function validateBuild(b, validItems, validRunes, out) {
    const res = Object.assign({}, b);
    // Validate runes: keystone, minors (array of 3), secondary
    if (validRunes) {
      if (!validRunes.includes(res.keystone)) res.keystone = res.keystone && validRunes.includes(res.keystone) ? res.keystone : Object.keys(RUNE_INFO)[0];
      if (Array.isArray(res.minors)) {
        res.minors = res.minors.map(m => validRunes.includes(m) ? m : Object.keys(RUNE_INFO)[0]);
      } else {
        res.minors = [Object.keys(RUNE_INFO)[0], Object.keys(RUNE_INFO)[0], Object.keys(RUNE_INFO)[0]];
      }
      if (!validRunes.includes(res.secondary)) res.secondary = Object.keys(RUNE_INFO)[0];
      if (!res.primaryPath) res.primaryPath = res.primaryPath || 'Precision';
      if (!res.secondaryPath) res.secondaryPath = res.secondaryPath || 'Sorcery';
    }

    // Validate items: ensure items exist in ITEM_INFO and length == 6
    const basePool = [];
    if (out && out.label) {
      // collect archetype pools from ARCH
      const archDef = ARCH[out.archetype] || {};
      if (archDef.normal) archDef.normal.forEach(x => (x.items || []).forEach(it => basePool.push(it)));
      if (archDef.urf) archDef.urf.forEach(x => (x.items || []).forEach(it => basePool.push(it)));
    }
    // start with provided items filtered
    let items = Array.isArray(res.items) ? res.items.filter(it => !validItems || validItems.includes(it)) : [];
    // append from basePool in order, avoid duplicates
    for (const it of basePool) {
      if (items.length >= 6) break;
      if ((!validItems || validItems.includes(it)) && !items.includes(it)) items.push(it);
    }
    // if still short, append any valid item
    if (validItems) {
      for (const it of validItems) {
        if (items.length >= 6) break;
        if (!items.includes(it)) items.push(it);
      }
    }
    // trim to 6
    res.items = items.slice(0, 6);
    return res;
  }
} catch (e) {
  // If meta globals not available, silently skip validation
}
