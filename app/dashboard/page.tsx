"use client"

import { Navigation } from "@/components/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import Link from "next/link"
import { createClient } from "@/utils/supabase/client"
import { useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"

const goalsData = [
  { name: "Learn React", progress: 75, target: 100 },
  { name: "Master TypeScript", progress: 60, target: 100 },
  { name: "Build Projects", progress: 45, target: 100 },
]

const timeLogData = [
  { day: "Mon", hours: 2 },
  { day: "Tue", hours: 3 },
  { day: "Wed", hours: 2.5 },
  { day: "Thu", hours: 4 },
  { day: "Fri", hours: 3.5 },
  { day: "Sat", hours: 2 },
  { day: "Sun", hours: 1.5 },
]

export default function Dashboard() {
  const { user } = useUser()
  const [focusSessions, setFocusSessions] = useState<any[]>([])
  const [reflections, setReflections] = useState<any[]>([])
  const [pomodoroHistory, setPomodoroHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        const supabase = createClient()
        
        // Fetch user's focus sessions
        const { data: sessions } = await supabase
          .from('focus_sessions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5)

        // Fetch user's reflections
        const { data: userReflections } = await supabase
          .from('reflections')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: false })
          .limit(5)

        // Fetch user's pomodoro history
        const { data: pomodoro } = await supabase
          .from('pomodoro_history')
          .select('*')
          .eq('user_id', user.id)
          .order('start_time', { ascending: false })
          .limit(10)

        setFocusSessions(sessions || [])
        setReflections(userReflections || [])
        setPomodoroHistory(pomodoro || [])

      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user])

  if (loading) {
    return (
      <main className="min-h-screen">
        <Navigation />
        <div className="pt-32 pb-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center">
              <p className="text-white/60">Loading your data...</p>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen">
      <Navigation />

      <section className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-5xl font-bold mb-2">Dashboard</h1>
            <p className="text-white/60">Your productivity overview and progress tracking</p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm p-6">
              <div className="text-white/60 text-sm mb-2">Current Streak</div>
              <div className="text-4xl font-bold mb-2">12 days</div>
              <div className="text-white/40 text-xs">Keep it going!</div>
            </Card>
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm p-6">
              <div className="text-white/60 text-sm mb-2">This Week</div>
              <div className="text-4xl font-bold mb-2">18.5 hrs</div>
              <div className="text-white/40 text-xs">Total focus time</div>
            </Card>
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm p-6">
              <div className="text-white/60 text-sm mb-2">Goals Active</div>
              <div className="text-4xl font-bold mb-2">3</div>
              <div className="text-white/40 text-xs">In progress</div>
            </Card>
          </div>

          {/* Goals Section */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Active Goals</h2>
              <Button className="bg-white text-black hover:opacity-90">Add Goal</Button>
            </div>
            <div className="space-y-4">
              {goalsData.map((goal) => (
                <Card key={goal.name} className="bg-white/5 border-white/10 backdrop-blur-sm p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">{goal.name}</h3>
                    <span className="text-white/60 text-sm">{goal.progress}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div className="bg-white h-2 rounded-full transition-all" style={{ width: `${goal.progress}%` }} />
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Time Logged Chart */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Weekly Focus Time</h2>
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm p-6">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={timeLogData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="day" stroke="rgba(255,255,255,0.5)" />
                  <YAxis stroke="rgba(255,255,255,0.5)" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "rgba(0,0,0,0.8)", border: "1px solid rgba(255,255,255,0.2)" }}
                  />
                  <Bar dataKey="hours" fill="rgba(255,255,255,0.8)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Supabase Data Display */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Your Data from Supabase</h2>
            
            {/* Focus Sessions */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Recent Focus Sessions</h3>
              {focusSessions.length > 0 ? (
                <div className="space-y-2">
                  {focusSessions.map((session) => (
                    <Card key={session.id} className="bg-white/5 border-white/10 backdrop-blur-sm p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{session.subject}</p>
                          {session.sub_topic && <p className="text-white/60 text-sm">{session.sub_topic}</p>}
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-white/60">{session.time} min</p>
                          <p className="text-xs text-white/40">{new Date(session.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-white/60">No focus sessions yet. Start your first session!</p>
              )}
            </div>

            {/* Reflections */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Recent Reflections</h3>
              {reflections.length > 0 ? (
                <div className="space-y-2">
                  {reflections.map((reflection) => (
                    <Card key={reflection.id} className="bg-white/5 border-white/10 backdrop-blur-sm p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">Rating: {reflection.rating}/10</p>
                          {reflection.notes && <p className="text-white/60 text-sm">{reflection.notes}</p>}
                        </div>
                        <p className="text-xs text-white/40">{new Date(reflection.date).toLocaleDateString()}</p>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-white/60">No reflections yet. Start reflecting on your progress!</p>
              )}
            </div>

            {/* Pomodoro History */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Pomodoro History</h3>
              {pomodoroHistory.length > 0 ? (
                <div className="space-y-2">
                  {pomodoroHistory.map((pomodoro) => (
                    <Card key={pomodoro.id} className="bg-white/5 border-white/10 backdrop-blur-sm p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{pomodoro.duration} min session</p>
                          <p className="text-white/60 text-sm">
                            {pomodoro.completed ? 'Completed' : 'Incomplete'}
                          </p>
                        </div>
                        <p className="text-xs text-white/40">
                          {new Date(pomodoro.start_time).toLocaleDateString()}
                        </p>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-white/60">No pomodoro sessions yet. Start your first session!</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/flow-mode" className="flex-1">
              <Button className="w-full bg-white text-black hover:opacity-90 py-6 text-lg font-bold">
                Open Flow Mode
              </Button>
            </Link>
            <Link href="/reflection" className="flex-1">
              <Button className="w-full border-2 border-white text-white hover:bg-white/10 py-6 text-lg font-bold">
                Review Day
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
