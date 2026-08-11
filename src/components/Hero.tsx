import Image from "next/image";
import { kindergarten } from "@/data/gradinita";
import { FloatingBeads } from "./FloatingBeads";

export function Hero() {
  const main = kindergarten.locations[0];

  return (
    <section id="top" className="relative min-h-[100svh] overflow-hidden">
      <Image
        src={main.image!}
        alt={main.imageAlt!}
        fill
        priority
        className="object-cover object-[center_35%]"
        sizes="100vw"
      />
      <div className="hero-scrim absolute inset-0" />
      <FloatingBeads />

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-end px-4 pb-16 pt-28 sm:justify-center sm:px-6 sm:pb-20 sm:pt-24">
        <p className="animate-rise font-display text-sm font-medium tracking-wide text-sun sm:text-base">
          Grădiniță · {kindergarten.sector}
        </p>
        <h1 className="animate-rise-delay-1 mt-3 max-w-3xl font-display text-5xl leading-[1.05] text-white sm:text-6xl md:text-7xl">
          {kindergarten.name}
        </h1>
        <p className="animate-rise-delay-2 mt-5 max-w-xl text-lg leading-relaxed text-white/90 sm:text-xl">
          Un loc vesel de învățare și joacă, unde fiecare zi se înșiră ca o
          mărgărită — cu grijă, culoare și zâmbete.
        </p>
        <div className="animate-rise-delay-3 mt-8 flex flex-wrap gap-3">
          <a
            href="#sedii"
            className="rounded-full bg-sun px-6 py-3 text-base font-bold text-ink shadow-lg transition hover:bg-sun-deep"
          >
            Vezi sediile
          </a>
          <a
            href={`mailto:${kindergarten.email}`}
            className="rounded-full border-2 border-white/70 bg-white/10 px-6 py-3 text-base font-bold text-white backdrop-blur-sm transition hover:bg-white/20"
          >
            Scrie-ne
          </a>
        </div>
      </div>
    </section>
  );
}
