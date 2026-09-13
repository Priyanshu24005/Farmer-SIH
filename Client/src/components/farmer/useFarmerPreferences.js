import { useEffect, useState } from "react";

// Same storage keys used by the Farmer Welcome screen so language and theme
// choices carry across the Farmer flow.
export const LANGUAGE_KEY = "farmer-sih-language";
export const THEME_KEY = "farmer-sih-theme";

function getStoredValue(key, fallback) {
  try {
    return window.localStorage.getItem(key) || fallback;
  } catch {
    return fallback;
  }
}

function getInitialTheme() {
  const storedTheme = getStoredValue(THEME_KEY, "");
  if (storedTheme === "light" || storedTheme === "dark") return storedTheme;
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export default function useFarmerPreferences() {
  const [language, setLanguage] = useState(() => getStoredValue(LANGUAGE_KEY, "en"));
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    try {
      window.localStorage.setItem(LANGUAGE_KEY, language);
    } catch {
      // The page remains functional if storage is unavailable.
    }
  }, [language]);

  useEffect(() => {
    try {
      window.localStorage.setItem(THEME_KEY, theme);
    } catch {
      // The page remains functional if storage is unavailable.
    }
  }, [theme]);

  const toggleTheme = () =>
    setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));

  return { language, setLanguage, theme, setTheme, toggleTheme };
}
