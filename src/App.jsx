import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home"
import Services from "./pages/Services"
import Pricing from "./pages/Pricing"
import Order from "./pages/Order"
import Contact from "./pages/Contact"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import Tracking from "./pages/Tracking";
import Admin from "./pages/Admin"
import "./css/App.css"

function App(){
  return(
    <Router>
      <div className="app">
        <Navbar/>
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/xizmatlar" element={<Services />} />
            <Route path="/narxlar" element={<Pricing />} />
            <Route path="/boglanish" element={<Contact />} />
            <Route path="/buyurtma" element={<Order />} />
            <Route path="/kuzatish" element={<Tracking />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
        <Footer/>
      </div>
    </Router>
  );
}

export default App;