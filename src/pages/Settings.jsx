import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Settings as SettingsIcon, Save, Building2, Mail, Phone, MapPin, Globe,
  Shield, Server, DollarSign, RefreshCw, CheckCircle2, AlertCircle,
  Send
} from "lucide-react";
import api from "../utils/api";

const TABS = [
  { id: 'general', label: 'Umumiy', icon: Building2 },
  { id: 'contact', label: 'Aloqa', icon: Phone },
  { id: 'social', label: 'Ijtimoiy', icon: Globe },
  { id: 'smtp', label: 'SMTP', icon: Server },
  { id: 'pricing', label: 'Narx', icon: DollarSign },
  { id: 'system', label: 'Tizim', icon: Shield },
];

const Settings = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/settings/admin');
      setForm(data);
    } catch (e) {
      setMessage({ type: 'error', text: 'Sozlamalarni yuklab bo\'lmadi' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const { data } = await api.put('/settings', form);
      setForm(data);
      setMessage({ type: 'success', text: 'Sozlamalar saqlandi' });
    } catch (e) {
      setMessage({ type: 'error', text: e.response?.data?.message || 'Xatolik' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const inputCls = "w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 font-bold dark:text-white text-sm";

  if (loading || !form) {
    return (
      <div className="pt-40 pb-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
          <p className="mt-4 text-slate-400 font-bold">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="container mx-auto px-4 md:px-6 py-10 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 text-xs font-black uppercase tracking-widest mb-3">
              <SettingsIcon size={14} />
              Sozlamalar
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter">
              Tizim Sozlamalari
            </h1>
            <p className="text-slate-400 font-bold mt-2">Sayt va tizim parametrlarini boshqaring</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={fetchSettings}
              className="p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-slate-400 hover:text-primary-600 transition-all shadow-sm"
            >
              <RefreshCw size={20} />
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-primary py-3 px-6 font-black flex items-center gap-2 disabled:opacity-50"
            >
              <Save size={18} />
              {saving ? 'Saqlanmoqda...' : 'Saqlash'}
            </button>
          </div>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-2xl flex items-center gap-3 font-bold text-sm ${
            message.type === 'success' ? 'bg-green-50 dark:bg-green-500/10 text-green-600' : 'bg-rose-50 dark:bg-rose-500/10 text-rose-600'
          }`}>
            {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar tabs */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl p-2 sticky top-24">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-black text-sm transition-all ${
                      activeTab === tab.id
                        ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30'
                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon size={18} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* GENERAL */}
            {activeTab === 'general' && (
              <Section title="Umumiy ma'lumotlar" desc="Sayt nomi va tavsifi">
                <Field label="Sayt nomi">
                  <input className={inputCls} value={form.siteName || ''} onChange={(e) => setForm({ ...form, siteName: e.target.value })} />
                </Field>
                <Field label="Sayt tavsifi">
                  <textarea rows="3" className={inputCls} value={form.siteDescription || ''} onChange={(e) => setForm({ ...form, siteDescription: e.target.value })} />
                </Field>
              </Section>
            )}

            {/* CONTACT */}
            {activeTab === 'contact' && (
              <Section title="Aloqa ma'lumotlari" desc="Foydalanuvchilarga ko'rinadigan aloqa">
                <Field label="Email" icon={Mail}>
                  <input type="email" className={inputCls} value={form.contact?.email || ''} onChange={(e) => setForm({ ...form, contact: { ...form.contact, email: e.target.value } })} />
                </Field>
                <Field label="Telefon" icon={Phone}>
                  <input className={inputCls} value={form.contact?.phone || ''} onChange={(e) => setForm({ ...form, contact: { ...form.contact, phone: e.target.value } })} />
                </Field>
                <Field label="Manzil" icon={MapPin}>
                  <input className={inputCls} value={form.contact?.address || ''} onChange={(e) => setForm({ ...form, contact: { ...form.contact, address: e.target.value } })} />
                </Field>
                <Field label="Ish vaqti">
                  <input className={inputCls} value={form.contact?.workingHours || ''} onChange={(e) => setForm({ ...form, contact: { ...form.contact, workingHours: e.target.value } })} />
                </Field>
              </Section>
            )}

            {/* SOCIAL */}
            {activeTab === 'social' && (
              <Section title="Ijtimoiy tarmoqlar" desc="Ijtimoiy media havolalari">
                <Field label="Facebook" icon={Globe}>
                  <input className={inputCls} placeholder="https://facebook.com/..." value={form.social?.facebook || ''} onChange={(e) => setForm({ ...form, social: { ...form.social, facebook: e.target.value } })} />
                </Field>
                <Field label="Instagram" icon={Globe}>
                  <input className={inputCls} placeholder="https://instagram.com/..." value={form.social?.instagram || ''} onChange={(e) => setForm({ ...form, social: { ...form.social, instagram: e.target.value } })} />
                </Field>
                <Field label="Telegram" icon={Send}>
                  <input className={inputCls} placeholder="https://t.me/..." value={form.social?.telegram || ''} onChange={(e) => setForm({ ...form, social: { ...form.social, telegram: e.target.value } })} />
                </Field>
                <Field label="YouTube" icon={Globe}>
                  <input className={inputCls} placeholder="https://youtube.com/..." value={form.social?.youtube || ''} onChange={(e) => setForm({ ...form, social: { ...form.social, youtube: e.target.value } })} />
                </Field>
              </Section>
            )}

            {/* SMTP */}
            {activeTab === 'smtp' && (
              <Section title="SMTP sozlamalari" desc="Email yuborish uchun server">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="SMTP host">
                    <input className={inputCls} placeholder="smtp.gmail.com" value={form.smtp?.host || ''} onChange={(e) => setForm({ ...form, smtp: { ...form.smtp, host: e.target.value } })} />
                  </Field>
                  <Field label="Port">
                    <input type="number" className={inputCls} value={form.smtp?.port || 587} onChange={(e) => setForm({ ...form, smtp: { ...form.smtp, port: Number(e.target.value) } })} />
                  </Field>
                  <Field label="Username">
                    <input className={inputCls} value={form.smtp?.user || ''} onChange={(e) => setForm({ ...form, smtp: { ...form.smtp, user: e.target.value } })} />
                  </Field>
                  <Field label="Password">
                    <input type="password" className={inputCls} value={form.smtp?.pass || ''} onChange={(e) => setForm({ ...form, smtp: { ...form.smtp, pass: e.target.value } })} />
                  </Field>
                  <Field label="From nomi">
                    <input className={inputCls} value={form.smtp?.fromName || ''} onChange={(e) => setForm({ ...form, smtp: { ...form.smtp, fromName: e.target.value } })} />
                  </Field>
                  <Field label="From email">
                    <input type="email" className={inputCls} value={form.smtp?.fromEmail || ''} onChange={(e) => setForm({ ...form, smtp: { ...form.smtp, fromEmail: e.target.value } })} />
                  </Field>
                </div>
              </Section>
            )}

            {/* PRICING */}
            {activeTab === 'pricing' && (
              <Section title="Narx sozlamalari" desc="Hisoblash uchun asosiy narxlar">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Field label="Asosiy narx (kg)">
                    <input type="number" className={inputCls} value={form.pricing?.basePricePerKg || 0} onChange={(e) => setForm({ ...form, pricing: { ...form.pricing, basePricePerKg: Number(e.target.value) } })} />
                  </Field>
                  <Field label="Narx (km)">
                    <input type="number" className={inputCls} value={form.pricing?.pricePerKm || 0} onChange={(e) => setForm({ ...form, pricing: { ...form.pricing, pricePerKm: Number(e.target.value) } })} />
                  </Field>
                  <Field label="Valyuta">
                    <input className={inputCls} value={form.pricing?.currency || 'UZS'} onChange={(e) => setForm({ ...form, pricing: { ...form.pricing, currency: e.target.value } })} />
                  </Field>
                </div>
              </Section>
            )}

            {/* SYSTEM */}
            {activeTab === 'system' && (
              <Section title="Tizim sozlamalari" desc="Texnik va xavfsizlik parametrlari">
                <ToggleField
                  label="Texnik xizmat ko'rsatish rejimi"
                  desc="Sayt vaqtincha yopiladi"
                  checked={!!form.system?.maintenanceMode}
                  onChange={(v) => setForm({ ...form, system: { ...form.system, maintenanceMode: v } })}
                />
                <ToggleField
                  label="Ro'yxatdan o'tishga ruxsat"
                  desc="Yangi userlar ro'yxatdan o'ta oladi"
                  checked={!!form.system?.allowRegistration}
                  onChange={(v) => setForm({ ...form, system: { ...form.system, allowRegistration: v } })}
                />
                <ToggleField
                  label="Email tasdiqlash talab qilinsin"
                  desc="Login qilishdan oldin email tasdiqlanishi kerak"
                  checked={!!form.system?.requireEmailVerification}
                  onChange={(v) => setForm({ ...form, system: { ...form.system, requireEmailVerification: v } })}
                />
                <Field label="Bir user uchun maksimal buyurtmalar">
                  <input type="number" className={inputCls} value={form.system?.maxOrdersPerUser || 100} onChange={(e) => setForm({ ...form, system: { ...form.system, maxOrdersPerUser: Number(e.target.value) } })} />
                </Field>
              </Section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const Section = ({ title, desc, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl p-8"
  >
    <h2 className="text-xl font-black text-slate-900 dark:text-white mb-1">{title}</h2>
    <p className="text-sm font-bold text-slate-400 mb-6">{desc}</p>
    <div className="space-y-4">{children}</div>
  </motion.div>
);

const Field = ({ label, icon: Icon, children }) => (
  <div>
    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 flex items-center gap-1.5">
      {Icon && <Icon size={12} />} {label}
    </label>
    {children}
  </div>
);

const ToggleField = ({ label, desc, checked, onChange }) => (
  <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
    <div>
      <div className="font-black text-slate-900 dark:text-white text-sm">{label}</div>
      {desc && <div className="text-xs text-slate-400 font-bold mt-1">{desc}</div>}
    </div>
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-12 h-7 rounded-full transition-colors ${checked ? 'bg-primary-600' : 'bg-slate-300 dark:bg-slate-700'}`}
    >
      <div className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-5' : ''}`} />
    </button>
  </div>
);

export default Settings;