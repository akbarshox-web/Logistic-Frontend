import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Globe, Check, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SUPPORTED_LANGUAGES, normalizeLanguageCode } from "../i18n/config";

export default function LanguageSwitcher({ variant = "dropdown" }) {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const currentCode = normalizeLanguageCode(i18n.language);
  const current = SUPPORTED_LANGUAGES.find((l) => l.code === currentCode) || SUPPORTED_LANGUAGES[0];

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const change = (code) => {
    i18n.changeLanguage(normalizeLanguageCode(code));
    setOpen(false);
  };

  if (variant === "inline") {
    return (
      <div className="flex flex-wrap items-center gap-2">
        {SUPPORTED_LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            onClick={() => change(lang.code)}
            className={`px-3 py-2 rounded-2xl text-sm font-bold transition-all flex items-center gap-2 ${currentCode === lang.code
              ? "bg-primary-600 text-white shadow-lg shadow-primary-500/20"
              : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            type="button"
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-lg shadow-sm">
              {lang.flag || "🌐"}
            </span>
            <span>{lang.name}</span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        type="button"
        aria-label="Change language"
        className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center gap-2"
      >
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-lg shadow-sm">
          {current.flag || "🌐"}
        </span>
        <span className="text-sm font-black uppercase tracking-wider hidden sm:inline">
          {current.name}
        </span>
        <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl z-[100] overflow-hidden"
          >
            <div className="p-2">
              {SUPPORTED_LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => change(lang.code)}
                  type="button"
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${currentCode === lang.code
                    ? "bg-primary-50 dark:bg-primary-600/10 text-primary-600 dark:text-primary-400"
                    : "hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                    }`}
                >
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700 text-lg shadow-sm">
                    {lang.flag || "🌐"}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold">{lang.name}</div>
                    <div className="text-[10px] uppercase tracking-wider text-slate-500">{lang.short}</div>
                  </div>
                  {currentCode === lang.code && <Check size={16} className="text-primary-600" />}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
