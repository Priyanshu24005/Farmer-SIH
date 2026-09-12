import { ArrowLeft, Moon, Sprout, Sun } from "lucide-react";
import { Link } from "react-router-dom";

export default function FarmerAuthHeader({
  copy,
  language,
  onLanguageChange,
  theme,
  onThemeToggle,
  backTo = "/farmer/login",
}) {
  const nextThemeLabel = theme === "dark" ? copy.useLightMode : copy.useDarkMode;

  return (
    <header className="farmer-header">
      <div className="farmer-shell farmer-header__inner">
        <div className="farmer-header__lead">
          <Link className="farmer-back" to={backTo} aria-label={copy.backLabel}>
            <ArrowLeft size={19} aria-hidden="true" />
            <span className="farmer-back__text">{copy.backLabel}</span>
          </Link>
          <span className="farmer-brand" aria-label={copy.homeLabel}>
            <span className="farmer-brand__mark" aria-hidden="true">
              <Sprout size={21} strokeWidth={2.35} />
            </span>
            <span>
              <strong>Farmer-SIH</strong>
              <span className="farmer-brand__subtitle">{copy.brandSubtitle}</span>
            </span>
          </span>
        </div>

        <div className="farmer-header__controls">
          <div className="farmer-language-toggle" role="group" aria-label={copy.languageLabel}>
            <button
              type="button"
              className={language === "en" ? "is-active" : ""}
              aria-pressed={language === "en"}
              onClick={() => onLanguageChange("en")}
            >
              English
            </button>
            <span aria-hidden="true">|</span>
            <button
              type="button"
              className={language === "hi" ? "is-active" : ""}
              aria-pressed={language === "hi"}
              onClick={() => onLanguageChange("hi")}
            >
              हिंदी
            </button>
          </div>
          <button
            type="button"
            className="farmer-theme-toggle"
            onClick={onThemeToggle}
            aria-label={nextThemeLabel}
            title={nextThemeLabel}
          >
            {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
          </button>
        </div>
      </div>
    </header>
  );
}
