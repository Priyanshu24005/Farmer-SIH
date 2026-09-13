import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users, Sprout, Clock, ListOrdered, ArrowRight, ChevronRight,
  CircleAlert, Wallet, CheckCircle2,
} from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import { getDashboardStats } from "../../api/admin/analytics";
import { Card, CardBody, StatCard, EmptyState, LoadingRows } from "../../components/admin/ui";

const chartData = [40, 55, 48, 70, 65, 90];
const chartLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Today"];

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch {
        setStats(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [reloadKey]);

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const admin = JSON.parse(localStorage.getItem("admin-user") || "null") || {
      name: "Admin",
    };

  const maxVal = Math.max(...chartData);

  const reviewItems = stats
    ? [
        {
          label: "Pending payments",
          sub: "Awaiting settlement",
          count: stats.pendingPayments,
          suffix: "pending",
          tone: "warning",
          to: "/admin/payments",
        },
        {
          label: "Waiting in queue",
          sub: "Across all mandis",
          count: stats.waitingNow,
          suffix: "waiting",
          tone: "neutral",
          to: "/admin/queue",
        },
        {
          label: "Served today",
          sub: "Procurement logged",
          count: stats.servedToday,
          suffix: "logged",
          tone: "success",
          to: "/admin/procurement",
        },
      ]
    : [];

  return (
    <AdminLayout
      eyebrow={today}
      title={`Good morning, ${admin.name || "Admin"}`}
      actions={
        <button
          onClick={() => navigate("/admin/queue")}
          className="inline-flex items-center justify-center gap-2 bg-primary text-on-primary px-4 py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity w-full sm:w-auto"
        >
          Review queue
          <ArrowRight size={16} />
        </button>
      }
    >
      <p className="text-muted -mt-4 mb-6">
        Here&apos;s the latest pulse across KisanSetu.
      </p>

      {!loading && !stats ? (
        <Card>
          <EmptyState
            icon={CircleAlert}
            title="Couldn't load dashboard data"
            hint="Check your connection and try again."
            action={
              <button
                onClick={() => setReloadKey((k) => k + 1)}
          className="inline-flex items-center justify-center gap-2 bg-primary text-on-primary px-4 py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity w-full sm:w-auto"
              >
                Retry
              </button>
            }
          />
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard
              label="Total farmers"
              value={loading ? "…" : stats.totalFarmers}
              sub={loading ? " " : `${stats.servedToday} served today`}
              icon={Users}
            />
            <StatCard
              label="Mandis registered"
              value={loading ? "…" : stats.totalMandis}
              sub={loading ? " " : `${stats.tokensToday} tokens today`}
              icon={Sprout}
            />
            <StatCard
              label="Pending payments"
              value={loading ? "…" : stats.pendingPayments}
              sub={loading ? " " : "Awaiting settlement"}
              icon={Clock}
              iconTone="amber"
            />
            <StatCard
              label="Waiting now"
              value={loading ? "…" : stats.waitingNow}
              sub={loading ? " " : "Across all mandis"}
              icon={ListOrdered}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
            <Card className="lg:col-span-2">
              <CardBody>
                <div className="flex items-center justify-between gap-3 mb-1">
                  <p className="font-display font-semibold text-ink text-lg">
                    Platform activity
                  </p>
                  <button
                    onClick={() => navigate("/admin/analytics")}
                    className="text-sm font-medium text-primary hover:opacity-80"
                  >
                    View report
                  </button>
                </div>
                <p className="text-muted text-sm mb-6">
                  Placeholder trend — swap for real historical data once an
                  over-time endpoint exists.
                </p>
                <div className="flex flex-col">
                  <div className="h-40 flex gap-3 sm:gap-4">
                    {chartData.map((val, i) => (
                      <div key={i} className="flex-1 h-full flex items-end min-w-0">
                        <div
                          className="w-full rounded-t-lg bg-primary/80"
                          style={{ height: `${(val / maxVal) * 100}%` }}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3 sm:gap-4 mt-2">
                    {chartLabels.map((label, i) => (
                      <span key={i} className="flex-1 text-center text-xs text-muted truncate">
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <p className="font-display font-semibold text-ink text-lg mb-1">
                  Review queue
                </p>
                <p className="text-muted text-sm mb-4">Items requiring attention</p>
                {loading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-12 rounded-xl bg-surface-soft animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-1">
                    {reviewItems.map((item) => (
                      <button
                        key={item.label}
                        onClick={() => navigate(item.to)}
                        className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-surface-soft text-left transition-colors"
                      >
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-medium text-ink truncate">
                            {item.label}
                          </span>
                          <span className="block text-xs text-muted truncate">
                            {item.sub}
                          </span>
                        </span>
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                            item.tone === "warning"
                              ? "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-200"
                              : item.tone === "success"
                                ? "bg-primary/10 text-primary"
                                : "bg-surface-soft text-muted"
                          }`}
                        >
                          {item.count} {item.suffix}
                        </span>
                        <ChevronRight size={16} className="text-muted shrink-0" />
                      </button>
                    ))}
                  </div>
                )}
              </CardBody>
            </Card>
          </div>

          <Card>
            <CardBody>
              <p className="font-display font-semibold text-ink text-lg mb-1">
                Today at a glance
              </p>
              <p className="text-muted text-sm mb-4">Across all mandis</p>

              {loading ? (
                <LoadingRows count={3} className="p-0" />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-surface-soft">
                    <ListOrdered size={18} className="text-accent shrink-0" />
                    <div className="min-w-0">
                      <p className="font-display text-2xl font-semibold text-ink">
                        {stats.tokensToday}
                      </p>
                      <p className="text-xs text-muted">Tokens booked today</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-surface-soft">
                    <CheckCircle2 size={18} className="text-primary shrink-0" />
                    <div className="min-w-0">
                      <p className="font-display text-2xl font-semibold text-ink">
                        {stats.servedToday}
                      </p>
                      <p className="text-xs text-muted">Procurement logged</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-surface-soft">
                    <Wallet size={18} className="text-accent shrink-0" />
                    <div className="min-w-0">
                      <p className="font-display text-2xl font-semibold text-ink">
                        {stats.paidPayments}
                      </p>
                      <p className="text-xs text-muted">
                        Payments paid · {stats.pendingPayments} pending
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardBody>
          </Card>
        </>
      )}
    </AdminLayout>
  );
}
