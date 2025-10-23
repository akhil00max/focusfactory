"use client"

import type React from "react"
import { Navigation } from "@/components/navigation"
import { StatCard } from "@/components/stat-card"
import { useState } from "react"
import { Clock, Zap, Target, Loader2 } from "lucide-react"
import { useUser } from "@clerk/nextjs"
import { createClient } from "@/utils/supabase/client"

export default function ProductPage() {
  const { user } = useUser()
  const [timeAvailable, setTimeAvailable] = useState("")
  const [subject, setSubject] = useState("")
  const [subtopic, setSubtopic] = useState("")
  const [showOutput, setShowOutput] = useState(false)
  const [generatedPlan, setGeneratedPlan] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setShowOutput(false)

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          time: timeAvailable,
          subject,
          subTopic: subtopic
        })
      })

      if (!response.ok) {
        throw new Error('Failed to generate plan')
      }

      const data = await response.json()

      if (data.error) {
        setError(data.error)
        setLoading(false)
        return
      }

      setGeneratedPlan(data.output)
      setShowOutput(true)

      if (user) {
        const supabase = createClient()
        await supabase.from('focus_sessions').insert({
          user_id: user.id,
          time: parseInt(timeAvailable) || 0,
          subject,
          sub_topic: subtopic,
          output_text: data.output
        })
      }

    } catch (err) {
      setError('Failed to generate plan. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const parseGeneratedPlan = (plan: string) => {
    const lines = plan.split('\n').filter(line => line.trim())
    return {
      timeline: lines.slice(0, 4).map(line => line.trim()),
      resources: lines.slice(4, 8).map(line => line.trim()),
      execution: lines.slice(8).map(line => line.trim())
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <div className="pt-32 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-2xl font-bold text-accent italic mb-8">"Focus is the new superpower."</p>
          </div>

          {/* Header */}
          <div className="mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4">Kill Procrastination Now</h1>
            <p className="text-xl text-foreground/70">
              Tell us your time and task. We'll tell you exactly what to do — minute by minute.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-card border border-border rounded-lg p-8 card-hover mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-6">Create Your Focus Plan</h2>

                <form onSubmit={handleGenerate} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Time Available (minutes/hours)
                    </label>
                    <input
                      type="text"
                      value={timeAvailable}
                      onChange={(e) => setTimeAvailable(e.target.value)}
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder-foreground/50 focus:outline-none focus:border-accent transition-colors"
                      placeholder="e.g., 90 minutes"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Subject / Task</label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder-foreground/50 focus:outline-none focus:border-accent transition-colors"
                      placeholder="e.g., Learn React"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Subtopic (optional)</label>
                    <input
                      type="text"
                      value={subtopic}
                      onChange={(e) => setSubtopic(e.target.value)}
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder-foreground/50 focus:outline-none focus:border-accent transition-colors"
                      placeholder="e.g., Hooks and State Management"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-6 py-4 bg-accent text-accent-foreground font-bold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      'Generate My Focus Plan'
                    )}
                  </button>
                  <p className="text-center text-foreground/70 italic text-sm">Your excuses just expired.</p>
                </form>

                {error && (
                  <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-red-400">{error}</p>
                  </div>
                )}
              </div>

              {/* Output Section */}
              {showOutput && generatedPlan && (
                <div className="space-y-6">
                  <div className="bg-card border border-border rounded-lg p-8 card-hover">
                    <h3 className="text-2xl font-bold text-accent mb-6">Your AI-Generated Focus Plan</h3>
                    <div className="text-foreground whitespace-pre-wrap leading-relaxed">
                      {generatedPlan}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar - Stats */}
            <div className="lg:col-span-1 space-y-6">
              <StatCard label="Focus" value="25 mins" icon={<Clock className="w-6 h-6" />} />
              <StatCard label="Break" value="5 mins" icon={<Zap className="w-6 h-6" />} />
              <StatCard label="Cycles" value="4" icon={<Target className="w-6 h-6" />} />

              <button className="w-full px-6 py-4 bg-accent text-accent-foreground font-bold rounded-lg hover:opacity-90 transition-opacity">
                Start Session
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12 px-6">
        <div className="max-w-7xl mx-auto text-center text-foreground/70">
          <p>Made with discipline at Focus Factory.</p>
        </div>
      </footer>
    </main>
  )
}
