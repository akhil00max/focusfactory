"use client"

import { Navigation } from "@/components/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from "recharts"
import Link from "next/link"
import { createClient } from "@/utils/supabase/client"
import { useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Helper function to get day of week from date
const getDayOfWeek = (date: Date) => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  return days[date.getDay()]
}

// Helper function to get the start of the week
const getStartOfWeek = (date: Date) => {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1) // Adjust when day is Sunday
  return new Date(d.setDate(diff))
}

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true'

const generateMockData = () => {
  const now = new Date()
  const mkISO = (d: Date) => new Date(d).toISOString()
  const mkDateOnly = (d: Date) => mkISO(d).split('T')[0]

  const daysBack = (n: number) => {
    const d = new Date(now)
    d.setDate(d.getDate() - n)
    return d
  }

  const focusSessions = [0, 1, 2, 3, 4].map((i) => {
    const d = daysBack(i)
    const subjects = ["Deep Work", "Leetcode", "Docs Reading", "UI Polishing", "Writing"]
    const sub = ["Algorithms", "System Design", "React", "TypeScript", "Notes"][i % 5]
    const minutes = [50, 40, 60, 30, 45][i % 5]
    return {
      id: `mock_session_${i}`,
      subject: subjects[i % subjects.length],
      sub_topic: sub,
      time: String(minutes),
      created_at: mkISO(d)
    }
  })

  const reflections = [0, 1, 2, 3, 4].map((i) => {
    const d = daysBack(i)
    return {
      id: `mock_reflection_${i}`,
      rating: 7 + (i % 3),
      notes: [
        "Felt productive.",
        "Got distracted midway but recovered.",
        "Great momentum today."
      ][i % 3],
      date: mkDateOnly(d)
    }
  })

  const pomodoroHistory = Array.from({ length: 10 }).map((_, i) => {
    const d = daysBack(i % 6)
    return {
      id: `mock_pomo_${i}`,
      duration: [25, 30, 45][i % 3],
      completed: i % 4 !== 0,
      start_time: mkISO(d)
    }
  })

  const goals = [
    { id: 'mock_goal_1', name: 'Learn React', progress: 40, created_at: mkISO(daysBack(10)) },
    { id: 'mock_goal_2', name: 'Build Portfolio', progress: 65, created_at: mkISO(daysBack(20)) },
    { id: 'mock_goal_3', name: 'Daily Writing', progress: 25, created_at: mkISO(daysBack(5)) },
    { id: 'mock_goal_4', name: '100 Leetcode', progress: 55, created_at: mkISO(daysBack(15)) }
  ]

  const timeLogData = Array(7).fill(0).map((_, idx) => {
    const d = daysBack(6 - idx)
    const dateStr = mkDateOnly(d)
    const hours = [0.5, 1.2, 0.0, 2.3, 1.8, 0.7, 2.0][idx]
    return {
      day: getDayOfWeek(d),
      hours: Number(hours.toFixed(1)),
      date: dateStr
    }
  })

  const weeklyHours = Number(timeLogData.reduce((a, b) => a + b.hours, 0).toFixed(1))
  const currentStreak = 3
  const activeGoals = goals.length

  return { focusSessions, reflections, pomodoroHistory, goals, stats: { currentStreak, weeklyHours, activeGoals, timeLogData } }
}

export default function Dashboard() {
  const { user } = useUser()
  const [focusSessions, setFocusSessions] = useState<any[]>([])
  const [reflections, setReflections] = useState<any[]>([])
  const [pomodoroHistory, setPomodoroHistory] = useState<any[]>([])
  const [goals, setGoals] = useState<any[]>([
    { id: 'mock_1', name: 'Learn React', progress: 65, created_at: new Date().toISOString() },
    { id: 'mock_2', name: 'Daily Exercise', progress: 40, created_at: new Date().toISOString() },
    { id: 'mock_3', name: 'Read 30 mins', progress: 80, created_at: new Date().toISOString() },
    { id: 'mock_4', name: 'Code Practice', progress: 55, created_at: new Date().toISOString() }
  ])
  const [loading, setLoading] = useState(true)
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false)
  const [newGoalName, setNewGoalName] = useState("")
  const [weeklyData, setWeeklyData] = useState<any[]>([])
  const [stats, setStats] = useState({
    currentStreak: 90,
    weeklyHours: 56,
    activeGoals: 5,
    timeLogData: Array(7).fill(0).map((_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (6 - i))
      // Add random mock data for visualization
      const randomHours = Math.random() * 3 + 0.5 // Random between 0.5 and 3.5 hours
      return {
        day: getDayOfWeek(date),
        hours: parseFloat(randomHours.toFixed(1)),
        date: date.toISOString().split('T')[0]
      }
    })
  })

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        if (USE_MOCK) {
          const mock = generateMockData()
          setFocusSessions(mock.focusSessions)
          setReflections(mock.reflections)
          setPomodoroHistory(mock.pomodoroHistory)
          setGoals(mock.goals)
          setStats({
            currentStreak: mock.stats.currentStreak,
            weeklyHours: mock.stats.weeklyHours,
            activeGoals: mock.stats.activeGoals,
            timeLogData: mock.stats.timeLogData
          })
        } else {
          // Set mock goals even when not logged in for visualization
          const mockGoals = [
            { id: 'mock_1', name: 'Learn React', progress: 65, created_at: new Date().toISOString() },
            { id: 'mock_2', name: 'Daily Exercise', progress: 40, created_at: new Date().toISOString() },
            { id: 'mock_3', name: 'Read 30 mins', progress: 80, created_at: new Date().toISOString() },
            { id: 'mock_4', name: 'Code Practice', progress: 55, created_at: new Date().toISOString() }
          ]
          setGoals(mockGoals)
        }
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

        // Calculate weekly hours
        const startOfWeek = getStartOfWeek(new Date())
        const weeklySessions = sessions?.filter(session => {
          const sessionDate = new Date(session.created_at)
          return sessionDate >= startOfWeek
        }) || []

        const weeklyHours = weeklySessions.reduce((total, session) => {
          return total + (parseInt(session.time) || 0)
        }, 0) / 60 // Convert minutes to hours

        // Calculate time log data with mock data fallback
        const timeLogData = Array(7).fill(0).map((_, i) => {
          const date = new Date()
          date.setDate(date.getDate() - (6 - i))
          const dateStr = date.toISOString().split('T')[0]

          const daySessions = sessions?.filter(session => {
            const sessionDate = new Date(session.created_at).toISOString().split('T')[0]
            return sessionDate === dateStr
          }) || []

          const dayHours = daySessions.reduce((total, session) => {
            return total + (parseInt(session.time) || 0)
          }, 0) / 60 // Convert minutes to hours

          // If no real data, add some random mock data for visualization
          const finalHours = dayHours > 0 ? dayHours : (Math.random() * 2.5 + 0.3)

          return {
            day: getDayOfWeek(date),
            hours: parseFloat(finalHours.toFixed(1)),
            date: dateStr
          }
        })

        // Fetch user's reflections
        const { data: userReflections } = await supabase
          .from('reflections')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: false })
          .limit(5)

        // Calculate current streak from reflections
        let currentStreak = 0
        if (userReflections && userReflections.length > 0) {
          const today = new Date().toISOString().split('T')[0]
          const yesterday = new Date()
          yesterday.setDate(yesterday.getDate() - 1)
          const yesterdayStr = yesterday.toISOString().split('T')[0]

          // Check if user reflected today or yesterday
          const hasToday = userReflections.some(r => r.date === today)
          const hasYesterday = userReflections.some(r => r.date === yesterdayStr)

          if (hasToday || hasYesterday) {
            currentStreak = 1
            // Count consecutive days with reflections
            const sortedReflections = [...userReflections].sort((a, b) =>
              new Date(b.date).getTime() - new Date(a.date).getTime()
            )

            for (let i = 1; i < sortedReflections.length; i++) {
              const prevDate = new Date(sortedReflections[i - 1].date)
              const currDate = new Date(sortedReflections[i].date)
              const diffTime = prevDate.getTime() - currDate.getTime()
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

              if (diffDays === 1) {
                currentStreak++
              } else if (diffDays > 1) {
                break // Streak broken
              }
            }
          }
        }

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

        // Count active goals
        const activeGoals = userGoals?.length || 0

        // Add mock goals if no real goals exist for visualization
        const mockGoals = [
          { id: 'mock_1', name: 'Learn React', progress: 65, created_at: new Date().toISOString() },
          { id: 'mock_2', name: 'Daily Exercise', progress: 40, created_at: new Date().toISOString() },
          { id: 'mock_3', name: 'Read 30 mins', progress: 80, created_at: new Date().toISOString() },
          { id: 'mock_4', name: 'Code Practice', progress: 55, created_at: new Date().toISOString() }
        ]
        
        const finalGoals = (userGoals && userGoals.length > 0) ? userGoals : mockGoals

        setFocusSessions(sessions || [])
        setReflections(userReflections || [])
        setPomodoroHistory(pomodoro || [])
        setGoals(finalGoals)

        setStats({
          currentStreak,
          weeklyHours: parseFloat(weeklyHours.toFixed(1)),
          activeGoals,
          timeLogData
        })

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
              <div className="text-4xl font-bold mb-2">{stats.currentStreak} {stats.currentStreak === 1 ? 'day' : 'days'}</div>
              <div className="text-white/40 text-xs">
                {stats.currentStreak > 0 ? 'Keep it going! 🔥' : 'Start a new streak today!'}
              </div>
            </Card>
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm p-6">
              <div className="text-white/60 text-sm mb-2">This Week</div>
              <div className="text-4xl font-bold mb-2">{stats.weeklyHours} hrs</div>
              <div className="text-white/40 text-xs">
                {stats.weeklyHours > 10 ? 'Amazing focus! 🚀' : 'Keep pushing!'}
              </div>
            </Card>
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm p-6">
              <div className="text-white/60 text-sm mb-2">Active Goals</div>
              <div className="text-4xl font-bold mb-2">{stats.activeGoals}</div>
              <div className="text-white/40 text-xs">
                {stats.activeGoals > 0 ? 'In progress' : 'No active goals'}
              </div>
            </Card>
          </div>

          {/* Active Goals */}
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

          {/* Charts Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Analytics & Progress</h2>

            {/* Weekly Focus Time Bar Chart */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Weekly Focus Time</h3>
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm p-6">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stats.timeLogData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis
                      dataKey="day"
                      stroke="rgba(255,255,255,0.5)"
                      tick={{ fill: 'rgba(255,255,255,0.7)' }}
                    />
                    <YAxis
                      stroke="rgba(255,255,255,0.5)"
                      tick={{ fill: 'rgba(255,255,255,0.7)' }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(23, 23, 23, 0.95)",
                        border: "1px solid rgba(255,255,255,0.2)",
                        borderRadius: '0.5rem',
                        color: 'white'
                      }}
                      labelStyle={{ color: 'rgba(255,255,255,0.8)' }}
                      formatter={(value: any) => [`${value} hours`, 'Focus Time']}
                      labelFormatter={(label) => `Day: ${label}`}
                    />
                    <Bar
                      dataKey="hours"
                      fill="rgba(59, 130, 246, 0.8)"
                      radius={[8, 8, 0, 0]}
                      name="Focus Time"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>

            {/* Progress Tracking Line Chart */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Progress Trend</h3>
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm p-6">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={stats.timeLogData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis
                      dataKey="day"
                      stroke="rgba(255,255,255,0.5)"
                      tick={{ fill: 'rgba(255,255,255,0.7)' }}
                    />
                    <YAxis
                      stroke="rgba(255,255,255,0.5)"
                      tick={{ fill: 'rgba(255,255,255,0.7)' }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(23, 23, 23, 0.95)",
                        border: "1px solid rgba(255,255,255,0.2)",
                        borderRadius: '0.5rem',
                        color: 'white'
                      }}
                      labelStyle={{ color: 'rgba(255,255,255,0.8)' }}
                      formatter={(value: any) => [`${value} hours`, 'Focus Time']}
                      labelFormatter={(label) => `Day: ${label}`}
                    />
                    <Line
                      type="monotone"
                      dataKey="hours"
                      stroke="rgba(34, 197, 94, 0.8)"
                      strokeWidth={3}
                      dot={{ fill: 'rgba(34, 197, 94, 1)', strokeWidth: 2, r: 6 }}
                      activeDot={{ r: 8, stroke: 'rgba(34, 197, 94, 1)', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </div>

            {/* Goal Distribution Pie Chart */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Goal Progress Distribution</h3>
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm p-6">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={goals.map(goal => ({
                        name: goal.name,
                        value: goal.progress,
                        color: goal.progress > 50 ? '#22c55e' : goal.progress > 25 ? '#f59e0b' : '#ef4444'
                      }))}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                      labelLine={false}
                    >
                      {goals.map((goal, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={goal.progress > 50 ? '#22c55e' : goal.progress > 25 ? '#f59e0b' : '#ef4444'}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(23, 23, 23, 0.95)",
                        border: "1px solid rgba(255,255,255,0.2)",
                        borderRadius: '0.5rem',
                        color: 'white'
                      }}
                      formatter={(value: any) => [`${value}%`, 'Progress']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </div>

            {/* Focus Sessions Area Chart */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Focus Sessions Over Time</h3>
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm p-6">
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={stats.timeLogData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis
                      dataKey="day"
                      stroke="rgba(255,255,255,0.5)"
                      tick={{ fill: 'rgba(255,255,255,0.7)' }}
                    />
                    <YAxis
                      stroke="rgba(255,255,255,0.5)"
                      tick={{ fill: 'rgba(255,255,255,0.7)' }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(23, 23, 23, 0.95)",
                        border: "1px solid rgba(255,255,255,0.2)",
                        borderRadius: '0.5rem',
                        color: 'white'
                      }}
                      labelStyle={{ color: 'rgba(255,255,255,0.8)' }}
                      formatter={(value: any) => [`${value} hours`, 'Focus Time']}
                      labelFormatter={(label) => `Day: ${label}`}
                    />
                    <Area
                      type="monotone"
                      dataKey="hours"
                      stroke="rgba(168, 85, 247, 0.8)"
                      fill="rgba(168, 85, 247, 0.3)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>
            </div>
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
