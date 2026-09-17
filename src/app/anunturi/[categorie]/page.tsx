import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AnnouncementCard, AnnouncementCategoryButtons } from "@/components/Announcements";
import {
  ANNOUNCEMENT_CATEGORIES,
  getAnnouncementCategory,
} from "@/lib/announcements/categories";
import { listAnnouncements } from "@/lib/announcements/store";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return ANNOUNCEMENT_CATEGORIES.map((category) => ({ categorie: category.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categorie: string }>;
}): Promise<Metadata> {
  const { categorie } = await params;
  const category = getAnnouncementCategory(categorie);

  if (!category) {
    return { title: "Anunțuri | Grădinița Înșir'te Mărgărite" };
  }

  return {
    title: `${category.label} | Anunțuri | Grădinița Înșir'te Mărgărite`,
    description: category.description,
  };
}

export default async function AnunturiCategoriePage({
  params,
}: {
  params: Promise<{ categorie: string }>;
}) {
  const { categorie } = await params;
  const category = getAnnouncementCategory(categorie);

  if (!category) {
    notFound();
  }

  const items = await listAnnouncements(category.slug);

  return (
    <>
      <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-sun-deep">
        Anunțuri
      </p>
      <h1 className="mt-3 font-display text-4xl text-ink sm:text-5xl">{category.label}</h1>
      <p className="mt-4 max-w-2xl text-lg text-ink/75">{category.description}</p>

      <AnnouncementCategoryButtons currentSlug={category.slug} compact />

      {items.length === 0 ? (
        <p className="mt-10 text-ink/60">Nu există anunțuri în această categorie momentan.</p>
      ) : (
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {items.map((item) => (
            <AnnouncementCard key={item.id} item={item} />
          ))}
        </div>
      )}

      <div className="mt-12 flex flex-wrap gap-3">
        <Link
          href="/anunturi"
          className="inline-flex rounded-full border-2 border-ink/15 px-5 py-2.5 text-sm font-bold text-ink transition hover:border-sky hover:bg-white"
        >
          Toate categoriile
        </Link>
        <Link
          href="/"
          className="inline-flex rounded-full border-2 border-ink/15 px-5 py-2.5 text-sm font-bold text-ink transition hover:border-sky hover:bg-white"
        >
          Înapoi acasă
        </Link>
      </div>
    </>
  );
}
