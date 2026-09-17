import type { ReactNode } from "react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export default function AnunturiLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header variant="page" />
      <main className="flex-1 sky-wash pt-28 pb-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">{children}</div>
      </main>
      <Footer />
    </>
  );
}
