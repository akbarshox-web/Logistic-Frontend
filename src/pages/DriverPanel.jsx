import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Truck, Package, MapPin, CheckCircle2, Clock, LogOut,
  RefreshCw, ChevronRight, AlertCircle, Zap, LayoutDashboard,
  Navigation, Phone, User, TrendingUp
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
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

const DriverPanel = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchMyOrders = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/drivers/my-orders');
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

  const handleStatusUpdate = async (orderId, status) => {
    setUpdatingId(orderId);
    try {
      const { data } = await api.put(`/drivers/orders/${orderId}`, { status });
      // data = { _id, status, trackingId } (interceptor normalized)
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: data.status } : o));
      if (selectedOrder?._id === orderId) setSelectedOrder(prev => ({ ...prev, status: data.status }));
    } catch {
      alert('Holatni yangilashda xato');
    } finally {
      setUpdatingId(null);
    }
  };

  // Statistika
  const stats = {
    total: orders.length,
    active: orders.filter(o => o.status === "Yo'lda" || o.status === 'Qabul qilindi').length,
    delivered: orders.filter(o => o.status === 'Yetkazildi').length,
    totalWeight: orders.reduce((sum, o) => sum + (Number(o.weight) || 0), 0),
  };

  const tabs = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'orders',    icon: Package,         label: 'Buyurtmalar' },
    { id: 'active',    icon: Navigation,      label: 'Faol' },
  ];

  return (
    <div className="pt-24 min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col lg:flex-row">

      {/* Sidebar */}
      <aside className="hidden lg:flex w-72 flex-col bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 p-8 fixed h-full z-20">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-orange-500/20">
            <Truck size={24} strokeWidth={2.5} />
          </div>
          <div>
            <div className="font-black text-slate-900 dark:text-white tracking-tight">Haydovchi</div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Panel</div>
          </div>
        </div>

        {/* Driver info */}
        <div className="p-5 bg-orange-50 dark:bg-orange-500/10 rounded-3xl border border-orange-100 dark:border-orange-500/20 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center text-white font-black text-lg">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <div className="font-black text-slate-900 dark:text-white text-sm">{user?.name}</div>
              <div className="text-xs font-bold text-orange-500">Haydovchi</div>
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
                  ? 'bg-orange-500 text-white shadow-xl shadow-orange-500/25'
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

        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">
              {activeTab === 'dashboard' ? `Xush kelibsiz, ${user?.name?.split(' ')[0]}!` :
               activeTab === 'orders' ? 'Barcha buyurtmalar' : 'Faol buyurtmalar'}
            </h1>
            <p className="text-slate-400 font-bold text-sm mt-1">{new Date().toLocaleDateString('uz-UZ', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <button onClick={fetchMyOrders} className="p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-slate-400 hover:text-orange-500 transition-all shadow-sm">
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
                  { label: "Jami buyurtma", value: stats.total, icon: Package, color: "bg-blue-500", light: "bg-blue-50 dark:bg-blue-500/10 text-blue-600" },
                  { label: "Faol", value: stats.active, icon: Navigation, color: "bg-orange-500", light: "bg-orange-50 dark:bg-orange-500/10 text-orange-600" },
                  { label: "Yetkazildi", value: stats.delivered, icon: CheckCircle2, color: "bg-green-500", light: "bg-green-50 dark:bg-green-500/10 text-green-600" },
                  { label: "Jami yuk (kg)", value: stats.totalWeight, icon: TrendingUp, color: "bg-purple-500", light: "bg-purple-50 dark:bg-purple-500/10 text-purple-600" },
                ].map((stat, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                    className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-xl">
                    <div className={`w-12 h-12 ${stat.light} rounded-2xl flex items-center justify-center mb-4`}>
                      <stat.icon size={22} />
                    </div>
                    <div className="text-3xl font-black text-slate-900 dark:text-white mb-1 tracking-tighter">{stat.value}</div>
                    <div className="text-slate-400 font-bold text-xs uppercase tracking-widest">{stat.label}</div>
                  </motion.div>
                ))}
              </div>

              {/* Faol buyurtmalar */}
              <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden">
                <div className="p-8 border-b border-slate-50 dark:border-slate-800">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">Faol buyurtmalar</h3>
                </div>
                <div className="divide-y divide-slate-50 dark:divide-slate-800">
                  {loading ? (
                    <div className="p-10 text-center text-slate-400 font-bold">Yuklanmoqda...</div>
                  ) : orders.filter(o => o.status !== 'Yetkazildi' && o.status !== 'Bekor qilindi').length === 0 ? (
                    <div className="p-10 text-center text-slate-400 font-bold">Faol buyurtmalar yo'q</div>
                  ) : orders.filter(o => o.status !== 'Yetkazildi' && o.status !== 'Bekor qilindi').map(order => (
                    <div key={order._id} className="p-6 flex items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-orange-100 dark:bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-500 shrink-0">
                          <Truck size={20} />
                        </div>
                        <div>
                          <div className="font-black text-slate-900 dark:text-white text-sm">{order.trackingId}</div>
                          <div className="text-slate-400 font-bold text-xs mt-0.5">{order.from} → {order.to}</div>
                          <div className="text-slate-300 dark:text-slate-600 font-bold text-xs">{order.weight} kg · {order.cargoType}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <StatusBadge status={order.status} />
                        <button
                          onClick={() => { setSelectedOrder(order); setActiveTab('orders'); }}
                          className="p-2 text-slate-400 hover:text-orange-500 transition-colors"
                        >
                          <ChevronRight size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ORDERS */}
          {(activeTab === 'orders' || activeTab === 'active') && (
            <motion.div key="orders" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 xl:grid-cols-3 gap-8">

              {/* List */}
              <div className="xl:col-span-2 space-y-4">
                {loading ? (
                  <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 text-center text-slate-400 font-bold border border-slate-100 dark:border-slate-800">
                    Yuklanmoqda...
                  </div>
                ) : (activeTab === 'active'
                    ? orders.filter(o => o.status !== 'Yetkazildi' && o.status !== 'Bekor qilindi')
                    : orders
                  ).map(order => (
                  <motion.div
                    key={order._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() => setSelectedOrder(order)}
                    className={`bg-white dark:bg-slate-900 p-6 rounded-[2rem] border-2 cursor-pointer transition-all shadow-sm hover:shadow-xl ${
                      selectedOrder?._id === order._id
                        ? 'border-orange-400 shadow-orange-500/10'
                        : 'border-slate-100 dark:border-slate-800 hover:border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-black text-primary-600 text-sm">{order.trackingId}</span>
                      <StatusBadge status={order.status} />
                    </div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 text-sm font-black text-slate-900 dark:text-white">
                          <MapPin size={14} className="text-slate-400" />
                          {order.from}
                        </div>
                        <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 ml-[7px] my-1" />
                        <div className="flex items-center gap-2 text-sm font-black text-slate-900 dark:text-white">
                          <MapPin size={14} className="text-orange-500" />
                          {order.to}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-black text-slate-900 dark:text-white">{order.weight} <span className="text-sm text-slate-400">kg</span></div>
                        <div className="text-xs font-bold text-slate-400">{order.cargoType}</div>
                      </div>
                    </div>
                    {order.clientPhone && (
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                        <Phone size={12} />
                        {order.clientPhone}
                      </div>
                    )}
                  </motion.div>
                ))}
                {!loading && orders.length === 0 && (
                  <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-16 text-center border-2 border-dashed border-slate-100 dark:border-slate-800">
                    <Package size={48} className="mx-auto mb-4 text-slate-200 dark:text-slate-700" />
                    <p className="text-slate-400 font-black uppercase tracking-widest text-sm">Buyurtmalar yo'q</p>
                  </div>
                )}
              </div>

              {/* Detail */}
              <div className="xl:col-span-1">
                {selectedOrder ? (
                  <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl sticky top-28 space-y-6">
                    <h3 className="font-black text-xl text-slate-900 dark:text-white">Buyurtma #{selectedOrder.trackingId}</h3>

                    <div className="space-y-3">
                      {[
                        { label: 'Qayerdan', value: selectedOrder.from },
                        { label: 'Qayerga', value: selectedOrder.to },
                        { label: 'Yuk turi', value: selectedOrder.cargoType },
                        { label: 'Vazni', value: `${selectedOrder.weight} kg` },
                        { label: 'Mijoz', value: selectedOrder.clientName || '—' },
                        { label: 'Telefon', value: selectedOrder.clientPhone || '—' },
                        { label: 'Narx', value: selectedOrder.price ? `$${selectedOrder.price}` : '—' },
                      ].map((item, i) => (
                        <div key={i} className="flex justify-between items-center py-2 border-b border-slate-50 dark:border-slate-800">
                          <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{item.label}</span>
                          <span className="font-black text-slate-900 dark:text-white text-sm">{item.value}</span>
                        </div>
                      ))}
                    </div>

                    {/* Holat o'zgartirish */}
                    <div className="space-y-3">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Holatni yangilash</label>
                      <div className="grid grid-cols-1 gap-2">
                        {['Qabul qilindi', "Yo'lda", 'Yetkazildi'].map(status => (
                          <button
                            key={status}
                            onClick={() => handleStatusUpdate(selectedOrder._id, status)}
                            disabled={updatingId === selectedOrder._id || selectedOrder.status === status}
                            className={`py-3 px-4 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 ${
                              selectedOrder.status === status
                                ? 'bg-orange-500 text-white'
                                : 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-orange-50 hover:text-orange-500 dark:hover:bg-orange-500/10'
                            }`}
                          >
                            {updatingId === selectedOrder._id && selectedOrder.status !== status ? (
                              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                                <RefreshCw size={16} />
                              </motion.div>
                            ) : (
                              <>
                                {status === 'Qabul qilindi' && <CheckCircle2 size={16} />}
                                {status === "Yo'lda" && <Truck size={16} />}
                                {status === 'Yetkazildi' && <CheckCircle2 size={16} />}
                                {status}
                              </>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {selectedOrder.clientPhone && (
                      <a
                        href={`tel:${selectedOrder.clientPhone}`}
                        className="flex items-center justify-center gap-2 w-full py-4 bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 rounded-2xl font-black text-sm hover:bg-green-100 transition-all"
                      >
                        <Phone size={16} />
                        Mijozga qo'ng'iroq
                      </a>
                    )}
                  </div>
                ) : (
                  <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border-2 border-dashed border-slate-100 dark:border-slate-800 text-center py-20">
                    <Truck size={40} className="mx-auto mb-4 text-slate-200 dark:text-slate-700" />
                    <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Buyurtmani tanlang</p>
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

export default DriverPanel;