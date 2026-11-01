// Product copy verified against the Arclight 0.13.21 development source.
// See ../../FEATURES.md for scope, evidence and release caveats.

import type { IconName } from './icons'

export type CategoryId = 'all' | 'color' | 'comp' | 'warp' | 'shape' | 'track' | '3d' | 'geo' | 'fx' | 'io'

export interface Category {
  id: CategoryId
  label: string
  icon: IconName
}

export interface Op {
  cat: Exclude<CategoryId, 'all'>
  name: string
  desc: string
  mask?: boolean
}

export interface Episode {
  tag: string
  title: string
  icon: IconName
  body: string
  bullets: string[]
}

export type CodeLang = 'python' | 'json' | 'sh'

export interface CodeSample {
  id: string
  label: string
  lang: CodeLang
  note: string
  code: string
}

export const categories: Category[] = [
  { id: 'all', label: 'All', icon: 'grid' },
  { id: 'color', label: 'Color', icon: 'color' },
  { id: 'comp', label: 'Merge & Key', icon: 'layers' },
  { id: 'warp', label: 'Transform', icon: 'transform' },
  { id: 'shape', label: 'Shapes & Roto', icon: 'curve' },
  { id: 'track', label: 'Tracking', icon: 'target' },
  { id: '3d', label: '3D', icon: 'cube' },
  { id: 'geo', label: 'Geometry Nodes', icon: 'cube' },
  { id: 'fx', label: 'Particles', icon: 'particles' },
  { id: 'io', label: 'I/O', icon: 'io' },
]

export const ops: Op[] = [
  { cat: 'geo', name: 'Scatter · Instance on Points', desc: 'Dress sets with meshes, cards or splat captures. Scatter over surfaces, within volumes or on tracker points; control density with a mask.' },
  { cat: 'geo', name: 'Attribute Set · Attribute Noise', desc: 'Vary position, size and color with formulas and repeatable noise instead of editing every element by hand.' },
  { cat: 'geo', name: 'Falloff · Attribute from Image', desc: 'Shape procedural changes by distance or a soft region, and sample a plate or painted map into geometry attributes.' },
  { cat: 'geo', name: 'Transform Geo · Delete Geo', desc: 'Move groups together or remove points, faces and instances with a region or expression. Inspect the result in the geometry spreadsheet.' },
  { cat: 'geo', name: 'Fit Plane · Realize Instances', desc: 'Fit a ground or holdout plane to solved points; turn instances into individual scene objects for further edits.' },
  { cat: 'color', name: 'Grade', desc: 'Lift / gain / gamma per channel on unassociated color.', mask: true },
  { cat: 'color', name: 'Exposure', desc: 'Push or pull in photographic stops (×2 per stop).', mask: true },
  { cat: 'color', name: 'Saturation', desc: 'About Rec. 709 luminance; 0 is grayscale.', mask: true },
  { cat: 'color', name: 'Invert · Clamp', desc: 'On unpremultiplied values; alpha kept in 0–1.', mask: true },
  { cat: 'color', name: 'Light 2D', desc: 'Relight a plate: spot, area, point or directional, with normals and depth inputs.', mask: true },
  { cat: 'comp', name: 'Merge', desc: 'over, under, add, multiply, screen, min, max, and zmerge by depth passes. Swap A/B in one click.', mask: true },
  { cat: 'comp', name: 'Keyer', desc: 'Green/blue screen: auto screen color, clean plate, despill, shrink/grow, edge softness. Ctrl+drag to pick.', mask: true },
  { cat: 'comp', name: 'Keymix · Dissolve', desc: 'Mix A over B through a matte, or cross-fade.', mask: true },
  { cat: 'comp', name: 'Shuffle · Channel Select', desc: 'Move render passes (P, N, depth, mattes, diffuse…) into and out of RGBA.' },
  { cat: 'comp', name: 'Switch', desc: 'Five inputs; keyframe which one to cut between.' },
  { cat: 'warp', name: 'Transform', desc: 'Translate, scale, rotate about a pivot, with filtered resampling and an on-viewer gizmo.', mask: true },
  { cat: 'warp', name: 'Corner Pin', desc: 'Perspective warp From quad → To quad, with motion blur over the shutter.', mask: true },
  { cat: 'warp', name: 'Lens Distort', desc: 'Brown model K1/K2 — undistort a plate or put the lens back on CG.', mask: true },
  { cat: 'warp', name: 'Crop · Resize · Blur', desc: 'Clear outside or shrink canvas; box-filtered resize; 3-pass ≈ gaussian blur.', mask: true },
  { cat: 'shape', name: 'Rectangle · Ellipse', desc: 'Anti-aliased from signed distance, feathered, animatable, motion-blurred.' },
  { cat: 'shape', name: 'Polygon', desc: 'Box-select vertices, transform groups, non-zero or even-odd fill.' },
  { cat: 'shape', name: 'Roto', desc: 'Closed bezier with tangent handles, broken tangents, and per-shape motion blur.' },
  { cat: 'track', name: 'Tracker', desc: 'Up to four tracks, translate / rotate / scale. Match-move or stabilize; export linked Transforms or Corner Pins.' },
  { cat: 'track', name: 'Camera Tracker', desc: 'Feature solve (free move or tripod), solved focal and lens distortion, masks for moving objects, Export Linked.' },
  { cat: 'track', name: 'Point Cloud · Locator', desc: 'Solved points in 3D; drop cards and locators straight onto them.' },
  { cat: '3d', name: 'Camera · Scene · Scanline Render', desc: 'Perspective or true orthographic, n×n anti-aliasing, motion blur, render passes, holdouts.' },
  { cat: '3d', name: 'Card · Cube · Sphere · Cylinder · Plane', desc: 'Unlit, Lambert or Blinn shading, emission, shadows cast and received.' },
  { cat: '3d', name: 'Lights', desc: 'Ambient, directional, point, spot and area — falloff, exposure, soft shadows, Look-at targets.' },
  { cat: '3d', name: 'Read Geo', desc: 'Alembic (.abc, Ogawa): animated transforms and deforming meshes from Blender, Maya, Houdini.' },
  { cat: '3d', name: 'Read Splat · Splat Crop · Splat Color', desc: 'Gaussian splat captures (.ply / .splat / .spz) composited with cards and meshes by depth.' },
  { cat: 'fx', name: 'Particle Emitter', desc: 'Point, line, disk, sphere, box, geometry surface or mask — rate, bursts, speed, spread.' },
  { cat: 'fx', name: 'Forces', desc: 'Gravity, wind, curl-noise turbulence, attractor, vortex, bounce, kill, speed limit.' },
  { cat: 'fx', name: 'Particle Render', desc: 'Points, sprites (with texture sequences) or 3D objects; over or additive; streaks under motion blur.' },
  { cat: 'fx', name: 'Particles 2D', desc: 'Draw particles straight onto a plate — no camera needed.' },
  { cat: 'io', name: 'Media In · Read', desc: 'Stills, sequences, video; auto frame range; fit / fill to the project format.' },
  { cat: 'io', name: 'Media Out · Write', desc: 'Render ranges to EXR (all passes), DPX, TIFF, ProRes, DNxHR, HEVC, AV1, VP9 — with audio.' },
  { cat: 'io', name: 'Native plugins', desc: 'A small C ABI; plugins run isolated in helper processes, so a crash is just a node error.' },
]

export const episodes: Episode[] = [
  {
    tag: 'GEO', title: 'Build detail procedurally', icon: 'cube',
    body: 'Turn a few assets into a dressed environment with geometry nodes. Scatter stable points, instance your meshes or cards, then use attributes to vary size, orientation and tint. Project a plate into attributes to help the detail belong in the shot.',
    bullets: ['Surface, volume and tracker-point scattering', 'Noise, masks and distance falloffs', 'Geometry spreadsheet for inspecting points and instances'],
  },
  {
    tag: '3D',
    title: 'Build the set around your plate',
    icon: 'cube',
    body: 'Press Tab over the viewer. Orbit, numpad views, a pie menu on backtick, G / R / S with typed values (G X 2 Enter), axis-constrained gizmos. Cards draw textured, cameras draw frusta and paths, solved point clouds draw colored by error.',
    bullets: ['Look through any camera or light (0)', 'Motion-blur preview once the view settles', 'One-click 3D Camera Setup on any wire'],
  },
  {
    tag: 'TRACK',
    title: 'Make your CG follow the camera',
    icon: 'target',
    body: '2D tracks become live-linked Transforms and Corner Pins. The Camera Tracker solves the shot — including K1/K2 lens distortion — and exports a Camera that follows the solve if you re-solve or reset the origin.',
    bullets: ['Mask out moving objects', 'Pick points over the rendered scene', 'Place cards and locators on solved points'],
  },
  {
    tag: 'SPLAT',
    title: 'Gaussian splats in the comp',
    icon: 'cloud',
    body: 'Import existing captures in supported .ply, .splat or .spz layouts with spherical harmonics up to degree 3. They render with your cards and meshes, sorted by depth, with passes, holdouts and motion blur.',
    bullets: ['Splat Crop: clear floaters with a 3D box', 'Splat Color: grade exactly from every angle', 'GPU rendering paths with CPU fallback'],
  },
  {
    tag: 'FX',
    title: 'Add sparks, trails and atmosphere',
    icon: 'particles',
    body: 'Emit from shapes, geometry or a mask; push with gravity, wind, curl noise and vortices; bounce off planes. Render as sprites with looping texture sequences, or instance 3D objects. Streaks curve under gravity with motion blur.',
    bullets: ['Emitters on moving cards leave trails', 'Simulations shared and stepped, not re-run', 'Forces editable with 3D gizmos'],
  },
  {
    tag: 'EXPR',
    title: 'Live links & formulas',
    icon: 'code',
    body: 'Any param can follow another node live, or hold a formula: wiggle(), noise(), smoothstep(), at(x, frame - 3) to lag a track. Repeatable — the same frame always gives the same value.',
    bullets: ['× and + offsets on any link', 'Renaming a source updates its links', 'Works between frames for motion blur'],
  },
  {
    tag: 'BLUR',
    title: 'Motion blur everywhere',
    icon: 'motion',
    body: 'Shapes, Corner Pin, Scanline Render and particles all sample across a configurable shutter (centered, start or end) with jittered sampling that turns into grain instead of ghosted copies at low counts.',
    bullets: ['Per-node samples & shutter', 'Animated cameras blur the whole view', 'Exact, not a vector-blur fake'],
  },
]

export const codeSamples: CodeSample[] = [
  {
    id: 'python',
    label: 'Python · arclt',
    lang: 'python',
    note: 'pip install the wheel from a release. arclt.attach() edits the project open in the GUI, live.',
    code: `import arclt

bg   = arclt.create_node("checkerboard", width=960, height=540)
sun  = arclt.create_node("ellipse", width=960, height=540,
                         center=[480, 270], size=[260, 260],
                         color=[1, 0.45, 0.1, 1], feather=30)
comp = arclt.create_node("merge", sun, bg)     # inputs by port: A, B
comp["operation"] = "screen"                    # validated on set

sun.set_key("center", 1, [200, 270]).set_key("center", 48, [760, 270])
arclt.render(comp, frame=24, path="/tmp/comp.exr")
img = arclt.to_numpy(comp, 24)                  # (h, w, 4) float32

arclt.attach()   # from now on, drive the running GUI`,
  },
  {
    id: 'mcp',
    label: 'MCP · AI agents',
    lang: 'sh',
    note: 'list_ops, create_node, render_frame (with a PNG preview the model can see), select_node, view_node, get_view, undo…',
    code: `# JSON-RPC 2.0 over stdio
arclight mcp comp.json

# …or over HTTP
arclight mcp --http 127.0.0.1:7878

# …or drive the GUI you already have open
arclight mcp --attach

# register with an MCP client
claude mcp add arclight -- /path/to/arclight mcp`,
  },
  {
    id: 'json',
    label: 'Graph JSON',
    lang: 'json',
    note: 'A graph is a list of nodes. Any numeric param can become a keyframe curve.',
    code: `{
  "nodes": [
    { "id": "bg",  "op": "checkerboard", "params": { "width": 640, "height": 480 } },
    { "id": "fg",  "op": "read",  "params": { "path": "plate.exr" } },
    { "id": "cc",  "op": "grade", "inputs": ["fg"],
      "params": { "multiply": { "keys": [[1, [1,1,1]], [24, [1.1,1.0,0.9]]],
                                "interp": "smooth" } } },
    { "id": "out", "op": "merge", "inputs": ["cc", "bg"],
      "params": { "operation": "over" } },
    { "id": "w",   "op": "write", "inputs": ["out"], "params": { "path": "comp.png" } }
  ]
}`,
  },
  {
    id: 'expr',
    label: 'Formulas',
    lang: 'json',
    note: 'node.param, frame, time, fps, noise, random, wiggle, mix, smoothstep, at(x, f)…',
    code: `{"link": {"expr": "tracker1.track1 + [wiggle(0.1, 5, 1), wiggle(0.1, 5, 2)]"}}
{"link": {"expr": "45 * sin(frame / 8)"}}
{"link": {"expr": "mix(a.color, b.color, smoothstep(1, 24, frame))"}}
{"link": {"expr": "at(t.track1, frame - 3)"}}

{"link": {"node": "tracker1", "motion": "translate",
          "stabilize": false, "pivot": [960.5, 540.5]}}`,
  },
  {
    id: 'plugin',
    label: 'Native plugins',
    lang: 'sh',
    note: 'Plugins declare ops as JSON and get float RGBA buffers. They run in isolated helper processes; a crash restarts on the next render.',
    code: `# build the example plugin (Vignette, Film Grain)
cargo build --release -p arclight-plugin-example

# drop it on the search path
cp target/release/libarclight_plugin_example.so \\
   ~/.local/share/arclight/plugins/

arclight plugins        # search path + what loaded
arclight ops vignette   # the op catalog`,
  },
]
