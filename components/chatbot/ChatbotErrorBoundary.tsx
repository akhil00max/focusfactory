'use client';

import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
   children: ReactNode;
}

interface State {
   hasError: boolean;
}

export class ChatbotErrorBoundary extends Component<Props, State> {
   public state: State = {
      hasError: false
   };

   public static getDerivedStateFromError(): State {
      return { hasError: true };
   }

   public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
      console.error('Chatbot Error:', error, errorInfo);
   }

   public render() {
      if (this.state.hasError) {
         return (
            <div className="fixed bottom-6 right-6">
               <button
                  onClick={() => this.setState({ hasError: false })}
                  className="bg-white text-black rounded-full p-4 shadow-lg hover:bg-gray-100 transition-colors duration-200"
                  aria-label="Restart chat"
               >
                  <svg
                     xmlns="http://www.w3.org/2000/svg"
                     width="24"
                     height="24"
                     viewBox="0 0 24 24"
                     fill="none"
                     stroke="currentColor"
                     strokeWidth="2"
                     strokeLinecap="round"
                     strokeLinejoin="round"
                  >
                     <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                     <path d="M3 3v5h5" />
                     <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                     <path d="M21 21v-5h-5" />
                  </svg>
               </button>
            </div>
         );
      }

      return this.props.children;
   }
}