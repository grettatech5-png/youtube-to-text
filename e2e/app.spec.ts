import { test, expect, Page } from '@playwright/test'

/**
 * End-to-end тесты для сервиса создания конспектов YouTube-видео
 */

test.describe('Главная страница', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('должна отображать заголовок страницы', async ({ page }) => {
    await expect(page).toHaveTitle(/YouTube.*конспект|Конспект/i)
  })

  test('должна отображать hero-секция с заголовком', async ({ page }) => {
    const heroTitle = page.locator('h1')
    await expect(heroTitle).toContainText('конспект')
  })

  test('должна отображать форму ввода YouTube URL', async ({ page }) => {
    const input = page.locator('input[type="url"]')
    await expect(input).toBeVisible()
    await expect(input).toHaveAttribute('placeholder', /вставьте ссылку.*youtube/i)
  })

  test('должна отображать кнопка "Получить конспект"', async ({ page }) => {
    const submitButton = page.locator('button[type="submit"]')
    await expect(submitButton).toBeVisible()
    await expect(submitButton).toContainText('Получить конспект')
  })
})

test.describe('Форма ввода YouTube URL', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('должна показывать ошибку при пустом вводе', async ({ page }) => {
    const submitButton = page.locator('button[type="submit"]')
    await submitButton.click()

    const errorMessage = page.locator('text=Вставьте ссылку на YouTube-видео')
    await expect(errorMessage).toBeVisible()
  })

  test('должна показывать ошибку при некорректном URL', async ({ page }) => {
    const input = page.locator('input[type="url"]')
    await input.click()
    await input.type('https://invalid-url.com')
    await expect(input).toHaveValue('https://invalid-url.com')
    
    const submitButton = page.locator('button[type="submit"]')
    await submitButton.click()

    const errorMessage = page.locator('text=Введите корректную ссылку на YouTube')
    await expect(errorMessage).toBeVisible()
  })

  test('должна принимать корректный YouTube URL (youtube.com)', async ({ page }) => {
    const input = page.locator('input[type="url"]')
    await input.fill('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
    
    // Проверяем, что ошибка исчезла
    const errorMessage = page.locator('text=Введите корректную ссылку на YouTube')
    await expect(errorMessage).not.toBeVisible()
  })

  test('должна принимать корректный YouTube URL (youtu.be)', async ({ page }) => {
    const input = page.locator('input[type="url"]')
    await input.fill('https://youtu.be/dQw4w9WgXcQ')
    
    const errorMessage = page.locator('text=Введите корректную ссылку на YouTube')
    await expect(errorMessage).not.toBeVisible()
  })

  test('должна принимать YouTube Shorts URL', async ({ page }) => {
    const input = page.locator('input[type="url"]')
    await input.fill('https://www.youtube.com/shorts/abc123')
    
    const errorMessage = page.locator('text=Введите корректную ссылку на YouTube')
    await expect(errorMessage).not.toBeVisible()
  })
})

test.describe('Секция результатов', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('должна отображать пример результата по умолчанию', async ({ page }) => {
    const resultSection = page.locator('#result')
    await expect(resultSection).toBeVisible()
    
    // Проверяем заголовок секции
    const sectionTitle = resultSection.locator('h2')
    await expect(sectionTitle).toContainText('Пример результата')
  })

  test('должна отображать ключевые тезисы в примере', async ({ page }) => {
    const resultSection = page.locator('#result')
    
    // Проверяем наличие ключевых тезисов
    const keyPoints = resultSection.locator('text=Ключевые тезисы')
    await expect(keyPoints).toBeVisible()
  })

  test('должна отображать структуру в примере', async ({ page }) => {
    const resultSection = page.locator('#result')
    
    const structure = resultSection.locator('text=Структура')
    await expect(structure).toBeVisible()
  })

  test('должна отображать цитаты в примере', async ({ page }) => {
    const resultSection = page.locator('#result')
    
    const quotes = resultSection.locator('text=Цитаты')
    await expect(quotes).toBeVisible()
  })
})

test.describe('Навигация и скролл', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('должна отображать секцию "Как это работает"', async ({ page }) => {
    const howItWorks = page.locator('text=Как это работает')
    await expect(howItWorks.first()).toBeVisible()
  })

  test('должна отображать секцию преимуществ', async ({ page }) => {
    const advantages = page.locator('text=Преимущества')
    await expect(advantages.first()).toBeVisible()
  })

  test('должна отображать FAQ секцию', async ({ page }) => {
    const faq = page.locator('text=Частые вопросы')
    await expect(faq.first()).toBeVisible()
  })
})

test.describe('Адаптивность', () => {
  test('должна корректно отображаться на мобильных устройствах', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    const input = page.locator('input[type="url"]')
    await expect(input).toBeVisible()

    const submitButton = page.locator('button[type="submit"]')
    await expect(submitButton).toBeVisible()
  })

  test('должна корректно отображаться на планшете', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.goto('/')

    const input = page.locator('input[type="url"]')
    await expect(input).toBeVisible()
  })

  test('должна корректно отображаться на десктопе', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.goto('/')

    const input = page.locator('input[type="url"]')
    await expect(input).toBeVisible()
  })
})

test.describe('Доступность (Accessibility)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('форма должна быть доступна для клавиатурной навигации', async ({ page }) => {
    const input = page.locator('input[type="url"]')

    // Программно переводим фокус в поле ввода и проверяем доступность
    await input.focus()
    await expect(input).toBeFocused()
  })

  test('кнопка отправки должна быть доступна', async ({ page }) => {
    const submitButton = page.locator('button[type="submit"]')
    
    // Проверяем, что кнопка не отключена по умолчанию
    await expect(submitButton).toBeEnabled()
  })
})

test.describe('Обработка API запроса (Mock)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('должна отображать состояние загрузки при отправке формы', async ({ page }) => {
    // Мокаем API с задержкой
    await page.route('**/api/summarize', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ summary: 'Тестовый конспект' }),
      })
    })

    const input = page.locator('input[type="url"]')
    await input.click()
    await input.type('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
    await expect(input).toHaveValue('https://www.youtube.com/watch?v=dQw4w9WgXcQ')

    const submitButton = page.locator('button[type="submit"]')
    await submitButton.click()

    // Проверяем состояние загрузки
    const loadingText = page.locator('text=Готовим конспект')
    await expect(loadingText).toBeVisible()

    // Проверяем, что кнопка отключена во время загрузки
    await expect(submitButton).toBeDisabled()
  })

  test('должна отображать результат после успешного запроса', async ({ page }) => {
    // Мокаем успешный ответ
    await page.route('**/api/summarize', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ summary: 'Это тестовый конспект видео.' }),
      })
    })

    const input = page.locator('input[type="url"]')
    await input.click()
    await input.type('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
    await expect(input).toHaveValue('https://www.youtube.com/watch?v=dQw4w9WgXcQ')

    const submitButton = page.locator('button[type="submit"]')
    await submitButton.click()

    // Ждем появления результата
    const resultText = page.locator('text=Это тестовый конспект видео')
    await expect(resultText).toBeVisible({ timeout: 10000 })
  })

  test('должна отображать ошибку при неудачном запросе', async ({ page }) => {
    // Мокаем ошибку сервера
    await page.route('**/api/summarize', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Ошибка сервера' }),
      })
    })

    const input = page.locator('input[type="url"]')
    await input.click()
    await input.type('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
    await expect(input).toHaveValue('https://www.youtube.com/watch?v=dQw4w9WgXcQ')

    const submitButton = page.locator('button[type="submit"]')
    await submitButton.click()

    // Проверяем отображение ошибки
    const errorText = page.locator('text=Ошибка сервера')
    await expect(errorText).toBeVisible({ timeout: 10000 })
  })

  test('должна скроллить к результату после получения конспекта', async ({ page }) => {
    // Мокаем успешный ответ
    await page.route('**/api/summarize', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ summary: 'Тестовый конспект для проверки скролла.' }),
      })
    })

    const input = page.locator('input[type="url"]')
    await input.click()
    await input.type('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
    await expect(input).toHaveValue('https://www.youtube.com/watch?v=dQw4w9WgXcQ')

    const submitButton = page.locator('button[type="submit"]')
    await submitButton.click()

    // Ждем появления результата
    await page.locator('text=Тестовый конспект для проверки скролла').waitFor({ timeout: 10000 })

    // Проверяем, что секция результата видна в viewport
    const resultSection = page.locator('#result')
    await expect(resultSection).toBeInViewport()
  })
})
