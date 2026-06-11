import { Link } from 'react-router-dom';
import "../css/Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-brand">
          <span className="footer-logo">🚚 LogisTrans</span>
          <p>O'zbekiston bo'ylab tez va ishonchli yetkazib berish xizmati.</p>
        </div>

        <div className="footer-links">
          <h4>Sahifalar</h4>
          <ul>
            <li><Link to="/">Bosh sahifa</Link></li>
            <li><Link to="/xizmatlar">Xizmatlar</Link></li>
            <li><Link to="/narxlar">Narxlar</Link></li>
            <li><Link to="/boglanish">Bog'lanish</Link></li>
          </ul>
        </div>

        <div className="footer-links">
          <h4>Xizmatlar</h4>
          <ul>
            <li><Link to="/buyurtma">Buyurtma berish</Link></li>
            <li><Link to="/kuzatish">Yuk kuzatish</Link></li>
            <li><Link to="/admin">Admin panel</Link></li>
          </ul>
        </div>

        <div className="footer-contact">
          <h4>Aloqa</h4>
          <p>📞 +998 90 123 45 67</p>
          <p>✉️ info@logistrans.uz</p>
          <p>📍 Toshkent, O'zbekiston</p>
        </div>

      </div>

      <div className="footer-bottom">
        <p>© 2025 LogisTrans. Barcha huquqlar himoyalangan.</p>
      </div>
    </footer>
  );
}

export default Footer;