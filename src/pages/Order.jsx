import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Package, Truck, MapPin, Shield, ArrowRight, CheckCircle2, Zap, ArrowLeft, User, Phone } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import Sticker from "../components/ui/Sticker";
import FloatingElements from "../components/ui/FloatingElements";
import api from "../utils/api";

const Order = () => {
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [trackingId, setTrackingId] = useState("");
  const [error, setError] = useState("");
  const { isDarkMode } = useTheme();

  // ✅ Form ma'lumotlari state da — backend ga yuboriladi
  const [formData, setFormData] = useState({
    cargoType: 'Standart quti',
    weight: '',
    from: '',
    to: '',
    clientName: '',
    clientPhone: '',
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (step < 3) setStep(step + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // ✅ Backend ga saqlanadi
      const { data } = await api.post('/orders', formData);
      setTrackingId(data.trackingId);
      setIsSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || "Xatolik yuz berdi, qayta urinib ko'ring");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="pt-32 pb-24 min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 px-4 relative overflow-hidden">
        <FloatingElements />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-xl w-full bg-white dark:bg-slate-800 p-12 md:p-16 rounded-[3.5rem] shadow-2xl text-center border border-slate-100 dark:border-slate-700 relative"
        >
          <div className="absolute -top-12 left-1/2 -translate-x-1/2">
            <Sticker icon={CheckCircle2} color="green" size={60} className="p-8 bg-white dark:bg-slate-800 border-green-100 dark:border-green-900/30 shadow-green-500/10" />
          </div>

          <h2 className="text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter mt-8">Muvaffaqiyatli!</h2>

          <div className="my-6 p-6 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-700">
            <div className="text-slate-400 font-black uppercase tracking-widest text-xs mb-2">Kuzatish raqami</div>
            <div className="text-3xl font-black text-primary-600 tracking-wider">{trackingId}</div>
          </div>

          <p className="text-lg text-slate-500 dark:text-slate-400 font-medium mb-10 leading-relaxed">
            Buyurtmangiz qabul qilindi. Ushbu raqam orqali yukingizni kuzating.
          </p>

          <div className="flex gap-4">
            <button
              onClick={() => window.location.href = "/kuzatish"}
              className="btn-primary flex-1 py-5 text-lg font-black"
            >
              Kuzatish
              <ArrowRight size={20} strokeWidth={3} />
            </button>
            <button
              onClick={() => window.location.href = "/"}
              className="btn-secondary flex-1 py-5 text-lg font-black dark:bg-slate-700 dark:text-white dark:border-slate-600"
            >
              Bosh sahifa
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-40 pb-32 min-h-screen bg-slate-50 dark:bg-slate-900 relative overflow-hidden">
      <FloatingElements />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white dark:bg-slate-800 text-primary-600 dark:text-primary-400 text-sm font-black mb-8 border border-slate-100 dark:border-slate-800 shadow-xl shadow-primary-500/5 uppercase tracking-widest"
            >
              <Zap size={16} fill="currentColor" />
              <span>Tezkor Buyurtma</span>
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white mb-8 tracking-tighter">
              Yuk Tashishga <span className="gradient-text">Buyurtma</span>
            </h1>
            <p className="text-xl text-slate-500 dark:text-slate-400 font-medium">
              Quyidagi formani to'ldiring va biz sizga eng maqbul taklifni beramiz.
            </p>
          </div>

          {/* Stepper */}
          <div className="flex items-center justify-center gap-6 mb-16">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <motion.div
                  animate={{ scale: step === s ? 1.2 : 1 }}
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl border-4 transition-all shadow-xl ${
                    step >= s
                      ? "bg-primary-600 border-primary-100 dark:border-primary-900/50 text-white shadow-primary-500/20"
                      : "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-300 dark:text-slate-600"
                  }`}
                >
                  {s}
                </motion.div>
                {s < 3 && (
                  <div className={`w-12 md:w-20 h-1.5 rounded-full mx-2 transition-colors duration-500 ${
                    step > s ? "bg-primary-500" : "bg-slate-200 dark:bg-slate-800"
                  }`} />
                )}
              </div>
            ))}
          </div>

          {error && (
            <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 rounded-2xl text-rose-600 dark:text-rose-400 text-sm font-bold text-center">
              {error}
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ type: "spring", damping: 20, stiffness: 100 }}
              className="bg-white dark:bg-slate-800 p-10 md:p-14 rounded-[3.5rem] shadow-2xl border border-slate-100 dark:border-slate-700 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/5 rounded-full blur-3xl -z-10" />

              <form onSubmit={step === 3 ? handleSubmit : handleNext}>
                {step === 1 && (
                  <div className="space-y-8">
                    <div className="flex items-center gap-4 mb-8">
                      <Sticker icon={Package} color="primary" size={24} />
                      <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Yuk haqida ma'lumot</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-sm font-black text-slate-400 uppercase tracking-widest ml-1">Yuk turi</label>
                        <select
                          value={formData.cargoType}
                          onChange={(e) => handleChange('cargoType', e.target.value)}
                          className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 font-bold appearance-none dark:text-white"
                        >
                          <option>Standart quti</option>
                          <option>Mo'rt yuklar</option>
                          <option>Katta hajmli yuklar</option>
                          <option>Xavfli yuklar</option>
                        </select>
                      </div>
                      <div className="space-y-3">
                        <label className="text-sm font-black text-slate-400 uppercase tracking-widest ml-1">Vazni (kg)</label>
                        <input
                          type="number"
                          required
                          min="0.1"
                          placeholder="0.00"
                          value={formData.weight}
                          onChange={(e) => handleChange('weight', e.target.value)}
                          className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 font-bold dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-8">
                    <div className="flex items-center gap-4 mb-8">
                      <Sticker icon={MapPin} color="indigo" size={24} />
                      <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Yo'nalish</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-sm font-black text-slate-400 uppercase tracking-widest ml-1">Qayerdan</label>
                        <input
                          type="text"
                          required
                          placeholder="Shahar, davlat"
                          value={formData.from}
                          onChange={(e) => handleChange('from', e.target.value)}
                          className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 font-bold dark:text-white"
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-sm font-black text-slate-400 uppercase tracking-widest ml-1">Qayerga</label>
                        <input
                          type="text"
                          required
                          placeholder="Shahar, davlat"
                          value={formData.to}
                          onChange={(e) => handleChange('to', e.target.value)}
                          className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 font-bold dark:text-white"
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-sm font-black text-slate-400 uppercase tracking-widest ml-1">Ismingiz</label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                          <input
                            type="text"
                            placeholder="To'liq ismingiz"
                            value={formData.clientName}
                            onChange={(e) => handleChange('clientName', e.target.value)}
                            className="w-full pl-12 pr-6 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 font-bold dark:text-white"
                          />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <label className="text-sm font-black text-slate-400 uppercase tracking-widest ml-1">Telefon</label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                          <input
                            type="tel"
                            placeholder="+998 90 000 00 00"
                            value={formData.clientPhone}
                            onChange={(e) => handleChange('clientPhone', e.target.value)}
                            className="w-full pl-12 pr-6 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 font-bold dark:text-white"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-8">
                    <div className="flex items-center gap-4 mb-8">
                      <Sticker icon={Shield} color="green" size={24} />
                      <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Tasdiqlash</h3>
                    </div>

                    {/* Summary */}
                    <div className="p-8 bg-slate-50 dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-700 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { label: "Yuk turi", value: formData.cargoType },
                          { label: "Vazni", value: `${formData.weight} kg` },
                          { label: "Qayerdan", value: formData.from },
                          { label: "Qayerga", value: formData.to },
                          { label: "Ism", value: formData.clientName || "—" },
                          { label: "Telefon", value: formData.clientPhone || "—" },
                        ].map((item, i) => (
                          <div key={i}>
                            <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{item.label}</div>
                            <div className="font-black text-slate-900 dark:text-white">{item.value}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4">
                      <input type="checkbox" id="terms" className="w-6 h-6 accent-primary-600 rounded-lg" required />
                      <label htmlFor="terms" className="text-lg font-bold text-slate-600 dark:text-slate-400 cursor-pointer">
                        Xizmat ko'rsatish shartlariga roziman
                      </label>
                    </div>
                  </div>
                )}

                <div className="flex justify-between mt-16">
                  {step > 1 ? (
                    <button
                      type="button"
                      onClick={() => setStep(step - 1)}
                      className="btn-secondary px-10 py-5 text-lg font-black dark:bg-slate-700 dark:text-white dark:border-slate-600"
                    >
                      <ArrowLeft size={24} strokeWidth={3} />
                      Orqaga
                    </button>
                  ) : <div />}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-primary px-12 py-5 text-lg font-black shadow-primary-500/25"
                  >
                    {isLoading ? (
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                        <Zap size={24} fill="currentColor" />
                      </motion.div>
                    ) : (
                      <>
                        {step === 3 ? "Buyurtmani yuborish" : "Keyingisi"}
                        <ArrowRight size={24} strokeWidth={3} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Order;