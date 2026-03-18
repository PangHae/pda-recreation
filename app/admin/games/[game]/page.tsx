export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import PcOnlyGuard from '@/components/ui/PcOnlyGuard'
import ChoSungQuiz from '@/components/games/ChoSungQuiz'
import SilentScream from '@/components/games/SilentScream'
import FlagQuiz from '@/components/games/FlagQuiz'
import ISim from '@/components/games/ISim'
import BlackWhiteChef from '@/components/games/BlackWhiteChef'
import { createServerClient } from '@/lib/supabase/server'
import { GAMES } from '@/lib/constants'
import Link from 'next/link'
import { GameSlug } from '@/lib/supabase/types'

type Props = {
  params: Promise<{ game: string }>
}

export default async function GamePage({ params }: Props) {
  const { game } = await params
  const gameInfo = GAMES.find(g => g.slug === game)
  if (!gameInfo) notFound()

  const supabase = createServerClient()
  const slug = game as GameSlug

  let content: React.ReactNode

  if (slug === 'black-white-chef') {
    const { data: snacks } = await supabase
      .from('snacks')
      .select('*')
      .order('order')
    content = <BlackWhiteChef snacks={snacks ?? []} />
  } else {
    const { data: questions } = await supabase
      .from('questions')
      .select('*')
      .eq('game_type', slug)
      .order('order')
    if (slug === 'cho-sung') content = <ChoSungQuiz questions={questions ?? []} />
    else if (slug === 'silent-scream') content = <SilentScream questions={questions ?? []} />
    else if (slug === 'flag-quiz') content = <FlagQuiz questions={questions ?? []} />
    else if (slug === 'i-sim') content = <ISim questions={questions ?? []} />
    else notFound()
  }

  return (
    <PcOnlyGuard>
      <div className="min-h-screen bg-navy flex flex-col">
        {/* Top bar */}
        <div className="flex items-center justify-between px-8 py-4 border-b border-white/10">
          <h1 className="text-2xl font-black text-white">
            {gameInfo.emoji} {gameInfo.name}
          </h1>
          <Link href="/admin/games" className="text-light-blue hover:text-white text-sm">
            ← 게임 목록
          </Link>
        </div>

        {/* Game content */}
        <div className="flex-1 flex items-center justify-center p-8">
          {content}
        </div>
      </div>
    </PcOnlyGuard>
  )
}
