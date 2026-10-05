import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Scroll suave sincronizado con ScrollTrigger. El usuario siempre manda. */
function smoothScroll() {
  const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  // Los enlaces #ancla usan Lenis para llegar suave.
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      const target = id && id.length > 1 ? document.querySelector<HTMLElement>(id) : null;
      if (target) { e.preventDefault(); lenis.scrollTo(target, { offset: 0 }); }
    });
  });
}

function hero() {
  const q = (s: string) => document.querySelector<HTMLElement>(s);
  const mm = gsap.matchMedia();

  mm.add('(min-width: 0px)', () => {
    // Entrada: líneas con máscara, círculo que escala, retrato, pastillas y pie.
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
    tl.from('.line__in', { yPercent: 110, duration: 1.1, stagger: 0.12 })
      .from('.hero__halo', { opacity: 0, duration: 1.6 }, 0.1)
      .from('.hero__circle', { scale: 0, transformOrigin: '50% 60%', duration: 1.2, ease: 'expo.out' }, 0.1)
      .from('.hero__portrait img', { yPercent: 8, opacity: 0, duration: 1.1 }, 0.25)
      .from('.hero__rim', { opacity: 0, duration: 1.2 }, 0.9)
      .from('.hero__word', { opacity: 0, yPercent: 12, duration: 1.3 }, 0.2)
      .from('.pill__in', { scale: 0.6, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'back.out(1.7)' }, 0.7)
      .from('.hero__foot > *, .hero__note, .meta', { y: 24, opacity: 0, duration: 0.8, stagger: 0.08 }, 0.8);

    // Flecha manuscrita que se dibuja
    document.querySelectorAll<SVGPathElement>('.arrow__path').forEach((p) => {
      const len = p.getTotalLength();
      gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
      gsap.to(p, { strokeDashoffset: 0, duration: 0.9, delay: 1.4, ease: 'power2.inOut' });
    });

    // Pastillas flotando en bucle (solo transform)
    gsap.utils.toArray<HTMLElement>('.pill').forEach((p, i) => {
      gsap.to(p, { y: i % 2 ? 10 : -10, duration: 2.4 + i * 0.5, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: i * 0.3 });
    });

    // "PORTFOLIO" con parallax al bajar
    gsap.to('.hero__word', {
      y: () => window.innerHeight * 0.18,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
    });
  });

  // Solo escritorio con ratón: pastillas y botones reaccionan al puntero.
  mm.add('(min-width: 52rem) and (hover: hover) and (pointer: fine)', () => {
    const heroEl = q('.hero');
    const moves = gsap.utils.toArray<HTMLElement>('[data-pill]').map((el, i) => ({
      x: gsap.quickTo(el, 'x', { duration: 0.8, ease: 'power3.out' }),
      y: gsap.quickTo(el, 'y', { duration: 0.8, ease: 'power3.out' }),
      k: [26, -34, 20][i] ?? 20,
    }));
    const onMove = (e: PointerEvent) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      moves.forEach((m) => { m.x(nx * m.k); m.y(ny * m.k); });
    };
    // Profundidad: cada capa se mueve distinto con el ratón (data-depth).
    const layers = gsap.utils.toArray<HTMLElement>('[data-depth]').map((el) => ({
      x: gsap.quickTo(el, 'x', { duration: 1, ease: 'power3.out' }),
      k: Number(el.dataset.depth) * 16,
    }));
    const onDepth = (e: PointerEvent) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      layers.forEach((l) => l.x(nx * l.k));
    };
    heroEl?.addEventListener('pointermove', onMove);
    heroEl?.addEventListener('pointermove', onDepth);

    const cleanups: Array<() => void> = [
      () => heroEl?.removeEventListener('pointermove', onMove),
      () => heroEl?.removeEventListener('pointermove', onDepth),
    ];
    document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
      const x = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' });
      const y = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        x((e.clientX - (r.left + r.width / 2)) * 0.28);
        y((e.clientY - (r.top + r.height / 2)) * 0.28);
      };
      const leave = () => { x(0); y(0); };
      el.addEventListener('pointermove', move);
      el.addEventListener('pointerleave', leave);
      cleanups.push(() => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave); });
    });
    return () => cleanups.forEach((fn) => fn());
  });
}

// Sin movimiento si el usuario lo pide: el contenido ya está visible en el HTML.
if (!reduce) {
  smoothScroll();
  hero();
}
