import React from "react";
import Navbar from "../components/landing/Navbar";
import HeroSection from "../components/landing/HeroSection";
import ServicesSection from "../components/landing/ServicesSection";
import AboutSection from "../components/landing/AboutSection";
import ProductsSection from "../components/landing/ProductsSection";
import JourneyBanner from "../components/landing/JourneyBanner";
import TestimonialsSection from "../components/landing/TestimonialsSection";
import GallerySection from "../components/landing/GallerySection";
import GMOFootSection from "../components/landing/GMOFootSection";
import PartnersSection from "../components/landing/PartnersSection";
import CoverageMap from "../components/landing/CoverageMap";
import ContactSection from "../components/landing/ContactSection";
import Footer from "../components/landing/Footer";

const IMAGES = {
  hero: "https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/1a49d0a18_generated_1a2588b5.png",
  hub: "https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/7fb80f92d_generated_bc5a0082.png",
  detail: "https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/b71c07b21_generated_f4cdf466.png",
  fleet: "https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/1e2be0905_generated_51987d61.png",
  cargo: "https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/c233f6983_generated_cd287a08.png",
  journey: "https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/5bc285315_generated_35f6c974.png",
};

export default function Home() {
  const galleryImages = [
    IMAGES.fleet,
    IMAGES.hub,
    IMAGES.cargo,
    IMAGES.detail,
    IMAGES.journey,
  ];

  return (
    <div className="bg-obsidian min-h-screen">
      <Navbar />
      <HeroSection heroImage={IMAGES.hero} />
      <ServicesSection />
      <AboutSection />
      <ProductsSection />
      <TestimonialsSection />
      <JourneyBanner journeyImage={IMAGES.journey} />
      <GallerySection images={galleryImages} />
      <GMOFootSection />
      <PartnersSection />
      <CoverageMap />
      <ContactSection />
      <Footer />
    </div>
  );
}