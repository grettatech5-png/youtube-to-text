"use client"

import { FormEvent, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { createSupabaseBrowserClient } from "@/lib/supabase/browser"

export default function RegisterPage() {
  const router = useRouter()
  const supabase = createSupabaseBrowserClient()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    const redirectTo = `${window.location.origin}/auth/callback`
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: redirectTo }
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    if (data.session) {
      await supabase.rpc("bootstrap_user_credits")
      router.push("/")
      router.refresh()
      return
    }

    setMessage("Проверьте email и подтвердите регистрацию, затем выполните вход.")
    setLoading(false)
  }

  const signInWithGoogle = async () => {
    setLoading(true)
    setError(null)
    setMessage(null)

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
      <h1 className="text-3xl font-bold">Регистрация</h1>
      <p className="mt-2 text-sm text-muted-foreground">Создайте аккаунт и получите 5 кредитов при первом успешном входе.</p>

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
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Пароль (минимум 6 символов)"
          className="h-11 w-full rounded-xl border border-border bg-card px-4"
        />

        {error && <p className="text-sm text-destructive">{error}</p>}
        {message && <p className="text-sm text-foreground">{message}</p>}

        <Button type="submit" className="h-11 w-full rounded-xl" disabled={loading}>
          {loading ? "Создаем аккаунт..." : "Зарегистрироваться"}
        </Button>
      </form>

      <Button
        type="button"
        className="mt-3 h-11 w-full rounded-xl border border-input bg-background text-foreground hover:bg-accent"
        onClick={signInWithGoogle}
        disabled={loading}
      >
        Регистрация через Google
      </Button>

      <p className="mt-4 text-sm text-muted-foreground">
        Уже есть аккаунт? <Link className="text-primary underline" href="/login">Войти</Link>
      </p>
    </main>
  )
}

