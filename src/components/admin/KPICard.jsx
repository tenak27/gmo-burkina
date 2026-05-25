/**
 * Cartes KPI avec effets 3D - Design Premium
 */
import React from "react";
import { motion } from "framer-motion";

export default function KPICard({ label, value, icon: Icon, gradient = "from-blue-500 to-indigo-600", trend, sublabel }) {
  if (!Icon) return null;
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="relative rounded-2xl p-6 overflow-hidden"
      style={{
        background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
        boxShadow: "0 10px 40px -10px rgba(0,0,0,0.3), 0 0 20px rgba(0,0,0,0.1)",
      }}
    >
      {/* Gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-95`} />
      
      {/* Subtle pattern overlay */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
          backgroundSize: "20px 20px"
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Icon */}
        <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 shadow-lg">
          <Icon className="w-6 h-6 text-white" />
        </div>

        {/* Value */}
        <div className="mb-1">
          <p className="text-3xl sm:text-4xl font-heading font-black text-white tracking-tight">
            {value}
          </p>
        </div>

        {/* Label */}
        <p className="text-sm text-white/80 font-body font-medium">
          {label}
        </p>

        {/* Optional trend/sublabel */}
        {(trend || sublabel) && (
          <div className="mt-3 flex items-center gap-2">
            {trend && (
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                trend > 0 
                  ? "bg-green-400/20 text-green-50" 
                  : trend < 0 
                  ? "bg-red-400/20 text-red-50"
                  : "bg-white/20 text-white"
              }`}>
                {trend > 0 ? "↑" : trend < 0 ? "↓" : "•"} {Math.abs(trend)}%
              </span>
            )}
            {sublabel && (
              <span className="text-xs text-white/60 font-body">{sublabel}</span>
            )}
          </div>
        )}
      </div>

      {/* Bottom glow effect */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none opacity-50"
        style={{
          background: "linear-gradient(to top, rgba(255,255,255,0.1), transparent)"
        }}
      />
    </motion.div>
  );
}

/**
 * Carte KPI simple (fond blanc avec effet 3D)
 */
export function KPICardLight({ label, value, icon: Icon, color = "gmo-green" }) {
  const colorMap = {
    "gmo-green": { bg: "bg-gmo-green/10", text: "text-gmo-green", border: "border-gmo-green/20" },
    "gmo-red": { bg: "bg-gmo-red/10", text: "text-gmo-red", border: "border-gmo-red/20" },
    "blue": { bg: "bg-blue-500/10", text: "text-blue-600", border: "border-blue-500/20" },
    "amber": { bg: "bg-amber-500/10", text: "text-amber-600", border: "border-amber-500/20" },
  };

  const colors = colorMap[color] || colorMap["gmo-green"];

  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="bg-white rounded-2xl p-6 border shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all duration-200"
      style={{ borderColor: "rgba(0,0,0,0.07)" }}
    >
      {/* Icon */}
      <div className={`w-11 h-11 rounded-xl ${colors.bg} ${colors.border} border flex items-center justify-center mb-4`}>
        <Icon className={`w-5 h-5 ${colors.text}`} />
      </div>

      {/* Value */}
      <p className="text-2xl sm:text-3xl font-heading font-black text-obsidian mb-1">
        {value}
      </p>

      {/* Label */}
      <p className="text-sm text-obsidian/60 font-body font-medium">
        {label}
      </p>
    </motion.div>
  );
}