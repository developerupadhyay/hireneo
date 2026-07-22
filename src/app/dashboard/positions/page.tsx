import { createClient } from '@/utils/supabase/server'
import prisma from '@/utils/prisma'
import { Plus, Briefcase, ChevronRight } from 'lucide-react'
import Link from 'next/link'

export default async function PositionsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const positions = await prisma.position.findMany({
    where: { profileId: user.id },
    include: { _count: { select: { questions: true, interviews: true } } },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Positions</h1>
          <p className="text-text-muted mt-1">Manage all your open roles.</p>
        </div>
        <Link href="/dashboard/positions/new" className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-medium px-4 py-2 rounded-xl transition-all shadow-lg shadow-primary/20">
          <Plus className="w-5 h-5" />
          New Position
        </Link>
      </div>

      <div className="space-y-4">
        {positions.map((position: any) => (
          <div key={position.id} className="block bg-surface/40 border border-white/5 transition-all rounded-2xl p-6 group">
            <div className="flex justify-between items-center">
              <Link href={`/dashboard/positions/${position.id}/candidates`} className="flex items-center gap-4 flex-1">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <Briefcase className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">{position.title}</h3>
                  <div className="flex gap-4 mt-1 text-sm text-text-muted">
                    <span>{position._count.questions} questions</span>
                    <span>•</span>
                    <span>{position._count.interviews} candidates</span>
                  </div>
                </div>
              </Link>
              <div className="flex items-center gap-4">
                <Link href={`/dashboard/positions/${position.id}/edit`} className="text-sm font-medium text-white/60 hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-xl">
                  Edit Questions
                </Link>
                <Link href={`/dashboard/positions/${position.id}/candidates`} className="text-sm font-medium text-primary hover:text-primary-dark transition-colors bg-primary/10 px-4 py-2 rounded-xl">
                  View Candidates
                </Link>
              </div>
            </div>
          </div>
        ))}

        {positions.length === 0 && (
          <div className="text-center p-12 border border-white/5 rounded-2xl">
            <Briefcase className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <p className="text-white font-medium">No positions found</p>
            <p className="text-text-muted text-sm mt-1">Create a new position to get started.</p>
          </div>
        )}
      </div>
    </div>
  )
}
