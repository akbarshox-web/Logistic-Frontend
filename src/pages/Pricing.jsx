import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Check, X, Shield, Clock, Zap, Star } from "lucide-react";
import Sticker from "../components/ui/Sticker";
import ThreeDCard from "../components/ui/ThreeDCard";
import FloatingElements from "../components/ui/FloatingElements";

const Pricing = () => {
  const { t } = useTranslation();
  const plans = [
    {
      name: "Standard",
      price: "19",
      description: "Kichik va o'rta hajmdagi yuklar uchun",
      features: [
        "Hududiy yetkazib berish",
        "Eshikdan eshikkacha",
        "Oddiy sug'urta",
        "GPS kuzatuv",
      ],
      notIncluded: [
        "Xalqaro tashuvlar",
        "Tezkor ekspress",
        "Maxsus qadoqlash",
      ],
      color: "bg-white",
      textColor: "text-slate-900",
      icon: Clock,
      stickerColor: "blue"
    },
    {
      name: "Professional",
      price: "49",
      description: "Doimiy va xalqaro tashuvlar uchun",
      popular: true,
      features: [
        "Barcha hududiy tashuvlar",
        "Xalqaro tashuvlar (MDH)",
        "Kengaytirilgan sug'urta",
        "GPS kuzatuv + bildirishnomalar",
        "24/7 shaxsiy menejer",
      ],
      notIncluded: [
        "Maxsus qadoqlash",
      ],
      color: "bg-primary-600",
      textColor: "text-white",
      icon: Shield,
      stickerColor: "white"
    },
    {
      name: "Enterprise",
      price: "99",
      description: "Yirik korporatsiyalar va maxsus yuklar uchun",
      features: [
        "Global tashuvlar (Butun dunyo)",
        "Ekspress yetkazib berish",
        "To'liq sug'urta qoplamasi",
        "Maxsus qadoqlash xizmati",
        "Bojxona ko'magi",
        "API integratsiya",
      ],
      notIncluded: [],
      color: "bg-slate-900",
      textColor: "text-white",
      icon: Zap,
      stickerColor: "amber"
    }
  ];

  return (
    <div className="pt-40 pb-32 bg-slate-50 dark:bg-slate-900 min-h-screen relative overflow-hidden">
      <FloatingElements />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white mb-8 tracking-tighter">
            Shaffof <span className="gradient-text">Narxlar</span>
          </h1>
          <p className="text-xl text-slate-500 dark:text-slate-400 font-medium">
            Sizga mos keladigan tarif rejasini tanlang. Hech qanday yashirin to'lovlar yo'q.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
          {plans.map((plan, idx) => (
            <ThreeDCard key={idx}>
              <div className={`relative p-10 rounded-[3rem] shadow-2xl flex flex-col h-full border border-slate-100 dark:border-slate-800 ${idx === 0 ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white' : plan.color + ' ' + plan.textColor}`}>
                {plan.popular && (
                  <div className="absolute top-0 right-12 -translate-y-1/2 bg-orange-500 text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-xl shadow-orange-500/40 flex items-center gap-2">
                    <Star size={14} fill="white" />
                    Eng ommabop
                  </div>
                )}
                
                <div className="mb-10">
                  <div className="mb-6">
                    <Sticker 
                      icon={plan.icon} 
                      color={plan.stickerColor === "white" ? "primary" : plan.stickerColor} 
                      className={plan.stickerColor === "white" ? "bg-white/20 border-white/20 text-white shadow-none" : ""}
                      size={28} 
                    />
                  </div>
                  <h3 className="text-3xl font-black mb-2 tracking-tight">{plan.name}</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black tracking-tighter">${plan.price}</span>
                    <span className={plan.popular || idx === 2 ? "text-white/60" : "text-slate-400 dark:text-slate-500 font-bold"}>/oy</span>
                  </div>
                  <p className={`mt-4 font-medium ${plan.popular || idx === 2 ? "text-white/70" : "text-slate-500 dark:text-slate-400"}`}>
                    {plan.description}
                  </p>
                </div>

                <div className="space-y-5 mb-12 flex-1">
                  {plan.features.map((feature, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-4">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${plan.popular ? "bg-white text-primary-600" : "bg-primary-600 text-white"}`}>
                        <Check size={14} strokeWidth={4} />
                      </div>
                      <span className="text-sm font-bold tracking-tight">{feature}</span>
                    </div>
                  ))}
                  {plan.notIncluded.map((feature, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-4 opacity-40">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${plan.popular || idx === 2 ? "bg-white/20 text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500"}`}>
                        <X size={14} strokeWidth={4} />
                      </div>
                      <span className="text-sm font-bold tracking-tight line-through">{feature}</span>
                    </div>
                  ))}
                </div>

                <button className={`w-full py-5 rounded-[2rem] font-black transition-all active:scale-95 text-lg shadow-xl ${
                  plan.popular 
                    ? "bg-white text-primary-600 hover:shadow-white/20" 
                    : idx === 2 
                      ? "bg-primary-600 text-white hover:bg-primary-700 shadow-primary-500/20"
                      : "bg-slate-900 dark:bg-slate-700 text-white hover:bg-slate-800 dark:hover:bg-slate-600 shadow-slate-900/20"
                }`}>
                  Hoziroq boshlang
                </button>
              </div>
            </ThreeDCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing;
