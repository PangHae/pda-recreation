export const dynamic = 'force-dynamic'

import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import LoginForm from '@/components/admin/LoginForm'

export default async function AdminLoginPage() {
  const session = await getSession()
  if (session.isAdmin) redirect('/admin/menu')

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-1">PDA 레크레이션</h1>
          <p className="text-light-blue text-sm">관리자 로그인</p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
