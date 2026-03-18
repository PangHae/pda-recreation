'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Team } from '@/lib/supabase/types'

export function useRealtimeScores(initialTeams: Team[]) {
  const [teams, setTeams] = useState<Team[]>(initialTeams)

  useEffect(() => {
    const supabase = createClient()

    const channel = supabase
      .channel('teams-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'teams' },
        (payload) => {
          if (payload.eventType === 'UPDATE') {
            setTeams(prev =>
              prev.map(t => (t.id === (payload.new as Team).id ? (payload.new as Team) : t))
            )
          } else if (payload.eventType === 'INSERT') {
            setTeams(prev => [...prev, payload.new as Team])
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return teams
}
