import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";
import FarmerAuthHeader from "../../components/farmer/FarmerAuthHeader";
import useFarmerPreferences from "../../components/farmer/useFarmerPreferences";
import { loginFarmer } from "../../api/farmer/auth";
import { saveAuthSession } from "../../components/farmer/farmerSession";
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
    subheading: "Enter your mobile number and password to continue",
    mobileLabel: "Mobile Number",
    mobilePlaceholder: "Enter mobile number",
    mobileInvalidText: "Please enter a valid 10-digit mobile number.",
    passwordLabel: "Password",
    passwordPlaceholder: "Enter your password",
    passwordInvalidText: "Please enter your password.",
    showPassword: "Show password",
    hidePassword: "Hide password",
    continueCta: "Login",
    loadingText: "Logging in...",
    registerPrompt: "New to Farmer-SIH?",
    registerCta: "Create an account",
    secureText: "Your information is secure.",
    invalidCredentials: "Incorrect mobile number or password.",
    genericError: "Unable to log in right now. Please try again.",
  },
  hi: {
    brandSubtitle: "किसान मंडी पोर्टल",
    homeLabel: "फार्मर-एसआईएच होम",
    backLabel: "वापस",
    languageLabel: "भाषा चुनें",
    useDarkMode: "डार्क मोड का उपयोग करें",
    useLightMode: "लाइट मोड का उपयोग करें",
    heading: "वापसी पर स्वागत है",
    subheading: "जारी रखने के लिए अपना मोबाइल नंबर और पासवर्ड दर्ज करें",
    mobileLabel: "मोबाइल नंबर",
    mobilePlaceholder: "मोबाइल नंबर दर्ज करें",
    mobileInvalidText: "कृपया एक वैध 10 अंकों का मोबाइल नंबर दर्ज करें।",
    passwordLabel: "पासवर्ड",
    passwordPlaceholder: "अपना पासवर्ड दर्ज करें",
    passwordInvalidText: "कृपया अपना पासवर्ड दर्ज करें।",
    showPassword: "पासवर्ड दिखाएं",
    hidePassword: "पासवर्ड छिपाएं",
    continueCta: "लॉगिन करें",
    loadingText: "लॉगिन हो रहा है...",
    registerPrompt: "फार्मर-एसआईएच पर नए हैं?",
    registerCta: "खाता बनाएं",
    secureText: "आपकी जानकारी सुरक्षित है।",
    invalidCredentials: "गलत मोबाइल नंबर या पासवर्ड।",
    genericError: "अभी लॉगिन नहीं हो सका। कृपया पुनः प्रयास करें।",
  },
};

const isValidMobile = (value) => /^[6-9]\d{9}$/.test(value);

export default function FarmerLogin() {
  const { language, setLanguage, theme, toggleTheme } = useFarmerPreferences();
  const navigate = useNavigate();
  const copy = COPY[language] || COPY.en;

  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const mobileValid = useMemo(() => isValidMobile(mobile), [mobile]);
  const passwordValid = password.length > 0;
  const formValid = mobileValid && passwordValid;

  const showMobileError = touched && mobile.length > 0 && !mobileValid;
  const showPasswordError = touched && !passwordValid;

  const handleMobileChange = (event) => {
    // Keep only digits, cap at 10 for a standard Indian mobile number.
    const digitsOnly = event.target.value.replace(/\D/g, "").slice(0, 10);
    setMobile(digitsOnly);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setTouched(true);
    setFormError("");
    if (!formValid || submitting) return;

    setSubmitting(true);
    try {
      // Exact backend contract for POST /api/auth/login.
      const data = await loginFarmer({ mobile, password });

      // Persists token + role + minimal profile (id, name). Never stores
      // password or raw Aadhaar.
      saveAuthSession(data);
      navigate("/farmer", { replace: true });
    } catch (error) {
      const status = error?.response?.status;
      const serverMsg = error?.response?.data?.message || "";
      console.error("[FarmerLogin] Login error:", {
        status,
        message: serverMsg,
        networkError: !error?.response ? error?.message : undefined,
      });
      if (status === 401) {
        setFormError(copy.invalidCredentials);
      } else {
        setFormError(copy.genericError);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={`farmer-welcome farmer-welcome--${theme}`} lang={language === "hi" ? "hi" : "en"}>
      <FarmerAuthHeader
        copy={copy}
        language={language}
        onLanguageChange={setLanguage}
        theme={theme}
        onThemeToggle={toggleTheme}
        backTo="/farmer/welcome"
      />

      <main className="farmer-shell farmer-auth" id="farmer-login-main">
        <section className="farmer-auth__card" aria-labelledby="farmer-login-title">
          <div className="farmer-auth__intro">
            <h1 id="farmer-login-title">{copy.heading}</h1>
            <p>{copy.subheading}</p>
          </div>

          <form className="farmer-auth__form" onSubmit={handleSubmit} noValidate>
            <label className="farmer-field__label" htmlFor="farmer-mobile">
              {copy.mobileLabel}
            </label>
            <div className={`farmer-field ${showMobileError ? "farmer-field--error" : ""}`}>
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
                onChange={handleMobileChange}
                onBlur={() => setTouched(true)}
                placeholder={copy.mobilePlaceholder}
                aria-label={copy.mobileLabel}
                aria-invalid={showMobileError}
                aria-describedby={showMobileError ? "farmer-mobile-error" : undefined}
                disabled={submitting}
              />
            </div>
            {showMobileError && (
              <p className="farmer-field__error" id="farmer-mobile-error" role="alert">
                {copy.mobileInvalidText}
              </p>
            )}

            <label className="farmer-field__label" htmlFor="farmer-password">
              {copy.passwordLabel}
            </label>
            <div className={`farmer-field ${showPasswordError ? "farmer-field--error" : ""}`}>
              <input
                id="farmer-password"
                className="farmer-field__input farmer-field__input--padded"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setTouched(true)}
                placeholder={copy.passwordPlaceholder}
                aria-label={copy.passwordLabel}
                aria-invalid={showPasswordError}
                aria-describedby={showPasswordError ? "farmer-password-error" : undefined}
                disabled={submitting}
              />
              <button
                type="button"
                className="farmer-field__toggle"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? copy.hidePassword : copy.showPassword}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {showPasswordError && (
              <p className="farmer-field__error" id="farmer-password-error" role="alert">
                {copy.passwordInvalidText}
              </p>
            )}

            {formError && (
              <p className="farmer-field__error" role="alert">
                {formError}
              </p>
            )}

            <button
              type="submit"
              className="farmer-primary-cta farmer-auth__cta"
              disabled={!formValid || submitting}
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