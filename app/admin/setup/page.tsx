export const dynamic = 'force-dynamic'

import PcOnlyGuard from '@/components/ui/PcOnlyGuard'
import TeamSetupForm from '@/components/admin/TeamSetupForm'
import { getTeamsWithMembers } from '@/actions/teams'
import { resetScoresAction } from '@/actions/teams'
import Link from 'next/link'
import Button from '@/components/ui/Button'

export default async function SetupPage() {
  const { teams, members } = await getTeamsWithMembers()

  return (
    <PcOnlyGuard>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">팀 구성 설정</h1>
              <p className="text-gray-500 text-sm">팀원을 추가하고 팀에 배정하세요.</p>
            </div>
            <div className="flex items-center gap-3">
              <form action={resetScoresAction}>
                <Button type="submit" variant="danger" size="sm">점수 초기화</Button>
              </form>
              <Link href="/admin/menu" className="text-sm text-shinhan-blue hover:underline">
                ← 메뉴
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <TeamSetupForm teams={teams} members={members} />
          </div>
        </div>
      </div>
    </PcOnlyGuard>
  )
}
