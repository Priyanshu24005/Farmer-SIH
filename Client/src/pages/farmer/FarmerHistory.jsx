import { useEffect, useMemo, useState } from "react";
import { ArrowRight, CalendarDays, ChevronRight, CircleAlert, Filter, RefreshCw, Sprout } from "lucide-react";
import { useNavigate } from "react-router-dom";
import FarmerAuthHeader from "../../components/farmer/FarmerAuthHeader";
import FarmerBottomNav from "../../components/farmer/FarmerBottomNav";
import useFarmerPreferences from "../../components/farmer/useFarmerPreferences";
import {
  getMockProcurementHistory,
  PROCUREMENT_HISTORY_CROPS,
} from "../../components/farmer/procurementHistoryData";
import "./farmerBase.css";
import "./farmerHistory.css";

const COPY = {
  en: {
    brandSubtitle: "Kisan Mandi Portal",
    homeLabel: "Farmer-SIH home",
    backLabel: "Back",
    languageLabel: "Choose language",
    useDarkMode: "Use dark mode",
    useLightMode: "Use light mode",
    title: "Procurement History",
    subtitle: "View your previous procurement transactions.",
    filters: "Filters",
    allDates: "All Dates",
    allCrops: "All Crops",
    dateOptions: ["All Dates", "August 2026", "July 2026"],
    cropOptions: { Wheat: "Wheat", Rice: "Rice", Maize: "Maize" },
    quantity: "Quantity",
    amount: "Amount",
    statusCompleted: "Completed",
    statusPending: "Payment Pending",
    noHistory: "No procurement history yet",
    noHistoryText: "Your completed procurements will appear here.",
    noResults: "No procurements found",
    noResultsText: "Try changing your filters.",
    clearFilters: "Clear Filters",
    bookSlot: "Book New Slot",
    loading: "Loading your history...",
    errorTitle: "Couldn't load your history",
    errorText: "Please try again.",
    retry: "Retry",
    navLabel: "Farmer navigation",
    navHome: "Home",
    navBook: "Book Slot",
    navQueue: "Queue",
    navHistory: "History",
    navPayments: "Payments",
  },
  hi: {
    brandSubtitle: "किसान मंडी पोर्टल",
    homeLabel: "फार्मर-एसआईएच होम",
    backLabel: "वापस",
    languageLabel: "भाषा चुनें",
    useDarkMode: "डार्क मोड का उपयोग करें",
    useLightMode: "लाइट मोड का उपयोग करें",
    title: "खरीद इतिहास",
    subtitle: "अपनी पिछली खरीद का विवरण देखें।",
    filters: "फ़िल्टर",
    allDates: "सभी तारीखें",
    allCrops: "सभी फसलें",
    dateOptions: ["सभी तारीखें", "अगस्त 2026", "जुलाई 2026"],
    cropOptions: { Wheat: "गेहूं", Rice: "चावल", Maize: "मक्का" },
    quantity: "मात्रा",
    amount: "राशि",
    statusCompleted: "पूर्ण",
    statusPending: "भुगतान लंबित",
    noHistory: "अभी कोई खरीद इतिहास नहीं",
    noHistoryText: "आपकी पूरी हुई खरीद यहां दिखाई देगी।",
    noResults: "कोई खरीद नहीं मिली",
    noResultsText: "अपने फ़िल्टर बदलकर देखें।",
    clearFilters: "फ़िल्टर हटाएं",
    bookSlot: "नया स्लॉट बुक करें",
    loading: "इतिहास लोड हो रहा है...",
    errorTitle: "इतिहास लोड नहीं हो सका",
    errorText: "कृपया पुनः प्रयास करें।",
    retry: "पुनः प्रयास करें",
    navLabel: "किसान नेविगेशन",
    navHome: "होम",
    navBook: "स्लॉट बुक करें",
    navQueue: "कतार",
    navHistory: "इतिहास",
    navPayments: "भुगतान",
  },
};

function formatAmount(amount) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

function getDateFilterValue(index) {
  return ["all", "2026-08", "2026-07"][index] || "all";
}

export default function FarmerHistory() {
  const { language, setLanguage, theme, toggleTheme } = useFarmerPreferences();
  const navigate = useNavigate();
  const copy = COPY[language] || COPY.en;
  const [records, setRecords] = useState([]);
  const [dateFilter, setDateFilter] = useState("all");
  const [cropFilter, setCropFilter] = useState("all");
  const [state, setState] = useState("loading");

  const loadHistory = () => {
    setState("loading");
    getMockProcurementHistory()
      .then((data) => {
        setRecords(data);
        setState("ready");
      })
      .catch(() => setState("error"));
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const filteredRecords = useMemo(
    () => records.filter((record) => {
      const matchesDate = dateFilter === "all" || record.dateValue.startsWith(dateFilter);
      const matchesCrop = cropFilter === "all" || record.crop === cropFilter;
      return matchesDate && matchesCrop;
    }),
    [cropFilter, dateFilter, records]
  );

  const clearFilters = () => {
    setDateFilter("all");
    setCropFilter("all");
  };

  return (
    <div className={`farmer-welcome farmer-welcome--${theme} farmer-history`} lang={language === "hi" ? "hi" : "en"}>
      <FarmerAuthHeader
        copy={copy}
        language={language}
        onLanguageChange={setLanguage}
        theme={theme}
        onThemeToggle={toggleTheme}
        backTo="/farmer"
      />

      <main className="farmer-shell farmer-history__main" id="farmer-history-main">
        <header className="farmer-history__heading">
          <div>
            <p className="farmer-history__eyebrow"><Sprout size={15} aria-hidden="true" /> Farmer-SIH</p>
            <h1>{copy.title}</h1>
            <p>{copy.subtitle}</p>
          </div>
          <span className="farmer-history__heading-icon" aria-hidden="true"><CalendarDays size={23} /></span>
        </header>

        <section className="farmer-history__filters" aria-label={copy.filters}>
          <div className="farmer-history__filter-title"><Filter size={16} aria-hidden="true" /> {copy.filters}</div>
          <label>
            <span>{copy.allDates}</span>
            <select value={dateFilter} onChange={(event) => setDateFilter(event.target.value)}>
              {copy.dateOptions.map((label, index) => <option key={label} value={getDateFilterValue(index)}>{label}</option>)}
            </select>
          </label>
          <label>
            <span>{copy.allCrops}</span>
            <select value={cropFilter} onChange={(event) => setCropFilter(event.target.value)}>
              <option value="all">{copy.allCrops}</option>
              {PROCUREMENT_HISTORY_CROPS.map((crop) => <option key={crop} value={crop}>{copy.cropOptions[crop]}</option>)}
            </select>
          </label>
        </section>

        {state === "loading" && (
          <div className="farmer-history__list" aria-live="polite" aria-label={copy.loading}>
            {[1, 2, 3].map((item) => <div className="farmer-history__skeleton" key={item}><span /><span /><span /><span /></div>)}
          </div>
        )}

        {state === "error" && (
          <section className="farmer-history__state" aria-live="polite">
            <span className="farmer-history__state-icon farmer-history__state-icon--error"><CircleAlert size={25} /></span>
            <h2>{copy.errorTitle}</h2>
            <p>{copy.errorText}</p>
            <button type="button" className="farmer-primary-cta" onClick={loadHistory}><RefreshCw size={17} /> {copy.retry}</button>
          </section>
        )}

        {state === "ready" && records.length === 0 && (
          <section className="farmer-history__state">
            <span className="farmer-history__state-icon"><Sprout size={25} /></span>
            <h2>{copy.noHistory}</h2>
            <p>{copy.noHistoryText}</p>
            <button type="button" className="farmer-primary-cta" onClick={() => navigate("/farmer/book")}><CalendarDays size={17} /> {copy.bookSlot}</button>
          </section>
        )}

        {state === "ready" && records.length > 0 && filteredRecords.length === 0 && (
          <section className="farmer-history__state">
            <span className="farmer-history__state-icon"><Filter size={25} /></span>
            <h2>{copy.noResults}</h2>
            <p>{copy.noResultsText}</p>
            <button type="button" className="farmer-history__clear" onClick={clearFilters}>{copy.clearFilters}</button>
          </section>
        )}

        {state === "ready" && filteredRecords.length > 0 && (
          <div className="farmer-history__list">
            {filteredRecords.map((record) => (
              <button type="button" className="farmer-history__card" key={record.id} onClick={() => navigate(`/farmer/procurement/${record.id}`)}>
                <span className="farmer-history__card-top"><span>{record.date}</span><ChevronRight size={19} aria-hidden="true" /></span>
                <strong className="farmer-history__mandi">{record.mandi}</strong>
                <span className="farmer-history__crop"><Sprout size={15} aria-hidden="true" /> {record.crop}</span>
                <span className="farmer-history__card-details">
                  <span><small>{copy.quantity}</small><b>{record.quantity}</b></span>
                  <span><small>{copy.amount}</small><b>{formatAmount(record.amount)}</b></span>
                  <span className={`farmer-history__status farmer-history__status--${record.status}`}><small>{record.status === "completed" ? copy.statusCompleted : copy.statusPending}</small></span>
                </span>
                <span className="farmer-history__details-link">{language === "hi" ? "विवरण देखें" : "View details"} <ArrowRight size={15} aria-hidden="true" /></span>
              </button>
            ))}
          </div>
        )}
      </main>

      <FarmerBottomNav copy={copy} />
    </div>
  );
}