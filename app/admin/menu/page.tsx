import Link from 'next/link'
import { logoutAction } from '@/actions/auth'
import Button from '@/components/ui/Button'

const menuItems = [
  { href: '/admin/dashboard', label: '점수 입력', emoji: '🏆', desc: '팀 점수 관리 (모바일)' },
  { href: '/admin/setup', label: '팀 구성 설정', emoji: '👥', desc: '팀원 배정 (PC 전용)' },
  { href: '/admin/draw', label: '팀 추첨', emoji: '🎲', desc: '팀 공개 애니메이션 (PC 전용)' },
  { href: '/admin/games', label: '게임 진행', emoji: '🎮', desc: '5가지 게임 화면 (PC 전용)' },
  { href: '/scoreboard', label: '스코어보드', emoji: '📊', desc: '실시간 점수 현황' },
]

export default function AdminMenuPage() {
  return (
    <div className="min-h-screen bg-navy p-6">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-1">관리자 메뉴</h1>
          <p className="text-light-blue text-sm">PDA 레크레이션 관리</p>
        </div>

        <div className="space-y-3 mb-8">
          {menuItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl p-4 transition-colors"
            >
              <span className="text-3xl">{item.emoji}</span>
              <div>
                <p className="text-white font-semibold">{item.label}</p>
                <p className="text-light-blue text-sm">{item.desc}</p>
              </div>
            </Link>
          ))}
        </div>

        <form action={logoutAction}>
          <Button variant="ghost" size="md" className="w-full" type="submit">
            로그아웃
          </Button>
        </form>
      </div>
    </div>
  )
}
