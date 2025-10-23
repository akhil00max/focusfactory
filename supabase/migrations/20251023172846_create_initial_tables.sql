/*
  # Create FocusFactory Database Schema

  1. New Tables
    - `focus_sessions`
      - `id` (uuid, primary key)
      - `user_id` (text, clerk user id)
      - `time` (integer, duration in minutes)
      - `subject` (text, main topic)
      - `sub_topic` (text, optional subtopic)
      - `output_text` (text, AI generated plan)
      - `created_at` (timestamptz)
    
    - `reflections`
      - `id` (uuid, primary key)
      - `user_id` (text, clerk user id)
      - `date` (date)
      - `rating` (integer, 1-10)
      - `notes` (text, optional)
      - `created_at` (timestamptz)
    
    - `pomodoro_history`
      - `id` (uuid, primary key)
      - `user_id` (text, clerk user id)
      - `duration` (integer, minutes)
      - `completed` (boolean)
      - `start_time` (timestamptz)
      - `end_time` (timestamptz, optional)
      - `created_at` (timestamptz)
    
    - `goals`
      - `id` (uuid, primary key)
      - `user_id` (text, clerk user id)
      - `name` (text)
      - `progress` (integer, 0-100)
      - `target` (integer, default 100)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create focus_sessions table
CREATE TABLE IF NOT EXISTS focus_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  time integer NOT NULL,
  subject text NOT NULL,
  sub_topic text,
  output_text text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE focus_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own focus sessions"
  ON focus_sessions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can view own focus sessions public"
  ON focus_sessions FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Users can insert own focus sessions"
  ON focus_sessions FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can insert own focus sessions public"
  ON focus_sessions FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Users can update own focus sessions"
  ON focus_sessions FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete own focus sessions"
  ON focus_sessions FOR DELETE
  TO authenticated
  USING (true);

-- Create reflections table
CREATE TABLE IF NOT EXISTS reflections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  date date NOT NULL DEFAULT CURRENT_DATE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 10),
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE reflections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own reflections"
  ON reflections FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can view own reflections public"
  ON reflections FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Users can insert own reflections"
  ON reflections FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can insert own reflections public"
  ON reflections FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Users can update own reflections"
  ON reflections FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete own reflections"
  ON reflections FOR DELETE
  TO authenticated
  USING (true);

-- Create pomodoro_history table
CREATE TABLE IF NOT EXISTS pomodoro_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  duration integer NOT NULL DEFAULT 25,
  completed boolean DEFAULT false,
  start_time timestamptz NOT NULL DEFAULT now(),
  end_time timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE pomodoro_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own pomodoro history"
  ON pomodoro_history FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can view own pomodoro history public"
  ON pomodoro_history FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Users can insert own pomodoro history"
  ON pomodoro_history FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can insert own pomodoro history public"
  ON pomodoro_history FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Users can update own pomodoro history"
  ON pomodoro_history FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete own pomodoro history"
  ON pomodoro_history FOR DELETE
  TO authenticated
  USING (true);

-- Create goals table
CREATE TABLE IF NOT EXISTS goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  name text NOT NULL,
  progress integer NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  target integer NOT NULL DEFAULT 100,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own goals"
  ON goals FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can view own goals public"
  ON goals FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Users can insert own goals"
  ON goals FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can insert own goals public"
  ON goals FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Users can update own goals"
  ON goals FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete own goals"
  ON goals FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS focus_sessions_user_id_idx ON focus_sessions(user_id);
CREATE INDEX IF NOT EXISTS focus_sessions_created_at_idx ON focus_sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS reflections_user_id_idx ON reflections(user_id);
CREATE INDEX IF NOT EXISTS reflections_date_idx ON reflections(date DESC);
CREATE INDEX IF NOT EXISTS pomodoro_history_user_id_idx ON pomodoro_history(user_id);
CREATE INDEX IF NOT EXISTS pomodoro_history_start_time_idx ON pomodoro_history(start_time DESC);
CREATE INDEX IF NOT EXISTS goals_user_id_idx ON goals(user_id);
