import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../code/dist');
const failures = new Set();
function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(file) : file.endsWith('.html') ? [file] : [];
  });
}
for (const file of walk(root)) {
  const html = fs.readFileSync(file, 'utf8');
  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const link = match[1].replaceAll('&amp;', '&');
    if (/^(?:[a-z]+:|\/\/)/i.test(link)) continue;
    const [target, anchor] = link.split('#');
    const pathname = decodeURIComponent(target.split('?')[0]);
    let resolved = !pathname ? file : pathname.startsWith('/') ? path.join(root, pathname) : path.resolve(path.dirname(file), pathname);
    if (fs.existsSync(resolved) && fs.statSync(resolved).isDirectory()) resolved = path.join(resolved, 'index.html');
    if (!fs.existsSync(resolved)) {
      failures.add(`${path.relative(root, file)}: missing ${link}`);
    } else if (anchor && resolved.endsWith('.html')) {
      const destination = fs.readFileSync(resolved, 'utf8');
      const id = decodeURIComponent(anchor);
      if (!destination.includes(`id="${id}"`)) failures.add(`${path.relative(root, file)}: missing anchor ${link}`);
    }
  }
}
if (failures.size) {
  console.error([...failures].join('\n'));
  process.exitCode = 1;
} else console.log('Generated site links, assets and anchors are valid.');
