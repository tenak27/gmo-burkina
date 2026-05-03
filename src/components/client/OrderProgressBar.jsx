import React from "react";
import { CheckCircle2, Circle, Package, Truck, Star } from "lucide-react";

const STEPS = [
  { key: "en_attente",     label: "Reçue",       icon: Circle },
  { key: "confirmee",      label: "Confirmée",   icon: CheckCircle2 },
  { key: "en_preparation", label: "Préparation", icon: Package },
  { key: "en_livraison",   label: "En route",    icon: Truck },
  { key: "livree",         label: "Livrée",      icon: Star },
];

const STATUS_INDEX = {
  en_attente: 0,
  confirmee: 1,
  en_preparation: 2,
  en_livraison: 3,
  livree: 4,
  annulee: -1,
};

export default function OrderProgressBar({ status }) {
  const currentIndex = STATUS_INDEX[status] ?? 0;

  if (status === "annulee") {
    return (
      <div className="flex items-center gap-2 py-2">
        <div className="w-2 h-2 rounded-full bg-red-400" />
        <span className="text-xs text-red-500 font-body">Commande annulée</span>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Progress line */}
      <div className="absolute top-4 left-4 right-4 h-0.5 bg-gray-100">
        <div
          className="h-full bg-gmo-green transition-all duration-700 ease-out rounded-full"
          style={{ width: `${(currentIndex / (STEPS.length - 1)) * 100}%` }}
        />
      </div>

      {/* Steps */}
      <div className="relative flex justify-between">
        {STEPS.map((step, i) => {
          const done = i < currentIndex;
          const active = i === currentIndex;
          const Icon = step.icon;

          return (
            <div key={step.key} className="flex flex-col items-center gap-1.5" style={{ minWidth: 0 }}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                done
                  ? "bg-gmo-green border-gmo-green text-white"
                  : active
                  ? "bg-white border-gmo-green text-gmo-green shadow-md shadow-gmo-green/20 scale-110"
                  : "bg-white border-gray-200 text-gray-300"
              }`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
              <span className={`text-[9px] font-body whitespace-nowrap ${
                done ? "text-gmo-green font-medium"
                : active ? "text-gmo-green font-bold"
                : "text-obsidian/30"
              }`}>{step.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}