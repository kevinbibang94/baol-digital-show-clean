import { createClient } from '@supabase/supabase-js'

// On récupère les variables d'environnement définies dans Netlify ou dans ton .env.local
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
