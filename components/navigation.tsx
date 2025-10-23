"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, Sun, RotateCcw, Github } from "lucide-react"
import { useState } from "react"
import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs"

export function Navigation() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isActive = (path: string) => pathname === path

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/flow-mode", label: "Flow Mode" },
    { href: "/reflection", label: "Reflection" },
    { href: "/profile", label: "Profile" },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 pt-4 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <Sun className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
          <button className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors">
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Centered navigation bar */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-2 py-2 flex items-center gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  isActive(item.href) ? "bg-white text-black" : "text-white/70 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Right side buttons */}
        <div className="flex justify-end gap-3">
          <SignedOut>
            <Link href="/login">
              <button className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors">
                Sign In
              </button>
            </Link>
            <Link href="/sign-up">
              <button className="px-4 py-2 bg-white text-black rounded-lg hover:opacity-90 transition-opacity">
                Sign Up
              </button>
            </Link>
          </SignedOut>
          <SignedIn>
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8"
                }
              }}
            />
          </SignedIn>
          <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <Github className="w-5 h-5" />
          </button>
        </div>
      </div>
    </nav>
  )
}
