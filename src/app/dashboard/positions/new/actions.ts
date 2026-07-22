'use server'

import { createClient } from '@/utils/supabase/server'
import prisma from '@/utils/prisma'
import { redirect } from 'next/navigation'

export async function createPosition(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const title = formData.get('title') as string
  const description = formData.get('description') as string

  const position = await prisma.position.create({
    data: {
      title,
      description,
      profileId: user.id
    }
  })

  redirect(`/dashboard/positions/${position.id}/edit`)
}
