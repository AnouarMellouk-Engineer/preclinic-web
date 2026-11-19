import "server-only";

/** Error thrown for any non-2xx answer of the Clinic SaaS API. */
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly messages: string[] = [],
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type ApiOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  /** JWT of the signed-in user (from getSession()). */
  token?: string;
  query?: Record<string, string | number | boolean | undefined>;
};

export async function apiFetch<T>(
  path: string,
  { method = "GET", body, token, query }: ApiOptions = {},
): Promise<T> {
  const base = process.env.API_URL;
  if (!base) throw new Error("API_URL is not set");

  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined) search.set(key, String(value));
  }
  const qs = search.size ? `?${search}` : "";

  const response = await fetch(`${base}${path}${qs}`, {
    method,
    headers: {
      ...(body !== undefined && { "Content-Type": "application/json" }),
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    // NestJS returns `message` as a string or a string[] (validation errors).
    const raw = data?.message;
    const messages: string[] = Array.isArray(raw)
      ? raw
      : raw
        ? [String(raw)]
        : [];
    throw new ApiError(
      response.status,
      messages[0] ?? response.statusText,
      messages,
    );
  }
  return data as T;
}
