'use client'

import { useTheme } from './ThemeProvider'
import { Sun, Moon, Laptop } from 'lucide-react'
import { useSyncExternalStore } from 'react'

const emptySubscribe = () => () => {}
const getMounted = () => true
const getServerMounted = () => false

export default function ThemeSwitcher({ className = '' }: { className?: string }) {
  const { theme, setTheme } = useTheme()
  const mounted = useSyncExternalStore(emptySubscribe, getMounted, getServerMounted)

  if (!mounted) {
    // Render placeholder with exact dimensions to prevent layout shift (CLS)
    return (
      <div 
        aria-hidden="true"
        className={`inline-flex items-center p-1 rounded-xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 h-9 w-[114px] ${className}`} 
      />
    )
  }

  const options: Array<{ value: 'light' | 'dark' | 'system'; label: string; icon: React.ReactNode }> = [
    { value: 'light', label: 'Light', icon: <Sun className="w-3.5 h-3.5" /> },
    { value: 'dark', label: 'Dark', icon: <Moon className="w-3.5 h-3.5" /> },
    { value: 'system', label: 'System', icon: <Laptop className="w-3.5 h-3.5" /> },
  ]

  return (
    <div
      role="radiogroup"
      aria-label="Theme selector"
      className={`inline-flex items-center p-1 rounded-xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 micro-tactile ${className}`}
    >
      {options.map((opt) => {
        const isActive = theme === opt.value
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            aria-label={`${opt.label} theme`}
            title={`${opt.label} theme`}
            onClick={() => setTheme(opt.value)}
            className={`relative flex items-center justify-center p-1.5 px-2.5 rounded-lg text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 active:scale-95 ${
              isActive
                ? 'bg-white dark:bg-[#0c111a] text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-500 dark:text-white/50 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {opt.icon}
          </button>
        )
      })}
    </div>
  )
}
