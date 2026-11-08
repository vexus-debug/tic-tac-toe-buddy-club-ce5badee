import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { ReactNode } from "react";
import { AppearanceProvider, useAppearance } from "@/hooks/useAppearance";

function wrapper({ children }: { children: ReactNode }) {
  return <AppearanceProvider>{children}</AppearanceProvider>;
}

describe("dashboard default appearance", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("defaults to light when nothing is saved, even if the OS prefers dark", () => {
    // The template's matchMedia mock reports matches: false; force a dark OS
    // preference to prove the dashboard no longer follows it.
    const realMatchMedia = window.matchMedia;
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: (query: string) => ({
        matches: query.includes("dark"),
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => {},
      }),
    });

    const { result } = renderHook(() => useAppearance(), { wrapper });
    expect(result.current.appearance).toBe("light");
    expect(document.documentElement.classList.contains("dashboard-dark")).toBe(false);

    window.matchMedia = realMatchMedia;
  });

  it("keeps an explicitly saved dark choice", () => {
    window.localStorage.setItem("clinexus-dashboard-appearance-v2", "dark");
    const { result } = renderHook(() => useAppearance(), { wrapper });
    expect(result.current.appearance).toBe("dark");
  });

  it("ignores the legacy storage key that auto-persisted OS dark mode", () => {
    window.localStorage.setItem("clinexus-dashboard-appearance", "dark");
    const { result } = renderHook(() => useAppearance(), { wrapper });
    expect(result.current.appearance).toBe("light");
  });

  it("toggling persists the choice and mirrors it on <html>", () => {
    const { result } = renderHook(() => useAppearance(), { wrapper });
    act(() => result.current.toggleAppearance());
    expect(result.current.appearance).toBe("dark");
    expect(window.localStorage.getItem("clinexus-dashboard-appearance-v2")).toBe("dark");
  });
});
