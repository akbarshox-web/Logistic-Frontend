import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Package, TrendingUp, AlertCircle, LayoutDashboard, Settings, LogOut, Search, Bell, ChevronRight, Zap, UserPlus, Trash2, Calendar, Plus, ExternalLink, Image as ImageIcon, ArrowRight, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { usePartners } from "../context/PartnerContext";
import Sticker from "../components/ui/Sticker";
import ThreeDCard from "../components/ui/ThreeDCard";
import api from "../utils/api";

const Admin = () => {
  const { user, logout } = useAuth();
  const { partners, addPartner, deletePartner, loading: partnersLoading } = usePartners();
  const [activeTab, setActiveTab] = useState("dashboard");

  // Admin Management State
  const [managedAdmins, setManagedAdmins] = useState([]);
  const [newAdminName, setNewAdminName] = useState("");
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");
  const [adminsLoading, setAdminsLoading] = useState(false);

  // Partner Management State
  const [newPartnerName, setNewPartnerName] = useState("");
  const [newPartnerLogo, setNewPartnerLogo] = useState("");
  const [newPartnerWebsite, setNewPartnerWebsite] = useState("");

  const fetchAdmins = async () => {
    try {
      setAdminsLoading(true);
      const { data } = await api.get('/users');
      setManagedAdmins(Array.isArray(data) ? data : []);
      setAdminsLoading(false);
    } catch (err) {
      console.error("Fetch admins error:", err);
      setManagedAdmins([]);
      setAdminsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "admins") {
      fetchAdmins();
    }
  }, [activeTab]);

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    if (!newAdminName || !newAdminEmail || !newAdminPassword) {
      alert("Barcha maydonlarni to'ldiring");
      return;
    }
    try {
      const { data } = await api.post('/users', { 
        name: newAdminName, 
        email: newAdminEmail, 
        password: newAdminPassword,
        role: "admin" 
      });
      setManagedAdmins(prev => [...prev, data]);
      setNewAdminName(""); 
      setNewAdminEmail("");
      setNewAdminPassword("");
    } catch (err) {
      alert(err.response?.data?.message || "Admin qo'shishda xato");
    }
  };

  const handleDeleteAdmin = async (id) => {
    if (window.confirm("Haqiqatan ham ushbu adminni o'chirmoqchimisiz?")) {
      try {
        await api.delete(`/users/${id}`);
        setManagedAdmins(prev => prev.filter(a => a._id !== id));
      } catch (err) {
        alert(err.response?.data?.message || "Adminni o'chirishda xato");
      }
    }
  };

  const handleAddPartner = async (e) => {
    e.preventDefault();
    if (!newPartnerName || !newPartnerLogo) {
      alert("Nomi va Logo URL talab qilinadi");
      return;
    }
    try {
      await addPartner({
        name: newPartnerName,
        logo: newPartnerLogo,
        website: newPartnerWebsite
      });
      setNewPartnerName("");
      setNewPartnerLogo("");
      setNewPartnerWebsite("");
    } catch (err) {
      alert(typeof err === 'string' ? err : err.message || "Xatolik");
    }
  };

  const stats = [
    { label: "Jami Buyurtmalar", value: "1,284", icon: Package, color: "blue", change: "+12%" },
    { label: "Faol Adminlar", value: managedAdmins.length.toString(), icon: ShieldCheck, color: "green", change: "+2%" },
    { label: "Hamkorlar", value: partners.length.toString(), icon: Users, color: "primary", change: "+5%" },
    { label: "Oylik Daromad", value: "$42,500", icon: TrendingUp, color: "orange", change: "+18%" },
  ];

  return (
    <div className="pt-24 min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col lg:flex-row overflow-hidden transition-colors duration-300">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-80 flex-col bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 p-8 fixed h-full z-20">
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-xl shadow-primary-500/20">
            <LayoutDashboard size={20} strokeWidth={2.5} />
          </div>
          <span className="font-black text-xl tracking-tighter uppercase italic text-slate-900 dark:text-white">Admin<span className="text-primary-600">Pro</span></span>
        </div>
        
        <nav className="space-y-3 flex-1">
          {[
            { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
            { id: "admins", icon: ShieldCheck, label: "Adminlar" },
            { id: "partners", icon: Users, label: "Hamkorlar" },
            { id: "settings", icon: Settings, label: "Sozlamalar" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all group ${
                activeTab === item.id 
                  ? "bg-primary-600 text-white shadow-xl shadow-primary-500/25" 
                  : "text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <div className="flex items-center gap-4">
                <item.icon size={20} strokeWidth={activeTab === item.id ? 3 : 2} />
                {item.label}
              </div>
              {activeTab === item.id && <ChevronRight size={16} strokeWidth={3} />}
            </button>
          ))}
        </nav>

        <button 
          onClick={logout}
          className="flex items-center gap-4 px-6 py-4 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-2xl text-sm font-black uppercase tracking-widest transition-all mt-auto border border-transparent hover:border-rose-100 dark:hover:border-rose-900/30"
        >
          <LogOut size={20} strokeWidth={2.5} />
          Chiqish
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-80 p-6 md:p-12 overflow-y-auto w-full">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
          <div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter mb-2">
              {activeTab === "dashboard" ? `Xush kelibsiz, ${user?.name}!` : 
               activeTab === "admins" ? "Adminlarni Boshqarish" : 
               activeTab === "partners" ? "Hamkorlar Markazi" : "Sozlamalar"}
            </h1>
            <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 font-bold text-sm uppercase tracking-widest">
              <Calendar className="w-4 h-4" />
              11-Iyun, 2026
            </div>
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-80 group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-primary-600 transition-colors" size={20} />
              <input
                type="text"
                placeholder="Qidiruv..."
                className="w-full pl-14 pr-6 py-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 font-bold transition-all shadow-sm dark:text-white"
              />
            </div>
            <button className="w-14 h-14 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-slate-400 hover:text-primary-600 hover:border-primary-100 dark:hover:border-slate-700 transition-all flex items-center justify-center relative shadow-sm">
              <Bell size={24} />
              <span className="absolute top-4 right-4 w-3 h-3 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900" />
            </button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === "dashboard" && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                {stats.map((stat, idx) => (
                  <ThreeDCard key={idx}>
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl relative overflow-hidden h-full group">
                      <div className="flex justify-between items-start mb-6">
                        <Sticker icon={stat.icon} color={stat.color} size={24} className="shadow-none" />
                        <span className={`text-xs font-black px-3 py-1.5 rounded-full tracking-widest ${
                          stat.change.startsWith("+") ? "bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400" : "bg-rose-100 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400"
                        }`}>
                          {stat.change}
                        </span>
                      </div>
                      <div className="text-4xl font-black text-slate-900 dark:text-white mb-2 tracking-tighter">{stat.value}</div>
                      <div className="text-slate-400 dark:text-slate-500 font-bold text-sm uppercase tracking-widest">{stat.label}</div>
                    </div>
                  </ThreeDCard>
                ))}
              </div>

              {/* Quick Partner View */}
              <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-2xl p-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/5 rounded-full blur-3xl -z-10" />
                <div className="flex justify-between items-center mb-10">
                  <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Faol Hamkorlar</h3>
                  <button onClick={() => setActiveTab("partners")} className="text-primary-600 font-black text-sm uppercase tracking-widest hover:underline flex items-center gap-2">
                    Barchasi <ArrowRight size={16} />
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                  {partners.slice(0, 5).map((p) => (
                    <div key={p._id} className="aspect-square bg-slate-50 dark:bg-slate-800/50 rounded-3xl p-6 flex items-center justify-center border border-slate-100 dark:border-slate-800 group hover:border-primary-500 transition-all duration-500 hover:shadow-xl">
                      <img src={p.logo} alt={p.name} className="max-h-full object-contain grayscale group-hover:grayscale-0 transition-all dark:invert" />
                    </div>
                  ))}
                  <button onClick={() => setActiveTab("partners")} className="aspect-square bg-slate-50 dark:bg-slate-800/50 rounded-3xl p-6 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-600 hover:border-primary-500 hover:text-primary-600 transition-all">
                    <Plus size={24} className="mb-1" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Qo'shish</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "admins" && (
            <motion.div
              key="admins"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 xl:grid-cols-3 gap-8"
            >
              <div className="xl:col-span-1">
                <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-2xl relative overflow-hidden lg:sticky lg:top-32">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-green-600/5 rounded-full blur-3xl -z-10" />
                  <div className="flex items-center gap-4 mb-8">
                    <Sticker icon={UserPlus} color="green" size={20} className="shadow-none p-2.5" />
                    <h3 className="font-black text-2xl tracking-tight text-slate-900 dark:text-white">Yangi Admin</h3>
                  </div>
                  <form onSubmit={handleAddAdmin} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Ism sharifi</label>
                      <input type="text" value={newAdminName} onChange={(e) => setNewAdminName(e.target.value)} placeholder="Akbarshox..." className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 font-bold transition-all dark:text-white" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Email manzili</label>
                      <input type="email" value={newAdminEmail} onChange={(e) => setNewAdminEmail(e.target.value)} placeholder="admin@example.com" className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 font-bold transition-all dark:text-white" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Parol</label>
                      <input type="password" value={newAdminPassword} onChange={(e) => setNewAdminPassword(e.target.value)} placeholder="••••••••" className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 font-bold transition-all dark:text-white" />
                    </div>
                    <button type="submit" className="btn-primary w-full py-5 text-lg font-black mt-4">Saqlash</button>
                  </form>
                </div>
              </div>
              <div className="xl:col-span-2">
                <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-2xl overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50/50 dark:bg-slate-800/50">
                      <tr>
                        <th className="px-10 py-6 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Admin</th>
                        <th className="px-10 py-6 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">Amal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                      {managedAdmins.map((a) => (
                        <tr key={a._id} className="group">
                          <td className="px-10 py-8">
                            <div className="font-black text-slate-900 dark:text-white tracking-tight">{a.name}</div>
                            <div className="text-sm font-bold text-slate-400 dark:text-slate-500">{a.email}</div>
                          </td>
                          <td className="px-10 py-8 text-right">
                            <button 
                              onClick={() => handleDeleteAdmin(a._id)}
                              className="w-12 h-12 bg-slate-50 dark:bg-slate-800 text-slate-300 dark:text-slate-600 hover:bg-rose-500 dark:hover:bg-rose-600 hover:text-white transition-all rounded-2xl flex items-center justify-center ml-auto"
                            >
                              <Trash2 size={20} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "partners" && (
            <motion.div
              key="partners"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 xl:grid-cols-3 gap-8"
            >
              <div className="xl:col-span-1">
                <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-2xl relative overflow-hidden lg:sticky lg:top-32">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary-600/5 rounded-full blur-3xl -z-10" />
                  <div className="flex items-center gap-4 mb-8">
                    <Sticker icon={Plus} color="primary" size={20} className="shadow-none p-2.5" />
                    <h3 className="font-black text-2xl tracking-tight text-slate-900 dark:text-white">Hamkor Qo'shish</h3>
                  </div>
                  <form onSubmit={handleAddPartner} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Kompaniya nomi</label>
                      <input type="text" value={newPartnerName} onChange={(e) => setNewPartnerName(e.target.value)} placeholder="Google..." className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 font-bold transition-all dark:text-white" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Logo URL</label>
                      <div className="relative">
                        <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
                        <input type="text" value={newPartnerLogo} onChange={(e) => setNewPartnerLogo(e.target.value)} placeholder="https://..." className="w-full pl-12 pr-6 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 font-bold transition-all dark:text-white" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Veb-sayt</label>
                      <input type="text" value={newPartnerWebsite} onChange={(e) => setNewPartnerWebsite(e.target.value)} placeholder="www.example.com" className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 font-bold transition-all dark:text-white" />
                    </div>
                    <button type="submit" className="btn-primary w-full py-5 text-lg font-black mt-4">Saqlash</button>
                  </form>
                </div>
              </div>
              <div className="xl:col-span-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {partners.map((p) => (
                    <div key={p._id} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl flex flex-col group relative overflow-hidden transition-all duration-300">
                      <div className="flex justify-between items-start mb-6">
                        <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-2xl p-4 flex items-center justify-center border border-slate-100 dark:border-slate-700">
                          <img src={p.logo} alt={p.name} className="max-h-full object-contain dark:invert" />
                        </div>
                        <button onClick={() => deletePartner(p._id)} className="w-10 h-10 bg-rose-50 dark:bg-rose-500/10 text-rose-500 dark:text-rose-400 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-sm">
                          <Trash2 size={18} />
                        </button>
                      </div>
                      <h4 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-2">{p.name}</h4>
                      {p.website && (
                        <a href={p.website} target="_blank" rel="noreferrer" className="text-primary-600 dark:text-primary-400 font-bold text-sm flex items-center gap-2 hover:underline">
                          Veb-sayt <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                  ))}
                  {partners.length === 0 && (
                    <div className="col-span-full py-20 text-center text-slate-400 dark:text-slate-600 font-black uppercase tracking-widest bg-white dark:bg-slate-900 rounded-[3rem] border-2 border-dashed border-slate-100 dark:border-slate-800">
                      Hozircha hamkorlar yo'q
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Admin;
