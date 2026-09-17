import { NextResponse } from "next/server";
import { parseAnnouncementCategory } from "@/lib/announcements/categories";
import { isAllowedPdf, MAX_FILES, MAX_PDF_BYTES, MAX_PDF_MB } from "@/lib/announcements/limits";
import {
  createAnnouncement,
  listAnnouncements,
  parseAnnouncementFiles,
  storageMode,
} from "@/lib/announcements/store";
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
        files?: unknown;
        pdfUrl?: string;
        pdfName?: string;
        category?: string;
      };
      const files = parseAnnouncementFiles(data.files);
      if (data.pdfUrl?.trim()) {
        files.push({
          url: data.pdfUrl.trim(),
          name: data.pdfName?.trim() || "fisier.pdf",
        });
      }
      if (files.length > MAX_FILES) {
        return NextResponse.json(
          { error: `Poți încărca maximum ${MAX_FILES} fișiere.` },
          { status: 400 },
        );
      }
      const announcement = await createAnnouncement({
        title: String(data.title || ""),
        body: String(data.body || ""),
        files,
        category: parseAnnouncementCategory(data.category),
      });
      return NextResponse.json({ item: announcement }, { status: 201 });
    }

    const form = await request.formData();
    const title = String(form.get("title") || "");
    const body = String(form.get("body") || "");
    const category = parseAnnouncementCategory(form.get("category"));
    const uploaded = [...form.getAll("pdf"), ...form.getAll("pdfs")].filter(
      (file): file is File => file instanceof File && file.size > 0,
    );

    if (uploaded.length > MAX_FILES) {
      return NextResponse.json(
        { error: `Poți încărca maximum ${MAX_FILES} fișiere.` },
        { status: 400 },
      );
    }

    const pdfs: Array<{
      buffer: Buffer;
      filename: string;
      contentType: string;
    }> = [];

    for (const file of uploaded) {
      if (!isAllowedPdf(file)) {
        return NextResponse.json(
          { error: "Doar fișiere PDF sunt acceptate." },
          { status: 400 },
        );
      }
      if (file.size > MAX_PDF_BYTES) {
        return NextResponse.json(
          { error: `Fiecare PDF trebuie să aibă maximum ${MAX_PDF_MB} MB.` },
          { status: 400 },
        );
      }

      pdfs.push({
        buffer: Buffer.from(await file.arrayBuffer()),
        filename: file.name || "anunt.pdf",
        contentType: file.type || "application/pdf",
      });
    }

    const announcement = await createAnnouncement({ title, body, category }, pdfs);
    return NextResponse.json({ item: announcement }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Nu am putut salva anunțul.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
