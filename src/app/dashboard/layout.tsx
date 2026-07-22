import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import prisma from '@/utils/prisma'
import { LayoutDashboard, Settings, Briefcase, LogOut } from 'lucide-react'
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
    <div className="flex h-screen bg-background text-text">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 bg-surface/50 backdrop-blur-xl flex flex-col">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="text-white font-bold text-xl">H</span>
            </div>
            <div className="overflow-hidden">
              <h2 className="font-bold text-lg text-white">Hireneo</h2>
              <p className="text-xs text-text-muted truncate">{profile?.company?.name || 'Company'}</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-white/80 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          <Link href="/dashboard/positions" className="flex items-center gap-3 px-4 py-3 text-white/80 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
            <Briefcase className="w-5 h-5" />
            Positions
          </Link>
          <Link href="/dashboard/settings" className="flex items-center gap-3 px-4 py-3 text-white/80 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
            <Settings className="w-5 h-5" />
            Settings
          </Link>
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-4 py-3">
             <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm font-medium uppercase">
               {profile?.name?.charAt(0) || user.email?.charAt(0)}
             </div>
             <div className="flex-1 overflow-hidden">
               <p className="text-sm font-medium truncate">{profile?.name || 'User'}</p>
               <p className="text-xs text-text-muted truncate">{user.email}</p>
             </div>
          </div>
          <form action="/auth/signout" method="post">
            <button className="w-full mt-2 flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors">
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
