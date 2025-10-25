"use client"

import { Navigation } from "@/components/navigation"
import Link from "next/link"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />

      <section className="pt-40 pb-32 px-6 relative">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-8 backdrop-blur-sm">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span className="text-sm font-medium">Trusted by industry leaders</span>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">Focus Factory</h1>

          <p className="text-2xl md:text-3xl font-bold mb-4">Enter Flow Mode — Turn Time Into Momentum</p>

          <p className="text-lg md:text-xl text-white/70 mb-12 max-w-3xl mx-auto leading-relaxed">
            No fluff. No fake motivation. Just structured focus and execution. Our AI-powered system converts
            procrastination into momentum.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
            <Link
              href="/flow-mode"
              className="px-8 py-4 bg-white text-black font-bold rounded-full hover:opacity-90 transition-opacity inline-flex items-center justify-center gap-2"
            >
              Get Started <span>→</span>
            </Link>
            <Link
              href="/dashboard"
              className="px-8 py-4 border-2 border-white text-white font-bold rounded-full hover:bg-white/10 transition-colors inline-flex items-center justify-center"
            >
              View Dashboard →
            </Link>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-lg p-8 mb-20 backdrop-blur-sm">
            <p className="text-lg text-white/80 italic">
              "Most people plan to start tomorrow. We build systems that start today."
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto mb-20">
            <div className="bg-white/5 border border-white/10 rounded-lg p-6 backdrop-blur-sm">
              <div className="text-3xl mb-3">🤖</div>
              <h3 className="font-bold mb-2">AI Goal Planner</h3>
              <p className="text-white/60 text-sm">Get personalized study plans in seconds</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-lg p-6 backdrop-blur-sm">
              <div className="text-3xl mb-3">⏱️</div>
              <h3 className="font-bold mb-2">Pomodoro Productivity</h3>
              <p className="text-white/60 text-sm">Track focus sessions and build streaks</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-lg p-6 backdrop-blur-sm">
              <div className="text-3xl mb-3">📊</div>
              <h3 className="font-bold mb-2">Reflection Dashboard</h3>
              <p className="text-white/60 text-sm">AI insights into your productivity patterns</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">1M+</div>
              <div className="text-white/60 text-sm">Users</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">50+</div>
              <div className="text-white/60 text-sm">Countries</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">24/7</div>
              <div className="text-white/60 text-sm">Support</div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 py-16 px-6 bg-white/2">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <h3 className="text-lg font-bold mb-4">Focus Factory</h3>
              <p className="text-white/60 text-sm">
                We kill procrastination. No fluff. No fake motivation. Just execution.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-white">Product</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/flow-mode" className="text-white/60 hover:text-white transition-colors text-sm">
                    Flow Mode
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="text-white/60 hover:text-white transition-colors text-sm">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/reflection" className="text-white/60 hover:text-white transition-colors text-sm">
                    Reflection
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-white">Company</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-white/60 hover:text-white transition-colors text-sm">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/profile" className="text-white/60 hover:text-white transition-colors text-sm">
                    profile
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="text-white/60 hover:text-white transition-colors text-sm">
                    Login
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-white">Connect</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-white/60 hover:text-white transition-colors text-sm">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/60 hover:text-white transition-colors text-sm">
                    GitHub
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/60 hover:text-white transition-colors text-sm">
                    Email
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-white/60 text-sm">Made with discipline at Focus Factory.</p>
              <p className="text-white/60 text-sm">© 2025 Focus Factory. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
