import { kindergarten } from "@/data/gradinita";

export function Contact() {
  const main = kindergarten.locations[0];
  const piticot = kindergarten.locations[1];

  return (
    <section id="contact" className="relative scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div>
            <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-coral">
              Contact
            </p>
            <h2 className="mt-3 font-display text-4xl text-ink sm:text-5xl">
              Hai să vorbim
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-ink/75">
              Pentru înscrieri, program sau orice întrebare, ne găsești ușor —
              la telefon, pe email sau pe hartă.
            </p>

            <ul className="mt-8 space-y-4">
              <li className="rounded-[1.5rem] bg-white p-5 shadow-[0_16px_36px_-28px_rgba(31,58,77,0.45)]">
                <p className="text-sm font-bold uppercase tracking-wide text-ink/45">
                  Email
                </p>
                <a
                  href={`mailto:${kindergarten.email}`}
                  className="mt-1 block break-all text-lg font-semibold text-sky-deep hover:underline"
                >
                  {kindergarten.email}
                </a>
              </li>
              <li className="rounded-[1.5rem] bg-white p-5 shadow-[0_16px_36px_-28px_rgba(31,58,77,0.45)]">
                <p className="text-sm font-bold uppercase tracking-wide text-ink/45">
                  Program
                </p>
                <p className="mt-1 text-lg font-semibold text-ink">
                  {kindergarten.program}
                </p>
              </li>
              <li className="rounded-[1.5rem] bg-white p-5 shadow-[0_16px_36px_-28px_rgba(31,58,77,0.45)]">
                <p className="text-sm font-bold uppercase tracking-wide text-ink/45">
                  Telefoane
                </p>
                <p className="mt-2 text-base text-ink/80">
                  Principal:{" "}
                  <a href={main.phoneHref} className="font-semibold text-ink hover:underline">
                    {main.phone}
                  </a>
                </p>
                <p className="mt-1 text-base text-ink/80">
                  Piticot:{" "}
                  <a
                    href={piticot.phoneHref}
                    className="font-semibold text-ink hover:underline"
                  >
                    {piticot.phone}
                  </a>
                </p>
              </li>
            </ul>
          </div>

          <div className="overflow-hidden rounded-[2rem] bg-white shadow-[0_24px_50px_-30px_rgba(31,58,77,0.4)]">
            <div className="border-b border-ink/5 px-5 py-4 sm:px-6">
              <h3 className="font-display text-xl text-ink">
                Sediul principal pe hartă
              </h3>
              <p className="mt-1 text-sm text-ink/60">{main.address}</p>
            </div>
            <div className="relative h-[320px] sm:h-[400px]">
              <iframe
                title="Hartă sediu principal"
                src={main.mapsEmbed}
                className="map-frame absolute inset-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className="flex flex-wrap gap-3 p-5 sm:p-6">
              <a
                href={main.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-leaf px-5 py-2.5 text-sm font-bold text-white transition hover:bg-leaf-deep"
              >
                Deschide în Google Maps
              </a>
              <a
                href={piticot.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border-2 border-ink/15 px-5 py-2.5 text-sm font-bold text-ink transition hover:border-coral hover:bg-mist"
              >
                Hartă Piticot
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
