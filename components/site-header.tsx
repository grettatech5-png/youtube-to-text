"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createSupabaseBrowserClient } from "@/lib/supabase/browser"

const navLinks = [
  { label: "Как это работает", href: "#how-it-works" },
  { label: "Преимущества", href: "#advantages" },
  { label: "FAQ", href: "#faq" },
]

type SiteHeaderProps = {
  isAuthenticated: boolean
  userEmail?: string | null
  credits?: number
}

export function SiteHeader({ isAuthenticated, userEmail, credits = 0 }: SiteHeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const router = useRouter()

  const signOut = async () => {
    setIsSigningOut(true)
    const supabase = createSupabaseBrowserClient()
    await supabase.auth.signOut()
    router.refresh()
    setIsSigningOut(false)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 lg:h-18">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary-foreground"
            >
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </div>
          <span className="text-lg font-semibold tracking-tight text-foreground">
            Summarify
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
          {isAuthenticated ? (
            <>
              <span className="rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold text-foreground">
                Кредиты: {credits}
              </span>
              <span className="max-w-[180px] truncate text-xs text-muted-foreground">{userEmail}</span>
              <Button className="rounded-xl border border-input bg-background text-foreground hover:bg-accent" onClick={signOut} disabled={isSigningOut}>
                {isSigningOut ? "Выход..." : "Выйти"}
              </Button>
            </>
          ) : (
            <>
              <Button asChild className="rounded-xl border border-input bg-background text-foreground hover:bg-accent">
                <Link href="/login">Войти</Link>
              </Button>
              <Button asChild className="rounded-xl">
                <Link href="/register">Регистрация</Link>
              </Button>
            </>
          )}
        </nav>

        {/* Mobile toggle */}
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg p-2 text-muted-foreground transition-colors hover:text-foreground md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="border-t border-border bg-card px-6 pb-4 pt-2 md:hidden" aria-label="Mobile navigation">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
            {isAuthenticated ? (
              <>
                <div className="rounded-lg border border-border px-3 py-2 text-xs text-foreground">
                  Кредиты: {credits}
                </div>
                <Button
                  className="mt-1 w-full rounded-xl border border-input bg-background text-foreground hover:bg-accent"
                  onClick={() => {
                    setMobileOpen(false)
                    void signOut()
                  }}
                  disabled={isSigningOut}
                >
                  {isSigningOut ? "Выход..." : "Выйти"}
                </Button>
              </>
            ) : (
              <>
                <Button asChild className="mt-1 w-full rounded-xl border border-input bg-background text-foreground hover:bg-accent">
                  <Link href="/login" onClick={() => setMobileOpen(false)}>
                    Войти
                  </Link>
                </Button>
                <Button asChild className="w-full rounded-xl">
                  <Link href="/register" onClick={() => setMobileOpen(false)}>
                    Регистрация
                  </Link>
                </Button>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  )
}
