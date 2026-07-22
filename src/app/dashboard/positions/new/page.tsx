import { createPosition } from './actions'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'

export default function NewPositionPage() {
  return (
    <div className="p-8 max-w-3xl mx-auto">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8">
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      <div className="bg-surface/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
        <h1 className="text-3xl font-bold text-white mb-2">Create New Position</h1>
        <p className="text-text-muted mb-8">Let's start by defining the role you are hiring for.</p>

        <form action={createPosition} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80">Position Title</label>
            <input 
              name="title"
              type="text" 
              required
              placeholder="e.g. Senior Frontend Engineer"
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80">Description</label>
            <textarea 
              name="description"
              rows={4}
              placeholder="Briefly describe the responsibilities and requirements..."
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>

          <div className="pt-4 flex justify-end">
            <button 
              type="submit"
              className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-blue-700 text-white font-medium px-6 py-3 rounded-xl transition-all shadow-lg shadow-primary/25"
            >
              <Save className="w-5 h-5" />
              Save and Add Questions
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
