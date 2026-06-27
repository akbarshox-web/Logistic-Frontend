import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../utils/api";

const PartnerContext = createContext();

export const PartnerProvider = ({ children }) => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPartners = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/partners');
      // api.js interceptor {success, data} → data ga normalize qilgan
      if (Array.isArray(data)) {
        setPartners(data);
      } else {
        setPartners([]);
      }
    } catch (error) {
      console.warn('Partners yuklanmadi:', error.message);
      setPartners([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const addPartner = async (partnerData) => {
    try {
      const { data } = await api.post('/partners', partnerData);
      // interceptor normalized → data = partner object
      const partner = data?.data || data;
      setPartners(prev => [...prev, partner]);
      return partner;
    } catch (error) {
      throw new Error(error.message || "Hamkor qo'shishda xato");
    }
  };

  const deletePartner = async (id) => {
    try {
      await api.delete(`/partners/${id}`);
      setPartners(prev => prev.filter((p) => p._id !== id));
    } catch (error) {
      throw new Error(error.message || "Hamkor o'chirishda xato");
    }
  };

  return (
    <PartnerContext.Provider value={{
      partners,
      loading,
      addPartner,
      deletePartner,
      fetchPartners,
      refetch: fetchPartners
    }}>
      {children}
    </PartnerContext.Provider>
  );
};

export const usePartners = () => {
  const context = useContext(PartnerContext);
  if (!context) {
    throw new Error("usePartners must be used within a PartnerProvider");
  }
  return context;
};