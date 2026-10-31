# ArclightVFX feature and marketing inventory

Reviewed against the sibling `../arclight` checkout on October 31, 2026. `Cargo.toml` identifies development version **0.13.21**. This is a source review, not a runtime certification or verification of public release assets. The README's opening version text is older than the manifest and changelog. Website copy therefore says active beta and distinguishes development capabilities from downloadable builds.

Positioning: **An open-source, Rust-based node compositor for indie VFX artists, combining GPU-accelerated 2D and 3D, procedural geometry and Gaussian splats in one graph.**

| Feature present in the development source | Value for independent artists | Local evidence in `../arclight/` |
| --- | --- | --- |
| Node graph, properties, viewer, timeline, undo/redo, autosave, cached evaluation | Break a complex shot into editable steps and iterate without rebuilding everything | `README.md` GUI; `src/graph.rs`, `src/gui/`, `src/session.rs` |
| Rust engine; 32-bit float RGBA, linear light, premultiplied alpha | Preserve highlight range and composite soft edges consistently | `README.md` Design; `src/image.rs`, `src/color.rs` |
| GPU paths for Blur, Keyer, lens distortion and motion-blurred warps; conditional GPU color, merge, channel and resize operations | Use supported hardware while refining keys and combining layers | `README.md` GPU acceleration; `src/gpu/ops.rs`, `src/gpu/*.wgsl` |
| GPU scanline rendering, shaded preview, shadows, motion blur, splats and large particle sprites; GPU result and playback caches | See CG elements and captures together while shaping the shot | `src/render3d/gpu/`, `src/gpu/display.rs`; `README.md` GPU acceleration |
| CPU paths and GPU diagnostics | Keep working when an operation or scene cannot use the GPU | `src/gpu/check.rs`, `README.md` GPU acceleration |
| Keyer, despill, masks, grade, channel tools and Light 2D | Combine greenscreen footage, match layers and adjust supported passes | `README.md` Operators; `src/ops.rs` |
| Bezier roto, feathered shapes, transforms, corner pin and lens distortion | Isolate foregrounds, replace screens and fit inserts to the plate | `src/shape.rs`, `src/ops.rs`, `src/gui/overlay.rs` |
| 2D tracking, stabilization, linked transforms/corner pins; camera tracking with focal and lens solves | Make graphics or CG follow a moving camera | `src/track.rs`, `src/camtrack.rs`, `src/sfm.rs` |
| 3D cameras, cards, mesh primitives, Alembic input, lights, shadows, holdouts and render passes | Build set extensions and combine imported CG with live action | `src/scene.rs`, `src/render3d.rs`, `src/alembic.rs`; `README.md` Operators |
| Procedural geometry nodes: Scatter, Instance on Points, Transform/Delete Geo, Fit Plane, attributes, noise, falloffs and image sampling; geometry spreadsheet | Populate sets with repeated detail, vary assets procedurally and inspect the data | `src/geo_ops.rs`, `src/geo_attr.rs`, `src/geo_table.rs`; `examples/geo-scatter.json`; `CHANGELOG.md` phase 13 |
| Gaussian splat import in supported PLY, SPLAT and SPZ layouts, crop/color nodes, depth integration with meshes/cards, holdouts and motion blur | Bring an existing captured environment into the comp and clean or grade it | `src/splat.rs`, `src/render3d/splats.rs`, `src/render3d/gpu/splat_view.rs`; `README.md` Operators |
| Particles, forces, sprite sequences, object rendering and 2D output | Add sparks, drifting detail and motion trails | `src/particles.rs`, `src/particle_nodes.rs`, `src/particles_render.rs` |
| Keyframes, curve editing, live parameter links and formulas | Refine timing and reuse procedural relationships across a shot | `src/anim.rs`, `src/expr.rs`, `src/link.rs` |
| EXR passes/data windows, DPX, TIFF, numbered sequences and video codecs through FFmpeg | Exchange plates, CG passes and review outputs with other tools | `src/image.rs`, `src/media.rs`, `src/render.rs`; `README.md` I/O formats |
| Python `arclt`, CLI, MCP and native plugin interface | Automate repeated setup, render headlessly and extend the workflow | `python/`, `src/main.rs`, `src/mcp.rs`, `include/arclight_plugin.h` |
| MIT OR Apache-2.0 licensing; documented Linux and universal macOS packaging | Access and adapt the software without a software license fee | `Cargo.toml`, `README.md` License and Build; `packaging/` |

## Scope and future direction

- GPU support is selective, with hardware, memory and operation constraints. No universal realtime or speedup claim is made.
- Geometry nodes are Arclight's procedural geometry tools; this does not claim Blender Geometry Nodes file compatibility or an external GeoNode integration.
- Splat support imports existing captures. It does not claim capture reconstruction or training. Splats are self-lit; importing them does not provide physically based relighting.
- Linear-light compositing is implemented. Full OCIO viewer color management and tiled/region-of-interest evaluation remain roadmap ideas in `README.md`.
- The product is beta. No claim of feature parity, production certification or project-file compatibility with established film compositors is made.
- Available platform packages and feature coverage depend on the chosen release. Public release contents were not checked during this local review.

## Website directions

All four sites use this inventory and retain the node demo, filtered catalog, scripting examples and release links. The browser demo illustrates the workflow; it does not run the Rust compositor.

1. `website1`: restrained product branding with teal/lime accents.
2. `website2`: warm illustrated anime and manga presentation.
3. `website3`: dark technical direction with cyan/violet instrumentation.
4. `website4`: loud anime title-card direction, pink/yellow/cyan palette, heavy ink borders, speed lines and an original vector portal/city illustration.
