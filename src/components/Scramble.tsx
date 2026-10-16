import { useEffect, useRef, useState, type ReactNode } from "react";

const GLYPHS = "!<>-_\\/[]{}—=+*^?#01";
/** Text that scrambles then resolves on hover. */
export function Scramble({ text }: { text: string }) {
  const [out, setOut] = useState(text);
  const timer = useRef<number>();
  const run = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    window.clearInterval(timer.current);
    timer.current = window.setInterval(() => {
      frame++;
      setOut(text.split("").map((c, i) => (c === " " || i < frame / 2 ? c : GLYPHS[Math.floor(Math.random() * GLYPHS.length)])).join(""));
      if (frame >= text.length * 2) { window.clearInterval(timer.current); setOut(text); }
    }, 30);
  };
  return <span onMouseEnter={run} style={{ display: "inline-block" }}>{out}</span>;
}

export function KigaliClock(): ReactNode {
  const fmt = () => new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Africa/Kigali" }).format(new Date());
  const [t, setT] = useState(fmt);
  useEffect(() => { const id = window.setInterval(() => setT(fmt()), 20000); return () => window.clearInterval(id); }, []);
  return <>{t} CAT</>;
}
