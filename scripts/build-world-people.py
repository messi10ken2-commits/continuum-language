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
    rows_by_attribute = {key: values(index) for key, index in attrs.items()}
    skin_rows = {key: [] for key in attrs}
    selected = []
    skin_vertex_cache = {}
    cutoff = 1.54 if gender == 'Male' else 1.48
    head_weights = [sum(w for j, w in zip(js, ws) if bone_names[j] == 'Head' or bone_names[j].startswith('neck')) for js, ws in zip(joints, weights)]

    def source_vertex(index):
        return {key: rows[index] for key, rows in rows_by_attribute.items()}

    def interpolate(a, b, t):
        result = {key: tuple(x + (y - x) * t for x, y in zip(a[key], b[key])) for key in attrs if key not in ['JOINTS_0', 'WEIGHTS_0']}
        influences = {}
        for vertex, factor in [(a, 1 - t), (b, t)]:
            for joint, weight in zip(vertex['JOINTS_0'], vertex['WEIGHTS_0']):
                influences[joint] = influences.get(joint, 0) + weight * factor
        chosen = sorted(influences.items(), key=lambda pair: pair[1], reverse=True)[:4]
        chosen += [(0, 0)] * (4 - len(chosen))
        total = sum(w for j, w in chosen)
        result['JOINTS_0'] = tuple(j for j, w in chosen)
        result['WEIGHTS_0'] = tuple(w / total for j, w in chosen)
        return result

    for i in range(0, len(indices), 3):
        tri = indices[i:i + 3]
        polygon = [source_vertex(v) for v in tri]
        if any(head_weights[v] > .5 for v in tri):
            # Clip the crossing triangles instead of deleting the whole neck ring.
            # UVs/normals and normalized bone weights follow the exact intersection.
            clipped = []
            for a, b in zip(polygon, polygon[1:] + polygon[:1]):
                inside_a, inside_b = a['POSITION'][1] >= cutoff, b['POSITION'][1] >= cutoff
                if inside_a:
                    clipped.append(a)
                if inside_a != inside_b:
                    t = (cutoff - a['POSITION'][1]) / (b['POSITION'][1] - a['POSITION'][1])
                    clipped.append(interpolate(a, b, t))
            polygon = clipped
        elif not all(regions[v] == 2 for v in tri):
            continue
        for corner in range(1, len(polygon) - 1):
            for vertex in [polygon[0], polygon[corner], polygon[corner + 1]]:
                cache_key = tuple((key, tuple(round(value, 7) for value in vertex[key])) for key in attrs)
                if cache_key not in skin_vertex_cache:
                    skin_vertex_cache[cache_key] = len(skin_rows['POSITION'])
                    for key in attrs:
                        skin_rows[key].append(vertex[key])
                selected.append(skin_vertex_cache[cache_key])
    skin_attributes = {}
    for key, rows in skin_rows.items():
        old = gltf['accessors'][attrs[key]]
        flat = [v for row in rows for v in row]
        fmt = {5121: 'B', 5123: 'H', 5126: 'f'}[old['componentType']]
        bounds = None
        if key == 'POSITION':
            bounds = ([min(p[i] for p in rows) for i in range(3)], [max(p[i] for p in rows) for i in range(3)])
        skin_attributes[key] = append(struct.pack('<' + fmt * len(flat), *flat), old['type'], len(rows[0]), len(rows), old['componentType'], bounds)
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

    def add_loft(rings, material, weights_fn, axis='y', segments=24, waist_side=None):
        pos, joints_out, weights_out, idx = [], [], [], []
        for center, r1, r2 in rings:
            for j in range(segments):
                a = j * math.tau / segments
                x, y, z = center
                if axis == 'y':
                    x += r1 * math.cos(a); z += r2 * math.sin(a)
                else:
                    z += r1 * math.cos(a); y += r2 * math.sin(a)
                if waist_side is not None and y > .84:
                    t = min(1, (y - .84) / .185)
                    x = (1 - t) * x + t * waist_side * max(0, waist_side * .18 * math.cos(a))
                    z = (1 - t) * z + t * (-.04 + .14 * math.sin(a))
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

    add_loft([((0, y, -.025), rx, rz) for y, rx, rz in [(1.0, .178, .135), (1.035, .18, .137), (1.14, .176, .135), (1.31, .204, .145), (1.43, .23, .135), (1.47, .225, .13), (1.525, .13, .10)]], 3, torso_weights)
    add_loft([((0, y, -.055), rx, rz) for y, rx, rz in [(1.515, .15, .105), (1.54, .13, .095), (1.565, .108, .085)]], 3, torso_weights)
    for side, suffix in [(1, 'l'), (-1, 'r')]:
        arm = lambda p, s=suffix: blend('upperarm_' + s, 'lowerarm_' + s, (abs(p[0] / sx) - .40) / .10)
        rings = [((side * x, 1.4555, -.067), rz, ry) for x, rz, ry in [(.19, .001, .001), (.23, .07, .072), (.30, .067, .07), (.4, .061, .065), (.46, .058, .06), (.59, .052, .054), (.69, .045, .047)]]
        if side < 0:
            rings.reverse()
        add_loft(rings, 3, arm, 'x', 16)
        leg = lambda p, s=suffix: blend('thigh_' + s, 'pelvis', (p[1] / sy - .84) / .185) if p[1] / sy > .84 else blend('calf_' + s, 'thigh_' + s, (p[1] / sy - .48) / .13)
        add_loft([((side * .1143, y, -.04), rx, rz) for y, rx, rz in [(.11, .067, .066), (.16, .071, .07), (.40, .078, .079), (.54, .08, .082), (.72, .091, .095), (.84, .105, .106), (.93, .108, .108), (1.025, .108, .108)]], 4, leg, segments=24, waist_side=side)
        foot = lambda p, s=suffix: blend('foot_' + s, 'foot_' + s, 0)
        add_loft([((side * .1143, y, -.005), rx, rz) for y, rx, rz in [(.005, .069, .15), (.025, .076, .155), (.07, .075, .151), (.105, .061, .12), (.14, .052, .07)]], 5, foot, segments=20)
    # A rounded commuter backpack is part of the traveller silhouette.
    if gender == 'Male':
        gltf['materials'].append({'name': 'World backpack', 'pbrMetallicRoughness': {'baseColorFactor': [.18, .145, .105, 1], 'metallicFactor': 0, 'roughnessFactor': .93}})
        add_loft([((0, y, -.188), rx, rz) for y, rx, rz in [(1.05, .08, .045), (1.09, .125, .068), (1.35, .125, .068), (1.41, .07, .04)]], 6, torso_weights, segments=16)
        for side in [-1, 1]:
            for path in [[(1.08, .11), (1.28, .125), (1.40, .10), (1.46, -.04)], [(1.10, -.22), (1.30, -.23), (1.41, -.18), (1.46, -.04)]]:
                add_loft([((side * .14, y, z), .014, .009) for y, z in path], 6, torso_weights, segments=8)
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
(out.parents[2] / 'continuum-world-people-assets.mjs').write_text('// Generated by scripts/build-world-people.py. Content versions keep immutable browser caches correct.\nexport const worldPeopleAssets = ' + json.dumps({f['name']: '/world-tokyo/people/' + f['name'] + '.glb?v=' + f['sha256'][:16] for f in files}, indent=2) + ';\n')
(out / 'manifest.json').write_text(json.dumps({'license': 'CC0-1.0', 'sourceArchiveSha256': SOURCE_HASH, 'files': files}, indent=2) + '\n')
print(json.dumps(files, indent=2))
