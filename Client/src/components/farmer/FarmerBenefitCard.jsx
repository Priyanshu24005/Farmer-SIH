import { createElement } from "react";

export default function FarmerBenefitCard({ icon, title, description, index }) {
  return (
    <article className="farmer-benefit-card">
      <div className="farmer-benefit-card__top">
        <span className="farmer-benefit-card__number" aria-hidden="true">0{index + 1}</span>
        <span className="farmer-benefit-card__icon" aria-hidden="true">{createElement(icon, { size: 22 })}</span>
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
    </article>
  );
}
