/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@/utils/supabase/server'
import prisma from '@/utils/prisma'
import { Plus, Briefcase, Video, Users, MessageSquare, Calendar } from 'lucide-react'
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

  const totalQuestions = positions.reduce((acc, p) => acc + p._count.questions, 0)
  const totalCandidates = positions.reduce((acc, p) => acc + p._count.interviews, 0)

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Header & Telemetry Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400 mb-2">
            <Briefcase className="w-3.5 h-3.5" />
            Roles Management
          </div>
          <h1 className="fluid-heading-1 font-bold text-slate-900 dark:text-white tracking-tight">
            Open Positions
          </h1>
          <p className="text-slate-600 dark:text-white/60 text-sm sm:text-base mt-1">
            Configure interview questions, timers, and review applicant video answers.
          </p>
        </div>

        <Link 
          href="/dashboard/positions/new" 
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/20 hover:shadow-lg transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 min-h-[48px] touch-target-48 flex-shrink-0"
        >
          <Plus className="w-4 h-4 text-white" />
          <span>New Position</span>
        </Link>
      </div>

      {/* Quick Summary Bento Pill Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="bento-card p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 flex-shrink-0">
            <Briefcase className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500 dark:text-white/50 uppercase tracking-wider block">
              Positions Active
            </span>
            <span className="text-xl font-bold text-slate-900 dark:text-white font-mono num-tabular">
              {positions.length}
            </span>
          </div>
        </div>

        <div className="bento-card p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-500/20 flex-shrink-0">
            <Video className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500 dark:text-white/50 uppercase tracking-wider block">
              Questions Configured
            </span>
            <span className="text-xl font-bold text-slate-900 dark:text-white font-mono num-tabular">
              {totalQuestions}
            </span>
          </div>
        </div>

        <div className="bento-card p-4 flex items-center gap-3 col-span-2 sm:col-span-1">
          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 flex-shrink-0">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500 dark:text-white/50 uppercase tracking-wider block">
              Total Applicants
            </span>
            <span className="text-xl font-bold text-slate-900 dark:text-white font-mono num-tabular">
              {totalCandidates}
            </span>
          </div>
        </div>
      </div>

      {/* Positions Bento List */}
      <div className="space-y-4">
        {positions.map((position: any) => (
          <div 
            key={position.id} 
            className="bento-card p-5 sm:p-6 transition-all"
          >
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5">
              
              {/* Position Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5 mb-1.5">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight truncate">
                    {position.title}
                  </h3>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/40 flex-shrink-0">
                    Active
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-white/60 line-clamp-1 mb-3">
                  {position.description || 'No job description specified.'}
                </p>

                {/* Telemetry Chips */}
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/[0.04] text-slate-700 dark:text-white/80 border border-slate-200/80 dark:border-white/10 micro-tactile">
                    <Video className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <span className="num-tabular font-mono">{position._count.questions} questions</span>
                  </span>

                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/[0.04] text-slate-700 dark:text-white/80 border border-slate-200/80 dark:border-white/10 micro-tactile">
                    <Users className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                    <span className="num-tabular font-mono">{position._count.interviews} candidates</span>
                  </span>

                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/[0.04] text-slate-500 dark:text-white/50 border border-slate-200/80 dark:border-white/10">
                    <Calendar className="w-3.5 h-3.5" />
                    <span className="num-tabular">{new Date(position.createdAt).toLocaleDateString()}</span>
                  </span>
                </div>
              </div>

              {/* Action Buttons Group with min 48px touch targets */}
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full lg:w-auto pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-white/5">
                <Link 
                  href={`/dashboard/positions/${position.id}/edit`} 
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-800 dark:text-white bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-white/15 shadow-xs transition-all active:scale-[0.98] min-h-[48px] touch-target-48"
                >
                  <MessageSquare className="w-4 h-4 text-slate-600 dark:text-white/60" />
                  <span>Questions</span>
                </Link>

                <Link 
                  href={`/dashboard/positions/${position.id}/candidates`} 
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 text-xs sm:text-sm font-semibold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 px-4 py-2.5 rounded-xl border border-blue-200 dark:border-blue-500/20 shadow-xs transition-all active:scale-[0.98] min-h-[48px] touch-target-48"
                >
                  <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>Candidates</span>
                </Link>
                
                {/* Secondary Actions */}
                <div className="flex items-center gap-1.5 ml-auto sm:ml-0">
                  <EditPositionModal position={{ id: position.id, title: position.title, description: position.description }} />
                  <DeletePositionButton positionId={position.id} positionTitle={position.title} />
                </div>
              </div>

            </div>
          </div>
        ))}

        {positions.length === 0 && (
          <div className="bento-card p-12 sm:p-16 text-center">
            <Briefcase className="w-12 h-12 text-slate-300 dark:text-white/20 mx-auto mb-3" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
              No positions created yet
            </h3>
            <p className="text-sm text-slate-500 dark:text-white/50 mb-6 max-w-sm mx-auto">
              Create your first role and define the interview questions candidates will record.
            </p>
            <Link 
              href="/dashboard/positions/new" 
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm transition-all active:scale-[0.98] min-h-[48px]"
            >
              <Plus className="w-4 h-4" />
              <span>Create Position</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
