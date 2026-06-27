import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import api from "../utils/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState(null);
  const initStarted = useRef(false);

  // ✅ Sahifa yuklanganda user holatini tekshirish
  useEffect(() => {
    // Qayta-qayta chaqirilmasligi uchun
    if (initStarted.current) return;
    initStarted.current = true;

    const initAuth = async () => {
      try {
        // Backend bilan sessiyani tekshirish
        const response = await api.get('/users/me');
        const data = response.data; // api.js interceptor {success, data} → data ga normalizatsiya qilgan
        setUser(data);
        localStorage.setItem("logistic_user", JSON.stringify(data));
        setDbError(null);
      } catch (e) {
        // ✅ 401 — login qilinmagan, bu normal holat
        // ✅ 503 — database bilan aloqa yo'q
        if (e.response?.status === 503 || e.message?.includes('503')) {
          setDbError("Server bilan aloqa yo'q. Iltimos, keyinroq urinib ko'ring.");
        } else if (e.response?.status === 401) {
          // Login qilinmagan — bu normal holat, xato ko'rsatmaymiz
          setUser(null);
          localStorage.removeItem("logistic_user");
        } else if (!e.response) {
          // Network error
          setDbError("Internet aloqasi yo'q. Iltimos, tarmoqni tekshiring.");
        }
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // ✅ Login
  const login = async (email, password) => {
    try {
      const response = await api.post('/users/login', { email, password });
      const data = response.data; // interceptor {success, data} → data ga normalize qilgan
      setUser(data);
      localStorage.setItem("logistic_user", JSON.stringify(data));
      setDbError(null);
      return data;
    } catch (error) {
      // 401 — noto'g'ri parol yoki email
      if (error.response?.status === 401) {
        throw new Error(error.response.data?.message || "Email yoki parol noto'g'ri");
      }
      // 503 — database bilan aloqa yo'q
      if (error.response?.status === 503) {
        throw new Error("Server vaqtincha xizmat ko'rsatmayapti. Iltimos, keyinroq urinib ko'ring.");
      }
      throw new Error(error.message || "Login xatosi yuz berdi");
    }
  };

  // ✅ Google login
  const googleLogin = async (access_token) => {
    try {
      const response = await api.post('/users/google', { access_token });
      const data = response.data; // interceptor normalized
      setUser(data);
      localStorage.setItem("logistic_user", JSON.stringify(data));
      setDbError(null);
      return data;
    } catch (error) {
      throw new Error(error.message || "Google orqali kirishda xato yuz berdi");
    }
  };

  // ✅ Register
  const register = async (name, email, password) => {
    try {
      const response = await api.post('/users', { name, email, password });
      const data = response.data;

      // ✅ Dev kod bo'lsa, console'ga chiqaramiz (test oson bo'lishi uchun)
      if (data.devCode) {
        console.log(`📧 [DEV] Tasdiqlash kodi: ${data.devCode}`);
      }

      setDbError(null);
      return data;
    } catch (error) {
      // 400 — validatsiya xatosi yoki email band
      if (error.response?.status === 400) {
        throw new Error(error.response.data?.message || "Ma'lumotlar noto'g'ri");
      }
      // 503 — database bilan aloqa yo'q
      if (error.response?.status === 503) {
        throw new Error("Server vaqtincha xizmat ko'rsatmayapti. Iltimos, keyinroq urinib ko'ring.");
      }
      throw new Error(error.message || "Ro'yxatdan o'tishda xato yuz berdi");
    }
  };

  // ✅ Verify email
  const verify = async (email, code) => {
    try {
      const response = await api.post('/users/verify', { email, code });
      const data = response.data; // interceptor normalized
      setUser(data);
      localStorage.setItem("logistic_user", JSON.stringify(data));
      setDbError(null);
      return data;
    } catch (error) {
      throw new Error(error.message || "Tasdiqlashda xato yuz berdi");
    }
  };

  // ✅ Resend verification code
  const resendCode = async (email) => {
    try {
      const response = await api.post('/users/resend', { email });
      const data = response.data;
      if (data.devCode) {
        console.log(`📧 [DEV] Yangi tasdiqlash kodi: ${data.devCode}`);
      }
      return data;
    } catch (error) {
      throw new Error(error.message || "Kodni qayta yuborishda xato yuz berdi");
    }
  };

  // ✅ Logout
  const logout = async () => {
    try {
      await api.post('/users/logout');
    } catch (error) {
      // Logout xatosi bo'lsa ham davom etamiz
      console.warn('Logout so\'rovida xato:', error.message);
    } finally {
      setUser(null);
      localStorage.removeItem("logistic_user");
      setDbError(null);
      window.location.href = "/";
    }
  };

  // ✅ Foydalanuvchi roli bo'yicha tekshirish
  const hasRole = (...roles) => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  const isAdmin = hasRole('admin', 'superadmin');
  const isDriver = hasRole('driver');
  const isClient = hasRole('user');

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      dbError,
      login,
      googleLogin,
      register,
      verify,
      resendCode,
      logout,
      hasRole,
      isAdmin,
      isDriver,
      isClient
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};