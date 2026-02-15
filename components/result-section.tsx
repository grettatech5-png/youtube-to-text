import { BookOpen, Clock, Quote } from "lucide-react"
import React from "react"

type ResultSectionProps = {
  summary?: string
}

export function ResultSection({ summary }: ResultSectionProps) {
  const hasSummary = Boolean(summary?.trim())

  const renderFormattedSummary = (raw: string) => {
    const stripMarkdown = (value: string) =>
      value
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .replace(/__(.*?)__/g, "$1")
        .replace(/`([^`]+)`/g, "$1")
        .replace(/\*\*/g, "")
        .replace(/__/g, "")
        .trim()

    const lines = raw.split("\n")
    const nodes: React.ReactNode[] = []
    let listBuffer: string[] = []

    const flushList = (keyBase: string) => {
      if (!listBuffer.length) return
      nodes.push(
        <ul key={`ul-${keyBase}`} className="mb-4 ml-5 list-disc space-y-1">
          {listBuffer.map((item, index) => (
            <li key={`${keyBase}-${index}`} className="leading-relaxed text-foreground">
              {item}
            </li>
          ))}
        </ul>
      )
      listBuffer = []
    }

    lines.forEach((line, index) => {
      const trimmed = line.trim()
      const key = `line-${index}`

      if (!trimmed) {
        flushList(key)
        return
      }

      const bulletMatch = trimmed.match(/^[-*]\s+(.+)/)
      if (bulletMatch) {
        listBuffer.push(stripMarkdown(bulletMatch[1]))
        return
      }

      flushList(key)

      const headingMatch = trimmed.match(/^(#{1,3})\s+(.+)/)
      if (headingMatch) {
        nodes.push(
            <h4 key={key} className="mb-2 mt-5 text-base font-semibold text-foreground first:mt-0">
            {stripMarkdown(headingMatch[2])}
          </h4>
        )
        return
      }

      const numberedSectionMatch = trimmed.match(/^\d+[\).]\s+(.+)/)
      if (numberedSectionMatch) {
        nodes.push(
            <h4 key={key} className="mb-2 mt-5 text-base font-semibold text-foreground first:mt-0">
            {stripMarkdown(numberedSectionMatch[1])}
          </h4>
        )
        return
      }

      const boldOnlyMatch = trimmed.match(/^\*\*(.+)\*\*$/)
      if (boldOnlyMatch) {
        nodes.push(
            <h4 key={key} className="mb-2 mt-5 text-base font-semibold text-foreground first:mt-0">
            {stripMarkdown(boldOnlyMatch[1])}
          </h4>
        )
        return
      }

      nodes.push(
        <p key={key} className="mb-3 leading-relaxed text-foreground">
          {stripMarkdown(trimmed)}
        </p>
      )
    })

    flushList("tail")

    return nodes
  }

  return (
    <section id="result" className="py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-10 text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
            {hasSummary ? "Ваш результат" : "Пример результата"}
          </h2>
          <p className="mt-3 text-muted-foreground">
            {hasSummary
              ? "Готовый конспект по вашему видео"
              : "Вот как выглядит готовый конспект после обработки видео"}
          </p>
        </div>

        <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-card p-6 shadow-lg shadow-foreground/[0.04] sm:p-8">
          {/* Header */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-border pb-5">
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                {hasSummary ? "Конспект готов" : "Как работает машинное обучение"}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {hasSummary ? "Сгенерировано автоматически" : "12 января 2026 · 24:35"}
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <BookOpen className="h-3.5 w-3.5" />
              Авто-сводка
            </span>
          </div>

          {hasSummary ? (
            <div className="rounded-xl border border-border bg-muted/30 p-5 text-sm">
              {renderFormattedSummary(summary!)}
            </div>
          ) : (
            <>
              {/* Key points */}
              <div className="mb-6">
                <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-foreground">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                    <BookOpen className="h-3.5 w-3.5" />
                  </span>
                  Ключевые тезисы
                </h4>
                <ul className="space-y-2.5 text-foreground">
                  <li className="flex gap-3">
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                    <span className="leading-relaxed">
                      Машинное обучение позволяет компьютерам находить закономерности
                      в данных без явного программирования
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                    <span className="leading-relaxed">
                      Три основных типа: обучение с учителем, без учителя и с
                      подкреплением
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                    <span className="leading-relaxed">
                      Нейронные сети имитируют работу мозга и решают сложные задачи
                      распознавания
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                    <span className="leading-relaxed">
                      Качество данных важнее количества — мусорные данные дают
                      мусорные результаты
                    </span>
                  </li>
                </ul>
              </div>

              {/* Structure */}
              <div className="mb-6">
                <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-foreground">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-secondary text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                  </span>
                  Структура
                </h4>
                <div className="space-y-4 text-foreground">
                  <div>
                    <h5 className="font-semibold">Введение в ML</h5>
                    <p className="mt-1 leading-relaxed text-muted-foreground">
                      Автор объясняет базовые концепции машинного обучения и его
                      отличие от классического программирования.
                    </p>
                  </div>
                  <div>
                    <h5 className="font-semibold">Типы обучения</h5>
                    <p className="mt-1 leading-relaxed text-muted-foreground">
                      Подробный разбор supervised, unsupervised и reinforcement
                      learning на практических примерах.
                    </p>
                  </div>
                  <div>
                    <h5 className="font-semibold">Нейронные сети</h5>
                    <p className="mt-1 leading-relaxed text-muted-foreground">
                      Принцип работы и применение в компьютерном зрении, обработке
                      текста и генерации контента.
                    </p>
                  </div>
                </div>
              </div>

              {/* Quotes */}
              <div>
                <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-foreground">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-secondary text-muted-foreground">
                    <Quote className="h-3.5 w-3.5" />
                  </span>
                  Цитаты
                </h4>
                <div className="space-y-3">
                  <blockquote className="rounded-lg border-l-2 border-primary/40 bg-muted/50 py-2 pl-4 pr-3 text-sm leading-relaxed text-muted-foreground">
                    {'"Данные — это новая нефть, но только если уметь их перерабатывать"'}
                    <span className="ml-2 text-xs text-muted-foreground/60">
                      03:42
                    </span>
                  </blockquote>
                  <blockquote className="rounded-lg border-l-2 border-primary/40 bg-muted/50 py-2 pl-4 pr-3 text-sm leading-relaxed text-muted-foreground">
                    {'"Не бойтесь ошибок модели — бойтесь отсутствия метрик для их обнаружения"'}
                    <span className="ml-2 text-xs text-muted-foreground/60">
                      18:15
                    </span>
                  </blockquote>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
