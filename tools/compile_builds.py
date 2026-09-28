#!/usr/bin/env python3
"""Kompiluje pliki data-src/builds/*.txt do js/data/builds.js i waliduje każdy build.

Format pliku (jeden champion = blok):

  @ slug
  I Linia1, Linia2 | Krótka analiza championa.
  N|Nazwa|Linia|keystone|r1 r2 r3|runa_dodatkowa|buty|i1 i2 i3 i4 i5|Opis
  N|...                         (drugi build na tryb zwykły)
  A|...  A|...                  (2 buildy ARAM)
  U|...  U|...                  (2 buildy URF)
  S kod kod kod ...             (przedmioty sytuacyjne)

Reguły walidacji (patch 7.3):
  * keystone z listy 13 keystone'ów,
  * 3 runy główne z jednego drzewa, po jednej z każdego rzędu,
  * 1 runa dodatkowa z innego drzewa,
  * dokładnie 5 różnych przedmiotów + 1 para butów,
  * maks. 1 przedmiot z tej samej grupy unikalnej (Spellblade, Lifeline, Tear/AWE itd.),
  * przedmioty aktywne tylko dla klas, które mogą je kupić,
  * brak run bezużytecznych w danym trybie (np. Zombie Ward w ARAM, Manaflow Band w URF).
"""
import json, os, re, sys, glob

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CAT = json.load(open(os.path.join(ROOT, 'tools', 'catalog.json')))
ITEMS, BOOTS, KEYS, TREES, CHAMPS = CAT['items'], set(CAT['boots']), set(CAT['keystones']), CAT['trees'], CAT['champions']
RUNE_POS = {}
for tree, rows in TREES.items():
    for i, row in enumerate(rows):
        for code in row:
            RUNE_POS[code] = (tree, i)

MODE_BANNED_RUNES = {
    'A': {'zombie', 'relentless', 'botanist', 'seedjar'},
    'U': {'manaflow', 'botanist', 'seedjar', 'zombie'},
}
MODE_BANNED_ITEMS = {
    'U': {'aa', 'manamune', 'winter', 'circlet'},  # w URF mana jest nieskończona – przedmioty Tear nie mają sensu
}
MODES = {'N': 'normal', 'A': 'aram', 'U': 'urf'}

errors = []

def err(slug, msg):
    errors.append(f'{slug}: {msg}')

def check_items(slug, codes, where, unique=True):
    roles = set(CHAMPS[slug])
    groups = {}
    for c in codes:
        it = ITEMS.get(c)
        if not it:
            err(slug, f'{where}: nieznany przedmiot "{c}"')
            continue
        if it.get('cls') and not roles & set(it['cls']):
            err(slug, f'{where}: {it["name"]} jest tylko dla klas {it["cls"]} (champion: {sorted(roles)})')
        g = it.get('group')
        if g and unique:
            if g in groups:
                err(slug, f'{where}: {it["name"]} i {ITEMS[groups[g]]["name"]} mają tę samą unikalną pasywkę ({g})')
            groups[g] = c

def parse_build(slug, kind, line):
    parts = [p.strip() for p in line.split('|')]
    if len(parts) != 9:
        err(slug, f'{kind}: oczekiwano 9 pól, jest {len(parts)}: {line[:60]}')
        return None
    _, name, lane, key, prim, sec, boots, items, desc = parts
    prim = prim.split()
    items = items.split()
    where = f'{MODES[kind]} "{name}"'
    if key not in KEYS:
        err(slug, f'{where}: nieznany keystone "{key}"')
    trees = set()
    rows = set()
    for r in prim:
        if r not in RUNE_POS:
            err(slug, f'{where}: nieznana runa "{r}"')
            continue
        t, i = RUNE_POS[r]
        trees.add(t)
        rows.add(i)
    if len(prim) != 3 or len(trees) != 1 or rows != {0, 1, 2}:
        err(slug, f'{where}: runy główne muszą być 3, z jednego drzewa, po jednej z każdego rzędu: {prim}')
    tree = next(iter(trees)) if len(trees) == 1 else None
    if sec not in RUNE_POS:
        err(slug, f'{where}: nieznana runa dodatkowa "{sec}"')
    elif RUNE_POS[sec][0] == tree:
        err(slug, f'{where}: runa dodatkowa {sec} jest z tego samego drzewa co główne')
    banned = MODE_BANNED_RUNES.get(kind, set()) & (set(prim) | {sec})
    if banned:
        err(slug, f'{where}: runy bez sensu w tym trybie: {banned}')
    if boots not in BOOTS:
        err(slug, f'{where}: nieznane buty "{boots}"')
    if len(items) != 5 or len(set(items)) != 5:
        err(slug, f'{where}: wymagane 5 różnych przedmiotów, jest {items}')
    check_items(slug, items, where)
    bi = MODE_BANNED_ITEMS.get(kind, set()) & set(items)
    if bi:
        err(slug, f'{where}: przedmioty bez sensu w tym trybie: {bi}')
    if not desc:
        err(slug, f'{where}: brak opisu')
    prim_sorted = sorted(prim, key=lambda r: RUNE_POS.get(r, ('', 9))[1])
    return dict(name=name, lane=lane, keystone=key, tree=tree, primary=prim_sorted,
                secTree=RUNE_POS.get(sec, (None,))[0], secondary=sec, boots=boots, items=items, desc=desc)

def main():
    data = {}
    files = sorted(glob.glob(os.path.join(ROOT, 'data-src', 'builds', '*.txt')))
    for f in files:
        cur = None
        for ln, raw in enumerate(open(f, encoding='utf-8'), 1):
            line = raw.rstrip('\n')
            if not line.strip() or line.lstrip().startswith('#'):
                continue
            if line.startswith('@'):
                slug = line[1:].strip()
                if slug not in CHAMPS:
                    err(slug, f'nieznany champion ({os.path.basename(f)}:{ln})')
                if slug in data:
                    err(slug, 'zdublowany blok')
                cur = data.setdefault(slug, dict(lanes=[], about='', normal=[], aram=[], urf=[], situational=[]))
                continue
            if cur is None:
                continue
            k = line[0]
            if k == 'I':
                lanes, _, about = line[1:].partition('|')
                cur['lanes'] = [x.strip() for x in lanes.split(',') if x.strip()]
                cur['about'] = about.strip()
            elif k in MODES:
                b = parse_build(slug, k, line)
                if b:
                    cur[MODES[k]].append(b)
            elif k == 'S':
                codes = line[1:].split()
                check_items(slug, codes, 'sytuacyjne', unique=False)
                if len(set(codes)) != len(codes):
                    err(slug, 'duplikaty w przedmiotach sytuacyjnych')
                cur['situational'] = codes
            else:
                err(slug, f'nieznana linia: {line[:40]}')
    for slug, d in data.items():
        for m in ('normal', 'aram', 'urf'):
            if len(d[m]) != 2:
                err(slug, f'tryb {m}: wymagane 2 buildy, jest {len(d[m])}')
            elif d[m][0]['items'] == d[m][1]['items'] and d[m][0]['keystone'] == d[m][1]['keystone']:
                err(slug, f'tryb {m}: oba buildy są identyczne')
        if len(d['situational']) < 6:
            err(slug, 'za mało przedmiotów sytuacyjnych (min. 6)')
        if not d['about']:
            err(slug, 'brak analizy (linia I)')
    missing = sorted(set(CHAMPS) - set(data))
    strict = '--strict' in sys.argv
    if missing:
        msg = f'brak buildów dla {len(missing)} championów: {", ".join(missing)}'
        (errors.append(msg) if strict else print('UWAGA:', msg))
    if errors:
        print('\n'.join(errors))
        print(f'\nBłędy: {len(errors)}')
        sys.exit(1)
    out = os.path.join(ROOT, 'js', 'data', 'builds.js')
    with open(out, 'w', encoding='utf-8') as fh:
        fh.write('/* Wygenerowano z data-src/builds/*.txt przez tools/compile_builds.py – patch 7.3 */\n')
        fh.write('window.WR_BUILDS = ' + json.dumps(data, ensure_ascii=False, separators=(',', ':')) + ';\n')
    print(f'OK: {len(data)} championów, {sum(len(d[m]) for d in data.values() for m in ("normal","aram","urf"))} buildów -> {out}')

if __name__ == '__main__':
    main()
