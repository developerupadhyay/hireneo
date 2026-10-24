'use client'

import React, { createContext, useContext, useEffect, useSyncExternalStore } from 'react'

export type Theme = 'light' | 'dark' | 'system'
export type ResolvedTheme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  resolvedTheme: ResolvedTheme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const STORAGE_KEY = 'hireneo-theme'

const listeners = new Set<() => void>()

function notify() {
  listeners.forEach((l) => l())
}

function subscribe(callback: () => void) {
  listeners.add(callback)
  const mq = typeof window !== 'undefined' ? window.matchMedia('(prefers-color-scheme: dark)') : null
  const handleSystemChange = () => notify()
  mq?.addEventListener('change', handleSystemChange)
  window.addEventListener('storage', callback)
  return () => {
    listeners.delete(callback)
    mq?.removeEventListener('change', handleSystemChange)
    window.removeEventListener('storage', callback)
  }
}

function getThemeSnapshot(): Theme {
  if (typeof window === 'undefined') return 'light'
  return (localStorage.getItem(STORAGE_KEY) as Theme) || 'light'
}

function getServerThemeSnapshot(): Theme {
  return 'light'
}

function getSystemDarkSnapshot(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

function getServerSystemDarkSnapshot(): boolean {
  return false
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(subscribe, getThemeSnapshot, getServerThemeSnapshot)
  const isSystemDark = useSyncExternalStore(subscribe, getSystemDarkSnapshot, getServerSystemDarkSnapshot)

  const resolvedTheme: ResolvedTheme = theme === 'system' ? (isSystemDark ? 'dark' : 'light') : theme

  useEffect(() => {
    const root = document.documentElement
    if (resolvedTheme === 'dark') {
      root.classList.add('dark')
      root.classList.remove('light')
      root.style.colorScheme = 'dark'
    } else {
      root.classList.remove('dark')
      root.classList.add('light')
      root.style.colorScheme = 'light'
    }
  }, [resolvedTheme])

  const setTheme = (newTheme: Theme) => {
    try {
      localStorage.setItem(STORAGE_KEY, newTheme)
    } catch (e) {
      console.warn('Could not save theme to localStorage', e)
    }
    notify()
  }

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
