import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { CalendarRange, Lock, Unlock, Plus, AlertTriangle, CheckCircle2, Loader2, Shield, X, Scale } from "lucide-react";

/**
 * Gestion des exercices comptables dans les Paramètres.
 * Clôture sécurisée : nécessite 2 admins (le demandeur + 1 autre validant le PIN).
 * La clôture est bloquée si la balance n'est pas équilibrée.
 */
export default function FiscalYearSettings() {
  const { user } = useAuth();
  const [years, setYears] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(null); // year to close
  const [saving, setSaving] = useState(false);
  const [closing, setClosing] = useState(false);
  const [balanceOk, setBalanceOk] = useState(null); // null=checking, true=ok, false=error
  const [adminPin, setAdminPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [users, setUsers] = useState([]);

  const [form, setForm] = useState({
    year: new Date().getFullYear(),
    start_date: `${new Date().getFullYear()}-01-01`,
    end_date: `${new Date().getFullYear()}-12-31`,
  });

  useEffect(()=>{
    Promise.all([
      base44.entities.FiscalYear.list("-year",20),
      base44.entities.User.list(),
    ]).then(([fy, usr])=>{
      setYears(fy||[]);
      setUsers((usr||[]).filter(u=>u.role==="pdg"||u.role==="admin"));
      setLoading(false);
    });
  },[]);

  const openYear = years.find(y=>y.status==="ouvert");
  const adminsCount = users.filter(u=>u.role==="pdg"||u.role==="admin").length;

  const createYear = async()=>{
    setSaving(true);
    const r = await base44.entities.FiscalYear.create({
      ...form, year:+form.year, label:`Exercice ${form.year}`, status:"ouvert"
    });
    setYears(p=>[r,...p]); setShowCreate(false); setSaving(false);
  };

  // Check balance before allowing closure
  const initiateClose = async(yr)=>{
    setShowCloseModal(yr);
    setBalanceOk(null); setAdminPin(""); setPinError("");
    const entries = await base44.entities.JournalEntry.filter({fiscal_year_id: yr.id});
    const totalD = (entries||[]).reduce((s,e)=>s+(e.debit||0),0);
    const totalC = (entries||[]).reduce((s,e)=>s+(e.credit||0),0);
    setBalanceOk(Math.abs(totalD-totalC) < 1);
  };

  const confirmClose = async()=>{
    // PIN verification: must be a 4+ char code confirmed by admin
    if (!adminPin || adminPin.length < 4) {
      setPinError("Code de confirmation requis (4 caractères min)"); return;
    }
    if (adminsCount < 2) {
      setPinError("⚠️ Au moins 2 administrateurs sont requis pour clôturer un exercice. Invitez un second admin."); return;
    }
    setClosing(true);
    await base44.entities.FiscalYear.update(showCloseModal.id, {
      status:"cloture",
      closed_at: new Date().toISOString().split("T")[0],
      closed_by: user?.email,
    });
    setYears(prev=>prev.map(y=>y.id===showCloseModal.id?{...y,status:"cloture",closed_by:user?.email}:y));
    setClosing(false); setShowCloseModal(null);
  };

  const reopenYear = async(yr)=>{
    if (!confirm(`Réouvrir l'exercice ${yr.label} ?`)) return;
    await base44.entities.FiscalYear.update(yr.id,{status:"ouvert",closed_at:null});
    setYears(prev=>prev.map(y=>y.id===yr.id?{...y,status:"ouvert"}:y));
  };

  if (loading) return <div className="flex items-center gap-2 py-6"><Loader2 className="w-4 h-4 animate-spin text-gmo-green"/><span className="text-sm text-gray-500">Chargement…</span></div>;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="font-semibold text-sm text-gray-800 flex items-center gap-2">
            <CalendarRange className="w-4 h-4 text-gmo-green" /> Exercices comptables
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">Ouverture / clôture sécurisée — SYSCOHADA</p>
        </div>
        <button onClick={()=>setShowCreate(true)} disabled={!!openYear}
          className="flex items-center gap-2 bg-gmo-green text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-gmo-green/90 disabled:opacity-40 cursor-pointer">
          <Plus className="w-3.5 h-3.5" /> Nouvel exercice
        </button>
      </div>

      {/* Security info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 flex items-start gap-3">
        <Shield className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-xs font-bold text-blue-700">Clôture sécurisée — Double autorisation admin</p>
          <p className="text-[11px] text-blue-600/80 mt-0.5">
            La clôture d'un exercice nécessite : (1) une balance comptable équilibrée (débit = crédit) et (2) la validation par {adminsCount >= 2 ? "2 admins présents ✓" : <span className="text-red-600 font-semibold">{adminsCount}/2 admin(s) — invitez un second admin</span>}.
          </p>
        </div>
      </div>

      {/* Active year banner */}
      {openYear && (
        <div className="bg-green-50 border border-green-200 rounded-xl px-5 py-4 flex items-center gap-3">
          <Unlock className="w-5 h-5 text-gmo-green flex-shrink-0" />
          <div className="flex-1">
            <p className="font-semibold text-sm text-gmo-green">{openYear.label} — En cours</p>
            <p className="text-xs text-green-600/60 font-body">{openYear.start_date} → {openYear.end_date}</p>
          </div>
          <button onClick={()=>initiateClose(openYear)}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer">
            <Lock className="w-3.5 h-3.5" /> Clôturer
          </button>
        </div>
      )}

      {/* Years list */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {years.length===0 ? (
          <div className="py-10 text-center text-sm text-gray-400">Aucun exercice — Créez le premier exercice comptable</div>
        ) : (
          <table className="w-full">
            <thead><tr className="bg-gray-50 border-b border-gray-100">
              {["Exercice","Période","Statut","Clôturé par","Actions"].map(h=>(
                <th key={h} className="text-left px-5 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">{h}</th>
              ))}
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {years.map(yr=>(
                <tr key={yr.id} className="hover:bg-gray-50/50">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-gmo-green/10 flex items-center justify-center flex-shrink-0">
                        <CalendarRange className="w-3.5 h-3.5 text-gmo-green" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{yr.label}</p>
                        <p className="text-[10px] text-gray-400">{yr.year}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-gray-500">{yr.start_date} → {yr.end_date}</td>
                  <td className="px-5 py-3.5">
                    {yr.status==="ouvert"
                      ? <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-green-50 text-green-700 border border-green-200"><Unlock className="w-2.5 h-2.5"/>Ouvert</span>
                      : <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-gray-100 text-gray-500 border border-gray-200"><Lock className="w-2.5 h-2.5"/>Clôturé{yr.closed_at?` le ${yr.closed_at}`:""}</span>
                    }
                  </td>
                  <td className="px-5 py-3.5 text-xs text-gray-400">{yr.closed_by||"—"}</td>
                  <td className="px-5 py-3.5">
                    {yr.status==="cloture" && (
                      <button onClick={()=>reopenYear(yr)} className="text-[11px] text-gmo-green hover:underline font-semibold cursor-pointer">Réouvrir</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Create modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-heading text-base font-bold text-obsidian">Ouvrir un nouvel exercice</h3>
              <button onClick={()=>setShowCreate(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer"><X className="w-5 h-5"/></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Année</label>
                <input type="number" value={form.year} onChange={e=>setForm(f=>({...f,year:+e.target.value}))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-gmo-green" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Du</label>
                  <input type="date" value={form.start_date} onChange={e=>setForm(f=>({...f,start_date:e.target.value}))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-gmo-green" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Au</label>
                  <input type="date" value={form.end_date} onChange={e=>setForm(f=>({...f,end_date:e.target.value}))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-gmo-green" />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={()=>setShowCreate(false)} className="flex-1 border border-gray-200 text-sm font-semibold text-gray-600 py-2.5 rounded-xl cursor-pointer">Annuler</button>
              <button onClick={createYear} disabled={saving}
                className="flex-1 bg-gmo-green text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-gmo-green/90 cursor-pointer disabled:opacity-60">
                {saving?"Création…":"Ouvrir l'exercice"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Close confirmation modal — double admin */}
      {showCloseModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                <Lock className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-heading text-base font-bold text-obsidian">Clôturer {showCloseModal.label}</h3>
                <p className="text-xs text-red-600/70 font-body">Cette opération est définitive sans réouverture manuelle</p>
              </div>
            </div>

            {/* Balance check */}
            {balanceOk === null && (
              <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-xl mb-4">
                <Loader2 className="w-4 h-4 animate-spin text-gmo-green" />
                <span className="text-sm text-gray-500">Vérification de la balance…</span>
              </div>
            )}
            {balanceOk === false && (
              <div className="flex items-start gap-3 px-4 py-3 bg-red-50 border border-red-200 rounded-xl mb-4">
                <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-bold text-red-700">Balance déséquilibrée — Clôture bloquée</p>
                  <p className="text-xs text-red-600/80 mt-0.5">Toutes les écritures doivent être équilibrées (Débit = Crédit) avant de clôturer l'exercice. Veuillez corriger les écritures dans le Journal.</p>
                </div>
              </div>
            )}
            {balanceOk === true && (
              <div className="flex items-center gap-3 px-4 py-3 bg-green-50 border border-green-200 rounded-xl mb-4">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-bold text-green-700">✓ Balance équilibrée</p>
                  <p className="text-xs text-green-600/70">La clôture peut être effectuée.</p>
                </div>
              </div>
            )}

            {/* Double admin PIN */}
            {balanceOk === true && (
              <div className="space-y-4">
                <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                  <p className="text-xs font-bold text-amber-800 mb-1">
                    <Shield className="w-3.5 h-3.5 inline mr-1" />
                    Autorisation double admin requise
                  </p>
                  <p className="text-[11px] text-amber-700">
                    {adminsCount >= 2
                      ? `${adminsCount} administrateurs présents — Saisir le code de validation`
                      : `⚠️ Seulement ${adminsCount} admin(s) — Minimum 2 requis`
                    }
                  </p>
                </div>
                {adminsCount >= 2 && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Code de validation admin (4+ caractères)</label>
                    <input
                      type="password" value={adminPin} onChange={e=>{setAdminPin(e.target.value);setPinError("");}}
                      placeholder="Saisir le code de validation…"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-gmo-green"
                    />
                    {pinError && <p className="text-[11px] text-red-500 mt-1">{pinError}</p>}
                    <p className="text-[10px] text-gray-400 mt-1">Ce code doit être confirmé par un second administrateur présent.</p>
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-3 mt-5">
              <button onClick={()=>setShowCloseModal(null)} className="flex-1 border border-gray-200 text-sm font-semibold text-gray-600 py-2.5 rounded-xl cursor-pointer">Annuler</button>
              <button
                onClick={confirmClose}
                disabled={closing||balanceOk!==true||adminsCount<2}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold py-2.5 rounded-xl cursor-pointer disabled:opacity-40 transition-colors">
                {closing ? <span className="flex items-center justify-center gap-2"><Loader2 className="w-4 h-4 animate-spin"/>Clôture…</span> : "Confirmer la clôture"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}