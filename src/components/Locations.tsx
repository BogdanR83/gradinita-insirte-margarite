import Image from "next/image";
import { kindergarten } from "@/data/gradinita";

export function Locations() {
  return (
    <section id="sedii" className="relative scroll-mt-24 bg-mist/70 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-leaf-deep">
            Sedii
          </p>
          <h2 className="mt-3 font-display text-4xl text-ink sm:text-5xl">
            Același spirit, două locații
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-ink/75">
            Piticot este un alt sediu al grădiniței mamă — aceeași echipă de
            conducere, aceleași valori, locuri diferite în Sectorul 4.
          </p>
        </div>

        <div className="mt-12 space-y-10">
          {kindergarten.locations.map((location) => (
            <article
              key={location.id}
              className="overflow-hidden rounded-[2rem] bg-white shadow-[0_24px_50px_-30px_rgba(31,58,77,0.4)]"
            >
              <div
                className={`grid gap-0 lg:grid-cols-2 ${
                  location.isMain ? "" : "lg:[&>*:first-child]:order-2"
                }`}
              >
                <div className="relative min-h-[260px] bg-gradient-to-br from-sky/30 via-sun/20 to-leaf/30 lg:min-h-[360px]">
                  {location.image ? (
                    <Image
                      src={location.image}
                      alt={location.imageAlt || location.shortName}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  ) : (
                    <iframe
                      title={`Hartă ${location.shortName}`}
                      src={location.mapsEmbed}
                      className="map-frame absolute inset-0"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  )}
                </div>

                <div className="flex flex-col justify-center p-7 sm:p-10">
                  <span
                    className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide text-white ${
                      location.isMain ? "bg-sky-deep" : "bg-coral"
                    }`}
                  >
                    {location.title}
                  </span>
                  <h3 className="mt-4 font-display text-3xl text-ink sm:text-4xl">
                    {location.shortName}
                  </h3>
                  <dl className="mt-6 space-y-3 text-base text-ink/80">
                    <div>
                      <dt className="text-sm font-bold uppercase tracking-wide text-ink/45">
                        Adresă
                      </dt>
                      <dd className="mt-1">{location.address}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-bold uppercase tracking-wide text-ink/45">
                        Telefon
                      </dt>
                      <dd className="mt-1">
                        <a
                          href={location.phoneHref}
                          className="font-semibold text-sky-deep underline-offset-2 hover:underline"
                        >
                          {location.phone}
                        </a>
                      </dd>
                    </div>
                    {location.isMain && (
                      <div>
                        <dt className="text-sm font-bold uppercase tracking-wide text-ink/45">
                          Director
                        </dt>
                        <dd className="mt-1">{kindergarten.director}</dd>
                      </div>
                    )}
                  </dl>

                  <div className="mt-8 flex flex-wrap gap-3">
                    <a
                      href={location.phoneHref}
                      className="rounded-full bg-ink px-5 py-2.5 text-sm font-bold text-white transition hover:bg-ink/90"
                    >
                      Sună
                    </a>
                    <a
                      href={`mailto:${kindergarten.email}`}
                      className="rounded-full border-2 border-ink/15 px-5 py-2.5 text-sm font-bold text-ink transition hover:border-sky hover:bg-mist"
                    >
                      Email
                    </a>
                    <a
                      href={location.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full border-2 border-ink/15 px-5 py-2.5 text-sm font-bold text-ink transition hover:border-leaf hover:bg-mist"
                    >
                      Google Maps
                    </a>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
