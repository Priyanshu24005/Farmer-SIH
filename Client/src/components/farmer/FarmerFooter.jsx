import { Accessibility, Landmark, Smartphone } from "lucide-react";

export default function FarmerFooter({ copy }) {
  return (
    <footer className="farmer-footer">
      <div className="farmer-shell farmer-footer__inner">
        <div className="farmer-footer__identity">
          <span className="farmer-footer__seal" aria-hidden="true"><Landmark size={20} /></span>
          <span>
            <strong>{copy.ministry}</strong>
            <small>{copy.hackathon}</small>
          </span>
        </div>
        <div className="farmer-footer__accessibility">
          <span><Smartphone size={17} aria-hidden="true" /> {copy.mobileApp}</span>
          <span><Accessibility size={17} aria-hidden="true" /> {copy.accessible}</span>
        </div>
      </div>
    </footer>
  );
}
