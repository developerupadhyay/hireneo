'use client'

import { useState } from 'react'
import { Clock, DollarSign, TrendingUp, Sparkles } from 'lucide-react'

export default function HiringRoiCalculator() {
  const [candidatesPerMonth, setCandidatesPerMonth] = useState(30)

  // Typical phone screen takes 40 minutes (scheduling + call + notes)
  const traditionalHours = Math.round((candidatesPerMonth * 40) / 60)
  // Async review takes 8-10 minutes per candidate
  const hireneoHours = Math.round((candidatesPerMonth * 10) / 60)
  const hoursSaved = Math.max(1, traditionalHours - hireneoHours)
  // Assuming average recruiter cost of $50/hr
  const dollarsSaved = hoursSaved * 50

  return (
    <div className="w-full max-w-4xl mx-auto bg-white/80 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/10 rounded-3xl p-6 sm:p-10 backdrop-blur-2xl shadow-xl dark:shadow-2xl">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
          <TrendingUp className="w-3.5 h-3.5" />
          Interactive ROI Calculator
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          Calculate how much time & budget you save
        </h2>
        <p className="text-slate-500 dark:text-white/50 text-sm sm:text-base mt-1.5">
          Drag the slider to match your monthly candidate screening volume.
        </p>
      </div>

      {/* Slider Control */}
      <div className="max-w-xl mx-auto mb-10">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs sm:text-sm font-bold text-slate-700 dark:text-white/80">
            Candidates Screened / Month
          </span>
          <span className="text-xl sm:text-2xl font-extrabold text-blue-600 dark:text-blue-400 font-mono">
            {candidatesPerMonth}
          </span>
        </div>
        <input
          type="range"
          min="5"
          max="120"
          step="5"
          value={candidatesPerMonth}
          onChange={(e) => setCandidatesPerMonth(parseInt(e.target.value))}
          className="w-full h-2.5 bg-slate-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <div className="flex justify-between text-[11px] text-slate-400 dark:text-white/30 mt-1 font-semibold">
          <span>5 candidates</span>
          <span>60 candidates</span>
          <span>120+ candidates</span>
        </div>
      </div>

      {/* Real-Time Metrics Result Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-center">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-2 border border-blue-500/20">
            <Clock className="w-5 h-5" />
          </div>
          <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-mono block">
            {hoursSaved}h
          </span>
          <span className="text-xs font-semibold text-slate-500 dark:text-white/50 uppercase tracking-wider mt-1 block">
            Recruiter Hours Saved / Mo
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-center">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-2 border border-emerald-500/20">
            <DollarSign className="w-5 h-5" />
          </div>
          <span className="text-3xl sm:text-4xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono block">
            ${dollarsSaved.toLocaleString()}
          </span>
          <span className="text-xs font-semibold text-slate-500 dark:text-white/50 uppercase tracking-wider mt-1 block">
            Estimated Cost Savings / Mo
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-center">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto mb-2 border border-purple-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-mono block">
            4.2x
          </span>
          <span className="text-xs font-semibold text-slate-500 dark:text-white/50 uppercase tracking-wider mt-1 block">
            Faster Time-to-Offer
          </span>
        </div>
      </div>
    </div>
  )
}
