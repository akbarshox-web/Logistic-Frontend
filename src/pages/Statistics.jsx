import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BarChart3, TrendingUp, Package, Users, Truck, DollarSign,
  RefreshCw, Calendar, Activity, ArrowUp, ArrowDown
} from "lucide-react";
import api from "../utils/api";
import { formatDateSync as format, subDaysSync as subDays, eachDayOfIntervalSync as eachDayOfInterval, startOfDaySync as startOfDay } from "../utils/dateUtil";
import dynamicImport from "../utils/dynamicImport";

const Statistics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ChartComponent, setChartComponent] = useState(null);

  // Chart.js ni runtime'da yuklash — paket o'rnatilmagan bo'lsa, fallback ko'rsatiladi
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const reactChart = await dynamicImport('react-chartjs-2');
        const chartJs = await dynamicImport('chart.js');
        if (!mounted) return;
        // Chart.js komponentlarini ro'yxatga olish
        if (chartJs && chartJs.Chart && chartJs.Chart.register) {
          Object.values(chartJs).forEach(v => {
            if (v && typeof v === 'object' && v.id) chartJs.Chart.register(v);
          });
        }
        setChartComponent(({ type, data, options }) => {
          const Tag = type === 'line' ? reactChart.Line
            : type === 'doughnut' ? reactChart.Doughnut
              : type === 'pie' ? reactChart.Pie
                : reactChart.Bar;
          return <Tag data={data} options={options} />;
        });
      } catch {
        // Chart.js o'rnatilmagan — fallback
        if (mounted) setChartComponent(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const [{ data: dash }, { data: act }] = await Promise.all([
        api.get('/orders/stats/dashboard'),
        api.get('/activities/recent?limit=20'),
      ]);
      setStats(dash);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // Chart.js uchun ma'lumot tayyorlash
  const last7Days = eachDayOfInterval({
    start: subDays(new Date(), 6),
    end: new Date(),
  });

  const orderChartData = {
    labels: last7Days.map((d) => format(d, 'dd MMM')),
    datasets: [
      {
        label: 'Buyurtmalar',
        data: last7Days.map((d) => {
          const dayStr = format(startOfDay(d), 'yyyy-MM-dd');
          const found = stats?.ordersByDay?.find((o) => o._id === dayStr);
          return found?.count || 0;
        }),
        borderColor: 'rgb(37, 99, 235)',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const revenueChartData = {
    labels: last7Days.map((d) => format(d, 'dd MMM')),
    datasets: [
      {
        label: 'Daromad (so\'m)',
        data: last7Days.map((d) => {
          const dayStr = format(startOfDay(d), 'yyyy-MM-dd');
          const found = stats?.ordersByDay?.find((o) => o._id === dayStr);
          return found?.revenue || 0;
        }),
        backgroundColor: 'rgba(34, 197, 94, 0.7)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const statusChartData = stats?.ordersByStatus ? {
    labels: Object.keys(stats.ordersByStatus),
    datasets: [
      {
        data: Object.values(stats.ordersByStatus),
        backgroundColor: [
          '#3b82f6', // Yangi - blue
          '#eab308', // Qabul qilindi - yellow
          '#f97316', // Yo'lda - orange
          '#22c55e', // Yetkazildi - green
          '#ef4444', // Bekor - rose
        ],
        borderWidth: 0,
      },
    ],
  } : null;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { beginAtZero: true, grid: { color: 'rgba(148, 163, 184, 0.1)' } },
      x: { grid: { display: false } },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: '#64748b', font: { size: 11, weight: 'bold' }, padding: 12 },
      },
    },
  };

  const summaryCards = [
    {
      label: 'Jami buyurtmalar',
      val: stats?.totals?.orders || 0,
      sub: `${stats?.totals?.month || 0} ta shu oyda`,
      change: stats?.totals?.monthGrowth || 0,
      icon: Package,
      color: 'blue',
    },
    {
      label: 'Daromad',
      val: `${(stats?.totals?.revenue || 0).toLocaleString()} so'm`,
      sub: `${(stats?.totals?.monthRevenue || 0).toLocaleString()} so'm shu oy`,
      change: null,
      icon: DollarSign,
      color: 'green',
    },
    {
      label: 'Mijozlar',
      val: stats?.totals?.clients || 0,
      sub: 'Ro\'yxatdan o\'tgan',
      change: null,
      icon: Users,
      color: 'purple',
    },
    {
      label: 'Haydovchilar',
      val: `${stats?.totals?.onlineDrivers || 0} / ${stats?.totals?.drivers || 0}`,
      sub: 'Online / Jami',
      change: null,
      icon: Truck,
      color: 'orange',
    },
  ];

  return (
    <div className="pt-24 min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="container mx-auto px-4 md:px-6 py-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 text-xs font-black uppercase tracking-widest mb-3">
              <BarChart3 size={14} />
              Statistika
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter">
              Tizim Statistikasi
            </h1>
            <p className="text-slate-400 font-bold mt-2">Buyurtmalar, daromad va faollik</p>
          </div>
          <button
            onClick={fetchStats}
            className="p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-slate-400 hover:text-primary-600 transition-all shadow-sm"
          >
            <RefreshCw size={20} />
          </button>
        </div>

        {loading ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-16 text-center border border-slate-100 dark:border-slate-800">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
            <p className="mt-4 text-slate-400 font-bold">Yuklanmoqda...</p>
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {summaryCards.map((s, i) => {
                const Icon = s.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-${s.color}-100 dark:bg-${s.color}-500/10 text-${s.color}-600`}>
                        <Icon size={22} />
                      </div>
                      {s.change !== null && s.change !== 0 && (
                        <div className={`flex items-center gap-1 text-xs font-black ${s.change > 0 ? 'text-green-600' : 'text-rose-500'}`}>
                          {s.change > 0 ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                          {Math.abs(s.change)}%
                        </div>
                      )}
                    </div>
                    <div className="text-3xl font-black text-slate-900 dark:text-white mb-1 tracking-tighter">{s.val}</div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{s.label}</div>
                    {s.sub && <div className="text-xs font-bold text-slate-500 mt-2">{s.sub}</div>}
                  </motion.div>
                );
              })}
            </div>

            {/* Charts */}
            {ChartComponent ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6">So'nggi 7 kunlik buyurtmalar</h3>
                  <div className="h-80">
                    <ChartComponent type="line" data={orderChartData} options={chartOptions} />
                  </div>
                </div>
                <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6">Holatlar bo'yicha</h3>
                  <div className="h-80">
                    {statusChartData && <ChartComponent type="doughnut" data={statusChartData} options={doughnutOptions} />}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 rounded-3xl p-8 mb-10">
                <h3 className="text-lg font-black text-amber-700 dark:text-amber-400 mb-2">Chart.js o'rnatilmagan</h3>
                <p className="text-sm text-amber-700 dark:text-amber-300 font-medium">
                  Grafiklarni ko'rish uchun <code className="bg-amber-100 dark:bg-amber-500/20 px-2 py-0.5 rounded">chart.js react-chartjs-2</code> paketlarini o'rnating.
                </p>
              </div>
            )}

            {ChartComponent && (
              <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl mb-10">
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6">So'nggi 7 kunlik daromad</h3>
                <div className="h-80">
                  <ChartComponent type="bar" data={revenueChartData} options={chartOptions} />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Statistics;