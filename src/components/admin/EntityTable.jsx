import React, { useState, useMemo } from "react";
import { Search, Plus, Pencil, Trash2, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Download, X } from "lucide-react";

function exportCSV(columns, rows, title) {
  const headers = columns.filter(c => c.label !== "PDF" && c.label !== "Actions").map(c => c.label);
  const csvRows = rows.map(r =>
    columns.filter(c => c.label !== "PDF" && c.label !== "Actions").map(c => {
      const val = r[c.key];
      return typeof val === "string" ? `"${val.replace(/"/g, '""')}"` : val ?? "";
    }).join(",")
  );
  const csv = [headers.join(","), ...csvRows].join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = `${title || "export"}.csv`; a.click();
  URL.revokeObjectURL(url);
}

export default function EntityTable({
  title, subtitle, columns, rows, onAdd, onEdit, onDelete,
  loading, addLabel = "Nouveau", emptyLabel
}) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState("asc");
  const PER_PAGE = 15;

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
    setPage(1);
  };

  const filtered = useMemo(() => {
    let data = rows.filter(r =>
      !search || columns.some(c => String(r[c.key] || "").toLowerCase().includes(search.toLowerCase()))
    );
    if (sortKey) {
      data = [...data].sort((a, b) => {
        const va = a[sortKey] ?? ""; const vb = b[sortKey] ?? "";
        const cmp = typeof va === "number" ? va - vb : String(va).localeCompare(String(vb));
        return sortDir === "asc" ? cmp : -cmp;
      });
    }
    return data;
  }, [rows, search, sortKey, sortDir, columns]);

  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage = Math.min(page, pages);
  const paged = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  const sortableKeys = new Set(columns.filter(c => !c.render).map(c => c.key));

  return (
    <div className="animate-fade-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-white">{title}</h2>
          {subtitle && <p className="text-sm text-white/40 font-body mt-1">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Rechercher..."
              className="pl-10 pr-8 py-2.5 text-sm font-body rounded-xl focus:border-gmo-green focus:outline-none w-52 transition-colors text-white/80 placeholder:text-white/30"
              style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }}
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          {/* Export CSV */}
          <button
            onClick={() => exportCSV(columns, filtered, title)}
            title="Exporter en CSV"
            className="flex items-center gap-2 text-white/50 hover:text-gmo-green text-sm font-body px-4 py-2.5 rounded-xl transition-colors"
            style={{ border: "1px solid rgba(255,255,255,0.12)" }}
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Exporter</span>
          </button>
          {/* Add */}
          {onAdd && (
            <button
              onClick={onAdd}
              className="flex items-center gap-2 bg-gmo-green text-white text-sm font-heading font-bold px-5 py-2.5 rounded-xl btn-glow-green shadow-sm"
            >
              <Plus className="w-4 h-4" /> {addLabel}
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(4px)" }}>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-10 h-10 border-2 border-gmo-green/20 border-t-gmo-green rounded-full animate-spin" />
            <p className="text-sm text-white/30 font-body">Chargement…</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ background: "rgba(26,122,46,0.12)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                    {columns.map((c, i) => (
                      <th
                        key={`${c.key}-${i}`}
                        onClick={sortableKeys.has(c.key) ? () => handleSort(c.key) : undefined}
                        className={`px-5 py-4 text-xs font-bold uppercase tracking-wider text-white/50 font-heading select-none ${
                          c.align === "right" ? "text-right" : c.align === "center" ? "text-center" : "text-left"
                        } ${sortableKeys.has(c.key) ? "cursor-pointer hover:text-obsidian group" : ""}`}
                      >
                        <span className="inline-flex items-center gap-1.5">
                          {c.label}
                          {sortableKeys.has(c.key) && (
                            <span className={`transition-opacity ${sortKey === c.key ? "opacity-100" : "opacity-0 group-hover:opacity-50"}`}>
                              {sortKey === c.key && sortDir === "desc"
                                ? <ChevronDown className="w-3.5 h-3.5" />
                                : <ChevronUp className="w-3.5 h-3.5" />}
                            </span>
                          )}
                        </span>
                      </th>
                    ))}
                    {(onEdit || onDelete) && (
                      <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wider text-white/50 font-heading">Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody style={{ borderColor: "rgba(255,255,255,0.06)" }} className="divide-y divide-white/5">
                  {paged.length === 0 ? (
                    <tr>
                      <td colSpan={columns.length + 1} className="text-center py-16 font-body">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                            <Search className="w-5 h-5 text-white/20" />
                          </div>
                          <p className="text-base text-white/30">{search ? `Aucun résultat pour "${search}"` : (emptyLabel || "Aucune donnée")}</p>
                        </div>
                      </td>
                    </tr>
                  ) : paged.map((row, i) => (
                    <tr
                      key={row.id || i}
                      className="transition-colors duration-100 group"
                      style={{ background: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent" }}
                      onMouseEnter={e => e.currentTarget.style.background = "rgba(26,122,46,0.08)"}
                      onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent"}
                    >
                      {columns.map((c, ci) => (
                        <td
                          key={`${c.key}-${ci}`}
                          className={`px-5 py-4 ${c.align === "right" ? "text-right" : c.align === "center" ? "text-center" : ""}`}
                        >
                          {c.render ? c.render(row[c.key], row) : (
                            <span className="text-sm text-obsidian/80 font-body">{row[c.key] ?? "—"}</span>
                          )}
                        </td>
                      ))}
                      {(onEdit || onDelete) && (
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                            {onEdit && (
                              <button
                                onClick={() => onEdit(row)}
                                className="w-8 h-8 rounded-lg border border-transparent hover:border-gmo-green/40 hover:bg-gmo-green/8 flex items-center justify-center text-obsidian/40 hover:text-gmo-green transition-all"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                            )}
                            {onDelete && (
                              <button
                                onClick={() => onDelete(row)}
                                className="w-8 h-8 rounded-lg border border-transparent hover:border-red-200 hover:bg-red-50 flex items-center justify-center text-obsidian/40 hover:text-gmo-red transition-all"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-5 py-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(26,122,46,0.05)" }}>
              <span className="text-sm text-white/40 font-body">
                {search
                  ? <><span className="text-gmo-green font-semibold">{filtered.length}</span> résultat{filtered.length > 1 ? "s" : ""} sur {rows.length}</>
                  : <><span className="font-semibold text-white/60">{rows.length}</span> entrée{rows.length > 1 ? "s" : ""}</>
                }
              </span>
              {pages > 1 && (
                <div className="flex items-center gap-1.5">
                  <button onClick={() => setPage(1)} disabled={safePage === 1} className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-obsidian/50 hover:border-gmo-green hover:text-gmo-green disabled:opacity-30 transition-all text-sm font-body">1</button>
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={safePage === 1} className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-obsidian/50 hover:border-gmo-green hover:text-gmo-green disabled:opacity-30 transition-all">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-sm text-obsidian/60 font-body px-3 min-w-[56px] text-center">
                    {safePage} <span className="text-obsidian/30">/ {pages}</span>
                  </span>
                  <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={safePage === pages} className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-obsidian/50 hover:border-gmo-green hover:text-gmo-green disabled:opacity-30 transition-all">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button onClick={() => setPage(pages)} disabled={safePage === pages} className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-obsidian/50 hover:border-gmo-green hover:text-gmo-green disabled:opacity-30 transition-all text-sm font-body">{pages}</button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}