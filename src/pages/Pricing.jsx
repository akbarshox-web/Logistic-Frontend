import { Link } from 'react-router-dom';
import '../css/Pricing.css';

const plans = [
  {
    name: 'Standart',
    price: '0',
    period: 'ro\'yxatdan o\'tish bepul',
    desc: 'Jismoniy shaxslar uchun',
    features: [
      'Shahar ichi yetkazish',
      'Viloyatlararo yetkazish',
      'Onlayn kuzatuv',
      'SMS xabarnoma',
      '—',
      '—',
    ],
  },
  {
    name: 'Biznes',
    price: '199,000',
    period: 'oyiga',
    desc: 'Kichik va o\'rta biznes uchun',
    features: [
      'Barcha Standart imkoniyatlar',
      'Ommaviy yuk chegirmasi 15%',
      'Shaxsiy menejer',
      'Hisobot va analitika',
      'API integratsiya',
      '—',
    ],
    featured: true,
  },
  {
    name: 'Korporativ',
    price: '499,000',
    period: 'oyiga',
    desc: 'Yirik kompaniyalar uchun',
    features: [
      'Barcha Biznes imkoniyatlar',
      'Chegirma 30% gacha',
      'Maxsus shartnoma',
      'Omborxona xizmati',
      'Maxsus transport',
      '24/7 qo\'llab-quvvatlash',
    ],
  },
];

function Pricing() {
  return (
    <div className="pricing">
      <div className="pricing-hero">
        <h1>Narxlar</h1>
        <p>O'zingizga mos tarifni tanlang</p>
      </div>

      <div className="plans-grid">
        {plans.map((plan, i) => (
          <div className={`plan-card ${plan.featured ? 'featured' : ''}`} key={i}>
            {plan.featured && <div className="plan-badge">Eng mashhur</div>}
            <h3 className="plan-name">{plan.name}</h3>
            <p className="plan-desc">{plan.desc}</p>
            <div className="plan-price">
              <span className="price-num">{plan.price}</span>
              {plan.price !== '0' && <span className="price-cur"> so'm</span>}
              <span className="price-period">/{plan.period}</span>
            </div>
            <ul className="plan-features">
              {plan.features.map((f, j) => (
                <li key={j} className={f === '—' ? 'disabled' : ''}>
                  <span>{f === '—' ? '✗' : '✓'}</span> {f}
                </li>
              ))}
            </ul>
            <Link to="/buyurtma" className={`plan-btn ${plan.featured ? 'featured-btn' : ''}`}>
              Boshlash
            </Link>
          </div>
        ))}
      </div>

      <div className="pricing-note">
        <p>💡 Barcha narxlarga QQS qo'shilmagan. Maxsus shartlar uchun <Link to="/boglanish">bog'laning</Link>.</p>
      </div>
    </div>
  );
}

export default Pricing;