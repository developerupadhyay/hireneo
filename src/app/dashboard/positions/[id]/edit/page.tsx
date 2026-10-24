import { createClient } from '@/utils/supabase/server'
import prisma from '@/utils/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Plus, MessageSquare, HelpCircle, Users, ExternalLink } from 'lucide-react'
import { addQuestion } from './actions'
import CopyLinkButton from '@/components/CopyLinkButton'
import QuestionList from '@/components/QuestionList'
import EditPositionModal from '@/components/EditPositionModal'
import DeletePositionButton from '@/components/DeletePositionButton'
import QuestionTemplatesModal from '@/components/QuestionTemplatesModal'

export default async function InterviewBuilder({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { id } = await params

  const position = await prisma.position.findUnique({
    where: { id: id, profileId: user.id },
    include: { 
      questions: { orderBy: { order: 'asc' } },
      _count: { select: { interviews: true } }
    }
  })

  if (!position) redirect('/dashboard/positions')

  const totalThinkTime = position.questions.reduce((acc, q) => acc + q.thinkTime, 0)
  const totalAnswerTime = position.questions.reduce((acc, q) => acc + q.answerTime, 0)
  const totalDurationMins = Math.ceil((totalThinkTime + totalAnswerTime) / 60)

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link 
          href="/dashboard/positions" 
          className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:text-white/60 dark:hover:text-white transition-colors font-medium group text-sm min-h-[44px] touch-target-48"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Positions</span>
        </Link>

        <div className="flex items-center gap-2 flex-wrap">
          <Link 
            href={`/dashboard/positions/${position.id}/candidates`} 
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 border border-blue-200 dark:border-blue-500/20 shadow-xs transition-colors min-h-[44px] touch-target-48"
          >
            <Users className="w-4 h-4" />
            <span>Applicants ({position._count.interviews})</span>
          </Link>
          <EditPositionModal position={{ id: position.id, title: position.title, description: position.description }} />
          <DeletePositionButton 
            positionId={position.id} 
            positionTitle={position.title} 
            redirectAfterDelete={true} 
          />
        </div>
      </div>

      {/* Bento Card: Role Header & Quick Share */}
      <div className="bento-card p-6 sm:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 px-2 py-0.5 rounded">
                Interview Room
              </span>
              <span className="text-xs text-slate-500 dark:text-white/50 font-mono num-tabular">
                ~{totalDurationMins} min total candidate time
              </span>
            </div>
            <h1 className="fluid-heading-2 font-bold text-slate-900 dark:text-white tracking-tight">
              {position.title}
            </h1>
            <p className="text-slate-600 dark:text-white/60 text-sm mt-1 max-w-3xl leading-relaxed">
              {position.description || 'No description provided.'}
            </p>
          </div>

          <a
            href={`/interview/${position.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 dark:text-white/80 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 transition-colors flex-shrink-0 min-h-[44px] touch-target-48"
          >
            <span>Preview Candidate View</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Shareable Link Input with Tactile Copy */}
        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-white/80 uppercase tracking-wider block mb-2">
            Shareable Candidate Magic Link
          </label>
          <CopyLinkButton path={`/interview/${position.id}`} />
        </div>
      </div>

      {/* Main Bento Grid: Question List (Left) + Add Question Sticky Form (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Questions Section (Col-Span 2) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bento-card p-5 sm:p-6 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  Interview Questions
                </h2>
                <p className="text-xs text-slate-500 dark:text-white/50">
                  Revealed to candidate in numbered order during the interview.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <QuestionTemplatesModal positionId={position.id} />
              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-white/70 font-mono num-tabular">
                {position.questions.length}
              </span>
            </div>
          </div>

          {position.questions.length === 0 ? (
            <div className="bento-card p-12 text-center">
              <HelpCircle className="w-12 h-12 text-slate-300 dark:text-white/20 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                No questions added yet
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-white/50 max-w-sm mx-auto mb-5">
                Use the form on the right or explore the Question Library to add curated questions in 1 click.
              </p>
              <QuestionTemplatesModal positionId={position.id} />
            </div>
          ) : (
            <QuestionList questions={position.questions} positionId={position.id} />
          )}
        </div>

        {/* Add Question Bento Sticky Form (Col-Span 1) */}
        <div className="lg:col-span-1 lg:sticky lg:top-6 space-y-4">
          <div className="bento-card p-6">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-200/80 dark:border-white/10">
              <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <Plus className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Add New Question
              </h3>
            </div>

            <form action={addQuestion} className="space-y-4">
              <input type="hidden" name="positionId" value={position.id} />

              <div className="space-y-1.5">
                <label 
                  htmlFor="content"
                  className="text-xs font-bold text-slate-700 dark:text-white/80 uppercase tracking-wider pl-0.5 block"
                >
                  Question Text
                </label>
                <textarea 
                  id="content"
                  name="content" 
                  required 
                  rows={4} 
                  placeholder="e.g. Tell us about a time you solved an unexpected production performance regression..." 
                  className="w-full bg-slate-50 dark:bg-black/40 border border-slate-300 dark:border-white/10 rounded-xl p-3 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 focus:outline-none transition-all placeholder:text-slate-400 dark:placeholder-white/30 resize-none micro-tactile"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label 
                    htmlFor="thinkTime"
                    className="text-xs font-bold text-slate-700 dark:text-white/80 uppercase tracking-wider pl-0.5 block"
                  >
                    Think Time
                  </label>
                  <select 
                    id="thinkTime"
                    name="thinkTime" 
                    defaultValue="30" 
                    className="w-full bg-slate-50 dark:bg-black/40 border border-slate-300 dark:border-white/10 rounded-xl py-2.5 px-3 text-xs sm:text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 cursor-pointer micro-tactile min-h-[44px]"
                  >
                    <option value="15" className="bg-white dark:bg-[#0c111a]">15 seconds</option>
                    <option value="30" className="bg-white dark:bg-[#0c111a]">30 seconds</option>
                    <option value="60" className="bg-white dark:bg-[#0c111a]">60 seconds</option>
                    <option value="120" className="bg-white dark:bg-[#0c111a]">2 minutes</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label 
                    htmlFor="answerTime"
                    className="text-xs font-bold text-slate-700 dark:text-white/80 uppercase tracking-wider pl-0.5 block"
                  >
                    Answer Time
                  </label>
                  <select 
                    id="answerTime"
                    name="answerTime" 
                    defaultValue="120" 
                    className="w-full bg-slate-50 dark:bg-black/40 border border-slate-300 dark:border-white/10 rounded-xl py-2.5 px-3 text-xs sm:text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 cursor-pointer micro-tactile min-h-[44px]"
                  >
                    <option value="60" className="bg-white dark:bg-[#0c111a]">1 minute</option>
                    <option value="120" className="bg-white dark:bg-[#0c111a]">2 minutes</option>
                    <option value="180" className="bg-white dark:bg-[#0c111a]">3 minutes</option>
                    <option value="300" className="bg-white dark:bg-[#0c111a]">5 minutes</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label 
                  htmlFor="retakes"
                  className="text-xs font-bold text-slate-700 dark:text-white/80 uppercase tracking-wider pl-0.5 block"
                >
                  Retakes Allowed
                </label>
                <select 
                  id="retakes"
                  name="retakes" 
                  defaultValue="0" 
                  className="w-full bg-slate-50 dark:bg-black/40 border border-slate-300 dark:border-white/10 rounded-xl py-2.5 px-3 text-xs sm:text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 cursor-pointer micro-tactile min-h-[44px]"
                >
                  <option value="0" className="bg-white dark:bg-[#0c111a]">0 (Strict single take)</option>
                  <option value="1" className="bg-white dark:bg-[#0c111a]">1 Retake</option>
                  <option value="2" className="bg-white dark:bg-[#0c111a]">2 Retakes</option>
                  <option value="999" className="bg-white dark:bg-[#0c111a]">Unlimited</option>
                </select>
              </div>

              <button 
                type="submit" 
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/20 hover:shadow-lg transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 min-h-[48px] touch-target-48 mt-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Question</span>
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  )
}
