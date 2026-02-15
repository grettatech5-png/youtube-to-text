import { generateSummary } from "@/lib/gemini";
import type { TranscriptResult } from "@/lib/supadata";

export async function summarizeTranscript(transcript: TranscriptResult) {
  const prompt = [
    "Ты — помощник для кратких конспектов видео.",
    "Сделай короткий, структурированный конспект на русском языке.",
    "Структура ответа:",
    "1) Ключевые тезисы (список 4–7 пунктов)",
    "2) Структура (2–4 раздела с подзаголовками)",
    "3) Цитаты/таймкоды (если есть упоминания времени, иначе пропусти раздел)",
    "Текст транскрипта:",
    transcript.content
  ].join("\n");

  return await generateSummary(prompt);
}
