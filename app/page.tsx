import { HomePageClient } from "@/components/home-page-client"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export default async function Page() {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user }
  } = await supabase.auth.getUser()

  let credits = 0
  let lastSummary: string | null = null

  if (user) {
    await supabase.rpc("bootstrap_user_credits")

    const { data: creditRow } = await supabase
      .from("user_credits")
      .select("balance")
      .eq("user_id", user.id)
      .single()

    credits = ((creditRow as { balance?: number } | null)?.balance ?? 0)

    const { data: latestSummary } = await supabase
      .from("summaries")
      .select("summary_text")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle()

    lastSummary = ((latestSummary as { summary_text?: string } | null)?.summary_text ?? null)
  }

  return (
    <HomePageClient
      isAuthenticated={Boolean(user)}
      userEmail={user?.email ?? null}
      initialCredits={credits}
      lastSummary={lastSummary}
    />
  )
}
