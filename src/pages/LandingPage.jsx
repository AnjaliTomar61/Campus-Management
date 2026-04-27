import HeroSection from "../components/HeroSection";
import Card from "../components/Card"
import WelcomeAndNotice from "../components/WelcomeAndNotice";
import NewsEvents from "../components/NewsEvent";
import CounterBox from "../components/CounterBox"
import Institute from "../components/Institute"

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <Card/>
      <WelcomeAndNotice/>
      <NewsEvents/>
      <CounterBox/>
      <Institute/>
    </>
  );
}