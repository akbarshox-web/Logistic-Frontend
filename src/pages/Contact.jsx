import { useState } from 'react';
import '../css/Contact.css';

function Contact() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = e => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="contact">
      <div className="contact-hero">
        <h1>Bog'lanish</h1>
        <p>Savollaringiz bormi? Biz yordam berishga tayyormiz!</p>
      </div>

      <div className="contact-container">

        <div className="contact-info">
          <h2>Aloqa ma'lumotlari</h2>
          <div className="info-items">
            <div className="info-item">
              <span className="info-icon">📞</span>
              <div>
                <strong>Telefon</strong>
                <p>+998 90 123 45 67</p>
                <p>+998 71 200 00 00</p>
              </div>
            </div>
            <div className="info-item">
              <span className="info-icon">✉️</span>
              <div>
                <strong>Email</strong>
                <p>info@logistrans.uz</p>
                <p>support@logistrans.uz</p>
              </div>
            </div>
            <div className="info-item">
              <span className="info-icon">📍</span>
              <div>
                <strong>Manzil</strong>
                <p>Toshkent sh., Mirzo Ulug'bek tumani,</p>
                <p>Universitet ko'chasi, 4-uy</p>
              </div>
            </div>
            <div className="info-item">
              <span className="info-icon">🕐</span>
              <div>
                <strong>Ish vaqti</strong>
                <p>Du–Ju: 09:00 – 18:00</p>
                <p>Sha: 10:00 – 15:00</p>
              </div>
            </div>
          </div>
        </div>

        <div className="contact-form-wrap">
          {sent ? (
            <div className="success-msg">
              <span>✅</span>
              <h3>Xabaringiz yuborildi!</h3>
              <p>Tez orada siz bilan bog'lanamiz.</p>
              <button onClick={() => setSent(false)}>Yana yuborish</button>
            </div>
          ) : (
            <form className="contact-form" onSubmit={submit}>
              <h2>Xabar yuborish</h2>
              <div className="form-row">
                <div className="form-group">
                  <label>Ismingiz</label>
                  <input name="name" value={form.name} onChange={handle} placeholder="Ali Valiyev" required />
                </div>
                <div className="form-group">
                  <label>Telefon</label>
                  <input name="phone" value={form.phone} onChange={handle} placeholder="+998 90 000 00 00" required />
                </div>
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" name="email" value={form.email} onChange={handle} placeholder="email@example.com" />
              </div>
              <div className="form-group">
                <label>Xabar</label>
                <textarea name="message" value={form.message} onChange={handle} rows={5} placeholder="Xabaringizni yozing..." required />
              </div>
              <button type="submit" className="form-submit">Yuborish</button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}

export default Contact;