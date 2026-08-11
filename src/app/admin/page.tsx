import type { Metadata } from "next";
import Link from "next/link";
import { AdminPanel } from "@/components/AdminPanel";
import { listAnnouncements, storageMode } from "@/lib/announcements/store";
import { isAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin anunțuri | Grădinița Înșir'te Mărgărite",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const [items, authenticated] = await Promise.all([
    listAnnouncements(),
    isAuthenticated(),
  ]);

  return (
    <main className="min-h-screen sky-wash px-4 py-10 sm:px-6 sm:py-16">
      <div className="mb-8 flex justify-center">
        <Link href="/" className="text-sm font-semibold text-ink/60 hover:text-ink">
          ← Înapoi la site
        </Link>
      </div>
      <AdminPanel
        initialItems={items}
        initiallyAuthenticated={authenticated}
        storageMode={storageMode()}
      />
    </main>
  );
}
