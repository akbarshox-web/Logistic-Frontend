import React, { useState } from "react";
import "../../css/contact.css";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.message) return;
    setSubmitted(true);
    setForm({ name: "", phone: "", email: "", message: "" });
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="contact-page">
      <div className="container">
        <h1 className="section-title">
          Biz bilan <span>bog'laning</span>
        </h1>
        <p className="section-subtitle">
          Savollaringiz bormi? Biz har doim aloqadamiz!
        </p>

        <div className="contact-grid">
          <div className="contact-info">
            <div className="contact-info-card">
              <div className="contact-icon">📞</div>
              <div className="contact-info-content">
                <h3>Telefon</h3>
                <p><strong>+998 71 200 00 00</strong></p>
                <p>+998 90 123 45 67</p>
              </div>
            </div>

            <div className="contact-info-card">
              <div className="contact-icon">✉️</div>
              <div className="contact-info-content">
                <h3>Email</h3>
                <p><strong>info@logistrans.uz</strong></p>
                <p>support@logistrans.uz</p>
              </div>
            </div>

            <div className="contact-info-card">
              <div className="contact-icon">🕐</div>
              <div className="contact-info-content">
                <h3>Ish vaqti</h3>
                <p><strong>Du-Ju: 09:00 - 18:00</strong></p>
                <p>Shanba: 10:00 - 15:00</p>
              </div>
            </div>

            <div className="contact-info-card">
              <div className="contact-icon">📍</div>
              <div className="contact-info-content">
                <h3>Manzil</h3>
                <p><strong>Toshkent shahri</strong></p>
                <p>Amir Temur ko'chasi, 108-uy</p>
              </div>
            </div>
          </div>

          <div className="contact-form">
            <h2>✉️ Xabar yuboring</h2>

            {submitted && (
              <div className="alert alert-success">
                ✅ Xabaringiz yuborildi! Tez orada siz bilan bog'lanamiz.
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Ismingiz *</label>
                  <input
                    type="text"
                    name="name"
                    className="form-input"
                    placeholder="Ismingizni kiriting"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Telefon *</label>
                  <input
                    type="tel"
                    name="phone"
                    className="form-input"
                    placeholder="+998 90 123 45 67"
                    value={form.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  placeholder="email@example.com"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Xabaringiz *</label>
                <textarea
                  name="message"
                  className="form-textarea"
                  rows="5"
                  placeholder="Xabaringizni yozing..."
                  value={form.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>
                Yuborish
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;