import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import RoleGuard from "@/components/auth/RoleGuard";
import AdminHeader from "@/components/admin/AdminHeader";
import DashboardTab from "@/components/admin/DashboardTab";
import ClientsTab from "@/components/admin/ClientsTab";
import SuppliersTab from "@/components/admin/SuppliersTab";
import InvoicesTab from "@/components/admin/InvoicesTab";
import DeliveryTab from "@/components/admin/DeliveryTab";
import ProductsTab from "@/components/admin/ProductsTab";
import CategoriesTab from "@/components/admin/CategoriesTab";
import WarehousesTab from "@/components/admin/WarehousesTab";
import StockTab from "@/components/admin/StockTab";
import AccountingTab from "@/components/admin/AccountingTab";
import HRTab from "@/components/admin/HRTab";
import OrdersAdminTab from "@/components/admin/OrdersAdminTab";
import UsersAdminTab from "@/components/admin/UsersAdminTab";

function AdminDashboard() {
  const [tab, setTab] = useState("dashboard");

  // All data state
  const [users, setUsers] = useState([]);
  const [clients, setClients] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [movements, setMovements] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAll();
  }, []);

  // Real-time orders
  useEffect(() => {
    const unsub = base44.entities.Order.subscribe(event => {
      setOrders(prev => {
        if (event.type === "create") return [event.data, ...prev];
        if (event.type === "update") return prev.map(o => o.id === event.id ? event.data : o);
        if (event.type === "delete") return prev.filter(o => o.id !== event.id);
        return prev;
      });
    });
    return unsub;
  }, []);

  const loadAll = async () => {
    setLoading(true);
    const [u, c, sup, p, o, inv, del, wh, cat, mov, emp, ent] = await Promise.all([
      base44.entities.User.list("-created_date", 100),
      base44.entities.Client.list("-created_date", 100),
      base44.entities.Supplier.list("-created_date", 100),
      base44.entities.Product.list("name", 100),
      base44.entities.Order.list("-created_date", 100),
      base44.entities.Invoice.list("-created_date", 100),
      base44.entities.DeliveryNote.list("-created_date", 100),
      base44.entities.Warehouse.list("name", 50),
      base44.entities.Category.list("name", 50),
      base44.entities.StockMovement.list("-created_date", 100),
      base44.entities.Employee.list("last_name", 100),
      base44.entities.AccountEntry.list("-date", 100),
    ]);
    setUsers(u || []);
    setClients(c || []);
    setSuppliers(sup || []);
    setProducts(p || []);
    setOrders(o || []);
    setInvoices(inv || []);
    setDeliveries(del || []);
    setWarehouses(wh || []);
    setCategories(cat || []);
    setMovements(mov || []);
    setEmployees(emp || []);
    setEntries(ent || []);
    setLoading(false);
  };

  const pendingOrders = orders.filter(o => o.status === "en_attente").length;

  const allData = { users, clients, suppliers, products, orders, invoices, employees, entries };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F2F4F7] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-3 border-gmo-green/30 border-t-gmo-green rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-obsidian/40 font-body">Chargement ERP…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2F4F7]">
      <AdminHeader tab={tab} setTab={setTab} pendingOrders={pendingOrders} />

      <main className="max-w-full px-4 sm:px-6 py-5">
        {tab === "dashboard"  && <DashboardTab data={allData} setTab={setTab} />}
        {tab === "clients"    && <ClientsTab clients={clients} setClients={setClients} />}
        {tab === "suppliers"  && <SuppliersTab suppliers={suppliers} setSuppliers={setSuppliers} />}
        {tab === "invoices"   && <InvoicesTab invoices={invoices} setInvoices={setInvoices} />}
        {tab === "delivery"   && <DeliveryTab deliveries={deliveries} setDeliveries={setDeliveries} />}
        {tab === "products"   && <ProductsTab products={products} setProducts={setProducts} />}
        {tab === "categories" && <CategoriesTab categories={categories} setCategories={setCategories} />}
        {tab === "warehouses" && <WarehousesTab warehouses={warehouses} setWarehouses={setWarehouses} />}
        {tab === "stock"      && <StockTab movements={movements} setMovements={setMovements} />}
        {tab === "accounting" && <AccountingTab entries={entries} setEntries={setEntries} />}
        {tab === "hr"         && <HRTab employees={employees} setEmployees={setEmployees} />}
        {tab === "orders"     && <OrdersAdminTab orders={orders} setOrders={setOrders} />}
        {tab === "users"      && <UsersAdminTab users={users} />}

        <p className="text-center text-[9px] text-obsidian/15 font-body mt-8 uppercase tracking-widest">
          GMO Burkina ERP · IAM Technology · Développé par Armand Olivier KONATE
        </p>
      </main>
    </div>
  );
}

export default function AdminSpace() {
  return (
    <RoleGuard roles={["admin"]}>
      <AdminDashboard />
    </RoleGuard>
  );
}