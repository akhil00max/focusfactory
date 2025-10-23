"use client"

import { Navigation } from "@/components/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Sun, Moon } from "lucide-react"

export default function Profile() {
  const [activeTab, setActiveTab] = useState("profile")
  const [theme, setTheme] = useState("dark")

  const tabs = [
    { id: "profile", label: "Profile Info" },
    { id: "settings", label: "Settings" },
  ]

  return (
    <main className="min-h-screen">
      <Navigation />

      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-5xl font-bold mb-2">Profile</h1>
            <p className="text-white/60">Manage your account and preferences</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b border-white/10">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 font-medium transition-colors border-b-2 ${
                  activeTab === tab.id ? "border-white text-white" : "border-transparent text-white/60 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm p-8">
                <h2 className="text-2xl font-bold mb-6">Profile Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name</label>
                    <Input
                      placeholder="Your name"
                      defaultValue="John Doe"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      defaultValue="john@example.com"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                    />
                  </div>
                  <Button className="bg-white text-black hover:opacity-90 font-bold">Save Changes</Button>
                </div>
              </Card>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm p-8">
                <h2 className="text-2xl font-bold mb-6">Settings</h2>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold mb-1">Theme</h3>
                      <p className="text-white/60 text-sm">Choose your preferred theme</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setTheme("dark")}
                        className={`p-3 rounded-lg transition-colors ${
                          theme === "dark" ? "bg-white text-black" : "bg-white/10 text-white"
                        }`}
                      >
                        <Moon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setTheme("light")}
                        className={`p-3 rounded-lg transition-colors ${
                          theme === "light" ? "bg-white text-black" : "bg-white/10 text-white"
                        }`}
                      >
                        <Sun className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-6">
                    <h3 className="font-semibold mb-3">Data Management</h3>
                    <Button className="border-2 border-red-500 text-red-500 hover:bg-red-500/10 font-bold">
                      Clear All Data
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
