import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package, Search, Filter, RefreshCw, Eye, ChevronLeft, ChevronRight,
  MapPin, Truck, Calendar, XCircle, Clock, CheckCircle2, Download, ArrowRight
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import dynamicImport from "../utils/dynamicImport";
import { formatDateSync as format } from "../utils/dateUtil";

const STATUS_MAP = {
  'Yangi': { color: 'bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400', icon: Package },
  'Qabul qilindi': { color: 'bg-yellow-100 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400', icon: CheckCircle2 },
  "Yo'lda": { color: 'bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400', icon: Truck },
  'Yetkazildi': { color: 'bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400', icon: CheckCircle2 },
  'Bekor qilindi': { color: 'bg-rose-100 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400', icon: XCircle },
};

const StatusBadge = ({ status }) => {
  const m = STATUS_MAP[status] || STATUS_MAP['Yangi'];
  const Icon = m.icon;
  return (
    <span className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest inline-flex items-center gap-1.5 ${m.color}`}>
      <Icon size={12} />
      {status}
    </span>
  );
};

const STATUS_OPTIONS = ['all', 'Yangi', 'Qabul qilindi', "Yo'lda", 'Yetkazildi', 'Bekor qilindi'];

const MyOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [pagination] = useState({ total: 0, pages: 1, limit: 10 });

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (search.trim()) params.set("search", search.trim());
      params.set("page", page);
      params.set("limit", pagination.limit);

      const { data } = await api.get(`/orders/my-orders`);
      setOrders(Array.isArray(data) ? data : []);
    } catch (e) {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line
  }, []);

  // Filter va search client-side (my-orders endpoint barcha ma'lumotni qaytaradi)
  const filtered = orders.filter((o) => {
    if (statusFilter !== "all" && o.status !== statusFilter) return false;
    if (search.trim()) {
      const s = search.toLowerCase();
      return (
        o.trackingId?.toLowerCase().includes(s) ||
        o.from?.toLowerCase().includes(s) ||
        o.to?.toLowerCase().includes(s) ||
        o.cargoType?.toLowerCase().includes(s)
      );
    }
    return true;
  });

  // Pagination client-side
  const totalPages = Math.max(1, Math.ceil(filtered.length / pagination.limit));
  const start = (page - 1) * pagination.limit;
  const pageItems = filtered.slice(start, start + pagination.limit);

  // PDF export
  const exportPdf = async () => {
    try {
      const { jsPDF } = await dynamicImport('jspdf');
      const autoTableMod = await dynamicImport('jspdf-autotable');
      const autoTable = autoTableMod.default || autoTableMod;

      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text("Mening buyurtmalarim — LogisticPro", 14, 18);
      doc.setFontSize(10);
      doc.text(`Foydalanuvchi: ${user?.name || ''} (${user?.email || ''})`, 14, 26);
      doc.text(`Sana: ${format(new Date(), 'dd.MM.yyyy HH:mm')}`, 14, 32);

      autoTable(doc, {
        startY: 40,
        head: [['#', 'Tracking ID', "Yo'nalish", 'Yuk', 'Vazn', 'Narx', 'Holat', 'Sana']],
        body: filtered.map((o, i) => [
          i + 1,
          o.trackingId,
          `${o.from} → ${o.to}`,
          o.cargoType,
          `${o.weight} kg`,
          o.price ? `$${o.price}` : '-',
          o.status,
          format(new Date(o.createdAt), 'dd.MM.yyyy'),
        ]),
        headStyles: { fillColor: [37, 99, 235] },
        styles: { fontSize: 9 },
      });

      doc.save(`buyurtmalarim-${Date.now()}.pdf`);
    } catch (e) {
      alert('PDF eksport uchun jspdf va jspdf-autotable paketlarini o\'rnating');
    }
  };

  return (
    <div className="pt-24 min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="container mx-auto px-4 md:px-6 py-10 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter">
              Mening buyurtmalarim
            </h1>
            <p className="text-slate-400 font-bold mt-2">
              Jami: <span className="text-primary-600 font-black">{filtered.length}</span> ta buyurtma
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={fetchOrders}
              className="p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-slate-400 hover:text-primary-600 transition-all shadow-sm"
              title="Yangilash"
            >
              <RefreshCw size={20} />
            </button>
            <button
              onClick={exportPdf}
              disabled={filtered.length === 0}
              className="btn-primary py-3 px-6 font-black flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download size={18} />
              PDF yuklab olish
            </button>
          </div>
        </div>

        {/* Filter */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Tracking, yo'nalish, yuk turi..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-full pl-12 pr-6 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 font-bold dark:text-white text-sm"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                className="w-full pl-12 pr-6 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 font-bold dark:text-white text-sm appearance-none"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s === 'all' ? 'Barcha holatlar' : s}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-16 text-center border border-slate-100 dark:border-slate-800">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
            <p className="mt-4 text-slate-400 font-bold">Yuklanmoqda...</p>
          </div>
        ) : pageItems.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-16 text-center border-2 border-dashed border-slate-100 dark:border-slate-800">
            <Package size={48} className="mx-auto mb-4 text-slate-200 dark:text-slate-700" />
            <p className="text-slate-400 font-black uppercase tracking-widest text-sm">Buyurtmalar topilmadi</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {pageItems.map((o) => (
              <motion.div
                key={o._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => setSelected(o)}
                className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl cursor-pointer hover:shadow-2xl hover:-translate-y-1 transition-all group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="font-black text-primary-600 text-sm">{o.trackingId}</div>
                  <StatusBadge status={o.status} />
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <MapPin size={14} className="text-slate-400 shrink-0" />
                  <div className="text-sm font-bold text-slate-700 dark:text-slate-300 truncate">
                    {o.from} → {o.to}
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-3">
                  <span>{o.cargoType}</span>
                  <span>{o.weight} kg</span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-slate-50 dark:border-slate-800">
                  <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                    <Calendar size={12} />
                    {format(new Date(o.createdAt), 'dd.MM.yyyy')}
                  </span>
                  <span className="text-primary-600 font-black text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                    <Eye size={14} /> Ko'rish
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-slate-400 hover:text-primary-600 disabled:opacity-30 transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-12 h-12 rounded-2xl font-black text-sm transition-all ${p === page
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30'
                    : 'bg-white dark:bg-slate-900 text-slate-400 hover:text-primary-600 border border-slate-100 dark:border-slate-800'
                  }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-slate-400 hover:text-primary-600 disabled:opacity-30 transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}

        {/* Detail Modal */}
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4 overflow-y-auto"
            >
              <motion.div
                initial={{ scale: 0.9, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 30 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-slate-900 rounded-[2rem] max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              >
                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Buyurtma</div>
                      <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{selected.trackingId}</div>
                    </div>
                    <button
                      onClick={() => setSelected(null)}
                      className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors"
                    >
                      <XCircle size={20} />
                    </button>
                  </div>

                  <div className="mb-6">
                    <StatusBadge status={selected.status} />
                  </div>

                  <div className="space-y-4 mb-6">
                    <DetailRow label="Yo'nalish" value={`${selected.from} → ${selected.to}`} />
                    <DetailRow label="Yuk turi" value={selected.cargoType} />
                    <DetailRow label="Vazn" value={`${selected.weight} kg`} />
                    <DetailRow label="Narx" value={selected.price ? `$${selected.price}` : 'Aniqlanmoqda'} />
                    {selected.driver && (
                      <DetailRow label="Haydovchi" value={selected.driver.name || '—'} />
                    )}
                    <DetailRow label="Sana" value={format(new Date(selected.createdAt), 'dd.MM.yyyy HH:mm')} />
                  </div>

                  {/* Timeline */}
                  {selected.timeline && selected.timeline.length > 0 && (
                    <div>
                      <h3 className="font-black text-slate-900 dark:text-white mb-4 uppercase tracking-widest text-xs">Tarix</h3>
                      <div className="relative pl-6 border-l-2 border-slate-100 dark:border-slate-800 space-y-4">
                        {selected.timeline.map((t, i) => (
                          <div key={i} className="relative">
                            <div className="absolute -left-[31px] w-4 h-4 rounded-full bg-primary-600 border-4 border-white dark:border-slate-900"></div>
                            <div className="text-sm font-black text-slate-900 dark:text-white">{t.status}</div>
                            {t.note && <div className="text-xs font-bold text-slate-400 mt-1">{t.note}</div>}
                            <div className="text-xs font-bold text-slate-300 dark:text-slate-600 mt-1">
                              {format(new Date(t.createdAt), 'dd.MM.yyyy HH:mm')} · {t.byName}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const DetailRow = ({ label, value }) => (
  <div className="flex justify-between items-center py-2 border-b border-slate-50 dark:border-slate-800">
    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{label}</span>
    <span className="font-black text-slate-900 dark:text-white text-sm text-right">{value}</span>
  </div>
);

export default MyOrders;