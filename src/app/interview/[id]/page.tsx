import prisma from '@/utils/prisma'
import { createInterview } from './actions'
import { Briefcase, Clock, Video } from 'lucide-react'

export default async function InterviewLandingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  const position = await prisma.position.findUnique({
    where: { id },
    include: { questions: true, profile: { include: { company: true } } }
  })

  if (!position) return <div className="text-white p-8">Position not found</div>

  const totalTime = position.questions.reduce((acc, q) => acc + q.thinkTime + q.answerTime, 0)
  const totalMins = Math.ceil(totalTime / 60)

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2029&auto=format&fit=crop')] bg-cover bg-center opacity-20 z-0"></div>
      
      <div className="relative z-10 max-w-xl w-full bg-surface/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
         <div className="text-center mb-8">
            <h2 className="text-sm font-bold text-primary tracking-widest uppercase mb-2">{position.profile.company.name}</h2>
            <h1 className="text-3xl font-bold text-white mb-4">{position.title}</h1>
            <p className="text-text-muted">{position.description}</p>
         </div>

         <div className="flex justify-center gap-8 mb-8 border-y border-white/10 py-6">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-3 shadow-lg shadow-primary/20"><Video className="w-6 h-6"/></div>
              <p className="text-white font-bold text-lg">{position.questions.length}</p>
              <p className="text-xs text-text-muted uppercase tracking-wider">Questions</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-400 mb-3 shadow-lg shadow-purple-500/20"><Clock className="w-6 h-6"/></div>
              <p className="text-white font-bold text-lg">~{totalMins} min</p>
              <p className="text-xs text-text-muted uppercase tracking-wider">Est. Time</p>
            </div>
         </div>

         <form action={createInterview} className="space-y-4">
            <input type="hidden" name="positionId" value={position.id} />
            <div>
              <label className="text-sm text-white/80 font-medium pl-1">Full Name</label>
              <input name="name" required className="w-full bg-black/30 border border-white/10 rounded-xl py-3 px-4 text-white mt-1 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" placeholder="Jane Doe" />
            </div>
            <div>
              <label className="text-sm text-white/80 font-medium pl-1">Email Address</label>
              <input name="email" type="email" required className="w-full bg-black/30 border border-white/10 rounded-xl py-3 px-4 text-white mt-1 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" placeholder="jane@example.com" />
            </div>
            <button type="submit" className="w-full bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-blue-700 text-white font-semibold py-3.5 rounded-xl mt-6 transition-all shadow-lg shadow-primary/25 active:scale-95">
              Start Interview
            </button>
         </form>
      </div>
    </div>
  )
}
