'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Video, Clock, Users, ArrowRight, ShieldCheck, Sparkles, ChevronDown } from 'lucide-react'
import ThemeSwitcher from '@/components/ThemeSwitcher'
import InteractiveHeroPreview from '@/components/InteractiveHeroPreview'
import HiringRoiCalculator from '@/components/HiringRoiCalculator'

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  const faqs = [
    {
      q: 'Do candidates need to install any app or extension?',
      a: 'No. Candidates simply open the interview link in any modern web browser (desktop, tablet, or mobile). Recordings are handled securely via browser WebRTC with zero downloads.',
    },
    {
      q: 'Can candidates re-record their video responses?',
      a: 'You have complete control! When creating a question, you can allow 0 retakes (single take), 1–2 retakes, or unlimited retakes based on how spontaneous you want the response to be.',
    },
    {
      q: 'How does HireNeo prevent candidates from reading scripted answers?',
      a: 'HireNeo uses strict Thinking Timers (e.g. 15s to 30s) where the question is revealed right before recording starts automatically. This tests authentic on-the-spot reasoning instead of pre-scripted answers.',
    },
    {
      q: 'How do hiring managers review candidate submissions?',
      a: 'Recruiters can review submissions directly in the HireNeo Candidates portal, assign ratings (1–5 stars), shortlist or reject candidates, and share timestamps with hiring teammates.',
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050505] text-slate-900 dark:text-white overflow-hidden font-sans selection:bg-blue-500/20 transition-colors duration-200">
      {/* Ambient background accents */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-500/10 dark:bg-blue-600/15 rounded-full blur-[140px] mix-blend-multiply dark:mix-blend-screen opacity-70"></div>
        <div className="absolute top-[35%] left-[-10%] w-[600px] h-[600px] bg-purple-500/10 dark:bg-purple-600/15 rounded-full blur-[140px] mix-blend-multiply dark:mix-blend-screen opacity-60"></div>
      </div>

      {/* Floating Glass Navbar */}
      <nav className="fixed w-full z-50 top-0 transition-all border-b border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-black/60 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-md shadow-blue-500/20 border border-white/10 group-hover:scale-105 transition-transform">
              <Video className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Hireneo
            </span>
          </Link>

          <div className="flex items-center gap-3 sm:gap-5">
            <ThemeSwitcher />
            <Link
              href="/login"
              className="hidden sm:block text-sm font-semibold text-slate-600 dark:text-white/70 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all active:scale-[0.98]"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Start Free</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="relative z-10 pt-28 sm:pt-36">
        {/* Hero Section */}
        <section className="relative px-4 sm:px-6 max-w-7xl mx-auto text-center pb-20 sm:pb-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-xs sm:text-sm font-semibold text-blue-700 dark:text-blue-400 mb-6 shadow-xs">
              <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
              <span>Next-Generation Asynchronous Video Screening</span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6 leading-[1.1] max-w-5xl mx-auto text-balance">
              Screen Candidates in Minutes.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                Zero Scheduling Chaos.
              </span>
            </h1>

            <p className="text-base sm:text-xl text-slate-600 dark:text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed text-pretty">
              Replace 45-minute repetitive screening calls with one-way video prompts. Set custom thinking timers, eliminate interview ghosting, and hire the top 5% effortlessly.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-16">
              <Link
                href="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-base shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
              >
                <span>Create Your First Interview</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#how-it-works"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-white font-semibold text-base border border-slate-200 dark:border-white/10 transition-colors"
              >
                See How It Works
              </a>
            </div>

            {/* Interactive Hero Preview Component */}
            <InteractiveHeroPreview />
          </motion.div>
        </section>

        {/* Value Proposition Glass Cards Grid */}
        <section className="py-20 sm:py-28 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-200/80 dark:border-white/10">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">
              Engineered for elite recruiting teams
            </h2>
            <p className="text-base sm:text-lg text-slate-500 dark:text-white/60 max-w-2xl mx-auto">
              Everything required to speed up your hiring pipeline without sacrificing candidate quality or experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/80 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/10 rounded-3xl p-8 backdrop-blur-2xl shadow-xs hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-6 border border-blue-500/20">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                Anti-Cheat Thinking Timers
              </h3>
              <p className="text-sm text-slate-600 dark:text-white/60 leading-relaxed">
                Questions are revealed right as the countdown begins. Candidates think on their feet, giving you spontaneous, genuine answers without pre-rehearsed scripts.
              </p>
            </div>

            <div className="bg-white/80 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/10 rounded-3xl p-8 backdrop-blur-2xl shadow-xs hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-6 border border-purple-500/20">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                Zero Calendar Friction
              </h3>
              <p className="text-sm text-slate-600 dark:text-white/60 leading-relaxed">
                Send a single interview link to 50+ applicants. Candidates complete the video assessment from their browser at their peak time, avoiding timezone nightmares.
              </p>
            </div>

            <div className="bg-white/80 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/10 rounded-3xl p-8 backdrop-blur-2xl shadow-xs hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-6 border border-emerald-500/20">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                Collaborative Evaluation
              </h3>
              <p className="text-sm text-slate-600 dark:text-white/60 leading-relaxed">
                Review candidate responses at 1.5x speed. Rate answers, shortlist promising candidates with 1 click, and share video dossiers with engineering and executive leads.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works 3-Step Walkthrough */}
        <section id="how-it-works" className="py-20 sm:py-28 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-200/80 dark:border-white/10">
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 px-3 py-1 rounded-md">
              Workflow
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mt-3 mb-4">
              How Hireneo accelerates hiring
            </h2>
            <p className="text-base sm:text-lg text-slate-500 dark:text-white/60 max-w-xl mx-auto">
              Three simple steps to transition from calendar chaos to streamlined video evaluations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-white/60 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/10 shadow-xs">
              <span className="text-4xl font-extrabold text-blue-600 dark:text-blue-400 font-mono mb-4 block">01</span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Create Position & Prompts</h3>
              <p className="text-sm text-slate-600 dark:text-white/60 leading-relaxed">
                Define the role, write your questions, and configure think times (e.g. 30s) and answer times (e.g. 2 mins). Your interview room is ready in under 60 seconds.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white/60 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/10 shadow-xs">
              <span className="text-4xl font-extrabold text-purple-600 dark:text-purple-400 font-mono mb-4 block">02</span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Share the Magic Link</h3>
              <p className="text-sm text-slate-600 dark:text-white/60 leading-relaxed">
                Send your unique interview link to applicants or embed it in your job posting. Candidates complete the interactive equipment check and record responses seamlessly.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white/60 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/10 shadow-xs">
              <span className="text-4xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono mb-4 block">03</span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Review & Shortlist</h3>
              <p className="text-sm text-slate-600 dark:text-white/60 leading-relaxed">
                Watch candidate recordings on your own schedule. Compare applicants side-by-side, make quick decisions, and invite top performers directly to final rounds.
              </p>
            </div>
          </div>
        </section>

        {/* Interactive ROI Calculator Section */}
        <section className="py-20 sm:py-28 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-200/80 dark:border-white/10">
          <HiringRoiCalculator />
        </section>

        {/* FAQ Accordion Section */}
        <section className="py-20 sm:py-28 px-4 sm:px-6 max-w-3xl mx-auto border-t border-slate-200/80 dark:border-white/10">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-3">
              Frequently Asked Questions
            </h2>
            <p className="text-sm sm:text-base text-slate-500 dark:text-white/50">
              Everything you need to know about setting up and conducting async video interviews.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-white/[0.02] overflow-hidden shadow-xs transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform duration-200 flex-shrink-0 ${
                        isOpen ? 'rotate-180 text-blue-600' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 dark:text-white/60 leading-relaxed border-t border-slate-100 dark:border-white/5 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>

        {/* High-Converting CTA Banner */}
        <section className="py-20 sm:py-28 px-4 sm:px-6 max-w-7xl mx-auto">
          <div className="rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 p-8 sm:p-14 text-center text-white shadow-2xl relative overflow-hidden">
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 text-balance">
                Ready to cut 80% of your screening time?
              </h2>
              <p className="text-blue-100 text-sm sm:text-lg mb-8 leading-relaxed">
                Join forward-thinking hiring teams screening candidates asynchronously with HireNeo. Start free today.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-blue-700 hover:bg-blue-50 font-bold text-sm sm:text-base shadow-lg transition-all active:scale-[0.98]"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-black/60 py-10 px-4 sm:px-6 relative z-10 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-slate-500 dark:text-white/40">
          <div className="flex items-center gap-2">
            <Video className="w-4 h-4 text-blue-600" />
            <span className="font-bold text-slate-900 dark:text-white">Hireneo</span>
          </div>
          <p>© {new Date().getFullYear()} Hireneo SaaS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
