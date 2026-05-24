import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import RoleGuard from "@/components/auth/RoleGuard";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";
import DashboardVisual from "@/components/admin/DashboardVisual";
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
import DriversTab from "@/components/admin/DriversTab";
import PaymentsTab from "@/components/admin/PaymentsTab";
import ReceivablesTab from "@/components/admin/ReceivablesTab";
import ApplicationsTab from "@/components/admin/ApplicationsTab";
import StatsChartsPanel from "@/components/admin/StatsChartsPanel";
import SettingsTab from "@/components/admin/SettingsTab";
import SiteVitrineTab from "@/components/admin/SiteVitrineTab";

function AdminDashboard() {
  const [tab, setTab] = useState("dashboard");

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
  const [drivers, setDrivers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [receivables, setReceivables] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadAll(); }, []);

  useEffect(() => {
    const unsubOrder = base44.entities.Order.subscribe(event => {
      setOrders(prev => {
        if (event.type === "create") return [event.data, ...prev];
        if (event.type === "update") return prev.map(o => o.id === event.id ? event.data : o);
        if (event.type === "delete") return prev.filter(o => o.id !== event.id);
        return prev;
      });
    });
    const unsubProduct = base44.entities.Product.subscribe(event => {
      setProducts(prev => {
        if (event.type === "create") return [...prev, event.data];
        if (event.type === "update") return prev.map(p => p.id === event.id ? event.data : p);
        if (event.type === "delete") return prev.filter(p => p.id !== event.id);
        return prev;
      });
    });
    return () => { unsubOrder(); unsubProduct(); };
  }, []);

  const loadAll = async () => {
    setLoading(true);
    const [u, c, sup, p, o, inv, del, wh, cat, mov, emp, ent, drv, pay, rec, apps] = await Promise.all([
      base44.entities.User.list("-created_date", 100),
      base44.entities.Client.list("-created_date", 100),
      base44.entities.Supplier.list("-created_date", 100),
      base44.entities.Product.list("name", 200),
      base44.entities.Order.list("-created_date", 100),
      base44.entities.Invoice.list("-created_date", 100),
      base44.entities.DeliveryNote.list("-created_date", 100),
      base44.entities.Warehouse.list("name", 50),
      base44.entities.Category.list("name", 50),
      base44.entities.StockMovement.list("-created_date", 100),
      base44.entities.Employee.list("last_name", 100),
      base44.entities.AccountEntry.list("-date", 100),
      base44.entities.Driver.list("last_name", 50),
      base44.entities.Payment.list("-date", 100),
      base44.entities.Receivable.list("-created_date", 100),
      base44.entities.Application.list("-created_date", 100),
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
    setDrivers(drv || []);
    setPayments(pay || []);
    setReceivables(rec || []);
    setApplications(apps || []);
    setLoading(false);
  };

  const pendingOrders = orders.filter(o => o.status === "en_attente").length;
  const newApplications = applications.filter(a => a.status === "nouveau").length;
  const allData = { users, clients, suppliers, products, orders, invoices, employees, entries, drivers, payments, receivables };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-green-600/20 border-t-green-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-xs text-gray-400 uppercase tracking-widest">Chargement ERP…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex" style={{ background: "linear-gradient(160deg, #f8f7f2 0%, #f2f5ef 40%, #f5f0e8 100%)" }}>
      <AdminSidebar tab={tab} setTab={setTab} pendingOrders={pendingOrders} newApplications={newApplications} />
      <main className="flex-1 min-w-0 overflow-x-hidden flex flex-col">
        <AdminTopbar pendingOrders={pendingOrders} setTab={setTab} />
        <div className="flex-1 px-6 py-6">
          <div key={tab} className="page-enter">
            {tab === "dashboard"    && <DashboardVisual data={allData} setTab={setTab} />}
            {tab === "clients"      && <ClientsTab clients={clients} setClients={setClients} />}
            {tab === "suppliers"    && <SuppliersTab suppliers={suppliers} setSuppliers={setSuppliers} />}
            {tab === "invoices"     && <InvoicesTab invoices={invoices} setInvoices={setInvoices} clients={clients} products={products} />}
            {tab === "delivery"     && <DeliveryTab deliveries={deliveries} setDeliveries={setDeliveries} clients={clients} />}
            {tab === "drivers"      && <DriversTab drivers={drivers} setDrivers={setDrivers} />}
            {tab === "products"     && <ProductsTab products={products} setProducts={setProducts} />}
            {tab === "categories"   && <CategoriesTab categories={categories} setCategories={setCategories} />}
            {tab === "warehouses"   && <WarehousesTab warehouses={warehouses} setWarehouses={setWarehouses} />}
            {tab === "stock"        && <StockTab movements={movements} setMovements={setMovements} />}
            {tab === "accounting"   && <AccountingTab entries={entries} setEntries={setEntries} invoices={invoices} />}
            {tab === "payments"     && <PaymentsTab payments={payments} setPayments={setPayments} clients={clients} />}
            {tab === "receivables"  && <ReceivablesTab receivables={receivables} setReceivables={setReceivables} clients={clients} />}
            {tab === "hr"           && <HRTab employees={employees} setEmployees={setEmployees} />}
            {tab === "orders"       && <OrdersAdminTab orders={orders} setOrders={setOrders} clients={clients} products={products} drivers={drivers} />}
            {tab === "users"        && <UsersAdminTab users={users} setUsers={setUsers} />}
            {tab === "applications" && <ApplicationsTab applications={applications} setApplications={setApplications} />}
            {tab === "stats"        && <StatsChartsPanel orders={orders} movements={movements} />}
            {tab === "settings"     && <SettingsTab />}
            {tab === "vitrine"      && <SiteVitrineTab />}
          </div>
          <p className="text-center text-xs text-obsidian/30 mt-10">
            GMO Burkina ERP · <span className="text-gmo-green">IAM Technology</span>
          </p>
        </div>
      </main>
    </div>
  );
}

export default function AdminSpace() {
  return (
    <RoleGuard roles={["pdg"]}>
      <AdminDashboard />
    </RoleGuard>
  );
}