import React from "react";
import EntityTable from "./EntityTable";

const COLUMNS = [
  { key: "full_name", label: "Nom", render: (v, r) => (
    <div className="flex items-center gap-2.5">
      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-bold font-heading flex-shrink-0 ${r.role === "admin" ? "bg-gmo-green" : r.role === "detaillant" ? "bg-gmo-red" : "bg-obsidian/40"}`}>
        {v?.charAt(0) || "?"}
      </div>
      <div>
        <p className="font-heading text-xs font-semibold text-obsidian">{v || "—"}</p>
        <p className="text-[10px] text-obsidian/40 font-body">{r.email}</p>
      </div>
    </div>
  )},
  { key: "role", label: "Rôle", align: "center", render: v => (
    <span className={`text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full font-body border ${
      v === "admin" ? "bg-gmo-green/10 text-gmo-green border-gmo-green/20"
      : v === "detaillant" ? "bg-gmo-red/10 text-gmo-red border-gmo-red/20"
      : "bg-gray-100 text-obsidian/45 border-gray-200"
    }`}>{v || "user"}</span>
  )},
  { key: "created_date", label: "Inscrit le", render: v => <span className="text-xs text-obsidian/40 font-body">{v ? new Date(v).toLocaleDateString("fr-FR") : "—"}</span> },
];

export default function UsersAdminTab({ users }) {
  return (
    <EntityTable
      title="Utilisateurs de l'application"
      subtitle={`${users.length} comptes — gestion des rôles via le backoffice`}
      columns={COLUMNS}
      rows={users}
    />
  );
}