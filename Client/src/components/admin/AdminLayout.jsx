import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutGrid, Users, ListOrdered, ClipboardList, Wallet,
  BarChart2, Bell, LogOut, Search, Sprout, Sun, Moon,
} from "lucide-react";

const NAV_ITEMS = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutGrid },
  { to: "/admin/queue", label: "Live queue", icon: ListOrdered },
  { to: "/admin/mandis", label: "Mandi management", icon: Sprout },
  { to: "/admin/procurement", label: "Procurement entry", icon: ClipboardList },
  { to: "/admin/payments", label: "Payments", icon: Wallet },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart2 },
  { to: "/admin/farmers", label: "Farmers", icon: Users },
];

export default function AdminLayout({ title, eyebrow, actions, children }) {
  const navigate = useNavigate();

  const [isDark, setIsDark] = useState(
    () => localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  const admin = JSON.parse(localStorage.getItem("user") || "null") || {
    name: "Admin",
    role: "Mandi official",
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex bg-bg">
      <aside className="w-64 shrink-0 bg-sidebar text-white flex flex-col">
        <div className="flex items-center gap-3 px-6 py-6">
          <div className="w-10 h-10 rounded-lg bg-accent-soft flex items-center justify-center">
            <Sprout size={20} className="text-sidebar" />
          </div>
          <div>
            <p className="font-display font-semibold leading-tight text-lg">
              Farmer-SIH
            </p>
            <p className="text-xs text-white/60 leading-tight">Admin workspace</p>
          </div>
        </div>

        <nav className="flex-1 px-3 mt-2 space-y-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-accent-soft/20 font-semibold text-highlight"
                    : "text-white/75 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-6 py-5 text-sm text-white/75 hover:text-white border-t border-white/10"
        >
          <LogOut size={18} />
          Logout
        </button>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center gap-4 px-8 py-4 bg-surface border-b border-border">
          <div className="flex-1 max-w-md relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder="Search the platform..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-surface-soft text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="ml-auto flex items-center gap-3">
            <button
              onClick={() => setIsDark((d) => !d)}
              className="w-9 h-9 rounded-full bg-accent-soft flex items-center justify-center"
              aria-label="Toggle dark mode"
            >
              {isDark ? (
                <Sun size={16} className="text-sidebar" />
              ) : (
                <Moon size={16} className="text-sidebar" />
              )}
            </button>
            <button className="w-9 h-9 rounded-full bg-accent-soft flex items-center justify-center">
              <Bell size={16} className="text-sidebar" />
            </button>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center text-sm font-semibold">
                {admin.name?.charAt(0) || "A"}
              </div>
              <div className="leading-tight text-sm">
                <p className="font-medium text-ink">{admin.name}</p>
                <p className="text-muted text-xs">{admin.role}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 px-8 py-8">
          {(eyebrow || title || actions) && (
            <div className="flex items-start justify-between mb-6">
              <div>
                {eyebrow && <p className="text-accent font-medium mb-1">{eyebrow}</p>}
                {title && (
                  <h1 className="font-display text-4xl font-semibold text-ink">
                    {title}
                  </h1>
                )}
              </div>
              {actions && <div className="flex items-center gap-3">{actions}</div>}
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}