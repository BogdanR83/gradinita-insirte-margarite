"use client";

import { upload } from "@vercel/blob/client";
import { useMemo, useState, type FormEvent } from "react";
import {
  formatAnnouncementDate,
  isAllowedPdf,
  MAX_FILES,
  MAX_PDF_BYTES,
  MAX_PDF_MB,
  PDF_UPLOAD_PREFIX,
} from "@/lib/announcements/limits";
import {
  ANNOUNCEMENT_CATEGORIES,
  getAnnouncementCategory,
  type AnnouncementCategory,
} from "@/lib/announcements/categories";
import type { Announcement } from "@/lib/announcements/types";

type AdminPanelProps = {
  initialItems: Announcement[];
  initiallyAuthenticated: boolean;
  storageMode: "local" | "blob";
  buildLabel: string;
};

function isLocalHost() {
  const host = window.location.hostname;
  return host === "localhost" || host === "127.0.0.1";
}

export function AdminPanel({
  initialItems,
  initiallyAuthenticated,
  storageMode,
  buildLabel,
}: AdminPanelProps) {
  const [authenticated, setAuthenticated] = useState(initiallyAuthenticated);
  const [items, setItems] = useState(initialItems);
  const [password, setPassword] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState<AnnouncementCategory>("parinti");
  const [pdfs, setPdfs] = useState<File[]>([]);
  const [pdfInputKey, setPdfInputKey] = useState(0);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const hint = useMemo(() => {
    if (storageMode === "blob") {
      return "Stocare: Vercel Blob (persistă pe hosting).";
    }
    return "Stocare: locală (pentru dezvoltare). Pe Vercel, adaugă BLOB_READ_WRITE_TOKEN.";
  }, [storageMode]);

  async function handleLogin(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    setMessage(null);

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    setBusy(false);

    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as { error?: string } | null;
      setError(data?.error || "Autentificare eșuată.");
      return;
    }

    setAuthenticated(true);
    setPassword("");
    setMessage("Autentificat.");
  }

  async function handleLogout() {
    setBusy(true);
    await fetch("/api/auth/logout", { method: "POST" });
    setBusy(false);
    setAuthenticated(false);
    setMessage("Te-ai deconectat.");
  }

  async function refreshItems() {
    const response = await fetch("/api/announcements", { cache: "no-store" });
    if (!response.ok) return;
    const data = (await response.json()) as { items: Announcement[] };
    setItems(data.items);
  }

  async function readApiError(response: Response) {
    const text = await response.text();
    try {
      const data = JSON.parse(text) as { error?: string };
      if (data.error) return data.error;
    } catch {
      // Non-JSON body, e.g. Vercel 413 HTML/text.
    }
    if (response.status === 413 || text.includes("FUNCTION_PAYLOAD_TOO_LARGE")) {
      return "Fișierul e prea mare pentru server. PDF-ul trebuie urcat direct în stocare.";
    }
    return "Nu am putut publica anunțul.";
  }

  async function handleCreate(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    setMessage(null);

    try {
      if (pdfs.length > MAX_FILES) {
        throw new Error(`Poți încărca maximum ${MAX_FILES} fișiere.`);
      }

      for (const pdf of pdfs) {
        if (!isAllowedPdf(pdf)) {
          throw new Error(`Doar fișiere PDF sunt acceptate (${pdf.name}).`);
        }
        if (pdf.size > MAX_PDF_BYTES) {
          throw new Error(`${pdf.name} trebuie să aibă maximum ${MAX_PDF_MB} MB.`);
        }
      }

      const useLocalFormUpload = Boolean(pdfs.length > 0 && storageMode === "local" && isLocalHost());

      let response: Response;

      if (pdfs.length > 0 && !useLocalFormUpload) {
        const files: { url: string; name: string }[] = [];

        for (const [index, pdf] of pdfs.entries()) {
          setMessage(`Se încarcă fișierul ${index + 1} din ${pdfs.length}...`);
          const safeName = pdf.name.replace(/[^a-zA-Z0-9._-]/g, "_");
          const filename = safeName.toLowerCase().endsWith(".pdf") ? safeName : `${safeName}.pdf`;
          const blob = await upload(`${PDF_UPLOAD_PREFIX}${Date.now()}-${index}-${filename}`, pdf, {
            access: "public",
            handleUploadUrl: "/api/announcements/upload",
            contentType: "application/pdf",
            multipart: true,
          });
          files.push({ url: blob.url, name: pdf.name });
        }

        response = await fetch("/api/announcements", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            body,
            category,
            files,
          }),
        });
      } else if (pdfs.length === 0) {
        response = await fetch("/api/announcements", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, body, category }),
        });
      } else {
        const form = new FormData();
        form.set("title", title);
        form.set("body", body);
        form.set("category", category);
        for (const pdf of pdfs) {
          form.append("pdfs", pdf);
        }

        response = await fetch("/api/announcements", {
          method: "POST",
          body: form,
        });
      }

      if (!response.ok) {
        throw new Error(await readApiError(response));
      }

      setTitle("");
      setBody("");
      setCategory("parinti");
      setPdfs([]);
      setPdfInputKey((key) => key + 1);
      setMessage("Anunț publicat.");
      await refreshItems();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Nu am putut publica anunțul.";
      if (message.toLowerCase().includes("failed to retrieve the client token")) {
        setError("Nu am putut pregăti încărcarea PDF-ului. Reautentifică-te și încearcă din nou.");
      } else {
        setError(message);
      }
    } finally {
      setBusy(false);
    }
  }

  async function handleCategoryChange(id: string, nextCategory: AnnouncementCategory) {
    setBusy(true);
    setError(null);
    setMessage(null);

    const response = await fetch(`/api/announcements/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category: nextCategory }),
    });
    setBusy(false);

    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as { error?: string } | null;
      setError(data?.error || "Nu am putut schimba categoria.");
      return;
    }

    setMessage("Categoria a fost actualizată.");
    await refreshItems();
  }

  async function handleDelete(id: string) {
    if (!confirm("Ștergi acest anunț?")) return;

    setBusy(true);
    setError(null);
    setMessage(null);

    const response = await fetch(`/api/announcements/${id}`, { method: "DELETE" });
    setBusy(false);

    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as { error?: string } | null;
      setError(data?.error || "Nu am putut șterge anunțul.");
      return;
    }

    setMessage("Anunț șters.");
    await refreshItems();
  }

  if (!authenticated) {
    return (
      <div className="mx-auto w-full max-w-md rounded-[2rem] bg-white p-8 shadow-[0_24px_50px_-30px_rgba(31,58,77,0.4)]">
        <h1 className="font-display text-3xl text-ink">Admin anunțuri</h1>
        <p className="mt-3 text-sm text-ink/65">
          Introdu parola pentru a publica postări sau PDF-uri.
        </p>
        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <label className="block text-sm font-bold text-ink">
            Parolă
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-ink/15 bg-paper px-4 py-3 text-base outline-none ring-sky focus:ring-2"
              autoComplete="current-password"
              required
            />
          </label>
          {error ? <p className="text-sm font-semibold text-coral">{error}</p> : null}
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-full bg-leaf px-5 py-3 text-sm font-bold text-white transition hover:bg-leaf-deep disabled:opacity-60"
          >
            Intră în admin
          </button>
        </form>
        <p className="mt-6 text-center text-xs text-ink/40">Versiune {buildLabel}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl text-ink">Admin anunțuri</h1>
          <p className="mt-2 text-sm text-ink/65">{hint}</p>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          disabled={busy}
          className="rounded-full border-2 border-ink/15 px-4 py-2 text-sm font-bold text-ink transition hover:bg-white disabled:opacity-60"
        >
          Ieși
        </button>
      </div>

      <form
        action="#"
        method="post"
        onSubmit={handleCreate}
        className="space-y-4 rounded-[2rem] bg-white p-6 shadow-[0_24px_50px_-30px_rgba(31,58,77,0.4)] sm:p-8"
      >
        <h2 className="font-display text-2xl text-ink">Anunț nou</h2>
        <label className="block text-sm font-bold text-ink">
          Titlu
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-ink/15 bg-paper px-4 py-3 text-base outline-none ring-sky focus:ring-2"
            required
          />
        </label>
        <label className="block text-sm font-bold text-ink">
          Categorie
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value as AnnouncementCategory)}
            className="mt-2 w-full rounded-2xl border border-ink/15 bg-paper px-4 py-3 text-base outline-none ring-sky focus:ring-2"
            required
          >
            {ANNOUNCEMENT_CATEGORIES.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-bold text-ink">
          Text (opțional dacă încarci PDF)
          <textarea
            value={body}
            onChange={(event) => setBody(event.target.value)}
            rows={5}
            className="mt-2 w-full rounded-2xl border border-ink/15 bg-paper px-4 py-3 text-base outline-none ring-sky focus:ring-2"
            placeholder="Scrie anunțul aici..."
          />
        </label>
        <label className="block text-sm font-bold text-ink">
          Fișiere PDF (poți alege mai multe, maximum {MAX_FILES}, câte {MAX_PDF_MB} MB fiecare)
          <input
            type="file"
            accept="application/pdf,.pdf"
            multiple
            key={pdfInputKey}
            onChange={(event) => {
              const next = Array.from(event.target.files || []);
              setPdfs((current) => [...current, ...next].slice(0, MAX_FILES));
              setPdfInputKey((key) => key + 1);
            }}
            className="mt-2 block w-full text-sm text-ink/80 file:mr-4 file:rounded-full file:border-0 file:bg-mist file:px-4 file:py-2 file:font-bold file:text-ink"
          />
        </label>
        {pdfs.length > 0 ? (
          <ul className="space-y-2 rounded-2xl bg-paper px-4 py-3 text-sm text-ink/80">
            {pdfs.map((file, index) => (
              <li key={`${file.name}-${file.size}-${index}`} className="flex items-center justify-between gap-3">
                <span className="min-w-0 truncate">{file.name}</span>
                <button
                  type="button"
                  onClick={() => setPdfs((current) => current.filter((_, itemIndex) => itemIndex !== index))}
                  className="shrink-0 text-xs font-bold text-coral hover:underline"
                >
                  Scoate
                </button>
              </li>
            ))}
          </ul>
        ) : null}
        {error ? <p className="text-sm font-semibold text-coral">{error}</p> : null}
        {message ? <p className="text-sm font-semibold text-leaf-deep">{message}</p> : null}
        <button
          type="submit"
          disabled={busy}
          className="rounded-full bg-sky-deep px-6 py-3 text-sm font-bold text-white transition hover:brightness-110 disabled:opacity-60"
        >
          {busy ? "Se încarcă..." : "Publică anunțul"}
        </button>
      </form>

      <section className="space-y-4">
        <h2 className="font-display text-2xl text-ink">Anunțuri existente</h2>
        {items.length === 0 ? (
          <p className="text-ink/60">Niciun anunț încă.</p>
        ) : (
          items.map((item) => (
            <article
              key={item.id}
              className="rounded-[1.5rem] border border-ink/8 bg-white p-5 shadow-[0_16px_36px_-28px_rgba(31,58,77,0.4)]"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-ink/45">
                    {formatAnnouncementDate(item.createdAt, true)}
                    {" · "}
                    {getAnnouncementCategory(item.category)?.label || "Diverse"}
                  </p>
                  <h3 className="mt-1 font-display text-xl text-ink">{item.title}</h3>
                  {item.body ? (
                    <p className="mt-2 whitespace-pre-wrap text-sm text-ink/70">{item.body}</p>
                  ) : null}
                  {item.files?.length ? (
                    <div className="mt-2 flex flex-col items-start gap-1">
                      {item.files.map((file) => (
                        <a
                          key={`${file.url}-${file.name}`}
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-semibold text-sky-deep underline"
                        >
                          {file.name || "PDF"}
                        </a>
                      ))}
                    </div>
                  ) : null}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <label className="flex flex-col gap-1 text-xs font-bold text-ink">
                    Categorie
                    <select
                      value={item.category}
                      disabled={busy}
                      onChange={(event) =>
                        handleCategoryChange(item.id, event.target.value as AnnouncementCategory)
                      }
                      className="rounded-full border border-ink/15 bg-paper px-3 py-2 text-sm font-semibold text-ink outline-none ring-sky focus:ring-2 disabled:opacity-60"
                    >
                      {ANNOUNCEMENT_CATEGORIES.map((categoryOption) => (
                        <option key={categoryOption.slug} value={categoryOption.slug}>
                          {categoryOption.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    disabled={busy}
                    className="rounded-full bg-coral/90 px-4 py-2 text-sm font-bold text-white transition hover:brightness-105 disabled:opacity-60"
                  >
                    Șterge
                  </button>
                </div>
              </div>
            </article>
          ))
        )}
      </section>
      <p className="text-center text-xs text-ink/40">Versiune {buildLabel}</p>
    </div>
  );
}
