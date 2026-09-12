import { createElement } from "react";
import { CalendarPlus, Home, ListOrdered, Receipt, Wallet } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function FarmerBottomNav({ copy }) {
  const items = [
    { to: "/farmer", label: copy.navHome, icon: Home, end: true },
    { to: "/farmer/book", label: copy.navBook, icon: CalendarPlus },
    { to: "/farmer/queue", label: copy.navQueue, icon: ListOrdered },
    { to: "/farmer/history", label: copy.navHistory, icon: Receipt },
    { to: "/farmer/payments", label: copy.navPayments, icon: Wallet },
  ];

  return (
    <nav className="farmer-bottomnav" aria-label={copy.navLabel}>
      <ul>
        {items.map(({ to, label, icon, end }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                `farmer-bottomnav__item ${isActive ? "is-active" : ""}`
              }
            >
              {createElement(icon, { size: 21, "aria-hidden": "true" })}
              <span>{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
