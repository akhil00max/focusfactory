import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

// Initialize the Google Generative AI client using unified env var
const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
if (!apiKey) {
  console.error('Neither GEMINI_API_KEY nor NEXT_PUBLIC_GEMINI_API_KEY is set in environment variables');
}
const genAI = new GoogleGenerativeAI(apiKey || '');

// System prompt to guide the AI's behavior
const SYSTEM_PROMPT = `You are a helpful AI assistant for FocusFactory, a productivity app. 
Your role is to help users with:
- Study techniques and focus strategies
- Time management and productivity tips
- Answering questions about the app's features
- Providing motivation and accountability

Keep responses concise, helpful, and focused on productivity and learning.`;

export async function POST(req: Request) {
  try {
    if (!apiKey) {
      console.error('API Key status:', {
        exists: !!process.env.GEMINI_API_KEY,
        envVars: Object.keys(process.env).filter(key => !key.includes('KEY')), // Safe list of env vars
      });
      return NextResponse.json(
        { error: 'Chatbot is not configured. Please verify your GEMINI_API_KEY in the .env file and restart the server.' },
        { status: 500 }
      )
    }
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    // Get the Gemini Pro model
    const model = genAI.getGenerativeModel({
      model: 'gemini-pro',
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      },
    });

    // Prepare the chat history
    const chatHistory = [
      {
        role: 'user',
        parts: [{ text: SYSTEM_PROMPT }],
      },
      {
        role: 'model',
        parts: [{ text: 'Hello! I\'m your FocusFactory AI assistant. How can I help you with your studies today?' }],
      },
      ...messages.slice(1).map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      })),
    ];

    // Get the last message
    const lastMessage = messages[messages.length - 1].content;

    // Start a chat session with the full history
    const chat = model.startChat({
      history: chatHistory.slice(0, -1),
    });

    // Send the last message
    const result = await chat.sendMessage(lastMessage);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ content: text });
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: 'Sorry, I encountered an error. Please try again later.' },
      { status: 500 }
    );
  }
}
