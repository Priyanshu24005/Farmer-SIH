import { createElement, useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Banknote,
  CalendarDays,
  Check,
  CircleAlert,
  Clock3,
  CreditCard,
  FileText,
  HelpCircle,
  Loader2,
  RefreshCw,
  Wallet,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import FarmerAuthHeader from "../../components/farmer/FarmerAuthHeader";
import FarmerBottomNav from "../../components/farmer/FarmerBottomNav";
import useFarmerPreferences from "../../components/farmer/useFarmerPreferences";
import {
  calculatePaymentSummary,
  getMockPayments,
} from "../../components/farmer/paymentData";
import "./farmerBase.css";
import "./farmerPayments.css";

const COPY = {
  en: {
    brandSubtitle: "Kisan Mandi Portal",
    homeLabel: "Farmer-SIH home",
    backLabel: "Back",
    languageLabel: "Choose language",
    useDarkMode: "Use dark mode",
    useLightMode: "Use light mode",
    title: "Payment Status",
    overview: "Payment Overview",
    totalPaid: "Total Paid",
    pending: "Pending",
    totalRecords: "Total Procurements",
    yourPayments: "Your Payments",
    procurement: "Procurement",
    amount: "Amount",
    paymentDate: "Payment Date",
    procurementDate: "Procurement Date",
    paymentMethod: "Payment Method",
    account: "A/C",
    paid: "Paid",
    paymentPending: "Payment Pending",
    paymentFailed: "Payment Failed",
    processing: "Processing",
    pendingMessage: "Your payment is being processed.",
    failedMessage: "We couldn't process this payment.",
    dbt: "Direct Benefit Transfer (DBT)",
    viewDetails: "View Details",
    getHelp: "Get Help",
    all: "All",
    filterPaid: "Paid",
    filterPending: "Pending",
    allCrops: "All Crops",
    cropOptions: { Wheat: "Wheat", Rice: "Rice", Maize: "Maize" },
    noPayments: "No payment records yet",
    noPaymentsText: "Payments from your procurements will appear here.",
    noResults: "No payments found",
    noResultsText: "Try a different filter.",
    clearFilters: "Clear Filters",
    bookSlot: "Book New Slot",
    loading: "Loading your payments...",
    errorTitle: "Couldn't load your payments",
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
    title: "भुगतान स्थिति",
    overview: "भुगतान अवलोकन",
    totalPaid: "कुल भुगतान",
    pending: "लंबित",
    totalRecords: "कुल खरीद",
    yourPayments: "आपके भुगतान",
    procurement: "खरीद",
    amount: "राशि",
    paymentDate: "भुगतान की तारीख",
    procurementDate: "खरीद की तारीख",
    paymentMethod: "भुगतान का तरीका",
    account: "खाता",
    paid: "भुगतान हो गया",
    paymentPending: "भुगतान लंबित",
    paymentFailed: "भुगतान विफल",
    processing: "प्रक्रिया में",
    pendingMessage: "आपका भुगतान प्रक्रिया में है।",
    failedMessage: "हम यह भुगतान पूरा नहीं कर सके।",
    dbt: "प्रत्यक्ष लाभ अंतरण (डीबीटी)",
    viewDetails: "विवरण देखें",
    getHelp: "सहायता लें",
    all: "सभी",
    filterPaid: "भुगतान हो गया",
    filterPending: "लंबित",
    allCrops: "सभी फसलें",
    cropOptions: { Wheat: "गेहूं", Rice: "चावल", Maize: "मक्का" },
    noPayments: "अभी कोई भुगतान रिकॉर्ड नहीं",
    noPaymentsText: "आपकी खरीद के भुगतान यहां दिखाई देंगे।",
    noResults: "कोई भुगतान नहीं मिला",
    noResultsText: "कोई दूसरा फ़िल्टर चुनें।",
    clearFilters: "फ़िल्टर साफ़ करें",
    bookSlot: "नया स्लॉट बुक करें",
    loading: "भुगतान लोड हो रहा है...",
    errorTitle: "भुगतान लोड नहीं हो सका",
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

const FILTERS = ["all", "paid", "pending"];

function formatAmount(amount) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

function statusContent(status, copy) {
  if (status === "pending") return { label: copy.paymentPending, icon: Clock3, className: "pending" };
  if (status === "failed") return { label: copy.paymentFailed, icon: CircleAlert, className: "failed" };
  return { label: copy.paid, icon: Check, className: "paid" };
}

function PaymentCard({ payment, copy, language, onOpen }) {
  const status = statusContent(payment.status, copy);
  const StatusIcon = status.icon;

  return (
    <button type="button" className="farmer-payments__card" onClick={() => onOpen(payment.id)}>
      <span className="farmer-payments__card-head">
        <span className="farmer-payments__card-label"><FileText size={15} /> {copy.procurement}</span>
        <span className={`farmer-payments__status farmer-payments__status--${status.className}`}>
          {createElement(StatusIcon, { size: 14, "aria-hidden": true })} {status.label}
        </span>
      </span>
      <strong className="farmer-payments__crop">{payment.crop}</strong>
      <span className="farmer-payments__mandi">{payment.mandi}</span>
      <span className="farmer-payments__date"><CalendarDays size={14} /> {payment.date}</span>

      <span className="farmer-payments__card-divider" />
      <span className="farmer-payments__amount-row"><span>{copy.amount}</span><strong>{formatAmount(payment.amount)}</strong></span>

      {payment.status === "paid" && (
        <span className="farmer-payments__payment-meta">
          <span><small>{copy.paymentDate}</small><b>{payment.paymentDate}</b></span>
          <span><small>{copy.paymentMethod}</small><b>{language === "hi" ? payment.methodHindi : payment.method}</b></span>
          <span><small>{copy.account}</small><b>{payment.account}</b></span>
        </span>
      )}
      {payment.status === "pending" && (
        <span className="farmer-payments__pending-message"><Clock3 size={15} /> {copy.pendingMessage}</span>
      )}
      {payment.status === "failed" && (
        <span className="farmer-payments__failed-message"><CircleAlert size={15} /> {copy.failedMessage}</span>
      )}

      <span className="farmer-payments__card-action">
        <span>{payment.status === "failed" ? copy.getHelp : copy.viewDetails}</span>
        <ArrowRight size={16} aria-hidden="true" />
      </span>
    </button>
  );
}

export default function FarmerPayments() {
  const { language, setLanguage, theme, toggleTheme } = useFarmerPreferences();
  const navigate = useNavigate();
  const copy = COPY[language] || COPY.en;
  const [payments, setPayments] = useState([]);
  const [filter, setFilter] = useState("all");
  const [cropFilter, setCropFilter] = useState("all");
  const [state, setState] = useState("loading");

  const loadPayments = () => {
    setState("loading");
    getMockPayments()
      .then((data) => {
        setPayments(data);
        setState("ready");
      })
      .catch(() => setState("error"));
  };

  useEffect(() => {
    loadPayments();
  }, []);

  const summary = useMemo(() => calculatePaymentSummary(payments), [payments]);
  const filteredPayments = useMemo(
    () => payments.filter((payment) => {
      const matchesStatus = filter === "all" || payment.status === filter;
      const matchesCrop = cropFilter === "all" || payment.crop === cropFilter;
      return matchesStatus && matchesCrop;
    }),
    [cropFilter, filter, payments]
  );

  const clearFilters = () => {
    setFilter("all");
    setCropFilter("all");
  };

  return (
    <div className={`farmer-welcome farmer-welcome--${theme} farmer-payments`} lang={language === "hi" ? "hi" : "en"}>
      <FarmerAuthHeader copy={copy} language={language} onLanguageChange={setLanguage} theme={theme} onThemeToggle={toggleTheme} backTo="/farmer" />

      <main className="farmer-shell farmer-payments__main" id="farmer-payments-main">
        <header className="farmer-payments__heading">
          <div>
            <p className="farmer-payments__eyebrow"><Wallet size={15} /> Farmer-SIH</p>
            <h1>{copy.title}</h1>
          </div>
          <span className="farmer-payments__heading-icon" aria-hidden="true"><Banknote size={23} /></span>
        </header>

        {state === "ready" && payments.length > 0 && (
          <section className="farmer-payments__overview" aria-labelledby="payment-overview-title">
            <div className="farmer-payments__overview-title"><span><Wallet size={17} /> {copy.overview}</span><CreditCard size={20} aria-hidden="true" /></div>
            <div className="farmer-payments__overview-grid">
              <div><small>{copy.totalPaid}</small><strong>{formatAmount(summary.totalPaid)}</strong></div>
              <div><small>{copy.pending}</small><strong>{formatAmount(summary.pending)}</strong></div>
              <div><small>{copy.totalRecords}</small><strong>{summary.totalRecords}</strong></div>
            </div>
          </section>
        )}

        <section className="farmer-payments__list-section" aria-labelledby="your-payments-title">
          <div className="farmer-payments__section-heading">
            <h2 id="your-payments-title">{copy.yourPayments}</h2>
            {state === "ready" && payments.length > 0 && <span>{summary.totalRecords}</span>}
          </div>

          {state === "ready" && payments.length > 0 && (
            <>
              <div className="farmer-payments__filters" role="group" aria-label={copy.yourPayments}>
                {FILTERS.map((filterValue) => {
                  const labels = { all: copy.all, paid: copy.filterPaid, pending: copy.filterPending };
                  return (
                    <button key={filterValue} type="button" className={filter === filterValue ? "is-active" : ""} aria-pressed={filter === filterValue} onClick={() => setFilter(filterValue)}>
                      {labels[filterValue]}
                    </button>
                  );
                })}
              </div>
              <label className="farmer-payments__crop-filter">
                <span>{copy.allCrops}</span>
                <select value={cropFilter} onChange={(event) => setCropFilter(event.target.value)}>
                  <option value="all">{copy.allCrops}</option>
                  {Object.entries(copy.cropOptions).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
              </label>
            </>
          )}

          {state === "loading" && (
            <div className="farmer-payments__loading" aria-live="polite">
              {[1, 2, 3].map((item) => <div className="farmer-payments__skeleton" key={item}><Loader2 size={19} /><span /><span /><span /></div>)}
            </div>
          )}

          {state === "error" && (
            <div className="farmer-payments__state"><CircleAlert size={27} /><h2>{copy.errorTitle}</h2><p>{copy.errorText}</p><button type="button" className="farmer-primary-cta" onClick={loadPayments}><RefreshCw size={17} /> {copy.retry}</button></div>
          )}

          {state === "ready" && payments.length === 0 && (
            <div className="farmer-payments__state"><Wallet size={27} /><h2>{copy.noPayments}</h2><p>{copy.noPaymentsText}</p><button type="button" className="farmer-primary-cta" onClick={() => navigate("/farmer/book")}><CalendarDays size={17} /> {copy.bookSlot}</button></div>
          )}

          {state === "ready" && payments.length > 0 && filteredPayments.length === 0 && (
            <div className="farmer-payments__state"><CircleAlert size={27} /><h2>{copy.noResults}</h2><p>{copy.noResultsText}</p><button type="button" className="farmer-payments__clear" onClick={clearFilters}>{copy.clearFilters}</button></div>
          )}

          {state === "ready" && filteredPayments.length > 0 && (
            <div className="farmer-payments__list">
              {filteredPayments.map((payment) => <PaymentCard key={payment.id} payment={payment} copy={copy} language={language} onOpen={(paymentId) => navigate(`/farmer/payment/${paymentId}`)} />)}
            </div>
          )}
        </section>
      </main>

      <FarmerBottomNav copy={copy} />
    </div>
  );
}