import { useEffect, useMemo, useState } from "react";
import { Search, X, Phone, MapPin, Sprout, Calendar, Users, RefreshCw, AlertCircle } from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import { getFarmers } from "../../api/admin/farmer";
import { Badge, LoadingRows, TableScroll } from "../../components/admin/ui";
import "./farmers.css";

export default function Farmers() {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetchFarmers();
  }, []);

  const fetchFarmers = async () => {
    setLoading(true);
    try {
      const data = await getFarmers();
      setFarmers(Array.isArray(data) ? data : data.farmers || []);
      setError(false);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const filteredFarmers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return farmers;
    return farmers.filter(
      (f) =>
        f.name?.toLowerCase().includes(q) ||
        f.mobile?.includes(q) ||
        f.cropType?.toLowerCase().includes(q)
    );
  }, [farmers, search]);

  const mandiLabel = (mandi) => {
    if (!mandi) return "—";
    if (typeof mandi === "object") return mandi.name || "—";
    return "—";
  };

  return (
    <AdminLayout eyebrow="Farmer directory" title="Farmers">
      <div className="farmers-page">
        <div className="farmers-intro">
          <div>
            <p className="text-muted">A clear view of the farmers registered in your mandi network.</p>
          </div>
          <div className="farmers-summary" aria-label="Farmer directory summary">
            <span><strong>{farmers.length}</strong> registered</span>
            {search && <span><strong>{filteredFarmers.length}</strong> matching</span>}
          </div>
        </div>

        <div className="farmers-panel">
          <div className="farmers-toolbar">
            <div className="farmers-search">
              <Search size={17} aria-hidden="true" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, mobile, or crop"
                aria-label="Search farmers"
              />
              {search && <button type="button" onClick={() => setSearch("")} aria-label="Clear farmer search"><X size={16} /></button>}
            </div>
            <span className="farmers-toolbar-note"><Users size={16} /> Directory records</span>
          </div>

          {loading ? (
            <LoadingRows count={4} className="farmers-loading" />
          ) : error ? (
            <div className="farmers-state">
              <div className="farmers-state-icon is-error"><AlertCircle size={21} /></div>
              <p>We couldn&apos;t load the farmer directory</p>
              <span>Check the connection and try again.</span>
              <button type="button" onClick={fetchFarmers}><RefreshCw size={15} /> Try again</button>
            </div>
          ) : filteredFarmers.length === 0 ? (
            <div className="farmers-state">
              <div className="farmers-state-icon"><Users size={21} /></div>
              <p>{search ? "No matching farmers" : "No farmers registered yet"}</p>
              <span>{search ? "Try a different name, mobile, or crop." : "Farmers will show up here once they register."}</span>
            </div>
          ) : (
            <>
              <div className="farmers-mobile-list">
                {filteredFarmers.map((farmer) => <FarmerCard key={farmer._id || farmer.mobile || farmer.name} farmer={farmer} mandiLabel={mandiLabel} onClick={() => setSelected(farmer)} />)}
              </div>
              <TableScroll>
                <table className="farmers-table">
                  <thead><tr><th>Farmer</th><th>Mobile</th><th>Crop</th><th>Mandi</th><th>Status</th></tr></thead>
                  <tbody>{filteredFarmers.map((farmer) => (
                    <tr key={farmer._id || farmer.mobile || farmer.name} onClick={() => setSelected(farmer)} tabIndex="0" onKeyDown={(event) => event.key === "Enter" && setSelected(farmer)}>
                      <td><div className="farmer-name"><span>{farmer.name?.charAt(0) || "F"}</span><strong>{farmer.name || "Unnamed farmer"}</strong></div></td>
                      <td>{farmer.mobile || "—"}</td><td>{farmer.cropType || "—"}</td><td>{mandiLabel(farmer.mandi)}</td><td><Badge tone="success">Registered</Badge></td>
                    </tr>
                  ))}</tbody>
                </table>
              </TableScroll>
            </>
          )}
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-surface rounded-2xl w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-lg font-semibold text-ink">
                Farmer details
              </h2>
              <button
                onClick={() => setSelected(null)}
                className="text-muted hover:text-ink"
                aria-label="Close farmer details"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center font-semibold text-lg">
                {selected.name?.charAt(0) || "F"}
              </div>
              <div>
                <p className="font-semibold text-ink">{selected.name}</p>
                <p className="text-muted text-sm">Farmer</p>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-muted" />
                <span className="text-ink">{selected.mobile}</span>
              </div>
              <div className="flex items-center gap-3">
                <Sprout size={16} className="text-muted" />
                <span className="text-ink">
                  {selected.cropType || "Crop not specified"}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin size={16} className="text-muted" />
                <span className="text-ink">
                  {mandiLabel(selected.mandi)}
                </span>
              </div>
              {selected.createdAt && (
                <div className="flex items-center gap-3">
                  <Calendar size={16} className="text-muted" />
                  <span className="text-ink">
                    Registered{" "}
                    {new Date(selected.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              )}
            </div>

            <button
              onClick={() => setSelected(null)}
              className="w-full mt-6 py-2.5 rounded-xl border border-border text-sm font-medium text-muted hover:bg-surface-soft"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

function FarmerCard({ farmer, mandiLabel, onClick }) {
  return (
    <button type="button" className="farmer-card" onClick={onClick}>
      <span className="farmer-card-top"><span className="farmer-avatar">{farmer.name?.charAt(0) || "F"}</span><span><strong>{farmer.name || "Unnamed farmer"}</strong><small>{farmer.mobile || "Mobile not available"}</small></span><Badge tone="success">Registered</Badge></span>
      <span className="farmer-card-details"><span><Sprout size={14} />{farmer.cropType || "Crop not specified"}</span><span><MapPin size={14} />{mandiLabel(farmer.mandi)}</span></span>
    </button>
  );
}