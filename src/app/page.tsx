'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Video, Clock, Users, ArrowRight, CheckCircle2, MonitorPlay } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-white overflow-hidden selection:bg-primary/30">
      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] mix-blend-screen opacity-50"></div>
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-[100px] mix-blend-screen opacity-50"></div>
        <div className="absolute bottom-1/4 left-1/3 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[150px] mix-blend-screen opacity-50"></div>
      </div>

      {/* Navbar */}
      <nav className="relative z-50 border-b border-white/5 bg-black/20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-primary to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <Video className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight">Hireneo</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
              Log in
            </Link>
            <Link href="/login" className="text-sm font-medium bg-white text-black px-5 py-2.5 rounded-full hover:scale-105 transition-transform active:scale-95 shadow-lg shadow-white/10">
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-primary mb-8 backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
              The future of hiring is asynchronous
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-tight">
              Screen candidates <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-purple-400">
                10x faster with video.
              </span>
            </h1>
            <p className="text-xl text-white/60 max-w-2xl mx-auto mb-12 leading-relaxed">
              Replace initial phone screens with one-way video interviews. Save hundreds of hours, evaluate better, and hire the right people faster without the scheduling nightmare.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/login" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 flex items-center justify-center gap-2 group">
                Start for free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a href="#how-it-works" className="w-full sm:w-auto bg-white/5 border border-white/20 hover:bg-white/10 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all flex items-center justify-center gap-2">
                See how it works
              </a>
            </div>
          </motion.div>

          {/* Abstract App Preview */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="mt-20 relative max-w-5xl mx-auto"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 bottom-0 h-1/2 mt-auto"></div>
            <div className="rounded-2xl border border-white/10 bg-black/40 p-2 backdrop-blur-xl shadow-2xl overflow-hidden">
              <div className="rounded-xl overflow-hidden border border-white/5 bg-surface/50 aspect-[16/9] relative flex items-center justify-center">
                 <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=2069&auto=format&fit=crop')] bg-cover bg-center"></div>
                 <div className="relative z-10 text-center">
                    <div className="w-20 h-20 bg-primary/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/30">
                       <MonitorPlay className="w-10 h-10 text-primary ml-1" />
                    </div>
                 </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="py-32 px-6 bg-black/20 border-y border-white/5 relative">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">Built for lean hiring teams</h2>
              <p className="text-xl text-white/50 max-w-2xl mx-auto">Everything you need to scale your screening process, beautifully designed and simple to use.</p>
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
                  icon: <Users className="w-6 h-6 text-green-400" />,
                  title: "No-Friction Experience",
                  desc: "Candidates don't need to download apps or create accounts to participate."
                }
              ].map((feature, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-surface/40 border border-white/5 p-8 rounded-3xl hover:bg-surface/60 transition-colors"
                >
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-white/60 leading-relaxed">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section id="how-it-works" className="py-32 px-6 max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">How Hireneo works</h2>
            <p className="text-xl text-white/50 max-w-2xl mx-auto">Three simple steps to transform your recruitment process.</p>
          </div>

          <div className="space-y-24">
            {[
              {
                step: "01",
                title: "Create the Interview",
                desc: "Add your questions, define how much time candidates have to think, and how long they have to answer. Hit save.",
                img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop"
              },
              {
                step: "02",
                title: "Share the Link",
                desc: "Send the unique interview link to your candidates. They can record their answers from any device, anywhere in the world.",
                img: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop",
                reverse: true
              },
              {
                step: "03",
                title: "Review & Hire",
                desc: "Watch the recorded video responses in your dashboard. Compare candidates side-by-side and make faster, better hiring decisions.",
                img: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2070&auto=format&fit=crop"
              }
            ].map((block, i) => (
              <div key={i} className={`flex flex-col md:flex-row items-center gap-16 ${block.reverse ? 'md:flex-row-reverse' : ''}`}>
                <div className="flex-1">
                  <span className="text-primary font-bold text-lg mb-2 block tracking-wider uppercase">Step {block.step}</span>
                  <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">{block.title}</h3>
                  <p className="text-xl text-white/60 leading-relaxed">{block.desc}</p>
                </div>
                <div className="flex-1 w-full">
                  <div className="aspect-[4/3] rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative">
                    <div className="absolute inset-0 bg-primary/20 mix-blend-overlay z-10"></div>
                    <img src={block.img} alt={block.title} className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 px-6">
          <div className="max-w-5xl mx-auto bg-gradient-to-br from-surface to-black border border-white/10 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px]"></div>
            
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 relative z-10">Ready to hire better?</h2>
            <p className="text-xl text-white/60 mb-12 max-w-2xl mx-auto relative z-10">Join the modern companies who have replaced their phone screens with asynchronous video interviews.</p>
            <Link href="/login" className="inline-flex items-center gap-2 bg-white text-black hover:bg-white/90 px-8 py-4 rounded-full font-bold text-lg transition-transform hover:scale-105 active:scale-95 shadow-xl relative z-10">
              Get Started for Free
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Video className="w-5 h-5 text-primary" />
            <span className="text-xl font-bold tracking-tight">Hireneo</span>
          </div>
          <p className="text-white/40 text-sm">© {new Date().getFullYear()} Hireneo. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
