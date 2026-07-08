import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock, Send, MessageSquare, Zap, CheckCircle2 } from "lucide-react";
import Sticker from "../components/ui/Sticker";
import FloatingElements from "../components/ui/FloatingElements";
import api from "../utils/api";

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [settings, setSettings] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/settings');
        setSettings(data || null);
      } catch { /* ignore */ }
    };
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await api.post('/contacts', form);
      setSuccess(true);
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err.response?.data?.message || 'Xabar yuborishda xatolik');
    } finally {
      setSubmitting(false);
    }
  };

  const info = [
    {
      icon: Phone,
      color: "blue",
      title: "Telefon",
      value: settings?.contact?.phone || '+998 71 200 00 00',
      desc: settings?.contact?.workingHours || 'Dush-Shan, 9:00 - 18:00'
    },
    {
      icon: Mail,
      color: "indigo",
      title: "Email",
      value: settings?.contact?.email || 'info@logisticpro.uz',
      desc: 'Istalgan vaqtda yozing'
    },
    {
      icon: MapPin,
      color: "rose",
      title: "Manzil",
      value: settings?.contact?.address || 'Logistic Business Center, 108 Global Ave',
      desc: 'Bizning bosh ofisimiz'
    }
  ];

  return (
    <div className="pt-40 pb-32 min-h-screen bg-slate-50 dark:bg-slate-900 relative overflow-hidden">
      <FloatingElements />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white dark:bg-slate-800 text-primary-600 dark:text-primary-400 text-sm font-black mb-8 border border-slate-100 dark:border-slate-800 shadow-xl shadow-primary-500/5 uppercase tracking-widest"
          >
            <Zap size={16} fill="currentColor" />
            <span>Aloqa</span>
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white mb-8 tracking-tighter">
            Biz Bilan <span className="gradient-text">Bog'laning</span>
          </h1>
          <p className="text-xl text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
            Savollaringiz bormi? Bizning jamoamiz sizga yordam berishga doim tayyor.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
          {/* Contact Info Cards */}
          <div className="lg:col-span-1 space-y-6">
            {info.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-8 bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-xl flex items-start gap-6 group hover:-translate-y-2 transition-all duration-300"
              >
                <div className="shrink-0">
                  <Sticker icon={item.icon} color={item.color} size={24} />
                </div>
                <div>
                  <h4 className="font-black text-slate-900 dark:text-white text-lg mb-1">{item.title}</h4>
                  <div className="text-primary-600 dark:text-primary-400 font-black text-xl my-2 tracking-tight">{item.value}</div>
                  <p className="text-sm text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 bg-white dark:bg-slate-800 p-10 md:p-12 rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-700 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary-600/5 rounded-full blur-3xl -z-10" />

            <div className="flex items-center gap-4 mb-10">
              <Sticker icon={MessageSquare} color="primary" size={24} />
              <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Xabar yuboring</h3>
            </div>

            {success && (
              <div className="mb-6 p-4 rounded-2xl flex items-center gap-3 font-bold text-sm bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400">
                <CheckCircle2 size={18} />
                Xabaringiz qabul qilindi! Tez orada siz bilan bog'lanamiz.
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 rounded-2xl flex items-center gap-3 font-bold text-sm bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-sm font-black text-slate-400 uppercase tracking-widest ml-1">Ismingiz</label>
                <input
                  type="text"
                  placeholder="Ismingizni kiriting"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all font-bold dark:text-white"
                />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-black text-slate-400 uppercase tracking-widest ml-1">Email manzilingiz</label>
                <input
                  type="email"
                  placeholder="Emailingizni kiriting"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all font-bold dark:text-white"
                />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-black text-slate-400 uppercase tracking-widest ml-1">Telefon</label>
                <input
                  type="tel"
                  placeholder="+998..."
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all font-bold dark:text-white"
                />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-black text-slate-400 uppercase tracking-widest ml-1">Mavzu</label>
                <input
                  type="text"
                  placeholder="Xabar mavzusi"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  required
                  className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all font-bold dark:text-white"
                />
              </div>
              <div className="md:col-span-2 space-y-3">
                <label className="text-sm font-black text-slate-400 uppercase tracking-widest ml-1">Xabaringiz</label>
                <textarea
                  rows="5"
                  placeholder="Xabaringizni bu yerga yozing..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  required
                  className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all font-bold dark:text-white"
                ></textarea>
              </div>
              <div className="md:col-span-2 mt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary w-full py-5 text-xl font-black flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {submitting ? 'Yuborilmoqda...' : 'Xabarni yuborish'}
                  {!submitting && <Send size={24} strokeWidth={2.5} />}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;