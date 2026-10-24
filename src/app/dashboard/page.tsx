import { createClient } from '@/utils/supabase/server'
import prisma from '@/utils/prisma'
import Link from 'next/link'
import { 
  Plus, 
  Users, 
  Video, 
  Briefcase, 
  Sparkles, 
  Clock, 
  ArrowRight, 
  ThumbsUp, 
  Layers
} from 'lucide-react'
import CopyLinkButton from '@/components/CopyLinkButton'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // Fetch telemetry in parallel
  const [
    positionsCount,
    candidatesCount,
    videosCount,
    completedCount,
    shortlistedCount,
    recentPositions,
    recentInterviews
  ] = await Promise.all([
    prisma.position.count({
      where: { profileId: user.id }
    }),
    prisma.interview.count({
      where: { position: { profileId: user.id } }
    }),
    prisma.videoResponse.count({
      where: { interview: { position: { profileId: user.id } } }
    }),
    prisma.interview.count({
      where: { position: { profileId: user.id }, status: 'COMPLETED' }
    }),
    prisma.interview.count({
      where: { position: { profileId: user.id }, status: 'SHORTLISTED' }
    }),
    prisma.position.findMany({
      where: { profileId: user.id },
      include: { _count: { select: { questions: true, interviews: true } } },
      orderBy: { createdAt: 'desc' },
      take: 4,
    }),
    prisma.interview.findMany({
      where: { position: { profileId: user.id } },
      include: {
        candidate: true,
        position: { select: { id: true, title: true } },
        responses: { select: { id: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    })
  ])

  // Computed metrics
  const completionRate = candidatesCount > 0 
    ? Math.round((completedCount / candidatesCount) * 100) 
    : 0

  const hoursSaved = Math.max(0, Math.round((candidatesCount * 35) / 60))
  const latestPosition = recentPositions[0] || null

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
            Hiring Telemetry
          </div>
          <h1 className="fluid-heading-1 font-bold text-slate-900 dark:text-white tracking-tight">
            Recruiter Overview
          </h1>
          <p className="text-slate-600 dark:text-white/60 text-sm sm:text-base mt-1">
            Real-time pipeline metrics and asynchronous candidate evaluations.
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

      {/* Bento Grid: Multi-Sized Rectangular Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        
        {/* BENTO CARD 1: Large Featured Pipeline Overview (Span 2 Cols on lg) */}
        <div className="bento-card p-6 md:p-7 lg:col-span-2 flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-white/50 block mb-1">
                Candidate Pipeline
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                Screening Velocity
              </h2>
            </div>
            <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 flex-shrink-0">
              <Users className="w-5 h-5" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 my-4">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 micro-tactile">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-white/50 uppercase tracking-wider block">
                Total Applicants
              </span>
              <span className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-mono num-tabular mt-1 block">
                {candidatesCount}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 micro-tactile">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-white/50 uppercase tracking-wider block">
                Completed
              </span>
              <span className="text-2xl sm:text-3xl font-bold text-emerald-600 dark:text-emerald-400 font-mono num-tabular mt-1 block">
                {completedCount}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 micro-tactile">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-white/50 uppercase tracking-wider block">
                Completion Rate
              </span>
              <span className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400 font-mono num-tabular mt-1 block">
                {completionRate}%
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="pt-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-white/60 mb-2">
              <span>Pipeline Completion</span>
              <span className="num-tabular font-mono">{completedCount} of {candidatesCount} interviews finished</span>
            </div>
            <div className="h-2 w-full bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-500"
                style={{ width: `${Math.max(candidatesCount === 0 ? 0 : 5, completionRate)}%` }}
              />
            </div>
          </div>
        </div>

        {/* BENTO CARD 2: Active Positions Metric (Col-Span 1) */}
        <Link 
          href="/dashboard/positions"
          className="bento-card bento-interactive p-6 flex flex-col justify-between group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-white/50 block mb-1">
                Active Roles
              </span>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Open Positions
              </h2>
            </div>
            <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-500/20 group-hover:scale-105 transition-transform flex-shrink-0">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>

          <div className="my-4">
            <span className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white font-mono num-tabular tracking-tight">
              {positionsCount}
            </span>
            <p className="text-xs text-slate-500 dark:text-white/50 mt-1">
              Currently accepting candidate video recordings.
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-semibold text-purple-600 dark:text-purple-400 group-hover:translate-x-0.5 transition-transform">
            <span>Manage open roles</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>

        {/* BENTO CARD 3: Video Telemetry & Time Saved (Col-Span 1) */}
        <div className="bento-card p-6 flex flex-col justify-between">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-white/50 block mb-1">
                Video Telemetry
              </span>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Recorded Takes
              </h2>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 flex-shrink-0">
              <Video className="w-5 h-5" />
            </div>
          </div>

          <div className="my-4">
            <span className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white font-mono num-tabular tracking-tight">
              {videosCount}
            </span>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-2">
              <Clock className="w-3.5 h-3.5" />
              <span className="num-tabular font-mono">~{hoursSaved}h screening time saved</span>
            </div>
          </div>

          <span className="text-xs text-slate-500 dark:text-white/50">
            Stored securely in private cloud storage.
          </span>
        </div>

        {/* BENTO CARD 4: Quick Share & Fast Link (Col-Span 2 on lg) */}
        {latestPosition ? (
          <div className="bento-card p-6 md:p-7 lg:col-span-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  Quick Share
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/40">
                  Active Link
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate">
                {latestPosition.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-white/50 mt-0.5 mb-4">
                Share this candidate link to start collecting asynchronous video answers instantly.
              </p>
            </div>

            <CopyLinkButton path={`/interview/${latestPosition.id}`} />
          </div>
        ) : (
          <div className="bento-card p-6 md:p-7 lg:col-span-2 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-white/50 block mb-1">
                Quick Action
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Launch Your First Video Interview
              </h3>
              <p className="text-xs text-slate-500 dark:text-white/50 mt-1 mb-4">
                Add questions, calibrate think timers, and send shareable links to applicants.
              </p>
            </div>
            <Link
              href="/dashboard/positions/new"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-all active:scale-[0.98] min-h-[48px]"
            >
              <Plus className="w-4 h-4" />
              <span>Create Position Now</span>
            </Link>
          </div>
        )}

        {/* BENTO CARD 5: Shortlist Telemetry (Col-Span 2 on lg) */}
        <div className="bento-card p-6 md:p-7 lg:col-span-2 flex flex-col justify-between">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-white/50 block mb-1">
                Evaluation Telemetry
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Talent Shortlist & Decisions
              </h3>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 flex-shrink-0">
              <ThumbsUp className="w-5 h-5" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 my-4">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 micro-tactile">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-white/50 uppercase tracking-wider block">
                Shortlisted
              </span>
              <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-mono num-tabular mt-1 block">
                {shortlistedCount}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 micro-tactile">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-white/50 uppercase tracking-wider block">
                Under Review
              </span>
              <span className="text-2xl font-bold text-slate-900 dark:text-white font-mono num-tabular mt-1 block">
                {Math.max(0, completedCount - shortlistedCount)}
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-500 dark:text-white/50">
            Review candidate recordings at 1.5x speed and make decisions collaboratively.
          </p>
        </div>

        {/* BENTO CARD 6: Recent Candidate Submissions List (Col-Span 2 on lg) */}
        <div className="bento-card p-6 md:p-7 lg:col-span-2 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-white/10 mb-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Recent Submissions
              </h3>
            </div>
            <span className="text-xs font-semibold text-slate-500 dark:text-white/50 num-tabular">
              {recentInterviews.length} {recentInterviews.length === 1 ? 'applicant' : 'applicants'}
            </span>
          </div>

          {recentInterviews.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-8 h-8 text-slate-300 dark:text-white/20 mx-auto mb-2" />
              <p className="text-xs text-slate-500 dark:text-white/50">
                No candidate submissions yet. Share your position link to collect video takes.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5 flex-1">
              {recentInterviews.map((item) => (
                <Link
                  key={item.id}
                  href={`/dashboard/positions/${item.position.id}/candidates`}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50/80 dark:bg-white/[0.03] hover:bg-slate-100 dark:hover:bg-white/[0.06] border border-slate-200/60 dark:border-white/10 transition-all group min-h-[48px]"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                      {item.candidate.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {item.candidate.name}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-white/50 truncate">
                        {item.position.title}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-white/50 flex items-center gap-1">
                      <Video className="w-3 h-3" />
                      <span className="num-tabular font-mono">{item.responses.length}</span>
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* BENTO CARD 7: Open Positions Quick Overview (Col-Span 2 on lg) */}
        <div className="bento-card p-6 md:p-7 lg:col-span-2 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-white/10 mb-4">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Active Roles Overview
              </h3>
            </div>
            <Link 
              href="/dashboard/positions" 
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <span>View all</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {recentPositions.length === 0 ? (
            <div className="text-center py-8">
              <Briefcase className="w-8 h-8 text-slate-300 dark:text-white/20 mx-auto mb-2" />
              <p className="text-xs text-slate-500 dark:text-white/50 mb-3">
                No active positions found in your account.
              </p>
              <Link
                href="/dashboard/positions/new"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Role</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-2.5 flex-1">
              {recentPositions.map((pos) => (
                <div
                  key={pos.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50/80 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/10 min-h-[48px]"
                >
                  <div className="min-w-0 pr-2">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {pos.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500 dark:text-white/50">
                      <span className="num-tabular font-mono">{pos._count.questions} questions</span>
                      <span>•</span>
                      <span className="num-tabular font-mono">{pos._count.interviews} candidates</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <Link
                      href={`/dashboard/positions/${pos.id}/edit`}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-700 dark:text-white/80 bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 transition-colors"
                    >
                      Questions
                    </Link>
                    <Link
                      href={`/dashboard/positions/${pos.id}/candidates`}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 border border-blue-200 dark:border-blue-500/20 transition-colors"
                    >
                      Candidates
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Zero State Bento Experience if completely empty */}
      {positionsCount === 0 && (
        <div className="bento-card p-8 sm:p-12 text-center relative overflow-hidden">
          <div className="w-16 h-16 bg-blue-50 dark:bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-200 dark:border-blue-500/20">
            <Sparkles className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
            Start Your Asynchronous Hiring Pipeline
          </h2>
          <p className="text-slate-600 dark:text-white/60 text-sm sm:text-base max-w-md mx-auto mb-6">
            Create your first position, set anti-cheat thinking timers, and let candidates record authentic video responses on their own time.
          </p>
          <Link
            href="/dashboard/positions/new"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/20 hover:shadow-lg transition-all active:scale-[0.98] min-h-[48px]"
          >
            <Plus className="w-4 h-4" />
            <span>Create First Position</span>
          </Link>
        </div>
      )}
    </div>
  )
}
