import { Link2, MousePointerClick, FileCheck } from "lucide-react"

const steps = [
  {
    number: "01",
    icon: Link2,
    title: "Вставьте ссылку",
    description:
      "Скопируйте ссылку на любое YouTube-видео и вставьте в поле на главной.",
  },
  {
    number: "02",
    icon: MousePointerClick,
    title: 'Нажмите "Получить конспект"',
    description:
      "Сервис автоматически извлечёт субтитры и обработает содержание видео.",
  },
  {
    number: "03",
    icon: FileCheck,
    title: "Получите текст",
    description:
      "Структурированный конспект с тезисами, заголовками и таймкодами готов.",
  },
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-card py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-14 text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
            Как это работает
          </h2>
          <p className="mt-3 text-muted-foreground">
            Три простых шага до готового конспекта
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.number}
              className="group relative rounded-2xl border border-border bg-background p-8 shadow-sm transition-shadow hover:shadow-md"
            >
              {/* Number */}
              <span className="mb-5 block text-sm font-bold text-primary">
                {step.number}
              </span>
              {/* Icon */}
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <step.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
