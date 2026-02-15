import { NextResponse } from "next/server";
import { z } from "zod";
import { getTranscript } from "@/lib/supadata";
import { summarizeTranscript } from "@/lib/summarize";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const requestSchema = z.object({
  url: z.string().url(),
  lang: z.string().optional()
});

export async function POST(req: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Требуется авторизация" }, { status: 401 });
    }

    const body = await req.json();
    const { url, lang } = requestSchema.parse(body);

    const { data: creditRow } = await supabase
      .from("user_credits")
      .select("balance")
      .eq("user_id", user.id)
      .single();

    if (!creditRow || creditRow.balance < 1) {
      return NextResponse.json(
        { error: "Недостаточно кредитов для генерации нового конспекта" },
        { status: 402 }
      );
    }

    const transcript = await getTranscript({ url, lang });
    const summary = await summarizeTranscript(transcript);

    const { data: consumeData, error: consumeError } = await supabase.rpc(
      "consume_credit_and_store_summary",
      {
        p_source_url: url,
        p_summary_text: summary
      }
    );

    if (consumeError) {
      const status = consumeError.message.includes("INSUFFICIENT_CREDITS") ? 402 : 500;
      return NextResponse.json(
        {
          error:
            status === 402
              ? "Недостаточно кредитов для генерации нового конспекта"
              : consumeError.message
        },
        { status }
      );
    }

    const remainingCredits = consumeData?.[0]?.remaining_credits ?? Math.max(creditRow.balance - 1, 0);

    return NextResponse.json({ summary, remainingCredits });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Неверные данные запроса", details: error.flatten() },
        { status: 400 }
      );
    }

    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
