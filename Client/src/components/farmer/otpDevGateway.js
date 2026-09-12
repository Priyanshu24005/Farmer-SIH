// =============================================================================
// TEMPORARY OTP GATEWAY — DEVELOPMENT ONLY
// =============================================================================
// The backend in this repository has NO OTP endpoint (auth is password-based:
// POST /auth/register, POST /auth/login). Until a real OTP service exists, this
// module is the single, isolated place that stands in for OTP send/verify.
//
// The UI (FarmerOtp.jsx) only ever talks to these two functions, so wiring the
// real backend later means replacing the bodies here — no screen changes needed.
//
// Replace with, e.g.:
//   import api from "../../api/axios";
//   export const sendOtpTemporary  = ({ mobile }) => api.post("/auth/send-otp", { mobile });
//   export const verifyOtpTemporary = ({ mobile, otp }) =>
//     api.post("/auth/verify-otp", { mobile, otp }).then(r => ({ status: "verified", data: r.data }));
//
// IMPORTANT: There is deliberately NO hardcoded "123456" success rule. During
// development any correctly-formatted 6-digit code advances the flow, so the UI
// can be exercised end to end without pretending a server verified anything.
// =============================================================================

const OTP_LENGTH = 6;
const SIMULATED_LATENCY_MS = 650;

/**
 * Stand-in for a real "verify OTP" API call.
 * @returns {Promise<{status: "verified" | "invalid" | "expired"}>}
 */
export function verifyOtpTemporary({ otp }) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const formatValid = new RegExp(`^\\d{${OTP_LENGTH}}$`).test(otp || "");
      // Format gate only — NOT a claim that a server verified the code.
      resolve({ status: formatValid ? "verified" : "invalid" });
    }, SIMULATED_LATENCY_MS);
  });
}

/**
 * Stand-in for a real "send/resend OTP" API call. Currently a no-op that the
 * UI uses to reset its own timer. Wire the real endpoint here later.
 */
export function sendOtpTemporary() {
  return Promise.resolve({ status: "sent" });
}
