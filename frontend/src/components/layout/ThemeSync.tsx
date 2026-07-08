"use client";

import { useEffect } from "react";
import { useUIStore } from "@/lib/store/useUIStore";

export function ThemeSync() {
  const theme = useUIStore((state) => state.theme);

  useEffect(() => {
    const applyTheme = (currentTheme: "light" | "dark" | "system") => {
      const root = document.documentElement;
      let isDark = false;

      if (currentTheme === "dark") {
        isDark = true;
      } else if (currentTheme === "system") {
        isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      }

      if (isDark) {
        root.classList.add("dark");
        root.setAttribute("data-theme", "dark");
      } else {
        root.classList.remove("dark");
        root.setAttribute("data-theme", "light");
      }
    };

    applyTheme(theme);

    // If it's system, listen to changes
    if (theme === "system") {
      const media = window.matchMedia("(prefers-color-scheme: dark)");
      const listener = () => applyTheme("system");
      
      media.addEventListener("change", listener);
      return () => {
        media.removeEventListener("change", listener);
      };
    }
  }, [theme]);

  return null;
}
