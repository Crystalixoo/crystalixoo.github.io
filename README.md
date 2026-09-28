# Rift Poradnik – buildy do Wild Rift (patch 7.3)

Statyczna strona (czysty HTML/CSS/JS, bez buildu) z poradnikiem do **League of Legends: Wild Rift**:

- strona główna z miniaturami wszystkich 142 championów (wyszukiwarka + filtr ról),
- strona championa: opis, umiejętności, 2 buildy na tryb zwykły, 2 na ARAM, 2 na URF oraz lista przedmiotów sytuacyjnych.

Każdy build = 5 przedmiotów + buty (tier 2 → tier 3 od 10. minuty) oraz runy: keystone + 3 runy z jednego drzewa (po jednej z każdego rzędu) + 1 runa z innego drzewa.

## Uruchomienie lokalnie

```
python -m http.server 5500
```

Następnie otwórz http://localhost:5500.

## Struktura

- `index.html`, `champion.html` – strony
- `css/style.css` – style
- `js/index.js`, `js/champion.js`, `js/common.js` – logika
- `js/data/champions.js`, `items.js`, `runes.js` – dane patcha 7.3 (wygenerowane)
- `data-src/builds/*.txt` – źródło buildów (format opisany w `tools/compile_builds.py`)
- `js/data/builds.js` – skompilowane buildy
- `img/` – miniatury championów, ikony umiejętności, przedmiotów i run

## Edycja buildów

Po zmianie plików w `data-src/builds/` uruchom:

```
python3 tools/compile_builds.py --strict
```

Skrypt waliduje każdy build (istniejące przedmioty i runy z 7.3, poprawne rzędy run, 5 unikalnych przedmiotów, konflikty unikalnych pasywek, ograniczenia klasowe przedmiotów aktywnych, sensowność w trybie ARAM/URF) i generuje `js/data/builds.js`.

## Źródła danych

- oficjalne patch notes Wild Rift 7.1, 7.2 (a–e) i 7.3 oraz strony championów (wildrift.leagueoflegends.com, wersja PL),
- statystyki przedmiotów i run: WildRiftFire (stan na patch 7.3), układ drzewek run: League of Legends Wiki (WR:Rune) z poprawkami 7.3.
