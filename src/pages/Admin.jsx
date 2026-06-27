import React, { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, Package, TrendingUp, LayoutDashboard, Settings,
  LogOut, Search, Bell, ChevronRight, Zap, UserPlus, Trash2,
  Calendar, Plus, ExternalLink, Image as ImageIcon, ArrowRight,
  ShieldCheck, Truck, Eye, CheckCircle2, Clock, XCircle, RefreshCw,
  Phone, Mail, MapPin, Activity, BarChart3, Download, Filter,
  Wifi, WifiOff, FileDown, UserCheck
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { usePartners } from "../context/PartnerContext";
import Sticker from "../components/ui/Sticker";
import ThreeDCard from "../components/ui/ThreeDCard";
import api from "../utils/api";
import { formatDateSync as format } from "../utils/dateUtil";

// ── Status badge ──────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const map = {
    'Yangi':          'bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400',
    'Qabul qilindi':  'bg-yellow-100 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
    "Yo'lda":         'bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400',
    'Yetkazildi':     'bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400',
    'Bekor qilindi':  'bg-rose-100 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400',
    'Faol':           'bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400',
    'Band':           'bg-yellow-100 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
    'Nofaol':         'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400',
    'admin':          'bg-purple-100 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400',
    'superadmin':     'bg-rose-100 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400',
    'driver':         'bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400',
    'user':           'bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400',
  };
  return (
    <span className={`px-3 py-1 rounded-xl text-xs font-black uppercase tracking-widest ${map[status] || map['Nofaol']}`}>
      {status}
    </span>
  );
};

// ── Order filter helpers ──
const ORDER_STATUSES = ['all', 'Yangi', 'Qabul qilindi', "Yo'lda", 'Yetkazildi', 'Bekor qilindi'];
const ORDER_PAGE_SIZE = 10;

// ── PDF Export ──
async function exportOrdersPdf(orders) {
  try {
    // @vite-ignore
    const { jsPDF } = await import(/* @vite-ignore */ 'jspdf');
    // @vite-ignore
    const autoTable = (await import(/* @vite-ignore */ 'jspdf-autotable')).default;
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text('Buyurtmalar ro\'yxati', 14, 18);
    doc.setFontSize(10);
    doc.text(`Sana: ${format(new Date(), 'dd.MM.yyyy HH:mm')}`, 14, 26);

    autoTable(doc, {
      startY: 32,
      head: [['#', 'Tracking ID', 'Qayerdan', 'Qayerga', 'Holat', 'Narx', 'Sana']],
      body: orders.map((o, i) => [
        i + 1,
        o.trackingId || '-',
        o.from || '-',
        o.to || '-',
        o.status || '-',
        o.price ? `${o.price.toLocaleString()} so'm` : '-',
        o.createdAt ? format(new Date(o.createdAt), 'dd.MM.yyyy') : '-',
      ]),
      styles: { fontSize: 9 },
      headStyles: { fillColor: [37, 99, 235] },
    });

    doc.save(`buyurtmalar_${Date.now()}.pdf`);
  } catch (e) {
    alert('PDF eksport uchun jspdf va jspdf-autotable paketlari kerak');
  }
}

// ── Activity meta ──
const ACTIVITY_META = {
  user_registered:      { icon: UserPlus,  color: 'blue' },
  user_login:           { icon: UserCheck, color: 'green' },
  order_created:        { icon: Package,   color: 'blue' },
  order_status_changed: { icon: Truck,     color: 'orange' },
  order_deleted:        { icon: Trash2,    color: 'rose' },
  driver_created:       { icon: Truck,     color: 'blue' },
  driver_deleted:       { icon: Truck,     color: 'rose' },
  admin_created:        { icon: Users,     color: 'blue' },
  admin_deleted:        { icon: Users,     color: 'rose' },
  partner_created:      { icon: Users,     color: 'blue' },
  partner_deleted:      { icon: Users,     color: 'rose' },
  review_posted:        { icon: Star,      color: 'amber' },
  contact_message:      { icon: Mail,      color: 'purple' },
  settings_updated:     { icon: Settings,  color: 'slate' },
};

const COLOR_CLASSES = {
  blue:   'bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400',
  green:  'bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400',
  slate:  'bg-slate-100 dark:bg-slate-700 text-slate-500',
  amber:  'bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400',
  orange: 'bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400',
  rose:   'bg-rose-100 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400',
  purple: 'bg-purple-100 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400',
};

// ── Main Component ────────────────────────────────────────────
const Admin = () => {
  const { user, logout } = useAuth();
  const { partners, addPartner, deletePartner } = usePartners();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [search, setSearch] = useState("");

  // Dashboard stats
  const [dashStats, setDashStats] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);

  // Orders
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderFilter, setOrderFilter] = useState('all');
  const [orderPage, setOrderPage] = useState(1);

  // Drivers
  const [drivers, setDrivers] = useState([]);
  const [driversLoading, setDriversLoading] = useState(false);
  const [newDriver, setNewDriver] = useState({ name: '', email: '', phone: '', password: '', licenseNumber: '', vehicleType: 'Yuk mashinasi', vehicleNumber: '', avatar: '' });

  // Clients
  const [clients, setClients] = useState([]);
  const [clientsLoading, setClientsLoading] = useState(false);

  // Admins
  const [admins, setAdmins] = useState([]);
  const [adminsLoading, setAdminsLoading] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', password: '' });

  // Partners
  const [newPartner, setNewPartner] = useState({ name: '', logo: '', website: '' });

  // ── Fetch functions ──
  const fetchDashboard = async () => {
    try {
      const [{ data: dash }, { data: act }] = await Promise.all([
        api.get('/orders/stats/dashboard').catch(() => ({ data: null })),
        api.get('/activities/recent?limit=15').catch(() => ({ data: [] })),
      ]);
      setDashStats(dash);
      setRecentActivities(Array.isArray(act) ? act : []);
    } catch (e) { /* ignore */ }
  };

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const { data } = await api.get('/orders');
      setOrders(Array.isArray(data) ? data : []);
    } catch { setOrders([]); }
    finally { setOrdersLoading(false); }
  };

  const fetchDrivers = async () => {
    setDriversLoading(true);
    try {
      const { data } = await api.get('/drivers');
      setDrivers(Array.isArray(data) ? data : []);
    } catch { setDrivers([]); }
    finally { setDriversLoading(false); }
  };

  const fetchClients = async () => {
    setClientsLoading(true);
    try {
      const { data } = await api.get('/orders/clients');
      setClients(Array.isArray(data) ? data : []);
    } catch { setClients([]); }
    finally { setClientsLoading(false); }
  };

  const fetchAdmins = async () => {
    setAdminsLoading(true);
    try {
      const { data } = await api.get('/users');
      setAdmins(Array.isArray(data) ? data : []);
    } catch { setAdmins([]); }
    finally { setAdminsLoading(false); }
  };

  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchDashboard();
      fetchOrders();
      fetchDrivers();
    }
    if (activeTab === 'orders') fetchOrders();
    if (activeTab === 'drivers') fetchDrivers();
    if (activeTab === 'clients') fetchClients();
    if (activeTab === 'admins') fetchAdmins();
  }, [activeTab]);

  // ── Order actions ──
  const handleOrderUpdate = async (id, field, value) => {
    try {
      const { data } = await api.put(`/orders/${id}`, { [field]: value });
      setOrders(prev => prev.map(o => o._id === id ? data : o));
      if (selectedOrder?._id === id) setSelectedOrder(data);
    } catch (err) {
      alert(err.response?.data?.message || 'Xatolik');
    }
  };

  const handleDeleteOrder = async (id) => {
    if (!window.confirm("Buyurtmani o'chirishni tasdiqlaysizmi?")) return;
    try {
      await api.delete(`/orders/${id}`);
      setOrders(prev => prev.filter(o => o._id !== id));
      if (selectedOrder?._id === id) setSelectedOrder(null);
    } catch { alert('Xatolik'); }
  };

  // ── Driver actions ──
  const handleAddDriver = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/drivers', newDriver);
      const driver = data?.data || data;
      setDrivers(prev => [driver, ...prev]);
      setNewDriver({ name: '', email: '', phone: '', password: '', licenseNumber: '', vehicleType: 'Yuk mashinasi', vehicleNumber: '', avatar: '' });
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Xatolik');
    }
  };

  const handleDeleteDriver = async (id) => {
    if (!window.confirm("Haydovchini o'chirishni tasdiqlaysizmi?")) return;
    try {
      await api.delete(`/drivers/${id}`);
      setDrivers(prev => prev.filter(d => d._id !== id));
    } catch { alert('Xatolik'); }
  };

  const handleDriverStatus = async (id, status) => {
    try {
      const { data } = await api.put(`/drivers/${id}`, { status });
      setDrivers(prev => prev.map(d => d._id === id ? { ...d, status: data.status, isOnline: status === 'Faol' } : d));
    } catch { alert('Xatolik'); }
  };

  // ── Admin actions ──
  const handleAddAdmin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/users/admin-create', { ...newAdmin, role: 'admin' });
      const admin = data?.data || data;
      setAdmins(prev => [...prev, admin]);
      setNewAdmin({ name: '', email: '', password: '' });
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Xatolik');
    }
  };

  const handleDeleteAdmin = async (id) => {
    if (!window.confirm("Adminni o'chirishni tasdiqlaysizmi?")) return;
    try {
      await api.delete(`/users/${id}`);
      setAdmins(prev => prev.filter(a => a._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Xatolik');
    }
  };

  // ── Partner actions ──
  const handleAddPartner = async (e) => {
    e.preventDefault();
    try {
      await addPartner(newPartner);
      setNewPartner({ name: '', logo: '', website: '' });
    } catch (err) {
      alert(typeof err === 'string' ? err : err.message || 'Xatolik');
    }
  };

  // ── Stats ──
  const stats = [
    { label: "Jami Buyurtmalar", value: dashStats?.totals?.orders ?? orders.length, icon: Package, color: "blue", change: `${dashStats?.totals?.month ?? 0} shu oy` },
    { label: "Faol Haydovchilar", value: drivers.filter(d => d.status === 'Faol').length, icon: Truck, color: "orange", change: `${drivers.length} jami` },
    { label: "Klientlar", value: clients.length, icon: Users, color: "primary", change: dashStats?.totals?.clientsGrowth ? `+${dashStats.totals.clientsGrowth}%` : null },
    { label: "Daromad", value: `${(dashStats?.totals?.revenue || 0).toLocaleString()} so'm`, icon: TrendingUp, color: "green", change: "Bu oy" },
  ];

  // ── Sidebar tabs ──
  const tabs = [
    { id: "dashboard",  icon: LayoutDashboard, label: "Dashboard" },
    { id: "orders",     icon: Package,         label: "Buyurtmalar" },
    { id: "drivers",    icon: Truck,           label: "Haydovchilar" },
    { id: "clients",    icon: Users,           label: "Klientlar" },
    { id: "admins",     icon: ShieldCheck,     label: "Adminlar" },
    { id: "partners",   icon: Users,           label: "Hamkorlar" },
  ];

  const quickActions = [
    { icon: Plus,       label: "Yangi buyurtma",  color: "blue",   onClick: () => window.location.href = '/buyurtma' },
    { icon: UserPlus,   label: "Haydovchi qo'shish", color: "orange", onClick: () => setActiveTab('drivers') },
    { icon: Truck,      label: "Haydovchilar",    color: "orange", onClick: () => setActiveTab('drivers') },
    { icon: BarChart3,  label: "Statistika",      color: "purple", to: '/admin/statistics' },
    { icon: Activity,   label: "Faoliyat jurnali", color: "amber",  to: '/admin/activity-log' },
    { icon: Settings,   label: "Sozlamalar",      color: "slate",  to: '/admin/settings' },
  ];

  // ── Order filter logic ──
  const filteredOrders = orders.filter(o => {
    const matchSearch = !search ||
      o.trackingId?.toLowerCase().includes(search.toLowerCase()) ||
      o.from?.toLowerCase().includes(search.toLowerCase()) ||
      o.to?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = orderFilter === 'all' || o.status === orderFilter;
    return matchSearch && matchStatus;
  });

  const paginatedOrders = filteredOrders.slice(
    (orderPage - 1) * ORDER_PAGE_SIZE,
    orderPage * ORDER_PAGE_SIZE
  );
  const totalOrderPages = Math.max(1, Math.ceil(filteredOrders.length / ORDER_PAGE_SIZE));

  const inputCls = "w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 font-bold transition-all dark:text-white text-sm";

  return (
    <div className="pt-24 min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col lg:flex-row overflow-hidden transition-colors duration-300">

      {/* ── Sidebar ── */}
      <aside className="hidden lg:flex w-72 flex-col bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 p-8 fixed h-full z-20">
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-xl shadow-primary-500/20">
            <LayoutDashboard size={20} strokeWidth={2.5} />
          </div>
          <span className="font-black text-xl tracking-tighter uppercase italic text-slate-900 dark:text-white">
            Admin<span className="text-primary-600">Pro</span>
          </span>
        </div>

        <nav className="space-y-2 flex-1 overflow-y-auto">
          {tabs.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all group ${
                activeTab === item.id
                  ? "bg-primary-600 text-white shadow-xl shadow-primary-500/25"
                  : "text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <div className="flex items-center gap-4">
                <item.icon size={20} strokeWidth={activeTab === item.id ? 3 : 2} />
                {item.label}
              </div>
              {activeTab === item.id && <ChevronRight size={16} strokeWidth={3} />}
            </button>
          ))}

          <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <Link to="/admin/statistics" className="w-full flex items-center gap-4 px-5 py-3 rounded-2xl text-sm font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-all">
              <BarChart3 size={18} /> Statistika
            </Link>
            <Link to="/admin/activity-log" className="w-full flex items-center gap-4 px-5 py-3 rounded-2xl text-sm font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-all">
              <Activity size={18} /> Faoliyat
            </Link>
            <Link to="/admin/settings" className="w-full flex items-center gap-4 px-5 py-3 rounded-2xl text-sm font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-all">
              <Settings size={18} /> Sozlamalar
            </Link>
          </div>
        </nav>

        <button
          onClick={logout}
          className="flex items-center gap-4 px-6 py-4 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-2xl text-sm font-black uppercase tracking-widest transition-all mt-auto"
        >
          <LogOut size={20} strokeWidth={2.5} />
          Chiqish
        </button>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 lg:ml-72 p-6 md:p-10 overflow-y-auto w-full">

        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">
              {tabs.find(t => t.id === activeTab)?.label || 'Dashboard'}
            </h1>
            <div className="flex items-center gap-2 text-slate-400 font-bold text-sm uppercase tracking-widest mt-1">
              <Calendar className="w-4 h-4" />
              {new Date().toLocaleDateString('uz-UZ')}
            </div>
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-72 group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={18} />
              <input
                type="text"
                placeholder="Qidiruv..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/30 font-bold transition-all shadow-sm dark:text-white text-sm"
              />
            </div>
            <Link to="/notifications" className="w-12 h-12 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-slate-400 hover:text-primary-600 transition-all flex items-center justify-center relative shadow-sm">
              <Bell size={20} />
            </Link>
          </div>
        </header>

        <AnimatePresence mode="wait">

          {/* ══════════════ DASHBOARD ══════════════ */}
          {activeTab === "dashboard" && (
            <motion.div key="dashboard" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>

              {/* Statistika kartalari */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {stats.map((stat, idx) => (
                  <ThreeDCard key={idx}>
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl h-full">
                      <div className="flex justify-between items-start mb-6">
                        <Sticker icon={stat.icon} color={stat.color} size={22} />
                        {stat.change && (
                          <span className="text-xs font-black px-3 py-1.5 rounded-full tracking-widest bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400">
                            {stat.change}
                          </span>
                        )}
                      </div>
                      <div className="text-4xl font-black text-slate-900 dark:text-white mb-2 tracking-tighter">{stat.value}</div>
                      <div className="text-slate-400 font-bold text-xs uppercase tracking-widest">{stat.label}</div>
                    </div>
                  </ThreeDCard>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="mb-10">
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Tezkor amallar</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {quickActions.map((a, i) => {
                    const Icon = a.icon;
                    const cls = `bg-${a.color}-100 dark:bg-${a.color}-500/10 text-${a.color}-600 dark:text-${a.color}-400`;
                    const Wrapper = a.to ? Link : 'button';
                    const wrapperProps = a.to ? { to: a.to } : { onClick: a.onClick };
                    return (
                      <Wrapper key={i} {...wrapperProps} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:-translate-y-1 hover:shadow-xl transition-all flex flex-col items-center gap-3 text-center">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${cls}`}>
                          <Icon size={22} />
                        </div>
                        <span className="text-xs font-black text-slate-700 dark:text-slate-300 leading-tight">{a.label}</span>
                      </Wrapper>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-10">
                {/* So'nggi buyurtmalar */}
                <div className="xl:col-span-2 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden">
                  <div className="flex justify-between items-center p-8 border-b border-slate-50 dark:border-slate-800">
                    <h3 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">So'nggi buyurtmalar</h3>
                    <button onClick={() => setActiveTab('orders')} className="text-primary-600 font-black text-xs uppercase tracking-widest hover:underline flex items-center gap-1">
                      Barchasi <ArrowRight size={14} />
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50/50 dark:bg-slate-800/50">
                        <tr>
                          {['Tracking ID', 'Yo\'nalish', 'Holat', 'Sana'].map(h => (
                            <th key={h} className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                        {ordersLoading ? (
                          <tr><td colSpan={4} className="px-8 py-10 text-center text-slate-400 font-bold">Yuklanmoqda...</td></tr>
                        ) : (dashStats?.recentOrders || orders.slice(0, 5)).map(order => (
                          <tr key={order._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                            <td className="px-8 py-5 font-black text-primary-600 text-sm">{order.trackingId}</td>
                            <td className="px-8 py-5 font-bold text-slate-700 dark:text-slate-300 text-sm">{order.from} → {order.to}</td>
                            <td className="px-8 py-5"><StatusBadge status={order.status} /></td>
                            <td className="px-8 py-5 text-slate-400 font-bold text-sm">{order.createdAt ? format(new Date(order.createdAt), 'dd MMM') : '-'}</td>
                          </tr>
                        ))}
                        {!ordersLoading && orders.length === 0 && (
                          <tr><td colSpan={4} className="px-8 py-10 text-center text-slate-400 font-bold">Hozircha buyurtmalar yo'q</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden">
                  <div className="flex justify-between items-center p-8 border-b border-slate-50 dark:border-slate-800">
                    <h3 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">So'nggi faoliyat</h3>
                    <Link to="/admin/activity-log" className="text-primary-600 font-black text-xs uppercase tracking-widest hover:underline">Barchasi</Link>
                  </div>
                  <div className="p-4 max-h-[480px] overflow-y-auto">
                    {recentActivities.length === 0 ? (
                      <div className="text-center py-12 text-slate-400 font-bold text-sm">Faoliyat yo'q</div>
                    ) : recentActivities.map(a => {
                      const meta = ACTIVITY_META[a.type] || { icon: Activity, color: 'slate' };
                      const Icon = meta.icon;
                      return (
                        <div key={a._id} className="flex items-start gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl transition-colors">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${COLOR_CLASSES[meta.color]}`}>
                            <Icon size={16} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-700 dark:text-slate-300 line-clamp-2">{a.description}</p>
                            <p className="text-xs font-bold text-slate-400 mt-1">
                              {a.createdAt ? format(new Date(a.createdAt), 'dd MMM HH:mm') : ''}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ══════════════ ORDERS ══════════════ */}
          {activeTab === "orders" && (
            <motion.div key="orders" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 xl:grid-cols-3 gap-8">

              {/* Filters */}
              <div className="xl:col-span-3 flex flex-col md:flex-row gap-4 mb-2">
                <div className="flex gap-2 flex-wrap">
                  {ORDER_STATUSES.map(s => (
                    <button
                      key={s}
                      onClick={() => { setOrderFilter(s); setOrderPage(1); }}
                      className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                        orderFilter === s
                          ? 'bg-primary-600 text-white shadow-lg'
                          : 'bg-white dark:bg-slate-900 text-slate-500 border border-slate-100 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {s === 'all' ? 'Hammasi' : s}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => exportOrdersPdf(filteredOrders)}
                  className="md:ml-auto px-5 py-3 bg-green-600 text-white rounded-2xl font-black text-sm flex items-center gap-2 hover:bg-green-700 transition-all"
                >
                  <FileDown size={16} /> PDF eksport
                </button>
                <button onClick={fetchOrders} className="p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-slate-400 hover:text-primary-600 transition-all">
                  <RefreshCw size={18} />
                </button>
              </div>

              {/* Order list */}
              <div className="xl:col-span-2 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden">
                <div className="flex justify-between items-center p-8 border-b border-slate-50 dark:border-slate-800">
                  <h3 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                    Buyurtmalar ({filteredOrders.length})
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50/50 dark:bg-slate-800/50">
                      <tr>
                        {['Tracking', 'Yo\'nalish', 'Holat', 'Driver', 'Amal'].map(h => (
                          <th key={h} className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                      {ordersLoading ? (
                        <tr><td colSpan={5} className="px-8 py-10 text-center text-slate-400 font-bold">Yuklanmoqda...</td></tr>
                      ) : paginatedOrders.length === 0 ? (
                        <tr><td colSpan={5} className="px-8 py-16 text-center text-slate-400 font-bold">Buyurtmalar topilmadi</td></tr>
                      ) : paginatedOrders.map(order => (
                        <tr key={order._id} className={`hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer ${selectedOrder?._id === order._id ? 'bg-primary-50 dark:bg-primary-900/10' : ''}`}
                          onClick={() => setSelectedOrder(order)}>
                          <td className="px-6 py-4 font-black text-primary-600 text-xs">{order.trackingId}</td>
                          <td className="px-6 py-4 text-sm font-bold text-slate-700 dark:text-slate-300">{order.from} → {order.to}</td>
                          <td className="px-6 py-4"><StatusBadge status={order.status} /></td>
                          <td className="px-6 py-4 text-sm font-bold text-slate-400">{order.driver?.name || '—'}</td>
                          <td className="px-6 py-4">
                            <button onClick={(e) => { e.stopPropagation(); handleDeleteOrder(order._id); }}
                              className="w-9 h-9 bg-rose-50 dark:bg-rose-500/10 text-rose-500 rounded-xl flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all">
                              <Trash2 size={15} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {totalOrderPages > 1 && (
                  <div className="flex items-center justify-center gap-2 p-4 border-t border-slate-50 dark:border-slate-800">
                    <button onClick={() => setOrderPage(Math.max(1, orderPage - 1))} disabled={orderPage === 1}
                      className="px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-400 hover:text-primary-600 disabled:opacity-30 text-xs font-black">‹ Oldingi</button>
                    <span className="px-4 py-2 font-black text-sm">{orderPage} / {totalOrderPages}</span>
                    <button onClick={() => setOrderPage(Math.min(totalOrderPages, orderPage + 1))} disabled={orderPage === totalOrderPages}
                      className="px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-400 hover:text-primary-600 disabled:opacity-30 text-xs font-black">Keyingi ›</button>
                  </div>
                )}
              </div>

              {/* Order detail */}
              <div className="xl:col-span-1">
                {selectedOrder ? (
                  <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl sticky top-28 space-y-6">
                    <div className="flex justify-between items-start">
                      <h3 className="font-black text-xl text-slate-900 dark:text-white">Buyurtma tafsiloti</h3>
                      <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-slate-700 dark:hover:text-white">
                        <XCircle size={20} />
                      </button>
                    </div>

                    <div className="space-y-3 text-sm">
                      {[
                        { label: 'Tracking', value: selectedOrder.trackingId },
                        { label: 'Qayerdan', value: selectedOrder.from },
                        { label: 'Qayerga', value: selectedOrder.to },
                        { label: 'Yuk turi', value: selectedOrder.cargoType },
                        { label: 'Vazni', value: `${selectedOrder.weight} kg` },
                        { label: 'Mijoz ismi', value: selectedOrder.clientName || '—' },
                        { label: 'Telefon', value: selectedOrder.clientPhone || '—' },
                      ].map((item, i) => (
                        <div key={i} className="flex justify-between">
                          <span className="text-slate-400 font-bold uppercase tracking-widest text-xs">{item.label}</span>
                          <span className="font-black text-slate-900 dark:text-white text-xs">{item.value}</span>
                        </div>
                      ))}
                    </div>

                    <div className="h-px bg-slate-100 dark:bg-slate-800" />

                    {/* Holat o'zgartirish */}
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Holat</label>
                      <select
                        value={selectedOrder.status}
                        onChange={e => handleOrderUpdate(selectedOrder._id, 'status', e.target.value)}
                        className={inputCls}
                      >
                        {['Yangi', 'Qabul qilindi', "Yo'lda", 'Yetkazildi', 'Bekor qilindi'].map(s => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                    </div>

                    {/* Driver tayinlash */}
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Haydovchi tayinlash</label>
                      <select
                        value={selectedOrder.driver?._id || ''}
                        onChange={e => handleOrderUpdate(selectedOrder._id, 'driver', e.target.value || null)}
                        className={inputCls}
                      >
                        <option value="">— Tayinlanmagan —</option>
                        {drivers.filter(d => d.status !== 'Nofaol').map(d => (
                          <option key={d._id} value={d._id}>{d.name} ({d.status})</option>
                        ))}
                      </select>
                    </div>

                    {/* Narx */}
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Narx (so'm)</label>
                      <input
                        type="number"
                        defaultValue={selectedOrder.price || ''}
                        onBlur={e => handleOrderUpdate(selectedOrder._id, 'price', Number(e.target.value))}
                        placeholder="0"
                        className={inputCls}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border-2 border-dashed border-slate-100 dark:border-slate-800 text-center text-slate-400 font-bold py-20">
                    <Package size={40} className="mx-auto mb-4 opacity-30" />
                    <p className="text-sm uppercase tracking-widest">Buyurtmani tanlang</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ══════════════ DRIVERS ══════════════ */}
          {activeTab === "drivers" && (
            <motion.div key="drivers" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 xl:grid-cols-3 gap-8">

              {/* Add driver form */}
              <div className="xl:col-span-1">
                <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl sticky top-28">
                  <div className="flex items-center gap-3 mb-8">
                    <Sticker icon={Plus} color="orange" size={20} className="shadow-none p-2.5" />
                    <h3 className="font-black text-xl text-slate-900 dark:text-white">Yangi haydovchi</h3>
                  </div>
                  <form onSubmit={handleAddDriver} className="space-y-4">
                    {[
                      { label: "Ism sharifi", field: "name", type: "text", placeholder: "Ism..." },
                      { label: "Email", field: "email", type: "email", placeholder: "email@..." },
                      { label: "Telefon", field: "phone", type: "tel", placeholder: "+998..." },
                      { label: "Parol", field: "password", type: "password", placeholder: "••••••••" },
                      { label: "Guvohnoma raqami", field: "licenseNumber", type: "text", placeholder: "AB1234567" },
                      { label: "Mashina raqami", field: "vehicleNumber", type: "text", placeholder: "01 A 123 BC" },
                      { label: "Avatar URL", field: "avatar", type: "text", placeholder: "https://..." },
                    ].map(item => (
                      <div key={item.field} className="space-y-1">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">{item.label}</label>
                        <input
                          type={item.type}
                          placeholder={item.placeholder}
                          value={newDriver[item.field]}
                          onChange={e => setNewDriver(p => ({ ...p, [item.field]: e.target.value }))}
                          required={['name', 'email', 'phone', 'password'].includes(item.field)}
                          className={inputCls}
                        />
                      </div>
                    ))}
                    <div className="space-y-1">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Transport turi</label>
                      <select
                        value={newDriver.vehicleType}
                        onChange={e => setNewDriver(p => ({ ...p, vehicleType: e.target.value }))}
                        className={inputCls}
                      >
                        {['Yuk mashinasi', 'Mikroavtobus', 'Konteyner', 'Refrijerator'].map(v => <option key={v}>{v}</option>)}
                      </select>
                    </div>
                    <button type="submit" className="btn-primary w-full py-4 font-black mt-2">Saqlash</button>
                  </form>
                </div>
              </div>

              {/* Drivers list */}
              <div className="xl:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6 content-start">
                {driversLoading ? (
                  <div className="col-span-full text-center py-20 text-slate-400 font-bold">Yuklanmoqda...</div>
                ) : drivers.filter(d => !search || d.name.toLowerCase().includes(search.toLowerCase()) || d.phone?.includes(search)).map(driver => (
                  <div key={driver._id} className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl group">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="relative shrink-0">
                        {driver.avatar ? (
                          <img src={driver.avatar} alt={driver.name} className="w-14 h-14 rounded-2xl object-cover" />
                        ) : (
                          <div className="w-14 h-14 bg-orange-100 dark:bg-orange-500/10 rounded-2xl flex items-center justify-center">
                            <Truck size={24} className="text-orange-600 dark:text-orange-400" />
                          </div>
                        )}
                        {driver.isOnline && (
                          <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-slate-900" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-black text-slate-900 dark:text-white truncate">{driver.name}</h4>
                        <p className="text-xs font-bold text-slate-400 truncate">{driver.email}</p>
                      </div>
                      <StatusBadge status={driver.status} />
                    </div>

                    <div className="space-y-2 mb-4 text-xs">
                      {driver.phone && (
                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                          <Phone size={12} /> <span className="font-bold">{driver.phone}</span>
                        </div>
                      )}
                      {driver.vehicleNumber && (
                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                          <Truck size={12} /> <span className="font-bold">{driver.vehicleNumber}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                        <ShieldCheck size={12} /> <span className="font-bold">{driver.vehicleType || 'Yuk mashinasi'}</span>
                      </div>
                      {driver.isOnline !== undefined && (
                        <div className={`flex items-center gap-2 ${driver.isOnline ? 'text-green-600' : 'text-slate-400'}`}>
                          {driver.isOnline ? <Wifi size={12} /> : <WifiOff size={12} />}
                          <span className="font-bold">{driver.isOnline ? 'Online' : 'Offline'}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 flex-wrap">
                      {['Faol', 'Band', 'Nofaol'].map(s => (
                        <button
                          key={s}
                          onClick={() => handleDriverStatus(driver._id, s)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                            driver.status === s
                              ? 'bg-primary-600 text-white'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-slate-200'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                      <button
                        onClick={() => handleDeleteDriver(driver._id)}
                        className="ml-auto w-9 h-9 bg-rose-50 dark:bg-rose-500/10 text-rose-500 rounded-xl flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
                {!driversLoading && drivers.length === 0 && (
                  <div className="col-span-full py-20 text-center text-slate-400 font-black uppercase tracking-widest bg-white dark:bg-slate-900 rounded-[2.5rem] border-2 border-dashed border-slate-100 dark:border-slate-800">
                    Hozircha haydovchi yo'q
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ══════════════ CLIENTS ══════════════ */}
          {activeTab === "clients" && (
            <motion.div key="clients" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden">
                <div className="flex justify-between items-center p-8 border-b border-slate-50 dark:border-slate-800">
                  <h3 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">Klientlar ({clients.length})</h3>
                  <button onClick={fetchClients} className="p-2 text-slate-400 hover:text-primary-600 transition-colors">
                    <RefreshCw size={18} />
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50/50 dark:bg-slate-800/50">
                      <tr>
                        {['Ism', 'Email', 'Buyurtmalar', 'Sarflagan', 'Oxirgi buyurtma', 'Holat'].map(h => (
                          <th key={h} className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                      {clientsLoading ? (
                        <tr><td colSpan={6} className="px-8 py-10 text-center text-slate-400 font-bold">Yuklanmoqda...</td></tr>
                      ) : clients.filter(c => !search || c.name?.toLowerCase().includes(search.toLowerCase()) || c.email?.toLowerCase().includes(search.toLowerCase())).map(client => (
                        <tr key={client._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-primary-100 dark:bg-primary-500/10 rounded-2xl flex items-center justify-center text-primary-600 font-black text-sm">
                                {client.name?.[0]?.toUpperCase()}
                              </div>
                              <div>
                                <div className="font-black text-slate-900 dark:text-white text-sm">{client.name}</div>
                                {client.phone && <div className="text-xs font-bold text-slate-400">{client.phone}</div>}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5 font-bold text-slate-500 dark:text-slate-400 text-sm">{client.email}</td>
                          <td className="px-6 py-5">
                            <span className="font-black text-primary-600 text-sm">{client.ordersCount ?? 0}</span>
                          </td>
                          <td className="px-6 py-5 font-bold text-slate-500 dark:text-slate-400 text-sm">
                            {(client.totalSpent ?? 0).toLocaleString()} so'm
                          </td>
                          <td className="px-6 py-5 font-bold text-slate-400 text-sm">
                            {client.lastOrder ? (
                              <div>
                                <div>{client.lastOrder.trackingId}</div>
                                <div className="text-xs text-slate-400">{format(new Date(client.lastOrder.createdAt), 'dd MMM yyyy')}</div>
                              </div>
                            ) : '—'}
                          </td>
                          <td className="px-6 py-5">
                            <StatusBadge status={client.isVerified ? 'Faol' : 'Nofaol'} />
                          </td>
                        </tr>
                      ))}
                      {!clientsLoading && clients.length === 0 && (
                        <tr><td colSpan={6} className="px-8 py-16 text-center text-slate-400 font-bold">Hozircha klientlar yo'q</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* ══════════════ ADMINS ══════════════ */}
          {activeTab === "admins" && (
            <motion.div key="admins" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <div className="xl:col-span-1">
                <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl sticky top-28">
                  <div className="flex items-center gap-3 mb-8">
                    <Sticker icon={UserPlus} color="green" size={20} className="shadow-none p-2.5" />
                    <h3 className="font-black text-xl text-slate-900 dark:text-white">Yangi Admin</h3>
                  </div>
                  <form onSubmit={handleAddAdmin} className="space-y-4">
                    {[
                      { label: "Ism sharifi", field: "name", type: "text", placeholder: "Ism..." },
                      { label: "Email", field: "email", type: "email", placeholder: "admin@..." },
                      { label: "Parol", field: "password", type: "password", placeholder: "••••••••" },
                    ].map(item => (
                      <div key={item.field} className="space-y-1">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">{item.label}</label>
                        <input
                          type={item.type}
                          placeholder={item.placeholder}
                          value={newAdmin[item.field]}
                          onChange={e => setNewAdmin(p => ({ ...p, [item.field]: e.target.value }))}
                          required
                          className={inputCls}
                        />
                      </div>
                    ))}
                    <button type="submit" className="btn-primary w-full py-4 font-black mt-2">Saqlash</button>
                  </form>
                </div>
              </div>
              <div className="xl:col-span-2">
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50/50 dark:bg-slate-800/50">
                      <tr>
                        {['Admin', 'Role', 'Amal'].map(h => (
                          <th key={h} className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                      {adminsLoading ? (
                        <tr><td colSpan={3} className="px-8 py-10 text-center text-slate-400 font-bold">Yuklanmoqda...</td></tr>
                      ) : admins.map(a => (
                        <tr key={a._id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                          <td className="px-8 py-6">
                            <div className="font-black text-slate-900 dark:text-white">{a.name}</div>
                            <div className="text-sm font-bold text-slate-400">{a.email}</div>
                          </td>
                          <td className="px-8 py-6"><StatusBadge status={a.role || 'admin'} /></td>
                          <td className="px-8 py-6 text-right">
                            {a.role !== 'superadmin' && (
                              <button
                                onClick={() => handleDeleteAdmin(a._id)}
                                className="w-10 h-10 bg-rose-50 dark:bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center ml-auto hover:bg-rose-500 hover:text-white transition-all"
                              >
                                <Trash2 size={18} />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* ══════════════ PARTNERS ══════════════ */}
          {activeTab === "partners" && (
            <motion.div key="partners" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <div className="xl:col-span-1">
                <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl sticky top-28">
                  <div className="flex items-center gap-3 mb-8">
                    <Sticker icon={Plus} color="primary" size={20} className="shadow-none p-2.5" />
                    <h3 className="font-black text-xl text-slate-900 dark:text-white">Hamkor Qo'shish</h3>
                  </div>
                  <form onSubmit={handleAddPartner} className="space-y-4">
                    {[
                      { label: "Kompaniya nomi", field: "name", placeholder: "Google..." },
                      { label: "Logo URL", field: "logo", placeholder: "https://..." },
                      { label: "Veb-sayt", field: "website", placeholder: "www.example.com" },
                    ].map(item => (
                      <div key={item.field} className="space-y-1">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">{item.label}</label>
                        <input
                          type="text"
                          placeholder={item.placeholder}
                          value={newPartner[item.field]}
                          onChange={e => setNewPartner(p => ({ ...p, [item.field]: e.target.value }))}
                          required={item.field !== 'website'}
                          className={inputCls}
                        />
                      </div>
                    ))}
                    <button type="submit" className="btn-primary w-full py-4 font-black mt-2">Saqlash</button>
                  </form>
                </div>
              </div>
              <div className="xl:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6 content-start">
                {partners.map(p => (
                  <div key={p._id} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl flex flex-col group">
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-2xl p-4 flex items-center justify-center border border-slate-100 dark:border-slate-700">
                        <img src={p.logo} alt={p.name} className="max-h-full object-contain dark:invert" />
                      </div>
                      <button onClick={() => deletePartner(p._id)} className="w-10 h-10 bg-rose-50 dark:bg-rose-500/10 text-rose-500 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-500 hover:text-white">
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <h4 className="text-xl font-black text-slate-900 dark:text-white mb-2">{p.name}</h4>
                    {p.website && (
                      <a href={p.website} target="_blank" rel="noreferrer" className="text-primary-600 font-bold text-sm flex items-center gap-2 hover:underline">
                        Veb-sayt <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                ))}
                {partners.length === 0 && (
                  <div className="col-span-full py-20 text-center text-slate-400 font-black uppercase tracking-widest bg-white dark:bg-slate-900 rounded-[2.5rem] border-2 border-dashed border-slate-100 dark:border-slate-800">
                    Hozircha hamkorlar yo'q
                  </div>
                )}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
};

export default Admin;