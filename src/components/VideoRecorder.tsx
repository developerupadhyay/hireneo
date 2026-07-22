'use client'

import { useState, useRef, useEffect } from 'react'
import { Camera, Square, RefreshCcw, CheckCircle, AlertCircle } from 'lucide-react'

export default function VideoRecorder({
  question,
  thinkTime,
  answerTime,
  onComplete
}: {
  question: string
  thinkTime: number
  answerTime: number
  onComplete: (videoBlob: Blob) => void
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([])
  
  const [status, setStatus] = useState<'thinking' | 'recording' | 'reviewing'>('thinking')
  const [timeLeft, setTimeLeft] = useState(thinkTime)
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)

  useEffect(() => {
    let stream: MediaStream | null = null

    async function setupCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      } catch (e) {
        console.error("Camera access denied", e)
      }
    }
    setupCamera()

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  // Timer logic
  useEffect(() => {
    if (status === 'reviewing') return

    const timer = setInterval(() => {
      setTimeLeft(prev => {
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
  }, [status, answerTime])

  const startRecording = () => {
    if (!videoRef.current?.srcObject) return

    setRecordedChunks([])
    const stream = videoRef.current.srcObject as MediaStream
    const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' })
    
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        setRecordedChunks(prev => [...prev, e.data])
      }
    }

    mediaRecorder.onstop = () => {
      setStatus('reviewing')
    }

    mediaRecorderRef.current = mediaRecorder
    mediaRecorder.start()
    setStatus('recording')
    setTimeLeft(answerTime)
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop()
    }
  }

  // Compile chunks into a single Blob when recording stops
  useEffect(() => {
    if (status === 'reviewing' && recordedChunks.length > 0) {
      const blob = new Blob(recordedChunks, { type: 'video/webm' })
      setVideoBlob(blob)
      setVideoUrl(URL.createObjectURL(blob))
    }
  }, [status, recordedChunks])

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-3xl bg-surface/50 border border-white/10 rounded-2xl p-6 mb-6">
        <h2 className="text-xl font-semibold text-white mb-2">{question}</h2>
        <div className="flex justify-between items-center text-sm font-medium">
          {status === 'thinking' && <span className="text-yellow-400">Thinking Time: {formatTime(timeLeft)}</span>}
          {status === 'recording' && <span className="text-red-400 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> Recording: {formatTime(timeLeft)}</span>}
          {status === 'reviewing' && <span className="text-blue-400">Review your answer</span>}
        </div>
      </div>

      <div className="relative w-full max-w-3xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10">
        {status !== 'reviewing' ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover transform scale-x-[-1]"
          />
        ) : (
          <video
            src={videoUrl || undefined}
            controls
            className="w-full h-full object-contain bg-black"
          />
        )}
      </div>

      <div className="mt-8 flex gap-4">
        {status === 'thinking' && (
          <button 
            onClick={startRecording}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-medium transition-all"
          >
            <Camera className="w-5 h-5" /> Start Recording Now
          </button>
        )}
        
        {status === 'recording' && (
          <button 
            onClick={stopRecording}
            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl font-medium transition-all"
          >
            <Square className="w-5 h-5" /> Stop Recording
          </button>
        )}

        {status === 'reviewing' && (
          <>
            <button 
              onClick={() => {
                setRecordedChunks([])
                setVideoBlob(null)
                setVideoUrl(null)
                setStatus('thinking')
                setTimeLeft(thinkTime)
              }}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-medium transition-all"
            >
              <RefreshCcw className="w-5 h-5" /> Retake
            </button>
            <button 
              onClick={() => videoBlob && onComplete(videoBlob)}
              className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-lg shadow-primary/25"
            >
              <CheckCircle className="w-5 h-5" /> Submit Answer
            </button>
          </>
        )}
      </div>
    </div>
  )
}
