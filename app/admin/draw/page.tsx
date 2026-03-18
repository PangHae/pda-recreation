export const dynamic = 'force-dynamic'

import PcOnlyGuard from '@/components/ui/PcOnlyGuard'
import DrawAnimation from '@/components/draw/DrawAnimation'
import { getTeamsWithMembers } from '@/actions/teams'
import Link from 'next/link'

export default async function DrawPage() {
  const { teams, members } = await getTeamsWithMembers()

  return (
    <PcOnlyGuard>
      <div className="min-h-screen bg-navy p-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-black text-white">팀 추첨</h1>
              <p className="text-light-blue text-sm mt-1">버튼을 눌러 팀을 공개하세요</p>
            </div>
            <Link href="/admin/menu" className="text-light-blue hover:text-white text-sm">
              ← 메뉴
            </Link>
          </div>

          <DrawAnimation teams={teams} members={members} />
        </div>
      </div>
    </PcOnlyGuard>
  )
}
