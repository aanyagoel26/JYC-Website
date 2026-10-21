# JYC complete source image archive

This folder is the complete import of the five supplied `all-extracted-images-part*.zip` archives.

- **873 source files** retained as individual archive entries.
- **813 unique binary sources**; duplicates are retained as separate logical entries rather than silently dropped.
- Raster assets are optimized to **WebP**, max 2200 px, quality 82, for practical public-folder delivery.
- SVG assets remain SVG.
- `catalog.json` is the source-of-truth manifest with original path, original SHA-256, stored path, stored SHA-256, size and category.

## Folder taxonomy

- `clubs/<slug>/` — hub/club material.
- `festivals/aakriti/` — Aakriti festival material.
- `sports/` — sports photography and graphics.
- `gallery/campus-events/` — general campus, people and event photography.
- `design-assets/` — reusable textures, frames, QR codes and presentation graphics.
- `archive/presentation-assets/` — source visuals that could not be safely attributed to one club/event.

The categorisation is deliberately conservative: presentation graphics are not labelled as photography.
