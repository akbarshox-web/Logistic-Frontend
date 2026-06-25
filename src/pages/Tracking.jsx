import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Truck, CheckCircle2, Clock, AlertCircle, Zap, Shield, ArrowRight, Package } from "lucide-react";
import Sticker from "../components/ui/Sticker";
import FloatingElements from "../components/ui/FloatingElements";
import api from "../utils/api";

const STATUS_STEPS = [
  "Yangi",
  "Qabul qilindi",
  "Yo'lda",
  "Yetkazildi",
];

const Tracking = () => {
  const [trackingId, setTrackingId] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  // ✅ Refresh da saqlanadi — localStorage
  useEffect(() => {
    const saved = localStorage.getItem("lastTrackingId");
    const savedResult = localStorage.getItem("lastTrackingResult");
    if (saved) setTrackingId(saved);
    if (savedResult) {
      try { setResult(JSON.parse(savedResult)); } catch {}
    }
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!trackingId.trim()) return;

    setIsSearching(true);
    setError("");
    setResult(null);

    try {
      // ✅ Real API
      const { data } = await api.get(`/orders/track/${trackingId.trim()}`);
      setResult(data);
      // ✅ localStorage ga saqlash
      localStorage.setItem("lastTrackingId", trackingId.trim());
      localStorage.setItem("lastTrackingResult", JSON.stringify(data));
    } catch (err) {
      if (err.response?.status === 404) {
        setError("Bu raqam bo'yicha buyurtma topilmadi");
      } else {
        setError("Qidirishda xatolik yuz berdi");
      }
      localStorage.removeItem("lastTrackingResult");
    } finally {
      setIsSearching(false);
    }
  };

  const currentStepIndex = result ? STATUS_STEPS.indexOf(result.status) : -1;

  return (
    <div className="pt-40 pb-32 min-h-screen bg-slate-50 dark:bg-slate-900 relative overflow-hidden">
      <FloatingElements />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white dark:bg-slate-800 text-primary-600 dark:text-primary-400 text-sm font-black mb-8 border border-slate-100 dark:border-slate-800 shadow-xl shadow-primary-500/5 uppercase tracking-widest"
            >
              <Shield size={16} fill="currentColor" />
              <span>Real vaqtda kuzatuv</span>
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white mb-8 tracking-tighter">
              Yukingizni <span className="gradient-text">Kuzating</span>
            </h1>
            <p className="text-xl text-slate-500 dark:text-slate-400 font-medium">
              Buyurtma raqamini kiriting va yukingiz holati haqida ma'lumot oling.
            </p>
          </div>

          {/* Search */}
          <div className="bg-white dark:bg-slate-800 p-10 md:p-12 rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-700 mb-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/5 rounded-full blur-3xl -z-10" />
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-6">
              <div className="relative flex-1">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={24} />
                <input
                  type="text"
                  placeholder="Masalan: LOG12345678"
                  className="w-full pl-16 pr-6 py-6 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-xl font-bold dark:text-white"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                />
              </div>
              <button
                type="submit"
                disabled={isSearching}
                className="btn-primary py-6 px-12 text-xl font-black flex items-center justify-center gap-3"
              >
                {isSearching ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                    <Clock size={24} strokeWidth={3} />
                  </motion.div>
                ) : (
                  <>Kuzatish <ArrowRight size={24} strokeWidth={3} /></>
                )}
              </button>
            </form>
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 p-6 bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 rounded-2xl text-rose-600 dark:text-rose-400 font-bold flex items-center gap-3"
            >
              <AlertCircle size={20} />
              {error}
            </motion.div>
          )}

          {/* Result */}
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-slate-800 rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden"
            >
              {/* Header */}
              <div className="p-8 md:p-12 bg-gradient-to-r from-primary-600 to-indigo-700 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                <div>
                  <div className="text-primary-100 text-sm font-black uppercase tracking-widest mb-2 opacity-80">Buyurtma raqami</div>
                  <div className="text-4xl font-black tracking-tighter">{result.trackingId}</div>
                </div>
                <div className={`px-8 py-4 rounded-2xl font-black text-xl flex items-center gap-3 ${
                  result.status === 'Yetkazildi' ? 'bg-green-500/30' :
                  result.status === 'Bekor qilindi' ? 'bg-rose-500/30' :
                  'bg-white/20'
                } backdrop-blur-xl`}>
                  <div className={`w-3 h-3 rounded-full animate-pulse ${
                    result.status === 'Yetkazildi' ? 'bg-green-400' :
                    result.status === 'Bekor qilindi' ? 'bg-rose-400' :
                    'bg-yellow-400'
                  }`} />
                  {result.status}
                </div>
              </div>

              <div className="p-8 md:p-12">
                {/* Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                  <div className="flex items-start gap-6">
                    <Sticker icon={MapPin} color="primary" size={24} />
                    <div>
                      <div className="text-slate-400 font-black uppercase tracking-widest text-xs mb-2">Qayerdan</div>
                      <div className="font-black text-2xl text-slate-900 dark:text-white tracking-tight">{result.from}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-6">
                    <Sticker icon={Truck} color="indigo" size={24} />
                    <div>
                      <div className="text-slate-400 font-black uppercase tracking-widest text-xs mb-2">Qayerga</div>
                      <div className="font-black text-2xl text-slate-900 dark:text-white tracking-tight">{result.to}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-6">
                    <Sticker icon={Package} color="orange" size={24} />
                    <div>
                      <div className="text-slate-400 font-black uppercase tracking-widest text-xs mb-2">Yuk turi</div>
                      <div className="font-black text-xl text-slate-900 dark:text-white">{result.cargoType} — {result.weight} kg</div>
                    </div>
                  </div>
                  {result.driver && (
                    <div className="flex items-start gap-6">
                      <Sticker icon={Truck} color="green" size={24} />
                      <div>
                        <div className="text-slate-400 font-black uppercase tracking-widest text-xs mb-2">Haydovchi</div>
                        <div className="font-black text-xl text-slate-900 dark:text-white">{result.driver.name}</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Steps */}
                {result.status !== 'Bekor qilindi' && (
                  <div className="relative">
                    <div className="absolute left-[27px] top-0 bottom-0 w-1 bg-slate-100 dark:bg-slate-700 rounded-full" />
                    <div className="space-y-10">
                      {STATUS_STEPS.map((statusStep, idx) => {
                        const done = idx <= currentStepIndex;
                        const current = idx === currentStepIndex;
                        return (
                          <div key={idx} className="relative flex gap-8">
                            <div className={`z-10 w-14 h-14 rounded-2xl flex items-center justify-center border-4 border-white dark:border-slate-800 shadow-xl transition-all duration-500 ${
                              done ? "bg-primary-600 text-white" : "bg-slate-100 dark:bg-slate-700 text-slate-300 dark:text-slate-600"
                            } ${current ? "ring-4 ring-primary-200 dark:ring-primary-900" : ""}`}>
                              {done ? <CheckCircle2 size={24} strokeWidth={3} /> : <div className="w-3 h-3 rounded-full bg-current" />}
                            </div>
                            <div className="flex flex-col justify-center">
                              <div className={`text-xl font-black tracking-tight ${done ? "text-slate-900 dark:text-white" : "text-slate-400 dark:text-slate-600"}`}>
                                {statusStep}
                              </div>
                              {current && (
                                <div className="text-sm font-bold text-primary-600 dark:text-primary-400 mt-1">Hozirgi holat</div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Empty state */}
          {!result && !isSearching && !error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
              <div className="w-32 h-32 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl border border-slate-50 dark:border-slate-700 text-slate-200 dark:text-slate-700">
                <AlertCircle size={60} strokeWidth={1} />
              </div>
              <p className="text-2xl font-bold text-slate-400 italic tracking-tight">
                Kuzatish uchun yuqoridagi maydonga raqam kiriting.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tracking;