import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { PartnerProvider } from "./context/PartnerContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home"
import Services from "./pages/Services"
import Pricing from "./pages/Pricing"
import Order from "./pages/Order"
import Contact from "./pages/Contact"
import Login from "./pages/Login"
import Register from "./pages/Register"
import VerifyEmail from "./pages/VerifyEmail"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import Tracking from "./pages/Tracking";
import Admin from "./pages/Admin"

function App(){
  return(
    <ThemeProvider>
      <AuthProvider>
        <PartnerProvider>
          <Router>
            <div className="app min-h-screen transition-colors duration-300 dark:bg-slate-900">
              <Navbar/>
              <main>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/xizmatlar" element={<Services />} />
                  <Route path="/narxlar" element={<Pricing />} />
                  <Route path="/boglanish" element={<Contact />} />
                  <Route path="/buyurtma" element={<Order />} />
                  <Route path="/kuzatish" element={<Tracking />} />
                  <Route 
                    path="/admin" 
                    element={
                      <ProtectedRoute adminOnly={true}>
                        <Admin />
                      </ProtectedRoute>
                    } 
                  />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/tasdiqlash" element={<VerifyEmail />} />
                  </Routes>
              </main>
              <Footer/>
            </div>
          </Router>
        </PartnerProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;