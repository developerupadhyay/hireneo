import prisma from '@/utils/prisma'
import { Video, Clock, Sparkles } from 'lucide-react'
import { createInterview } from './actions'
import ThemeSwitcher from '@/components/ThemeSwitcher'

export default async function CandidateLandingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  const position = await prisma.position.findUnique({
    where: { id },
    include: { questions: { orderBy: { order: 'asc' } }, profile: { include: { company: true } } }
  })

  if (!position) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#050505] p-6 text-slate-900 dark:text-white">
      <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 p-10 rounded-3xl text-center shadow-lg">
        <h2 className="text-2xl font-bold mb-2">Position not found</h2>
        <p className="text-slate-500 dark:text-white/50 text-sm">This interview link is invalid or has expired.</p>
      </div>
    </div>
  )

  const totalTime = position.questions.reduce((acc: number, q: { thinkTime: number; answerTime: number }) => acc + q.thinkTime + q.answerTime, 0)
  const totalMins = Math.ceil(totalTime / 60)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 bg-slate-50 dark:bg-[#050505] text-slate-900 dark:text-white relative overflow-hidden font-sans selection:bg-blue-500/30 transition-colors duration-200">
      <div className="absolute top-4 right-4 z-20">
        <ThemeSwitcher />
      </div>

      <div className="relative z-10 max-w-xl w-full bg-white dark:bg-white/[0.03] backdrop-blur-3xl border border-slate-200 dark:border-white/10 rounded-3xl p-6 sm:p-10 shadow-xl dark:shadow-2xl overflow-hidden">
         <div className="text-center mb-8 relative z-10">
            <div className="w-14 h-14 bg-blue-500/10 rounded-2xl border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-sm mx-auto mb-4">
              <Sparkles className="w-7 h-7" />
            </div>
            <h2 className="text-xs font-bold text-blue-600 dark:text-blue-400 tracking-widest uppercase mb-2">
              {position.profile.company.name}
            </h2>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">
              {position.title}
            </h1>
            <p className="text-slate-600 dark:text-white/60 text-sm sm:text-base leading-relaxed">
              {position.description}
            </p>
         </div>

         <div className="flex justify-center gap-8 sm:gap-12 mb-8 border-y border-slate-200 dark:border-white/10 py-6 relative z-10">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-2 border border-blue-500/20">
                <Video className="w-5 h-5"/>
              </div>
              <p className="text-slate-900 dark:text-white font-bold text-xl mb-0.5">{position.questions.length}</p>
              <p className="text-xs text-slate-400 dark:text-white/40 uppercase tracking-wider font-semibold">Questions</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400 mb-2 border border-purple-500/20">
                <Clock className="w-5 h-5"/>
              </div>
              <p className="text-slate-900 dark:text-white font-bold text-xl mb-0.5">~{totalMins} min</p>
              <p className="text-xs text-slate-400 dark:text-white/40 uppercase tracking-wider font-semibold">Est. Time</p>
            </div>
         </div>

         <form action={createInterview} className="space-y-4 relative z-10">
            <input type="hidden" name="positionId" value={position.id} />
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-white/70 uppercase tracking-wider pl-0.5">
                Full Name
              </label>
              <input 
                name="name" 
                required 
                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl py-3 px-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all" 
                placeholder="Jane Doe" 
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-white/70 uppercase tracking-wider pl-0.5">
                Email Address
              </label>
              <input 
                name="email" 
                type="email" 
                required 
                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl py-3 px-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all" 
                placeholder="jane@example.com" 
              />
            </div>
            
            {/* Anti-Spam Honeypot Field */}
            <div className="hidden" aria-hidden="true">
              <label htmlFor="company_website">Company Website</label>
              <input id="company_website" name="company_website" type="text" tabIndex={-1} autoComplete="off" />
            </div>

            <button 
              type="submit" 
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-base shadow-sm transition-all active:scale-[0.98] mt-2"
            >
              Start Interview
            </button>
         </form>
      </div>
    </div>
  )
}
