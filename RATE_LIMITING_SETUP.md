# Rate Limiting Setup with Upstash Redis

## Quick Setup

1. **Create Upstash Redis Database:**
   - Go to https://console.upstash.com/
   - Sign up/login with GitHub
   - Click "Create Database"
   - Choose a name and region
   - Select "Free" plan

2. **Get Your Credentials:**
   - In your database dashboard, go to "Details" tab
   - Copy the `UPSTASH_REDIS_REST_URL`
   - Copy the `UPSTASH_REDIS_REST_TOKEN`

3. **Update Environment Variables:**
   ```bash
   # In .env.local
   UPSTASH_REDIS_REST_URL=https://your-database.upstash.io
   UPSTASH_REDIS_REST_TOKEN=your-token-here
   ```

## Rate Limits Applied

- **Contact Form:** 5 submissions per minute per IP
- **Admin Login:** 5 attempts per 10 minutes per IP

## Testing Rate Limits

1. **Contact Form:**
   - Submit the contact form 6 times quickly
   - 6th attempt should return "Too many requests"

2. **Admin Login:**
   - Try login 6 times quickly
   - 6th attempt should return "Authentication failed"

## Features

- ✅ Scoped to specific routes only
- ✅ No global middleware
- ✅ Edge Runtime compatible
- ✅ No breaking changes to existing functionality
- ✅ Server-side only (no client state)
- ✅ Graceful error handling