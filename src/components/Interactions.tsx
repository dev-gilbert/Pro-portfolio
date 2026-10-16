import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";

/** Element gently follows the cursor while hovered. */
export function Magnetic({ children, strength = 0.35 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 14, mass: 0.4 });
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 14, mass: 0.4 });

  return (
    <motion.div
      ref={ref}
      style={{ x, y, display: "inline-block" }}
      onPointerMove={(e) => {
        if (reduced || e.pointerType !== "mouse" || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

/** Subtle 3D tilt toward the pointer. */
export function Tilt({ children, max = 4 }: { children: ReactNode; max?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const rx = useSpring(useMotionValue(0), { stiffness: 160, damping: 20 });
  const ry = useSpring(useMotionValue(0), { stiffness: 160, damping: 20 });

  return (
    <motion.div
      ref={ref}
      className="tilt-spot"
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1000 }}
      whileHover={reduced ? undefined : { y: -4 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      onPointerMove={(e) => {
        if (reduced || e.pointerType !== "mouse" || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        ref.current.style.setProperty("--mx", `${(px + 0.5) * 100}%`);
        ref.current.style.setProperty("--my", `${(py + 0.5) * 100}%`);
        ry.set(px * max * 2);
        rx.set(-py * max * 2);
      }}
      onPointerLeave={() => {
        rx.set(0);
        ry.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}
