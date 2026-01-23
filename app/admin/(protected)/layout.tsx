import { redirect } from 'next/navigation'
import { checkAdminAuth } from '@/src/lib/auth'

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const isAuthenticated = await checkAdminAuth()
  
  if (!isAuthenticated) {
    redirect('/admin/login')
  }

  return <>{children}</>
}