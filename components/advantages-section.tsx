import { Clock, Brain, Smartphone } from "lucide-react"

const advantages = [
  {
    icon: Clock,
    title: "Экономия времени",
    description:
      "Получите суть 60-минутного видео за 2 минуты чтения структурированного конспекта.",
  },
  {
    icon: Brain,
    title: "Умное выделение смыслов",
    description:
      "Алгоритм выделяет ключевые тезисы, отсекая воду и повторения.",
  },
  {
    icon: Smartphone,
    title: "Работает везде",
    description:
      "Сервис адаптирован под любые устройства — телефон, планшет или компьютер.",
  },
]

export function AdvantagesSection() {
  return (
    <section id="advantages" className="py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-14 text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
            Преимущества
          </h2>
          <p className="mt-3 text-muted-foreground">
            Почему тысячи пользователей выбирают Summarify
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {advantages.map((item) => (
            <div
              key={item.title}
              className="group rounded-2xl border border-border bg-card p-7 shadow-sm transition-all hover:shadow-md"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <item.icon className="h-5 w-5" />
              </div>
              <h3 className="mb-2 text-base font-semibold text-foreground">
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
