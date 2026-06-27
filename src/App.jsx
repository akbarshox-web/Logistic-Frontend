import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { PartnerProvider } from "./context/PartnerContext";
import ProtectedRoute from "./components/ProtectedRoute";

// ✅ Asosiy sahifalar
import Home from "./pages/Home";
import Services from "./pages/Services";
import Pricing from "./pages/Pricing";
import Order from "./pages/Order";
import Contact from "./pages/Contact";
import Tracking from "./pages/Tracking";
import About from "./pages/About";
import FAQ from "./pages/FAQ";

// ✅ Auth sahifalari
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";

// ✅ Foydalanuvchi sahifalari
import Profile from "./pages/Profile";
import MyOrders from "./pages/MyOrders";
import Notifications from "./pages/Notifications";

// ✅ Panel sahifalari
import Admin from "./pages/Admin";
import DriverPanel from "./pages/DriverPanel";
import ClientPanel from "./pages/ClientPanel";

// ✅ Admin sub-pages
import Statistics from "./pages/Statistics";
import ActivityLog from "./pages/ActivityLog";
import Settings from "./pages/Settings";

// ✅ Layout komponentlar
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ServerStatusBanner from "./components/ServerStatusBanner";

// ✅ Auth sahifalarida Navbar/Footer ko'rsatilmaydi
const AUTH_ROUTES = ["/login", "/register", "/tasdiqlash"];

// Panel sahifalar — bu yerda footer ko'rsatilmaydi, lekin Navbar ko'rinadi
const PANEL_ROUTES = ["/admin", "/driver", "/panel", "/dashboard", "/profile", "/my-orders", "/notifications"];

// Role ga qarab yo'naltirish
const RoleRoute = () => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === "admin" || user.role === "superadmin") return <Navigate to="/admin" replace />;
  if (user.role === "driver") return <Navigate to="/driver" replace />;
  return <Navigate to="/panel" replace />;
};

// ✅ Router ichidagi komponent — useLocation ishlaydi
function AppRoutes() {
  const location = useLocation();
  const isPanelRoute = PANEL_ROUTES.some(r => location.pathname.startsWith(r));
  const isAuthRoute = AUTH_ROUTES.some(r => location.pathname.startsWith(r));

  return (
    <div className="app min-h-screen transition-colors duration-300 bg-white dark:bg-slate-900">
      <ServerStatusBanner />
      {/* Auth sahifalarida navbar ko'rinmaydi, panel sahifalarida ko'rinadi */}
      {!isAuthRoute && <Navbar />}
      <main>
        <Routes>
          {/* ─────────── Public sahifalar ─────────── */}
          <Route path="/" element={<Home />} />
          <Route path="/xizmatlar" element={<Services />} />
          <Route path="/narxlar" element={<Pricing />} />
          <Route path="/boglanish" element={<Contact />} />
          <Route path="/buyurtma" element={<Order />} />
          <Route path="/kuzatish" element={<Tracking />} />
          <Route path="/biz-haqimizda" element={<About />} />
          <Route path="/savollar" element={<FAQ />} />

          {/* ─────────── Auth sahifalari ─────────── */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/tasdiqlash" element={<VerifyEmail />} />

          {/* ─────────── Foydalanuvchi sahifalari ─────────── */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-orders"
            element={
              <ProtectedRoute>
                <MyOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            }
          />

          {/* ─────────── Himoyalangan sahifalar ─────────── */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <RoleRoute />
              </ProtectedRoute>
            }
          />

          {/* Admin panel */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute adminOnly={true}>
                <Admin />
              </ProtectedRoute>
            }
          />

          {/* Admin sub-pages (alohida route) */}
          <Route
            path="/admin/statistics"
            element={
              <ProtectedRoute adminOnly={true}>
                <Statistics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/activity-log"
            element={
              <ProtectedRoute adminOnly={true}>
                <ActivityLog />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute adminOnly={true}>
                <Settings />
              </ProtectedRoute>
            }
          />

          {/* Driver panel */}
          <Route
            path="/driver/*"
            element={
              <ProtectedRoute driverOnly={true}>
                <DriverPanel />
              </ProtectedRoute>
            }
          />

          {/* Klient panel */}
          <Route
            path="/panel/*"
            element={
              <ProtectedRoute>
                <ClientPanel />
              </ProtectedRoute>
            }
          />

          {/* ─────────── 404 ─────────── */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {/* Auth va panel sahifalarida footer ko'rsatilmaydi */}
      {!isAuthRoute && !isPanelRoute && <Footer />}
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <PartnerProvider>
          <Router>
            <AppRoutes />
          </Router>
        </PartnerProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;