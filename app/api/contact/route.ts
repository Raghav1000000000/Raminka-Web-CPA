import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/src/lib/supabase'
import { contactLimiter, getClientIP } from '@/src/lib/ratelimiter'

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting only if Redis is configured
    if (contactLimiter) {
      const ip = getClientIP(request)
      const { success } = await contactLimiter.limit(`contact:${ip}`)
      
      if (!success) {
        return NextResponse.json(
          { error: "Too many requests. Please try again later." },
          { status: 429 }
        )
      }
    }

    // Parse request body with error handling
    let body;
    try {
      body = await request.json()
    } catch (parseError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }

    const { name, email, phone, message } = body

    // Validate required fields
    if (!name || !email || !message || typeof name !== 'string' || typeof email !== 'string' || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      )
    }

    // Validate field lengths with null safety
    if (name.length > 255 || email.length > 255 || message.length > 5000 || (phone && typeof phone === 'string' && phone.length > 50)) {
      return NextResponse.json(
        { error: 'Input fields exceed maximum length' },
        { status: 400 }
      )
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Insert into Supabase
    const { data, error } = await supabase
      .from('contacts')
      .insert([{ name, email, phone, message }])
      .select()

    if (error) {
      console.error('Supabase error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      
      // Handle common database errors more specifically
      if (error.message?.includes('relation "contacts" does not exist')) {
        return NextResponse.json(
          { error: 'Service temporarily unavailable. Please try again later.' },
          { status: 503 }
        )
      }
      
      return NextResponse.json(
        { error: 'Failed to submit contact form. Please try again later.' },
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