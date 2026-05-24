import React, { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import {
  Image, Briefcase, Users, Newspaper, Trophy, Globe,
  Plus, Trash2, Edit2, X, Loader2, Eye, Upload,
  MapPin, Calendar, ExternalLink, CheckCircle2, Archive
} from "lucide-react";

const TABS = [
  { id: "galerie",     label: "Galerie",          icon: Image,     color: "from-violet-500 to-purple-600" },
  { id: "partenaires", label: "Partenaires",       icon: Users,     color: "from-amber-500 to-orange-500" },
  { id: "news",        label: "Dernières nouvelles", icon: Newspaper, color: "from-pink-500 to-rose-600" },
  { id: "offres",      label: "Offres d'emploi",  icon: Briefcase, color: "from-blue-500 to-indigo-600" },
  { id: "fasofoot",    label: "Faso Foot",         icon: Trophy,    color: "from-green-500 to-emerald-600" },
];

// ─── Shared Modal ─────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <h4 className="font-heading text-base font-bold text-obsidian">{title}</h4>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"><X className="w-5 h-5" /></button>
        </div>
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">{label}</label>
      {children}
    </div>
  );
}

const inputCls = "w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-body text-obsidian focus:outline-none focus:border-gmo-green transition-colors";

// ─── Upload d'image (fichier OU URL) ─────────────────────────────────────────
function ImageUploadField({ value, onChange, previewClass = "w-full h-32 object-cover" }) {
  const [uploading, setUploading] = useState(false);
  const inputRef = React.useRef(null);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    onChange(file_url);
    setUploading(false);
  };

  return (
    <div className="space-y-2">
      {/* Zone de dépôt / bouton upload */}
      <div
        onClick={() => inputRef.current?.click()}
        className="relative border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-gmo-green hover:bg-green-50/30 transition-all group min-h-[80px]"
      >
        {uploading ? (
          <Loader2 className="w-6 h-6 animate-spin text-gmo-green" />
        ) : (
          <>
            <Upload className="w-5 h-5 text-gray-400 group-hover:text-gmo-green transition-colors" />
            <p className="text-xs font-body text-gray-400 group-hover:text-gmo-green text-center transition-colors">
              Cliquer pour uploader une image
            </p>
          </>
        )}
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </div>
      {/* Ou coller une URL */}
      <div className="flex items-center gap-2">
        <div className="h-px flex-1 bg-gray-100" />
        <span className="text-[10px] text-gray-400 font-body">ou URL directe</span>
        <div className="h-px flex-1 bg-gray-100" />
      </div>
      <input
        value={value || ""}
        onChange={e => onChange(e.target.value)}
        placeholder="https://..."
        className={inputCls}
      />
      {/* Aperçu */}
      {value && (
        <div className="relative">
          <img src={value} alt="aperçu" className={`${previewClass} rounded-xl border border-gray-100`} onError={e => e.target.style.display="none"} />
          <button onClick={() => onChange("")} className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 cursor-pointer">
            <X className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
}

// ─── GALERIE ─────────────────────────────────────────────────────────────────
function GalerieManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, []);
  const load = async () => {
    setLoading(true);
    const data = await base44.entities.Category.list("name", 200);
    setItems((data || []).filter(d => d.code === "GALERIE"));
    setLoading(false);
  };

  const save = async () => {
    if (!form?.name) return;
    setSaving(true);
    const payload = { name: form.name, description: form.url || "", code: "GALERIE", parent_id: form.categorie || "" };
    if (form.id) {
      await base44.entities.Category.update(form.id, payload);
      setItems(prev => prev.map(i => i.id === form.id ? { ...i, ...payload } : i));
    } else {
      const r = await base44.entities.Category.create(payload);
      setItems(prev => [r, ...prev]);
    }
    setSaving(false); setForm(null);
  };

  const del = async (id) => {
    if (!confirm("Supprimer cette photo ?")) return;
    await base44.entities.Category.delete(id);
    setItems(prev => prev.filter(i => i.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-heading text-base font-bold text-obsidian">Galerie photos</h3>
          <p className="text-[11px] text-obsidian/40 font-body">{items.length} photo(s) · affiché sur le site vitrine</p>
        </div>
        <button onClick={() => setForm({ name: "", url: "", categorie: "" })}
          className="flex items-center gap-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white text-xs font-heading font-bold px-4 py-2.5 rounded-xl shadow-md hover:opacity-90 cursor-pointer transition-all">
          <Plus className="w-3.5 h-3.5" /> Ajouter une photo
        </button>
      </div>

      {loading ? (
        <div className="py-16 flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-violet-500" /></div>
      ) : items.length === 0 ? (
        <div className="py-16 text-center border-2 border-dashed border-gray-200 rounded-2xl">
          <Image className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="font-body text-sm text-obsidian/30">Aucune photo dans la galerie</p>
          <button onClick={() => setForm({ name: "", url: "", categorie: "" })} className="mt-3 text-xs text-violet-500 font-semibold hover:underline cursor-pointer">+ Ajouter la première photo</button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {items.map(item => (
            <div key={item.id} className="group relative bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              {item.description ? (
                <img src={item.description} alt={item.name} className="w-full h-32 object-cover" onError={e => { e.target.style.display="none"; e.target.nextSibling.style.display="flex"; }} />
              ) : null}
              <div className={`w-full h-32 bg-gradient-to-br from-violet-50 to-purple-100 flex items-center justify-center ${item.description ? "hidden" : "flex"}`}>
                <Image className="w-8 h-8 text-violet-300" />
              </div>
              <div className="p-2.5">
                <p className="text-xs font-heading font-semibold text-obsidian truncate">{item.name}</p>
                {item.parent_id && <p className="text-[10px] text-obsidian/40 font-body mt-0.5">{item.parent_id}</p>}
              </div>
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => setForm({ ...item, url: item.description, categorie: item.parent_id })}
                  className="w-7 h-7 bg-white/90 backdrop-blur-sm rounded-lg shadow flex items-center justify-center cursor-pointer hover:bg-blue-50 transition-colors">
                  <Edit2 className="w-3.5 h-3.5 text-blue-500" />
                </button>
                <button onClick={() => del(item.id)}
                  className="w-7 h-7 bg-white/90 backdrop-blur-sm rounded-lg shadow flex items-center justify-center cursor-pointer hover:bg-red-50 transition-colors">
                  <Trash2 className="w-3.5 h-3.5 text-red-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {form && (
        <Modal title={form.id ? "Modifier la photo" : "Ajouter une photo"} onClose={() => setForm(null)}>
          <div className="px-6 py-5 space-y-4">
            <Field label="Titre / Légende *">
              <input value={form.name || ""} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Ex: Nos produits en entrepôt" className={inputCls} />
            </Field>
            <Field label="Image *">
              <ImageUploadField value={form.url || ""} onChange={v => setForm(f => ({ ...f, url: v }))} />
            </Field>
            <Field label="Catégorie (optionnel)">
              <input value={form.categorie || ""} onChange={e => setForm(f => ({ ...f, categorie: e.target.value }))} placeholder="Ex: Produits, Événement, Équipe..." className={inputCls} />
            </Field>
          </div>
          <div className="flex gap-3 px-6 py-4 border-t border-gray-100 flex-shrink-0">
            <button onClick={() => setForm(null)} className="flex-1 border border-gray-200 text-sm font-heading font-semibold py-2.5 rounded-xl cursor-pointer hover:bg-gray-50">Annuler</button>
            <button onClick={save} disabled={saving || !form.name}
              className="flex-1 bg-gradient-to-r from-violet-500 to-purple-600 text-white text-sm font-heading font-bold py-2.5 rounded-xl cursor-pointer disabled:opacity-50 hover:opacity-90">
              {saving ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Enregistrer"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── PARTENAIRES ─────────────────────────────────────────────────────────────
function PartenairesManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, []);
  const load = async () => {
    setLoading(true);
    const data = await base44.entities.Category.list("name", 200);
    setItems((data || []).filter(d => d.code === "PARTENAIRE"));
    setLoading(false);
  };

  const save = async () => {
    if (!form?.name) return;
    setSaving(true);
    const payload = { name: form.name, description: form.logo_url || "", code: "PARTENAIRE", parent_id: form.website || "", is_active: true };
    if (form.id) {
      await base44.entities.Category.update(form.id, payload);
      setItems(prev => prev.map(i => i.id === form.id ? { ...i, ...payload } : i));
    } else {
      const r = await base44.entities.Category.create(payload);
      setItems(prev => [...prev, r]);
    }
    setSaving(false); setForm(null);
  };

  const del = async (id) => {
    if (!confirm("Supprimer ce partenaire ?")) return;
    await base44.entities.Category.delete(id);
    setItems(prev => prev.filter(i => i.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-heading text-base font-bold text-obsidian">Partenaires</h3>
          <p className="text-[11px] text-obsidian/40 font-body">{items.length} partenaire(s) · logos affichés sur la page d'accueil</p>
        </div>
        <button onClick={() => setForm({ name: "", logo_url: "", website: "" })}
          className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-heading font-bold px-4 py-2.5 rounded-xl shadow-md hover:opacity-90 cursor-pointer">
          <Plus className="w-3.5 h-3.5" /> Ajouter un partenaire
        </button>
      </div>

      {loading ? (
        <div className="py-16 flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-amber-500" /></div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {items.map(item => (
            <div key={item.id} className="group relative bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow flex flex-col items-center gap-2">
              {item.description ? (
                <img src={item.description} alt={item.name} className="h-12 w-auto max-w-full object-contain" onError={e => e.target.style.display="none"} />
              ) : (
                <div className="h-12 w-24 bg-amber-50 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-amber-300" />
                </div>
              )}
              <p className="text-xs font-heading font-bold text-obsidian text-center">{item.name}</p>
              {item.parent_id && (
                <a href={item.parent_id} target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-500 flex items-center gap-1 font-body hover:underline">
                  <ExternalLink className="w-2.5 h-2.5" /> Site web
                </a>
              )}
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => setForm({ ...item, logo_url: item.description, website: item.parent_id })}
                  className="w-6 h-6 bg-white/90 rounded-lg shadow flex items-center justify-center cursor-pointer"><Edit2 className="w-3 h-3 text-blue-500" /></button>
                <button onClick={() => del(item.id)}
                  className="w-6 h-6 bg-white/90 rounded-lg shadow flex items-center justify-center cursor-pointer"><Trash2 className="w-3 h-3 text-red-500" /></button>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div className="col-span-4 py-12 text-center border-2 border-dashed border-gray-200 rounded-2xl">
              <Users className="w-10 h-10 text-gray-200 mx-auto mb-3" />
              <p className="font-body text-sm text-obsidian/30">Aucun partenaire ajouté</p>
            </div>
          )}
        </div>
      )}

      {form && (
        <Modal title={form.id ? "Modifier le partenaire" : "Ajouter un partenaire"} onClose={() => setForm(null)}>
          <div className="px-6 py-5 space-y-4">
            <Field label="Nom du partenaire *">
              <input value={form.name || ""} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Ex: SN CITEC, COBIFA..." className={inputCls} />
            </Field>
            <Field label="Logo">
              <ImageUploadField value={form.logo_url || ""} onChange={v => setForm(f => ({ ...f, logo_url: v }))} previewClass="h-20 object-contain" />
            </Field>
            <Field label="Site web (optionnel)">
              <input value={form.website || ""} onChange={e => setForm(f => ({ ...f, website: e.target.value }))} placeholder="https://www.partenaire.com" className={inputCls} />
            </Field>
          </div>
          <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
            <button onClick={() => setForm(null)} className="flex-1 border border-gray-200 text-sm font-heading font-semibold py-2.5 rounded-xl cursor-pointer hover:bg-gray-50">Annuler</button>
            <button onClick={save} disabled={saving || !form.name}
              className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-heading font-bold py-2.5 rounded-xl cursor-pointer disabled:opacity-50 hover:opacity-90">
              {saving ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Enregistrer"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── ACTUALITÉS / NEWS ───────────────────────────────────────────────────────
function NewsManager({ type = "actualite", color = "from-pink-500 to-rose-600", label = "Actualités" }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, []);
  const load = async () => {
    setLoading(true);
    const data = await base44.entities.Category.list("-created_date", 200);
    setItems((data || []).filter(d => d.code === type));
    setLoading(false);
  };

  const save = async () => {
    if (!form?.name) return;
    setSaving(true);
    const payload = {
      name: form.name,
      description: form.content || "",
      code: type,
      parent_id: form.image_url || "",
      is_active: form.published !== false,
    };
    if (form.id) {
      await base44.entities.Category.update(form.id, payload);
      setItems(prev => prev.map(i => i.id === form.id ? { ...i, ...payload } : i));
    } else {
      const r = await base44.entities.Category.create(payload);
      setItems(prev => [r, ...prev]);
    }
    setSaving(false); setForm(null);
  };

  const del = async (id) => {
    if (!confirm("Supprimer cet article ?")) return;
    await base44.entities.Category.delete(id);
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const toggle = async (item) => {
    await base44.entities.Category.update(item.id, { is_active: !item.is_active });
    setItems(prev => prev.map(i => i.id === item.id ? { ...i, is_active: !i.is_active } : i));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-heading text-base font-bold text-obsidian">{label}</h3>
          <p className="text-[11px] text-obsidian/40 font-body">{items.length} article(s)</p>
        </div>
        <button onClick={() => setForm({ name: "", content: "", image_url: "", published: true })}
          className={`flex items-center gap-2 bg-gradient-to-r ${color} text-white text-xs font-heading font-bold px-4 py-2.5 rounded-xl shadow-md hover:opacity-90 cursor-pointer`}>
          <Plus className="w-3.5 h-3.5" /> Nouvel article
        </button>
      </div>

      {loading ? (
        <div className="py-16 flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-pink-500" /></div>
      ) : items.length === 0 ? (
        <div className="py-12 text-center border-2 border-dashed border-gray-200 rounded-2xl">
          <Newspaper className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="font-body text-sm text-obsidian/30">Aucun article publié</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map(item => (
            <div key={item.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex gap-0 hover:shadow-md transition-shadow">
              {item.parent_id && (
                <img src={item.parent_id} alt="" className="w-24 h-24 object-cover flex-shrink-0" onError={e => e.target.style.display="none"} />
              )}
              <div className="flex-1 p-4 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-heading text-sm font-bold text-obsidian truncate">{item.name}</p>
                    <p className="font-body text-xs text-obsidian/50 mt-0.5 line-clamp-2">{item.description}</p>
                    <p className="font-body text-[10px] text-obsidian/30 mt-1.5 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {new Date(item.created_date).toLocaleDateString("fr-FR")}
                      <span className={`ml-2 px-2 py-0.5 rounded-full text-[9px] font-bold ${item.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {item.is_active ? "Publié" : "Archivé"}
                      </span>
                    </p>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <button onClick={() => toggle(item)} title={item.is_active ? "Archiver" : "Publier"}
                      className="p-1.5 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors">
                      {item.is_active ? <Archive className="w-3.5 h-3.5 text-gray-400" /> : <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />}
                    </button>
                    <button onClick={() => setForm({ ...item, content: item.description, image_url: item.parent_id, published: item.is_active })}
                      className="p-1.5 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors"><Edit2 className="w-3.5 h-3.5 text-blue-400" /></button>
                    <button onClick={() => del(item.id)}
                      className="p-1.5 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"><Trash2 className="w-3.5 h-3.5 text-red-400" /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {form && (
        <Modal title={form.id ? "Modifier l'article" : "Nouvel article"} onClose={() => setForm(null)}>
          <div className="px-6 py-5 space-y-4">
            <Field label="Titre *">
              <input value={form.name || ""} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Titre de l'article…" className={inputCls} />
            </Field>
            <Field label="Contenu / Description">
              <textarea value={form.content || ""} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} rows={5}
                placeholder="Contenu de l'article…" className={`${inputCls} resize-none`} />
            </Field>
            <Field label="Image">
              <ImageUploadField value={form.image_url || ""} onChange={v => setForm(f => ({ ...f, image_url: v }))} />
            </Field>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <input type="checkbox" id="published" checked={form.published !== false} onChange={e => setForm(f => ({ ...f, published: e.target.checked }))} className="w-4 h-4 accent-gmo-green cursor-pointer" />
              <label htmlFor="published" className="text-sm font-body text-obsidian/70 cursor-pointer">Publier immédiatement sur le site</label>
            </div>
          </div>
          <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
            <button onClick={() => setForm(null)} className="flex-1 border border-gray-200 text-sm font-heading font-semibold py-2.5 rounded-xl cursor-pointer hover:bg-gray-50">Annuler</button>
            <button onClick={save} disabled={saving || !form.name}
              className={`flex-1 bg-gradient-to-r ${color} text-white text-sm font-heading font-bold py-2.5 rounded-xl cursor-pointer disabled:opacity-50 hover:opacity-90`}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Publier"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── OFFRES D'EMPLOI ─────────────────────────────────────────────────────────
function OffresManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, []);
  const load = async () => {
    setLoading(true);
    const data = await base44.entities.Category.list("-created_date", 200);
    setItems((data || []).filter(d => d.code === "OFFRE_EMPLOI"));
    setLoading(false);
  };

  const save = async () => {
    if (!form?.name) return;
    setSaving(true);
    const payload = {
      name: form.name,
      description: JSON.stringify({
        description: form.description || "",
        location: form.location || "Ouagadougou, BF",
        contract: form.contract || "CDI",
        department: form.department || "",
        skills: form.skills || "",
        urgent: form.urgent || false,
      }),
      code: "OFFRE_EMPLOI",
      parent_id: form.deadline || "",
      is_active: form.is_active !== false,
    };
    if (form.id) {
      await base44.entities.Category.update(form.id, payload);
      setItems(prev => prev.map(i => i.id === form.id ? { ...i, ...payload } : i));
    } else {
      const r = await base44.entities.Category.create(payload);
      setItems(prev => [r, ...prev]);
    }
    setSaving(false); setForm(null);
  };

  const del = async (id) => {
    if (!confirm("Supprimer cette offre ?")) return;
    await base44.entities.Category.delete(id);
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const toggle = async (item) => {
    await base44.entities.Category.update(item.id, { is_active: !item.is_active });
    setItems(prev => prev.map(i => i.id === item.id ? { ...i, is_active: !i.is_active } : i));
  };

  const parseData = (item) => {
    try { return JSON.parse(item.description); } catch { return {}; }
  };

  const CONTRACT_COLORS = { CDI: "bg-green-100 text-green-700", CDD: "bg-blue-100 text-blue-700", Stage: "bg-amber-100 text-amber-700", Consultant: "bg-purple-100 text-purple-700" };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-heading text-base font-bold text-obsidian">Offres d'emploi</h3>
          <p className="text-[11px] text-obsidian/40 font-body">{items.filter(i => i.is_active).length} actives · {items.length} total · Les candidats postulent via la page Carrières</p>
        </div>
        <button onClick={() => setForm({ name: "", description: "", location: "Ouagadougou, BF", contract: "CDI", department: "", skills: "", urgent: false, deadline: "", is_active: true })}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs font-heading font-bold px-4 py-2.5 rounded-xl shadow-md hover:opacity-90 cursor-pointer">
          <Plus className="w-3.5 h-3.5" /> Nouvelle offre
        </button>
      </div>

      {loading ? (
        <div className="py-16 flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-blue-500" /></div>
      ) : items.length === 0 ? (
        <div className="py-12 text-center border-2 border-dashed border-gray-200 rounded-2xl">
          <Briefcase className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="font-body text-sm text-obsidian/30">Aucune offre d'emploi publiée</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {["Poste", "Département", "Lieu", "Contrat", "Échéance", "Statut", "Actions"].map(h => (
                  <th key={h} className="text-left px-4 py-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider first:pl-5">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {items.map(item => {
                const d = parseData(item);
                return (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <p className="font-heading text-sm font-bold text-obsidian">{item.name}</p>
                        {d.urgent && <span className="text-[9px] bg-red-100 text-red-600 font-bold px-1.5 py-0.5 rounded-full uppercase">Urgent</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs font-body text-obsidian/60">{d.department || "—"}</td>
                    <td className="px-4 py-3 text-xs font-body text-obsidian/50 flex items-center gap-1"><MapPin className="w-3 h-3" />{d.location || "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${CONTRACT_COLORS[d.contract] || "bg-gray-100 text-gray-500"}`}>{d.contract || "—"}</span>
                    </td>
                    <td className="px-4 py-3 text-xs font-body text-obsidian/50">{item.parent_id || "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {item.is_active ? "Active" : "Archivée"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button onClick={() => toggle(item)} title={item.is_active ? "Archiver" : "Activer"}
                          className="p-1.5 hover:bg-gray-100 rounded-lg cursor-pointer"><Archive className="w-3.5 h-3.5 text-gray-400" /></button>
                        <button onClick={() => setForm({ ...item, ...d, deadline: item.parent_id, is_active: item.is_active })}
                          className="p-1.5 hover:bg-blue-50 rounded-lg cursor-pointer"><Edit2 className="w-3.5 h-3.5 text-blue-400" /></button>
                        <button onClick={() => del(item.id)}
                          className="p-1.5 hover:bg-red-50 rounded-lg cursor-pointer"><Trash2 className="w-3.5 h-3.5 text-red-400" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {form && (
        <Modal title={form.id ? "Modifier l'offre" : "Nouvelle offre d'emploi"} onClose={() => setForm(null)}>
          <div className="px-6 py-5 space-y-4">
            <Field label="Intitulé du poste *">
              <input value={form.name || ""} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Ex: Commercial Terrain" className={inputCls} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Département">
                <input value={form.department || ""} onChange={e => setForm(f => ({ ...f, department: e.target.value }))} placeholder="Ex: Ventes" className={inputCls} />
              </Field>
              <Field label="Type de contrat">
                <select value={form.contract || "CDI"} onChange={e => setForm(f => ({ ...f, contract: e.target.value }))} className={inputCls}>
                  {["CDI","CDD","Stage","Consultant"].map(c => <option key={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Lieu">
                <input value={form.location || ""} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} className={inputCls} />
              </Field>
              <Field label="Date limite de candidature">
                <input type="date" value={form.deadline || ""} onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))} className={inputCls} />
              </Field>
            </div>
            <Field label="Description du poste">
              <textarea value={form.description || ""} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={4} className={`${inputCls} resize-none`} placeholder="Missions, responsabilités…" />
            </Field>
            <Field label="Compétences requises (séparées par des virgules)">
              <input value={form.skills || ""} onChange={e => setForm(f => ({ ...f, skills: e.target.value }))} placeholder="Ex: Permis B, Excel, Rigueur" className={inputCls} />
            </Field>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.urgent || false} onChange={e => setForm(f => ({ ...f, urgent: e.target.checked }))} className="w-4 h-4 accent-red-500" />
                <span className="text-sm font-body text-obsidian/70">Marquer comme urgent</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.is_active !== false} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} className="w-4 h-4 accent-gmo-green" />
                <span className="text-sm font-body text-obsidian/70">Publier sur le site</span>
              </label>
            </div>
          </div>
          <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
            <button onClick={() => setForm(null)} className="flex-1 border border-gray-200 text-sm font-heading font-semibold py-2.5 rounded-xl cursor-pointer hover:bg-gray-50">Annuler</button>
            <button onClick={save} disabled={saving || !form.name}
              className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-heading font-bold py-2.5 rounded-xl cursor-pointer disabled:opacity-50 hover:opacity-90">
              {saving ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Publier l'offre"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function SiteVitrineTab() {
  const [activeTab, setActiveTab] = useState("galerie");
  const currentTab = TABS.find(t => t.id === activeTab);

  return (
    <div className="space-y-5 animate-fade-up">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg flex-shrink-0">
          <Globe className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="font-heading text-2xl font-bold text-obsidian">Site Vitrine</h1>
          <p className="text-xs text-obsidian/40 font-body mt-0.5">Gérez le contenu dynamique affiché sur le site public GMO Burkina</p>
        </div>
      </div>

      {/* Tab selector */}
      <div className="grid grid-cols-5 gap-2">
        {TABS.map(t => {
          const Icon = t.icon;
          return (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`rounded-xl p-3.5 text-center cursor-pointer transition-all ${activeTab === t.id
                ? `bg-gradient-to-br ${t.color} text-white shadow-lg -translate-y-0.5`
                : "bg-white border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5"}`}>
              <Icon className={`w-5 h-5 mx-auto mb-1.5 ${activeTab === t.id ? "text-white" : "text-obsidian/40"}`} />
              <p className={`text-[11px] font-heading font-semibold leading-tight ${activeTab === t.id ? "text-white" : "text-obsidian/60"}`}>{t.label}</p>
            </button>
          );
        })}
      </div>

      {/* Content panel */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r ${currentTab?.color} text-white text-xs font-heading font-bold mb-5`}>
          {currentTab && <currentTab.icon className="w-3.5 h-3.5" />}
          {currentTab?.label}
        </div>

        {activeTab === "galerie"     && <GalerieManager />}
        {activeTab === "partenaires" && <PartenairesManager />}
        {activeTab === "news"        && <NewsManager type="actualite" color="from-pink-500 to-rose-600" label="Dernières nouvelles" />}
        {activeTab === "offres"      && <OffresManager />}
        {activeTab === "fasofoot"    && <NewsManager type="faso_foot" color="from-green-500 to-emerald-600" label="Faso Foot" />}
      </div>
    </div>
  );
}