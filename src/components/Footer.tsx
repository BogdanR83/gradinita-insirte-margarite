import { kindergarten } from "@/data/gradinita";

export function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-ink text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-end sm:justify-between sm:px-6">
        <div>
          <p className="font-display text-2xl">{kindergarten.fullName}</p>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-white/70">
            {kindergarten.sector} · Director {kindergarten.director}
          </p>
          <p className="mt-3 text-sm text-white/55">
            Date preluate din rețeaua oficială{" "}
            <a
              href={kindergarten.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-sun"
            >
              DGAUIS
            </a>
            .
          </p>
        </div>
        <p className="text-sm text-white/45">
          © {new Date().getFullYear()} {kindergarten.name}
        </p>
      </div>
    </footer>
  );
}
