/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { createClient } from '@/utils/supabase/server'
import prisma from '@/utils/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, GripVertical, Plus, MessageSquare, Briefcase, HelpCircle } from 'lucide-react'
import { addQuestion } from './actions'
import CopyLinkButton from '@/components/CopyLinkButton'

export default async function InterviewBuilder({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { id } = await params

  const position = await prisma.position.findUnique({
    where: { id: id, profileId: user.id },
    include: { questions: { orderBy: { order: 'asc' } } }
  })

  if (!position) redirect('/dashboard/positions')

  return (
    <div className="p-8 md:p-12 max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 lg:gap-12">
      {/* Main Content: Questions List */}
      <div className="flex-1">
        <Link href="/dashboard/positions" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-8 font-medium group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Positions
        </Link>
        
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">{position.title}</h1>
          <p className="text-white/50 text-lg leading-relaxed">{position.description}</p>
        </div>

        <div className="space-y-6 mb-12">
          <div className="flex items-center gap-3 border-b border-white/5 pb-4">
            <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <MessageSquare className="w-5 h-5 text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Interview Questions</h2>
          </div>
          
          {position.questions.length === 0 ? (
            <div className="bg-white/[0.02] backdrop-blur-xl border border-white/5 p-12 rounded-[2rem] text-center shadow-2xl relative overflow-hidden">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-blue-600/5 rounded-full blur-[60px] pointer-events-none"></div>
              <HelpCircle className="w-12 h-12 text-white/20 mx-auto mb-4 relative z-10" />
              <p className="text-white/60 text-lg relative z-10">No questions added yet. Use the panel to add some.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {position.questions.map((q: any, index: number) => (
                <div key={q.id} className="bg-white/[0.02] backdrop-blur-xl border border-white/5 p-6 rounded-[1.5rem] flex items-start gap-4 hover:border-white/10 hover:bg-white/[0.04] transition-all group">
                  <div className="mt-1 cursor-grab text-white/20 hover:text-white/80 transition-colors">
                    <GripVertical className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <span className="bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold px-2.5 py-1 rounded-md">Q{index + 1}</span>
                      <div className="flex gap-4 text-xs font-medium text-white/40">
                        <span className="bg-white/5 px-2 py-1 rounded-md">Think: {q.thinkTime}s</span>
                        <span className="bg-white/5 px-2 py-1 rounded-md">Answer: {q.answerTime}s</span>
                        <span className="bg-white/5 px-2 py-1 rounded-md">Retakes: {q.retakes === 999 ? '∞' : q.retakes}</span>
                      </div>
                    </div>
                    <p className="text-white/90 text-lg leading-relaxed">{q.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/20 p-8 rounded-[2rem] relative overflow-hidden group">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="relative z-10">
            <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              Share this Interview
            </h3>
            <p className="text-white/60 mb-6 text-lg">Copy this link and send it to candidates to complete the interview asynchronously.</p>
            <CopyLinkButton link={`http://localhost:3000/interview/${position.id}`} />
          </div>
        </div>
      </div>

      {/* Sidebar: Add Question Form */}
      <div className="w-full lg:w-96">
        <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/5 p-8 rounded-[2rem] sticky top-8 shadow-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-[50px] pointer-events-none"></div>
          
          <h3 className="text-xl font-bold text-white mb-6 relative z-10 flex items-center gap-2">
            <Plus className="w-5 h-5 text-blue-400" />
            Add Question
          </h3>
          
          <form action={addQuestion} className="space-y-6 relative z-10">
            <input type="hidden" name="positionId" value={position.id} />
            
            <div className="space-y-2.5">
              <label className="text-xs font-semibold text-white/70 uppercase tracking-wider pl-1">Question Text</label>
              <textarea name="content" required rows={4} placeholder="e.g. Tell us about a time you..." className="w-full bg-black/40 border border-white/10 rounded-2xl py-3 px-4 text-sm text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all placeholder:text-white/30 hover:bg-black/60"></textarea>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2.5">
                <label className="text-xs font-semibold text-white/70 uppercase tracking-wider pl-1">Think Time (s)</label>
                <select name="thinkTime" defaultValue="30" className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none hover:bg-black/60 transition-all cursor-pointer">
                  <option value="15" className="bg-[#050505]">15s</option>
                  <option value="30" className="bg-[#050505]">30s</option>
                  <option value="60" className="bg-[#050505]">60s</option>
                  <option value="120" className="bg-[#050505]">2m</option>
                </select>
              </div>
              <div className="space-y-2.5">
                <label className="text-xs font-semibold text-white/70 uppercase tracking-wider pl-1">Answer Time (s)</label>
                <select name="answerTime" defaultValue="120" className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none hover:bg-black/60 transition-all cursor-pointer">
                  <option value="60" className="bg-[#050505]">1m</option>
                  <option value="120" className="bg-[#050505]">2m</option>
                  <option value="180" className="bg-[#050505]">3m</option>
                  <option value="300" className="bg-[#050505]">5m</option>
                </select>
              </div>
            </div>

            <div className="space-y-2.5">
              <label className="text-xs font-semibold text-white/70 uppercase tracking-wider pl-1">Retakes Allowed</label>
              <select name="retakes" defaultValue="0" className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none hover:bg-black/60 transition-all cursor-pointer">
                <option value="0" className="bg-[#050505]">0 (No retakes)</option>
                <option value="1" className="bg-[#050505]">1 Retake</option>
                <option value="2" className="bg-[#050505]">2 Retakes</option>
                <option value="999" className="bg-[#050505]">Unlimited</option>
              </select>
            </div>
            
            <button type="submit" className="relative group inline-flex rounded-xl w-full mt-4">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-40 group-hover:opacity-100 transition duration-500"></div>
              <div className="relative w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold px-6 py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-xl hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all active:scale-95 border border-white/20">
                <Plus className="w-5 h-5" />
                Add Question
              </div>
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
