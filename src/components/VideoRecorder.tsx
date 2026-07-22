/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useState, useRef, useEffect } from 'react'
import { Camera, Square, RefreshCcw, CheckCircle, AlertCircle, Clock } from 'lucide-react'

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
        stream.getTracks().forEach((track: MediaStreamTrack) => track.stop())
      }
    }
  }, [])

  const startRecording = () => {
    if (!videoRef.current?.srcObject) return

    setVideoBlob(null)
    setVideoUrl(null)
    
    const stream = videoRef.current.srcObject as MediaStream
    const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' })
    const chunks: Blob[] = []
    
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunks.push(e.data)
      }
    }

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' })
      setVideoBlob(blob)
      setVideoUrl(URL.createObjectURL(blob))
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, answerTime])

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-full bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-[2rem] p-8 md:p-10 mb-8 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-[50px] pointer-events-none"></div>
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 leading-relaxed relative z-10">{question}</h2>
        <div className="flex justify-between items-center text-sm font-semibold tracking-wider uppercase relative z-10">
          {status === 'thinking' && (
             <span className="flex items-center gap-2 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-4 py-2 rounded-xl">
               <Clock className="w-4 h-4" /> Thinking Time: {formatTime(timeLeft)}
             </span>
          )}
          {status === 'recording' && (
             <span className="flex items-center gap-2 bg-red-500/10 text-red-400 border border-red-500/20 px-4 py-2 rounded-xl">
               <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]"></span> 
               Recording: {formatTime(timeLeft)}
             </span>
          )}
          {status === 'reviewing' && (
             <span className="flex items-center gap-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 px-4 py-2 rounded-xl">
               <CheckCircle className="w-4 h-4" /> Review your answer
             </span>
          )}
        </div>
      </div>

      <div className="relative w-full aspect-video bg-black/50 backdrop-blur-md rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 ring-1 ring-white/5">
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
            className="w-full h-full object-cover bg-black"
          />
        )}
      </div>

      <div className="mt-10 flex gap-4 w-full md:w-auto">
        {status === 'thinking' && (
          <button 
            onClick={startRecording}
            className="flex-1 md:flex-none flex justify-center items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(239,68,68,0.3)] active:scale-95"
          >
            <Camera className="w-5 h-5" /> Start Recording Now
          </button>
        )}
        
        {status === 'recording' && (
          <button 
            onClick={stopRecording}
            className="flex-1 md:flex-none flex justify-center items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-xl font-bold transition-all active:scale-95 border border-white/10"
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
              className="flex-1 md:flex-none flex justify-center items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-8 py-4 rounded-xl font-bold transition-all active:scale-95 border border-white/10"
            >
              <RefreshCcw className="w-5 h-5" /> Retake
            </button>
            <button 
              onClick={() => videoBlob && onComplete(videoBlob)}
              className="flex-1 md:flex-none relative group inline-flex rounded-xl"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-40 group-hover:opacity-100 transition duration-500"></div>
              <div className="relative w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold px-8 py-4 rounded-xl flex items-center justify-center gap-2 shadow-xl hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all active:scale-95 border border-white/20">
                <CheckCircle className="w-5 h-5" /> Submit Answer
              </div>
            </button>
          </>
        )}
      </div>
    </div>
  )
}
