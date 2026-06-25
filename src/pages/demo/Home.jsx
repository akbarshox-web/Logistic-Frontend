import React from "react";
import { Link } from "react-router-dom";
import "../../css/home.css";

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-grid">
            <div>
              <h1 className="hero-title">
                O'zbekiston bo'ylab <span>tezkor</span> va ishonchli yetkazib berish
              </h1>
              <p className="hero-text">
                LogisTrans — bu yuklaringizni istalgan manzilga xavfsiz, tez va
                arzon narxlarda yetkazib beruvchi zamonaviy logistika kompaniyasi.
                24/7 ishlaydigan xizmat va real vaqt kuzatuvi.
              </p>

              <div className="hero-actions">
                <Link to="/buyurtma" className="btn btn-primary">
                  Buyurtma berish
                </Link>
                <Link to="/kuzatish" className="btn btn-secondary">
                  Yukni kuzatish
                </Link>
              </div>

              <div className="hero-stats">
                <span className="hero-stats-dot"></span>
                <span className="hero-stats-text">
                  Hozir yo'lda: <strong>1,248 ta yuk</strong>
                </span>
              </div>
            </div>

            <div className="hero-image">
              <div className="hero-image-box">🚛</div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistika */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📦</div>
              <div className="stat-value">5000+</div>
              <div className="stat-label">Yetkazib berishlar</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🏙️</div>
              <div className="stat-value">120+</div>
              <div className="stat-label">Shaharlar</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⭐</div>
              <div className="stat-value">98%</div>
              <div className="stat-label">Mamnun mijozlar</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🕐</div>
              <div className="stat-value">24/7</div>
              <div className="stat-label">Qo'llab-quvvatlash</div>
            </div>
          </div>
        </div>
      </section>

      {/* Afzalliklar */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">
            Nega <span>LogisTrans</span>?
          </h2>
          <p className="section-subtitle">
            Biz mijozlarimizga eng yuqori sifatli xizmatni taqdim etamiz
          </p>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3 className="feature-title">Tez yetkazish</h3>
              <p className="feature-text">
                Shahar ichida 2-4 soat, viloyatlararo 1-3 kun ichida yetkazib beramiz.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📍</div>
              <h3 className="feature-title">Real vaqt kuzatuv</h3>
              <p className="feature-text">
                Yukingizning harakatini onlayn tarzda kuzatib boring.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🛡️</div>
              <h3 className="feature-title">Sug'urta</h3>
              <p className="feature-text">
                Barcha yuklar to'liq sug'urta bilan himoyalangan.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h3 className="feature-title">Arzon narxlar</h3>
              <p className="feature-text">
                Bozordagi eng qulay narxlar va doimiy chegirmalar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <div className="cta-discount">10% CHEGIRMA</div>
            <h2 className="cta-title">Birinchi buyurtmangizga 10% chegirma!</h2>
            <p className="cta-text">
              Hoziroq ro'yxatdan o'ting va birinchi buyurtmangizga maxsus chegirma oling.
              Taklif cheklangan vaqt uchun!
            </p>
            <Link to="/buyurtma" className="btn btn-light">
              Hoziroq buyurtma bering
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;