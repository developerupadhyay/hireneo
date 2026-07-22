'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Video, Clock, Users, ArrowRight, MonitorPlay, Zap, Shield, Sparkles } from 'lucide-react'

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], [0, 300])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-hidden selection:bg-blue-500/30 font-sans">
      {/* Dynamic Mouse Gradient Orb */}
      <motion.div 
        className="fixed top-0 left-0 w-[600px] h-[600px] rounded-full bg-blue-600/20 blur-[150px] pointer-events-none z-0 mix-blend-screen"
        animate={{
          x: mousePosition.x - 300,
          y: mousePosition.y - 300,
        }}
        transition={{ type: "tween", ease: "backOut", duration: 0.5 }}
      />
      
      {/* Ambient Static Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] mix-blend-screen opacity-60"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[150px] mix-blend-screen opacity-50"></div>
      </div>

      {/* Navbar */}
      <nav className="fixed w-full z-50 top-0 transition-all duration-300 border-b border-white/5 bg-black/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 border border-white/10">
              <Video className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-white">Hireneo</span>
          </div>
          <div className="flex items-center gap-3 sm:gap-6">
            <Link href="/login" className="hidden sm:block text-sm font-medium text-white/70 hover:text-white transition-colors">
              Log in
            </Link>
            <Link href="/login" className="relative group text-xs sm:text-sm font-medium overflow-hidden rounded-full">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-80 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative px-4 py-2 sm:px-6 sm:py-2.5 bg-black/50 group-hover:bg-black/20 backdrop-blur-md rounded-full border border-white/20 transition-all text-white flex items-center gap-1.5 sm:gap-2 shadow-xl shadow-blue-500/20">
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-purple-300" />
                <span>Get Started<span className="hidden sm:inline"> Free</span></span>
              </div>
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative z-10 pt-24 sm:pt-32">
        {/* Hero Section */}
        <section className="relative pb-20 sm:pb-32 px-4 sm:px-6 max-w-7xl mx-auto text-center mt-6 sm:mt-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/5 border border-white/10 text-xs sm:text-sm font-medium text-blue-400 mb-6 sm:mb-8 backdrop-blur-md shadow-2xl shadow-blue-500/10"
            >
              <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
              The future of hiring is asynchronous
            </motion.div>
            
            <h1 className="text-5xl md:text-8xl font-extrabold tracking-tighter mb-8 leading-[1.1]">
              Screen candidates <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400">
                10x faster with video.
              </span>
            </h1>
            
            <p className="text-xl text-white/60 max-w-2xl mx-auto mb-12 leading-relaxed">
              Replace initial phone screens with one-way video interviews. Save hundreds of hours, evaluate better, and hire the right people faster without the scheduling nightmare.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link href="/login" className="w-full sm:w-auto relative group rounded-full">
                 <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-60 group-hover:opacity-100 transition duration-500"></div>
                 <div className="relative bg-[#050505] px-8 py-4 rounded-full font-semibold text-lg flex items-center justify-center gap-2 border border-white/10 group-hover:border-white/20 transition-all shadow-2xl shadow-blue-500/20">
                    Start for free
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform text-blue-400" />
                 </div>
              </Link>
              <a href="#how-it-works" className="w-full sm:w-auto px-8 py-4 rounded-full font-semibold text-lg text-white/80 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 transition-all flex items-center justify-center gap-2">
                See how it works
              </a>
            </div>
          </motion.div>

          {/* Floating UI Elements Showcase */}
          <motion.div 
            style={{ y }}
            className="mt-28 relative max-w-5xl mx-auto h-[400px] md:h-[600px] w-full"
          >
            {/* Main Center Video Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, rotateX: 20 }}
              animate={{ opacity: 1, scale: 1, rotateX: 0 }}
              transition={{ duration: 1.2, delay: 0.4, type: "spring", bounce: 0.4 }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl rounded-3xl border border-white/10 bg-black/40 p-2 backdrop-blur-2xl shadow-[0_0_50px_rgba(59,130,246,0.15)] overflow-hidden z-10"
            >
              <div className="rounded-2xl overflow-hidden border border-white/5 bg-[#0a0a0a] aspect-[16/9] relative group">
                 <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1573164713988-8665fc963095?q=50&w=800&auto=format&fit=crop')] bg-cover bg-center transition-transform duration-700 group-hover:scale-105"></div>
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                 <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                    <div>
                       <h3 className="text-2xl font-bold text-white mb-1">Sarah Jenkins</h3>
                       <p className="text-white/60">Frontend Developer Role</p>
                    </div>
                    <div className="w-16 h-16 bg-blue-600/30 backdrop-blur-xl rounded-full flex items-center justify-center border border-blue-500/50 cursor-pointer hover:bg-blue-600/50 transition-colors shadow-lg shadow-blue-500/20">
                       <MonitorPlay className="w-8 h-8 text-white ml-1" />
                    </div>
                 </div>
              </div>
            </motion.div>

            {/* Floating Cards */}
            <motion.div 
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-[10%] left-[-5%] md:left-[5%] z-20 w-64 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-2xl p-4 shadow-2xl shadow-emerald-500/10"
            >
               <div className="flex items-center gap-3 mb-3">
                 <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 border border-emerald-500/30">
                   <Zap className="w-5 h-5" />
                 </div>
                 <div>
                   <p className="font-semibold text-sm">Response Received</p>
                   <p className="text-xs text-white/50">Just now</p>
                 </div>
               </div>
               <div className="h-2 bg-white/5 rounded-full w-full overflow-hidden">
                 <div className="h-full bg-emerald-500 w-3/4"></div>
               </div>
            </motion.div>

            <motion.div 
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-[10%] right-[-5%] md:right-[5%] z-20 w-64 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-2xl p-4 shadow-2xl shadow-purple-500/10"
            >
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 border border-purple-500/30">
                   <Shield className="w-5 h-5" />
                 </div>
                 <div>
                   <p className="font-semibold text-sm">No Cheating Detected</p>
                   <p className="text-xs text-white/50">Tab switching disabled</p>
                 </div>
               </div>
            </motion.div>
          </motion.div>
        </section>

        {/* Social Proof */}
        <section className="py-12 border-y border-white/5 bg-white/[0.01] relative z-10 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <p className="text-center text-sm font-semibold text-white/40 uppercase tracking-widest mb-8">Trusted by forward-thinking teams</p>
            <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
              {['ACME Corp', 'GlobalTech', 'Quantum', 'Nexus', 'Zephyr'].map((company, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-white/20"></div>
                  <span className="font-bold text-2xl tracking-tighter text-white">{company}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-32 px-6 relative z-10">
          <div className="absolute inset-0 bg-white/[0.02] border-y border-white/5"></div>
          <div className="max-w-7xl mx-auto relative">
            <div className="text-center mb-24">
              <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Built for lean hiring teams</h2>
              <p className="text-xl text-white/50 max-w-2xl mx-auto">Everything you need to scale your screening process, beautifully designed and ridiculously simple to use.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Video className="w-6 h-6 text-blue-400" />,
                  title: "One-Way Video",
                  desc: "Candidates record answers on their own time. You review them on yours."
                },
                {
                  icon: <Clock className="w-6 h-6 text-purple-400" />,
                  title: "Custom Time Limits",
                  desc: "Set strict think times and answer durations for every single question."
                },
                {
                  icon: <Users className="w-6 h-6 text-emerald-400" />,
                  title: "No-Friction Experience",
                  desc: "Candidates don't need to download apps or create accounts to participate."
                }
              ].map((feature, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.7, delay: i * 0.15 }}
                  className="group relative bg-white/[0.03] border border-white/5 p-10 rounded-[2rem] hover:bg-white/[0.05] transition-all duration-500 hover:border-white/10 hover:shadow-2xl hover:shadow-blue-500/5 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                    <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-8 border border-white/10 group-hover:scale-110 transition-transform duration-500">
                      {feature.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                    <p className="text-white/50 leading-relaxed text-lg">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section id="how-it-works" className="py-32 px-6 max-w-7xl mx-auto relative">
          <div className="text-center mb-32">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">How Hireneo works</h2>
            <p className="text-xl text-white/50 max-w-2xl mx-auto">Three simple steps to transform your recruitment process.</p>
          </div>

          <div className="space-y-40">
            {/* Step 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="flex flex-col md:flex-row items-center gap-16"
            >
              <div className="flex-1">
                <span className="inline-block py-1 px-3 rounded-full bg-blue-500/10 text-blue-400 font-bold text-sm tracking-wider uppercase mb-6 border border-blue-500/20">Step 01</span>
                <h3 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">Create the Interview</h3>
                <p className="text-xl text-white/50 leading-relaxed mb-8">Add your questions, define how much time candidates have to think, and how long they have to answer. Hit save and your custom interview room is instantly ready.</p>
              </div>
              <div className="flex-1 w-full relative group perspective-1000">
                {/* Gradient Border Wrapper */}
                <div className="rounded-[2rem] p-[1px] bg-gradient-to-br from-blue-500/40 via-purple-500/10 to-transparent shadow-2xl shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-shadow duration-700">
                  <div className="aspect-[4/3] rounded-[2rem] bg-[#0a0a0a] overflow-hidden relative p-8 flex flex-col gap-4 group-hover:rotate-y-2 transition-transform duration-700">
                    {/* Mockup UI: Question Builder */}
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                      <div className="font-bold text-lg text-white">Frontend Developer Screen</div>
                      <div className="px-4 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg">Save Changes</div>
                    </div>
                    <div className="space-y-3">
                      {[1, 2].map((q) => (
                        <div key={q} className="bg-white/5 border border-white/10 rounded-xl p-4">
                          <div className="text-sm text-white/80 font-medium mb-3">Tell us about a time you optimized a React application.</div>
                          <div className="flex gap-2">
                            <span className="text-[10px] uppercase tracking-wider bg-white/10 px-2 py-1 rounded text-white/50">Think: 30s</span>
                            <span className="text-[10px] uppercase tracking-wider bg-white/10 px-2 py-1 rounded text-white/50">Answer: 120s</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Step 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="flex flex-col md:flex-row-reverse items-center gap-16"
            >
              <div className="flex-1">
                <span className="inline-block py-1 px-3 rounded-full bg-purple-500/10 text-purple-400 font-bold text-sm tracking-wider uppercase mb-6 border border-purple-500/20">Step 02</span>
                <h3 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">Share the Link</h3>
                <p className="text-xl text-white/50 leading-relaxed mb-8">Send the unique interview link to your candidates. They can record their answers from any device, anywhere in the world, straight from their browser.</p>
              </div>
              <div className="flex-1 w-full relative group perspective-1000">
                <div className="rounded-[2rem] p-[1px] bg-gradient-to-bl from-purple-500/40 via-pink-500/10 to-transparent shadow-2xl shadow-purple-500/20 group-hover:shadow-purple-500/40 transition-shadow duration-700">
                  <div className="aspect-[4/3] rounded-[2rem] bg-[#0a0a0a] overflow-hidden relative p-8 group-hover:-rotate-y-2 transition-transform duration-700 flex items-center justify-center">
                    {/* Mockup UI: Candidate Recording */}
                    <div className="absolute inset-4 rounded-2xl bg-gradient-to-tr from-surface to-[#111] border border-white/5 overflow-hidden flex flex-col">
                      <div className="p-6 text-center z-10 bg-gradient-to-b from-black/80 to-transparent">
                        <h4 className="text-lg font-bold text-white">Question 1 of 5</h4>
                        <p className="text-sm text-white/60 mt-2 max-w-[80%] mx-auto">Why do you want to join our engineering team?</p>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-full h-full opacity-30 bg-[url('https://images.unsplash.com/photo-1573164713988-8665fc963095?q=50&w=400&auto=format&fit=crop')] bg-cover bg-center"></div>
                      </div>
                      <div className="mt-auto p-6 z-10 flex justify-center">
                        <div className="flex items-center gap-4 bg-black/60 backdrop-blur-md px-6 py-3 rounded-full border border-white/10">
                          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                          <span className="font-mono text-sm">01:24</span>
                          <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center ml-4 border-2 border-red-400/50">
                            <div className="w-3 h-3 bg-white rounded-sm"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Step 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="flex flex-col md:flex-row items-center gap-16"
            >
              <div className="flex-1">
                <span className="inline-block py-1 px-3 rounded-full bg-emerald-500/10 text-emerald-400 font-bold text-sm tracking-wider uppercase mb-6 border border-emerald-500/20">Step 03</span>
                <h3 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">Review & Hire</h3>
                <p className="text-xl text-white/50 leading-relaxed mb-8">Watch the recorded video responses in your centralized dashboard. Compare candidates side-by-side, leave notes, and make faster, better hiring decisions.</p>
              </div>
              <div className="flex-1 w-full relative group perspective-1000">
                <div className="rounded-[2rem] p-[1px] bg-gradient-to-br from-emerald-500/40 via-blue-500/10 to-transparent shadow-2xl shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-shadow duration-700">
                  <div className="aspect-[4/3] rounded-[2rem] bg-[#0a0a0a] overflow-hidden relative p-8 group-hover:rotate-y-2 transition-transform duration-700">
                    {/* Mockup UI: Dashboard Review */}
                    <div className="grid grid-cols-2 gap-4 h-full">
                      {[1, 2, 3, 4].map((c) => (
                        <div key={c} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden relative group/card">
                          <div className="absolute inset-0 bg-blue-500/20 opacity-0 group-hover/card:opacity-100 transition-opacity"></div>
                          <div className="h-2/3 bg-surface relative">
                             {c === 1 && <div className="absolute inset-0 opacity-60 bg-[url('https://images.unsplash.com/photo-1573164713988-8665fc963095?q=50&w=150&auto=format&fit=crop')] bg-cover bg-center"></div>}
                             {c === 2 && <div className="absolute inset-0 opacity-60 bg-[url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=50&w=150&auto=format&fit=crop')] bg-cover bg-center"></div>}
                             {c === 3 && <div className="absolute inset-0 opacity-60 bg-[url('https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=50&w=150&auto=format&fit=crop')] bg-cover bg-center"></div>}
                             {c === 4 && <div className="absolute inset-0 opacity-60 bg-[url('https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=50&w=150&auto=format&fit=crop')] bg-cover bg-center"></div>}
                             <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-8 h-8 rounded-full bg-black/50 backdrop-blur border border-white/20 flex items-center justify-center">
                                   <MonitorPlay className="w-4 h-4 text-white ml-0.5" />
                                </div>
                             </div>
                          </div>
                          <div className="h-1/3 p-3 flex flex-col justify-center">
                            <div className="h-2 bg-white/20 rounded w-1/2 mb-2"></div>
                            <div className="h-1.5 bg-white/10 rounded w-1/3"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-32 px-6 relative z-10 bg-black/40 border-y border-white/5">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-24">
              <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Loved by hiring teams</h2>
              <p className="text-xl text-white/50 max-w-2xl mx-auto">See how companies are saving hundreds of hours on initial screening.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  quote: "Hireneo completely eliminated our scheduling conflicts. We now review 50 candidates in the time it used to take to do 5 phone screens.",
                  author: "Emily Chen",
                  role: "Head of Talent at Nexus"
                },
                {
                  quote: "The candidate experience is seamless. No apps to download, and they can record when they are most comfortable. Highly recommended.",
                  author: "Marcus Johnson",
                  role: "Engineering Manager at GlobalTech"
                },
                {
                  quote: "We've reduced our time-to-hire by 14 days simply by replacing round-one calls with one-way video interviews.",
                  author: "Sarah Jenkins",
                  role: "VP of People at ACME Corp"
                }
              ].map((testimonial, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.7, delay: i * 0.15 }}
                  className="bg-white/[0.03] border border-white/5 p-10 rounded-[2rem] hover:bg-white/[0.05] transition-colors relative"
                >
                  <div className="text-blue-500 mb-6 text-6xl opacity-20 font-serif absolute top-6 left-6">"</div>
                  <p className="text-lg text-white/80 leading-relaxed mb-8 relative z-10 pt-4">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500"></div>
                    <div>
                      <div className="font-bold text-white">{testimonial.author}</div>
                      <div className="text-sm text-white/50">{testimonial.role}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-32 px-6 max-w-3xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Frequently asked questions</h2>
          </div>
          <div className="space-y-4">
            {[
              {
                q: "Do candidates need to create an account?",
                a: "No. Candidates simply click your unique interview link and start recording in their browser immediately. There's zero friction."
              },
              {
                q: "Can candidates re-record their answers?",
                a: "It's entirely up to you! When creating the interview, you can set the number of allowed retakes per question to 0, 1, or unlimited."
              },
              {
                q: "Does it work on mobile phones?",
                a: "Yes, our recording interface is fully responsive and works perfectly on iOS and Android browsers without any app downloads."
              },
              {
                q: "Is there a limit to how many interviews I can send?",
                a: "Not at all. You can send your interview link to as many candidates as you want. You only pay for active seats on your hiring team."
              }
            ].map((faq, i) => (
              <details key={i} className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex items-center justify-between p-6 cursor-pointer font-semibold text-lg hover:bg-white/5 transition-colors">
                  {faq.q}
                  <span className="text-blue-400 group-open:-rotate-180 transition-transform duration-300">
                    <svg fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                  </span>
                </summary>
                <div className="p-6 pt-0 text-white/60 leading-relaxed bg-white/[0.02]">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* Extreme CTA Section */}
        <section className="py-32 px-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl mx-auto relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-transparent rounded-[3rem] blur-2xl"></div>
            <div className="bg-[#0a0a0a]/80 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-16 md:p-24 text-center relative overflow-hidden shadow-2xl shadow-blue-900/20">
              
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>
              
              <div className="relative z-10">
                <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tighter">Ready to hire better?</h2>
                <p className="text-xl text-white/50 mb-12 max-w-2xl mx-auto leading-relaxed">Join the modern companies who have replaced their phone screens with asynchronous video interviews.</p>
                <Link href="/login" className="relative group inline-flex rounded-full mt-4">
                  <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-lg opacity-70 group-hover:opacity-100 transition duration-500 animate-pulse"></div>
                  <div className="relative bg-[#050505] text-white px-10 py-5 rounded-full font-bold text-xl flex items-center gap-3 border border-white/20 group-hover:border-white/40 transition-all shadow-2xl">
                    Get Started for Free
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform text-purple-400" />
                  </div>
                </Link>
              </div>
            </div>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#050505] py-12 px-6 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity cursor-pointer">
            <Video className="w-6 h-6 text-white" />
            <span className="text-2xl font-bold tracking-tight">Hireneo</span>
          </div>
          <p className="text-white/40 text-sm">© {new Date().getFullYear()} Hireneo. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
