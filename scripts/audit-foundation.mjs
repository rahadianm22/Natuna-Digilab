import { chromium } from "@playwright/test";
const url = process.argv[2] ?? "http://localhost:3000/foundation";

const AUDIT = () => {
  const rgb = s => (s.match(/[\d.]+/g) || []).map(Number);
  const lin = c => (c /= 255) <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  const L = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  const cr = (a, b) => { const [x, y] = [L(a), L(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
  const vis = e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
  const bgOf = e => { let p = e; while (p) { const c = rgb(getComputedStyle(p).backgroundColor); if (c.length && (c[3] ?? 1) > 0) return c; p = p.parentElement; } return [255, 255, 255]; };
  const contrastFails = [], small = [];
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n; (n = w.nextNode());) {
    const t = n.textContent.trim(); const e = n.parentElement;
    if (!t || !vis(e)) continue;
    const cs = getComputedStyle(e); const fs = parseFloat(cs.fontSize); const fw = +cs.fontWeight;
    const r = cr(rgb(cs.color), bgOf(e));
    const need = fs >= 24 || (fs >= 18.66 && fw >= 700) ? 4.5 : 7;
    if (r < need) contrastFails.push({ text: t.slice(0, 40), ratio: +r.toFixed(2), need });
    if (fs < 12 && e.closest("main") && t !== "Ctrl K") small.push({ text: t.slice(0, 40), fs });
  }
  const targets = [...document.querySelectorAll("a,button,[role=tab],[role=switch],input,select,summary")]
    .filter(vis).filter(e => !e.closest("p") && !e.matches(".sr-only, [href='#main']"))
    .map(e => { const r = e.getBoundingClientRect(); return { text: (e.innerText || e.getAttribute("aria-label") || "").trim().slice(0, 30), h: Math.round(r.height), w: Math.round(r.width) }; })
    .filter(x => x.h < 44 || x.w < 24);
  return { contrastFails, small, targets };
};

// AUDIT_CHANNEL=msedge uses the installed Edge instead of the bundled Chromium.
const browser = await chromium.launch(process.env.AUDIT_CHANNEL ? { channel: process.env.AUDIT_CHANNEL } : {});
let failed = false;
for (const scheme of ["light", "dark"]) for (const width of [1440, 390]) {
  const page = await browser.newPage({ viewport: { width, height: 900 }, colorScheme: scheme });
  await page.goto(url, { waitUntil: "networkidle" });
  const r = await page.evaluate(AUDIT);
  for (let i = 0; i < 3; i++) await page.keyboard.press("Tab");
  const focus = await page.evaluate(() => { const c = getComputedStyle(document.activeElement); return `${c.outlineStyle} ${c.outlineWidth} ${c.outlineColor} offset ${c.outlineOffset}`; });
  console.log(`\n[${scheme} ${width}] contrast fails: ${r.contrastFails.length}, small text: ${r.small.length}, small targets: ${r.targets.length}\n  focus: ${focus}`);
  for (const k of ["contrastFails", "small", "targets"]) r[k].slice(0, 10).forEach(x => console.log(`  ${k}:`, JSON.stringify(x)));
  if (r.contrastFails.length || r.small.length || r.targets.length) failed = true;
  await page.close();
}
await browser.close();
process.exit(failed ? 1 : 0);
