import React, { useState, useMemo } from "react";
import "../../css/admin.css";

// Demo buyurtmalar
const DEMO_ORDERS = [
  {
    id: "LT-123456",
    sender: "Aliyev Akmal",
    from: "Toshkent",
    to: "Samarqand",
    weight: 5.5,
    price: 46000,
    status: "Yo'lda",
    date: "2026-06-25",
  },
  {
    id: "LT-654321",
    sender: "Toshmatov Sardor",
    from: "Toshkent",
    to: "Buxoro",
    weight: 12,
    price: 74000,
    status: "Yetkazildi",
    date: "2026-06-21",
  },
  {
    id: "LT-583921",
    sender: "Karimova Dilnoza",
    from: "Andijon",
    to: "Toshkent",
    weight: 3,
    price: 41000,
    status: "Yo'lda",
    date: "2026-06-24",
  },
  {
    id: "LT-782154",
    sender: "Yusupov Olim",
    from: "Farg'ona",
    to: "Namangan",
    weight: 8,
    price: 51000,
    status: "Yo'lda",
    date: "2026-06-25",
  },
  {
    id: "LT-901234",
    sender: "Nazarov Ulug'bek",
    from: "Toshkent",
    to: "Nukus",
    weight: 15,
    price: 95000,
    status: "Yetkazildi",
    date: "2026-06-20",
  },
  {
    id: "LT-345678",
    sender: "Rahimova Mohira",
    from: "Samarqand",
    to: "Toshkent",
    weight: 2.5,
    price: 40000,
    status: "Yo'lda",
    date: "2026-06-25",
  },
  {
    id: "LT-456789",
    sender: "Ergashev Jasur",
    from: "Qarshi",
    to: "Buxoro",
    weight: 6,
    price: 47000,
    status: "Yetkazildi",
    date: "2026-06-22",
  },
  {
    id: "LT-567890",
    sender: "Soliyeva Nigora",
    from: "Toshkent",
    to: "Andijon",
    weight: 4,
    price: 43000,
    status: "Yo'lda",
    date: "2026-06-25",
  },
];

const Admin = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Barchasi");

  const handleLogin = (e) => {
    e.preventDefault();
    if (
      credentials.username === "admin" &&
      credentials.password === "1234"
    ) {
      setLoggedIn(true);
      setLoginError("");
    } else {
      setLoginError("Noto'g'ri login yoki parol!");
    }
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setCredentials({ username: "", password: "" });
  };

  // Filter va search
  const filteredOrders = useMemo(() => {
    return DEMO_ORDERS.filter((order) => {
      const matchSearch =
        !search ||
        order.id.toLowerCase().includes(search.toLowerCase()) ||
        order.sender.toLowerCase().includes(search.toLowerCase());
      const matchStatus =
        statusFilter === "Barchasi" || order.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [search, statusFilter]);

  const totalSum = useMemo(() => {
    return filteredOrders.reduce((sum, o) => sum + o.price, 0);
  }, [filteredOrders]);

  // Stats
  const stats = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    return {
      total: DEMO_ORDERS.length,
      today: DEMO_ORDERS.filter((o) => o.date === today).length,
      onway: DEMO_ORDERS.filter((o) => o.status === "Yo'lda").length,
      income: DEMO_ORDERS.reduce((sum, o) => sum + o.price, 0),
    };
  }, []);

  // Login sahifa
  if (!loggedIn) {
    return (
      <div className="admin-page">
        <div className="container">
          <div className="admin-login-card">
            <h2>🔐 Admin Panel</h2>
            <p>Faqat ruxsat berilgan xodimlar uchun</p>

            {loginError && (
              <div className="alert alert-error">{loginError}</div>
            )}

            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label className="form-label">Login</label>
                <input
                  type="text"
                  className="form-input"
                  value={credentials.username}
                  onChange={(e) =>
                    setCredentials({ ...credentials, username: e.target.value })
                  }
                  placeholder="admin"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Parol</label>
                <input
                  type="password"
                  className="form-input"
                  value={credentials.password}
                  onChange={(e) =>
                    setCredentials({ ...credentials, password: e.target.value })
                  }
                  placeholder="••••"
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>
                Kirish
              </button>
            </form>

            <div className="admin-login-hint">
              ℹ️ Demo hisob: <strong>admin</strong> / Parol: <strong>1234</strong>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard
  return (
    <div className="admin-page">
      <div className="container">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "30px",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <div>
            <h1 className="section-title" style={{ marginBottom: "4px", textAlign: "left" }}>
              Admin <span>Panel</span>
            </h1>
            <p style={{ color: "#64748b" }}>Barcha buyurtmalarni boshqaring</p>
          </div>
          <button onClick={handleLogout} className="btn btn-secondary">
            🚪 Chiqish
          </button>
        </div>

        <div className="admin-dashboard">
          {/* Statistika */}
          <div className="stats-row">
            <div className="admin-stat-card">
              <div className="admin-stat-label">📦 Jami buyurtmalar</div>
              <div className="admin-stat-value">{stats.total}</div>
            </div>
            <div className="admin-stat-card today">
              <div className="admin-stat-label">📅 Bugungi buyurtmalar</div>
              <div className="admin-stat-value">{stats.today}</div>
            </div>
            <div className="admin-stat-card transit">
              <div className="admin-stat-label">🚚 Yo'ldagi yuklar</div>
              <div className="admin-stat-value">{stats.onway}</div>
            </div>
            <div className="admin-stat-card income">
              <div className="admin-stat-label">💰 Oylik daromad</div>
              <div className="admin-stat-value">
                {stats.income.toLocaleString()} so'm
              </div>
            </div>
          </div>

          {/* Filtr */}
          <div className="admin-filters">
            <input
              type="text"
              className="form-input"
              placeholder="🔍 ID yoki jo'natuvchi ismi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option>Barchasi</option>
              <option>Yo'lda</option>
              <option>Yetkazildi</option>
            </select>
          </div>

          {/* Jadval */}
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Buyurtma ID</th>
                  <th>Jo'natuvchi</th>
                  <th>Yo'nalish</th>
                  <th>Og'irlik</th>
                  <th>Narx</th>
                  <th>Status</th>
                  <th>Sana</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      style={{ textAlign: "center", padding: "30px" }}
                    >
                      Hech qanday buyurtma topilmadi
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id}>
                      <td>
                        <strong style={{ color: "#ff6b35" }}>{order.id}</strong>
                      </td>
                      <td>{order.sender}</td>
                      <td>
                        {order.from} → {order.to}
                      </td>
                      <td>{order.weight} kg</td>
                      <td>{order.price.toLocaleString()} so'm</td>
                      <td>
                        <span
                          className={`status-badge ${
                            order.status === "Yetkazildi"
                              ? "status-delivered"
                              : "status-onway"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td>{order.date}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Umumiy summa */}
          <div className="admin-total">
            <span>Filtrlangan buyurtmalar umumiy summasi:</span>
            <span className="admin-total-amount">
              {totalSum.toLocaleString()} so'm
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;