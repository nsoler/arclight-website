// Local vector icons stay sharp at every size and need no font download.
const paths = {
  grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  color: '<circle cx="12" cy="12" r="9"/><path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M5.6 18.4 18.4 5.6"/>',
  layers: '<path d="m12 3 10 5-10 5L2 8l10-5Zm-9 10 9 5 9-5M3 18l9 5 9-5"/>',
  transform: '<path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5M3 3l6 6m12-6-6 6M3 21l6-6m12 6-6-6"/>',
  curve: '<path d="M4 19C4 3 20 21 20 5M4 19V5m16 14V5"/><circle cx="4" cy="5" r="2"/><circle cx="20" cy="19" r="2"/>',
  target: '<circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="2"/><path d="M12 1v5m0 12v5M1 12h5m12 0h5"/>',
  cube: '<path d="m12 2 9 5v10l-9 5-9-5V7l9-5Zm0 10 9-5M12 12 3 7m9 5v10"/>',
  particles: '<circle cx="5" cy="5" r="2"/><circle cx="18" cy="4" r="1"/><circle cx="12" cy="12" r="3"/><circle cx="4" cy="17" r="1"/><circle cx="19" cy="18" r="2"/><path d="m7 7 3 3m4 4 3 3M14 9l3-3M6 16l3-2"/>',
  io: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 8h10m-3-3 3 3-3 3m3 5H7m3-3-3 3 3 3"/>',
  cloud: '<circle cx="6" cy="7" r="1"/><circle cx="12" cy="4" r="1"/><circle cx="18" cy="7" r="1"/><circle cx="3" cy="13" r="1"/><circle cx="9" cy="11" r="1"/><circle cx="15" cy="11" r="1"/><circle cx="21" cy="13" r="1"/><circle cx="6" cy="18" r="1"/><circle cx="12" cy="16" r="1"/><circle cx="18" cy="18" r="1"/><circle cx="12" cy="22" r="1"/>',
  code: '<path d="m8 6-6 6 6 6m8-12 6 6-6 6M14 3l-4 18"/>',
  motion: '<path d="M2 6h8M1 12h6M2 18h8"/><circle cx="16" cy="12" r="7"/><path d="M16 8v4l3 2"/>',
} satisfies Record<string, string>

export type IconName = keyof typeof paths

export function icon(name: IconName): string {
  return `<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${paths[name] ?? paths.grid}</svg>`
}
