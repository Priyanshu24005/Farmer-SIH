import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { Plus, Pencil, Trash2, MapPin, X } from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import {
  getMandis,
  createMandi,
  updateMandi,
  deleteMandi,
} from "../../api/admin/mandi";

const EMPTY_FORM = { name: "", location: "", dailyCapacity: "" };

export default function MandiManagement() {
  const [mandis, setMandis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    fetchMandis();
  }, []);

  const fetchMandis = async () => {
    setLoading(true);
    try {
      const data = await getMandis();
      setMandis(Array.isArray(data) ? data : data.mandis || []);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const filteredMandis = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return mandis;
    return mandis.filter(
      (m) =>
        m.name?.toLowerCase().includes(q) ||
        m.location?.toLowerCase().includes(q)
    );
  }, [mandis, search]);

  const openCreateModal = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEditModal = (mandi) => {
    setEditingId(mandi._id);
    setForm({
      name: mandi.name || "",
      location: mandi.location || "",
      dailyCapacity: mandi.dailyCapacity ?? "",
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;
    setModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.location.trim() || !form.dailyCapacity) {
      toast.error("Fill in name, location, and daily capacity.");
      return;
    }

    const payload = {
      name: form.name.trim(),
      location: form.location.trim(),
      dailyCapacity: Number(form.dailyCapacity),
    };

    setSaving(true);
    try {
      if (editingId) {
        const updated = await updateMandi(editingId, payload);
        setMandis((prev) =>
          prev.map((m) => (m._id === editingId ? { ...m, ...updated } : m))
        );
        toast.success("Mandi updated");
      } else {
        const created = await createMandi(payload);
        setMandis((prev) => [created, ...prev]);
        toast.success("Mandi created");
      }
      setModalOpen(false);
    } catch {
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMandi(deleteTarget._id);
      setMandis((prev) => prev.filter((m) => m._id !== deleteTarget._id));
      toast.success("Mandi deleted");
    } catch {
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <AdminLayout
      eyebrow="Mandi operations"
      title="Mandi management"
      actions={
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-[#1E4635] text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-[#173627] transition-colors"
        >
          <Plus size={16} />
          Add mandi
        </button>
      }
    >
      <p className="text-gray-500 -mt-4 mb-6">
        Add and edit mandis, and set each one's daily procurement capacity.
      </p>

      <div className="bg-white rounded-2xl border border-black/5 overflow-hidden">
        <div className="p-4 border-b border-black/5">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, location..."
            className="w-full max-w-sm px-4 py-2.5 rounded-xl bg-[#F5F3EC] text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1E4635]/20"
          />
        </div>

        {loading ? (
          <div className="p-8 space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-14 rounded-xl bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : filteredMandis.length === 0 ? (
          <div className="p-12 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-[#F0E6D2] flex items-center justify-center mb-3">
              <MapPin size={20} className="text-[#1E4635]" />
            </div>
            <p className="font-semibold text-gray-900">
              {search ? "No matching mandis" : "No mandis yet"}
            </p>
            <p className="text-gray-500 text-sm mt-1">
              {search
                ? "Try a different name or location."
                : "Add your first mandi to start managing its queue."}
            </p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 bg-[#F5F3EC]/60">
                <th className="font-medium px-6 py-3">Mandi</th>
                <th className="font-medium px-6 py-3">Location</th>
                <th className="font-medium px-6 py-3">Daily capacity</th>
                <th className="font-medium px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMandis.map((mandi) => (
                <tr key={mandi._id} className="border-t border-black/5">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {mandi.name}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{mandi.location}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {mandi.dailyCapacity} tokens/day
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openEditModal(mandi)}
                        className="p-2 rounded-lg hover:bg-[#F5F3EC] text-gray-500 hover:text-[#1E4635]"
                        aria-label={`Edit ${mandi.name}`}
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(mandi)}
                        className="p-2 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-600"
                        aria-label={`Delete ${mandi.name}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingId ? "Edit mandi" : "Add mandi"}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mandi name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Meerut Mandi"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F5F3EC] text-sm focus:outline-none focus:ring-2 focus:ring-[#1E4635]/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) =>
                    setForm({ ...form, location: e.target.value })
                  }
                  placeholder="e.g. Meerut, UP"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F5F3EC] text-sm focus:outline-none focus:ring-2 focus:ring-[#1E4635]/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Daily capacity (tokens)
                </label>
                <input
                  type="number"
                  min="1"
                  value={form.dailyCapacity}
                  onChange={(e) =>
                    setForm({ ...form, dailyCapacity: e.target.value })
                  }
                  placeholder="e.g. 100"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F5F3EC] text-sm focus:outline-none focus:ring-2 focus:ring-[#1E4635]/20"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 rounded-xl bg-[#1E4635] text-white text-sm font-medium hover:bg-[#173627] disabled:opacity-60"
                >
                  {saving ? "Saving..." : editingId ? "Save changes" : "Create mandi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <Trash2 size={20} className="text-red-500" />
            </div>
            <h2 className="font-semibold text-gray-900 mb-1">Delete mandi?</h2>
            <p className="text-sm text-gray-500 mb-5">
              This removes <span className="font-medium">{deleteTarget.name}</span> and
              can't be undone. Any active queue for it should be cleared first.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}