import { NextResponse } from 'next/server';

export async function GET() {
  // Debug endpoint to check environment variables
  return NextResponse.json({
    gemini_api_key_exists: !!process.env.GEMINI_API_KEY,
    gemini_api_key_length: process.env.GEMINI_API_KEY?.length || 0,
    gemini_api_key_first_chars: process.env.GEMINI_API_KEY?.substring(0, 10) || 'NOT_FOUND',
    node_env: process.env.NODE_ENV,
    all_env_keys: Object.keys(process.env).filter(key => 
      key.includes('GEMINI') || key.includes('SUPABASE') || key.includes('CLERK')
    ),
  });
}
