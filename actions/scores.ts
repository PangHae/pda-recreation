'use server'

import { createServerClient } from '@/lib/supabase/server'

type AddScoreParams = {
  teamId: number
  gameName: string
  points: number
  note?: string
}

export async function addScoreAction({ teamId, gameName, points, note }: AddScoreParams) {
  const supabase = createServerClient()
  const { error } = await supabase.rpc('add_score', {
    p_team_id: teamId,
    p_game_name: gameName,
    p_points: points,
    p_note: note ?? null,
  })
  if (error) return { error: error.message }
  return { success: true }
}

export async function getTeamsAction() {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('teams')
    .select('*')
    .order('id')
  if (error) return { teams: [], error: error.message }
  return { teams: data }
}
