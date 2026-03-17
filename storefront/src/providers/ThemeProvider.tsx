"use client"

import { createContext, useContext, useEffect, useState, useCallback } from "react"

type Theme = "light" | "dark"

interface ThemeContextValue {
  theme: Theme
  toggleTheme: () => void
  setTheme: (t: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "light",
  toggleTheme: () => {},
  setTheme: () => {},
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("glowhaus-theme") as Theme | null
    const preferred = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light"
    const resolved: Theme = stored ?? preferred
    setThemeState(resolved)
    document.documentElement.setAttribute("data-theme", resolved)
    setMounted(true)
  }, [])

  const applyTheme = useCallback((next: Theme) => {
    setThemeState(next)
    localStorage.setItem("glowhaus-theme", next)
    document.documentElement.setAttribute("data-theme", next)
  }, [])

  const toggleTheme = useCallback(() => {
    applyTheme(theme === "light" ? "dark" : "light")
  }, [theme, applyTheme])

  const setTheme = useCallback(
    (t: Theme) => {
      applyTheme(t)
    },
    [applyTheme]
  )

  // Prevent flash of wrong theme by hiding content until mounted
  if (!mounted) {
    return (
      <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
        <div style={{ visibility: "hidden" }}>{children}</div>
      </ThemeContext.Provider>
    )
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
