'use server'

import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import bcryptjs from 'bcryptjs'
import { adminLoginLimiter } from '@/src/lib/ratelimiter'

export async function authenticateAdmin(password: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Apply rate limiting before authentication
    const headersList = await headers()
    const forwarded = headersList.get('x-forwarded-for')
    const realIP = headersList.get('x-real-ip')
    const ip = forwarded ? forwarded.split(',')[0].trim() : (realIP || '127.0.0.1')
    
    const { success: rateLimitSuccess } = await adminLoginLimiter.limit(`login:${ip}`)
    
    if (!rateLimitSuccess) {
      return { success: false, error: 'Authentication failed' }
    }

    const adminPasswordHashB64 = process.env.ADMIN_PASSWORD_HASH_B64
    
    if (!adminPasswordHashB64) {
      console.error('❌ ADMIN_PASSWORD_HASH_B64 environment variable not set')
      return { success: false, error: 'Server configuration error' }
    }

    // Decode base64 hash
    const adminPasswordHash = Buffer.from(adminPasswordHashB64, 'base64').toString()

    // Compare provided password with hashed password
    const isValid = await bcryptjs.compare(password, adminPasswordHash)
    console.log('✅ Password comparison result:', isValid)
    
    if (isValid) {
      console.log('🎉 Authentication successful, setting cookie...')
      // Set HTTP-only cookie for 8 hours
      const cookieStore = await cookies()
      cookieStore.set({
        name: 'admin_session',
        value: 'authenticated',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 8 * 60 * 60, // 8 hours
        path: '/'
      })
      
      return { success: true }
    } else {
      console.log('❌ Password comparison failed')
      return { success: false, error: 'Invalid password' }
    }
  } catch (error) {
    console.error('💥 Authentication error:', error)
    return { success: false, error: 'Authentication failed' }
  }
}

export async function logoutAdmin() {
  const cookieStore = await cookies()
  cookieStore.delete('admin_session')
  redirect('/admin/login')
}