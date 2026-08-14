import { kindergarten } from "@/data/gradinita";
import { getBuildLabel } from "@/lib/build-info";

export function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-ink text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-end sm:justify-between sm:px-6">
        <div>
          <p className="font-display text-2xl">{kindergarten.fullName}</p>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-white/70">
            {kindergarten.sector} · Director {kindergarten.director}
          </p>
        </div>
        <div className="text-sm text-white/45">
          <p>
            © {new Date().toLocaleString("ro-RO", { timeZone: "Europe/Bucharest", year: "numeric" })}{" "}
            {kindergarten.name}
          </p>
          <p className="mt-2 text-xs text-white/30">Versiune {getBuildLabel()}</p>
        </div>
      </div>
    </footer>
  );
}
