import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

type Appearance = "light" | "dark";

const STORAGE_KEY = "clinexus-dashboard-appearance-v2";

interface AppearanceContextValue {
  appearance: Appearance;
  setAppearance: (value: Appearance) => void;
  toggleAppearance: () => void;
}

const AppearanceContext = createContext<AppearanceContextValue | undefined>(undefined);

export function AppearanceProvider({ children }: { children: ReactNode }) {
  const [appearance, setAppearanceState] = useState<Appearance>("light");
  const [hydrated, setHydrated] = useState(false);

  // Restore an explicitly saved choice once, on the client. Without one the
  // dashboard always opens in light mode — never follow the OS preference.
  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "light" || saved === "dark") {
      setAppearanceState(saved);
    }
    setHydrated(true);
  }, []);

  // Persist + mirror onto <html> so any dashboard surface picks it up,
  // even if it mounts later.
  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, appearance);
  }, [appearance, hydrated]);

  useEffect(() => {
    document.documentElement.classList.toggle("dashboard-dark", appearance === "dark");
  }, [appearance]);

  const setAppearance = useCallback((value: Appearance) => setAppearanceState(value), []);
  const toggleAppearance = useCallback(
    () => setAppearanceState((current) => (current === "dark" ? "light" : "dark")),
    [],
  );

  return (
    <AppearanceContext.Provider value={{ appearance, setAppearance, toggleAppearance }}>
      {children}
    </AppearanceContext.Provider>
  );
}

export function useAppearance(): AppearanceContextValue {
  const context = useContext(AppearanceContext);
  if (!context) {
    return {
      appearance: "light",
      setAppearance: () => {},
      toggleAppearance: () => {},
    };
  }
  return context;
}
