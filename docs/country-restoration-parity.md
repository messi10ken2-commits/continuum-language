# Additional-language restoration parity

All ten living maps use one phase/state/rendering path: 0 quiet, 1 restored station, 2 cafe opens, 3 garden restores, 4 evening with isolated moving objects. Additional-language headers are static. Country-only mini-trains, CSS walking figures and brightness-filter approximations have been removed.

Twelve built-in image edits preserve the existing Chinese, Korean, French, German, Arabic and Italian landscape composition while providing closed/neglected quiet daytime and genuinely illuminated blue-hour evening states. Runtime assets are public/country-worlds/{zh,ko,fr,de,ar,it}/{quiet,evening}-v2.webp. The existing panorama.webp is the restored daytime plate. Exact edit prompts and region/state mapping are in country-restoration-prompts.json.

The same shared station/cafe/garden masks, phase-4 unlock, painted person sprite, eight diners at four fixed tables, isolated clouds, lamp glows, replay/pause and reduced-motion rules apply to all ten languages. The evening edits leave cafe terraces clear so seated people and furniture are not duplicated in the base image. Regional placements are authored in the same manifest format as the original four worlds.

All worlds use the same daylight-to-evening crossfade when a completion advances the restoration. Scenery remains stationary. Reduced motion shows the completed evening plate immediately. Train and rail overlays are no longer rendered in the living maps.

Coverage expands original map-motion regression cases to all ten languages and CEFR paths. Dedicated header tests cover all sections; Chromium/WebKit checks advance each additional world through phases 0–4, verify static headers, distinct quiet/day/evening plates, shared final-stage figures/diners/tables, the night crossfade, and reduced motion.

Restoration correction: early station and cafe reveals are clipped to separate landmark regions, so cafe opening cannot reveal the adjacent garden. Chapter three reveals the complete restored daytime plate, including flowers throughout the neighbourhood. Chapter four remains evening. Runtime train and rail overlays have been removed from all ten living maps.
