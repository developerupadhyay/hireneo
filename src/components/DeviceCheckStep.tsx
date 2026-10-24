'use client'

import { useState, useRef, useEffect } from 'react'
import { Camera, Mic, CheckCircle2, AlertCircle, ArrowRight, Sparkles, Volume2 } from 'lucide-react'

export default function DeviceCheckStep({
  onReady,
  totalQuestions,
}: {
  onReady: () => void
  totalQuestions: number
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animFrameRef = useRef<number | null>(null)

  const [hasCamera, setHasCamera] = useState(false)
  const [hasMic, setHasMic] = useState(false)
  const [audioLevel, setAudioLevel] = useState(0) // 0 to 100
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function initDevices() {
      setIsLoading(true)
      setError(null)

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
          audio: { echoCancellation: true, noiseSuppression: true },
        })

        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }

        const videoTracks = stream.getVideoTracks()
        const audioTracks = stream.getAudioTracks()

        setHasCamera(videoTracks.length > 0 && videoTracks[0].readyState === 'live')
        setHasMic(audioTracks.length > 0 && audioTracks[0].readyState === 'live')

        // Set up Web Audio Analyser for live VU-meter
        try {
          const win = window as unknown as { webkitAudioContext?: typeof AudioContext; AudioContext?: typeof AudioContext }
          const AudioCtx = win.AudioContext || win.webkitAudioContext
          if (AudioCtx) {
            const ctx = new AudioCtx()
            audioContextRef.current = ctx
            const source = ctx.createMediaStreamSource(stream)
            const analyser = ctx.createAnalyser()
            analyser.fftSize = 64
            analyser.smoothingTimeConstant = 0.5
            source.connect(analyser)
            analyserRef.current = analyser

            const dataArray = new Uint8Array(analyser.frequencyBinCount)

            const updateMeter = () => {
              if (!analyserRef.current) return
              analyserRef.current.getByteFrequencyData(dataArray)
              // Calculate average volume
              let sum = 0
              for (let i = 0; i < dataArray.length; i++) {
                sum += dataArray[i]
              }
              const average = sum / dataArray.length
              const normalized = Math.min(100, Math.round((average / 128) * 100))
              setAudioLevel(normalized)
              animFrameRef.current = requestAnimationFrame(updateMeter)
            }
            updateMeter()
          }
        } catch (audioErr) {
          console.warn('Audio metering unavailable:', audioErr)
        }
      } catch (err: unknown) {
        console.error('Permission error during device check:', err)
        const errName = err && typeof err === 'object' && 'name' in err ? (err as { name: string }).name : ''
        const errMsg = err instanceof Error ? err.message : 'Unknown error'
        if (errName === 'NotAllowedError') {
          setError('Camera and microphone access was denied. Please allow permissions in your browser and click Retry.')
        } else {
          setError('Unable to detect a working camera or microphone: ' + errMsg)
        }
      } finally {
        setIsLoading(false)
      }
    }

    initDevices()

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current)
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {})
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
        streamRef.current = null
      }
    }
  }, [])

  return (
    <div className="w-full max-w-4xl mx-auto bento-card p-6 sm:p-10 shadow-xl transition-colors">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          Pre-Interview Equipment Check
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          Verify Camera & Microphone
        </h2>
        <p className="text-slate-600 dark:text-white/60 text-xs sm:text-sm mt-1.5 max-w-lg mx-auto">
          Ensure your face is clearly visible and your microphone registers sound before starting the {totalQuestions} interview {totalQuestions === 1 ? 'question' : 'questions'}.
        </p>
      </div>

      {error ? (
        <div className="p-6 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-center max-w-md mx-auto mb-8">
          <AlertCircle className="w-8 h-8 text-rose-600 dark:text-rose-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">Permissions Needed</h3>
          <p className="text-slate-600 dark:text-white/60 text-xs sm:text-sm mb-4 leading-relaxed">{error}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-all shadow-sm min-h-[44px] touch-target-48"
          >
            Refresh & Grant Permissions
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center mb-8">
          {/* Live Preview Viewport */}
          <div className="relative aspect-video bg-slate-900 rounded-2xl overflow-hidden shadow-lg border border-slate-200 dark:border-white/10">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover transform scale-x-[-1]"
            />
            {isLoading && (
              <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center text-white text-xs">
                Connecting to camera...
              </div>
            )}
            <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-white text-xs flex items-center gap-1.5 border border-white/10">
              <span className={`w-2 h-2 rounded-full ${hasCamera ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
              <span>Webcam Preview</span>
            </div>
          </div>

          {/* Device Checklist & Sound Meter */}
          <div className="space-y-4">
            {/* Camera status card */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 flex items-center justify-between micro-tactile">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Camera Check</h4>
                  <p className="text-xs text-slate-500 dark:text-white/50">HD Video input active</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/40 px-2.5 py-1 rounded-lg">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Connected
              </span>
            </div>

            {/* Microphone & VU Meter card */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 micro-tactile">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-500/20">
                    <Mic className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">Microphone Input</h4>
                    <p className="text-xs text-slate-500 dark:text-white/50">Speak to test your audio volume</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/40 px-2.5 py-1 rounded-lg">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {hasMic ? 'Active' : 'Checking'}
                </span>
              </div>

              {/* Live Audio Visualizer Bars with tactile styling */}
              <div className="flex items-center gap-1.5 h-7 px-3 rounded-xl bg-slate-200/80 dark:bg-black/50 border border-slate-300 dark:border-white/10">
                <Volume2 className="w-3.5 h-3.5 text-slate-500 dark:text-white/40 flex-shrink-0" />
                <div className="flex-1 flex items-center gap-1 h-3.5 overflow-hidden">
                  {Array.from({ length: 20 }).map((_, i) => {
                    const threshold = (i / 20) * 100
                    const isActive = audioLevel > threshold
                    return (
                      <div
                        key={i}
                        className={`flex-1 rounded-full transition-all duration-75 ${
                          isActive
                            ? i > 15
                              ? 'bg-rose-500 h-3.5'
                              : i > 10
                              ? 'bg-amber-400 h-2.5'
                              : 'bg-emerald-500 h-2'
                            : 'bg-slate-300 dark:bg-white/10 h-1'
                        }`}
                      />
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Preparation tip */}
            <div className="p-3.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40 text-xs text-slate-700 dark:text-white/70 leading-relaxed">
              💡 <strong>Interview tip:</strong> Face the light source, speak naturally, and take a moment to read the question prompt during the thinking countdown.
            </div>
          </div>
        </div>
      )}

      {/* Start Button with min 48px touch target */}
      <div className="flex justify-center pt-2">
        <button
          type="button"
          onClick={onReady}
          disabled={isLoading || !!error}
          className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-base shadow-md shadow-blue-500/20 hover:shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 min-h-[48px] touch-target-48 w-full sm:w-auto"
        >
          <span>Everything Looks Great — Start Interview</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
