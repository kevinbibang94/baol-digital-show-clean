import { createClient } from "@supabase/supabase-js"

// 1) Configuration du client Supabase
const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL ?? "https://uuqrmugxdlnvoquqwipu.supabase.co"
const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1cXJtdWd4ZGxudm9xdXF3aXB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUxODk3NzAsImV4cCI6MjA4MDc2NTc3MH0.qa3UoCKOB1f5h5_ZVxYUNnB8E6b2TSMQ7bQIcpZXNr8"

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)


// 2) Type utile pour les stats du reportage
export type ReportageStats = {
  id: number
  created_at?: string
  views: number
  likes: number
  dislikes: number
}


// 3) Helpers pour la section Reportage

// Lire les stats (ligne id=1)
export async function fetchReportageStats() {
  return supabase.from("reportage_stats").select("*").eq("id", 1).single()
}

// Incrémenter les vues côté serveur
export async function incrementReportageViews(currentViews: number) {
  return supabase
    .from("reportage_stats")
    .update({ views: currentViews + 1 })
    .eq("id", 1)
    .select()
}

// Mettre à jour likes/dislikes
export async function updateReportageReactions(newLikes: number, newDislikes: number) {
  return supabase
    .from("reportage_stats")
    .update({ likes: newLikes, dislikes: newDislikes })
    .eq("id", 1)
    .select()
}


// 4) Subscription en temps réel
export function subscribeReportageStats(
  callback: (updated: ReportageStats) => void
) {
  const channel = supabase
    .channel("reportage_stats_changes")
    .on(
      "postgres_changes",
      { event: "UPDATE", schema: "public", table: "reportage_stats", filter: "id=eq.1" },
      (payload: any) => {
        if (payload?.new) callback(payload.new as ReportageStats)
      }
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}
