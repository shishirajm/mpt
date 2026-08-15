const { test, expect } = require('@playwright/test');

// Crawls every internal link reachable from the pages below and asserts
// each one resolves (no 404s). A BFS crawl rather than a hardcoded page
// list, so it keeps working as pages get added or removed — that's the
// whole point of a broken-link check.
//
// Seeded with '/' plus the two pages nothing links to on purpose
// (404.html is a CloudFront error target, thank-you.html is a form
// redirect target) so they still get checked even though the crawl
// wouldn't discover them by following <a href> on its own.
const SEED_PATHS = ['/', '/404.html', '/thank-you.html'];

function isExternal(href, baseURL) {
  if (/^https?:\/\//i.test(href)) return !href.startsWith(baseURL);
  return false;
}

function toPath(href) {
  if (/^https?:\/\//i.test(href)) {
    const u = new URL(href);
    return u.pathname + u.search;
  }
  return href.split('#')[0];
}

test('no broken internal links', async ({ request, baseURL }) => {
  const visited = new Set();
  const queue = [...SEED_PATHS];
  const broken = [];

  while (queue.length) {
    const path = queue.shift();
    if (!path || visited.has(path)) continue;
    visited.add(path);

    const res = await request.get(path);
    if (!res.ok()) {
      broken.push(`${path} -> ${res.status()}`);
      continue;
    }

    const contentType = res.headers()['content-type'] || '';
    if (!contentType.includes('text/html')) continue; // nothing further to crawl (css/js/images/xml/etc.)

    const body = await res.text();
    const hrefs = [...body.matchAll(/(?:href|src)="([^"]+)"/g)].map((m) => m[1]);
    // srcset can hold multiple "url descriptor, url descriptor" entries — <picture><source srcset="...">.
    for (const m of body.matchAll(/srcset="([^"]+)"/g)) {
      for (const candidate of m[1].split(',')) {
        const url = candidate.trim().split(/\s+/)[0];
        if (url) hrefs.push(url);
      }
    }

    for (const raw of hrefs) {
      if (!raw || raw.startsWith('#') || raw.startsWith('mailto:') || raw.startsWith('tel:') || raw.startsWith('data:')) continue;
      if (isExternal(raw, baseURL)) continue;
      const path2 = toPath(raw);
      if (!path2) continue;
      if (!visited.has(path2) && !queue.includes(path2)) queue.push(path2);
    }
  }

  expect(broken, `Broken links found:\n${broken.join('\n')}`).toEqual([]);
  console.log(`Checked ${visited.size} internal URLs, 0 broken.`);
});
