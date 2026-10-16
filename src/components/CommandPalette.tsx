import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CornerDownLeft, Search } from "lucide-react";

export type Cmd = { id: string; label: string; hint: string; run: () => void };

export default function CommandPalette({ commands, open, setOpen }: { commands: Cmd[]; open: boolean; setOpen: (v: boolean) => void }) {
  const [q, setQ] = useState("");
  const [idx, setIdx] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const list = useMemo(() => commands.filter((c) => (c.label + c.hint).toLowerCase().includes(q.toLowerCase())), [commands, q]);

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setOpen(!open); }
      else if (e.key === "Escape" && open) setOpen(false);
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [open, setOpen]);
  useEffect(() => { if (open) { setQ(""); setIdx(0); setTimeout(() => input.current?.focus(), 30); } }, [open]);
  useEffect(() => setIdx(0), [q]);

  const run = (c?: Cmd) => { if (!c) return; setOpen(false); setTimeout(c.run, 250); };

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="cmdk-backdrop" data-lenis-prevent initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)}>
          <motion.div className="cmdk" role="dialog" aria-label="Command palette" onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: -16, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.97 }} transition={{ type: "spring", stiffness: 380, damping: 30 }}>
            <div className="cmdk-input"><Search size={16} />
              <input ref={input} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Type a command or search…"
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") { e.preventDefault(); setIdx((i) => Math.min(i + 1, list.length - 1)); }
                  if (e.key === "ArrowUp") { e.preventDefault(); setIdx((i) => Math.max(i - 1, 0)); }
                  if (e.key === "Enter") run(list[idx]);
                }} />
              <kbd>ESC</kbd>
            </div>
            <ul>
              {list.length === 0 && <li className="cmdk-empty">No results</li>}
              {list.map((c, i) => (
                <li key={c.id} className={i === idx ? "active" : ""} onMouseEnter={() => setIdx(i)} onClick={() => run(c)}>
                  <span>{c.label}</span><em>{c.hint}</em>{i === idx && <CornerDownLeft size={14} />}
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
