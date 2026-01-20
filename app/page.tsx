import Hero from "./components/Hero";
import Services from "./components/Services";
import TrustStrip from "./components/TrustStrip";
import ContactForm from "./components/ContactForm";
import TaxForm from "./components/TaxForm";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <Services />
      <TrustStrip />
      <ContactForm />
      <TaxForm />
      <Footer />
    </main>
  );
}
