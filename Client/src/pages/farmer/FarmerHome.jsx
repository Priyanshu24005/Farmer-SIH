import { useEffect, useMemo, useState } from "react";
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
import { getFarmerTokens, getMandiQueue } from "../../api/farmer/tokens";
import { getFarmerPayments } from "../../api/farmer/payments";
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
    welcomeBack: "Welcome back to KisanSetu",
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

function formatFarmerDate(value, language) {
  return value ? new Date(value).toLocaleDateString(language === "hi" ? "hi-IN" : "en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";
}

export default function FarmerHome() {
  const { language, setLanguage, theme, toggleTheme } = useFarmerPreferences();
  const navigate = useNavigate();
  const copy = COPY[language] || COPY.en;

  // Real authenticated data source: profile cached from the /auth/register|login
  // response. Falls back to a neutral label if not present.
  const profile = useMemo(() => getFarmerProfile(), []);
  const firstName = (profile?.name || "").trim().split(" ")[0] || copy.farmerFallback;
  const farmerId = profile?.id || profile?._id;
  const [dashboardState, setDashboardState] = useState("loading");
  const [activeToken, setActiveToken] = useState(null);
  const [tokens, setTokens] = useState([]);
  const [payments, setPayments] = useState([]);
  const [tokensAhead, setTokensAhead] = useState(null);

  useEffect(() => {
    let active = true;
    if (!farmerId) {
      setDashboardState("ready");
      return () => { active = false; };
    }
    Promise.all([getFarmerTokens(farmerId), getFarmerPayments(farmerId)])
      .then(async ([tokenResponse, paymentResponse]) => {
        if (!active) return;
        const tokenList = Array.isArray(tokenResponse) ? tokenResponse : tokenResponse?.tokens || [];
        const paymentList = Array.isArray(paymentResponse) ? paymentResponse : paymentResponse?.payments || [];
        const waitingToken = tokenList.find((token) => token.status === "waiting") || null;
        setTokens(tokenList);
        setPayments(paymentList);
        setActiveToken(waitingToken);
        if (waitingToken?.mandi?._id) {
          try {
            const queueResponse = await getMandiQueue(waitingToken.mandi._id);
            const queue = Array.isArray(queueResponse) ? queueResponse : queueResponse?.queue || [];
            if (active) setTokensAhead(queue.filter((token) => Number(token.tokenNumber) < Number(waitingToken.tokenNumber)).length);
          } catch {
            if (active) setTokensAhead(null);
          }
        }
        if (active) setDashboardState("ready");
      })
      .catch(() => active && setDashboardState("error"));
    return () => { active = false; };
  }, [farmerId]);

  const nextThemeLabel = theme === "dark" ? copy.useLightMode : copy.useDarkMode;
  const pendingPayments = payments.filter((payment) => payment.status === "pending");
  const pendingAmount = pendingPayments.reduce((sum, payment) => sum + (payment.amount || 0), 0);
  const recentActivity = useMemo(() => payments.slice(0, 3).map((payment) => ({
    id: payment._id,
    type: "payment",
    title: payment.status === "paid" ? copy.activityTitles.paymentReceived : copy.pendingPayments,
    detail: payment.amount != null ? formatInr(payment.amount) : copy.pendingPayments,
    when: formatFarmerDate(payment.createdAt, language),
  })), [copy.activityTitles.paymentReceived, copy.pendingPayments, language, payments]);

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
              <strong>KisanSetu</strong>
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
        {dashboardState === "loading" ? (
          <section className="farmer-home__token" aria-live="polite"><h2>{copy.activeTokenTitle}</h2><p>{copy.welcomeBack}...</p></section>
        ) : dashboardState === "error" ? (
          <section className="farmer-home__empty" aria-live="polite"><span className="farmer-home__empty-icon"><PackageCheck size={26} /></span><h2>{copy.emptyTitle}</h2><p>{copy.emptyText}</p></section>
        ) : activeToken ? (
          <section className="farmer-home__token" aria-labelledby="active-token-title">
            <div className="farmer-home__token-head">
              <h2 id="active-token-title">{copy.activeTokenTitle}</h2>
              <span className="farmer-home__status" data-status={activeToken.status}>
                <span className="farmer-home__status-dot" aria-hidden="true" />
                {activeToken.status || copy.statusWaiting}
              </span>
            </div>

            <div className="farmer-home__token-number">#{activeToken.tokenNumber}</div>

            <ul className="farmer-home__token-meta">
              <li><MapPin size={16} aria-hidden="true" /><span>{activeToken.mandi?.name || "Mandi not available"}</span></li>
              <li><CalendarPlus size={16} aria-hidden="true" /><span>{formatFarmerDate(activeToken.date, language)}</span></li>
            </ul>

            <div className="farmer-home__token-wait">
              <span className="farmer-home__ahead">{tokensAhead == null ? "—" : copy.tokensAhead(tokensAhead)}</span>
              <span className="farmer-home__wait-time"><Clock size={15} aria-hidden="true" /> {tokensAhead == null ? "—" : copy.estWait(tokensAhead * 3)}</span>
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
            <span className="farmer-home__stat-value">{tokens.filter((token) => token.status === "served").length}</span>
            <span className="farmer-home__stat-label">{copy.totalProcurements}</span>
          </div>
          <div className="farmer-home__stat">
            <span className="farmer-home__stat-icon farmer-home__stat-icon--amber" aria-hidden="true"><Wallet size={20} /></span>
            <span className="farmer-home__stat-value">{formatInr(pendingAmount)}</span>
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
            {recentActivity.length === 0 && <li><span className="farmer-home__activity-body"><small>{copy.emptyText}</small></span></li>}
            {recentActivity.map((item) => (
              <li key={item.id}>
                <span className={`farmer-home__activity-icon farmer-home__activity-icon--${item.type}`} aria-hidden="true">
                  {item.type === "payment" ? <Wallet size={18} /> : <PackageCheck size={18} />}
                </span>
                <span className="farmer-home__activity-body">
                  <strong>{item.title}</strong>
                  <small>{item.detail}</small>
                </span>
                <span className="farmer-home__activity-when">{item.when}</span>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <FarmerBottomNav copy={copy} />
    </div>
  );
}
