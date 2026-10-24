/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from '@/utils/prisma'
import InterviewFlow from './InterviewFlow'
import { CheckCircle2, Video } from 'lucide-react'
import ThemeSwitcher from '@/components/ThemeSwitcher'

export default async function RecordInterviewPage({ params }: { params: Promise<{ id: string, interviewId: string }> }) {
  const { interviewId } = await params

  const interview = await prisma.interview.findUnique({
    where: { id: interviewId },
    include: {
      position: {
        include: { questions: { orderBy: { order: 'asc' } } }
      },
      responses: true
    }
  })

  if (!interview) {
    return (
      <div className="p-8 text-slate-900 dark:text-white min-h-screen bg-slate-50 dark:bg-[#06090e] flex items-center justify-center">
        <div className="bento-card p-8 rounded-2xl text-center max-w-md shadow-lg">
          <h2 className="text-xl font-bold mb-2">Session Expired</h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-white/50">
            Interview session not found or link has expired.
          </p>
        </div>
      </div>
    )
  }

  // Filter out questions that have already been answered
  const answeredQuestionIds = interview.responses.map((r: any) => r.questionId)
  const remainingQuestions = interview.position.questions.filter((q: any) => !answeredQuestionIds.includes(q.id))

  if (remainingQuestions.length === 0) {
    // If all questions are answered, mark as completed
    if (interview.status !== 'COMPLETED') {
      await prisma.interview.update({
        where: { id: interviewId },
        data: { status: 'COMPLETED', completedAt: new Date() }
      })
    }
    return (
      <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-slate-50 dark:bg-[#06090e] text-slate-900 dark:text-white relative overflow-hidden font-sans transition-colors duration-200">
        <header 
          className="fixed top-0 left-0 right-0 glass-floating border-b border-slate-200/80 dark:border-white/10 px-4 sm:px-6 py-3 flex items-center justify-between z-30"
          aria-label="Interview Completed Header"
        >
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center">
              <Video className="w-4 h-4" />
            </div>
            <span className="font-bold text-sm text-slate-900 dark:text-white">
              Hireneo
            </span>
          </div>

          <ThemeSwitcher />
        </header>

        <div className="bento-card p-8 sm:p-14 text-center max-w-lg shadow-xl relative z-10">
          <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-900/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-md mx-auto mb-5">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
            Interview Completed!
          </h1>
          <p className="text-slate-600 dark:text-white/60 text-sm sm:text-base leading-relaxed mb-6">
            Thank you for completing your video assessment for <strong className="text-slate-900 dark:text-white font-semibold">&ldquo;{interview.position.title}&rdquo;</strong>. Your video answers have been encrypted and submitted directly to the hiring team.
          </p>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 text-xs text-slate-500 dark:text-white/50">
            You may now safely close this browser window.
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#06090e] text-slate-900 dark:text-white p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-center relative overflow-hidden font-sans transition-colors duration-200 pt-16">
      <header 
        className="fixed top-0 left-0 right-0 glass-floating border-b border-slate-200/80 dark:border-white/10 px-4 sm:px-6 py-3 flex items-center justify-between z-30"
        aria-label="Interview Recording Header"
      >
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center">
            <Video className="w-4 h-4" />
          </div>
          <span className="font-bold text-sm text-slate-900 dark:text-white">
            Hireneo
          </span>
          <span className="text-xs text-slate-500 dark:text-white/50 hidden sm:inline">
            • {interview.position.title}
          </span>
        </div>

        <ThemeSwitcher />
      </header>

      <div className="relative z-10 w-full max-w-4xl py-6">
        <InterviewFlow interviewId={interviewId} questions={remainingQuestions} />
      </div>
    </div>
  )
}
