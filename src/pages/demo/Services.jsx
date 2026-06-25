import React from "react";
import { Link } from "react-router-dom";
import "../../css/services.css";

const Services = () => {
  const services = [
    {
      icon: "🏙️",
      title: "Shahar ichi yetkazish",
      desc: "Toshkent shahri bo'ylab tez va ishonchli yetkazib berish xizmati.",
      time: "2-4 soat",
      price: "15,000 so'mdan",
    },
    {
      icon: "🗺️",
      title: "Viloyatlararo yetkazish",
      desc: "Respublikaning barcha viloyatlariga kafolatlangan yetkazib berish.",
      time: "1-3 kun",
      price: "35,000 so'mdan",
    },
    {
      icon: "📦",
      title: "Kargo va ommaviy yuk",
      desc: "Biznes uchun katta hajmdagi yuklarni tashish xizmati.",
      time: "Kelishilgan",
      price: "Kelishilgan narxda",
      popular: true,
    },
    {
      icon: "❄️",
      title: "Sovutgichli yetkazish",
      desc: "Dorilar va oziq-ovqat mahsulotlari uchun maxsus harorat nazorati (0-8°C).",
      time: "Maxsus jadval",
      price: "45,000 so'mdan",
    },
    {
      icon: "🚀",
      title: "Ekspress yetkazish",
      desc: "Shoshilinch yuklar uchun eng tez yetkazib berish xizmati.",
      time: "1-2 soat",
      price: "25,000 so'mdan",
    },
    {
      icon: "🏭",
      title: "Omborxona xizmati",
      desc: "Yuklaringizni xavfsiz va nazorat ostida saqlash imkoniyati.",
      time: "24/7 nazorat",
      price: "50,000 so'm/oy",
    },
  ];

  return (
    <div className="services-page">
      <div className="container">
        <h1 className="section-title">
          Bizning <span>xizmatlarimiz</span>
        </h1>
        <p className="section-subtitle">
          LogisTrans — O'zbekistondagi barcha turdagi logistika ehtiyojlaringiz uchun
          professional yechimlar
        </p>

        <div className="services-grid">
          {services.map((service, idx) => (
            <div key={idx} className="service-card">
              {service.popular && (
                <div className="service-badge">Eng mashhur</div>
              )}
              <div className="service-icon">{service.icon}</div>
              <h3 className="service-title">{service.title}</h3>
              <p className="service-desc">{service.desc}</p>
              <div className="service-info">
                <div className="service-info-row">
                  <span className="service-info-label">⏱️ Vaqt:</span>
                  <span className="service-info-value">{service.time}</span>
                </div>
                <div className="service-info-row">
                  <span className="service-info-label">💰 Narx:</span>
                  <span className="service-info-value service-price">
                    {service.price}
                  </span>
                </div>
              </div>
              <Link
                to="/buyurtma"
                className="btn btn-primary"
                style={{ marginTop: "20px", textAlign: "center" }}
              >
                Buyurtma berish
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;