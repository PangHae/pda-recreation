'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Question } from '@/lib/supabase/types'
import Button from '@/components/ui/Button'

type Props = { questions: Question[] }

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function FlagQuiz({ questions }: Props) {
  const [deck, setDeck] = useState<Question[]>(() => shuffle(questions))
  const [index, setIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)

  if (questions.length === 0) {
    return (
      <div className="text-center text-white/60 text-2xl">
        국기 퀴즈 문항이 없습니다.<br />
        <span className="text-base">Supabase에서 game_type=&apos;flag-quiz&apos; 문항을 추가하세요.</span>
      </div>
    )
  }

  const q = deck[index]
  function next() {
    if (index >= deck.length - 1) {
      setDeck(shuffle(questions))
      setIndex(0)
    } else {
      setIndex(i => i + 1)
    }
    setRevealed(false)
  }

  return (
    <div className="flex flex-col items-center justify-center gap-8 w-full">
      <p className="text-light-blue text-xl">{index + 1} / {deck.length}</p>

      {/* Flag image */}
      {q.image_url ? (
        <div className="relative w-[600px] h-[400px] rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20">
          <Image src={q.image_url} alt="국기" fill className="object-contain" unoptimized />
        </div>
      ) : (
        <div className="w-[600px] h-[400px] rounded-2xl bg-white/10 border-2 border-dashed border-white/30 flex items-center justify-center">
          <p className="text-white/40">이미지 없음</p>
        </div>
      )}

      {revealed && (
        <div className="bg-white/20 rounded-2xl px-10 py-6 animate-in fade-in">
          <p className="text-5xl font-black text-yellow-300 text-center">{q.answer}</p>
          {q.hint && <p className="text-sky-blue text-xl text-center mt-2">{q.hint}</p>}
        </div>
      )}

      <div className="flex gap-4 flex-wrap justify-center">
        {!revealed && (
          <Button variant="ghost" size="lg" onClick={() => setRevealed(true)}>정답 공개</Button>
        )}
        <Button size="lg" onClick={next}>다음</Button>
        <Button variant="secondary" size="lg" onClick={next}>패스</Button>
      </div>
    </div>
  )
}
