"""Build clothed, self-contained World GLBs from the CC0 Standard source archive.

Usage: python scripts/build-world-people.py /path/to/Universal-Base-Characters-Standard.zip
No network, image conversion, Blender, paid files or runtime external dependencies.
"""
import copy
import hashlib
import json
import math
from pathlib import Path
import struct
import sys
import zipfile

SOURCE_HASH = 'fdbf1804c90dfc1ea03e992bff7da2dfd1a79318e13270a660180f9308455f40'
archive = Path(sys.argv[1])
assert hashlib.sha256(archive.read_bytes()).hexdigest() == SOURCE_HASH
source = zipfile.ZipFile(archive)
prefix = 'Universal Base Characters[Standard]/'
base = prefix + 'Base Characters/Godot - UE/'
out = Path(__file__).resolve().parents[1] / 'public/world-tokyo/people'
out.mkdir(parents=True, exist_ok=True)
files = []

for gender, name, hair in [('Male', 'traveller', 'Hair_SimpleParted'), ('Female', 'resident', 'Hair_Long')]:
    gltf = json.loads(source.read(base + f'Superhero_{gender}_FullBody.gltf'))
    binary = bytearray(source.read(base + f'Superhero_{gender}_FullBody.bin'))

    def append(data, kind, components, count, component_type=5126, bounds=None):
        binary.extend(b'\0' * (-len(binary) % 4))
        view = len(gltf['bufferViews'])
        gltf['bufferViews'].append({'buffer': 0, 'byteOffset': len(binary), 'byteLength': len(data)})
        binary.extend(data)
        accessor = {'bufferView': view, 'componentType': component_type, 'count': count, 'type': kind}
        if bounds:
            accessor.update(min=bounds[0], max=bounds[1])
        gltf['accessors'].append(accessor)
        return len(gltf['accessors']) - 1

    def values(index):
        a = gltf['accessors'][index]
        v = gltf['bufferViews'][a['bufferView']]
        n = {'SCALAR': 1, 'VEC2': 2, 'VEC3': 3, 'VEC4': 4, 'MAT4': 16}[a['type']]
        fmt = {5126: 'f', 5123: 'H', 5125: 'I', 5121: 'B'}[a['componentType']]
        offset = v.get('byteOffset', 0) + a.get('byteOffset', 0)
        stride = v.get('byteStride', n * struct.calcsize(fmt))
        return [struct.unpack_from('<' + fmt * n, binary, offset + i * stride) for i in range(a['count'])]

    # Retain only original, unmodified skin/eye images. Fabric and hair use lit materials.
    skin_uri = next(i['uri'] for i in gltf['images'] if 'Dark' in i['name'])
    image_uris = [skin_uri, 'T_Eye_Brown.png']
    gltf['images'] = []
    for uri in image_uris:
        data = source.read(base + uri)
        binary.extend(b'\0' * (-len(binary) % 4))
        view = len(gltf['bufferViews'])
        gltf['bufferViews'].append({'buffer': 0, 'byteOffset': len(binary), 'byteLength': len(data)})
        binary.extend(data)
        gltf['images'].append({'bufferView': view, 'mimeType': 'image/png'})
    gltf['textures'] = [{'source': 0}, {'source': 1}]
    gltf.pop('samplers', None)
    gltf['materials'] = [
        {'name': 'World hair', 'pbrMetallicRoughness': {'baseColorFactor': [.035, .027, .023, 1], 'metallicFactor': 0, 'roughnessFactor': .72}},
        {'name': 'World eyes', 'pbrMetallicRoughness': {'baseColorTexture': {'index': 1}, 'metallicFactor': 0, 'roughnessFactor': .35}},
        {'name': 'World skin', 'pbrMetallicRoughness': {'baseColorTexture': {'index': 0}, 'metallicFactor': 0, 'roughnessFactor': .82}},
        {'name': 'World shirt', 'pbrMetallicRoughness': {'baseColorFactor': [.18, .28, .27, 1], 'metallicFactor': 0, 'roughnessFactor': .94}},
        {'name': 'World trousers', 'pbrMetallicRoughness': {'baseColorFactor': [.065, .09, .13, 1], 'metallicFactor': 0, 'roughnessFactor': .96}},
        {'name': 'World shoes', 'pbrMetallicRoughness': {'baseColorFactor': [.035, .04, .045, 1], 'metallicFactor': 0, 'roughnessFactor': .8}},
    ]
    body = gltf['meshes'][2]['primitives'][0]
    attrs = {k: v for k, v in body['attributes'].items() if k in ['POSITION', 'NORMAL', 'TEXCOORD_0', 'JOINTS_0', 'WEIGHTS_0']}
    positions, normals = values(attrs['POSITION']), values(attrs['NORMAL'])
    indices = [v[0] for v in values(body['indices'])]
    joints, weights = values(attrs['JOINTS_0']), values(attrs['WEIGHTS_0'])
    bone_names = [gltf['nodes'][j]['name'] for j in gltf['skins'][0]['joints']]
    regions = []
    for p, js, ws in zip(positions, joints, weights):
        names = [(bone_names[j], w) for j, w in zip(js, ws)]
        exposed = sum(w for n, w in names if n == 'Head' or n.startswith(('neck', 'hand', 'index', 'middle', 'ring', 'pinky', 'thumb')))
        hand = sum(w for n, w in names if n.startswith(('hand', 'index', 'middle', 'ring', 'pinky', 'thumb')))
        neck_y = 1.515 if gender == 'Male' else 1.455
        regions.append(2 if hand > .55 or (exposed > .55 and p[1] > neck_y) else 5 if p[1] < .12 else 4 if p[1] < 1.01 else 3)
    # Crop covered body faces, then compact their vertices. Only exposed face,
    # neck and hands remain; clothing is independent geometry below.
    selected = []
    for i in range(0, len(indices), 3):
        tri = indices[i:i + 3]
        if sorted(regions[v] for v in tri)[1] == 2:
            selected.extend(tri)
    used = sorted(set(selected))
    remap = {v: i for i, v in enumerate(used)}
    skin_attributes = {}
    for key, index in attrs.items():
        old = gltf['accessors'][index]
        rows = values(index)
        rows = [rows[i] for i in used]
        flat = [v for row in rows for v in row]
        fmt = 'H' if old['componentType'] == 5123 else 'f'
        bounds = None
        if key == 'POSITION':
            bounds = ([min(p[i] for p in rows) for i in range(3)], [max(p[i] for p in rows) for i in range(3)])
        skin_attributes[key] = append(struct.pack('<' + fmt * len(flat), *flat), old['type'], len(rows[0]), len(rows), old['componentType'], bounds)
    selected = [remap[v] for v in selected]
    primitives = [{'attributes': skin_attributes, 'material': 2, 'indices': append(struct.pack('<' + 'H' * len(selected), *selected), 'SCALAR', 1, len(selected), 5123)}]
    gltf['meshes'][2]['name'] = 'Clothed Tokyo traveller' if gender == 'Male' else 'Clothed Tokyo resident'
    sx, sy, sz = (1, 1, 1) if gender == 'Male' else (.88, .96, .92)

    def blend(a, b, t):
        return ([bone_names.index(a), bone_names.index(b), 0, 0], [1 - max(0, min(1, t)), max(0, min(1, t)), 0, 0])

    def torso_weights(p):
        y = p[1] / sy
        if y < 1.18:
            return blend('pelvis', 'spine_02', (y - .95) / .23)
        return blend('spine_02', 'spine_03', (y - 1.18) / .15)

    def add_loft(rings, material, weights_fn, axis='y', segments=24):
        pos, joints_out, weights_out, idx = [], [], [], []
        for center, r1, r2 in rings:
            for j in range(segments):
                a = j * math.tau / segments
                x, y, z = center
                if axis == 'y':
                    x += r1 * math.cos(a); z += r2 * math.sin(a)
                else:
                    z += r1 * math.cos(a); y += r2 * math.sin(a)
                p = (x * sx, y * sy, z * sz)
                js, ws = weights_fn(p)
                pos.extend(p); joints_out.extend(js); weights_out.extend(ws)
        for k in range(len(rings) - 1):
            for j in range(segments):
                a, b = k * segments + j, k * segments + (j + 1) % segments
                c, d = a + segments, b + segments
                idx.extend([a, c, b, b, c, d])
        count = len(pos) // 3
        attributes = {
            'POSITION': append(struct.pack('<' + 'f' * len(pos), *pos), 'VEC3', 3, count, bounds=([min(pos[i::3]) for i in range(3)], [max(pos[i::3]) for i in range(3)])),
            'JOINTS_0': append(struct.pack('<' + 'H' * len(joints_out), *joints_out), 'VEC4', 4, count, 5123),
            'WEIGHTS_0': append(struct.pack('<' + 'f' * len(weights_out), *weights_out), 'VEC4', 4, count),
        }
        primitives.append({'attributes': attributes, 'material': material, 'indices': append(struct.pack('<' + 'H' * len(idx), *idx), 'SCALAR', 1, len(idx), 5123)})

    add_loft([((0, y, -.025), rx, rz) for y, rx, rz in [(1.0, .178, .135), (1.035, .18, .137), (1.14, .176, .135), (1.31, .204, .145), (1.43, .215, .13), (1.49, .078, .075)]], 3, torso_weights)
    add_loft([((0, y, -.025), .08, .077) for y in [1.47, 1.525]], 3, torso_weights)
    for side, suffix in [(1, 'l'), (-1, 'r')]:
        arm = lambda p, s=suffix: blend('upperarm_' + s, 'lowerarm_' + s, (abs(p[0] / sx) - .40) / .10)
        rings = [((side * x, 1.4555, -.067), rz, ry) for x, rz, ry in [(.195, .078, .083), (.25, .07, .072), (.4, .061, .065), (.46, .058, .06), (.59, .052, .054), (.69, .045, .047)]]
        if side < 0:
            rings.reverse()
        add_loft(rings, 3, arm, 'x', 16)
        leg = lambda p, s=suffix: blend('calf_' + s, 'thigh_' + s, (p[1] / sy - .48) / .13)
        add_loft([((side * .1143, y, -.04), rx, rz) for y, rx, rz in [(.11, .067, .066), (.16, .071, .07), (.40, .078, .079), (.54, .08, .082), (.72, .091, .095), (.88, .105, .106), (.98, .108, .108)]], 4, leg, segments=20)
        foot = lambda p, s=suffix: blend('foot_' + s, 'foot_' + s, 0)
        add_loft([((side * .1143, y, -.005), rx, rz) for y, rx, rz in [(.005, .069, .15), (.025, .076, .155), (.07, .075, .151), (.105, .061, .12), (.14, .052, .07)]], 5, foot, segments=20)
    add_loft([((0, y, -.04), .19, .14) for y in [.88, .96, 1.025]], 4, torso_weights)
    # A rounded commuter backpack is part of the traveller silhouette.
    if gender == 'Male':
        gltf['materials'].append({'name': 'World backpack', 'pbrMetallicRoughness': {'baseColorFactor': [.18, .145, .105, 1], 'metallicFactor': 0, 'roughnessFactor': .93}})
        add_loft([((0, y, -.188), rx, rz) for y, rx, rz in [(1.05, .08, .045), (1.09, .125, .068), (1.35, .125, .068), (1.41, .07, .04)]], 6, torso_weights, segments=16)
    # One primitive per garment material keeps each person to eight draw calls.
    merged = [p for p in primitives if p['material'] == 2]
    for material in sorted({p['material'] for p in primitives if p['material'] != 2}):
        pos, js, ws, index_out = [], [], [], []
        for primitive in [p for p in primitives if p['material'] == material]:
            offset = len(pos)
            pos.extend(values(primitive['attributes']['POSITION']))
            js.extend(values(primitive['attributes']['JOINTS_0']))
            ws.extend(values(primitive['attributes']['WEIGHTS_0']))
            index_out.extend(v[0] + offset for v in values(primitive['indices']))
        def pack(rows, fmt):
            flat = [v for row in rows for v in row]
            return struct.pack('<' + fmt * len(flat), *flat)
        attributes = {
            'POSITION': append(pack(pos, 'f'), 'VEC3', 3, len(pos), bounds=([min(p[i] for p in pos) for i in range(3)], [max(p[i] for p in pos) for i in range(3)])),
            'JOINTS_0': append(pack(js, 'H'), 'VEC4', 4, len(pos), 5123),
            'WEIGHTS_0': append(pack(ws, 'f'), 'VEC4', 4, len(pos)),
        }
        merged.append({'attributes': attributes, 'material': material, 'indices': append(struct.pack('<' + 'H' * len(index_out), *index_out), 'SCALAR', 1, len(index_out), 5123)})
    gltf['meshes'][2]['primitives'] = merged
    for mesh in gltf['meshes'][:2]:
        for primitive in mesh['primitives']:
            primitive['attributes'] = {k: v for k, v in primitive['attributes'].items() if not k.startswith('COLOR')}

    # The supplied hairstyle is kept as geometry, bound entirely to the existing head joint.
    hp = prefix + 'Hairstyles/Origin at 0/glTF (Godot)/'
    hg = json.loads(source.read(hp + hair + '.gltf'))
    hb = source.read(hp + hair + '.bin')
    binary.extend(b'\0' * (-len(binary) % 4))
    offset, view_start, accessor_start = len(binary), len(gltf['bufferViews']), len(gltf['accessors'])
    binary.extend(hb)
    for view in hg['bufferViews']:
        gltf['bufferViews'].append({**view, 'buffer': 0, 'byteOffset': view.get('byteOffset', 0) + offset})
    for a in hg['accessors']:
        gltf['accessors'].append({**a, 'bufferView': a['bufferView'] + view_start})
    hpr = hg['meshes'][0]['primitives'][0]
    hattrs = {k: v + accessor_start for k, v in hpr['attributes'].items() if k in ['POSITION', 'NORMAL']}
    count = gltf['accessors'][hattrs['POSITION']]['count']
    head = bone_names.index('Head')
    hattrs['JOINTS_0'] = append(struct.pack('<4H', head, 0, 0, 0) * count, 'VEC4', 4, count, 5123)
    hattrs['WEIGHTS_0'] = append(struct.pack('<4f', 1, 0, 0, 0) * count, 'VEC4', 4, count)
    gltf['meshes'].append({'name': hair, 'primitives': [{'attributes': hattrs, 'indices': hpr['indices'] + accessor_start, 'material': 0}]})
    node = len(gltf['nodes'])
    gltf['nodes'].append({'name': hair, 'mesh': len(gltf['meshes']) - 1, 'skin': 0})
    gltf['nodes'][68]['children'].append(node)
    # Remove discarded source/intermediate views, not merely their JSON references.
    live_accessors = {p['indices'] for m in gltf['meshes'] for p in m['primitives']}
    live_accessors.update(i for m in gltf['meshes'] for p in m['primitives'] for i in p['attributes'].values())
    live_accessors.update(s['inverseBindMatrices'] for s in gltf['skins'])
    accessors = sorted(live_accessors)
    accessor_map = {old: i for i, old in enumerate(accessors)}
    live_views = {gltf['accessors'][i]['bufferView'] for i in accessors}
    live_views.update(i['bufferView'] for i in gltf['images'])
    compact, views, view_map = bytearray(), [], {}
    for old in sorted(live_views):
        view = gltf['bufferViews'][old]
        compact.extend(b'\0' * (-len(compact) % 4))
        view_map[old] = len(views)
        start = view.get('byteOffset', 0)
        views.append({**view, 'byteOffset': len(compact)})
        compact.extend(binary[start:start + view['byteLength']])
    gltf['accessors'] = [{**gltf['accessors'][i], 'bufferView': view_map[gltf['accessors'][i]['bufferView']]} for i in accessors]
    for m in gltf['meshes']:
        for p in m['primitives']:
            p['indices'] = accessor_map[p['indices']]
            p['attributes'] = {k: accessor_map[v] for k, v in p['attributes'].items()}
    for skin in gltf['skins']:
        skin['inverseBindMatrices'] = accessor_map[skin['inverseBindMatrices']]
    for image in gltf['images']:
        image['bufferView'] = view_map[image['bufferView']]
    gltf['bufferViews'], binary = views, compact
    gltf['buffers'] = [{'byteLength': len(binary)}]
    gltf['asset']['copyright'] = 'Quaternius CC0; Continuum clothing adaptation. See SOURCES.md.'
    gltf['asset']['extras'] = {'sourceArchiveSha256': SOURCE_HASH, 'clothed': True}
    j = json.dumps(gltf, separators=(',', ':')).encode()
    j += b' ' * (-len(j) % 4)
    binary.extend(b'\0' * (-len(binary) % 4))
    data = struct.pack('<III', 0x46546c67, 2, 12 + 8 + len(j) + 8 + len(binary)) + struct.pack('<II', len(j), 0x4e4f534a) + j + struct.pack('<II', len(binary), 0x004e4942) + binary
    (out / (name + '.glb')).write_bytes(data)
    files.append({'name': name, 'bytes': len(data), 'sha256': hashlib.sha256(data).hexdigest(), 'triangles': sum(gltf['accessors'][p['indices']]['count'] // 3 for m in gltf['meshes'] for p in m['primitives'])})
(out / 'LICENSE.txt').write_bytes(source.read(prefix + 'License_Standard.txt'))
(out / 'manifest.json').write_text(json.dumps({'license': 'CC0-1.0', 'sourceArchiveSha256': SOURCE_HASH, 'files': files}, indent=2) + '\n')
print(json.dumps(files, indent=2))
