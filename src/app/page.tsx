'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Video, Clock, Users, ArrowRight, Sparkles, ChevronDown, CheckCircle2, Laptop, Star } from 'lucide-react'
import InteractiveHeroPreview from '@/components/InteractiveHeroPreview'
import HiringRoiCalculator from '@/components/HiringRoiCalculator'
import ThemeSwitcher from '@/components/ThemeSwitcher'

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  const faqs = [
    {
      q: 'Do candidates need to install any app or extension?',
      a: 'No. Candidates simply open the interview link in any modern web browser (desktop, tablet, or mobile). Recordings are handled securely via browser WebRTC with zero downloads required.',
    },
    {
      q: 'Can candidates re-record their video responses?',
      a: 'You have complete control. When creating a question, you can allow 0 retakes (strict single take), 1–2 retakes, or unlimited retakes based on how spontaneous you want the response to be.',
    },
    {
      q: 'How does Hireneo prevent candidates from reading pre-scripted answers?',
      a: 'Hireneo uses automated Thinking Timers (e.g. 15s to 30s) where the question is revealed right before recording starts automatically. This tests authentic reasoning instead of rehearsed scripts.',
    },
    {
      q: 'How do hiring managers review candidate submissions?',
      a: 'Recruiters and hiring managers can review submissions in the Hireneo Candidates portal, shortlist or reject applicants with 1 click, and export candidate dossiers.',
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#06090e] text-slate-900 dark:text-white overflow-hidden font-sans selection:bg-blue-500/20 transition-colors duration-200">
      {/* Floating Glass Navbar strictly using Flat-Glass Minimalism */}
      <nav 
        className="fixed w-full z-50 top-0 glass-floating border-b border-slate-200/80 dark:border-white/10"
        aria-label="Main Navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Video className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Hireneo
            </span>
          </Link>

          <div className="flex items-center gap-3 sm:gap-4">
            <ThemeSwitcher />
            <Link
              href="/login"
              className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-white/80 hover:text-slate-900 dark:hover:text-white transition-colors px-2 py-1"
            >
              Sign In
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-blue-500/20 transition-all active:scale-[0.98] min-h-[40px] touch-target-48"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Start Free</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="relative z-10 pt-24 sm:pt-32">
        {/* Hero Section */}
        <section className="px-4 sm:px-6 max-w-7xl mx-auto text-center pb-16 sm:pb-24">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-xs sm:text-sm font-semibold text-blue-700 dark:text-blue-400 mb-6 shadow-xs">
              <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
              <span>Next-Generation Asynchronous Video Screening</span>
            </div>

            <h1 className="fluid-heading-display font-bold tracking-tight text-slate-900 dark:text-white mb-6 max-w-5xl mx-auto text-balance">
              Screen Candidates in Minutes.{' '}
              <span className="text-blue-600 dark:text-blue-400">
                Zero Scheduling Chaos.
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed text-pretty">
              Replace 45-minute repetitive screening calls with one-way video prompts. Calibrate thinking timers, eliminate interview ghosting, and hire top talent effortlessly.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-16">
              <Link
                href="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-base shadow-md hover:shadow-lg transition-all active:scale-[0.98] min-h-[48px] touch-target-48"
              >
                <span>Create Your First Interview</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#bento-grid"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-white dark:bg-white/[0.04] hover:bg-slate-100 dark:hover:bg-white/[0.08] text-slate-800 dark:text-white font-semibold text-base border border-slate-300 dark:border-white/10 transition-colors min-h-[48px] touch-target-48"
              >
                Explore Bento System
              </a>
            </div>

            {/* Interactive Hero Preview Component */}
            <InteractiveHeroPreview />
          </motion.div>
        </section>

        {/* Feature Showcase: Bento Grid Morphism */}
        <section id="bento-grid" className="py-20 sm:py-28 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-200/80 dark:border-white/10">
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 px-3 py-1 rounded-md">
              Bento Grid Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mt-3 mb-4">
              Engineered for elite recruiting velocity
            </h2>
            <p className="text-base sm:text-lg text-slate-600 dark:text-white/60 max-w-2xl mx-auto">
              Structured rectangular cards grouping telemetry, video streaming, and candidate evaluation into discrete interfaces.
            </p>
          </div>

          {/* Bento Grid: Multi-sized rectangular cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            
            {/* Bento Card 1: Anti-Cheat Thinking Timers (Span 2 on lg) */}
            <div className="bento-card p-7 sm:p-8 lg:col-span-2 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 flex-shrink-0">
                    <Clock className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20">
                    Proprietary Flow
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  Anti-Cheat Thinking Timers
                </h3>
                <p className="text-sm sm:text-base text-slate-600 dark:text-white/60 leading-relaxed mb-6">
                  Questions stay locked until the applicant initiates recording. A strict countdown (15s to 30s) begins immediately, capturing candid, authentic reasoning instead of pre-rehearsed answers.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 micro-tactile flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
                  <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-white">
                    Think Timer: 00:24 remaining
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                  Question Revealed Live
                </span>
              </div>
            </div>

            {/* Bento Card 2: Zero Calendar Friction (Span 1) */}
            <div className="bento-card p-7 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-500/20 w-fit mb-4">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  Zero Calendar Friction
                </h3>
                <p className="text-sm text-slate-600 dark:text-white/60 leading-relaxed mb-4">
                  Send a single link to 50+ applicants. Candidates complete their video assessment at their peak time without timezone scheduling back-and-forth.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200/80 dark:border-white/10 flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-white/50">
                <span>Timezone Agnostic</span>
                <span className="text-purple-600 dark:text-purple-400 font-mono">100% Async</span>
              </div>
            </div>

            {/* Bento Card 3: 100% In-Browser WebRTC (Span 1) */}
            <div className="bento-card p-7 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 w-fit mb-4">
                  <Laptop className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  Zero App Downloads
                </h3>
                <p className="text-sm text-slate-600 dark:text-white/60 leading-relaxed mb-4">
                  Candidates record directly in Chrome, Safari, Firefox, or Edge on iOS, Android, macOS, and Windows with automatic hardware checks.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>WebRTC Native Media</span>
              </div>
            </div>

            {/* Bento Card 4: Collaborative Scoring (Span 2 on lg) */}
            <div className="bento-card p-7 sm:p-8 lg:col-span-2 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20 flex-shrink-0">
                    <Star className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/40">
                    1-Click Decisions
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  Rapid Video Evaluation
                </h3>
                <p className="text-sm sm:text-base text-slate-600 dark:text-white/60 leading-relaxed mb-6">
                  Review applicant video answers with playback controls. Shortlist or reject candidates in a single click, and export data directly to CSV for ATS integration.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 micro-tactile">
                  <span className="text-xs font-semibold text-slate-500 dark:text-white/50 uppercase block">Screening Speed</span>
                  <span className="text-xl font-bold text-slate-900 dark:text-white font-mono mt-0.5 block">8 mins / applicant</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 micro-tactile">
                  <span className="text-xs font-semibold text-slate-500 dark:text-white/50 uppercase block">ATS Export</span>
                  <span className="text-xl font-bold text-blue-600 dark:text-blue-400 font-mono mt-0.5 block">1-Click CSV</span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Embedded Interactive ROI Calculator Bento Section */}
        <section className="py-20 sm:py-28 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-200/80 dark:border-white/10">
          <HiringRoiCalculator />
        </section>

        {/* 3-Step Walkthrough */}
        <section className="py-20 sm:py-28 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-200/80 dark:border-white/10">
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 px-3 py-1 rounded-md">
              Simple 3-Step Process
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mt-3 mb-4">
              How Hireneo simplifies hiring
            </h2>
            <p className="text-base sm:text-lg text-slate-600 dark:text-white/60 max-w-xl mx-auto">
              From creating role prompts to shortlisting top performers in under 15 minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bento-card p-7 sm:p-8 flex flex-col justify-between">
              <div>
                <span className="text-4xl font-extrabold text-blue-600 dark:text-blue-400 font-mono mb-4 block">01</span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Create Position & Questions</h3>
                <p className="text-sm text-slate-600 dark:text-white/60 leading-relaxed">
                  Define the role, write your questions or choose from curated templates, and calibrate think and answer timers.
                </p>
              </div>
            </div>

            <div className="bento-card p-7 sm:p-8 flex flex-col justify-between">
              <div>
                <span className="text-4xl font-extrabold text-purple-600 dark:text-purple-400 font-mono mb-4 block">02</span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Share the Magic Link</h3>
                <p className="text-sm text-slate-600 dark:text-white/60 leading-relaxed">
                  Send your interview URL to applicants. Candidates test their webcam and microphone and submit answers seamlessly.
                </p>
              </div>
            </div>

            <div className="bento-card p-7 sm:p-8 flex flex-col justify-between">
              <div>
                <span className="text-4xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono mb-4 block">03</span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Review & Shortlist</h3>
                <p className="text-sm text-slate-600 dark:text-white/60 leading-relaxed">
                  Watch candidate recordings whenever convenient. Compare answers side-by-side and invite top talent to final rounds.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 sm:py-28 px-4 sm:px-6 max-w-3xl mx-auto border-t border-slate-200/80 dark:border-white/10">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-3">
              Frequently Asked Questions
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-white/60">
              Everything you need to know about setting up and conducting async video interviews.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx
              return (
                <div
                  key={idx}
                  className="bento-card overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-colors min-h-[48px] touch-target-48"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform duration-200 flex-shrink-0 ${
                        isOpen ? 'rotate-180 text-blue-600 dark:text-blue-400' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 dark:text-white/70 leading-relaxed border-t border-slate-100 dark:border-white/5 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>

        {/* Call to Action Banner */}
        <section className="py-16 sm:py-24 px-4 sm:px-6 max-w-7xl mx-auto">
          <div className="bento-card bg-blue-600 text-white p-8 sm:p-14 text-center shadow-xl relative overflow-hidden">
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-balance">
                Cut 80% of your screening hours today.
              </h2>
              <p className="text-blue-100 text-sm sm:text-base md:text-lg mb-8 leading-relaxed">
                Join high-growth recruiting teams evaluating candidates asynchronously. Start free with zero credit card required.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white text-blue-700 hover:bg-blue-50 font-bold text-sm sm:text-base shadow-lg transition-all active:scale-[0.98] min-h-[48px] touch-target-48"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer using Flat-Glass Minimalism */}
      <footer className="border-t border-slate-200/80 dark:border-white/10 glass-floating py-8 px-4 sm:px-6 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-slate-500 dark:text-white/50">
          <div className="flex items-center gap-2">
            <Video className="w-4 h-4 text-blue-600" />
            <span className="font-bold text-slate-900 dark:text-white">Hireneo</span>
            <span>— Asynchronous Video Interviewing</span>
          </div>
          <p>© {new Date().getFullYear()} Hireneo. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
