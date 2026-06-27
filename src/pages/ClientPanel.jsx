import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package, MapPin, CheckCircle2, Clock, LogOut, RefreshCw,
  ChevronRight, Plus, Truck, LayoutDashboard, Search,
  ArrowRight, Shield, Zap, User, Bell
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import api from "../utils/api";

const StatusBadge = ({ status }) => {
  const map = {
    'Yangi':         'bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400',
    'Qabul qilindi': 'bg-yellow-100 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
    "Yo'lda":        'bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400',
    'Yetkazildi':    'bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400',
    'Bekor qilindi': 'bg-rose-100 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400',
  };
  return (
    <span className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest ${map[status] || 'bg-slate-100 text-slate-500'}`}>
      {status}
    </span>
  );
};

const STATUS_STEPS = ['Yangi', 'Qabul qilindi', "Yo'lda", 'Yetkazildi'];

const ClientPanel = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [search, setSearch] = useState("");

  const fetchMyOrders = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/orders/my-orders');
      // api.js interceptor normalized
      setOrders(Array.isArray(data) ? data : []);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyOrders();
  }, []);

  const stats = {
    total: orders.length,
    active: orders.filter(o => o.status === "Yo'lda" || o.status === 'Qabul qilindi' || o.status === 'Yangi').length,
    delivered: orders.filter(o => o.status === 'Yetkazildi').length,
    cancelled: orders.filter(o => o.status === 'Bekor qilindi').length,
  };

  const tabs = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'orders',    icon: Package,         label: 'Buyurtmalarim' },
    { id: 'new',       icon: Plus,            label: 'Yangi buyurtma' },
  ];

  const currentStepIndex = (status) => STATUS_STEPS.indexOf(status);

  return (
    <div className="pt-24 min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col lg:flex-row">

      {/* Sidebar */}
      <aside className="hidden lg:flex w-72 flex-col bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 p-8 fixed h-full z-20">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary-500/20">
            <User size={24} strokeWidth={2.5} />
          </div>
          <div>
            <div className="font-black text-slate-900 dark:text-white tracking-tight">Mijoz</div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Panel</div>
          </div>
        </div>

        {/* User info */}
        <div className="p-5 bg-primary-50 dark:bg-primary-500/10 rounded-3xl border border-primary-100 dark:border-primary-500/20 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center text-white font-black text-lg">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <div className="font-black text-slate-900 dark:text-white text-sm">{user?.name}</div>
              <div className="text-xs font-bold text-primary-600">{user?.email}</div>
            </div>
          </div>
        </div>

        <nav className="space-y-2 flex-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all ${
                activeTab === tab.id
                  ? 'bg-primary-600 text-white shadow-xl shadow-primary-500/25'
                  : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <tab.icon size={18} strokeWidth={activeTab === tab.id ? 3 : 2} />
                {tab.label}
              </div>
              {activeTab === tab.id && <ChevronRight size={16} strokeWidth={3} />}
            </button>
          ))}
        </nav>

        <button
          onClick={logout}
          className="flex items-center gap-3 px-5 py-4 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-2xl text-sm font-black uppercase tracking-widest transition-all mt-auto"
        >
          <LogOut size={18} />
          Chiqish
        </button>
      </aside>

      {/* Main */}
      <main className="flex-1 lg:ml-72 p-6 md:p-10">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">
              {activeTab === 'dashboard' ? `Salom, ${user?.name?.split(' ')[0]}!` :
               activeTab === 'orders' ? 'Buyurtmalarim' : 'Yangi buyurtma'}
            </h1>
            <p className="text-slate-400 font-bold text-sm mt-1">
              {new Date().toLocaleDateString('uz-UZ', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <button onClick={fetchMyOrders} className="p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-slate-400 hover:text-primary-600 transition-all shadow-sm">
            <RefreshCw size={20} />
          </button>
        </div>

        <AnimatePresence mode="wait">

          {/* DASHBOARD */}
          {activeTab === 'dashboard' && (
            <motion.div key="dash" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: "Jami", value: stats.total, color: "bg-blue-50 dark:bg-blue-500/10 text-blue-600", icon: Package },
                  { label: "Faol", value: stats.active, color: "bg-orange-50 dark:bg-orange-500/10 text-orange-600", icon: Clock },
                  { label: "Yetkazildi", value: stats.delivered, color: "bg-green-50 dark:bg-green-500/10 text-green-600", icon: CheckCircle2 },
                  { label: "Bekor", value: stats.cancelled, color: "bg-rose-50 dark:bg-rose-500/10 text-rose-600", icon: Package },
                ].map((stat, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                    className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-xl">
                    <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center mb-4`}>
                      <stat.icon size={22} />
                    </div>
                    <div className="text-3xl font-black text-slate-900 dark:text-white mb-1 tracking-tighter">{stat.value}</div>
                    <div className="text-slate-400 font-bold text-xs uppercase tracking-widest">{stat.label}</div>
                  </motion.div>
                ))}
              </div>

              {/* So'nggi buyurtmalar */}
              <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden">
                <div className="flex justify-between items-center p-8 border-b border-slate-50 dark:border-slate-800">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">So'nggi buyurtmalar</h3>
                  <button onClick={() => setActiveTab('orders')} className="text-primary-600 font-black text-xs uppercase tracking-widest flex items-center gap-1 hover:underline">
                    Barchasi <ArrowRight size={14} />
                  </button>
                </div>
                <div className="divide-y divide-slate-50 dark:divide-slate-800">
                  {loading ? (
                    <div className="p-10 text-center text-slate-400 font-bold">Yuklanmoqda...</div>
                  ) : orders.slice(0, 4).map(order => (
                    <div key={order._id}
                      onClick={() => { setSelectedOrder(order); setActiveTab('orders'); }}
                      className="p-6 flex items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary-100 dark:bg-primary-500/10 rounded-2xl flex items-center justify-center text-primary-600 shrink-0">
                          <Package size={20} />
                        </div>
                        <div>
                          <div className="font-black text-slate-900 dark:text-white text-sm">{order.trackingId}</div>
                          <div className="text-slate-400 font-bold text-xs">{order.from} → {order.to}</div>
                        </div>
                      </div>
                      <StatusBadge status={order.status} />
                    </div>
                  ))}
                  {!loading && orders.length === 0 && (
                    <div className="p-12 text-center">
                      <Package size={40} className="mx-auto mb-4 text-slate-200 dark:text-slate-700" />
                      <p className="text-slate-400 font-bold mb-4">Hali buyurtma yo'q</p>
                      <button onClick={() => setActiveTab('new')} className="btn-primary py-3 px-6 text-sm font-black">
                        Birinchi buyurtma <ArrowRight size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button onClick={() => setActiveTab('new')}
                  className="p-8 bg-gradient-to-br from-primary-600 to-indigo-700 rounded-[2.5rem] text-white text-left group hover:shadow-2xl hover:shadow-primary-500/20 transition-all">
                  <Plus size={32} className="mb-4 group-hover:scale-110 transition-transform" />
                  <div className="text-2xl font-black mb-2">Yangi buyurtma</div>
                  <div className="text-white/70 font-medium text-sm">Yuk tashishga buyurtma bering</div>
                </button>
                <Link to="/kuzatish"
                  className="p-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] text-left group hover:shadow-2xl hover:border-primary-200 transition-all">
                  <Search size={32} className="mb-4 text-primary-600 group-hover:scale-110 transition-transform" />
                  <div className="text-2xl font-black text-slate-900 dark:text-white mb-2">Yukni kuzatish</div>
                  <div className="text-slate-400 font-medium text-sm">Tracking ID orqali kuzating</div>
                </Link>
              </div>
            </motion.div>
          )}

          {/* ORDERS */}
          {activeTab === 'orders' && (
            <motion.div key="orders" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 xl:grid-cols-3 gap-8">

              {/* List */}
              <div className="xl:col-span-2 space-y-4">
                <div className="relative">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text"
                    placeholder="Tracking ID yoki yo'nalish..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full pl-12 pr-6 py-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/30 font-bold text-sm dark:text-white shadow-sm"
                  />
                </div>

                {loading ? (
                  <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-10 text-center text-slate-400 font-bold border border-slate-100 dark:border-slate-800">
                    Yuklanmoqda...
                  </div>
                ) : orders.filter(o =>
                    !search || o.trackingId?.includes(search) ||
                    o.from?.toLowerCase().includes(search.toLowerCase()) ||
                    o.to?.toLowerCase().includes(search.toLowerCase())
                  ).map(order => (
                  <motion.div
                    key={order._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => setSelectedOrder(order)}
                    className={`bg-white dark:bg-slate-900 p-6 rounded-[2rem] border-2 cursor-pointer transition-all shadow-sm hover:shadow-xl ${
                      selectedOrder?._id === order._id
                        ? 'border-primary-400 shadow-primary-500/10'
                        : 'border-slate-100 dark:border-slate-800'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="font-black text-primary-600 text-sm mb-1">{order.trackingId}</div>
                        <div className="text-xs text-slate-400 font-bold">{new Date(order.createdAt).toLocaleDateString('uz-UZ')}</div>
                      </div>
                      <StatusBadge status={order.status} />
                    </div>
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                      <MapPin size={14} className="text-slate-400 shrink-0" />
                      {order.from} → {order.to}
                    </div>
                    <div className="text-xs font-bold text-slate-400">{order.cargoType} · {order.weight} kg {order.price ? `· $${order.price}` : ''}</div>
                  </motion.div>
                ))}

                {!loading && orders.length === 0 && (
                  <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-16 text-center border-2 border-dashed border-slate-100 dark:border-slate-800">
                    <Package size={48} className="mx-auto mb-4 text-slate-200 dark:text-slate-700" />
                    <p className="text-slate-400 font-black uppercase tracking-widest text-sm mb-4">Buyurtmalar yo'q</p>
                    <button onClick={() => setActiveTab('new')} className="btn-primary py-3 px-6 text-sm font-black">
                      Yangi buyurtma <ArrowRight size={16} />
                    </button>
                  </div>
                )}
              </div>

              {/* Detail / Tracking */}
              <div className="xl:col-span-1">
                {selectedOrder ? (
                  <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl sticky top-28 space-y-6">
                    <div>
                      <h3 className="font-black text-xl text-slate-900 dark:text-white mb-1">Kuzatish</h3>
                      <div className="text-primary-600 font-black text-sm">{selectedOrder.trackingId}</div>
                    </div>

                    {/* Info */}
                    <div className="space-y-2">
                      {[
                        { label: 'Qayerdan', value: selectedOrder.from },
                        { label: 'Qayerga', value: selectedOrder.to },
                        { label: 'Yuk', value: `${selectedOrder.cargoType} · ${selectedOrder.weight} kg` },
                        { label: 'Haydovchi', value: selectedOrder.driver?.name || 'Tayinlanmagan' },
                        { label: 'Narx', value: selectedOrder.price ? `$${selectedOrder.price}` : 'Aniqlanmoqda' },
                      ].map((item, i) => (
                        <div key={i} className="flex justify-between py-2 border-b border-slate-50 dark:border-slate-800">
                          <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{item.label}</span>
                          <span className="font-black text-slate-900 dark:text-white text-xs text-right">{item.value}</span>
                        </div>
                      ))}
                    </div>

                    {/* Progress */}
                    {selectedOrder.status !== 'Bekor qilindi' && (
                      <div className="space-y-4">
                        <div className="text-xs font-black text-slate-400 uppercase tracking-widest">Holat</div>
                        <div className="relative">
                          <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-slate-100 dark:bg-slate-700" />
                          <div className="space-y-6">
                            {STATUS_STEPS.map((step, idx) => {
                              const done = idx <= currentStepIndex(selectedOrder.status);
                              const current = idx === currentStepIndex(selectedOrder.status);
                              return (
                                <div key={idx} className="relative flex gap-4 items-center">
                                  <div className={`z-10 w-10 h-10 rounded-xl flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-md transition-all ${
                                    done ? 'bg-primary-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-300'
                                  } ${current ? 'ring-2 ring-primary-200 dark:ring-primary-900 scale-110' : ''}`}>
                                    {done ? <CheckCircle2 size={18} strokeWidth={3} /> : <div className="w-2 h-2 rounded-full bg-current" />}
                                  </div>
                                  <div>
                                    <div className={`text-sm font-black ${done ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-600'}`}>{step}</div>
                                    {current && <div className="text-xs font-bold text-primary-600">Hozirgi holat</div>}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border-2 border-dashed border-slate-100 dark:border-slate-800 text-center py-20">
                    <Package size={40} className="mx-auto mb-4 text-slate-200 dark:text-slate-700" />
                    <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Buyurtmani tanlang</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* NEW ORDER */}
          {activeTab === 'new' && (
            <motion.div key="new" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl">
              <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-xl">
                <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium">
                  Buyurtma berish sahifasiga o'tasiz
                </p>
                <Link to="/buyurtma" className="btn-primary py-5 px-8 text-lg font-black flex items-center gap-3 w-fit">
                  Buyurtma sahifasi
                  <ArrowRight size={22} strokeWidth={3} />
                </Link>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
};

export default ClientPanel;