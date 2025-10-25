'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, X, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { ChatbotErrorBoundary } from './ChatbotErrorBoundary';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// Internal component wrapped by error boundary
function ChatbotContent() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hello! I'm your FocusFactory AI assistant. How can I help you with your studies today?",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      setError(null);
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to get response from AI');
      }

      const data = await response.json();
      setMessages((prev) => [...prev, { role: 'assistant', content: data.content }]);
      setRetryCount(0); // Reset retry count on success
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = (error as Error).message || 'An unexpected error occurred';
      setError(errorMessage);

      // Show a more helpful message if it's an API key issue
      if (errorMessage.includes('GEMINI_API_KEY')) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: 'The chatbot needs to be configured with a Gemini API key. Please visit https://makersuite.google.com/app/apikey to get your key, then add it to the .env file as GEMINI_API_KEY=your_key_here',
          },
        ]);
      } else if (retryCount < 2) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: 'Sorry, I encountered an error. Please try sending your message again.',
          },
        ]);
        setRetryCount(prev => prev + 1);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-white text-black rounded-full p-4 shadow-lg hover:bg-gray-100 transition-colors duration-200 z-50"
        aria-label="Open chat"
      >
        <Bot className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-full max-w-md z-50">
      <Card className="w-full h-[600px] flex flex-col bg-white/95 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b">
          <div className="flex items-center space-x-2">
            <Bot className="w-5 h-5 text-blue-500" />
            <CardTitle className="text-lg font-semibold">FocusFactory AI</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <ScrollArea className="flex-1 p-4">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <span className="ml-2 text-sm">{error}</span>
            </Alert>
          )}
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  'flex',
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                <div
                  className={cn(
                    'rounded-lg px-4 py-2 max-w-[80%]',
                    message.role === 'user'
                      ? 'bg-blue-500 text-white rounded-br-none'
                      : 'bg-gray-100 text-gray-800 rounded-bl-none'
                  )}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 rounded-lg rounded-bl-none px-4 py-2">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" />
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        <form onSubmit={handleSubmit} className="p-4 border-t">
          <div className="flex space-x-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading || !input.trim()}>
              <Send className="h-4 w-4 mr-2" />
              Send
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

// Export wrapped version
export function Chatbot() {
  return (
    <ChatbotErrorBoundary>
      <ChatbotContent />
    </ChatbotErrorBoundary>
  );
}