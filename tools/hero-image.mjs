/**
 * Generates a hero image for a post, using the Gemini image API.
 *
 *   npm run hero                                  # tools/hero-image.prompt.txt -> assets/hero/agents-off-the-laptop.jpg
 *   npm run hero -- --out assets/hero/other.png   # somewhere else
 *   npm run hero -- --prompt "a simpler prompt"   # skip the prompt file
 *
 * The key comes from GEMINI_API_KEY, read from the environment or from a
 * gitignored .env at the repo root. It is never written to the file system or
 * into the image, and this script never prints it.
 *
 * Output is a raster, so unlike the SVG figures in posts it does NOT follow the
 * site's light/dark toggle. A hero is one fixed image; check it against the sky
 * ground in DESIGN.md before committing.
 *
 * Node builtins only — no SDK, no dependency. Node 18+ for global fetch.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

const ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/interactions';
const DEFAULT_MODEL = 'gemini-nano-banana-2.1';
const DEFAULT_PROMPT_FILE = 'tools/hero-image.prompt.txt';
const DEFAULT_OUT = 'assets/hero/agents-off-the-laptop.jpg';
const DEFAULT_ASPECT = '16:9';
const DEFAULT_SIZE = '2K';

/** Minimal .env reader. Real environment wins, so exports override the file. */
function loadDotEnv(path = '.env') {
  if (!existsSync(path)) return;
  for (const raw of readFileSync(path, 'utf8').split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (value.length > 1 && ((value[0] === '"' && value.endsWith('"')) || (value[0] === "'" && value.endsWith("'")))) {
      value = value.slice(1, -1);
    }
    if (key && !(key in process.env)) process.env[key] = value;
  }
}

function parseArgs(argv) {
  const args = {
    out: DEFAULT_OUT,
    promptFile: DEFAULT_PROMPT_FILE,
    prompt: null,
    aspect: DEFAULT_ASPECT,
    size: DEFAULT_SIZE,
    model: DEFAULT_MODEL,
  };
  for (let i = 0; i < argv.length; i += 1) {
    const flag = argv[i];
    const value = argv[i + 1];
    if (flag === '--out') { args.out = value; i += 1; }
    else if (flag === '--prompt-file') { args.promptFile = value; i += 1; }
    else if (flag === '--prompt') { args.prompt = value; i += 1; }
    else if (flag === '--aspect') { args.aspect = value; i += 1; }
    else if (flag === '--size') { args.size = value; i += 1; }
    else if (flag === '--model') { args.model = value; i += 1; }
    else if (flag === '--help' || flag === '-h') {
      console.log('usage: node tools/hero-image.mjs [--out PATH] [--prompt TEXT | --prompt-file PATH] [--aspect 16:9] [--size 2K] [--model NAME]');
      process.exit(0);
    } else {
      console.error(`Unknown argument: ${flag}`);
      process.exit(2);
    }
  }
  return args;
}

/**
 * The response is walked rather than indexed, because the image does not always
 * arrive at the same depth. Anything shaped like { data: <base64>, mime_type:
 * image/* } counts, wherever it sits.
 */
function findImage(node) {
  if (!node || typeof node !== 'object') return null;
  if (Array.isArray(node)) {
    for (const item of node) {
      const hit = findImage(item);
      if (hit) return hit;
    }
    return null;
  }
  const mime = node.mime_type ?? node.mimeType;
  const data = node.data ?? node.base64 ?? node.bytes;
  if (typeof data === 'string' && typeof mime === 'string' && mime.startsWith('image/') && data.length > 512) {
    return { data, mime };
  }
  for (const value of Object.values(node)) {
    const hit = findImage(value);
    if (hit) return hit;
  }
  return null;
}

async function main() {
  loadDotEnv();
  const args = parseArgs(process.argv.slice(2));

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('GEMINI_API_KEY is not set.');
    console.error('Put it in .env at the repo root (that file is gitignored), or export it.');
    process.exit(1);
  }

  const prompt = args.prompt ?? readFileSync(args.promptFile, 'utf8').trim();
  if (!prompt) {
    console.error(`Prompt is empty: ${args.promptFile}`);
    process.exit(1);
  }

  const body = {
    model: args.model,
    input: prompt,
    response_format: {
      type: 'image',
      // The interactions endpoint accepts image/jpeg only for response_format.
      mime_type: 'image/jpeg',
      aspect_ratio: args.aspect,
      image_size: args.size,
    },
  };

  console.log(`model ${args.model} · aspect ${args.aspect} · size ${args.size}`);
  console.log(`prompt ${prompt.length} chars from ${args.prompt ? '--prompt' : args.promptFile}`);

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'x-goog-api-key': apiKey, 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  if (!res.ok) {
    console.error(`HTTP ${res.status} ${res.statusText}`);
    console.error(text.slice(0, 2000));
    process.exit(1);
  }

  let json;
  try {
    json = JSON.parse(text);
  } catch {
    console.error('Response was not JSON. First 2000 chars:');
    console.error(text.slice(0, 2000));
    process.exit(1);
  }

  const image = findImage(json);
  if (!image) {
    console.error('No image found in the response. Top-level keys: ' + Object.keys(json).join(', '));
    console.error(JSON.stringify(json).slice(0, 2000));
    process.exit(1);
  }

  mkdirSync(dirname(args.out), { recursive: true });
  const bytes = Buffer.from(image.data, 'base64');
  writeFileSync(args.out, bytes);
  console.log(`wrote ${args.out} — ${image.mime}, ${(bytes.length / 1024).toFixed(0)} KB`);
}

main();
