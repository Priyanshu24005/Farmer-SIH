import { useEffect, useMemo, useState } from "react";
import { Search, X, Phone, MapPin, Sprout, Calendar } from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import { getFarmers } from "../../api/admin/farmer";

export default function Farmers() {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
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
    } catch {
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
      <p className="text-gray-500 -mt-4 mb-6">
        View registered farmers and their crop and mandi details.
      </p>

      <div className="bg-surface rounded-2xl border border-border overflow-hidden">
        <div className="p-4 border-b border-black/5 relative">
          <Search
            size={16}
            className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, mobile, crop..."
            className="w-full max-w-sm pl-9 pr-4 py-2.5 rounded-xl bg-surface-soft text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {loading ? (
          <div className="p-8 space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-14 rounded-xl bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : filteredFarmers.length === 0 ? (
          <div className="p-12 flex flex-col items-center text-center">
           <div className="w-12 h-12 rounded-full bg-accent-soft flex items-center justify-center mb-3">
  <Search size={20} className="text-on-primary" />
</div>
<p className="font-semibold text-accent">No farmers registered yet</p>
<p className="text-muted text-sm mt-1">Farmers will show up here once they register.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
  <thead>
    <tr className="text-left text-muted bg-surface-soft">
      <th className="font-medium px-6 py-3">Farmer</th>
      <th className="font-medium px-6 py-3">Mobile</th>
      <th className="font-medium px-6 py-3">Crop</th>
      <th className="font-medium px-6 py-3">Mandi</th>
    </tr>
  </thead>
  <tbody>
    {filteredFarmers.map((farmer) => (
      <tr
        key={farmer._id}
        onClick={() => setSelected(farmer)}
        className="border-t border-border cursor-pointer hover:bg-surface-soft"
      >
        <td className="px-6 py-4 font-medium text-ink">
          {farmer.name}
        </td>
        <td className="px-6 py-4 text-muted">{farmer.mobile}</td>
        <td className="px-6 py-4 text-muted">
          {farmer.cropType || "—"}
        </td>
        <td className="px-6 py-4 text-muted">
          {mandiLabel(farmer.mandi)}
        </td>
      </tr>
    ))}
  </tbody>
</table>
        
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-surface rounded-2xl w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-ink">
  Farmer details
</h2>
...
<button
  onClick={() => setSelected(null)}
  className="text-muted hover:text-ink"
></button>
            </div>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-full bg-[#1E4635] text-white flex items-center justify-center font-semibold text-lg">
                {selected.name?.charAt(0) || "F"}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{selected.name}</p>
                <p className="text-gray-500 text-sm">Farmer</p>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-gray-400" />
                <span className="text-gray-700">{selected.mobile}</span>
              </div>
              <div className="flex items-center gap-3">
                <Sprout size={16} className="text-gray-400" />
                <span className="text-gray-700">
                  {selected.cropType || "Crop not specified"}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin size={16} className="text-gray-400" />
                <span className="text-gray-700">
                  {mandiLabel(selected.mandi)}
                </span>
              </div>
              {selected.createdAt && (
                <div className="flex items-center gap-3">
                  <Calendar size={16} className="text-gray-400" />
                  <span className="text-gray-700">
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