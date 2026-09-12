import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import FarmerAuthHeader from "../../components/farmer/FarmerAuthHeader";
import useFarmerPreferences from "../../components/farmer/useFarmerPreferences";
import { registerFarmer } from "../../api/farmer/auth";
import { saveAuthSession } from "../../components/farmer/farmerSession";
import "./farmerBase.css";
import "./farmerLogin.css";
import "./farmerRegister.css";

const CROP_VALUES = ["Wheat", "Rice", "Maize", "Mustard", "Other"];

const COPY = {
  en: {
    brandSubtitle: "Kisan Mandi Portal",
    homeLabel: "Farmer-SIH home",
    backLabel: "Back",
    languageLabel: "Choose language",
    useDarkMode: "Use dark mode",
    useLightMode: "Use light mode",
    heading: "Create your account",
    subheading: "Enter your details to get started with Farmer-SIH.",
    nameLabel: "Full Name",
    namePlaceholder: "Enter your full name",
    nameError: "Please enter your full name.",
    mobileLabel: "Mobile Number",
    mobilePlaceholder: "Enter mobile number",
    mobileInvalidText: "Please enter a valid 10-digit mobile number.",
    aadhaarLabel: "Aadhaar Number",
    aadhaarPlaceholder: "Enter 12-digit Aadhaar number",
    aadhaarError: "Please enter a valid 12-digit Aadhaar number.",
    showAadhaar: "Show Aadhaar number",
    hideAadhaar: "Hide Aadhaar number",
    passwordLabel: "Password",
    passwordPlaceholder: "Create a password (min 8 characters)",
    passwordError: "Please create a password with at least 8 characters.",
    showPassword: "Show password",
    hidePassword: "Hide password",
    confirmPasswordLabel: "Confirm Password",
    confirmPasswordPlaceholder: "Re-enter your password",
    confirmPasswordError: "Passwords do not match.",
    showConfirmPassword: "Show confirm password",
    hideConfirmPassword: "Hide confirm password",
    cropLabel: "Primary Crop",
    cropPlaceholder: "Select your primary crop",
    submitCta: "Create Account",
    submittingText: "Creating account...",
    duplicateError: "This mobile number is already registered. Please log in.",
    genericError: "Your account could not be created. Please try again.",
    crops: {
      Wheat: "Wheat",
      Rice: "Rice",
      Maize: "Maize",
      Mustard: "Mustard",
      Other: "Other",
    },
  },
  hi: {
    brandSubtitle: "किसान मंडी पोर्टल",
    homeLabel: "फार्मर-एसआईएच होम",
    backLabel: "वापस",
    languageLabel: "भाषा चुनें",
    useDarkMode: "डार्क मोड का उपयोग करें",
    useLightMode: "लाइट मोड का उपयोग करें",
    heading: "अपना खाता बनाएं",
    subheading: "फार्मर-एसआईएच शुरू करने के लिए अपनी जानकारी दर्ज करें।",
    nameLabel: "पूरा नाम",
    namePlaceholder: "अपना पूरा नाम दर्ज करें",
    nameError: "कृपया अपना पूरा नाम दर्ज करें।",
    mobileLabel: "मोबाइल नंबर",
    mobilePlaceholder: "मोबाइल नंबर दर्ज करें",
    mobileInvalidText: "कृपया एक वैध 10 अंकों का मोबाइल नंबर दर्ज करें।",
    aadhaarLabel: "आधार नंबर",
    aadhaarPlaceholder: "12 अंकों का आधार नंबर दर्ज करें",
    aadhaarError: "कृपया एक वैध 12 अंकों का आधार नंबर दर्ज करें।",
    showAadhaar: "आधार नंबर दिखाएं",
    hideAadhaar: "आधार नंबर छिपाएं",
    cropLabel: "मुख्य फसल",
    cropPlaceholder: "अपनी मुख्य फसल चुनें",
    passwordLabel: "पासवर्ड",
    passwordPlaceholder: "पासवर्ड बनाएं (न्यूनतम 8 अक्षर)",
    passwordError: "कृपया कम से कम 8 अक्षरों का पासवर्ड बनाएं।",
    showPassword: "पासवर्ड दिखाएं",
    hidePassword: "पासवर्ड छिपाएं",
    confirmPasswordLabel: "पासवर्ड की पुष्टि करें",
    confirmPasswordPlaceholder: "पासवर्ड दोबारा दर्ज करें",
    confirmPasswordError: "पासवर्ड मेल नहीं खाते।",
    showConfirmPassword: "पुष्टि पासवर्ड दिखाएं",
    hideConfirmPassword: "पुष्टि पासवर्ड छिपाएं",
    submitCta: "खाता बनाएं",
    submittingText: "खाता बन रहा है...",
    duplicateError: "यह मोबाइल नंबर पहले से पंजीकृत है। कृपया लॉगिन करें।",
    genericError: "आपका खाता नहीं बन सका। कृपया पुनः प्रयास करें।",
    crops: {
      Wheat: "गेहूं",
      Rice: "चावल",
      Maize: "मक्का",
      Mustard: "सरसों",
      Other: "अन्य",
    },
  },
};

const isValidMobile = (value) => /^[6-9]\d{9}$/.test(value);

export default function FarmerRegister() {
  const { language, setLanguage, theme, toggleTheme } = useFarmerPreferences();
  const navigate = useNavigate();
  const copy = COPY[language] || COPY.en;

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [crop, setCrop] = useState("");
  const [showAadhaar, setShowAadhaar] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [touched, setTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const nameValid = name.trim().length >= 2;
  const mobileValid = isValidMobile(mobile);
  const aadhaarValid = /^\d{12}$/.test(aadhaar);
  const passwordValid = password.length >= 8;
  const confirmValid = confirmPassword.length > 0 && confirmPassword === password;
  const cropValid = CROP_VALUES.includes(crop);
  const formValid =
    nameValid && mobileValid && aadhaarValid && passwordValid && confirmValid && cropValid;

  const showFieldError = (valid, value) => touched && (value.length > 0 ? !valid : true);

  const handleMobileChange = (event) => {
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
      // Exact backend contract for POST /api/auth/register. Only the
      // documented fields (name, mobile, aadhaar, password, cropType) are sent.
      const data = await registerFarmer({
        name: name.trim(),
        mobile,
        aadhaar,
        password,
        cropType: crop,
      });

      // Persists token + role + minimal profile (id, name). Never stores
      // password or raw Aadhaar.
      saveAuthSession(data);
      navigate("/farmer", { replace: true });
    } catch (error) {
      const status = error?.response?.status;
      const serverMsg = error?.response?.data?.message || "";
      console.error("[FarmerRegister] Register error:", {
        status,
        message: serverMsg,
        networkError: !error?.response ? error?.message : undefined,
      });
      if (status === 409) {
        setFormError(copy.duplicateError);
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
        backTo="/farmer/login"
      />

      <main className="farmer-shell farmer-auth" id="farmer-register-main">
        <section className="farmer-auth__card farmer-register__card" aria-labelledby="farmer-register-title">
          <div className="farmer-auth__intro">
            <h1 id="farmer-register-title">{copy.heading}</h1>
            <p>{copy.subheading}</p>
          </div>

          <form className="farmer-auth__form farmer-register__form" onSubmit={handleSubmit} noValidate>
            {/* Full Name */}
            <div className="farmer-register__group">
              <label className="farmer-field__label" htmlFor="reg-name">{copy.nameLabel}</label>
              <div className={`farmer-field ${showFieldError(nameValid, name) ? "farmer-field--error" : ""}`}>
                <input
                  id="reg-name"
                  className="farmer-field__input farmer-field__input--padded"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={() => setTouched(true)}
                  placeholder={copy.namePlaceholder}
                  aria-invalid={showFieldError(nameValid, name)}
                  disabled={submitting}
                />
              </div>
              {showFieldError(nameValid, name) && (
                <p className="farmer-field__error" role="alert">{copy.nameError}</p>
              )}
            </div>

            {/* Mobile */}
            <div className="farmer-register__group">
              <label className="farmer-field__label" htmlFor="reg-mobile">{copy.mobileLabel}</label>
              <div className={`farmer-field ${showFieldError(mobileValid, mobile) ? "farmer-field--error" : ""}`}>
                <span className="farmer-field__prefix" aria-hidden="true">+91</span>
                <input
                  id="reg-mobile"
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
                  aria-invalid={showFieldError(mobileValid, mobile)}
                  disabled={submitting}
                />
              </div>
              {showFieldError(mobileValid, mobile) && (
                <p className="farmer-field__error" role="alert">{copy.mobileInvalidText}</p>
              )}
            </div>

            {/* Aadhaar */}
            <div className="farmer-register__group">
              <label className="farmer-field__label" htmlFor="reg-aadhaar">{copy.aadhaarLabel}</label>
              <div className={`farmer-field ${showFieldError(aadhaarValid, aadhaar) ? "farmer-field--error" : ""}`}>
                <input
                  id="reg-aadhaar"
                  className="farmer-field__input farmer-field__input--padded"
                  type={showAadhaar ? "text" : "password"}
                  inputMode="numeric"
                  autoComplete="off"
                  maxLength={12}
                  value={aadhaar}
                  onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, "").slice(0, 12))}
                  onBlur={() => setTouched(true)}
                  placeholder={copy.aadhaarPlaceholder}
                  aria-invalid={showFieldError(aadhaarValid, aadhaar)}
                  disabled={submitting}
                />
                <button
                  type="button"
                  className="farmer-field__toggle"
                  onClick={() => setShowAadhaar((v) => !v)}
                  aria-label={showAadhaar ? copy.hideAadhaar : copy.showAadhaar}
                >
                  {showAadhaar ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {showFieldError(aadhaarValid, aadhaar) && (
                <p className="farmer-field__error" role="alert">{copy.aadhaarError}</p>
              )}
            </div>

            {/* Password */}
            <div className="farmer-register__group">
              <label className="farmer-field__label" htmlFor="reg-password">{copy.passwordLabel}</label>
              <div className={`farmer-field ${touched && !passwordValid ? "farmer-field--error" : ""}`}>
                <input
                  id="reg-password"
                  className="farmer-field__input farmer-field__input--padded"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => setTouched(true)}
                  placeholder={copy.passwordPlaceholder}
                  aria-invalid={touched && !passwordValid}
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
              {touched && !passwordValid && (
                <p className="farmer-field__error" role="alert">{copy.passwordError}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="farmer-register__group">
              <label className="farmer-field__label" htmlFor="reg-confirm-password">{copy.confirmPasswordLabel}</label>
              <div className={`farmer-field ${touched && !confirmValid ? "farmer-field--error" : ""}`}>
                <input
                  id="reg-confirm-password"
                  className="farmer-field__input farmer-field__input--padded"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onBlur={() => setTouched(true)}
                  placeholder={copy.confirmPasswordPlaceholder}
                  aria-invalid={touched && !confirmValid}
                  disabled={submitting}
                />
                <button
                  type="button"
                  className="farmer-field__toggle"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  aria-label={showConfirmPassword ? copy.hideConfirmPassword : copy.showConfirmPassword}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {touched && !confirmValid && (
                <p className="farmer-field__error" role="alert">{copy.confirmPasswordError}</p>
              )}
            </div>

            {/* Primary Crop */}
            <div className="farmer-register__group">
              <label className="farmer-field__label" htmlFor="reg-crop">{copy.cropLabel}</label>
              <div className={`farmer-field ${touched && !cropValid ? "farmer-field--error" : ""}`}>
                <select
                  id="reg-crop"
                  className={`farmer-field__input farmer-field__input--padded farmer-register__select ${crop ? "" : "is-placeholder"}`}
                  value={crop}
                  onChange={(e) => setCrop(e.target.value)}
                  onBlur={() => setTouched(true)}
                  aria-invalid={touched && !cropValid}
                  disabled={submitting}
                >
                  <option value="" disabled>{copy.cropPlaceholder}</option>
                  {CROP_VALUES.map((value) => (
                    <option key={value} value={value}>{copy.crops[value]}</option>
                  ))}
                </select>
              </div>
            </div>

            {formError && (
              <p className="farmer-field__error farmer-register__form-error" role="alert">{formError}</p>
            )}

            <button
              type="submit"
              className="farmer-primary-cta farmer-auth__cta"
              disabled={!formValid || submitting}
            >
              {submitting ? (
                <>
                  <Loader2 size={19} className="farmer-spin" aria-hidden="true" />
                  <span>{copy.submittingText}</span>
                </>
              ) : (
                <span>{copy.submitCta}</span>
              )}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}