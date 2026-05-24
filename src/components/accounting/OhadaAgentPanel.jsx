import React, { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { Bot, Send, Sparkles, AlertTriangle, CheckCircle2, Loader2, X, RefreshCw } from "lucide-react";
import ReactMarkdown from "react-markdown";

const QUICK_CHECKS = [
  { label: "Vérifier l'équilibre débit/crédit", prompt: "Vérifie si toutes les écritures du journal sont équilibrées (débit = crédit). Donne un rapport détaillé." },
  { label: "Analyser les comptes clients", prompt: "Analyse le compte 411 (Clients) : créances en cours, créances douteuses, délais de paiement. Donne des recommandations." },
  { label: "Contrôle TVA", prompt: "Vérifie la cohérence des comptes 442 (TVA collectée) et 443 (TVA déductible). Calcule la TVA nette à décaisser." },
  { label: "Résultat d'exploitation", prompt: "Calcule l'EBE (Excédent Brut d'Exploitation), le résultat d'exploitation et le résultat net selon les normes SYSCOHADA." },
  { label: "Détecter les anomalies", prompt: "Détecte toutes les anomalies comptables : écritures sans pièce justificative, comptes mal utilisés, incohérences dans les montants." },
  { label: "Bilan de trésorerie", prompt: "Analyse les comptes de trésorerie (521 Banque, 531-532 Caisse, 541 Mobile Money). Donne l'état de la trésorerie nette." },
];

export default function OhadaAgentPanel({ entries, invoices = [], fiscalYears = [] }) {
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const bottomRef = useRef(null);

  const openYear = fiscalYears.find(y => y.status === "ouvert");

  const init = async () => {
    if (conversation) return;
    const conv = await base44.agents.createConversation({
      agent_name: "comptable_ohada",
      metadata: { name: "Analyse comptable OHADA" },
    });
    setConversation(conv);
    // Subscribe to messages
    const unsub = base44.agents.subscribeToConversation(conv.id, data => {
      setMessages(data.messages || []);
      setLoading(false);
    });
    return unsub;
  };

  useEffect(() => {
    let unsub;
    if (isOpen) {
      init().then(u => { unsub = u; });
    }
    return () => { if (unsub) unsub(); };
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text) => {
    if (!text.trim() || loading) return;
    if (!conversation) return;

    // Build context for the agent
    const totalDebit = entries.reduce((s, e) => s + (e.debit || 0), 0);
    const totalCredit = entries.reduce((s, e) => s + (e.credit || 0), 0);
    const isBalanced = Math.abs(totalDebit - totalCredit) < 1;
    const totalVentes = entries.filter(e => e.account_code?.startsWith("7")).reduce((s, e) => s + (e.credit || 0), 0);
    const totalCharges = entries.filter(e => e.account_code?.startsWith("6")).reduce((s, e) => s + (e.debit || 0), 0);
    const totalClients = entries.filter(e => e.account_code === "411").reduce((s, e) => s + (e.debit || 0) - (e.credit || 0), 0);

    const context = `\n\n[CONTEXTE COMPTABLE - ${new Date().toLocaleDateString("fr-FR")}]
Exercice actif: ${openYear?.label || "Aucun"}
Total écritures: ${entries.length}
Balance: ${isBalanced ? "ÉQUILIBRÉE" : "DÉSÉQUILIBRÉE"}
Total Débit: ${totalDebit.toLocaleString()} FCFA
Total Crédit: ${totalCredit.toLocaleString()} FCFA
CA (Produits cl.7): ${totalVentes.toLocaleString()} FCFA
Charges (cl.6): ${totalCharges.toLocaleString()} FCFA
Résultat estimé: ${(totalVentes - totalCharges).toLocaleString()} FCFA
Créances clients (411): ${totalClients.toLocaleString()} FCFA
Total factures: ${invoices.length}
Factures payées: ${invoices.filter(i => i.status === "paye").length}
`;

    setLoading(true);
    setInput("");
    await base44.agents.addMessage(conversation, {
      role: "user",
      content: text + context,
    });
  };

  const handleQuick = (prompt) => sendMessage(prompt);

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 bg-obsidian text-white px-5 py-3 rounded-2xl shadow-2xl hover:bg-obsidian/90 transition-all font-semibold text-sm cursor-pointer"
      >
        <Bot className="w-4 h-4" />
        <span>Agent Comptable IA</span>
        <Sparkles className="w-3.5 h-3.5 text-gold" />
      </button>

      {/* Panel */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-end p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg h-[85vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="bg-obsidian px-5 py-4 flex items-center gap-3 flex-shrink-0">
              <div className="w-9 h-9 rounded-xl bg-gmo-green/20 flex items-center justify-center">
                <Bot className="w-4 h-4 text-gmo-green" />
              </div>
              <div className="flex-1">
                <p className="font-heading text-sm font-bold text-white">Agent Comptable OHADA</p>
                <p className="text-[10px] text-white/50 font-body">SYSCOHADA révisé — Analyse IA</p>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/50 hover:text-white transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick actions */}
            <div className="px-4 py-3 border-b border-gray-100 flex-shrink-0">
              <p className="text-[10px] text-obsidian/40 font-body uppercase tracking-wider mb-2">Analyses rapides</p>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_CHECKS.map(qc => (
                  <button key={qc.label} onClick={() => handleQuick(qc.prompt)} disabled={loading}
                    className="text-[10px] px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gmo-green/10 hover:text-gmo-green text-gray-600 font-body transition-colors cursor-pointer disabled:opacity-40">
                    {qc.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {messages.length === 0 && (
                <div className="py-8 text-center">
                  <Sparkles className="w-10 h-10 text-gold/40 mx-auto mb-3" />
                  <p className="font-heading text-sm font-semibold text-obsidian/40">Demandez une analyse comptable</p>
                  <p className="text-xs text-obsidian/25 font-body mt-1">L'agent vérifie les incohérences, calcule les indicateurs et donne des recommandations SYSCOHADA.</p>
                </div>
              )}
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.role !== "user" && (
                    <div className="w-7 h-7 rounded-lg bg-obsidian flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Bot className="w-3.5 h-3.5 text-gmo-green" />
                    </div>
                  )}
                  <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${msg.role === "user" ? "bg-gmo-green text-white" : "bg-gray-100"}`}>
                    {msg.role === "user" ? (
                      <p className="text-sm text-white font-body">{msg.content?.split("[CONTEXTE")[0]}</p>
                    ) : (
                      <ReactMarkdown className="text-sm text-obsidian/80 font-body prose prose-sm max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                        {msg.content}
                      </ReactMarkdown>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex gap-2.5 justify-start">
                  <div className="w-7 h-7 rounded-lg bg-obsidian flex items-center justify-center flex-shrink-0">
                    <Loader2 className="w-3.5 h-3.5 text-gmo-green animate-spin" />
                  </div>
                  <div className="bg-gray-100 rounded-2xl px-4 py-3">
                    <p className="text-xs text-obsidian/40 font-body">Analyse en cours…</p>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="px-4 py-3 border-t border-gray-100 flex-shrink-0">
              <div className="flex gap-2">
                <input
                  value={input} onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendMessage(input))}
                  placeholder="Posez une question comptable…"
                  className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-gmo-green font-body"
                />
                <button onClick={() => sendMessage(input)} disabled={loading || !input.trim()}
                  className="w-10 h-10 rounded-xl bg-gmo-green flex items-center justify-center hover:bg-gmo-green/90 transition-colors cursor-pointer disabled:opacity-40 flex-shrink-0">
                  <Send className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}