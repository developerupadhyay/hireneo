'use server'

import { createClient } from '@/utils/supabase/server'
import prisma from '@/utils/prisma'
import { revalidatePath } from 'next/cache'

export async function updatePosition(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const id = formData.get('id') as string
  const title = (formData.get('title') as string)?.trim()
  const description = (formData.get('description') as string)?.trim()

  if (!title) throw new Error('Position title is required')

  // Verify ownership
  const existing = await prisma.position.findUnique({
    where: { id }
  })
  if (existing?.profileId !== user.id) throw new Error('Unauthorized')

  await prisma.position.update({
    where: { id },
    data: {
      title,
      description: description || null
    }
  })

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/positions')
  revalidatePath(`/dashboard/positions/${id}/edit`)
}

export async function deletePosition(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const id = formData.get('id') as string

  // Verify ownership
  const existing = await prisma.position.findUnique({
    where: { id },
    include: { interviews: { select: { id: true } } }
  })
  if (existing?.profileId !== user.id) throw new Error('Unauthorized')

  const interviewIds = existing.interviews.map(i => i.id)

  // Safe cascading delete inside a transaction
  await prisma.$transaction(async (tx) => {
    // 1. Delete all video responses for candidate interviews in this position
    if (interviewIds.length > 0) {
      await tx.videoResponse.deleteMany({
        where: { interviewId: { in: interviewIds } }
      })
    }
    // 2. Delete all interviews under this position
    await tx.interview.deleteMany({
      where: { positionId: id }
    })
    // 3. Delete all questions under this position
    await tx.question.deleteMany({
      where: { positionId: id }
    })
    // 4. Finally delete the position
    await tx.position.delete({
      where: { id }
    })
  })

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/positions')
}
