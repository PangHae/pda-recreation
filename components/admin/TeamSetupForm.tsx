'use client'

import { useState, useTransition } from 'react'
import { addMemberAction, deleteMemberAction, assignMemberTeamAction } from '@/actions/members'
import { Team, Member } from '@/lib/supabase/types'
import Button from '@/components/ui/Button'

type Props = {
  teams: Team[]
  members: Member[]
}

export default function TeamSetupForm({ teams, members: initialMembers }: Props) {
  const [newName, setNewName] = useState('')
  const [isPending, startTransition] = useTransition()

  function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!newName.trim()) return
    startTransition(async () => {
      await addMemberAction(newName.trim())
      setNewName('')
    })
  }

  function handleDelete(id: number) {
    startTransition(async () => {
      await deleteMemberAction(id)
    })
  }

  function handleAssign(memberId: number, teamId: string) {
    startTransition(async () => {
      await assignMemberTeamAction(memberId, teamId ? parseInt(teamId) : null)
    })
  }

  const unassigned = initialMembers.filter(m => !m.team_id)

  return (
    <div className="space-y-8">
      {/* Add member */}
      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          type="text"
          value={newName}
          onChange={e => setNewName(e.target.value)}
          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-shinhan-blue text-gray-900"
          placeholder="팀원 이름"
        />
        <Button type="submit" size="md" disabled={isPending || !newName.trim()}>
          추가
        </Button>
      </form>

      {/* Unassigned members */}
      {unassigned.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-700 mb-2">미배정 ({unassigned.length}명)</h3>
          <div className="space-y-2">
            {unassigned.map(m => (
              <MemberRow key={m.id} member={m} teams={teams} onAssign={handleAssign} onDelete={handleDelete} />
            ))}
          </div>
        </div>
      )}

      {/* Team columns */}
      <div className="grid grid-cols-3 gap-4">
        {teams.map(team => {
          const teamMembers = initialMembers.filter(m => m.team_id === team.id)
          return (
            <div key={team.id} className="rounded-xl p-4" style={{ background: team.color + '22', border: `2px solid ${team.color}` }}>
              <h3 className="font-bold mb-3" style={{ color: team.color }}>
                {team.name} ({teamMembers.length}명)
              </h3>
              <div className="space-y-2">
                {teamMembers.map(m => (
                  <MemberRow key={m.id} member={m} teams={teams} onAssign={handleAssign} onDelete={handleDelete} />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function MemberRow({
  member,
  teams,
  onAssign,
  onDelete,
}: {
  member: Member
  teams: Team[]
  onAssign: (id: number, teamId: string) => void
  onDelete: (id: number) => void
}) {
  return (
    <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 shadow-sm">
      <span className="flex-1 text-gray-900 font-medium">{member.name}</span>
      <select
        value={member.team_id ?? ''}
        onChange={e => onAssign(member.id, e.target.value)}
        className="text-sm border border-gray-200 rounded px-2 py-1 focus:outline-none"
      >
        <option value="">미배정</option>
        {teams.map(t => (
          <option key={t.id} value={t.id}>{t.name}</option>
        ))}
      </select>
      <button
        onClick={() => onDelete(member.id)}
        className="text-red-400 hover:text-red-600 text-sm px-1"
      >
        ✕
      </button>
    </div>
  )
}
