import { useState, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import {
  ArrowDown, ArrowUpRight, Code2, Mail, Menu, X, Sun, Moon,
} from "lucide-react";

const projects = [
  {
    number: "01",
    name: "IHUTE",
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

const particleSpecs = Array.from({ length: 42 }, (_, i) => ({
  left: (i * 37 + (i % 5) * 13) % 100,
  top: (i * 61 + (i % 7) * 9) % 100,
  size: i % 9 === 0 ? 4 : i % 4 === 0 ? 3 : 2,
  duration: 5 + (i % 7) * 1.25,
  delay: (i % 11) * -0.7,
}));

function ParticleField() {
  const reduced = useReducedMotion();
  return (
    <div className="particle-field" aria-hidden="true">
      {particleSpecs.map((p, i) => (
        <motion.span
          key={i}
          className="particle"
          style={{ left: `${p.left}%`, top: `${p.top}%`, width: p.size, height: p.size }}
          animate={reduced ? { opacity: 0.45 } : {
            x: [0, (i % 2 ? 1 : -1) * (12 + i % 23), 0],
            y: [0, -18 - (i % 31), 0],
            opacity: [0.18, i % 3 === 0 ? 0.9 : 0.55, 0.18],
            scale: [0.8, i % 4 === 0 ? 1.5 : 1, 0.8],
          }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

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
  const [menuOpen, setMenuOpen] = useState(false);\n  const [lightMode, setLightMode] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24, restDelta: 0.001 });

  const closeMenu = () => setMenuOpen(false);

  return (
    <motion.div className={lightMode ? "site-shell theme-light" : "site-shell"} animate={{ backgroundColor: lightMode ? "#e9e8e1" : "#080909", color: lightMode ? "#171914" : "#f2f1eb" }} transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}>
      <motion.div className="scroll-progress" style={{ scaleX }} />
      <header className="site-header">
        <a href="#home" className="wordmark" onClick={closeMenu}>GM<span>®</span></a>\n        <motion.button className="theme-toggle" onClick={() => setLightMode(!lightMode)} whileTap={{ scale: 0.9 }} aria-label={lightMode ? "Switch to dark mode" : "Switch to light mode"} title={lightMode ? "Switch to dark mode" : "Switch to light mode"}><motion.span key={lightMode ? "sun" : "moon"} initial={{ rotate: -70, opacity: 0, scale: 0.6 }} animate={{ rotate: 0, opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 240, damping: 16 }}>{lightMode ? <Moon size={16}/> : <Sun size={16}/>}</motion.span><span className="theme-toggle-label">{lightMode ? "LIGHT" : "DARK"}</span></motion.button>
        <nav className={menuOpen ? "nav-links nav-open" : "nav-links"}>
          <a href="#work" onClick={closeMenu}>Work <span>04</span></a>
          <a href="#about" onClick={closeMenu}>About</a>
          <a href="#stack" onClick={closeMenu}>Stack</a>
          <a className="nav-contact" href="#contact" onClick={closeMenu}>Let’s talk <ArrowUpRight size={15}/></a>
        </nav>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? "Close navigation" : "Open navigation"}>
          {menuOpen ? <X size={21}/> : <Menu size={21}/>}
        </button>
      </header>

      <main>
        <section className="hero section-wrap" id="home">
          <ParticleField />\n          <div className="hero-meta">
            <span><i className="status-dot"/> AVAILABLE FOR SELECT OPPORTUNITIES</span>
            <span>KIGALI, RWANDA <span className="meta-cross">✳</span> WORKING EVERYWHERE</span>
          </div>
          <div className="hero-title-wrap">
            <motion.p className="eyebrow hero-eyebrow" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.65 }}>SOFTWARE ENGINEER · BUILDER · SYSTEMS THINKER</motion.p>
            <h1 aria-label="Hello world. I’m Gilbert Muhire, software engineer.">
              <span className="hero-line"><motion.span initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ duration: 0.85, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}>HELLO,</motion.span></span>
              <span className="hero-line hero-line-two"><motion.span initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ duration: 0.9, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}>WORLD<i>.</i></motion.span></span>
            </h1>
          </div>
          <div className="hero-bottom">
            <p className="hero-intro">I’m Gilbert, a software engineer turning complex problems into useful products, dependable systems, and thoughtful digital experiences.</p>
            <a href="#work" className="round-link" aria-label="Explore selected work"><ArrowDown size={21}/></a>
            <div className="hero-index"><span>01 / 04</span><span>SCROLL TO EXPLORE ↓</span></div>
          </div>
          <div className="hero-stamp" aria-hidden="true"><span>ENGINEERED WITH INTENTION</span><strong>G.</strong><span>BUILT TO BE USEFUL · 2026</span></div>
        </section>

        <section className="work-section section-wrap" id="work">
          <Reveal className="section-heading">
            <div><p className="eyebrow">SELECTED WORK / 2024—26</p><h2>Ideas into <i>impact.</i></h2></div>
            <p className="section-aside">A few problems I’m working on.<br/>More than pixels, built for people.</p>
          </Reveal>
          <div className="project-list">
            {projects.map((project, index) => (
              <Reveal key={project.name} delay={index * 0.06}>
                <a className={"project-card " + project.className} href={project.link} target="_blank" rel="noreferrer">
                  <div className="project-info">
                    <div className="project-kicker"><span>{project.number} / PROJECT</span><span>{project.year}</span></div>
                    <div className="project-title-row"><h3>{project.name}</h3><span className="project-arrow"><ArrowUpRight size={22}/></span></div>
                    <p className="project-type">{project.type}</p>
                    <p className="project-description">{project.description}</p>
                    <div className="project-tags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
                  </div>
                  <div className="project-art"><ProjectVisual kind={project.visual}/></div>
                </a>
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
          <Reveal className="skill-cloud" delay={0.1}>{skills.map((skill, index) => <motion.span key={skill} whileHover={{ y: -4, rotate: index % 2 ? -1 : 1 }} transition={{ type: "spring", stiffness: 300, damping: 16 }}>{skill}</motion.span>)}</Reveal>
        </section>

        <section className="contact-section section-wrap" id="contact">
          <Reveal className="contact-inner">
            <div className="contact-top"><p className="eyebrow">HAVE A GOOD PROBLEM?</p><span>OPEN TO COLLABORATION ↗</span></div>
            <h2>Let’s make<br/><i>something matter.</i></h2>
            <a className="contact-email" href="mailto:muhiregilbert27@gmail.com">muhiregilbert27@gmail.com <ArrowUpRight size={22}/></a>
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
    </div>
  );
}
