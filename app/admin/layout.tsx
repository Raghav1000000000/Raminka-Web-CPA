import { redirect } from 'next/navigation'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Admin routes now properly protected via (protected) route group
  return <>{children}</>
}