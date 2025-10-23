"use client"

import { Card } from "@/components/ui/card"
import { ExternalLink } from "lucide-react"

interface OutputPanelProps {
  data: any
}

export function OutputPanel({ data }: OutputPanelProps) {
  // Parse the AI response - adjust based on actual API response format
  const plan = data?.output || data?.plan || data?.content || JSON.stringify(data)

  return (
    <div className="space-y-6">
      <Card className="bg-white/5 border-white/10 backdrop-blur-sm p-8">
        <h2 className="text-2xl font-bold mb-6">Your Study Plan</h2>

        <div className="prose prose-invert max-w-none">
          <div className="text-white/80 whitespace-pre-wrap leading-relaxed">{plan}</div>
        </div>
      </Card>

      {/* Resources Section */}
      <Card className="bg-white/5 border-white/10 backdrop-blur-sm p-8">
        <h3 className="text-xl font-bold mb-4">Recommended Resources</h3>
        <div className="space-y-3">
          <a
            href="#"
            className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
          >
            <span className="font-medium">Video Tutorial</span>
            <ExternalLink className="w-4 h-4" />
          </a>
          <a
            href="#"
            className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
          >
            <span className="font-medium">Documentation</span>
            <ExternalLink className="w-4 h-4" />
          </a>
          <a
            href="#"
            className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
          >
            <span className="font-medium">Practice Exercises</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </Card>
    </div>
  )
}
