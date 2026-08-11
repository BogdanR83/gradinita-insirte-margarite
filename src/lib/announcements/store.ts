import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { put, list, del } from "@vercel/blob";
import type { Announcement, AnnouncementInput } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "announcements.json");
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const BLOB_META_PATHNAME = "announcements/meta.json";

const DEFAULT_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "welcome-001",
    title: "Bine ați venit pe noul site!",
    body: "Aici vom publica anunțuri pentru părinți: înscrieri, program special, activități și documente PDF.",
    createdAt: "2026-08-11T10:00:00.000Z",
  },
];

function useBlob() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

function isVercel() {
  return Boolean(process.env.VERCEL);
}

function assertWritable() {
  if (isVercel() && !useBlob()) {
    throw new Error(
      "Pe Vercel, anunțurile necesită Vercel Blob. Adaugă BLOB_READ_WRITE_TOKEN în Environment Variables.",
    );
  }
}

async function ensureLocalWritable() {
  assertWritable();
  await mkdir(DATA_DIR, { recursive: true });
  await mkdir(UPLOAD_DIR, { recursive: true });
}

async function readLocal(): Promise<Announcement[]> {
  try {
    const raw = await readFile(DATA_FILE, "utf8");
    return JSON.parse(raw) as Announcement[];
  } catch {
    return DEFAULT_ANNOUNCEMENTS;
  }
}

async function writeLocal(items: Announcement[]) {
  await ensureLocalWritable();
  await writeFile(DATA_FILE, `${JSON.stringify(items, null, 2)}\n`, "utf8");
}

async function readBlobMeta(): Promise<Announcement[]> {
  try {
    const result = await list({ prefix: "announcements/", limit: 1000 });
    const meta = result.blobs.find((blob) => blob.pathname === BLOB_META_PATHNAME);
    if (!meta) return DEFAULT_ANNOUNCEMENTS;

    const response = await fetch(meta.url, { cache: "no-store" });
    if (!response.ok) return DEFAULT_ANNOUNCEMENTS;
    const items = (await response.json()) as Announcement[];
    return items.length > 0 ? items : DEFAULT_ANNOUNCEMENTS;
  } catch {
    return DEFAULT_ANNOUNCEMENTS;
  }
}

async function writeBlobMeta(items: Announcement[]) {
  await put(BLOB_META_PATHNAME, JSON.stringify(items, null, 2), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
}

export async function listAnnouncements(): Promise<Announcement[]> {
  try {
    const items = useBlob() ? await readBlobMeta() : await readLocal();
    return [...items].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  } catch {
    return DEFAULT_ANNOUNCEMENTS;
  }
}

export async function createAnnouncement(
  input: AnnouncementInput,
  pdf?: { buffer: Buffer; filename: string; contentType: string },
): Promise<Announcement> {
  assertWritable();

  const title = input.title.trim();
  const body = input.body?.trim();

  if (!title) {
    throw new Error("Titlul este obligatoriu.");
  }
  if (!body && !pdf) {
    throw new Error("Adaugă un text sau un PDF.");
  }

  let pdfUrl: string | undefined;
  let pdfName: string | undefined;

  if (pdf) {
    const safeName = pdf.filename.replace(/[^a-zA-Z0-9._-]/g, "_");
    if (useBlob()) {
      const blob = await put(`announcements/files/${Date.now()}-${safeName}`, pdf.buffer, {
        access: "public",
        contentType: pdf.contentType || "application/pdf",
      });
      pdfUrl = blob.url;
      pdfName = pdf.filename;
    } else {
      await ensureLocalWritable();
      const stored = `${Date.now()}-${safeName}`;
      await writeFile(path.join(UPLOAD_DIR, stored), pdf.buffer);
      pdfUrl = `/uploads/${stored}`;
      pdfName = pdf.filename;
    }
  }

  const announcement: Announcement = {
    id: crypto.randomUUID(),
    title,
    body: body || undefined,
    pdfUrl,
    pdfName,
    createdAt: new Date().toISOString(),
  };

  const items = await listAnnouncements();
  const next = [announcement, ...items.filter((item) => item.id !== "welcome-001")];

  if (useBlob()) {
    await writeBlobMeta(next);
  } else {
    await writeLocal(next);
  }

  return announcement;
}

export async function deleteAnnouncement(id: string) {
  assertWritable();

  const items = await listAnnouncements();
  const target = items.find((item) => item.id === id);
  if (!target) {
    throw new Error("Anunțul nu a fost găsit.");
  }

  const next = items.filter((item) => item.id !== id);

  if (useBlob()) {
    if (target.pdfUrl) {
      try {
        await del(target.pdfUrl);
      } catch {
        // Ignore missing blob cleanup errors.
      }
    }
    await writeBlobMeta(next);
  } else {
    await writeLocal(next);
  }
}

export function storageMode() {
  return useBlob() ? "blob" : "local";
}
