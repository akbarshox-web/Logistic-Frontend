import { useState } from 'react';
import '../css/Order.css';

const cities = [
  'Toshkent', 'Samarqand', 'Buxoro', 'Namangan', 'Andijon',
  'Farg\'ona', 'Nukus', 'Qarshi', 'Termiz', 'Jizzax',
  'Sirdaryo', 'Navoiy', 'Urganch', 'Guliston', 'Muborak',
];

const serviceTypes = [
  { id: 'standart', label: 'Standart',   price: 15000, time: '1-3 kun'  },
  { id: 'express',  label: 'Ekspress',   price: 25000, time: '2-4 soat' },
  { id: 'cargo',    label: 'Kargo',      price: 35000, time: '2-5 kun'  },
  { id: 'cold',     label: 'Sovutgichli',price: 45000, time: '1-2 kun'  },
];

const steps = ['Manzil', 'Yuk ma\'lumoti', 'To\'lov', 'Tasdiqlash'];

function Order() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    senderName: '', senderPhone: '', senderCity: '',
    receiverName: '', receiverPhone: '', receiverCity: '', receiverAddress: '',
    serviceType: 'standart', weight: '', description: '',
    paymentMethod: 'cash',
  });
  const [done, setDone] = useState(false);
  const [trackingCode] = useState('LT-' + Math.floor(100000 + Math.random() * 900000));

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const selectedService = serviceTypes.find(s => s.id === form.serviceType);

  const calcPrice = () => {
    if (!form.weight) return selectedService.price;
    return selectedService.price + Math.ceil(parseFloat(form.weight)) * 1000;
  };

  const next = () => { if (step < 3) setStep(step + 1); };
  const back = () => { if (step > 0) setStep(step - 1); };
  const submit = () => setDone(true);

  if (done) {
    return (
      <div className="order-done">
        <div className="done-card">
          <div className="done-icon">🎉</div>
          <h2>Buyurtma qabul qilindi!</h2>
          <p>Kuzatuv kodi:</p>
          <div className="tracking-code">{trackingCode}</div>
          <p className="done-note">Ushbu kodni saqlang — yukingizni kuzatish uchun kerak bo'ladi.</p>
          <div className="done-info">
            <div><span>Xizmat</span><strong>{selectedService.label}</strong></div>
            <div><span>Yetkazish vaqti</span><strong>{selectedService.time}</strong></div>
            <div><span>Narx</span><strong>{calcPrice().toLocaleString()} so'm</strong></div>
          </div>
          <button onClick={() => { setDone(false); setStep(0); }} className="done-btn">
            Yangi buyurtma
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="order">
      <div className="order-hero">
        <h1>Buyurtma berish</h1>
        <p>Bir necha daqiqada yukingizni jo'nating</p>
      </div>

      <div className="order-container">

        {/* Stepper */}
        <div className="stepper">
          {steps.map((s, i) => (
            <div key={i} className={`step ${i === step ? 'active' : ''} ${i < step ? 'done' : ''}`}>
              <div className="step-circle">{i < step ? '✓' : i + 1}</div>
              <span>{s}</span>
            </div>
          ))}
        </div>

        <div className="order-form">

          {/* Step 0 — Manzil */}
          {step === 0 && (
            <div className="form-section">
              <h3>📤 Jo'natuvchi ma'lumotlari</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Ism Familiya</label>
                  <input name="senderName" value={form.senderName} onChange={handle} placeholder="Ali Valiyev" />
                </div>
                <div className="form-group">
                  <label>Telefon raqam</label>
                  <input name="senderPhone" value={form.senderPhone} onChange={handle} placeholder="+998 90 000 00 00" />
                </div>
              </div>
              <div className="form-group">
                <label>Shahar</label>
                <select name="senderCity" value={form.senderCity} onChange={handle}>
                  <option value="">Tanlang...</option>
                  {cities.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>

              <h3 style={{marginTop: '28px'}}>📥 Qabul qiluvchi ma'lumotlari</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Ism Familiya</label>
                  <input name="receiverName" value={form.receiverName} onChange={handle} placeholder="Vali Aliyev" />
                </div>
                <div className="form-group">
                  <label>Telefon raqam</label>
                  <input name="receiverPhone" value={form.receiverPhone} onChange={handle} placeholder="+998 90 000 00 00" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Shahar</label>
                  <select name="receiverCity" value={form.receiverCity} onChange={handle}>
                    <option value="">Tanlang...</option>
                    {cities.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Aniq manzil</label>
                  <input name="receiverAddress" value={form.receiverAddress} onChange={handle} placeholder="Ko'cha, uy raqami" />
                </div>
              </div>
            </div>
          )}

          {/* Step 1 — Yuk */}
          {step === 1 && (
            <div className="form-section">
              <h3>📦 Xizmat turini tanlang</h3>
              <div className="service-options">
                {serviceTypes.map(s => (
                  <label key={s.id} className={`service-option ${form.serviceType === s.id ? 'selected' : ''}`}>
                    <input type="radio" name="serviceType" value={s.id} checked={form.serviceType === s.id} onChange={handle} />
                    <div className="service-option-info">
                      <strong>{s.label}</strong>
                      <span>{s.time}</span>
                    </div>
                    <span className="service-option-price">{s.price.toLocaleString()} so'm</span>
                  </label>
                ))}
              </div>

              <div className="form-row" style={{marginTop: '24px'}}>
                <div className="form-group">
                  <label>Og'irlik (kg)</label>
                  <input type="number" name="weight" value={form.weight} onChange={handle} placeholder="1.5" min="0.1" step="0.1" />
                </div>
                <div className="form-group">
                  <label>Taxminiy narx</label>
                  <div className="price-estimate">{calcPrice().toLocaleString()} so'm</div>
                </div>
              </div>
              <div className="form-group">
                <label>Yuk tavsifi</label>
                <textarea name="description" value={form.description} onChange={handle} rows={3} placeholder="Masalan: kiyim-kechak, elektr jihozlar..." />
              </div>
            </div>
          )}

          {/* Step 2 — To'lov */}
          {step === 2 && (
            <div className="form-section">
              <h3>💳 To'lov usulini tanlang</h3>
              <div className="payment-options">
                {[
                  { id: 'cash',   icon: '💵', label: 'Naqd pul'     },
                  { id: 'card',   icon: '💳', label: 'Plastik karta' },
                  { id: 'click',  icon: '📱', label: 'Click'         },
                  { id: 'payme',  icon: '📲', label: 'Payme'         },
                ].map(p => (
                  <label key={p.id} className={`payment-option ${form.paymentMethod === p.id ? 'selected' : ''}`}>
                    <input type="radio" name="paymentMethod" value={p.id} checked={form.paymentMethod === p.id} onChange={handle} />
                    <span className="pay-icon">{p.icon}</span>
                    <span>{p.label}</span>
                  </label>
                ))}
              </div>

              <div className="order-summary">
                <h4>Buyurtma xulosasi</h4>
                <div className="summary-row"><span>Xizmat turi</span><strong>{selectedService.label}</strong></div>
                <div className="summary-row"><span>Yetkazish vaqti</span><strong>{selectedService.time}</strong></div>
                <div className="summary-row"><span>Og'irlik</span><strong>{form.weight || '—'} kg</strong></div>
                <div className="summary-row"><span>Jo'natuvchi</span><strong>{form.senderCity || '—'}</strong></div>
                <div className="summary-row"><span>Qabul qiluvchi</span><strong>{form.receiverCity || '—'}</strong></div>
                <div className="summary-row total"><span>Jami</span><strong>{calcPrice().toLocaleString()} so'm</strong></div>
              </div>
            </div>
          )}

          {/* Step 3 — Tasdiqlash */}
          {step === 3 && (
            <div className="form-section confirm-section">
              <div className="confirm-icon">✅</div>
              <h3>Buyurtmani tasdiqlaysizmi?</h3>
              <p>Barcha ma'lumotlar to'g'ri ekanligini tekshiring.</p>
              <div className="confirm-grid">
                <div className="confirm-block">
                  <h5>Jo'natuvchi</h5>
                  <p>{form.senderName || '—'}</p>
                  <p>{form.senderPhone || '—'}</p>
                  <p>{form.senderCity || '—'}</p>
                </div>
                <div className="confirm-block">
                  <h5>Qabul qiluvchi</h5>
                  <p>{form.receiverName || '—'}</p>
                  <p>{form.receiverPhone || '—'}</p>
                  <p>{form.receiverCity}, {form.receiverAddress}</p>
                </div>
                <div className="confirm-block">
                  <h5>Yetkazish</h5>
                  <p>{selectedService.label}</p>
                  <p>{selectedService.time}</p>
                  <p>{form.weight} kg</p>
                </div>
                <div className="confirm-block">
                  <h5>To'lov</h5>
                  <p style={{textTransform:'capitalize'}}>{form.paymentMethod}</p>
                  <p className="confirm-total">{calcPrice().toLocaleString()} so'm</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="form-nav">
            {step > 0 && <button className="btn-back" onClick={back}>← Orqaga</button>}
            {step < 3
              ? <button className="btn-next" onClick={next}>Davom etish →</button>
              : <button className="btn-submit" onClick={submit}>Buyurtmani tasdiqlash 🚀</button>
            }
          </div>

        </div>
      </div>
    </div>
  );
}

export default Order;