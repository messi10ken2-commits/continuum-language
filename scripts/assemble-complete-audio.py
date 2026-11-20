"""Assemble verified recovery clips; source metadata/audio stays outside git."""
import base64
import collections
import hashlib
import json
import os
from pathlib import Path
import sys

source = Path(sys.argv[1] if len(sys.argv) > 1 else 'audio-rebuild')
identity = lambda r: (r['locale'], r['text'])
records = {identity(r): r for r in json.loads(Path('bundled-audio-manifest.json').read_text())}
required = {identity(r) for r in json.loads((source / 'inventory.json').read_text())}
rows = [json.loads(line) for line in (source / 'rendered.jsonl').read_text().splitlines()]
for name in ['studio-records.json', 'human-records.json']:
    rows.extend(json.loads((source / name).read_text()))
selected = {}
for row in rows:
    key = identity(row)
    if key not in required and row['kind'] != 'human':
        continue
    existing = selected.get(key) or records.get(key)
    if existing and existing['kind'] == 'human' and row['kind'] != 'human':
        continue
    selected[key] = row

# Validate every input before replacing any deployed pack or its manifest.
packs = collections.defaultdict(dict)
for key, row in selected.items():
    audio = (source / 'clips' / Path(row['file']).name).read_bytes()
    digest = hashlib.sha256(audio).hexdigest()
    if digest != row['sha256'] or len(audio) <= 100:
        raise ValueError('Invalid recovery clip: ' + row['key'])
    pack = 'complete-' + row['locale'].split('-')[0] + '-' + str(int(row['key'][2:4], 16) % 8)
    record = {k: v for k, v in row.items() if k not in ['file', 'sha256']}
    record.update(pack=pack, audioSha256=digest, collection='complete-lessons-v1')
    records[key] = record
    packs[pack][row['key']] = base64.b64encode(audio).decode()
missing = required - records.keys()
if missing:
    raise ValueError(f'Recovery incomplete: {len(missing)} required recordings missing')

def write_json(path, value, **options):
    temp = path.with_suffix(path.suffix + '.atomic')
    temp.write_text(json.dumps(value, **options) + '\n')
    os.replace(temp, path)

for pack, data in packs.items():
    write_json(Path('bundled-audio-data-' + pack + '.json'), data, separators=(',', ':'))
ordered = sorted(records.values(), key=lambda r: (r['locale'], r['kind'], r['text']))
write_json(Path('bundled-audio-manifest.json'), ordered, ensure_ascii=False, indent=2)
print('Assembled', len(ordered), 'recordings;', sum(r['kind'] == 'human' for r in ordered), 'human recordings')
