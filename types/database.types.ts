export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          created_at?: string
        }
      }
      focus_sessions: {
        Row: {
          id: string
          user_id: string
          started_at: string
          duration_minutes: number
          subject: string | null
          sub_topic: string | null
          output_text: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          started_at: string
          duration_minutes: number
          subject?: string | null
          sub_topic?: string | null
          output_text?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          started_at?: string
          duration_minutes?: number
          subject?: string | null
          sub_topic?: string | null
          output_text?: string | null
          created_at?: string
        }
      }
      reflections: {
        Row: {
          id: string
          user_id: string
          reflection_date: string
          rating: number
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          reflection_date: string
          rating: number
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          reflection_date?: string
          rating?: number
          notes?: string | null
          created_at?: string
        }
      }
      pomodoro_history: {
        Row: {
          id: string
          user_id: string
          start_time: string
          duration_minutes: number
          completed: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          start_time: string
          duration_minutes: number
          completed?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          start_time?: string
          duration_minutes?: number
          completed?: boolean
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
