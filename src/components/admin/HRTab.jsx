import React, { useState, useEffect, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import {
  Users, UserCheck, UserX, Plus, Search, Download, Calendar,
  ChevronRight, AlertTriangle, CheckCircle2, Clock, TrendingUp,
  FileText, Briefcase, Award, DollarSign, Loader2, X, Edit2,
  Shield, BookOpen, BarChart2, RefreshCw
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

// ── Burkina Faso Labour Law constants ──
const SMIG_BF = 34664; // SMIG mensuel en FCFA (Burkina Faso 2024)
const CNSS_EMPLOYE_RATE = 0.055; // 5.5% salarié
const CNSS_EMPLOYER_RATE = 0.16; // 16% employeur
const CONGE_ANNUEL_DAYS = 30; // 2.5j/mois × 12

// ITS (Impôt sur les Traitements et Salaires) - Burkina Faso barème progressif
function calcITS(revenuImposable) {
  if (revenuImposable <= 15000) return 0;
  if (revenuImposable <= 30000) return revenuImposable * 0.10;
  if (revenuImposable <= 50000) return revenuImposable * 0.15;
  if (revenuImposable <= 80000) return revenuImposable * 0.20;
  if (revenuImposable <= 120000) return revenuImposable * 0.25;
  return revenuImposable * 0.30;
}

function calcPayslip(salary) {
  const brut = salary || 0;
  const cnssEmp = Math.round(brut * CNSS_EMPLOYE_RATE);
  const revenuImposable = brut - cnssEmp;
  const its = Math.round(calcITS(revenuImposable));
  const net = brut - cnssEmp - its;
  const cnssEmployer = Math.round(brut * CNSS_EMPLOYER_RATE);
  return { brut, cnssEmp, its, net, cnssEmployer };
}

const CONTRACT_COLORS = { CDI:"bg-green-100 text-green-700", CDD:"bg-blue-100 text-blue-700", Stage:"bg-amber-100 text-amber-700", Consultant:"bg-purple-100 text-purple-700" };
const STATUS_COLORS = { actif:"bg-green-100 text-green-700", conge:"bg-amber-100 text-amber-700", inactif:"bg-red-100 text-red-600" };
const LEAVE_TYPES = [
  { value:"conge_annuel", label:"Congé annuel" },
  { value:"conge_maladie", label:"Congé maladie" },
  { value:"conge_maternite", label:"Congé maternité (98 jours légaux BF)" },
  { value:"conge_paternite", label:"Congé paternité (3 jours légaux BF)" },
  { value:"conge_sans_solde", label:"Congé sans solde" },
  { value:"conge_exceptionnel", label:"Congé exceptionnel" },
  { value:"rtt", label:"Récupération" },
];

// ── Sub-components ──
function KpiCard({ icon: Icon, label, value, sub, color = "text-obsidian", bg = "bg-gray-50", onClick }) {
  return (
    <button onClick={onClick} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-left hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer w-full">
      <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center mb-3`}>
        <Icon className={`w-4 h-4 ${color}`} />
      </div>
      <p className={`font-heading text-xl font-bold ${color}`}>{value}</p>
      <p className="text-xs text-obsidian/60 font-body mt-0.5">{label}</p>
      {sub && <p className="text-[10px] text-obsidian/30 font-body mt-0.5">{sub}</p>}
    </button>
  );
}

function SectionHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
      <div>
        <h3 className="font-heading text-base font-bold text-obsidian">{title}</h3>
        {subtitle && <p className="text-xs text-obsidian/40 font-body mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

// ── Employee Form ──
function EmployeeForm({ emp, onSave, onClose }) {
  const [form, setForm] = useState(emp || {
    first_name:"", last_name:"", email:"", phone:"", position:"", department:"",
    contract_type:"CDI", hire_date:"", salary: SMIG_BF, status:"actif",
    cnss_number:"", address:"", emergency_contact:"", birth_date:"", nationality:"Burkinabè"
  });
  const [saving, setSaving] = useState(false);
  const s = k => v => setForm(f=>({...f,[k]:v}));
  const payslip = calcPayslip(+form.salary||0);

  const save = async () => {
    if (!form.first_name||!form.last_name) return;
    setSaving(true);
    await onSave({...form, salary:+form.salary||0});
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center">
            <Users className="w-4 h-4 text-purple-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-heading text-base font-bold text-obsidian">{emp?.id ? "Modifier l'employé" : "Nouvel employé"}</h3>
            <p className="text-xs text-obsidian/40 font-body">Droit du travail — Burkina Faso</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer"><X className="w-5 h-5" /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {[
              ["Prénom *", "first_name", "text"],["Nom *", "last_name", "text"],
              ["Email professionnel", "email", "email"],["Téléphone", "phone", "text"],
              ["Poste / Fonction", "position", "text"],["Département / Service", "department", "text"],
              ["Date de naissance", "birth_date", "date"],["Nationalité", "nationality", "text"],
              ["Adresse", "address", "text"],["Contact d'urgence", "emergency_contact", "text"],
              ["N° CNSS", "cnss_number", "text"],
            ].map(([label, key, type]) => (
              <div key={key} className={key==="address"||key==="emergency_contact"?"col-span-2":""}>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">{label}</label>
                <input type={type} value={form[key]||""} onChange={e=>s(key)(e.target.value)} placeholder={label}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-gmo-green" />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Type contrat</label>
              <select value={form.contract_type} onChange={e=>s("contract_type")(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-gmo-green">
                {["CDI","CDD","Stage","Consultant"].map(t=><option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Date embauche</label>
              <input type="date" value={form.hire_date||""} onChange={e=>s("hire_date")(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-gmo-green" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Statut</label>
              <select value={form.status} onChange={e=>s("status")(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-gmo-green">
                <option value="actif">Actif</option>
                <option value="conge">En congé</option>
                <option value="inactif">Inactif</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              Salaire brut mensuel (FCFA) — SMIG légal BF : {SMIG_BF.toLocaleString()} FCFA
            </label>
            <input type="number" value={form.salary||""} onChange={e=>s("salary")(e.target.value)} min={SMIG_BF}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-gmo-green" />
            {(+form.salary||0) < SMIG_BF && (
              <p className="text-[11px] text-red-500 mt-1">⚠️ Salaire inférieur au SMIG légal BF ({SMIG_BF.toLocaleString()} FCFA)</p>
            )}
          </div>
          {/* Simulation fiche paie */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <p className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-3">Simulation fiche de paie SYSCOHADA/BF</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {[
                ["Salaire brut", payslip.brut, "text-obsidian"],
                ["CNSS salarié (5.5%)", `-${payslip.cnssEmp}`, "text-red-500"],
                ["ITS (barème BF)", `-${payslip.its}`, "text-red-500"],
                ["Salaire net", payslip.net, "text-gmo-green font-bold"],
                ["CNSS employeur (16%)", payslip.cnssEmployer, "text-amber-600"],
              ].map(([l,v,c])=>(
                <React.Fragment key={l}>
                  <span className="text-gray-500">{l}</span>
                  <span className={`text-right font-heading font-bold ${c}`}>{typeof v==="number"?v.toLocaleString():v} FCFA</span>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-3 px-6 py-4 border-t border-gray-100 flex-shrink-0">
          <button onClick={onClose} className="flex-1 border border-gray-200 text-sm font-semibold text-gray-600 py-2.5 rounded-xl hover:bg-gray-50 cursor-pointer">Annuler</button>
          <button onClick={save} disabled={saving}
            className="flex-1 bg-gmo-green text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-gmo-green/90 cursor-pointer disabled:opacity-60">
            {saving?<span className="flex items-center justify-center gap-2"><Loader2 className="w-4 h-4 animate-spin"/>Enregistrement…</span>:"Enregistrer"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Leave Form ──
function LeaveForm({ employees, onSave, onClose }) {
  const [form, setForm] = useState({ employee_id:"", employee_name:"", type:"conge_annuel", start_date:"", end_date:"", reason:"", status:"en_attente" });
  const [saving, setSaving] = useState(false);
  const s = k=>v=>setForm(f=>({...f,[k]:v}));
  const days = form.start_date && form.end_date ? Math.max(1, Math.ceil((new Date(form.end_date)-new Date(form.start_date))/(1000*60*60*24))+1) : 0;
  const emp = employees.find(e=>e.id===form.employee_id);

  const save = async () => {
    if (!form.employee_id||!form.start_date||!form.end_date) return;
    setSaving(true);
    await onSave({...form, days, employee_name: emp?`${emp.first_name} ${emp.last_name}`:""});
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-heading text-base font-bold text-obsidian">Demande de congé</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer"><X className="w-5 h-5" /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Employé *</label>
            <select value={form.employee_id} onChange={e=>{s("employee_id")(e.target.value)}}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-gmo-green">
              <option value="">Sélectionner un employé</option>
              {employees.map(e=><option key={e.id} value={e.id}>{e.first_name} {e.last_name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Type de congé</label>
            <select value={form.type} onChange={e=>s("type")(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-gmo-green">
              {LEAVE_TYPES.map(t=><option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Du *</label>
              <input type="date" value={form.start_date} onChange={e=>s("start_date")(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-gmo-green" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Au *</label>
              <input type="date" value={form.end_date} onChange={e=>s("end_date")(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-gmo-green" />
            </div>
          </div>
          {days > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-blue-700">
              {days} jour(s) de congé
              {form.type==="conge_annuel" && emp && (
                <span className="block text-xs font-normal text-blue-600/70 mt-0.5">
                  Droit légal BF : {CONGE_ANNUEL_DAYS} j/an
                </span>
              )}
            </div>
          )}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Motif</label>
            <textarea value={form.reason} onChange={e=>s("reason")(e.target.value)} rows={2} placeholder="Motif du congé…"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-gmo-green resize-none" />
          </div>
        </div>
        <div className="flex gap-3 mt-5">
          <button onClick={onClose} className="flex-1 border border-gray-200 text-sm font-semibold text-gray-600 py-2.5 rounded-xl cursor-pointer">Annuler</button>
          <button onClick={save} disabled={saving||!form.employee_id||!form.start_date||!form.end_date}
            className="flex-1 bg-gmo-green text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-gmo-green/90 cursor-pointer disabled:opacity-50">
            {saving?"…":"Soumettre"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Payslip Generator ──
function PayslipModal({ employees, onClose }) {
  const [empId, setEmpId] = useState("");
  const [month, setMonth] = useState(new Date().getMonth()+1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [saving, setSaving] = useState(false);
  const emp = employees.find(e=>e.id===empId);
  const p = emp ? calcPayslip(emp.salary||0) : null;

  const save = async () => {
    if (!emp) return;
    setSaving(true);
    await base44.entities.Payslip.create({
      employee_id: emp.id, employee_name:`${emp.first_name} ${emp.last_name}`,
      month, year, salary_base:emp.salary||0, brut:p.brut,
      cnss_employee:p.cnssEmp, its:p.its, net:p.net, cnss_employer:p.cnssEmployer,
      status:"valide"
    });
    setSaving(false);
    alert("Bulletin de paie généré !");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-heading text-base font-bold text-obsidian">Générer bulletin de paie</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer"><X className="w-5 h-5" /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Employé</label>
            <select value={empId} onChange={e=>setEmpId(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-gmo-green">
              <option value="">Sélectionner…</option>
              {employees.map(e=><option key={e.id} value={e.id}>{e.first_name} {e.last_name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Mois</label>
              <select value={month} onChange={e=>setMonth(+e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-gmo-green">
                {["Jan","Fév","Mar","Avr","Mai","Jun","Jul","Aoû","Sep","Oct","Nov","Déc"].map((m,i)=><option key={i} value={i+1}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Année</label>
              <input type="number" value={year} onChange={e=>setYear(+e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-gmo-green" />
            </div>
          </div>
          {p && (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-2">
              <p className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">Bulletin de paie — {emp.first_name} {emp.last_name}</p>
              {[
                ["Salaire brut", p.brut, ""],
                ["CNSS salarié (5.5%)", -p.cnssEmp, "text-red-500"],
                ["ITS barème BF", -p.its, "text-red-500"],
                ["", null],
                ["NET À PAYER", p.net, "text-gmo-green font-bold text-base"],
                ["", null],
                ["CNSS patronal (16%)", p.cnssEmployer, "text-amber-600"],
                ["Coût total employeur", p.brut+p.cnssEmployer, "text-obsidian font-bold"],
              ].map(([l,v,c],i)=> l ? (
                <div key={i} className={`flex justify-between text-sm ${l.includes("NET") ? "border-t border-gray-200 pt-2 mt-1" : ""}`}>
                  <span className="text-gray-500">{l}</span>
                  <span className={`font-heading font-bold ${c}`}>{typeof v==="number"?`${v.toLocaleString()} FCFA`:v}</span>
                </div>
              ) : <hr key={i} className="border-gray-200 my-1" />)}
            </div>
          )}
        </div>
        <div className="flex gap-3 mt-5">
          <button onClick={onClose} className="flex-1 border border-gray-200 text-sm font-semibold text-gray-600 py-2.5 rounded-xl cursor-pointer">Annuler</button>
          <button onClick={save} disabled={saving||!emp}
            className="flex-1 bg-gmo-green text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-gmo-green/90 cursor-pointer disabled:opacity-50">
            {saving?"Génération…":"Générer & Valider"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main HR Tab ──
const HR_TABS = [
  { id:"effectif", label:"Effectif", icon:Users },
  { id:"conges", label:"Congés", icon:Calendar },
  { id:"paie", label:"Paie & Bulletins", icon:DollarSign },
  { id:"evaluations", label:"Évaluations", icon:Award },
  { id:"conformite", label:"Conformité BF", icon:Shield },
];

export default function HRTab({ employees, setEmployees }) {
  const [activeTab, setActiveTab] = useState("effectif");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editEmp, setEditEmp] = useState(null);
  const [showLeave, setShowLeave] = useState(false);
  const [showPayslip, setShowPayslip] = useState(false);
  const [leaves, setLeaves] = useState([]);
  const [payslips, setPayslips] = useState([]);
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeTab==="conges" && leaves.length===0) base44.entities.LeaveRequest.list("-created_date",100).then(r=>setLeaves(r||[]));
    if (activeTab==="paie" && payslips.length===0) base44.entities.Payslip.list("-year",100).then(r=>setPayslips(r||[]));
    if (activeTab==="evaluations" && evaluations.length===0) base44.entities.Evaluation.list("-year",100).then(r=>setEvaluations(r||[]));
  }, [activeTab]);

  const filtered = employees.filter(e=>
    !search || `${e.first_name} ${e.last_name} ${e.position} ${e.department}`.toLowerCase().includes(search.toLowerCase())
  );

  const actif = employees.filter(e=>e.status==="actif").length;
  const masseSalariale = employees.filter(e=>e.status==="actif").reduce((s,e)=>s+(e.salary||0),0);
  const congeCount = leaves.filter(l=>l.status==="en_attente").length;
  const netTotal = employees.reduce((s,e)=>{ const p=calcPayslip(e.salary||0); return s+p.net; },0);

  const deptData = useMemo(()=>{
    const map={};
    employees.forEach(e=>{ const d=e.department||"Autre"; map[d]=(map[d]||0)+1; });
    return Object.entries(map).map(([name,value])=>({name,value}));
  },[employees]);

  const contractData = useMemo(()=>{
    const map={};
    employees.forEach(e=>{ const t=e.contract_type||"Autre"; map[t]=(map[t]||0)+1; });
    return Object.entries(map).map(([name,value])=>({name,value}));
  },[employees]);

  const COLORS = ["#6366f1","#22c55e","#f59e0b","#ec4899","#06b6d4","#f97316"];

  const saveEmp = async (data) => {
    if (editEmp?.id) {
      await base44.entities.Employee.update(editEmp.id, data);
      setEmployees(prev=>prev.map(e=>e.id===editEmp.id?{...e,...data}:e));
    } else {
      const r = await base44.entities.Employee.create(data);
      setEmployees(prev=>[r,...prev]);
    }
    setShowForm(false); setEditEmp(null);
  };

  const delEmp = async (e) => {
    if (!confirm(`Supprimer ${e.first_name} ${e.last_name} ?`)) return;
    await base44.entities.Employee.delete(e.id);
    setEmployees(prev=>prev.filter(x=>x.id!==e.id));
  };

  const updateLeave = async (id, status) => {
    await base44.entities.LeaveRequest.update(id, {status});
    setLeaves(prev=>prev.map(l=>l.id===id?{...l,status}:l));
  };

  // Compliance checks BF
  const compliance = [
    { label:"Employés sous le SMIG", ok:employees.filter(e=>(e.salary||0)<SMIG_BF&&e.status==="actif").length===0, detail:`${employees.filter(e=>(e.salary||0)<SMIG_BF&&e.status==="actif").length} employé(s) sous le SMIG de ${SMIG_BF.toLocaleString()} FCFA`, law:"Art.191 Code du Travail BF" },
    { label:"Employés sans N° CNSS", ok:employees.filter(e=>!e.cnss_number&&e.status==="actif").length===0, detail:`${employees.filter(e=>!e.cnss_number&&e.status==="actif").length} employé(s) sans CNSS`, law:"Art.4 Loi CNSS BF" },
    { label:"Contrats formalisés", ok:employees.filter(e=>!e.contract_type).length===0, detail:`${employees.filter(e=>!e.contract_type).length} employé(s) sans contrat`, law:"Art.30 Code du Travail BF" },
    { label:"Dates d'embauche renseignées", ok:employees.filter(e=>!e.hire_date&&e.status==="actif").length===0, detail:`${employees.filter(e=>!e.hire_date&&e.status==="actif").length} employé(s) sans date d'embauche`, law:"Art.51 Code du Travail BF" },
    { label:"Demandes de congé en attente", ok:congeCount===0, detail:`${congeCount} demande(s) non traitée(s)`, law:"Art.222 Code du Travail BF — 30j/an" },
  ];

  return (
    <div className="space-y-5 animate-fade-up">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <KpiCard icon={UserCheck} label="Actifs" value={actif} sub={`/${employees.length} total`} color="text-gmo-green" bg="bg-green-100" onClick={()=>setActiveTab("effectif")} />
        <KpiCard icon={DollarSign} label="Masse salariale brute" value={`${(masseSalariale/1000).toFixed(0)}k`} sub="FCFA/mois" color="text-blue-600" bg="bg-blue-100" onClick={()=>setActiveTab("paie")} />
        <KpiCard icon={DollarSign} label="Net total estimé" value={`${(netTotal/1000).toFixed(0)}k`} sub="FCFA/mois" color="text-gmo-green" bg="bg-green-100" onClick={()=>setActiveTab("paie")} />
        <KpiCard icon={Calendar} label="Congés en attente" value={congeCount} sub="à traiter" color={congeCount>0?"text-amber-600":"text-gmo-green"} bg={congeCount>0?"bg-amber-100":"bg-green-100"} onClick={()=>setActiveTab("conges")} />
        <KpiCard icon={Shield} label="Conformité BF" value={`${compliance.filter(c=>c.ok).length}/${compliance.length}`} sub="contrôles OK" color="text-purple-600" bg="bg-purple-100" onClick={()=>setActiveTab("conformite")} />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 flex-wrap bg-gray-100/60 rounded-2xl p-1">
        {HR_TABS.map(tab=>{
          const Icon=tab.icon;
          return (
            <button key={tab.id} onClick={()=>setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${activeTab===tab.id?"bg-white text-obsidian shadow-sm":"text-obsidian/50 hover:text-obsidian/80"}`}>
              <Icon className="w-3.5 h-3.5" />{tab.label}
            </button>
          );
        })}
      </div>

      {/* ── EFFECTIF ── */}
      {activeTab==="effectif" && (
        <div className="space-y-4">
          <SectionHeader title="Liste du personnel" subtitle={`${filtered.length} employé(s)`}
            action={
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Rechercher…"
                    className="pl-8 pr-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-gmo-green w-44" />
                </div>
                <button onClick={()=>{setEditEmp(null);setShowForm(true)}}
                  className="flex items-center gap-2 bg-gmo-green text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-gmo-green/90 cursor-pointer">
                  <Plus className="w-3.5 h-3.5" /> Nouvel employé
                </button>
              </div>
            }
          />
          <div className="grid lg:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <p className="text-xs font-bold text-obsidian/40 uppercase tracking-wider mb-3">Par département</p>
              <ResponsiveContainer width="100%" height={150}>
                <BarChart data={deptData} margin={{left:-20}}>
                  <XAxis dataKey="name" tick={{fontSize:10,fill:"#9ca3af"}} axisLine={false} tickLine={false} />
                  <YAxis tick={{fontSize:9,fill:"#9ca3af"}} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{fontSize:11,borderRadius:8}} />
                  <Bar dataKey="value" radius={[4,4,0,0]}>
                    {deptData.map((_, i) => <Cell key={i} fill={COLORS[i%COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <p className="text-xs font-bold text-obsidian/40 uppercase tracking-wider mb-3">Par type de contrat</p>
              <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                  <Pie data={contractData} cx="50%" cy="50%" outerRadius={55} dataKey="value" label={({name,value})=>`${name} (${value})`} labelLine={false} fontSize={10}>
                    {contractData.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{fontSize:11,borderRadius:8}} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {["Employé","Poste","Département","Contrat","Salaire brut","Net estimé","CNSS","Statut","Actions"].map(h=>(
                    <th key={h} className="text-left px-4 py-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length===0 ? (
                  <tr><td colSpan={9} className="py-10 text-center text-sm text-obsidian/30 font-body">Aucun employé</td></tr>
                ) : filtered.map(e=>{
                  const p=calcPayslip(e.salary||0);
                  const underSmig=(e.salary||0)<SMIG_BF&&e.status==="actif";
                  return (
                    <tr key={e.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{background:`hsl(${e.first_name?.charCodeAt(0)*5||200}deg 60% 55%)`}}>
                            {e.first_name?.[0]}{e.last_name?.[0]}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-obsidian">{e.first_name} {e.last_name}</p>
                            <p className="text-[10px] text-obsidian/40 font-body">{e.email||"—"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-obsidian/70">{e.position||"—"}</td>
                      <td className="px-4 py-3 text-xs text-obsidian/50">{e.department||"—"}</td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-body ${CONTRACT_COLORS[e.contract_type]||"bg-gray-100 text-gray-500"}`}>{e.contract_type||"—"}</span>
                      </td>
                      <td className={`px-4 py-3 text-xs font-bold font-heading ${underSmig?"text-red-500":"text-obsidian"}`}>
                        {(e.salary||0).toLocaleString()}
                        {underSmig && <span className="ml-1 text-[10px]">⚠️</span>}
                      </td>
                      <td className="px-4 py-3 text-xs font-bold text-gmo-green font-heading">{p.net.toLocaleString()}</td>
                      <td className="px-4 py-3 text-xs text-obsidian/50 font-body">{e.cnss_number||<span className="text-red-400">Non renseigné</span>}</td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-body ${STATUS_COLORS[e.status]||"bg-gray-100 text-gray-500"}`}>
                          {({actif:"Actif",conge:"En congé",inactif:"Inactif"})[e.status]||e.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button onClick={()=>{setEditEmp(e);setShowForm(true)}} className="p-1.5 hover:bg-gray-100 rounded-lg cursor-pointer"><Edit2 className="w-3.5 h-3.5 text-gray-400" /></button>
                          <button onClick={()=>delEmp(e)} className="p-1.5 hover:bg-red-50 rounded-lg cursor-pointer"><X className="w-3.5 h-3.5 text-red-400" /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── CONGÉS ── */}
      {activeTab==="conges" && (
        <div className="space-y-4">
          <SectionHeader title="Gestion des congés" subtitle={`Droit légal BF : ${CONGE_ANNUEL_DAYS} jours/an | Maternité : 98 jours | Paternité : 3 jours`}
            action={<button onClick={()=>setShowLeave(true)} className="flex items-center gap-2 bg-gmo-green text-white text-xs font-semibold px-4 py-2 rounded-xl cursor-pointer"><Plus className="w-3.5 h-3.5"/>Demande de congé</button>}
          />
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {["Employé","Type","Du","Au","Jours","Statut","Actions"].map(h=>(
                    <th key={h} className="text-left px-4 py-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {leaves.length===0 ? (
                  <tr><td colSpan={7} className="py-10 text-center text-sm text-obsidian/30">Aucune demande de congé</td></tr>
                ) : leaves.map(l=>{
                  const typeLabel = LEAVE_TYPES.find(t=>t.value===l.type)?.label||l.type;
                  const statusColors = {en_attente:"bg-amber-100 text-amber-700",approuve:"bg-green-100 text-green-700",refuse:"bg-red-100 text-red-600",annule:"bg-gray-100 text-gray-500"};
                  return (
                    <tr key={l.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3 text-xs font-bold text-obsidian">{l.employee_name}</td>
                      <td className="px-4 py-3 text-xs text-obsidian/60">{typeLabel}</td>
                      <td className="px-4 py-3 text-xs text-obsidian/50">{l.start_date?new Date(l.start_date).toLocaleDateString("fr-FR"):"—"}</td>
                      <td className="px-4 py-3 text-xs text-obsidian/50">{l.end_date?new Date(l.end_date).toLocaleDateString("fr-FR"):"—"}</td>
                      <td className="px-4 py-3 text-xs font-bold text-obsidian">{l.days||"—"}</td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-body ${statusColors[l.status]||"bg-gray-100 text-gray-500"}`}>
                          {({en_attente:"En attente",approuve:"Approuvé",refuse:"Refusé",annule:"Annulé"})[l.status]||l.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {l.status==="en_attente" && (
                          <div className="flex gap-1">
                            <button onClick={()=>updateLeave(l.id,"approuve")} className="text-[10px] px-2 py-1 bg-green-100 text-green-700 rounded-lg font-semibold hover:bg-green-200 cursor-pointer">✓</button>
                            <button onClick={()=>updateLeave(l.id,"refuse")} className="text-[10px] px-2 py-1 bg-red-100 text-red-600 rounded-lg font-semibold hover:bg-red-200 cursor-pointer">✗</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── PAIE ── */}
      {activeTab==="paie" && (
        <div className="space-y-4">
          <SectionHeader title="Bulletins de paie" subtitle="CNSS 5.5% salarié / 16% employeur — Barème ITS Burkina Faso"
            action={<button onClick={()=>setShowPayslip(true)} className="flex items-center gap-2 bg-gmo-green text-white text-xs font-semibold px-4 py-2 rounded-xl cursor-pointer"><Plus className="w-3.5 h-3.5"/>Générer bulletin</button>}
          />
          <div className="grid grid-cols-3 gap-3">
            {[
              {label:"Masse brute", val:masseSalariale, color:"text-blue-600"},
              {label:"Net total", val:netTotal, color:"text-gmo-green"},
              {label:"Charges patronales", val:Math.round(masseSalariale*CNSS_EMPLOYER_RATE), color:"text-amber-600"},
            ].map(k=>(
              <div key={k.label} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                <p className="text-[10px] text-obsidian/40 uppercase tracking-wider font-body mb-1">{k.label}</p>
                <p className={`font-heading text-lg font-bold ${k.color}`}>{k.val.toLocaleString()} FCFA</p>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {["Employé","Mois","Brut","CNSS salarié","ITS","Net","Statut"].map(h=>(
                    <th key={h} className="text-left px-4 py-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {payslips.length===0 ? (
                  <tr><td colSpan={7} className="py-10 text-center text-sm text-obsidian/30">Aucun bulletin généré</td></tr>
                ) : payslips.map(ps=>(
                  <tr key={ps.id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3 text-xs font-bold text-obsidian">{ps.employee_name}</td>
                    <td className="px-4 py-3 text-xs text-obsidian/50">{ps.month}/{ps.year}</td>
                    <td className="px-4 py-3 text-xs font-bold text-obsidian">{(ps.brut||0).toLocaleString()}</td>
                    <td className="px-4 py-3 text-xs text-red-500">-{(ps.cnss_employee||0).toLocaleString()}</td>
                    <td className="px-4 py-3 text-xs text-red-500">-{(ps.its||0).toLocaleString()}</td>
                    <td className="px-4 py-3 text-xs font-bold text-gmo-green font-heading">{(ps.net||0).toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-body ${{brouillon:"bg-gray-100 text-gray-500",valide:"bg-green-100 text-green-700",paye:"bg-blue-100 text-blue-700"}[ps.status]||""}`}>
                        {({brouillon:"Brouillon",valide:"Validé",paye:"Payé"})[ps.status]||ps.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── ÉVALUATIONS ── */}
      {activeTab==="evaluations" && (
        <div className="space-y-4">
          <SectionHeader title="Évaluations de performance" subtitle="Grilles d'évaluation annuelle" />
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {["Employé","Période","Score/20","Objectifs","Commentaire","Statut"].map(h=>(
                    <th key={h} className="text-left px-4 py-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {evaluations.length===0?(
                  <tr><td colSpan={6} className="py-10 text-center text-sm text-obsidian/30">Aucune évaluation</td></tr>
                ):evaluations.map(ev=>(
                  <tr key={ev.id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3 text-xs font-bold text-obsidian">{ev.employee_name}</td>
                    <td className="px-4 py-3 text-xs text-obsidian/50">{ev.period||ev.year}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 bg-gray-200 rounded-full">
                          <div className="h-1.5 rounded-full bg-gmo-green" style={{width:`${(ev.score/20)*100}%`}} />
                        </div>
                        <span className="text-xs font-bold text-obsidian">{ev.score}/20</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-gmo-green font-bold">{ev.objectifs_atteints}%</td>
                    <td className="px-4 py-3 text-xs text-obsidian/60 max-w-[150px] truncate">{ev.commentaire||"—"}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-body ${{brouillon:"bg-gray-100 text-gray-500",finalise:"bg-green-100 text-green-700"}[ev.status]||""}`}>
                        {({brouillon:"Brouillon",finalise:"Finalisé"})[ev.status]||ev.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── CONFORMITÉ BF ── */}
      {activeTab==="conformite" && (
        <div className="space-y-4">
          <div>
            <h3 className="font-heading text-base font-bold text-obsidian">Conformité — Droit du Travail Burkina Faso</h3>
            <p className="text-xs text-obsidian/40 font-body mt-0.5">Code du Travail BF · Loi 028-2008/AN · Décret SMIG · CNSS</p>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {compliance.map((c,i)=>(
              <div key={i} className={`flex items-start gap-4 px-5 py-4 rounded-2xl border ${c.ok?"bg-green-50 border-green-200":"bg-red-50 border-red-200"}`}>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${c.ok?"bg-green-100":"bg-red-100"}`}>
                  {c.ok ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : <AlertTriangle className="w-4 h-4 text-red-500" />}
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-semibold ${c.ok?"text-green-700":"text-red-700"}`}>{c.label}</p>
                  <p className={`text-xs mt-0.5 ${c.ok?"text-green-600/70":"text-red-600/70"}`}>{c.detail}</p>
                  <p className="text-[10px] text-obsidian/30 mt-1 font-body">{c.law}</p>
                </div>
                {!c.ok && <button onClick={()=>setActiveTab("effectif")} className="text-xs text-red-600 font-semibold hover:underline cursor-pointer flex-shrink-0">Corriger →</button>}
              </div>
            ))}
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h4 className="font-heading text-sm font-bold text-obsidian mb-4">Récapitulatif légal — Burkina Faso</h4>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {label:"SMIG mensuel", val:`${SMIG_BF.toLocaleString()} FCFA`, law:"Décret 2014-679"},
                {label:"CNSS salarié", val:"5.5% du brut", law:"Loi CNSS BF"},
                {label:"CNSS employeur", val:"16% du brut", law:"Loi CNSS BF"},
                {label:"Congé annuel", val:"30 jours/an (2.5j/mois)", law:"Art.222 Code Travail"},
                {label:"Congé maternité", val:"98 jours", law:"Art.241 Code Travail"},
                {label:"Congé paternité", val:"3 jours", law:"Art.242 Code Travail"},
                {label:"Durée légale travail", val:"40h/semaine", law:"Art.102 Code Travail"},
                {label:"Heures sup. taux", val:"+25% (jour) +50% (nuit/férié)", law:"Art.116 Code Travail"},
                {label:"Préavis CDI ≥ 5 ans", val:"3 mois minimum", law:"Art.73 Code Travail"},
              ].map(item=>(
                <div key={item.label} className="border border-gray-100 rounded-xl p-3">
                  <p className="text-[10px] text-obsidian/40 uppercase tracking-wider font-body mb-0.5">{item.label}</p>
                  <p className="text-sm font-bold text-obsidian font-heading">{item.val}</p>
                  <p className="text-[10px] text-gmo-green font-body mt-1">{item.law}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {showForm && <EmployeeForm emp={editEmp} onSave={saveEmp} onClose={()=>{setShowForm(false);setEditEmp(null);}} />}
      {showLeave && <LeaveForm employees={employees} onSave={async(d)=>{const r=await base44.entities.LeaveRequest.create(d);setLeaves(p=>[r,...p]);setShowLeave(false);}} onClose={()=>setShowLeave(false)} />}
      {showPayslip && <PayslipModal employees={employees} onClose={()=>setShowPayslip(false)} />}
    </div>
  );
}