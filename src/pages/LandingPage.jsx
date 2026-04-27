import HeroSection from "../components/HeroSection";
import Card from "../components/Card";
import WelcomeAndNotice from "../components/WelcomeAndNotice";
import NewsEvents from "../components/NewsEvent";
import CounterBox from "../components/CounterBox";
import Institute from "../components/Institute";
import LandingWhyChoose from "../components/landing/LandingWhyChoose";
import LandingPrograms from "../components/landing/LandingPrograms";
import LandingTestimonials from "../components/landing/LandingTestimonials";
import LandingCTABand from "../components/landing/LandingCTABand";
import LandingInquiryForm from "../components/landing/LandingInquiryForm";

export default function LandingPage() {
  return (
    <main className="bg-(--brand-bg) text-slate-900">
      <section id="home" aria-label="Hero">
        <HeroSection />
      </section>
      <LandingWhyChoose />
      <section id="quick-links" aria-label="Quick links">
        <Card />
      </section>
      <LandingPrograms />
      <section
        id="about"
        className="border-t border-slate-200/80 bg-slate-50/80"
        aria-label="Welcome and notices"
      >
        <WelcomeAndNotice />
      </section>
      <section
        id="news"
        className="border-t border-slate-200/80"
        aria-label="News and events"
      >
        <NewsEvents />
      </section>
      <section id="stats" aria-label="Campus highlights">
        <CounterBox />
      </section>
      <LandingTestimonials />
      <section
        id="institutes"
        className="border-t border-slate-200/80 bg-white"
        aria-label="Our institutes"
      >
        <Institute />
      </section>
      <LandingInquiryForm />
      <LandingCTABand />
    </main>
  );
}
