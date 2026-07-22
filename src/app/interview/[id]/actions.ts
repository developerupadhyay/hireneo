'use server'

import prisma from '@/utils/prisma'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

// Simple in-memory rate limiter (resets on server restart/redeploy, but highly effective for basic spam prevention)
const rateLimitMap = new Map<string, { count: number, timestamp: number }>()

export async function createInterview(formData: FormData) {
  const positionId = formData.get('positionId') as string
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const honeypot = formData.get('company_website') as string

  // Anti-Spam 1: Honeypot (If a bot fills out the hidden field, silently reject)
  if (honeypot && honeypot.length > 0) {
    redirect(`/interview/${positionId}`) // Redirect back without doing anything
  }

  // Anti-Spam 2: IP Rate Limiting (Max 5 requests per minute per IP)
  const headersList = await headers()
  const ip = headersList.get('x-forwarded-for') || 'unknown_ip'
  const now = Date.now()
  const windowMs = 60 * 1000 // 1 minute window
  const maxRequests = 5

  const record = rateLimitMap.get(ip)
  if (record && now - record.timestamp < windowMs) {
    if (record.count >= maxRequests) {
      // Too many requests, silently drop or throw
      redirect(`/interview/${positionId}?error=rate_limit`)
    }
    record.count += 1
  } else {
    rateLimitMap.set(ip, { count: 1, timestamp: now })
  }

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
