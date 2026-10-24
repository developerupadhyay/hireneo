import { createClient } from '@/utils/supabase/server'
import prisma from '@/utils/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, SearchX, Briefcase } from 'lucide-react'
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

  return (
    <div className="p-6 md:p-12 max-w-7xl mx-auto">
      <Link 
        href="/dashboard/positions" 
        className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:text-white/50 dark:hover:text-white transition-colors mb-8 font-medium group text-sm"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Positions
      </Link>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              <Briefcase className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              Position
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
            Candidates for {position.title}
          </h1>
          <p className="text-slate-500 dark:text-white/50 text-sm sm:text-base mt-1">
            Review and evaluate asynchronous video interviews submitted by applicants.
          </p>
        </div>

        <Link
          href={`/dashboard/positions/${position.id}/edit`}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 dark:text-white/80 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 transition-colors"
        >
          <span>Edit Questions ({position.questions.length})</span>
        </Link>
      </div>

      {position.interviews.length === 0 ? (
        <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 p-12 sm:p-16 rounded-3xl text-center shadow-xs">
          <SearchX className="w-12 h-12 text-slate-300 dark:text-white/20 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1.5">
            No candidate submissions yet
          </h3>
          <p className="text-sm text-slate-500 dark:text-white/50 max-w-md mx-auto mb-6">
            Share your position interview link with applicants. Once they record their answers, they will show up here.
          </p>
          <Link
            href={`/dashboard/positions/${position.id}/edit`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm transition-all"
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
