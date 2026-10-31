// The node dojo: a toy compositor that mimics an Arclight graph in the browser.
// Images are Float32Array RGBA, linear light, premultiplied alpha — like the
// real engine — and only the viewer converts to 8-bit sRGB.

const W = 480
const H = 270

const toLinear = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
const toSrgb = (c) => {
  c = Math.min(Math.max(c, 0), 1)
  return c <= 0.0031308 ? c * 12.92 : 1.055 * c ** (1 / 2.4) - 0.055
}
const hexToLinear = (hex) => {
  const n = parseInt(hex.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => toLinear(v / 255))
}
const smoothstep = (a, b, x) => {
  const t = Math.min(Math.max((x - a) / (b - a), 0), 1)
  return t * t * (3 - 2 * t)
}

// ---- node definitions -------------------------------------------------------

const nodes = {
  checker: {
    label: 'Checkerboard', op: 'checkerboard', x: 20, y: 30, inputs: [],
    params: { size: 30, color_a: '#1b201d', color_b: '#343b37' },
    spec: [
      { key: 'size', type: 'range', min: 8, max: 90, step: 1 },
      { key: 'color_a', type: 'color' },
      { key: 'color_b', type: 'color' },
    ],
  },
  grade: {
    label: 'Grade', op: 'grade', x: 20, y: 130, inputs: ['checker'],
    params: { multiply: 1, gamma: 1, saturation: 1 },
    spec: [
      { key: 'multiply', type: 'range', min: 0, max: 3, step: 0.01 },
      { key: 'gamma', type: 'range', min: 0.2, max: 3, step: 0.01 },
      { key: 'saturation', type: 'range', min: 0, max: 2, step: 0.01 },
    ],
  },
  ellipse: {
    label: 'Ellipse', op: 'ellipse', x: 240, y: 30, inputs: [],
    params: { center_x: 240, center_y: 135, radius: 70, feather: 24, color: '#C5DD43', animate: true },
    spec: [
      { key: 'center_x', type: 'range', min: 0, max: W, step: 1 },
      { key: 'center_y', type: 'range', min: 0, max: H, step: 1 },
      { key: 'radius', type: 'range', min: 5, max: 160, step: 1 },
      { key: 'feather', type: 'range', min: 0, max: 80, step: 1 },
      { key: 'color', type: 'color' },
      { key: 'animate', type: 'check', hint: 'link center_x → expr "240 + 150 * sin(frame / 14)"' },
    ],
  },
  blur: {
    label: 'Blur', op: 'blur', x: 240, y: 130, inputs: ['ellipse'],
    params: { radius: 6, passes: 3 },
    spec: [
      { key: 'radius', type: 'range', min: 0, max: 40, step: 1 },
      { key: 'passes', type: 'range', min: 1, max: 4, step: 1 },
    ],
  },
  merge: {
    label: 'Merge', op: 'merge', x: 130, y: 220, inputs: ['blur', 'grade'],
    params: { operation: 'screen', mix: 1 },
    spec: [
      { key: 'operation', type: 'select', options: ['over', 'screen', 'add', 'multiply', 'max', 'min'] },
      { key: 'mix', type: 'range', min: 0, max: 1, step: 0.01 },
    ],
  },
  viewer: {
    label: 'Viewer', op: 'viewer', x: 130, y: 300, inputs: ['merge'], params: {}, spec: [],
  },
}

const NODE_W = 150
const NODE_H = 34

// ---- image ops ---------------------------------------------------------------

const newImage = () => new Float32Array(W * H * 4)

function renderChecker(p) {
  const out = newImage()
  const a = hexToLinear(p.color_a)
  const b = hexToLinear(p.color_b)
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const c = ((Math.floor(x / p.size) + Math.floor(y / p.size)) & 1) ? a : b
      const i = (y * W + x) * 4
      out[i] = c[0]; out[i + 1] = c[1]; out[i + 2] = c[2]; out[i + 3] = 1
    }
  }
  return out
}

function renderGrade(src, p) {
  const out = newImage()
  const g = 1 / p.gamma
  for (let i = 0; i < out.length; i += 4) {
    const a = src[i + 3]
    if (a <= 0) continue
    let r = Math.max(src[i] / a * p.multiply, 0) ** g
    let gg = Math.max(src[i + 1] / a * p.multiply, 0) ** g
    let b = Math.max(src[i + 2] / a * p.multiply, 0) ** g
    const l = 0.2126 * r + 0.7152 * gg + 0.0722 * b
    r = l + (r - l) * p.saturation
    gg = l + (gg - l) * p.saturation
    b = l + (b - l) * p.saturation
    out[i] = r * a; out[i + 1] = gg * a; out[i + 2] = b * a; out[i + 3] = a
  }
  return out
}

function renderEllipse(p, frame) {
  const out = newImage()
  const c = hexToLinear(p.color)
  const cx = p.animate ? 240 + 150 * Math.sin(frame / 14) : p.center_x
  const cy = p.center_y
  const f = Math.max(p.feather, 1)
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      // anti-aliased from the signed distance to the outline, feather centered on it
      const d = Math.hypot(x + 0.5 - cx, y + 0.5 - cy) - p.radius
      const a = 1 - smoothstep(-f / 2, f / 2, d)
      if (a <= 0) continue
      const i = (y * W + x) * 4
      out[i] = c[0] * a; out[i + 1] = c[1] * a; out[i + 2] = c[2] * a; out[i + 3] = a
    }
  }
  return out
}

function boxPass(src, dst, r, horizontal) {
  const n = 2 * r + 1
  const outer = horizontal ? H : W
  const inner = horizontal ? W : H
  for (let o = 0; o < outer; o++) {
    for (let ch = 0; ch < 4; ch++) {
      const idx = (k) => {
        const kk = Math.min(Math.max(k, 0), inner - 1)
        return (horizontal ? o * W + kk : kk * W + o) * 4 + ch
      }
      let sum = 0
      for (let k = -r; k <= r; k++) sum += src[idx(k)]
      for (let k = 0; k < inner; k++) {
        dst[(horizontal ? o * W + k : k * W + o) * 4 + ch] = sum / n
        sum += src[idx(k + r + 1)] - src[idx(k - r)]
      }
    }
  }
}

function renderBlur(src, p) {
  if (p.radius < 1) return src
  let a = Float32Array.from(src)
  let b = newImage()
  for (let i = 0; i < p.passes; i++) {
    boxPass(a, b, p.radius, true);  [a, b] = [b, a]
    boxPass(a, b, p.radius, false); [a, b] = [b, a]
  }
  return a
}

function renderMerge(A, B, p) {
  const out = newImage()
  for (let i = 0; i < out.length; i += 4) {
    const aa = A[i + 3]
    for (let ch = 0; ch < 4; ch++) {
      const a = A[i + ch]
      const b = B[i + ch]
      let v
      switch (p.operation) {
        case 'over': v = a + b * (1 - aa); break
        case 'screen': v = a + b - a * b; break
        case 'add': v = a + b; break
        case 'multiply': v = ch === 3 ? a + b - a * b : a * b; break
        case 'max': v = Math.max(a, b); break
        case 'min': v = Math.min(a, b); break
      }
      out[i + ch] = b + (v - b) * p.mix
    }
  }
  return out
}

// ---- evaluation (cached per node, like the engine) ------------------------------

const cache = new Map()
const hashOf = (id, frame) => {
  const n = nodes[id]
  const time = id === 'ellipse' && n.params.animate ? frame : 0
  return JSON.stringify([n.params, n.inputs.map((i) => hashOf(i, frame)), time])
}

function evaluate(id, frame) {
  const n = nodes[id]
  const h = hashOf(id, frame)
  const hit = cache.get(id)
  if (hit && hit.h === h) return hit.img
  const ins = n.inputs.map((i) => evaluate(i, frame))
  let img
  switch (n.op) {
    case 'checkerboard': img = renderChecker(n.params); break
    case 'grade': img = renderGrade(ins[0], n.params); break
    case 'ellipse': img = renderEllipse(n.params, frame); break
    case 'blur': img = renderBlur(ins[0], n.params); break
    case 'merge': img = renderMerge(ins[0], ins[1], n.params); break
    default: img = ins[0]
  }
  cache.set(id, { h, img })
  return img
}

// ---- UI ----------------------------------------------------------------------

export function initDojo() {
  const svg = document.getElementById('graph')
  const canvas = document.getElementById('viewer')
  const props = document.getElementById('props')
  const viewing = document.getElementById('viewing')
  const readout = document.getElementById('readout')
  const jsonOut = document.getElementById('graph-json')
  if (!svg || !canvas) return

  const ctx = canvas.getContext('2d')
  const imageData = ctx.createImageData(W, H)
  let selected = 'ellipse'
  let viewed = 'viewer'
  let frame = 1
  let current = null
  let dirty = true

  const ns = 'http://www.w3.org/2000/svg'
  const el = (tag, attrs, parent) => {
    const e = document.createElementNS(ns, tag)
    for (const k in attrs) e.setAttribute(k, attrs[k])
    parent?.appendChild(e)
    return e
  }

  function drawGraph() {
    svg.innerHTML = ''
    const wires = el('g', {}, svg)
    const ports = ['A', 'B']
    for (const [id, n] of Object.entries(nodes)) {
      n.inputs.forEach((src, k) => {
        const s = nodes[src]
        const x1 = s.x + NODE_W / 2
        const y1 = s.y + NODE_H
        const x2 = n.x + (n.inputs.length > 1 ? (k === 0 ? NODE_W * 0.3 : NODE_W * 0.7) : NODE_W / 2)
        const y2 = n.y
        const my = (y1 + y2) / 2
        el('path', { d: `M${x1},${y1} C${x1},${my} ${x2},${my} ${x2},${y2}`, class: 'wire' }, wires)
        if (n.inputs.length > 1) {
          const t = el('text', { x: x2 + 6, y: y2 - 6, class: 'port-label' }, wires)
          t.textContent = ports[k]
        }
      })
    }
    for (const [id, n] of Object.entries(nodes)) {
      const g = el('g', {
        class: `node node-${n.op}${id === selected ? ' selected' : ''}`,
        transform: `translate(${n.x},${n.y})`,
        tabindex: 0,
        role: 'button',
        'aria-label': `${n.label} node`,
      }, svg)
      el('rect', { width: NODE_W, height: NODE_H, rx: 6, class: 'node-body' }, g)
      el('rect', { width: 8, height: NODE_H, rx: 3, class: 'node-stripe' }, g)
      const t = el('text', { x: 18, y: 22, class: 'node-label' }, g)
      t.textContent = n.label
      if (id === viewed && id !== 'viewer') {
        const eye = el('text', { x: NODE_W - 22, y: 23, class: 'node-eye' }, g)
        eye.textContent = '◉'
      }
      n.inputs.forEach((_, k) => {
        const px = n.inputs.length > 1 ? (k === 0 ? NODE_W * 0.3 : NODE_W * 0.7) : NODE_W / 2
        el('rect', { x: px - 5, y: -5, width: 10, height: 10, class: 'port-in' }, g)
      })
      if (id !== 'viewer') el('circle', { cx: NODE_W / 2, cy: NODE_H, r: 5, class: 'port-out' }, g)

      const pick = () => {
        selected = id
        if (id === 'viewer') viewed = 'viewer'
        drawGraph(); drawProps(); dirty = true
      }
      g.addEventListener('click', pick)
      g.addEventListener('dblclick', () => { viewed = id; drawGraph(); dirty = true })
      g.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') pick()
        if (e.key.toLowerCase() === 'v') { viewed = id; drawGraph(); dirty = true }
      })
    }
  }

  function drawProps() {
    const n = nodes[selected]
    props.innerHTML = ''
    const h = document.createElement('h4')
    h.innerHTML = `${n.label} <span class="muted">${n.op}</span>`
    props.appendChild(h)
    if (!n.spec.length) {
      const p = document.createElement('p')
      p.className = 'muted'
      p.textContent = 'Pass-through: marks what the viewer shows. Double-click (or V) any node to view it directly; click the Viewer to go back.'
      props.appendChild(p)
    }
    for (const s of n.spec) {
      const row = document.createElement('label')
      row.className = 'prop'
      const name = document.createElement('span')
      name.className = 'prop-name'
      name.innerHTML = `<i class="key-diamond">◇</i>${s.key}`
      row.appendChild(name)
      let input
      if (s.type === 'select') {
        input = document.createElement('select')
        for (const o of s.options) {
          const opt = document.createElement('option')
          opt.value = opt.textContent = o
          input.appendChild(opt)
        }
        input.value = n.params[s.key]
      } else {
        input = document.createElement('input')
        input.type = s.type === 'range' ? 'range' : s.type === 'check' ? 'checkbox' : 'color'
        if (s.type === 'range') Object.assign(input, { min: s.min, max: s.max, step: s.step })
        if (s.type === 'check') input.checked = n.params[s.key]
        else input.value = n.params[s.key]
      }
      const val = document.createElement('output')
      const show = () => { val.textContent = s.type === 'range' ? (+n.params[s.key]).toFixed(s.step < 1 ? 2 : 0) : '' }
      show()
      input.addEventListener('input', () => {
        n.params[s.key] = s.type === 'check' ? input.checked : s.type === 'range' ? +input.value : input.value
        show(); dirty = true
      })
      row.appendChild(input)
      row.appendChild(val)
      props.appendChild(row)
      if (s.hint) {
        const hint = document.createElement('p')
        hint.className = 'hint'
        hint.textContent = s.hint
        props.appendChild(hint)
      }
    }
  }

  function writeJson() {
    const list = Object.entries(nodes).map(([id, n]) => {
      const params = { ...n.params }
      if (n.op === 'ellipse') {
        params.center = params.animate
          ? { link: { expr: '[240 + 150 * sin(frame / 14), ' + params.center_y + ']' } }
          : [params.center_x, params.center_y]
        params.size = [params.radius * 2, params.radius * 2]
        delete params.center_x; delete params.center_y; delete params.radius; delete params.animate
      }
      const o = { id, op: n.op }
      if (n.inputs.length) o.inputs = n.inputs
      if (Object.keys(params).length) o.params = params
      return '    ' + JSON.stringify(o)
    })
    jsonOut.textContent = `{\n  "nodes": [\n${list.join(',\n')}\n  ]\n}`
  }

  function render() {
    const id = viewed === 'viewer' ? 'merge' : viewed
    current = evaluate(id, frame)
    const d = imageData.data
    for (let i = 0; i < current.length; i += 4) {
      d[i] = toSrgb(current[i]) * 255
      d[i + 1] = toSrgb(current[i + 1]) * 255
      d[i + 2] = toSrgb(current[i + 2]) * 255
      d[i + 3] = 255
    }
    ctx.putImageData(imageData, 0, 0)
    viewing.textContent = (viewed === 'viewer' ? '' : `· showing ${nodes[viewed].label} `) + `· frame ${frame}`
    writeJson()
  }

  canvas.addEventListener('mousemove', (e) => {
    if (!current) return
    const r = canvas.getBoundingClientRect()
    const x = Math.floor(((e.clientX - r.left) / r.width) * W)
    const y = Math.floor(((e.clientY - r.top) / r.height) * H)
    const i = (y * W + x) * 4
    const f = (v) => v.toFixed(4)
    readout.textContent = `x ${x} y ${y}   R ${f(current[i])}  G ${f(current[i + 1])}  B ${f(current[i + 2])}  A ${f(current[i + 3])}`
  })

  // only animate while the dojo is on screen
  let visible = false
  new IntersectionObserver(([e]) => { visible = e.isIntersecting }).observe(canvas)
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  let last = 0
  function tick(t) {
    if (visible && nodes.ellipse.params.animate && !reduce && t - last > 40) {
      frame = frame >= 240 ? 1 : frame + 1
      last = t
      dirty = true
    }
    if (dirty && visible) { dirty = false; render() }
    requestAnimationFrame(tick)
  }

  drawGraph()
  drawProps()
  render()
  requestAnimationFrame(tick)
}
