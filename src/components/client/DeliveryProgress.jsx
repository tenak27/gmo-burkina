import React from "react";
import { Circle, CheckCircle2, Package, Truck, Star, Clock } from "lucide-react";

const STEPS = [
  { key: "en_attente",     label: "Reçue",        short: "Reçue",     icon: Clock },
  { key: "confirmee",      label: "Confirmée",    short: "Confirmée", icon: CheckCircle2 },
  { key: "en_preparation", label: "Préparation",  short: "Prépa.",    icon: Package },
  { key: "en_livraison",   label: "En livraison", short: "Livraison", icon: Truck },
  { key: "livree",         label: "Livrée ✓",     short: "Livrée",    icon: Star },
];

export default function DeliveryProgress({ status }) {
  if (status === "annulee") {
    return (
      <div className="flex items-center gap-2 py-2 px-3 bg-red-50 rounded-xl border border-red-100">
        <div className="w-2 h-2 rounded-full bg-red-400 flex-shrink-0" />
        <span className="text-xs text-red-600 font-body">Commande annulée</span>
      </div>
    );
  }

  const currentIdx = STEPS.findIndex(s => s.key === status);
  const progress = currentIdx >= 0 ? ((currentIdx) / (STEPS.length - 1)) * 100 : 0;

  return (
    <div className="py-1">
      {/* Progress track */}
      <div className="relative flex items-center justify-between mb-3">
        {/* Background line */}
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] bg-gray-100 rounded-full" />
        {/* Filled line */}
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-gmo-green rounded-full transition-all duration-700 ease-out"
          style={{ width: `${progress}%` }}
        />
        {/* Step dots */}
        {STEPS.map((step, i) => {
          const done = i < currentIdx;
          const active = i === currentIdx;
          const Icon = step.icon;
          return (
            <div key={step.key} className="relative z-10 flex flex-col items-center">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                done    ? "bg-gmo-green border-gmo-green" :
                active  ? "bg-white border-gmo-green shadow-md shadow-gmo-green/20" :
                          "bg-white border-gray-200"
              }`}>
                <Icon className={`w-3 h-3 transition-colors duration-300 ${
                  done   ? "text-white" :
                  active ? "text-gmo-green" :
                           "text-gray-300"
                }`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Labels */}
      <div className="flex items-start justify-between">
        {STEPS.map((step, i) => {
          const done = i < currentIdx;
          const active = i === currentIdx;
          return (
            <div key={step.key} className="flex flex-col items-center" style={{ width: `${100 / STEPS.length}%` }}>
              <span className={`text-center font-body leading-tight transition-colors duration-300 ${
                active  ? "text-gmo-green font-semibold text-[10px]" :
                done    ? "text-gmo-green/70 text-[9px]" :
                          "text-obsidian/25 text-[9px]"
              }`}>
                {step.short}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}