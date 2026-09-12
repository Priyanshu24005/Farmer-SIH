import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Sprout, Scale, CheckCircle2 } from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import { getMandis } from "../../api/admin/mandi";
import { getQueue } from "../../api/admin/token";
import { createPayment } from "../../api/admin/payment";

const RATE_PER_KG = { A: 25, B: 20, C: 15 };

export default function ProcurementEntry() {
  const [mandis, setMandis] = useState([]);
  const [selectedMandi, setSelectedMandi] = useState("");
  const [queue, setQueue] = useState([]);
  const [loadingMandis, setLoadingMandis] = useState(true);
  const [loadingQueue, setLoadingQueue] = useState(false);

  const [selectedToken, setSelectedToken] = useState(null);
  const [quantityKg, setQuantityKg] = useState("");
  const [qualityGrade, setQualityGrade] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadMandis = async () => {
      try {
        const data = await getMandis();
        const list = Array.isArray(data) ? data : data.mandis || [];
        setMandis(list);
        if (list.length) setSelectedMandi(list[0]._id);
      } catch {
      } finally {
        setLoadingMandis(false);
      }
    };
    loadMandis();
  }, []);

  useEffect(() => {
    if (!selectedMandi) return;
    fetchQueue();
    setSelectedToken(null);
  }, [selectedMandi]);

  const fetchQueue = async () => {
    setLoadingQueue(true);
    try {
      const data = await getQueue(selectedMandi);
      setQueue(Array.isArray(data) ? data : data.queue || []);
    } catch {
    } finally {
      setLoadingQueue(false);
    }
  };

  const estimatedAmount =
    quantityKg && qualityGrade
      ? Number(quantityKg) * RATE_PER_KG[qualityGrade]
      : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedToken) {
      toast.error("Select a farmer from the queue first.");
      return;
    }
    if (!quantityKg || Number(quantityKg) <= 0) {
      toast.error("Enter a valid quantity in kg.");
      return;
    }
    if (!qualityGrade) {
      toast.error("Select a quality grade.");
      return;
    }

    setSubmitting(true);
    try {
      const payment = await createPayment({
        token: selectedToken._id,
        quantityKg: Number(quantityKg),
        qualityGrade,
      });
      toast.success(`Logged — ₹${payment.amount} payment created`);
      setQueue((prev) => prev.filter((t) => t._id !== selectedToken._id));
      setSelectedToken(null);
      setQuantityKg("");
      setQualityGrade("");
    } catch {
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout eyebrow="Procurement" title="Procurement entry">
      <p className="text-muted -mt-4 mb-6">
        Log quantity and quality for a farmer's produce — this creates their
        payment and marks the token served.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 bg-surface rounded-2xl border border-border overflow-hidden">
          <div className="p-4 border-b border-border">
            <label className="text-sm text-muted block mb-1.5">Mandi</label>
            <select
              value={selectedMandi}
              onChange={(e) => setSelectedMandi(e.target.value)}
              disabled={loadingMandis || mandis.length === 0}
              className="w-full px-4 py-2.5 rounded-xl bg-surface-soft text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              {loadingMandis && <option className="bg-surface text-ink">Loading mandis...</option>}
              {!loadingMandis && mandis.length === 0 && (
                <option>No mandis yet</option>
              )}
              {mandis.map((m) => (
                <option key={m._id} value={m._id}className="bg-surface text-ink">
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          <div className="p-2">
            {loadingQueue ? (
              <div className="p-4 space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-14 rounded-xl bg-surface-soft animate-pulse" />
                ))}
              </div>
            ) : queue.length === 0 ? (
              <div className="p-8 flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-full bg-accent-soft flex items-center justify-center mb-2">
                  <Sprout size={18} className="text-sidebar" />
                </div>
                <p className="text-sm font-medium text-ink">No one waiting</p>
                <p className="text-xs text-muted mt-1">
                  Nothing to log for this mandi right now.
                </p>
              </div>
            ) : (
              <div className="space-y-1.5">
                {queue.map((token) => (
                  <button
                    key={token._id}
                    onClick={() => setSelectedToken(token)}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-colors ${
                      selectedToken?._id === token._id
                        ? "bg-primary text-on-primary"
                        : "hover:bg-surface-soft text-ink"
                    }`}
                  >
                    <p className="text-sm font-semibold">
                      #{token.tokenNumber} · {token.farmer?.name || "—"}
                    </p>
                    <p
                      className={`text-xs ${
                        selectedToken?._id === token._id
                          ? "text-on-primary/70"
                          : "text-muted"
                      }`}
                    >
                      {token.farmer?.mobile || "—"}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-3 bg-surface rounded-2xl border border-border p-6">
          {!selectedToken ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-12 h-12 rounded-full bg-accent-soft flex items-center justify-center mb-3">
                <Scale size={20} className="text-sidebar" />
              </div>
              <p className="font-display font-semibold text-ink text-lg">
                Select a farmer
              </p>
              <p className="text-muted text-sm mt-1">
                Pick someone from the queue on the left to log their produce.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border">
                <div className="w-11 h-11 rounded-full bg-primary text-on-primary flex items-center justify-center font-semibold">
                  {selectedToken.farmer?.name?.charAt(0) || "F"}
                </div>
                <div>
                  <p className="font-display font-semibold text-ink">
                    {selectedToken.farmer?.name || "Unknown farmer"}
                  </p>
                  <p className="text-muted text-sm">
                    Token #{selectedToken.tokenNumber} ·{" "}
                    {selectedToken.farmer?.mobile || "—"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-ink mb-1">
                    Quantity (kg)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={quantityKg}
                    onChange={(e) => setQuantityKg(e.target.value)}
                    placeholder="e.g. 250"
                    className="w-full px-4 py-2.5 rounded-xl bg-surface-soft text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink mb-1">
                    Quality grade
                  </label>
                  <select
                    value={qualityGrade}
                    onChange={(e) => setQualityGrade(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-surface-soft text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="">Select grade</option>
                    <option value="A">Grade A — ₹25/kg</option>
                    <option value="B">Grade B — ₹20/kg</option>
                    <option value="C">Grade C — ₹15/kg</option>
                  </select>
                </div>
              </div>

              {estimatedAmount !== null && (
                <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-accent-soft/20 mb-6">
                  <span className="text-sm text-ink">Estimated payment</span>
                  <span className="font-display text-lg font-semibold text-ink">
                    ₹{estimatedAmount.toLocaleString("en-IN")}
                  </span>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-on-primary font-medium hover:opacity-90 disabled:opacity-50"
              >
                <CheckCircle2 size={18} />
                {submitting ? "Logging..." : "Log procurement & mark served"}
              </button>
            </form>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}