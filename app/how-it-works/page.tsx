"use client"

import { Navigation } from "@/components/navigation"
import { StatCard } from "@/components/stat-card"
import Link from "next/link"
import { CheckCircle2 } from "lucide-react"

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <div className="pt-32 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-16 mt-8">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4">
              How Focus Factory Destroys Procrastination
            </h1>
            <p className="text-xl text-foreground/70">Three brutal steps to unstoppable execution.</p>
          </div>

          {/* 3-Step Flow */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {[
              {
                step: "01",
                title: "Input your time and goal",
                desc: "We remove ambiguity. No vague intentions. Just clear, measurable objectives with time constraints.",
              },
              {
                step: "02",
                title: "AI generates a time-stamped action plan",
                desc: "No overthinking, just doing. Every minute is accounted for. Every step is precise. No room for procrastination.",
              },
              {
                step: "03",
                title: "Start focus session with timer + system",
                desc: "Execution becomes automatic. Follow the plan. Track your progress. Build discipline one session at a time.",
              },
            ].map((item, i) => (
              <div key={i} className="bg-card border border-border rounded-lg p-8 card-hover">
                <div className="text-4xl font-bold text-accent mb-4">{item.step}</div>
                <h3 className="text-xl font-bold text-foreground mb-3">{item.title}</h3>
                <p className="text-foreground/70">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Why It Works Section */}
          <section className="bg-card border border-border rounded-lg p-12 mb-16 card-hover">
            <h2 className="text-3xl font-bold text-foreground mb-8">Why It Works</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <CheckCircle2 className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                <div>
                  <p className="text-lg text-foreground">
                    <span className="text-accent font-bold">Because motivation is unreliable.</span> Systems aren't.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <CheckCircle2 className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                <div>
                  <p className="text-lg text-foreground">
                    Focus Factory doesn't inspire you — it{" "}
                    <span className="text-accent font-bold">forces clarity and commitment.</span>
                  </p>
                </div>
              </div>
              <div className="flex gap-4 pt-4 border-t border-border">
                <div className="flex-1">
                  <p className="text-lg italic text-foreground/70">
                    "Procrastination is fear in disguise. Kill it before it kills your goals."
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <StatCard label="Users Focused" value="10K+" />
            <StatCard label="Sessions Completed" value="50K+" />
            <StatCard label="Procrastination Killed" value="100%" />
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link
              href="/product"
              className="inline-block px-8 py-4 bg-accent text-accent-foreground font-bold rounded-full hover:opacity-90 transition-opacity"
            >
              Start Your First Session →
            </Link>
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
