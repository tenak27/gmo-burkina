import React, { useEffect, useState, useRef } from "react";

import Navbar from "../components/landing/Navbar";
import HeroSection from "../components/landing/HeroSection";
import PartnersCarousel from "../components/landing/PartnersCarousel";
import PartnershipBanner from "../components/landing/PartnershipBanner";
import PresenceSection from "../components/landing/PresenceSection";
import ServicesSection from "../components/landing/ServicesSection";
import StatsSection from "../components/landing/StatsSection";
import AboutSection from "../components/landing/AboutSection";
import TeamSection from "../components/landing/TeamSection";
import RSESection from "../components/landing/RSESection";
import ProductsSection from "../components/landing/ProductsSection";
import CatalogSection from "../components/landing/CatalogSection";
import ProjectsSection from "../components/landing/ProjectsSection";
import TestimonialsSection from "../components/landing/TestimonialsSection";
import JourneyBanner from "../components/landing/JourneyBanner";
import LogisticsPartnersSection from "../components/landing/LogisticsPartnersSection";
import GallerySection from "../components/landing/GallerySection";
import FleetGallerySection from "../components/landing/FleetGallerySection";
import MediaSection from "../components/landing/MediaSection";
import BlogSection from "../components/landing/BlogSection";
import GMOFootSection from "../components/landing/GMOFootSection";
import CareersSection from "../components/landing/CareersSection";
import CoverageMap from "../components/landing/CoverageMap";
import NewsletterSection from "../components/landing/NewsletterSection";
import ContactSection from "../components/landing/ContactSection";
import Footer from "../components/landing/Footer";

const IMAGES = {
  hero: "https://gmobfaso.com/assets/img/slides/slide-1.jpg",
  hub: "https://gmobfaso.com/assets/img/a-propos/a-propos-2.jpg",
  detail: "https://gmobfaso.com/assets/img/a-propos/a-propos-3.jpg",
  fleet: "https://gmobfaso.com/assets/img/slides/slide-2.jpg",
  cargo: "https://gmobfaso.com/assets/img/slides/slide-3.jpg",
  journey: "https://gmobfaso.com/assets/img/a-propos/a-propos-5.jpg",
};

const FALLBACK_GALLERY = [
  "https://gmobfaso.com/assets/img/a-propos/a-propos-1.jpg",
  "https://gmobfaso.com/assets/img/a-propos/a-propos-2.jpg",
  "https://gmobfaso.com/assets/img/a-propos/a-propos-3.jpg",
  "https://gmobfaso.com/assets/img/a-propos/a-propos-4.jpg",
  "https://gmobfaso.com/assets/img/a-propos/a-propos-5.jpg",
  "https://gmobfaso.com/assets/img/a-propos/a-propos-6.jpg",
];

export default function Home() {
  const [galleryImages, setGalleryImages] = useState(FALLBACK_GALLERY);

  // Smooth section reveal via IntersectionObserver on all sections
  useEffect(() => {
    const sections = document.querySelectorAll("section");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
          }
        });
      },
      { threshold: 0.06, rootMargin: "-30px 0px" }
    );
    sections.forEach((s) => {
      if (!s.style.opacity) {
        s.style.transition = "opacity 0.7s cubic-bezier(0.22,1,0.36,1), transform 0.7s cubic-bezier(0.22,1,0.36,1)";
        s.style.opacity = "0";
        s.style.transform = "translateY(24px)";
      }
      observer.observe(s);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-obsidian min-h-screen">
      <Navbar />
      <HeroSection />
      <PartnershipBanner />
      <PartnersCarousel />
      <ServicesSection />
      <ProductsSection />
      <CatalogSection />
      <StatsSection />
      <AboutSection />
      <TeamSection />
      <ProjectsSection />
      <TestimonialsSection />
      <RSESection />
      <PresenceSection />
      <LogisticsPartnersSection />
      <FleetGallerySection />
      <GallerySection images={galleryImages} />
      <JourneyBanner journeyImage={IMAGES.journey} />
      <MediaSection />
      <BlogSection />
      <NewsletterSection />
      <GMOFootSection />
      <CoverageMap />
      <ContactSection />
      <Footer />
    </div>
  );
}