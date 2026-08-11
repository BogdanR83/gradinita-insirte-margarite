import { kindergarten } from "@/data/gradinita";

const highlights = [
  {
    title: "Program generos",
    text: kindergarten.program,
    accent: "from-sky to-sky-deep",
  },
  {
    title: "Două sedii",
    text: "Unitate principală și sediul Piticot, sub aceeași conducere.",
    accent: "from-leaf to-leaf-deep",
  },
  {
    title: "În Sectorul 4",
    text: "Lângă familiile din cartier, cu spații prietenoase pentru copii.",
    accent: "from-sun to-sun-deep",
  },
];

export function About() {
  return (
    <section id="despre" className="relative scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-sky-deep">
            Despre noi
          </p>
          <h2 className="mt-3 font-display text-4xl text-ink sm:text-5xl">
            Unde copilăria se înșiră frumos
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-ink/75">
            {kindergarten.fullName} este o unitate de învățământ preșcolar din
            Sectorul 4, București. Conducerea este asigurată de{" "}
            <strong className="font-bold text-ink">
              director {kindergarten.director}
            </strong>
            , pentru sediul principal și pentru sediul Piticot.
          </p>
        </div>

        <div className="mt-14 grid gap-10 border-t border-ink/10 pt-10 sm:grid-cols-3 sm:gap-8">
          {highlights.map((item) => (
            <article key={item.title}>
              <div
                className={`mb-4 h-2 w-14 rounded-full bg-gradient-to-r ${item.accent}`}
              />
              <h3 className="font-display text-2xl text-ink">{item.title}</h3>
              <p className="mt-2 text-base leading-relaxed text-ink/70">{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
