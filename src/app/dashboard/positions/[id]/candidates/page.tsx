/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { createClient } from '@/utils/supabase/server'
import prisma from '@/utils/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Video, Users, CheckCircle2, SearchX } from 'lucide-react'

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
    <div className="p-8 md:p-12 max-w-7xl mx-auto">
      <Link href="/dashboard/positions" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-10 font-medium group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Positions
      </Link>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Candidates for {position.title}</h1>
          <p className="text-white/50 text-lg">Review the video interviews submitted by candidates.</p>
        </div>
      </div>

      <div className="space-y-8">
        {position.interviews.length === 0 ? (
          <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/5 p-16 rounded-[2.5rem] text-center shadow-2xl relative overflow-hidden">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-600/5 rounded-full blur-[80px] pointer-events-none"></div>
             <SearchX className="w-16 h-16 text-white/20 mx-auto mb-6 relative z-10" />
             <h3 className="text-2xl font-bold text-white mb-2 relative z-10">No candidates yet</h3>
             <p className="text-white/50 text-lg relative z-10">Share your position link to invite candidates to complete the interview.</p>
          </div>
        ) : (
          position.interviews.map((interview: any) => (
            <div key={interview.id} className="bg-white/[0.02] backdrop-blur-xl border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl group transition-all hover:border-white/10 hover:bg-white/[0.03]">
              <div className="p-8 border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-[40px] pointer-events-none group-hover:bg-blue-500/20 transition-colors"></div>
                <div className="flex items-center gap-5 relative z-10">
                   <div className="w-14 h-14 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 rounded-2xl border border-white/10 flex items-center justify-center text-blue-400 shadow-lg">
                      <Users className="w-6 h-6" />
                   </div>
                   <div>
                     <h3 className="text-2xl font-bold text-white">{interview.candidate.name}</h3>
                     <p className="text-white/50">{interview.candidate.email}</p>
                   </div>
                </div>
                <div className="flex gap-8 relative z-10">
                  <div className="text-center">
                    <p className="text-xs text-white/40 uppercase tracking-wider mb-2 font-semibold">Status</p>
                    <p className={`font-bold px-4 py-1.5 rounded-xl text-xs border ${interview.status === 'COMPLETED' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}`}>
                      {interview.status}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-white/40 uppercase tracking-wider mb-2 font-semibold">Responses</p>
                    <p className="font-bold text-white text-xl leading-none">{interview.responses.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="p-8 bg-black/40">
                {interview.responses.length === 0 ? (
                  <div className="text-center py-8">
                     <Video className="w-12 h-12 text-white/10 mx-auto mb-3" />
                     <p className="text-white/40 text-lg">No video responses recorded yet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {interview.responses.map((response: any) => {
                      const question = position.questions.find((q: any) => q.id === response.questionId)
                      return (
                      <div key={response.id} className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 shadow-xl hover:border-white/10 transition-colors">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400 border border-blue-500/20 shrink-0">
                            <Video className="w-4 h-4" />
                          </div>
                          <p className="text-base font-medium text-white/90 line-clamp-2 pt-0.5">
                            {question?.content || 'Unknown Question'}
                          </p>
                        </div>
                        <video src={response.videoUrl} controls className="w-full rounded-xl bg-black border border-white/5 aspect-video object-cover" />
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
