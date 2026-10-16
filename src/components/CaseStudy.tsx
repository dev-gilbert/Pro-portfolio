import { useEffect, type ReactNode } from "react";
import { motion } from "motion/react";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

export type CaseProject = {
  number: string; name: string; type: string; year: string; description: string; tags: string[];
  className: string; link: string; role: string; problem: string; approach: string; highlights: string[];
};

const ease = [0.22, 1, 0.36, 1] as const;

export default function CaseStudy({ project, next, visual, onClose, onNext }: {
  project: CaseProject; next: CaseProject; visual: ReactNode; onClose: () => void; onNext: () => void;
}) {
  useEffect(() => {
    const key = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [onClose]);

  const fade = (d: number) => ({ initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.25 + d, duration: 0.7, ease } });

  return (
    <motion.div className="case" data-lenis-prevent initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }} transition={{ duration: 0.55, ease }}>
      <div className="case-inner" key={project.name}>
        <div className="case-top">
          <button className="case-back" onClick={onClose}><ArrowLeft size={16} /> BACK TO WORK</button>
          <span>{project.number} / 04 — {project.year}</span>
        </div>
        <motion.p className="eyebrow" {...fade(0)}>{project.type.toUpperCase()}</motion.p>
        <motion.h1 className="case-title" {...fade(0.05)}>{project.name}</motion.h1>
        <motion.p className="case-lead" {...fade(0.1)}>{project.description}</motion.p>
        <motion.div className="case-meta" {...fade(0.15)}>
          <div><small>ROLE</small><b>{project.role}</b></div>
          <div><small>YEAR</small><b>{project.year}</b></div>
          <div><small>STACK</small><b>{project.tags.join(" · ")}</b></div>
        </motion.div>
        <motion.div layoutId={"art-" + project.name} className={"project-art case-art " + project.className}>{visual}</motion.div>
        <motion.div className="case-grid" {...fade(0.3)}>
          <div><small>01 — THE PROBLEM</small><p>{project.problem}</p></div>
          <div><small>02 — THE APPROACH</small><p>{project.approach}</p></div>
        </motion.div>
        <motion.ul className="case-highlights" {...fade(0.35)}>
          {project.highlights.map((h, i) => <li key={h}><span>0{i + 1}</span>{h}</li>)}
        </motion.ul>
        <div className="case-foot">
          <a className="case-link" href={project.link} target="_blank" rel="noreferrer">VIEW ON GITHUB <ArrowUpRight size={15} /></a>
          <button className="case-next" onClick={onNext}><small>NEXT PROJECT</small><strong>{next.name} <ArrowUpRight size={26} /></strong></button>
        </div>
      </div>
    </motion.div>
  );
}
