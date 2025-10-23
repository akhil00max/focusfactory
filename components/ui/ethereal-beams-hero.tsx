"use client"

import type React from "react"
import { ArrowRight, Github, Star } from "lucide-react"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost"
  size?: "sm" | "lg"
  children: React.ReactNode
}

const Button = ({ variant = "default", size = "sm", className = "", children, ...props }: ButtonProps) => {
  const baseClasses =
    "inline-flex items-center justify-center font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 disabled:pointer-events-none disabled:opacity-50"

  const variants = {
    default: "bg-white text-black hover:bg-gray-100",
    outline: "border border-white/20 bg-white/5 backdrop-blur-xl text-white hover:bg-white/10 hover:border-white/30",
    ghost: "text-white/90 hover:text-white hover:bg-white/10",
  }

  const sizes = {
    sm: "h-9 px-4 py-2 text-sm",
    lg: "px-8 py-6 text-lg",
  }

  return (
    <button
      className={`group relative overflow-hidden rounded-full ${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      <span className="relative z-10 flex items-center">{children}</span>
      <div className="absolute inset-0 -top-2 -bottom-2 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
    </button>
  )
}

export default function EtherealBeamsHero() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* Animated Beams Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <style>{`
          @keyframes beam-flow {
            0% {
              transform: translateY(-100%);
              opacity: 0;
            }
            10% {
              opacity: 0.8;
            }
            90% {
              opacity: 0.8;
            }
            100% {
              transform: translateY(100%);
              opacity: 0;
            }
          }

          @keyframes beam-glow {
            0%, 100% {
              filter: blur(2px);
            }
            50% {
              filter: blur(8px);
            }
          }

          .beam {
            position: absolute;
            width: 2px;
            height: 200%;
            background: linear-gradient(
              to bottom,
              transparent,
              rgba(255, 255, 255, 0.5),
              transparent
            );
            animation: beam-flow 4s ease-in infinite;
            filter: blur(4px);
          }

          .beam:nth-child(1) { left: 10%; animation-delay: 0s; }
          .beam:nth-child(2) { left: 20%; animation-delay: 0.5s; }
          .beam:nth-child(3) { left: 30%; animation-delay: 1s; }
          .beam:nth-child(4) { left: 40%; animation-delay: 1.5s; }
          .beam:nth-child(5) { left: 50%; animation-delay: 2s; }
          .beam:nth-child(6) { left: 60%; animation-delay: 0.3s; }
          .beam:nth-child(7) { left: 70%; animation-delay: 0.8s; }
          .beam:nth-child(8) { left: 80%; animation-delay: 1.3s; }
          .beam:nth-child(9) { left: 90%; animation-delay: 1.8s; }
        `}</style>

        {/* Beams Container */}
        <div className="absolute inset-0">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="beam" />
          ))}
        </div>

        {/* Gradient Overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
      </div>

      {/* Glassmorphic Navbar */}
      <nav className="relative z-20 w-full">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Brand Name Only */}
            <div className="flex items-center">
              <span className="text-xl font-bold text-white">Mysh UI</span>
            </div>

            {/* Glassmorphic Navigation Pills */}
            <div className="hidden md:flex items-center space-x-1 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 p-1 -mr-6">
              <a
                href="#"
                className="rounded-full px-4 py-2 text-sm font-medium text-white/90 transition-all hover:bg-white/10 hover:text-white"
              >
                Home
              </a>
              <a
                href="#"
                className="rounded-full px-4 py-2 text-sm font-medium text-white/90 transition-all hover:bg-white/10 hover:text-white"
              >
                Components
              </a>
              <a
                href="#"
                className="rounded-full px-4 py-2 text-sm font-medium text-white/90 transition-all hover:bg-white/10 hover:text-white"
              >
                Templates
              </a>
              <a
                href="#"
                className="rounded-full px-4 py-2 text-sm font-medium text-white/90 transition-all hover:bg-white/10 hover:text-white"
              >
                Docs
              </a>
            </div>

            {/* CTA Button */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="hidden sm:flex">
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </Button>
              <Button size="sm">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="relative z-10 flex min-h-[calc(100vh-4rem)] items-center">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            {/* Badge */}
            <div className="mb-8 inline-flex items-center rounded-full bg-white/5 backdrop-blur-xl border border-white/10 px-4 py-2 text-sm text-white/90">
              <Star className="mr-2 h-4 w-4 text-white" />
              Trusted by industry leaders
            </div>

            {/* Main Heading */}
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
              Create{" "}
              <span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                exceptional
              </span>{" "}
              experiences
              <br />
              that matter
            </h1>

            {/* Subtitle */}
            <p className="mb-10 text-lg leading-8 text-white/80 sm:text-xl lg:text-2xl max-w-3xl mx-auto">
              Transform your ideas into reality with our cutting-edge platform. Designed for creators, built for
              performance, crafted for excellence.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Button size="lg" className="shadow-2xl shadow-white/25 font-semibold">
                Start Creating
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="font-semibold bg-transparent">
                Learn More
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">1M+</div>
                <div className="text-white/60 text-sm">Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">50+</div>
                <div className="text-white/60 text-sm">Countries</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">24/7</div>
                <div className="text-white/60 text-sm">Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gradient Overlay for better text readability */}
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/50 via-transparent to-black/30" />
    </div>
  )
}
