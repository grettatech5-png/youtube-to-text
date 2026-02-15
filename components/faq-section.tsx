import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "Сколько длится обработка?",
    answer:
      "Обработка занимает от 30 секунд до 2 минут в зависимости от длины видео. Для большинства роликов до 30 минут результат готов менее чем за минуту.",
  },
  {
    question: "Нужна ли регистрация?",
    answer:
      "Нет, регистрация не требуется. Вы можете сразу вставить ссылку и получить конспект. Мы не собираем персональные данные.",
  },
  {
    question: "Можно ли редактировать текст?",
    answer:
      "Да, полученный конспект можно скопировать и отредактировать в любом текстовом редакторе. В будущем мы планируем добавить встроенный редактор.",
  },
  {
    question: "Какие видео поддерживаются?",
    answer:
      "Сервис работает с любыми публичными YouTube-видео, у которых есть субтитры (автоматические или ручные). Приватные и unlisted видео пока не поддерживаются.",
  },
  {
    question: "Это бесплатно?",
    answer:
      "Базовая версия полностью бесплатна. Мы планируем добавить расширенные функции (экспорт в PDF, перевод) в будущем.",
  },
]

export function FaqSection() {
  return (
    <section id="faq" className="bg-card py-20 lg:py-28">
      <div className="mx-auto max-w-3xl px-6">
        <div className="mb-12 text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
            Частые вопросы
          </h2>
          <p className="mt-3 text-muted-foreground">
            Ответы на популярные вопросы о сервисе
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-border">
              <AccordionTrigger className="text-left text-base font-medium text-foreground hover:text-primary hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
