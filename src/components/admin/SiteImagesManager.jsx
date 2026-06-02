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

// Static images used elsewhere on the site
const STATIC_IMAGES = [
  { label: "Logo GMO blanc", url: "https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/c7662a636_logo-gmo2x.png", section: "Logo" },
  { label: "Logo GMO couleur", url: "https://gmobfaso.com/assets/img/logo-gmo-white.png", section: "Logo" },
  { label: "PDG Hama TRAORE", url: "https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/54507cccd_a-propos-1.jpg", section: "Équipe" },
  { label: "Responsable Commercial", url: "https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/7966bc145_a-propos-3.jpg", section: "Équipe" },
  { label: "Responsable des Ventes", url: "https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/50ca5b66a_Capturedcran2026-05-2511424PM.png", section: "Équipe" },
  { label: "Direction Générale BG", url: "https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/1a0a79b3c_Gemini_Generated_Image_b8kbkwb8kbkwb8kb.png", section: "Équipe Opérationnelle" },
  { label: "Logo SN SOSUCO", url: "https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/a07c14446_SN-SOSUCO_Logo.jpg", section: "Marques" },
  { label: "Logo COBIFA", url: "https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/87c9905a4_df17408e-8ab1-4f74-b8df-9b78417b22b4.jpeg", section: "Marques" },
  { label: "Logo Imperial Tobacco", url: "https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/1336cac69_IMG_0553.png", section: "Marques" },
  { label: "Logo SN CITEC", url: "https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/5455769ac_Logo-2025-taille-normale-300x91.jpg", section: "Marques" },
  { label: "Logo GMF Etalon", url: "https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/ff5444a02_gmb.jpg", section: "Marques" },
];

async function urlToJpegBlob(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(resolve, "image/jpeg", 0.92);
    };
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

async function downloadAllPhotos(dbRecords, onProgress) {
  // Build full list: dynamic slots + static images
  const dynamicRows = ALL_SLOTS.map(({ slot, label }) => {
    const rec = dbRecords.find(r => r.slot === slot);
    const url = rec?.image_url || DEFAULT_IMAGES[slot] || "";
    const section = SECTIONS.find(s => s.slots.some(sl => sl.slot === slot))?.label || "";
    return { filename: `${section.replace(/[^a-z0-9]/gi, "_")}_${slot}.jpg`, label, section, url };
  }).filter(r => r.url);

  const staticRows = STATIC_IMAGES.map(({ label, url, section }) => ({
    filename: `${section.replace(/[^a-z0-9]/gi, "_")}_${label.replace(/[^a-z0-9]/gi, "_")}.jpg`,
    label, section, url,
  }));

  const allRows = [...dynamicRows, ...staticRows];
  let downloaded = 0;

  for (const row of allRows) {
    const blob = await urlToJpegBlob(row.url);
    if (blob) {
      const objUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objUrl;
      a.download = row.filename;
      a.click();
      URL.revokeObjectURL(objUrl);
      // Small delay to avoid browser blocking multiple downloads
      await new Promise(r => setTimeout(r, 300));
    }
    downloaded++;
    onProgress(downloaded, allRows.length);
  }
}

export default function SiteImagesManager() {
  const [dbRecords, setDbRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("hero");
  const [exporting, setExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState({ current: 0, total: 0 });

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
          onClick={async () => {
            setExporting(true);
            setExportProgress({ current: 0, total: 0 });
            await downloadAllPhotos(dbRecords, (current, total) => setExportProgress({ current, total }));
            setExporting(false);
          }}
          disabled={exporting || loading}
          className="flex items-center gap-1.5 bg-obsidian text-white text-xs font-heading font-bold px-4 py-2 rounded-xl hover:bg-obsidian/80 transition-colors disabled:opacity-50 cursor-pointer flex-shrink-0"
        >
          {exporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
          {exporting && exportProgress.total > 0
            ? `${exportProgress.current}/${exportProgress.total} JPEG…`
            : "Exporter tout en JPEG"}
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