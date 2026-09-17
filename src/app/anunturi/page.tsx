import type { Metadata } from "next";
import Link from "next/link";
import { AnnouncementCategoryButtons } from "@/components/Announcements";

export const metadata: Metadata = {
  title: "Anunțuri | Grădinița Înșir'te Mărgărite",
  description: "Anunțuri și documente PDF pe categorii: proiecte, părinți, cadre didactice și diverse.",
};

export default function AnunturiPage() {
  return (
    <>
      <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-sun-deep">
        Anunțuri
      </p>
      <h1 className="mt-3 font-display text-4xl text-ink sm:text-5xl">
        Alege o categorie
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-ink/75">
        Anunțurile sunt grupate pe categorii. Apasă un buton pentru a vedea postările din zona aleasă.
      </p>

      <AnnouncementCategoryButtons />

      <Link
        href="/"
        className="mt-12 inline-flex rounded-full border-2 border-ink/15 px-5 py-2.5 text-sm font-bold text-ink transition hover:border-sky hover:bg-white"
      >
        Înapoi acasă
      </Link>
    </>
  );
}
