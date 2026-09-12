import { CalendarDays, ListOrdered, Moon, Sun, Wallet } from "lucide-react";
import FarmerBenefitCard from "../../components/farmer/FarmerBenefitCard";
import FarmerFooter from "../../components/farmer/FarmerFooter";
import FarmerHero from "../../components/farmer/FarmerHero";
import FarmerTrustSection from "../../components/farmer/FarmerTrustSection";
import FarmerWelcomeHeader from "../../components/farmer/FarmerWelcomeHeader";
import useFarmerPreferences from "../../components/farmer/useFarmerPreferences";
import "./farmerWelcome.css";


const COPY = {
  en: {
    govStrip: "Government of India • Kisan E-Procurement",
    themeDark: "Dark",
    themeLight: "Light",
    brandSubtitle: "Kisan Mandi Portal",
    homeLabel: "Farmer-SIH home",
    setuLabel: "SETU digital service",
    languageLabel: "Choose language",
    useDarkMode: "Use dark mode",
    useLightMode: "Use light mode",
    heroArtLabel: "A farmer standing in a green procurement field",
    heroAssurance: "Official MSP & Mandi Assurance",
    heroDirect: "100% Direct",
    heroTitle: "Your Procurement, Made Simple",
    heroDescription: "Book your procurement slot, track your queue, and check your payments — all in one place.",
    loginCta: "Login / Register",
    adminLoginCta: "Login as Admin",
    helplineLabel: "Kisan Toll-Free Helpline",
    helpEyebrow: "HOW FARMER-SIH HELPS YOU",
    helpBadge: "3 Simple Steps",
    benefits: [
      { title: "Book a Slot", description: "Choose your crop, mandi and date. No long queues at the center." },
      { title: "Track Your Queue", description: "Know your position and estimated wait time live on your phone." },
      { title: "Track Payments", description: "See your procurement payments in one place directly into your bank account." },
    ],
    trustAria: "Farmer-SIH assurances",
    trustItems: [
      { title: "100% DBT", description: "Direct Bank Transfer" },
      { title: "MSP Guaranteed", description: "Fair Government Price" },
      { title: "SMS Alert", description: "Realtime Updates" },
    ],
    ministry: "Ministry of Agriculture & Farmers Welfare",
    hackathon: "Smart India Hackathon",
    mobileApp: "Farmer Mobile App",
    accessible: "Accessible for all devices",
  },
  hi: {
    govStrip: "भारत सरकार • किसान ई-खरीद",
    themeDark: "डार्क",
    themeLight: "लाइट",
    brandSubtitle: "किसान मंडी पोर्टल",
    homeLabel: "फार्मर-एसआईएच होम",
    setuLabel: "सेतु डिजिटल सेवा",
    languageLabel: "भाषा चुनें",
    useDarkMode: "डार्क मोड का उपयोग करें",
    useLightMode: "लाइट मोड का उपयोग करें",
    heroArtLabel: "हरित खरीद क्षेत्र में खड़ा एक किसान",
    heroAssurance: "आधिकारिक एमएसपी एवं मंडी आश्वासन",
    heroDirect: "100% प्रत्यक्ष",
    heroTitle: "आपकी खरीद, अब आसान",
    heroDescription: "अपना खरीद स्लॉट बुक करें, अपनी कतार देखें और भुगतान की जानकारी — सब एक ही जगह।",
    loginCta: "लॉगिन / पंजीकरण",
    adminLoginCta: "एडमिन के रूप में लॉगिन करें",
    helplineLabel: "किसान टोल-फ्री हेल्पलाइन",
    helpEyebrow: "FARMER-SIH आपकी कैसे मदद करता है",
    helpBadge: "3 आसान चरण",
    benefits: [
      { title: "स्लॉट बुक करें", description: "अपनी फसल, मंडी और तारीख चुनें। केंद्र पर लंबी कतार नहीं।" },
      { title: "अपनी कतार देखें", description: "फोन पर अपनी स्थिति और अनुमानित प्रतीक्षा समय जानें।" },
      { title: "भुगतान देखें", description: "खरीद भुगतान की जानकारी सीधे अपने बैंक खाते के लिए एक जगह देखें।" },
    ],
    trustAria: "फार्मर-एसआईएच आश्वासन",
    trustItems: [
      { title: "100% डीबीटी", description: "सीधे बैंक खाते में" },
      { title: "एमएसपी गारंटी", description: "उचित सरकारी मूल्य" },
      { title: "एसएमएस अलर्ट", description: "रीयल-टाइम अपडेट" },
    ],
    ministry: "कृषि एवं किसान कल्याण मंत्रालय",
    hackathon: "स्मार्ट इंडिया हैकाथॉन",
    mobileApp: "किसान मोबाइल ऐप",
    accessible: "सभी उपकरणों के लिए सुलभ",
  },
};

export default function FarmerWelcome() {
  const { language, setLanguage, theme, toggleTheme } = useFarmerPreferences();
  const copy = COPY[language] || COPY.en;

  const benefitIcons = [CalendarDays, ListOrdered, Wallet];

  return (
    <div className={`farmer-welcome farmer-welcome--${theme}`} lang={language === "hi" ? "hi" : "en"}>
      <div className="farmer-govstrip">
        <div className="farmer-shell farmer-govstrip__inner">
          <span className="farmer-govstrip__label">{copy.govStrip}</span>
          <button
            type="button"
            className="farmer-govstrip__theme"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? copy.useLightMode : copy.useDarkMode}
          >
            {theme === "dark" ? <Sun size={13} aria-hidden="true" /> : <Moon size={13} aria-hidden="true" />}
            <span>{theme === "dark" ? copy.themeLight : copy.themeDark}</span>
          </button>
        </div>
      </div>

      <FarmerWelcomeHeader
        copy={copy}
        language={language}
        onLanguageChange={setLanguage}
      />

      <main id="farmer-welcome-main" className="farmer-shell farmer-main">
        <FarmerHero copy={copy} />

        <section className="farmer-help" aria-labelledby="farmer-help-title">
          <div className="farmer-help__heading">
            <h2 id="farmer-help-title" className="farmer-eyebrow farmer-help__eyebrow">{copy.helpEyebrow}</h2>
            <span className="farmer-help__badge">{copy.helpBadge}</span>
          </div>
          <div className="farmer-benefit-grid">
            {copy.benefits.map((benefit, index) => (
              <FarmerBenefitCard
                key={benefit.title}
                icon={benefitIcons[index]}
                index={index}
                title={benefit.title}
                description={benefit.description}
              />
            ))}
          </div>
        </section>

        <FarmerTrustSection copy={copy} trustItems={copy.trustItems} />
      </main>

      <FarmerFooter copy={copy} />
    </div>
  );
}
