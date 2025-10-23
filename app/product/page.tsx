"use client"

import type React from "react"
import { Navigation } from "@/components/navigation"
import { StatCard } from "@/components/stat-card"
import { useState } from "react"
import { Clock, Zap, Target } from "lucide-react"

export default function ProductPage() {
  const [timeAvailable, setTimeAvailable] = useState("")
  const [subject, setSubject] = useState("")
  const [subtopic, setSubtopic] = useState("")
  const [showOutput, setShowOutput] = useState(false)

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault()
    setShowOutput(true)
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
                    className="w-full px-6 py-4 bg-accent text-accent-foreground font-bold rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Generate My Focus Plan
                  </button>
                  <p className="text-center text-foreground/70 italic text-sm">Your excuses just expired.</p>
                </form>
              </div>

              {/* Output Section */}
              {showOutput && (
                <div className="space-y-6">
                  <div className="bg-card border border-border rounded-lg p-8 card-hover">
                    <h3 className="text-2xl font-bold text-accent mb-6">Timeline</h3>
                    <div className="space-y-4">
                      {[
                        { time: "0:00 - 0:15", task: "Setup environment & review fundamentals" },
                        { time: "0:15 - 0:45", task: "Deep dive into core concepts" },
                        { time: "0:45 - 1:15", task: "Hands-on practice & implementation" },
                        { time: "1:15 - 1:30", task: "Review & consolidate learning" },
                      ].map((item, i) => (
                        <div key={i} className="flex gap-4 pb-4 border-b border-border last:border-0 last:pb-0">
                          <div className="text-accent font-bold min-w-fit">{item.time}</div>
                          <div className="text-foreground">{item.task}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-card border border-border rounded-lg p-8 card-hover">
                    <h3 className="text-2xl font-bold text-accent mb-6">Resources</h3>
                    <ul className="space-y-2 text-foreground">
                      <li>• React Official Documentation</li>
                      <li>• React Hooks Deep Dive (YouTube)</li>
                      <li>• State Management Patterns</li>
                      <li>• Practice Projects Repository</li>
                    </ul>
                  </div>

                  <div className="bg-card border border-border rounded-lg p-8 card-hover">
                    <h3 className="text-2xl font-bold text-accent mb-6">Execution Plan</h3>
                    <ol className="space-y-3 text-foreground list-decimal list-inside">
                      <li>Open IDE and create new project</li>
                      <li>Read documentation for 15 minutes</li>
                      <li>Write first component with hooks</li>
                      <li>Test and debug</li>
                      <li>Document what you learned</li>
                    </ol>
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
