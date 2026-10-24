'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Camera, Square, RefreshCcw, CheckCircle, Clock, VideoOff } from 'lucide-react'

export default function VideoRecorder({
  question,
  thinkTime,
  answerTime,
  retakes = 0,
  onComplete,
}: {
  question: string
  thinkTime: number
  answerTime: number
  retakes?: number
  onComplete: (videoBlob: Blob) => void
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const [status, setStatus] = useState<'thinking' | 'recording' | 'reviewing'>('thinking')
  const [timeLeft, setTimeLeft] = useState(thinkTime)
  const [retakesLeft, setRetakesLeft] = useState(retakes)
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [isInitializing, setIsInitializing] = useState(true)

  // Determine supported video MIME type across browsers (Chrome, Safari, Firefox)
  const getSupportedMimeType = useCallback(() => {
    if (typeof MediaRecorder === 'undefined') return 'video/webm'
    const candidates = [
      'video/webm;codecs=vp9,opus',
      'video/webm;codecs=vp8,opus',
      'video/webm',
      'video/mp4;codecs=avc1,mp4a.40.2',
      'video/mp4',
    ]
    for (const t of candidates) {
      if (MediaRecorder.isTypeSupported(t)) return t
    }
    return ''
  }, [])

  // Camera setup
  const setupCamera = useCallback(async () => {
    setIsInitializing(true)
    setCameraError(null)

    // Stop existing stream if any
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
        audio: { echoCancellation: true, noiseSuppression: true },
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (err: unknown) {
      console.error('Camera/mic access error:', err)
      const errName = err && typeof err === 'object' && 'name' in err ? (err as { name: string }).name : ''
      const errMsg = err instanceof Error ? err.message : 'Unknown error'
      if (errName === 'NotAllowedError' || errName === 'PermissionDeniedError') {
        setCameraError('Camera and microphone permissions were denied. Please allow camera and microphone access in your browser address bar and click Retry.')
      } else if (errName === 'NotFoundError' || errName === 'DevicesNotFoundError') {
        setCameraError('No camera or microphone was detected. Please connect a webcam/mic and click Retry.')
      } else {
        setCameraError('Unable to access media devices: ' + errMsg)
      }
    } finally {
      setIsInitializing(false)
    }
  }, [])

  useEffect(() => {
    let active = true

    async function initCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
          audio: { echoCancellation: true, noiseSuppression: true },
        })
        if (!active) {
          stream.getTracks().forEach((track) => track.stop())
          return
        }
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      } catch (err: unknown) {
        if (!active) return
        console.error('Camera/mic access error:', err)
        const errName = err && typeof err === 'object' && 'name' in err ? (err as { name: string }).name : ''
        const errMsg = err instanceof Error ? err.message : 'Unknown error'
        if (errName === 'NotAllowedError' || errName === 'PermissionDeniedError') {
          setCameraError('Camera and microphone permissions were denied. Please allow camera and microphone access in your browser address bar and click Retry.')
        } else if (errName === 'NotFoundError' || errName === 'DevicesNotFoundError') {
          setCameraError('No camera or microphone was detected. Please connect a webcam/mic and click Retry.')
        } else {
          setCameraError('Unable to access media devices: ' + errMsg)
        }
      } finally {
        if (active) {
          setIsInitializing(false)
        }
      }
    }

    initCamera()

    return () => {
      active = false
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
        streamRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    return () => {
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl)
      }
    }
  }, [videoUrl])

  const startRecording = useCallback(() => {
    if (!streamRef.current) return

    setVideoBlob(null)
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl)
      setVideoUrl(null)
    }

    const mimeType = getSupportedMimeType()
    const options: MediaRecorderOptions = mimeType ? { mimeType } : {}

    try {
      const mediaRecorder = new MediaRecorder(streamRef.current, options)
      const chunks: Blob[] = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunks.push(e.data)
        }
      }

      mediaRecorder.onstop = () => {
        const actualMime = mimeType || 'video/webm'
        const blob = new Blob(chunks, { type: actualMime })
        setVideoBlob(blob)
        setVideoUrl(URL.createObjectURL(blob))
        setStatus('reviewing')
      }

      mediaRecorderRef.current = mediaRecorder
      mediaRecorder.start(1000) // Collect 1s slices
      setStatus('recording')
      setTimeLeft(answerTime)
    } catch (e: unknown) {
      console.error('Failed to start MediaRecorder:', e)
      const msg = e instanceof Error ? e.message : 'Unknown error'
      setCameraError('Could not start video recorder: ' + msg)
    }
  }, [answerTime, getSupportedMimeType, videoUrl])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop()
    }
  }, [])

  // Automated countdown logic
  useEffect(() => {
    if (status === 'reviewing' || cameraError || isInitializing) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          if (status === 'thinking') {
            startRecording()
            return answerTime
          } else if (status === 'recording') {
            stopRecording()
            return 0
          }
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [status, answerTime, cameraError, isInitializing, startRecording, stopRecording])

  const handleRetake = () => {
    if (retakes !== 999 && retakesLeft <= 0) return

    if (retakes !== 999) {
      setRetakesLeft((prev) => prev - 1)
    }

    setVideoBlob(null)
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl)
      setVideoUrl(null)
    }

    setStatus('thinking')
    setTimeLeft(thinkTime)

    // Ensure live camera feed is active
    if (videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current
    }
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  const isLowTime = timeLeft <= 10 && status === 'recording'

  if (cameraError) {
    return (
      <div className="w-full max-w-2xl mx-auto bento-card p-8 sm:p-12 text-center shadow-xl border-rose-200 dark:border-rose-900/40">
        <div className="w-16 h-16 bg-rose-50 dark:bg-rose-950/50 rounded-2xl border border-rose-200 dark:border-rose-900/50 flex items-center justify-center text-rose-600 dark:text-rose-400 mx-auto mb-4">
          <VideoOff className="w-8 h-8" />
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2">Device Access Issue</h3>
        <p className="text-slate-600 dark:text-white/60 text-xs sm:text-sm leading-relaxed mb-6 max-w-md mx-auto">
          {cameraError}
        </p>
        <button
          type="button"
          onClick={setupCamera}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm transition-all active:scale-[0.98] min-h-[48px] touch-target-48"
        >
          <Camera className="w-4 h-4" />
          <span>Retry Camera Access</span>
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center w-full">
      {/* Question Header Bento Card */}
      <div className="w-full bento-card p-6 sm:p-8 mb-6 shadow-md transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 px-2.5 py-1 rounded-md self-start">
            Prompt
          </span>

          {/* Status Badge with tactile styling */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {status === 'thinking' && (
              <span className="flex items-center gap-2 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900/40 px-3 py-1 rounded-lg text-xs sm:text-sm font-semibold tracking-wide micro-tactile">
                <Clock className="w-4 h-4" />
                <span className="num-tabular font-mono">Think Time: {formatTime(timeLeft)}</span>
              </span>
            )}
            {status === 'recording' && (
              <span className={`flex items-center gap-2 px-3 py-1 rounded-lg text-xs sm:text-sm font-semibold tracking-wide border transition-all micro-tactile ${
                isLowTime 
                  ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-300 animate-pulse' 
                  : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/40'
              }`}>
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                <span className="num-tabular font-mono">Recording: {formatTime(timeLeft)}</span>
              </span>
            )}
            {status === 'reviewing' && (
              <span className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/40 px-3 py-1 rounded-lg text-xs sm:text-sm font-semibold tracking-wide micro-tactile">
                <CheckCircle className="w-4 h-4" />
                <span>Reviewing Response</span>
              </span>
            )}

            {/* Retakes badge */}
            <span className="text-xs font-semibold text-slate-500 dark:text-white/50 bg-slate-100 dark:bg-white/5 px-2.5 py-1 rounded-lg border border-slate-200/80 dark:border-white/10 num-tabular">
              {retakes === 999 
                ? '∞ Retakes' 
                : `${retakesLeft} ${retakesLeft === 1 ? 'retake' : 'retakes'} left`}
            </span>
          </div>
        </div>

        <h2 className="text-lg sm:text-2xl md:text-3xl font-bold text-slate-900 dark:text-white leading-relaxed">
          {question}
        </h2>
      </div>

      {/* Video Viewport Container */}
      <div className="relative w-full aspect-video bg-slate-900 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border border-slate-200 dark:border-white/10">
        {status !== 'reviewing' ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover transform scale-x-[-1]"
            />
            {isInitializing && (
              <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center text-white text-xs sm:text-sm font-medium">
                Initializing camera and microphone...
              </div>
            )}
            {/* Live Indicator overlay during recording */}
            {status === 'recording' && (
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-white text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                <span>LIVE RECORDER</span>
              </div>
            )}
          </>
        ) : (
          <video
            src={videoUrl || undefined}
            controls
            autoPlay
            className="w-full h-full object-cover bg-black"
          />
        )}
      </div>

      {/* Action Controls with min 48px touch targets */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-4 w-full">
        {status === 'thinking' && (
          <button
            type="button"
            onClick={startRecording}
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-base shadow-md shadow-rose-500/20 hover:shadow-lg transition-all active:scale-[0.98] min-h-[48px] touch-target-48 w-full sm:w-auto"
          >
            <Camera className="w-5 h-5" />
            <span>Start Recording Now</span>
          </button>
        )}

        {status === 'recording' && (
          <button
            type="button"
            onClick={stopRecording}
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-900 dark:bg-white/15 dark:hover:bg-white/25 text-white font-bold text-base shadow-md transition-all active:scale-[0.98] border border-white/10 min-h-[48px] touch-target-48 w-full sm:w-auto"
          >
            <Square className="w-5 h-5" />
            <span className="num-tabular font-mono">Stop Recording ({formatTime(timeLeft)})</span>
          </button>
        )}

        {status === 'reviewing' && (
          <div className="flex flex-wrap items-center justify-center gap-3 w-full sm:w-auto">
            {(retakes === 999 || retakesLeft > 0) ? (
              <button
                type="button"
                onClick={handleRetake}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-800 dark:text-white font-semibold text-sm transition-all active:scale-[0.98] border border-slate-300 dark:border-white/10 min-h-[48px] touch-target-48"
              >
                <RefreshCcw className="w-4 h-4" />
                <span className="num-tabular">Retake ({retakes === 999 ? '∞' : `${retakesLeft} left`})</span>
              </button>
            ) : (
              <span className="text-xs text-slate-400 dark:text-white/40 italic px-3 py-2">
                No retakes remaining
              </span>
            )}

            <button
              type="button"
              onClick={() => videoBlob && onComplete(videoBlob)}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-500/20 hover:shadow-lg transition-all active:scale-[0.98] min-h-[48px] touch-target-48"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Submit Answer & Continue</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
