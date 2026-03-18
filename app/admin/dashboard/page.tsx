export const dynamic = 'force-dynamic'

import { createServerClient } from '@/lib/supabase/server'
import ScoreInputForm from '@/components/admin/ScoreInputForm'
import ResetScoresButton from '@/components/admin/ResetScoresButton'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = createServerClient()
  const { data: teams } = await supabase.from('teams').select('*').order('id')

  return (
    <div className="min-h-screen bg-navy p-4">
      <div className="max-w-sm mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-white">점수 입력</h1>
          <Link href="/admin/menu" className="text-light-blue text-sm hover:text-white">
            ← 메뉴
          </Link>
        </div>
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4">
          <ScoreInputForm initialTeams={teams ?? []} />
        </div>
        <div className="mt-4">
          <ResetScoresButton />
        </div>
      </div>
    </div>
  )
}
