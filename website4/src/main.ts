import './style.css'
import { categories, ops, episodes, codeSamples, type CategoryId, type CodeLang } from './data'
import { initDojo } from './dojo'
import { icon } from './icons'

// Fails loudly if index.html and the scripts drift apart.
function byId<T extends HTMLElement = HTMLElement>(id: string): T {
  const el = document.getElementById(id)
  if (!el) throw new Error(`#${id} not found`)
  return el as T
}

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

// ---- arsenal ------------------------------------------------------------------

function initArsenal() {
  const tabs = byId('cat-tabs')
  const grid = byId('op-cards')
  let active: CategoryId = 'all'

  const render = () => {
    tabs.innerHTML = categories.map((c) =>
      `<button role="tab" aria-selected="${c.id === active}" data-cat="${c.id}">
        ${icon(c.icon)}${c.label}</button>`).join('')
    const label = Object.fromEntries(categories.map((c) => [c.id, c.label])) as Record<CategoryId, string>
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
    const b = (e.target as Element).closest('button')
    if (!b) return
    active = b.dataset.cat as CategoryId
    render()
  })
  render()
}

// ---- episodes -----------------------------------------------------------------

function initEpisodes() {
  byId('episode-list').innerHTML = episodes.map((e, i) => `
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

const escapeHtml = (s: string): string => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// a deliberately small highlighter: strings, comments, numbers, keywords
function highlight(code: string, lang: CodeLang): string {
  const kw = lang === 'python' ? /\b(import|from|as|def|return|for|in|if|else|True|False|None)\b/g : /\b(cargo|cp|arclight|claude|tar|pip)\b/g
  const comment = lang === 'json' ? null : /#.*$/gm
  const tokens: string[] = []
  // placeholders use private-use characters so later passes can't match inside them
  const stash = (cls: string) => (m: string): string => {
    tokens.push(`<span class="${cls}">${m}</span>`)
    return `${String.fromCharCode(0xE100 + tokens.length - 1)}`
  }
  let s = escapeHtml(code)
  if (comment) s = s.replace(comment, stash('tk-c'))
  s = s.replace(/"(?:[^"\\]|\\.)*"/g, stash('tk-s'))
  s = s.replace(kw, stash('tk-k'))
  s = s.replace(/\b\d+(\.\d+)?\b/g, stash('tk-n'))
  const restore = (str: string): string => str.replace(/(.)/g, (_, c: string) => tokens[c.charCodeAt(0) - 0xE100])
  return restore(restore(s))
}

function initCode() {
  const tabs = byId('code-tabs')
  const body = byId('code-body')
  const note = byId('code-note')
  let active = codeSamples[0].id
  const render = () => {
    tabs.innerHTML = codeSamples.map((c) =>
      `<button aria-pressed="${c.id === active}" data-id="${c.id}">${c.label}</button>`).join('')
    const c = codeSamples.find((c) => c.id === active) ?? codeSamples[0]
    body.innerHTML = highlight(c.code, c.lang)
    note.textContent = c.note
  }
  tabs.addEventListener('click', (e) => {
    const b = (e.target as Element).closest('button')
    if (!b?.dataset.id) return
    active = b.dataset.id
    render()
  })
  render()
}

// ---- scroll reveal --------------------------------------------------------------

function initReveal() {
  document.querySelectorAll<HTMLElement>('.sec-head, .stat, .panel, .dl-card, .next li').forEach((n) => n.classList.add('reveal'))
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

initArsenal()
initEpisodes()
initCode()
initDojo()
initReveal()

const menu = document.querySelector<HTMLButtonElement>('.menu-toggle')!
const navigation = byId('main-nav')
menu.addEventListener('click', () => {
 const open = menu.getAttribute('aria-expanded') !== 'true'
 menu.setAttribute('aria-expanded', String(open))
 navigation.classList.toggle('is-open', open)
})
navigation.addEventListener('click', (event) => {
 if ((event.target as Element).closest('a')) {
  menu.setAttribute('aria-expanded', 'false')
  navigation.classList.remove('is-open')
 }
})
