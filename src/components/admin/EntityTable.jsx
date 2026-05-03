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
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div>
          <h2 className="font-heading text-lg font-bold text-obsidian">{title}</h2>
          {subtitle && <p className="text-xs text-obsidian/40 font-body mt-0.5">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-obsidian/30" />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Rechercher..."
              className="pl-8 pr-7 py-2 text-xs font-body border border-gray-200 rounded-lg focus:border-gmo-green focus:outline-none w-44 transition-colors"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-obsidian/30 hover:text-obsidian">
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
          {/* Export CSV */}
          <button
            onClick={() => exportCSV(columns, filtered, title)}
            title="Exporter en CSV"
            className="flex items-center gap-1.5 border border-gray-200 text-obsidian/40 hover:border-gmo-green hover:text-gmo-green text-xs font-body px-3 py-2 rounded-lg transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Exporter</span>
          </button>
          {/* Add */}
          {onAdd && (
            <button
              onClick={onAdd}
              className="flex items-center gap-1.5 bg-gmo-green text-white text-xs font-heading font-bold px-3 py-2 rounded-lg hover:bg-gmo-green/90 transition-colors shadow-sm shadow-gmo-green/20"
            >
              <Plus className="w-3.5 h-3.5" /> {addLabel}
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-8 h-8 border-2 border-gmo-green/20 border-t-gmo-green rounded-full animate-spin" />
            <p className="text-xs text-obsidian/30 font-body">Chargement…</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50/80 border-b border-gray-100">
                    {columns.map((c, i) => (
                      <th
                        key={`${c.key}-${i}`}
                        onClick={sortableKeys.has(c.key) ? () => handleSort(c.key) : undefined}
                        className={`px-4 py-3 text-[10px] uppercase tracking-widest text-obsidian/40 font-heading select-none ${
                          c.align === "right" ? "text-right" : c.align === "center" ? "text-center" : "text-left"
                        } ${sortableKeys.has(c.key) ? "cursor-pointer hover:text-obsidian/70 group" : ""}`}
                      >
                        <span className="inline-flex items-center gap-1">
                          {c.label}
                          {sortableKeys.has(c.key) && (
                            <span className={`transition-opacity ${sortKey === c.key ? "opacity-100" : "opacity-0 group-hover:opacity-40"}`}>
                              {sortKey === c.key && sortDir === "desc"
                                ? <ChevronDown className="w-3 h-3" />
                                : <ChevronUp className="w-3 h-3" />}
                            </span>
                          )}
                        </span>
                      </th>
                    ))}
                    {(onEdit || onDelete) && (
                      <th className="px-4 py-3 text-right text-[10px] uppercase tracking-widest text-obsidian/40 font-heading">Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {paged.length === 0 ? (
                    <tr>
                      <td colSpan={columns.length + 1} className="text-center py-14 text-xs text-obsidian/30 font-body">
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
                            <Search className="w-4 h-4 text-obsidian/20" />
                          </div>
                          {search ? `Aucun résultat pour "${search}"` : (emptyLabel || "Aucune donnée")}
                        </div>
                      </td>
                    </tr>
                  ) : paged.map((row, i) => (
                    <tr
                      key={row.id || i}
                      className="hover:bg-gray-50/60 transition-colors duration-150 group"
                    >
                      {columns.map((c, ci) => (
                        <td
                          key={`${c.key}-${ci}`}
                          className={`px-4 py-3 ${c.align === "right" ? "text-right" : c.align === "center" ? "text-center" : ""}`}
                        >
                          {c.render ? c.render(row[c.key], row) : (
                            <span className="text-xs text-obsidian/70 font-body">{row[c.key] ?? "—"}</span>
                          )}
                        </td>
                      ))}
                      {(onEdit || onDelete) && (
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                            {onEdit && (
                              <button
                                onClick={() => onEdit(row)}
                                className="w-7 h-7 rounded-lg border border-transparent hover:border-gmo-green/30 hover:bg-gmo-green/5 flex items-center justify-center text-obsidian/30 hover:text-gmo-green transition-all"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {onDelete && (
                              <button
                                onClick={() => onDelete(row)}
                                className="w-7 h-7 rounded-lg border border-transparent hover:border-red-200 hover:bg-red-50 flex items-center justify-center text-obsidian/30 hover:text-gmo-red transition-all"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
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
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-50 bg-gray-50/30">
              <span className="text-[11px] text-obsidian/35 font-body">
                {search
                  ? <><span className="text-gmo-green font-semibold">{filtered.length}</span> résultat{filtered.length > 1 ? "s" : ""} sur {rows.length}</>
                  : <><span className="font-semibold text-obsidian/50">{rows.length}</span> entrée{rows.length > 1 ? "s" : ""}</>
                }
              </span>
              {pages > 1 && (
                <div className="flex items-center gap-1">
                  <button onClick={() => setPage(1)} disabled={safePage === 1} className="w-7 h-7 flex items-center justify-center rounded border border-gray-200 text-obsidian/30 hover:border-gmo-green hover:text-gmo-green disabled:opacity-20 transition-all text-[10px] font-body">1</button>
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={safePage === 1} className="w-7 h-7 flex items-center justify-center rounded border border-gray-200 text-obsidian/40 hover:border-gmo-green hover:text-gmo-green disabled:opacity-20 transition-all">
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[11px] text-obsidian/50 font-body px-2 min-w-[48px] text-center">
                    {safePage} <span className="text-obsidian/25">/ {pages}</span>
                  </span>
                  <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={safePage === pages} className="w-7 h-7 flex items-center justify-center rounded border border-gray-200 text-obsidian/40 hover:border-gmo-green hover:text-gmo-green disabled:opacity-20 transition-all">
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => setPage(pages)} disabled={safePage === pages} className="w-7 h-7 flex items-center justify-center rounded border border-gray-200 text-obsidian/30 hover:border-gmo-green hover:text-gmo-green disabled:opacity-20 transition-all text-[10px] font-body">{pages}</button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}