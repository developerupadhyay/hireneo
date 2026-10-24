/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import prisma from '@/utils/prisma'
import InterviewFlow from './InterviewFlow'
import { CheckCircle2, Sparkles } from 'lucide-react'
import ThemeSwitcher from '@/components/ThemeSwitcher'

export default async function RecordInterviewPage({ params }: { params: Promise<{ id: string, interviewId: string }> }) {
  const { id, interviewId } = await params

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
      <div className="p-8 text-slate-900 dark:text-white min-h-screen bg-slate-50 dark:bg-[#050505] flex items-center justify-center">
        <div className="p-8 rounded-3xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-center shadow-lg">
          Interview session not found or expired.
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
      <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-slate-50 dark:bg-[#050505] text-slate-900 dark:text-white relative overflow-hidden font-sans transition-colors duration-200">
        <div className="absolute top-4 right-4 z-20">
          <ThemeSwitcher />
        </div>
        <div className="bg-white dark:bg-white/[0.03] backdrop-blur-3xl border border-slate-200 dark:border-white/10 p-10 sm:p-16 rounded-3xl text-center max-w-xl shadow-2xl relative z-10 overflow-hidden">
          <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-950/40 rounded-3xl border border-emerald-200 dark:border-emerald-900/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-md mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
            Interview Completed!
          </h1>
          <p className="text-slate-600 dark:text-white/60 text-base sm:text-lg leading-relaxed mb-6">
            Thank you for your time. Your video responses have been successfully submitted to the recruiter. You can now safely close this window.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050505] text-slate-900 dark:text-white p-4 sm:p-8 flex flex-col items-center justify-center relative overflow-hidden font-sans transition-colors duration-200">
      <div className="absolute top-4 right-4 z-20">
        <ThemeSwitcher />
      </div>

      <div className="relative z-10 w-full max-w-5xl py-6">
        <InterviewFlow interviewId={interviewId} questions={remainingQuestions} />
      </div>
    </div>
  )
}
