"use client"

import { Navigation } from "@/components/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import Link from "next/link"
import { createClient } from "@/utils/supabase/client"
import { useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"

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

export default function Dashboard() {
  const { user } = useUser()
  const [focusSessions, setFocusSessions] = useState<any[]>([])
  const [reflections, setReflections] = useState<any[]>([])
  const [pomodoroHistory, setPomodoroHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    currentStreak: 0,
    weeklyHours: 0,
    activeGoals: 0,
    timeLogData: Array(7).fill(0).map((_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (6 - i))
      return {
        day: getDayOfWeek(date),
        hours: 0,
        date: date.toISOString().split('T')[0]
      }
    })
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

        // Calculate weekly hours
        const startOfWeek = getStartOfWeek(new Date())
        const weeklySessions = sessions?.filter(session => {
          const sessionDate = new Date(session.created_at)
          return sessionDate >= startOfWeek
        }) || []
        
        const weeklyHours = weeklySessions.reduce((total, session) => {
          return total + (parseInt(session.time) || 0)
        }, 0) / 60 // Convert minutes to hours

        // Calculate time log data
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
          
          return {
            day: getDayOfWeek(date),
            hours: parseFloat(dayHours.toFixed(1)),
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

        // Count active goals (focus sessions not marked as completed)
        const activeGoals = sessions?.filter(session => !session.completed).length || 0

        setFocusSessions(sessions || [])
        setReflections(userReflections || [])
        setPomodoroHistory(pomodoro || [])
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
              <div className="text-white/60 text-sm mb-2">Active Sessions</div>
              <div className="text-4xl font-bold mb-2">{stats.activeGoals}</div>
              <div className="text-white/40 text-xs">
                {stats.activeGoals > 0 ? 'In progress' : 'No active sessions'}
              </div>
            </Card>
          </div>

          {/* Recent Focus Sessions */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Recent Focus Sessions</h2>
              <Link href="/flow-mode">
                <Button className="bg-white text-black hover:opacity-90">New Session</Button>
              </Link>
            </div>
            {focusSessions.length > 0 ? (
              <div className="space-y-4">
                {focusSessions.map((session) => (
                  <Card key={session.id} className="bg-white/5 border-white/10 backdrop-blur-sm p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{session.subject || 'Focus Session'}</h3>
                      <span className="text-white/60 text-sm">
                        {new Date(session.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    {session.sub_topic && (
                      <p className="text-white/70 text-sm mb-3">{session.sub_topic}</p>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div 
                          className="bg-white h-2 rounded-full transition-all" 
                          style={{ 
                            width: `${Math.min(100, (session.time || 0) / 60 * 100)}%`,
                            backgroundColor: session.completed ? '#10B981' : '#3B82F6'
                          }} 
                        />
                      </div>
                      <span className="ml-3 text-white/60 text-sm whitespace-nowrap">
                        {session.time || 0} min
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm p-6 text-center">
                <p className="text-white/60">No focus sessions yet. Start your first session!</p>
                <Link href="/flow-mode" className="mt-4 inline-block">
                  <Button className="bg-white text-black hover:opacity-90">
                    Start Focusing
                  </Button>
                </Link>
              </Card>
            )}
          </div>

          {/* Time Logged Chart */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Weekly Focus Time</h2>
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm p-6">
              {stats.timeLogData.some(day => day.hours > 0) ? (
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
              ) : (
                <div className="h-[300px] flex items-center justify-center text-white/60">
                  No focus time logged this week. Start a session to see your progress!
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
