'use client'

import { useRealtimeScores } from '@/hooks/useRealtimeScores'
import { Team } from '@/lib/supabase/types'
import TeamScoreCard from './TeamScoreCard'

type Props = {
  initialTeams: Team[]
}

export default function ScoreboardGrid({ initialTeams }: Props) {
  const teams = useRealtimeScores(initialTeams)
  const sorted = [...teams].sort((a, b) => b.total_score - a.total_score)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-5xl mx-auto">
      {sorted.map((team, i) => (
        <TeamScoreCard key={team.id} team={team} rank={i} />
      ))}
    </div>
  )
}
