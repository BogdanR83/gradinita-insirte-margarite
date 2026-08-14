import Link from "next/link";
import type { Announcement } from "@/lib/announcements/types";
import { formatAnnouncementDate } from "@/lib/announcements/limits";

type AnnouncementCardProps = {
  item: Announcement;
};

export function AnnouncementCard({ item }: AnnouncementCardProps) {
  return (
    <article className="rounded-[1.75rem] border border-ink/8 bg-white/90 p-6 shadow-[0_18px_40px_-30px_rgba(31,58,77,0.45)]">
      <p className="text-sm font-semibold uppercase tracking-wide text-sky-deep">
        {formatAnnouncementDate(item.createdAt)}
      </p>
      <h3 className="mt-2 font-display text-2xl text-ink">{item.title}</h3>
      {item.body ? (
        <p className="mt-3 whitespace-pre-wrap text-base leading-relaxed text-ink/75">
          {item.body}
        </p>
      ) : null}
      {item.pdfUrl ? (
        <a
          href={item.pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-coral px-4 py-2 text-sm font-bold text-white transition hover:brightness-105"
        >
          Deschide PDF{item.pdfName ? `: ${item.pdfName}` : ""}
        </a>
      ) : null}
    </article>
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
              <AnnouncementCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
