import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, Loader2 } from "lucide-react";
import FarmerAuthHeader from "../../components/farmer/FarmerAuthHeader";
import useFarmerPreferences from "../../components/farmer/useFarmerPreferences";
import { verifyOtpTemporary } from "../../components/farmer/otpDevGateway";
import "./farmerBase.css";
import "./farmerLogin.css";
import "./farmerOtp.css";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 30;

const COPY = {
  en: {
    brandSubtitle: "Kisan Mandi Portal",
    homeLabel: "Farmer-SIH home",
    backLabel: "Back",
    languageLabel: "Choose language",
    useDarkMode: "Use dark mode",
    useLightMode: "Use light mode",
    heading: "Verify your mobile number",
    subheading: "Enter the 6-digit OTP sent to",
    changeNumber: "Change number",
    otpGroupLabel: "6 digit OTP",
    otpBoxLabel: (n) => `OTP digit ${n}`,
    invalidText: "Incorrect OTP. Please try again.",
    expiredText: "OTP expired. Please request a new OTP.",
    verifyCta: "Verify & Continue",
    verifyingText: "Verifying...",
    resendIn: (t) => `Resend OTP in ${t}`,
    resendPrompt: "Didn't receive the OTP?",
    resendCta: "Resend OTP",
  },
  hi: {
    brandSubtitle: "किसान मंडी पोर्टल",
    homeLabel: "फार्मर-एसआईएच होम",
    backLabel: "वापस",
    languageLabel: "भाषा चुनें",
    useDarkMode: "डार्क मोड का उपयोग करें",
    useLightMode: "लाइट मोड का उपयोग करें",
    heading: "अपने मोबाइल नंबर की पुष्टि करें",
    subheading: "इस नंबर पर भेजा गया 6 अंकों का OTP दर्ज करें",
    changeNumber: "नंबर बदलें",
    otpGroupLabel: "6 अंकों का OTP",
    otpBoxLabel: (n) => `OTP अंक ${n}`,
    invalidText: "गलत OTP। कृपया पुनः प्रयास करें।",
    expiredText: "OTP समाप्त हो गया। कृपया नया OTP मांगें।",
    verifyCta: "पुष्टि करें और जारी रखें",
    verifyingText: "पुष्टि हो रही है...",
    resendIn: (t) => `${t} में OTP दोबारा भेजें`,
    resendPrompt: "OTP नहीं मिला?",
    resendCta: "OTP दोबारा भेजें",
  },
};

function maskMobile(raw) {
  // raw expected like "+919812345610" or "9812345610"; show +91 98******10
  const digits = (raw || "").replace(/\D/g, "").slice(-10);
  if (digits.length !== 10) return raw || "";
  return `+91 ${digits.slice(0, 2)}******${digits.slice(8)}`;
}

function formatTimer(seconds) {
  const m = String(Math.floor(seconds / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${m}:${s}`;
}

export default function FarmerOtp() {
  const { language, setLanguage, theme, toggleTheme } = useFarmerPreferences();
  const navigate = useNavigate();
  const location = useLocation();
  const copy = COPY[language] || COPY.en;

  const mobile = location.state?.mobile || "";
  const maskedMobile = useMemo(() => maskMobile(mobile), [mobile]);

  const [digits, setDigits] = useState(() => Array(OTP_LENGTH).fill(""));
  const [status, setStatus] = useState("idle"); // idle | invalid | expired | verifying
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const inputsRef = useRef([]);

  const otpValue = digits.join("");
  const complete = otpValue.length === OTP_LENGTH && digits.every((d) => d !== "");

  // Resend countdown timer.
  useEffect(() => {
    if (secondsLeft <= 0) return undefined;
    const id = setInterval(() => setSecondsLeft((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [secondsLeft]);

  const focusBox = (index) => {
    const el = inputsRef.current[index];
    if (el) el.focus();
  };

  const handleChange = (index, rawValue) => {
    const value = rawValue.replace(/\D/g, "");
    if (status !== "verifying") setStatus("idle");

    if (value.length > 1) {
      // Handle paste / multi-char into a single box: distribute across boxes.
      const chars = value.slice(0, OTP_LENGTH - index).split("");
      setDigits((prev) => {
        const next = [...prev];
        chars.forEach((ch, i) => {
          next[index + i] = ch;
        });
        return next;
      });
      const nextFocus = Math.min(index + chars.length, OTP_LENGTH - 1);
      focusBox(nextFocus);
      return;
    }

    setDigits((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
    if (value && index < OTP_LENGTH - 1) focusBox(index + 1);
  };

  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      focusBox(index - 1);
    } else if (event.key === "ArrowLeft" && index > 0) {
      event.preventDefault();
      focusBox(index - 1);
    } else if (event.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      event.preventDefault();
      focusBox(index + 1);
    }
  };

  const handlePaste = (event) => {
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;
    event.preventDefault();
    const next = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((ch, i) => {
      next[i] = ch;
    });
    setDigits(next);
    focusBox(Math.min(pasted.length, OTP_LENGTH - 1));
    if (status !== "verifying") setStatus("idle");
  };

  const handleResend = () => {
    // NOTE: No OTP backend exists. This only resets the timer/UI. When a real
    // send-OTP endpoint is added, call it here (see otpDevGateway.js).
    setDigits(Array(OTP_LENGTH).fill(""));
    setStatus("idle");
    setSecondsLeft(RESEND_SECONDS);
    focusBox(0);
  };

  const handleVerify = async (event) => {
    event.preventDefault();
    if (!complete || status === "verifying") return;

    setStatus("verifying");
    // TEMPORARY, ISOLATED verification. No server call. Replace the body of
    // verifyOtpTemporary() in otpDevGateway.js with a real /verify-otp request
    // once the backend exists — this component will not need to change.
    const result = await verifyOtpTemporary({ mobile, otp: otpValue });

    if (result.status === "verified") {
      navigate("/farmer/register", { state: { mobile, otpVerified: true } });
    } else if (result.status === "expired") {
      setStatus("expired");
    } else {
      setStatus("invalid");
    }
  };

  const errorMessage =
    status === "invalid" ? copy.invalidText : status === "expired" ? copy.expiredText : "";

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

      <main className="farmer-shell farmer-auth" id="farmer-otp-main">
        <section className="farmer-auth__card" aria-labelledby="farmer-otp-title">
          <div className="farmer-auth__intro">
            <h1 id="farmer-otp-title">{copy.heading}</h1>
            <p>
              {copy.subheading}
              <br />
              <strong className="farmer-otp__number">{maskedMobile || "+91 ••••••••••"}</strong>
            </p>
            <button
              type="button"
              className="farmer-auth__register-link farmer-otp__change"
              onClick={() => navigate("/farmer/login")}
            >
              {copy.changeNumber}
            </button>
          </div>

          <form className="farmer-auth__form" onSubmit={handleVerify} noValidate>
            <div
              className={`farmer-otp__boxes ${errorMessage ? "farmer-otp__boxes--error" : ""}`}
              role="group"
              aria-label={copy.otpGroupLabel}
            >
              {digits.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputsRef.current[index] = el;
                  }}
                  className="farmer-otp__box"
                  type="text"
                  inputMode="numeric"
                  autoComplete={index === 0 ? "one-time-code" : "off"}
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  aria-label={copy.otpBoxLabel(index + 1)}
                  aria-invalid={Boolean(errorMessage)}
                  disabled={status === "verifying"}
                />
              ))}
            </div>

            {errorMessage && (
              <p className="farmer-field__error" role="alert">
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              className="farmer-primary-cta farmer-auth__cta"
              disabled={!complete || status === "verifying"}
            >
              {status === "verifying" ? (
                <>
                  <Loader2 size={19} className="farmer-spin" aria-hidden="true" />
                  <span>{copy.verifyingText}</span>
                </>
              ) : (
                <>
                  <span>{copy.verifyCta}</span>
                  <ArrowRight size={19} aria-hidden="true" />
                </>
              )}
            </button>
          </form>

          <div className="farmer-otp__resend" aria-live="polite">
            {secondsLeft > 0 ? (
              <span className="farmer-field__help">{copy.resendIn(formatTimer(secondsLeft))}</span>
            ) : (
              <>
                <span className="farmer-field__help">{copy.resendPrompt}</span>{" "}
                <button
                  type="button"
                  className="farmer-auth__register-link"
                  onClick={handleResend}
                >
                  {copy.resendCta}
                </button>
              </>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
