import { createBrowserClient } from "@supabase/ssr";
import { Database } from "@/types/database";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const createClient = () =>
  createBrowserClient<Database>(
    'https://gfrbqjeoqoufqxkpiaas.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmcmJxamVvcW91ZnF4a3BpYWFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyMjAyODgsImV4cCI6MjA3Njc5NjI4OH0.G7rVZtth2aYuV7uY39NqrazqCZ4Fyfn7FuFTbU2W-zY',
  );
