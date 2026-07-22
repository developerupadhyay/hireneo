/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { createClient } from '@/utils/supabase/server'
import prisma from '@/utils/prisma'
import { Plus, Briefcase, ChevronRight, Video } from 'lucide-react'
import Link from 'next/link'

export default async function PositionsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const positions = await prisma.position.findMany({
    where: { profileId: user.id },
    include: { _count: { select: { questions: true, interviews: true } } },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="p-8 md:p-12 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-bold text-white tracking-tight">Positions</h1>
          <p className="text-white/50 mt-2 text-lg">Manage all your open roles.</p>
        </div>
        <Link href="/dashboard/positions/new" className="relative group inline-flex rounded-xl">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-40 group-hover:opacity-100 transition duration-500"></div>
          <div className="relative bg-black text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 border border-white/10 group-hover:border-white/20 transition-all shadow-xl">
            <Plus className="w-5 h-5 text-blue-400" />
            New Position
          </div>
        </Link>
      </div>

      <div className="space-y-4">
        {positions.map((position: any) => (
          <div key={position.id} className="block bg-white/[0.02] backdrop-blur-xl border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all rounded-[2rem] p-6 group shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-[40px] pointer-events-none group-hover:bg-blue-500/10 transition-colors"></div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
              <Link href={`/dashboard/positions/${position.id}/candidates`} className="flex items-center gap-5 flex-1 w-full">
                <div className="w-14 h-14 bg-gradient-to-tr from-blue-500/10 to-purple-500/10 rounded-2xl border border-white/10 flex items-center justify-center text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.1)] group-hover:scale-105 transition-transform">
                  <Briefcase className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{position.title}</h3>
                  <div className="flex gap-4 mt-2 text-sm text-white/50 font-medium">
                    <span className="flex items-center gap-1.5"><Video className="w-4 h-4" /> {position._count.questions} questions</span>
                    <span>•</span>
                    <span className="flex items-center gap-1.5"><Users className="w-4 h-4" /> {position._count.interviews} candidates</span>
                  </div>
                </div>
              </Link>
              <div className="flex items-center gap-3 w-full md:w-auto">
                <Link href={`/dashboard/positions/${position.id}/edit`} className="flex-1 md:flex-none text-center text-sm font-medium text-white/70 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-6 py-3 rounded-xl border border-transparent hover:border-white/10">
                  Edit Questions
                </Link>
                <Link href={`/dashboard/positions/${position.id}/candidates`} className="flex-1 md:flex-none text-center text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors bg-blue-500/10 hover:bg-blue-500/20 px-6 py-3 rounded-xl border border-blue-500/10 hover:border-blue-500/30">
                  View Candidates
                </Link>
              </div>
            </div>
          </div>
        ))}

        {positions.length === 0 && (
          <div className="text-center p-16 border border-white/5 rounded-[2rem] bg-white/[0.01] backdrop-blur-xl relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-600/5 rounded-full blur-[80px] pointer-events-none"></div>
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10 relative z-10">
              <Briefcase className="w-8 h-8 text-white/40" />
            </div>
            <p className="text-2xl font-bold text-white mb-2 relative z-10">No positions found</p>
            <p className="text-white/50 text-lg relative z-10">Create a new position to get started.</p>
          </div>
        )}
      </div>
    </div>
  )
}
import { Users } from 'lucide-react'
