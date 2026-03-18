'use server'

import { createServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getTeamsWithMembers() {
  const supabase = createServerClient()
  const { data: teams } = await supabase.from('teams').select('*').order('id')
  const { data: members } = await supabase.from('members').select('*').order('id')
  return { teams: teams ?? [], members: members ?? [] }
}

export async function resetScoresAction() {
  const supabase = createServerClient()
  await supabase.from('teams').update({ total_score: 0 }).gt('id', 0)
  await supabase.from('score_logs').delete().gt('id', 0)
  revalidatePath('/scoreboard')
  revalidatePath('/admin/dashboard')
}
