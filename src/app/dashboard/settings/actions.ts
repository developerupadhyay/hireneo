'use server'

import { createClient } from '@/utils/supabase/server'
import prisma from '@/utils/prisma'
import { revalidatePath } from 'next/cache'

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  const name = formData.get('name') as string
  const companyName = formData.get('companyName') as string

  const profile = await prisma.profile.findUnique({
    where: { id: user.id }
  })

  if (profile) {
    await prisma.profile.update({
      where: { id: user.id },
      data: { name }
    })
    
    await prisma.company.update({
      where: { id: profile.companyId },
      data: { name: companyName }
    })
  }

  revalidatePath('/dashboard/settings')
  revalidatePath('/dashboard')
}
