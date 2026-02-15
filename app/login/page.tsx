"use client"

import { FormEvent, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { createSupabaseBrowserClient } from "@/lib/supabase/browser"

export default function LoginPage() {
  const router = useRouter()
  const supabase = createSupabaseBrowserClient()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setError(null)

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (signInError) {
      setError(signInError.message)
      setLoading(false)
      return
    }

    await supabase.rpc("bootstrap_user_credits")
    router.push("/")
    router.refresh()
  }

  const signInWithGoogle = async () => {
    setLoading(true)
    setError(null)

    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })

    if (oauthError) {
      setError(oauthError.message)
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-6">
      <h1 className="text-3xl font-bold">Вход</h1>
      <p className="mt-2 text-sm text-muted-foreground">Войдите, чтобы использовать кредиты и сохранять конспекты.</p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="h-11 w-full rounded-xl border border-border bg-card px-4"
        />
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Пароль"
          className="h-11 w-full rounded-xl border border-border bg-card px-4"
        />

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button type="submit" className="h-11 w-full rounded-xl" disabled={loading}>
          {loading ? "Выполняется вход..." : "Войти"}
        </Button>
      </form>

      <Button
        type="button"
        className="mt-3 h-11 w-full rounded-xl border border-input bg-background text-foreground hover:bg-accent"
        onClick={signInWithGoogle}
        disabled={loading}
      >
        Войти через Google
      </Button>

      <p className="mt-4 text-sm text-muted-foreground">
        Нет аккаунта? <Link className="text-primary underline" href="/register">Регистрация</Link>
      </p>
    </main>
  )
}

