"use client"

import { Navigation } from "@/components/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { Sparkles, Clock, CheckCircle, BarChart2 } from "lucide-react"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { createClient } from "@/utils/supabase/client"
import { useUser } from "@clerk/nextjs"

interface FocusSession {
  id: string
  created_at: string
  time: number
  subject: string
  sub_topic?: string
  notes?: string
}

interface Reflection {
  id: string
  date: string
  rating: number
  notes: string
  achievements: string[]
  tags: string[]
}

interface PomodoroSession {
  id: string
  start_time: string
  end_time: string
  duration: number
  completed: boolean
}

export default function Reflection() {
  const { user } = useUser()
  const [loading, setLoading] = useState(true)
  const [focusSessions, setFocusSessions] = useState<FocusSession[]>([])
  const [reflections, setReflections] = useState<Reflection[]>([])
  const [pomodoroSessions, setPomodoroSessions] = useState<PomodoroSession[]>([])
  const [summary, setSummary] = useState<string | null>(null)
  const [showSummary, setShowSummary] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return
      
      try {
        const supabase = createClient()
        
        // Get today's date range
        const today = new Date()
        const startOfDay = new Date(today)
        startOfDay.setHours(0, 0, 0, 0)
        const endOfDay = new Date(today)
        endOfDay.setHours(23, 59, 59, 999)
        
        // Fetch today's focus sessions
        const { data: sessions } = await supabase
          .from('focus_sessions')
          .select('*')
          .eq('user_id', user.id)
          .gte('created_at', startOfDay.toISOString())
          .lte('created_at', endOfDay.toISOString())
          .order('created_at', { ascending: false })
        
        // Fetch today's reflections
        const { data: todayReflections } = await supabase
          .from('reflections')
          .select('*')
          .eq('user_id', user.id)
          .eq('date', today.toISOString().split('T')[0])
          .order('created_at', { ascending: false })
          .limit(1)
        
        // Fetch today's pomodoro sessions
        const { data: pomodoro } = await supabase
          .from('pomodoro_history')
          .select('*')
          .eq('user_id', user.id)
          .gte('start_time', startOfDay.toISOString())
          .lte('start_time', endOfDay.toISOString())
          .order('start_time', { ascending: false })
        
        setFocusSessions(sessions || [])
        setReflections(todayReflections || [])
        setPomodoroSessions(pomodoro || [])
        
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [user])
  
  const totalFocusTime = focusSessions.reduce((total, session) => total + (session.time || 0), 0)
  const completedPomodoros = pomodoroSessions.filter(session => session.completed).length
  const focusScore = reflections[0]?.rating ? `${reflections[0].rating}/10` : 'N/A'
  
  const handleGenerateSummary = async () => {
    setLoading(true)
    try {
      // Calculate focus score based on sessions and reflections
      let score = 0
      if (focusSessions.length > 0) {
        const totalSessions = focusSessions.length
        const totalTime = focusSessions.reduce((sum, s) => sum + (s.time || 0), 0)
        const avgSessionTime = totalTime / totalSessions
        
        // Simple scoring algorithm (adjust weights as needed)
        const timeScore = Math.min(10, Math.floor(totalTime / 15)) // 1 point per 15 minutes, max 10
        const consistencyScore = Math.min(5, totalSessions) // 1 point per session, max 5
        const pomodoroScore = Math.min(5, completedPomodoros) // 1 point per pomodoro, max 5
        
        score = Math.round((timeScore + consistencyScore + pomodoroScore) / 2)
      }
      
      // Generate summary based on the data
      const today = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
      
      const summaryText = `
# ${today}

## Focus Summary
- Total focus time: ${Math.floor(totalFocusTime / 60)}h ${totalFocusTime % 60}m
- Completed sessions: ${focusSessions.length}
- Pomodoro sessions: ${completedPomodoros}
- Focus score: ${score}/10

## Session Details
${focusSessions.map((session, i) => 
  `- ${session.subject}${session.sub_topic ? ` (${session.sub_topic})` : ''} - ${session.time} minutes`
).join('\n')}

## Achievements
${completedPomodoros > 0 ? `- Completed ${completedPomodoros} Pomodoro sessions` : ''}
${focusSessions.length >= 3 ? '- Maintained focus across multiple sessions' : ''}
${totalFocusTime >= 60 ? '- Reached 1+ hour of focused work' : ''}

## Recommendations
- ${score < 5 ? 'Try to minimize distractions during focus sessions' : 'Great job maintaining focus!'}
- ${completedPomodoros < 3 ? 'Consider using the Pomodoro technique more consistently' : 'Excellent use of Pomodoro technique'}
- ${focusSessions.length === 0 ? 'Try to schedule at least one focus session per day' : 'Keep up the good work!'}
`
      
      setSummary(summaryText)
      setShowSummary(true)
      
    } catch (error) {
      console.error("Error generating summary:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen">
      <Navigation />

      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-5xl font-bold mb-2">Daily Reflection</h1>
            <p className="text-white/60">AI-powered insights into your productivity and focus patterns</p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm p-6">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-semibold">Focus Time</h3>
              </div>
              <p className="text-3xl font-bold">
                {Math.floor(totalFocusTime / 60)}h {totalFocusTime % 60}m
              </p>
              <p className="text-white/60 text-sm mt-1">
                {focusSessions.length} session{focusSessions.length !== 1 ? 's' : ''} today
              </p>
            </Card>
            
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm p-6">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <h3 className="text-lg font-semibold">Pomodoros</h3>
              </div>
              <p className="text-3xl font-bold">
                {completedPomodoros}
                <span className="text-white/60 text-lg ml-1">/ {pomodoroSessions.length} total</span>
              </p>
              <p className="text-white/60 text-sm mt-1">
                {completedPomodoros > 0 ? 'Great job!' : 'Try a Pomodoro session!'}
              </p>
            </Card>
            
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm p-6">
              <div className="flex items-center gap-3 mb-2">
                <BarChart2 className="w-5 h-5 text-yellow-400" />
                <h3 className="text-lg font-semibold">Focus Score</h3>
              </div>
              <p className="text-3xl font-bold">{focusScore}</p>
              <p className="text-white/60 text-sm mt-1">
                {reflections.length > 0 ? 'Based on your reflection' : 'Complete a reflection to get started'}
              </p>
            </Card>
          </div>
          
          {/* Generate Summary Button */}
          <div className="mb-12">
            <Button
              onClick={handleGenerateSummary}
              disabled={loading || focusSessions.length === 0}
              className="bg-white text-black hover:opacity-90 font-bold py-3 px-6 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              {loading ? "Generating..." : "Generate Today's Summary"}
            </Button>
            {focusSessions.length === 0 && (
              <p className="text-white/60 text-sm mt-2">
                Complete at least one focus session to generate a summary
              </p>
            )}
          </div>

          {/* Summary Display */}
          {showSummary && summary && (
            <div className="space-y-6">
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm p-6 md:p-8">
                <div className="prose prose-invert max-w-none text-white/80">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    className="whitespace-pre-wrap leading-relaxed"
                    components={{
                      // Add custom styling for markdown elements if needed
                      h1: ({node, ...props}) => <h1 className="text-2xl font-bold mb-4" {...props} />,
                      h2: ({node, ...props}) => <h2 className="text-xl font-semibold mt-6 mb-3" {...props} />,
                      ul: ({node, ...props}) => <ul className="list-disc pl-5 space-y-1 mb-4" {...props} />,
                      p: ({node, ...props}) => <p className="mb-3" {...props} />,
                    }}
                  >
                    {summary}
                  </ReactMarkdown>
                </div>
              </Card>
              
              {focusSessions.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Session Details</h3>
                  <div className="space-y-3">
                    {focusSessions.map((session, i) => (
                      <Card key={i} className="bg-white/5 border-white/10 backdrop-blur-sm p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{session.subject}</h4>
                            {session.sub_topic && (
                              <p className="text-white/60 text-sm">{session.sub_topic}</p>
                            )}
                            {session.notes && (
                              <p className="text-white/70 text-sm mt-1">{session.notes}</p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{session.time} min</p>
                            <p className="text-white/40 text-xs">
                              {new Date(session.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex gap-4">
                <Button 
                  onClick={() => setShowSummary(false)}
                  variant="outline" 
                  className="flex-1 border-white/20 hover:bg-white/10"
                >
                  Close Summary
                </Button>
                <Button className="flex-1 bg-white text-black hover:opacity-90">
                  Save to Journal
                </Button>
              </div>
            </div>
          )}

          {!summary && (
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm p-12 text-center">
              <div className="text-white/40 mb-4">
                <Sparkles className="w-16 h-16 mx-auto opacity-50" />
              </div>
              <p className="text-white/60">Click "Generate Today's Summary" to see your AI-powered reflection</p>
            </Card>
          )}
        </div>
      </section>
    </main>
  )
}
