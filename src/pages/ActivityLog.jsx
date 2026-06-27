import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Activity, Search, Filter, RefreshCw, Trash2,
  User as UserIcon, Package, Truck, Users as UsersIcon, Star,
  Settings as SettingsIcon, MessageSquare, ChevronLeft, ChevronRight
} from "lucide-react";
import api from "../utils/api";
import { formatDateSync as format } from "../utils/dateUtil";

const TYPE_META = {
  user_registered:        { icon: UserIcon,      color: 'blue' },
  user_login:             { icon: UserIcon,      color: 'green' },
  user_logout:            { icon: UserIcon,      color: 'slate' },
  order_created:          { icon: Package,       color: 'blue' },
  order_updated:          { icon: Package,       color: 'amber' },
  order_deleted:          { icon: Package,       color: 'rose' },
  order_status_changed:   { icon: Package,       color: 'orange' },
  driver_created:         { icon: Truck,         color: 'blue' },
  driver_updated:         { icon: Truck,         color: 'amber' },
  driver_deleted:         { icon: Truck,         color: 'rose' },
  admin_created:          { icon: UsersIcon,     color: 'blue' },
  admin_deleted:          { icon: UsersIcon,     color: 'rose' },
  partner_created:        { icon: UsersIcon,     color: 'blue' },
  partner_deleted:        { icon: UsersIcon,     color: 'rose' },
  review_posted:          { icon: Star,          color: 'amber' },
  contact_message:        { icon: MessageSquare, color: 'purple' },
  settings_updated:       { icon: SettingsIcon,  color: 'slate' },
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

const TYPES = ['all', ...Object.keys(TYPE_META)];

const ActivityLog = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1, limit: 30 });

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (type !== 'all') params.set('type', type);
      if (search.trim()) params.set('search', search.trim());
      params.set('page', page);
      params.set('limit', pagination.limit);

      const { data } = await api.get(`/activities?${params}`);
      setItems(Array.isArray(data) ? data : []);
      setPagination((p) => ({ ...p, ...(data?.pagination || {}) }));
    } catch (e) {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
    // eslint-disable-next-line
  }, [page, type]);

  const handleDelete = async (id) => {
    if (!window.confirm("Faoliyat yozilishini o'chirishni xohlaysizmi?")) return;
    try {
      await api.delete(`/activities/${id}`);
      setItems((prev) => prev.filter((a) => a._id !== id));
    } catch (e) { /* ignore */ }
  };

  const handleClearAll = async () => {
    if (!window.confirm("Barcha faoliyat tarixi o'chiriladi. Davom etasizmi?")) return;
    try {
      await api.delete('/activities/all');
      setItems([]);
      setPagination((p) => ({ ...p, total: 0, pages: 1 }));
    } catch (e) { /* ignore */ }
  };

  return (
    <div className="pt-24 min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="container mx-auto px-4 md:px-6 py-10 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 text-xs font-black uppercase tracking-widest mb-3">
              <Activity size={14} />
              Faoliyat jurnali
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter">
              Faoliyat Tarixi
            </h1>
            <p className="text-slate-400 font-bold mt-2">Jami: {pagination.total} ta yozuv</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={fetchActivities}
              className="p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-slate-400 hover:text-primary-600 transition-all shadow-sm"
            >
              <RefreshCw size={20} />
            </button>
            {items.length > 0 && (
              <button
                onClick={handleClearAll}
                className="px-5 py-3 bg-rose-50 dark:bg-rose-500/10 text-rose-500 rounded-2xl font-black text-sm hover:bg-rose-100 transition-all flex items-center gap-2"
              >
                <Trash2 size={16} />
                Hammasini tozalash
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Faoliyatni qidiring..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchActivities()}
                className="w-full pl-12 pr-6 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 font-bold dark:text-white text-sm"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
              <select
                value={type}
                onChange={(e) => { setType(e.target.value); setPage(1); }}
                className="w-full pl-12 pr-6 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 font-bold dark:text-white text-sm appearance-none"
              >
                {TYPES.map((t) => (
                  <option key={t} value={t}>{t === 'all' ? 'Barcha turlar' : t}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* List */}
        {loading ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-16 text-center border border-slate-100 dark:border-slate-800">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
            <p className="mt-4 text-slate-400 font-bold">Yuklanmoqda...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-16 text-center border-2 border-dashed border-slate-100 dark:border-slate-800">
            <Activity size={48} className="mx-auto mb-4 text-slate-200 dark:text-slate-700" />
            <p className="text-slate-400 font-black uppercase tracking-widest text-sm">Faoliyat topilmadi</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden">
            <div className="divide-y divide-slate-50 dark:divide-slate-800">
              {items.map((a) => {
                const meta = TYPE_META[a.type] || { icon: Activity, color: 'slate' };
                const Icon = meta.icon;
                return (
                  <motion.div
                    key={a._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-5 flex gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group"
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${COLOR_CLASSES[meta.color]}`}>
                      <Icon size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <p className="font-bold text-slate-700 dark:text-slate-300 text-sm">{a.description}</p>
                        <button
                          onClick={() => handleDelete(a._id)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-500 transition-all"
                          title="O'chirish"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 mt-1 text-xs font-bold text-slate-400">
                        <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg">{a.type}</span>
                        {a.actorName && <span>· {a.actorName}</span>}
                        {a.targetName && <span>· {a.targetName}</span>}
                        <span>· {format(new Date(a.createdAt), 'dd MMM HH:mm')}</span>
                        {a.ip && <span>· {a.ip}</span>}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-slate-400 hover:text-primary-600 disabled:opacity-30 transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="px-5 py-3 font-black text-sm text-slate-700 dark:text-slate-300">
              {page} / {pagination.pages}
            </span>
            <button
              onClick={() => setPage(Math.min(pagination.pages, page + 1))}
              disabled={page === pagination.pages}
              className="p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-slate-400 hover:text-primary-600 disabled:opacity-30 transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityLog;