import { createClient } from '@/utils/supabase/server'
import prisma from '@/utils/prisma'
import { redirect } from 'next/navigation'
import { Settings, Save, User, Building, Mail, ShieldCheck, Key } from 'lucide-react'
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
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400 mb-2">
          <Settings className="w-3.5 h-3.5" />
          Account & Company
        </div>
        <h1 className="fluid-heading-1 font-bold text-slate-900 dark:text-white tracking-tight">
          Settings
        </h1>
        <p className="text-slate-600 dark:text-white/60 text-sm sm:text-base mt-1">
          Manage your recruiter credentials and company branding.
        </p>
      </div>

      {/* Bento Grid: Main Form Card + Account Security Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Bento Form Card (Col-Span 2) */}
        <div className="bento-card p-6 sm:p-8 lg:col-span-2">
          <div className="flex items-center gap-3.5 mb-6 pb-4 border-b border-slate-200/80 dark:border-white/10">
            <div className="w-11 h-11 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl border border-blue-200 dark:border-blue-500/20 flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                Profile & Organization
              </h2>
              <p className="text-xs text-slate-500 dark:text-white/50">
                This information is shown to candidates on their interview welcome screens.
              </p>
            </div>
          </div>

          <form action={updateProfile} className="space-y-5">
            <div className="space-y-1.5">
              <label 
                htmlFor="name"
                className="text-xs font-bold text-slate-700 dark:text-white/80 uppercase tracking-wider pl-0.5 block"
              >
                Your Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/40" />
                <input 
                  id="name"
                  name="name"
                  type="text" 
                  required
                  defaultValue={profile.name || ''}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full bg-slate-50 dark:bg-black/40 border border-slate-300 dark:border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all micro-tactile min-h-[48px]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label 
                htmlFor="companyName"
                className="text-xs font-bold text-slate-700 dark:text-white/80 uppercase tracking-wider pl-0.5 block"
              >
                Company Name
              </label>
              <div className="relative">
                <Building className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/40" />
                <input 
                  id="companyName"
                  name="companyName"
                  type="text" 
                  required
                  defaultValue={profile.company.name}
                  placeholder="e.g. Acme Corp"
                  className="w-full bg-slate-50 dark:bg-black/40 border border-slate-300 dark:border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all micro-tactile min-h-[48px]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label 
                htmlFor="email"
                className="text-xs font-bold text-slate-700 dark:text-white/80 uppercase tracking-wider pl-0.5 block"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/40" />
                <input 
                  id="email"
                  type="email" 
                  disabled
                  defaultValue={profile.email}
                  className="w-full bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-500 dark:text-white/40 cursor-not-allowed font-mono min-h-[48px]"
                />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-white/50 pl-0.5">
                Authentication email is managed securely via Supabase.
              </p>
            </div>

            <div className="pt-4 flex justify-end border-t border-slate-200/80 dark:border-white/10">
              <button 
                type="submit"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/20 hover:shadow-lg transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 min-h-[48px] touch-target-48 w-full sm:w-auto"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </form>
        </div>

        {/* Supporting Bento Security & Info Card (Col-Span 1) */}
        <div className="space-y-4">
          <div className="bento-card p-6 space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200/80 dark:border-white/10 text-slate-900 dark:text-white font-bold text-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Account Security</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-white/50">Auth Status</span>
                <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Supabase Verified
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-white/50">User ID</span>
                <span className="font-mono text-slate-900 dark:text-white font-medium truncate max-w-[140px]">
                  {profile.id.slice(0, 12)}...
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-white/50">Member Since</span>
                <span className="text-slate-900 dark:text-white font-medium">
                  {new Date(profile.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <div className="bento-card p-5 bg-gradient-to-br from-blue-500/5 to-transparent">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 mb-1">
              <Key className="w-3.5 h-3.5" />
              <span>Data Protection</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-white/70 leading-relaxed">
              Candidate video streams are securely signed and delivered via WebRTC with end-to-end access controls.
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}
