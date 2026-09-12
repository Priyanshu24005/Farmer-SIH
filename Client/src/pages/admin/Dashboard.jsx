import { useEffect, useState } from "react";
import { Users, Sprout, Clock, ListOrdered } from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import { getDashboardStats } from "../../api/admin/analytics";

const chartData = [40, 55, 48, 70, 65, 90];
const chartLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Today"];

function StatCard({ label, value, icon: Icon }) {
  return (
    <div className="bg-surface rounded-2xl border border-border border-t-2 border-t-accent p-5">
      <div className="flex items-center gap-2 mb-3">
        <Icon size={15} className="text-accent" />
        <p className="text-muted text-sm">{label}</p>
      </div>
      <p className="font-display text-3xl font-semibold text-ink">{value}</p>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch {
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const admin = JSON.parse(localStorage.getItem("user") || "null") || {
    name: "Admin",
  };

  const maxVal = Math.max(...chartData);

  return (
    <AdminLayout eyebrow={today} title={`Good morning, ${admin.name || "Admin"}`}>
      
      <p className="text-muted -mt-4 mb-6">
        Here's the latest pulse across Farmer-SIH.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Total farmers"
          value={loading ? "…" : stats.totalFarmers}
          icon={Users}
        />
        <StatCard
          label="Mandis registered"
          value={loading ? "…" : stats.totalMandis}
          icon={Sprout}
        />
        <StatCard
          label="Pending payments"
          value={loading ? "…" : stats.pendingPayments}
          icon={Clock}
        />
        <StatCard
          label="Waiting now (all mandis)"
          value={loading ? "…" : stats.waitingNow}
          icon={ListOrdered}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-surface rounded-2xl border border-border p-6">
          <p className="font-display font-semibold text-ink text-lg mb-1">
            Platform activity
          </p>
          <p className="text-muted text-sm mb-6">
            Placeholder trend — swap for real historical data once an
            over-time endpoint exists.
          </p>
          <div className="flex flex-col">
            <div className="h-40 flex gap-4">
              {chartData.map((val, i) => (
                <div key={i} className="flex-1 h-full flex items-end">
                  <div
                    className="w-full rounded-t-lg bg-primary"
                    style={{ height: `${(val / maxVal) * 100}%` }}
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-4 mt-2">
              {chartLabels.map((label, i) => (
                <span key={i} className="flex-1 text-center text-xs text-muted">
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-surface rounded-2xl border border-border p-6">
          <p className="font-display font-semibold text-ink text-lg mb-1">
            Today at a glance
          </p>
          <p className="text-muted text-sm mb-4">Across all mandis</p>

          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-12 rounded-xl bg-surface-soft animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-ink text-sm">Tokens today</p>
                  <p className="text-muted text-xs">Booked across all mandis</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-accent-soft/20 text-xs font-medium text-ink">
                  {stats.tokensToday}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-ink text-sm">Served today</p>
                  <p className="text-muted text-xs">Procurement logged</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-primary/15 text-xs font-medium text-primary">
                  {stats.servedToday}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-ink text-sm">Payments paid</p>
                  <p className="text-muted text-xs">Out of {stats.pendingPayments + stats.paidPayments} total</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-surface-soft text-xs font-medium text-ink">
                  {stats.paidPayments}
                </span>
              </div>
              <p className="text-xs text-muted pt-2 border-t border-border">
                See the Analytics screen for the full breakdown and revenue.
              </p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}