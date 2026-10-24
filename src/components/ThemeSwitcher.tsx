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
    // Render placeholder with same dimensions to prevent CLS
    return (
      <div className={`inline-flex items-center p-1 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 h-9 w-[124px] ${className}`} />
    )
  }

  const options: Array<{ value: 'light' | 'dark' | 'system'; label: string; icon: React.ReactNode }> = [
    { value: 'light', label: 'Light', icon: <Sun className="w-4 h-4" /> },
    { value: 'dark', label: 'Dark', icon: <Moon className="w-4 h-4" /> },
    { value: 'system', label: 'System', icon: <Laptop className="w-4 h-4" /> },
  ]

  return (
    <div
      role="radiogroup"
      aria-label="Theme selector"
      className={`inline-flex items-center p-1 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-inner ${className}`}
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
            className={`relative flex items-center justify-center p-1.5 px-2.5 rounded-lg text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 active:scale-95 ${
              isActive
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
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
