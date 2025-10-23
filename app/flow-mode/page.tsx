"use client"

import { Navigation } from "@/components/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { PomodoroWidget } from "@/components/pomodoro-widget"
import { OutputPanel } from "@/components/output-panel"

export default function FlowMode() {
  const [time, setTime] = useState("45")
  const [subject, setSubject] = useState("")
  const [subtopic, setSubtopic] = useState("")
  const [loading, setLoading] = useState(false)
  const [output, setOutput] = useState<any>(null)

  const handleGeneratePlan = async () => {
    if (!subject.trim()) {
      alert("Please enter a subject")
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ time, subject, subTopic: subtopic }),
      })
      const data = await response.json()
      setOutput(data)
    } catch (error) {
      console.error("Error generating plan:", error)
      alert("Failed to generate plan")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen">
      <Navigation />

      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-5xl font-bold mb-2">Flow Mode</h1>
            <p className="text-white/60">Turn procrastination into momentum with AI-powered planning</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Input Panel */}
            <div className="lg:col-span-1">
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm p-8 sticky top-32">
                <h2 className="text-xl font-bold mb-6">Create Your Plan</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Time Available</label>
                    <select
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-white/40"
                    >
                      <option value="15">15 minutes</option>
                      <option value="30">30 minutes</option>
                      <option value="45">45 minutes</option>
                      <option value="60">1 hour</option>
                      <option value="90">1.5 hours</option>
                      <option value="120">2 hours</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Subject</label>
                    <Input
                      placeholder="e.g., React Hooks"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Sub-topic (Optional)</label>
                    <Input
                      placeholder="e.g., useEffect patterns"
                      value={subtopic}
                      onChange={(e) => setSubtopic(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                    />
                  </div>

                  <Button
                    onClick={handleGeneratePlan}
                    disabled={loading}
                    className="w-full bg-white text-black hover:opacity-90 font-bold py-3 mt-6"
                  >
                    {loading ? "Generating..." : "Generate Plan"}
                  </Button>
                </div>
              </Card>
            </div>

            {/* Output Panel */}
            <div className="lg:col-span-2">
              {output ? (
                <OutputPanel data={output} />
              ) : (
                <Card className="bg-white/5 border-white/10 backdrop-blur-sm p-12 text-center">
                  <div className="text-white/40 mb-4">
                    <svg className="w-16 h-16 mx-auto opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <p className="text-white/60">Enter your subject and click "Generate Plan" to get started</p>
                </Card>
              )}
            </div>
          </div>

          {/* Pomodoro Widget */}
          <div className="mt-12">
            <PomodoroWidget />
          </div>
        </div>
      </section>
    </main>
  )
}
