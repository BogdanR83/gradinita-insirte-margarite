import Link from "next/link";
import {
  ANNOUNCEMENT_CATEGORIES,
  getAnnouncementCategory,
  type AnnouncementCategory,
} from "@/lib/announcements/categories";
import type { Announcement, AnnouncementFile } from "@/lib/announcements/types";
import { formatAnnouncementDate } from "@/lib/announcements/limits";

const CATEGORY_BUTTON_STYLES: Record<AnnouncementCategory, string> = {
  "proiecte-si-programe": "bg-sky-deep text-white hover:brightness-110",
  parinti: "bg-leaf text-white hover:bg-leaf-deep",
  "cadre-didactice": "bg-sun text-ink hover:bg-sun-deep",
  diverse: "bg-coral text-white hover:brightness-105",
};

type AnnouncementCardProps = {
  item: Announcement;
  showCategory?: boolean;
};

export function AnnouncementCard({ item, showCategory = false }: AnnouncementCardProps) {
  const category = getAnnouncementCategory(item.category);
  const files = item.files ?? [];

  return (
    <article className="rounded-[1.75rem] border border-ink/8 bg-white/90 p-6 shadow-[0_18px_40px_-30px_rgba(31,58,77,0.45)]">
      <p className="text-sm font-semibold uppercase tracking-wide text-sky-deep">
        {formatAnnouncementDate(item.createdAt)}
        {showCategory && category ? ` · ${category.label}` : ""}
      </p>
      <h3 className="mt-2 font-display text-2xl text-ink">{item.title}</h3>
      {item.body ? (
        <p className="mt-3 whitespace-pre-wrap text-base leading-relaxed text-ink/75">
          {item.body}
        </p>
      ) : null}
      {files.length > 0 ? (
        <div className="mt-5 flex flex-col items-start gap-2">
          {files.map((file) => (
            <FileLink
              key={`${file.url}-${file.name}`}
              file={file}
              category={item.category}
            />
          ))}
        </div>
      ) : null}
    </article>
  );
}

function FileLink({
  file,
  category,
}: {
  file: AnnouncementFile;
  category: AnnouncementCategory;
}) {
  return (
    <a
      href={file.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition ${CATEGORY_BUTTON_STYLES[category]}`}
    >
      Deschide PDF: {file.name}
    </a>
  );
}

type AnnouncementCategoryButtonsProps = {
  currentSlug?: AnnouncementCategory;
  compact?: boolean;
};

export function AnnouncementCategoryButtons({
  currentSlug,
  compact = false,
}: AnnouncementCategoryButtonsProps) {
  return (
    <div className={compact ? "mt-8 flex flex-wrap gap-3" : "mt-10 grid gap-4 sm:grid-cols-2"}>
      {ANNOUNCEMENT_CATEGORIES.map((category) => {
        const isCurrent = category.slug === currentSlug;

        if (compact) {
          return (
            <Link
              key={category.slug}
              href={`/anunturi/${category.slug}`}
              aria-current={isCurrent ? "page" : undefined}
              className={`rounded-full px-4 py-2 text-sm font-bold transition ${CATEGORY_BUTTON_STYLES[category.slug]} ${
                isCurrent ? "ring-2 ring-ink/20 ring-offset-2 ring-offset-transparent" : ""
              }`}
            >
              {category.label}
            </Link>
          );
        }

        return (
          <Link
            key={category.slug}
            href={`/anunturi/${category.slug}`}
            aria-current={isCurrent ? "page" : undefined}
            className={`rounded-[1.75rem] px-6 py-6 text-left shadow-[0_18px_40px_-28px_rgba(31,58,77,0.45)] transition ${CATEGORY_BUTTON_STYLES[category.slug]} ${
              isCurrent ? "ring-4 ring-white/80 ring-offset-2 ring-offset-transparent" : ""
            }`}
          >
            <span className="block font-display text-2xl leading-tight">{category.label}</span>
            <span className="mt-2 block text-sm font-semibold opacity-90">
              {category.description}
            </span>
          </Link>
        );
      })}
    </div>
  );
}

type AnnouncementsSectionProps = {
  items: Announcement[];
};

export function AnnouncementsSection({ items }: AnnouncementsSectionProps) {
  const latest = items.slice(0, 3);

  return (
    <section id="anunturi" className="relative scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-sun-deep">
              Anunțuri
            </p>
            <h2 className="mt-3 font-display text-4xl text-ink sm:text-5xl">
              Noutăți pentru părinți
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-ink/75">
              Postări scurte și documente PDF — înscrieri, program, activități.
            </p>
          </div>
          <Link
            href="/anunturi"
            className="inline-flex w-fit rounded-full border-2 border-ink/15 px-5 py-2.5 text-sm font-bold text-ink transition hover:border-sky hover:bg-white"
          >
            Toate anunțurile
          </Link>
        </div>

        {latest.length === 0 ? (
          <p className="mt-10 text-base text-ink/60">
            Momentan nu există anunțuri publicate.
          </p>
        ) : (
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {latest.map((item) => (
              <AnnouncementCard key={item.id} item={item} showCategory />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
