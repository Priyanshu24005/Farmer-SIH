import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Bell,
  CalendarPlus,
  ChevronRight,
  Clock,
  MapPin,
  Moon,
  PackageCheck,
  Sprout,
  Sun,
  User,
  Wallet,
  Wheat,
} from "lucide-react";
import useFarmerPreferences from "../../components/farmer/useFarmerPreferences";
import FarmerBottomNav from "../../components/farmer/FarmerBottomNav";
import { getFarmerProfile } from "../../components/farmer/farmerSession";
import {
  HAS_ACTIVE_TOKEN,
  mockActiveToken,
  mockRecentActivity,
  mockStats,
} from "../../components/farmer/dashboardData";
import "./farmerBase.css";
import "./farmerHome.css";

const COPY = {
  en: {
    brandSubtitle: "Kisan Mandi Portal",
    languageLabel: "Choose language",
    useDarkMode: "Use dark mode",
    useLightMode: "Use light mode",
    notifications: "Notifications",
    profile: "Profile",
    greeting: (name) => `Namaste, ${name} 👋`,
    welcomeBack: "Welcome back to Farmer-SIH",
    bookNewSlot: "Book New Slot",
    activeTokenTitle: "Your Active Token",
    statusWaiting: "Waiting",
    tokensAhead: (n) => `${n} tokens ahead`,
    estWait: (n) => `Est. wait ~${n} minutes`,
    viewLiveQueue: "View Live Queue",
    emptyTitle: "No active procurement slot",
    emptyText: "Book a slot to get your procurement token.",
    totalProcurements: "Total Procurements",
    pendingPayments: "Pending Payments",
    recentActivity: "Recent Activity",
    viewAll: "View All",
    activityTitles: {
      paymentReceived: "Payment received",
      procurementCompleted: "Procurement completed",
    },
    when: { today: "Today", date18Aug: "18 Aug 2026" },
    navLabel: "Farmer navigation",
    navHome: "Home",
    navBook: "Book Slot",
    navQueue: "Queue",
    navHistory: "History",
    navPayments: "Payments",
    farmerFallback: "Farmer",
  },
  hi: {
    brandSubtitle: "किसान मंडी पोर्टल",
    languageLabel: "भाषा चुनें",
    useDarkMode: "डार्क मोड का उपयोग करें",
    useLightMode: "लाइट मोड का उपयोग करें",
    notifications: "सूचनाएं",
    profile: "प्रोफ़ाइल",
    greeting: (name) => `नमस्ते, ${name} 👋`,
    welcomeBack: "फार्मर-एसआईएच में आपका पुनः स्वागत है",
    bookNewSlot: "नया स्लॉट बुक करें",
    activeTokenTitle: "आपका सक्रिय टोकन",
    statusWaiting: "प्रतीक्षारत",
    tokensAhead: (n) => `${n} टोकन आगे`,
    estWait: (n) => `अनुमानित प्रतीक्षा ~${n} मिनट`,
    viewLiveQueue: "लाइव कतार देखें",
    emptyTitle: "कोई सक्रिय खरीद स्लॉट नहीं",
    emptyText: "अपना खरीद टोकन पाने के लिए स्लॉट बुक करें।",
    totalProcurements: "कुल खरीद",
    pendingPayments: "लंबित भुगतान",
    recentActivity: "हाल की गतिविधि",
    viewAll: "सभी देखें",
    activityTitles: {
      paymentReceived: "भुगतान प्राप्त हुआ",
      procurementCompleted: "खरीद पूर्ण हुई",
    },
    when: { today: "आज", date18Aug: "18 अग 2026" },
    navLabel: "किसान नेविगेशन",
    navHome: "होम",
    navBook: "स्लॉट बुक करें",
    navQueue: "कतार",
    navHistory: "इतिहास",
    navPayments: "भुगतान",
    farmerFallback: "किसान",
  },
};

function formatInr(value) {
  return `₹${value.toLocaleString("en-IN")}`;
}

export default function FarmerHome() {
  const { language, setLanguage, theme, toggleTheme } = useFarmerPreferences();
  const navigate = useNavigate();
  const copy = COPY[language] || COPY.en;

  // Real authenticated data source: profile cached from the /auth/register|login
  // response. Falls back to a neutral label if not present.
  const profile = useMemo(() => getFarmerProfile(), []);
  const firstName = (profile?.name || "").trim().split(" ")[0] || copy.farmerFallback;

  const nextThemeLabel = theme === "dark" ? copy.useLightMode : copy.useDarkMode;
  const t = mockActiveToken;

  return (
    <div className={`farmer-welcome farmer-welcome--${theme} farmer-home`} lang={language === "hi" ? "hi" : "en"}>
      {/* Header */}
      <header className="farmer-header">
        <div className="farmer-shell farmer-header__inner">
          <span className="farmer-brand">
            <span className="farmer-brand__mark" aria-hidden="true">
              <Sprout size={21} strokeWidth={2.35} />
            </span>
            <span>
              <strong>Farmer-SIH</strong>
              <span className="farmer-brand__subtitle">{copy.brandSubtitle}</span>
            </span>
          </span>

          <div className="farmer-header__controls">
            <div className="farmer-language-toggle" role="group" aria-label={copy.languageLabel}>
              <button type="button" className={language === "en" ? "is-active" : ""} aria-pressed={language === "en"} onClick={() => setLanguage("en")}>English</button>
              <span aria-hidden="true">|</span>
              <button type="button" className={language === "hi" ? "is-active" : ""} aria-pressed={language === "hi"} onClick={() => setLanguage("hi")}>हिंदी</button>
            </div>
            <button type="button" className="farmer-theme-toggle" onClick={toggleTheme} aria-label={nextThemeLabel} title={nextThemeLabel}>
              {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
            </button>
            <button type="button" className="farmer-home__icon-btn" aria-label={copy.notifications} onClick={() => navigate("/farmer/notifications")}>
              <Bell size={18} />
              <span className="farmer-home__dot" aria-hidden="true" />
            </button>
            <button type="button" className="farmer-home__avatar" aria-label={copy.profile} onClick={() => navigate("/farmer/profile")}>
              <User size={18} />
            </button>
          </div>
        </div>
      </header>

      <main className="farmer-shell farmer-home__main" id="farmer-home-main">
        {/* Greeting */}
        <section className="farmer-home__greeting">
          <h1>{copy.greeting(firstName)}</h1>
          <p>{copy.welcomeBack}</p>
        </section>

        {/* Primary CTA */}
        <button type="button" className="farmer-primary-cta farmer-home__cta" onClick={() => navigate("/farmer/book")}>
          <CalendarPlus size={19} aria-hidden="true" />
          <span>{copy.bookNewSlot}</span>
        </button>

        {/* Active token OR empty state */}
        {HAS_ACTIVE_TOKEN ? (
          <section className="farmer-home__token" aria-labelledby="active-token-title">
            <div className="farmer-home__token-head">
              <h2 id="active-token-title">{copy.activeTokenTitle}</h2>
              <span className="farmer-home__status" data-status={t.status}>
                <span className="farmer-home__status-dot" aria-hidden="true" />
                {copy.statusWaiting}
              </span>
            </div>

            <div className="farmer-home__token-number">#{t.tokenNumber}</div>

            <ul className="farmer-home__token-meta">
              <li><MapPin size={16} aria-hidden="true" /><span>{t.mandiName}</span></li>
              <li><Wheat size={16} aria-hidden="true" /><span>{t.crop}</span></li>
              <li><CalendarPlus size={16} aria-hidden="true" /><span>{t.date}</span></li>
            </ul>

            <div className="farmer-home__token-wait">
              <span className="farmer-home__ahead">{copy.tokensAhead(t.tokensAhead)}</span>
              <span className="farmer-home__wait-time"><Clock size={15} aria-hidden="true" /> {copy.estWait(t.estimatedWaitMinutes)}</span>
            </div>

            <button type="button" className="farmer-home__secondary" onClick={() => navigate("/farmer/queue")}>
              <span>{copy.viewLiveQueue}</span>
              <ArrowRight size={17} aria-hidden="true" />
            </button>
          </section>
        ) : (
          <section className="farmer-home__empty" aria-labelledby="empty-token-title">
            <span className="farmer-home__empty-icon" aria-hidden="true"><PackageCheck size={26} /></span>
            <h2 id="empty-token-title">{copy.emptyTitle}</h2>
            <p>{copy.emptyText}</p>
            <button type="button" className="farmer-primary-cta farmer-home__cta" onClick={() => navigate("/farmer/book")}>
              <CalendarPlus size={19} aria-hidden="true" />
              <span>{copy.bookNewSlot}</span>
            </button>
          </section>
        )}

        {/* Quick stats */}
        <section className="farmer-home__stats" aria-label={`${copy.totalProcurements}, ${copy.pendingPayments}`}>
          <div className="farmer-home__stat">
            <span className="farmer-home__stat-icon" aria-hidden="true"><PackageCheck size={20} /></span>
            <span className="farmer-home__stat-value">{mockStats.totalProcurements}</span>
            <span className="farmer-home__stat-label">{copy.totalProcurements}</span>
          </div>
          <div className="farmer-home__stat">
            <span className="farmer-home__stat-icon farmer-home__stat-icon--amber" aria-hidden="true"><Wallet size={20} /></span>
            <span className="farmer-home__stat-value">{formatInr(mockStats.pendingPaymentsInr)}</span>
            <span className="farmer-home__stat-label">{copy.pendingPayments}</span>
          </div>
        </section>

        {/* Recent activity */}
        <section className="farmer-home__activity" aria-labelledby="recent-activity-title">
          <div className="farmer-home__activity-head">
            <h2 id="recent-activity-title">{copy.recentActivity}</h2>
            <button type="button" className="farmer-home__viewall" onClick={() => navigate("/farmer/history")}>
              <span>{copy.viewAll}</span>
              <ChevronRight size={16} aria-hidden="true" />
            </button>
          </div>
          <ul className="farmer-home__activity-list">
            {mockRecentActivity.map((item) => (
              <li key={item.id}>
                <span className={`farmer-home__activity-icon farmer-home__activity-icon--${item.type}`} aria-hidden="true">
                  {item.type === "payment" ? <Wallet size={18} /> : <PackageCheck size={18} />}
                </span>
                <span className="farmer-home__activity-body">
                  <strong>{copy.activityTitles[item.titleKey]}</strong>
                  <small>{language === "hi" ? item.detailHi : item.detail}</small>
                </span>
                <span className="farmer-home__activity-when">{copy.when[item.whenKey]}</span>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <FarmerBottomNav copy={copy} />
    </div>
  );
}
