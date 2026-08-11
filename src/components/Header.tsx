import Link from "next/link";
import { kindergarten } from "@/data/gradinita";

type HeaderProps = {
  variant?: "home" | "page";
};

export function Header({ variant = "home" }: HeaderProps) {
  const navLinks =
    variant === "home"
      ? [
          { href: "#despre", label: "Despre" },
          { href: "#sedii", label: "Sedii" },
          { href: "/anunturi", label: "Anunțuri" },
          { href: "#contact", label: "Contact" },
        ]
      : [
          { href: "/#despre", label: "Despre" },
          { href: "/#sedii", label: "Sedii" },
          { href: "/anunturi", label: "Anunțuri" },
          { href: "/#contact", label: "Contact" },
        ];

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/30 bg-paper/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="group flex items-center gap-2.5">
          <span
            aria-hidden
            className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-sun via-coral to-sky shadow-sm transition group-hover:scale-105"
          >
            <span className="h-3.5 w-3.5 rounded-full bg-white/90" />
          </span>
          <span className="font-display text-lg leading-tight text-ink sm:text-xl">
            {kindergarten.name}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Navigare principală">
          {navLinks.map((link) => (
            <Link
              key={link.href + link.label}
              href={link.href}
              className="rounded-full px-3.5 py-2 text-sm font-semibold text-ink/80 transition hover:bg-mist hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
          <a
            href={kindergarten.locations[0].phoneHref}
            className="ml-2 rounded-full bg-leaf px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-leaf-deep"
          >
            Sună acum
          </a>
        </nav>

        <Link
          href="/anunturi"
          className="rounded-full bg-leaf px-3.5 py-2 text-sm font-bold text-white md:hidden"
        >
          Anunțuri
        </Link>
      </div>
    </header>
  );
}
