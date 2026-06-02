import React, { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { DEFAULT_IMAGES, invalidateSiteImagesCache } from "@/hooks/useSiteImages";

import { Upload, Loader2, X, RotateCcw, Download } from "lucide-react";
import { DEFAULT_IMAGES as DEFAULTS } from "@/hooks/useSiteImages";

const SECTIONS = [
  {
    id: "hero",
    label: "Hero — Slides d'accueil",
    color: "from-indigo-500 to-violet-600",
    slots: [
      { slot: "hero_slide_1", label: "Slide 1 — Distribution" },
      { slot: "hero_slide_2", label: "Slide 2 — Transport" },
      { slot: "hero_slide_3", label: "Slide 3 — Qualité" },
      { slot: "hero_slide_4", label: "Slide 4 — Expansion" },
    ],
  },
  {
    id: "about",
    label: "À Propos",
    color: "from-gmo-green to-emerald-600",
    slots: [
      { slot: "about_pdg", label: "Photo PDG" },
      { slot: "about_siege", label: "Siège social (vignette)" },
    ],
  },
  {
    id: "about_values",
    label: "Valeurs (verso des cartes)",
    color: "from-teal-500 to-green-600",
    slots: [
      { slot: "about_valeur_1", label: "Valeur 1 — Qualité & Service" },
      { slot: "about_valeur_2", label: "Valeur 2 — Responsabilité" },
      { slot: "about_valeur_3", label: "Valeur 3 — Innovation" },
      { slot: "about_valeur_4", label: "Valeur 4 — Équité & Confiance" },
    ],
  },
  {
    id: "galerie",
    label: "Galerie photos (section Galerie)",
    color: "from-violet-500 to-purple-600",
    slots: [
      { slot: "galerie_1", label: "Photo 1 (grande)" },
      { slot: "galerie_2", label: "Photo 2" },
      { slot: "galerie_3", label: "Photo 3" },
      { slot: "galerie_4", label: "Photo 4" },
      { slot: "galerie_5", label: "Photo 5" },
      { slot: "galerie_6", label: "Photo 6" },
    ],
  },
];

function ImageSlot({ slot, label, dbRecord, onSave }) {
  const [uploading, setUploading] = useState(false);
  const [url, setUrl] = useState(dbRecord?.image_url || DEFAULT_IMAGES[slot] || "");
  const [saving, setSaving] = useState(false);
  const inputRef = React.useRef(null);

  const currentUrl = dbRecord?.image_url || DEFAULT_IMAGES[slot] || "";

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setUrl(file_url);
    setUploading(false);
    await handleSave(file_url);
  };

  const handleSave = async (forceUrl) => {
    const finalUrl = forceUrl || url;
    if (!finalUrl || finalUrl === currentUrl) return;
    setSaving(true);
    if (dbRecord?.id) {
      await base44.entities.SiteImages.update(dbRecord.id, { image_url: finalUrl, label });
    } else {
      await base44.entities.SiteImages.create({ section: slot.split("_")[0], slot, label, image_url: finalUrl, order: 0 });
    }
    invalidateSiteImagesCache();
    setSaving(false);
    onSave(slot, finalUrl);
  };

  const handleReset = async () => {
    if (!dbRecord?.id) return;
    setSaving(true);
    await base44.entities.SiteImages.delete(dbRecord.id);
    setUrl(DEFAULT_IMAGES[slot] || "");
    invalidateSiteImagesCache();
    setSaving(false);
    onSave(slot, null);
  };

  const isCustom = !!dbRecord?.image_url;

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Image preview */}
      <div className="relative aspect-video bg-gray-50 overflow-hidden">
        {(url || currentUrl) ? (
          <img src={url || currentUrl} alt={label} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-200 text-xs font-body">Aucune image</div>
        )}
        {isCustom && (
          <div className="absolute top-2 left-2 bg-gmo-green text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
            Personnalisé
          </div>
        )}
        {(saving || uploading) && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-white animate-spin" />
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="p-3">
        <p className="font-heading text-xs font-bold text-obsidian mb-2 truncate">{label}</p>

        {/* URL input */}
        <input
          value={url}
          onChange={e => setUrl(e.target.value)}
          onBlur={() => handleSave()}
          placeholder="https://..."
          className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs font-body focus:outline-none focus:border-gmo-green mb-2"
        />

        <div className="flex gap-2">
          <button
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex-1 flex items-center justify-center gap-1.5 bg-gmo-green/10 text-gmo-green border border-gmo-green/20 text-xs font-heading font-bold py-1.5 rounded-lg hover:bg-gmo-green hover:text-white transition-all cursor-pointer disabled:opacity-50"
          >
            <Upload className="w-3 h-3" />
            {uploading ? "Upload…" : "Fichier"}
          </button>
          {isCustom && (
            <button
              onClick={handleReset}
              disabled={saving}
              title="Remettre l'image par défaut"
              className="px-2.5 border border-gray-200 rounded-lg text-gray-400 hover:text-gmo-red hover:border-gmo-red transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          )}
        </div>
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </div>
    </div>
  );
}

// Collect all slots across all sections
const ALL_SLOTS = SECTIONS.flatMap(s => s.slots);

async function downloadAllPhotos(dbRecords) {
  const rows = ALL_SLOTS.map(({ slot, label }) => {
    const rec = dbRecords.find(r => r.slot === slot);
    const url = rec?.image_url || DEFAULT_IMAGES[slot] || "";
    const section = SECTIONS.find(s => s.slots.some(sl => sl.slot === slot))?.label || "";
    return { slot, label, section, url, custom: !!rec?.image_url };
  }).filter(r => r.url);

  // 1. Export JSON catalog
  const json = JSON.stringify(rows, null, 2);
  const jsonBlob = new Blob([json], { type: "application/json" });
  const jsonUrl = URL.createObjectURL(jsonBlob);
  const a = document.createElement("a");
  a.href = jsonUrl;
  a.download = "gmo-site-images.json";
  a.click();
  URL.revokeObjectURL(jsonUrl);
}

export default function SiteImagesManager() {
  const [dbRecords, setDbRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("hero");
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    base44.entities.SiteImages.list("order", 200).then(data => {
      setDbRecords(data || []);
      setLoading(false);
    });
  }, []);

  const getRecord = (slot) => dbRecords.find(r => r.slot === slot) || null;

  const handleSave = (slot, newUrl) => {
    if (!newUrl) {
      setDbRecords(prev => prev.filter(r => r.slot !== slot));
    } else {
      setDbRecords(prev => {
        const exists = prev.find(r => r.slot === slot);
        if (exists) return prev.map(r => r.slot === slot ? { ...r, image_url: newUrl } : r);
        return [...prev, { slot, image_url: newUrl }];
      });
    }
  };

  const currentSection = SECTIONS.find(s => s.id === activeSection);

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-heading text-base font-bold text-obsidian">Images du site vitrine</h3>
          <p className="text-[11px] text-obsidian/40 font-body mt-0.5">Modifiez les images de chaque section. Les changements sont pris en compte immédiatement.</p>
        </div>
        <button
          onClick={async () => { setExporting(true); await downloadAllPhotos(dbRecords); setExporting(false); }}
          disabled={exporting || loading}
          className="flex items-center gap-1.5 bg-obsidian text-white text-xs font-heading font-bold px-4 py-2 rounded-xl hover:bg-obsidian/80 transition-colors disabled:opacity-50 cursor-pointer flex-shrink-0"
        >
          {exporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
          Exporter les photos
        </button>
      </div>

      {/* Section tabs */}
      <div className="flex flex-wrap gap-2">
        {SECTIONS.map(s => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            className={`text-xs font-heading font-bold px-4 py-2 rounded-xl border transition-all cursor-pointer ${
              activeSection === s.id
                ? `bg-gradient-to-r ${s.color} text-white border-transparent shadow-md`
                : "bg-white border-gray-200 text-obsidian/60 hover:border-gray-300"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-16 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-gmo-green" />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {currentSection?.slots.map(({ slot, label }) => (
            <ImageSlot
              key={slot}
              slot={slot}
              label={label}
              dbRecord={getRecord(slot)}
              onSave={handleSave}
            />
          ))}
        </div>
      )}
    </div>
  );
}