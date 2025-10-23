"use client"

import { Navigation } from "@/components/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import Link from "next/link"
import { createClient } from "@/utils/supabase/client"
import { useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function Dashboard() {
  const { user } = useUser()
  const [focusSessions, setFocusSessions] = useState<any[]>([])
  const [reflections, setReflections] = useState<any[]>([])
  const [pomodoroHistory, setPomodoroHistory] = useState<any[]>([])
  const [goals, setGoals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false)
  const [newGoalName, setNewGoalName] = useState("")
  const [weeklyData, setWeeklyData] = useState<any[]>([])
  const [stats, setStats] = useState({
    streak: 0,
    weeklyHours: 0,
    activeGoals: 0
  })

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

        // Fetch user's goals
        const { data: userGoals } = await supabase
          .from('goals')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        setFocusSessions(sessions || [])
        setReflections(userReflections || [])
        setPomodoroHistory(pomodoro || [])
        setGoals(userGoals || [])

        // Calculate stats from real data
        calculateStats(sessions || [], pomodoro || [], userGoals || [])

      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user])

  const calculateStats = (sessions: any[], pomodoros: any[], userGoals: any[]) => {
    // Calculate weekly hours from pomodoro history
    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const weeklyPomodoros = pomodoros.filter(p => new Date(p.start_time) >= weekAgo && p.completed)
    const weeklyHours = weeklyPomodoros.reduce((sum, p) => sum + (p.duration || 25), 0) / 60

    // Calculate streak (consecutive days with activity)
    const sessionDates = sessions.map(s => new Date(s.created_at).toDateString())
    const uniqueDates = [...new Set(sessionDates)].sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
    let streak = 0
    for (let i = 0; i < uniqueDates.length; i++) {
      const date = new Date(uniqueDates[i])
      const expectedDate = new Date(now.getTime() - i * 24 * 60 * 60 * 1000).toDateString()
      if (date.toDateString() === expectedDate) {
        streak++
      } else {
        break
      }
    }

    // Generate weekly chart data
    const weeklyChartData = []
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
      const dayPomodoros = pomodoros.filter(p => {
        const pDate = new Date(p.start_time)
        return pDate.toDateString() === date.toDateString() && p.completed
      })
      const hours = dayPomodoros.reduce((sum, p) => sum + (p.duration || 25), 0) / 60
      weeklyChartData.push({
        day: days[date.getDay()],
        hours: Math.round(hours * 10) / 10
      })
    }

    setWeeklyData(weeklyChartData)
    setStats({
      streak,
      weeklyHours: Math.round(weeklyHours * 10) / 10,
      activeGoals: userGoals.length
    })
  }

  const handleAddGoal = async () => {
    if (!newGoalName.trim() || !user) return

    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('goals')
        .insert({
          user_id: user.id,
          name: newGoalName,
          progress: 0,
          target: 100
        })
        .select()

      if (error) throw error

      if (data) {
        setGoals([...goals, data[0]])
        setStats({ ...stats, activeGoals: goals.length + 1 })
      }
      setNewGoalName("")
      setIsAddGoalOpen(false)
    } catch (error) {
      console.error('Error adding goal:', error)
    }
  }

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
              <div className="text-4xl font-bold mb-2">{stats.streak} {stats.streak === 1 ? 'day' : 'days'}</div>
              <div className="text-white/40 text-xs">{stats.streak > 0 ? 'Keep it going!' : 'Start your streak today!'}</div>
            </Card>
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm p-6">
              <div className="text-white/60 text-sm mb-2">This Week</div>
              <div className="text-4xl font-bold mb-2">{stats.weeklyHours} hrs</div>
              <div className="text-white/40 text-xs">Total focus time</div>
            </Card>
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm p-6">
              <div className="text-white/60 text-sm mb-2">Goals Active</div>
              <div className="text-4xl font-bold mb-2">{stats.activeGoals}</div>
              <div className="text-white/40 text-xs">In progress</div>
            </Card>
          </div>

          {/* Goals Section */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Active Goals</h2>
              <Dialog open={isAddGoalOpen} onOpenChange={setIsAddGoalOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-white text-black hover:opacity-90">Add Goal</Button>
                </DialogTrigger>
                <DialogContent className="bg-black border-white/20">
                  <DialogHeader>
                    <DialogTitle>Add New Goal</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="goal-name">Goal Name</Label>
                      <Input
                        id="goal-name"
                        value={newGoalName}
                        onChange={(e) => setNewGoalName(e.target.value)}
                        placeholder="e.g., Learn React"
                        className="bg-white/5 border-white/10"
                      />
                    </div>
                    <Button
                      onClick={handleAddGoal}
                      className="w-full bg-white text-black hover:opacity-90"
                    >
                      Create Goal
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            {goals.length > 0 ? (
              <div className="space-y-4">
                {goals.map((goal) => (
                  <Card key={goal.id} className="bg-white/5 border-white/10 backdrop-blur-sm p-6">
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
            ) : (
              <p className="text-white/60">No goals yet. Add your first goal to get started!</p>
            )}
          </div>

          {/* Time Logged Chart */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Weekly Focus Time</h2>
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm p-6">
              {weeklyData.length > 0 && weeklyData.some(d => d.hours > 0) ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="day" stroke="rgba(255,255,255,0.5)" />
                    <YAxis stroke="rgba(255,255,255,0.5)" />
                    <Tooltip
                      contentStyle={{ backgroundColor: "rgba(0,0,0,0.8)", border: "1px solid rgba(255,255,255,0.2)" }}
                    />
                    <Bar dataKey="hours" fill="rgba(255,255,255,0.8)" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-white/60">
                  No focus time recorded this week. Start a focus session to see your progress!
                </div>
              )}
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
