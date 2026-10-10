/**
 * Renders the social cards (og:image) for the atlas world.
 *
 * og:image has to be a raster — no social platform renders SVG — so the card is
 * authored here as HTML in the site's own grammar and rendered with the Chrome
 * already on the machine, then committed to assets/og/. Keeping the source in
 * the repo means a card can be edited and re-rendered rather than re-invented.
 *
 *   npm run og
 *
 * Chrome is only needed to render. The committed PNGs ship whether or not it is
 * present, so a deploy never depends on this script.
 *
 * Each card's provenance is embedded into the PNG by this script, in the same
 * tEXt chunk impeccable's embed-prompt writes, so a re-render cannot strand a
 * raster without it. See assets/og/PROVENANCE.md.
 */
import { spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync, rmSync, readdirSync, readFileSync } from 'node:fs';
import { crc32 } from 'node:zlib';
import { join } from 'node:path';

const ROOT = process.cwd();
const FONT_DIR = join(ROOT, 'assets', 'fonts').replace(/\\/g, '/');
const OUT_DIR = join(ROOT, 'assets', 'og');
const TMP_DIR = join(ROOT, '.impeccable', 'og-render');

const CHROME_CANDIDATES = [
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
];

const W = 1200;
const H = 630;

// The site's dark ground, which is the world's native state. A card is one
// image for every platform, so it takes the sky rather than following a
// visitor's theme.
const C = {
  sky: '#0a0d18',
  grid: '#1b2138',
  rule: '#232a42',
  ink: '#e9e7db',
  muted: '#8b8e9c',
  hot: '#f0c674',
  cool: '#8fb8c9',
  faint: '#b892c9',
};

const font = (family, weight, file) => `@font-face{font-family:'${family}';font-weight:${weight};font-style:normal;src:url('file:///${FONT_DIR}/${file}') format('woff2');}`;

const CARD_CSS = `
${font('Spectral', 500, 'spectral-500-latin.woff2')}
${font('Spectral', 500, 'spectral-500-latin-ext.woff2')}
${font('Azeret Mono', 400, 'azeret-mono-latin.woff2')}
${font('Azeret Mono', 400, 'azeret-mono-latin-ext.woff2')}
*{box-sizing:border-box}
html,body{margin:0;padding:0;width:${W}px;height:${H}px}
body{background:${C.sky};color:${C.ink};overflow:hidden;position:relative}
/* The Atlas Plate: the same 6rem coordinate grid the pages are ruled with. */
.grid{position:absolute;inset:0;background-image:
  linear-gradient(to right,${C.grid} 1px,transparent 1px),
  linear-gradient(to bottom,${C.grid} 1px,transparent 1px);
  background-size:96px 96px}
.wrap{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:space-between;padding:72px 80px}
.legend{display:flex;align-items:center;gap:16px;font-family:'Azeret Mono',monospace;font-size:19px;letter-spacing:3px;text-transform:uppercase;color:${C.muted}}
.mark{width:15px;height:15px;border-radius:50%;flex:none}
h1{font-family:'Spectral',Georgia,serif;font-weight:500;font-size:58px;line-height:1.14;letter-spacing:-1.2px;margin:0;max-width:22ch}
.foot{display:flex;justify-content:space-between;align-items:baseline;border-top:1px solid ${C.rule};padding-top:20px;font-family:'Azeret Mono',monospace;font-size:19px;color:${C.muted}}
.foot b{color:${C.ink};font-weight:400}
`;

// Banded exactly as the pages band them, so the mark on a card means what the
// mark on the catalogue means.
function band(minutes) {
  if (minutes >= 8) return C.hot;
  if (minutes >= 6) return C.cool;
  return C.faint;
}

// Named by URL slug, not by title, so a card maps to its page through
// Eleventy's page.fileSlug rather than through a slugified title that changes
// whenever the title is edited.
const CARDS = [
  {
    out: 'default.png',
    legend: 'Jian · software engineer',
    title: 'Notes on reliability, data, and making things that last.',
    tint: C.hot,
    foot: 'Melbourne, Australia',
  },
  {
    out: 'remote-mcp-fastmcp.png',
    legend: 'Tools · 8 min',
    title: 'Using a coding agent as an observability agent',
    tint: band(8),
    foot: 'Writing',
  },
  {
    out: 'vibe-coding.png',
    legend: 'Tools · 6 min',
    title: 'Vibe coding an old blog into something I would actually use',
    tint: band(6),
    foot: 'Writing',
  },
];

const html = (card) => `<!doctype html>
<html lang="en-AU"><head><meta charset="utf-8"><style>${CARD_CSS}</style></head>
<body>
  <div class="grid"></div>
  <div class="wrap">
    <div class="legend"><span class="mark" style="background:${card.tint}"></span>${card.legend}</div>
    <h1>${card.title}</h1>
    <div class="foot"><span><b>jianloong.github.io</b></span><span>${card.foot}</span></div>
  </div>
</body></html>`;

const chrome = CHROME_CANDIDATES.find((p) => {
  const probe = spawnSync(p, ['--version'], { stdio: 'ignore' });
  return !probe.error;
});
if (!chrome) {
  console.error('No Chrome or Edge found to render with. The committed cards in assets/og/ still ship.');
  process.exit(1);
}

mkdirSync(OUT_DIR, { recursive: true });
mkdirSync(TMP_DIR, { recursive: true });

// Provenance lives in the raster itself, so it travels with the file.
//
// Written here rather than by shelling out to impeccable's embed-prompt: a
// re-render used to silently strip the provenance off a card, and this script
// is the only thing that knows a fresh render needs it back. The chunk is the
// same one that tool writes -- a tEXt chunk keyed `impeccable:prompt` -- so
// `impeccable embed-prompt --scan assets/og` still reports it as present.
function embedProvenance(pngPath, prompt) {
  const png = readFileSync(pngPath);
  const iendAt = png.length - 12; // length(0) + "IEND" + crc(4)
  const data = Buffer.concat([
    Buffer.from('impeccable:prompt\0', 'latin1'),
    Buffer.from(prompt, 'latin1'),
  ]);
  const chunk = Buffer.alloc(12 + data.length);
  chunk.writeUInt32BE(data.length, 0);
  chunk.write('tEXt', 4, 'latin1');
  data.copy(chunk, 8);
  chunk.writeUInt32BE(crc32(Buffer.concat([Buffer.from('tEXt', 'latin1'), data])) >>> 0, 8 + data.length);
  // tEXt must precede IEND.
  writeFileSync(pngPath, Buffer.concat([png.subarray(0, iendAt), chunk, png.subarray(iendAt)]));
}

const PROMPT = readFileSync(join(ROOT, 'tools', 'og-card.prompt.txt'), 'utf8');

const written = [];
for (const card of CARDS) {
  const src = join(TMP_DIR, card.out.replace(/\.png$/, '.html'));
  writeFileSync(src, html(card), 'utf8');
  const out = join(OUT_DIR, card.out);
  const res = spawnSync(chrome, [
    '--headless=old',
    '--disable-gpu',
    '--hide-scrollbars',
    '--no-sandbox',
    '--force-device-scale-factor=1',
    '--allow-file-access-from-files',
    '--virtual-time-budget=6000',
    `--window-size=${W},${H}`,
    `--screenshot=${out.replace(/\\/g, '/')}`,
    `file:///${src.replace(/\\/g, '/')}`,
  ], { stdio: 'ignore' });
  const ok = res.status === 0;
  if (ok) embedProvenance(out, PROMPT);
  written.push({ card: card.out, ok, provenance: ok });
}

for (const f of readdirSync(TMP_DIR)) rmSync(join(TMP_DIR, f), { force: true });
rmSync(TMP_DIR, { recursive: true, force: true });

console.log(JSON.stringify(written, null, 1));
