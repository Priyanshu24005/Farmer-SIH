import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Wallet, CheckCircle2 } from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import { getPayments, markPaymentPaid } from "../../api/admin/payment";

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState(null);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const data = await getPayments();
      setPayments(Array.isArray(data) ? data : data.payments || []);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const handleMarkPaid = async (id) => {
    setPayingId(id);
    try {
      const updated = await markPaymentPaid(id);
      setPayments((prev) =>
        prev.map((p) => (p._id === id ? { ...p, ...updated } : p))
      );
      toast.success("Marked as paid");
    } catch {
    } finally {
      setPayingId(null);
    }
  };

  const totalPending = payments
    .filter((p) => p.status !== "paid")
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  const totalPaid = payments
    .filter((p) => p.status === "paid")
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  return (
    <AdminLayout eyebrow="Payouts" title="Payments">
      <p className="text-muted -mt-4 mb-6">
        Track and settle payments created from procurement entries.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-surface rounded-2xl border border-border border-t-2 border-t-accent p-5">
          <p className="text-muted text-sm mb-1">Pending payout</p>
          <p className="font-display text-3xl font-semibold text-ink">
            ₹{totalPending.toLocaleString("en-IN")}
          </p>
        </div>
        <div className="bg-surface rounded-2xl border border-border border-t-2 border-t-primary p-5">
          <p className="text-muted text-sm mb-1">Paid out</p>
          <p className="font-display text-3xl font-semibold text-ink">
            ₹{totalPaid.toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      <div className="bg-surface rounded-2xl border border-border overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-14 rounded-xl bg-surface-soft animate-pulse" />
            ))}
          </div>
        ) : payments.length === 0 ? (
          <div className="p-12 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-accent-soft flex items-center justify-center mb-3">
              <Wallet size={20} className="text-sidebar" />
            </div>
            <p className="font-display font-semibold text-ink text-lg">
              No payments yet
            </p>
            <p className="text-muted text-sm mt-1">
              Payments appear here once procurement is logged.
            </p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted bg-surface-soft">
                <th className="font-medium px-6 py-3">Farmer</th>
                <th className="font-medium px-6 py-3">Mandi</th>
                <th className="font-medium px-6 py-3">Quantity</th>
                <th className="font-medium px-6 py-3">Grade</th>
                <th className="font-medium px-6 py-3">Amount</th>
                <th className="font-medium px-6 py-3">Status</th>
                <th className="font-medium px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => {
                const isPaid = p.status === "paid";
                return (
                  <tr key={p._id} className="border-t border-border">
                    <td className="px-6 py-4 font-medium text-ink">
                      {p.token?.farmer?.name || "—"}
                    </td>
                    <td className="px-6 py-4 text-muted">
                      {p.token?.mandi?.name || "—"}
                    </td>
                    <td className="px-6 py-4 text-muted">{p.quantityKg} kg</td>
                    <td className="px-6 py-4 text-muted">
                      Grade {p.qualityGrade}
                    </td>
                    <td className="px-6 py-4 font-medium text-ink">
                      ₹{p.amount?.toLocaleString("en-IN")}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          isPaid
                            ? "bg-primary/15 text-primary"
                            : "bg-accent-soft/20 text-ink"
                        }`}
                      >
                        {isPaid ? "Paid" : "Pending"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {!isPaid && (
                        <button
                          onClick={() => handleMarkPaid(p._id)}
                          disabled={payingId === p._id}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-on-primary text-xs font-medium hover:opacity-90 disabled:opacity-50"
                        >
                          <CheckCircle2 size={14} />
                          Mark paid
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
}