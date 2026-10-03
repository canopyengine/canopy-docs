import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const site = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const repo = path.resolve(site, '..');
const source = path.join(repo, 'markdown');
const output = path.join(site, 'src/content/docs/manual');
const assets = path.join(site, 'public/markdown');

// Only these generated directories are replaced, never authoring files.
for (const directory of [output, assets]) {
  if (!directory.startsWith(`${site}${path.sep}`)) {
    throw new Error(`Generated directory escapes the site workspace: ${directory}`);
  }
}
fs.rmSync(output, { recursive: true, force: true });
fs.rmSync(assets, { recursive: true, force: true });
function convertLink(link, file) {
  if (/^(https?:|mailto:|data:|#)/.test(link)) return link;
  const [target, anchor] = link.split('#');
  const resolved = target.startsWith('/') ? path.join(repo, target) : path.resolve(path.dirname(file), target);
  if (resolved.endsWith('.md') && resolved.startsWith(`${source}${path.sep}`)) {
    const relative = path.relative(source, resolved).replaceAll(path.sep, '/');
    return `/manual/${relative.replace(/\.md$/, '').replace(/(^|\/)index$/, '$1')}/`.replaceAll('//', '/') + (anchor ? `#${anchor}` : '');
  }
  if (resolved.startsWith(`${source}${path.sep}`)) {
    return '/markdown/' + path.relative(source, resolved).replaceAll(path.sep, '/');
  }
  return 'https://github.com/canopyengine/canopy-docs/blob/main/' + path.relative(repo, resolved).replaceAll(path.sep, '/') + (anchor ? `#${anchor}` : '');
}
function visit(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) { visit(file); continue; }
    const relative = path.relative(source, file);
    if (!file.endsWith('.md')) {
      const destination = path.join(assets, relative);
      fs.mkdirSync(path.dirname(destination), { recursive: true });
      fs.copyFileSync(file, destination);
      continue;
    }
    let text = fs.readFileSync(file, 'utf8');
    const title = text.match(/^#+ (.+)$/m)?.[1] ?? entry.name.replace('.md', '');
    text = text.replace(/(\]\()([^\s)]+)(\))/g, (_, before, link, after) => before + convertLink(link, file) + after);
    text = text.replace(/((?:href|src)=")([^"]+)(")/g, (_, before, link, after) => before + convertLink(link, file) + after);
    text = text.replace(/^```([^\s`]*)[^\n]*$/gm, '```$1');
    const destination = path.join(output, relative);
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.writeFileSync(destination, `---\ntitle: ${JSON.stringify(title)}\n---\n\n${text}`);
  }
}
visit(source);
console.log('Generated the Canopy manual from markdown/.');
