'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { login, signup } from './actions'
import { LogIn, UserPlus, Building, Mail, Lock, User } from 'lucide-react'

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2029&auto=format&fit=crop')] bg-cover bg-center">
      {/* Glass overlay */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-0"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md p-8 rounded-3xl bg-surface/40 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-purple-600 mb-4 shadow-lg shadow-primary/30"
          >
            <div className="text-white font-bold text-2xl">H</div>
          </motion.div>
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
            Welcome to Hireneo
          </h2>
          <p className="text-text-muted mt-2">
            {isLogin ? "Sign in to manage your interviews" : "Create your recruiter account"}
          </p>
        </div>

        <div className="relative">
          <AnimatePresence mode="wait">
            {isLogin ? (
              <motion.form
                key="login"
                action={login}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80 pl-1">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <input
                      name="email"
                      type="email"
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      placeholder="name@company.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80 pl-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <input
                      name="password"
                      type="password"
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-blue-700 text-white font-semibold py-3 rounded-xl shadow-lg shadow-primary/25 transition-all active:scale-95 mt-6"
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
                className="space-y-4"
              >
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80 pl-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <input
                      name="name"
                      type="text"
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80 pl-1">Company Name</label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <input
                      name="company"
                      type="text"
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      placeholder="Acme Corp"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80 pl-1">Work Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <input
                      name="email"
                      type="email"
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      placeholder="name@company.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80 pl-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <input
                      name="password"
                      type="password"
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-primary-dark hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 rounded-xl shadow-lg shadow-purple-500/25 transition-all active:scale-95 mt-6"
                >
                  <UserPlus className="w-5 h-5" />
                  Create Account
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-white/60 hover:text-white text-sm transition-colors"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </motion.div>
    </div>
  )
}
