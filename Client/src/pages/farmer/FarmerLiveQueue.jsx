import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle,
  CalendarPlus,
  CheckCircle2,
  Clock,
  Hourglass,
  MapPin,
  Navigation,
  RefreshCw,
  Sparkles,
  Sprout,
  XCircle,
} from "lucide-react";

import FarmerAuthHeader from "../../components/farmer/FarmerAuthHeader";
import FarmerBottomNav from "../../components/farmer/FarmerBottomNav";
import useFarmerPreferences from "../../components/farmer/useFarmerPreferences";
import { getFarmerProfile } from "../../components/farmer/farmerSession";
import { getFarmerTokens, getMandiQueue } from "../../api/farmer/tokens";

import "./farmerBase.css";
import "./farmerHome.css";
import "./farmerQueue.css";

const COPY = {
  en: {
    brandSubtitle: "Kisan Mandi Portal",
    homeLabel: "KisanSetu home",
    backLabel: "Back",
    languageLabel: "Choose language",
    useDarkMode: "Use dark mode",
    useLightMode: "Use light mode",
    liveQueueTitle: "Live Queue Status",
    yourToken: "Your Token",
    nowServing: "Now Serving",
    tokensAhead: "Tokens Ahead",
    tokensAheadVal: (n) => `${n} tokens ahead of you`,
    estimatedWait: "Estimated Wait",
    estimatedWaitVal: (m) => `~${m} minutes`,
    updatedJustNow: "Queue updated just now",
    refreshQueue: "Refresh Queue",
    refreshing: "Refreshing...",
    mandiDetails: "Mandi Details",
    viewLocation: "View Location",
    locationPinned: "Procurement Centre Location Pinned",
    statusWaiting: "Waiting",
    statusAlmost: "Almost your turn",
    statusTurn: "Your turn now!",
    statusServed: "Served",
    statusCancelled: "Cancelled",
    msgWaiting: "Your turn is getting closer. Please stay near the gate.",
    msgAlmost: "Only a few tokens ahead! Please get ready at Gate 1.",
    msgTurn: "Please proceed directly to the weighing counter now.",
    msgServed: "Procurement completed successfully for this slot.",
    msgCancelled: "This token was cancelled. Please book another slot.",
    emptyTitle: "No active token in queue",
    emptyText: "Book a slot to join the procurement queue.",
    bookNewSlot: "Book New Slot",
    loadingQueue: "Loading your live queue...",
    errorTitle: "Couldn't load the queue",
    errorSubtitle: "Please check your network and try again.",
    missingSession: "Your farmer session is missing. Please log in again.",
    missingMandi: "The active token does not have a valid mandi.",
    retryBtn: "Retry",
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
    liveQueueTitle: "लाइव कतार स्थिति",
    yourToken: "आपका टोकन",
    nowServing: "वर्तमान सेवा",
    tokensAhead: "आगे के टोकन",
    tokensAheadVal: (n) => `आपसे आगे ${n} टोकन हैं`,
    estimatedWait: "अनुमानित प्रतीक्षा",
    estimatedWaitVal: (m) => `~${m} मिनट`,
    updatedJustNow: "कतार अभी अपडेट हुई",
    refreshQueue: "कतार रीफ्रेश करें",
    refreshing: "अपडेट हो रहा है...",
    mandiDetails: "मंडी विवरण",
    viewLocation: "स्थान देखें",
    locationPinned: "खरीद केंद्र का स्थान पिन किया गया",
    statusWaiting: "प्रतीक्षा में",
    statusAlmost: "आपकी बारी आने वाली है",
    statusTurn: "अब आपकी बारी है!",
    statusServed: "सेवा पूर्ण",
    statusCancelled: "रद्द",
    msgWaiting: "आपकी बारी नज़दीक आ रही है। कृपया गेट के पास रहें।",
    msgAlmost: "बस कुछ ही टोकन बाकी हैं! गेट 1 पर तैयार रहें।",
    msgTurn: "कृपया अभी सीधे तौल काउंटर पर जाएं।",
    msgServed: "इस स्लॉट के लिए खरीद सफलतापूर्वक पूरी हो चुकी है।",
    msgCancelled: "यह टोकन रद्द कर दिया गया है। कृपया दूसरा स्लॉट बुक करें।",
    emptyTitle: "कतार में कोई सक्रिय टोकन नहीं",
    emptyText: "खरीद कतार में शामिल होने के लिए स्लॉट बुक करें।",
    bookNewSlot: "नया स्लॉट बुक करें",
    loadingQueue: "लाइव कतार लोड हो रही है...",
    errorTitle: "कतार लोड नहीं हो सकी",
    errorSubtitle: "कृपया नेटवर्क जांचें और पुनः प्रयास करें।",
    missingSession: "आपका किसान सत्र उपलब्ध नहीं है। कृपया फिर से लॉगिन करें।",
    missingMandi: "सक्रिय टोकन में मान्य मंडी उपलब्ध नहीं है।",
    retryBtn: "पुनः प्रयास करें",
    navLabel: "किसान नेविगेशन",
    navHome: "होम",
    navBook: "स्लॉट बुक करें",
    navQueue: "कतार",
    navHistory: "इतिहास",
    navPayments: "भुगतान",
  },
};

export default function FarmerLiveQueue() {
  const { language, setLanguage, theme, toggleTheme } = useFarmerPreferences();
  const navigate = useNavigate();
  const copy = COPY[language] || COPY.en;

  const [queueData, setQueueData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [lastUpdated, setLastUpdated] = useState(() => new Date());
  const [showLocationToast, setShowLocationToast] = useState(false);

  const farmerProfile = useMemo(() => getFarmerProfile(), []);

  // Fetch queue status from the authenticated Farmer and selected mandi APIs.
  const fetchQueue = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    setErrorMessage("");

    const farmerId = farmerProfile?._id || farmerProfile?.id;

    if (!farmerId || !/^[0-9a-fA-F]{24}$/.test(farmerId)) {
      setQueueData(null);
      setErrorMessage(copy.missingSession);
      setLoading(false);
      setRefreshing(false);
      return;
    }

    try {
      const tokens = await getFarmerTokens(farmerId);
      const farmerTokens = Array.isArray(tokens) ? tokens : tokens?.tokens || [];
      const activeToken = farmerTokens[0];

      if (!activeToken) {
        setQueueData(null);
        setLastUpdated(new Date());
        setLoading(false);
        setRefreshing(false);
        return;
      }

      const mandiId = typeof activeToken.mandi === "string"
        ? activeToken.mandi
        : activeToken.mandi?._id || activeToken.mandi?.id;

      if (!mandiId || !/^[0-9a-fA-F]{24}$/.test(mandiId)) {
        setQueueData(null);
        setErrorMessage(copy.missingMandi);
        return;
      }

      const queueList = activeToken.status === "waiting" ? await getMandiQueue(mandiId) : [];
      const queue = Array.isArray(queueList) ? queueList : queueList?.queue || [];
      const aheadCount = activeToken.status === "waiting"
        ? queue.filter((token) => Number(token.tokenNumber) < Number(activeToken.tokenNumber)).length
        : 0;

      setQueueData({
        tokenNumber: `A${String(activeToken.tokenNumber).padStart(3, "0")}`,
        status: activeToken.status || "waiting",
        tokensAhead: aheadCount,
        estimatedWaitMinutes: aheadCount * 3,
        currentServingToken: queue[0]?.tokenNumber ? `A${String(queue[0].tokenNumber).padStart(3, "0")}` : "—",
        mandiName: activeToken.mandi?.name || "—",
        mandiLocation: activeToken.mandi?.location || "—",
        date: activeToken.date,
      });
      setLastUpdated(new Date());
    } catch (error) {
      setQueueData(null);
      const status = error?.response?.status;
      const serverMessage = error?.response?.data?.message;
      const reason = serverMessage || (status ? `Request failed (${status}).` : "Unable to reach the queue service.");
      console.error("[FarmerLiveQueue] Queue load failed", { farmerId, status, message: serverMessage || error?.message });
      setErrorMessage(reason);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [copy, farmerProfile]);

  useEffect(() => {
    fetchQueue();
    // Live polling every 15 seconds to update the queue automatically
    const timer = setInterval(() => {
      fetchQueue();
    }, 15000);
    return () => clearInterval(timer);
  }, [fetchQueue]);

  // Compute dynamic status presentation
  const statusConfig = useMemo(() => {
    if (!queueData) return { label: copy.statusWaiting, pillClass: "waiting", msg: copy.msgWaiting, icon: Clock };

    const ahead = queueData.tokensAhead;
    if (queueData.status === "cancelled") {
      return { label: copy.statusCancelled, pillClass: "cancelled", msg: copy.msgCancelled, icon: XCircle };
    }
    if (queueData.status === "served") {
      return { label: copy.statusServed, pillClass: "served", msg: copy.msgServed, icon: CheckCircle2 };
    }
    if (ahead === 0) {
      return { label: copy.statusTurn, pillClass: "turn", msg: copy.msgTurn, icon: Sparkles };
    }
    if (ahead <= 3) {
      return { label: copy.statusAlmost, pillClass: "almost", msg: copy.msgAlmost, icon: Hourglass };
    }
    return { label: copy.statusWaiting, pillClass: "waiting", msg: copy.msgWaiting, icon: Clock };
  }, [queueData, copy]);

  const StatusIcon = statusConfig.icon;

  const handleLocationClick = () => {
    setShowLocationToast(true);
    setTimeout(() => setShowLocationToast(false), 3000);
  };

  return (
    <div className={`farmer-welcome farmer-queue farmer-welcome--${theme}`} lang={language === "hi" ? "hi" : "en"}>
      <FarmerAuthHeader
        copy={copy}
        language={language}
        onLanguageChange={setLanguage}
        theme={theme}
        onThemeToggle={toggleTheme}
        backTo="/farmer"
      />

      <main className="farmer-shell farmer-queue__main" id="farmer-queue-main">
        {/* Live Status Header Strip */}
        <div className="farmer-queue__header-strip">
          <div className="farmer-queue__live-indicator">
            <span className="farmer-queue__live-dot" aria-hidden="true" />
            <span>{copy.liveQueueTitle}</span>
          </div>
          <div className="farmer-queue__updated-time" title={lastUpdated.toLocaleTimeString()}>
            <span>{copy.updatedJustNow}</span>
          </div>
        </div>

        {/* LOADING STATE */}
        {loading ? (
          <div className="farmer-queue__empty">
            <div className="farmer-queue__empty-icon">
              <RefreshCw size={28} className="farmer-spin" />
            </div>
            <h2>{copy.loadingQueue}</h2>
          </div>
        ) : errorMessage ? (
          /* ERROR STATE */
          <div className="farmer-queue__empty">
            <div className="farmer-queue__empty-icon" style={{ background: "#fee2e2", color: "#991b1b" }}>
              <AlertCircle size={28} />
            </div>
            <h2>{copy.errorTitle}</h2>
            <p>{errorMessage || copy.errorSubtitle}</p>
            <button
              type="button"
              className="farmer-primary-cta"
              style={{ width: "auto", minWidth: "160px" }}
              onClick={() => fetchQueue(true)}
            >
              {copy.retryBtn}
            </button>
          </div>
        ) : !queueData ? (
          /* EMPTY STATE */
          <div className="farmer-queue__empty">
            <div className="farmer-queue__empty-icon">
              <Sprout size={28} />
            </div>
            <h2>{copy.emptyTitle}</h2>
            <p>{copy.emptyText}</p>
            <button
              type="button"
              className="farmer-primary-cta"
              style={{ width: "auto", minWidth: "200px" }}
              onClick={() => navigate("/farmer/book")}
            >
              <CalendarPlus size={18} />
              <span>{copy.bookNewSlot}</span>
            </button>
          </div>
        ) : (
          /* ACTIVE QUEUE SCREEN */
          <>
            {/* HERO CARD: YOUR TOKEN & STATUS */}
            <section className="farmer-queue__hero-card" aria-labelledby="live-queue-token-title">
              {/* Status Pill Badge */}
              <div className={`farmer-queue__status-pill farmer-queue__status-pill--${statusConfig.pillClass}`}>
                <StatusIcon size={16} aria-hidden="true" />
                <span>{statusConfig.label}</span>
              </div>

              {/* Your Token Big Display */}
              <div className="farmer-queue__token-label" id="live-queue-token-title">
                {copy.yourToken}
              </div>
              <div className="farmer-queue__token-number">
                #{queueData.tokenNumber}
              </div>

              {/* Status Context Message */}
              <p className="farmer-queue__status-message">
                {statusConfig.msg}
              </p>

              {/* Metrics Grid: Tokens Ahead & Est Wait */}
              <div className="farmer-queue__metrics">
                <div className="farmer-queue__metric">
                  <span className="farmer-queue__metric-val">{queueData.tokensAhead}</span>
                  <span className="farmer-queue__metric-label">{copy.tokensAhead}</span>
                </div>
                <div className="farmer-queue__metric">
                  <span className="farmer-queue__metric-val">~{queueData.estimatedWaitMinutes}m</span>
                  <span className="farmer-queue__metric-label">{copy.estimatedWait}</span>
                </div>
              </div>
            </section>

            {/* QUEUE PROGRESS / VISUALIZATION FLOW */}
            <section className="farmer-queue__flow-card" aria-label="Queue Progress">
              <div className="farmer-queue__flow-title">
                <span>{copy.liveQueueTitle}</span>
                <button
                  type="button"
                  className="farmer-queue__refresh-btn"
                  style={{ padding: "6px 12px", fontSize: "0.78rem" }}
                  onClick={() => fetchQueue(true)}
                  disabled={refreshing}
                >
                  <RefreshCw size={14} className={refreshing ? "farmer-spin" : ""} />
                  <span>{refreshing ? copy.refreshing : copy.refreshQueue}</span>
                </button>
              </div>

              <div className="farmer-queue__steps">
                <div className="farmer-queue__track-line">
                  <div className="farmer-queue__track-fill" style={{ width: "65%" }} />
                </div>

                {/* Node 1: Now Serving */}
                <div className="farmer-queue__node farmer-queue__node--now">
                  <span className="farmer-queue__node-label">{copy.nowServing}</span>
                  <span className="farmer-queue__node-badge">
                    #{queueData.currentServingToken}
                  </span>
                </div>

                {/* Mid dots separator */}
                <div className="farmer-queue__node farmer-queue__node--dots" aria-hidden="true">
                  ...
                </div>

                {/* Node 2: Your Token */}
                <div className="farmer-queue__node farmer-queue__node--you">
                  <span className="farmer-queue__node-label">{copy.yourToken}</span>
                  <span className="farmer-queue__node-badge">
                    #{queueData.tokenNumber}
                  </span>
                </div>
              </div>
            </section>

            {/* MANDI INFORMATION CARD */}
            <section className="farmer-queue__mandi-card" aria-label={copy.mandiDetails}>
              <div className="farmer-queue__mandi-header">
                <div className="farmer-queue__mandi-info">
                  <h3>{queueData.mandiName}</h3>
                  <p>
                    <MapPin size={15} />
                      <span>{queueData.mandiLocation}</span>
                    </p>
                    <p>
                      <span>{queueData.date ? new Date(queueData.date).toLocaleDateString(language === "hi" ? "hi-IN" : "en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}</span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="farmer-queue__location-btn"
                onClick={handleLocationClick}
              >
                <Navigation size={15} />
                <span>{copy.viewLocation}</span>
              </button>

              {showLocationToast && (
                <div
                  style={{
                    padding: "10px 14px",
                    borderRadius: "12px",
                    background: "var(--farm-soft)",
                    color: "var(--farm-primary)",
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <MapPin size={16} />
                  <span>{copy.locationPinned} ({queueData.mandiLocation})</span>
                </div>
              )}
            </section>
          </>
        )}
      </main>

      {/* Fixed Bottom Navigation with "Queue" item highlighted */}
      <FarmerBottomNav copy={copy} />
    </div>
  );
}
