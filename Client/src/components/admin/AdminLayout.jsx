import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutGrid, Users, ListOrdered, ClipboardList, Wallet,
  BarChart2, Bell, LogOut, Search, Sprout, Sun, Moon, X, CheckCircle2,
} from "lucide-react";
import { getDashboardStats } from "../../api/admin/analytics";

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
  const searchRef = useRef(null);

  const [isDark, setIsDark] = useState(
    () => localStorage.getItem("theme") === "dark"
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  const [stats, setStats] = useState(null);
  useEffect(() => {
    const load = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch {
      }
    };
    load();
  }, []);

  const notifications = [];
  if (stats) {
    if (stats.pendingPayments > 0) {
      notifications.push({
        id: "pending-payments",
        icon: Wallet,
        tone: "warning",
        text: `${stats.pendingPayments} payment${stats.pendingPayments > 1 ? "s" : ""} still pending`,
      });
    }
    if (stats.waitingNow > 0) {
      notifications.push({
        id: "waiting-now",
        icon: ListOrdered,
        tone: "warning",
        text: `${stats.waitingNow} farmer${stats.waitingNow > 1 ? "s" : ""} waiting across all mandis`,
      });
    }
    if (stats.servedToday > 0) {
      notifications.push({
        id: "served-today",
        icon: CheckCircle2,
        tone: "info",
        text: `${stats.servedToday} procurement${stats.servedToday > 1 ? "s" : ""} logged today`,
      });
    }
  }

  const admin = JSON.parse(localStorage.getItem("user") || "null") || {
    name: "Admin",
    role: "Mandi official",
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/admin/login");
  };

  const searchResults = NAV_ITEMS.filter((item) =>
    item.label.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  const goToPage = (to) => {
    navigate(to);
    setSearchQuery("");
    setSearchOpen(false);
    searchRef.current?.blur();
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
        <header className="flex items-center gap-4 px-8 py-4 bg-surface border-b border-border relative z-20">
          <div className="flex-1 max-w-md relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              ref={searchRef}
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSearchOpen(true);
              }}
              onFocus={() => setSearchOpen(true)}
              placeholder="Search pages... e.g. payments"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-surface-soft text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/20"
            />

            {searchOpen && searchQuery.trim() && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setSearchOpen(false)}
                />
                <div className="absolute top-full left-0 right-0 mt-2 bg-surface border border-border rounded-xl shadow-lg overflow-hidden z-20">
                  {searchResults.length === 0 ? (
                    <p className="px-4 py-3 text-sm text-muted">
                      No pages match "{searchQuery}"
                    </p>
                  ) : (
                    searchResults.map(({ to, label, icon: Icon }) => (
                      <button
                        key={to}
                        onClick={() => goToPage(to)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-ink hover:bg-surface-soft text-left"
                      >
                        <Icon size={16} className="text-accent" />
                        {label}
                      </button>
                    ))
                  )}
                </div>
              </>
            )}
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

            <div className="relative">
              <button
                onClick={() => setNotifOpen((o) => !o)}
                className="relative w-9 h-9 rounded-full bg-accent-soft flex items-center justify-center"
                aria-label="Notifications"
              >
                <Bell size={16} className="text-sidebar" />
                {notifications.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
                )}
              </button>

              {notifOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setNotifOpen(false)}
                  />
                  <div className="absolute top-full right-0 mt-2 w-72 bg-surface border border-border rounded-xl shadow-lg z-20">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                      <p className="font-medium text-ink text-sm">Notifications</p>
                      <button onClick={() => setNotifOpen(false)}>
                        <X size={14} className="text-muted" />
                      </button>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="px-4 py-6 text-center">
                          <p className="text-sm text-muted">All caught up</p>
                          <p className="text-xs text-muted mt-1">
                            Nothing needs your attention right now.
                          </p>
                        </div>
                      ) : (
                        notifications.map(({ id, icon: Icon, tone, text }) => (
                          <div
                            key={id}
                            className="flex items-start gap-3 px-4 py-3 border-b border-border last:border-b-0"
                          >
                            <Icon
                              size={16}
                              className={
                                tone === "warning" ? "text-accent mt-0.5" : "text-primary mt-0.5"
                              }
                            />
                            <p className="text-sm text-ink">{text}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => setProfileOpen((o) => !o)}
                className="flex items-center gap-2.5"
              >
                <div className="w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center text-sm font-semibold">
                  {admin.name?.charAt(0) || "A"}
                </div>
                <div className="leading-tight text-sm text-left">
                  <p className="font-medium text-ink">{admin.name}</p>
                  <p className="text-muted text-xs">{admin.role}</p>
                </div>
              </button>

              {profileOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setProfileOpen(false)}
                  />
                  <div className="absolute top-full right-0 mt-2 w-56 bg-surface border border-border rounded-xl shadow-lg z-20 overflow-hidden">
                    <div className="px-4 py-3 border-b border-border">
                      <p className="font-medium text-ink text-sm">{admin.name}</p>
                      <p className="text-muted text-xs">{admin.role}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-red-600 hover:bg-red-50 text-left"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                </>
              )}
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