import { Sprout } from "lucide-react";

export default function FarmerWelcomeHeader({
  copy,
  language,
  onLanguageChange,
}) {
  return (
    <header className="farmer-header">
      <div className="farmer-shell farmer-header__inner">
        <a className="farmer-brand" href="#farmer-welcome-main" aria-label={copy.homeLabel}>
          <span className="farmer-brand__mark" aria-hidden="true">
            <Sprout size={21} strokeWidth={2.35} />
          </span>
          <span className="farmer-brand__text">
            <span className="farmer-brand__titlerow">
              <strong>Farmer-SIH</strong>
              <span className="farmer-setu-badge" aria-label={copy.setuLabel}>SETU</span>
            </span>
            <span className="farmer-brand__subtitle">{copy.brandSubtitle}</span>
          </span>
        </a>

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
        </div>
      </div>
    </header>
  );
}
