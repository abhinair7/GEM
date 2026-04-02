// Patch Vercel serverless function runtime from nodejs18.x → nodejs20.x
// Required because @astrojs/vercel@7.x doesn't recognise Node 24/25 and
// falls back to nodejs18.x, which Vercel has since deprecated.

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const FUNCTIONS_DIR = '.vercel/output/functions';
const OLD_RUNTIME = 'nodejs18.x';
const NEW_RUNTIME = 'nodejs20.x';

function walk(dir) {
  const files = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) files.push(...walk(full));
    else if (entry === '.vc-config.json') files.push(full);
  }
  return files;
}

let patched = 0;
for (const file of walk(FUNCTIONS_DIR)) {
  const raw = readFileSync(file, 'utf-8');
  if (raw.includes(OLD_RUNTIME)) {
    writeFileSync(file, raw.replace(OLD_RUNTIME, NEW_RUNTIME));
    patched++;
    console.log(`✓ Patched ${file}: ${OLD_RUNTIME} → ${NEW_RUNTIME}`);
  }
}

if (patched === 0) console.log('No runtime patches needed.');
else console.log(`Done — patched ${patched} function config(s).`);
