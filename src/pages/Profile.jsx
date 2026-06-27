import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User, Mail, Phone, Camera, Save, Lock, Eye, EyeOff,
  CheckCircle2, AlertCircle, ShieldCheck, Image as ImageIcon
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    avatar: "",
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPw, setShowPw] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [message, setMessage] = useState(null);
  const [pwMessage, setPwMessage] = useState(null);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        avatar: user.avatar || "",
      });
    }
  }, [user]);

  if (!user) {
    return (
      <div className="pt-40 pb-20 min-h-screen flex items-center justify-center">
        <p className="text-slate-400 font-bold">Yuklanmoqda...</p>
      </div>
    );
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setMessage(null);
    setSavingProfile(true);
    try {
      const { data } = await api.put('/users/profile', form);
      setMessage({ type: 'success', text: 'Profil saqlandi' });
      // AuthContext'ni yangilash
      const updated = data;
      localStorage.setItem("logistic_user", JSON.stringify(updated));
      window.location.reload(); // header'dagi ism yangilansin
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || err.message || 'Xatolik' });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSavePassword = async (e) => {
    e.preventDefault();
    setPwMessage(null);
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPwMessage({ type: 'error', text: 'Yangi parollar mos kelmadi' });
      return;
    }
    setSavingPassword(true);
    try {
      await api.put('/users/password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPwMessage({ type: 'success', text: 'Parol o\'zgartirildi. Qayta kiring.' });
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => {
        logout();
        navigate('/login');
      }, 1500);
    } catch (err) {
      setPwMessage({ type: 'error', text: err.response?.data?.message || err.message || 'Xatolik' });
    } finally {
      setSavingPassword(false);
    }
  };

  const inputCls = "w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 font-bold dark:text-white text-sm transition-all";

  return (
    <div className="pt-24 min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="container mx-auto px-4 md:px-6 py-10 max-w-5xl">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter">Profil</h1>
          <p className="text-slate-400 font-bold mt-2">Shaxsiy ma'lumotlaringiz va parolingizni boshqaring</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Avatar Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-xl text-center">
              <div className="relative inline-block mb-6">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-600 to-indigo-700 flex items-center justify-center text-white text-5xl font-black shadow-2xl shadow-primary-500/30 overflow-hidden">
                  {form.avatar ? (
                    <img src={form.avatar} alt={form.name} className="w-full h-full object-cover" />
                  ) : (
                    form.name[0]?.toUpperCase() || 'U'
                  )}
                </div>
              </div>

              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-1">{user.name}</h3>
              <p className="text-sm font-bold text-slate-400 mb-4">{user.email}</p>

              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 dark:bg-primary-500/10 rounded-2xl mb-6">
                <ShieldCheck size={16} className="text-primary-600" />
                <span className="text-xs font-black text-primary-600 uppercase tracking-widest">
                  {user.role === 'superadmin' ? 'Super Admin' : user.role === 'admin' ? 'Admin' : user.role === 'driver' ? 'Haydovchi' : 'Foydalanuvchi'}
                </span>
              </div>

              <div className="pt-6 border-t border-slate-50 dark:border-slate-800">
                <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center justify-center gap-2">
                  <ImageIcon size={14} /> Avatar URL
                </div>
                <input
                  type="url"
                  placeholder="https://example.com/avatar.jpg"
                  value={form.avatar}
                  onChange={(e) => setForm({ ...form, avatar: e.target.value })}
                  className={inputCls}
                />
                <p className="text-xs text-slate-400 mt-2 font-bold">Rasm URL manzilini kiriting</p>
              </div>
            </div>
          </motion.div>

          {/* Forms */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Profile form */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-primary-50 dark:bg-primary-500/10 rounded-2xl flex items-center justify-center">
                  <User size={22} className="text-primary-600" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">Shaxsiy ma'lumotlar</h3>
                  <p className="text-sm font-bold text-slate-400">Ism, email, telefon va avatar</p>
                </div>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">
                    <User size={12} className="inline mr-1" /> Ism sharifi
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">
                    <Mail size={12} className="inline mr-1" /> Email
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">
                    <Phone size={12} className="inline mr-1" /> Telefon
                  </label>
                  <input
                    type="tel"
                    placeholder="+998 90 123 45 67"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className={inputCls}
                  />
                </div>

                {message && (
                  <div className={`p-4 rounded-2xl flex items-center gap-3 font-bold text-sm ${
                    message.type === 'success'
                      ? 'bg-green-50 dark:bg-green-500/10 text-green-600'
                      : 'bg-rose-50 dark:bg-rose-500/10 text-rose-600'
                  }`}>
                    {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                    {message.text}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={savingProfile}
                  className="btn-primary w-full py-4 font-black flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Save size={18} />
                  {savingProfile ? 'Saqlanmoqda...' : 'Saqlash'}
                </button>
              </form>
            </div>

            {/* Password form */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-rose-50 dark:bg-rose-500/10 rounded-2xl flex items-center justify-center">
                  <Lock size={22} className="text-rose-500" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">Parolni o'zgartirish</h3>
                  <p className="text-sm font-bold text-slate-400">Xavfsizlik uchun kamida 6 ta belgi</p>
                </div>
              </div>

              <form onSubmit={handleSavePassword} className="space-y-4">
                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Joriy parol</label>
                  <div className="relative">
                    <input
                      type={showPw ? "text" : "password"}
                      required
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      className={inputCls + " pr-12"}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(!showPw)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Yangi parol</label>
                  <input
                    type={showPw ? "text" : "password"}
                    required
                    minLength={6}
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Yangi parolni tasdiqlang</label>
                  <input
                    type={showPw ? "text" : "password"}
                    required
                    minLength={6}
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    className={inputCls}
                  />
                </div>

                {pwMessage && (
                  <div className={`p-4 rounded-2xl flex items-center gap-3 font-bold text-sm ${
                    pwMessage.type === 'success'
                      ? 'bg-green-50 dark:bg-green-500/10 text-green-600'
                      : 'bg-rose-50 dark:bg-rose-500/10 text-rose-600'
                  }`}>
                    {pwMessage.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                    {pwMessage.text}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={savingPassword}
                  className="w-full py-4 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl font-black flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  <Lock size={18} />
                  {savingPassword ? 'O\'zgartirilmoqda...' : 'Parolni o\'zgartirish'}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;