# World people — source and adaptation

Base faces, exposed hands, humanoid skeletons, eyes and hairstyles: **Quaternius**, Universal Base Characters, free Standard edition, CC0 1.0.

- Author and pack-specific license: https://quaternius.com/packs/universalbasecharacters.html
- Original license: `LICENSE.txt`, copied verbatim from the Standard archive.
- Author's distribution: https://quaternius.itch.io/universal-base-characters
- Exact archived Standard source used for reproducibility: https://github.com/WaviestSun/atelier-packs/releases/download/packs-2/Universal-Base-Characters-Standard.zip
- Source ZIP SHA-256: `fdbf1804c90dfc1ea03e992bff7da2dfd1a79318e13270a660180f9308455f40`

The source archive's own `License_Standard.txt` confirms CC0. The mirror's repository license is not used as the model license. No Source/paid kit content is included.

Continuum adaptation: original clothed shirt, collar, sleeves, trousers, sneakers and commuter backpack; exposed-body crop; combined materials; embedded original unmodified skin/eye images; head-bound source hairstyles; runtime resting-arm pose and joint-based locomotion. The delivered GLBs are clothed. The original underwear-only bodies are not shipped as selectable models. Clothing has independent geometry rather than coloring anatomy. This art remains stylized, not a scan of a real person.

Build from the pinned ZIP using Python's standard library:

```sh
python scripts/build-world-people.py /path/to/Universal-Base-Characters-Standard.zip
```

`manifest.json` records each final file's exact byte size, triangle count and SHA-256. The GLBs are self-contained and served from the app origin. There are no runtime requests to Quaternius, itch.io or the mirror, and no embedded external model/image URLs. The ZIP is an intermediate input, not part of the application.
