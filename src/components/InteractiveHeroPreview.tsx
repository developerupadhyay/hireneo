'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, ThumbsUp, Star } from 'lucide-react'

export default function InteractiveHeroPreview() {
  const [activeTab, setActiveTab] = useState<'prompt' | 'record' | 'review'>('record')

  const tabs = [
    { id: 'prompt', label: '1. Recruiter Setup' },
    { id: 'record', label: '2. Candidate Take' },
    { id: 'review', label: '3. Team Evaluation' },
  ] as const

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Interactive Tabs Pill with Micro-Tactile styling */}
      <div className="flex items-center justify-center gap-2 mb-6">
        <div 
          role="tablist"
          aria-label="Interactive Preview Tabs"
          className="inline-flex p-1.5 rounded-2xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 micro-tactile"
        >
          {tabs.map((t) => {
            const isActive = activeTab === t.id
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(t.id)}
                className={`relative px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all min-h-[40px] touch-target-48 ${
                  isActive
                    ? 'text-white'
                    : 'text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeHeroTab"
                    className="absolute inset-0 bg-blue-600 rounded-xl shadow-xs"
                    transition={{ type: 'spring', duration: 0.35, bounce: 0.15 }}
                  />
                )}
                <span className="relative z-10">{t.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Main Bento Showcase Box */}
      <div className="bento-card p-5 sm:p-7 shadow-2xl overflow-hidden min-h-[400px] flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {/* TAB 1: Recruiter Setup */}
          {activeTab === 'prompt' && (
            <motion.div
              key="prompt"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-4 max-w-2xl mx-auto w-full"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-blue-50 dark:bg-blue-500/10 rounded-lg text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20">
                    <Sparkles className="w-4 h-4" />
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    Senior Frontend Engineer • Prompt #1
                  </span>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/40">
                  Live
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 micro-tactile">
                <label className="text-[11px] font-bold text-slate-500 dark:text-white/50 uppercase tracking-wider block mb-1">
                  Interview Question
                </label>
                <p className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white">
                  &ldquo;Describe how you diagnosed and resolved an unexpected production performance regression in a Next.js or React application.&rdquo;
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 text-center micro-tactile">
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-white/50 block mb-0.5">Think Time</span>
                  <span className="text-base font-bold text-slate-900 dark:text-white font-mono num-tabular">30s</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 text-center micro-tactile">
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-white/50 block mb-0.5">Answer Time</span>
                  <span className="text-base font-bold text-slate-900 dark:text-white font-mono num-tabular">2 mins</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 text-center micro-tactile">
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-white/50 block mb-0.5">Retakes</span>
                  <span className="text-base font-bold text-slate-900 dark:text-white">1 allowed</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: Candidate Live Take */}
          {activeTab === 'record' && (
            <motion.div
              key="record"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
                  <span className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider font-mono num-tabular">
                    Recording Live • 01:28 remaining
                  </span>
                </div>
                <span className="text-xs font-semibold text-slate-600 dark:text-white/60 bg-slate-100 dark:bg-white/10 px-2.5 py-1 rounded-md">
                  Applicant: Sarah J.
                </span>
              </div>

              {/* Viewport simulation */}
              <div className="relative aspect-video max-h-[260px] w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 dark:border-white/10 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 z-10"></div>
                <div className="text-center z-20 px-4">
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-semibold border border-white/20 mb-3">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                    HD Stream • WebRTC Encrypted
                  </span>
                  <p className="text-xs sm:text-sm font-medium text-white/95 max-w-md mx-auto line-clamp-2 italic">
                    &ldquo;...we isolated the main-thread bottleneck to unbounded list re-renders and applied virtual scrolling...&rdquo;
                  </p>
                </div>
                {/* Audio visualizer simulation */}
                <div className="absolute bottom-4 left-4 z-20 flex items-center gap-1">
                  {[35, 70, 50, 85, 60, 75, 45, 90, 65, 45].map((h, i) => (
                    <motion.div
                      key={i}
                      animate={{ height: [6, h / 3.5, 10, h / 4.5, 6] }}
                      transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.07 }}
                      className="w-1 bg-emerald-400 rounded-full"
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 3: Team Async Review */}
          {activeTab === 'review' && (
            <motion.div
              key="review"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-4 max-w-2xl mx-auto w-full"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-sm flex-shrink-0">
                    SJ
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">Sarah Jenkins</h4>
                    <p className="text-xs text-slate-500 dark:text-white/50">Frontend Lead Applicant</p>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/40">
                  <ThumbsUp className="w-3.5 h-3.5" />
                  Shortlisted
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 micro-tactile">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-white/50">
                    Evaluation Scorecard
                  </span>
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-amber-500" />
                    <Star className="w-3.5 h-3.5 fill-amber-500" />
                    <Star className="w-3.5 h-3.5 fill-amber-500" />
                    <Star className="w-3.5 h-3.5 fill-amber-500" />
                    <Star className="w-3.5 h-3.5 fill-amber-500" />
                    <span className="text-xs font-bold text-slate-900 dark:text-white ml-1 num-tabular font-mono">5.0 / 5</span>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-white/80 leading-relaxed italic">
                  &ldquo;Precise explanation of performance debugging, zero filler, directly answered within 90 seconds.&rdquo;
                </p>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-white/50 pt-1">
                <span className="num-tabular">3 of 3 answers completed</span>
                <span className="text-blue-600 dark:text-blue-400 font-semibold">
                  Ready for executive review →
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
