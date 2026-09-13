import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ListOrdered, Phone, Sprout, CheckCircle2, XCircle } from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import { getMandis } from "../../api/admin/mandi";
import { getQueue, updateTokenStatus } from "../../api/admin/token";
import { LoadingRows, TableScroll, Badge } from "../../components/admin/ui";

const POLL_INTERVAL_MS = 7000;

export default function LiveQueue() {
  const [mandis, setMandis] = useState([]);
  const [selectedMandi, setSelectedMandi] = useState("");
  const [queue, setQueue] = useState([]);
  const [loadingMandis, setLoadingMandis] = useState(true);
  const [loadingQueue, setLoadingQueue] = useState(false);
  const [actingOnId, setActingOnId] = useState(null);

  useEffect(() => {
    const loadMandis = async () => {
      try {
        const data = await getMandis();
        const list = Array.isArray(data) ? data : data.mandis || [];
        setMandis(list);
        if (list.length) setSelectedMandi(list[0]._id);
      } catch {
        // Keep the existing empty mandi state when the request fails.
      } finally {
        setLoadingMandis(false);
      }
    };
    loadMandis();
  }, []);

  useEffect(() => {
    if (!selectedMandi) return;

    const fetchQueue = async (showSpinner) => {
      if (showSpinner) setLoadingQueue(true);
      try {
        const data = await getQueue(selectedMandi);
        setQueue(Array.isArray(data) ? data : data.queue || []);
      } catch {
        // Keep the existing queue state when polling fails.
      } finally {
        if (showSpinner) setLoadingQueue(false);
      }
    };

    fetchQueue(true);
    const interval = setInterval(() => fetchQueue(false), POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [selectedMandi]);

  const handleStatusUpdate = async (tokenId, status) => {
    setActingOnId(tokenId);
    try {
      await updateTokenStatus(tokenId, status);
      setQueue((prev) => prev.filter((t) => t._id !== tokenId));
      toast.success(status === "served" ? "Marked as served" : "Token cancelled");
    } catch {
      // Keep the existing queue state when the status update fails.
    } finally {
      setActingOnId(null);
    }
  };

  const selectedMandiName =
    mandis.find((m) => m._id === selectedMandi)?.name || "";

  return (
    <AdminLayout eyebrow="Queue operations" title="Live queue">
      <p className="text-muted -mt-4 mb-6">
        Manage waiting farmers for a mandi in real time.
      </p>

      <div className="bg-surface rounded-2xl border border-border overflow-hidden">
        <div className="p-4 border-b border-border flex items-center gap-3 flex-wrap">
          <label className="text-sm text-muted whitespace-nowrap">Mandi:</label>
          <select
            value={selectedMandi}
            onChange={(e) => setSelectedMandi(e.target.value)}
            disabled={loadingMandis || mandis.length === 0}
            className="px-4 py-2.5 rounded-xl bg-surface-soft text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary/20 min-w-[200px]"
          >
            {loadingMandis && <option className="bg-surface text-ink">Loading mandis...</option>}
            {!loadingMandis && mandis.length === 0 && (
              <option>No mandis yet</option>
            )}
            {mandis.map((m) => (
              <option key={m._id} value={m._id} className="bg-surface text-ink">
                {m.name}
              </option>
            ))}
          </select>

          {selectedMandi && (
            <span className="ml-auto flex items-center gap-2 text-xs text-muted">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              Refreshing every 7s
            </span>
          )}
        </div>

        {!selectedMandi ? (
          <div className="p-12 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-accent-soft flex items-center justify-center mb-3">
              <Sprout size={20} className="text-sidebar" />
            </div>
            <p className="font-semibold text-ink">No mandi selected</p>
            <p className="text-muted text-sm mt-1">
              Add a mandi first in Mandi Management, then pick it here.
            </p>
          </div>
        ) : loadingQueue ? (
          <LoadingRows count={3} />
        ) : queue.length === 0 ? (
          <div className="p-12 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-accent-soft flex items-center justify-center mb-3">
              <ListOrdered size={20} className="text-sidebar" />
            </div>
            <p className="font-semibold text-ink">No one waiting</p>
            <p className="text-muted text-sm mt-1">
              {selectedMandiName}'s queue is empty right now.
            </p>
          </div>
        ) : (
          <TableScroll>
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="text-left text-muted bg-surface-soft">
                <th className="font-medium px-6 py-3">Token #</th>
                <th className="font-medium px-6 py-3">Farmer</th>
                <th className="font-medium px-6 py-3">Mobile</th>
                <th className="font-medium px-6 py-3">Crop</th>
                <th className="font-medium px-6 py-3">Date</th>
                <th className="font-medium px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {queue.map((token, index) => (
                <tr
                  key={token._id}
                  className={`border-t border-border ${index === 0 ? "bg-primary/[0.04]" : ""}`}
                >
                  <td className="px-6 py-4 font-semibold text-ink">
                    <span className="inline-flex items-center gap-2">
                      #{token.tokenNumber}
                      {index === 0 && <Badge tone="success">Serving now</Badge>}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-ink">
                    <span className="block">{token.farmer?.name || "—"}</span>
                    <span className="block text-xs text-muted">ID: {token.farmer?._id || "—"}</span>
                  </td>
                  <td className="px-6 py-4 text-muted">
                    <span className="inline-flex items-center gap-1.5">
                      <Phone size={14} />
                      {token.farmer?.mobile || "—"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted">{token.farmer?.cropType || "—"}</td>
                  <td className="px-6 py-4 text-muted">
                    {token.date ? new Date(token.date).toLocaleDateString("en-IN") : "—"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleStatusUpdate(token._id, "served")}
                        disabled={actingOnId === token._id}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-on-primary text-xs font-medium hover:opacity-90 disabled:opacity-50"
                      >
                        <CheckCircle2 size={14} />
                        Mark served
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(token._id, "cancelled")}
                        disabled={actingOnId === token._id}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-muted hover:bg-surface-soft disabled:opacity-50"
                      >
                        <XCircle size={14} />
                        Cancel
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </TableScroll>
        )}
      </div>
    </AdminLayout>
  );
}