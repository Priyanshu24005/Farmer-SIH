import { createElement, useMemo } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Banknote,
  CalendarDays,
  Check,
  ChevronRight,
  CircleAlert,
  FileCheck2,
  MapPin,
  PackageCheck,
  Receipt,
  Sprout,
  Wheat,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import FarmerAuthHeader from "../../components/farmer/FarmerAuthHeader";
import FarmerBottomNav from "../../components/farmer/FarmerBottomNav";
import useFarmerPreferences from "../../components/farmer/useFarmerPreferences";
import {
  getMockProcurementDetails,
  PROCUREMENT_DETAIL_STATUSES,
} from "../../components/farmer/procurementDetailsData";
import "./farmerBase.css";
import "./farmerProcurementDetails.css";

const COPY = {
  en: {
    brandSubtitle: "Kisan Mandi Portal",
    homeLabel: "Farmer-SIH home",
    backLabel: "Back",
    languageLabel: "Choose language",
    useDarkMode: "Use dark mode",
    useLightMode: "Use light mode",
    title: "Procurement Details",
    statusView: "Status view",
    completed: "Completed",
    pending: "Pending",
    cancelled: "Cancelled",
    procurementCompleted: "Procurement Completed",
    procurementPending: "Payment Pending",
    procurementCancelled: "Procurement Cancelled",
    verifiedNote: "Weighment and quality inspection verified by Meerut Mandi in-charge.",
    completedBadge: "Completed",
    govtMsp: "Govt MSP Assured",
    token: "Token",
    date: "Date",
    crop: "Crop",
    grade: "Grade",
    quantity: "Quantity",
    amount: "Amount",
    quintals: "Quintals",
    perQuintal: "/ Qt",
    receiptAvailable: "Digital E-Receipt Available",
    viewReceipt: "View Receipt",
    details: "Procurement Details",
    procurementDate: "Procurement Date",
    mandiCentre: "Mandi Centre",
    location: "Location",
    cropName: "Crop Name",
    acceptedQuantity: "Accepted Quantity",
    tokenNumber: "Token Number",
    qualityGrade: "Quality Grade",
    passed: "Passed",
    procurementStatus: "Procurement Status",
    paymentStatus: "Payment Status",
    paid: "PAID",
    disbursedAmount: "Disbursed Amount",
    paymentDate: "Payment Date",
    paymentMethod: "Payment Method",
    account: "A/C",
    viewPayment: "View Payment Details",
    mandiLocation: "Mandi Location",
    viewLocation: "View Location",
    locationStatus: "Procurement centre location",
    notFound: "Procurement record not found",
    notFoundText: "This procurement record is unavailable.",
    backToHistory: "Back to History",
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
    title: "खरीद विवरण",
    statusView: "स्थिति देखें",
    completed: "पूर्ण",
    pending: "लंबित",
    cancelled: "रद्द",
    procurementCompleted: "खरीद पूरी हुई",
    procurementPending: "भुगतान लंबित",
    procurementCancelled: "खरीद रद्द हुई",
    verifiedNote: "मेरठ मंडी प्रभारी ने वजन और गुणवत्ता जांच की पुष्टि की है।",
    completedBadge: "पूर्ण",
    govtMsp: "सरकारी एमएसपी सुनिश्चित",
    token: "टोकन",
    date: "तारीख",
    crop: "फसल",
    grade: "ग्रेड",
    quantity: "मात्रा",
    amount: "राशि",
    quintals: "क्विंटल",
    perQuintal: "/ क्विंटल",
    receiptAvailable: "डिजिटल ई-रसीद उपलब्ध है",
    viewReceipt: "रसीद देखें",
    details: "खरीद विवरण",
    procurementDate: "खरीद की तारीख",
    mandiCentre: "मंडी केंद्र",
    location: "स्थान",
    cropName: "फसल का नाम",
    acceptedQuantity: "स्वीकृत मात्रा",
    tokenNumber: "टोकन नंबर",
    qualityGrade: "गुणवत्ता ग्रेड",
    passed: "पास",
    procurementStatus: "खरीद स्थिति",
    paymentStatus: "भुगतान स्थिति",
    paid: "भुगतान हुआ",
    disbursedAmount: "जारी राशि",
    paymentDate: "भुगतान की तारीख",
    paymentMethod: "भुगतान का तरीका",
    account: "खाता",
    viewPayment: "भुगतान विवरण देखें",
    mandiLocation: "मंडी का स्थान",
    viewLocation: "स्थान देखें",
    locationStatus: "खरीद केंद्र का स्थान",
    notFound: "खरीद रिकॉर्ड नहीं मिला",
    notFoundText: "यह खरीद रिकॉर्ड उपलब्ध नहीं है।",
    backToHistory: "इतिहास पर जाएं",
    navLabel: "किसान नेविगेशन",
    navHome: "होम",
    navBook: "स्लॉट बुक करें",
    navQueue: "कतार",
    navHistory: "इतिहास",
    navPayments: "भुगतान",
  },
};

const STATUS_LABEL_KEYS = {
  completed: "completed",
  pending: "pending",
  cancelled: "cancelled",
};

function DetailRow({ icon: Icon, label, value, extra }) {
  return (
    <div className="farmer-procurement-details__row">
      <span className="farmer-procurement-details__row-icon" aria-hidden="true">{createElement(Icon, { size: 17 })}</span>
      <span className="farmer-procurement-details__row-label">{label}</span>
      <span className="farmer-procurement-details__row-value">{value}{extra && <small>{extra}</small>}</span>
    </div>
  );
}

function Metric({ label, value, secondary, icon: Icon }) {
  return (
    <div className="farmer-procurement-details__metric">
      <span className="farmer-procurement-details__metric-icon" aria-hidden="true">{createElement(Icon, { size: 18 })}</span>
      <span className="farmer-procurement-details__metric-label">{label}</span>
      <strong>{value}</strong>
      <small>{secondary}</small>
    </div>
  );
}

export default function FarmerProcurementDetails() {
  const { language, setLanguage, theme, toggleTheme } = useFarmerPreferences();
  const { id } = useParams();
  const navigate = useNavigate();
  const copy = COPY[language] || COPY.en;
  const record = useMemo(() => getMockProcurementDetails(id), [id]);

  const statusLabels = {
    completed: copy.completed,
    pending: copy.pending,
    cancelled: copy.cancelled,
  };

  if (!record) {
    return (
      <div className={`farmer-welcome farmer-welcome--${theme} farmer-procurement-details`} lang={language === "hi" ? "hi" : "en"}>
        <FarmerAuthHeader copy={copy} language={language} onLanguageChange={setLanguage} theme={theme} onThemeToggle={toggleTheme} backTo="/farmer/history" />
        <main className="farmer-shell farmer-procurement-details__not-found">
          <span className="farmer-procurement-details__not-found-icon"><CircleAlert size={28} /></span>
          <h1>{copy.notFound}</h1>
          <p>{copy.notFoundText}</p>
          <button type="button" className="farmer-primary-cta" onClick={() => navigate("/farmer/history")}>
            <ArrowRight size={17} /> {copy.backToHistory}
          </button>
        </main>
      </div>
    );
  }

  const statusTitle = record.status === "completed"
    ? copy.procurementCompleted
    : record.status === "pending" ? copy.procurementPending : copy.procurementCancelled;

  return (
    <div className={`farmer-welcome farmer-welcome--${theme} farmer-procurement-details`} lang={language === "hi" ? "hi" : "en"}>
      <FarmerAuthHeader copy={copy} language={language} onLanguageChange={setLanguage} theme={theme} onThemeToggle={toggleTheme} backTo="/farmer/history" />

      <main className="farmer-shell farmer-procurement-details__main" id="farmer-procurement-details-main">
        <header className="farmer-procurement-details__heading">
          <div>
            <p className="farmer-procurement-details__eyebrow"><Receipt size={15} aria-hidden="true" /> Farmer-SIH</p>
            <h1>{copy.title}</h1>
          </div>
          <span className="farmer-procurement-details__heading-icon" aria-hidden="true"><FileCheck2 size={23} /></span>
        </header>

        <section className="farmer-procurement-details__status-view" aria-label={copy.statusView}>
          <span>{copy.statusView}</span>
          <div role="group" aria-label={copy.statusView}>
            {PROCUREMENT_DETAIL_STATUSES.map((status) => (
              <span key={status} className={`farmer-procurement-details__status-option ${record.status === status ? "is-active" : ""}`}>
                {record.status === status && <Check size={13} aria-hidden="true" />}
                {statusLabels[STATUS_LABEL_KEYS[status]]}
              </span>
            ))}
          </div>
        </section>

        <section className={`farmer-procurement-details__complete farmer-procurement-details__complete--${record.status}`}>
          <span className="farmer-procurement-details__complete-icon" aria-hidden="true"><Check size={21} /></span>
          <div>
            <h2>{statusTitle}</h2>
            <p>{record.status === "completed" ? (language === "hi" ? copy.verifiedNote : record.verificationNote) : copy.verifiedNote}</p>
          </div>
          <span className="farmer-procurement-details__badge">{statusLabels[record.status]}</span>
        </section>

        <section className="farmer-procurement-details__summary" aria-labelledby="farmer-procurement-summary-title">
          <div className="farmer-procurement-details__summary-head">
            <div>
              <p>{copy.token}</p>
              <strong id="farmer-procurement-summary-title">#{record.tokenNumber}</strong>
            </div>
            <span className="farmer-procurement-details__trust"><BadgeCheck size={16} /> {copy.govtMsp}</span>
          </div>
          <div className="farmer-procurement-details__summary-date"><CalendarDays size={16} /> <span>{copy.date}: <strong>{record.date}</strong></span></div>
          <div className="farmer-procurement-details__metrics">
            <Metric label={copy.crop} value={record.crop} secondary={record.cropHindi} icon={Wheat} />
            <Metric label={copy.quantity} value={record.quantityKg} secondary={record.quantityQuintals} icon={PackageCheck} />
            <Metric label={copy.amount} value={record.amount} secondary={record.rate} icon={Banknote} />
          </div>
          <div className="farmer-procurement-details__grade"><span>{copy.grade}</span><strong>{record.grade}</strong></div>
        </section>

        <section className="farmer-procurement-details__receipt" aria-label={copy.receiptAvailable}>
          <span className="farmer-procurement-details__receipt-icon" aria-hidden="true"><Receipt size={19} /></span>
          <strong>{copy.receiptAvailable}</strong>
          <button type="button" onClick={() => undefined}>{copy.viewReceipt}</button>
        </section>

        <div className="farmer-procurement-details__columns">
          <section className="farmer-procurement-details__card" aria-labelledby="procurement-details-card-title">
            <h2 id="procurement-details-card-title"><FileCheck2 size={18} /> {copy.details}</h2>
            <DetailRow icon={CalendarDays} label={copy.procurementDate} value={record.date} />
            <DetailRow icon={MapPin} label={copy.mandiCentre} value={record.mandi} />
            <DetailRow icon={MapPin} label={copy.location} value={record.location} />
            <DetailRow icon={Wheat} label={copy.cropName} value={`${record.crop} (${record.cropHindi})`} />
            <DetailRow icon={PackageCheck} label={copy.acceptedQuantity} value={record.acceptedQuantity} />
            <DetailRow icon={Receipt} label={copy.tokenNumber} value={`#${record.tokenNumber}`} />
            <DetailRow icon={BadgeCheck} label={copy.qualityGrade} value={record.grade.split(" (")[0]} extra={copy.passed} />
            <DetailRow icon={Check} label={copy.procurementStatus} value={statusLabels[record.status]} />
          </section>

          <section className="farmer-procurement-details__card farmer-procurement-details__payment" aria-labelledby="payment-status-title">
            <div className="farmer-procurement-details__card-title-row"><h2 id="payment-status-title"><Banknote size={18} /> {copy.paymentStatus}</h2><span><Check size={13} /> {copy.paid}</span></div>
            <div className="farmer-procurement-details__payment-amount">{record.amount}</div>
            <DetailRow icon={CalendarDays} label={copy.paymentDate} value={record.paymentDate} />
            <DetailRow icon={Banknote} label={copy.paymentMethod} value={record.paymentMethod} />
            <DetailRow icon={Banknote} label={copy.account} value={record.account} />
            <button type="button" className="farmer-procurement-details__outline-button" onClick={() => navigate("/farmer/payments")}>
              {copy.viewPayment} <ArrowRight size={16} />
            </button>
          </section>
        </div>

        <section className="farmer-procurement-details__card farmer-procurement-details__mandi" aria-labelledby="mandi-location-title">
          <div className="farmer-procurement-details__card-title-row"><h2 id="mandi-location-title"><MapPin size={18} /> {copy.mandiLocation}</h2><span className="farmer-procurement-details__location-status"><span /> {copy.locationStatus}</span></div>
          <strong>{record.mandi}</strong>
          <p>{record.mandiAddress}</p>
          <button type="button" className="farmer-procurement-details__outline-button" onClick={() => undefined}>{copy.viewLocation} <ChevronRight size={16} /></button>
        </section>
      </main>

      <FarmerBottomNav copy={copy} />
    </div>
  );
}