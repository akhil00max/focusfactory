"use client"

import { Navigation } from "@/components/navigation"

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <div className="pt-32 pb-12 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-12 text-center">Why We Exist</h1>

          <div className="bg-card border border-border rounded-lg p-12 card-hover space-y-8">
            <div>
              <p className="text-lg text-foreground/90 leading-relaxed">
                We built Focus Factory for people tired of pretending. Tired of reels, dopamine traps, and fake grind
                culture.
              </p>
            </div>

            <div className="border-t border-border pt-8">
              <p className="text-lg text-foreground/90 leading-relaxed">
                Here, we don't chase motivation. We design{" "}
                <span className="text-accent font-bold">clarity systems</span> that make procrastination impossible.
              </p>
            </div>

            <div className="border-t border-border pt-8">
              <p className="text-lg text-foreground/90 leading-relaxed">
                Every session builds discipline. Every minute compounds focus. Welcome to the{" "}
                <span className="text-accent font-bold">factory of execution.</span>
              </p>
            </div>

            <div className="border-t border-border pt-8">
              <p className="text-2xl font-bold text-accent italic">
                Built for those who want more than just potential.
              </p>
            </div>
          </div>

          {/* Mission Statement */}
          <div className="mt-16 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">Our Mission</h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              To eliminate procrastination through structured systems, not motivation. To build a community of focused
              individuals who execute instead of plan. To prove that discipline beats talent every single time.
            </p>
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
