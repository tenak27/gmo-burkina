/**
 * Layout moderne style Vuexy - Coloré et dynamique
 */
import React from "react";
import { motion } from "framer-motion";

export default function ModernAdminLayout({ children, title, subtitle }) {
  return (
    <div className="space-y-6 animate-fade-up">
      {/* En-tête de page avec gradient */}
      {title && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6 shadow-lg">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          <div className="relative z-10">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">{title}</h1>
            {subtitle && <p className="text-white/80 text-sm">{subtitle}</p>}
          </div>
        </div>
      )}

      {/* Contenu principal */}
      <div className="space-y-6">
        {children}
      </div>
    </div>
  );
}