import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, ArrowRight, Zap, AlertCircle, RefreshCw } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Sticker from "../components/ui/Sticker";
import FloatingElements from "../components/ui/FloatingElements";

const VerifyEmail = () => {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendStatus, setResendStatus] = useState("");
  const { verify, resendCode } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate("/register");
    }
  }, [email, navigate]);

  const handleResendCode = async () => {
    try {
      setResendStatus("");
      setIsLoading(true);
      await resendCode(email);
      setResendStatus("Yangi kod yuborildi!");
      setIsLoading(false);
      setTimeout(() => setResendStatus(""), 5000);
    } catch (err) {
      const msg = typeof err === 'string' ? err : err.message || "Xatolik yuz berdi";
      setError(msg);
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      const user = await verify(email, code);
      setIsLoading(false);
      if (user.role === "admin" || user.role === "superadmin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      const msg = typeof err === 'string' ? err : err.message || JSON.stringify(err);
      setError(msg);
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-24 min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center px-4 relative overflow-hidden">
      <FloatingElements />

      <div className="container mx-auto max-w-4xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md mx-auto bg-white dark:bg-slate-800 p-10 md:p-12 rounded-[3.5rem] shadow-2xl border border-slate-100 dark:border-slate-700 relative overflow-hidden text-center"
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-primary-600/5 rounded-full blur-3xl -z-10" />
          
          <div className="flex flex-col items-center mb-10">
            <Sticker icon={ShieldCheck} color="primary" size={32} className="mb-6" />
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Tasdiqlash</h2>
            <p className="text-slate-400 font-bold text-sm uppercase tracking-widest mt-4 leading-relaxed">
              Biz <span className="text-primary-600">{email}</span> manziliga 6 xonali tasdiqlash kodini yubordik.
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 rounded-2xl text-rose-600 dark:text-rose-400 text-sm font-bold flex items-center gap-3"
            >
              <AlertCircle size={18} />
              <span className="flex-1 break-words">{String(error)}</span>
            </motion.div>
          )}

          {resendStatus && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-2xl text-emerald-600 dark:text-emerald-400 text-sm font-bold flex items-center gap-3"
            >
              <Zap size={18} />
              <span className="flex-1">{resendStatus}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Tasdiqlash kodi</label>
              <input
                type="text"
                maxLength="6"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="000000"
                className="w-full text-center text-4xl tracking-[0.5em] py-6 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all font-black dark:text-white"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || code.length < 6}
              className="btn-primary w-full py-5 text-xl font-black shadow-primary-500/25"
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <RefreshCw size={24} strokeWidth={3} />
                </motion.div>
              ) : (
                <>
                  Tasdiqlash
                  <ArrowRight size={24} strokeWidth={3} />
                </>
              )}
            </button>
          </form>

          <div className="mt-10">
            <button 
              onClick={handleResendCode}
              disabled={isLoading}
              type="button"
              className="text-slate-400 font-bold text-sm hover:text-primary-600 transition-colors flex items-center justify-center gap-2 mx-auto disabled:opacity-50"
            >
              <Zap size={16} />
              Kod kelmadimi? Qayta yuborish
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default VerifyEmail;