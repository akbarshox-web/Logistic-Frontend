import React, { useState } from "react";
import { motion } from "framer-motion";
import { LogIn, Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, Zap, AlertCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Sticker from "../components/ui/Sticker";
import FloatingElements from "../components/ui/FloatingElements";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    console.log("Google login boshlandi...");
    if (window.google && GOOGLE_CLIENT_ID !== "YOUR_GOOGLE_CLIENT_ID") {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: "openid email profile",
        ux_mode: "popup",
        callback: async (response) => {
          console.log("Google callback:", response);
          if (response.access_token) {
            setGoogleLoading(true);
            try {
              console.log("Backendga so'rov yuborilmoqda...");
              const user = await googleLogin(response.access_token);
              console.log("Backend javobi:", user);
              setGoogleLoading(false);
              if (user.role === "admin" || user.role === "superadmin") {
                navigate("/admin");
              } else {
                navigate("/");
              }
            } catch (err) {
              console.error("Google login xatosi:", err);
              setGoogleLoading(false);
              setError(err.message || "Google orqali kirishda xato yuz berdi");
            }
          } else {
            console.log("Access token yo'q:", response);
            setError("Google kirish muvaffaqiyatsiz yakunlandi");
          }
        },
      });
      client.requestAccessToken();
    } else {
      setError("Google Client ID sozlanmagan. Iltimos .env fayliga VITE_GOOGLE_CLIENT_ID ni qo'shing.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const user = await login(email, password);
      setIsLoading(false);
      if (user.role === "admin" || user.role === "superadmin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      const msg = typeof err === 'string' ? err : err.message || JSON.stringify(err);
      if (msg === 'Iltimos, avval emailingizni tasdiqlang') {
        setError(
          <div className="flex flex-col gap-2">
            <span>{msg}</span>
            <button
              onClick={() => navigate("/tasdiqlash", { state: { email } })}
              className="text-primary-600 underline text-left font-black uppercase text-[10px] tracking-widest mt-1"
            >
              Tasdiqlash sahifasiga o'tish →
            </button>
          </div>
        );
      } else {
        setError(msg);
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-24 min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center px-4 relative overflow-hidden">
      <FloatingElements />

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Side: Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden lg:block"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white dark:bg-slate-800 text-primary-600 dark:text-primary-400 text-sm font-black mb-8 border border-slate-100 dark:border-slate-800 shadow-xl shadow-primary-500/5 uppercase tracking-widest"
            >
              <ShieldCheck size={16} fill="currentColor" />
              <span>Xavfsiz Kirish</span>
            </motion.div>
            <h1 className="text-6xl font-black text-slate-900 dark:text-white mb-8 tracking-tighter leading-tight">
              Boshqaruv Paneliga <span className="gradient-text">Xush Kelibsiz</span>
            </h1>
            <p className="text-xl text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-10 max-w-md">
              Logistika jarayonlarini real vaqtda kuzating va boshqaring. Tizimga kirib barcha imkoniyatlardan foydalaning.
            </p>

            <div className="space-y-6">
              {[
                { icon: Zap, text: "Tezkor va xavfsiz boshqaruv", color: "orange" },
                { icon: ShieldCheck, text: "Ma'lumotlar to'liq himoyalangan", color: "green" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Sticker icon={item.icon} color={item.color} size={20} className="shadow-none p-2.5" />
                  <span className="font-bold text-slate-600 dark:text-slate-400 text-lg">{item.text}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Side: Login Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md mx-auto bg-white dark:bg-slate-800 p-10 md:p-12 rounded-[3.5rem] shadow-2xl border border-slate-100 dark:border-slate-700 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary-600/5 rounded-full blur-3xl -z-10" />
            
            <div className="flex flex-col items-center mb-10 text-center">
              <Sticker icon={LogIn} color="primary" size={32} className="mb-6" />
              <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Kirish</h2>
              <p className="text-slate-400 font-bold text-sm uppercase tracking-widest mt-2">Hisobingizga kiring</p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 rounded-2xl text-rose-600 dark:text-rose-400 text-sm font-bold flex items-center gap-3"
              >
                <AlertCircle size={18} />
                <span className="flex-1 break-words">{error}</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={20} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your Email"
                    className="w-full pl-12 pr-6 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all font-bold dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Parol</label>
                  <button type="button" className="text-xs font-black text-primary-600 uppercase tracking-widest hover:underline">Unutdingizmi?</button>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={20} />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all font-bold dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3 ml-1 pt-2">
                <input type="checkbox" id="remember" className="w-5 h-5 accent-primary-600 rounded-lg cursor-pointer" />
                <label htmlFor="remember" className="text-sm font-bold text-slate-500 dark:text-slate-400 cursor-pointer">Eslab qolish</label>
              </div>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-slate-200 dark:border-slate-600"></div>
                <span className="flex-shrink mx-4 text-slate-400 dark:text-slate-500 font-bold text-xs uppercase tracking-widest">yoki</span>
                <div className="flex-grow border-t border-slate-200 dark:border-slate-600"></div>
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={googleLoading}
                className="w-full py-4 px-6 bg-white dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-2xl font-black text-slate-700 dark:text-white flex items-center justify-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-600 transition-all disabled:opacity-50"
              >
                {googleLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Zap size={20} fill="currentColor" />
                  </motion.div>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Google orqali kirish
                  </>
                )}
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full py-5 text-xl font-black shadow-primary-500/25 mt-4"
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Zap size={24} fill="currentColor" />
                  </motion.div>
                ) : (
                  <>
                    Tizimga kirish
                    <ArrowRight size={24} strokeWidth={3} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-10 text-center">
              <p className="text-slate-400 font-bold text-sm">
                Hisobingiz yo'qmi?{" "}
                <Link to="/register" className="text-primary-600 hover:underline">Ro'yxatdan o'ting</Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;