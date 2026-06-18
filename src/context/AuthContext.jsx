import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../utils/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const savedUser = localStorage.getItem("logistic_user");
      if (savedUser) {
        try {
          // Verify session with backend
          const { data } = await api.get('/users/me');
          setUser(data);
          localStorage.setItem("logistic_user", JSON.stringify(data));
        } catch (e) {
          localStorage.removeItem("logistic_user");
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/users/login', { email, password });
      setUser(data);
      localStorage.setItem("logistic_user", JSON.stringify(data));
      return data;
    } catch (error) {
      throw error.response?.data?.message || error.message || "Login xatosi yuz berdi";
    }
  };

  const googleLogin = async (credential) => {
    try {
      const { data } = await api.post('/users/google', { credential });
      setUser(data);
      localStorage.setItem("logistic_user", JSON.stringify(data));
      return data;
    } catch (error) {
      throw error.response?.data?.message || error.message || "Google orqali kirishda xato yuz berdi";
    }
  };

  const register = async (name, email, password) => {
    try {
      const { data } = await api.post('/users', { name, email, password });
      return data;
    } catch (error) {
      throw error.response?.data?.message || error.message || "Ro'yxatdan o'tishda xato yuz berdi";
    }
  };

  const verify = async (email, code) => {
    try {
      const { data } = await api.post('/users/verify', { email, code });
      setUser(data);
      localStorage.setItem("logistic_user", JSON.stringify(data));
      return data;
    } catch (error) {
      const backendError = error.response?.data?.error;
      const message = error.response?.data?.message || error.message || "Xatolik yuz berdi";
      throw backendError ? `${message}: ${backendError}` : message;
    }
  };

  const resendCode = async (email) => {
    try {
      const { data } = await api.post('/users/resend', { email });
      return data;
    } catch (error) {
      throw error.response?.data?.message || error.message || "Kodni qayta yuborishda xato yuz berdi";
    }
  };

  const logout = async () => {
    try {
      await api.post('/users/logout');
    } catch (error) {
      // Ignore logout errors
    } finally {
      setUser(null);
      localStorage.removeItem("logistic_user");
      window.location.href = "/login";
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, googleLogin, register, verify, resendCode, logout, loading }}>
      {!loading && children}
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
