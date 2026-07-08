import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Truck, Mail, Phone, MapPin, Send, ArrowUpRight, MessageCircle, Camera, Briefcase, Globe } from "lucide-react";
import Sticker from "./ui/Sticker";
import LanguageSwitcher from "./LanguageSwitcher";

const Footer = () => {
  const { t } = useTranslation();

  const socials = [
    { Icon: MessageCircle, label: t("footer.social.facebook") },
    { Icon: Camera, label: t("footer.social.instagram") },
    { Icon: Send, label: t("footer.social.twitter") },
    { Icon: Briefcase, label: t("footer.social.linkedin") },
  ];

  const links = [
    { label: t("footer.links.home"), path: "/" },
    { label: t("footer.links.services"), path: "/xizmatlar" },
    { label: t("footer.links.pricing"), path: "/narxlar" },
    { label: t("footer.links.tracking"), path: "/kuzatish" },
    { label: t("footer.links.about"), path: "/biz-haqimizda" },
    { label: t("footer.links.faq"), path: "/savollar" },
    { label: t("footer.links.contact"), path: "/boglanish" },
  ];

  return (
    <footer className="bg-slate-950 text-slate-400 pt-32 pb-12 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-600/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-indigo-600/5 rounded-full blur-[100px] -z-10" />

      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          {/* Brand Info */}
          <div className="space-y-8">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-primary-500/20">
                <Truck size={28} strokeWidth={2.5} />
              </div>
              <span className="text-3xl font-black tracking-tighter text-white italic">
                LOGISTIC<span className="text-primary-600">PRO</span>
              </span>
            </Link>
            <p className="text-lg text-slate-500 font-medium leading-relaxed">
              {t("footer.tagline")}
            </p>
            <div className="flex items-center gap-4">
              {socials.map(({ Icon, label }, idx) => (
                <a
                  key={idx}
                  href="#"
                  aria-label={label}
                  className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-primary-600 hover:text-white hover:border-primary-500 transition-all duration-300"
                >
                  <Icon size={22} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-black text-xl mb-8 tracking-tight">{t("footer.company")}</h4>
            <ul className="space-y-5">
              {links.map((link, idx) => (
                <li key={idx}>
                  <Link to={link.path} className="text-lg font-bold hover:text-primary-500 transition-colors flex items-center gap-2 group">
                    {link.label}
                    <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100 -translate-y-1 translate-x-1 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-black text-xl mb-8 tracking-tight">{t("footer.contactTitle")}</h4>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <Sticker icon={MapPin} color="primary" size={20} className="bg-slate-900 border-slate-800 shadow-none p-3" />
                <span className="font-bold text-slate-300">{t("footer.address")}</span>
              </li>
              <li className="flex items-center gap-4">
                <Sticker icon={Phone} color="primary" size={20} className="bg-slate-900 border-slate-800 shadow-none p-3" />
                <span className="font-bold text-slate-300">{t("footer.phone")}</span>
              </li>
              <li className="flex items-center gap-4">
                <Sticker icon={Mail} color="primary" size={20} className="bg-slate-900 border-slate-800 shadow-none p-3" />
                <span className="font-bold text-slate-300">{t("footer.email")}</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white font-black text-xl mb-8 tracking-tight">{t("footer.newsletter")}</h4>
            <p className="text-slate-500 font-medium mb-8">{t("footer.newsletterDesc")}</p>
            <form className="relative group">
              <input
                type="email"
                placeholder={t("footer.emailPlaceholder")}
                className="w-full py-5 px-6 bg-slate-900 border border-slate-800 rounded-[1.5rem] focus:outline-none focus:border-primary-500 transition-all text-white font-bold"
              />
              <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-primary-600 rounded-xl text-white hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/20">
                <Send size={20} />
              </button>
            </form>
          </div>
        </div>

        <div className="pt-12 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="font-bold text-slate-600 italic">© {new Date().getFullYear()} LOGISTICPRO. {t("footer.copyright")}</p>
          <div className="flex flex-wrap items-center gap-6 md:gap-10">
            <a href="#" className="font-bold text-slate-600 hover:text-white transition-colors">{t("footer.privacy")}</a>
            <a href="#" className="font-bold text-slate-600 hover:text-white transition-colors">{t("footer.terms")}</a>
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
