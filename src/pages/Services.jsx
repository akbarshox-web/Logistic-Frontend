import { Link } from 'react-router-dom';
import '../css/Services.css';

const services = [
  {
    icon: '🏙️',
    title: 'Shahar ichi yetkazish',
    desc: 'Toshkent shahri ichida 2-4 soat ichida yetkazib beramiz. Kichik buyumlardan katta yuklargacha.',
    price: '15,000 so\'mdan',
    features: ['2-4 soat ichida', 'Kuzatuv tizimi', 'Sug\'urta'],
  },
  {
    icon: '🗺️',
    title: 'Viloyatlararo yetkazish',
    desc: 'O\'zbekistonning barcha viloyatlariga 1-3 kun ichida yetkazib beramiz.',
    price: '35,000 so\'mdan',
    features: ['1-3 kun', 'Kuzatuv tizimi', 'Sug\'urta', 'Qo\'ng\'iroq xabari'],
  },
  {
    icon: '🏭',
    title: 'Kargo va ommaviy yuk',
    desc: 'Katta hajmdagi yuklarni ombordan omborga yetkazish. Biznes uchun maxsus shartlar.',
    price: 'Narx kelishiladi',
    features: ['Har qanday hajm', 'Maxsus transport', 'Sug\'urta', 'Hujjatlashtirish'],
    featured: true,
  },
  {
    icon: '❄️',
    title: 'Sovutgichli yetkazish',
    desc: 'Oziq-ovqat, dori-darmon va boshqa sovutishni talab qiladigan mahsulotlar uchun.',
    price: '45,000 so\'mdan',
    features: ['0-8°C harorat', 'Doimiy monitoring', 'Sertifikat'],
  },
  {
    icon: '⚡',
    title: 'Ekspress yetkazish',
    desc: 'Shoshilinch buyurtmalar uchun — 1-2 soat ichida manzilga yetkazamiz.',
    price: '25,000 so\'mdan',
    features: ['1-2 soat', 'Ustuvor navbat', 'SMS xabarnoma'],
  },
  {
    icon: '📦',
    title: 'Omborxona xizmati',
    desc: 'Mahsulotlaringizni xavfsiz omborxonamizda saqlang va kerak vaqtda jo\'nating.',
    price: '50,000 so\'m/oy',
    features: ['24/7 xavfsizlik', 'Sug\'urta', 'Inventar tizimi'],
  },
];

function Services() {
  return (
    <div className="services">
      <div className="services-hero">
        <h1>Bizning xizmatlar</h1>
        <p>Har qanday ehtiyoj uchun yechim</p>
      </div>

      <div className="services-grid">
        {services.map((s, i) => (
          <div className={`service-card ${s.featured ? 'featured' : ''}`} key={i}>
            {s.featured && <span className="badge">Mashhur</span>}
            <span className="service-icon">{s.icon}</span>
            <h3>{s.title}</h3>
            <p className="service-desc">{s.desc}</p>
            <ul className="service-features">
              {s.features.map((f, j) => (
                <li key={j}><span className="check">✓</span> {f}</li>
              ))}
            </ul>
            <div className="service-footer">
              <span className="service-price">{s.price}</span>
              <Link to="/buyurtma" className="service-btn">Buyurtma</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Services;