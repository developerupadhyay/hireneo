/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import prisma from '@/utils/prisma' // I need to create this!

export async function login(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/login?message=Could not authenticate user')
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    company: formData.get('company') as string,
    name: formData.get('name') as string,
  }

  const { data: authData, error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
  })

  if (error) {
    redirect('/login?message=Could not authenticate user')
  }

  // If signup successful, create company and profile via Prisma
  if (authData.user) {
    try {
      // Import prisma dynamically or globally
      const prisma = (await import('@/utils/prisma')).default
      
      const company = await prisma.company.create({
        data: {
          name: data.company,
        }
      })

      await prisma.profile.create({
        data: {
          id: authData.user.id,
          email: data.email,
          name: data.name,
          companyId: company.id
        }
      })
    } catch (e) {
      console.error(e)
      // Ideally rollback or notify user
    }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}
