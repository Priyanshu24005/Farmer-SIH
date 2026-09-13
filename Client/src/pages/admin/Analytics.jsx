import { useEffect, useState } from "react";
import {
  Users, Sprout, Wallet, ListOrdered, CheckCircle2, Clock, TrendingUp,
} from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import { getMandis } from "../../api/admin/mandi";
import { getDashboardStats, getMandiStats } from "../../api/admin/analytics";
import { StatCard } from "../../components/admin/ui";

export default function Analytics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const [mandis, setMandis] = useState([]);
  const [selectedMandi, setSelectedMandi] = useState("");
  const [mandiStats, setMandiStats] = useState(null);
  const [loadingMandiStats, setLoadingMandiStats] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch {
        // Keep the existing empty statistics state when the request fails.
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const loadMandis = async () => {
      try {
        const data = await getMandis();
        const list = Array.isArray(data) ? data : data.mandis || [];
        setMandis(list);
        if (list.length) setSelectedMandi(list[0]._id);
      } catch {
        // Keep the existing empty mandi state when the request fails.
      }
    };
    loadMandis();
  }, []);

  useEffect(() => {
    if (!selectedMandi) return;
    const loadMandiStats = async () => {
      setLoadingMandiStats(true);
      try {
        const data = await getMandiStats(selectedMandi);
        setMandiStats(data);
      } catch {
        // Keep the existing empty mandi statistics state when the request fails.
      } finally {
        setLoadingMandiStats(false);
      }
    };
    loadMandiStats();
  }, [selectedMandi]);

  return (
    <AdminLayout eyebrow="Business intelligence" title="Analytics">
      <p className="text-muted -mt-4 mb-6">
        Platform-wide numbers, updated live from your database.
      </p>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 rounded-2xl bg-surface-soft animate-pulse" />
          ))}
        </div>
      ) : !stats ? (
        <div className="bg-surface rounded-2xl border border-border p-8 text-center mb-8">
          <p className="text-muted text-sm">Couldn't load platform statistics.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <StatCard label="Total farmers" value={stats.totalFarmers} sub={`${stats.tokensToday} tokens today`} icon={Users} />
            <StatCard label="Total mandis" value={stats.totalMandis} sub={`${stats.servedToday} served today`} icon={Sprout} />
            <StatCard
              label="Revenue paid out"
              value={`₹${(stats.totalRevenue || 0).toLocaleString("en-IN")}`}
              sub={`${stats.paidPayments} payments settled`}
              icon={TrendingUp}
            />
            <StatCard label="Tokens today" value={stats.tokensToday} sub="Across all mandis" icon={ListOrdered} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard label="Served today" value={stats.servedToday} sub="Procurement logged" icon={CheckCircle2} />
            <StatCard label="Waiting now" value={stats.waitingNow} sub="In queue now" icon={Clock} iconTone="amber" />
            <StatCard label="Payments pending" value={stats.pendingPayments} sub="Awaiting settlement" icon={Wallet} iconTone="amber" />
            <StatCard label="Payments paid" value={stats.paidPayments} sub="Settled to farmers" icon={Wallet} />
          </div>
        </>
      )}

      <div className="bg-surface rounded-2xl border border-border p-6">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div>
            <p className="font-display font-semibold text-ink text-lg">
              Per-mandi breakdown
            </p>
            <p className="text-muted text-sm">Today's activity for one mandi</p>
          </div>
          <select
            value={selectedMandi}
            onChange={(e) => setSelectedMandi(e.target.value)}
            disabled={mandis.length === 0}
            className="px-4 py-2.5 rounded-xl bg-surface-soft text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary/20 min-w-[200px]"
          >
            {mandis.length === 0 && <option>No mandis yet</option>}
            {mandis.map((m) => (
              <option key={m._id} value={m._id} className="bg-surface text-ink">
                {m.name}
              </option>
            ))}
          </select>
        </div>

        {loadingMandiStats ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 rounded-xl bg-surface-soft animate-pulse" />
            ))}
          </div>
        ) : mandiStats ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-surface-soft">
              <p className="text-muted text-xs mb-1">Tokens today</p>
              <p className="font-display text-2xl font-semibold text-ink">
                {mandiStats.tokensToday}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-surface-soft">
              <p className="text-muted text-xs mb-1">Served today</p>
              <p className="font-display text-2xl font-semibold text-ink">
                {mandiStats.servedToday}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-surface-soft">
              <p className="text-muted text-xs mb-1">Waiting now</p>
              <p className="font-display text-2xl font-semibold text-ink">
                {mandiStats.waitingNow}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-muted text-sm">Select a mandi to see its numbers.</p>
        )}
      </div>
    </AdminLayout>
  );
}