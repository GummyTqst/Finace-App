import Nav from "@/components/nav";
import Hero from "@/components/hero";
import Features from "@/components/features";
import Pricing from "@/components/pricing";
import Security from "@/components/security";
import Faq from "@/components/faq";
import Footer from "@/components/footer";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <Hero />
        <Features />
        <Pricing />
        <Security />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
