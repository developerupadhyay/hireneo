'use client'

import { useState, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'
import { X, Check, Pencil, AlertCircle } from 'lucide-react'
import { updatePosition } from '@/app/dashboard/positions/actions'

const emptySubscribe = () => () => {}
const getMounted = () => true
const getServerMounted = () => false

interface EditPositionModalProps {
  position: {
    id: string
    title: string
    description?: string | null
  }
  trigger?: React.ReactNode
  onSuccess?: () => void
}

export default function EditPositionModal({ position, trigger, onSuccess }: EditPositionModalProps) {
  const isMounted = useSyncExternalStore(emptySubscribe, getMounted, getServerMounted)
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState(position.title)
  const [description, setDescription] = useState(position.description || '')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleOpen = () => {
    setTitle(position.title)
    setDescription(position.description || '')
    setError(null)
    setIsOpen(true)
  }

  const handleClose = () => {
    if (isSubmitting) return
    setIsOpen(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      setError('Title cannot be empty')
      return
    }

    setIsSubmitting(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append('id', position.id)
      formData.append('title', title.trim())
      formData.append('description', description.trim())

      await updatePosition(formData)
      setIsOpen(false)
      if (onSuccess) onSuccess()
    } catch (err: unknown) {
      console.error('Failed to update position:', err)
      const msg = err instanceof Error ? err.message : 'Failed to update position. Please try again.'
      setError(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {trigger ? (
        <button
          type="button"
          onClick={handleOpen}
          className="cursor-pointer bg-transparent border-0 p-0 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg min-h-[44px] touch-target-48"
        >
          {trigger}
        </button>
      ) : (
        <button
          type="button"
          onClick={handleOpen}
          aria-label="Edit position details"
          title="Edit position details"
          className="p-2 rounded-xl text-slate-700 dark:text-white/80 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 hover:text-blue-600 dark:hover:text-blue-400 border border-slate-200/80 dark:border-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 shadow-xs min-h-[44px] min-w-[44px] flex items-center justify-center touch-target-48"
        >
          <Pencil className="w-4 h-4" />
        </button>
      )}

      {isOpen && isMounted && createPortal(
        <div 
          onClick={(e) => {
            if (e.target === e.currentTarget) handleClose()
          }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 dark:bg-black/80 backdrop-blur-md animate-fadeIn"
        >
          <div 
            className="w-full max-w-lg bento-card bg-white dark:bg-[#0c111a] p-6 sm:p-8 shadow-2xl relative overflow-hidden z-10"
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-position-title"
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 dark:border-white/10 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-xl border border-blue-200 dark:border-blue-500/20 text-blue-600 dark:text-blue-400">
                  <Pencil className="w-4 h-4" />
                </div>
                <h3 id="edit-position-title" className="text-lg font-bold text-slate-900 dark:text-white">
                  Edit Position Details
                </h3>
              </div>
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="p-2 rounded-lg text-slate-400 dark:text-white/40 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors touch-target-48 min-h-[40px] min-w-[40px] flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-center gap-2 text-rose-600 dark:text-rose-400 text-xs font-medium">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label 
                  htmlFor="edit-pos-title"
                  className="text-xs font-bold text-slate-700 dark:text-white/80 uppercase tracking-wider pl-0.5 block"
                >
                  Position Title
                </label>
                <input
                  id="edit-pos-title"
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Senior Frontend Engineer"
                  className="w-full bg-slate-50 dark:bg-black/40 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 micro-tactile min-h-[48px] transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label 
                  htmlFor="edit-pos-desc"
                  className="text-xs font-bold text-slate-700 dark:text-white/80 uppercase tracking-wider pl-0.5 block"
                >
                  Description
                </label>
                <textarea
                  id="edit-pos-desc"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the role responsibilities and requirements..."
                  className="w-full bg-slate-50 dark:bg-black/40 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 micro-tactile transition-all resize-none"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-white/80 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/10 shadow-xs transition-all active:scale-[0.98] disabled:opacity-50 min-h-[44px] touch-target-48"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-blue-500/20 active:scale-[0.98] disabled:opacity-50 transition-all min-h-[44px] touch-target-48"
                >
                  <Check className="w-4 h-4" />
                  <span>{isSubmitting ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
