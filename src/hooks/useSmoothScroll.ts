import { useEffect } from "react";
import Lenis from "lenis";

/** Inertia-based smooth scrolling + eased anchor navigation. Disabled for reduced-motion users. */
export function useSmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!link) return;
      const hash = link.getAttribute("href") ?? "";
      if (hash === "#" || hash === "#home") {
        e.preventDefault();
        lenis.scrollTo(0, { duration: 1.4 });
        return;
      }
      const target = document.querySelector<HTMLElement>(hash);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: -70, duration: 1.4 });
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);
}
