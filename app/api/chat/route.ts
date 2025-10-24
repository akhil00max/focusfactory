import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY || '');

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
