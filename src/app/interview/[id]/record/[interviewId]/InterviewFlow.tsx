/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useState } from 'react'
import VideoRecorder from '@/components/VideoRecorder'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { saveVideoResponse } from './actions'

export default function InterviewFlow({ interviewId, questions }: { interviewId: string, questions: any[] }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const currentQuestion = questions[currentQuestionIndex]

  const handleComplete = async (videoBlob: Blob) => {
    setIsUploading(true)
    try {
      // 1. Upload to Supabase Storage
      const fileName = `${interviewId}/${currentQuestion.id}-${Date.now()}.webm`
      const { data, error } = await supabase.storage.from('videos').upload(fileName, videoBlob, {
        contentType: 'video/webm'
      })
      
      if (error) {
        console.error("Upload error:", error)
        alert("Failed to upload video. Please ensure the 'videos' bucket exists and is public in Supabase.")
        setIsUploading(false)
        return
      }

      // 2. Save DB record via server action
      const { data: publicUrlData } = supabase.storage.from('videos').getPublicUrl(fileName)
      await saveVideoResponse(interviewId, currentQuestion.id, publicUrlData.publicUrl)

      // 3. Move to next question or refresh
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1)
        setIsUploading(false)
      } else {
        router.refresh() // Will trigger Server Component to show "Completed" state
      }

    } catch (err) {
      console.error(err)
      setIsUploading(false)
    }
  }

  if (isUploading) {
    return (
      <div className="text-center relative z-10 bg-white/[0.02] backdrop-blur-3xl border border-white/5 p-12 rounded-[2rem] shadow-2xl">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6 shadow-[0_0_15px_rgba(59,130,246,0.3)]"></div>
        <h2 className="text-3xl font-bold text-white tracking-tight">Uploading Response...</h2>
        <p className="text-white/50 mt-3 text-lg">Please don&apos;t close this window.</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="text-center mb-10 relative z-10">
        <div className="inline-block bg-blue-500/10 text-blue-400 font-semibold tracking-widest uppercase border border-blue-500/20 px-6 py-2 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.15)]">
          Question {currentQuestionIndex + 1} of {questions.length}
        </div>
      </div>
      <VideoRecorder 
        key={currentQuestion.id}
        question={currentQuestion.content}
        thinkTime={currentQuestion.thinkTime}
        answerTime={currentQuestion.answerTime}
        onComplete={handleComplete}
      />
    </div>
  )
}
