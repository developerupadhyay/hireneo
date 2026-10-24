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
      <div className="bento-card p-10 sm:p-14 text-center max-w-md mx-auto shadow-2xl relative z-10">
        <div className="w-14 h-14 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-5 shadow-sm"></div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          Uploading Video Answer...
        </h2>
        <p className="text-slate-500 dark:text-white/50 mt-2 text-xs sm:text-sm">
          Securing and indexing your recording. Please do not close or refresh this tab.
        </p>
      </div>
    )
  }

  return (
    <div className="w-full space-y-6">
      {/* Interview Progress Bento Bar */}
      <div className="max-w-2xl mx-auto bento-card p-4 text-center relative z-10">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-white/60 mb-2">
          <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
          <span className="font-mono num-tabular text-blue-600 dark:text-blue-400 font-bold">{progressPercent}% Complete</span>
        </div>
        <div className="h-2 w-full bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
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
