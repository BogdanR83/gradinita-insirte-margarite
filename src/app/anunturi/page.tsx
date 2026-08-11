import type { Metadata } from "next";
import Link from "next/link";
import { AnnouncementCard } from "@/components/Announcements";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { listAnnouncements } from "@/lib/announcements/store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Anunțuri | Grădinița Înșir'te Mărgărite",
  description: "Anunțuri și documente PDF pentru părinți.",
};

export default async function AnunturiPage() {
  const items = await listAnnouncements();

  return (
    <>
      <Header variant="page" />
      <main className="flex-1 sky-wash pt-28 pb-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-sun-deep">
            Anunțuri
          </p>
          <h1 className="mt-3 font-display text-4xl text-ink sm:text-5xl">
            Toate anunțurile
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-ink/75">
            Postări și fișiere PDF publicate de grădiniță.
          </p>

          {items.length === 0 ? (
            <p className="mt-10 text-ink/60">Nu există anunțuri momentan.</p>
          ) : (
            <div className="mt-10 grid gap-5 md:grid-cols-2">
              {items.map((item) => (
                <AnnouncementCard key={item.id} item={item} />
              ))}
            </div>
          )}

          <Link
            href="/"
            className="mt-12 inline-flex rounded-full border-2 border-ink/15 px-5 py-2.5 text-sm font-bold text-ink transition hover:border-sky hover:bg-white"
          >
            Înapoi acasă
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
