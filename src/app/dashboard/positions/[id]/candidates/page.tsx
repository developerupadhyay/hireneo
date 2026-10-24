import { createClient } from '@/utils/supabase/server'
import prisma from '@/utils/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, SearchX, Briefcase, Video, Users, CheckCircle2, ThumbsUp } from 'lucide-react'
import CandidateList from '@/components/CandidateList'

export default async function CandidatesPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { id } = await params

  const position = await prisma.position.findUnique({
    where: { id: id, profileId: user.id },
    include: {
      questions: true,
      interviews: {
        include: { candidate: true, responses: true },
        orderBy: { createdAt: 'desc' }
      }
    }
  })

  if (!position) redirect('/dashboard/positions')

  // Telemetry counts
  const totalApplicants = position.interviews.length
  const completedCount = position.interviews.filter(i => i.status === 'COMPLETED').length
  const shortlistedCount = position.interviews.filter(i => i.status === 'SHORTLISTED').length
  const rejectedCount = position.interviews.filter(i => i.status === 'REJECTED').length

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Back Link & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link 
          href="/dashboard/positions" 
          className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:text-white/60 dark:hover:text-white transition-colors font-medium group text-sm min-h-[44px] touch-target-48"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Positions</span>
        </Link>

        <Link
          href={`/dashboard/positions/${position.id}/edit`}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 dark:text-white/80 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200/80 dark:border-white/10 transition-colors min-h-[44px] touch-target-48 flex-shrink-0"
        >
          <Video className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>Configure Questions ({position.questions.length})</span>
        </Link>
      </div>

      {/* Header Bar */}
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="p-1 rounded-md bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20">
            <Briefcase className="w-3.5 h-3.5" />
          </span>
          <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            Applicant Dossiers
          </span>
        </div>
        <h1 className="fluid-heading-2 font-bold text-slate-900 dark:text-white tracking-tight">
          Candidates for {position.title}
        </h1>
        <p className="text-slate-600 dark:text-white/60 text-sm mt-1">
          Review, evaluate, and shortlist video submissions from applicants.
        </p>
      </div>

      {/* Bento Telemetry Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bento-card p-4 sm:p-5 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 flex-shrink-0">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500 dark:text-white/50 uppercase tracking-wider block">
              Total Applicants
            </span>
            <span className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-mono num-tabular">
              {totalApplicants}
            </span>
          </div>
        </div>

        <div className="bento-card p-4 sm:p-5 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 flex-shrink-0">
            <ThumbsUp className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500 dark:text-white/50 uppercase tracking-wider block">
              Shortlisted
            </span>
            <span className="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-mono num-tabular">
              {shortlistedCount}
            </span>
          </div>
        </div>

        <div className="bento-card p-4 sm:p-5 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-500/20 flex-shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500 dark:text-white/50 uppercase tracking-wider block">
              Completed Takes
            </span>
            <span className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-mono num-tabular">
              {completedCount}
            </span>
          </div>
        </div>

        <div className="bento-card p-4 sm:p-5 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40 flex-shrink-0">
            <span className="text-xs font-bold font-mono">✕</span>
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500 dark:text-white/50 uppercase tracking-wider block">
              Rejected
            </span>
            <span className="text-xl sm:text-2xl font-bold text-rose-600 dark:text-rose-400 font-mono num-tabular">
              {rejectedCount}
            </span>
          </div>
        </div>
      </div>

      {/* Candidate List or Empty State */}
      {position.interviews.length === 0 ? (
        <div className="bento-card p-12 sm:p-16 text-center">
          <SearchX className="w-12 h-12 text-slate-300 dark:text-white/20 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
            No candidate submissions yet
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-white/50 max-w-sm mx-auto mb-5">
            Share your interview link with applicants. Once they record their answers via their browser, their video submissions will appear here.
          </p>
          <Link
            href={`/dashboard/positions/${position.id}/edit`}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm transition-all active:scale-[0.98] min-h-[48px]"
          >
            <span>Get Shareable Interview Link</span>
          </Link>
        </div>
      ) : (
        <CandidateList interviews={position.interviews} position={position} />
      )}
    </div>
  )
}
