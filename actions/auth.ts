'use server'

import bcrypt from 'bcryptjs'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { createServerClient } from '@/lib/supabase/server'

export async function loginAction(formData: FormData) {
  const password = formData.get('password') as string
  if (!password) return { error: '비밀번호를 입력해주세요.' }

  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('settings')
    .select('value')
    .eq('key', 'admin_password_hash')
    .single()

  if (error || !data) return { error: '서버 오류가 발생했습니다.' }

  const valid = await bcrypt.compare(password, data.value)
  if (!valid) return { error: '비밀번호가 올바르지 않습니다.' }

  const session = await getSession()
  session.isAdmin = true
  await session.save()

  redirect('/admin/menu')
}

export async function logoutAction() {
  const session = await getSession()
  session.destroy()
  redirect('/admin')
}
