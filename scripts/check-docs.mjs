import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const failures = [];
function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (['.git', 'node_modules', '.astro', 'dist', 'manual'].includes(entry.name)) return [];
    const file = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(file) : file.endsWith('.md') ? [file] : [];
  });
}
for (const file of walk(root)) {
  const content = fs.readFileSync(file, 'utf8');
  const label = path.relative(root, file);
  if (!content.trim()) failures.push(`${label}: empty document`);
  for (const match of content.matchAll(/\]\(([^\s)]+)(?:\s+"[^"]*")?\)|(?:href|src)="([^"]+)"/g)) {
    const link = match[1] ?? match[2];
    if (/^(https?:|mailto:|data:)/.test(link)) continue;
    const target = decodeURIComponent(link.split('#')[0]);
    const resolved = !target ? file : target.startsWith('/') ? path.join(root, target) : path.resolve(path.dirname(file), target);
    if (!fs.existsSync(resolved)) failures.push(`${label}: missing target ${link}`);
    else if (link.includes('#') && resolved.endsWith('.md')) {
      const anchor = decodeURIComponent(link.split('#')[1]);
      const body = fs.readFileSync(resolved, 'utf8').replace(/^(`{3,}|~{3,})[^\n]*\n[\s\S]*?^\1\s*$/gm, '');
      const counts = new Map();
      const anchors = [...body.matchAll(/^#{1,6}\s+(.+)$/gm)].map((heading) => {
        const base = heading[1].toLowerCase().replace(/<[^>]*>/g, '').replace(/[^\p{L}\p{N}\s_-]/gu, '').replace(/\s/g, '-');
        const count = counts.get(base) ?? 0;
        counts.set(base, count + 1);
        return count ? `${base}-${count}` : base;
      });
      if (!anchors.includes(anchor)) failures.push(`${label}: missing heading ${link}`);
    }
  }
  if (label.startsWith(`markdown${path.sep}manuals`) && /io\.github\.canopyengine:core\b|canopy new|override fun (setup|create)\s*\(|io\.canopy\.backends\./.test(content)) {
    failures.push(`${label}: obsolete runnable API example`);
  }
}
if (failures.length) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
} else console.log('Documentation files and repository-local link targets are valid.');
