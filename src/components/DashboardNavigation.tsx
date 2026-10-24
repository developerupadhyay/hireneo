'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Briefcase, Settings, Plus, Video, LogOut } from 'lucide-react'
import ThemeSwitcher from './ThemeSwitcher'

interface DashboardNavigationProps {
  userEmail: string
  userName: string
  companyName: string
}

export function DesktopSidebarNav({ userEmail, userName, companyName }: DashboardNavigationProps) {
  const pathname = usePathname()

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/positions', label: 'Positions', icon: Briefcase },
    { href: '/dashboard/settings', label: 'Settings', icon: Settings },
  ]

  return (
    <aside 
      className="hidden md:flex fixed inset-y-0 left-0 w-72 flex-col z-40 glass-floating border-r border-slate-200/80 dark:border-white/10"
      aria-label="Dashboard Sidebar"
    >
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-200/80 dark:border-white/10 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-3 group min-w-0">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform flex-shrink-0">
            <Video className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight block truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              Hireneo
            </span>
            <span className="text-[11px] font-semibold text-slate-500 dark:text-white/50 uppercase tracking-wider block truncate">
              {companyName}
            </span>
          </div>
        </Link>
      </div>

      {/* Primary Navigation Links */}
      <nav className="flex-1 p-4 space-y-1.5" aria-label="Main Navigation">
        <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-white/40">
          Workspace
        </div>
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? 'page' : undefined}
              className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 active:scale-[0.98] ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm font-bold'
                  : 'text-slate-600 dark:text-white/70 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-white/5'
              }`}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-500 dark:text-white/50'}`} />
              <span className="truncate">{item.label}</span>
            </Link>
          )
        })}

        <div className="pt-4">
          <Link
            href="/dashboard/positions/new"
            className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 text-sm font-semibold transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 min-h-[44px]"
          >
            <Plus className="w-4 h-4" />
            <span>Create Position</span>
          </Link>
        </div>
      </nav>

      {/* Footer Profile & Theme Controls */}
      <div className="p-4 border-t border-slate-200/80 dark:border-white/10 space-y-3 bg-slate-50/50 dark:bg-black/20">
        <div className="flex items-center justify-between px-2">
          <span className="text-[11px] font-bold text-slate-500 dark:text-white/50 uppercase tracking-wider">
            Interface
          </span>
          <ThemeSwitcher />
        </div>

        {/* User Badge */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 shadow-xs">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-xs font-bold uppercase text-white shadow-sm flex-shrink-0">
            {userName?.charAt(0) || userEmail?.charAt(0) || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{userName}</p>
            <p className="text-[11px] text-slate-500 dark:text-white/50 truncate font-mono">{userEmail}</p>
          </div>
        </div>

        <form action="/auth/signout" method="post">
          <button
            type="submit"
            className="w-full flex items-center gap-2.5 px-3 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-all border border-transparent hover:border-rose-200 dark:hover:border-rose-900/40 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 active:scale-[0.98] min-h-[40px]"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </form>
      </div>
    </aside>
  )
}

export function MobileHeaderBar({ userName, companyName }: { userName: string; companyName: string }) {
  return (
    <header 
      className="md:hidden sticky top-0 left-0 right-0 z-40 glass-floating px-4 py-3 flex items-center justify-between border-b border-slate-200/80 dark:border-white/10"
      aria-label="Mobile Navigation Header"
    >
      <Link href="/dashboard" className="flex items-center gap-2.5 min-w-0">
        <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs flex-shrink-0">
          <Video className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <span className="font-bold text-base text-slate-900 dark:text-white tracking-tight leading-none block truncate">
            Hireneo
          </span>
          <span className="text-[10px] font-semibold text-slate-500 dark:text-white/50 uppercase tracking-wider block truncate mt-0.5">
            {companyName}
          </span>
        </div>
      </Link>

      <div className="flex items-center gap-2.5">
        <ThemeSwitcher />
        <Link
          href="/dashboard/settings"
          aria-label={`Settings for ${userName}`}
          className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-bold shadow-xs active:scale-95 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          {userName.charAt(0) || 'U'}
        </Link>
      </div>
    </header>
  )
}

export function MobileStickyBottomNav() {
  const pathname = usePathname()

  const tabs = [
    { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { href: '/dashboard/positions', label: 'Positions', icon: Briefcase },
    { href: '/dashboard/positions/new', label: 'New Role', icon: Plus, isPrimary: true },
    { href: '/dashboard/settings', label: 'Settings', icon: Settings },
  ]

  return (
    <nav 
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass-floating border-t border-slate-200/80 dark:border-white/10 px-3 py-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))]"
      aria-label="Mobile Bottom Navigation"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = tab.href === '/dashboard' 
            ? pathname === '/dashboard' 
            : pathname.startsWith(tab.href)

          if (tab.isPrimary) {
            return (
              <Link
                key={tab.href}
                href={tab.href}
                aria-label={tab.label}
                aria-current={isActive ? 'page' : undefined}
                className="flex flex-col items-center justify-center p-1 group touch-target-48 min-w-[56px] min-h-[48px]"
              >
                <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/25 active:scale-95 transition-all micro-tactile">
                  <Plus className="w-5 h-5 text-white" />
                </div>
                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 mt-1">
                  New
                </span>
              </Link>
            )
          }

          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all touch-target-48 min-w-[64px] min-h-[48px] active:scale-95 ${
                isActive
                  ? 'text-blue-600 dark:text-blue-400 font-bold'
                  : 'text-slate-500 dark:text-white/60 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <div className={`p-1 rounded-lg ${isActive ? 'bg-blue-50 dark:bg-blue-500/10' : ''}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-semibold mt-0.5 tracking-tight truncate">
                {tab.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
