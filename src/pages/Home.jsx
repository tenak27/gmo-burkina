import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Zap, TrendingUp, BarChart3, Users, Award } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-full text-sm font-semibold text-purple-200 mb-6">
                🚀 Bienvenue sur GMO Burkina
              </span>
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Gérez votre <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">commerce</span> en toute simplicité
              </h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Plateforme ERP complète pour les commerces et PME du Burkina Faso. Gestion de stock, factures, commandes et bien plus.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/admin" className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-xl font-bold text-white flex items-center gap-2 transition-all hover:shadow-2xl hover:shadow-purple-500/50">
                  Commencer <ArrowRight className="w-5 h-5" />
                </Link>
                <button className="px-8 py-4 border-2 border-purple-400 text-purple-300 hover:bg-purple-500/10 rounded-xl font-bold transition-all">
                  En savoir plus
                </button>
              </div>
            </motion.div>

            {/* Right Visual */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative h-96"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-3xl blur-3xl opacity-20" />
              <div className="relative bg-gradient-to-br from-purple-900/50 to-pink-900/50 border border-purple-500/30 rounded-3xl p-8 backdrop-blur-xl flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="w-24 h-24 text-gradient-to-r from-purple-400 to-pink-400 mx-auto mb-4 opacity-80" />
                  <p className="text-gray-300">Tableau de bord intuitif</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Fonctionnalités <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Complètes</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Tout ce dont vous avez besoin pour gérer votre commerce efficacement
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: "Gestion Stock", desc: "Suivi en temps réel de vos produits" },
              { icon: TrendingUp, title: "Ventes & Factures", desc: "Générez vos factures automatiquement" },
              { icon: Users, title: "Gestion Clients", desc: "Gérez tous vos clients centralement" },
            ].map((feat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="group bg-gradient-to-br from-purple-900/40 via-pink-900/40 to-red-900/40 border border-purple-500/20 rounded-2xl p-8 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/20 transition-all"
              >
                <feat.icon className="w-12 h-12 text-purple-400 mb-4 group-hover:scale-125 transition-transform" />
                <h3 className="text-xl font-bold text-white mb-3">{feat.title}</h3>
                <p className="text-gray-400">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-3xl p-12 md:p-16 text-center"
          >
            <Award className="w-16 h-16 text-white mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Prêt à transformer votre commerce ?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Rejoignez des centaines de commerçants utilisant GMO Burkina ERP
            </p>
            <Link to="/admin" className="inline-block px-10 py-4 bg-white text-purple-600 font-bold rounded-xl hover:shadow-2xl hover:scale-105 transition-all">
              Commencer maintenant →
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}