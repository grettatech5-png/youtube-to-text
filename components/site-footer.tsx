export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 py-10 sm:flex-row">
        {/* Logo & description */}
        <div className="flex flex-col items-center gap-2 sm:items-start">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
              <svg
                width="14"
                height="14"
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
            <span className="text-base font-semibold text-foreground">
              Summarify
            </span>
          </div>
          <p className="text-center text-sm text-muted-foreground sm:text-left">
            Конспект YouTube-видео за минуту
          </p>
        </div>

        {/* Links */}
        <nav className="flex gap-6 text-sm text-muted-foreground" aria-label="Footer navigation">
          <a href="#" className="transition-colors hover:text-foreground">
            Политика конфиденциальности
          </a>
          <a href="#" className="transition-colors hover:text-foreground">
            Контакты
          </a>
        </nav>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-5 text-center text-xs text-muted-foreground">
          {'© 2026 Summarify. Все права защищены.'}
        </div>
      </div>
    </footer>
  )
}
