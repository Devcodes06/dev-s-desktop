import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

type Settings = {
  theme: "light" | "dark";
  clock24: boolean;
  setTheme: (t: "light" | "dark") => void;
  setClock24: (v: boolean) => void;
};

const Ctx = createContext<Settings | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [clock24, setClock24] = useState(false);

  useEffect(() => {
    const t = localStorage.getItem("portfolio-theme");
    if (t === "light" || t === "dark") setTheme(t);
    setClock24(localStorage.getItem("portfolio-clock24") === "true");
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("portfolio-theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("portfolio-clock24", String(clock24));
  }, [clock24]);

  const value = useMemo(() => ({ theme, clock24, setTheme, setClock24 }), [theme, clock24]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSettings() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useSettings must be used inside SettingsProvider");
  return ctx;
}
