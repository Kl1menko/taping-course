import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Offer from "@/components/Offer";
import Pains from "@/components/Pains";
import Fears from "@/components/Fears";
import Objections from "@/components/Objections";
import Program from "@/components/Program";
import Audience from "@/components/Audience";
import Benefits from "@/components/Benefits";
import Pricing from "@/components/Pricing";
import Author from "@/components/Author";
import Reviews from "@/components/Reviews";
import Faq from "@/components/Faq";
import Signup from "@/components/Signup";
import Contacts from "@/components/Contacts";
import Banner from "@/components/Banner";
import Footer from "@/components/Footer";
import { banners } from "@/content";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />

        {/* 1. ОФФЕР */}
        <Offer />

        {/* 2. БОЛІ ЦА */}
        <Pains />
        <Audience />

        {/* банер: біль → рішення */}
        <Banner data={banners.afterPains} />

        {/* 3. СТРАХИ ЦА */}
        <Fears />

        {/* 4. ЗАПЕРЕЧЕННЯ */}
        <Objections />
        <Program />
        <Benefits />

        {/* 5. ЦІНИ */}
        <Pricing />

        {/* 6. СОЦ ПРУФИ */}
        <Author />
        <Reviews />

        {/* банер: дедлайн на піку довіри */}
        <Banner data={banners.afterProof} />

        {/* 7. ВІДПОВІДІ НА ПИТАННЯ */}
        <Faq />

        {/* 8. КОНТАКТИ */}
        <Signup />
        <Contacts />
      </main>
      <Footer />
    </>
  );
}
