import { About } from "@/components/About";
import { AnnouncementsSection } from "@/components/Announcements";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Locations } from "@/components/Locations";
import { listAnnouncements } from "@/lib/announcements/store";

export const dynamic = "force-dynamic";

export default async function Home() {
  const announcements = await listAnnouncements();

  return (
    <>
      <Header />
      <main className="flex-1 sky-wash">
        <Hero />
        <AnnouncementsSection items={announcements} />
        <About />
        <Locations />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
