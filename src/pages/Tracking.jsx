import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Truck, CheckCircle2, Clock, AlertCircle, Zap, Shield, ArrowRight } from "lucide-react";
import Sticker from "../components/ui/Sticker";
import FloatingElements from "../components/ui/FloatingElements";

const Tracking = () => {
  const [trackingId, setTrackingId] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!trackingId) return;

    setIsSearching(true);
    // Simulate API call
    setTimeout(() => {
      setResult({
        id: trackingId,
        status: "Yo'lda",
        origin: "Toshkent, O'zbekiston",
        destination: "Nyu-York, AQSH",
        lastUpdate: "2026-06-11 10:30",
        steps: [
          { status: "Qabul qilindi", date: "2026-06-08 09:00", completed: true },
          { status: "Saralandi", date: "2026-06-08 14:30", completed: true },
          { status: "Yo'lga chiqdi", date: "2026-06-09 08:00", completed: true },
          { status: "Bojxonada", date: "2026-06-10 11:20", completed: true },
          { status: "Manzilga yaqin", date: "Kutilmoqda", completed: false },
        ]
      });
      setIsSearching(false);
    }, 1500);
  };

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
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white mb-8 tracking-tighter">Yukingizni <span className="gradient-text">Kuzating</span></h1>
            <p className="text-xl text-slate-500 dark:text-slate-400 font-medium">Buyurtma raqamini kiriting va yukingiz holati haqida ma'lumot oling.</p>
          </div>

          <div className="bg-white dark:bg-slate-800 p-10 md:p-12 rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-700 mb-16 relative overflow-hidden">
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
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Clock size={24} strokeWidth={3} />
                  </motion.div>
                ) : (
                  <>
                    Kuzatish
                    <ArrowRight size={24} strokeWidth={3} />
                  </>
                )}
              </button>
            </form>
          </div>

          {result && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-slate-800 rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden"
            >
              <div className="p-8 md:p-12 bg-gradient-to-r from-primary-600 to-indigo-700 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                <div>
                  <div className="text-primary-100 text-sm font-black uppercase tracking-widest mb-2 opacity-80">Buyurtma raqami</div>
                  <div className="text-4xl font-black tracking-tighter">{result.id}</div>
                </div>
                <div className="px-8 py-4 bg-white/20 backdrop-blur-xl rounded-2xl font-black text-xl flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
                  Holati: {result.status}
                </div>
              </div>

              <div className="p-8 md:p-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
                  <div className="flex items-start gap-6 group">
                    <Sticker icon={MapPin} color="primary" size={28} />
                    <div>
                      <div className="text-slate-400 font-black uppercase tracking-widest text-xs mb-2">Yuboruvchi</div>
                      <div className="font-black text-2xl text-slate-900 dark:text-white tracking-tight">{result.origin}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-6 group">
                    <Sticker icon={Truck} color="indigo" size={28} />
                    <div>
                      <div className="text-slate-400 font-black uppercase tracking-widest text-xs mb-2">Qabul qiluvchi</div>
                      <div className="font-black text-2xl text-slate-900 dark:text-white tracking-tight">{result.destination}</div>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute left-[27px] top-0 bottom-0 w-1 bg-slate-100 dark:bg-slate-700 rounded-full" />
                  
                  <div className="space-y-12">
                    {result.steps.map((step, idx) => (
                      <div key={idx} className="relative flex gap-8">
                        <div className={`z-10 w-14 h-14 rounded-2xl flex items-center justify-center border-4 border-white dark:border-slate-800 shadow-xl transition-all duration-500 ${
                          step.completed ? "bg-primary-600 text-white rotate-0" : "bg-slate-100 dark:bg-slate-700 text-slate-300 dark:text-slate-600 rotate-12"
                        }`}>
                          {step.completed ? <CheckCircle2 size={24} strokeWidth={3} /> : <div className="w-3 h-3 rounded-full bg-current" />}
                        </div>
                        <div className="flex flex-col justify-center">
                          <div className={`text-xl font-black tracking-tight ${step.completed ? "text-slate-900 dark:text-white" : "text-slate-400 dark:text-slate-600"}`}>
                            {step.status}
                          </div>
                          <div className="text-sm font-bold text-slate-400 dark:text-slate-500 mt-1">{step.date}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {!result && !isSearching && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="w-32 h-32 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl border border-slate-50 dark:border-slate-700 text-slate-200 dark:text-slate-700">
                <AlertCircle size={60} strokeWidth={1} />
              </div>
              <p className="text-2xl font-bold text-slate-400 italic tracking-tight">Hozircha natija yo'q. Kuzatish uchun yuqoridagi maydonga raqam kiriting.</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tracking;
