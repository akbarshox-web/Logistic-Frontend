import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../css/order.css";

const CITIES = [
  "Toshkent",
  "Samarqand",
  "Buxoro",
  "Andijon",
  "Farg'ona",
  "Namangan",
  "Qarshi",
  "Nukus",
  "Urganch",
  "Termiz",
  "Jizzax",
  "Navoiy",
  "Guliston",
  "Xiva",
  "Marg'ilon",
];

const SERVICE_PRICES = {
  "Shahar ichi": 15000,
  "Viloyatlararo": 35000,
  "Kargo va ommaviy": 50000,
  "Sovutgichli": 45000,
  "Ekspress": 25000,
};

const Order = () => {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [trackingCode, setTrackingCode] = useState("");
  const [formData, setFormData] = useState({
    senderName: "",
    senderPhone: "",
    senderCity: "Toshkent",
    senderAddress: "",
    receiverName: "",
    receiverPhone: "",
    receiverCity: "Toshkent",
    receiverAddress: "",
    serviceType: "Shahar ichi",
    weight: 1,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const totalPrice = (SERVICE_PRICES[formData.serviceType] || 0) + Number(formData.weight) * 2000;

  const generateTrackingCode = () => {
    return "LT-" + Math.floor(100000 + Math.random() * 900000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const code = generateTrackingCode();
    setTrackingCode(code);
    setSubmitted(true);
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, 2));
  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  // Success sahifa
  if (submitted) {
    return (
      <div className="order-page">
        <div className="container">
          <div className="success-card">
            <div className="success-icon">✓</div>
            <h2 className="success-title">Buyurtma qabul qilindi!</h2>
            <p>
              Buyurtmangiz muvaffaqiyatli qabul qilindi. Quyidagi kod orqali yukingizni
              kuzatishingiz mumkin:
            </p>
            <div className="success-code">
              <div className="success-code-label">Sizning kuzatuv kodingiz:</div>
              <div className="success-code-value">{trackingCode}</div>
            </div>
            <p style={{ color: "#64748b", fontSize: "0.95rem" }}>
              ℹ️ Kodni saqlang! Yukingiz holatini{" "}
              <Link to="/kuzatish" style={{ color: "#ff6b35", fontWeight: 700 }}>
                kuzatish sahifasida
              </Link>{" "}
              tekshirib boring.
            </p>
            <div className="success-actions">
              <Link to="/kuzatish" className="btn btn-primary">
                Yukni kuzatish
              </Link>
              <Link to="/" className="btn btn-secondary">
                Bosh sahifa
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="order-page">
      <div className="container">
        <h1 className="section-title">
          Buyurtma <span>berish</span>
        </h1>
        <p className="section-subtitle">
          Quyidagi formani to'ldiring va yukingizni bizga ishonib topshiring
        </p>

        {/* Stepper */}
        <div className="stepper">
          {[0, 1, 2].map((idx) => (
            <div key={idx} className="stepper-item">
              <div
                className={`step-circle ${
                  step === idx ? "active" : step > idx ? "completed" : ""
                }`}
              >
                {step > idx ? "✓" : idx + 1}
              </div>
              {idx < 2 && (
                <div
                  className={`step-line ${step > idx ? "active" : ""}`}
                ></div>
              )}
            </div>
          ))}
        </div>

        <form className="step-content" onSubmit={handleSubmit}>
          {/* 0-Bosqich: Manzillar */}
          {step === 0 && (
            <>
              <h2>📍 Manzillar</h2>
              <p>Jo'natuvchi va qabul qiluvchi ma'lumotlarini kiriting</p>

              <h3 style={{ marginTop: "20px", marginBottom: "12px", color: "#ff6b35" }}>
                Jo'natuvchi
              </h3>
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Ism *</label>
                  <input
                    type="text"
                    name="senderName"
                    className="form-input"
                    value={formData.senderName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Telefon *</label>
                  <input
                    type="tel"
                    name="senderPhone"
                    className="form-input"
                    placeholder="+998 90 123 45 67"
                    value={formData.senderPhone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Shahar *</label>
                  <select
                    name="senderCity"
                    className="form-select"
                    value={formData.senderCity}
                    onChange={handleChange}
                    required
                  >
                    {CITIES.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Manzil *</label>
                  <input
                    type="text"
                    name="senderAddress"
                    className="form-input"
                    placeholder="Ko'cha, uy raqami"
                    value={formData.senderAddress}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <h3 style={{ marginTop: "20px", marginBottom: "12px", color: "#ff6b35" }}>
                Qabul qiluvchi
              </h3>
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Ism *</label>
                  <input
                    type="text"
                    name="receiverName"
                    className="form-input"
                    value={formData.receiverName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Telefon *</label>
                  <input
                    type="tel"
                    name="receiverPhone"
                    className="form-input"
                    placeholder="+998 90 123 45 67"
                    value={formData.receiverPhone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Shahar *</label>
                  <select
                    name="receiverCity"
                    className="form-select"
                    value={formData.receiverCity}
                    onChange={handleChange}
                    required
                  >
                    {CITIES.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Manzil *</label>
                  <input
                    type="text"
                    name="receiverAddress"
                    className="form-input"
                    placeholder="Ko'cha, uy raqami"
                    value={formData.receiverAddress}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </>
          )}

          {/* 1-Bosqich: Yuk ma'lumotlari */}
          {step === 1 && (
            <>
              <h2>📦 Yuk ma'lumotlari</h2>
              <p>Yukingiz turi va og'irligini kiriting</p>

              <div className="form-group">
                <label className="form-label">Xizmat turi *</label>
                <select
                  name="serviceType"
                  className="form-select"
                  value={formData.serviceType}
                  onChange={handleChange}
                  required
                >
                  {Object.keys(SERVICE_PRICES).map((service) => (
                    <option key={service} value={service}>
                      {service} ({(SERVICE_PRICES[service] || 0).toLocaleString()} so'm)
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Yuk og'irligi (kg) *</label>
                <input
                  type="number"
                  name="weight"
                  className="form-input"
                  min="0.1"
                  step="0.1"
                  value={formData.weight}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="price-box">
                <div className="price-label">Umumiy narx:</div>
                <div className="price-value">
                  {totalPrice.toLocaleString()} so'm
                </div>
                <div className="price-detail">
                  Xizmat: {(SERVICE_PRICES[formData.serviceType] || 0).toLocaleString()} so'm
                  + Yuk: {(Number(formData.weight) * 2000).toLocaleString()} so'm
                </div>
              </div>
            </>
          )}

          {/* 2-Bosqich: Tasdiqlash */}
          {step === 2 && (
            <>
              <h2>✓ Buyurtmani tasdiqlash</h2>
              <p>Ma'lumotlarni tekshiring va buyurtmani yuboring</p>

              <div
                style={{
                  background: "#f8fafc",
                  padding: "20px",
                  borderRadius: "12px",
                  marginTop: "20px",
                }}
              >
                <h3 style={{ marginBottom: "12px", color: "#ff6b35" }}>
                  📍 Manzillar
                </h3>
                <p style={{ marginBottom: "6px" }}>
                  <strong>Jo'natuvchi:</strong> {formData.senderName}, {formData.senderPhone}
                </p>
                <p style={{ marginBottom: "12px", color: "#64748b" }}>
                  {formData.senderCity}, {formData.senderAddress}
                </p>
                <p style={{ marginBottom: "6px" }}>
                  <strong>Qabul qiluvchi:</strong> {formData.receiverName}, {formData.receiverPhone}
                </p>
                <p style={{ color: "#64748b" }}>
                  {formData.receiverCity}, {formData.receiverAddress}
                </p>

                <h3
                  style={{
                    marginTop: "20px",
                    marginBottom: "12px",
                    color: "#ff6b35",
                  }}
                >
                  📦 Yuk
                </h3>
                <p>
                  <strong>Xizmat:</strong> {formData.serviceType}
                </p>
                <p>
                  <strong>Og'irlik:</strong> {formData.weight} kg
                </p>
              </div>

              <div className="price-box">
                <div className="price-label">To'lov miqdori:</div>
                <div className="price-value">
                  {totalPrice.toLocaleString()} so'm
                </div>
              </div>
            </>
          )}

          <div className="step-actions">
            {step > 0 ? (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={prevStep}
              >
                ← Orqaga
              </button>
            ) : (
              <div></div>
            )}

            {step < 2 ? (
              <button
                type="button"
                className="btn btn-primary"
                onClick={nextStep}
              >
                Keyingisi →
              </button>
            ) : (
              <button type="submit" className="btn btn-primary">
                Buyurtmani tasdiqlash ✓
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Order;