'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { login, signup } from './actions'
import { LogIn, UserPlus, Building, Mail, Lock, User, Video, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import ThemeSwitcher from '@/components/ThemeSwitcher'

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050505] text-slate-900 dark:text-white overflow-x-hidden font-sans flex flex-col selection:bg-blue-500/30 transition-colors duration-200">
      {/* Ambient Static Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40 dark:opacity-100">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[150px] mix-blend-screen"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[150px] mix-blend-screen"></div>
      </div>

      {/* Navbar */}
      <nav className="relative z-50 top-0 w-full border-b border-slate-200 dark:border-white/10 bg-white/80 dark:bg-black/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 border border-white/10 group-hover:scale-105 transition-transform">
              <Video className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              Hireneo
            </span>
          </Link>
          <div className="flex items-center gap-3 sm:gap-5">
            <ThemeSwitcher />
            <Link 
              href="/" 
              className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-white/70 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center relative z-10 py-12 sm:py-20 px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md relative group"
        >
          <div className="relative bg-white dark:bg-[#0a0a0a]/90 backdrop-blur-3xl p-8 sm:p-10 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xl dark:shadow-2xl overflow-hidden">
            <div className="text-center mb-8 relative z-10">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">
                {isLogin ? "Welcome back" : "Get started"}
              </h2>
              <p className="text-slate-500 dark:text-white/50 text-sm sm:text-base">
                {isLogin ? "Sign in to manage your interviews" : "Create your recruiter account"}
              </p>
            </div>

            <div className="relative z-10">
              <AnimatePresence mode="wait">
                {isLogin ? (
                  <motion.form
                    key="login"
                    action={login}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700 dark:text-white/80 pl-0.5">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-white/40" />
                        <input
                          name="email"
                          type="email"
                          required
                          className="w-full bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all"
                          placeholder="name@company.com"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700 dark:text-white/80 pl-0.5">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-white/40" />
                        <input
                          name="password"
                          type="password"
                          required
                          className="w-full bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl shadow-sm transition-all active:scale-[0.98] mt-6"
                    >
                      <LogIn className="w-4 h-4" />
                      Sign In
                    </button>
                  </motion.form>
                ) : (
                  <motion.form
                    key="signup"
                    action={signup}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700 dark:text-white/80 pl-0.5">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-white/40" />
                        <input
                          name="name"
                          type="text"
                          required
                          className="w-full bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all"
                          placeholder="John Doe"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700 dark:text-white/80 pl-0.5">Company Name</label>
                      <div className="relative">
                        <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-white/40" />
                        <input
                          name="company"
                          type="text"
                          required
                          className="w-full bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all"
                          placeholder="Acme Corp"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700 dark:text-white/80 pl-0.5">Work Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-white/40" />
                        <input
                          name="email"
                          type="email"
                          required
                          className="w-full bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all"
                          placeholder="name@company.com"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700 dark:text-white/80 pl-0.5">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-white/40" />
                        <input
                          name="password"
                          type="password"
                          required
                          className="w-full bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl shadow-sm transition-all active:scale-[0.98] mt-6"
                    >
                      <UserPlus className="w-4 h-4" />
                      Create Account
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>

            <div className="mt-8 text-center relative z-10 border-t border-slate-200 dark:border-white/10 pt-6">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-slate-500 dark:text-white/50 hover:text-blue-600 dark:hover:text-white text-xs sm:text-sm transition-colors font-medium flex items-center justify-center gap-1.5 mx-auto group"
              >
                <span>{isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-blue-600 dark:text-blue-400" />
              </button>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-white/10 bg-white/50 dark:bg-[#050505] py-6 px-4 sm:px-6 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-slate-500 dark:text-white/40">
          <div className="flex items-center gap-2">
            <Video className="w-4 h-4 text-blue-600" />
            <span className="font-bold text-slate-900 dark:text-white">Hireneo</span>
          </div>
          <p>© {new Date().getFullYear()} Hireneo. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
