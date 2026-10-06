import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

/*
 * Reglas de este archivo (todo pensado para que vaya fluido):
 *  - Solo se anima transform y opacity. Nunca filtros, sombras ni máscaras.
 *  - will-change solo mientras algo se mueve (warm/cool); nunca fijo en el CSS.
 *  - Las apariciones al hacer scroll van agrupadas (ScrollTrigger.batch), duran ≤0,5 s
 *    y empiezan en cuanto el elemento asoma por abajo (top 92 %), sin esperas encadenadas.
 *  - Nada mide el layout dentro del scroll; las medidas se leen al entrar con el ratón.
 *  - Lo que está fuera de pantalla se pausa (marquee, pastillas, humo).
 */

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const $$ = <T extends Element = HTMLElement>(s: string) => gsap.utils.toArray<T>(s);
const warm = (els: Element[]) => els.forEach((e) => ((e as HTMLElement).style.willChange = 'transform, opacity'));
const cool = (els: Element[]) => els.forEach((e) => ((e as HTMLElement).style.willChange = ''));

// Con View Transitions las animaciones se montan y se desmontan en cada página.
const mms: gsap.MatchMedia[] = [];
const newMM = () => { const m = gsap.matchMedia(); mms.push(m); return m; };
let lenis: Lenis | null = null;

/* ---------- ¿Se está haciendo scroll? Los bucles decorativos se pausan mientras tanto ---------- */
const scrollListeners = new Set<(scrolling: boolean) => void>();
function trackScrolling() {
  const root = document.documentElement;
  let t = 0, on = false;
  window.addEventListener('scroll', () => {
    if (!on) { on = true; root.setAttribute('data-scrolling', ''); scrollListeners.forEach((f) => f(true)); }
    clearTimeout(t);
    t = window.setTimeout(() => { on = false; root.removeAttribute('data-scrolling'); scrollListeners.forEach((f) => f(false)); }, 160);
  }, { passive: true });
}

/* ---------- Scroll suave sincronizado con ScrollTrigger (el usuario manda) ---------- */
function smoothScroll() {
  const l = new Lenis({ lerp: 0.1 });
  lenis = l;
  l.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => l.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  // Anclas (#id o /#id estando en la home): llegan suaves con Lenis.
  document.addEventListener('click', (e) => {
    const a = (e.target as Element).closest?.('a');
    const href = a?.getAttribute('href') ?? '';
    const m = href.match(/^\/?#(.+)$/);
    if (!m || (href.startsWith('/#') && location.pathname !== '/')) return;
    const target = document.getElementById(m[1]);
    if (target) {
      e.preventDefault();
      l.scrollTo(target, { offset: 0 });
      // El foco también se mueve a la sección (enlace "Saltar al contenido", teclado y lectores de pantalla).
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
      history.replaceState(null, '', href.startsWith('/') ? href.slice(1) : href);
    }
  }, true);
}

/* ---------- Intro (solo primera visita): ~0,95 s; la entrada del hero arranca a los 0,45 s ---------- */
const INTRO_HERO_DELAY = 0.45; // intro + entrada del hero = ~1,45 s en total
function intro(): Promise<void> {
  const root = document.documentElement;
  if (!root.classList.contains('intro-on') || !document.querySelector('.intro')) { root.classList.remove('intro-on'); return Promise.resolve(); }
  const els = $$('.intro__disc, .intro__mark, .intro__in, .intro');
  warm(els);
  return new Promise((resolve) => {
    const tl = gsap.timeline({ onComplete: () => { root.classList.remove('intro-on'); cool(els); resolve(); } });
    tl.from('.intro__in', { yPercent: 110, duration: 0.35, ease: 'power4.out' }, 0)
      .to('.intro__disc', { scale: 1, duration: 0.4, ease: 'power3.out' }, 0)
      .to('.intro__mark', { opacity: 0, duration: 0.1 }, 0.38)
      .to('.intro__disc', { scale: 5, duration: 0.45, ease: 'power3.inOut' }, 0.4)
      .to('.intro', { yPercent: -100, duration: 0.4, ease: 'power4.inOut' }, 0.55);
  });
}

/* ---------- Nav: se esconde al bajar y vuelve al subir (solo cambia clases cuando cambia el estado) ---------- */
function nav() {
  const el = document.querySelector<HTMLElement>('[data-nav]');
  if (!el) return;
  let top = true, hidden = false;
  ScrollTrigger.create({
    start: 0, end: 'max',
    onUpdate: (self) => {
      const y = self.scroll();
      const nTop = y < 40, nHidden = self.direction === 1 && y > 500;
      if (nTop !== top) { top = nTop; el.classList.toggle('nav--top', top); }
      if (nHidden !== hidden) { hidden = nHidden; el.classList.toggle('nav--hidden', hidden); }
    },
  });
  el.classList.add('nav--top');
}

/* ---------- Hero: entrada rápida y coreografiada ---------- */
function hero(delay = 0) {
  if (!document.querySelector('.hero')) return;
  const mm = newMM();

  mm.add('(min-width: 0px)', () => {
    const els = $$('.hero .line__in, .hero__halo, .hero__circle, .hero__figure, .hero__rim, .hero__word, .pill__in, .hero__foot > *, .meta, .hero__note');
    warm(els);
    const tl = gsap.timeline({ delay, defaults: { ease: 'power4.out' }, onComplete: () => cool(els) });
    tl.from('.hero .line__in', { yPercent: 110, duration: 0.65, stagger: 0.07 }, 0)
      .from('.hero__halo', { opacity: 0, duration: 0.8 }, 0)
      .from('.hero__circle', { scale: 0, transformOrigin: '50% 60%', duration: 0.8, ease: 'expo.out' }, 0)
      .from('.hero__figure', { yPercent: 8, duration: 0.7 }, 0.1) // sin opacity: el retrato (LCP) cuenta en cuanto se pinta
      .from('.hero__word', { opacity: 0, y: 24, duration: 0.7 }, 0.1)
      .from('.pill__in', { scale: 0.6, opacity: 0, duration: 0.45, stagger: 0.06, ease: 'back.out(1.5)' }, 0.3)
      .from('.hero__foot > *, .hero__note, .meta', { y: 20, opacity: 0, duration: 0.45, stagger: 0.05 }, 0.35)
      .from('.hero__rim', { opacity: 0, duration: 0.5 }, 0.5);

    // Pastillas flotando en bucle: solo mientras el hero se ve
    const pills = $$('.pill');
    const floats = pills.map((p, i) => gsap.to(p, { y: i % 2 ? 10 : -10, duration: 2.4 + i * 0.5, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: i * 0.3 }));
    let heroVisible = true, scrolling = false;
    const sync = () => floats.forEach((f) => f.paused(!heroVisible || scrolling));
    const onScrolling = (s: boolean) => { scrolling = s; sync(); };
    scrollListeners.add(onScrolling);
    ScrollTrigger.create({
      trigger: '.hero', start: 'top bottom', end: 'bottom top',
      onToggle: (self) => { heroVisible = self.isActive; sync(); self.isActive ? warm(pills) : cool(pills); },
    });

    // "PORTFOLIO" baja un poco más despacio que el scroll (sin medir nada: yPercent)
    const word = document.querySelector<HTMLElement>('.hero__word')!;
    gsap.to(word, {
      yPercent: 22, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true, onToggle: (s) => (s.isActive ? warm([word]) : cool([word])) },
    });
  });

  // Solo escritorio con ratón: pastillas y capas reaccionan al puntero (se leen medidas una vez).
  mm.add('(min-width: 52rem) and (hover: hover) and (pointer: fine)', () => {
    const heroEl = document.querySelector<HTMLElement>('.hero')!;
    const moves = $$('[data-pill]').map((el, i) => ({
      x: gsap.quickTo(el, 'x', { duration: 0.8, ease: 'power3.out' }),
      y: gsap.quickTo(el, 'y', { duration: 0.8, ease: 'power3.out' }),
      k: [26, -34, 20][i] ?? 20,
    }));
    const layers = $$('.hero [data-depth]').map((el) => ({ x: gsap.quickTo(el, 'x', { duration: 1, ease: 'power3.out' }), k: Number(el.dataset.depth) * 16 }));
    let w = innerWidth, h = innerHeight;
    const onResize = () => { w = innerWidth; h = innerHeight; };
    const onMove = (e: PointerEvent) => {
      const nx = e.clientX / w - 0.5, ny = e.clientY / h - 0.5;
      moves.forEach((m) => { m.x(nx * m.k); m.y(ny * m.k); });
      layers.forEach((l) => l.x(nx * l.k));
    };
    heroEl.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('resize', onResize);
    return () => { heroEl.removeEventListener('pointermove', onMove); window.removeEventListener('resize', onResize); };
  });
}

/* ---------- Botones magnéticos (escritorio con ratón): el rectángulo se lee al entrar, no en cada movimiento ---------- */
function magnetic() {
  const mm = newMM();
  mm.add('(min-width: 52rem) and (hover: hover) and (pointer: fine)', () => {
    const off: Array<() => void> = [];
    $$('[data-magnetic]').forEach((el) => {
      const x = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' });
      const y = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });
      let cx = 0, cy = 0;
      const enter = () => { const r = el.getBoundingClientRect(); cx = r.left + r.width / 2 - (gsap.getProperty(el, 'x') as number); cy = r.top + r.height / 2 - (gsap.getProperty(el, 'y') as number); };
      const move = (e: PointerEvent) => { x((e.clientX - cx) * 0.28); y((e.clientY - cy) * 0.28); };
      const leave = () => { x(0); y(0); };
      el.addEventListener('pointerenter', enter); el.addEventListener('pointermove', move, { passive: true }); el.addEventListener('pointerleave', leave);
      off.push(() => { el.removeEventListener('pointerenter', enter); el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave); });
    });
    return () => off.forEach((f) => f());
  });
}

/* ---------- Apariciones al hacer scroll: agrupadas, rápidas y sin retrasos encadenados ---------- */
const SCROLL_START = 'top 92%'; // empiezan en cuanto asoman por abajo, mucho antes del centro
const hiddenToReveal: Array<{ els: Element[]; to: gsap.TweenVars }> = [];

function batchIn(selector: string, from: gsap.TweenVars, to: gsap.TweenVars, stagger = 0.06) {
  const els = $$(selector);
  if (!els.length) return;
  gsap.set(els, from);
  hiddenToReveal.push({ els, to });
  ScrollTrigger.batch(els, {
    start: SCROLL_START, once: true, interval: 0.05, batchMax: 6,
    onEnter: (batch) => { warm(batch); gsap.to(batch, { ...to, duration: 0.5, ease: 'power3.out', stagger, overwrite: true, onComplete: () => cool(batch) }); },
  });
}

// Lo que quedó por encima de la pantalla (p. ej. al saltar a un ancla) se deja ya en su estado final.
function settleAbove() {
  hiddenToReveal.forEach(({ els, to }) => els.forEach((el) => { if (el.getBoundingClientRect().bottom < 0) gsap.set(el, { ...to }); }));
}

function reveals() {
  hiddenToReveal.length = 0;
  batchIn('[data-lines] .line__in', { yPercent: 110 }, { yPercent: 0 }, 0.08);
  batchIn('[data-gal], .step__body > *, .hito, [data-steps] .paso, .arch, .tool', { y: 30, opacity: 0 }, { y: 0, opacity: 1 });

  // Subrayador: la barra se pinta en cuanto la frase asoma (la animación es la transición CSS de 0,5 s)
  const hls = $$('.hl');
  if (hls.length) ScrollTrigger.batch(hls, { start: SCROLL_START, once: true, interval: 0.05, onEnter: (b) => b.forEach((el, i) => gsap.delayedCall(i * 0.06, () => el.classList.add('is-on'))) });

  // Flechas manuscritas: se dibujan al asomar
  const paths = $$<SVGPathElement>('[data-draw]').filter((p) => !p.closest('[data-timeline]'));
  if (paths.length) {
    paths.forEach((p) => { const len = p.getTotalLength(); gsap.set(p, { strokeDasharray: len, strokeDashoffset: len }); });
    hiddenToReveal.push({ els: paths, to: { strokeDashoffset: 0 } });
    ScrollTrigger.batch(paths, { start: SCROLL_START, once: true, interval: 0.05, onEnter: (b) => gsap.to(b, { strokeDashoffset: 0, duration: 0.6, ease: 'power2.inOut', stagger: 0.08, overwrite: true }) });
  }

  // Cronología: el raíl se dibuja con el scroll (un solo trazo)
  const rail = document.querySelector<SVGPathElement>('[data-timeline] [data-draw]');
  if (rail) {
    const len = rail.getTotalLength();
    gsap.set(rail, { strokeDasharray: len, strokeDashoffset: len });
    gsap.to(rail, { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: '[data-timeline]', start: 'top 80%', end: 'bottom 70%', scrub: true } });
  }
}

/* ---------- Marquee: acelera con el scroll (sin recrear tweens), se pausa con el ratón y fuera de pantalla ---------- */
function marquee() {
  if (!document.querySelector('.marquee')) return;
  const tweens = $$('[data-marquee]').map((track) => {
    const dir = Number(track.dataset.dir) || -1;
    return gsap.fromTo(track, { xPercent: dir === -1 ? 0 : -50 }, { xPercent: dir === -1 ? -50 : 0, duration: 34, ease: 'none', repeat: -1, paused: true });
  });
  const tracks = $$('[data-marquee]');
  let boost = 1, hovered = false, visible = false;
  const tick = () => {
    if (!visible) return;
    boost += (1 - boost) * 0.06; // vuelve poco a poco a la velocidad normal
    tweens.forEach((t) => t.timeScale(hovered ? 0 : boost));
  };
  gsap.ticker.add(tick);
  tracks.forEach((tr) => {
    tr.parentElement?.addEventListener('pointerenter', () => (hovered = true));
    tr.parentElement?.addEventListener('pointerleave', () => (hovered = false));
  });
  ScrollTrigger.create({
    trigger: '.marquee', start: 'top bottom', end: 'bottom top',
    onToggle: (self) => { visible = self.isActive; tweens.forEach((t) => t.paused(!visible)); visible ? warm(tracks) : cool(tracks); },
    onUpdate: (self) => { boost = Math.max(boost, 1 + Math.min(Math.abs(self.getVelocity()) / 400, 2.5)); },
  });
  ctxCleanups.push(() => gsap.ticker.remove(tick));
}

/* ---------- Sección puente: fijada en escritorio, palabra a palabra ---------- */
function bridge() {
  if (!document.querySelector('[data-bridge]')) return;
  const mm = newMM();
  mm.add('(min-width: 52rem)', () => {
    gsap.set('.bridge .w', { opacity: 0.12 });
    gsap.timeline({ scrollTrigger: { trigger: '[data-bridge]', start: 'top top', end: '+=120%', pin: true, scrub: 0.5 } })
      .to('.bridge .w', { opacity: 1, stagger: 0.25, ease: 'none' });
  });
  mm.add('(max-width: 51.99rem)', () => {
    gsap.set('.bridge .w', { opacity: 0.15 });
    gsap.to('.bridge .w', { opacity: 1, stagger: 0.25, ease: 'none', scrollTrigger: { trigger: '[data-bridge]', start: 'top 70%', end: 'center 45%', scrub: true } });
  });
}

/* ---------- Proyectos: apilado, número con parallax, inclinación 3D y cursor ---------- */
function projects() {
  if (!document.querySelector('.stack')) return;
  const mm = newMM();
  mm.add('(min-width: 52rem)', () => {
    const cards = $$('[data-card]');
    cards.forEach((wrap, i) => {
      const card = wrap.querySelector<HTMLElement>('.card')!;
      const veil = card.querySelector('.card__veil');
      const num = card.querySelector<HTMLElement>('[data-num]')!;
      const next = cards[i + 1];
      if (next) {
        gsap.timeline({ scrollTrigger: { trigger: next, start: 'top 85%', end: 'top 20%', scrub: true, onToggle: (s) => (s.isActive ? warm([card]) : cool([card])) } })
          .to(card, { scale: 0.93, transformOrigin: '50% 0%', ease: 'none' }, 0)
          .to(veil, { opacity: 0.55, ease: 'none' }, 0);
      }
      gsap.fromTo(num, { yPercent: -6 }, { yPercent: 10, ease: 'none', scrollTrigger: { trigger: wrap, start: 'top bottom', end: 'bottom top', scrub: true, onToggle: (s) => (s.isActive ? warm([num]) : cool([num])) } });
    });
  });
  mm.add('(min-width: 52rem) and (hover: hover) and (pointer: fine)', () => {
    const off: Array<() => void> = [];
    // Inclinación 3D de los mockups: el rectángulo de la tarjeta se mide al entrar
    $$('.card [data-tilt]').forEach((el) => {
      gsap.set(el, { transformPerspective: 1100 });
      const rx = gsap.quickTo(el, 'rotationX', { duration: 0.8, ease: 'power3.out' });
      const ry = gsap.quickTo(el, 'rotationY', { duration: 0.8, ease: 'power3.out' });
      const card = el.closest('.card') as HTMLElement;
      let r = card.getBoundingClientRect();
      const enter = () => { r = card.getBoundingClientRect(); warm([el]); };
      const move = (e: PointerEvent) => { ry(((e.clientX - r.left) / r.width - 0.5) * 7); rx(-((e.clientY - r.top) / r.height - 0.5) * 5); };
      const leave = () => { rx(0); ry(0); gsap.delayedCall(0.9, () => cool([el])); };
      card.addEventListener('pointerenter', enter); card.addEventListener('pointermove', move, { passive: true }); card.addEventListener('pointerleave', leave);
      off.push(() => { card.removeEventListener('pointerenter', enter); card.removeEventListener('pointermove', move); card.removeEventListener('pointerleave', leave); });
    });
    // Cursor "Ver proyecto"
    const cur = document.querySelector<HTMLElement>('.cursor');
    if (cur) {
      const cx = gsap.quickTo(cur, 'x', { duration: 0.35, ease: 'power3.out' });
      const cy = gsap.quickTo(cur, 'y', { duration: 0.35, ease: 'power3.out' });
      let px = 0, py = 0, raf = 0;
      const move = (e: PointerEvent) => { px = e.clientX; py = e.clientY; cx(px); cy(py); };
      const fuera = () => {
        raf = 0;
        if (!document.elementFromPoint(px, py)?.closest('.card')) gsap.to(cur, { scale: 0, duration: 0.2, overwrite: true, onComplete: () => cool([cur]) });
      };
      const onScroll = () => { if (!raf) raf = requestAnimationFrame(fuera); };
      window.addEventListener('pointermove', move, { passive: true });
      window.addEventListener('scroll', onScroll, { passive: true });
      off.push(() => { window.removeEventListener('pointermove', move); window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); gsap.set(cur, { scale: 0 }); });
      $$('.card [data-cursor]').forEach((a) => {
        const card = a.closest('.card') as HTMLElement;
        const enter = () => { cur.textContent = a.dataset.cursor ?? ''; warm([cur]); gsap.to(cur, { scale: 1, duration: 0.25, ease: 'back.out(2)', overwrite: true }); };
        const out = () => gsap.to(cur, { scale: 0, duration: 0.2, overwrite: true, onComplete: () => cool([cur]) });
        card.addEventListener('pointerenter', enter); card.addEventListener('pointerleave', out);
        off.push(() => { card.removeEventListener('pointerenter', enter); card.removeEventListener('pointerleave', out); });
      });
    }
    return () => off.forEach((f) => f());
  });
}

/* ---------- Sobre mí: el retrato se mueve un poco al hacer scroll (solo transform) ---------- */
function about() {
  if (!document.querySelector('.about')) return;
  const img = document.querySelector<HTMLElement>('.arch img')!;
  gsap.to(img, { yPercent: -5, ease: 'none', scrollTrigger: { trigger: '.about', start: 'top bottom', end: 'bottom top', scrub: true, onToggle: (s) => (s.isActive ? warm([img]) : cool([img])) } });
}

/* ---------- Página de proyecto ---------- */
function projectPage() {
  if (!document.querySelector('[data-ph]')) return;
  const els = $$('.ph__title, .ph__num, .ph__copy > *, .ph__main, .ph .ghost, .ph__phone');
  warm(els);
  const tl = gsap.timeline({ defaults: { ease: 'power4.out' }, onComplete: () => cool(els) });
  tl.from('.ph__title', { yPercent: 30, opacity: 0, duration: 0.6 })
    .from('.ph__num', { opacity: 0, scale: 0.94, duration: 0.8, transformOrigin: '0% 30%' }, 0)
    .from('.ph__copy > *:not(.ph__title)', { y: 20, opacity: 0, duration: 0.45, stagger: 0.05 }, 0.1)
    .from('.ph__main, .ph .ghost', { y: 40, opacity: 0, duration: 0.7 }, 0.1)
    .from('.ph__phone', { y: 30, opacity: 0, duration: 0.5, ease: 'back.out(1.4)' }, 0.5);

  const mm = newMM();
  mm.add('(min-width: 52rem)', () => {
    const num = document.querySelector<HTMLElement>('.ph__num')!;
    gsap.to(num, { yPercent: 14, ease: 'none', scrollTrigger: { trigger: '[data-ph]', start: 'top top', end: 'bottom top', scrub: true, onToggle: (s) => (s.isActive ? warm([num]) : cool([num])) } });
    const nn = document.querySelector<HTMLElement>('.next__num');
    if (nn) gsap.from(nn, { xPercent: 12, ease: 'none', scrollTrigger: { trigger: '.next', start: 'top bottom', end: 'center center', scrub: true } });
  });
  mm.add('(min-width: 52rem) and (hover: hover) and (pointer: fine)', () => {
    const off: Array<() => void> = [];
    const mock = document.querySelector<HTMLElement>('.ph__mock');
    if (mock) {
      gsap.set(mock, { transformPerspective: 1300 });
      const rx = gsap.quickTo(mock, 'rotationX', { duration: 0.8, ease: 'power3.out' });
      const ry = gsap.quickTo(mock, 'rotationY', { duration: 0.8, ease: 'power3.out' });
      let w = innerWidth, h = innerHeight;
      const onResize = () => { w = innerWidth; h = innerHeight; };
      const move = (e: PointerEvent) => { ry((e.clientX / w - 0.5) * 6); rx(-(e.clientY / h - 0.5) * 4); };
      window.addEventListener('pointermove', move, { passive: true }); window.addEventListener('resize', onResize);
      off.push(() => { window.removeEventListener('pointermove', move); window.removeEventListener('resize', onResize); });
    }
    const cur = document.querySelector<HTMLElement>('.cursor');
    const link = document.querySelector<HTMLElement>('[data-next]');
    if (cur && link) {
      const cx = gsap.quickTo(cur, 'x', { duration: 0.35, ease: 'power3.out' });
      const cy = gsap.quickTo(cur, 'y', { duration: 0.35, ease: 'power3.out' });
      const move = (e: PointerEvent) => { cx(e.clientX); cy(e.clientY); };
      const enter = () => { cur.textContent = link.dataset.cursor ?? ''; warm([cur]); gsap.to(cur, { scale: 1, duration: 0.25, ease: 'back.out(2)', overwrite: true }); };
      const out = () => gsap.to(cur, { scale: 0, duration: 0.2, overwrite: true, onComplete: () => cool([cur]) });
      window.addEventListener('pointermove', move, { passive: true }); link.addEventListener('pointerenter', enter); link.addEventListener('pointerleave', out);
      off.push(() => { window.removeEventListener('pointermove', move); link.removeEventListener('pointerenter', enter); link.removeEventListener('pointerleave', out); gsap.set(cur, { scale: 0 }); });
    }
    return () => off.forEach((f) => f());
  });
}

/* ---------- Humo: se anima solo mientras se ve ---------- */
let smokeIO: IntersectionObserver | null = null;
function smokeVisibility() {
  if (!('IntersectionObserver' in window)) return;
  smokeIO = new IntersectionObserver((entries) => entries.forEach((e) => e.target.toggleAttribute('data-off', !e.isIntersecting)), { rootMargin: '100px' });
  $$('.smoke').forEach((el) => smokeIO?.observe(el));
}

/* ---------- Ciclo de vida con View Transitions ---------- */
let ctx: gsap.Context | null = null;
let lastBody: HTMLElement | null = null;
const ctxCleanups: Array<() => void> = [];
let bootToken = 0;
let firstBoot = true;
const idle = (fn: () => void) =>
  'requestIdleCallback' in window ? (window as any).requestIdleCallback(fn, { timeout: 400 }) : setTimeout(fn, 40);

function boot() {
  document.documentElement.classList.add('js');
  if (reduce) { document.documentElement.classList.remove('intro-on'); return; }
  const token = ++bootToken;
  const esNavegacion = !firstBoot;
  firstBoot = false;
  const conIntro = document.documentElement.classList.contains('intro-on') && !!document.querySelector('.hero');
  ctx = gsap.context(() => {});
  // Lo que se ve al cargar, enseguida; el resto, troceado en tareas cortas para no bloquear el hilo principal.
  ctx.add(() => { nav(); intro(); hero(conIntro ? INTRO_HERO_DELAY : 0); projectPage(); });
  const resto = [magnetic, reveals, marquee, bridge, projects, about, smokeVisibility];
  const terminar = () => {
    ScrollTrigger.refresh();
    const ir = () => {
      const hash = location.hash && document.getElementById(location.hash.slice(1));
      lenis?.resize(); // el límite de scroll de Lenis se recalcula con el nuevo contenido
      lenis?.scrollTo(hash || 0, { immediate: true, force: true });
    };
    // Primera carga: arriba del todo (o a la #sección si se entra con un enlace a ella). Tras navegar, igual.
    if (esNavegacion || location.hash) { ir(); requestAnimationFrame(() => { ScrollTrigger.refresh(); ir(); settleAbove(); }); }
    else { lenis?.scrollTo(0, { immediate: true, force: true }); window.scrollTo(0, 0); settleAbove(); }
  };
  const paso = (i: number) => {
    if (token !== bootToken || !ctx) return;
    if (i === resto.length) { terminar(); return; }
    ctx.add(resto[i]);
    idle(() => paso(i + 1));
  };
  idle(() => paso(0));
}
function teardown() {
  bootToken++;
  smokeIO?.disconnect(); smokeIO = null;
  scrollListeners.clear();
  ctxCleanups.splice(0).forEach((f) => f());
  mms.splice(0).forEach((m) => m.revert());
  ctx?.revert(); ctx = null;
  ScrollTrigger.getAll().forEach((t) => t.kill());
}
function ensureBoot() {
  if (lastBody === document.body) return;
  lastBody = document.body;
  boot();
}
document.addEventListener('astro:before-swap', teardown);
document.addEventListener('astro:after-swap', () => document.documentElement.classList.add('js'));
document.addEventListener('astro:page-load', ensureBoot);

/* Sin movimiento si el usuario lo pide: todo el contenido ya está visible en el HTML. */
if (!reduce) { smoothScroll(); trackScrolling(); }
ensureBoot();
