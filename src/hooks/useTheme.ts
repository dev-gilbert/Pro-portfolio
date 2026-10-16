import { useCallback, useEffect, useState } from "react";

export type Theme = "dark" | "light";
const STORAGE_KEY = "theme";

function readTheme(): Theme {
  return document.documentElement.classList.contains("theme-light") ? "light" : "dark";
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  // Briefly enable colour transitions on everything so the swap feels smooth,
  // without slowing down normal hover effects the rest of the time.
  root.classList.add("theme-anim");
  root.classList.toggle("theme-light", theme === "light");
  root.style.colorScheme = theme;
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", theme === "light" ? "#e9e8e1" : "#080909");
  window.setTimeout(() => root.classList.remove("theme-anim"), 700);
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => (typeof document === "undefined" ? "dark" : readTheme()));

  // Follow the OS setting until the visitor makes an explicit choice.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: light)");
    const onChange = (e: MediaQueryListEvent) => {
      try {
        if (localStorage.getItem(STORAGE_KEY)) return;
      } catch {
        /* storage unavailable */
      }
      const next: Theme = e.matches ? "light" : "dark";
      applyTheme(next);
      setTheme(next);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const obs = new MutationObserver(() => setTheme(readTheme()));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  const toggle = useCallback(() => {
    const next: Theme = readTheme() === "light" ? "dark" : "light";
    applyTheme(next);
    setTheme(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* storage unavailable */
    }
  }, []);

  return { theme, toggle };
}
