import React from "react";
import OhadaAccountingModule from "@/components/accounting/OhadaAccountingModule";

export default function AccountingTab({ entries, setEntries, invoices = [] }) {
  return (
    <OhadaAccountingModule
      invoices={invoices}
      entries={entries}
      setEntries={setEntries}
    />
  );
}