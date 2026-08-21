import { NextResponse } from "next/server";

export function apiError(err: unknown) {
  const message = err instanceof Error ? err.message : "Unexpected error";
  return NextResponse.json({ error: message }, { status: 500 });
}
