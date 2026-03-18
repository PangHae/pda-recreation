import PcOnlyGuard from '@/components/ui/PcOnlyGuard'
import { GAMES } from '@/lib/constants'
import Link from 'next/link'

export default function GamesPage() {
  return (
    <PcOnlyGuard>
      <div className="min-h-screen bg-navy flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-black text-white mb-2">게임 선택</h1>
            <p className="text-light-blue">진행할 게임을 선택하세요</p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {GAMES.map(game => (
              <Link
                key={game.slug}
                href={`/admin/games/${game.slug}`}
                className="flex items-center gap-5 bg-white/10 hover:bg-shinhan-blue border border-white/20 rounded-2xl p-5 transition-all duration-200 hover:scale-[1.02] group"
              >
                <span className="text-5xl">{game.emoji}</span>
                <span className="text-2xl font-bold text-white">{game.name}</span>
                <span className="ml-auto text-white/40 group-hover:text-white text-xl">→</span>
              </Link>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link href="/admin/menu" className="text-light-blue hover:text-white text-sm">
              ← 메뉴로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    </PcOnlyGuard>
  )
}
