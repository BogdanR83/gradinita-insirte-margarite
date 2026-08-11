import { NextResponse } from "next/server";
import { createSession, verifyPassword } from "@/lib/auth";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { password?: string } | null;
  const password = body?.password ?? "";

  if (!verifyPassword(password)) {
    return NextResponse.json({ error: "Parolă incorrectă." }, { status: 401 });
  }

  await createSession();
  return NextResponse.json({ ok: true });
}
