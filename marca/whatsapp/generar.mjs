// Genera los JPG del banner (1600 × 900) y las simulaciones con la foto de perfil.
// Uso: node marca/whatsapp/generar.mjs   (necesita playwright-core y un Chromium)
import { chromium } from 'playwright-core';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const dir = path.dirname(fileURLToPath(import.meta.url));
const exe = process.env.CHROME_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const b = await chromium.launch({ executablePath: exe, args: ['--allow-file-access-from-files'] });
const p = await (await b.newContext({ viewport: { width: 1600, height: 900 } })).newPage();
const shot = async (q, file, clip) => {
  await p.goto('file://' + path.join(dir, 'banner.html') + '?' + q);
  await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(400);
  await p.screenshot({ path: path.join(dir, file), type: 'jpeg', quality: 92, clip });
};
const strip = { x: 0, y: 102, width: 1600, height: 696 }; // franja central 2,3:1
for (const v of ['a', 'b', 'c']) {
  await shot(`v=${v}`, `banner-whatsapp-${v}.jpg`);
  await shot(`v=${v}&sim=1`, `simulacion/${v}-16x9.jpg`);
  await shot(`v=${v}&sim=1`, `simulacion/${v}-franja-2.3x1.jpg`, strip);
}
await b.close();
