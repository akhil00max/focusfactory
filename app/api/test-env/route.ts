import { NextResponse } from 'next/server'

export async function GET() {
  // Manually set the environment variables for testing
  const supabaseUrl = 'https://gfrbqjeoqoufqxkpiaas.supabase.co'
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmcmJxamVvcW91ZnF4a3BpYWFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyMjAyODgsImV4cCI6MjA3Njc5NjI4OH0.G7rVZtth2aYuV7uY39NqrazqCZ4Fyfn7FuFTbU2W-zY'
  const geminiKey = 'AIzaSyBFTTIWrSm4CMy1YjmRlDv82YutJPYuftI'

  return NextResponse.json({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || supabaseUrl,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Present' : 'Missing',
    geminiKey: process.env.GEMINI_API_KEY ? 'Present' : 'Missing',
    nodeEnv: process.env.NODE_ENV,
    manualSupabaseUrl: supabaseUrl,
    manualSupabaseKey: supabaseKey ? 'Present' : 'Missing',
    manualGeminiKey: geminiKey ? 'Present' : 'Missing'
  })
}
