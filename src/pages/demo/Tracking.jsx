import React, { useState } from "react";
import "../../css/tracking.css";

// Demo ma'lumotlar bazasi
const DEMO_TRACKINGS = {
  "LT-123456": {
    code: "LT-123456",
    status: "Yo'lda",
    from: "Toshkent",
    to: "Samarqand",
    sender: "Aliyev Akmal",
    receiver: "Karimova Dilnoza",
    weight: "5.5 kg",
    service: "Viloyatlararo",
    eta: "2026-06-26 14:00",
    timeline: [
      { status: "Buyurtma qabul qilindi", time: "2026-06-25 09:00", done: true },
      { status: "Omborxonadan jo'natildi", time: "2026-06-25 11:30", done: true },
      { status: "Yo'lda", time: "2026-06-25 14:00", current: true, done: true },
      { status: "Yetkazildi", time: "—", done: false },
    ],
  },
  "LT-654321": {
    code: "LT-654321",
    status: "Yetkazildi",
    from: "Toshkent",
    to: "Buxoro",
    sender: "Toshmatov Sardor",
    receiver: "Nazarov Ulug'bek",
    weight: "12 kg",
    service: "Kargo",
    eta: "2026-06-23 16:30",
    timeline: [
      { status: "Buyurtma qabul qilindi", time: "2026-06-21 10:00", done: true },
      { status: "Omborxonadan jo'natildi", time: "2026-06-21 12:00", done: true },
      { status: "Yo'lda", time: "2026-06-22 09:00", done: true },
      { status: "Yetkazildi", time: "2026-06-23 16:30", done: true },
    ],
  },
};

const Tracking = () => {
  const [code, setCode] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    const codeUpper = code.trim().toUpperCase();
    if (!codeUpper) {
      setError("Kuzatuv kodini kiriting");
      setResult(null);
      return;
    }

    if (DEMO_TRACKINGS[codeUpper]) {
      setResult(DEMO_TRACKINGS[codeUpper]);
      setError("");
    } else {
      setResult(null);
      setError("Bunday kod bo'yicha ma'lumot topilmadi. Demo kodlardan birini sinab ko'ring.");
    }
  };

  const handleDemoCode = (demoCode) => {
    setCode(demoCode);
    setResult(DEMO_TRACKINGS[demoCode]);
    setError("");
  };

  return (
    <div className="tracking-page">
      <div className="container">
        <h1 className="section-title">
          Yukni <span>kuzatish</span>
        </h1>
        <p className="section-subtitle">
          Kuzatuv kodini kiriting va yukingiz holatini bilib oling
        </p>

        <div className="tracking-search">
          <form className="tracking-form" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Masalan: LT-123456"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">
              🔍 Kuzatish
            </button>
          </form>

          <div className="demo-codes">
            <strong>Demo kodlar (sinab ko'ring):</strong>
            <div style={{ marginTop: "8px" }}>
              <button
                type="button"
                onClick={() => handleDemoCode("LT-123456")}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                <code>LT-123456</code>
              </button>{" "}
              - Yo'lda{" "}
              <button
                type="button"
                onClick={() => handleDemoCode("LT-654321")}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                <code>LT-654321</code>
              </button>{" "}
              - Yetkazilgan
            </div>
          </div>
        </div>

        {error && (
          <div className="alert alert-error" style={{ maxWidth: "800px", margin: "0 auto" }}>
            ⚠️ {error}
          </div>
        )}

        {result && (
          <div className="tracking-result">
            <div className="tracking-header">
              <div>
                <div className="tracking-header-code">Buyurtma raqami</div>
                <div className="tracking-header-id">{result.code}</div>
              </div>
              <div className="tracking-status">{result.status}</div>
            </div>

            <div className="tracking-body">
              {/* Marshrut xaritasi */}
              <div className="route-map">
                <div className="route-path">
                  <div className="route-city">
                    <div className="route-city-icon">📍</div>
                    <div className="route-city-name">{result.from}</div>
                  </div>
                  <div className="route-line"></div>
                  <div className="route-city">
                    <div className="route-city-icon">🏁</div>
                    <div className="route-city-name">{result.to}</div>
                  </div>
                </div>
              </div>

              {/* Tafsilotlar */}
              <div className="details-grid">
                <div className="detail-item">
                  <div className="detail-label">Jo'natuvchi</div>
                  <div className="detail-value">{result.sender}</div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">Qabul qiluvchi</div>
                  <div className="detail-value">{result.receiver}</div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">Xizmat turi</div>
                  <div className="detail-value">{result.service}</div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">Og'irlik</div>
                  <div className="detail-value">{result.weight}</div>
                </div>
                <div className="detail-item" style={{ gridColumn: "1 / -1" }}>
                  <div className="detail-label">Yetib borish vaqti</div>
                  <div className="detail-value">{result.eta}</div>
                </div>
              </div>

              {/* Timeline */}
              <div className="timeline">
                <h3 className="timeline-title">📅 Yuk harakati tarixi</h3>
                <ul className="timeline-list">
                  {result.timeline.map((item, idx) => (
                    <li
                      key={idx}
                      className={`timeline-item ${
                        item.current ? "current" : item.done ? "done" : ""
                      }`}
                    >
                      <span className="timeline-dot"></span>
                      <div className="timeline-text">
                        {item.status}
                        {item.current && " (Hozirgi holat)"}
                      </div>
                      <div className="timeline-time">⏱️ {item.time}</div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tracking;