import { NextResponse } from "next/server";
import { deleteAnnouncement } from "@/lib/announcements/store";
import { isAuthenticated } from "@/lib/auth";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function DELETE(_request: Request, context: RouteContext) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Neautentificat." }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    await deleteAnnouncement(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Nu am putut șterge anunțul.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
