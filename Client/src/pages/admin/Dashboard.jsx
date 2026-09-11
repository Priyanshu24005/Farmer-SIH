import { useEffect, useState } from "react";
import { Users, Sprout, Clock, ListOrdered } from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import { getFarmers } from "../../api/admin/farmer";
import { getMandis } from "../../api/admin/mandi";

const chartData = [40, 55, 48, 70, 65, 90];
const chartLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Today"];

function StatCard({ label, value, hint, icon: Icon }) {
  return (
    <div className="bg-surface rounded-2xl border border-border border-t-2 border-t-accent p-5">
      <div className="flex items-center gap-2 mb-3">
        <Icon size={15} className="text-accent" />
        <p className="text-muted text-sm">{label}</p>
      </div>
      <p className="font-display text-3xl font-semibold text-ink">{value}</p>
      {hint && <p className="text-accent text-sm mt-1">{hint}</p>}
    </div>
  );
}

export default function Dashboard() {
  const [farmerCount, setFarmerCount] = useState(null);
  const [mandiCount, setMandiCount] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [farmers, mandis] = await Promise.all([
          getFarmers(),
          getMandis(),
        ]);
        const farmerList = Array.isArray(farmers) ? farmers : farmers.farmers || [];
        const mandiList = Array.isArray(mandis) ? mandis : mandis.mandis || [];
        setFarmerCount(farmerList.length);
        setMandiCount(mandiList.length);
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
        <StatCard label="Total farmers" value={loading ? "…" : farmerCount} icon={Users} />
        <StatCard label="Mandis registered" value={loading ? "…" : mandiCount} icon={Sprout} />
        <StatCard
          label="Pending requests"
          value="—"
          hint="Wire up once token status filtering is ready"
          icon={Clock}
        />
        <StatCard
          label="Live queue (all mandis)"
          value="—"
          hint="Wire up once queue-count endpoint is ready"
          icon={ListOrdered}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-surface rounded-2xl border border-border p-6">
          <p className="font-display font-semibold text-ink text-lg mb-1">
            Platform activity
          </p>
          <p className="text-muted text-sm mb-6">
            Placeholder data — connect to a real analytics endpoint later.
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
            Review queue
          </p>
          <p className="text-muted text-sm mb-4">Items requiring attention</p>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-ink text-sm">Live queue</p>
                <p className="text-muted text-xs">Waiting farmers today</p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-accent-soft/20 text-xs font-medium text-ink">
                —
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-ink text-sm">Support requests</p>
                <p className="text-muted text-xs">Awaiting response</p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-surface-soft text-xs font-medium text-ink">
                —
              </span>
            </div>
            <p className="text-xs text-muted pt-2 border-t border-border">
              These will populate once the queue/support APIs are wired in.
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}