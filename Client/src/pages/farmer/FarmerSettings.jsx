import { createElement, useState } from "react";
import { Bell, Check, ChevronRight, CircleHelp, Globe2, LogOut, Moon, ShieldCheck, Smartphone, Sun, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import FarmerAuthHeader from "../../components/farmer/FarmerAuthHeader";
import FarmerBottomNav from "../../components/farmer/FarmerBottomNav";
import useFarmerPreferences from "../../components/farmer/useFarmerPreferences";
import { clearFarmerSession, getFarmerProfile } from "../../components/farmer/farmerSession";
import "./farmerBase.css";
import "./farmerSettings.css";

const COPY = {
  en: { brandSubtitle: "Kisan Mandi Portal", homeLabel: "Farmer-SIH home", backLabel: "Back", languageLabel: "Choose language", useDarkMode: "Use dark mode", useLightMode: "Use light mode", title: "Settings", subtitle: "Personalize your Farmer-SIH experience", language: "Language", appearance: "Appearance", notifications: "Notifications", account: "Account", english: "English", hindi: "हिंदी", light: "Light", dark: "Dark", sms: "SMS Alerts", smsText: "Receive important updates by SMS", push: "Push Notifications", pushText: "Receive browser notifications", mobile: "Mobile Number", verified: "Verified", aadhaar: "Aadhaar", maskedAadhaar: "XXXX XXXX 1234", crop: "Primary Crop", cropFallback: "Not available", logout: "Logout", deleteAccount: "Delete Account", deleteMessage: "Account deletion will be available after a secure backend flow is added.", help: "Help & Support", helpText: "Find answers about slots, queues and payments.", navLabel: "Farmer navigation", navHome: "Home", navBook: "Book Slot", navQueue: "Queue", navHistory: "History", navPayments: "Payments" },
  hi: { brandSubtitle: "किसान मंडी पोर्टल", homeLabel: "फार्मर-एसआईएच होम", backLabel: "वापस", languageLabel: "भाषा चुनें", useDarkMode: "डार्क मोड का उपयोग करें", useLightMode: "लाइट मोड का उपयोग करें", title: "सेटिंग्स", subtitle: "अपने Farmer-SIH अनुभव को बदलें", language: "भाषा", appearance: "दिखावट", notifications: "सूचनाएं", account: "खाता", english: "English", hindi: "हिंदी", light: "लाइट", dark: "डार्क", sms: "SMS अलर्ट", smsText: "SMS से महत्वपूर्ण अपडेट प्राप्त करें", push: "पुश सूचनाएं", pushText: "ब्राउज़र सूचनाएं प्राप्त करें", mobile: "मोबाइल नंबर", verified: "सत्यापित", aadhaar: "आधार", maskedAadhaar: "XXXX XXXX 1234", crop: "मुख्य फसल", cropFallback: "उपलब्ध नहीं", logout: "लॉगआउट", deleteAccount: "खाता हटाएं", deleteMessage: "सुरक्षित बैकएंड प्रक्रिया जोड़ने के बाद खाता हटाना उपलब्ध होगा।", help: "सहायता और समर्थन", helpText: "स्लॉट, कतार और भुगतान के बारे में जवाब पाएं।", navLabel: "किसान नेविगेशन", navHome: "होम", navBook: "स्लॉट बुक करें", navQueue: "कतार", navHistory: "इतिहास", navPayments: "भुगतान" },
};

function maskMobile(value, fallback) { const digits = String(value || "").replace(/\D/g, "").slice(-10); return digits.length === 10 ? `+91 ${digits.slice(0, 2)}******${digits.slice(-2)}` : fallback; }
function maskAadhaar(value, fallback) { const digits = String(value || "").replace(/\D/g, ""); return digits.length >= 4 ? `XXXX XXXX ${digits.slice(-4)}` : fallback; }

export default function FarmerSettings() {
  const { language, setLanguage, theme, setTheme, toggleTheme } = useFarmerPreferences();
  const navigate = useNavigate();
  const copy = COPY[language] || COPY.en;
  const profile = getFarmerProfile() || {};
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [deleteMessage, setDeleteMessage] = useState("");
  const mobile = maskMobile(profile.mobile, language === "hi" ? "+91 उपलब्ध नहीं" : "+91 Not available");
  const aadhaar = maskAadhaar(profile.aadhaar, copy.maskedAadhaar);

  const logout = () => { clearFarmerSession(); navigate("/farmer/welcome", { replace: true }); };

  return (
    <div className={`farmer-welcome farmer-welcome--${theme} farmer-settings`} lang={language === "hi" ? "hi" : "en"}>
      <FarmerAuthHeader copy={copy} language={language} onLanguageChange={setLanguage} theme={theme} onThemeToggle={toggleTheme} backTo="/farmer/profile" />
      <main className="farmer-shell farmer-settings__main" id="farmer-settings-main">
        <header className="farmer-settings__heading"><div><p className="farmer-settings__eyebrow"><ShieldCheck size={15} /> Farmer-SIH</p><h1>{copy.title}</h1><p>{copy.subtitle}</p></div><span className="farmer-settings__heading-icon"><ShieldCheck size={23} /></span></header>
        <SettingsSection title={copy.language} icon={Globe2}>
          <div className="farmer-settings__segmented"><button type="button" className={language === "en" ? "is-active" : ""} onClick={() => setLanguage("en")} aria-pressed={language === "en"}>{copy.english}</button><button type="button" className={language === "hi" ? "is-active" : ""} onClick={() => setLanguage("hi")} aria-pressed={language === "hi"}>{copy.hindi}</button></div>
        </SettingsSection>
        <SettingsSection title={copy.appearance} icon={theme === "dark" ? Moon : Sun}>
          <div className="farmer-settings__segmented"><button type="button" className={theme === "light" ? "is-active" : ""} onClick={() => setTheme("light")} aria-pressed={theme === "light"}><Sun size={16} /> {copy.light}</button><button type="button" className={theme === "dark" ? "is-active" : ""} onClick={() => setTheme("dark")} aria-pressed={theme === "dark"}><Moon size={16} /> {copy.dark}</button></div>
        </SettingsSection>
        <SettingsSection title={copy.notifications} icon={Bell}>
          <SettingToggle icon={Smartphone} title={copy.sms} description={copy.smsText} checked={smsAlerts} onChange={() => setSmsAlerts((value) => !value)} />
          <SettingToggle icon={Bell} title={copy.push} description={copy.pushText} checked={pushNotifications} onChange={() => setPushNotifications((value) => !value)} />
        </SettingsSection>
        <SettingsSection title={copy.account} icon={ShieldCheck}>
          <div className="farmer-settings__account"><SettingValue label={copy.mobile} value={mobile} status={copy.verified} /><SettingValue label={copy.aadhaar} value={aadhaar} /><SettingValue label={copy.crop} value={profile.cropType || copy.cropFallback} /></div>
          <button type="button" className="farmer-settings__logout" onClick={logout}><LogOut size={17} /> {copy.logout}</button>
        </SettingsSection>
        <section className="farmer-settings__danger"><div><h2><Trash2 size={17} /> {copy.deleteAccount}</h2>{deleteMessage && <p role="status">{deleteMessage}</p>}</div><button type="button" onClick={() => setDeleteMessage(copy.deleteMessage)}>{copy.deleteAccount}</button></section>
        <button type="button" className="farmer-settings__help-link" onClick={() => navigate("/farmer/help", { state: { from: "/farmer/settings" } })}><CircleHelp size={17} /> {copy.help}<ChevronRight size={17} /></button>
      </main>
      <FarmerBottomNav copy={copy} />
    </div>
  );
}

function SettingsSection({ title, icon: Icon, children }) { return <section className="farmer-settings__section"><h2>{createElement(Icon, { size: 18 })} {title}</h2>{children}</section>; }
function SettingToggle({ icon: Icon, title, description, checked, onChange }) { return <div className="farmer-settings__toggle-row"><span className="farmer-settings__toggle-icon">{createElement(Icon, { size: 17 })}</span><span><strong>{title}</strong><small>{description}</small></span><button type="button" className={`farmer-settings__switch ${checked ? "is-on" : ""}`} onClick={onChange} aria-pressed={checked} aria-label={title}><span>{checked && <Check size={13} />}</span></button></div>; }
function SettingValue({ label, value, status }) { return <div className="farmer-settings__value"><span><small>{label}</small><strong>{value}</strong></span>{status && <em>{status}</em>}</div>; }