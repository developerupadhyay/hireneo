'use client'

import { useState, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'
import { Sparkles, Plus, X, Check, BookOpen } from 'lucide-react'
import { addQuestion } from '@/app/dashboard/positions/[id]/edit/actions'

const emptySubscribe = () => () => {}
const getMounted = () => true
const getServerMounted = () => false

interface QuestionTemplatesModalProps {
  positionId: string
}

interface TemplateQuestion {
  category: string
  content: string
  thinkTime: number
  answerTime: number
  retakes: number
}

const TEMPLATES: TemplateQuestion[] = [
  // Software Engineering
  {
    category: 'Engineering',
    content: 'Walk us through an architectural challenge you solved recently. What trade-offs did you make, and what would you do differently today?',
    thinkTime: 30,
    answerTime: 180,
    retakes: 1,
  },
  {
    category: 'Engineering',
    content: 'Describe a situation where a critical bug or performance bottleneck slipped into production. How did you diagnose, isolate, and fix it?',
    thinkTime: 30,
    answerTime: 120,
    retakes: 1,
  },
  {
    category: 'Engineering',
    content: 'How do you approach code reviews to balance code quality, test coverage, and delivery velocity in your engineering team?',
    thinkTime: 30,
    answerTime: 120,
    retakes: 1,
  },

  // Product & Design
  {
    category: 'Product & Design',
    content: 'How do you decide what NOT to build when you have competing stakeholder feature requests and limited engineering bandwidth?',
    thinkTime: 30,
    answerTime: 180,
    retakes: 1,
  },
  {
    category: 'Product & Design',
    content: 'Tell us about a product feature that did not perform as expected post-launch. What quantitative metrics did you inspect, and what did you pivot?',
    thinkTime: 30,
    answerTime: 120,
    retakes: 1,
  },

  // Sales & Customer Success
  {
    category: 'Sales & Success',
    content: 'Walk us through your discovery process when speaking with a prospective client for the first time. How do you uncover their core pain points?',
    thinkTime: 30,
    answerTime: 120,
    retakes: 1,
  },
  {
    category: 'Sales & Success',
    content: 'Describe a time a customer was ready to churn or push back aggressively on pricing. How did you handle the objection and salvage the account?',
    thinkTime: 30,
    answerTime: 120,
    retakes: 1,
  },

  // Cultural Fit & Leadership
  {
    category: 'Culture & Leadership',
    content: 'Give a brief introduction of your career journey, the accomplishment you are proudest of, and why you are excited about this role.',
    thinkTime: 30,
    answerTime: 120,
    retakes: 2,
  },
  {
    category: 'Culture & Leadership',
    content: 'Tell us about a time you had a strong disagreement with a teammate or manager on an important decision. How did you resolve it professionally?',
    thinkTime: 30,
    answerTime: 120,
    retakes: 1,
  },
]

export default function QuestionTemplatesModal({ positionId }: QuestionTemplatesModalProps) {
  const isMounted = useSyncExternalStore(emptySubscribe, getMounted, getServerMounted)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [addingIndex, setAddingIndex] = useState<number | null>(null)
  const [addedSet, setAddedSet] = useState<Set<number>>(new Set())

  const categories = ['All', 'Engineering', 'Product & Design', 'Sales & Success', 'Culture & Leadership']

  const filteredTemplates = TEMPLATES.filter((t) => {
    if (selectedCategory === 'All') return true
    return t.category === selectedCategory
  })

  const handleAddTemplate = async (template: TemplateQuestion, index: number) => {
    setAddingIndex(index)
    try {
      const formData = new FormData()
      formData.append('positionId', positionId)
      formData.append('content', template.content)
      formData.append('thinkTime', template.thinkTime.toString())
      formData.append('answerTime', template.answerTime.toString())
      formData.append('retakes', template.retakes.toString())

      await addQuestion(formData)
      setAddedSet((prev) => new Set(prev).add(index))
    } catch (err) {
      console.error('Failed to add template question:', err)
      alert('Could not add template question. Please try again.')
    } finally {
      setAddingIndex(null)
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10 hover:bg-purple-100 dark:hover:bg-purple-500/20 border border-purple-200 dark:border-purple-500/20 shadow-xs transition-colors min-h-[44px] touch-target-48"
      >
        <BookOpen className="w-3.5 h-3.5" />
        <span>Question Library</span>
      </button>

      {isOpen && isMounted && createPortal(
        <div 
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false)
          }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 dark:bg-black/80 backdrop-blur-md animate-fadeIn"
        >
          <div
            className="w-full max-w-2xl bento-card bg-white dark:bg-[#0c111a] p-6 sm:p-8 shadow-2xl relative overflow-hidden max-h-[90vh] flex flex-col z-10"
            role="dialog"
            aria-modal="true"
            aria-labelledby="templates-title"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 dark:border-white/10 mb-5 flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-xl border border-purple-200 dark:border-purple-500/20">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 id="templates-title" className="text-lg font-bold text-slate-900 dark:text-white">
                    Question Library & Pre-Built Templates
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-white/50">
                    Add curated, proven interview prompts with pre-calibrated timers in 1 click.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg text-slate-400 dark:text-white/40 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors touch-target-48 min-h-[40px] min-w-[40px] flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-4 flex-shrink-0 text-xs font-semibold">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap min-h-[36px] touch-target-48 ${
                      isActive
                        ? 'bg-purple-600 text-white shadow-xs micro-tactile font-bold'
                        : 'text-slate-600 dark:text-white/60 hover:bg-slate-100 dark:hover:bg-white/10'
                    }`}
                  >
                    {cat}
                  </button>
                )
              })}
            </div>

            {/* Questions List */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {filteredTemplates.map((template, idx) => {
                const isAdding = addingIndex === idx
                const isAdded = addedSet.has(idx)

                return (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 px-2 py-0.5 rounded">
                          {template.category}
                        </span>
                        <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-500 dark:text-white/50 font-mono num-tabular">
                          <span>Think: {template.thinkTime}s</span>
                          <span>•</span>
                          <span>Answer: {template.answerTime}s</span>
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm font-medium text-slate-900 dark:text-white leading-relaxed">
                        {template.content}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAddTemplate(template, idx)}
                      disabled={isAdding || isAdded}
                      className={`flex-shrink-0 inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all active:scale-95 min-h-[40px] touch-target-48 ${
                        isAdded
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/40'
                          : 'bg-purple-600 hover:bg-purple-700 text-white shadow-xs'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Added</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>{isAdding ? 'Adding...' : 'Add to Role'}</span>
                        </>
                      )}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
