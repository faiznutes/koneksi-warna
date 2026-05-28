import Navbar from "./components/Navbar";
import BottomNav from "./components/BottomNav";
import Hero from "./components/Hero";
import IntroCards from "./components/IntroCards";
import Services from "./components/Services";
import Portfolio from "./components/Portfolio";
import StorySection from "./components/StorySection";
import WhyChoose from "./components/WhyChoose";
import Packages from "./components/Packages";
import Testimonials from "./components/Testimonials";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

export default function App() {
  return (
    <div className="min-h-screen pb-16 lg:pb-0 text-primary">
      <Navbar />
      <main>
        <Hero />
        <IntroCards />
        <Services />
        <Portfolio />
        <StorySection />
        <WhyChoose />
        <Packages />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
}


