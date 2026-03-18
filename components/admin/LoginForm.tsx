'use client'

import { useActionState } from 'react'
import { loginAction } from '@/actions/auth'
import Button from '@/components/ui/Button'

export default function LoginForm() {
  const [state, action, pending] = useActionState(
    async (_: { error?: string } | null, formData: FormData) => {
      return await loginAction(formData)
    },
    null
  )

  return (
    <form action={action} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-light-blue mb-1">
          관리자 비밀번호
        </label>
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/30 text-white placeholder-white/40 focus:outline-none focus:border-sky-blue text-lg"
          placeholder="비밀번호 입력"
          required
        />
      </div>
      {state?.error && (
        <p className="text-red-400 text-sm">{state.error}</p>
      )}
      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? '로그인 중...' : '로그인'}
      </Button>
    </form>
  )
}
