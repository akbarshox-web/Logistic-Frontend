import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Truck, Shield, Clock, Globe, ArrowRight, Package, MapPin, Phone, Star, Zap, Award, CheckCircle, Users, BarChart3, TrendingUp, MessageSquare, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import Sticker from "../components/ui/Sticker";
import ThreeDCard from "../components/ui/ThreeDCard";
import FloatingElements from "../components/ui/FloatingElements";
import { usePartners } from "../context/PartnerContext";
import ParallaxSection, { ParallaxBackground } from "../components/ui/ParallaxSection";
import api from "../utils/api";
import { formatDateSync as format } from "../utils/dateUtil";

const Home = () => {
  const { partners } = usePartners();
  const [stats, setStats] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [settings, setSettings] = useState(null);
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const { scrollYProgress: featuresScroll } = useScroll({
    target: featuresRef,
    offset: ["start end", "end start"]
  });

  const yText = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const yCard = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const featuresY = useTransform(featuresScroll, [0, 1], [100, -100]);
  const featuresOpacity = useTransform(featuresScroll, [0, 0.3, 0.7, 1], [0.5, 1, 1, 0.5]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0, rotateX: -10 },
    visible: {
      y: 0,
      opacity: 1,
      rotateX: 0,
      transition: { type: "spring", stiffness: 100 }
    },
  };

  useEffect(() => {
    const load = async () => {
      try {
        const [{ data: dash }, { data: rv }, { data: st }] = await Promise.all([
          api.get('/orders/stats/dashboard').catch(() => ({ data: null })),
          api.get('/reviews').catch(() => ({ data: [] })),
          api.get('/settings').catch(() => ({ data: null })),
        ]);
        setStats(dash);
        setReviews(Array.isArray(rv) ? rv : []);
        setSettings(st || null);
      } catch (e) { /* ignore */ }
    };
    load();
  }, []);

  const statCards = [
    { icon: Package, val: stats?.totals?.orders?.toLocaleString() || '15K+', label: 'Buyurtmalar', color: 'blue' },
    { icon: Users,   val: stats?.totals?.clients?.toLocaleString() || '12K+', label: 'Mijozlar',    color: 'purple' },
    { icon: Truck,   val: stats?.totals?.drivers?.toLocaleString() || '250+', label: 'Haydovchilar', color: 'orange' },
    { icon: CheckCircle, val: '99.9%', label: 'Muvaffaqiyat', color: 'green' },
  ];

  const services = [
    { icon: Truck, color: 'primary', title: 'Yuk tashish', desc: 'Mahalliy va xalqaro yo\'nalishlar bo\'yicha tezkor yuk tashish xizmati.', link: '/xizmatlar' },
    { icon: Package, color: 'blue', title: 'Omborxona', desc: 'Yuklaringiz uchun zamonaviy va xavfsiz saqlash imkoniyati.', link: '/xizmatlar' },
    { icon: Globe, color: 'indigo', title: 'Xalqaro logistika', desc: 'Butun dunyo bo\'ylab yuklaringizni yetkazib berish.', link: '/xizmatlar' },
    { icon: Shield, color: 'green', title: 'Sug\'urta', desc: 'Yuklaringiz to\'liq sug\'urta bilan himoyalangan.', link: '/narxlar' },
  ];

  const advantages = [
    { icon: Clock, color: 'blue', title: '24/7 Qo\'llab-quvvatlash', desc: 'Doimo aloqadamiz. Har qanday savolga javob beramiz.' },
    { icon: Award, color: 'amber', title: 'Sifat kafolati', desc: 'Yuqori sifatli xizmat va mas\'uliyatli yondashuv.' },
    { icon: Zap, color: 'orange', title: 'Tezkor yetkazish', desc: 'Eng qisqa muddatlarda manzilingizga yetkazamiz.' },
    { icon: Shield, color: 'green', title: 'Xavfsizlik', desc: 'Yuklaringiz butun yo\'nalish davomida himoyalangan.' },
    { icon: TrendingUp, color: 'purple', title: 'Shaffof narxlar', desc: 'Hech qanday yashirin to\'lovlarsiz, aniq narxlar.' },
    { icon: Phone, color: 'rose', title: 'Onlayn kuzatuv', desc: 'Buyurtmangiz holatini istalgan vaqtda kuzating.' },
  ];

  return (
    <div className="flex flex-col w-full overflow-x-hidden">
      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-[95vh] flex items-center pt-32 pb-20 dark:bg-slate-900 overflow-hidden">
        <ParallaxBackground />
        <FloatingElements />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              style={{ y: yText, opacity }}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-md text-primary-700 dark:text-primary-400 text-sm font-bold mb-8 border border-white/50 dark:border-slate-700/50 shadow-xl shadow-primary-500/5"
              >
                <Sticker icon={Shield} color="primary" size={14} className="p-1.5 shadow-none" />
                <span>Ishonchli va Tezkor Logistika</span>
              </motion.div>
              
              <h1 className="text-6xl md:text-8xl font-black leading-[1.1] text-slate-900 dark:text-white mb-8 tracking-tight">
                Kelajak <span className="gradient-text">Yetkazib</span> Berish Tizimi
              </h1>
              
              <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-lg leading-relaxed font-medium">
                Biz yuklaringizni nafaqat manzilingizga, balki kelajakka yetkazamiz. 
                3D kuzatuv va aqlli logistika bilan xizmatingizdamiz.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-5">
                <Link to="/buyurtma" className="btn-primary group overflow-hidden relative">
                  <span className="relative z-10">Hoziroq boshlang</span>
                  <ArrowRight size={22} className="relative z-10 group-hover:translate-x-2 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
                <Link to="/kuzatish" className="btn-secondary group dark:bg-slate-800 dark:text-white dark:border-slate-700">
                  <span>Yukni kuzatish</span>
                  <MapPin size={22} className="group-hover:text-primary-600 transition-colors" />
                </Link>
              </div>

              {/* Stats - hero */}
              <div className="grid grid-cols-3 gap-10 mt-16 border-t border-slate-200 dark:border-slate-800 pt-10">
                {[
                  { label: "Mijozlar", val: stats?.totals?.clients ? `${stats.totals.clients}+` : "15k+" },
                  { label: "Buyurtmalar", val: stats?.totals?.orders ? `${stats.totals.orders}+` : "50k+" },
                  { label: "Muvaffaqiyat", val: "99.9%" }
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                  >
                    <div className="text-4xl font-black text-slate-900 dark:text-white mb-1 tracking-tighter">{stat.val}</div>
                    <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div style={{ y: yCard }} className="relative perspective-1000">
              <ThreeDCard className="w-full aspect-square max-w-[550px] mx-auto">
                <div className="w-full h-full bg-gradient-to-br from-primary-600 to-indigo-700 rounded-[3rem] p-1 shadow-2xl overflow-hidden relative group">
                  {/* Decorative background in card */}
                  <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.4),transparent)]" />
                  <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-colors duration-500" />
                  
                  <div className="w-full h-full bg-white/5 backdrop-blur-sm rounded-[2.8rem] flex flex-col items-center justify-center relative overflow-hidden">
                    <motion.div
                      animate={{ 
                        y: [0, -20, 0],
                        rotateY: [0, 10, 0, -10, 0]
                      }}
                      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                      className="relative z-10"
                    >
                      <Package size={200} className="text-white drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)]" strokeWidth={1} />
                    </motion.div>
                    
                    <div className="absolute bottom-12 left-0 w-full text-center px-8">
                      <div className="text-white/60 font-bold tracking-widest uppercase text-xs mb-2">Yuk holati</div>
                      <div className="text-white text-2xl font-black italic">XAVFSIZLIK KAFOLATLANGAN</div>
                    </div>
                  </div>
                </div>

                {/* Floating Badges */}
                <motion.div
                  animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-10 -right-6 glass p-6 rounded-[2rem] z-20 shadow-2xl border-white/50"
                >
                  <div className="flex items-center gap-4">
                    <Sticker icon={Zap} color="orange" size={24} />
                    <div>
                      <div className="text-xs font-black text-slate-400 uppercase tracking-tighter">Tezlik</div>
                      <div className="text-lg font-black text-slate-900">Eskpress</div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute -bottom-8 -left-8 glass-dark p-6 rounded-[2rem] z-20 shadow-2xl border-slate-700/50"
                >
                  <div className="flex items-center gap-4">
                    <Sticker icon={Globe} color="blue" size={24} />
                    <div className="text-white">
                      <div className="text-xs font-black text-slate-500 uppercase tracking-tighter">Qamrov</div>
                      <div className="text-lg font-black">Global</div>
                    </div>
                  </div>
                </motion.div>
              </ThreeDCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section with Parallax */}
      <section ref={featuresRef} className="py-32 relative bg-white dark:bg-slate-900 overflow-hidden">
        <ParallaxBackground className="opacity-50" />
        <motion.div style={{ y: featuresY, opacity: featuresOpacity }} className="relative z-10">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="max-w-2xl"
              >
                <div className="text-primary-600 font-black tracking-widest uppercase text-sm mb-4">
                  Bizning afzalliklarimiz
                </div>
                <h2 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
                  Sifat <span className="text-slate-300 dark:text-slate-700">va</span> Ishonch
                </h2>
              </motion.div>
              <motion.p
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-lg text-slate-500 dark:text-slate-400 max-w-sm font-medium"
              >
                Biz har bir detalga e'tibor qaratamiz, toki siz xotirjam bo'ling.
              </motion.p>
            </div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            >
            {[
              {
                icon: Truck,
                color: "primary",
                title: "Tezkor Yetkazish",
                desc: "Eng so'nggi algoritmlar yordamida eng qisqa yo'llar."
              },
              {
                icon: Shield,
                color: "green",
                title: "To'liq Sug'urta",
                desc: "Yukingiz qiymati 100% kafolatlangan va himoyalangan."
              },
              {
                icon: Award,
                color: "amber",
                title: "Top Xizmat",
                desc: "Xalqaro logistika mukofotlari sovrindori."
              },
              {
                icon: Phone,
                color: "rose",
                title: "Jonli Aloqa",
                desc: "Botlar emas, haqiqiy mutaxassislar yordam beradi."
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="group relative"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="p-10 rounded-[2.5rem] bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800 hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-500 hover:-translate-y-4 h-full flex flex-col items-center text-center">
                  <div className="mb-8">
                    <Sticker icon={feature.icon} color={feature.color} size={32} />
                  </div>
                  <h3 className="text-2xl font-black mb-4 text-slate-900 dark:text-white tracking-tight">{feature.title}</h3>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{feature.desc}</p>
                  
                  {/* Decorative dot */}
                  <div className="mt-8 w-2 h-2 rounded-full bg-slate-200 dark:bg-slate-700 group-hover:bg-primary-500 transition-colors duration-300" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
        </motion.div>
      </section>

      {/* Partners Section */}
      {partners.length > 0 && (
        <section className="py-24 bg-slate-50 dark:bg-slate-900/50 relative overflow-hidden">
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-primary-600 font-black tracking-widest uppercase text-xs mb-4"
              >
                Bizning ishonchli hamkorlarimiz
              </motion.div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter">Global <span className="gradient-text">Hamkorlik</span></h2>
            </div>

            <div className="flex flex-wrap justify-center gap-8 md:gap-16">
              {partners.map((partner, idx) => (
                <motion.a
                  key={partner._id}
                  href={partner.website || "#"}
                  target="_blank"
                  rel="noreferrer"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.6 }}
                  whileHover={{ y: -5, scale: 1.05 }}
                  className="w-32 md:w-48 h-20 flex items-center justify-center p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-white dark:border-slate-700 hover:border-primary-500/30 transition-all duration-300"
                >
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="max-h-full max-w-full object-contain grayscale hover:grayscale-0 transition-all duration-500 invert dark:invert-0"
                  />
                </motion.a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─────── STATISTIKA BO'LIMI ─────── */}
      <section className="py-24 bg-gradient-to-br from-primary-600 to-indigo-700 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -z-0" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -z-0" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-md text-white text-xs font-black uppercase tracking-widest mb-4">
              <BarChart3 size={14} />
              Statistika
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter">Bizning <span className="text-white/80">Ko'rsatkichlar</span></h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {statCards.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 text-center hover:bg-white/15 transition-all"
                >
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon size={24} />
                  </div>
                  <div className="text-4xl md:text-5xl font-black tracking-tighter mb-2">{s.val}</div>
                  <div className="text-xs font-black uppercase tracking-widest text-white/80">{s.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─────── XIZMATLAR BO'LIMI ─────── */}
      <section className="py-24 bg-white dark:bg-slate-900 relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <div className="text-primary-600 font-black tracking-widest uppercase text-xs mb-3">Xizmatlar</div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter">Bizning <span className="gradient-text">Xizmatlar</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group bg-slate-50 dark:bg-slate-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-700 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-500"
                >
                  <div className="mb-6">
                    <Sticker icon={Icon} color={s.color} size={28} />
                  </div>
                  <h3 className="text-xl font-black mb-3 text-slate-900 dark:text-white tracking-tight">{s.title}</h3>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium mb-6 text-sm">{s.desc}</p>
                  <Link to={s.link} className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 font-black text-sm group-hover:gap-3 transition-all">
                    Batafsil <ArrowRight size={16} />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─────── AFZALLIKLAR BO'LIMI ─────── */}
      <section className="py-24 bg-slate-50 dark:bg-slate-950">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <div className="text-primary-600 font-black tracking-widest uppercase text-xs mb-3">Nega biz?</div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter">Bizning <span className="gradient-text">Afzalliklar</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {advantages.map((a, i) => {
              const Icon = a.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="flex gap-5 p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-primary-500/30 transition-all"
                >
                  <div className="shrink-0">
                    <Sticker icon={Icon} color={a.color} size={22} />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 dark:text-white mb-2">{a.title}</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{a.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─────── MIJOZLAR FIKRI ─────── */}
      {reviews.length > 0 && (
        <section className="py-24 bg-white dark:bg-slate-900">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
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
                  className="bg-slate-50 dark:bg-slate-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-700"
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
                  <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed italic mb-6 text-sm">"{r.comment}"</p>
                  <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
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

      {/* ─────── CTA BO'LIMI ─────── */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="bg-gradient-to-br from-primary-600 to-indigo-700 rounded-[3rem] p-12 md:p-16 text-white text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
            <div className="relative z-10">
              <Sparkles size={40} className="mx-auto mb-6 opacity-80" />
              <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter">Bizga qo'shiling</h2>
              <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">
                {settings?.siteDescription || 'LogisticPro — bu ishonchli logistika hamkori. Hoziroq buyurtma bering yoki biz bilan bog\'laning.'}
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
        </div>
      </section>
    </div>
  );
};

export default Home;
