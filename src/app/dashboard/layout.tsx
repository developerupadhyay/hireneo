import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import prisma from '@/utils/prisma'
import { DesktopSidebarNav, MobileHeaderBar, MobileStickyBottomNav } from '@/components/DashboardNavigation'

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

  const userName = profile?.name || 'Recruiter'
  const userEmail = user.email || ''
  const companyName = profile?.company?.name || 'My Company'

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#06090e] text-slate-900 dark:text-white font-sans selection:bg-blue-500/20 transition-colors duration-200">
      {/* Desktop Sidebar (Flat-Glass Minimalism) */}
      <DesktopSidebarNav
        userEmail={userEmail}
        userName={userName}
        companyName={companyName}
      />

      {/* Mobile Top Header (Flat-Glass Minimalism) */}
      <MobileHeaderBar
        userName={userName}
        companyName={companyName}
      />

      {/* Main Content Area: Responsive spacing so bottom nav never overlaps on mobile */}
      <main className="md:pl-72 pb-24 md:pb-12 min-h-screen">
        {children}
      </main>

      {/* Mobile Sticky Bottom Nav (App-like Flat-Glass Navigation with >=48px Touch Targets) */}
      <MobileStickyBottomNav />
    </div>
  )
}
