import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Building2, Target, Eye, Heart, Users, Award, Globe,
  Calendar, MapPin, Briefcase, ShieldCheck, ArrowRight, Sparkles, Star
} from "lucide-react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import { usePartners } from "../context/PartnerContext";
import { formatDateSync as format } from "../utils/dateUtil";

const partnerFallbackImages = [
  "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80"
];

const normalizePartnerName = (name = "") => name.toLowerCase().trim();
const isHiddenPartner = (name = "") => ["wedcjksdccsd"].includes(normalizePartnerName(name));

const getPartnerInitials = (name = "Partner") =>
  name
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0] || "")
    .join("")
    .toUpperCase() || "P";

const getPartnerImage = (partner, index) => {
  const preferred = partner?.logo?.trim();
  return preferred || partnerFallbackImages[index % partnerFallbackImages.length];
};

const About = () => {
  const { partners } = usePartners();
  const visiblePartners = partners.filter((partner) => !isHiddenPartner(partner?.name));
  const [reviews, setReviews] = useState([]);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [{ data: rv }, { data: st }] = await Promise.all([
          api.get('/reviews'),
          api.get('/settings'),
        ]);
        setReviews(Array.isArray(rv) ? rv : []);
        setSettings(st || null);
      } catch { /* ignore */ }
    };
    load();
  }, []);

  const stats = [
    { val: '15K+', label: 'Mijozlar' },
    { val: '180+', label: 'Davlatlar' },
    { val: '99.9%', label: 'Muvaffaqiyat' },
    { val: '24/7', label: 'Qo\'llab-quvvatlash' },
  ];

  const values = [
    { icon: ShieldCheck, color: 'green', title: 'Ishonchlilik', desc: 'Yuklaringiz xavfsizligi bizning eng oliy ustuvorligimiz.' },
    { icon: Heart, color: 'rose', title: 'G\'amxo\'rlik', desc: 'Har bir mijozga individual yondashamiz.' },
    { icon: Target, color: 'blue', title: 'Aniqlik', desc: 'Vaqt va sifat — ikkalasi ham muhim.' },
    { icon: Award, color: 'amber', title: 'Sifat', desc: 'Faqat eng yuqori standartlardagi xizmat.' },
  ];

  const team = [
    {
      name: 'ERGASHEV AKBARSHOX',
      role: 'Bosh direktor',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
      initial: 'E'
    },
    {
      name: 'MAHKAMBAYEV SUNNAT',
      role: 'Operatsion direktor',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
      initial: 'M'
    },
    {
      name: 'BOBOYEV ABDURAXMON',
      role: 'Texnik direktor',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
      initial: 'B'
    },
  ];

  return (
    <div className="flex flex-col w-full overflow-x-hidden">
      {/* Hero */}
      <section className="pt-40 pb-20 bg-linear-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white dark:bg-slate-800 text-primary-600 dark:text-primary-400 text-xs font-black mb-6 border border-slate-100 dark:border-slate-800 shadow-xl uppercase tracking-widest"
            >
              <Building2 size={14} />
              Biz haqimizda
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter leading-none mb-6"
            >
              Kelajak <span className="gradient-text">Logistikasi</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-slate-500 dark:text-slate-400 leading-relaxed font-medium max-w-2xl mx-auto"
            >
              {settings?.siteDescription || 'LogisticPro — zamonaviy logistika va yuk tashish kompaniyasi. Biz har bir mijoz uchun eng yaxshi yechimni topamiz.'}
            </motion.p>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16"
          >
            {stats.map((s, i) => (
              <div key={i} className="text-center p-6 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-xl">
                <div className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-2 tracking-tighter">{s.val}</div>
                <div className="text-xs font-black text-slate-400 uppercase tracking-widest">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Mission / Vision */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-10 rounded-[2.5rem] bg-linear-to-br from-primary-600 to-indigo-700 text-white shadow-2xl"
            >
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6">
                <Target size={28} />
              </div>
              <h3 className="text-3xl font-black mb-4">Maqsadimiz</h3>
              <p className="text-white/80 leading-relaxed font-medium">
                O'zbekiston va Markaziy Osiyo bo'ylab eng ishonchli, tezkor va zamonaviy logistika xizmatini ko'rsatish. Har bir mijoz va hamkor uchun eng yaxshi yechimni yaratish.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-10 rounded-[2.5rem] bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-xl"
            >
              <div className="w-16 h-16 bg-primary-50 dark:bg-primary-500/10 rounded-2xl flex items-center justify-center text-primary-600 mb-6">
                <Eye size={28} />
              </div>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Ko'rishimiz</h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                Markaziy Osiyodagi eng innovatsion logistika kompaniyasiga aylanish. Raqamli texnologiyalar orqali butun tarmoq bo'ylab uzluksiz xizmat ko'rsatish.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <div className="text-primary-600 font-black tracking-widest uppercase text-xs mb-3">Qadriyatlarimiz</div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter">Bizning <span className="gradient-text">Qadriyatlar</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl text-center hover:-translate-y-2 transition-all"
                >
                  <div className="w-14 h-14 bg-primary-50 dark:bg-primary-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary-600">
                    <Icon size={24} />
                  </div>
                  <h4 className="text-lg font-black text-slate-900 dark:text-white mb-2">{v.title}</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{v.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <div className="text-primary-600 font-black tracking-widest uppercase text-xs mb-3">Jamoamiz</div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter">Bizning <span className="gradient-text">Mutaxassislar</span></h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center group"
              >
                <div className="w-32 h-32 mx-auto mb-4 rounded-3xl overflow-hidden bg-linear-to-br from-primary-600 to-indigo-700 flex items-center justify-center text-white text-5xl font-black shadow-2xl shadow-primary-500/20 group-hover:scale-105 transition-transform">
                  {m.avatar ? (
                    <img src={m.avatar} alt={m.name} className="w-full h-full object-cover" />
                  ) : (
                    m.initial
                  )}
                </div>
                <h4 className="font-black text-slate-900 dark:text-white">{m.name}</h4>
                <p className="text-sm font-bold text-slate-400 mt-1">{m.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      {reviews.length > 0 && (
        <section className="py-20 bg-slate-50 dark:bg-slate-950">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <div className="text-primary-600 font-black tracking-widest uppercase text-xs mb-3">Mijozlar fikri</div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter">Mijozlar <span className="gradient-text">Nima Deydi</span></h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {reviews.slice(0, 6).map((r, i) => (
                <motion.div
                  key={r._id || i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl"
                >
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: 5 }, (_, idx) => (
                      <Star
                        key={idx}
                        size={16}
                        className={idx < r.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200 dark:text-slate-700'}
                      />
                    ))}
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed italic mb-6">"{r.comment}"</p>
                  <div className="flex items-center gap-3 pt-4 border-t border-slate-50 dark:border-slate-800">
                    <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-500/10 flex items-center justify-center text-primary-600 font-black">
                      {r.userName?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <div className="font-black text-slate-900 dark:text-white text-sm">{r.userName}</div>
                      <div className="text-xs font-bold text-slate-400">
                        {r.createdAt ? format(new Date(r.createdAt), 'dd MMM yyyy') : ''}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Partners */}
      {visiblePartners.length > 0 && (
        <section className="py-20 bg-white dark:bg-slate-900">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <div className="text-primary-600 font-black tracking-widest uppercase text-xs mb-3">Hamkorlarimiz</div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter">Ishonchli <span className="gradient-text">Hamkorlar</span></h2>
            </div>
            <div className="flex flex-wrap justify-center gap-8">
              {visiblePartners.map((p, index) => (
                <a
                  key={p._id}
                  href={p.website || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="w-40 h-28 flex flex-col items-center justify-center gap-2 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 hover:border-primary-500/30 transition-all"
                >
                  <img
                    src={getPartnerImage(p, index)}
                    alt={p.name}
                    loading="lazy"
                    onError={(e) => {
                      if (e.currentTarget.dataset.fallbackApplied === "true") {
                        e.currentTarget.style.display = "none";
                        e.currentTarget.nextSibling?.classList.remove("hidden");
                        return;
                      }
                      e.currentTarget.dataset.fallbackApplied = "true";
                      e.currentTarget.src = partnerFallbackImages[index % partnerFallbackImages.length];
                    }}
                    className="max-h-12 max-w-full object-contain rounded-lg"
                  />
                  <div className="text-sm font-black tracking-wide text-slate-700 dark:text-slate-200 text-center">
                    {p.name || "Global Partner"}
                  </div>
                  <div className={`text-lg font-black tracking-wide text-slate-700 dark:text-slate-200 ${p.logo ? 'hidden' : 'flex'}`}>
                    {getPartnerInitials(p.name)}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="bg-linear-to-br from-primary-600 to-indigo-700 rounded-[3rem] p-12 md:p-16 text-white text-center shadow-2xl">
            <Sparkles size={40} className="mx-auto mb-6 opacity-80" />
            <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter">Bizga qo'shiling</h2>
            <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">
              LogisticPro — bu ishonchli logistika hamkori. Hoziroq buyurtma bering yoki biz bilan bog'laning.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/buyurtma" className="bg-white text-primary-600 px-8 py-4 rounded-2xl font-black hover:shadow-xl transition-all inline-flex items-center justify-center gap-2">
                Buyurtma berish <ArrowRight size={18} />
              </Link>
              <Link to="/boglanish" className="bg-white/10 backdrop-blur-md border border-white/20 px-8 py-4 rounded-2xl font-black hover:bg-white/20 transition-all inline-flex items-center justify-center gap-2">
                Bog'lanish
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;