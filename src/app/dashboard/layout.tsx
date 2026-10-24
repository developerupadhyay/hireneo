import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import prisma from '@/utils/prisma'
import { LayoutDashboard, Settings, Briefcase, LogOut, Video } from 'lucide-react'
import Link from 'next/link'
import ThemeSwitcher from '@/components/ThemeSwitcher'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch the user's profile and company from Prisma
  let profile = await prisma.profile.findUnique({
    where: { id: user.id },
    include: { company: true }
  })

  if (!profile) {
    const company = await prisma.company.create({
      data: { name: 'My Company' }
    })
    profile = await prisma.profile.create({
      data: {
        id: user.id,
        email: user.email || '',
        name: 'Recruiter',
        companyId: company.id
      },
      include: { company: true }
    })
  }

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-[#050505] text-slate-900 dark:text-white overflow-hidden font-sans selection:bg-blue-500/30 transition-colors duration-200">
      {/* Ambient Static Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40 dark:opacity-100">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[150px] mix-blend-screen"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[150px] mix-blend-screen"></div>
      </div>

      {/* Sidebar */}
      <aside className="relative z-20 w-72 border-r border-slate-200 dark:border-white/10 bg-white dark:bg-[#0a0a0a] backdrop-blur-3xl flex flex-col shadow-sm dark:shadow-2xl transition-colors duration-200">
        <div className="p-6 border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 border border-white/10 group-hover:scale-105 transition-transform">
              <Video className="w-5 h-5 text-white" />
            </div>
            <div className="overflow-hidden">
              <h2 className="font-bold text-xl text-slate-900 dark:text-white tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                Hireneo
              </h2>
              <p className="text-xs text-slate-500 dark:text-white/50 truncate font-medium uppercase tracking-wider">
                {profile?.company?.name || 'Company'}
              </p>
            </div>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <Link 
            href="/dashboard" 
            className="group flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-white/70 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-all border border-transparent hover:border-slate-200 dark:hover:border-white/10 text-sm font-medium"
          >
            <LayoutDashboard className="w-5 h-5 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
            <span>Dashboard</span>
          </Link>
          <Link 
            href="/dashboard/positions" 
            className="group flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-white/70 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-all border border-transparent hover:border-slate-200 dark:hover:border-white/10 text-sm font-medium"
          >
            <Briefcase className="w-5 h-5 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
            <span>Positions</span>
          </Link>
          <Link 
            href="/dashboard/settings" 
            className="group flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-white/70 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-all border border-transparent hover:border-slate-200 dark:hover:border-white/10 text-sm font-medium"
          >
            <Settings className="w-5 h-5 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
            <span>Settings</span>
          </Link>
        </nav>

        {/* Sidebar Footer with Theme Switcher & User Profile */}
        <div className="p-4 border-t border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-black/20 space-y-3">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-white/50 uppercase tracking-wider">
              Theme
            </span>
            <ThemeSwitcher />
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-xs">
             <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-xs font-bold uppercase text-white shadow-sm flex-shrink-0">
               {profile?.name?.charAt(0) || user.email?.charAt(0)}
             </div>
             <div className="flex-1 overflow-hidden min-w-0">
               <p className="text-sm font-bold truncate text-slate-900 dark:text-white">{profile?.name || 'User'}</p>
               <p className="text-xs text-slate-500 dark:text-white/50 truncate">{user.email}</p>
             </div>
          </div>

          <form action="/auth/signout" method="post">
            <button 
              type="submit" 
              className="w-full group flex items-center gap-3 px-3.5 py-2.5 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-all border border-transparent hover:border-rose-200 dark:hover:border-rose-900/40 text-sm font-medium"
            >
              <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>Sign Out</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative z-10 scroll-smooth">
        {children}
      </main>
    </div>
  )
}
