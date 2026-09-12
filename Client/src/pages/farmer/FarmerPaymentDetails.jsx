import { createElement, useMemo, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Banknote,
  CalendarDays,
  Check,
  CircleAlert,
  Clock3,
  CreditCard,
  Download,
  FileText,
  HelpCircle,
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
  getMockPaymentDetails,
  PAYMENT_DETAIL_STATUSES,
} from "../../components/farmer/paymentDetailsData";
import "./farmerBase.css";
import "./farmerPaymentDetails.css";

const COPY = {
  en: {
    brandSubtitle: "Kisan Mandi Portal",
    homeLabel: "Farmer-SIH home",
    backLabel: "Back",
    languageLabel: "Choose language",
    useDarkMode: "Use dark mode",
    useLightMode: "Use light mode",
    title: "Payment Details",
    paymentSuccessful: "Payment Successful",
    credited: "Your procurement payment has been credited.",
    paymentPending: "Payment Pending",
    processing: "Your payment is being processed.",
    paymentFailed: "Payment Failed",
    failedMessage: "We couldn't process this payment.",
    paid: "PAID",
    pending: "PENDING",
    failed: "FAILED",
    amountReceived: "Amount Received",
    paymentDate: "Payment Date",
    paymentMethod: "Payment Method",
    dbt: "Direct Benefit Transfer (DBT)",
    bankAccount: "Bank Account",
    transactionDetails: "Transaction Details",
    transactionId: "Transaction ID",
    referenceNumber: "Reference Number",
    paymentStatus: "Payment Status",
    successful: "Successful",
    relatedProcurement: "Related Procurement",
    crop: "Crop",
    quantity: "Quantity",
    qualityGrade: "Quality Grade",
    mandi: "Mandi",
    procurementDate: "Procurement Date",
    token: "Token",
    viewProcurement: "View Procurement Details",
    receipt: "View / Download Receipt",
    receiptAvailable: "Digital receipt is available for this payment.",
    receiptPending: "A digital receipt will be available after payment is completed.",
    receiptShown: "Receipt action is ready for the future digital receipt.",
    needHelp: "Need help with this payment?",
    getHelp: "Get Help",
    helpShown: "Support request action is available for this payment.",
    notFound: "Payment record not found",
    notFoundText: "This payment record is unavailable.",
    backToPayments: "Back to Payments",
    notAvailable: "Not available yet",
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
    title: "भुगतान विवरण",
    paymentSuccessful: "भुगतान सफल",
    credited: "आपकी खरीद का भुगतान जमा हो गया है।",
    paymentPending: "भुगतान लंबित",
    processing: "आपका भुगतान प्रक्रिया में है।",
    paymentFailed: "भुगतान विफल",
    failedMessage: "हम यह भुगतान पूरा नहीं कर सके।",
    paid: "भुगतान हुआ",
    pending: "लंबित",
    failed: "विफल",
    amountReceived: "प्राप्त राशि",
    paymentDate: "भुगतान की तारीख",
    paymentMethod: "भुगतान का तरीका",
    dbt: "प्रत्यक्ष लाभ अंतरण (डीबीटी)",
    bankAccount: "बैंक खाता",
    transactionDetails: "लेन-देन विवरण",
    transactionId: "लेन-देन आईडी",
    referenceNumber: "संदर्भ संख्या",
    paymentStatus: "भुगतान स्थिति",
    successful: "सफल",
    relatedProcurement: "संबंधित खरीद",
    crop: "फसल",
    quantity: "मात्रा",
    qualityGrade: "गुणवत्ता ग्रेड",
    mandi: "मंडी",
    procurementDate: "खरीद की तारीख",
    token: "टोकन",
    viewProcurement: "खरीद विवरण देखें",
    receipt: "रसीद देखें / डाउनलोड करें",
    receiptAvailable: "इस भुगतान की डिजिटल रसीद उपलब्ध है।",
    receiptPending: "भुगतान पूरा होने के बाद डिजिटल रसीद उपलब्ध होगी।",
    receiptShown: "भविष्य की डिजिटल रसीद के लिए रसीद कार्रवाई तैयार है।",
    needHelp: "इस भुगतान के बारे में सहायता चाहिए?",
    getHelp: "सहायता लें",
    helpShown: "इस भुगतान के लिए सहायता अनुरोध कार्रवाई उपलब्ध है।",
    notFound: "भुगतान रिकॉर्ड नहीं मिला",
    notFoundText: "यह भुगतान रिकॉर्ड उपलब्ध नहीं है।",
    backToPayments: "भुगतान पर वापस जाएं",
    notAvailable: "अभी उपलब्ध नहीं",
    navLabel: "किसान नेविगेशन",
    navHome: "होम",
    navBook: "स्लॉट बुक करें",
    navQueue: "कतार",
    navHistory: "इतिहास",
    navPayments: "भुगतान",
  },
};

const STATUS_CONFIG = {
  paid: { title: "paymentSuccessful", message: "credited", label: "paid", icon: Check, className: "paid" },
  pending: { title: "paymentPending", message: "processing", label: "pending", icon: Clock3, className: "pending" },
  failed: { title: "paymentFailed", message: "failedMessage", label: "failed", icon: CircleAlert, className: "failed" },
};

function DetailRow({ icon: Icon, label, value }) {
  return (
    <div className="farmer-payment-details__row">
      <span className="farmer-payment-details__row-icon" aria-hidden="true">{createElement(Icon, { size: 17 })}</span>
      <span className="farmer-payment-details__row-label">{label}</span>
      <strong className="farmer-payment-details__row-value">{value}</strong>
    </div>
  );
}

function PaymentCard({ title, icon: Icon, children, className = "" }) {
  return (
    <section className={`farmer-payment-details__card ${className}`}>
      <h2><span aria-hidden="true">{createElement(Icon, { size: 18 })}</span>{title}</h2>
      {children}
    </section>
  );
}

export default function FarmerPaymentDetails() {
  const { language, setLanguage, theme, toggleTheme } = useFarmerPreferences();
  const { id } = useParams();
  const navigate = useNavigate();
  const copy = COPY[language] || COPY.en;
  const record = useMemo(() => getMockPaymentDetails(id), [id]);
  const [receiptMessage, setReceiptMessage] = useState("");
  const [helpMessage, setHelpMessage] = useState("");

  if (!record) {
    return (
      <div className={`farmer-welcome farmer-welcome--${theme} farmer-payment-details`} lang={language === "hi" ? "hi" : "en"}>
        <FarmerAuthHeader copy={copy} language={language} onLanguageChange={setLanguage} theme={theme} onThemeToggle={toggleTheme} backTo="/farmer/payments" />
        <main className="farmer-shell farmer-payment-details__not-found">
          <span className="farmer-payment-details__not-found-icon"><CircleAlert size={28} /></span>
          <h1>{copy.notFound}</h1>
          <p>{copy.notFoundText}</p>
          <button type="button" className="farmer-primary-cta" onClick={() => navigate("/farmer/payments")}>
            <ArrowRight size={17} /> {copy.backToPayments}
          </button>
        </main>
      </div>
    );
  }

  const status = STATUS_CONFIG[record.status] || STATUS_CONFIG.pending;
  const StatusIcon = status.icon;

  return (
    <div className={`farmer-welcome farmer-welcome--${theme} farmer-payment-details`} lang={language === "hi" ? "hi" : "en"}>
      <FarmerAuthHeader copy={copy} language={language} onLanguageChange={setLanguage} theme={theme} onThemeToggle={toggleTheme} backTo="/farmer/payments" />

      <main className="farmer-shell farmer-payment-details__main" id="farmer-payment-details-main">
        <header className="farmer-payment-details__heading">
          <div>
            <p className="farmer-payment-details__eyebrow"><CreditCard size={15} /> Farmer-SIH</p>
            <h1>{copy.title}</h1>
          </div>
          <span className="farmer-payment-details__heading-icon" aria-hidden="true"><Banknote size={23} /></span>
        </header>

        <section className={`farmer-payment-details__hero farmer-payment-details__hero--${status.className}`} aria-labelledby="payment-status-title">
          <span className="farmer-payment-details__hero-icon" aria-hidden="true"><StatusIcon size={25} /></span>
          <div>
            <h2 id="payment-status-title">{copy[status.title]}</h2>
            <p>{copy[status.message]}</p>
          </div>
          <span className="farmer-payment-details__status-badge">{copy[status.label]}</span>
        </section>

        <section className="farmer-payment-details__amount-card" aria-label={copy.amountReceived}>
          <span>{copy.amountReceived}</span>
          <strong>{record.amount}</strong>
          <div><CalendarDays size={16} aria-hidden="true" /> <span>{copy.paymentDate}: <b>{record.paymentDate || copy.notAvailable}</b></span></div>
        </section>

        <div className="farmer-payment-details__columns">
          <PaymentCard title={copy.paymentMethod} icon={Banknote} className="farmer-payment-details__method-card">
            <div className="farmer-payment-details__method-main"><span className="farmer-payment-details__method-icon"><Banknote size={20} /></span><strong>{language === "hi" ? record.methodHindi || copy.dbt : record.method || copy.dbt}</strong></div>
            <DetailRow icon={CreditCard} label={copy.bankAccount} value={record.account || copy.notAvailable} />
          </PaymentCard>

          <PaymentCard title={copy.transactionDetails} icon={FileText}>
            <DetailRow icon={Receipt} label={copy.transactionId} value={record.transactionId || copy.notAvailable} />
            <DetailRow icon={FileText} label={copy.referenceNumber} value={record.referenceNumber || copy.notAvailable} />
            <DetailRow icon={CalendarDays} label={copy.paymentDate} value={record.paymentDate || copy.notAvailable} />
            <DetailRow icon={BadgeCheck} label={copy.paymentStatus} value={record.status === "paid" ? copy.successful : copy[status.label]} />
          </PaymentCard>
        </div>

        <PaymentCard title={copy.relatedProcurement} icon={PackageCheck} className="farmer-payment-details__procurement-card">
          <div className="farmer-payment-details__procurement-top"><span className="farmer-payment-details__crop-icon"><Wheat size={21} /></span><strong>{record.crop} <small>({record.cropHindi})</small></strong></div>
          <div className="farmer-payment-details__procurement-grid">
            <DetailRow icon={PackageCheck} label={copy.quantity} value={record.quantity} />
            <DetailRow icon={BadgeCheck} label={copy.qualityGrade} value={record.qualityGrade} />
            <DetailRow icon={MapPin} label={copy.mandi} value={record.mandi} />
            <DetailRow icon={CalendarDays} label={copy.procurementDate} value={record.procurementDate} />
            <DetailRow icon={Receipt} label={copy.token} value={`#${record.token}`} />
          </div>
          <button type="button" className="farmer-payment-details__outline-button" onClick={() => navigate(`/farmer/procurement/${record.procurementId}`)}>
            {copy.viewProcurement} <ArrowRight size={16} />
          </button>
        </PaymentCard>

        <PaymentCard title={copy.receipt} icon={Receipt} className="farmer-payment-details__receipt-card">
          <div className="farmer-payment-details__receipt-content"><span className="farmer-payment-details__receipt-icon"><Download size={20} /></span><p>{record.status === "paid" ? copy.receiptAvailable : copy.receiptPending}</p></div>
          <button type="button" className="farmer-primary-cta" onClick={() => setReceiptMessage(copy.receiptShown)} disabled={record.status !== "paid"}>
            <Download size={17} /> {copy.receipt}
          </button>
          {receiptMessage && <p className="farmer-payment-details__inline-message" role="status">{receiptMessage}</p>}
        </PaymentCard>

        <section className="farmer-payment-details__support" aria-label={copy.needHelp}>
          <span className="farmer-payment-details__support-icon"><HelpCircle size={19} /></span>
          <div><strong>{copy.needHelp}</strong>{helpMessage && <small role="status">{helpMessage}</small>}</div>
          <button type="button" onClick={() => setHelpMessage(copy.helpShown)}>{copy.getHelp}</button>
        </section>
      </main>

      <FarmerBottomNav copy={copy} />
    </div>
  );
}