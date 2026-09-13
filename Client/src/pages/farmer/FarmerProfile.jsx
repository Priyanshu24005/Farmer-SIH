import { createElement, useMemo, useState } from "react";
import { BadgeCheck, ChevronRight, CircleUserRound, Leaf, LockKeyhole, Pencil, Phone, Sprout } from "lucide-react";
import { useNavigate } from "react-router-dom";
import FarmerAuthHeader from "../../components/farmer/FarmerAuthHeader";
import FarmerBottomNav from "../../components/farmer/FarmerBottomNav";
import useFarmerPreferences from "../../components/farmer/useFarmerPreferences";
import { getFarmerProfile } from "../../components/farmer/farmerSession";
import "./farmerBase.css";
import "./farmerProfile.css";

const COPY = {
  en: {
    brandSubtitle: "Kisan Mandi Portal",
    homeLabel: "Farmer-SIH home",
    backLabel: "Back",
    languageLabel: "Choose language",
    useDarkMode: "Use dark mode",
    useLightMode: "Use light mode",
    title: "Profile",
    subtitle: "Your registered Farmer-SIH information",
    verified: "Verified",
    fullName: "Full Name",
    mobile: "Mobile Number",
    aadhaar: "Aadhaar Number",
    crop: "Primary Crop",
    farmerFallback: "Farmer",
    mobileFallback: "+91 Not available",
    aadhaarFallback: "XXXX XXXX 1234",
    cropFallback: "Not available",
    editProfile: "Edit Profile",
    editMessage: "Profile editing will be connected when the Farmer profile API is available.",
    settings: "Settings",
    settingsText: "Manage language, appearance and local notification preferences.",
    help: "Help & Support",
    helpText: "Find answers about slots, queues, payments and your account.",
    accountNote: "Your identity details are protected and shown only for your account.",
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
    title: "प्रोफ़ाइल",
    subtitle: "आपकी पंजीकृत Farmer-SIH जानकारी",
    verified: "सत्यापित",
    fullName: "पूरा नाम",
    mobile: "मोबाइल नंबर",
    aadhaar: "आधार नंबर",
    crop: "मुख्य फसल",
    farmerFallback: "किसान",
    mobileFallback: "+91 उपलब्ध नहीं",
    aadhaarFallback: "XXXX XXXX 1234",
    cropFallback: "उपलब्ध नहीं",
    editProfile: "प्रोफ़ाइल संपादित करें",
    editMessage: "किसान प्रोफ़ाइल API उपलब्ध होने पर प्रोफ़ाइल संपादन जोड़ा जाएगा।",
    settings: "सेटिंग्स",
    settingsText: "भाषा, दिखावट और स्थानीय सूचना प्राथमिकताएं बदलें।",
    help: "सहायता और समर्थन",
    helpText: "स्लॉट, कतार, भुगतान और खाते के बारे में जवाब पाएं।",
    accountNote: "आपकी पहचान संबंधी जानकारी सुरक्षित है और केवल आपके खाते के लिए दिखाई जाती है।",
    navLabel: "किसान नेविगेशन",
    navHome: "होम",
    navBook: "स्लॉट बुक करें",
    navQueue: "कतार",
    navHistory: "इतिहास",
    navPayments: "भुगतान",
  },
};

function maskMobile(value, fallback) {
  const digits = String(value || "").replace(/\D/g, "").slice(-10);
  return digits.length === 10 ? `+91 ${digits.slice(0, 2)}******${digits.slice(-2)}` : fallback;
}

function maskAadhaar(value, fallback) {
  const digits = String(value || "").replace(/\D/g, "");
  return digits.length >= 4 ? `XXXX XXXX ${digits.slice(-4)}` : fallback;
}

export default function FarmerProfile() {
  const { language, setLanguage, theme, toggleTheme } = useFarmerPreferences();
  const navigate = useNavigate();
  const copy = COPY[language] || COPY.en;
  const profile = useMemo(() => getFarmerProfile() || {}, []);
  const [editMessage, setEditMessage] = useState("");

  const name = profile.name?.trim() || copy.farmerFallback;
  const initials = name.slice(0, 1).toUpperCase();
  const mobile = maskMobile(profile.mobile, copy.mobileFallback);
  const aadhaar = maskAadhaar(profile.aadhaar, copy.aadhaarFallback);
  const crop = profile.cropType || copy.cropFallback;

  return (
    <div className={`farmer-welcome farmer-welcome--${theme} farmer-profile`} lang={language === "hi" ? "hi" : "en"}>
      <FarmerAuthHeader copy={copy} language={language} onLanguageChange={setLanguage} theme={theme} onThemeToggle={toggleTheme} backTo="/farmer" />
      <main className="farmer-shell farmer-profile__main" id="farmer-profile-main">
        <header className="farmer-profile__heading">
          <div>
            <p className="farmer-profile__eyebrow"><CircleUserRound size={15} /> Farmer-SIH</p>
            <h1>{copy.title}</h1>
            <p>{copy.subtitle}</p>
          </div>
          <span className="farmer-profile__heading-icon" aria-hidden="true"><UserIcon /></span>
        </header>

        <section className="farmer-profile__identity" aria-label={copy.fullName}>
          <span className="farmer-profile__avatar" aria-hidden="true">{initials}</span>
          <div>
            <h2>{name}</h2>
            <span className="farmer-profile__verified"><BadgeCheck size={15} /> {copy.verified}</span>
          </div>
        </section>

        <section className="farmer-profile__card" aria-labelledby="farmer-profile-information-title">
          <h2 id="farmer-profile-information-title"><LockKeyhole size={18} /> {copy.accountNote}</h2>
          <div className="farmer-profile__fields">
            <ProfileField icon={CircleUserRound} label={copy.fullName} value={name} />
            <ProfileField icon={Phone} label={copy.mobile} value={mobile} status={copy.verified} />
            <ProfileField icon={LockKeyhole} label={copy.aadhaar} value={aadhaar} />
            <ProfileField icon={Leaf} label={copy.crop} value={crop} />
          </div>
        </section>

        <button type="button" className="farmer-profile__edit" onClick={() => setEditMessage(copy.editMessage)}>
          <Pencil size={17} /> {copy.editProfile}
        </button>
        {editMessage && <p className="farmer-profile__notice" role="status">{editMessage}</p>}

        <button type="button" className="farmer-profile__settings-link" onClick={() => navigate("/farmer/settings")}>
          <span className="farmer-profile__settings-icon"><Sprout size={18} /></span>
          <span><strong>{copy.settings}</strong><small>{copy.settingsText}</small></span>
          <ChevronRight size={18} />
        </button>
        <button type="button" className="farmer-profile__settings-link" onClick={() => navigate("/farmer/help", { state: { from: "/farmer/profile" } })}>
          <span className="farmer-profile__settings-icon"><CircleUserRound size={18} /></span>
          <span><strong>{copy.help}</strong><small>{copy.helpText}</small></span>
          <ChevronRight size={18} />
        </button>
      </main>
      <FarmerBottomNav copy={copy} />
    </div>
  );
}

function UserIcon() {
  return <CircleUserRound size={23} />;
}

function ProfileField({ icon: Icon, label, value, status }) {
  return (
    <div className="farmer-profile__field">
      <span className="farmer-profile__field-icon" aria-hidden="true">{createElement(Icon, { size: 17 })}</span>
      <span><small>{label}</small><strong>{value}</strong></span>
      {status && <em><BadgeCheck size={14} /> {status}</em>}
    </div>
  );
}