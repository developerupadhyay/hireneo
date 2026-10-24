import { createClient } from '@/utils/supabase/server'
import prisma from '@/utils/prisma'
import { redirect } from 'next/navigation'
import { Settings, Save, User, Building, Mail } from 'lucide-react'
import { updateProfile } from './actions'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
    include: { company: true }
  })

  if (!profile) return null

  return (
    <div className="p-6 md:p-12 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
          <Settings className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          Settings
        </h1>
        <p className="text-slate-500 dark:text-white/50 mt-1 text-sm sm:text-base">
          Manage your recruiter account and company profile.
        </p>
      </div>

      <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-3xl p-6 sm:p-10 shadow-xs dark:shadow-2xl relative overflow-hidden">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-blue-500/10 rounded-2xl border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-sm flex-shrink-0">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Profile & Organization
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-white/50">
              Update how your name and company appear on candidate interview invites.
            </p>
          </div>
        </div>

        <form action={updateProfile} className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-white/70 uppercase tracking-wider pl-0.5">
              Your Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/40" />
              <input 
                name="name"
                type="text" 
                required
                defaultValue={profile.name || ''}
                placeholder="e.g. John Doe"
                className="w-full bg-slate-50 dark:bg-black/40 border border-slate-300 dark:border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-white/70 uppercase tracking-wider pl-0.5">
              Company Name
            </label>
            <div className="relative">
              <Building className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/40" />
              <input 
                name="companyName"
                type="text" 
                required
                defaultValue={profile.company.name}
                placeholder="e.g. Acme Corp"
                className="w-full bg-slate-50 dark:bg-black/40 border border-slate-300 dark:border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-white/70 uppercase tracking-wider pl-0.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/40" />
              <input 
                type="email" 
                disabled
                defaultValue={profile.email}
                className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-500 dark:text-white/40 cursor-not-allowed"
              />
            </div>
            <p className="text-xs text-slate-400 dark:text-white/40 pl-0.5">
              Email is managed by Supabase authentication and cannot be altered here.
            </p>
          </div>

          <div className="pt-4 flex justify-end border-t border-slate-200 dark:border-white/10">
            <button 
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/20 hover:shadow-lg transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
