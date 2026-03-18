'use client'

import { useEffect, useState } from 'react'

export default function PcOnlyGuard({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(false)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    const check = () => {
      setIsMobile(window.innerWidth < 768)
      setChecked(true)
    }
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  if (!checked) return null

  if (isMobile) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center p-8">
        <div className="text-center text-white">
          <div className="text-6xl mb-4">💻</div>
          <h1 className="text-2xl font-bold mb-2">PC에서 접속해주세요</h1>
          <p className="text-light-blue">이 페이지는 PC 전용입니다.</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
