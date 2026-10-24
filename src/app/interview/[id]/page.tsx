import prisma from '@/utils/prisma'
import { Video, Clock, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react'
import { createInterview } from './actions'
import ThemeSwitcher from '@/components/ThemeSwitcher'

export default async function CandidateLandingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  const position = await prisma.position.findUnique({
    where: { id },
    include: { questions: { orderBy: { order: 'asc' } }, profile: { include: { company: true } } }
  })

  if (!position) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#06090e] p-6 text-slate-900 dark:text-white">
      <div className="bento-card p-8 sm:p-12 text-center max-w-md">
        <h2 className="text-xl sm:text-2xl font-bold mb-2">Position Not Found</h2>
        <p className="text-slate-600 dark:text-white/60 text-sm">
          This interview link is invalid or has expired. Please contact the recruiter for an updated invite.
        </p>
      </div>
    </div>
  )

  const totalTime = position.questions.reduce((acc: number, q: { thinkTime: number; answerTime: number }) => acc + q.thinkTime + q.answerTime, 0)
  const totalMins = Math.ceil(totalTime / 60)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 bg-slate-50 dark:bg-[#06090e] text-slate-900 dark:text-white relative overflow-hidden font-sans selection:bg-blue-500/20 transition-colors duration-200">
      {/* Top Floating Glass Header Bar */}
      <header 
        className="fixed top-0 left-0 right-0 glass-floating border-b border-slate-200/80 dark:border-white/10 px-4 sm:px-6 py-3 flex items-center justify-between z-30"
        aria-label="Interview Header"
      >
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center">
            <Video className="w-4 h-4" />
          </div>
          <span className="font-bold text-sm text-slate-900 dark:text-white">
            Hireneo
          </span>
          <span className="text-xs text-slate-400 dark:text-white/40 hidden sm:inline">
            • Asynchronous Video Screening
          </span>
        </div>

        <ThemeSwitcher />
      </header>

      {/* Main Candidate Onboarding Bento Card */}
      <main className="relative z-10 max-w-xl w-full pt-16 pb-8">
        <div className="bento-card p-6 sm:p-10 shadow-xl overflow-hidden">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-500/10 rounded-2xl border border-blue-200 dark:border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-sm mx-auto mb-3">
              <Sparkles className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 tracking-wider uppercase block mb-1">
              {position.profile.company.name}
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              {position.title}
            </h1>
            <p className="text-slate-600 dark:text-white/60 text-xs sm:text-sm mt-2 leading-relaxed">
              {position.description || 'Welcome! Complete this quick asynchronous video interview on your own schedule.'}
            </p>
          </div>

          {/* Telemetry Bento Grid Pill Cards */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 text-center micro-tactile">
              <div className="w-8 h-8 mx-auto bg-blue-50 dark:bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400 mb-1 border border-blue-200 dark:border-blue-500/20">
                <Video className="w-4 h-4" />
              </div>
              <span className="text-xl font-bold text-slate-900 dark:text-white font-mono num-tabular block">
                {position.questions.length}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-white/50 uppercase tracking-wider font-semibold">
                Questions
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 text-center micro-tactile">
              <div className="w-8 h-8 mx-auto bg-purple-50 dark:bg-purple-500/10 rounded-lg flex items-center justify-center text-purple-600 dark:text-purple-400 mb-1 border border-purple-200 dark:border-purple-500/20">
                <Clock className="w-4 h-4" />
              </div>
              <span className="text-xl font-bold text-slate-900 dark:text-white font-mono num-tabular block">
                ~{totalMins} min
              </span>
              <span className="text-[11px] text-slate-500 dark:text-white/50 uppercase tracking-wider font-semibold">
                Total Time
              </span>
            </div>
          </div>

          {/* Form */}
          <form action={createInterview} className="space-y-4">
            <input type="hidden" name="positionId" value={position.id} />
            
            <div className="space-y-1.5">
              <label 
                htmlFor="candidate-name"
                className="text-xs font-bold text-slate-700 dark:text-white/80 uppercase tracking-wider pl-0.5 block"
              >
                Your Full Name
              </label>
              <input 
                id="candidate-name"
                name="name" 
                required 
                className="w-full bg-slate-50 dark:bg-black/40 border border-slate-300 dark:border-white/10 rounded-xl py-3 px-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all micro-tactile min-h-[48px]" 
                placeholder="Jane Doe" 
              />
            </div>

            <div className="space-y-1.5">
              <label 
                htmlFor="candidate-email"
                className="text-xs font-bold text-slate-700 dark:text-white/80 uppercase tracking-wider pl-0.5 block"
              >
                Email Address
              </label>
              <input 
                id="candidate-email"
                name="email" 
                type="email" 
                required 
                className="w-full bg-slate-50 dark:bg-black/40 border border-slate-300 dark:border-white/10 rounded-xl py-3 px-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all micro-tactile min-h-[48px]" 
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
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-base shadow-md shadow-blue-500/20 hover:shadow-lg transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 min-h-[48px] touch-target-48 mt-3"
            >
              <span>Begin Camera & Mic Check</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-200/80 dark:border-white/10 flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-white/50">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Encrypted WebRTC • No extensions or downloads</span>
          </div>
        </div>
      </main>
    </div>
  )
}
