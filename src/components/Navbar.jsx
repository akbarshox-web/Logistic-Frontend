import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import "../css/Navbar.css";

const navLinks = [
  { path: '/',           label: 'Bosh sahifa' },
  { path: '/xizmatlar', label: 'Xizmatlar'   },
  { path: '/narxlar',   label: 'Narxlar'     },
  { path: '/kuzatish',  label: 'Kuzatish'    },
  { path: '/boglanish', label: "Bog'lanish"  },
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-container">

       
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">🚚</span>
          <span className="logo-text">LogisTrans</span>
        </Link>

        
        <ul className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          {navLinks.map(link => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              to="/buyurtma"
              className="nav-btn"
              onClick={() => setMenuOpen(false)}
            >
              Buyurtma berish
            </Link>
          </li>
        </ul>

      
        <button
          className={`hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menyu"
        >
          <span /><span /><span />
        </button>

      </div>
    </nav>
  );
}

export default Navbar;