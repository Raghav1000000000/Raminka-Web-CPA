import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/src/lib/supabase'
import { contactLimiter, getClientIP } from '@/src/lib/ratelimiter'

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const ip = getClientIP(request)
    const { success } = await contactLimiter.limit(`contact:${ip}`)
    
    if (!success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      )
    }

    // Parse request body
    const { name, email, phone, message } = await request.json()

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      )
    }

    // Insert into Supabase
    const { data, error } = await supabase
      .from('contacts')
      .insert([{ name, email, phone, message }])
      .select()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to submit contact form' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: 'Contact form submitted successfully', data },
      { status: 201 }
    )
  } catch (error) {
    console.error('Contact API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}