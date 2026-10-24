'use server'

import { createClient } from '@/utils/supabase/server'
import prisma from '@/utils/prisma'
import { revalidatePath } from 'next/cache'

export async function updateInterviewStatus(interviewId: string, status: string, positionId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Verify ownership of the position via interview
  const interview = await prisma.interview.findUnique({
    where: { id: interviewId },
    include: { position: true }
  })

  if (!interview || interview.position.profileId !== user.id) {
    throw new Error('Unauthorized')
  }

  await prisma.interview.update({
    where: { id: interviewId },
    data: { status }
  })

  revalidatePath(`/dashboard/positions/${positionId}/candidates`)
}
