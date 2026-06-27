import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Truck, Menu, X, ChevronRight, LogOut, User, Sun, Moon, Bell, Package, HelpCircle, Info } from "lucide-react";
import { cn } from "../utils/cn";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import Sticker from "./ui/Sticker";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user, logout, dbError } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ✅ FIX: admin ham superadmin ham ko'radi
  const isAdminUser = user?.role === "admin" || user?.role === "superadmin";

  const navLinks = [
    { title: "Asosiy", path: "/" },
    { title: "Xizmatlar", path: "/xizmatlar" },
    { title: "Narxlar", path: "/narxlar" },
    { title: "Biz haqimizda", path: "/biz-haqimizda" },
    { title: "Savollar", path: "/savollar" },
    { title: "Bog'lanish", path: "/boglanish" },
  ];

  return (
    <nav className={cn(
      "fixed left-0 right-0 z-50 transition-all duration-500",
      dbError ? "top-[52px] sm:top-[60px]" : "top-0",
      scrolled
        ? "bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border-b border-white/20 dark:border-slate-800/20 py-3"
        : "bg-transparent py-6"
    )}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ rotate: 10, scale: 1.1 }}
              className="w-10 h-10 md:w-12 md:h-12 bg-primary-600 rounded-xl md:rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-primary-500/30"
            >
              <Truck size={24} className="md:w-7 md:h-7" strokeWidth={2.5} />
            </motion.div>
            <span className="text-xl md:text-3xl font-black tracking-tighter text-slate-900 dark:text-white italic">
              LOGISTIC<span className="text-primary-600">PRO</span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "text-sm font-black uppercase tracking-widest transition-all hover:text-primary-600 relative py-2",
                  location.pathname === link.path ? "text-primary-600" : "text-slate-500 dark:text-slate-400"
                )}
              >
                {link.title}
                {location.pathname === link.path && (
                  <motion.div layoutId="navbar-underline" className="absolute -bottom-1 left-0 right-0 h-1 bg-primary-600 rounded-full" />
                )}
              </Link>
            ))}
            {isAdminUser && (
              <Link
                to="/admin"
                className={cn(
                  "text-sm font-black uppercase tracking-widest transition-all hover:text-primary-600 relative py-2",
                  location.pathname === "/admin" ? "text-primary-600" : "text-orange-500"
                )}
              >
                Admin
              </Link>
            )}
          </div>

          <div className="hidden lg:flex items-center gap-6">
            <button onClick={toggleTheme} className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/notifications"
                  className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all relative"
                  title="Bildirishnomalar"
                >
                  <Bell size={18} />
                </Link>
                <Link
                  to="/my-orders"
                  className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                  title="Buyurtmalarim"
                >
                  <Package size={18} />
                </Link>
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                >
                  <User size={16} className="text-slate-500" />
                  <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">{user.name}</span>
                </Link>
                <button onClick={logout} className="text-rose-500 hover:text-rose-600 transition-colors p-2" title="Chiqish">
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="text-sm font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 hover:text-primary-600 transition-colors">
                Kirish
              </Link>
            )}

            <Link to="/buyurtma" className="btn-primary py-3 px-8 text-sm uppercase tracking-widest font-black">
              Boshlash
            </Link>
          </div>

          <div className="flex lg:hidden items-center gap-3">
            <button onClick={toggleTheme} className="w-10 h-10 flex items-center justify-center bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-xl border border-white/50 dark:border-slate-700/50 shadow-sm text-slate-900 dark:text-white">
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className="w-10 h-10 flex items-center justify-center bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-xl border border-white/50 dark:border-slate-700/50 shadow-sm text-slate-900 dark:text-white">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 w-full h-screen bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl z-[60] lg:hidden"
          >
            <div className="flex flex-col h-full p-6">
              <div className="flex items-center justify-between mb-12">
                <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white">
                    <Truck size={24} />
                  </div>
                  <span className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white italic">LOGISTICPRO</span>
                </Link>
                <button onClick={() => setIsOpen(false)} className="w-12 h-12 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-xl dark:text-white">
                  <X size={24} />
                </button>
              </div>

              <div className="flex flex-col gap-4">
                {navLinks.map((link, i) => (
                  <motion.div key={link.path} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                    <Link
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "text-3xl font-black flex items-center justify-between group",
                        location.pathname === link.path ? "text-primary-600" : "text-slate-900 dark:text-white"
                      )}
                    >
                      {link.title}
                      <ChevronRight className={cn("opacity-0 group-hover:opacity-100 transition-opacity", location.pathname === link.path && "opacity-100")} size={28} />
                    </Link>
                  </motion.div>
                ))}
                {isAdminUser && (
                  <Link to="/admin" onClick={() => setIsOpen(false)} className="text-3xl font-black text-orange-500">
                    Admin Panel
                  </Link>
                )}
              </div>

              <div className="mt-auto space-y-4">
                {user ? (
                  <button onClick={logout} className="w-full py-5 text-xl font-black text-rose-500 bg-rose-50 dark:bg-rose-500/10 rounded-2xl flex items-center justify-center gap-3">
                    <LogOut size={24} />
                    Chiqish
                  </button>
                ) : (
                  <Link to="/login" onClick={() => setIsOpen(false)} className="w-full py-5 text-xl font-black text-center bg-slate-100 dark:bg-slate-800 dark:text-white rounded-2xl block">
                    Kirish
                  </Link>
                )}
                <Link to="/buyurtma" onClick={() => setIsOpen(false)} className="btn-primary w-full py-5 text-xl font-black">
                  Buyurtma berish
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;