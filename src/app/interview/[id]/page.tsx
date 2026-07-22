/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import prisma from '@/utils/prisma'
import { createInterview } from './actions'
import { Briefcase, Clock, Video, Sparkles } from 'lucide-react'

export default async function InterviewLandingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  const position = await prisma.position.findUnique({
    where: { id },
    include: { questions: true, profile: { include: { company: true } } }
  })

  if (!position) return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505]">
      <div className="bg-white/[0.02] border border-white/5 p-12 rounded-[2rem] text-center shadow-2xl backdrop-blur-xl">
        <h2 className="text-2xl font-bold text-white mb-2">Position not found</h2>
        <p className="text-white/50">This interview link is invalid or has expired.</p>
      </div>
    </div>
  )

  const totalTime = position.questions.reduce((acc: number, q: any) => acc + q.thinkTime + q.answerTime, 0)
  const totalMins = Math.ceil(totalTime / 60)

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#050505] relative overflow-hidden selection:bg-blue-500/30 font-sans">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?q=50&w=800&auto=format&fit=crop')] bg-cover bg-center opacity-10 z-0 mix-blend-screen filter blur-md"></div>
      
      <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen"></div>

      <div className="relative z-10 max-w-xl w-full bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl overflow-hidden group">
         <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[80px] pointer-events-none"></div>

         <div className="text-center mb-10 relative z-10">
            <div className="w-16 h-16 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 rounded-2xl border border-white/10 flex items-center justify-center text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.15)] mx-auto mb-6">
              <Sparkles className="w-8 h-8" />
            </div>
            <h2 className="text-sm font-bold text-blue-400 tracking-widest uppercase mb-3">{position.profile.company.name}</h2>
            <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">{position.title}</h1>
            <p className="text-white/60 text-lg leading-relaxed">{position.description}</p>
         </div>

         <div className="flex justify-center gap-12 mb-10 border-y border-white/5 py-8 relative z-10 bg-white/[0.01]">
            <div className="text-center">
              <div className="w-14 h-14 mx-auto bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 mb-4 shadow-[0_0_15px_rgba(59,130,246,0.15)] border border-blue-500/20"><Video className="w-6 h-6"/></div>
              <p className="text-white font-bold text-2xl mb-1">{position.questions.length}</p>
              <p className="text-xs text-white/40 uppercase tracking-widest font-semibold">Questions</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 mx-auto bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-400 mb-4 shadow-[0_0_15px_rgba(168,85,247,0.15)] border border-purple-500/20"><Clock className="w-6 h-6"/></div>
              <p className="text-white font-bold text-2xl mb-1">~{totalMins} min</p>
              <p className="text-xs text-white/40 uppercase tracking-widest font-semibold">Est. Time</p>
            </div>
         </div>

         <form action={createInterview} className="space-y-5 relative z-10">
            <input type="hidden" name="positionId" value={position.id} />
            <div className="space-y-2">
              <label className="text-xs font-semibold text-white/70 uppercase tracking-wider pl-1">Full Name</label>
              <input name="name" required className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all hover:bg-white/[0.07]" placeholder="Jane Doe" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-white/70 uppercase tracking-wider pl-1">Email Address</label>
              <input name="email" type="email" required className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all hover:bg-white/[0.07]" placeholder="jane@example.com" />
            </div>
            
            {/* Anti-Spam Honeypot Field - Hidden from humans, visible to bots */}
            <div className="hidden" aria-hidden="true">
              <label htmlFor="company_website">Company Website</label>
              <input id="company_website" name="company_website" type="text" tabIndex={-1} autoComplete="off" />
            </div>

            <button type="submit" className="relative group inline-flex rounded-xl w-full mt-4">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-40 group-hover:opacity-100 transition duration-500"></div>
              <div className="relative w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold px-6 py-4 rounded-xl flex items-center justify-center gap-2 shadow-xl hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all active:scale-95 border border-white/20 text-lg">
                Start Interview
              </div>
            </button>
         </form>
      </div>
    </div>
  )
}
