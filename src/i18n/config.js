import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import ar from "./locales/ar.json";
import de from "./locales/de.json";
import en from "./locales/en.json";
import kk from "./locales/kk.json";
import ky from "./locales/ky.json";
import ru from "./locales/ru.json";
import tg from "./locales/tg.json";
import tr from "./locales/tr.json";
import uz from "./locales/uz.json";
import zh from "./locales/zh.json";

export const normalizeLanguageCode = (language = "") => {
  if (!language) return "uz";

  const normalized = language.toLowerCase().replace(/_/g, "-");
  const base = normalized.split("-")[0];
  const supportedMap = {
    ar: "ar",
    de: "de",
    en: "en",
    kk: "kk",
    ky: "ky",
    ru: "ru",
    tg: "tg",
    tr: "tr",
    uz: "uz",
    zh: "zh",
  };

  return supportedMap[base] || "uz";
};

export const SUPPORTED_LANGUAGES = [
  { code: "ar", name: "العربية", flag: "🇸🇦", short: "AR" },
  { code: "de", name: "Deutsch", flag: "🇩🇪", short: "DE" },
  { code: "en", name: "English", flag: "🇬🇧", short: "EN" },
  { code: "kk", name: "Қазақша", flag: "🇰🇿", short: "KK" },
  { code: "ky", name: "Кыргызча", flag: "🇰🇬", short: "KY" },
  { code: "ru", name: "Русский", flag: "🇷🇺", short: "RU" },
  { code: "tg", name: "Тоҷикӣ", flag: "🇹🇯", short: "TG" },
  { code: "tr", name: "Türkçe", flag: "🇹🇷", short: "TR" },
  { code: "uz", name: "O‘zbekcha", flag: "🇺🇿", short: "UZ" },
  { code: "zh", name: "中文", flag: "🇨🇳", short: "ZH" },
];

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      ar: { translation: ar },
      de: { translation: de },
      en: { translation: en },
      kk: { translation: kk },
      ky: { translation: ky },
      ru: { translation: ru },
      tg: { translation: tg },
      tr: { translation: tr },
      uz: { translation: uz },
      zh: { translation: zh },
    },
    lng: "uz",
    fallbackLng: "uz",
    supportedLngs: ["ar", "de", "en", "kk", "ky", "ru", "tg", "tr", "uz", "zh"],
    nonExplicitSupportedLngs: true,
    load: "languageOnly",
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      lookupLocalStorage: "i18nextLng",
      caches: ["localStorage"],
      convertDetectedLanguage: (language) => normalizeLanguageCode(language),
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
