import './style.css'
import { categories, ops, episodes, codeSamples } from './data.js'
import { initDojo } from './dojo.js'
import { icon } from './icons.js'

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

// ---- background sky: drifting light petals and sparks ----------------------------

function initSky() {
  const canvas = document.getElementById('sky')
  const ctx = canvas.getContext('2d')
  let w, h, dpr
  const petals = []
  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2)
    w = canvas.width = innerWidth * dpr
    h = canvas.height = innerHeight * dpr
  }
  resize()
  addEventListener('resize', resize)

  const count = innerWidth < 700 ? 8 : 18
  for (let i = 0; i < count; i++) {
    petals.push({
      x: Math.random(), y: Math.random(),
      s: 0.4 + Math.random() * 1.1,
      v: 0.00025 + Math.random() * 0.0006,
      spin: Math.random() * Math.PI * 2,
      kind: Math.random() < 0.6 ? 'petal' : 'spark',
    })
  }

  function draw(t) {
    ctx.clearRect(0, 0, w, h)
    for (const p of petals) {
      if (!reduceMotion) {
        p.y += p.v
        p.x += Math.sin(t / 2400 + p.spin) * 0.0004
        p.spin += 0.01
        if (p.y > 1.05) { p.y = -0.05; p.x = Math.random() }
      }
      const x = p.x * w
      const y = p.y * h
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(p.spin)
      if (p.kind === 'petal') {
        ctx.fillStyle = 'rgba(216, 231, 188, 0.12)'
        ctx.beginPath()
        ctx.ellipse(0, 0, 7 * p.s * dpr, 3.5 * p.s * dpr, 0, 0, Math.PI * 2)
        ctx.fill()
      } else {
        const r = 2.2 * p.s * dpr
        ctx.fillStyle = 'rgba(197, 221, 67, 0.20)'
        ctx.beginPath()
        for (let k = 0; k < 4; k++) {
          const a = (k * Math.PI) / 2
          ctx.lineTo(Math.cos(a) * r * 2.4, Math.sin(a) * r * 2.4)
          ctx.lineTo(Math.cos(a + Math.PI / 4) * r * 0.5, Math.sin(a + Math.PI / 4) * r * 0.5)
        }
        ctx.fill()
      }
      ctx.restore()
    }
    if (!reduceMotion) requestAnimationFrame(draw)
  }
  requestAnimationFrame(draw)
}

// ---- arsenal ------------------------------------------------------------------

function initArsenal() {
  const tabs = document.getElementById('cat-tabs')
  const grid = document.getElementById('op-cards')
  let active = 'all'

  const render = () => {
    tabs.innerHTML = categories.map((c) =>
      `<button role="tab" aria-selected="${c.id === active}" data-cat="${c.id}">
        ${icon(c.icon)}${c.label}</button>`).join('')
    const label = Object.fromEntries(categories.map((c) => [c.id, c.label]))
    grid.innerHTML = ops
      .filter((o) => active === 'all' || o.cat === active)
      .map((o) => `
        <article class="card cat-${o.cat}">
          <div class="card-top"><span class="chip">${label[o.cat]}</span>${o.mask ? '<span class="chip chip-mask">+ mask</span>' : ''}</div>
          <h3>${o.name}</h3>
          <p>${o.desc}</p>
        </article>`).join('')
  }
  tabs.addEventListener('click', (e) => {
    const b = e.target.closest('button')
    if (!b) return
    active = b.dataset.cat
    render()
  })
  render()
}

// ---- episodes -----------------------------------------------------------------

function initEpisodes() {
  document.getElementById('episode-list').innerHTML = episodes.map((e, i) => `
    <article class="episode reveal">
      <div class="episode-art" aria-hidden="true">
        <span class="episode-num">${String(i + 1).padStart(2, '0')}</span>
        <span class="episode-icon">${icon(e.icon)}</span>
        <span class="episode-tag">${e.tag}</span>
      </div>
      <div class="episode-body">
        <h3>${e.title}</h3>
        <p>${e.body}</p>
        <ul>${e.bullets.map((b) => `<li>${b}</li>`).join('')}</ul>
      </div>
    </article>`).join('')
}

// ---- code tabs ----------------------------------------------------------------

const escapeHtml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// a deliberately small highlighter: strings, comments, numbers, keywords
function highlight(code, lang) {
  const kw = lang === 'python' ? /\b(import|from|as|def|return|for|in|if|else|True|False|None)\b/g : /\b(cargo|cp|arclight|claude|tar|pip)\b/g
  const comment = lang === 'json' ? null : /#.*$/gm
  const tokens = []
  // placeholders use private-use characters so later passes can't match inside them
  const stash = (cls) => (m) => {
    tokens.push(`<span class="${cls}">${m}</span>`)
    return `${String.fromCharCode(0xE100 + tokens.length - 1)}`
  }
  let s = escapeHtml(code)
  if (comment) s = s.replace(comment, stash('tk-c'))
  s = s.replace(/"(?:[^"\\]|\\.)*"/g, stash('tk-s'))
  s = s.replace(kw, stash('tk-k'))
  s = s.replace(/\b\d+(\.\d+)?\b/g, stash('tk-n'))
  const restore = (str) => str.replace(/(.)/g, (_, c) => tokens[c.charCodeAt(0) - 0xE100])
  return restore(restore(s))
}

function initCode() {
  const tabs = document.getElementById('code-tabs')
  const body = document.getElementById('code-body')
  const note = document.getElementById('code-note')
  let active = codeSamples[0].id
  const render = () => {
    tabs.innerHTML = codeSamples.map((c) =>
      `<button aria-pressed="${c.id === active}" data-id="${c.id}">${c.label}</button>`).join('')
    const c = codeSamples.find((c) => c.id === active)
    body.innerHTML = highlight(c.code, c.lang)
    note.textContent = c.note
  }
  tabs.addEventListener('click', (e) => {
    const b = e.target.closest('button')
    if (!b) return
    active = b.dataset.id
    render()
  })
  render()
}

// ---- scroll reveal --------------------------------------------------------------

function initReveal() {
  document.querySelectorAll('.sec-head, .stat, .panel, .dl-card, .next li').forEach((n) => n.classList.add('reveal'))
  if (reduceMotion) {
    document.querySelectorAll('.reveal').forEach((n) => n.classList.add('in'))
    return
  }
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) }
    }
  }, { threshold: 0.12 })
  document.querySelectorAll('.reveal').forEach((n) => io.observe(n))
}

initSky()
initArsenal()
initEpisodes()
initCode()
initDojo()
initReveal()
