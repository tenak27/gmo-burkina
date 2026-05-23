import React from "react";
import Navbar from "../components/landing/Navbar";
import HeroSection from "../components/landing/HeroSection";
import PartnersCarousel from "../components/landing/PartnersCarousel";
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
import MediaSection from "../components/landing/MediaSection";
import BlogSection from "../components/landing/BlogSection";
import GMOFootSection from "../components/landing/GMOFootSection";
import CareersSection from "../components/landing/CareersSection";
import CoverageMap from "../components/landing/CoverageMap";
import NewsletterSection from "../components/landing/NewsletterSection";
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
    "https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/9554d79d0_PHOTO-2026-05-23-22-33-152.jpg",
    "https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/2f88e438c_PHOTO-2026-05-23-22-33-153.jpg",
    "https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/1aee300d1_PHOTO-2026-05-23-22-33-154.jpg",
    "https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/17cd2ca53_PHOTO-2026-05-23-22-33-155.jpg",
    "https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/b1e8da805_PHOTO-2026-05-23-22-33-16.jpg",
    "https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/83d0a9988_PHOTO-2026-05-23-22-33-162.jpg",
  ];

  return (
    <div className="bg-obsidian min-h-screen">
      <Navbar />
      <HeroSection />
      <PartnersCarousel />
      <ServicesSection />
      <StatsSection />
      <AboutSection />
      <TeamSection />
      <ProductsSection />
      <CatalogSection />
      <ProjectsSection />
      <TestimonialsSection />
      <RSESection />
      <PresenceSection />
      <LogisticsPartnersSection />
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