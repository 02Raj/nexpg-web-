import { rm } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const generated = [
  'apps/web/.next',
  'apps/web/tsconfig.tsbuildinfo',
  'apps/mobile/.expo',
  'apps/mobile/dist',
  'packages/shared/tsconfig.tsbuildinfo',
];

await Promise.all(
  generated.map((path) => rm(resolve(root, path), { recursive: true, force: true })),
);
