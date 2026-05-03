import React, { useState } from "react";
import { Search, Plus, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Generic reusable table for all admin entities
 * columns: [{ key, label, render?, align? }]
 * onAdd, onEdit, onDelete
 */
export default function EntityTable({ title, subtitle, columns, rows, onAdd, onEdit, onDelete, loading, addLabel = "Nouveau" }) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const PER_PAGE = 15;

  const filtered = rows.filter(r =>
    !search || columns.some(c => String(r[c.key] || "").toLowerCase().includes(search.toLowerCase()))
  );
  const pages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div>
          <h2 className="font-heading text-lg font-bold text-obsidian">{title}</h2>
          {subtitle && <p className="text-xs text-obsidian/40 font-body mt-0.5">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-obsidian/30" />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Rechercher..."
              className="pl-8 pr-3 py-2 text-xs font-body border border-gray-200 rounded-lg focus:border-gmo-green focus:outline-none w-44"
            />
          </div>
          {onAdd && (
            <button onClick={onAdd} className="flex items-center gap-1.5 bg-gmo-green text-white text-xs font-heading font-bold px-3 py-2 rounded-lg hover:bg-gmo-green/90 transition-colors">
              <Plus className="w-3.5 h-3.5" /> {addLabel}
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-6 h-6 border-2 border-gmo-green/30 border-t-gmo-green rounded-full animate-spin" />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50/70 border-b border-gray-100">
                    {columns.map(c => (
                      <th key={c.key} className={`px-4 py-2.5 text-[10px] uppercase tracking-widest text-obsidian/40 font-heading ${c.align === "right" ? "text-right" : c.align === "center" ? "text-center" : "text-left"}`}>
                        {c.label}
                      </th>
                    ))}
                    {(onEdit || onDelete) && <th className="px-4 py-2.5 text-right text-[10px] uppercase tracking-widest text-obsidian/40 font-heading">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {paged.length === 0 ? (
                    <tr>
                      <td colSpan={columns.length + 1} className="text-center py-10 text-xs text-obsidian/30 font-body">
                        {search ? "Aucun résultat" : "Aucune donnée"}
                      </td>
                    </tr>
                  ) : paged.map((row, i) => (
                    <tr key={row.id || i} className="hover:bg-gray-50/50 transition-colors">
                      {columns.map(c => (
                        <td key={c.key} className={`px-4 py-2.5 ${c.align === "right" ? "text-right" : c.align === "center" ? "text-center" : ""}`}>
                          {c.render ? c.render(row[c.key], row) : (
                            <span className="text-xs text-obsidian/70 font-body">{row[c.key] ?? "—"}</span>
                          )}
                        </td>
                      ))}
                      {(onEdit || onDelete) && (
                        <td className="px-4 py-2.5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {onEdit && (
                              <button onClick={() => onEdit(row)} className="text-obsidian/25 hover:text-gmo-green transition-colors">
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {onDelete && (
                              <button onClick={() => onDelete(row)} className="text-obsidian/25 hover:text-gmo-red transition-colors">
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
            {pages > 1 && (
              <div className="flex items-center justify-between px-4 py-2.5 border-t border-gray-100">
                <span className="text-[11px] text-obsidian/35 font-body">{filtered.length} résultats</span>
                <div className="flex items-center gap-1">
                  <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1} className="w-7 h-7 flex items-center justify-center rounded border border-gray-200 text-obsidian/40 hover:border-gmo-green hover:text-gmo-green disabled:opacity-30 transition-colors">
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[11px] text-obsidian/50 font-body px-2">{page} / {pages}</span>
                  <button onClick={() => setPage(p => Math.min(pages, p+1))} disabled={page === pages} className="w-7 h-7 flex items-center justify-center rounded border border-gray-200 text-obsidian/40 hover:border-gmo-green hover:text-gmo-green disabled:opacity-30 transition-colors">
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}