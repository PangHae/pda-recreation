'use client'

import { useState, useTransition } from 'react'
import { addScoreAction, getTeamsAction } from '@/actions/scores'
import { Team } from '@/lib/supabase/types'
import { GAMES } from '@/lib/constants'
import Button from '@/components/ui/Button'

type Props = {
  initialTeams: Team[]
}

export default function ScoreInputForm({ initialTeams }: Props) {
  const [teams] = useState<Team[]>(initialTeams)
  const [teamId, setTeamId] = useState<number | null>(null)
  const [gameName, setGameName] = useState('')
  const [points, setPoints] = useState('')
  const [note, setNote] = useState('')
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!teamId || !gameName || !points) return
    startTransition(async () => {
      const result = await addScoreAction({
        teamId,
        gameName,
        points: parseInt(points, 10),
        note: note || undefined,
      })
      if (result?.error) {
        setMessage({ type: 'error', text: result.error })
      } else {
        setMessage({ type: 'success', text: '점수가 추가되었습니다!' })
        setPoints('')
        setNote('')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Team selection */}
      <div>
        <label className="block text-sm font-medium text-light-blue mb-2">팀 선택</label>
        <div className="grid grid-cols-3 gap-2">
          {teams.map(team => (
            <button
              key={team.id}
              type="button"
              onClick={() => setTeamId(team.id)}
              className={`py-3 rounded-xl font-bold text-white text-lg transition-all ${
                teamId === team.id
                  ? 'ring-2 ring-white scale-105'
                  : 'opacity-70 hover:opacity-100'
              }`}
              style={{ background: team.color }}
            >
              {team.name}
            </button>
          ))}
        </div>
      </div>

      {/* Game selection */}
      <div>
        <label className="block text-sm font-medium text-light-blue mb-2">게임 선택</label>
        <div className="grid grid-cols-1 gap-2">
          {GAMES.map(game => (
            <button
              key={game.slug}
              type="button"
              onClick={() => setGameName(game.name)}
              className={`py-2.5 px-4 rounded-lg text-white text-left transition-all flex items-center gap-2 ${
                gameName === game.name
                  ? 'bg-shinhan-blue ring-1 ring-sky-blue'
                  : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              <span>{game.emoji}</span>
              <span>{game.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Points */}
      <div>
        <label className="block text-sm font-medium text-light-blue mb-1">점수</label>
        <input
          type="number"
          value={points}
          onChange={e => setPoints(e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/30 text-white text-2xl font-bold text-center focus:outline-none focus:border-sky-blue"
          placeholder="0"
          min="-100"
          max="1000"
        />
      </div>

      {/* Note (optional) */}
      <div>
        <label className="block text-sm font-medium text-light-blue mb-1">메모 (선택)</label>
        <input
          type="text"
          value={note}
          onChange={e => setNote(e.target.value)}
          className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/30 text-white focus:outline-none focus:border-sky-blue"
          placeholder="예: 1라운드 승리"
        />
      </div>

      {message && (
        <p className={`text-sm text-center ${message.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
          {message.text}
        </p>
      )}

      <Button
        type="submit"
        size="xl"
        className="w-full"
        disabled={!teamId || !gameName || !points || isPending}
      >
        {isPending ? '저장 중...' : '점수 추가'}
      </Button>
    </form>
  )
}
