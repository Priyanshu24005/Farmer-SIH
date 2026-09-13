import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Wallet, CheckCircle2, Clock } from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import { getPayments, markPaymentPaid } from "../../api/admin/payment";
import { Card, StatCard, Badge, EmptyState, LoadingRows, TableScroll } from "../../components/admin/ui";

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
      // Keep the existing empty payment state when loading fails.
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
      // Keep the existing payment state when updating fails.
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
        <StatCard
          label="Pending payout"
          value={`₹${totalPending.toLocaleString("en-IN")}`}
          sub={`${payments.filter((p) => p.status !== "paid").length} awaiting settlement`}
          icon={Clock}
          iconTone="amber"
        />
        <StatCard
          label="Paid out"
          value={`₹${totalPaid.toLocaleString("en-IN")}`}
          sub={`${payments.filter((p) => p.status === "paid").length} settled to farmers`}
          icon={CheckCircle2}
        />
      </div>

      <Card>
        {loading ? (
          <LoadingRows count={3} />
        ) : payments.length === 0 ? (
          <EmptyState
            icon={Wallet}
            title="No payments yet"
            hint="Payments appear here once procurement is logged."
          />
        ) : (
          <TableScroll>
          <table className="w-full text-sm min-w-[720px]">
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
                      <Badge tone={isPaid ? "success" : "warning"}>
                        {isPaid ? "Paid" : "Pending"}
                      </Badge>
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
          </TableScroll>
        )}
      </Card>
    </AdminLayout>
  );
}