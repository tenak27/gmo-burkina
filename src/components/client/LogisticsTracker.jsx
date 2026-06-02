import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, CheckCircle2, Package, Truck, Star, AlertCircle, MapPin, Phone } from "lucide-react";

const STEPS = [
  { key: "en_attente",     label: "Commande reçue",   icon: Clock,         desc: "Votre commande a été enregistrée" },
  { key: "confirmee",      label: "Confirmée",         icon: CheckCircle2,  desc: "Commande validée par notre équipe" },
  { key: "en_preparation", label: "En préparation",    icon: Package,       desc: "Préparation de votre colis en cours" },
  { key: "en_livraison",   label: "En livraison",      icon: Truck,         desc: "Votre commande est en route" },
  { key: "livree",         label: "Livrée ✓",          icon: Star,          desc: "Commande livrée avec succès" },
];

function StepDot({ step, idx, currentIdx }) {
  const done = idx < currentIdx;
  const active = idx === currentIdx;
  const Icon = step.icon;
  return (
    <div className="flex flex-col items-center">
      <motion.div
        initial={false}
        animate={{
          scale: active ? 1.15 : 1,
          boxShadow: active ? "0 0 0 6px rgba(26,122,46,0.12)" : "0 0 0 0px rgba(26,122,46,0)"
        }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-500 ${
          done    ? "bg-gmo-green border-gmo-green" :
          active  ? "bg-white border-gmo-green" :
                    "bg-white border-gray-200"
        }`}
      >
        <Icon className={`w-4 h-4 transition-colors duration-400 ${
          done ? "text-white" : active ? "text-gmo-green" : "text-gray-300"
        }`} />
      </motion.div>
    </div>
  );
}

export default function LogisticsTracker({ order }) {
  if (!order) return null;

  if (order.status === "annulee") {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex items-center gap-4">
        <AlertCircle className="w-8 h-8 text-red-400 flex-shrink-0" />
        <div>
          <p className="font-heading text-sm font-bold text-red-800">Commande annulée</p>
          <p className="text-xs text-red-600 font-body mt-0.5">Cette commande a été annulée. Contactez-nous pour plus d'informations.</p>
        </div>
      </div>
    );
  }

  const currentIdx = STEPS.findIndex(s => s.key === order.status);
  const progress = currentIdx >= 0 ? (currentIdx / (STEPS.length - 1)) * 100 : 0;
  const currentStep = STEPS[currentIdx];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1C1C1E] to-[#1A7A2E]/60 p-5 text-white">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-body mb-0.5">Suivi de commande</p>
            <h3 className="font-heading text-lg font-bold">{order.order_number || `CMD-${order.id?.slice(-6)}`}</h3>
            <p className="text-xs text-white/50 font-body mt-0.5">
              {new Date(order.created_date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
          {currentStep && (
            <div className="flex items-center gap-2 bg-gmo-green/20 border border-gmo-green/30 px-3 py-1.5 rounded-xl">
              <currentStep.icon className="w-3.5 h-3.5 text-gmo-green" />
              <span className="text-xs text-gmo-green font-heading font-bold whitespace-nowrap">{currentStep.label}</span>
            </div>
          )}
        </div>
      </div>

      {/* Progress */}
      <div className="p-5">
        {/* Track */}
        <div className="relative flex items-center justify-between mb-6">
          {/* BG line */}
          <div className="absolute left-5 right-5 top-5 h-0.5 bg-gray-100 rounded-full" />
          {/* Progress line */}
          <motion.div
            className="absolute left-5 top-5 h-0.5 bg-gradient-to-r from-gmo-green to-gmo-green/70 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `calc(${progress}% - ${progress < 100 ? "2.5rem" : "0px"})` }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          />
          {/* Step dots */}
          {STEPS.map((step, i) => (
            <StepDot key={step.key} step={step} idx={i} currentIdx={currentIdx} />
          ))}
        </div>

        {/* Step labels */}
        <div className="flex items-start justify-between mb-5">
          {STEPS.map((step, i) => {
            const done = i < currentIdx;
            const active = i === currentIdx;
            return (
              <div key={step.key} className="flex flex-col items-center text-center" style={{ width: `${100 / STEPS.length}%` }}>
                <span className={`text-[9px] font-body leading-tight transition-colors duration-300 ${
                  active ? "text-gmo-green font-bold" : done ? "text-gmo-green/60" : "text-obsidian/20"
                }`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Current step description */}
        <AnimatePresence mode="wait">
          {currentStep && (
            <motion.div
              key={order.status}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="bg-gmo-green/5 border border-gmo-green/15 rounded-xl p-3 flex items-center gap-3 mb-4"
            >
              <div className="w-8 h-8 bg-gmo-green/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <currentStep.icon className="w-4 h-4 text-gmo-green" />
              </div>
              <div>
                <p className="font-heading text-xs font-bold text-obsidian">{currentStep.label}</p>
                <p className="text-[11px] text-obsidian/50 font-body">{currentStep.desc}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Details */}
        <div className="grid grid-cols-2 gap-3 text-xs font-body">
          {order.delivery_city && (
            <div className="flex items-center gap-2 text-obsidian/50">
              <MapPin className="w-3.5 h-3.5 text-gmo-green/60 flex-shrink-0" />
              <span>{order.delivery_city}</span>
            </div>
          )}
          {order.estimated_delivery && (
            <div className="flex items-center gap-2 text-obsidian/50">
              <Clock className="w-3.5 h-3.5 text-gmo-green/60 flex-shrink-0" />
              <span>Livraison estimée : {new Date(order.estimated_delivery).toLocaleDateString("fr-FR")}</span>
            </div>
          )}
          {order.total_amount && (
            <div className="col-span-2 flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2 mt-1">
              <span className="text-obsidian/50">Montant total</span>
              <span className="font-heading font-bold text-obsidian">{order.total_amount.toLocaleString()} FCFA</span>
            </div>
          )}
        </div>

        {/* CTA livraison active */}
        {order.status === "en_livraison" && (
          <a href="tel:+22625331900"
            className="mt-3 w-full flex items-center justify-center gap-2 bg-gmo-green text-white font-heading font-bold text-xs py-2.5 rounded-xl hover:bg-gmo-green/90 transition-colors">
            <Phone className="w-3.5 h-3.5" /> Contacter le livreur
          </a>
        )}
      </div>
    </div>
  );
}