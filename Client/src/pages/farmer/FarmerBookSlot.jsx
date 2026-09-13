import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  CalendarCheck,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Loader2,
  MapPin,
  Navigation,
  Sprout,
  Users,
  Wheat,
} from "lucide-react";

import FarmerAuthHeader from "../../components/farmer/FarmerAuthHeader";
import useFarmerPreferences from "../../components/farmer/useFarmerPreferences";
import { getFarmerProfile } from "../../components/farmer/farmerSession";
import { getMandis } from "../../api/farmer/farmers";
import { bookToken } from "../../api/farmer/tokens";

import "./farmerBase.css";
import "./farmerLogin.css";
import "./farmerBook.css";

// 5 crops specified in Figma & existing Farmer flow
const CROP_OPTIONS = [
  { id: "Wheat", labelEn: "Wheat", labelHi: "गेहूं", icon: Wheat },
  { id: "Rice", labelEn: "Rice", labelHi: "चावल", icon: Sprout },
  { id: "Maize", labelEn: "Maize", labelHi: "मक्का", icon: Sprout },
  { id: "Mustard", labelEn: "Mustard", labelHi: "सरसों", icon: Sprout },
  { id: "Other", labelEn: "Other", labelHi: "अन्य", icon: Sprout },
];

const COPY = {
  en: {
    brandSubtitle: "Kisan Mandi Portal",
    homeLabel: "KisanSetu home",
    backLabel: "Back",
    languageLabel: "Choose language",
    useDarkMode: "Use dark mode",
    useLightMode: "Use light mode",
    step1: "Crop",
    step2: "Mandi",
    step3: "Date",
    step4: "Confirm",
    step1Title: "Select your crop",
    step1Subtitle: "Choose the primary crop you want to bring for procurement.",
    step2Title: "Select a nearby mandi",
    step2Subtitle: "Choose an active procurement center with slot availability.",
    step3Title: "Choose a date",
    step3Subtitle: "Pick an available date for your mandi delivery.",
    step4Title: "Confirm Booking",
    step4Subtitle: "Review your procurement details before generating your token.",
    successTitle: "Slot Booked Successfully!",
    successSubtitle: "Your token has been generated. Please report on time.",
    demoSuccessSubtitle: "Demo booking complete. Connect live mandi data to receive a real token.",
    tokenLabel: "Your Token Number",
    reportingTime: "Reporting Time",
    reportingTimeVal: "09:00 AM – 11:00 AM",
    continueCta: "Continue",
    confirmCta: "Confirm Booking",
    viewQueueCta: "View Live Queue",
    backHomeCta: "Back to Home",
    loadingMandis: "Loading nearby mandis...",
    noMandis: "No mandis currently open for this crop. Please try later.",
    mandiStatusAvailable: "Available",
    mandiStatusLimited: "Limited slots",
    mandiStatusFull: "Fully booked",
    dailyCapacity: "Daily capacity",
    selectedCrop: "Crop",
    selectedMandi: "Mandi",
    selectedDate: "Date",
    location: "Location",
    farmerName: "Farmer",
    legendAvailable: "Available",
    legendLimited: "Limited",
    legendFull: "Full",
    bookingError: "Unable to confirm booking. Please try again.",
    mandiError: "Unable to load mandis. Please try again.",
    findMandi: "Find a nearby mandi",
    useLocation: "Use my location",
    locationEnabled: "Location permission enabled. Showing available mandi records.",
    locationDenied: "Location is unavailable. You can still search by city, district, or PIN code.",
    locationUnsupported: "Location is not supported here. You can still search manually.",
    enterLocation: "Enter location manually",
    city: "City",
    district: "District",
    pinCode: "PIN code",
    searchMandis: "Search available mandis",
    noMatchingMandis: "No mandis match this location yet.",
    demoMandi: "Demo suggestion",
    liveUnavailable: "Live mandi records are unavailable. Showing demo suggestions for now.",
    demoBookingError: "This demo selection is ready to review, but live mandi data is needed to create a token.",
    demoLocation: "Demo nearby location",
    demoLocationValue: "Sudhowala, Dehradun · 248007",
  },
  hi: {
    brandSubtitle: "किसान मंडी पोर्टल",
    homeLabel: "फार्मर-एसआईएच होम",
    backLabel: "वापस",
    languageLabel: "भाषा चुनें",
    useDarkMode: "डार्क मोड का उपयोग करें",
    useLightMode: "लाइट मोड का उपयोग करें",
    step1: "फसल",
    step2: "मंडी",
    step3: "तारीख",
    step4: "पुष्टि",
    step1Title: "अपनी फसल चुनें",
    step1Subtitle: "वह मुख्य फसल चुनें जिसे आप खरीद के लिए लाना चाहते हैं।",
    step2Title: "नज़दीकी मंडी चुनें",
    step2Subtitle: "उपलब्ध स्लॉट वाला एक सक्रिय खरीद केंद्र चुनें।",
    step3Title: "तारीख चुनें",
    step3Subtitle: "अपनी मंडी डिलीवरी के लिए एक उपलब्ध तारीख चुनें।",
    step4Title: "बुकिंग की पुष्टि करें",
    step4Subtitle: "टोकन जनरेट करने से पहले अपनी खरीद विवरण की समीक्षा करें।",
    successTitle: "स्लॉट सफलतापूर्वक बुक हो गया!",
    successSubtitle: "आपका टोकन जनरेट हो चुका है। कृपया समय पर रिपोर्ट करें।",
    demoSuccessSubtitle: "डेमो बुकिंग पूरी हुई। असली टोकन के लिए लाइव मंडी डेटा से कनेक्ट करें।",
    tokenLabel: "आपका टोकन नंबर",
    reportingTime: "रिपोर्टिंग समय",
    reportingTimeVal: "सुबह 09:00 – 11:00",
    continueCta: "आगे बढ़ें",
    confirmCta: "बुकिंग की पुष्टि करें",
    viewQueueCta: "लाइव कतार देखें",
    backHomeCta: "होम पर वापस जाएं",
    loadingMandis: "नज़दीकी मंडियों की जानकारी लोड हो रही है...",
    noMandis: "इस फसल के लिए वर्तमान में कोई मंडी उपलब्ध नहीं है।",
    mandiStatusAvailable: "उपलब्ध",
    mandiStatusLimited: "सीमित स्लॉट",
    mandiStatusFull: "पूरी तरह बुक",
    dailyCapacity: "दैनिक क्षमता",
    selectedCrop: "फसल",
    selectedMandi: "मंडी",
    selectedDate: "तारीख",
    location: "स्थान",
    farmerName: "किसान",
    legendAvailable: "उपलब्ध",
    legendLimited: "सीमित",
    legendFull: "पूर्ण",
    bookingError: "बुकिंग की पुष्टि नहीं हो सकी। कृपया पुनः प्रयास करें।",
    mandiError: "मंडियां लोड नहीं हो सकीं। कृपया पुनः प्रयास करें।",
    findMandi: "नज़दीकी मंडी खोजें",
    useLocation: "मेरी लोकेशन का उपयोग करें",
    locationEnabled: "लोकेशन की अनुमति मिल गई। उपलब्ध मंडी रिकॉर्ड दिखाए जा रहे हैं।",
    locationDenied: "लोकेशन उपलब्ध नहीं है। आप शहर, ज़िले या पिन कोड से खोज सकते हैं।",
    locationUnsupported: "यहां लोकेशन समर्थित नहीं है। आप मैन्युअल रूप से खोज सकते हैं।",
    enterLocation: "लोकेशन मैन्युअल रूप से लिखें",
    city: "शहर",
    district: "ज़िला",
    pinCode: "पिन कोड",
    searchMandis: "उपलब्ध मंडियां खोजें",
    noMatchingMandis: "इस लोकेशन से मेल खाती मंडी नहीं मिली।",
    demoMandi: "डेमो सुझाव",
    liveUnavailable: "लाइव मंडी रिकॉर्ड उपलब्ध नहीं हैं। अभी डेमो सुझाव दिखाए जा रहे हैं।",
    demoBookingError: "यह डेमो चयन समीक्षा के लिए तैयार है, लेकिन टोकन बनाने के लिए लाइव मंडी डेटा चाहिए।",
    demoLocation: "डेमो नज़दीकी लोकेशन",
    demoLocationValue: "सुधोवाला, देहरादून · 248007",
  },
};

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function FarmerBookSlot() {
  const { language, setLanguage, theme, toggleTheme } = useFarmerPreferences();
  const navigate = useNavigate();
  const copy = COPY[language] || COPY.en;

  // Wizard step: 1 = Crop, 2 = Mandi, 3 = Date, 4 = Confirm, 5 = Success
  const [step, setStep] = useState(1);

  // Booking selections
  const [selectedCrop, setSelectedCrop] = useState("");
  const [selectedMandi, setSelectedMandi] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  // Calendar month state
  const [currentMonth, setCurrentMonth] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  // Mandis API state
  const [mandis, setMandis] = useState([]);
  const [loadingMandis, setLoadingMandis] = useState(false);
  const [mandiError, setMandiError] = useState(false);
  const [locationStatus, setLocationStatus] = useState("idle");
  const [userCoordinates, setUserCoordinates] = useState(null);
  const [manualLocation, setManualLocation] = useState({ city: "", district: "", pinCode: "" });

  // Booking submit state
  const [submitting, setSubmitting] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);
  const [bookingError, setBookingError] = useState("");

  const farmerProfile = useMemo(() => getFarmerProfile(), []);

  const locationTerms = useMemo(
    () => Object.values(manualLocation).map((value) => value.trim().toLowerCase()).filter(Boolean),
    [manualLocation]
  );

  const getCoordinates = (mandi) => {
    const latitude = Number(mandi.latitude ?? mandi.coordinates?.latitude ?? mandi.coordinates?.lat);
    const longitude = Number(mandi.longitude ?? mandi.coordinates?.longitude ?? mandi.coordinates?.lng);
    return Number.isFinite(latitude) && Number.isFinite(longitude) ? { latitude, longitude } : null;
  };

  const distanceSquared = (first, second) => ((first.latitude - second.latitude) ** 2) + ((first.longitude - second.longitude) ** 2);

  const visibleMandis = useMemo(() => {
    const matches = locationTerms.length === 0 ? mandis : mandis.filter((mandi) => {
      const haystack = [mandi.name, mandi.location, mandi.address, mandi.city, mandi.district, mandi.pinCode, mandi.pincode]
        .filter(Boolean).join(" ").toLowerCase();
      return locationTerms.some((term) => haystack.includes(term));
    });

    return [...matches].sort((first, second) => {
      if (userCoordinates) {
        const firstCoordinates = getCoordinates(first);
        const secondCoordinates = getCoordinates(second);
        if (firstCoordinates && secondCoordinates) return distanceSquared(firstCoordinates, userCoordinates) - distanceSquared(secondCoordinates, userCoordinates);
        if (firstCoordinates) return -1;
        if (secondCoordinates) return 1;
      }
      return 0;
    });
  }, [locationTerms, mandis, userCoordinates]);

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus("unsupported");
      return;
    }
    setLocationStatus("requesting");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserCoordinates({ latitude, longitude });
        setLocationStatus("available");
      },
      () => setLocationStatus("denied"),
      { enableHighAccuracy: false, maximumAge: 300000, timeout: 8000 }
    );
  };

  const handleDemoLocation = () => {
    setManualLocation({ city: "Sudhowala", district: "Dehradun", pinCode: "248007" });
    setSelectedMandi(null);
    setLocationStatus("idle");
  };

  // Fetch the shared Admin-managed mandi collection.
  useEffect(() => {
    let isMounted = true;
    async function load() {
      setLoadingMandis(true);
      try {
        const data = await getMandis();
        const list = Array.isArray(data) ? data : data?.mandis || [];
        if (isMounted) {
          const nextMandis = list.length ? list.map((m) => {
            const capacity = Number(m.dailyCapacity);
            const count = Number(m.currentTokenCount || 0);
            const status = Number.isFinite(capacity) && capacity > 0
              ? count >= capacity ? "full" : count >= capacity * 0.75 ? "limited" : "available"
              : undefined;
            return { ...m, status };
          }) : [];
          setMandis(nextMandis);
          setSelectedMandi(list[0] || null);
          setMandiError(false);
        }
      } catch {
        if (isMounted) {
          setMandis([]);
          setSelectedMandi(null);
          setMandiError(true);
        }
      } finally {
        if (isMounted) setLoadingMandis(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleMandiSelect = (mandi) => {
    if (mandi.status === "full") return;
    setSelectedMandi(mandi);
  };

  // Handle header back navigation
  const handleBack = () => {
    if (step === 1) {
      navigate("/farmer");
    } else if (step === 5) {
      navigate("/farmer");
    } else {
      setStep((prev) => prev - 1);
    }
  };

  // Calendar calculations
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const days = [];
    // Leading empty slots
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Days in current month
    for (let d = 1; d <= totalDays; d++) {
      const dateObj = new Date(year, month, d);
      dateObj.setHours(0, 0, 0, 0);

      const isPast = dateObj < today;
      const isToday = dateObj.getTime() === today.getTime();

      days.push({
        dayNumber: d,
        dateObj,
        isPast,
        isToday,
        availability: "available",
      });
    }

    return days;
  }, [currentMonth]);

  const handleMonthPrev = () => {
    setCurrentMonth((curr) => new Date(curr.getFullYear(), curr.getMonth() - 1, 1));
  };

  const handleMonthNext = () => {
    setCurrentMonth((curr) => new Date(curr.getFullYear(), curr.getMonth() + 1, 1));
  };

  const formatApiDate = (date) => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Confirm booking handler
  const handleConfirmBooking = async () => {
    setSubmitting(true);
    setBookingError("");

    const farmerId = farmerProfile?._id || farmerProfile?.id;
    const mandiId = selectedMandi?._id;
    const bookingDateStr = formatApiDate(selectedDate);
    if (!farmerId || !/^[0-9a-fA-F]{24}$/.test(farmerId) || !mandiId || !/^[0-9a-fA-F]{24}$/.test(mandiId) || !bookingDateStr) {
      setBookingError(copy.bookingError);
      setSubmitting(false);
      return;
    }

    try {
      const createdToken = await bookToken({ farmer: farmerId, mandi: mandiId, date: bookingDateStr });
      setBookingResult(createdToken);
      setStep(5);
    } catch (err) {
      setBookingError(err.response?.data?.message || copy.bookingError);
    } finally {
      setSubmitting(false);
    }
  };

  const formatDisplayDate = (d) => {
    if (!d) return "";
    return d.toLocaleDateString(language === "hi" ? "hi-IN" : "en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className={`farmer-welcome farmer-welcome--${theme}`} lang={language === "hi" ? "hi" : "en"}>
      <FarmerAuthHeader
        copy={copy}
        language={language}
        onLanguageChange={setLanguage}
        theme={theme}
        onThemeToggle={toggleTheme}
        backTo="/farmer"
      />

      <main className="farmer-shell farmer-auth" id="farmer-book-main">
        <section className="farmer-auth__card farmer-book__card" aria-labelledby="farmer-book-title">
          {/* Progress bar (Steps 1 to 4) */}
          {step < 5 && (
            <div className="farmer-progress" aria-label="Booking Progress">
              <div className="farmer-progress__track">
                <div
                  className="farmer-progress__bar"
                  style={{ width: `${((step - 1) / 3) * 100}%` }}
                />
              </div>

              {[
                { s: 1, label: copy.step1 },
                { s: 2, label: copy.step2 },
                { s: 3, label: copy.step3 },
                { s: 4, label: copy.step4 },
              ].map(({ s, label }) => {
                const isActive = step === s;
                const isComplete = step > s;
                return (
                  <div
                    key={s}
                    className={`farmer-progress__step ${isActive ? "is-active" : ""} ${isComplete ? "is-complete" : ""}`}
                  >
                    <span className="farmer-progress__circle">
                      {isComplete ? <Check size={16} strokeWidth={3} /> : s}
                    </span>
                    <span className="farmer-progress__label">{label}</span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Active selection summary context tags for steps > 1 and < 5 */}
          {step > 1 && step < 5 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "14px" }}>
              {selectedCrop && (
                <span className="farmer-context-badge">
                  <Wheat size={14} />
                  <span>{copy.selectedCrop}: <strong>{selectedCrop}</strong></span>
                </span>
              )}
              {selectedMandi && step > 2 && (
                <span className="farmer-context-badge">
                  <MapPin size={14} />
                  <span>{copy.selectedMandi}: <strong>{selectedMandi.name}</strong></span>
                </span>
              )}
              {selectedDate && step > 3 && (
                <span className="farmer-context-badge">
                  <Calendar size={14} />
                  <span>{copy.selectedDate}: <strong>{formatDisplayDate(selectedDate)}</strong></span>
                </span>
              )}
            </div>
          )}

          {/* STEP 1: SELECT CROP */}
          {step === 1 && (
            <div>
              <div className="farmer-auth__intro">
                <h1 id="farmer-book-title">{copy.step1Title}</h1>
                <p>{copy.step1Subtitle}</p>
              </div>

              <div className="farmer-crop-grid">
                {CROP_OPTIONS.map((c) => {
                  const isSelected = selectedCrop === c.id;
                  const IconComponent = c.icon;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      className={`farmer-crop-card ${isSelected ? "is-selected" : ""}`}
                      onClick={() => setSelectedCrop(c.id)}
                      aria-pressed={isSelected}
                    >
                      {isSelected && (
                        <span className="farmer-crop-card__check" aria-hidden="true">
                          <CheckCircle2 size={18} />
                        </span>
                      )}
                      <div className="farmer-crop-card__icon">
                        <IconComponent size={24} />
                      </div>
                      <span className="farmer-crop-card__name">
                        {language === "hi" ? c.labelHi : c.labelEn}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div style={{ marginTop: "28px" }}>
                <button
                  type="button"
                  className="farmer-primary-cta"
                  disabled={!selectedCrop}
                  onClick={() => setStep(2)}
                >
                  {copy.continueCta}
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: SELECT MANDI */}
          {step === 2 && (
            <div>
              <div className="farmer-auth__intro">
                <h1 id="farmer-book-title">{copy.step2Title}</h1>
                <p>{copy.step2Subtitle}</p>
              </div>

              <section className="farmer-mandi-finder" aria-label={copy.findMandi}>
                <div className="farmer-mandi-finder__heading"><span className="farmer-mandi-finder__icon"><Navigation size={18} /></span><div><h2>{copy.findMandi}</h2><p>{copy.searchMandis}</p></div></div>
                <button type="button" className="farmer-mandi-finder__location" onClick={handleUseLocation} disabled={locationStatus === "requesting"}><Navigation size={16} /> {locationStatus === "requesting" ? copy.loadingMandis : copy.useLocation}</button>
                {locationStatus === "available" && <p className="farmer-mandi-finder__message is-success">{copy.locationEnabled}</p>}
                {locationStatus === "denied" && <p className="farmer-mandi-finder__message">{copy.locationDenied}</p>}
                {locationStatus === "unsupported" && <p className="farmer-mandi-finder__message">{copy.locationUnsupported}</p>}
                <p className="farmer-mandi-finder__manual-label">{copy.enterLocation}</p>
                <button type="button" className="farmer-mandi-finder__demo" onClick={handleDemoLocation}><MapPin size={15} /> <span><strong>{copy.demoLocation}</strong><small>{copy.demoLocationValue}</small></span></button>
                <div className="farmer-mandi-finder__fields">
                  {[["city", copy.city], ["district", copy.district], ["pinCode", copy.pinCode]].map(([field, label]) => <label key={field}><span>{label}</span><input value={manualLocation[field]} onChange={(event) => setManualLocation((current) => ({ ...current, [field]: event.target.value }))} placeholder={label} inputMode={field === "pinCode" ? "numeric" : "text"} /></label>)}
                </div>
                {mandiError && <button type="button" className="farmer-mandi-finder__retry" onClick={() => window.location.reload()}>Retry</button>}
              </section>

              {loadingMandis ? (
                <div style={{ padding: "36px 0", textAlign: "center", color: "var(--farm-muted)" }}>
                  <Loader2 size={28} className="farmer-spin" style={{ margin: "0 auto 12px" }} />
                  <p>{copy.loadingMandis}</p>
                </div>
              ) : visibleMandis.length === 0 ? (
                <div style={{ padding: "28px 0", textAlign: "center", color: "var(--farm-muted)" }}>
                  <p>{mandis.length === 0 ? copy.noMandis : copy.noMatchingMandis}</p>
                </div>
              ) : (
                <div className="farmer-mandi-list">
                  {visibleMandis.map((mandi) => {
                    const isSelected = mandi._id ? selectedMandi?._id === mandi._id : selectedMandi === mandi;
                    const isFull = mandi.status === "full";
                    let badgeClass = "";
                    let badgeLabel = "";
                    if (mandi.status === "limited") {
                      badgeClass = "farmer-mandi-card__badge--limited";
                      badgeLabel = copy.mandiStatusLimited;
                    } else if (isFull) {
                      badgeClass = "farmer-mandi-card__badge--full";
                      badgeLabel = copy.mandiStatusFull;
                    }

                    return (
                      <button
                        key={mandi._id || mandi.name}
                        type="button"
                        disabled={isFull}
                        className={`farmer-mandi-card ${isSelected ? "is-selected" : ""} ${isFull ? "is-disabled" : ""}`}
                        onClick={() => !isFull && handleMandiSelect(mandi)}
                        aria-pressed={isSelected}
                      >
                        <div className="farmer-mandi-card__header">
                          <span className="farmer-mandi-card__name">{mandi.name}</span>
                          {locationTerms.length > 0 && <span className="farmer-mandi-card__suggested">Suggested for your location</span>}
                          <span className={`farmer-mandi-card__badge ${badgeClass}`}>
                            {badgeLabel}
                          </span>
                        </div>

                        <div className="farmer-mandi-card__meta">
                          <span className="farmer-mandi-card__meta-item">
                            <MapPin size={14} />
                            <span>{mandi.location}</span>
                          </span>
                          <span className="farmer-mandi-card__meta-item">
                            <Users size={14} />
                            {mandi.dailyCapacity != null && <span>{copy.dailyCapacity}: {mandi.dailyCapacity}</span>}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              <div style={{ marginTop: "24px", display: "flex", gap: "10px" }}>
                <button
                  type="button"
                  className="farmer-secondary-cta"
                  style={{ width: "35%" }}
                  onClick={handleBack}
                >
                  {copy.backLabel}
                </button>
                <button
                  type="button"
                  className="farmer-primary-cta"
                  style={{ width: "65%" }}
                  disabled={!selectedMandi || !visibleMandis.some((mandi) =>
                    mandi === selectedMandi || (mandi._id && mandi._id === selectedMandi._id)
                  )}
                  onClick={() => setStep(3)}
                >
                  {copy.continueCta}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: CHOOSE DATE */}
          {step === 3 && (
            <div>
              <div className="farmer-auth__intro">
                <h1 id="farmer-book-title">{copy.step3Title}</h1>
                <p>{copy.step3Subtitle}</p>
              </div>

              <div className="farmer-calendar">
                <div className="farmer-calendar__header">
                  <button
                    type="button"
                    className="farmer-calendar__nav-btn"
                    onClick={handleMonthPrev}
                    aria-label="Previous month"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <span className="farmer-calendar__month-title">
                    {currentMonth.toLocaleDateString(language === "hi" ? "hi-IN" : "en-IN", {
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                  <button
                    type="button"
                    className="farmer-calendar__nav-btn"
                    onClick={handleMonthNext}
                    aria-label="Next month"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>

                <div className="farmer-calendar__weekdays">
                  {WEEKDAYS.map((w) => (
                    <div key={w}>{w}</div>
                  ))}
                </div>

                <div className="farmer-calendar__grid">
                  {calendarDays.map((item, idx) => {
                    if (!item) {
                      return <div key={`empty-${idx}`} style={{ aspectRatio: 1 }} />;
                    }

                    const isSelected =
                      selectedDate &&
                      selectedDate.getFullYear() === item.dateObj.getFullYear() &&
                      selectedDate.getMonth() === item.dateObj.getMonth() &&
                      selectedDate.getDate() === item.dateObj.getDate();

                    const isUnselectable = item.isPast || item.availability === "full";

                    return (
                      <button
                        key={item.dayNumber}
                        type="button"
                        disabled={isUnselectable}
                        className={`farmer-calendar__day ${isSelected ? "is-selected" : ""} ${item.isToday ? "is-today" : ""} ${item.isPast ? "is-disabled" : ""} ${item.availability === "full" ? "is-full" : ""}`}
                        onClick={() => !isUnselectable && setSelectedDate(item.dateObj)}
                      >
                        <span>{item.dayNumber}</span>
                        {!item.isPast && (
                          <span
                            className={`farmer-calendar__day-dot farmer-calendar__day-dot--${item.availability}`}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="farmer-calendar__legend">
                  <span className="farmer-calendar__legend-item">
                    <span className="farmer-calendar__day-dot farmer-calendar__day-dot--available" />
                    <span>{copy.legendAvailable}</span>
                  </span>
                  <span className="farmer-calendar__legend-item">
                    <span className="farmer-calendar__day-dot farmer-calendar__day-dot--limited" />
                    <span>{copy.legendLimited}</span>
                  </span>
                  <span className="farmer-calendar__legend-item">
                    <span className="farmer-calendar__day-dot farmer-calendar__day-dot--full" />
                    <span>{copy.legendFull}</span>
                  </span>
                </div>
              </div>

              <div style={{ marginTop: "24px", display: "flex", gap: "10px" }}>
                <button
                  type="button"
                  className="farmer-secondary-cta"
                  style={{ width: "35%" }}
                  onClick={handleBack}
                >
                  {copy.backLabel}
                </button>
                <button
                  type="button"
                  className="farmer-primary-cta"
                  style={{ width: "65%" }}
                  disabled={!selectedDate}
                  onClick={() => setStep(4)}
                >
                  {copy.continueCta}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: CONFIRM BOOKING */}
          {step === 4 && (
            <div>
              <div className="farmer-auth__intro">
                <h1 id="farmer-book-title">{copy.step4Title}</h1>
                <p>{copy.step4Subtitle}</p>
              </div>

              <div className="farmer-confirm-summary">
                <div className="farmer-confirm-item">
                  <span className="farmer-confirm-item__label">{copy.farmerName}</span>
                  <span className="farmer-confirm-item__value">
                    {farmerProfile?.name || "Kisan Mitr"}
                  </span>
                </div>
                <div className="farmer-confirm-item">
                  <span className="farmer-confirm-item__label">{copy.selectedCrop}</span>
                  <span className="farmer-confirm-item__value">{selectedCrop}</span>
                </div>
                <div className="farmer-confirm-item">
                  <span className="farmer-confirm-item__label">{copy.selectedMandi}</span>
                  <span className="farmer-confirm-item__value">{selectedMandi?.name}</span>
                </div>
                <div className="farmer-confirm-item">
                  <span className="farmer-confirm-item__label">{copy.location}</span>
                  <span className="farmer-confirm-item__value">{selectedMandi?.location}</span>
                </div>
                <div className="farmer-confirm-item">
                  <span className="farmer-confirm-item__label">{copy.selectedDate}</span>
                  <span className="farmer-confirm-item__value">{formatDisplayDate(selectedDate)}</span>
                </div>
                <div className="farmer-confirm-item">
                  <span className="farmer-confirm-item__label">{copy.reportingTime}</span>
                  <span className="farmer-confirm-item__value">{copy.reportingTimeVal}</span>
                </div>
              </div>

              {bookingError && (
                <p className="farmer-field__error" role="alert" style={{ marginBottom: "14px" }}>
                  {bookingError}
                </p>
              )}

              <div style={{ marginTop: "24px", display: "flex", gap: "10px" }}>
                <button
                  type="button"
                  className="farmer-secondary-cta"
                  style={{ width: "35%" }}
                  onClick={handleBack}
                >
                  {copy.backLabel}
                </button>
                <button
                  type="button"
                  className="farmer-primary-cta"
                  style={{ width: "65%" }}
                  disabled={submitting}
                  onClick={handleConfirmBooking}
                >
                  {submitting ? (
                    <>
                      <Loader2 size={19} className="farmer-spin" aria-hidden="true" />
                      <span>{copy.confirmCta}...</span>
                    </>
                  ) : (
                    <span>{copy.confirmCta}</span>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: TOKEN GENERATED SUCCESS */}
          {step === 5 && (
            <div className="farmer-token-card">
              <span className="farmer-token-badge">
                <CalendarCheck size={36} />
              </span>

              <h1 id="farmer-book-title" style={{ fontSize: "1.7rem", fontWeight: 800, margin: "0 0 8px" }}>
                {copy.successTitle}
              </h1>
              <p style={{ margin: "0 auto", color: "var(--farm-muted)", fontSize: "0.95rem", maxWidth: "380px" }}>
                {bookingResult?.demo ? copy.demoSuccessSubtitle : copy.successSubtitle}
              </p>

              {/* Large Token Box */}
              <div className="farmer-token-number-box">
                <div className="farmer-token-number-label">{copy.tokenLabel}</div>
                <div className="farmer-token-number">
                  #{bookingResult?.tokenNumber || "—"}
                </div>
              </div>

              {/* Details review card */}
              <div className="farmer-token-details">
                <div className="farmer-confirm-item">
                  <span className="farmer-confirm-item__label">{copy.selectedCrop}</span>
                  <span className="farmer-confirm-item__value">{selectedCrop}</span>
                </div>
                <div className="farmer-confirm-item">
                  <span className="farmer-confirm-item__label">{copy.selectedMandi}</span>
                  <span className="farmer-confirm-item__value">{selectedMandi?.name}</span>
                </div>
                <div className="farmer-confirm-item">
                  <span className="farmer-confirm-item__label">{copy.selectedDate}</span>
                  <span className="farmer-confirm-item__value">{formatDisplayDate(selectedDate)}</span>
                </div>
                <div className="farmer-confirm-item">
                  <span className="farmer-confirm-item__label">{copy.reportingTime}</span>
                  <span className="farmer-confirm-item__value">{copy.reportingTimeVal}</span>
                </div>
                <div className="farmer-confirm-item">
                  <span className="farmer-confirm-item__label">{copy.location}</span>
                  <span className="farmer-confirm-item__value">{selectedMandi?.location}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="farmer-token-actions">
                <button
                  type="button"
                  className="farmer-primary-cta"
                  onClick={() => navigate("/farmer/queue")}
                >
                  <Clock size={18} />
                  <span>{copy.viewQueueCta}</span>
                </button>
                <button
                  type="button"
                  className="farmer-secondary-cta"
                  onClick={() => navigate("/farmer")}
                >
                  {copy.backHomeCta}
                </button>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
