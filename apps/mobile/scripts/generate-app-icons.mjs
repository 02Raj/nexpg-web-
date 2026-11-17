/**
 * Regenerate Expo app icons from assets/runmypg-icon.svg (same mark as RunMyPG web).
 * Run: node scripts/generate-app-icons.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const assets = join(root, 'assets');
const svgPath = join(assets, 'runmypg-icon.svg');
const svg = readFileSync(svgPath);

async function png(size, outName) {
  const buf = await sharp(svg, { density: Math.ceil((size / 32) * 72) })
    .resize(size, size)
    .png()
    .toBuffer();
  writeFileSync(join(assets, outName), buf);
  console.log('wrote', outName, size);
}

/** Android adaptive foreground: logo in center ~66% safe zone on transparent canvas */
async function adaptiveForeground(size, outName) {
  const logoSize = Math.round(size * 0.62);
  const logo = await sharp(svg, { density: 144 }).resize(logoSize, logoSize).png().toBuffer();
  const left = Math.round((size - logoSize) / 2);
  const buf = await sharp({
    create: { width: size, height: size, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([{ input: logo, left, top: left }])
    .png()
    .toBuffer();
  writeFileSync(join(assets, outName), buf);
  console.log('wrote', outName, size);
}

async function solidBackground(size, color, outName) {
  const buf = await sharp({
    create: { width: size, height: size, channels: 3, background: color },
  })
    .png()
    .toBuffer();
  writeFileSync(join(assets, outName), buf);
  console.log('wrote', outName);
}

/** Themed / monochrome: white building on transparent */
async function monochrome(size, outName) {
  const whiteSvg = readFileSync(svgPath, 'utf8').replace(/#16302B/g, '#FFFFFF').replace(/#C97A2B/g, '#FFFFFF');
  const buf = await sharp(Buffer.from(whiteSvg), { density: 144 })
    .resize(size, size)
    .png()
    .toBuffer();
  writeFileSync(join(assets, outName), buf);
  console.log('wrote', outName);
}

await png(1024, 'icon.png');
await adaptiveForeground(1024, 'android-icon-foreground.png');
await solidBackground(1024, '#F7F5F1', 'android-icon-background.png');
await monochrome(432, 'android-icon-monochrome.png');
await png(512, 'splash-icon.png');
await png(48, 'favicon.png');
