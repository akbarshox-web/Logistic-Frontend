import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Talabingizga aniq mos keladigan sodda versiya sahifalari
import Navbar from "./components/NavbarSimple";
import Footer from "./components/FooterSimple";
import Home from "./pages/demo/Home";
import Services from "./pages/demo/Services";
import Pricing from "./pages/demo/Pricing";
import Contact from "./pages/demo/Contact";
import Order from "./pages/demo/Order";
import Tracking from "./pages/demo/Tracking";
import Admin from "./pages/demo/Admin";

function AppDemo() {
  return (
    <Router>
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Navbar />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/xizmatlar" element={<Services />} />
            <Route path="/narxlar" element={<Pricing />} />
            <Route path="/boglanish" element={<Contact />} />
            <Route path="/buyurtma" element={<Order />} />
            <Route path="/kuzatish" element={<Tracking />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default AppDemo;