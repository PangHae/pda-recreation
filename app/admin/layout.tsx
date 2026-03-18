import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // /admin (login page) is handled by middleware — skip check here
  // The middleware redirects unauthenticated users from /admin/* already
  return <>{children}</>
}
