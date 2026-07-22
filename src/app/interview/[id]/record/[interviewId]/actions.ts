'use server'
import prisma from '@/utils/prisma'

export async function saveVideoResponse(interviewId: string, questionId: string, videoUrl: string) {
  await prisma.videoResponse.create({
    data: {
      interviewId,
      questionId,
      videoUrl
    }
  })
}
