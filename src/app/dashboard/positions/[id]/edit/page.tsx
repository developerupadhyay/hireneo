import { createClient } from '@/utils/supabase/server'
import prisma from '@/utils/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, GripVertical, Plus, MessageSquare } from 'lucide-react'
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
    <div className="p-8 max-w-6xl mx-auto flex gap-8">
      {/* Main Content: Questions List */}
      <div className="flex-1">
        <Link href="/dashboard/positions" className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Positions
        </Link>
        
        <h1 className="text-3xl font-bold text-white mb-2">{position.title}</h1>
        <p className="text-text-muted mb-8">{position.description}</p>

        <div className="space-y-4 mb-8">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            Interview Questions
          </h2>
          
          {position.questions.length === 0 ? (
            <div className="bg-surface/30 border border-white/5 p-8 rounded-2xl text-center">
              <p className="text-white/60">No questions added yet. Use the panel on the right to add some.</p>
            </div>
          ) : (
            position.questions.map((q, index) => (
              <div key={q.id} className="bg-surface/50 border border-white/10 p-5 rounded-2xl flex items-start gap-4 hover:border-white/20 transition-all">
                <div className="mt-1 cursor-grab text-white/20 hover:text-white/60">
                  <GripVertical className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-primary/20 text-primary text-xs font-bold px-2 py-1 rounded-md">Q{index + 1}</span>
                    <span className="text-sm text-text-muted flex gap-3">
                      <span>Think: {q.thinkTime}s</span>
                      <span>Answer: {q.answerTime}s</span>
                      <span>Retakes: {q.retakes}</span>
                    </span>
                  </div>
                  <p className="text-white text-lg">{q.content}</p>
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="bg-primary/10 border border-primary/20 p-6 rounded-2xl">
          <h3 className="text-lg font-medium text-white mb-2">
             Share this Interview
          </h3>
          <p className="text-sm text-text-muted mb-4">Copy this link and send it to candidates to complete the interview.</p>
          <CopyLinkButton link={`http://localhost:3000/interview/${position.id}`} />
        </div>
      </div>

      {/* Sidebar: Add Question Form */}
      <div className="w-80">
        <div className="bg-surface/50 backdrop-blur-md border border-white/10 p-6 rounded-2xl sticky top-8 shadow-2xl">
          <h3 className="text-lg font-semibold text-white mb-4">Add Question</h3>
          <form action={addQuestion} className="space-y-4">
            <input type="hidden" name="positionId" value={position.id} />
            
            <div className="space-y-2">
              <label className="text-xs font-medium text-white/60">Question Text</label>
              <textarea name="content" required rows={3} placeholder="e.g. Tell us about a time you..." className="w-full bg-black/20 border border-white/10 rounded-xl py-2 px-3 text-sm text-white focus:ring-1 focus:ring-primary/50 focus:border-primary/50 outline-none transition-all"></textarea>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-xs font-medium text-white/60">Think Time (s)</label>
                <select name="thinkTime" defaultValue="30" className="w-full bg-black/20 border border-white/10 rounded-xl py-2 px-3 text-sm text-white focus:outline-none appearance-none">
                  <option value="15" className="bg-surface">15s</option>
                  <option value="30" className="bg-surface">30s</option>
                  <option value="60" className="bg-surface">60s</option>
                  <option value="120" className="bg-surface">2m</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-white/60">Answer Time (s)</label>
                <select name="answerTime" defaultValue="120" className="w-full bg-black/20 border border-white/10 rounded-xl py-2 px-3 text-sm text-white focus:outline-none appearance-none">
                  <option value="60" className="bg-surface">1m</option>
                  <option value="120" className="bg-surface">2m</option>
                  <option value="180" className="bg-surface">3m</option>
                  <option value="300" className="bg-surface">5m</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-white/60">Retakes Allowed</label>
              <select name="retakes" defaultValue="0" className="w-full bg-black/20 border border-white/10 rounded-xl py-2 px-3 text-sm text-white focus:outline-none appearance-none">
                <option value="0" className="bg-surface">0 (No retakes)</option>
                <option value="1" className="bg-surface">1 Retake</option>
                <option value="2" className="bg-surface">2 Retakes</option>
                <option value="999" className="bg-surface">Unlimited</option>
              </select>
            </div>
            
            <button type="submit" className="w-full flex items-center justify-center gap-2 bg-white text-black font-semibold py-2.5 rounded-xl hover:bg-white/90 transition-all mt-4 active:scale-95">
              <Plus className="w-4 h-4" />
              Add Question
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
