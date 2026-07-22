import { createClient } from '@/utils/supabase/server'
import { Plus, Users, Video, Briefcase, Sparkles } from 'lucide-react'
import Link from 'next/link'
import prisma from '@/utils/prisma'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // Get metrics
  const positionsCount = await prisma.position.count({
    where: { profileId: user.id }
  })

  return (
    <div className="p-8 md:p-12 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-bold text-white tracking-tight">Dashboard</h1>
          <p className="text-white/50 mt-2 text-lg">Here is an overview of your hiring progress.</p>
        </div>
        <Link href="/dashboard/positions/new" className="relative group inline-flex rounded-xl">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-40 group-hover:opacity-100 transition duration-500"></div>
          <div className="relative bg-black text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 border border-white/10 group-hover:border-white/20 transition-all shadow-xl">
            <Plus className="w-5 h-5 text-blue-400" />
            New Position
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all p-8 rounded-[2rem] shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-[50px] pointer-events-none group-hover:bg-blue-500/20 transition-colors"></div>
          <div className="flex items-center gap-4 mb-6 relative z-10">
            <div className="p-4 bg-blue-500/10 text-blue-400 rounded-2xl border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.15)]">
              <Briefcase className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-medium text-white/90">Open Positions</h3>
          </div>
          <p className="text-5xl font-bold text-white relative z-10">{positionsCount}</p>
        </div>

        <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all p-8 rounded-[2rem] shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-[50px] pointer-events-none group-hover:bg-purple-500/20 transition-colors"></div>
          <div className="flex items-center gap-4 mb-6 relative z-10">
            <div className="p-4 bg-purple-500/10 text-purple-400 rounded-2xl border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.15)]">
              <Users className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-medium text-white/90">Candidates</h3>
          </div>
          <p className="text-5xl font-bold text-white relative z-10">0</p>
        </div>

        <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all p-8 rounded-[2rem] shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-[50px] pointer-events-none group-hover:bg-green-500/20 transition-colors"></div>
          <div className="flex items-center gap-4 mb-6 relative z-10">
            <div className="p-4 bg-green-500/10 text-green-400 rounded-2xl border border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.15)]">
              <Video className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-medium text-white/90">Videos Recorded</h3>
          </div>
          <p className="text-5xl font-bold text-white relative z-10">0</p>
        </div>
      </div>
      
      {/* Empty State for recent activity */}
      {positionsCount === 0 && (
        <div className="bg-white/[0.01] border border-white/5 backdrop-blur-xl rounded-[2rem] p-16 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/5 rounded-full blur-[100px] pointer-events-none"></div>
          
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10 relative z-10">
            <Sparkles className="w-10 h-10 text-white/40" />
          </div>
          <h3 className="text-3xl font-bold text-white mb-3 tracking-tight relative z-10">No active positions yet</h3>
          <p className="text-white/50 mb-10 text-lg max-w-md mx-auto relative z-10">Create your first position to start interviewing candidates asynchronously and save hundreds of hours.</p>
          
          <Link href="/dashboard/positions/new" className="relative group inline-flex rounded-full z-10">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-40 group-hover:opacity-100 transition duration-500"></div>
            <div className="relative bg-[#050505] text-white px-8 py-4 rounded-full font-bold flex items-center gap-3 border border-white/20 group-hover:border-white/40 transition-all shadow-xl">
              <Plus className="w-5 h-5 text-blue-400" />
              Create your first position
            </div>
          </Link>
        </div>
      )}
    </div>
  )
}
