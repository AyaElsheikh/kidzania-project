// Resolve assets from /src/assets for use in games without hardcoding many imports.
// Works with Vite: eager glob returns URLs.

const assetUrls = import.meta.glob('../assets/**/*.{png,jpg,jpeg,svg}', {
  eager: true,
  import: 'default'
})

export function resolveAssetUrl(pathOrUrl) {
  const p = String(pathOrUrl || '').trim()
  if (!p) return ''
  if (p.startsWith('http') || p.startsWith('//') || p.startsWith('/')) return p

  // allow passing "cow.png" or "nature/sun.png"
  const cleaned = p.replace(/^(\.\/)+/, '').replace(/^assets\//, '')

  const k1 = `../assets/${cleaned}`
  const url = assetUrls[k1]
  return url || ''
}


