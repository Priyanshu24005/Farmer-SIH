// Farmer session helpers — thin wrapper over the auth data the existing
// architecture already persists.
//
// The axios client (src/api/axios.js) reads the JWT from
// localStorage["farmer-token"], so that key is the established contract.
// We additionally cache a SMALL, non-sensitive profile (id, name, mobile,
// crop type) captured from the /auth/register|login response so the
// dashboard can greet the farmer and, in future, fetch their real tokens via
// GET /tokens/farmer/:farmerId. No Aadhaar / password is stored.

const PROFILE_KEY = "farmer-profile";
const LEGACY_PROFILE_KEY = "farmer-sih-profile";

export function saveFarmerProfile(profile) {
  if (!profile) return;
  try {
    localStorage.setItem(
      PROFILE_KEY,
      JSON.stringify({
        id: profile._id || profile.id || "",
        name: profile.name || "",
        mobile: profile.mobile || "",
        cropType: profile.cropType || "",
      })
    );
  } catch {
    // Non-fatal.
  }
}

export function saveAuthSession(data) {
  if (!data) return;
  try {
    localStorage.setItem("farmer-token", data.token || "");
    localStorage.setItem("farmer-role", data.role || "farmer");
    saveFarmerProfile(data);
  } catch {
    // Non-fatal.
  }
}

export function getFarmerProfile() {
  try {
    const raw = localStorage.getItem(PROFILE_KEY) || localStorage.getItem(LEGACY_PROFILE_KEY);
    if (!raw) return null;
    const profile = JSON.parse(raw);
    if (!localStorage.getItem(PROFILE_KEY)) {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    }
    return profile;
  } catch {
    return null;
  }
}

export function getFarmerRole() {
  try {
    return localStorage.getItem("farmer-role");
  } catch {
    return null;
  }
}

export function getFarmerToken() {
  try {
    return localStorage.getItem("farmer-token");
  } catch {
    return null;
  }
}

export function clearFarmerSession() {
  try {
    localStorage.removeItem(PROFILE_KEY);
    localStorage.removeItem(LEGACY_PROFILE_KEY);
    localStorage.removeItem("farmer-token");
    localStorage.removeItem("farmer-role");
  } catch {
    // Non-fatal.
  }
}