import type { NextRequest } from "next/server";

export const WRITE_KEY_HEADER = "x-fieldnotes-key";

export function isAuthorized(request: NextRequest): boolean {
  const key = process.env.WRITE_KEY;
  if (!key) return true;
  return request.headers.get(WRITE_KEY_HEADER) === key;
}
