import { createClient } from '@/utils/supabase/server'
import prisma from '@/utils/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Video, CheckCircle2, Clock } from 'lucide-react'

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
    <div className="p-8 max-w-6xl mx-auto">
      <Link href="/dashboard/positions" className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to Positions
      </Link>
      
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Candidates for {position.title}</h1>
          <p className="text-text-muted">Review the video interviews submitted by candidates.</p>
        </div>
      </div>

      <div className="space-y-6">
        {position.interviews.length === 0 ? (
          <div className="bg-surface/30 border border-white/5 p-12 rounded-2xl text-center">
            <p className="text-white/60">No candidates have started the interview yet.</p>
          </div>
        ) : (
          position.interviews.map(interview => (
            <div key={interview.id} className="bg-surface/50 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
              <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                <div>
                  <h3 className="text-xl font-bold text-white">{interview.candidate.name}</h3>
                  <p className="text-sm text-text-muted">{interview.candidate.email}</p>
                </div>
                <div className="flex gap-6">
                  <div className="text-center">
                    <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Status</p>
                    <p className={`font-medium px-3 py-1 rounded-full text-xs ${interview.status === 'COMPLETED' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                      {interview.status}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Responses</p>
                    <p className="font-bold text-white text-sm">{interview.responses.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6 bg-black/20">
                {interview.responses.length === 0 ? (
                  <p className="text-sm text-white/40 text-center py-4">No video responses recorded yet.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {interview.responses.map(response => {
                      const question = position.questions.find(q => q.id === response.questionId)
                      return (
                      <div key={response.id} className="bg-surface border border-white/5 rounded-xl p-4 shadow-lg">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="mt-0.5 text-primary">
                            <Video className="w-5 h-5" />
                          </div>
                          <p className="text-sm font-medium text-white/90 line-clamp-2 flex-1">
                            {question?.content || 'Unknown Question'}
                          </p>
                        </div>
                        <video src={response.videoUrl} controls className="w-full rounded-lg bg-black aspect-video object-contain" />
                      </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
