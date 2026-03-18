'use client'

import { useState } from 'react'
import { Question } from '@/lib/supabase/types'
import Countdown from '@/components/ui/Countdown'
import Button from '@/components/ui/Button'

type Props = { questions: Question[] }
type Stage = 'theme' | 'word' | 'countdown' | 'result'

// Group questions by hint (theme)
function groupByTheme(questions: Question[]): Record<string, Question[]> {
  return questions.reduce<Record<string, Question[]>>((acc, q) => {
    const theme = q.hint ?? '기타'
    if (!acc[theme]) acc[theme] = []
    acc[theme].push(q)
    return acc
  }, {})
}

export default function ISim({ questions }: Props) {
  const grouped = groupByTheme(questions)
  const themes = Object.keys(grouped)

  const [stage, setStage] = useState<Stage>('theme')
  const [selectedTheme, setSelectedTheme] = useState('')
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState<'match' | 'no-match' | null>(null)

  const currentQuestions = grouped[selectedTheme] ?? []
  const q = currentQuestions[index]

  if (questions.length === 0) {
    return (
      <div className="text-center text-white/60 text-2xl">
        이심전심 문항이 없습니다.<br />
        <span className="text-base">game_type=&apos;i-sim&apos;, hint=테마명 으로 추가하세요.</span>
      </div>
    )
  }

  if (stage === 'theme') {
    return (
      <div className="flex flex-col items-center gap-8">
        <h2 className="text-4xl font-black text-white">테마를 선택하세요</h2>
        <div className="grid grid-cols-2 gap-4 w-full max-w-xl">
          {themes.map(theme => (
            <button
              key={theme}
              onClick={() => { setSelectedTheme(theme); setIndex(0); setStage('word') }}
              className="py-6 px-4 bg-white/10 hover:bg-shinhan-blue border border-white/20 rounded-2xl text-white text-2xl font-bold transition-all hover:scale-105"
            >
              {theme}
            </button>
          ))}
        </div>
      </div>
    )
  }

  if (stage === 'word' && q) {
    return (
      <div className="flex flex-col items-center gap-8">
        <p className="text-light-blue text-xl">테마: {selectedTheme} — {index + 1}/{currentQuestions.length}</p>
        <div
          className="text-white font-black text-center leading-none"
          style={{ fontSize: 'clamp(5rem, 18vw, 14rem)' }}
        >
          {q.content}
        </div>
        <Button size="xl" onClick={() => setStage('countdown')}>
          3초 카운트다운 시작
        </Button>
      </div>
    )
  }

  if (stage === 'countdown') {
    return (
      <div className="flex flex-col items-center justify-center gap-8 h-64">
        <Countdown from={3} onComplete={() => setStage('result')} />
      </div>
    )
  }

  if (stage === 'result') {
    return (
      <div className="flex flex-col items-center gap-8">
        <p className="text-light-blue text-2xl">결과는?</p>
        <div className="flex gap-6">
          <button
            onClick={() => { setScore('match'); setTimeout(() => nextQuestion(), 1500) }}
            className="px-10 py-6 bg-green-500 hover:bg-green-600 text-white text-3xl font-black rounded-2xl transition-all"
          >
            ✅ 일치
          </button>
          <button
            onClick={() => { setScore('no-match'); setTimeout(() => nextQuestion(), 1500) }}
            className="px-10 py-6 bg-red-500 hover:bg-red-600 text-white text-3xl font-black rounded-2xl transition-all"
          >
            ❌ 불일치
          </button>
        </div>
        {score && (
          <p className="text-5xl font-black animate-bounce">
            {score === 'match' ? '🎉 일치!' : '😅 불일치'}
          </p>
        )}
      </div>
    )
  }

  return null

  function nextQuestion() {
    setScore(null)
    if (index + 1 < currentQuestions.length) {
      setIndex(i => i + 1)
      setStage('word')
    } else {
      setStage('theme')
    }
  }
}
