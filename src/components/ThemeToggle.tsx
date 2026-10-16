import { AnimatePresence, motion } from "motion/react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../hooks/useTheme";

/** Sun/moon switch. Shows the icon of the mode you will switch TO. */
export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isLight = theme === "light";
  const label = isLight ? "Switch to dark mode" : "Switch to light mode";

  return (
    <motion.button
      type="button"
      className="theme-toggle"
      onClick={toggle}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.92 }}
      aria-label={label}
      title={label}
    >
      <span className="theme-icon">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={theme}
            initial={{ rotate: isLight ? -90 : 90, opacity: 0, scale: 0.4 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: isLight ? 90 : -90, opacity: 0, scale: 0.4 }}
            transition={{ type: "spring", stiffness: 260, damping: 18, duration: 0.25 }}
            style={{ display: "grid", placeItems: "center" }}
          >
            {isLight ? <Moon size={16} /> : <Sun size={16} />}
          </motion.span>
        </AnimatePresence>
      </span>
      <span className="theme-toggle-label">{isLight ? "LIGHT" : "DARK"}</span>
    </motion.button>
  );
}
