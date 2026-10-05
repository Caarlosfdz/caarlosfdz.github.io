import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const $$ = <T extends Element = HTMLElement>(s: string) => gsap.utils.toArray<T>(s);

/* ---------- Scroll suave sincronizado con ScrollTrigger (el usuario manda) ---------- */
function smoothScroll() {
  const lenis = new Lenis({ lerp: 0.1 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      const target = id && id.length > 1 ? document.querySelector<HTMLElement>(id) : null;
      if (target) { e.preventDefault(); lenis.scrollTo(target, { offset: 0 }); }
    });
  });
}

/* ---------- Intro (solo primera visita, ~1,3 s) ---------- */
function intro(): Promise<void> {
  const root = document.documentElement;
  if (!root.classList.contains('intro-on')) return Promise.resolve();
  return new Promise((resolve) => {
    const tl = gsap.timeline({
      onComplete: () => { root.classList.remove('intro-on'); resolve(); },
    });
    tl.from('.intro__in', { yPercent: 110, duration: 0.5, ease: 'power4.out' }, 0.05)
      .to('.intro__disc', { scale: 1, duration: 0.55, ease: 'power3.in' }, 0)
      .to('.intro__mark', { opacity: 0, duration: 0.15 }, 0.65)
      .to('.intro__disc', { scale: 5, duration: 0.55, ease: 'power3.inOut' }, 0.7)
      .to('.intro', { yPercent: -100, duration: 0.5, ease: 'power4.inOut' }, 0.85);
  });
}

/* ---------- Nav: se esconde al bajar y vuelve al subir ---------- */
function nav() {
  const el = document.querySelector<HTMLElement>('[data-nav]');
  if (!el) return;
  ScrollTrigger.create({
    start: 0, end: 'max',
    onUpdate: (self) => {
      const y = self.scroll();
      el.classList.toggle('nav--top', y < 40);
      el.classList.toggle('nav--hidden', self.direction === 1 && y > 500);
    },
  });
  el.classList.add('nav--top');
}

/* ---------- Hero ---------- */
function hero(delay = 0) {
  const q = (s: string) => document.querySelector<HTMLElement>(s);
  const mm = gsap.matchMedia();

  mm.add('(min-width: 0px)', () => {
    const tl = gsap.timeline({ delay, defaults: { ease: 'power4.out' } });
    tl.from('.hero .line__in', { yPercent: 110, duration: 1.1, stagger: 0.12 })
      .from('.hero__halo', { opacity: 0, duration: 1.6 }, 0.1)
      .from('.hero__circle', { scale: 0, transformOrigin: '50% 60%', duration: 1.2, ease: 'expo.out' }, 0.1)
      .from('.hero__portrait img', { yPercent: 8, opacity: 0, duration: 1.1 }, 0.25)
      .from('.hero__rim', { opacity: 0, duration: 1.2 }, 0.9)
      .from('.hero__word', { opacity: 0, yPercent: 12, duration: 1.3 }, 0.2)
      .from('.pill__in', { scale: 0.6, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'back.out(1.7)' }, 0.7)
      .from('.hero__foot > *, .hero__note, .meta', { y: 24, opacity: 0, duration: 0.8, stagger: 0.08 }, 0.8);

    $$('.pill').forEach((p, i) => {
      gsap.to(p, { y: i % 2 ? 10 : -10, duration: 2.4 + i * 0.5, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: i * 0.3 });
    });

    gsap.to('.hero__word', {
      y: () => window.innerHeight * 0.18, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
    });
  });

  mm.add('(min-width: 52rem) and (hover: hover) and (pointer: fine)', () => {
    const heroEl = q('.hero');
    const moves = $$('[data-pill]').map((el, i) => ({
      x: gsap.quickTo(el, 'x', { duration: 0.8, ease: 'power3.out' }),
      y: gsap.quickTo(el, 'y', { duration: 0.8, ease: 'power3.out' }),
      k: [26, -34, 20][i] ?? 20,
    }));
    const layers = $$('.hero [data-depth]').map((el) => ({
      x: gsap.quickTo(el, 'x', { duration: 1, ease: 'power3.out' }),
      k: Number(el.dataset.depth) * 16,
    }));
    const onMove = (e: PointerEvent) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      moves.forEach((m) => { m.x(nx * m.k); m.y(ny * m.k); });
      layers.forEach((l) => l.x(nx * l.k));
    };
    heroEl?.addEventListener('pointermove', onMove);
    return () => heroEl?.removeEventListener('pointermove', onMove);
  });
}

/* ---------- Botones magnéticos (escritorio con ratón) ---------- */
function magnetic() {
  const mm = gsap.matchMedia();
  mm.add('(min-width: 52rem) and (hover: hover) and (pointer: fine)', () => {
    const off: Array<() => void> = [];
    $$('[data-magnetic]').forEach((el) => {
      const x = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' });
      const y = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        x((e.clientX - (r.left + r.width / 2)) * 0.28);
        y((e.clientY - (r.top + r.height / 2)) * 0.28);
      };
      const leave = () => { x(0); y(0); };
      el.addEventListener('pointermove', move); el.addEventListener('pointerleave', leave);
      off.push(() => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave); });
    });
    return () => off.forEach((f) => f());
  });
}

/* ---------- Titulares por líneas, subrayador y flechas dibujadas ---------- */
function reveals() {
  $$('[data-lines]').forEach((h) => {
    gsap.from(h.querySelectorAll('.line__in'), {
      yPercent: 110, duration: 1, ease: 'power4.out', stagger: 0.1,
      scrollTrigger: { trigger: h, start: 'top 85%', once: true },
    });
  });
  $$('.hl').forEach((el) => {
    ScrollTrigger.create({ trigger: el, start: 'top 82%', once: true, onEnter: () => el.classList.add('is-on') });
  });
  $$<SVGPathElement>('[data-draw]').filter((p) => !p.closest('[data-timeline]')).forEach((p) => {
    const len = p.getTotalLength();
    gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
    gsap.to(p, { strokeDashoffset: 0, duration: 1, ease: 'power2.inOut', scrollTrigger: { trigger: p, start: 'top 90%', once: true } });
  });
}

/* ---------- Marquee: acelera con el scroll, se pausa con el ratón ---------- */
function marquee() {
  const tweens = $$('[data-marquee]').map((track) => {
    const dir = Number(track.dataset.dir) || -1;
    const tw = gsap.fromTo(track, { xPercent: dir === -1 ? 0 : -50 }, { xPercent: dir === -1 ? -50 : 0, duration: 34, ease: 'none', repeat: -1 });
    track.parentElement?.addEventListener('pointerenter', () => gsap.to(tw, { timeScale: 0, duration: 0.4 }));
    track.parentElement?.addEventListener('pointerleave', () => gsap.to(tw, { timeScale: 1, duration: 0.6 }));
    return tw;
  });
  ScrollTrigger.create({
    trigger: '.marquee', start: 'top bottom', end: 'bottom top',
    onUpdate: (self) => {
      const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 260, 6);
      tweens.forEach((t) => { gsap.killTweensOf(t, 'timeScale'); t.timeScale(boost); gsap.to(t, { timeScale: 1, duration: 0.9, ease: 'power2.out', overwrite: 'auto' }); });
    },
  });
}

/* ---------- Sección puente: fijada en escritorio, palabra a palabra ---------- */
function bridge() {
  const mm = gsap.matchMedia();
  mm.add('(min-width: 52rem)', () => {
    gsap.set('.bridge .w', { opacity: 0.12 });
    gsap.timeline({
      scrollTrigger: { trigger: '[data-bridge]', start: 'top top', end: '+=140%', pin: true, scrub: 0.6 },
    })
      .to('.bridge .w', { opacity: 1, stagger: 0.25, ease: 'none' })
      .to('.bridge__hand', { opacity: 1, duration: 0.3 }, '>-0.2');
    gsap.from('.bridge__hand', { opacity: 0, scrollTrigger: { trigger: '[data-bridge]', start: 'top 20%', once: true } });
  });
  mm.add('(max-width: 51.99rem)', () => {
    gsap.set('.bridge .w', { opacity: 0.15 });
    gsap.to('.bridge .w', { opacity: 1, stagger: 0.25, ease: 'none', scrollTrigger: { trigger: '[data-bridge]', start: 'top 60%', end: 'center 40%', scrub: true } });
  });
}

/* ---------- Proyectos: apilado, número con parallax, inclinación 3D y cursor ---------- */
function projects() {
  const mm = gsap.matchMedia();
  mm.add('(min-width: 52rem)', () => {
    const cards = $$('[data-card]');
    cards.forEach((wrap, i) => {
      const card = wrap.querySelector<HTMLElement>('.card')!;
      const next = cards[i + 1];
      if (next) {
        gsap.to(card, {
          scale: 0.93, ease: 'none', transformOrigin: '50% 0%',
          scrollTrigger: { trigger: next, start: 'top 85%', end: 'top 20%', scrub: true },
        });
        gsap.to(card.querySelector('.card__veil'), {
          opacity: 0.55, ease: 'none',
          scrollTrigger: { trigger: next, start: 'top 85%', end: 'top 20%', scrub: true },
        });
      }
      gsap.fromTo(card.querySelector('[data-num]'), { yPercent: -8 }, {
        yPercent: 12, ease: 'none',
        scrollTrigger: { trigger: wrap, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    });
  });
  mm.add('(min-width: 52rem) and (hover: hover) and (pointer: fine)', () => {
    const off: Array<() => void> = [];
    // Inclinación 3D de los mockups con el ratón
    $$('[data-tilt]').forEach((el) => {
      const rx = gsap.quickTo(el, 'rotationX', { duration: 0.8, ease: 'power3.out' });
      const ry = gsap.quickTo(el, 'rotationY', { duration: 0.8, ease: 'power3.out' });
      const card = el.closest('.card') as HTMLElement;
      const move = (e: PointerEvent) => {
        const r = card.getBoundingClientRect();
        ry(((e.clientX - r.left) / r.width - 0.5) * 12);
        rx(-((e.clientY - r.top) / r.height - 0.5) * 9);
      };
      const leave = () => { rx(0); ry(0); };
      card.addEventListener('pointermove', move); card.addEventListener('pointerleave', leave);
      off.push(() => { card.removeEventListener('pointermove', move); card.removeEventListener('pointerleave', leave); });
    });
    // Cursor "Ver proyecto"
    const cur = document.querySelector<HTMLElement>('.cursor');
    if (cur) {
      const label = cur;
      const cx = gsap.quickTo(cur, 'x', { duration: 0.35, ease: 'power3.out' });
      const cy = gsap.quickTo(cur, 'y', { duration: 0.35, ease: 'power3.out' });
      const move = (e: PointerEvent) => { cx(e.clientX); cy(e.clientY); };
      window.addEventListener('pointermove', move);
      off.push(() => window.removeEventListener('pointermove', move));
      $$('[data-cursor]').forEach((a) => {
        const card = a.closest('.card') as HTMLElement;
        const enter = () => { label.textContent = a.dataset.cursor ?? ''; gsap.to(label, { scale: 1, duration: 0.3, ease: 'back.out(2)' }); };
        const out = () => gsap.to(label, { scale: 0, duration: 0.25 });
        card.addEventListener('pointerenter', enter); card.addEventListener('pointerleave', out);
        off.push(() => { card.removeEventListener('pointerenter', enter); card.removeEventListener('pointerleave', out); });
      });
    }
    return () => off.forEach((f) => f());
  });
}

/* ---------- Pasos y cronología ---------- */
function lines() {
  $$('[data-steps] .paso').forEach((p, i) => {
    gsap.from(p, { y: 40, opacity: 0, duration: 0.8, ease: 'power3.out', delay: i * 0.08, scrollTrigger: { trigger: p, start: 'top 90%', once: true } });
  });
  const rail = document.querySelector<SVGPathElement>('[data-timeline] [data-draw]');
  if (rail) {
    const len = rail.getTotalLength();
    gsap.set(rail, { strokeDasharray: len, strokeDashoffset: len });
    gsap.to(rail, { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: '[data-timeline]', start: 'top 70%', end: 'bottom 70%', scrub: true } });
  }
  $$('.hito').forEach((h) => {
    gsap.from(h, { x: 30, opacity: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: h, start: 'top 88%', once: true } });
  });
}

/* ---------- Sobre mí: el retrato se mueve un poco al hacer scroll ---------- */
function about() {
  gsap.to('.arch img', { yPercent: -5, ease: 'none', scrollTrigger: { trigger: '.about', start: 'top bottom', end: 'bottom top', scrub: true } });
  gsap.from('.arch', { yPercent: 6, opacity: 0, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: '.arch', start: 'top 85%', once: true } });
}

/* Sin movimiento si el usuario lo pide: todo el contenido ya está visible en el HTML. */
if (!reduce) {
  smoothScroll();
  nav();
  const delay = document.documentElement.classList.contains('intro-on') ? 1.25 : 0;
  intro();
  hero(delay);
  magnetic();
  reveals();
  marquee();
  bridge();
  projects();
  lines();
  about();
} else {
  document.documentElement.classList.remove('intro-on');
}
