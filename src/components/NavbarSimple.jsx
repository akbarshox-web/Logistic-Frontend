import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../css/navbar.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { title: "Bosh sahifa", path: "/" },
    { title: "Xizmatlar", path: "/xizmatlar" },
    { title: "Narxlar", path: "/narxlar" },
    { title: "Kuzatish", path: "/kuzatish" },
    { title: "Bog'lanish", path: "/boglanish" },
  ];

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="navbar-logo" onClick={() => setIsOpen(false)}>
          <span className="navbar-logo-icon">🚚</span>
          <span>Logis</span>Trans
        </Link>

        <ul className={`navbar-menu ${isOpen ? "open" : ""}`}>
          {links.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className="navbar-link"
                onClick={() => setIsOpen(false)}
              >
                {link.title}
              </Link>
            </li>
          ))}
        </ul>

        <div className="navbar-actions">
          <Link to="/buyurtma" className="btn btn-primary">
            Buyurtma berish
          </Link>
          <button
            className="navbar-toggle"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Menu"
          >
            ☰
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;