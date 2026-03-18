'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Snack } from '@/lib/supabase/types'
import Button from '@/components/ui/Button'

type Props = { snacks: Snack[] }

export default function BlackWhiteChef({ snacks }: Props) {
  const [index, setIndex] = useState(0)

  if (snacks.length === 0) {
    return (
      <div className="text-center text-white/60 text-2xl">
        흑백요리사 과자 데이터가 없습니다.<br />
        <span className="text-base">Supabase snacks 테이블에 과자 이름과 사진을 추가하세요.</span>
      </div>
    )
  }

  const snack = snacks[index]
  const isLast = index >= snacks.length - 1

  return (
    <div className="flex flex-col items-center gap-8">
      <p className="text-light-blue text-xl">{index + 1} / {snacks.length}</p>

      {/* Snack image */}
      {snack.image_url ? (
        <div className="relative w-[500px] h-[400px] rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20">
          <Image src={snack.image_url} alt={snack.name} fill className="object-contain bg-white" unoptimized />
        </div>
      ) : (
        <div className="w-[500px] h-[400px] rounded-2xl bg-white/10 border-2 border-dashed border-white/30 flex items-center justify-center">
          <p className="text-white/40 text-lg">이미지 없음</p>
        </div>
      )}

      {/* Snack name — visible to audience */}
      <div className="text-5xl font-black text-white text-center">{snack.name}</div>

      <Button size="xl" onClick={() => setIndex(i => Math.min(i + 1, snacks.length - 1))} disabled={isLast}>
        다음
      </Button>
    </div>
  )
}
