/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@/utils/supabase/server'
import prisma from '@/utils/prisma'
import { Plus, Briefcase, Video, Users, MessageSquare } from 'lucide-react'
import Link from 'next/link'
import EditPositionModal from '@/components/EditPositionModal'
import DeletePositionButton from '@/components/DeletePositionButton'

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
    <div className="p-6 md:p-12 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
            Positions
          </h1>
          <p className="text-slate-500 dark:text-white/50 mt-1.5 text-base">
            Manage your open roles and interview questions.
          </p>
        </div>
        <Link 
          href="/dashboard/positions/new" 
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/20 hover:shadow-lg transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <Plus className="w-4 h-4 text-white" />
          <span className="text-white">New Position</span>
        </Link>
      </div>

      <div className="space-y-4">
        {positions.map((position: any) => (
          <div 
            key={position.id} 
            className="block bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 transition-all rounded-3xl p-6 shadow-xs dark:shadow-lg relative overflow-hidden group"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
              <Link href={`/dashboard/positions/${position.id}/candidates`} className="flex items-center gap-4 flex-1 w-full min-w-0">
                <div className="w-12 h-12 bg-blue-500/10 rounded-2xl border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 flex-shrink-0 group-hover:scale-105 transition-transform">
                  <Briefcase className="w-6 h-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                      {position.title}
                    </h3>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs sm:text-sm text-slate-500 dark:text-white/50 font-medium">
                    <span className="flex items-center gap-1.5"><Video className="w-4 h-4" /> {position._count.questions} questions</span>
                    <span>•</span>
                    <span className="flex items-center gap-1.5"><Users className="w-4 h-4" /> {position._count.interviews} candidates</span>
                  </div>
                </div>
              </Link>
              
              <div className="flex items-center gap-2.5 w-full md:w-auto">
                <Link 
                  href={`/dashboard/positions/${position.id}/edit`} 
                  className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-800 dark:text-white bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-white/15 shadow-xs transition-all active:scale-[0.98]"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-slate-600 dark:text-white/60" />
                  <span>Questions</span>
                </Link>
                <Link 
                  href={`/dashboard/positions/${position.id}/candidates`} 
                  className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 text-xs sm:text-sm font-semibold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 px-4 py-2.5 rounded-xl border border-blue-200 dark:border-blue-500/30 shadow-xs transition-all active:scale-[0.98]"
                >
                  <Users className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>Candidates</span>
                </Link>
                
                {/* Position Edit & Delete actions */}
                <div className="flex items-center gap-1.5 border-l border-slate-200 dark:border-white/10 pl-2.5 ml-0.5">
                  <EditPositionModal position={{ id: position.id, title: position.title, description: position.description }} />
                  <DeletePositionButton positionId={position.id} positionTitle={position.title} />
                </div>
              </div>
            </div>
          </div>
        ))}

        {positions.length === 0 && (
          <div className="text-center p-12 bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-3xl">
            <Briefcase className="w-12 h-12 text-slate-400 dark:text-white/20 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">No positions yet</h3>
            <p className="text-sm text-slate-500 dark:text-white/50 mb-6">Create a position to start adding interview questions.</p>
            <Link 
              href="/dashboard/positions/new" 
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>New Position</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
