"use client"

import type React from "react"
import { Navigation } from "@/components/navigation"
import { SignIn } from "@clerk/nextjs"

export default function LoginPage() {

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <div className="pt-32 pb-12 px-6">
        <div className="max-w-md mx-auto">
          <div className="bg-card border border-border rounded-lg p-8 card-hover">
            <h2 className="text-2xl font-bold text-foreground mb-2">Welcome back, operator.</h2>
            <p className="text-foreground/70 mb-8">Sign in and destroy procrastination.</p>

            <div className="flex justify-center">
              <SignIn 
                appearance={{
                  elements: {
                    formButtonPrimary: "bg-accent text-accent-foreground hover:opacity-90",
                    card: "bg-transparent shadow-none border-none",
                    headerTitle: "text-foreground",
                    headerSubtitle: "text-foreground/70",
                    socialButtonsBlockButton: "border-border hover:bg-accent/10",
                    formFieldInput: "bg-background border-border text-foreground",
                    footerActionLink: "text-accent hover:text-accent/80"
                  }
                }}
              />
            </div>

            <div className="mt-12 text-center space-y-4">
              <p className="text-lg text-foreground/70 italic">"You don't need more time. You need fewer excuses."</p>
              <p className="text-sm text-foreground/60">Discipline beats motivation. Every time.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
