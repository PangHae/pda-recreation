'use client'

import { useState, useEffect, useRef } from 'react'
import { Team, Member } from '@/lib/supabase/types'

type Props = {
  teams: Team[]
  members: Member[]
}

type AnimState = 'idle' | 'shuffling' | 'revealing' | 'revealed'

const TEAM_COLORS_FALLBACK = ['#0046ff', '#2878f5', '#4baff5', '#8cd2f5']

function randomColor() {
  return `hsl(${Math.floor(Math.random() * 360)}, 75%, 45%)`
}

export default function DrawAnimation({ teams, members }: Props) {
  const [state, setState] = useState<AnimState>('idle')
  const [displayedMembers, setDisplayedMembers] = useState<Member[]>(members)
  const [revealedTeams, setRevealedTeams] = useState<Set<number>>(new Set())
  const [cardColors, setCardColors] = useState<string[]>(members.map(() => '#1e3a6e'))
  const [cardScales, setCardScales] = useState<number[]>(members.map(() => 1))
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const tickRef = useRef(0)

  function startShuffle() {
    setState('shuffling')
    tickRef.current = 0
    const totalTicks = 50

    intervalRef.current = setInterval(() => {
      const t = tickRef.current
      tickRef.current++

      // Slow down as we approach the end
      const progress = t / totalTicks
      const speedMultiplier = progress > 0.7 ? 1 + (progress - 0.7) * 5 : 1
      if (t % Math.ceil(speedMultiplier) !== 0 && t > totalTicks * 0.7) return

      setDisplayedMembers(prev => [...prev].sort(() => Math.random() - 0.5))
      setCardColors(members.map(() => randomColor()))
      setCardScales(members.map(() => 0.92 + Math.random() * 0.16))

      if (t >= totalTicks) {
        clearInterval(intervalRef.current!)
        // Settle to actual team colors
        const sorted = [...members].sort((a, b) => (a.team_id ?? 99) - (b.team_id ?? 99))
        setDisplayedMembers(sorted)
        setCardColors(sorted.map(m => teams.find(t => t.id === m.team_id)?.color ?? '#1e3a6e'))
        setCardScales(members.map(() => 1))
        setState('revealing')
        revealTeamsSequentially()
      }
    }, 70)
  }

  function revealTeamsSequentially() {
    setRevealedTeams(new Set())
    const sorted = [...teams].sort((a, b) => a.id - b.id)
    sorted.forEach((team, i) => {
      setTimeout(() => {
        setRevealedTeams(prev => new Set([...prev, team.id]))
        if (i === sorted.length - 1) {
          setTimeout(() => setState('revealed'), 600)
        }
      }, i * 900 + 400)
    })
  }

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current) }, [])

  // ── REVEALED ──────────────────────────────────────────────────────────────
  if (state === 'revealed') {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-3 gap-6">
          {teams.map((team, ti) => {
            const teamMembers = members.filter(m => m.team_id === team.id)
            return (
              <div
                key={team.id}
                className="rounded-2xl p-6 text-white"
                style={{
                  background: `linear-gradient(145deg, ${team.color}dd, ${team.color}88)`,
                  boxShadow: `0 8px 40px ${team.color}66`,
                  animation: `teamReveal 0.5s ease-out ${ti * 0.1}s both`,
                }}
              >
                <h3 className="text-3xl font-black mb-5 text-center drop-shadow">{team.name}</h3>
                <div className="space-y-2">
                  {teamMembers.map((m, mi) => (
                    <div
                      key={m.id}
                      className="bg-white/25 rounded-lg px-4 py-2 text-center font-bold text-lg"
                      style={{ animation: `memberSlide 0.4s ease-out ${ti * 0.1 + mi * 0.07}s both` }}
                    >
                      {m.name}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
        <button
          onClick={() => { setState('idle'); setDisplayedMembers(members); setRevealedTeams(new Set()) }}
          className="mx-auto block text-light-blue hover:text-white text-sm transition-colors"
        >
          ↺ 다시 보기
        </button>

        <style>{`
          @keyframes teamReveal {
            from { opacity: 0; transform: scale(0.85) translateY(20px); }
            to   { opacity: 1; transform: scale(1) translateY(0); }
          }
          @keyframes memberSlide {
            from { opacity: 0; transform: translateX(-16px); }
            to   { opacity: 1; transform: translateX(0); }
          }
        `}</style>
      </div>
    )
  }

  // ── REVEALING (sequential team spotlight) ────────────────────────────────
  if (state === 'revealing') {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-3 gap-6">
          {teams.map(team => {
            const teamMembers = members.filter(m => m.team_id === team.id)
            const isRevealed = revealedTeams.has(team.id)
            return (
              <div
                key={team.id}
                className="rounded-2xl p-6 text-white transition-all duration-700"
                style={{
                  background: isRevealed
                    ? `linear-gradient(145deg, ${team.color}dd, ${team.color}88)`
                    : 'rgba(255,255,255,0.06)',
                  boxShadow: isRevealed ? `0 8px 40px ${team.color}66` : 'none',
                  transform: isRevealed ? 'scale(1.03)' : 'scale(1)',
                  border: isRevealed ? `1px solid ${team.color}88` : '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <h3 className="text-3xl font-black mb-5 text-center">
                  {isRevealed ? team.name : '???'}
                </h3>
                <div className="space-y-2">
                  {teamMembers.map((m, mi) => (
                    <div
                      key={m.id}
                      className="rounded-lg px-4 py-2 text-center font-bold text-lg transition-all duration-500"
                      style={{
                        background: isRevealed ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.08)',
                        opacity: isRevealed ? 1 : 0.4,
                        transitionDelay: `${mi * 80}ms`,
                      }}
                    >
                      {m.name}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
        <div className="flex justify-center">
          <p className="text-light-blue text-xl font-bold animate-pulse">공개 중...</p>
        </div>
      </div>
    )
  }

  // ── IDLE / SHUFFLING ──────────────────────────────────────────────────────
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-4 gap-3">
        {displayedMembers.map((m, i) => (
          <div
            key={`${m.id}-${i}`}
            className="rounded-xl px-4 py-3 text-white font-bold text-center text-lg select-none"
            style={{
              background: cardColors[i] ?? '#1e3a6e',
              transform: `scale(${cardScales[i] ?? 1})`,
              transition: state === 'shuffling' ? 'transform 0.06s' : 'all 0.4s ease',
              boxShadow: state === 'shuffling' ? `0 4px 20px ${cardColors[i] ?? '#0046ff'}88` : 'none',
            }}
          >
            {m.name}
          </div>
        ))}
      </div>

      {state === 'idle' && (
        <div className="flex justify-center">
          <button
            onClick={startShuffle}
            className="px-14 py-5 bg-shinhan-blue hover:bg-royal-blue text-white text-2xl font-black rounded-2xl transition-all shadow-lg shadow-shinhan-blue/40 hover:scale-105 active:scale-95"
          >
            🎲 팀 추첨 시작
          </button>
        </div>
      )}

      {state === 'shuffling' && (
        <div className="flex justify-center">
          <p className="text-white text-2xl font-black tracking-widest animate-pulse">
            추첨 중 . . .
          </p>
        </div>
      )}
    </div>
  )
}
