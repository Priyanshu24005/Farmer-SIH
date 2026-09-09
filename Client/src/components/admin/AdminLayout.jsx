import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutGrid, Users, ListOrdered, ClipboardList, Wallet,
  BarChart2, Bell, Settings, LogOut, Search, Sprout,
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
    <div className="min-h-screen flex bg-[#F5F3EC]">
      <aside className="w-64 shrink-0 bg-[#1E4635] text-white flex flex-col">
        <div className="flex items-center gap-3 px-6 py-6">
          <div className="w-10 h-10 rounded-xl bg-[#F0E6D2] flex items-center justify-center">
            <Sprout size={20} className="text-[#1E4635]" />
          </div>
          <div>
            <p className="font-semibold leading-tight">Farmer-SIH</p>
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
                    ? "bg-white/10 font-semibold text-white"
                    : "text-white/75 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}

          <NavLink
            to="/admin/notifications"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive ? "bg-white/10 font-semibold text-white" : "text-white/75 hover:bg-white/5 hover:text-white"
              }`
            }
          >
            <Bell size={18} />
            Notifications
          </NavLink>
          <NavLink
            to="/admin/settings"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive ? "bg-white/10 font-semibold text-white" : "text-white/75 hover:bg-white/5 hover:text-white"
              }`
            }
          >
            <Settings size={18} />
            Settings
          </NavLink>
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
        <header className="flex items-center gap-4 px-8 py-4 bg-white border-b border-black/5">
          <div className="flex-1 max-w-md relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search the platform..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#F5F3EC] text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1E4635]/20"
            />
          </div>
          <div className="ml-auto flex items-center gap-4">
            <button className="w-9 h-9 rounded-full bg-[#F0E6D2] flex items-center justify-center">
              <Bell size={16} className="text-[#1E4635]" />
            </button>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#1E4635] text-white flex items-center justify-center text-sm font-semibold">
                {admin.name?.charAt(0) || "A"}
              </div>
              <div className="leading-tight text-sm">
                <p className="font-medium text-gray-900">{admin.name}</p>
                <p className="text-gray-500 text-xs">{admin.role}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 px-8 py-8">
          {(eyebrow || title || actions) && (
            <div className="flex items-start justify-between mb-6">
              <div>
                {eyebrow && <p className="text-[#3E7A5C] font-medium mb-1">{eyebrow}</p>}
                {title && <h1 className="text-3xl font-bold text-gray-900">{title}</h1>}
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