export const MAX_PDF_MB = 15;
export const MAX_PDF_BYTES = MAX_PDF_MB * 1024 * 1024;
/** Stay under Vercel's 4.5 MB function body limit, including multipart overhead. */
export const FUNCTION_SAFE_BYTES = 4 * 1024 * 1024;
export const PDF_UPLOAD_PREFIX = "announcements/files/";

export function isAllowedPdf(file: { name: string; type: string }) {
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();
  if (name.endsWith(".pdf")) return true;
  return type === "application/pdf" || type === "application/x-pdf";
}

export function formatAnnouncementDate(value: string, withTime = false) {
  return new Intl.DateTimeFormat("ro-RO", {
    timeZone: "Europe/Bucharest",
    day: "numeric",
    month: "long",
    year: "numeric",
    ...(withTime ? { hour: "2-digit" as const, minute: "2-digit" as const } : {}),
  }).format(new Date(value));
}
