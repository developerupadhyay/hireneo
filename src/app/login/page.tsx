'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { login, signup } from './actions'
import { LogIn, UserPlus, Building, Mail, Lock, User, Video, ArrowRight, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import ThemeSwitcher from '@/components/ThemeSwitcher'

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#06090e] text-slate-900 dark:text-white overflow-x-hidden font-sans flex flex-col selection:bg-blue-500/20 transition-colors duration-200">
      {/* Floating Glass Navbar */}
      <nav 
        className="relative z-50 top-0 w-full glass-floating border-b border-slate-200/80 dark:border-white/10"
        aria-label="Login Navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform flex-shrink-0">
              <Video className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Hireneo
            </span>
          </Link>
          <div className="flex items-center gap-3 sm:gap-4">
            <ThemeSwitcher />
            <Link 
              href="/" 
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 dark:text-white/70 hover:text-slate-900 dark:hover:text-white transition-colors min-h-[40px] touch-target-48 px-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center relative z-10 py-12 sm:py-20 px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full max-w-md relative"
        >
          {/* Main Bento Auth Card */}
          <div className="bento-card p-6 sm:p-10 shadow-xl overflow-hidden">
            <div className="text-center mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight mb-1.5">
                {isLogin ? "Welcome back" : "Create recruiter account"}
              </h1>
              <p className="text-slate-600 dark:text-white/60 text-xs sm:text-sm">
                {isLogin ? "Sign in to manage your interviews & candidates" : "Start screening candidates asynchronously today"}
              </p>
            </div>

            {/* Auth Mode Toggle Pill with Micro-Tactile states */}
            <div className="flex p-1 rounded-xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 mb-6 micro-tactile">
              <button
                type="button"
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all min-h-[40px] touch-target-48 ${
                  isLogin
                    ? 'bg-white dark:bg-[#0c111a] text-blue-600 dark:text-blue-400 shadow-xs font-bold'
                    : 'text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all min-h-[40px] touch-target-48 ${
                  !isLogin
                    ? 'bg-white dark:bg-[#0c111a] text-blue-600 dark:text-blue-400 shadow-xs font-bold'
                    : 'text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Sign Up
              </button>
            </div>

            <div>
              <AnimatePresence mode="wait">
                {isLogin ? (
                  <motion.form
                    key="login"
                    action={login}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 8 }}
                    transition={{ duration: 0.15 }}
                    className="space-y-4"
                  >
                    <div className="space-y-1.5">
                      <label 
                        htmlFor="login-email"
                        className="text-xs font-bold text-slate-700 dark:text-white/80 uppercase tracking-wider pl-0.5 block"
                      >
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-white/40" />
                        <input
                          id="login-email"
                          name="email"
                          type="email"
                          required
                          className="w-full bg-slate-50 dark:bg-black/40 border border-slate-300 dark:border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all micro-tactile min-h-[48px]"
                          placeholder="name@company.com"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label 
                        htmlFor="login-password"
                        className="text-xs font-bold text-slate-700 dark:text-white/80 uppercase tracking-wider pl-0.5 block"
                      >
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-white/40" />
                        <input
                          id="login-password"
                          name="password"
                          type="password"
                          required
                          className="w-full bg-slate-50 dark:bg-black/40 border border-slate-300 dark:border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all micro-tactile min-h-[48px]"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 px-4 rounded-xl shadow-md shadow-blue-500/20 hover:shadow-lg transition-all active:scale-[0.98] min-h-[48px] touch-target-48 mt-6"
                    >
                      <LogIn className="w-4 h-4" />
                      <span>Sign In</span>
                    </button>
                  </motion.form>
                ) : (
                  <motion.form
                    key="signup"
                    action={signup}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.15 }}
                    className="space-y-4"
                  >
                    <div className="space-y-1.5">
                      <label 
                        htmlFor="signup-name"
                        className="text-xs font-bold text-slate-700 dark:text-white/80 uppercase tracking-wider pl-0.5 block"
                      >
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-white/40" />
                        <input
                          id="signup-name"
                          name="name"
                          type="text"
                          required
                          className="w-full bg-slate-50 dark:bg-black/40 border border-slate-300 dark:border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all micro-tactile min-h-[48px]"
                          placeholder="Sarah Jenkins"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label 
                        htmlFor="signup-company"
                        className="text-xs font-bold text-slate-700 dark:text-white/80 uppercase tracking-wider pl-0.5 block"
                      >
                        Company Name
                      </label>
                      <div className="relative">
                        <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-white/40" />
                        <input
                          id="signup-company"
                          name="company"
                          type="text"
                          required
                          className="w-full bg-slate-50 dark:bg-black/40 border border-slate-300 dark:border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all micro-tactile min-h-[48px]"
                          placeholder="Acme Corp"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label 
                        htmlFor="signup-email"
                        className="text-xs font-bold text-slate-700 dark:text-white/80 uppercase tracking-wider pl-0.5 block"
                      >
                        Work Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-white/40" />
                        <input
                          id="signup-email"
                          name="email"
                          type="email"
                          required
                          className="w-full bg-slate-50 dark:bg-black/40 border border-slate-300 dark:border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all micro-tactile min-h-[48px]"
                          placeholder="sarah@company.com"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label 
                        htmlFor="signup-password"
                        className="text-xs font-bold text-slate-700 dark:text-white/80 uppercase tracking-wider pl-0.5 block"
                      >
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-white/40" />
                        <input
                          id="signup-password"
                          name="password"
                          type="password"
                          required
                          className="w-full bg-slate-50 dark:bg-black/40 border border-slate-300 dark:border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all micro-tactile min-h-[48px]"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 px-4 rounded-xl shadow-md shadow-blue-500/20 hover:shadow-lg transition-all active:scale-[0.98] min-h-[48px] touch-target-48 mt-6"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>Create Account</span>
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>

            <div className="mt-8 text-center border-t border-slate-200/80 dark:border-white/10 pt-5">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-slate-600 dark:text-white/60 hover:text-blue-600 dark:hover:text-blue-400 text-xs sm:text-sm transition-colors font-semibold flex items-center justify-center gap-1.5 mx-auto group min-h-[40px] touch-target-48"
              >
                <span>{isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-blue-600 dark:text-blue-400" />
              </button>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer using Flat-Glass Minimalism */}
      <footer className="border-t border-slate-200/80 dark:border-white/10 glass-floating py-6 px-4 sm:px-6 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-white/50">
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
