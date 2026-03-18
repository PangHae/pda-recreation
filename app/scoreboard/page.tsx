import { createServerClient } from '@/lib/supabase/server'
import ScoreboardGrid from '@/components/scoreboard/ScoreboardGrid'

export const revalidate = 0

export default async function ScoreboardPage() {
  const supabase = createServerClient()
  const { data: teams } = await supabase
    .from('teams')
    .select('*')
    .order('id')

  return (
    <div className="min-h-screen bg-navy flex flex-col items-center justify-center p-6 gap-8">
      <div className="text-center">
        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-2">
          PDA 레크레이션
        </h1>
        <p className="text-light-blue text-lg md:text-xl">신한투자증권 프로디지털아카데미 6기</p>
      </div>

      <ScoreboardGrid initialTeams={teams ?? []} />

      <p className="text-white/30 text-sm">실시간 업데이트</p>
    </div>
  )
}
