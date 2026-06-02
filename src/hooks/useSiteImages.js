import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

// Fallback images par défaut (utilisées si aucune image n'est configurée dans la DB)
export const DEFAULT_IMAGES = {
  // Hero slides
  hero_slide_1: "https://gmobfaso.com/assets/img/slides/slide-1.jpg",
  hero_slide_2: "https://gmobfaso.com/assets/img/slides/slide-2.jpg",
  hero_slide_3: "https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/9a00481b3_a-propos-6.jpg",
  hero_slide_4: "https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/c25f1b164_Gemini_Generated_Image_7tq8x97tq8x97tq8.png",
  // About
  about_pdg: "https://gmobfaso.com/assets/img/a-propos/a-propos-1.jpg",
  about_siege: "https://gmobfaso.com/assets/img/a-propos/a-propos-2.jpg",
  about_valeur_1: "https://gmobfaso.com/assets/img/a-propos/a-propos-3.jpg",
  about_valeur_2: "https://gmobfaso.com/assets/img/a-propos/a-propos-4.jpg",
  about_valeur_3: "https://gmobfaso.com/assets/img/a-propos/a-propos-5.jpg",
  about_valeur_4: "https://gmobfaso.com/assets/img/a-propos/a-propos-6.jpg",
  // Gallery
  galerie_1: "https://gmobfaso.com/assets/img/a-propos/a-propos-1.jpg",
  galerie_2: "https://gmobfaso.com/assets/img/a-propos/a-propos-2.jpg",
  galerie_3: "https://gmobfaso.com/assets/img/a-propos/a-propos-3.jpg",
  galerie_4: "https://gmobfaso.com/assets/img/a-propos/a-propos-4.jpg",
  galerie_5: "https://gmobfaso.com/assets/img/a-propos/a-propos-5.jpg",
  galerie_6: "https://gmobfaso.com/assets/img/a-propos/a-propos-6.jpg",
};

// Cache global pour éviter les rechargements
let cache = null;
let cacheTime = 0;
const CACHE_TTL = 60000; // 1 minute

export function useSiteImages() {
  const [images, setImages] = useState(cache || {});
  const [loading, setLoading] = useState(!cache);

  useEffect(() => {
    if (cache && Date.now() - cacheTime < CACHE_TTL) {
      setImages(cache);
      setLoading(false);
      return;
    }
    base44.entities.SiteImages.list("order", 200).then(data => {
      const map = { ...DEFAULT_IMAGES };
      (data || []).forEach(item => {
        if (item.image_url) map[item.slot] = item.image_url;
      });
      cache = map;
      cacheTime = Date.now();
      setImages(map);
      setLoading(false);
    }).catch(() => {
      setImages(DEFAULT_IMAGES);
      setLoading(false);
    });
  }, []);

  const getImage = (slot) => images[slot] || DEFAULT_IMAGES[slot] || "";

  return { images, loading, getImage };
}

// Invalider le cache (appelé depuis /vitrine après une mise à jour)
export function invalidateSiteImagesCache() {
  cache = null;
  cacheTime = 0;
}