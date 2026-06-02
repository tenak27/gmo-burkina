import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, Phone, Loader2, ChevronDown } from "lucide-react";
import { base44 } from "@/api/base44Client";

const QUICK_REPLIES = [
  "Comment passer une commande ?",
  "Quels sont vos délais de livraison ?",
  "Comment consulter mes stocks ?",
  "Prix grossiste disponibles ?",
];

const INITIAL_MESSAGE = {
  id: "init",
  role: "bot",
  text: "Bonjour 👋 Je suis l'assistant GMO Burkina. Comment puis-je vous aider aujourd'hui ?",
  time: new Date(),
};

export default function LiveChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [unread, setUnread] = useState(0);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput("");

    const userMsg = { id: Date.now(), role: "user", text: msg, time: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `Tu es un assistant commercial de GMO Burkina, une entreprise de distribution au Burkina Faso. 
Réponds de façon courte, professionnelle et utile en français.
L'utilisateur est un détaillant partenaire.
Question: ${msg}

Contexte GMO: Distribution nationale de produits alimentaires, d'hygiène et de consommation courante. Prix grossiste disponibles. Livraison dans 24-48h à Ouagadougou. Contact: +226 25 33 19 00.
Réponds en 2-3 phrases maximum.`,
      });

      const botMsg = {
        id: Date.now() + 1,
        role: "bot",
        text: typeof res === "string" ? res : (res?.result || "Je vais transmettre votre question à notre équipe commerciale. Vous pouvez aussi nous appeler au +226 25 33 19 00."),
        time: new Date(),
      };
      setMessages(prev => [...prev, botMsg]);
      if (!open) setUnread(u => u + 1);
    } catch {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: "bot",
        text: "Désolé, notre assistant est momentanément indisponible. Appelez-nous au +226 25 33 19 00.",
        time: new Date(),
      }]);
    }
    setLoading(false);
  };

  return (
    <>
      {/* Floating button */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {/* Tooltip */}
        {!open && (
          <div className="bg-obsidian text-white text-xs font-body px-3 py-1.5 rounded-xl shadow-lg animate-fade-up">
            💬 Besoin d'aide ?
          </div>
        )}

        <button
          onClick={() => setOpen(o => !o)}
          aria-label="Ouvrir le chat"
          className="w-14 h-14 bg-gmo-green rounded-2xl flex items-center justify-center shadow-xl hover:bg-gmo-green/90 transition-all duration-200 hover:scale-105 relative cursor-pointer"
        >
          {open ? <X className="w-6 h-6 text-white" /> : <MessageCircle className="w-6 h-6 text-white" />}
          {unread > 0 && !open && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-gmo-red rounded-full text-[10px] text-white font-bold flex items-center justify-center">
              {unread}
            </span>
          )}
        </button>
      </div>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-fade-up" style={{ maxHeight: "70vh" }}>
          {/* Header */}
          <div className="bg-gradient-to-r from-gmo-green to-gmo-green/80 px-4 py-3.5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-heading text-sm font-bold text-white">Assistant GMO</p>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 inline-block" />
                <p className="text-[10px] text-white/70 font-body">En ligne · Répond en quelques secondes</p>
              </div>
            </div>
            <a href="tel:+22625331900" className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center text-white hover:bg-white/25 transition-colors cursor-pointer" title="Appeler">
              <Phone className="w-3.5 h-3.5" />
            </a>
            <button onClick={() => setOpen(false)} className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center text-white hover:bg-white/25 transition-colors cursor-pointer">
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-gray-50/50" style={{ minHeight: 200 }}>
            {messages.map(m => (
              <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} gap-2`}>
                {m.role === "bot" && (
                  <div className="w-6 h-6 rounded-full bg-gmo-green/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5 text-gmo-green" />
                  </div>
                )}
                <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-xs font-body leading-relaxed shadow-sm ${
                  m.role === "user"
                    ? "bg-gmo-green text-white rounded-tr-sm"
                    : "bg-white text-obsidian border border-gray-100 rounded-tl-sm"
                }`}>
                  {m.text}
                  <p className={`text-[8px] mt-1 ${m.role === "user" ? "text-white/50" : "text-obsidian/30"}`}>
                    {m.time.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start gap-2">
                <div className="w-6 h-6 rounded-full bg-gmo-green/15 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-3.5 h-3.5 text-gmo-green" />
                </div>
                <div className="bg-white rounded-2xl rounded-tl-sm px-3 py-2.5 border border-gray-100 flex items-center gap-1.5">
                  <Loader2 className="w-3 h-3 text-gmo-green animate-spin" />
                  <span className="text-[10px] text-obsidian/40 font-body">En train de répondre…</span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick replies */}
          {messages.length <= 2 && (
            <div className="px-4 py-2 flex gap-1.5 flex-wrap border-t border-gray-100 bg-white">
              {QUICK_REPLIES.map(q => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="text-[10px] font-body text-gmo-green border border-gmo-green/30 bg-gmo-green/5 hover:bg-gmo-green hover:text-white px-2.5 py-1 rounded-full transition-colors cursor-pointer"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="px-3 py-3 bg-white border-t border-gray-100 flex items-center gap-2">
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
              placeholder="Votre question…"
              disabled={loading}
              className="flex-1 text-xs font-body text-obsidian placeholder:text-obsidian/30 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-gmo-green transition-colors"
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              aria-label="Envoyer"
              className="w-9 h-9 bg-gmo-green rounded-xl flex items-center justify-center text-white disabled:opacity-40 hover:bg-gmo-green/90 transition-colors cursor-pointer flex-shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}