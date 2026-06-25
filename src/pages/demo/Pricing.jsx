import React from "react";
import "../../css/pricing.css";

const Pricing = () => {
  const plans = [
    {
      name: "Standart",
      icon: "📦",
      price: "0",
      period: "so'm / bepul",
      popular: false,
      features: [
        "Oddiy jo'natmalar",
        "Onlayn kuzatuv",
        "SMS xabarnomalar",
        "24 soat ichida javob",
        "Standart qo'llab-quvvatlash",
      ],
    },
    {
      name: "Biznes",
      icon: "💼",
      price: "199,000",
      period: "so'm / oy",
      popular: true,
      features: [
        "Barcha Standart imkoniyatlari",
        "15% chegirma yetkazishda",
        "Shaxsiy menejer",
        "API integratsiya",
        "Prioritet qo'llab-quvvatlash",
        "Ommaviy buyurtmalar",
      ],
    },
    {
      name: "Korporativ",
      icon: "🏢",
      price: "499,000",
      period: "so'm / oy",
      popular: false,
      features: [
        "Barcha Biznes imkoniyatlari",
        "30% gacha chegirma",
        "Omborxona xizmati",
        "Maxsus shartnomalar",
        "24/7 ustuvor yordam",
        "Maxsus hisobotlar",
        "Maxsus logistika yechimlari",
      ],
    },
  ];

  return (
    <div className="pricing-page">
      <div className="container">
        <h1 className="section-title">
          Tarif va <span>narxlar</span>
        </h1>
        <p className="section-subtitle">
          Sizga eng mos tarifni tanlang va logistika ehtiyojlaringizni hal qiling
        </p>

        <div className="pricing-grid">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`pricing-card ${plan.popular ? "popular" : ""}`}
            >
              {plan.popular && (
                <div className="pricing-popular-badge">⭐ Eng mashhur</div>
              )}
              <div className="pricing-icon">{plan.icon}</div>
              <h3 className="pricing-name">{plan.name}</h3>
              <div className="pricing-price">{plan.price}</div>
              <div className="pricing-period">{plan.period}</div>

              <ul className="pricing-features">
                {plan.features.map((feature, fIdx) => (
                  <li key={fIdx}>{feature}</li>
                ))}
              </ul>

              <button
                className={`btn ${
                  plan.popular ? "btn-primary" : "btn-secondary"
                }`}
              >
                Tanlash
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing;