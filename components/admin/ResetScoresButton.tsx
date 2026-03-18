'use client'

import { useState } from 'react'
import { resetScoresAction } from '@/actions/scores'
import Button from '@/components/ui/Button'

export default function ResetScoresButton() {
  const [confirming, setConfirming] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  async function handleReset() {
    setLoading(true)
    setMessage(null)
    const result = await resetScoresAction()
    setLoading(false)
    setConfirming(false)
    if (result.error) {
      setMessage(`오류: ${result.error}`)
    } else {
      setMessage('전체 점수가 초기화되었습니다.')
    }
  }

  if (confirming) {
    return (
      <div className="bg-red-500/20 border border-red-400/40 rounded-xl p-4 space-y-3">
        <p className="text-white font-semibold text-center">정말 초기화하시겠습니까?</p>
        <p className="text-red-300 text-sm text-center">모든 팀 점수와 점수 기록이 삭제됩니다.</p>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="md"
            className="flex-1"
            onClick={() => setConfirming(false)}
            disabled={loading}
          >
            취소
          </Button>
          <button
            onClick={handleReset}
            disabled={loading}
            className="flex-1 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white font-bold rounded-xl py-2 transition-colors"
          >
            {loading ? '초기화 중...' : '초기화'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <Button
        variant="ghost"
        size="md"
        className="w-full border-red-400/40 text-red-300 hover:bg-red-500/20"
        onClick={() => { setMessage(null); setConfirming(true) }}
      >
        전체 점수 초기화
      </Button>
      {message && (
        <p className="text-center text-sm text-light-blue">{message}</p>
      )}
    </div>
  )
}
