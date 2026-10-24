'use client'

import { useState } from 'react'
import { Clock, DollarSign, TrendingUp, Sparkles } from 'lucide-react'

export default function HiringRoiCalculator() {
  const [candidatesPerMonth, setCandidatesPerMonth] = useState(30)

  // Traditional phone screen takes 40 minutes (scheduling + call + notes)
  const traditionalHours = Math.round((candidatesPerMonth * 40) / 60)
  // Async review takes 8-10 minutes per candidate
  const hireneoHours = Math.round((candidatesPerMonth * 10) / 60)
  const hoursSaved = Math.max(1, traditionalHours - hireneoHours)
  // Average recruiter cost of $50/hr
  const dollarsSaved = hoursSaved * 50

  return (
    <div className="w-full max-w-4xl mx-auto bento-card p-6 sm:p-10 shadow-xl">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
          <TrendingUp className="w-3.5 h-3.5" />
          Interactive Telemetry Calculator
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          Calculate Your Time & Cost Savings
        </h2>
        <p className="text-slate-600 dark:text-white/60 text-xs sm:text-sm mt-1.5 max-w-lg mx-auto">
          Drag the slider to adjust your monthly candidate screening volume.
        </p>
      </div>

      {/* Tactile Slider Control */}
      <div className="max-w-xl mx-auto mb-10">
        <div className="flex items-center justify-between mb-3">
          <label 
            htmlFor="candidates-slider" 
            className="text-xs sm:text-sm font-bold text-slate-700 dark:text-white/80"
          >
            Candidates Screened / Month
          </label>
          <span className="text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400 font-mono num-tabular">
            {candidatesPerMonth}
          </span>
        </div>
        <div className="p-2 rounded-xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 micro-tactile">
          <input
            id="candidates-slider"
            type="range"
            min="5"
            max="120"
            step="5"
            value={candidatesPerMonth}
            onChange={(e) => setCandidatesPerMonth(parseInt(e.target.value))}
            className="w-full h-2.5 bg-slate-300 dark:bg-white/15 rounded-lg appearance-none cursor-pointer accent-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          />
        </div>
        <div className="flex justify-between text-[11px] text-slate-500 dark:text-white/40 mt-2 font-semibold">
          <span>5 candidates</span>
          <span>60 candidates</span>
          <span>120+ candidates</span>
        </div>
      </div>

      {/* Real-Time Metrics Result Bento Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 text-center micro-tactile">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-2 border border-blue-200 dark:border-blue-500/20">
            <Clock className="w-5 h-5" />
          </div>
          <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-mono num-tabular block">
            {hoursSaved}h
          </span>
          <span className="text-xs font-semibold text-slate-500 dark:text-white/50 uppercase tracking-wider mt-1 block">
            Hours Saved / Mo
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 text-center micro-tactile">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-2 border border-emerald-200 dark:border-emerald-500/20">
            <DollarSign className="w-5 h-5" />
          </div>
          <span className="text-3xl sm:text-4xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono num-tabular block">
            ${dollarsSaved.toLocaleString()}
          </span>
          <span className="text-xs font-semibold text-slate-500 dark:text-white/50 uppercase tracking-wider mt-1 block">
            Cost Saved / Mo
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 text-center micro-tactile">
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto mb-2 border border-purple-200 dark:border-purple-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-mono num-tabular block">
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
