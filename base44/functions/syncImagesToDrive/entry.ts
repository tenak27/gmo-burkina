import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// Toutes les images du site vitrine GMO
const SITE_IMAGES = [
  // Hero slides
  { filename: "Hero_slide_1.jpg", url: "https://gmobfaso.com/assets/img/slides/slide-1.jpg", folder: "Hero" },
  { filename: "Hero_slide_2.jpg", url: "https://gmobfaso.com/assets/img/slides/slide-2.jpg", folder: "Hero" },
  { filename: "Hero_slide_3.jpg", url: "https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/9a00481b3_a-propos-6.jpg", folder: "Hero" },
  { filename: "Hero_slide_4.jpg", url: "https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/c25f1b164_Gemini_Generated_Image_7tq8x97tq8x97tq8.png", folder: "Hero" },
  // À propos
  { filename: "PDG_Hama_TRAORE.jpg", url: "https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/54507cccd_a-propos-1.jpg", folder: "APropos" },
  { filename: "Siege_social.jpg", url: "https://gmobfaso.com/assets/img/a-propos/a-propos-2.jpg", folder: "APropos" },
  { filename: "Valeur_Qualite_Service.jpg", url: "https://gmobfaso.com/assets/img/a-propos/a-propos-3.jpg", folder: "APropos" },
  { filename: "Valeur_Responsabilite.jpg", url: "https://gmobfaso.com/assets/img/a-propos/a-propos-4.jpg", folder: "APropos" },
  { filename: "Valeur_Innovation.jpg", url: "https://gmobfaso.com/assets/img/a-propos/a-propos-5.jpg", folder: "APropos" },
  { filename: "Valeur_Equite_Confiance.jpg", url: "https://gmobfaso.com/assets/img/a-propos/a-propos-6.jpg", folder: "APropos" },
  // Galerie
  { filename: "Galerie_1.jpg", url: "https://gmobfaso.com/assets/img/a-propos/a-propos-1.jpg", folder: "Galerie" },
  { filename: "Galerie_2.jpg", url: "https://gmobfaso.com/assets/img/a-propos/a-propos-2.jpg", folder: "Galerie" },
  { filename: "Galerie_3.jpg", url: "https://gmobfaso.com/assets/img/a-propos/a-propos-3.jpg", folder: "Galerie" },
  { filename: "Galerie_4.jpg", url: "https://gmobfaso.com/assets/img/a-propos/a-propos-4.jpg", folder: "Galerie" },
  { filename: "Galerie_5.jpg", url: "https://gmobfaso.com/assets/img/a-propos/a-propos-5.jpg", folder: "Galerie" },
  { filename: "Galerie_6.jpg", url: "https://gmobfaso.com/assets/img/a-propos/a-propos-6.jpg", folder: "Galerie" },
  // Équipe
  { filename: "Responsable_Commercial.jpg", url: "https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/7966bc145_a-propos-3.jpg", folder: "Equipe" },
  { filename: "Responsable_Ventes.jpg", url: "https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/50ca5b66a_Capturedcran2026-05-2511424PM.png", folder: "Equipe" },
  { filename: "Direction_Generale.jpg", url: "https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/1a0a79b3c_Gemini_Generated_Image_b8kbkwb8kbkwb8kb.png", folder: "Equipe" },
  // Logos marques
  { filename: "Logo_GMO.png", url: "https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/c7662a636_logo-gmo2x.png", folder: "Logos" },
  { filename: "Logo_SOSUCO.jpg", url: "https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/a07c14446_SN-SOSUCO_Logo.jpg", folder: "Logos" },
  { filename: "Logo_COBIFA.jpg", url: "https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/87c9905a4_df17408e-8ab1-4f74-b8df-9b78417b22b4.jpeg", folder: "Logos" },
  { filename: "Logo_Imperial_Tobacco.png", url: "https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/1336cac69_IMG_0553.png", folder: "Logos" },
  { filename: "Logo_SN_CITEC.jpg", url: "https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/5455769ac_Logo-2025-taille-normale-300x91.jpg", folder: "Logos" },
  { filename: "Logo_GMF_Etalon.jpg", url: "https://media.base44.com/images/public/69f7094dfbc2429a621ef8cd/ff5444a02_gmb.jpg", folder: "Logos" },
];

async function createDriveFolder(name, parentId, authHeader) {
  const meta = { name, mimeType: "application/vnd.google-apps.folder", ...(parentId ? { parents: [parentId] } : {}) };
  const res = await fetch("https://www.googleapis.com/drive/v3/files", {
    method: "POST",
    headers: { ...authHeader, "Content-Type": "application/json" },
    body: JSON.stringify(meta),
  });
  const data = await res.json();
  return data.id;
}

async function uploadFileToDrive(filename, imageUrl, folderId, authHeader) {
  // Download image
  const imgRes = await fetch(imageUrl);
  if (!imgRes.ok) return { filename, status: "skip", reason: "download_failed" };
  const imageBlob = await imgRes.arrayBuffer();
  const contentType = imgRes.headers.get("content-type") || "image/jpeg";

  // Upload via multipart
  const boundary = "gmo_boundary_" + Date.now();
  const meta = JSON.stringify({ name: filename, parents: [folderId] });
  const metaPart = `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${meta}\r\n`;
  const dataPart = `--${boundary}\r\nContent-Type: ${contentType}\r\n\r\n`;
  const endPart = `\r\n--${boundary}--`;

  const metaBytes = new TextEncoder().encode(metaPart);
  const dataPartBytes = new TextEncoder().encode(dataPart);
  const endBytes = new TextEncoder().encode(endPart);
  const imageBytes = new Uint8Array(imageBlob);

  const body = new Uint8Array(metaBytes.length + dataPartBytes.length + imageBytes.length + endBytes.length);
  body.set(metaBytes, 0);
  body.set(dataPartBytes, metaBytes.length);
  body.set(imageBytes, metaBytes.length + dataPartBytes.length);
  body.set(endBytes, metaBytes.length + dataPartBytes.length + imageBytes.length);

  const uploadRes = await fetch(
    "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
    {
      method: "POST",
      headers: { ...authHeader, "Content-Type": `multipart/related; boundary=${boundary}` },
      body: body,
    }
  );
  const result = await uploadRes.json();
  return { filename, status: uploadRes.ok ? "ok" : "error", driveId: result.id };
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || (user.role !== "admin" && user.role !== "pdg")) {
      return Response.json({ error: "Accès réservé aux administrateurs" }, { status: 403 });
    }

    // Get the overridden images from DB
    const dbImages = await base44.asServiceRole.entities.SiteImages.list();
    const dbMap = {};
    (dbImages || []).forEach(r => { if (r.image_url) dbMap[r.slot] = r.image_url; });

    // Override default URLs with custom ones from DB
    const SLOT_TO_INDEX = {
      hero_slide_1: 0, hero_slide_2: 1, hero_slide_3: 2, hero_slide_4: 3,
      about_pdg: 4, about_siege: 5, about_valeur_1: 6, about_valeur_2: 7, about_valeur_3: 8, about_valeur_4: 9,
      galerie_1: 10, galerie_2: 11, galerie_3: 12, galerie_4: 13, galerie_5: 14, galerie_6: 15,
    };
    const images = SITE_IMAGES.map((img, i) => {
      const slot = Object.keys(SLOT_TO_INDEX).find(s => SLOT_TO_INDEX[s] === i);
      return slot && dbMap[slot] ? { ...img, url: dbMap[slot] } : img;
    });

    const { accessToken } = await base44.asServiceRole.connectors.getConnection("googledrive");
    const authHeader = { Authorization: `Bearer ${accessToken}` };

    // Create root folder
    const rootId = await createDriveFolder("GMO Site Vitrine — Images", null, authHeader);

    // Create sub-folders
    const folderNames = [...new Set(images.map(i => i.folder))];
    const folderIds = {};
    for (const name of folderNames) {
      folderIds[name] = await createDriveFolder(name, rootId, authHeader);
    }

    // Upload all images
    const results = [];
    for (const img of images) {
      const result = await uploadFileToDrive(img.filename, img.url, folderIds[img.folder], authHeader);
      results.push(result);
    }

    const ok = results.filter(r => r.status === "ok").length;
    const skipped = results.filter(r => r.status === "skip").length;

    return Response.json({
      success: true,
      message: `Synchronisation terminée : ${ok} images uploadées, ${skipped} ignorées`,
      rootFolderId: rootId,
      results,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});