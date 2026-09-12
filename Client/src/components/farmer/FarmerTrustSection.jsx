export default function FarmerTrustSection({ copy, trustItems }) {
  return (
    <section className="farmer-trust" aria-label={copy.trustAria}>
      <ul className="farmer-trust__items">
        {trustItems.map(({ title, description }) => (
          <li key={title}>
            <strong>{title}</strong>
            <small>{description}</small>
          </li>
        ))}
      </ul>
    </section>
  );
}
