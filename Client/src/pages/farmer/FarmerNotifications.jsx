import { createElement, useEffect, useMemo, useState } from "react";
import {
  Bell,
  CalendarDays,
  Check,
  CircleAlert,
  Clock3,
  CreditCard,
  Loader2,
  PackageCheck,
  RefreshCw,
  Sprout,
  Wheat,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import FarmerAuthHeader from "../../components/farmer/FarmerAuthHeader";
import FarmerBottomNav from "../../components/farmer/FarmerBottomNav";
import useFarmerPreferences from "../../components/farmer/useFarmerPreferences";
import { getMockNotifications } from "../../components/farmer/notificationData";
import "./farmerBase.css";
import "./farmerNotifications.css";

const COPY = {
  en: {
    brandSubtitle: "Kisan Mandi Portal",
    homeLabel: "Farmer-SIH home",
    backLabel: "Back",
    languageLabel: "Choose language",
    useDarkMode: "Use dark mode",
    useLightMode: "Use light mode",
    title: "Notifications",
    markAll: "Mark all as read",
    all: "All",
    unread: "Unread",
    slotConfirmed: "Slot Confirmed",
    slotConfirmedMessage: "Your procurement slot at Meerut Procurement Centre is confirmed.",
    queueUpdate: "Queue Update",
    queueUpdateMessage: "You are now 12 tokens away from your turn.",
    paymentReceived: "Payment Received",
    paymentReceivedMessage: "₹10,800 has been credited through Direct Benefit Transfer.",
    procurementCompleted: "Procurement Completed",
    procurementCompletedMessage: "Your Wheat procurement of 450 kg has been completed successfully.",
    mandiSchedule: "Mandi Schedule Update",
    mandiScheduleMessage: "Procurement timings have been updated for Meerut Procurement Centre.",
    today930: "Today · 9:30 AM",
    today1015: "Today · 10:15 AM",
    aug20: "20 Aug 2026",
    aug18: "18 Aug 2026",
    aug16: "16 Aug 2026",
    unreadLabel: "Unread",
    readLabel: "Read",
    noNotifications: "No notifications yet",
    noNotificationsText: "Important updates about your bookings, queue and payments will appear here.",
    caughtUp: "You're all caught up",
    caughtUpText: "All notifications have been read.",
    viewAll: "View All",
    backHome: "Back to Home",
    loading: "Loading your notifications...",
    errorTitle: "Couldn't load your notifications",
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
    title: "सूचनाएं",
    markAll: "सभी को पढ़ा हुआ चिह्नित करें",
    all: "सभी",
    unread: "अपठित",
    slotConfirmed: "स्लॉट की पुष्टि हो गई",
    slotConfirmedMessage: "मेरठ खरीद केंद्र पर आपके खरीद स्लॉट की पुष्टि हो गई है।",
    queueUpdate: "कतार अपडेट",
    queueUpdateMessage: "अब आपकी बारी से 12 टोकन बाकी हैं।",
    paymentReceived: "भुगतान प्राप्त हुआ",
    paymentReceivedMessage: "₹10,800 प्रत्यक्ष लाभ अंतरण के माध्यम से जमा हुए हैं।",
    procurementCompleted: "खरीद पूरी हुई",
    procurementCompletedMessage: "आपकी 450 किलो गेहूं की खरीद सफलतापूर्वक पूरी हो गई है।",
    mandiSchedule: "मंडी समय अपडेट",
    mandiScheduleMessage: "मेरठ खरीद केंद्र के खरीद समय में बदलाव किया गया है।",
    today930: "आज · सुबह 9:30",
    today1015: "आज · सुबह 10:15",
    aug20: "20 अग 2026",
    aug18: "18 अग 2026",
    aug16: "16 अग 2026",
    unreadLabel: "अपठित",
    readLabel: "पढ़ा हुआ",
    noNotifications: "अभी कोई सूचना नहीं है",
    noNotificationsText: "आपकी बुकिंग, कतार और भुगतान के महत्वपूर्ण अपडेट यहां दिखाई देंगे।",
    caughtUp: "आपकी सभी सूचनाएं पढ़ी जा चुकी हैं",
    caughtUpText: "सभी सूचनाएं पढ़ी जा चुकी हैं।",
    viewAll: "सभी देखें",
    backHome: "होम पर वापस जाएं",
    loading: "सूचनाएं लोड हो रही हैं...",
    errorTitle: "सूचनाएं लोड नहीं हो सकीं",
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

const NOTIFICATION_ICONS = {
  slot: CalendarDays,
  queue: Clock3,
  payment: CreditCard,
  procurement: PackageCheck,
  schedule: Wheat,
};

function NotificationCard({ notification, copy, onOpen }) {
  const Icon = NOTIFICATION_ICONS[notification.type] || Bell;
  const title = copy[notification.titleKey];
  const message = copy[notification.messageKey];
  const time = copy[notification.timeKey];

  return (
    <button
      type="button"
      className={`farmer-notifications__card ${notification.unread ? "is-unread" : ""}`}
      onClick={() => onOpen(notification)}
      aria-label={`${title}. ${message}. ${time}. ${notification.unread ? copy.unreadLabel : copy.readLabel}`}
    >
      <span className={`farmer-notifications__icon farmer-notifications__icon--${notification.type}`} aria-hidden="true">
        {createElement(Icon, { size: 19 })}
      </span>
      <span className="farmer-notifications__content">
        <span className="farmer-notifications__card-head">
          <strong>{title}</strong>
          <span className={`farmer-notifications__read-label ${notification.unread ? "is-unread" : ""}`}>
            {notification.unread && <span className="farmer-notifications__unread-dot" aria-hidden="true" />}
            {notification.unread ? copy.unreadLabel : copy.readLabel}
          </span>
        </span>
        <span className="farmer-notifications__message">{message}</span>
        <span className="farmer-notifications__time">{time}</span>
      </span>
    </button>
  );
}

export default function FarmerNotifications() {
  const { language, setLanguage, theme, toggleTheme } = useFarmerPreferences();
  const navigate = useNavigate();
  const copy = COPY[language] || COPY.en;
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all");
  const [state, setState] = useState("loading");

  const loadNotifications = () => {
    setState("loading");
    getMockNotifications()
      .then((data) => {
        setNotifications(data);
        setState("ready");
      })
      .catch(() => setState("error"));
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const filteredNotifications = useMemo(
    () => notifications.filter((notification) => filter === "all" || notification.unread),
    [filter, notifications]
  );

  const unreadCount = notifications.filter((notification) => notification.unread).length;

  const markAllAsRead = () => {
    setNotifications((current) => current.map((notification) => ({ ...notification, unread: false })));
  };

  const handleOpen = (notification) => {
    setNotifications((current) => current.map((item) => item.id === notification.id ? { ...item, unread: false } : item));
    if (notification.destination) navigate(notification.destination);
  };

  return (
    <div className={`farmer-welcome farmer-welcome--${theme} farmer-notifications`} lang={language === "hi" ? "hi" : "en"}>
      <FarmerAuthHeader copy={copy} language={language} onLanguageChange={setLanguage} theme={theme} onThemeToggle={toggleTheme} backTo="/farmer" />

      <main className="farmer-shell farmer-notifications__main" id="farmer-notifications-main">
        <header className="farmer-notifications__heading">
          <div>
            <p className="farmer-notifications__eyebrow"><Bell size={15} /> Farmer-SIH</p>
            <h1>{copy.title}</h1>
          </div>
          <span className="farmer-notifications__heading-icon" aria-hidden="true"><Bell size={23} /></span>
        </header>

        <div className="farmer-notifications__toolbar">
          <div className="farmer-notifications__filters" role="group" aria-label={copy.title}>
            <button type="button" className={filter === "all" ? "is-active" : ""} aria-pressed={filter === "all"} onClick={() => setFilter("all")}>{copy.all}</button>
            <button type="button" className={filter === "unread" ? "is-active" : ""} aria-pressed={filter === "unread"} onClick={() => setFilter("unread")}>
              {copy.unread}{unreadCount > 0 && <span>{unreadCount}</span>}
            </button>
          </div>
          {state === "ready" && unreadCount > 0 && <button type="button" className="farmer-notifications__mark-all" onClick={markAllAsRead}><Check size={15} /> {copy.markAll}</button>}
        </div>

        {state === "loading" && (
          <div className="farmer-notifications__loading" aria-live="polite">
            {[1, 2, 3].map((item) => <div className="farmer-notifications__skeleton" key={item}><span /><span /><span /><span /></div>)}
          </div>
        )}

        {state === "error" && (
          <section className="farmer-notifications__state"><CircleAlert size={27} /><h2>{copy.errorTitle}</h2><p>{copy.errorText}</p><button type="button" className="farmer-primary-cta" onClick={loadNotifications}><RefreshCw size={17} /> {copy.retry}</button></section>
        )}

        {state === "ready" && notifications.length === 0 && (
          <section className="farmer-notifications__state"><Bell size={27} /><h2>{copy.noNotifications}</h2><p>{copy.noNotificationsText}</p><button type="button" className="farmer-primary-cta" onClick={() => navigate("/farmer")}>{copy.backHome}</button></section>
        )}

        {state === "ready" && notifications.length > 0 && filteredNotifications.length === 0 && (
          <section className="farmer-notifications__state"><Check size={27} /><h2>{copy.caughtUp}</h2><p>{copy.caughtUpText}</p><button type="button" className="farmer-notifications__clear" onClick={() => setFilter("all")}>{copy.viewAll}</button></section>
        )}

        {state === "ready" && filteredNotifications.length > 0 && (
          <div className="farmer-notifications__list">
            {filteredNotifications.map((notification) => <NotificationCard key={notification.id} notification={notification} copy={copy} onOpen={handleOpen} />)}
          </div>
        )}
      </main>

      <FarmerBottomNav copy={copy} />
    </div>
  );
}