import { Team } from '@/lib/supabase/types'

type Props = {
  team: Team
  rank: number
}

const rankEmoji = ['🥇', '🥈', '🥉']

export default function TeamScoreCard({ team, rank }: Props) {
  const isFirst = rank === 0

  return (
    <div
      className={`rounded-2xl p-6 flex flex-col items-center gap-3 transition-all duration-700 ${
        isFirst
          ? 'ring-4 ring-yellow-400 shadow-2xl shadow-yellow-400/20 scale-105'
          : 'ring-1 ring-white/20'
      }`}
      style={{ background: `linear-gradient(135deg, ${team.color}cc, ${team.color}66)` }}
    >
      <div className="text-4xl">{rankEmoji[rank] ?? '🏅'}</div>
      <h2 className="text-4xl font-black text-white tracking-wide">{team.name}</h2>
      <div className="text-7xl font-black text-white tabular-nums">{team.total_score}</div>
      <div className="text-white/70 text-lg font-medium">점</div>
    </div>
  )
}
