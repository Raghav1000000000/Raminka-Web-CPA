import { NextResponse } from 'next/server'

export async function GET() {
  const hasB64Hash = !!process.env.ADMIN_PASSWORD_HASH_B64
  let decodedHash = ''
  
  if (hasB64Hash) {
    try {
      decodedHash = Buffer.from(process.env.ADMIN_PASSWORD_HASH_B64!, 'base64').toString()
    } catch (e) {
      decodedHash = 'DECODE_ERROR'
    }
  }
  
  return NextResponse.json({
    nodeEnv: process.env.NODE_ENV,
    hasAdminHash: !!process.env.ADMIN_PASSWORD_HASH,
    hasAdminHashB64: hasB64Hash,
    b64HashLength: process.env.ADMIN_PASSWORD_HASH_B64?.length || 0,
    decodedHashLength: decodedHash.length,
    decodedHashPreview: decodedHash.substring(0, 10) + '...',
    allEnvKeys: Object.keys(process.env).filter(key => key.includes('ADMIN')),
  })
}