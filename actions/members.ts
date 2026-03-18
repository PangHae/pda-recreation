'use server'

import { createServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addMemberAction(name: string) {
  const supabase = createServerClient()
  const { error } = await supabase.from('members').insert({ name, team_id: null })
  if (error) return { error: error.message }
  revalidatePath('/admin/setup')
  return { success: true }
}

export async function deleteMemberAction(id: number) {
  const supabase = createServerClient()
  await supabase.from('members').delete().eq('id', id)
  revalidatePath('/admin/setup')
}

export async function assignMemberTeamAction(memberId: number, teamId: number | null) {
  const supabase = createServerClient()
  await supabase.from('members').update({ team_id: teamId }).eq('id', memberId)
  revalidatePath('/admin/setup')
}

export async function autoAssignTeamsAction(memberIds: number[]) {
  // Distribute members as evenly as possible across 3 teams
  const supabase = createServerClient()
  const { data: teams } = await supabase.from('teams').select('id').order('id')
  if (!teams || teams.length === 0) return { error: '팀이 없습니다.' }

  const shuffled = [...memberIds].sort(() => Math.random() - 0.5)
  for (let i = 0; i < shuffled.length; i++) {
    const teamId = teams[i % teams.length].id
    await supabase.from('members').update({ team_id: teamId }).eq('id', shuffled[i])
  }
  revalidatePath('/admin/setup')
  return { success: true }
}
