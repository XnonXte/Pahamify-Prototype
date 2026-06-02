import { useState, useRef, useEffect } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";

// ─── RESPONSIVE STYLES (inject once) ─────────────────────────────────────────
const responsiveCSS = `
  :root { --sidebar-w: 176px; --topbar-h: 52px; --bottomnav-h: 56px; }

  /* Tablet: icon-only sidebar */
  @media (max-width: 900px) {
    .sidebar { width: 56px !important; min-width: 56px !important; }
    .sidebar .nav-label,
    .sidebar .logo-text,
    .sidebar .user-name,
    .sidebar .btn-collapse { display: none !important; }
    .sidebar .logo { justify-content: center !important; padding: 0 0 20px !important; }
    .sidebar .nav-item { justify-content: center !important; padding: 10px 0 !important; border-right: none !important; }
    .sidebar .nav-item.active { border-right: none !important; }
  }

  /* Mobile: hide sidebar, show bottom nav */
  @media (max-width: 600px) {
    .sidebar { display: none !important; }
    .bottom-nav { display: flex !important; }
    .app-content { padding: 12px 12px calc(var(--bottomnav-h) + 12px) !important; }
    .topbar { padding: 0 12px !important; }
    .grid-2 { grid-template-columns: 1fr !important; }
  }

  /* Two-col grid (stacks on mobile via above rule) */
  @media (max-width: 760px) {
    .grid-2 { grid-template-columns: 1fr; }
  }

  .bottom-nav {
    display: none;
    position: fixed; bottom: 0; left: 0; right: 0;
    height: var(--bottomnav-h);
    background: #fff;
    border-top: 0.5px solid #e0e0e0;
    align-items: center;
    justify-content: space-around;
    z-index: 100;
  }

  .scroll-btn { display: flex; }
  @media (max-width: 600px) { .scroll-btn { display: none !important; } }
`;

// ─── DATA ────────────────────────────────────────────────────────────────────
const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

const tryoutData = {
  saintek: { vals: [620, 645, 660, 638, 672, 680, 695, 710, 700, 725, 742, 758], last: "742", high: "758", avg: "718" },
  soshum: { vals: [580, 600, 590, 615, 625, 640, 630, 655, 660, 675, 680, 698], last: "698", high: "698", avg: "649" }
};
const banksoalData = {
  semua: { vals: [40, 55, 62, 48, 70, 80, 75, 90, 85, 95, 100, 88], total: "840", benar: "612", akurasi: "73%" },
  benar: { vals: [28, 38, 45, 32, 52, 60, 55, 68, 64, 72, 76, 62], total: "612", benar: "612", akurasi: "—" },
  salah: { vals: [12, 17, 17, 16, 18, 20, 20, 22, 21, 23, 24, 26], total: "228", benar: "228", akurasi: "—" }
};

const toChartData = (vals) => months.map((m, i) => ({ name: m, value: vals[i] }));

const lanjutkanCards = [
  { img: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=300&q=80", tag: "UTBK", name: "Matematika Dasar", chapter: "Bab 3 — Limit Fungsi", pct: 62 },
  { img: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=300&q=80", tag: "UTBK", name: "Fisika Gelombang", chapter: "Bab 5 — Gelombang Bunyi", pct: 45 },
  { img: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=300&q=80", tag: "UTBK", name: "Bahasa Inggris", chapter: "Bab 2 — Reading Comp.", pct: 78 },
  { img: "https://images.unsplash.com/photo-1628863353691-0071c8c1874c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", tag: "UTBK", name: "Kimia Organik", chapter: "Bab 4 — Reaksi Ester", pct: 33 },
  { img: "https://images.unsplash.com/photo-1648792940059-3b782a7b8b20?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", tag: "UTBK", name: "Biologi Genetika", chapter: "Bab 6 — Hukum Mendel", pct: 55 },
  { img: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=300&q=80", tag: "UTBK", name: "Sejarah Indonesia", chapter: "Bab 3 — Era Kolonial", pct: 40 },
  { img: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=300&q=80", tag: "UTBK", name: "Ekonomi Makro", chapter: "Bab 1 — Mikro Dasar", pct: 20 },
];

const sainsCards = [
  { img: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=300&q=80", tag: "UTBK", name: "Matematika Dasar", instructor: "Dr. Budi Santoso" },
  { img: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=300&q=80", tag: "UTBK", name: "Fisika Gelombang & Optik", instructor: "Sari Dewi, M.Si" },
  { img: "https://images.unsplash.com/photo-1628863353691-0071c8c1874c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", tag: "UTBK", name: "Kimia Organik", instructor: "Dr. Budi Santoso" },
  { img: "https://images.unsplash.com/photo-1648792940059-3b782a7b8b20?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", tag: "UTBK", name: "Biologi Genetika", instructor: "Sari Dewi, M.Si", badge: "GRATIS" },
  { img: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=300&q=80", tag: "UTBK", name: "Informatika Dasar", instructor: "Hendra Wijaya" },
  { img: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=300&q=80", tag: "SMA", name: "Matematika Peminatan", instructor: "Dr. Budi Santoso" },
];

const bahasaCards = [
  { img: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=300&q=80", tag: "UTBK", name: "Bahasa Inggris Intensif", instructor: "Anita Kusuma, S.Pd" },
  { img: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=300&q=80", tag: "UTBK", name: "Bahasa Indonesia Literasi", instructor: "Nadia Pratiwi, M.Pd" },
  { img: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=300&q=80", tag: "UTBK", name: "Literasi Membaca", instructor: "Reza Firmansyah", badge: "GRATIS" },
  { img: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=300&q=80", tag: "SMA", name: "Menulis Kreatif", instructor: "Anita Kusuma, S.Pd" },
  { img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=300&q=80", tag: "SMP", name: "Grammar & Structure", instructor: "Hendra Wijaya" },
  { img: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=300&q=80", tag: "SMP", name: "Teks Berita & Opini", instructor: "Nadia Pratiwi, M.Pd" },
];

const sosialCards = [
  { img: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=300&q=80", tag: "UTBK", name: "Sejarah Indonesia", instructor: "Hendra Wijaya" },
  { img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=300&q=80", tag: "UTBK", name: "Geografi Lingkungan", instructor: "Dr. Budi Santoso" },
  { img: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=300&q=80", tag: "UTBK", name: "Ekonomi Makro & Mikro", instructor: "Reza Firmansyah", badge: "GRATIS" },
  { img: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=300&q=80", tag: "SMA", name: "Sosiologi Masyarakat", instructor: "Nadia Pratiwi, M.Pd" },
  { img: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=300&q=80", tag: "SMA", name: "PKN & Demokrasi", instructor: "Anita Kusuma, S.Pd" },
  { img: "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=300&q=80", tag: "SMA", name: "Peta, SIG & Inderaja", instructor: "Hendra Wijaya" },
];

const faqData = [
  { q: "Bagaimana cara mengerjakan TryOut UTBK?", a: "Buka menu Pusat Belajar → pilih tab TryOut → pilih paket yang tersedia. Kerjakan dalam satu sesi waktu yang sudah ditentukan. Hasil dan pembahasan tersedia setelah sesi selesai." },
  { q: "Apakah bisa berdiskusi langsung dengan mentor?", a: "Ya, kamu bisa memilih mentor yang tersedia di halaman Bantuan & Dukungan, lalu klik tombol \"Diskusi Sekarang\". Mentor online siap membantu dalam hitungan menit." },
  { q: "Bagaimana cara melihat progres belajar saya?", a: "Semua progres tersedia di halaman Dashboard. Di sana kamu bisa melihat Day Streak, grafik perkembangan nilai TryOut, dan statistik pengerjaan Bank Soal per bulan." },
  { q: "Apa itu Bank Soal dan bagaimana cara menggunakannya?", a: "Bank Soal adalah kumpulan ribuan soal latihan berdasarkan mapel dan topik. Buka Pusat Belajar → tab Bank Soal → pilih mapel dan mulai latihan kapan saja sesuai kebutuhan." },
  { q: "Apakah ada fitur pengingat belajar harian?", a: "Ya, kamu bisa mengaktifkan notifikasi pengingat dari menu Pengaturan Akun. Atur waktu dan frekuensi pengingat sesuai jadwal belajarmu." },
];

// ─── SHARED COMPONENTS ───────────────────────────────────────────────────────

const tagColors = {
  UTBK: "rgba(25,157,233,0.85)",
  SMA: "rgba(124,58,237,0.85)",
  SMP: "rgba(22,163,74,0.85)",
};

function ClassCard({ card, showProgress = false }) {
  return (
    <div style={{
      position: "relative", flexShrink: 0, width: 148, height: 190,
      borderRadius: 14, overflow: "hidden", cursor: "pointer",
      boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
      transition: "transform 0.18s, box-shadow 0.18s",
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.2)" }}
      onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.12)" }}
    >
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `url(${card.img})`,
        backgroundSize: "cover",
        backgroundPosition: "center"
      }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.9) 35%, rgba(0,0,0,0.4) 70%, rgba(0,0,0,0.1) 100%)" }} />
      {card.badge && <div style={{ position: "absolute", top: 10, right: 10, fontSize: 9, fontWeight: 700, background: "#22c55e", color: "#fff", padding: "3px 8px", borderRadius: 20 }}>{card.badge}</div>}
      {showProgress && <div style={{ position: "absolute", top: 10, left: 10, fontSize: 9, fontWeight: 700, background: "rgba(0,0,0,0.45)", color: "#fff", padding: "2px 7px", borderRadius: 10, backdropFilter: "blur(4px)" }}>{card.pct}%</div>}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "10px 12px 14px" }}>
        <div style={{ display: "inline-block", fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 4, marginBottom: 5, background: tagColors[card.tag] || tagColors.UTBK, color: "#fff" }}>{card.tag}</div>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#fff", lineHeight: 1.3, marginBottom: 3 }}>{card.name}</div>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.75)" }}>{showProgress ? card.chapter : card.instructor}</div>
      </div>
      {showProgress && (
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: "rgba(255,255,255,0.15)" }}>
          <div style={{ height: "100%", width: `${card.pct}%`, background: "#38B6FF", borderRadius: "0 2px 0 0" }} />
        </div>
      )}
    </div>
  );
}

function ScrollRow({ cards, showProgress = false }) {
  const rowRef = useRef(null);
  const scroll = (dir) => rowRef.current?.scrollBy({ left: dir * 480, behavior: "smooth" });
  return (
    <div style={{ position: "relative" }}>
      <button className="scroll-btn" onClick={() => scroll(-1)} style={{ position: "absolute", top: "50%", transform: "translateY(-56%)", left: -14, width: 28, height: 28, borderRadius: "50%", background: "#fff", border: "0.5px solid #d6d6d6", alignItems: "center", justifyContent: "center", cursor: "pointer", zIndex: 2, boxShadow: "0 1px 4px rgba(0,0,0,0.10)" }}>‹</button>
      <div ref={rowRef} style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 8, scrollBehavior: "smooth", scrollbarWidth: "thin" }}>
        {cards.map((c, i) => <ClassCard key={i} card={c} showProgress={showProgress} />)}
      </div>
      <button className="scroll-btn" onClick={() => scroll(1)} style={{ position: "absolute", top: "50%", transform: "translateY(-56%)", right: -14, width: 28, height: 28, borderRadius: "50%", background: "#fff", border: "0.5px solid #d6d6d6", alignItems: "center", justifyContent: "center", cursor: "pointer", zIndex: 2, boxShadow: "0 1px 4px rgba(0,0,0,0.10)" }}>›</button>
    </div>
  );
}

function SectionHeader({ title, seeAll = true }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
      <span style={{ fontSize: 14, fontWeight: 600, color: "#282828" }}>{title}</span>
      {seeAll && <span style={{ fontSize: 12, color: "#199DE9", cursor: "pointer" }}>Lihat semua ›</span>}
    </div>
  );
}

// ─── SIDEBAR ─────────────────────────────────────────────────────────────────
function Sidebar({ activePage, onNavigate }) {
  const [collapsed, setCollapsed] = useState(false);
  const navItems = [
    { key: "dashboard", icon: "⊞", label: "Dashboard" },
    { key: "pusat-belajar", icon: "📚", label: "Pusat Belajar" },
    { key: "bantuan", icon: "🎧", label: "Bantuan" },
  ];
  return (
    <aside className={`sidebar${collapsed ? " collapsed" : ""}`} style={{
      width: collapsed ? 56 : 176,
      minWidth: collapsed ? 56 : 176,
      background: "#fff", borderRight: "0.5px solid #e0e0e0",
      display: "flex", flexDirection: "column", padding: "20px 0", height: "100%",
      transition: "width 0.2s",
    }}>
      <div className="logo" style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 16px 24px", justifyContent: collapsed ? "center" : "flex-start" }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: "#199DE9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: "#fff", flexShrink: 0 }}>P</div>
        {!collapsed && <span className="logo-text" style={{ fontSize: 14, fontWeight: 700, color: "#181818" }}>Pahamify</span>}
        <button className="btn-collapse" onClick={() => setCollapsed(!collapsed)} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "#7a7a7a", display: "flex", padding: 4 }}>
          <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <rect x={3} y={3} width={18} height={18} rx={2} />
            <line x1={9} y1={3} x2={9} y2={21} />
          </svg>
        </button>
      </div>
      {navItems.map(item => (
        <div key={item.key} className={`nav-item${activePage === item.key ? " active" : ""}`} onClick={() => onNavigate(item.key)} style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: collapsed ? "10px 0" : "10px 16px",
          justifyContent: collapsed ? "center" : "flex-start",
          fontSize: 13, cursor: "pointer",
          color: activePage === item.key ? "#199DE9" : "#7a7a7a",
          fontWeight: activePage === item.key ? 600 : 400,
          background: activePage === item.key ? "#EEF9FF" : "transparent",
          borderRight: collapsed ? "3px solid transparent" : activePage === item.key ? "3px solid #199DE9" : "3px solid transparent",
          transition: "background 0.15s",
        }}>
          <span style={{ fontSize: 18 }}>{item.icon}</span>
          {!collapsed && <span className="nav-label">{item.label}</span>}
        </div>
      ))}
      <div style={{ marginTop: "auto", padding: "12px 16px", borderTop: "0.5px solid #e0e0e0", display: "flex", alignItems: "center", gap: 8, justifyContent: collapsed ? "center" : "flex-start" }}>
        <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#D5F0FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, color: "#199DE9", flexShrink: 0 }}>AR</div>
        {!collapsed && <span className="user-name" style={{ fontSize: 12, fontWeight: 500, color: "#383838" }}>Andi Rizky</span>}
      </div>
    </aside>
  );
}

// ─── BOTTOM NAV (mobile only) ─────────────────────────────────────────────────
function BottomNav({ activePage, onNavigate }) {
  const items = [
    { key: "dashboard", icon: "⊞", label: "Dashboard" },
    { key: "pusat-belajar", icon: "📚", label: "Belajar" },
    { key: "bantuan", icon: "🎧", label: "Bantuan" },
  ];
  return (
    <nav className="bottom-nav">
      {items.map(item => (
        <div key={item.key} onClick={() => onNavigate(item.key)} style={{
          display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
          cursor: "pointer", flex: 1, padding: "8px 0",
          fontSize: 10, fontWeight: activePage === item.key ? 600 : 400,
          color: activePage === item.key ? "#199DE9" : "#7a7a7a",
        }}>
          <span style={{ fontSize: 20 }}>{item.icon}</span>
          {item.label}
        </div>
      ))}
    </nav>
  );
}

// ─── TOPBAR ───────────────────────────────────────────────────────────────────
function Topbar({ title, placeholder = "Mau belajar apa hari ini?" }) {
  return (
    <div className="topbar" style={{ background: "#fff", borderBottom: "0.5px solid #e0e0e0", padding: "0 24px", height: 56, display: "flex", alignItems: "center", gap: 16, flexShrink: 0 }}>
      <span style={{ fontSize: 15, fontWeight: 600, color: "#181818", whiteSpace: "nowrap" }}>{title}</span>
      <div style={{ flex: 1, maxWidth: 480, position: "relative" }}>
        <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#7a7a7a", fontSize: 14 }}>🔍</span>
        <input style={{ width: "100%", height: 36, border: "0.5px solid #d6d6d6", borderRadius: 20, padding: "0 12px 0 36px", fontSize: 13, fontFamily: "'Poppins',sans-serif", background: "#f7f9fc", color: "#181818", outline: "none" }} placeholder={placeholder} />
      </div>
      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 36, height: 36, borderRadius: "50%", border: "0.5px solid #e0e0e0", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 16 }}>🔔</div>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#D5F0FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, color: "#199DE9" }}>AR</div>
      </div>
    </div>
  );
}

// ─── DASHBOARD PAGE ───────────────────────────────────────────────────────────
function DashboardPage() {
  const [toTab, setToTab] = useState("saintek");
  const [bsTab, setBsTab] = useState("semua");
  const toData = tryoutData[toTab];
  const bsData = banksoalData[bsTab];
  const streakDays = [
    { label: "Sen", active: true }, { label: "Sel", active: true }, { label: "Rab", active: true },
    { label: "Kam ✦", active: true, today: true }, { label: "Jum", active: false },
    { label: "Sab", active: false }, { label: "Min", active: false },
  ];

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Streak */}
      <div style={{ background: "#fff", borderRadius: 14, border: "0.5px solid #e8e8e8", padding: "16px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#282828" }}>🔥 Day Streak</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#199DE9" }}>4 hari berturut-turut 🔥</span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {streakDays.map((d, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, flex: 1 }}>
              <span style={{ fontSize: 10, color: d.today ? "#199DE9" : "#7a7a7a", fontWeight: d.today ? 600 : 500 }}>{d.label}</span>
              <span style={{ fontSize: 20, lineHeight: 1, filter: d.active ? "none" : "grayscale(1) opacity(0.3)" }}>🔥</span>
            </div>
          ))}
        </div>
      </div>

      {/* Charts */}
      <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* TryOut */}
        <div style={{ background: "#fff", borderRadius: 14, border: "0.5px solid #e8e8e8", padding: "16px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#282828" }}>TryOut UTBK</span>
            <span style={{ fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 6, background: "#EEF9FF", color: "#199DE9" }}>12 sesi</span>
          </div>
          <div style={{ fontSize: 11, color: "#7a7a7a", marginBottom: 14 }}>Perkembangan nilai per sesi tryout</div>
          <div style={{ display: "flex", gap: 0, marginBottom: 12, border: "0.5px solid #e0e0e0", borderRadius: 8, overflow: "hidden", width: "fit-content" }}>
            {["saintek", "soshum"].map(k => (
              <button key={k} onClick={() => setToTab(k)} style={{ fontSize: 11, fontFamily: "'Poppins',sans-serif", fontWeight: 500, padding: "5px 14px", border: "none", cursor: "pointer", background: toTab === k ? "#199DE9" : "#fff", color: toTab === k ? "#fff" : "#7a7a7a", transition: "all 0.15s" }}>
                {k === "saintek" ? "Saintek" : "Soshum"}
              </button>
            ))}
          </div>
          <div style={{ height: 120 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={toChartData(toData.vals)} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#aaa" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fill: "#aaa" }} axisLine={false} tickLine={false} tickCount={4} />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                <Line type="monotone" dataKey="value" stroke="#199DE9" strokeWidth={2} dot={{ r: 3, fill: "#199DE9" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
            {[{ l: "Nilai terakhir", v: toData.last }, { l: "Tertinggi", v: toData.high }, { l: "Rata-rata", v: toData.avg }].map((s, i) => (
              <div key={i} style={{ flex: 1, background: "#f7f9fc", borderRadius: 8, padding: "8px 10px" }}>
                <div style={{ fontSize: 10, color: "#7a7a7a", marginBottom: 2 }}>{s.l}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#199DE9" }}>{s.v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bank Soal */}
        <div style={{ background: "#fff", borderRadius: 14, border: "0.5px solid #e8e8e8", padding: "16px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#282828" }}>Bank Soal</span>
            <span style={{ fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 6, background: "#E8F5E9", color: "#2E7D32" }}>840 soal</span>
          </div>
          <div style={{ fontSize: 11, color: "#7a7a7a", marginBottom: 14 }}>Jumlah soal dikerjakan per bulan</div>
          <div style={{ display: "flex", gap: 0, marginBottom: 12, border: "0.5px solid #e0e0e0", borderRadius: 8, overflow: "hidden", width: "fit-content" }}>
            {["semua", "benar", "salah"].map(k => (
              <button key={k} onClick={() => setBsTab(k)} style={{ fontSize: 11, fontFamily: "'Poppins',sans-serif", fontWeight: 500, padding: "5px 14px", border: "none", cursor: "pointer", background: bsTab === k ? "#199DE9" : "#fff", color: bsTab === k ? "#fff" : "#7a7a7a", transition: "all 0.15s" }}>
                {k.charAt(0).toUpperCase() + k.slice(1)}
              </button>
            ))}
          </div>
          <div style={{ height: 120 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={toChartData(bsData.vals)} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#aaa" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fill: "#aaa" }} axisLine={false} tickLine={false} tickCount={4} />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                <Bar dataKey="value" fill="#199DE9BB" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
            {[{ l: "Total dikerjakan", v: bsData.total }, { l: "Benar", v: bsData.benar }, { l: "Akurasi", v: bsData.akurasi }].map((s, i) => (
              <div key={i} style={{ flex: 1, background: "#f7f9fc", borderRadius: 8, padding: "8px 10px" }}>
                <div style={{ fontSize: 10, color: "#7a7a7a", marginBottom: 2 }}>{s.l}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#2E7D32" }}>{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lanjutkan Belajar */}
      <div>
        <SectionHeader title="Lanjutkan Belajar" />
        <ScrollRow cards={lanjutkanCards} showProgress={true} />
      </div>
    </div>
  );
}

// ─── PUSAT BELAJAR PAGE ───────────────────────────────────────────────────────
function PusatBelajar() {
  const [subTab, setSubTab] = useState("Kelas");
  const subTabs = ["Kelas", "Bank Soal", "TryOut"];
  const sections = [
    { title: "Sains & Teknologi", cards: sainsCards },
    { title: "Bahasa", cards: bahasaCards },
    { title: "Sosial & Humaniora", cards: sosialCards },
  ];
  return (
    <>
      <div style={{ background: "#fff", borderBottom: "0.5px solid #e0e0e0", display: "flex", flexShrink: 0, overflowX: "auto" }}>
        {subTabs.map(t => (
          <div key={t} onClick={() => setSubTab(t)} style={{ padding: "13px 28px", fontSize: 13, fontWeight: subTab === t ? 600 : 400, color: subTab === t ? "#199DE9" : "#7a7a7a", cursor: "pointer", borderBottom: subTab === t ? "2px solid #199DE9" : "2px solid transparent", transition: "all 0.15s", whiteSpace: "nowrap" }}>
            {t}
          </div>
        ))}
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
        {sections.map(sec => (
          <div key={sec.title} style={{ marginBottom: 28 }}>
            <SectionHeader title={sec.title} />
            <ScrollRow cards={sec.cards} />
          </div>
        ))}
      </div>
    </>
  );
}

// ─── BANTUAN PAGE ─────────────────────────────────────────────────────────────
function Bantuan() {
  const [openFaq, setOpenFaq] = useState(0);
  const mentorList = [
    {
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      bg: "#E3F2FD",
      name: "Sari Dewi, M.Si",
      sub: "Fisika & Kimia",
      online: true,
      rating: "4.7"
    },
    {
      image: "https://randomuser.me/api/portraits/women/68.jpg",
      bg: "#FFF3E0",
      name: "Anita Kusuma, S.Pd",
      sub: "B. Indonesia & B. Inggris",
      online: false,
      rating: "4.9"
    },
    {
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      bg: "#FCE4EC",
      name: "Hendra Wijaya",
      sub: "Sejarah & Geografi",
      online: false,
      rating: "4.6"
    },
    {
      image: "https://randomuser.me/api/portraits/women/21.jpg",
      bg: "#EDE7F6",
      name: "Nadia Pratiwi, M.Pd",
      sub: "Sosiologi & PKN",
      online: true,
      rating: "4.8"
    }
  ];
  const contactChannels = [
    { icon: "💬", bg: "#E3F2FD", name: "Live Chat", sub: "Respons dalam ~2 menit" },
    { icon: "📱", bg: "#E8F5E9", name: "WhatsApp", sub: "+62 812-3456-7890" },
    { icon: "📧", bg: "#FFF3E0", name: "Email", sub: "support@pahamify.com" },
    { icon: "📖", bg: "#FCE4EC", name: "Pusat Bantuan", sub: "Artikel & panduan lengkap" },
  ];

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#282828", marginBottom: 12 }}>Mentor</div>
        <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {/* Featured mentor */}
          <div style={{ background: "#fff", borderRadius: 14, border: "0.5px solid #e8e8e8", padding: 20, display: "flex", gap: 16, alignItems: "flex-start" }}>
            <img
              src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&h=150&q=80"
              alt="Dr. Budi Santoso"
              style={{ width: 72, height: 72, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#181818", marginBottom: 2 }}>Dr. Budi Santoso</div>
              <div style={{ fontSize: 12, color: "#199DE9", fontWeight: 500, marginBottom: 6 }}>Mentor Matematika & Fisika</div>
              <div style={{ fontSize: 11, color: "#7a7a7a", lineHeight: 1.6, marginBottom: 10 }}>Pengajar berpengalaman 12 tahun, spesialis persiapan UTBK Saintek. Lulusan ITB jurusan Teknik Fisika.</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
                {["Matematika", "Fisika", "UTBK"].map(t => (
                  <span key={t} style={{ fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 6, background: "#EEF9FF", color: "#199DE9" }}>{t}</span>
                ))}
              </div>
              <div style={{ display: "flex", gap: 16 }}>
                {[{ v: "1.240", l: "Siswa" }, { v: "4.9 ★", l: "Rating" }, { v: "12 thn", l: "Pengalaman" }].map((s, i) => (
                  <div key={i} style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: "#181818" }}>{s.v}</span>
                    <span style={{ fontSize: 10, color: "#7a7a7a" }}>{s.l}</span>
                  </div>
                ))}
              </div>
              <button style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 14, background: "#199DE9", color: "#fff", fontSize: 12, fontWeight: 600, fontFamily: "'Poppins',sans-serif", padding: "8px 18px", borderRadius: 20, border: "none", cursor: "pointer" }}>
                💬 Diskusi Sekarang
              </button>
            </div>
          </div>
          {/* Mentor list */}
          <div style={{ background: "#fff", borderRadius: 14, border: "0.5px solid #e8e8e8", padding: "16px 20px" }}>
            {mentorList.map((m, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < mentorList.length - 1 ? "0.5px solid #f0f0f0" : "none", cursor: "pointer" }}>
                <img
                  src={m.image}
                  alt={m.name}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    objectFit: "cover",
                    flexShrink: 0
                  }}
                />
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#282828" }}>{m.name}</div>
                  <div style={{ fontSize: 11, color: "#7a7a7a" }}>{m.sub}</div>
                </div>
                <div style={{ marginLeft: "auto", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: m.online ? "#4CAF50" : "#d6d6d6" }} />
                  <div style={{ fontSize: 10, color: "#FF9800", fontWeight: 600 }}>★ {m.rating}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, alignItems: "start" }}>
        {/* FAQ */}
        <div style={{ background: "#fff", borderRadius: 14, border: "0.5px solid #e8e8e8", padding: "16px 20px" }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#282828", marginBottom: 4 }}>FAQ</div>
          {faqData.map((f, i) => (
            <div key={i} style={{ borderBottom: i < faqData.length - 1 ? "0.5px solid #f0f0f0" : "none" }}>
              <div onClick={() => setOpenFaq(openFaq === i ? -1 : i)} style={{ display: "flex", alignItems: "center", justifycontent: "space-between", padding: "12px 0", cursor: "pointer" }}>
                <span style={{ fontSize: 12, fontWeight: 500, color: openFaq === i ? "#199DE9" : "#282828", flex: 1, paddingRight: 8 }}>{f.q}</span>
                <span style={{ fontSize: 14, color: openFaq === i ? "#199DE9" : "#7a7a7a", transition: "transform 0.2s", transform: openFaq === i ? "rotate(180deg)" : "none", display: "inline-block" }}>⌄</span>
              </div>
              {openFaq === i && <div style={{ fontSize: 11, color: "#7a7a7a", lineHeight: 1.7, paddingBottom: 12 }}>{f.a}</div>}
            </div>
          ))}
        </div>

        {/* Hubungi Kami */}
        <div style={{ background: "#fff", borderRadius: 14, border: "0.5px solid #e8e8e8", padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#282828" }}>Hubungi Kami</div>
          <div style={{ fontSize: 11, color: "#7a7a7a", lineHeight: 1.6 }}>Butuh bantuan lebih lanjut? Tim support kami siap membantu kamu setiap hari pukul 08.00–22.00 WIB.</div>
          {contactChannels.map((c, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, background: c.bg, border: "0.5px solid #e8e8e8", cursor: "pointer", transition: "border-color 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "#38B6FF"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "#e8e8e8"}
            >
              <div style={{ width: 36, height: 36, borderRadius: 8, background: c.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{c.icon}</div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#282828" }}>{c.name}</div>
                <div style={{ fontSize: 10, color: "#7a7a7a" }}>{c.sub}</div>
              </div>
              <span style={{ marginLeft: "auto", color: "#c1c1c1", fontSize: 14 }}>›</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("dashboard");

  const pageTitles = {
    "dashboard": "Dashboard",
    "pusat-belajar": "Pusat Belajar",
    "bantuan": "Bantuan & Dukungan",
  };
  const searchPlaceholders = {
    "dashboard": "Mau belajar apa hari ini?",
    "pusat-belajar": "Mau belajar apa hari ini?",
    "bantuan": "Cari pertanyaan atau topik bantuan...",
  };

  return (
    <div style={{ fontFamily: "'Poppins',sans-serif", display: "flex", height: "100vh", minHeight: 700, background: "#f5f7fa", color: "#181818" }}>
      <style>{responsiveCSS}</style>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap" rel="stylesheet" />

      <Sidebar activePage={page} onNavigate={setPage} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
        <Topbar title={pageTitles[page]} placeholder={searchPlaceholders[page]} />
        {page === "dashboard" && <DashboardPage />}
        {page === "pusat-belajar" && <PusatBelajar />}
        {page === "bantuan" && <Bantuan />}
      </div>

      <BottomNav activePage={page} onNavigate={setPage} />
    </div>
  );
}