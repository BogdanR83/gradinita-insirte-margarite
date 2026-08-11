import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { put, list, del } from "@vercel/blob";
import type { Announcement, AnnouncementInput } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "announcements.json");
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const BLOB_META_PATHNAME = "announcements/meta.json";

function useBlob() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

async function ensureLocalFiles() {
  await mkdir(DATA_DIR, { recursive: true });
  await mkdir(UPLOAD_DIR, { recursive: true });
  try {
    await readFile(DATA_FILE, "utf8");
  } catch {
    await writeFile(DATA_FILE, "[]\n", "utf8");
  }
}

async function readLocal(): Promise<Announcement[]> {
  await ensureLocalFiles();
  const raw = await readFile(DATA_FILE, "utf8");
  return JSON.parse(raw) as Announcement[];
}

async function writeLocal(items: Announcement[]) {
  await ensureLocalFiles();
  await writeFile(DATA_FILE, `${JSON.stringify(items, null, 2)}\n`, "utf8");
}

async function readBlobMeta(): Promise<Announcement[]> {
  const result = await list({ prefix: "announcements/", limit: 1000 });
  const meta = result.blobs.find((blob) => blob.pathname === BLOB_META_PATHNAME);
  if (!meta) return [];

  const response = await fetch(meta.url, { cache: "no-store" });
  if (!response.ok) return [];
  return (await response.json()) as Announcement[];
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
  const items = useBlob() ? await readBlobMeta() : await readLocal();
  return [...items].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export async function createAnnouncement(
  input: AnnouncementInput,
  pdf?: { buffer: Buffer; filename: string; contentType: string },
): Promise<Announcement> {
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
      await ensureLocalFiles();
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
  items.unshift(announcement);

  if (useBlob()) {
    await writeBlobMeta(items);
  } else {
    await writeLocal(items);
  }

  return announcement;
}

export async function deleteAnnouncement(id: string) {
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
