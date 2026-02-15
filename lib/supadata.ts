import {
  SUPADATA_API_KEY,
  SUPADATA_BASE_URL,
  SUPADATA_MAX_POLL_ATTEMPTS,
  SUPADATA_POLL_INTERVAL_MS
} from "@/lib/env";

type TranscriptResponse = {
  content: string;
  lang: string;
  availableLangs: string[];
};

type TranscriptJobResponse = {
  jobId: string;
};

type TranscriptJobStatus = {
  status: "queued" | "active" | "completed" | "failed";
  content?: string;
  lang?: string;
  availableLangs?: string[];
  error?: string;
};

export type TranscriptResult = TranscriptResponse;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getTranscript(input: {
  url: string;
  lang?: string;
}): Promise<TranscriptResult> {
  const search = new URLSearchParams({
    url: input.url,
    text: "true",
    mode: "auto"
  });

  if (input.lang) {
    search.set("lang", input.lang);
  }

  const response = await fetch(`${SUPADATA_BASE_URL}/transcript?${search}`, {
    headers: {
      "x-api-key": SUPADATA_API_KEY
    }
  });

  if (response.status === 202) {
    const job = (await response.json()) as TranscriptJobResponse;
    return await pollTranscriptJob(job.jobId);
  }

  if (!response.ok) {
    throw new Error(`Supadata error: ${response.status}`);
  }

  const data = (await response.json()) as TranscriptResponse;
  return data;
}

async function pollTranscriptJob(jobId: string): Promise<TranscriptResult> {
  for (let attempt = 0; attempt < SUPADATA_MAX_POLL_ATTEMPTS; attempt += 1) {
    const response = await fetch(`${SUPADATA_BASE_URL}/transcript/${jobId}`, {
      headers: {
        "x-api-key": SUPADATA_API_KEY
      }
    });

    if (!response.ok) {
      throw new Error(`Supadata job error: ${response.status}`);
    }

    const job = (await response.json()) as TranscriptJobStatus;

    if (job.status === "completed" && job.content) {
      return {
        content: job.content,
        lang: job.lang ?? "unknown",
        availableLangs: job.availableLangs ?? []
      };
    }

    if (job.status === "failed") {
      throw new Error(job.error ?? "Supadata job failed");
    }

    await sleep(SUPADATA_POLL_INTERVAL_MS);
  }

  throw new Error("Supadata job timeout");
}
