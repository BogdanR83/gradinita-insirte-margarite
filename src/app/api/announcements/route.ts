import { NextResponse } from "next/server";
import { isAllowedPdf, MAX_PDF_BYTES, MAX_PDF_MB } from "@/lib/announcements/limits";
import { createAnnouncement, listAnnouncements, storageMode } from "@/lib/announcements/store";
import { isAuthenticated } from "@/lib/auth";

export async function GET() {
  const items = await listAnnouncements();
  return NextResponse.json({ items, storage: storageMode() });
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Neautentificat." }, { status: 401 });
  }

  try {
    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const data = (await request.json()) as {
        title?: string;
        body?: string;
        pdfUrl?: string;
        pdfName?: string;
      };
      const announcement = await createAnnouncement({
        title: String(data.title || ""),
        body: String(data.body || ""),
        pdfUrl: data.pdfUrl,
        pdfName: data.pdfName,
      });
      return NextResponse.json({ item: announcement }, { status: 201 });
    }

    const form = await request.formData();
    const title = String(form.get("title") || "");
    const body = String(form.get("body") || "");
    const file = form.get("pdf");

    let pdf:
      | {
          buffer: Buffer;
          filename: string;
          contentType: string;
        }
      | undefined;

    if (file instanceof File && file.size > 0) {
      if (!isAllowedPdf(file)) {
        return NextResponse.json(
          { error: "Doar fișiere PDF sunt acceptate." },
          { status: 400 },
        );
      }
      if (file.size > MAX_PDF_BYTES) {
        return NextResponse.json(
          { error: `PDF-ul trebuie să aibă maximum ${MAX_PDF_MB} MB.` },
          { status: 400 },
        );
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      pdf = {
        buffer,
        filename: file.name || "anunt.pdf",
        contentType: file.type || "application/pdf",
      };
    }

    const announcement = await createAnnouncement({ title, body }, pdf);
    return NextResponse.json({ item: announcement }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Nu am putut salva anunțul.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
