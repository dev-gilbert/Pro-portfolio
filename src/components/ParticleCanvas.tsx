import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

type Particle = { x: number; y: number; vx: number; vy: number; r: number };

const LINK_DISTANCE = 120;
const MOUSE_RADIUS = 160;

function palette() {
  const light = document.documentElement.classList.contains("theme-light");
  return light
    ? { rgb: "113,138,53", dot: 0.55, line: 0.22 }
    : { rgb: "215,243,106", dot: 0.6, line: 0.16 };
}

/**
 * Full-page, fixed particle network. Particles drift, link to neighbours,
 * and are gently repelled / linked by the cursor. Colours follow the theme.
 */
export default function ParticleCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let w = 0;
    let h = 0;
    let raf = 0;
    let particles: Particle[] = [];
    let colors = palette();
    const mouse = { x: -9999, y: -9999 };

    const seed = () => {
      const target = Math.min(w < 700 ? 42 : 95, Math.floor((w * h) / 15000));
      particles = Array.from({ length: target }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        r: Math.random() * 1.4 + 0.7,
      }));
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
      if (reduced) draw();
    };

    const step = () => {
      for (const p of particles) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < MOUSE_RADIUS * MOUSE_RADIUS && d2 > 0.01) {
          const d = Math.sqrt(d2);
          const force = (1 - d / MOUSE_RADIUS) * 0.9;
          p.x += (dx / d) * force;
          p.y += (dy / d) * force;
        }
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -10) p.x = w + 10;
        else if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        else if (p.y > h + 10) p.y = -10;
      }
    };

    function draw() {
      ctx!.clearRect(0, 0, w, h);
      const { rgb, dot, line } = colors;

      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = dx * dx + dy * dy;
          if (d < LINK_DISTANCE * LINK_DISTANCE) {
            ctx!.strokeStyle = `rgba(${rgb},${(1 - Math.sqrt(d) / LINK_DISTANCE) * line})`;
            ctx!.lineWidth = 1;
            ctx!.beginPath();
            ctx!.moveTo(a.x, a.y);
            ctx!.lineTo(b.x, b.y);
            ctx!.stroke();
          }
        }
        // Link to the cursor
        const mx = a.x - mouse.x;
        const my = a.y - mouse.y;
        const md = Math.sqrt(mx * mx + my * my);
        if (md < MOUSE_RADIUS + 40) {
          ctx!.strokeStyle = `rgba(${rgb},${(1 - md / (MOUSE_RADIUS + 40)) * line * 2.4})`;
          ctx!.beginPath();
          ctx!.moveTo(a.x, a.y);
          ctx!.lineTo(mouse.x, mouse.y);
          ctx!.stroke();
        }
      }

      ctx!.fillStyle = `rgba(${rgb},${dot})`;
      for (const p of particles) {
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    const loop = () => {
      step();
      draw();
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (!raf && !reduced) raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const onLeave = () => {
      mouse.x = mouse.y = -9999;
    };
    const onVisibility = () => (document.hidden ? stop() : start());

    // Re-read colours whenever the theme class changes.
    const observer = new MutationObserver(() => {
      colors = palette();
      if (reduced) draw();
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    resize();
    start();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      observer.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduced]);

  return <canvas ref={ref} className="particle-canvas" aria-hidden="true" />;
}
