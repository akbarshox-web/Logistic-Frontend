import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HelpCircle, ChevronDown, Search, MessageCircle, Phone,
  Mail, Sparkles, Tag, RefreshCw
} from "lucide-react";
import api from "../utils/api";
import { Link } from "react-router-dom";

const CATEGORIES = [
  { id: 'all', label: 'Hammasi' },
  { id: 'umumiy', label: 'Umumiy' },
  { id: 'xizmatlar', label: 'Xizmatlar' },
  { id: 'narxlar', label: 'Narxlar' },
  { id: 'yetkazish', label: 'Yetkazish' },
  { id: 'hisob', label: 'Hisob' },
  { id: 'boshqa', label: 'Boshqa' },
];

const FAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState(null);
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");

  const fetchFaqs = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/faqs');
      setFaqs(Array.isArray(data) ? data : []);
    } catch (e) {
      setFaqs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const filtered = faqs.filter((f) => {
    if (category !== 'all' && f.category !== category) return false;
    if (search.trim()) {
      const s = search.toLowerCase();
      return f.question.toLowerCase().includes(s) || f.answer.toLowerCase().includes(s);
    }
    return true;
  });

  return (
    <div className="pt-32 pb-32 min-h-screen bg-slate-50 dark:bg-slate-900 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white dark:bg-slate-800 text-primary-600 dark:text-primary-400 text-sm font-black mb-6 border border-slate-100 dark:border-slate-800 shadow-xl shadow-primary-500/5 uppercase tracking-widest"
          >
            <Sparkles size={16} />
            Yordam markazi
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white mb-6 tracking-tighter">
            Tez-tez <span className="gradient-text">Beriladigan</span> Savollar
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto">
            Eng ko'p so'raladigan savollarga javoblar. Topa olmasangiz — biz bilan bog'laning.
          </p>
        </div>

        {/* Search */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 mb-8">
          <div className="relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Savolni qidiring..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 font-bold dark:text-white"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategory(c.id)}
              className={`px-5 py-2.5 rounded-2xl font-black text-sm whitespace-nowrap transition-all flex items-center gap-2 ${
                category === c.id
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30'
                  : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-700 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {c.id !== 'all' && <Tag size={14} />}
              {c.label}
            </button>
          ))}
        </div>

        {/* FAQ List */}
        {loading ? (
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-16 text-center border border-slate-100 dark:border-slate-700">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
            <p className="mt-4 text-slate-400 font-bold">Yuklanmoqda...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-16 text-center border-2 border-dashed border-slate-100 dark:border-slate-700">
            <HelpCircle size={48} className="mx-auto mb-4 text-slate-200 dark:text-slate-700" />
            <p className="text-slate-400 font-black uppercase tracking-widest text-sm">Savollar topilmadi</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((f, i) => {
              const isOpen = openId === f._id;
              return (
                <motion.div
                  key={f._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden"
                >
                  <button
                    onClick={() => setOpenId(isOpen ? null : f._id)}
                    className="w-full p-6 flex items-center justify-between gap-4 text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                  >
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className="w-10 h-10 bg-primary-50 dark:bg-primary-500/10 rounded-xl flex items-center justify-center text-primary-600 shrink-0">
                        <HelpCircle size={20} />
                      </div>
                      <span className="font-black text-slate-900 dark:text-white text-base md:text-lg">{f.question}</span>
                    </div>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="shrink-0 text-slate-400"
                    >
                      <ChevronDown size={20} />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 pl-20">
                          <div className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium whitespace-pre-line">
                            {f.answer}
                          </div>
                          {f.category && (
                            <div className="mt-4 inline-flex items-center gap-1 px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-xl">
                              <Tag size={12} className="text-slate-500" />
                              <span className="text-xs font-black text-slate-500 uppercase tracking-widest">{f.category}</span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Contact CTA */}
        <div className="mt-16 bg-gradient-to-br from-primary-600 to-indigo-700 rounded-[2.5rem] p-10 text-white text-center shadow-2xl">
          <MessageCircle size={40} className="mx-auto mb-4 opacity-80" />
          <h3 className="text-3xl font-black mb-3">Javob topmadingizmi?</h3>
          <p className="text-white/80 font-medium mb-6">Bizning jamoamiz sizga yordam berishga tayyor</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/boglanish" className="bg-white text-primary-600 px-8 py-3 rounded-2xl font-black hover:shadow-xl transition-all inline-flex items-center justify-center gap-2">
              <Mail size={18} /> Xabar yuborish
            </Link>
            <a href="tel:+998712000000" className="bg-white/10 backdrop-blur-md border border-white/20 px-8 py-3 rounded-2xl font-black hover:bg-white/20 transition-all inline-flex items-center justify-center gap-2">
              <Phone size={18} /> Qo'ng'iroq qilish
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;