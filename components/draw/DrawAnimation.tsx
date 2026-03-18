'use client'

import { useState, useEffect, useRef } from 'react'
import { Team, Member } from '@/lib/supabase/types'

type Props = {
  teams: Team[]
  members: Member[]
}

type AnimState = 'idle' | 'shuffling' | 'revealed'

export default function DrawAnimation({ teams, members }: Props) {
  const [state, setState] = useState<AnimState>('idle')
  const [displayedMembers, setDisplayedMembers] = useState<Member[]>(members)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  function startShuffle() {
    setState('shuffling')
    let ticks = 0
    const max = 40

    intervalRef.current = setInterval(() => {
      ticks++
      // Show visually shuffled (random order) but keep actual team_id intact
      setDisplayedMembers(prev => [...prev].sort(() => Math.random() - 0.5))

      if (ticks >= max) {
        clearInterval(intervalRef.current!)
        // Reveal actual team assignments sorted by team
        setDisplayedMembers([...members].sort((a, b) => (a.team_id ?? 99) - (b.team_id ?? 99)))
        setState('revealed')
      }
    }, 80)
  }

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current) }, [])

  const getTeam = (id: number | null) => teams.find(t => t.id === id)

  if (state === 'revealed') {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-3 gap-6">
          {teams.map(team => {
            const teamMembers = members.filter(m => m.team_id === team.id)
            return (
              <div
                key={team.id}
                className="rounded-2xl p-6 text-white"
                style={{ background: `linear-gradient(135deg, ${team.color}, ${team.color}99)` }}
              >
                <h3 className="text-2xl font-black mb-4 text-center">{team.name}</h3>
                <div className="space-y-2">
                  {teamMembers.map(m => (
                    <div key={m.id} className="bg-white/20 rounded-lg px-4 py-2 text-center font-semibold text-lg">
                      {m.name}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
        <button
          onClick={() => { setState('idle'); setDisplayedMembers(members) }}
          className="mx-auto block text-light-blue hover:text-white text-sm"
        >
          다시 보기
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-3">
        {displayedMembers.map((m, i) => {
          const team = getTeam(m.team_id)
          return (
            <div
              key={`${m.id}-${i}`}
              className="rounded-xl px-4 py-3 text-white font-semibold text-center text-lg transition-all duration-75"
              style={{
                background: state === 'shuffling'
                  ? `hsl(${(i * 47) % 360}, 70%, 40%)`
                  : (team?.color ?? '#334155'),
              }}
            >
              {m.name}
            </div>
          )
        })}
      </div>

      {state === 'idle' && (
        <div className="flex justify-center">
          <button
            onClick={startShuffle}
            className="px-12 py-4 bg-shinhan-blue hover:bg-royal-blue text-white text-2xl font-black rounded-2xl transition-colors shadow-lg shadow-shinhan-blue/30"
          >
            🎲 팀 추첨 시작
          </button>
        </div>
      )}

      {state === 'shuffling' && (
        <div className="flex justify-center">
          <p className="text-light-blue text-xl font-bold animate-pulse">추첨 중...</p>
        </div>
      )}
    </div>
  )
}
