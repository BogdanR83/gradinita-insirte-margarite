import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { put, list, del } from "@vercel/blob";
import {
  isAnnouncementCategory,
  parseAnnouncementCategory,
  type AnnouncementCategory,
} from "./categories";
import type {
  Announcement,
  AnnouncementFile,
  AnnouncementInput,
  StoredAnnouncement,
} from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "announcements.json");
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const BLOB_META_PATHNAME = "announcements/meta.json";

const DEFAULT_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "welcome-001",
    title: "Bine ați venit pe noul site!",
    body: "Aici vom publica anunțuri pentru părinți: înscrieri, program special, activități și documente PDF.",
    files: [],
    category: "parinti",
    createdAt: "2026-08-11T10:00:00.000Z",
  },
];

export function parseAnnouncementFiles(value: unknown): AnnouncementFile[] {
  if (!Array.isArray(value)) return [];

  const files: AnnouncementFile[] = [];
  for (const entry of value) {
    if (!entry || typeof entry !== "object") continue;
    const record = entry as { url?: unknown; name?: unknown };
    const url = typeof record.url === "string" ? record.url.trim() : "";
    if (!url) continue;
    const name =
      typeof record.name === "string" && record.name.trim()
        ? record.name.trim()
        : "fisier.pdf";
    files.push({ url, name });
  }
  return files;
}

function normalizeFiles(item: StoredAnnouncement): AnnouncementFile[] {
  const files = parseAnnouncementFiles(item.files);
  if (files.length > 0) return files;
  const pdfUrl = item.pdfUrl?.trim();
  if (!pdfUrl) return [];
  return [{ url: pdfUrl, name: item.pdfName?.trim() || "fisier.pdf" }];
}

function isLegacyUncategorized(item: StoredAnnouncement): boolean {
  if (!isAnnouncementCategory(item.category)) return true;
  return item.category === "diverse" && !Array.isArray(item.files);
}

function normalizeAnnouncement(item: StoredAnnouncement): Announcement {
  return {
    id: item.id,
    title: item.title,
    body: item.body,
    files: normalizeFiles(item),
    category: isLegacyUncategorized(item)
      ? "proiecte-si-programe"
      : (item.category as AnnouncementCategory),
    createdAt: item.createdAt,
  };
}

function normalizeAnnouncements(items: StoredAnnouncement[]): Announcement[] {
  return items.map(normalizeAnnouncement);
}

function needsLegacyPersist(items: StoredAnnouncement[]): boolean {
  return items.some(
    (item) => isLegacyUncategorized(item) || !Array.isArray(item.files),
  );
}

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

async function readLocalRaw(): Promise<StoredAnnouncement[]> {
  try {
    const raw = await readFile(DATA_FILE, "utf8");
    return JSON.parse(raw) as StoredAnnouncement[];
  } catch {
    return DEFAULT_ANNOUNCEMENTS;
  }
}

async function writeLocal(items: Announcement[]) {
  await ensureLocalWritable();
  await writeFile(DATA_FILE, `${JSON.stringify(items, null, 2)}\n`, "utf8");
}

async function readBlobMetaRaw(): Promise<StoredAnnouncement[]> {
  try {
    const result = await list({ prefix: "announcements/", limit: 1000 });
    const meta = result.blobs.find((blob) => blob.pathname === BLOB_META_PATHNAME);
    if (!meta) return DEFAULT_ANNOUNCEMENTS;

    const response = await fetch(meta.url, { cache: "no-store" });
    if (!response.ok) return DEFAULT_ANNOUNCEMENTS;
    const items = (await response.json()) as StoredAnnouncement[];
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

async function persist(items: Announcement[]) {
  if (useBlob()) {
    await writeBlobMeta(items);
  } else {
    await writeLocal(items);
  }
}

async function readStored(): Promise<StoredAnnouncement[]> {
  return useBlob() ? readBlobMetaRaw() : readLocalRaw();
}

export async function listAnnouncements(
  category?: AnnouncementCategory,
): Promise<Announcement[]> {
  try {
    const raw = await readStored();
    const items = normalizeAnnouncements(raw);
    if (needsLegacyPersist(raw)) {
      try {
        await persist(items);
      } catch {
        // Listing still works even if the one-time migration cannot be saved.
      }
    }

    const sorted = [...items].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    if (!category) return sorted;
    return sorted.filter((item) => item.category === category);
  } catch {
    if (!category) return DEFAULT_ANNOUNCEMENTS;
    return DEFAULT_ANNOUNCEMENTS.filter((item) => item.category === category);
  }
}

type PdfUpload = {
  buffer: Buffer;
  filename: string;
  contentType: string;
};

async function storePdf(pdf: PdfUpload, index: number): Promise<AnnouncementFile> {
  const safeName = pdf.filename.replace(/[^a-zA-Z0-9._-]/g, "_");
  if (useBlob()) {
    const blob = await put(`announcements/files/${Date.now()}-${index}-${safeName}`, pdf.buffer, {
      access: "public",
      contentType: pdf.contentType || "application/pdf",
    });
    return { url: blob.url, name: pdf.filename };
  }

  await ensureLocalWritable();
  const stored = `${Date.now()}-${index}-${safeName}`;
  await writeFile(path.join(UPLOAD_DIR, stored), pdf.buffer);
  return { url: `/uploads/${stored}`, name: pdf.filename };
}

export async function createAnnouncement(
  input: AnnouncementInput,
  pdfs: PdfUpload[] = [],
): Promise<Announcement> {
  assertWritable();

  const title = input.title.trim();
  const body = input.body?.trim();
  const category = parseAnnouncementCategory(input.category);
  const uploadedFiles = parseAnnouncementFiles(input.files);

  if (!title) {
    throw new Error("Titlul este obligatoriu.");
  }
  if (!body && pdfs.length === 0 && uploadedFiles.length === 0) {
    throw new Error("Adaugă un text sau cel puțin un fișier PDF.");
  }

  const files: AnnouncementFile[] = [];

  for (const file of uploadedFiles) {
    if (!useBlob()) {
      throw new Error("Încărcarea directă este disponibilă doar cu Vercel Blob.");
    }
    if (!isVercelBlobUrl(file.url)) {
      throw new Error(`URL-ul fișierului „${file.name}” nu este valid.`);
    }
    files.push(file);
  }

  for (const [index, pdf] of pdfs.entries()) {
    files.push(await storePdf(pdf, index));
  }

  const announcement: Announcement = {
    id: crypto.randomUUID(),
    title,
    body: body || undefined,
    files,
    category,
    createdAt: new Date().toISOString(),
  };

  const items = await listAnnouncements();
  const next = [announcement, ...items.filter((item) => item.id !== "welcome-001")];
  await persist(next);
  return announcement;
}

export async function updateAnnouncementCategory(
  id: string,
  categoryInput: unknown,
): Promise<Announcement> {
  assertWritable();

  const category = parseAnnouncementCategory(categoryInput);
  const items = await listAnnouncements();
  const target = items.find((item) => item.id === id);
  if (!target) {
    throw new Error("Anunțul nu a fost găsit.");
  }

  const next = items.map((item) => (item.id === id ? { ...item, category } : item));
  await persist(next);
  return next.find((item) => item.id === id)!;
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
    for (const file of target.files) {
      try {
        await del(file.url);
      } catch {
        // Ignore missing blob cleanup errors.
      }
    }
  }

  await persist(next);
}

export function storageMode() {
  return useBlob() ? "blob" : "local";
}

export function isVercelBlobUrl(value: string) {
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      (url.hostname === "blob.vercel-storage.com" ||
        url.hostname.endsWith(".blob.vercel-storage.com"))
    );
  } catch {
    return false;
  }
}
