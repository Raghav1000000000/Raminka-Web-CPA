import { cookies } from 'next/headers'

// Server-only authentication utilities
// DO NOT import this file from client components

export async function checkAdminAuth(): Promise<boolean> {
  try {
    const cookieStore = await cookies()
    const adminSession = cookieStore.get('admin_session')
    return adminSession?.value === 'authenticated'
  } catch (error) {
    return false
  }
}