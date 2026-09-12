import { createElement, useState } from "react";
import { ArrowRight, Bell, CalendarDays, Check, ChevronDown, CircleHelp, CreditCard, MessageSquare, Phone, Sprout, UserRound, UsersRound } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import FarmerAuthHeader from "../../components/farmer/FarmerAuthHeader";
import FarmerBottomNav from "../../components/farmer/FarmerBottomNav";
import useFarmerPreferences from "../../components/farmer/useFarmerPreferences";
import { HELP_CATEGORIES, HELP_FAQS, SUPPORT_HELPLINE } from "../../components/farmer/helpData";
import "./farmerBase.css";
import "./farmerHelp.css";

const COPY = {
  en: {
    brandSubtitle: "Kisan Mandi Portal", homeLabel: "Farmer-SIH home", backLabel: "Back", languageLabel: "Choose language", useDarkMode: "Use dark mode", useLightMode: "Use light mode", title: "Help & Support", needHelp: "Need help?", needHelpText: "We're here to help you with slots, queues, procurement and payments.", helpline: "Kisan Toll-Free Helpline", demo: "Demo number", faqTitle: "Frequently Asked Questions", categoriesTitle: "What do you need help with?", contactTitle: "Contact Support", call: "Call Helpline", feedback: "Send Feedback", feedbackSent: "Feedback action is ready for a future support service.", noNumber: "Mock support contact", bookSlot: "Book a Slot", bookSlotHelp: "Choose a crop, mandi and available date.", liveQueue: "Live Queue", liveQueueHelp: "See your token and waiting position.", payment: "Payment", paymentHelp: "Check payment status and details.", account: "Account", accountHelp: "View your profile and account information.", faqBookQuestion: "How do I book a procurement slot?", faqBookAnswer: "Choose Book Slot from your dashboard, select your crop, nearby mandi and available date, then confirm your booking.", faqQueueQuestion: "How can I see my queue position?", faqQueueAnswer: "Open Live Queue from your dashboard to see your token number, tokens ahead and estimated waiting time.", faqPaymentQuestion: "When will I receive my payment?", faqPaymentAnswer: "Payment status is shown in the Payments section. Payments may take time to be processed.", faqMobileQuestion: "How can I change my mobile number?", faqMobileAnswer: "Your verified mobile number is linked to your Farmer account. Contact support if you need help changing it.", faqCancelledQuestion: "What should I do if my token is cancelled?", faqCancelledAnswer: "Check the reason shown for the cancellation and book a new available slot when required.", backHome: "Back to Home", navLabel: "Farmer navigation", navHome: "Home", navBook: "Book Slot", navQueue: "Queue", navHistory: "History", navPayments: "Payments",
  },
  hi: {
    brandSubtitle: "किसान मंडी पोर्टल", homeLabel: "फार्मर-एसआईएच होम", backLabel: "वापस", languageLabel: "भाषा चुनें", useDarkMode: "डार्क मोड का उपयोग करें", useLightMode: "लाइट मोड का उपयोग करें", title: "सहायता और समर्थन", needHelp: "सहायता चाहिए?", needHelpText: "हम स्लॉट, कतार, खरीद और भुगतान में आपकी मदद करने के लिए यहां हैं।", helpline: "किसान टोल-फ्री हेल्पलाइन", demo: "डेमो नंबर", faqTitle: "अक्सर पूछे जाने वाले प्रश्न", categoriesTitle: "आपको किस बारे में सहायता चाहिए?", contactTitle: "सहायता से संपर्क करें", call: "हेल्पलाइन पर कॉल करें", feedback: "फीडबैक भेजें", feedbackSent: "भविष्य की सहायता सेवा के लिए फीडबैक कार्रवाई तैयार है।", noNumber: "मॉक सहायता संपर्क", bookSlot: "स्लॉट बुक करें", bookSlotHelp: "फसल, मंडी और उपलब्ध तारीख चुनें।", liveQueue: "लाइव कतार", liveQueueHelp: "अपना टोकन और प्रतीक्षा स्थिति देखें।", payment: "भुगतान", paymentHelp: "भुगतान की स्थिति और विवरण देखें।", account: "खाता", accountHelp: "अपनी प्रोफ़ाइल और खाते की जानकारी देखें।", faqBookQuestion: "मैं खरीद स्लॉट कैसे बुक करूं?", faqBookAnswer: "डैशबोर्ड से स्लॉट बुक करें चुनें, अपनी फसल, नज़दीकी मंडी और उपलब्ध तारीख चुनें, फिर बुकिंग की पुष्टि करें।", faqQueueQuestion: "मैं अपनी कतार की स्थिति कैसे देखूं?", faqQueueAnswer: "अपना टोकन नंबर, आगे के टोकन और अनुमानित प्रतीक्षा समय देखने के लिए डैशबोर्ड से लाइव कतार खोलें।", faqPaymentQuestion: "मुझे भुगतान कब मिलेगा?", faqPaymentAnswer: "भुगतान की स्थिति भुगतान अनुभाग में दिखाई जाती है। भुगतान प्रक्रिया में समय लग सकता है।", faqMobileQuestion: "मैं अपना मोबाइल नंबर कैसे बदलूं?", faqMobileAnswer: "आपका सत्यापित मोबाइल नंबर आपके किसान खाते से जुड़ा है। नंबर बदलने में मदद के लिए सहायता से संपर्क करें।", faqCancelledQuestion: "यदि मेरा टोकन रद्द हो जाए तो मुझे क्या करना चाहिए?", faqCancelledAnswer: "रद्द होने का कारण देखें और आवश्यकता होने पर नया उपलब्ध स्लॉट बुक करें।", backHome: "होम पर वापस जाएं", navLabel: "किसान नेविगेशन", navHome: "होम", navBook: "स्लॉट बुक करें", navQueue: "कतार", navHistory: "इतिहास", navPayments: "भुगतान",
  },
};

const ICONS = { calendar: CalendarDays, queue: UsersRound, payment: CreditCard, account: UserRound };

export default function FarmerHelp() {
  const { language, setLanguage, theme, toggleTheme } = useFarmerPreferences();
  const navigate = useNavigate();
  const location = useLocation();
  const copy = COPY[language] || COPY.en;
  const [openFaq, setOpenFaq] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const backTo = location.state?.from || "/farmer";

  return (
    <div className={`farmer-welcome farmer-welcome--${theme} farmer-help`} lang={language === "hi" ? "hi" : "en"}>
      <FarmerAuthHeader copy={copy} language={language} onLanguageChange={setLanguage} theme={theme} onThemeToggle={toggleTheme} backTo={backTo} />
      <main className="farmer-shell farmer-help__main" id="farmer-help-main">
        <header className="farmer-help__heading"><div><p className="farmer-help__eyebrow"><CircleHelp size={15} /> Farmer-SIH</p><h1>{copy.title}</h1></div><span className="farmer-help__heading-icon"><CircleHelp size={23} /></span></header>
        <section className="farmer-help__primary"><span className="farmer-help__primary-icon"><Sprout size={23} /></span><div><h2>{copy.needHelp}</h2><p>{copy.needHelpText}</p><strong>{copy.helpline}</strong><b>{SUPPORT_HELPLINE.number}</b><small>{copy.demo} · {copy.noNumber}</small></div></section>
        <section className="farmer-help__section"><h2>{copy.categoriesTitle}</h2><div className="farmer-help__categories">{HELP_CATEGORIES.map((category) => <button type="button" key={category.id} onClick={() => navigate(category.destination)}><span className="farmer-help__category-icon">{createElement(ICONS[category.icon], { size: 19 })}</span><span><strong>{copy[category.titleKey]}</strong><small>{copy[category.descriptionKey]}</small></span><ArrowRight size={16} /></button>)}</div></section>
        <section className="farmer-help__section"><h2>{copy.faqTitle}</h2><div className="farmer-help__faqs">{HELP_FAQS.map((faq) => { const isOpen = openFaq === faq.id; return <div className={`farmer-help__faq ${isOpen ? "is-open" : ""}`} key={faq.id}><button type="button" aria-expanded={isOpen} aria-controls={`faq-${faq.id}`} onClick={() => setOpenFaq(isOpen ? null : faq.id)}><span>{copy[faq.questionKey]}</span><ChevronDown size={18} aria-hidden="true" /></button>{isOpen && <div id={`faq-${faq.id}`} className="farmer-help__answer">{copy[faq.answerKey]}</div>}</div>; })}</div></section>
        <section className="farmer-help__contact"><div><h2><Phone size={18} /> {copy.contactTitle}</h2><p>{SUPPORT_HELPLINE.isConfigured ? SUPPORT_HELPLINE.number : copy.noNumber}</p></div><div className="farmer-help__contact-actions"><button type="button" onClick={() => SUPPORT_HELPLINE.isConfigured && window.open(`tel:${SUPPORT_HELPLINE.number}`, "_self")}><Phone size={16} /> {copy.call}</button><button type="button" onClick={() => setFeedbackMessage(copy.feedbackSent)}><MessageSquare size={16} /> {copy.feedback}</button></div>{feedbackMessage && <p className="farmer-help__feedback" role="status">{feedbackMessage}</p>}</section>
        <button type="button" className="farmer-help__home" onClick={() => navigate("/farmer")}><ArrowRight size={16} /> {copy.backHome}</button>
      </main>
      <FarmerBottomNav copy={copy} />
    </div>
  );
}