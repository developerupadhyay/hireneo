import { createClient } from '@/utils/supabase/server'
import { Plus, Users, Video, Briefcase, Sparkles } from 'lucide-react'
import Link from 'next/link'
import prisma from '@/utils/prisma'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // Get metrics dynamically
  const positionsCount = await prisma.position.count({
    where: { profileId: user.id }
  })
  
  const candidatesCount = await prisma.interview.count({
    where: { position: { profileId: user.id } }
  })

  const videosCount = await prisma.videoResponse.count({
    where: { interview: { position: { profileId: user.id } } }
  })

  return (
    <div className="p-6 md:p-12 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
            Dashboard
          </h1>
          <p className="text-slate-500 dark:text-white/50 mt-1.5 text-base md:text-lg">
            Here is an overview of your hiring progress.
          </p>
        </div>
        <Link 
          href="/dashboard/positions/new" 
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm hover:shadow transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <Plus className="w-4 h-4" />
          <span>New Position</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 transition-all p-7 rounded-3xl shadow-xs dark:shadow-2xl relative overflow-hidden group">
          <div className="flex items-center gap-4 mb-4 relative z-10">
            <div className="p-3.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-2xl border border-blue-500/20">
              <Briefcase className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-slate-700 dark:text-white/90">Open Positions</h3>
          </div>
          <p className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white relative z-10">{positionsCount}</p>
        </div>

        <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 transition-all p-7 rounded-3xl shadow-xs dark:shadow-2xl relative overflow-hidden group">
          <div className="flex items-center gap-4 mb-4 relative z-10">
            <div className="p-3.5 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-2xl border border-purple-500/20">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-slate-700 dark:text-white/90">Candidates</h3>
          </div>
          <p className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white relative z-10">{candidatesCount}</p>
        </div>

        <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 transition-all p-7 rounded-3xl shadow-xs dark:shadow-2xl relative overflow-hidden group">
          <div className="flex items-center gap-4 mb-4 relative z-10">
            <div className="p-3.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl border border-emerald-500/20">
              <Video className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-slate-700 dark:text-white/90">Videos Recorded</h3>
          </div>
          <p className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white relative z-10">{videosCount}</p>
        </div>
      </div>
      
      {/* Empty State for recent activity */}
      {positionsCount === 0 && (
        <div className="bg-white dark:bg-white/[0.01] border border-slate-200 dark:border-white/10 rounded-3xl p-12 md:p-16 text-center shadow-xs dark:shadow-2xl relative overflow-hidden">
          <div className="w-16 h-16 bg-blue-50 dark:bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-blue-100 dark:border-white/10">
            <Sparkles className="w-8 h-8 text-blue-600 dark:text-white/40" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
            No active positions yet
          </h3>
          <p className="text-slate-500 dark:text-white/50 mb-8 text-base max-w-md mx-auto">
            Create your first position to start interviewing candidates asynchronously.
          </p>
          
          <Link 
            href="/dashboard/positions/new" 
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm transition-all active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Create your first position</span>
          </Link>
        </div>
      )}
    </div>
  )
}
