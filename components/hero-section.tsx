"use client"

import React from "react"
import Link from "next/link"

import { useState } from "react"
import { ArrowRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

function getYoutubeVideoId(value: string): string | null {
  const raw = value.trim()
  if (!raw) return null

  const directId = raw.match(/^[a-zA-Z0-9_-]{11}$/)?.[0]
  if (directId) return directId

  try {
    const normalized = raw.startsWith("http") ? raw : `https://${raw}`
    const url = new URL(normalized)

    if (url.hostname.includes("youtu.be")) {
      const id = url.pathname.split("/").filter(Boolean)[0]
      return id && id.length >= 11 ? id.slice(0, 11) : null
    }

    if (url.hostname.includes("youtube.com")) {
      const fromQuery = url.searchParams.get("v")
      if (fromQuery && fromQuery.length >= 11) {
        return fromQuery.slice(0, 11)
      }

      const parts = url.pathname.split("/").filter(Boolean)
      const shortsIndex = parts.findIndex((part) => part === "shorts" || part === "embed")
      if (shortsIndex >= 0 && parts[shortsIndex + 1]) {
        return parts[shortsIndex + 1].slice(0, 11)
      }
    }
  } catch {
    return null
  }

  return null
}

type HeroSectionProps = {
  onSummary: (summary: string) => void
  isAuthenticated?: boolean
  credits?: number
  onCreditsChange?: (credits: number) => void
  onRequestStart?: () => void
  onRequestEnd?: () => void
}

export function HeroSection({
  onSummary,
  isAuthenticated = false,
  credits = 0,
  onCreditsChange,
  onRequestStart,
  onRequestEnd
}: HeroSectionProps) {
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const videoId = getYoutubeVideoId(url)
  const previewSrc = videoId
    ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
    : "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!url.trim()) {
      setError("Вставьте ссылку на YouTube-видео")
      return
    }

    const ytRegex =
      /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/|shorts\/)|youtu\.be\/)/
    if (!ytRegex.test(url.trim())) {
      setError("Введите корректную ссылку на YouTube")
      return
    }

    setLoading(true)
    onRequestStart?.()

    try {
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ url: url.trim() })
      })

      const data = (await response.json()) as {
        summary?: string
        error?: string
        remainingCredits?: number
      }

      if (!response.ok) {
        throw new Error(data.error || "Ошибка получения конспекта")
      }

      if (!data.summary) {
        throw new Error("Конспект не получен")
      }

      onSummary(data.summary)
      if (typeof data.remainingCredits === "number") {
        onCreditsChange?.(data.remainingCredits)
      }
      const el = document.getElementById("result")
      if (el) el.scrollIntoView({ behavior: "smooth" })
    } catch (err) {
      const message = err instanceof Error ? err.message : "Неизвестная ошибка"
      setError(message)
    } finally {
      setLoading(false)
      onRequestEnd?.()
    }
  }

  return (
    <section id="hero" className="relative overflow-hidden pb-20 pt-16 lg:pb-28 lg:pt-24">
      {/* Subtle bg decoration */}
      <div className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-40 h-[400px] w-[400px] rounded-full bg-primary/5 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left — Text */}
          <div className="flex flex-col gap-6">
            <h1 className="text-balance text-4xl font-bold leading-tight tracking-tight text-foreground lg:text-5xl xl:text-6xl">
              Быстрый конспект видео из YouTube
            </h1>
            <p className="max-w-lg text-lg leading-relaxed text-muted-foreground">
              Вставьте ссылку — сервис выделит ключевые тезисы и структурирует
              текст. Экономьте время на просмотре длинных видео.
            </p>

          </div>

          {/* Right — Mock card */}
          <div className="hidden lg:block">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-lg shadow-foreground/[0.03]">
              <div className="mb-4 flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-primary/80" />
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  preview
                </span>
              </div>
              <h3 className="mb-3 text-base font-semibold text-foreground">
                Конспект видео
              </h3>
              <div className="overflow-hidden rounded-xl border border-border bg-muted/30">
                <img
                  src={previewSrc}
                  alt="Превью видео"
                  className="h-44 w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Input form */}
        {!isAuthenticated && (
          <div className="mt-10 rounded-2xl border border-border bg-card p-4 text-sm text-muted-foreground">
            Для генерации конспекта нужно войти в аккаунт.
            <div className="mt-3 flex flex-wrap gap-2">
              <Button asChild className="rounded-xl border border-input bg-background text-foreground hover:bg-accent">
                <Link href="/login">Войти</Link>
              </Button>
              <Button asChild className="rounded-xl">
                <Link href="/register">Регистрация</Link>
              </Button>
            </div>
          </div>
        )}

        {isAuthenticated && credits <= 0 && (
          <div className="mt-10 rounded-2xl border border-border bg-card p-4 text-sm text-muted-foreground">
            Кредиты закончились. Новые запросы недоступны, но ниже сохранен последний конспект.
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="relative mt-12 flex flex-col gap-3 sm:flex-row sm:gap-0 lg:mt-16"
        >
          <div className="relative flex-1">
            <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                className="text-muted-foreground"
              >
                <path
                  d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.43z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <polygon
                  points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <input
              type="url"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value)
                setError("")
              }}
              placeholder="Вставьте ссылку на YouTube..."
              className={`h-14 w-full rounded-xl border bg-card pl-12 pr-4 text-base text-foreground shadow-sm outline-none transition-all placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30 sm:rounded-r-none sm:border-r-0 ${
                error
                  ? "border-destructive focus:ring-destructive/30"
                  : "border-border"
              }`}
              disabled={loading}
            />
          </div>
          <Button
            type="submit"
            disabled={loading || !isAuthenticated || credits <= 0}
            className="h-14 gap-2 rounded-xl px-8 text-base font-semibold shadow-md shadow-primary/20 sm:rounded-l-none"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Готовим конспект...
              </>
            ) : (
              <>
                Получить конспект
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
          {error && (
            <p className="absolute -bottom-7 left-0 text-sm text-destructive">
              {error}
            </p>
          )}
        </form>
      </div>
    </section>
  )
}
