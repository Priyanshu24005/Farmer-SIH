import { ArrowRight, CheckCircle2, Phone } from "lucide-react";
import { Link } from "react-router-dom";

function HeroArtwork({ label, assurance, direct }) {
  return (
    <figure className="farmer-hero-art" role="img" aria-label={label}>
      <svg viewBox="0 0 620 430" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <linearGradient id="farm-sky" x1="0" x2="0" y1="0" y2="1">
            <stop stopColor="#DDF3DE" />
            <stop offset="1" stopColor="#F7E7A4" />
          </linearGradient>
          <linearGradient id="farm-field" x1="0" x2="1">
            <stop stopColor="#2D8049" />
            <stop offset="1" stopColor="#94BF45" />
          </linearGradient>
          <linearGradient id="farm-shirt" x1="0" x2="1">
            <stop stopColor="#E9A91A" />
            <stop offset="1" stopColor="#F6C846" />
          </linearGradient>
        </defs>
        <rect width="620" height="430" rx="34" fill="url(#farm-sky)" />
        <circle cx="512" cy="72" r="40" fill="#FFE17A" opacity=".9" />
        <path d="M0 165C86 122 149 142 218 169C291 198 360 166 443 144C510 127 570 146 620 166V248H0Z" fill="#9DCD62" opacity=".85" />
        <path d="M0 211C106 165 188 207 272 222C383 242 480 170 620 204V314H0Z" fill="#5FA651" />
        <path d="M0 265C118 216 207 254 304 278C406 303 508 255 620 245V430H0Z" fill="url(#farm-field)" />
        <path d="M0 307C91 267 166 286 246 321C330 358 469 326 620 278V430H0Z" fill="#1F6842" opacity=".58" />
        <g stroke="#DDF28C" strokeLinecap="round" strokeWidth="4" opacity=".86">
          <path d="M46 303l-20 62m34-47l4 55m41-73l-18 72m35-55l1 63m48-75l-18 63m36-45l3 57m55-71l-20 56m36-34l5 51" />
          <path d="M335 316l-11 66m30-68l4 69m41-77l-14 65m35-65l4 66m48-82l-14 67m38-65l4 59m51-74l-14 61" />
        </g>
        <g transform="translate(367 91)">
          <ellipse cx="79" cy="282" rx="75" ry="16" fill="#15472E" opacity=".25" />
          <path d="M36 205c8 31 8 55 1 81h37l12-82Z" fill="#183E2C" />
          <path d="M91 204c22 24 31 52 33 82h-36l-14-77Z" fill="#183E2C" />
          <path d="M30 100c20-26 80-30 105 3l-17 119H43Z" fill="url(#farm-shirt)" />
          <path d="M43 121c-28 10-38 36-45 61l19 7c16-23 30-34 49-37Z" fill="#C98053" />
          <path d="M120 122c25 14 34 34 41 61l-18 7c-13-23-29-34-45-39Z" fill="#C98053" />
          <path d="M18 175l-18 66" stroke="#724C2B" strokeWidth="8" strokeLinecap="round" />
          <path d="M1 239l51 20" stroke="#AA7B3B" strokeWidth="6" strokeLinecap="round" />
          <ellipse cx="80" cy="74" rx="38" ry="45" fill="#C98053" />
          <path d="M42 64c5-39 69-51 90-7-13 13-24 18-41 17-17-2-30-6-49-10Z" fill="#F4C243" />
          <path d="M35 60c16-43 82-48 106-2l-18 14c-12-15-53-21-74-7Z" fill="#E5A91B" />
          <path d="M57 98c12 7 27 8 43 0" fill="none" stroke="#8C513B" strokeLinecap="round" strokeWidth="3" />
          <circle cx="66" cy="78" r="3" fill="#3B2B22" />
          <circle cx="100" cy="78" r="3" fill="#3B2B22" />
        </g>
        <g fill="#FFF7DD" opacity=".9">
          <circle cx="94" cy="71" r="6" /><circle cx="120" cy="55" r="4" /><circle cx="148" cy="76" r="5" />
        </g>
      </svg>
      <figcaption className="farmer-hero-art__caption">
        <span className="farmer-hero-art__assurance">
          <CheckCircle2 size={15} aria-hidden="true" />
          {assurance}
        </span>
        <span className="farmer-hero-art__direct">{direct}</span>
      </figcaption>
    </figure>
  );
}

export default function FarmerHero({ copy }) {
  return (
    <section className="farmer-hero" aria-labelledby="farmer-welcome-title">
      <HeroArtwork label={copy.heroArtLabel} assurance={copy.heroAssurance} direct={copy.heroDirect} />
      <div className="farmer-hero-copy">
        <h1 id="farmer-welcome-title">{copy.heroTitle}</h1>
        <p className="farmer-hero-copy__description">{copy.heroDescription}</p>
        <Link className="farmer-primary-cta" to="/farmer/login">
          <span>{copy.loginCta}</span>
          <ArrowRight size={19} aria-hidden="true" />
        </Link>
        <div className="farmer-helpline">
          <span className="farmer-helpline__icon" aria-hidden="true"><Phone size={17} /></span>
          <span>
            <span className="farmer-helpline__label">{copy.helplineLabel}</span>
            <a href="tel:18001801551">1800-180-1551</a>
          </span>
        </div>
      </div>
    </section>
  );
}
