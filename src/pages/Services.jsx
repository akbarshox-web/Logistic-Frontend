import React from "react";
import { motion } from "framer-motion";
import { Truck, Ship, Plane, Train, Package, Shield, Clock, MapPin, Zap, Globe, Headphones } from "lucide-react";
import Sticker from "../components/ui/Sticker";
import ThreeDCard from "../components/ui/ThreeDCard";
import FloatingElements from "../components/ui/FloatingElements";

const Services = () => {
  const services = [
    {
      icon: Truck,
      color: "blue",
      title: "Quruqlikdagi Tashuvlar",
      desc: "Zamonaviy yuk mashinalari parki orqali hududiy va xalqaro tashuvlar.",
      features: ["Eshikdan eshikkacha", "GPS kuzatuv", "Tezkor yetkazish"]
    },
    {
      icon: Plane,
      color: "sky",
      title: "Havo Yo'llari",
      desc: "Eng uzoq masofalarga yuklarni minimal vaqt ichida yetkazish.",
      features: ["Global qamrov", "Ekspress xizmat", "Maxsus yuklar"]
    },
    {
      icon: Ship,
      color: "indigo",
      title: "Dengiz Tashuvlari",
      desc: "Katta hajmdagi yuklarni okean ortiga tejamkor narxlarda yetkazish.",
      features: ["Konteyner tashuvlari", "LCL/FCL", "Port xizmatlari"]
    },
    {
      icon: Train,
      color: "primary",
      title: "Temir Yo'l Tashuvlari",
      desc: "O'rta va uzoq masofalarga ishonchli va barqaror yuk tashish.",
      features: ["Ommaviy yuklar", "Xavfsiz tashish", "Arzon tariflar"]
    },
    {
      icon: Package,
      color: "orange",
      title: "Omborxona Xizmati",
      desc: "Yuklarni xavfsiz saqlash va inventarizatsiya qilish tizimi.",
      features: ["24/7 nazorat", "Harorat nazorati", "Saralash va qadoqlash"]
    },
    {
      icon: Shield,
      color: "green",
      title: "Bojxona Rasmiylashtiruvi",
      desc: "Barcha turdagi bojxona hujjatlarini tayyorlash va ko'maklashish.",
      features: ["Konsultatsiya", "Hujjatlar to'plami", "Tezkor o'tkazish"]
    }
  ];

  return (
    <div className="pt-40 pb-32 bg-slate-50 dark:bg-slate-900 min-h-screen relative overflow-hidden">
      <FloatingElements />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white dark:bg-slate-800 text-primary-600 dark:text-primary-400 text-sm font-black mb-8 border border-slate-100 dark:border-slate-800 shadow-xl shadow-primary-500/5 uppercase tracking-widest"
          >
            <Zap size={16} fill="currentColor" />
            <span>Xizmatlarimiz</span>
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white mb-8 tracking-tighter">
            Professional <span className="gradient-text">Logistika</span> Yechimlari
          </h1>
          <p className="text-xl text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
            Mijozlarimiz ehtiyojidan kelib chiqib, har bir yuk uchun individual yondashuv va eng maqbul yo'nalishni tanlaymiz.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {services.map((service, idx) => (
            <ThreeDCard key={idx}>
              <div className="p-10 rounded-[2.5rem] bg-white dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 shadow-xl dark:shadow-none h-full flex flex-col group">
                <div className="mb-8">
                  <Sticker icon={service.icon} color={service.color} size={32} />
                </div>
                <h3 className="text-3xl font-black mb-4 text-slate-900 dark:text-white tracking-tight group-hover:text-primary-600 transition-colors duration-300">
                  {service.title}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed font-medium">{service.desc}</p>
                
                <div className="mt-auto space-y-4">
                  <div className="h-px bg-slate-100 dark:bg-slate-700 w-full" />
                  <ul className="grid grid-cols-1 gap-3">
                    {service.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-center gap-3 text-sm font-bold text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors duration-300">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </ThreeDCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;
