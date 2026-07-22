/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { login, signup } from './actions'
import { LogIn, UserPlus, Building, Mail, Lock, User, Video, Sparkles, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden font-sans flex flex-col selection:bg-blue-500/30">
      {/* Ambient Static Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[150px] mix-blend-screen opacity-50"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[150px] mix-blend-screen opacity-40"></div>
      </div>

      {/* Navbar */}
      <nav className="relative z-50 top-0 w-full border-b border-white/5 bg-black/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 border border-white/10 group-hover:scale-105 transition-transform">
              <Video className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-white group-hover:text-blue-400 transition-colors">Hireneo</span>
          </Link>
          <div className="flex items-center gap-3 sm:gap-6">
             <Link href="/" className="text-xs sm:text-sm font-medium text-white/70 hover:text-white transition-colors">
              Back to Home
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center relative z-10 py-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md relative group"
        >
          {/* Glowing Border Wrapper */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/50 to-purple-600/50 rounded-[2.5rem] blur opacity-40 group-hover:opacity-70 transition duration-1000"></div>
          
          <div className="relative bg-[#0a0a0a]/90 backdrop-blur-3xl p-10 rounded-[2rem] border border-white/10 shadow-2xl overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] pointer-events-none"></div>
            
            <div className="text-center mb-10 relative z-10">
              <h2 className="text-4xl font-bold text-white tracking-tight mb-3">
                {isLogin ? "Welcome back" : "Get started"}
              </h2>
              <p className="text-white/50 text-lg">
                {isLogin ? "Sign in to manage your interviews" : "Create your free recruiter account"}
              </p>
            </div>

            <div className="relative z-10">
              <AnimatePresence mode="wait">
                {isLogin ? (
                  <motion.form
                    key="login"
                    action={login}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-5"
                  >
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white/80 pl-1">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                        <input
                          name="email"
                          type="email"
                          required
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all hover:bg-white/[0.07]"
                          placeholder="name@company.com"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white/80 pl-1">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                        <input
                          name="password"
                          type="password"
                          required
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all hover:bg-white/[0.07]"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all active:scale-95 mt-8 border border-white/10"
                    >
                      <LogIn className="w-5 h-5" />
                      Sign In
                    </button>
                  </motion.form>
                ) : (
                  <motion.form
                    key="signup"
                    action={signup}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-5"
                  >
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white/80 pl-1">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                        <input
                          name="name"
                          type="text"
                          required
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all hover:bg-white/[0.07]"
                          placeholder="John Doe"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white/80 pl-1">Company Name</label>
                      <div className="relative">
                        <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                        <input
                          name="company"
                          type="text"
                          required
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all hover:bg-white/[0.07]"
                          placeholder="Acme Corp"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white/80 pl-1">Work Email</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                        <input
                          name="email"
                          type="email"
                          required
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all hover:bg-white/[0.07]"
                          placeholder="name@company.com"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white/80 pl-1">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                        <input
                          name="password"
                          type="password"
                          required
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all hover:bg-white/[0.07]"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all active:scale-95 mt-8 border border-white/10"
                    >
                      <UserPlus className="w-5 h-5" />
                      Create Account
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>

            <div className="mt-8 text-center relative z-10 border-t border-white/10 pt-8">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-white/50 hover:text-white text-sm transition-colors font-medium flex items-center justify-center gap-2 mx-auto group"
              >
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-blue-400" />
              </button>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#050505] py-8 px-6 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity cursor-pointer">
            <Video className="w-5 h-5 text-white" />
            <span className="text-xl font-bold tracking-tight">Hireneo</span>
          </div>
          <p className="text-white/40 text-sm">© {new Date().getFullYear()} Hireneo. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
