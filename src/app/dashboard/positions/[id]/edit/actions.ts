'use server'

import { createClient } from '@/utils/supabase/server'
import prisma from '@/utils/prisma'
import { revalidatePath } from 'next/cache'

export async function addQuestion(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  const positionId = formData.get('positionId') as string
  const content = formData.get('content') as string
  const thinkTime = parseInt(formData.get('thinkTime') as string)
  const answerTime = parseInt(formData.get('answerTime') as string)
  const retakes = parseInt(formData.get('retakes') as string)

  // Verify position ownership
  const position = await prisma.position.findUnique({
    where: { id: positionId }
  })
  
  if (position?.profileId !== user.id) throw new Error('Unauthorized')

  // Get current max order
  const maxOrderQ = await prisma.question.findFirst({
    where: { positionId },
    orderBy: { order: 'desc' }
  })
  const nextOrder = maxOrderQ ? maxOrderQ.order + 1 : 0

  await prisma.question.create({
    data: {
      positionId,
      content,
      thinkTime,
      answerTime,
      retakes,
      order: nextOrder
    }
  })

  revalidatePath(`/dashboard/positions/${positionId}/edit`)
}
