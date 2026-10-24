import { createClient } from '@/utils/supabase/server'
import prisma from '@/utils/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Plus, MessageSquare, HelpCircle, Users } from 'lucide-react'
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
    include: { questions: { orderBy: { order: 'asc' } } }
  })

  if (!position) redirect('/dashboard/positions')

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 lg:gap-12">
      {/* Main Content: Questions List */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-6">
          <Link 
            href="/dashboard/positions" 
            className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:text-white/50 dark:hover:text-white transition-colors font-medium group text-sm"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Positions
          </Link>

          <div className="flex items-center gap-2">
            <Link 
              href={`/dashboard/positions/${position.id}/candidates`} 
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 border border-blue-200 dark:border-blue-500/20 shadow-xs transition-colors"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Candidates</span>
            </Link>
            <EditPositionModal position={{ id: position.id, title: position.title, description: position.description }} />
            <DeletePositionButton 
              positionId={position.id} 
              positionTitle={position.title} 
              redirectAfterDelete={true} 
            />
          </div>
        </div>
        
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
            {position.title}
          </h1>
          <p className="text-slate-600 dark:text-white/60 text-base md:text-lg leading-relaxed">
            {position.description || 'No description provided.'}
          </p>
        </div>

        {/* Share Interview Banner */}
        <div className="mb-10 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-transparent border border-blue-500/20 p-6 sm:p-8 rounded-3xl relative overflow-hidden shadow-sm">
          <div className="relative z-10">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Share this Interview
            </h3>
            <p className="text-slate-600 dark:text-white/70 mb-5 text-sm sm:text-base">
              Copy this link and send it to candidates to complete the video interview asynchronously.
            </p>
            <CopyLinkButton path={`/interview/${position.id}`} />
          </div>
        </div>

        {/* Questions Section */}
        <div className="space-y-6 mb-12">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/20">
                <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Interview Questions
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <QuestionTemplatesModal positionId={position.id} />
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-white/70">
                {position.questions.length} {position.questions.length === 1 ? 'Question' : 'Questions'}
              </span>
            </div>
          </div>
          
          {position.questions.length === 0 ? (
            <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 p-12 rounded-3xl text-center shadow-sm relative overflow-hidden">
              <HelpCircle className="w-12 h-12 text-slate-300 dark:text-white/20 mx-auto mb-4" />
              <p className="text-slate-600 dark:text-white/60 text-base">
                No questions added yet. Use the panel on the right to add your first question.
              </p>
            </div>
          ) : (
            <QuestionList questions={position.questions} positionId={position.id} />
          )}
        </div>
      </div>

      {/* Sidebar: Add Question Form */}
      <div className="w-full lg:w-96 flex-shrink-0">
        <div className="bg-white dark:bg-white/[0.03] backdrop-blur-3xl border border-slate-200 dark:border-white/10 p-6 sm:p-8 rounded-3xl sticky top-8 shadow-sm dark:shadow-2xl">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <Plus className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Add Question
          </h3>
          
          <form action={addQuestion} className="space-y-5">
            <input type="hidden" name="positionId" value={position.id} />
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-white/70 uppercase tracking-wider pl-0.5">
                Question Text
              </label>
              <textarea 
                name="content" 
                required 
                rows={4} 
                placeholder="e.g. Tell us about a time you solved a complex challenge under pressure..." 
                className="w-full bg-slate-50 dark:bg-black/40 border border-slate-300 dark:border-white/10 rounded-2xl p-3.5 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/40 focus:outline-none transition-all placeholder:text-slate-400 dark:placeholder-white/30 resize-none"
              ></textarea>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-white/70 uppercase tracking-wider pl-0.5">
                  Think Time
                </label>
                <select 
                  name="thinkTime" 
                  defaultValue="30" 
                  className="w-full bg-slate-50 dark:bg-black/40 border border-slate-300 dark:border-white/10 rounded-xl py-2.5 px-3 text-xs sm:text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 cursor-pointer"
                >
                  <option value="15" className="bg-white dark:bg-[#0a0a0a]">15 seconds</option>
                  <option value="30" className="bg-white dark:bg-[#0a0a0a]">30 seconds</option>
                  <option value="60" className="bg-white dark:bg-[#0a0a0a]">60 seconds</option>
                  <option value="120" className="bg-white dark:bg-[#0a0a0a]">2 minutes</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-white/70 uppercase tracking-wider pl-0.5">
                  Answer Time
                </label>
                <select 
                  name="answerTime" 
                  defaultValue="120" 
                  className="w-full bg-slate-50 dark:bg-black/40 border border-slate-300 dark:border-white/10 rounded-xl py-2.5 px-3 text-xs sm:text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 cursor-pointer"
                >
                  <option value="60" className="bg-white dark:bg-[#0a0a0a]">1 minute</option>
                  <option value="120" className="bg-white dark:bg-[#0a0a0a]">2 minutes</option>
                  <option value="180" className="bg-white dark:bg-[#0a0a0a]">3 minutes</option>
                  <option value="300" className="bg-white dark:bg-[#0a0a0a]">5 minutes</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-white/70 uppercase tracking-wider pl-0.5">
                Retakes Allowed
              </label>
              <select 
                name="retakes" 
                defaultValue="0" 
                className="w-full bg-slate-50 dark:bg-black/40 border border-slate-300 dark:border-white/10 rounded-xl py-2.5 px-3 text-xs sm:text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 cursor-pointer"
              >
                <option value="0" className="bg-white dark:bg-[#0a0a0a]">0 (No retakes)</option>
                <option value="1" className="bg-white dark:bg-[#0a0a0a]">1 Retake</option>
                <option value="2" className="bg-white dark:bg-[#0a0a0a]">2 Retakes</option>
                <option value="999" className="bg-white dark:bg-[#0a0a0a]">Unlimited</option>
              </select>
            </div>
            
            <button 
              type="submit" 
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/20 hover:shadow-lg transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 mt-2"
            >
              <Plus className="w-4 h-4" />
              Add Question
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
