import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Loader2, ShieldCheck } from "lucide-react";
import FarmerAuthHeader from "../../components/farmer/FarmerAuthHeader";
import useFarmerPreferences from "../../components/farmer/useFarmerPreferences";
import "./farmerBase.css";
import "./farmerLogin.css";

const COPY = {
  en: {
    brandSubtitle: "Kisan Mandi Portal",
    homeLabel: "Farmer-SIH home",
    backLabel: "Back",
    languageLabel: "Choose language",
    useDarkMode: "Use dark mode",
    useLightMode: "Use light mode",
    heading: "Welcome Back",
    subheading: "Enter your mobile number to continue",
    inputLabel: "Mobile Number",
    inputPlaceholder: "Enter mobile number",
    helperText: "We'll send an OTP to verify your number.",
    invalidText: "Please enter a valid 10-digit mobile number.",
    continueCta: "Continue",
    loadingText: "Sending OTP...",
    registerPrompt: "New to Farmer-SIH?",
    registerCta: "Create an account",
    secureText: "Your information is secure.",
  },
  hi: {
    brandSubtitle: "किसान मंडी पोर्टल",
    homeLabel: "फार्मर-एसआईएच होम",
    backLabel: "वापस",
    languageLabel: "भाषा चुनें",
    useDarkMode: "डार्क मोड का उपयोग करें",
    useLightMode: "लाइट मोड का उपयोग करें",
    heading: "वापसी पर स्वागत है",
    subheading: "जारी रखने के लिए अपना मोबाइल नंबर दर्ज करें",
    inputLabel: "मोबाइल नंबर",
    inputPlaceholder: "मोबाइल नंबर दर्ज करें",
    helperText: "हम आपके नंबर की पुष्टि के लिए एक OTP भेजेंगे।",
    invalidText: "कृपया एक वैध 10 अंकों का मोबाइल नंबर दर्ज करें।",
    continueCta: "जारी रखें",
    loadingText: "OTP भेजा जा रहा है...",
    registerPrompt: "फार्मर-एसआईएच पर नए हैं?",
    registerCta: "खाता बनाएं",
    secureText: "आपकी जानकारी सुरक्षित है।",
  },
};

const isValidMobile = (value) => /^[6-9]\d{9}$/.test(value);

export default function FarmerLogin() {
  const { language, setLanguage, theme, toggleTheme } = useFarmerPreferences();
  const navigate = useNavigate();
  const copy = COPY[language] || COPY.en;

  const [mobile, setMobile] = useState("");
  const [touched, setTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const valid = useMemo(() => isValidMobile(mobile), [mobile]);
  const showInvalid = touched && mobile.length > 0 && !valid;

  const handleChange = (event) => {
    // Keep only digits, cap at 10 for a standard Indian mobile number.
    const digitsOnly = event.target.value.replace(/\D/g, "").slice(0, 10);
    setMobile(digitsOnly);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setTouched(true);
    if (!valid || submitting) return;

    // No OTP backend endpoint exists yet, so we advance the UI to the planned
    // OTP route and pass the number along without calling a fake API.
    setSubmitting(true);
    navigate("/farmer/otp", { state: { mobile: `+91${mobile}` } });
  };

  return (
    <div className={`farmer-welcome farmer-welcome--${theme}`} lang={language === "hi" ? "hi" : "en"}>
      <FarmerAuthHeader
        copy={copy}
        language={language}
        onLanguageChange={setLanguage}
        theme={theme}
        onThemeToggle={toggleTheme}
        backTo="/"
      />

      <main className="farmer-shell farmer-auth" id="farmer-login-main">
        <section className="farmer-auth__card" aria-labelledby="farmer-login-title">
          <div className="farmer-auth__intro">
            <h1 id="farmer-login-title">{copy.heading}</h1>
            <p>{copy.subheading}</p>
          </div>

          <form className="farmer-auth__form" onSubmit={handleSubmit} noValidate>
            <label className="farmer-field__label" htmlFor="farmer-mobile">
              {copy.inputLabel}
            </label>
            <div className={`farmer-field ${showInvalid ? "farmer-field--error" : ""}`}>
              <span className="farmer-field__prefix" aria-hidden="true">+91</span>
              <input
                id="farmer-mobile"
                className="farmer-field__input"
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                pattern="[6-9][0-9]{9}"
                maxLength={10}
                value={mobile}
                onChange={handleChange}
                onBlur={() => setTouched(true)}
                placeholder={copy.inputPlaceholder}
                aria-label={copy.inputLabel}
                aria-invalid={showInvalid}
                aria-describedby={showInvalid ? "farmer-mobile-error" : "farmer-mobile-help"}
                disabled={submitting}
              />
            </div>

            {showInvalid ? (
              <p className="farmer-field__error" id="farmer-mobile-error" role="alert">
                {copy.invalidText}
              </p>
            ) : (
              <p className="farmer-field__help" id="farmer-mobile-help">
                {copy.helperText}
              </p>
            )}

            <button
              type="submit"
              className="farmer-primary-cta farmer-auth__cta"
              disabled={!valid || submitting}
            >
              {submitting ? (
                <>
                  <Loader2 size={19} className="farmer-spin" aria-hidden="true" />
                  <span>{copy.loadingText}</span>
                </>
              ) : (
                <>
                  <span>{copy.continueCta}</span>
                  <ArrowRight size={19} aria-hidden="true" />
                </>
              )}
            </button>
          </form>

          <p className="farmer-auth__register">
            <span>{copy.registerPrompt}</span>{" "}
            <button
              type="button"
              className="farmer-auth__register-link"
              onClick={() => navigate("/farmer/register")}
            >
              {copy.registerCta}
            </button>
          </p>

          <p className="farmer-auth__secure">
            <ShieldCheck size={16} aria-hidden="true" />
            <span>{copy.secureText}</span>
          </p>
        </section>
      </main>
    </div>
  );
}
