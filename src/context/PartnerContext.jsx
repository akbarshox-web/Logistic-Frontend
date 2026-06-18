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
      if (Array.isArray(data)) {
        setPartners(data);
      } else {
        setPartners([]);
      }
    } catch (error) {
      // Don't show error in console for network issues
      // Just set empty partners
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
      setPartners(prev => [...prev, data]);
      return data;
    } catch (error) {
      throw error.response?.data?.message || "Hamkor qo'shishda xato";
    }
  };

  const deletePartner = async (id) => {
    try {
      await api.delete(`/partners/${id}`);
      setPartners(prev => prev.filter((p) => p._id !== id));
    } catch (error) {
      throw error.response?.data?.message || "Hamkor o'chirishda xato";
    }
  };

  return (
    <PartnerContext.Provider value={{ partners, loading, addPartner, deletePartner, fetchPartners }}>
      {children}
    </PartnerContext.Provider>
  );
};

export const usePartners = () => useContext(PartnerContext);
