"use client"

import { Card } from "@/components/ui/card"
import { ExternalLink, Youtube, BookOpen, FileText, AlertCircle } from "lucide-react"
import { Button } from "./ui/button"
import { useEffect, useState } from "react"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'

interface OutputPanelProps {
  data: {
    studyPlan: string
    resources: {
      video: string
      documentation: string
      exercises: string
    }
    subject?: string
    time?: string
    subTopic?: string
    format?: 'markdown' | 'plain'
  }
}

// Component to render YouTube video thumbnails
const YouTubeThumbnail = ({ url }: { url: string }) => {
  if (!url) return null;
  
  // Extract video ID from various YouTube URL formats
  const getVideoId = (url: string) => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
    const match = url.match(regExp)
    return (match && match[7].length === 11) ? match[7] : null
  }

  const videoId = getVideoId(url)
  if (!videoId) return null

  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="block mb-3">
      <div className="relative aspect-video bg-gray-800 rounded-md overflow-hidden">
        <img 
          src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`} 
          onError={(e) => {
            // Fallback to a lower resolution thumbnail if maxres is not available
            const target = e.target as HTMLImageElement;
            target.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
          }}
          alt="YouTube Thumbnail"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/20 transition-colors">
          <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-white ml-1" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>
    </a>
  )
}

// Component to render markdown content
const MarkdownContent = ({ content }: { content: string }) => {
  return (
    <div className="prose prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700" {...props} />
            </div>
          ),
          th: ({ node, ...props }) => (
            <th className="px-4 py-3 bg-gray-800 text-left text-xs font-medium text-gray-300 uppercase tracking-wider" {...props} />
          ),
          td: ({ node, ...props }) => (
            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300 border-t border-gray-700" {...props} />
          ),
          h1: ({ node, ...props }) => (
            <h1 className="text-2xl font-bold text-white mb-4" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-xl font-semibold text-white mt-6 mb-3 pb-2 border-b border-gray-700" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-lg font-medium text-white mt-5 mb-2" {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul className="list-disc pl-5 space-y-1 my-2" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal pl-5 space-y-1 my-2" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className="text-gray-300" {...props} />
          ),
          a: ({ node, ...props }) => (
            <a 
              className="text-blue-400 hover:text-blue-300 hover:underline" 
              target="_blank" 
              rel="noopener noreferrer"
              {...props} 
            />
          ),
          code: ({ node, inline, ...props }) => {
            if (inline) {
              return <code className="bg-gray-700 text-pink-300 px-1.5 py-0.5 rounded text-sm" {...props} />
            }
            return (
              <pre className="bg-gray-800 p-4 rounded-md overflow-x-auto my-4">
                <code className="text-sm" {...props} />
              </pre>
            )
          },
          blockquote: ({ node, ...props }) => (
            <blockquote className="border-l-4 border-gray-600 pl-4 italic text-gray-400 my-4" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

export function OutputPanel({ data }: OutputPanelProps) {
  const { studyPlan, resources, format = 'markdown' } = data || {}
  const [isClient, setIsClient] = useState(false)
  const hasResources = resources?.video || resources?.documentation || resources?.exercises

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) return null

  // Function to extract video ID from YouTube URL
  const getYoutubeThumbnail = (url: string) => {
    if (!url) return null;
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
    const match = url.match(regExp)
    return (match && match[7].length === 11) ? `https://img.youtube.com/vi/${match[7]}/hqdefault.jpg` : null
  }

  return (
    <div className="space-y-6">
      <Card className="bg-white/5 border-white/10 backdrop-blur-sm p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Your Study Plan</h2>
            {data?.subject && (
              <p className="text-white/60 text-sm sm:text-base">
                {data.subject} {data.subTopic && `• ${data.subTopic}`} {data.time && `• ${data.time} min`}
              </p>
            )}
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-white/5 border-white/10 hover:bg-white/10 text-white/90"
            onClick={() => window.print()}
          >
            Print Plan
          </Button>
        </div>

        <div className="text-white/90">
          {format === 'markdown' ? (
            <MarkdownContent content={studyPlan} />
          ) : (
            <div className="whitespace-pre-wrap leading-relaxed">
              {studyPlan}
            </div>
          )}
        </div>
      </Card>

      {hasResources && (
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm p-6 sm:p-8">
          <h3 className="text-xl font-bold text-white mb-6">Recommended Resources</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {resources.video && (
              <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden hover:bg-white/10 transition-colors">
                <div className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Youtube className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <h4 className="font-medium text-white">Video Tutorial</h4>
                  </div>
                  <YouTubeThumbnail url={resources.video} />
                  <a 
                    href={resources.video} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 hover:underline text-sm flex items-center gap-1.5 mt-2"
                  >
                    Watch on YouTube <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            )}

            {resources.documentation && (
              <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden hover:bg-white/10 transition-colors">
                <div className="p-4 h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-3">
                    <BookOpen className="w-5 h-5 text-blue-400 flex-shrink-0" />
                    <h4 className="font-medium text-white">Documentation</h4>
                  </div>
                  <p className="text-sm text-gray-300 mb-4 flex-grow">
                    Comprehensive guides and reference materials to deepen your understanding.
                  </p>
                  <div className="mt-auto">
                    <a 
                      href={resources.documentation} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 hover:underline text-sm flex items-center gap-1.5"
                    >
                      Open Documentation <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            )}

            {resources.exercises && (
              <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden hover:bg-white/10 transition-colors">
                <div className="p-4 h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-3">
                    <FileText className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <h4 className="font-medium text-white">Practice Exercises</h4>
                  </div>
                  <p className="text-sm text-gray-300 mb-4 flex-grow">
                    Hands-on exercises to apply what you've learned and test your knowledge.
                  </p>
                  <div className="mt-auto">
                    <a 
                      href={resources.exercises} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 hover:underline text-sm flex items-center gap-1.5"
                    >
                      Start Practicing <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  )
}
