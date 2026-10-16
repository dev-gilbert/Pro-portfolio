import { useEffect, useRef, useState } from "react";
import { AnimatePresence, animate, motion, useInView, useMotionValue, useSpring } from "motion/react";

export function skipIntro() {
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches || sessionStorage.getItem("intro") === "1";
  } catch {
    return false;
  }
}

/** Counter + curtain wipe shown once per session. */
export function Preloader({ onStart }: { onStart: () => void }) {
  const [n, setN] = useState(0);
  const [show, setShow] = useState(true);
  useEffect(() => {
    const c = animate(0, 100, {
      duration: 1.6,
      ease: [0.65, 0, 0.35, 1],
      onUpdate: (v) => setN(Math.round(v)),
      onComplete: () => {
        try { sessionStorage.setItem("intro", "1"); } catch { /* ignore */ }
        setShow(false);
        onStart();
      },
    });
    return () => c.stop();
  }, []);
  return (
    <AnimatePresence>
      {show && (
        <motion.div className="preloader" exit={{ y: "-100%", transition: { duration: 0.95, ease: [0.76, 0, 0.24, 1] } }}>
          <span className="pre-label">GILBERT MUHIRE — PORTFOLIO 2026</span>
          <strong className="pre-count">{String(n).padStart(2, "0")}<i>%</i></strong>
          <div className="pre-bar"><motion.span style={{ scaleX: n / 100 }} /></div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Trailing ring cursor that grows over links and buttons (mouse only). */
export function Cursor() {
  const x = useMotionValue(-100), y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 420, damping: 32, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 420, damping: 32, mass: 0.4 });
  const [big, setBig] = useState(false);
  const [fine] = useState(() => window.matchMedia("(pointer: fine)").matches);
  useEffect(() => {
    if (!fine) return;
    const move = (e: PointerEvent) => { x.set(e.clientX); y.set(e.clientY); };
    const over = (e: MouseEvent) => setBig(!!(e.target as HTMLElement).closest("a,button"));
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("mouseover", over);
    return () => { window.removeEventListener("pointermove", move); window.removeEventListener("mouseover", over); };
  }, [fine]);
  if (!fine) return null;
  return <motion.div className="cursor-ring" style={{ x: sx, y: sy }} animate={{ scale: big ? 2.6 : 1 }} transition={{ type: "spring", stiffness: 300, damping: 20 }} />;
}

export function Marquee({ items }: { items: string[] }) {
  const row = [...items, ...items];
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {row.map((t, i) => <span key={i}>{t}<i>✳</i></span>)}
      </div>
    </div>
  );
}

export function Counter({ to, suffix = "", label }: { to: number; suffix?: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration: 1.6, ease: [0.22, 1, 0.36, 1], onUpdate: (n) => setV(Math.round(n)) });
    return () => c.stop();
  }, [inView, to]);
  return <div ref={ref} className="stat"><strong>{v}{suffix}</strong><span>{label}</span></div>;
}
