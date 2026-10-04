const { existsSync, readFileSync } = require('node:fs');
const { dirname, resolve } = require('node:path');

const root = resolve(__dirname, '..');
const pages = ['index.html'];
if (existsSync(resolve(root, 'privacy.html'))) pages.push('privacy.html');

const errors = [];
let checked = 0;

for (const page of pages) {
  const pagePath = resolve(root, page);
  if (!existsSync(pagePath)) {
    errors.push(`${page}: page does not exist`);
    continue;
  }

  // Ignore comments and inline code, while keeping script/link opening tags.
  const html = readFileSync(pagePath, 'utf8')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/(<(script|style)\b[^>]*>)[\s\S]*?<\/\2\s*>/gi, '$1');

  for (const [tag] of html.matchAll(/<[a-z](?:[^"'>]|"[^"]*"|'[^']*')*>/gi)) {
    const attributes = /\s+([^\s"'<>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
    for (const [, name, doubleQuoted, singleQuoted, unquoted] of tag.matchAll(attributes)) {
      if (!/^(src|href)$/i.test(name)) continue;
      const reference = (doubleQuoted ?? singleQuoted ?? unquoted ?? '').trim();
      // Schemes, protocol-relative URLs, and fragment/query-only links are not files.
      if (!reference || /^(?:[a-z][a-z\d+.-]*:|\/\/|[?#])/i.test(reference)) continue;

      checked += 1;
      try {
        const pathname = decodeURIComponent(reference.split(/[?#]/, 1)[0]);
        const target = pathname.startsWith('/')
          ? resolve(root, `.${pathname}`)
          : resolve(dirname(pagePath), pathname);
        if (!existsSync(target)) errors.push(`${page}: ${name}="${reference}" points to a missing file`);
      } catch (error) {
        errors.push(`${page}: ${name}="${reference}" has an invalid path (${error.message})`);
      }
    }
  }
}

if (errors.length) {
  console.error(`Local reference smoke test failed:\n${errors.join('\n')}`);
  process.exitCode = 1;
} else {
  console.log(`Local reference smoke test passed: ${checked} references in ${pages.join(', ')}.`);
}
