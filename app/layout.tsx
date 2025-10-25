import type React from "react"
import type { Metadata } from "next"
import { Space_Grotesk, Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ClerkProvider } from "@clerk/nextjs"
import { Chatbot } from "@/components/chatbot/Chatbot"
import "./globals.css"

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" })
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata: Metadata = {
  title: "Focus Factory - We Kill Procrastination",
  description: "Brutal productivity. Structured focus. Execution guaranteed.",
  generator: "v0.app",
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/logo.png', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
  themeColor: '#000000',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Focus Factory',
  },
  formatDetection: {
    telephone: false,
  },
}

export const dynamic = 'force-dynamic'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <body className={`${spaceGrotesk.variable} ${inter.variable} font-sans antialiased`}>
          {children}
          <Chatbot />
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  )
}
