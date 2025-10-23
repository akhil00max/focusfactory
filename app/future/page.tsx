"use client"

import { Navigation } from "@/components/navigation"
import { Zap, BarChart3, BookOpen, Smartphone } from "lucide-react"

export default function FuturePage() {
  const features = [
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "AI Goal Planner & Roadmap",
      desc: "Plan like a machine, not a human. Break down complex goals into executable milestones with AI-powered insights.",
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Reflection Dashboard",
      desc: "End-of-day review system. Track what worked, what didn't. Build patterns. Optimize your focus over time.",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "AI Journal Integration",
      desc: "Track mind, mood, and focus patterns. Understand what kills your productivity. Eliminate distractions systematically.",
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "Mobile App",
      desc: "Your discipline in your pocket. Focus sessions on the go. Accountability everywhere.",
    },
  ]

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <div className="pt-32 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4">What's Next for Focus Factory</h1>
            <p className="text-xl text-foreground/70">We're just getting started.</p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {features.map((feature, i) => (
              <div key={i} className="bg-card border border-border rounded-lg p-8 card-hover">
                <div className="text-accent mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                <p className="text-foreground/70 mb-4">{feature.desc}</p>
                <p className="text-sm text-accent font-medium">Coming Soon</p>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <section className="bg-card border border-border rounded-lg p-12 text-center card-hover mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">Join Early Access</h2>
            <p className="text-lg text-foreground/70 mb-8">Stay accountable. Get exclusive features first.</p>
            <button className="px-8 py-4 bg-accent text-accent-foreground font-bold rounded-full hover:opacity-90 transition-opacity">
              Join Early Access →
            </button>
          </section>

          {/* Quote */}
          <div className="text-center">
            <p className="text-2xl font-bold text-accent italic">"The future belongs to the focused."</p>
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
