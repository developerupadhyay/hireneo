/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useState } from 'react'
import VideoRecorder from '@/components/VideoRecorder'
import DeviceCheckStep from '@/components/DeviceCheckStep'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { saveVideoResponse } from './actions'

export default function InterviewFlow({ interviewId, questions }: { interviewId: string, questions: any[] }) {
  const [isDeviceChecked, setIsDeviceChecked] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const currentQuestion = questions[currentQuestionIndex]
  const progressPercent = Math.round(((currentQuestionIndex) / questions.length) * 100)

  const handleComplete = async (videoBlob: Blob) => {
    setIsUploading(true)
    try {
      // 1. Upload to Supabase Storage
      const fileName = `${interviewId}/${currentQuestion.id}-${Date.now()}.webm`
      const { data, error } = await supabase.storage.from('videos').upload(fileName, videoBlob, {
        contentType: videoBlob.type || 'video/webm'
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

  // Show equipment check before starting Question 1
  if (!isDeviceChecked) {
    return (
      <DeviceCheckStep 
        totalQuestions={questions.length} 
        onReady={() => setIsDeviceChecked(true)} 
      />
    )
  }

  if (isUploading) {
    return (
      <div className="text-center relative z-10 bg-white dark:bg-[#0a0a0a]/90 backdrop-blur-3xl border border-slate-200 dark:border-white/10 p-12 sm:p-16 rounded-3xl shadow-2xl max-w-lg mx-auto">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6 shadow-sm"></div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          Uploading Response...
        </h2>
        <p className="text-slate-500 dark:text-white/50 mt-2 text-sm sm:text-base">
          Saving your video answer. Please don&apos;t close this window.
        </p>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Interview Progress Bar */}
      <div className="max-w-2xl mx-auto mb-8 text-center relative z-10">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-white/50 mb-2">
          <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
          <span>{progressPercent}% Complete</span>
        </div>
        <div className="h-2 w-full bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-600 transition-all duration-500 ease-out rounded-full"
            style={{ width: `${Math.max(5, progressPercent)}%` }}
          />
        </div>
      </div>

      <VideoRecorder 
        key={currentQuestion.id}
        question={currentQuestion.content}
        thinkTime={currentQuestion.thinkTime}
        answerTime={currentQuestion.answerTime}
        retakes={currentQuestion.retakes ?? 0}
        onComplete={handleComplete}
      />
    </div>
  )
}
