import { useState } from 'react';
import '../css/Admin.css';

const mockOrders = [
  { id: 'LT-123456', sender: 'Ali Valiyev',    from: 'Toshkent',  to: 'Samarqand', service: 'Ekspress',  status: 'delivery', date: '2025-01-17', price: 35000 },
  { id: 'LT-654321', sender: 'Sardor Raximov', from: 'Andijon',   to: 'Toshkent',  service: 'Standart',  status: 'done',     date: '2025-01-16', price: 22000 },
  { id: 'LT-789012', sender: 'Gulnora Mirzayeva', from: 'Buxoro', to: 'Toshkent',  service: 'Kargo',     status: 'pending',  date: '2025-01-18', price: 58000 },
  { id: 'LT-345678', sender: 'Jasur Toshmatov', from: 'Namangan', to: 'Farg\'ona', service: 'Standart',  status: 'done',     date: '2025-01-15', price: 18000 },
  { id: 'LT-901234', sender: 'Malika Xasanova', from: 'Toshkent', to: 'Nukus',     service: 'Sovutgichli', status: 'delivery', date: '2025-01-17', price: 72000 },
  { id: 'LT-567890', sender: 'Bobur Qodirov',  from: 'Qarshi',   to: 'Toshkent',  service: 'Ekspress',  status: 'pending',  date: '2025-01-18', price: 31000 },
];

const statusMap = {
  delivery: { label: 'Yo\'lda',          color: '#f59e0b', bg: '#fef3c7' },
  done:     { label: 'Yetkazildi',       color: '#22c55e', bg: '#dcfce7' },
  pending:  { label: 'Kutilmoqda',       color: '#6366f1', bg: '#ede9fe' },
};

const stats = [
  { label: 'Jami buyurtmalar', value: '1,248', icon: '📦', color: '#0057d9' },
  { label: 'Bugun',            value: '47',    icon: '📅', color: '#22c55e' },
  { label: 'Yo\'lda',         value: '312',   icon: '🚚', color: '#f59e0b' },
  { label: 'Daromad (oy)',     value: '18.4M', icon: '💰', color: '#8b5cf6' },
];

function Admin() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const handleLogin = e => {
    e.preventDefault();
    if (loginForm.username === 'admin' && loginForm.password === '1234') {
      setLoggedIn(true);
    } else {
      setLoginError('Login yoki parol noto\'g\'ri! (admin / 1234)');
    }
  };

  const filtered = mockOrders.filter(o => {
    const matchStatus = filter === 'all' || o.status === filter;
    const matchSearch = o.id.toLowerCase().includes(search.toLowerCase()) ||
                        o.sender.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const totalRevenue = filtered.reduce((s, o) => s + o.price, 0);

  if (!loggedIn) {
    return (
      <div className="admin-login">
        <div className="login-card">
          <div className="login-icon">🔐</div>
          <h2>Admin panel</h2>
          <p>Kirish uchun ma'lumotlaringizni kiriting</p>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Login</label>
              <input
                value={loginForm.username}
                onChange={e => setLoginForm({ ...loginForm, username: e.target.value })}
                placeholder="admin"
              />
            </div>
            <div className="form-group">
              <label>Parol</label>
              <input
                type="password"
                value={loginForm.password}
                onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
                placeholder="••••"
              />
            </div>
            {loginError && <div className="login-error">{loginError}</div>}
            <button type="submit" className="login-btn">Kirish</button>
          </form>
          <p className="login-hint">Demo: admin / 1234</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin">
      <div className="admin-header">
        <div>
          <h1>Admin panel</h1>
          <p>Barcha buyurtmalarni boshqaring</p>
        </div>
        <button className="logout-btn" onClick={() => setLoggedIn(false)}>Chiqish</button>
      </div>

      {/* Stats */}
      <div className="admin-stats">
        {stats.map((s, i) => (
          <div className="stat-card" key={i}>
            <div className="stat-icon" style={{ color: s.color }}>{s.icon}</div>
            <div>
              <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

     
      <div className="admin-controls">
        <input
          className="admin-search"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="🔍 ID yoki ism bo'yicha qidiring..."
        />
        <div className="filter-tabs">
          {['all', 'pending', 'delivery', 'done'].map(f => (
            <button
              key={f}
              className={`filter-tab ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? 'Barchasi' : statusMap[f]?.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Jo'natuvchi</th>
              <th>Yo'nalish</th>
              <th>Xizmat</th>
              <th>Sana</th>
              <th>Narx</th>
              <th>Holat</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(o => {
              const s = statusMap[o.status];
              return (
                <tr key={o.id}>
                  <td className="order-id">{o.id}</td>
                  <td>{o.sender}</td>
                  <td className="route-cell">{o.from} → {o.to}</td>
                  <td>{o.service}</td>
                  <td>{o.date}</td>
                  <td className="price-cell">{o.price.toLocaleString()} so'm</td>
                  <td>
                    <span className="status-badge" style={{ background: s.bg, color: s.color }}>
                      {s.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="table-footer">
        <span>{filtered.length} ta buyurtma</span>
        <span className="footer-total">Jami: <strong>{totalRevenue.toLocaleString()} so'm</strong></span>
      </div>
    </div>
  );
}

export default Admin;