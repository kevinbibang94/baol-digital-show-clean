import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://uuqrmugxdlnvoquqwipu.supabase.co'
const supabaseAnonKey = 'sb_publishable__K3a3OMxvWg-WuZ13Fx9eg_-4y2V8gZ'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
