import Header from "@/components/Header";
import Hero from "@/components/Hero";
import TrustBar from "@/components/TrustBar";
import Problem from "@/components/Problem";
import Audience from "@/components/Audience";
import Outcome from "@/components/Outcome";
import Mechanism from "@/components/Mechanism";
import Program from "@/components/Program";
import Included from "@/components/Included";
import Proof from "@/components/Proof";
import Expert from "@/components/Expert";
import Evidence from "@/components/Evidence";
import Objections from "@/components/Objections";
import Faq from "@/components/Faq";
import Offer from "@/components/Offer";
import FinalCta from "@/components/FinalCta";
import Contacts from "@/components/Contacts";
import Footer from "@/components/Footer";
import StickyCta from "@/components/StickyCta";
import PageView from "@/components/PageView";

// Порядок блоків — за фінальною архітектурою ТЗ V2:
// HOOK → PROBLEM → OUTCOME → MECHANISM → PROGRAM → PROOF
// → OFFER → OBJECTIONS → QUALIFICATION
export default function Home() {
  return (
    <>
      <PageView />
      <Header />
      <main>
        {/* 01 */} <Hero />
        {/* 02 */} <TrustBar />
        {/* 03 */} <Problem />
        {/* 04 */} <Audience />
        {/* 05 */} <Outcome />
        {/* 06 */} <Mechanism />
        {/* 07 */} <Program />
        {/* 08 */} <Included />
        {/* 09 */} <Proof />
        {/* 10 */} <Expert />
        {/* 11 */} <Evidence />
        {/* 12 */} <Objections />
        {/* 13 */} <Faq />
        {/* 14 */} <Offer />
        {/* 15 */} <FinalCta />
        <Contacts />
      </main>
      <Footer />
      <StickyCta />
    </>
  );
}
