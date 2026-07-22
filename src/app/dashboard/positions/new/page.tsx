import { createPosition } from './actions'
import { ArrowLeft, Save, Briefcase } from 'lucide-react'
import Link from 'next/link'

export default function NewPositionPage() {
  return (
    <div className="p-8 md:p-12 max-w-4xl mx-auto">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-10 font-medium group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Dashboard
      </Link>

      <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none"></div>
        
        <div className="flex items-center gap-4 mb-8 relative z-10">
          <div className="w-16 h-16 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 rounded-2xl border border-white/10 flex items-center justify-center text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.15)]">
            <Briefcase className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Create a New Position</h1>
            <p className="text-white/50 text-lg">Define the role you&apos;re hiring for.</p>
          </div>
        </div>

        <form action={createPosition} className="space-y-8 relative z-10">
          <div className="space-y-3">
            <label className="text-sm font-semibold text-white/80 uppercase tracking-wider pl-1">Position Title</label>
            <input 
              name="title"
              type="text" 
              required
              placeholder="e.g. Senior Frontend Engineer"
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all hover:bg-white/[0.07]"
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-white/80 uppercase tracking-wider pl-1">Description</label>
            <textarea 
              name="description"
              rows={4}
              placeholder="Briefly describe the responsibilities and requirements..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all hover:bg-white/[0.07]"
            />
          </div>

          <div className="pt-6 flex justify-end">
            <button 
              type="submit"
              className="relative group inline-flex rounded-xl"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-40 group-hover:opacity-100 transition duration-500"></div>
              <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold px-8 py-4 rounded-xl flex items-center gap-3 shadow-xl hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all active:scale-95 border border-white/20">
                <Save className="w-5 h-5" />
                Save and Add Questions
              </div>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
