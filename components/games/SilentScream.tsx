'use client'

import { useState } from 'react'
import { Question } from '@/lib/supabase/types'
import Button from '@/components/ui/Button'

type Props = { questions: Question[] }

export default function SilentScream({ questions }: Props) {
  const [index, setIndex] = useState(0)

  if (questions.length === 0) {
    return (
      <div className="text-center text-white/60 text-2xl">
        문항이 없습니다.<br />
        <span className="text-base">Supabase에서 game_type=&apos;silent-scream&apos; 문항을 추가하세요.</span>
      </div>
    )
  }

  const q = questions[index]
  const isLast = index >= questions.length - 1
  function next() { setIndex(i => Math.min(i + 1, questions.length - 1)) }

  return (
    <div className="flex flex-col items-center justify-center gap-8 w-full">
      <p className="text-light-blue text-xl">{index + 1} / {questions.length}</p>

      {/* Large word display */}
      <div
        className="text-white font-black text-center leading-none"
        style={{ fontSize: `clamp(4rem, 15vw, 12rem)` }}
      >
        {q.content}
      </div>

      <div className="flex gap-4">
        <Button size="lg" onClick={next} disabled={isLast}>다음</Button>
        <Button variant="secondary" size="lg" onClick={next} disabled={isLast}>패스</Button>
      </div>
    </div>
  )
}
