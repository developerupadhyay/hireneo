import { createPosition } from './actions'
import { ArrowLeft, Save, Briefcase, Lightbulb, Clock, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

export default function NewPositionPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Back Link */}
      <Link 
        href="/dashboard/positions" 
        className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:text-white/60 dark:hover:text-white transition-colors font-medium group text-sm min-h-[44px] touch-target-48"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>Back to Positions</span>
      </Link>

      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400 mb-2">
          <Briefcase className="w-3.5 h-3.5" />
          Job Role Creation
        </div>
        <h1 className="fluid-heading-1 font-bold text-slate-900 dark:text-white tracking-tight">
          Create a New Position
        </h1>
        <p className="text-slate-600 dark:text-white/60 text-sm sm:text-base mt-1">
          Set up the job title and description. You will add interview questions on the next step.
        </p>
      </div>

      {/* Bento Grid: Form Card + Telemetry / Tips Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Bento Form Card (Col-Span 2) */}
        <div className="bento-card p-6 sm:p-8 lg:col-span-2">
          <form action={createPosition} className="space-y-6">
            <div className="space-y-2">
              <label 
                htmlFor="title" 
                className="text-xs font-bold text-slate-700 dark:text-white/80 uppercase tracking-wider pl-0.5 block"
              >
                Position Title <span className="text-blue-600">*</span>
              </label>
              <input 
                id="title"
                name="title"
                type="text" 
                required
                placeholder="e.g. Senior Frontend Engineer"
                className="w-full bg-slate-50 dark:bg-black/40 border border-slate-300 dark:border-white/10 rounded-xl py-3 px-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all micro-tactile min-h-[48px]"
              />
              <p className="text-xs text-slate-500 dark:text-white/50 pl-0.5">
                The role title displayed on candidate interview invites.
              </p>
            </div>

            <div className="space-y-2">
              <label 
                htmlFor="description" 
                className="text-xs font-bold text-slate-700 dark:text-white/80 uppercase tracking-wider pl-0.5 block"
              >
                Role Overview / Description
              </label>
              <textarea 
                id="description"
                name="description"
                rows={5}
                placeholder="Briefly describe the key responsibilities, expectations, and culture..."
                className="w-full bg-slate-50 dark:bg-black/40 border border-slate-300 dark:border-white/10 rounded-xl py-3 px-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all resize-none micro-tactile"
              />
              <p className="text-xs text-slate-500 dark:text-white/50 pl-0.5">
                Candidates read this brief before beginning the automated equipment check.
              </p>
            </div>

            <div className="pt-4 flex items-center justify-end border-t border-slate-200/80 dark:border-white/10">
              <button 
                type="submit"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/20 hover:shadow-lg transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 min-h-[48px] touch-target-48 w-full sm:w-auto"
              >
                <Save className="w-4 h-4" />
                <span>Save and Configure Questions</span>
              </button>
            </div>
          </form>
        </div>

        {/* Supporting Bento Guidance Card (Col-Span 1) */}
        <div className="space-y-4">
          <div className="bento-card p-6">
            <div className="flex items-center gap-2.5 mb-3 text-blue-600 dark:text-blue-400">
              <Lightbulb className="w-5 h-5" />
              <h3 className="text-sm font-bold uppercase tracking-wider">
                Screening Best Practices
              </h3>
            </div>
            
            <ul className="space-y-3.5 text-xs sm:text-sm text-slate-600 dark:text-white/70 leading-relaxed">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span><strong>3 to 5 questions:</strong> Keeps total interview length under 15 minutes, ensuring 90%+ completion rates.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                <span><strong>30s thinking timers:</strong> Gives candidates time to collect their thoughts without allowing rehearsed scripts.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span><strong>Pre-built Library:</strong> On the next screen, you can import engineering, product, or leadership prompts in 1 click.</span>
              </li>
            </ul>
          </div>

          <div className="bento-card p-5 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent">
            <span className="text-[11px] font-bold text-slate-500 dark:text-white/50 uppercase tracking-wider block mb-1">
              Next Step Preview
            </span>
            <p className="text-xs text-slate-600 dark:text-white/70 leading-relaxed">
              Once created, you will get a unique shareable URL that candidates can open in any browser to record their takes.
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}
