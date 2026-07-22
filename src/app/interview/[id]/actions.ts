'use server'

import prisma from '@/utils/prisma'
import { redirect } from 'next/navigation'

export async function createInterview(formData: FormData) {
  const positionId = formData.get('positionId') as string
  const name = formData.get('name') as string
  const email = formData.get('email') as string

  // Create or update candidate
  let candidate = await prisma.candidate.findFirst({ where: { email } })
  if (!candidate) {
    candidate = await prisma.candidate.create({ data: { name, email } })
  }

  // Create interview
  const interview = await prisma.interview.create({
    data: {
      positionId,
      candidateId: candidate.id,
      status: 'STARTED'
    }
  })

  redirect(`/interview/${positionId}/record/${interview.id}`)
}
