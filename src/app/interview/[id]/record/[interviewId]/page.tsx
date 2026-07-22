import prisma from '@/utils/prisma'
import InterviewFlow from './InterviewFlow'

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

  if (!interview) return <div className="p-8 text-white">Interview not found</div>

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
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
         <div className="bg-surface/50 border border-white/10 p-12 rounded-3xl text-center max-w-lg shadow-2xl">
            <h1 className="text-3xl font-bold text-white mb-4">Interview Completed!</h1>
            <p className="text-text-muted">Thank you for your time. Your video responses have been successfully submitted to the recruiter.</p>
         </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4 flex flex-col items-center justify-center">
       <InterviewFlow interviewId={interviewId} questions={remainingQuestions} />
    </div>
  )
}
