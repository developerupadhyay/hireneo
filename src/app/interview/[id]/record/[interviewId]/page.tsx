/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import prisma from '@/utils/prisma'
import InterviewFlow from './InterviewFlow'
import { CheckCircle2, Sparkles } from 'lucide-react'

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

  if (!interview) return <div className="p-8 text-white min-h-screen bg-[#050505] flex items-center justify-center">Interview not found</div>

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
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#050505] relative overflow-hidden font-sans">
         <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-green-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen"></div>
         
         <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/5 p-16 rounded-[3rem] text-center max-w-2xl shadow-2xl relative z-10 overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-[80px] pointer-events-none"></div>
            
            <div className="w-24 h-24 bg-gradient-to-tr from-green-500/20 to-emerald-500/20 rounded-[2rem] border border-white/10 flex items-center justify-center text-green-400 shadow-[0_0_30px_rgba(34,197,94,0.2)] mx-auto mb-8 relative z-10">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            
            <h1 className="text-5xl font-bold text-white mb-6 tracking-tight relative z-10">Interview Completed!</h1>
            <p className="text-white/60 text-xl leading-relaxed relative z-10">Thank you for your time. Your video responses have been successfully submitted to the recruiter. You can now safely close this window.</p>
         </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050505] p-4 md:p-8 flex flex-col items-center justify-center relative overflow-hidden font-sans">
       <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen z-0"></div>
       <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen z-0"></div>
       
       <div className="relative z-10 w-full max-w-5xl">
         <InterviewFlow interviewId={interviewId} questions={remainingQuestions} />
       </div>
    </div>
  )
}
