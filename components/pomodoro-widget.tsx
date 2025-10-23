"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { Play, Pause, RotateCcw } from "lucide-react"

export function PomodoroWidget() {
  const [timeLeft, setTimeLeft] = useState(25 * 60) // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false)
  const [sessions, setSessions] = useState(0)

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false)
      setSessions((prev) => prev + 1)
      // Show notification
      if (typeof window !== "undefined") {
        alert("Pomodoro session completed! Great work!")
      }
      setTimeLeft(25 * 60)
    }

    return () => clearInterval(interval)
  }, [isRunning, timeLeft])

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  const handleReset = () => {
    setIsRunning(false)
    setTimeLeft(25 * 60)
  }

  const handleToggle = () => {
    setIsRunning(!isRunning)
  }

  return (
    <Card className="bg-white/5 border-white/10 backdrop-blur-sm p-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex-1">
          <h3 className="text-2xl font-bold mb-2">Pomodoro Timer</h3>
          <p className="text-white/60">Sessions completed: {sessions}</p>
        </div>

        <div className="flex flex-col items-center gap-6">
          <div className="text-6xl font-bold font-mono">
            {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
          </div>

          <div className="flex gap-4">
            <Button
              onClick={handleToggle}
              className="bg-white text-black hover:opacity-90 px-6 py-3 flex items-center gap-2"
            >
              {isRunning ? (
                <>
                  <Pause className="w-4 h-4" /> Pause
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" /> Start
                </>
              )}
            </Button>
            <Button
              onClick={handleReset}
              className="border-2 border-white text-white hover:bg-white/10 px-6 py-3 flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" /> Reset
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
