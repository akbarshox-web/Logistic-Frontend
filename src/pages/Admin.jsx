import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, Package, TrendingUp, LayoutDashboard, Settings,
  LogOut, Search, Bell, ChevronRight, Zap, UserPlus, Trash2,
  Calendar, Plus, ExternalLink, Image as ImageIcon, ArrowRight,
  ShieldCheck, Truck, Eye, CheckCircle2, Clock, XCircle, RefreshCw,
  Phone, Mail, MapPin
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { usePartners } from "../context/PartnerContext";
import Sticker from "../components/ui/Sticker";
import ThreeDCard from "../components/ui/ThreeDCard";
import api from "../utils/api";

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
  };
  return (
    <span className={`px-3 py-1 rounded-xl text-xs font-black uppercase tracking-widest ${map[status] || map['Nofaol']}`}>
      {status}
    </span>
  );
};

// ── Main Component ────────────────────────────────────────────
const Admin = () => {
  const { user, logout } = useAuth();
  const { partners, addPartner, deletePartner } = usePartners();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [search, setSearch] = useState("");

  // Orders
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Drivers
  const [drivers, setDrivers] = useState([]);
  const [driversLoading, setDriversLoading] = useState(false);
  const [newDriver, setNewDriver] = useState({ name: '', email: '', phone: '', password: '', licenseNumber: '', vehicleType: 'Yuk mashinasi' });

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
    if (activeTab === 'dashboard') { fetchOrders(); fetchDrivers(); }
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
      setDrivers(prev => [data, ...prev]);
      setNewDriver({ name: '', email: '', phone: '', password: '', licenseNumber: '', vehicleType: 'Yuk mashinasi' });
    } catch (err) {
      alert(err.response?.data?.message || 'Xatolik');
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
      setDrivers(prev => prev.map(d => d._id === id ? { ...d, status: data.status } : d));
    } catch { alert('Xatolik'); }
  };

  // ── Admin actions ──
  const handleAddAdmin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/users', { ...newAdmin, role: 'admin' });
      setAdmins(prev => [...prev, data]);
      setNewAdmin({ name: '', email: '', password: '' });
    } catch (err) {
      alert(err.response?.data?.message || 'Xatolik');
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
    { label: "Jami Buyurtmalar", value: orders.length, icon: Package, color: "blue", change: "+12%" },
    { label: "Haydovchilar", value: drivers.length, icon: Truck, color: "orange", change: `${drivers.filter(d => d.status === 'Faol').length} faol` },
    { label: "Klientlar", value: clients.length, icon: Users, color: "primary", change: "+5%" },
    { label: "Hamkorlar", value: partners.length, icon: ShieldCheck, color: "green", change: "+2%" },
  ];

  // ── Sidebar tabs ──
  const tabs = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { id: "orders",    icon: Package,         label: "Buyurtmalar" },
    { id: "drivers",   icon: Truck,           label: "Haydovchilar" },
    { id: "clients",   icon: Users,           label: "Klientlar" },
    { id: "admins",    icon: ShieldCheck,     label: "Adminlar" },
    { id: "partners",  icon: Users,           label: "Hamkorlar" },
  ];

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

        <nav className="space-y-2 flex-1">
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
            <button className="w-12 h-12 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-slate-400 hover:text-primary-600 transition-all flex items-center justify-center relative shadow-sm">
              <Bell size={20} />
              <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900" />
            </button>
          </div>
        </header>

        <AnimatePresence mode="wait">

          {/* ══════════════ DASHBOARD ══════════════ */}
          {activeTab === "dashboard" && (
            <motion.div key="dashboard" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {stats.map((stat, idx) => (
                  <ThreeDCard key={idx}>
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl h-full">
                      <div className="flex justify-between items-start mb-6">
                        <Sticker icon={stat.icon} color={stat.color} size={22} />
                        <span className="text-xs font-black px-3 py-1.5 rounded-full tracking-widest bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400">
                          {stat.change}
                        </span>
                      </div>
                      <div className="text-4xl font-black text-slate-900 dark:text-white mb-2 tracking-tighter">{stat.value}</div>
                      <div className="text-slate-400 font-bold text-xs uppercase tracking-widest">{stat.label}</div>
                    </div>
                  </ThreeDCard>
                ))}
              </div>

              {/* So'nggi buyurtmalar */}
              <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden">
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
                        {['Tracking ID', 'Qayerdan → Qayerga', 'Holat', 'Sana'].map(h => (
                          <th key={h} className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                      {ordersLoading ? (
                        <tr><td colSpan={4} className="px-8 py-10 text-center text-slate-400 font-bold">Yuklanmoqda...</td></tr>
                      ) : orders.slice(0, 5).map(order => (
                        <tr key={order._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                          <td className="px-8 py-5 font-black text-primary-600 text-sm">{order.trackingId}</td>
                          <td className="px-8 py-5 font-bold text-slate-700 dark:text-slate-300 text-sm">{order.from} → {order.to}</td>
                          <td className="px-8 py-5"><StatusBadge status={order.status} /></td>
                          <td className="px-8 py-5 text-slate-400 font-bold text-sm">{new Date(order.createdAt).toLocaleDateString('uz-UZ')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* ══════════════ ORDERS ══════════════ */}
          {activeTab === "orders" && (
            <motion.div key="orders" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 xl:grid-cols-3 gap-8">

              {/* Order list */}
              <div className="xl:col-span-2 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden">
                <div className="flex justify-between items-center p-8 border-b border-slate-50 dark:border-slate-800">
                  <h3 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">Buyurtmalar ({orders.length})</h3>
                  <button onClick={fetchOrders} className="p-2 text-slate-400 hover:text-primary-600 transition-colors">
                    <RefreshCw size={18} />
                  </button>
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
                      ) : orders.filter(o =>
                          !search || o.trackingId?.includes(search) || o.from?.toLowerCase().includes(search.toLowerCase()) || o.to?.toLowerCase().includes(search.toLowerCase())
                        ).map(order => (
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
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Narx ($)</label>
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
                ) : drivers.filter(d => !search || d.name.toLowerCase().includes(search.toLowerCase())).map(driver => (
                  <div key={driver._id} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl group">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-14 h-14 bg-orange-100 dark:bg-orange-500/10 rounded-2xl flex items-center justify-center">
                        <Truck size={24} className="text-orange-600 dark:text-orange-400" />
                      </div>
                      <StatusBadge status={driver.status} />
                    </div>
                    <h4 className="text-xl font-black text-slate-900 dark:text-white mb-1">{driver.name}</h4>
                    <p className="text-sm font-bold text-slate-400 mb-1">{driver.email}</p>
                    <p className="text-sm font-bold text-slate-400 mb-1">{driver.phone}</p>
                    <p className="text-xs font-bold text-slate-300 dark:text-slate-600 mb-4">{driver.vehicleType}</p>

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
                        {['Ism', 'Email', "Ro'yxatdan o'tgan", 'Holat'].map(h => (
                          <th key={h} className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                      {clientsLoading ? (
                        <tr><td colSpan={4} className="px-8 py-10 text-center text-slate-400 font-bold">Yuklanmoqda...</td></tr>
                      ) : clients.filter(c => !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase())).map(client => (
                        <tr key={client._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-primary-100 dark:bg-primary-500/10 rounded-2xl flex items-center justify-center text-primary-600 font-black text-sm">
                                {client.name[0]?.toUpperCase()}
                              </div>
                              <div>
                                <div className="font-black text-slate-900 dark:text-white text-sm">{client.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-5 font-bold text-slate-500 dark:text-slate-400 text-sm">{client.email}</td>
                          <td className="px-8 py-5 font-bold text-slate-400 text-sm">{new Date(client.createdAt).toLocaleDateString('uz-UZ')}</td>
                          <td className="px-8 py-5">
                            <StatusBadge status={client.isVerified ? 'Faol' : 'Nofaol'} />
                          </td>
                        </tr>
                      ))}
                      {!clientsLoading && clients.length === 0 && (
                        <tr><td colSpan={4} className="px-8 py-16 text-center text-slate-400 font-bold">Hozircha klientlar yo'q</td></tr>
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
                          <td className="px-8 py-6"><StatusBadge status={a.role === 'superadmin' ? 'Faol' : 'Band'} /></td>
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