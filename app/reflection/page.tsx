"use client"

import { Navigation } from "@/components/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Sparkles } from "lucide-react"

export default function Reflection() {
  const [summary, setSummary] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleGenerateSummary = async () => {
    setLoading(true)
    try {
      // Placeholder for AI summary generation
      const mockSummary = `
Today's Achievements:
- Completed 3 Pomodoro sessions (75 minutes of focused work)
- Learned React Hooks patterns
- Built a custom hook for data fetching
- Reviewed TypeScript generics

Focus Score: 8.5/10
- Morning: Excellent focus (9/10)
- Afternoon: Good focus (8/10)
- Evening: Moderate focus (7/10)

Key Distractions:
- Social media notifications (3 times)
- Slack messages (5 times)
- Email checking (2 times)

Recommendations:
- Turn off notifications during focus sessions
- Schedule email checks at specific times
- Take 5-minute breaks between sessions
      `
      setSummary(mockSummary)
    } catch (error) {
      console.error("Error generating summary:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen">
      <Navigation />

      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-5xl font-bold mb-2">Daily Reflection</h1>
            <p className="text-white/60">AI-powered insights into your productivity and focus patterns</p>
          </div>

          {/* Generate Summary Button */}
          <div className="mb-12">
            <Button
              onClick={handleGenerateSummary}
              disabled={loading}
              className="bg-white text-black hover:opacity-90 font-bold py-3 px-6 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              {loading ? "Generating..." : "Generate Today's Summary"}
            </Button>
          </div>

          {/* Summary Display */}
          {summary && (
            <div className="space-y-6">
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm p-8">
                <h2 className="text-2xl font-bold mb-6">Today's Summary</h2>
                <div className="prose prose-invert max-w-none">
                  <div className="text-white/80 whitespace-pre-wrap leading-relaxed">{summary}</div>
                </div>
              </Card>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-white/5 border-white/10 backdrop-blur-sm p-6">
                  <div className="text-white/60 text-sm mb-2">Total Focus Time</div>
                  <div className="text-3xl font-bold">2h 15m</div>
                </Card>
                <Card className="bg-white/5 border-white/10 backdrop-blur-sm p-6">
                  <div className="text-white/60 text-sm mb-2">Sessions Completed</div>
                  <div className="text-3xl font-bold">3</div>
                </Card>
                <Card className="bg-white/5 border-white/10 backdrop-blur-sm p-6">
                  <div className="text-white/60 text-sm mb-2">Focus Score</div>
                  <div className="text-3xl font-bold">8.5/10</div>
                </Card>
              </div>

              {/* Share Button */}
              <Button className="w-full border-2 border-white text-white hover:bg-white/10 font-bold py-3">
                Share Summary
              </Button>
            </div>
          )}

          {!summary && (
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm p-12 text-center">
              <div className="text-white/40 mb-4">
                <Sparkles className="w-16 h-16 mx-auto opacity-50" />
              </div>
              <p className="text-white/60">Click "Generate Today's Summary" to see your AI-powered reflection</p>
            </Card>
          )}
        </div>
      </section>
    </main>
  )
}
