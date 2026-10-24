'use client'

import { useState } from 'react'
import { GripVertical, Pencil, Trash2, Check, X, Clock, Video, RotateCcw, AlertTriangle } from 'lucide-react'
import { updateQuestion, deleteQuestion } from '@/app/dashboard/positions/[id]/edit/actions'

interface Question {
  id: string
  positionId: string
  content: string
  thinkTime: number
  answerTime: number
  retakes: number
  order: number
}

interface QuestionListProps {
  questions: Question[]
  positionId: string
}

export default function QuestionList({ questions, positionId }: QuestionListProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Edit form state
  const [editContent, setEditContent] = useState('')
  const [editThinkTime, setEditThinkTime] = useState(30)
  const [editAnswerTime, setEditAnswerTime] = useState(120)
  const [editRetakes, setEditRetakes] = useState(0)

  const handleStartEdit = (q: Question) => {
    setEditingId(q.id)
    setEditContent(q.content)
    setEditThinkTime(q.thinkTime)
    setEditAnswerTime(q.answerTime)
    setEditRetakes(q.retakes)
    setDeleteConfirmId(null)
  }

  const handleCancelEdit = () => {
    setEditingId(null)
  }

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingId || !editContent.trim()) return

    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append('questionId', editingId)
      formData.append('positionId', positionId)
      formData.append('content', editContent.trim())
      formData.append('thinkTime', editThinkTime.toString())
      formData.append('answerTime', editAnswerTime.toString())
      formData.append('retakes', editRetakes.toString())

      await updateQuestion(formData)
      setEditingId(null)
    } catch (err) {
      console.error('Failed to update question:', err)
      alert('Failed to update question. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (questionId: string) => {
    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append('questionId', questionId)
      formData.append('positionId', positionId)

      await deleteQuestion(formData)
      setDeleteConfirmId(null)
    } catch (err) {
      console.error('Failed to delete question:', err)
      alert('Failed to delete question. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      {questions.map((q, index) => {
        const isEditing = editingId === q.id
        const isConfirmingDelete = deleteConfirmId === q.id

        if (isEditing) {
          return (
            <div 
              key={q.id}
              className="bg-white dark:bg-white/[0.04] border-2 border-blue-500/40 rounded-2xl p-6 shadow-xl transition-all"
            >
              <form onSubmit={handleSaveEdit} className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-white/10">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                    Editing Question {index + 1}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      disabled={isSubmitting}
                      className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg text-slate-600 dark:text-white/60 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center gap-1 text-xs px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm transition-all active:scale-[0.98] disabled:opacity-50"
                    >
                      <Check className="w-3.5 h-3.5" />
                      {isSubmitting ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-white/70">
                    Question Text
                  </label>
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    required
                    rows={3}
                    className="w-full bg-slate-50 dark:bg-black/50 border border-slate-300 dark:border-white/10 rounded-xl p-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all resize-none"
                    placeholder="Enter question text..."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-white/70">
                      Think Time
                    </label>
                    <select
                      value={editThinkTime}
                      onChange={(e) => setEditThinkTime(parseInt(e.target.value))}
                      className="w-full bg-slate-50 dark:bg-black/50 border border-slate-300 dark:border-white/10 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 cursor-pointer"
                    >
                      <option value="15" className="bg-white dark:bg-[#0a0a0a]">15 seconds</option>
                      <option value="30" className="bg-white dark:bg-[#0a0a0a]">30 seconds</option>
                      <option value="60" className="bg-white dark:bg-[#0a0a0a]">60 seconds</option>
                      <option value="120" className="bg-white dark:bg-[#0a0a0a]">2 minutes</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-white/70">
                      Answer Time
                    </label>
                    <select
                      value={editAnswerTime}
                      onChange={(e) => setEditAnswerTime(parseInt(e.target.value))}
                      className="w-full bg-slate-50 dark:bg-black/50 border border-slate-300 dark:border-white/10 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 cursor-pointer"
                    >
                      <option value="60" className="bg-white dark:bg-[#0a0a0a]">1 minute</option>
                      <option value="120" className="bg-white dark:bg-[#0a0a0a]">2 minutes</option>
                      <option value="180" className="bg-white dark:bg-[#0a0a0a]">3 minutes</option>
                      <option value="300" className="bg-white dark:bg-[#0a0a0a]">5 minutes</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-white/70">
                      Retakes Allowed
                    </label>
                    <select
                      value={editRetakes}
                      onChange={(e) => setEditRetakes(parseInt(e.target.value))}
                      className="w-full bg-slate-50 dark:bg-black/50 border border-slate-300 dark:border-white/10 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 cursor-pointer"
                    >
                      <option value="0" className="bg-white dark:bg-[#0a0a0a]">0 (No retakes)</option>
                      <option value="1" className="bg-white dark:bg-[#0a0a0a]">1 Retake</option>
                      <option value="2" className="bg-white dark:bg-[#0a0a0a]">2 Retakes</option>
                      <option value="999" className="bg-white dark:bg-[#0a0a0a]">Unlimited</option>
                    </select>
                  </div>
                </div>
              </form>
            </div>
          )
        }

        return (
          <div
            key={q.id}
            className="group relative bg-white dark:bg-white/[0.03] backdrop-blur-xl border border-slate-200 dark:border-white/10 p-5 sm:p-6 rounded-2xl shadow-sm hover:shadow-md dark:hover:bg-white/[0.05] transition-all flex flex-col sm:flex-row items-start gap-4"
          >
            <div className="hidden sm:flex mt-1 text-slate-400 dark:text-white/20 group-hover:text-slate-600 dark:group-hover:text-white/60 transition-colors">
              <GripVertical className="w-5 h-5" />
            </div>

            <div className="flex-1 min-w-0 w-full">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold px-2.5 py-1 rounded-md">
                    Q{index + 1}
                  </span>
                  <div className="flex flex-wrap gap-2 text-xs font-medium text-slate-600 dark:text-white/60">
                    <span className="inline-flex items-center gap-1 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 px-2.5 py-1 rounded-md">
                      <Clock className="w-3 h-3 text-slate-400 dark:text-white/40" />
                      Think: {q.thinkTime}s
                    </span>
                    <span className="inline-flex items-center gap-1 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 px-2.5 py-1 rounded-md">
                      <Video className="w-3 h-3 text-slate-400 dark:text-white/40" />
                      Answer: {q.answerTime}s
                    </span>
                    <span className="inline-flex items-center gap-1 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 px-2.5 py-1 rounded-md">
                      <RotateCcw className="w-3 h-3 text-slate-400 dark:text-white/40" />
                      Retakes: {q.retakes === 999 ? '∞' : q.retakes}
                    </span>
                  </div>
                </div>

                {/* Actions: Edit / Delete */}
                <div className="flex items-center gap-1 ml-auto">
                  {isConfirmingDelete ? (
                    <div className="flex items-center gap-1 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 p-1 rounded-lg">
                      <span className="text-xs text-rose-600 dark:text-rose-400 px-1 font-medium flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        Delete?
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDelete(q.id)}
                        disabled={isSubmitting}
                        className="px-2 py-0.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded transition-colors disabled:opacity-50"
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(null)}
                        disabled={isSubmitting}
                        className="px-2 py-0.5 bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-700 dark:text-white text-xs rounded transition-colors"
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => handleStartEdit(q)}
                        title="Edit question"
                        aria-label={`Edit Question ${index + 1}`}
                        className="p-1.5 rounded-lg text-slate-400 dark:text-white/40 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(q.id)}
                        title="Delete question"
                        aria-label={`Delete Question ${index + 1}`}
                        className="p-1.5 rounded-lg text-slate-400 dark:text-white/40 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              <p className="text-slate-900 dark:text-white/90 text-base leading-relaxed break-words">
                {q.content}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
