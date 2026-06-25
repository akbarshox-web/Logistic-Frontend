import React from "react";
import { Link } from "react-router-dom";
import "../css/footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-logo">
              🚚 <span>Logis</span>Trans
            </div>
            <p className="footer-text">
              O'zbekiston bo'ylab tez va ishonchli yetkazib berish xizmati.
            </p>
          </div>

          <div>
            <h4 className="footer-title">Sahifalar</h4>
            <ul className="footer-list">
              <li><Link to="/">Bosh sahifa</Link></li>
              <li><Link to="/xizmatlar">Xizmatlar</Link></li>
              <li><Link to="/narxlar">Narxlar</Link></li>
              <li><Link to="/kuzatish">Kuzatish</Link></li>
              <li><Link to="/boglanish">Bog'lanish</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-title">Xizmatlar</h4>
            <ul className="footer-list">
              <li><Link to="/xizmatlar">Shahar ichi</Link></li>
              <li><Link to="/xizmatlar">Viloyatlararo</Link></li>
              <li><Link to="/xizmatlar">Ekspress</Link></li>
              <li><Link to="/xizmatlar">Omborxona</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-title">Aloqa</h4>
            <ul className="footer-list">
              <li>📞 +998 71 200 00 00</li>
              <li>✉️ info@logistrans.uz</li>
              <li>📍 Toshkent, O'zbekiston</li>
              <li>
                <Link to="/admin" style={{ color: "#94a3b8" }}>
                  Admin panel
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          © {new Date().getFullYear()} LogisTrans. Barcha huquqlar himoyalangan.
        </div>
      </div>
    </footer>
  );
};

export default Footer;