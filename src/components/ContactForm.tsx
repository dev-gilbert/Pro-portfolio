import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Loader2 } from "lucide-react";

const EMAIL = "muhiregilbert27@gmail.com";
const KEY = import.meta.env.VITE_WEB3FORMS_KEY as string | undefined;
type Status = "idle" | "sending" | "sent" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [shake, setShake] = useState(0);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = String(f.get("name") || "").trim(), email = String(f.get("email") || "").trim(), message = String(f.get("message") || "").trim();
    const errs: Record<string, string> = {};
    if (name.length < 2) errs.name = "Tell me your name";
    if (!/^\S+@\S+\.\S+$/.test(email)) errs.email = "Enter a valid email";
    if (message.length < 10) errs.message = "A little more detail, please";
    setErrors(errs);
    if (Object.keys(errs).length) { setShake((s) => s + 1); return; }
    setStatus("sending");
    if (!KEY) { // No form service configured: fall back to the visitor's email app.
      window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent("Portfolio message from " + name)}&body=${encodeURIComponent(message + "\n\n— " + name + " (" + email + ")")}`;
      setTimeout(() => setStatus("sent"), 600);
      return;
    }
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ access_key: KEY, name, email, message, subject: "New portfolio message" }),
      });
      const data = await res.json();
      setStatus(data.success ? "sent" : "error");
    } catch { setStatus("error"); }
  };

  return (
    <div className="cform-wrap">
      <AnimatePresence mode="wait">
        {status === "sent" ? (
          <motion.div key="ok" className="cform-ok" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <svg viewBox="0 0 52 52" width="64" height="64" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <motion.circle cx="26" cy="26" r="23" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.7 }} />
              <motion.path d="M15 27l8 8 14-16" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.5, duration: 0.5 }} />
            </svg>
            <h3>Message sent.</h3><p>Thanks — I'll get back to you soon.</p>
            <button type="button" onClick={() => setStatus("idle")}>Send another</button>
          </motion.div>
        ) : (
          <motion.form key="form" className="cform" onSubmit={submit} noValidate animate={shake ? { x: [0, -8, 8, -6, 6, 0] } : {}} transition={{ duration: 0.4 }} exit={{ opacity: 0 }}>
            {(["name", "email", "message"] as const).map((n) => (
              <label key={n} className={errors[n] ? "has-error" : ""}>
                {n === "message" ? <textarea name={n} rows={3} placeholder=" " /> : <input name={n} type={n === "email" ? "email" : "text"} placeholder=" " autoComplete={n} />}
                <span>{n.toUpperCase()}</span>
                <AnimatePresence>{errors[n] && <motion.em initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>{errors[n]}</motion.em>}</AnimatePresence>
              </label>
            ))}
            <motion.button type="submit" disabled={status === "sending"} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
              {status === "sending" ? <><Loader2 size={16} className="spin" /> SENDING</> : <>SEND MESSAGE <ArrowUpRight size={16} /></>}
            </motion.button>
            {status === "error" && <p className="cform-err">Something went wrong. Please email me directly at {EMAIL}.</p>}
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
