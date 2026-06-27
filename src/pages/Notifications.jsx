import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell, Check, CheckCheck, Trash2, Filter, Package, Truck,
  CheckCircle2, XCircle, Info, Megaphone, RefreshCw
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import { formatDateSync as format } from "../utils/dateUtil";

const TYPE_META = {
  order_created:    { icon: Package,     color: 'blue' },
  order_accepted:   { icon: Check,       color: 'yellow' },
  order_in_transit: { icon: Truck,       color: 'orange' },
  order_delivered:  { icon: CheckCircle2, color: 'green' },
  order_cancelled:  { icon: XCircle,     color: 'rose' },
  driver_assigned:  { icon: Truck,       color: 'indigo' },
  system:           { icon: Info,        color: 'slate' },
  promo:            { icon: Megaphone,   color: 'purple' },
};

const COLOR_CLASSES = {
  blue:   'bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400',
  yellow: 'bg-yellow-100 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
  orange: 'bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400',
  green:  'bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400',
  rose:   'bg-rose-100 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400',
  indigo: 'bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
  slate:  'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400',
  purple: 'bg-purple-100 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400',
};

const Notifications = () => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all | unread

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/notifications');
      // interceptor normalized — data = { items?, unreadCount?, ... }
      const arr = Array.isArray(data) ? data : (data?.items || []);
      setItems(arr);
      setUnreadCount(data?.unreadCount ?? arr.filter((n) => !n.isRead).length);
    } catch (e) {
      setItems([]);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setItems((prev) => prev.map((n) => (n._id === id ? { ...n, isRead: true, readAt: new Date() } : n)));
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch (e) { /* ignore */ }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setItems((prev) => prev.map((n) => ({ ...n, isRead: true, readAt: new Date() })));
      setUnreadCount(0);
    } catch (e) { /* ignore */ }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
      const removed = items.find((n) => n._id === id);
      setItems((prev) => prev.filter((n) => n._id !== id));
      if (removed && !removed.isRead) setUnreadCount((c) => Math.max(0, c - 1));
    } catch (e) { /* ignore */ }
  };

  const handleDeleteAll = async () => {
    if (!window.confirm("Hammasini o'chirishni xohlaysizmi?")) return;
    try {
      await api.delete('/notifications/all');
      setItems([]);
      setUnreadCount(0);
    } catch (e) { /* ignore */ }
  };

  const filtered = items.filter((n) => filter === 'all' || !n.isRead);

  if (!user) {
    return (
      <div className="pt-40 pb-20 min-h-screen flex items-center justify-center">
        <p className="text-slate-400 font-bold">Yuklanmoqda...</p>
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="container mx-auto px-4 md:px-6 py-10 max-w-4xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 text-xs font-black uppercase tracking-widest mb-3">
              <Bell size={14} />
              {unreadCount > 0 ? `${unreadCount} ta yangi` : 'Hammasi o\'qilgan'}
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter">
              Bildirishnomalar
            </h1>
            <p className="text-slate-400 font-bold mt-2">Jami: {items.length} ta xabar</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={fetchNotifications}
              className="p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-slate-400 hover:text-primary-600 transition-all shadow-sm"
              title="Yangilash"
            >
              <RefreshCw size={20} />
            </button>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="px-5 py-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-slate-700 dark:text-slate-300 font-black text-sm hover:border-primary-300 transition-all flex items-center gap-2"
              >
                <CheckCheck size={16} />
                Hammasini o'qish
              </button>
            )}
            {items.length > 0 && (
              <button
                onClick={handleDeleteAll}
                className="px-5 py-3 bg-rose-50 dark:bg-rose-500/10 text-rose-500 rounded-2xl font-black text-sm hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-all flex items-center gap-2"
              >
                <Trash2 size={16} />
                Tozalash
              </button>
            )}
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { id: 'all', label: 'Hammasi', count: items.length },
            { id: 'unread', label: 'O\'qilmagan', count: unreadCount },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setFilter(t.id)}
              className={`px-5 py-2.5 rounded-2xl font-black text-sm flex items-center gap-2 transition-all ${
                filter === t.id
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30'
                  : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t.label}
              <span className={`px-2 py-0.5 rounded-lg text-xs ${filter === t.id ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-800'}`}>
                {t.count}
              </span>
            </button>
          ))}
        </div>

        {/* List */}
        {loading ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-16 text-center border border-slate-100 dark:border-slate-800">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
            <p className="mt-4 text-slate-400 font-bold">Yuklanmoqda...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-16 text-center border-2 border-dashed border-slate-100 dark:border-slate-800">
            <Bell size={48} className="mx-auto mb-4 text-slate-200 dark:text-slate-700" />
            <p className="text-slate-400 font-black uppercase tracking-widest text-sm">
              {filter === 'unread' ? 'O\'qilmagan bildirishnomalar yo\'q' : 'Bildirishnomalar yo\'q'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {filtered.map((n) => {
                const meta = TYPE_META[n.type] || TYPE_META.system;
                const Icon = meta.icon;
                return (
                  <motion.div
                    key={n._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    className={`bg-white dark:bg-slate-900 rounded-2xl p-5 border shadow-sm hover:shadow-lg transition-all group ${
                      n.isRead
                        ? 'border-slate-100 dark:border-slate-800'
                        : 'border-primary-200 dark:border-primary-500/30 bg-primary-50/30 dark:bg-primary-500/5'
                    }`}
                  >
                    <div className="flex gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${COLOR_CLASSES[meta.color]}`}>
                        <Icon size={22} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-3">
                          <h4 className={`font-black ${n.isRead ? 'text-slate-700 dark:text-slate-300' : 'text-slate-900 dark:text-white'}`}>
                            {n.title}
                          </h4>
                          {!n.isRead && (
                            <span className="w-2.5 h-2.5 bg-primary-600 rounded-full shrink-0 mt-1.5 animate-pulse" />
                          )}
                        </div>
                        <p className={`text-sm font-bold mt-1 ${n.isRead ? 'text-slate-400' : 'text-slate-600 dark:text-slate-300'}`}>
                          {n.message}
                        </p>
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-xs font-bold text-slate-400">
                            {format(new Date(n.createdAt), 'dd MMM, HH:mm')}
                          </span>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {!n.isRead && (
                              <button
                                onClick={() => handleMarkRead(n._id)}
                                className="p-1.5 text-slate-400 hover:text-primary-600 transition-colors"
                                title="O'qildi"
                              >
                                <Check size={16} />
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(n._id)}
                              className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors"
                              title="O'chirish"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;