/**
 * PNG logos for Peerlist, social, Play Store drafts.
 * Run: node scripts/export-brand-png.mjs
 */
import { readFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const brand = join(root, 'public', 'brand');
mkdirSync(brand, { recursive: true });

async function fromSvg(name, size) {
  const svg = readFileSync(join(brand, name), 'utf8');
  const out = name.replace('.svg', `-${size}.png`);
  await sharp(Buffer.from(svg)).resize(size, size).png().toFile(join(brand, out));
  console.log('wrote', out);
}

async function fromSvgKeepAspect(name, width) {
  const svg = readFileSync(join(brand, name), 'utf8');
  const base = name.replace('.svg', '');
  await sharp(Buffer.from(svg)).resize(width).png().toFile(join(brand, `${base}-${width}w.png`));
  console.log('wrote', `${base}-${width}w.png`);
}

await fromSvg('runmypg-icon-square.svg', 512);
await fromSvg('runmypg-icon-square.svg', 1024);
await fromSvgKeepAspect('runmypg-logo-horizontal.svg', 1200);
