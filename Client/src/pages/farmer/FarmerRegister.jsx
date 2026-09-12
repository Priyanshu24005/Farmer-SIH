import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BadgeCheck, Eye, EyeOff, Loader2 } from "lucide-react";
import FarmerAuthHeader from "../../components/farmer/FarmerAuthHeader";
import useFarmerPreferences from "../../components/farmer/useFarmerPreferences";
import { registerFarmer } from "../../api/farmer/farmers";
import { saveFarmerProfile } from "../../components/farmer/farmerSession";
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
    verified: "Verified",
    aadhaarLabel: "Aadhaar Number",
    aadhaarPlaceholder: "Enter 12-digit Aadhaar number",
    aadhaarError: "Please enter a valid 12-digit Aadhaar number.",
    showAadhaar: "Show Aadhaar number",
    hideAadhaar: "Hide Aadhaar number",
    cropLabel: "Primary Crop",
    cropPlaceholder: "Select your primary crop",
    submitCta: "Create Account",
    submittingText: "Creating Account...",
    duplicateError: "This mobile number is already registered. Please log in instead.",
    genericError: "Unable to create your account. Please try again.",
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
    verified: "सत्यापित",
    aadhaarLabel: "आधार नंबर",
    aadhaarPlaceholder: "12 अंकों का आधार नंबर दर्ज करें",
    aadhaarError: "कृपया एक वैध 12 अंकों का आधार नंबर दर्ज करें।",
    showAadhaar: "आधार नंबर दिखाएं",
    hideAadhaar: "आधार नंबर छिपाएं",
    cropLabel: "मुख्य फसल",
    cropPlaceholder: "अपनी मुख्य फसल चुनें",
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

function maskMobile(raw) {
  const d = (raw || "").replace(/\D/g, "").slice(-10);
  if (d.length !== 10) return raw || "";
  return `+91 ${d.slice(0, 2)}******${d.slice(8)}`;
}

export default function FarmerRegister() {
  const { language, setLanguage, theme, toggleTheme } = useFarmerPreferences();
  const navigate = useNavigate();
  const location = useLocation();
  const copy = COPY[language] || COPY.en;

  const verifiedMobile = location.state?.mobile || "";
  const mobileDigits = useMemo(
    () => (verifiedMobile || "").replace(/\D/g, "").slice(-10),
    [verifiedMobile]
  );
  const maskedMobile = useMemo(() => maskMobile(verifiedMobile), [verifiedMobile]);

  const [name, setName] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [crop, setCrop] = useState("");
  const [showAadhaar, setShowAadhaar] = useState(false);
  const [touched, setTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const nameValid = name.trim().length >= 2;
  const aadhaarValid = /^\d{12}$/.test(aadhaar);
  const cropValid = CROP_VALUES.includes(crop);
  const mobileValid = mobileDigits.length === 10;
  const formValid = nameValid && aadhaarValid && cropValid && mobileValid;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setTouched(true);
    setFormError("");
    if (!formValid || submitting) return;

    setSubmitting(true);
    try {
      // Exact backend contract for POST /api/farmers — no password/OTP.
      const data = await registerFarmer({
        name: name.trim(),
        mobile: mobileDigits,
        aadhaar,
        cropType: crop,
      });

      // createFarmer returns the created Farmer document (no JWT). Cache only
      // the non-sensitive identity the dashboard needs (id + name). No Aadhaar
      // or password is ever stored client-side.
      saveFarmerProfile({
        _id: data?._id || data?.id,
        name: data?.name || name.trim(),
      });
      // /farmer renders FarmerHome (Task 5).
      navigate("/farmer", { replace: true });
    } catch (error) {
      const status = error?.response?.status;
      const serverMsg = error?.response?.data?.message || "";
      console.error("[FarmerRegister] Registration error:", {
        status,
        message: serverMsg,
        networkError: !error?.response ? error?.message : undefined,
      });
      if (status === 409 || /already|duplicate|exists|E11000/i.test(serverMsg)) {
        setFormError(copy.duplicateError);
      } else {
        setFormError(copy.genericError);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const showFieldError = (valid, value) => touched && (value.length > 0 ? !valid : true);

  return (
    <div className={`farmer-welcome farmer-welcome--${theme}`} lang={language === "hi" ? "hi" : "en"}>
      <FarmerAuthHeader
        copy={copy}
        language={language}
        onLanguageChange={setLanguage}
        theme={theme}
        onThemeToggle={toggleTheme}
        backTo="/farmer/otp"
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
                />
              </div>
              {showFieldError(nameValid, name) && (
                <p className="farmer-field__error" role="alert">{copy.nameError}</p>
              )}
            </div>

            {/* Mobile (verified, read-only) */}
            <div className="farmer-register__group">
              <span className="farmer-field__label" id="reg-mobile-label">{copy.mobileLabel}</span>
              <div className="farmer-register__mobile" aria-labelledby="reg-mobile-label">
                <span className="farmer-register__mobile-value">{maskedMobile || "+91 ••••••••••"}</span>
                <span className="farmer-register__verified">
                  <BadgeCheck size={16} aria-hidden="true" />
                  {copy.verified}
                </span>
              </div>
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
