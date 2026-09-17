export const ANNOUNCEMENT_CATEGORY_SLUGS = [
  "proiecte-si-programe",
  "parinti",
  "cadre-didactice",
  "diverse",
] as const;

export type AnnouncementCategory = (typeof ANNOUNCEMENT_CATEGORY_SLUGS)[number];

export type AnnouncementCategoryInfo = {
  slug: AnnouncementCategory;
  label: string;
  description: string;
};

export const ANNOUNCEMENT_CATEGORIES: AnnouncementCategoryInfo[] = [
  {
    slug: "proiecte-si-programe",
    label: "Proiecte și programe",
    description: "Proiecte educaționale, parteneriate și programe ale grădiniței.",
  },
  {
    slug: "parinti",
    label: "Părinți",
    description: "Comunicări pentru părinți: program, înscrieri și documente.",
  },
  {
    slug: "cadre-didactice",
    label: "Cadre didactice",
    description: "Informații și anunțuri pentru personalul grădiniței.",
  },
  {
    slug: "diverse",
    label: "Diverse",
    description: "Alte anunțuri care nu se încadrează în categoriile de mai sus.",
  },
];

const CATEGORIES_BY_SLUG = Object.fromEntries(
  ANNOUNCEMENT_CATEGORIES.map((category) => [category.slug, category]),
) as Record<AnnouncementCategory, AnnouncementCategoryInfo>;

export function isAnnouncementCategory(value: unknown): value is AnnouncementCategory {
  return (
    typeof value === "string" &&
    (ANNOUNCEMENT_CATEGORY_SLUGS as readonly string[]).includes(value)
  );
}

export function getAnnouncementCategory(slug: string): AnnouncementCategoryInfo | undefined {
  if (!isAnnouncementCategory(slug)) return undefined;
  return CATEGORIES_BY_SLUG[slug];
}

export function parseAnnouncementCategory(value: unknown): AnnouncementCategory {
  if (!isAnnouncementCategory(value)) {
    throw new Error("Alege o categorie validă.");
  }
  return value;
}

export function normalizeAnnouncementCategory(value: unknown): AnnouncementCategory {
  return isAnnouncementCategory(value) ? value : "proiecte-si-programe";
}
