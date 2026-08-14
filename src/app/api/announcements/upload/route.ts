import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { MAX_PDF_BYTES, PDF_UPLOAD_PREFIX } from "@/lib/announcements/limits";
import { isAuthenticated } from "@/lib/auth";

export async function POST(request: Request) {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        if (!(await isAuthenticated())) {
          throw new Error("Neautentificat.");
        }
        if (
          !pathname.startsWith(PDF_UPLOAD_PREFIX) ||
          !pathname.toLowerCase().endsWith(".pdf")
        ) {
          throw new Error("Cale invalidă pentru PDF.");
        }

        return {
          allowedContentTypes: ["application/pdf", "application/x-pdf", "application/octet-stream"],
          maximumSizeInBytes: MAX_PDF_BYTES,
          addRandomSuffix: true,
          validUntil: Date.now() + 60 * 60 * 1000,
        };
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Nu am putut pregăti încărcarea.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
