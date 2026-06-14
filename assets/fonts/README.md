# Fonts

Drop the real ALMA web fonts here, then the site uses them automatically (the `@font-face`
rules and `<link rel="preload">` hooks already point at these exact filenames):

- `garagegothic-bold-webfont.woff2` — display headlines (uppercase)
- `helvetica-webfont.woff2` — body / navigation / UI

Until these files exist, the site falls back to Helvetica → Roboto → system fonts via
`font-display: swap`. No code change is needed when you add them; just match the filenames.
Optionally add `.woff` versions alongside for older-browser fallback.
