const required = (name: string) => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
};

export const SUPADATA_API_KEY = required("SUPADATA_API_KEY");
export const GEMINI_API_KEY = required("GEMINI_API_KEY");

export const GEMINI_MODEL = process.env.GEMINI_MODEL ?? "gemini-flash-lite-latest";
export const SUPADATA_BASE_URL =
  process.env.SUPADATA_BASE_URL ?? "https://api.supadata.ai/v1";

export const SUPADATA_POLL_INTERVAL_MS = Number(
  process.env.SUPADATA_POLL_INTERVAL_MS ?? "1000"
);
export const SUPADATA_MAX_POLL_ATTEMPTS = Number(
  process.env.SUPADATA_MAX_POLL_ATTEMPTS ?? "90"
);
