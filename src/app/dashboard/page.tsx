import { createClient } from '@/utils/supabase/server'
import prisma from '@/utils/prisma'
import { Plus, Users, Video, Briefcase } from 'lucide-react'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // Get metrics
  const positionsCount = await prisma.position.count({
    where: { profileId: user.id }
  })

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-text-muted mt-1">Here is an overview of your hiring progress.</p>
        </div>
        <Link href="/dashboard/positions/new" className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-medium px-4 py-2 rounded-xl transition-all shadow-lg shadow-primary/20">
          <Plus className="w-5 h-5" />
          New Position
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-surface/50 backdrop-blur-md border border-white/10 p-6 rounded-2xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
              <Briefcase className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-medium text-white/90">Open Positions</h3>
          </div>
          <p className="text-3xl font-bold text-white">{positionsCount}</p>
        </div>

        <div className="bg-surface/50 backdrop-blur-md border border-white/10 p-6 rounded-2xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-medium text-white/90">Candidates</h3>
          </div>
          <p className="text-3xl font-bold text-white">0</p>
        </div>

        <div className="bg-surface/50 backdrop-blur-md border border-white/10 p-6 rounded-2xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-green-500/10 text-green-400 rounded-xl">
              <Video className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-medium text-white/90">Videos Recorded</h3>
          </div>
          <p className="text-3xl font-bold text-white">0</p>
        </div>
      </div>
      
      {/* Empty State for recent activity */}
      <div className="bg-surface/30 border border-white/5 rounded-2xl p-12 text-center">
        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
          <Briefcase className="w-8 h-8 text-white/20" />
        </div>
        <h3 className="text-xl font-medium text-white mb-2">No active positions yet</h3>
        <p className="text-text-muted mb-6">Create your first position to start interviewing candidates asynchronously.</p>
        <Link href="/dashboard/positions/new" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-medium px-6 py-3 rounded-xl transition-all">
          <Plus className="w-5 h-5" />
          Create your first position
        </Link>
      </div>
    </div>
  )
}
