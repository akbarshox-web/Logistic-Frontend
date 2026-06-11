import { useState } from 'react';
import '../css/Tracking.css';

const mockOrders = {
  'LT-123456': {
    status: 'delivery',
    from: 'Toshkent', to: 'Samarqand',
    sender: 'Ali Valiyev', receiver: 'Vali Aliyev',
    service: 'Ekspress', weight: '2.5 kg',
    estimated: '2025-01-18',
    steps: [
      { label: 'Buyurtma qabul qilindi',    time: '08:30', done: true  },
      { label: 'Omborxonaga keltirildi',     time: '10:15', done: true  },
      { label: 'Saralash markazida',         time: '12:40', done: true  },
      { label: 'Yo\'lda (Jizzax shahri)',    time: '15:00', done: true  },
      { label: 'Samarqandga yetib keldi',    time: '—',     done: false },
      { label: 'Yetkazib berildi',           time: '—',     done: false },
    ],
  },
  'LT-654321': {
    status: 'done',
    from: 'Andijon', to: 'Toshkent',
    sender: 'Sardor Raximov', receiver: 'Dilnoza Yusupova',
    service: 'Standart', weight: '5 kg',
    estimated: '2025-01-16',
    steps: [
      { label: 'Buyurtma qabul qilindi', time: '09:00', done: true },
      { label: 'Omborxonaga keltirildi', time: '11:30', done: true },
      { label: 'Saralash markazida',     time: '14:00', done: true },
      { label: 'Yo\'lda',               time: '17:00', done: true },
      { label: 'Toshkentga yetdi',       time: '20:00', done: true },
      { label: 'Yetkazib berildi',       time: '10:30', done: true },
    ],
  },
};

const statusInfo = {
  delivery: { label: 'Yo\'lda',           color: '#f59e0b', bg: '#fef3c7', icon: '🚚' },
  done:     { label: 'Yetkazib berildi',  color: '#22c55e', bg: '#dcfce7', icon: '✅' },
  pending:  { label: 'Kutilmoqda',        color: '#6366f1', bg: '#ede9fe', icon: '⏳' },
};

function Tracking() {
  const [code, setCode] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError]   = useState('');

  const search = () => {
    const found = mockOrders[code.trim().toUpperCase()];
    if (found) { setResult(found); setError(''); }
    else { setResult(null); setError('Buyurtma topilmadi. Kodni tekshiring.'); }
  };

  const status = result ? statusInfo[result.status] : null;

  return (
    <div className="tracking">
      <div className="tracking-hero">
        <h1>Yuk kuzatish</h1>
        <p>Kuzatuv kodingizni kiriting va yukingiz holatini bilib oling</p>
      </div>

      <div className="tracking-container">

        {/* Search */}
        <div className="search-box">
          <input
            value={code}
            onChange={e => setCode(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && search()}
            placeholder="Masalan: LT-123456"
          />
          <button onClick={search}>Qidirish 🔍</button>
        </div>
        <p className="demo-hint">💡 Demo uchun: <b>LT-123456</b> yoki <b>LT-654321</b></p>

        {error && <div className="track-error">{error}</div>}

        {result && (
          <div className="track-result">

            {/* Status badge */}
            <div className="track-status" style={{ background: status.bg, color: status.color }}>
              <span>{status.icon}</span>
              <strong>{status.label}</strong>
            </div>

            {/* Info grid */}
            <div className="track-info">
              <div className="track-route">
                <div className="route-city">
                  <span className="city-dot from" />
                  <div>
                    <small>Jo'natildi</small>
                    <strong>{result.from}</strong>
                  </div>
                </div>
                <div className="route-line">
                  <span>✈</span>
                </div>
                <div className="route-city right">
                  <div>
                    <small>Manzil</small>
                    <strong>{result.to}</strong>
                  </div>
                  <span className="city-dot to" />
                </div>
              </div>

              <div className="track-details">
                <div><span>Jo'natuvchi</span><strong>{result.sender}</strong></div>
                <div><span>Qabul qiluvchi</span><strong>{result.receiver}</strong></div>
                <div><span>Xizmat turi</span><strong>{result.service}</strong></div>
                <div><span>Og'irlik</span><strong>{result.weight}</strong></div>
                <div><span>Kutilgan sana</span><strong>{result.estimated}</strong></div>
              </div>
            </div>

            {/* Timeline */}
            <div className="timeline">
              <h4>Yuk harakati</h4>
              {result.steps.map((s, i) => (
                <div key={i} className={`timeline-item ${s.done ? 'done' : ''}`}>
                  <div className="tl-dot">
                    {s.done ? '✓' : i + 1}
                  </div>
                  <div className="tl-content">
                    <span className="tl-label">{s.label}</span>
                    {s.time !== '—' && <span className="tl-time">{s.time}</span>}
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

export default Tracking;