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
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
        <h2 className="text-2xl font-bold text-white">Uploading Response...</h2>
        <p className="text-text-muted mt-2">Please don't close this window.</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <p className="text-primary font-medium tracking-widest uppercase mb-2">Question {currentQuestionIndex + 1} of {questions.length}</p>
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
