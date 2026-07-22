import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import prisma from '@/utils/prisma'
import { LayoutDashboard, Settings, Briefcase, LogOut, Video } from 'lucide-react'
import Link from 'next/link'

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
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden font-sans selection:bg-blue-500/30">
      {/* Ambient Static Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[150px] mix-blend-screen"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[150px] mix-blend-screen"></div>
      </div>

      {/* Sidebar */}
      <aside className="relative z-20 w-72 border-r border-white/5 bg-white/[0.01] backdrop-blur-3xl flex flex-col shadow-2xl">
        <div className="p-6 border-b border-white/5">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 border border-white/10 group-hover:scale-105 transition-transform">
              <Video className="w-5 h-5 text-white" />
            </div>
            <div className="overflow-hidden">
              <h2 className="font-bold text-xl text-white tracking-tight group-hover:text-blue-400 transition-colors">Hireneo</h2>
              <p className="text-xs text-white/50 truncate font-medium uppercase tracking-wider">{profile?.company?.name || 'Company'}</p>
            </div>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <Link href="/dashboard" className="group flex items-center gap-3 px-4 py-3.5 text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition-all border border-transparent hover:border-white/10">
            <LayoutDashboard className="w-5 h-5 group-hover:text-blue-400 transition-colors" />
            <span className="font-medium">Dashboard</span>
          </Link>
          <Link href="/dashboard/positions" className="group flex items-center gap-3 px-4 py-3.5 text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition-all border border-transparent hover:border-white/10">
            <Briefcase className="w-5 h-5 group-hover:text-blue-400 transition-colors" />
            <span className="font-medium">Positions</span>
          </Link>
          <Link href="/dashboard/settings" className="group flex items-center gap-3 px-4 py-3.5 text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition-all border border-transparent hover:border-white/10">
            <Settings className="w-5 h-5 group-hover:text-blue-400 transition-colors" />
            <span className="font-medium">Settings</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-white/5 bg-black/20">
          <div className="flex items-center gap-3 px-4 py-3 mb-2 rounded-xl bg-white/5 border border-white/5">
             <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-sm font-bold uppercase border border-white/20 shadow-lg">
               {profile?.name?.charAt(0) || user.email?.charAt(0)}
             </div>
             <div className="flex-1 overflow-hidden">
               <p className="text-sm font-bold truncate text-white">{profile?.name || 'User'}</p>
               <p className="text-xs text-white/50 truncate">{user.email}</p>
             </div>
          </div>
          <form action="/auth/signout" method="post">
            <button className="w-full group flex items-center gap-3 px-4 py-3.5 text-red-400/80 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all border border-transparent hover:border-red-500/20 font-medium">
              <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Sign Out
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
