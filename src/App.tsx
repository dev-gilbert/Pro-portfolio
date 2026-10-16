import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring, useTransform, type Variants } from "motion/react";
import { ArrowDown, ArrowUpRight, Code2, Mail, Menu, X } from "lucide-react";
import ParticleCanvas from "./components/ParticleCanvas";
import ThemeToggle from "./components/ThemeToggle";
import { Magnetic, Tilt } from "./components/Interactions";
import CaseStudy from "./components/CaseStudy";
import CommandPalette, { type Cmd } from "./components/CommandPalette";
import ContactForm from "./components/ContactForm";
import { Scramble, KigaliClock } from "./components/Scramble";
import { useTheme } from "./hooks/useTheme";
import { Preloader, Cursor, Marquee, Counter, skipIntro } from "./components/Extras";
import { useSmoothScroll } from "./hooks/useSmoothScroll";

const projects = [
  {
    number: "01",
    name: "IHUTE",
    role: "Product engineer",
    problem: "People shop by searching and asking, but most marketplaces force them to browse endless categories. Local sellers are hard to find.",
    approach: "Built the experience around search first: type or speak what you need, surface nearby sellers, and keep ordering and payment in the same flow.",
    highlights: ["Search-first discovery instead of category browsing", "Nearby-seller results for local shopping", "Integrated payments and ordering flow"],
    type: "Search-led commerce",
    year: "2026",
    description: "A marketplace built around how people actually shop: search, speak, discover nearby sellers, and order.",
    tags: ["React", "TypeScript", "Commerce", "Payments"],
    className: "ihute",
    visual: "search",
    link: "https://github.com/dev-gilbert",
  },
  {
    number: "02",
    name: "Compliance OS",
    role: "Full-stack engineer",
    problem: "Growing businesses lose track of regulatory obligations, deadlines and the evidence that proves they were met.",
    approach: "Designed a workflow-first system: obligations become tasks with owners and due dates, and evidence attaches directly to each requirement.",
    highlights: ["Obligation tracking with clear status", "Evidence organised per requirement", "Security-conscious API and data model"],
    type: "Business compliance platform",
    year: "2026",
    description: "A workflow-first system that helps growing businesses track obligations, organize evidence, and stay ready.",
    tags: ["FastAPI", "React", "PostgreSQL", "Security"],
    className: "compliance",
    visual: "compliance",
    link: "https://github.com/dev-gilbert/compliance-os",
  },
  {
    number: "03",
    name: "CloudGuard",
    role: "Backend and infrastructure engineer",
    problem: "Small teams run real infrastructure but lack the visibility large companies get from dedicated platform teams.",
    approach: "Built a control center that checks server posture, monitors risk signals, and presents them in plain language with clear next steps.",
    highlights: ["Single view of infrastructure health", "Risk monitoring and review flags", "Automation-friendly for DevOps workflows"],
    type: "Infrastructure security",
    year: "2026",
    description: "A control center for small teams to understand server posture, monitor risks, and manage infrastructure.",
    tags: ["Python", "Go", "Redis", "DevOps"],
    className: "cloudguard",
    visual: "cloud",
    link: "https://github.com/dev-gilbert",
  },
  {
    number: "04",
    name: "DigFootPrint",
    role: "Full-stack engineer",
    problem: "Digital exposure is scattered across the internet, which makes it hard to see what is public about a person or organisation.",
    approach: "Explored a security-intelligence concept that gathers external signals and makes them easy to investigate and understand.",
    highlights: ["Exposure scan concept and data model", "Investigation-friendly presentation", "Security and data-handling first"],
    type: "Security intelligence",
    year: "2026",
    description: "A security intelligence concept focused on making digital exposure easier to investigate and understand.",
    tags: ["Next.js", "FastAPI", "Security", "Data"],
    className: "digfootprint",
    visual: "footprint",
    link: "https://github.com/dev-gilbert",
  },
];

const skills = [
  "Python", "TypeScript", "JavaScript", "Node.js", "FastAPI", "React",
  "Next.js", "PostgreSQL", "Redis", "Docker", "Linux", "AWS", "CI/CD",
  "API integrations", "Observability", "Infrastructure",
];

function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.16 }}
      transition={{ duration: reduced ? 0 : 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

const skillContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.035, delayChildren: 0.1 } },
};
const skillItem: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.94 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

function ProjectVisual({ kind }: { kind: string }) {
  if (kind === "search") {
    return <div className="visual-search">
      <div className="visual-top"><span>ihute / discover</span><span>RW · 01</span></div>
      <div className="search-orb"><span>Find what<br />you need.</span><div className="orb-arrow"><ArrowUpRight size={20} /></div></div>
      <div className="mock-search"><span>⌕</span> Fresh fruit near me <span className="mock-enter">↵</span></div>
      <div className="visual-pills"><span>Groceries</span><span>Fashion</span><span>Home</span></div>
    </div>;
  }
  if (kind === "compliance") {
    return <div className="visual-compliance">
      <div className="dashboard-head"><span>COMPLIANCE / OVERVIEW</span><span className="live-dot">● LIVE</span></div>
      <div className="score-row"><div><small>COMPLIANCE HEALTH</small><strong>92<span>/100</span></strong></div><div className="score-ring"><span>92%</span></div></div>
      <div className="mini-bars"><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/></div>
      <div className="task-line"><span className="task-check">✓</span><span>Tax clearance evidence</span><b>Verified</b></div>
      <div className="task-line"><span className="task-pending">↗</span><span>Annual return</span><b>In progress</b></div>
    </div>;
  }
  if (kind === "cloud") {
    return <div className="visual-cloud">
      <div className="terminal-head"><span/><span/><span/><label>cloudguard / system health</label></div>
      <div className="terminal-body">
        <p><em>$</em> cloudguard status --all</p>
        <p className="term-muted">Scanning infrastructure nodes...</p>
        <p><b>●</b> api-prod-01 <span>HEALTHY</span></p>
        <p><b>●</b> worker-east-02 <span>HEALTHY</span></p>
        <p className="term-warn"><b>●</b> db-replica-01 <span>REVIEW</span></p>
        <div className="term-chart"><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/></div>
      </div>
    </div>;
  }
  return <div className="visual-footprint">
    <div className="scan-grid"/>
    <div className="scan-target"><span/><i/><b/></div>
    <div className="scan-label"><small>EXTERNAL EXPOSURE / SCAN 004</small><strong>Know your<br />digital edge.</strong><span><i/> INTELLIGENCE READY</span></div>
    <div className="scan-coordinates">-1.9441° S<br/>30.0619° E</div>
  </div>;
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const reduced = useReducedMotion();
  const [ready, setReady] = useState(skipIntro);
  useSmoothScroll();
  const [selected, setSelected] = useState<number | null>(null);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const { toggle: toggleTheme } = useTheme();
  const openProject = useCallback((i: number) => { history.pushState({ cs: 1 }, ""); setSelected(i); }, []);
  const closeProject = useCallback(() => { if (history.state?.cs) history.back(); else setSelected(null); }, []);
  useEffect(() => { const pop = () => setSelected(null); window.addEventListener("popstate", pop); return () => window.removeEventListener("popstate", pop); }, []);
  const goto = (hash: string) => { const a = document.createElement("a"); a.href = hash; document.body.appendChild(a); a.click(); a.remove(); };
  const commands: Cmd[] = [
    ...["work", "about", "stack", "contact"].map((id) => ({ id, label: "Go to " + id[0].toUpperCase() + id.slice(1), hint: "Section", run: () => { if (selected !== null) setSelected(null); setTimeout(() => goto("#" + id), 50); } })),
    ...projects.map((p, i) => ({ id: p.name, label: "Open " + p.name, hint: "Case study", run: () => openProject(i) })),
    { id: "theme", label: "Toggle dark / light mode", hint: "Theme", run: toggleTheme },
    { id: "email", label: "Copy email address", hint: "Contact", run: () => navigator.clipboard?.writeText("muhiregilbert27@gmail.com") },
    { id: "github", label: "Open GitHub", hint: "Link", run: () => window.open("https://github.com/dev-gilbert", "_blank") },
    { id: "linkedin", label: "Open LinkedIn", hint: "Link", run: () => window.open("https://linkedin.com/in/gilbert-muhire", "_blank") },
  ];
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll();
  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const titleY = useTransform(heroProgress, [0, 1], reduced ? [0, 0] : [0, 140]);
  const introY = useTransform(heroProgress, [0, 1], reduced ? [0, 0] : [0, 60]);
  const heroFade = useTransform(heroProgress, [0, 0.75], reduced ? [1, 1] : [1, 0]);
  const stampY = useTransform(heroProgress, [0, 1], reduced ? [0, 0] : [0, -90]);
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24, restDelta: 0.001 });

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="site-shell">
      {!ready && <Preloader onStart={() => setReady(true)} />}
      <Cursor />
      <div className="aurora" aria-hidden="true"><i /><i /><i /></div>
      <div className="grain" aria-hidden="true" />
      <ParticleCanvas />
      <motion.div className="scroll-progress" style={{ scaleX }} />
      <motion.header className="site-header" initial={reduced ? false : { opacity: 0, y: -18 }} animate={ready ? { opacity: 1, y: 0 } : undefined} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
        <a href="#home" className="wordmark" onClick={closeMenu}>GM<span>®</span></a>
        <ThemeToggle />
        <button className="cmdk-btn" onClick={() => setPaletteOpen(true)} aria-label="Open command palette"><kbd>⌘K</kbd></button>
        <nav className={menuOpen ? "nav-links nav-open" : "nav-links"}>
          <a href="#work" onClick={closeMenu}><Scramble text="Work" /> <span>04</span></a>
          <a href="#about" onClick={closeMenu}><Scramble text="About" /></a>
          <a href="#stack" onClick={closeMenu}><Scramble text="Stack" /></a>
          <a className="nav-contact" href="#contact" onClick={closeMenu}>Let’s talk <ArrowUpRight size={15}/></a>
        </nav>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? "Close navigation" : "Open navigation"}>
          {menuOpen ? <X size={21}/> : <Menu size={21}/>}
        </button>
      </motion.header>

      <main>
        <section className="hero section-wrap" id="home" ref={heroRef}>
          <div className="hero-meta">
            <span><i className="status-dot"/> AVAILABLE FOR SELECT OPPORTUNITIES</span>
            <span>KIGALI <KigaliClock /> <span className="meta-cross">✳</span> WORKING EVERYWHERE</span>
          </div>
          <motion.div className="hero-title-wrap" style={{ y: titleY, opacity: heroFade }}>
            <motion.p className="eyebrow hero-eyebrow" initial={{ opacity: 0, y: 14 }} animate={ready ? { opacity: 1, y: 0 } : undefined} transition={{ delay: 0.15, duration: 0.65 }}>SOFTWARE ENGINEER · BUILDER · SYSTEMS THINKER</motion.p>
            <h1 aria-label="Hello world. I’m Gilbert Muhire, software engineer.">
              <span className="hero-line"><motion.span initial={{ y: "110%" }} animate={ready ? { y: 0 } : undefined} transition={{ duration: 0.85, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}>HELLO,</motion.span></span>
              <span className="hero-line hero-line-two"><motion.span initial={{ y: "110%" }} animate={ready ? { y: 0 } : undefined} transition={{ duration: 0.9, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}>WORLD<i>.</i></motion.span></span>
            </h1>
          </motion.div>
          <motion.div className="hero-bottom" style={{ y: introY, opacity: heroFade }}>
            <p className="hero-intro">I’m Gilbert, a software engineer turning complex problems into useful products, dependable systems, and thoughtful digital experiences.</p>
            <Magnetic><a href="#work" className="round-link" aria-label="Explore selected work"><ArrowDown size={21}/></a></Magnetic>
            <div className="hero-index"><span>01 / 04</span><span>SCROLL TO EXPLORE ↓</span></div>
          </motion.div>
          <motion.div className="hero-stamp" aria-hidden="true" style={{ y: stampY }} initial={{ rotate: 12 }} animate={reduced ? { rotate: 12 } : { rotate: 372 }} transition={{ duration: 60, repeat: Infinity, ease: "linear" }}><span>ENGINEERED WITH INTENTION</span><strong>G.</strong><span>BUILT TO BE USEFUL · 2026</span></motion.div>
        </section>

        <Marquee items={["Software Engineer","Full-stack","Payments","Infrastructure","Product thinking","Cloud & DevOps"]} />

        <section className="work-section section-wrap" id="work">
          <Reveal className="section-heading">
            <div><p className="eyebrow">SELECTED WORK / 2024—26</p><h2>Ideas into <i>impact.</i></h2></div>
            <p className="section-aside">A few problems I’m working on.<br/>More than pixels, built for people.</p>
          </Reveal>
          <div className="project-list">
            {projects.map((project, index) => (
              <Reveal key={project.name} delay={index * 0.06}>
                <Tilt><a className={"project-card " + project.className} href={project.link} onClick={(e) => { e.preventDefault(); openProject(index); }}>
                  <div className="project-info">
                    <div className="project-kicker"><span>{project.number} / PROJECT</span><span>{project.year}</span></div>
                    <div className="project-title-row"><h3>{project.name}</h3><span className="project-arrow"><ArrowUpRight size={22}/></span></div>
                    <p className="project-type">{project.type}</p>
                    <p className="project-description">{project.description}</p>
                    <div className="project-tags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
                  </div>
                  <motion.div layoutId={"art-" + project.name} className="project-art"><ProjectVisual kind={project.visual}/></motion.div>
                </a></Tilt>
              </Reveal>
            ))}
          </div>
          <Reveal className="work-footer"><span>BUILT WITH CURIOSITY AND A HEALTHY RESPECT FOR EDGE CASES.</span><a href="https://github.com/dev-gilbert" target="_blank" rel="noreferrer">MORE ON GITHUB <ArrowUpRight size={15}/></a></Reveal>
        </section>

        <section className="about-section section-wrap" id="about">
          <Reveal className="about-grid">
            <div className="about-label"><p className="eyebrow">A LITTLE ABOUT ME</p><span className="about-number">[ 02 — PROFILE ]</span></div>
            <div className="about-content">
              <h2>I care about the <i>whole system.</i></h2>
              <p className="about-lead">Not just shipping code. Understanding the problem, designing the right solution, and making sure it keeps working long after launch.</p>
              <p className="about-copy">I’m a full-stack software engineer with hands-on experience across fintech, payments, e-commerce, ERP and POS products. My work moves between backend services, APIs, databases, deployment pipelines and the user experience that ties everything together.</p>
              <div className="stat-row"><Counter to={3} suffix="+" label="YEARS SHIPPING" /><Counter to={4} label="PRODUCTS BUILT" /><Counter to={16} label="TECHNOLOGIES" /></div>
              <div className="about-facts">
                <div><span>01</span><strong>Product-minded</strong><p>Start with the real problem. Build what matters.</p></div>
                <div><span>02</span><strong>Infrastructure-aware</strong><p>Reliable systems are part of the product.</p></div>
                <div><span>03</span><strong>Always learning</strong><p>Curious about the next layer of the stack.</p></div>
              </div>
            </div>
          </Reveal>
        </section>

        <section className="experience-section section-wrap">
          <Reveal className="experience-grid">
            <div><p className="eyebrow">WHERE I’VE BEEN</p><h2>Work in<br/><i>the real world.</i></h2></div>
            <div className="experience-entry">
              <div className="experience-date">JUN 2023 — NOW <span>KIGALI, RWANDA</span></div>
              <h3>Software Engineer <span>↗</span></h3>
              <p className="experience-company">Algorithm Inc. Ltd / Ishyiga Software</p>
              <p>Building and improving business software used in day-to-day operations, including POS and ERP workflows, payment integrations, e-commerce experiences, reporting APIs and production infrastructure.</p>
              <div className="experience-tags"><span>Product engineering</span><span>Payments</span><span>Cloud & DevOps</span></div>
            </div>
          </Reveal>
        </section>

        <section className="stack-section section-wrap" id="stack">
          <Reveal className="stack-top"><div><p className="eyebrow">TOOLS OF THE TRADE</p><h2>Good tools.<br/><i>Better questions.</i></h2></div><p>I choose technology to fit the problem, not the other way around.</p></Reveal>
          <motion.div className="skill-cloud" variants={skillContainer} initial={reduced ? "show" : "hidden"} whileInView="show" viewport={{ once: true, amount: 0.3 }}>{skills.map((skill, index) => <motion.span key={skill} variants={skillItem} whileHover={{ y: -4, rotate: index % 2 ? -1 : 1 }} transition={{ type: "spring", stiffness: 300, damping: 16 }}>{skill}</motion.span>)}</motion.div>
        </section>

        <section className="contact-section section-wrap" id="contact">
          <Reveal className="contact-inner">
            <div className="contact-top"><p className="eyebrow">HAVE A GOOD PROBLEM?</p><span>OPEN TO COLLABORATION ↗</span></div>
            <h2>Let’s make<br/><i>something matter.</i></h2>
            <a className="contact-email" href="mailto:muhiregilbert27@gmail.com">muhiregilbert27@gmail.com <ArrowUpRight size={22}/></a>
            <ContactForm />
            <div className="contact-bottom">
              <p>Interested in engineering, infrastructure, or products that solve real problems? I’d like to hear about it.</p>
              <div className="social-links"><a href="https://github.com/dev-gilbert" target="_blank" rel="noreferrer"><Code2 size={16}/> GitHub <ArrowUpRight size={14}/></a><a href="https://linkedin.com/in/gilbert-muhire" target="_blank" rel="noreferrer"><span className="linkedin-mark">in</span> LinkedIn <ArrowUpRight size={14}/></a><a href="mailto:muhiregilbert27@gmail.com"><Mail size={16}/> Email <ArrowUpRight size={14}/></a></div>
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="site-footer section-wrap">
        <a href="#home" className="wordmark">GM<span>®</span></a>
        <span>DESIGNED WITH INTENTION. BUILT WITH CODE.</span>
        <a href="#home">BACK TO TOP <ArrowUpRight size={13}/></a>
        <span>© GILBERT MUHIRE 2026</span>
      </footer>
      <AnimatePresence>
        {selected !== null && (
          <CaseStudy project={projects[selected]} next={projects[(selected + 1) % projects.length]}
            visual={<ProjectVisual kind={projects[selected].visual} />} onClose={closeProject}
            onNext={() => setSelected((selected + 1) % projects.length)} />
        )}
      </AnimatePresence>
      <CommandPalette commands={commands} open={paletteOpen} setOpen={setPaletteOpen} />
    </div>
  );
}
