import React from "react";
import { useAuth } from "../context/AuthContext";
import { RefreshCw, WifiOff } from "lucide-react";

const ServerStatusBanner = () => {
  const { dbError } = useAuth();

  if (!dbError) return null;

  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] bg-amber-500 dark:bg-amber-600 text-white px-4 py-3 shadow-lg">
      <div className="container mx-auto flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <WifiOff size={20} className="shrink-0" />
          <div className="min-w-0">
            <div className="font-black text-sm uppercase tracking-widest">
              Server bilan aloqa yo'q
            </div>
            <div className="text-xs opacity-90 font-medium truncate">
              {dbError}
            </div>
          </div>
        </div>
        <button
          onClick={handleRetry}
          className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all shrink-0"
        >
          <RefreshCw size={14} />
          Qayta urinish
        </button>
      </div>
    </div>
  );
};

export default ServerStatusBanner;