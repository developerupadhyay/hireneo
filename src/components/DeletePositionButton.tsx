'use client'

import { useState, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'
import { Trash2, AlertTriangle } from 'lucide-react'
import { deletePosition } from '@/app/dashboard/positions/actions'
import { useRouter } from 'next/navigation'

const emptySubscribe = () => () => {}
const getMounted = () => true
const getServerMounted = () => false

interface DeletePositionButtonProps {
  positionId: string
  positionTitle: string
  redirectAfterDelete?: boolean
  className?: string
  variant?: 'icon' | 'button'
}

export default function DeletePositionButton({
  positionId,
  positionTitle,
  redirectAfterDelete = false,
  className = '',
  variant = 'icon',
}: DeletePositionButtonProps) {
  const isMounted = useSyncExternalStore(emptySubscribe, getMounted, getServerMounted)
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const formData = new FormData()
      formData.append('id', positionId)

      await deletePosition(formData)
      setIsOpen(false)
      if (redirectAfterDelete) {
        router.push('/dashboard/positions')
      }
    } catch (err) {
      console.error('Failed to delete position:', err)
      alert('Failed to delete position. Please try again.')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      {variant === 'button' ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-900/40 border border-rose-200 dark:border-rose-900/50 shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 min-h-[44px] touch-target-48 ${className}`}
        >
          <Trash2 className="w-4 h-4" />
          <span>Delete Position</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label={`Delete ${positionTitle}`}
          title="Delete position"
          className={`p-2 rounded-xl text-slate-600 dark:text-white/70 bg-slate-100 dark:bg-white/5 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:text-rose-600 dark:hover:text-rose-400 border border-slate-200/80 dark:border-white/10 hover:border-rose-200 dark:hover:border-rose-900/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 shadow-xs min-h-[44px] min-w-[44px] flex items-center justify-center touch-target-48 ${className}`}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}

      {isOpen && isMounted && createPortal(
        <div 
          onClick={(e) => {
            if (e.target === e.currentTarget && !isDeleting) setIsOpen(false)
          }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 dark:bg-black/80 backdrop-blur-md animate-fadeIn"
        >
          <div 
            className="w-full max-w-md bento-card bg-white dark:bg-[#0c111a] p-6 sm:p-8 shadow-2xl relative overflow-hidden z-10"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-dialog-title"
            aria-describedby="delete-dialog-desc"
          >
            <div className="flex items-start gap-4 mb-5">
              <div className="w-11 h-11 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/50 flex items-center justify-center text-rose-600 dark:text-rose-400 flex-shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 id="delete-dialog-title" className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                  Delete Position?
                </h3>
                <p id="delete-dialog-desc" className="text-slate-600 dark:text-white/60 text-xs sm:text-sm leading-relaxed">
                  Are you sure you want to permanently delete <strong className="text-slate-900 dark:text-white font-semibold">&ldquo;{positionTitle}&rdquo;</strong>?
                  All associated interview questions and candidate video submissions will also be deleted.
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                disabled={isDeleting}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-white/80 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/10 shadow-xs transition-all active:scale-[0.98] disabled:opacity-50 min-h-[44px] touch-target-48"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-rose-500/20 transition-all active:scale-[0.98] disabled:opacity-50 min-h-[44px] touch-target-48"
              >
                <Trash2 className="w-4 h-4" />
                <span>{isDeleting ? 'Deleting...' : 'Delete Position'}</span>
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
