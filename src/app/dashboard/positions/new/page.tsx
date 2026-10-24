import { createPosition } from './actions'
import { ArrowLeft, Save, Briefcase } from 'lucide-react'
import Link from 'next/link'

export default function NewPositionPage() {
  return (
    <div className="p-6 md:p-12 max-w-3xl mx-auto">
      <Link 
        href="/dashboard" 
        className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:text-white/50 dark:hover:text-white transition-colors mb-8 font-medium group text-sm"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Dashboard
      </Link>

      <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-3xl p-6 sm:p-10 shadow-xs dark:shadow-2xl relative overflow-hidden">
        <div className="flex items-center gap-4 mb-8 relative z-10">
          <div className="w-12 h-12 bg-blue-500/10 rounded-2xl border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-sm flex-shrink-0">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              Create a New Position
            </h1>
            <p className="text-slate-500 dark:text-white/50 text-sm mt-0.5">
              Define the role you&apos;re hiring for.
            </p>
          </div>
        </div>

        <form action={createPosition} className="space-y-6 relative z-10">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-white/70 uppercase tracking-wider pl-0.5">
              Position Title
            </label>
            <input 
              name="title"
              type="text" 
              required
              placeholder="e.g. Senior Frontend Engineer"
              className="w-full bg-slate-50 dark:bg-black/40 border border-slate-300 dark:border-white/10 rounded-2xl py-3 px-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-white/70 uppercase tracking-wider pl-0.5">
              Description
            </label>
            <textarea 
              name="description"
              rows={4}
              placeholder="Briefly describe the responsibilities and requirements..."
              className="w-full bg-slate-50 dark:bg-black/40 border border-slate-300 dark:border-white/10 rounded-2xl py-3 px-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all resize-none"
            />
          </div>

          <div className="pt-4 flex justify-end">
            <button 
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <Save className="w-4 h-4" />
              <span>Save and Add Questions</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
