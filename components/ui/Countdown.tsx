'use client'

import { useEffect, useState } from 'react'

type Props = {
  from?: number
  onComplete?: () => void
}

export default function Countdown({ from = 3, onComplete }: Props) {
  const [count, setCount] = useState(from)

  useEffect(() => {
    if (count <= 0) {
      onComplete?.()
      return
    }
    const t = setTimeout(() => setCount(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [count, onComplete])

  return (
    <div className="flex items-center justify-center">
      <span
        key={count}
        className="text-[20vw] font-black text-white animate-ping-once"
        style={{ lineHeight: 1 }}
      >
        {count > 0 ? count : '시작!'}
      </span>
    </div>
  )
}
