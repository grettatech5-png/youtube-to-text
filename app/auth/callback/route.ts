import { NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")

  if (!code) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  const supabase = await createSupabaseServerClient()
  await supabase.auth.exchangeCodeForSession(code)
  await supabase.rpc("bootstrap_user_credits")

  return NextResponse.redirect(new URL("/", request.url))
}

