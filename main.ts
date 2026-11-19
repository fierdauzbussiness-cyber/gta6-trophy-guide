// Leonida Trophy Guide — entry program (Node 22, standard library only).
// The guide itself is app/: plain static files (index.html, ES modules, CSS,
// app/data/trophies.json) that a browser opens with no build step and no
// network. This program hands it in: it copies app/ and screenshots/ from
// beside this file into the output directory and writes dossier.json there
// with the vendored make.fun library, exactly as the scorer expects.
// vendor/makefun-frontend.ts is the kit's copy and is left untouched — the
// scorer rebuilds the dossier with its own copy and compares byte for byte.
//
// Run it locally with: mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// (outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output).

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(outputDir, { recursive: true });
cpSync(join(repoRoot, 'app'), join(outputDir, 'app'), { recursive: true });
mkdirSync(join(outputDir, 'screenshots'), { recursive: true });
if (existsSync(join(repoRoot, 'screenshots'))) {
  cpSync(join(repoRoot, 'screenshots'), join(outputDir, 'screenshots'), { recursive: true });
}

// The scorer's own caps: the text cap shapes the dossier's bytes, and the
// other caps refuse an entry the scorer would refuse (more than 4
// screenshots, one over 256 KiB, or app/ past 993 files and directories or
// 48 MiB — app/ shares /output's 1000-entry cap with screenshots/ and
// dossier.json, so the guide stays well inside them).
writeFileSync(
  join(outputDir, 'dossier.json'),
  buildDossier(outputDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 50331648,
  }),
);
