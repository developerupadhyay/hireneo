import { createClient } from '@/utils/supabase/server'
import prisma from '@/utils/prisma'
import { redirect } from 'next/navigation'
import { Settings, Save, User } from 'lucide-react'
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
    <div className="p-8 md:p-12 max-w-4xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-white tracking-tight flex items-center gap-3">
          <Settings className="w-8 h-8 text-blue-400" />
          Settings
        </h1>
        <p className="text-white/50 mt-2 text-lg">Manage your personal and company profile.</p>
      </div>

      <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none"></div>
        
        <div className="flex items-center gap-4 mb-8 relative z-10">
          <div className="w-16 h-16 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 rounded-2xl border border-white/10 flex items-center justify-center text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.15)]">
            <User className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Profile Details</h2>
            <p className="text-white/50">Update how you and your company appear to candidates.</p>
          </div>
        </div>

        <form action={updateProfile} className="space-y-8 relative z-10">
          <div className="space-y-3">
            <label className="text-sm font-semibold text-white/80 uppercase tracking-wider pl-1">Your Name</label>
            <input 
              name="name"
              type="text" 
              required
              defaultValue={profile.name || ''}
              placeholder="e.g. John Doe"
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all hover:bg-white/[0.07]"
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-white/80 uppercase tracking-wider pl-1">Company Name</label>
            <input 
              name="companyName"
              type="text" 
              required
              defaultValue={profile.company.name}
              placeholder="e.g. Acme Corp"
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all hover:bg-white/[0.07]"
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-white/80 uppercase tracking-wider pl-1">Email Address</label>
            <input 
              type="email" 
              disabled
              defaultValue={profile.email}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-white/50 cursor-not-allowed"
            />
            <p className="text-xs text-white/40 pl-1">Email address cannot be changed currently.</p>
          </div>

          <div className="pt-6 flex justify-end border-t border-white/5">
            <button 
              type="submit"
              className="relative group inline-flex rounded-xl"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-40 group-hover:opacity-100 transition duration-500"></div>
              <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold px-8 py-4 rounded-xl flex items-center gap-3 shadow-xl hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all active:scale-95 border border-white/20">
                <Save className="w-5 h-5" />
                Save Changes
              </div>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
