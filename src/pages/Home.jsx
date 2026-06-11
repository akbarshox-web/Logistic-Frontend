import { Link } from 'react-router-dom';
import '../css/Home.css';

const stats = [
  { number: '5000+', label: 'Yetkazib berishlar' },
  { number: '120+',  label: 'Shaharlar' },
  { number: '98%',   label: 'Mamnun mijozlar' },
  { number: '24/7',  label: 'Qo\'llab-quvvatlash' },
];

const features = [
  { icon: '🚀', title: 'Tez yetkazish',     desc: 'Shahar ichida 2-4 soat, respublika bo\'ylab 1-3 kun' },
  { icon: '📍', title: 'Real vaqt kuzatuv', desc: 'Yukingiziing joylashuvini har daqiqa kuzating' },
  { icon: '🔒', title: 'Xavfsiz saqlash',   desc: 'Sug\'urtalangan omborxona va transport' },
  { icon: '💰', title: 'Arzon narxlar',     desc: 'Bozordagi eng raqobatbardosh tariflar' },
  { icon: '📦', title: 'Har xil o\'lcham',  desc: 'Konvertdan yuk mashinasigacha qabul qilamiz' },
  { icon: '🤝', title: 'Ishonchli xizmat',  desc: '10 yildan ortiq tajriba va minglab mijozlar' },
];

function Home() {
  return (
    <div className="home">

      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <h1>O'zbekiston bo'ylab <span>tez va ishonchli</span> yetkazib berish</h1>
          <p>LogisTrans — yuklaringizni vaqtida, xavfsiz va arzon narxda manzilga yetkazadi.</p>
          <div className="hero-buttons">
            <Link to="/buyurtma" className="btn-primary">Buyurtma berish</Link>
            <Link to="/kuzatish" className="btn-outline">Yukni kuzatish</Link>
          </div>
        </div>
        <div className="hero-image">
          <div className="hero-card">
            <p className="card-label">Faol yetkazishlar</p>
            <h2>1,248</h2>
            <p className="card-sub">Hozir yo'lda 🚚</p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats">
        {stats.map((s, i) => (
          <div className="stat-item" key={i}>
            <h3>{s.number}</h3>
            <p>{s.label}</p>
          </div>
        ))}
      </section>

      {/* Features */}
      <section className="features">
        <div className="section-header">
          <h2>Nima uchun LogisTrans?</h2>
          <p>Bizning afzalliklarimiz</p>
        </div>
        <div className="features-grid">
          {features.map((f, i) => (
            <div className="feature-card" key={i}>
              <span className="feature-icon">{f.icon}</span>
              <h4>{f.title}</h4>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <h2>Birinchi buyurtmangizga 10% chegirma!</h2>
        <p>Ro'yxatdan o'ting va maxsus tarifdan foydalaning</p>
        <Link to="/buyurtma" className="btn-primary">Hoziroq boshlash</Link>
      </section>

    </div>
  );
}

export default Home;