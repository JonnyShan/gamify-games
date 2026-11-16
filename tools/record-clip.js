// Records a smooth gameplay clip on any machine, however slow its GPU.
// The page clock is frozen and stepped one frame at a time, then the frames are stitched at 30 fps.
// Usage: node tools/record-clip.js <url> <out.mp4> [seconds=10] [warmupSeconds=6] [w=450] [h=800] [script.js]
// The optional script exports async (page, step) => {} and runs after warmup (taps, swipes).
const { chromium } = require('playwright');
const { execFileSync } = require('child_process');
const fs = require('fs'), path = require('path'), os = require('os');
const [url, out, secs = '10', warm = '6', W = '450', H = '800', scriptPath] = process.argv.slice(2);
const FPS = 30, DT = 1000 / FPS;
(async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'clip-'));
  const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--autoplay-policy=no-user-gesture-required'] });
  const ctx = await b.newContext({ viewport: { width: +W, height: +H }, deviceScaleFactor: 1.5, hasTouch: true, isMobile: true });
  await ctx.addInitScript(() => {
    let t = 0; const base = Date.now(); let q = []; let id = 0;
    const realRAF = window.requestAnimationFrame.bind(window);
    window.__virtual = true;
    window.requestAnimationFrame = cb => { q.push([++id, cb]); return id; };
    window.cancelAnimationFrame = h => { q = q.filter(([i]) => i !== h); };
    performance.now = () => t;
    Date.now = () => base + t;
    window.__step = ms => new Promise(res => { t += ms; const c = q; q = []; for (const [, f] of c) { try { f(t); } catch (e) { console.error(e); } } realRAF(() => res()); });
  });
  const page = await ctx.newPage();
  page.on('pageerror', e => console.log('pageerror', e.message));
  await page.goto(url, { timeout: 120000 });
  const step = (n = 1) => page.evaluate(async ([n, dt]) => { for (let i = 0; i < n; i++) await window.__step(dt); }, [n, DT]);
  // warm up: let assets load in real time while the clock ticks
  for (let i = 0; i < +warm * FPS; i++) { await step(1); if (i % 30 === 0) await page.waitForTimeout(150); }
  let act = null;
  if (scriptPath) act = require(path.resolve(scriptPath));
  const total = Math.round(+secs * FPS);
  for (let f = 0; f < total; f++) {
    if (act) await act(page, f, step);
    await step(1);
    await page.screenshot({ path: path.join(dir, `f${String(f).padStart(5, '0')}.png`), timeout: 120000 });
    if (f % 30 === 0) process.stdout.write(`${f}/${total} `);
  }
  await b.close();
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', path.join(dir, 'f%05d.png'),
    '-vf', 'scale=540:-2:flags=lanczos', '-c:v', 'libx264', '-crf', '24', '-preset', 'slow', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an', out]);
  fs.rmSync(dir, { recursive: true, force: true });
  console.log('\nwrote', out);
})();
