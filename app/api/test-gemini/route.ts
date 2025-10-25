import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export async function GET() {
   const apiKey = process.env.GEMINI_API_KEY;

   if (!apiKey) {
      console.error('API Key is missing');
      return NextResponse.json({
         status: 'error',
         message: 'API key is not configured',
         envVars: Object.keys(process.env).filter(key => !key.includes('KEY')), // Safe list of env vars
      });
   }

   try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

      // Simple test to verify API connection
      const result = await model.generateContent('Say "OK" if you can hear me.');
      const response = await result.response;
      const text = response.text();

      return NextResponse.json({
         status: 'success',
         message: 'API key is valid and working',
         test_response: text,
      });
   } catch (error) {
      console.error('Error testing API:', error);
      return NextResponse.json({
         status: 'error',
         message: 'API key is present but there was an error',
         error: (error as Error).message
      }, { status: 500 });
   }
}