"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, Sun, RotateCcw, Github } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs"
import { motion } from "framer-motion"

export function Navigation() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [visible, setVisible] = useState(true)
  const lastScrollY = useRef(0)
  const ticking = useRef(false)

  const isActive = (path: string) => pathname === path

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/flow-mode", label: "Flow Mode" },
    { href: "/reflection", label: "Reflection" },
    { href: "/profile", label: "Profile" },
  ]

  useEffect(() => {
    // initialize lastScrollY
    lastScrollY.current = typeof window !== "undefined" ? window.scrollY : 0

    const handleScroll = () => {
      const current = window.scrollY
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          // if scrolled down more than a small threshold, hide
          if (current > lastScrollY.current + 5) {
            setVisible(false)
            // if scrolled up more than threshold, show
          } else if (current < lastScrollY.current - 5) {
            setVisible(true)
          }

          lastScrollY.current = current
          ticking.current = false
        })
        ticking.current = true
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 pt-2 px-4 transform transition-transform duration-300 ease-in-out ${visible ? "translate-y-0" : "-translate-y-full"}`}>
      <div className="max-w-7xl mx-auto">
        {/* Top compact row: small controls on left, auth + github on right */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <Sun className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <SignedOut>
              <Link href="/login">
                <button className="px-3 py-1 bg-white/10 border border-white/20 rounded-md text-sm text-white hover:bg-white/20 transition-colors">
                  Sign In
                </button>
              </Link>
              <Link href="/sign-up">
                <button className="px-3 py-1 bg-white text-black rounded-md text-sm hover:opacity-90 transition-opacity">
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
            <a
              href="https://github.com/sai21-learn/focusfactory"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:bg-white/10 rounded-lg transition-colors inline-flex items-center"
              aria-label="GitHub Repository"
            >
              <Github className="w-5 h-5" />
            </a>

            {/* Mobile menu button stays visible on small screens */}
            <button className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors">
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Centered navigation bar with tubelight animation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-full px-2 py-2 flex items-center gap-1 shadow-lg">
            {navItems.map((item) => {
              const active = isActive(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative px-6 py-2 rounded-full text-sm font-semibold transition-colors text-white/80 hover:text-white"
                >
                  {item.label}
                  {active && (
                    <motion.div
                      layoutId="tubelight"
                      className="absolute inset-0 w-full bg-white/10 rounded-full -z-10"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    >
                      {/* Tubelight glow effect */}
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-white rounded-t-full">
                        <div className="absolute w-12 h-6 bg-white/20 rounded-full blur-md -top-2 -left-2" />
                        <div className="absolute w-8 h-6 bg-white/20 rounded-full blur-md -top-1" />
                        <div className="absolute w-4 h-4 bg-white/20 rounded-full blur-sm top-0 left-2" />
                      </div>
                    </motion.div>
                  )}
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
