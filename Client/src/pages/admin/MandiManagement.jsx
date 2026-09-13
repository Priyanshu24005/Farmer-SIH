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
import { LoadingRows, TableScroll } from "../../components/admin/ui";

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
      // Keep the existing empty mandi state when loading fails.
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
      // Keep the existing form state when saving fails.
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
      // Keep the existing list state when deletion fails.
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
          className="flex items-center gap-2 bg-primary text-on-primary px-4 py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus size={16} />
          Add mandi
        </button>
      }
    >
      <p className="text-muted -mt-4 mb-6">
        Add and edit mandis, and set each one's daily procurement capacity.
      </p>

      <div className="bg-surface rounded-2xl border border-border overflow-hidden">
        <div className="p-4 border-b border-border">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, location..."
            className="w-full max-w-sm px-4 py-2.5 rounded-xl bg-surface-soft text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {loading ? (
          <LoadingRows count={3} />
        ) : filteredMandis.length === 0 ? (
          <div className="p-12 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-accent-soft flex items-center justify-center mb-3">
              <MapPin size={20} className="text-sidebar" />
            </div>
            <p className="font-display font-semibold text-ink text-lg">
              {search ? "No matching mandis" : "No mandis yet"}
            </p>
            <p className="text-muted text-sm mt-1">
              {search
                ? "Try a different name or location."
                : "Add your first mandi to start managing its queue."}
            </p>
          </div>
        ) : (
          <TableScroll>
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="text-left text-muted bg-surface-soft">
                <th className="font-medium px-6 py-3">Mandi</th>
                <th className="font-medium px-6 py-3">Location</th>
                <th className="font-medium px-6 py-3">Daily capacity</th>
                <th className="font-medium px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMandis.map((mandi) => (
                <tr key={mandi._id} className="border-t border-border">
                  <td className="px-6 py-4 font-medium text-ink">
                    {mandi.name}
                  </td>
                  <td className="px-6 py-4 text-muted">{mandi.location}</td>
                  <td className="px-6 py-4 text-muted">
                    {mandi.dailyCapacity} tokens/day
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openEditModal(mandi)}
                        className="p-2 rounded-lg hover:bg-surface-soft text-muted hover:text-accent"
                        aria-label={`Edit ${mandi.name}`}
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(mandi)}
                        className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-muted hover:text-red-600 dark:hover:text-red-400"
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
          </TableScroll>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-surface rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-lg font-semibold text-ink">
                {editingId ? "Edit mandi" : "Add mandi"}
              </h2>
              <button onClick={closeModal} className="text-muted hover:text-ink">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ink mb-1">
                  Mandi name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Meerut Mandi"
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-soft text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) =>
                    setForm({ ...form, location: e.target.value })
                  }
                  placeholder="e.g. Meerut, UP"
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-soft text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-1">
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
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-soft text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium text-muted hover:bg-surface-soft"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 rounded-xl bg-primary text-on-primary text-sm font-medium hover:opacity-90 disabled:opacity-50"
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
          <div className="bg-surface rounded-2xl w-full max-w-sm p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center mx-auto mb-4">
              <Trash2 size={20} className="text-red-500 dark:text-red-400" />
            </div>
            <h2 className="font-display font-semibold text-ink mb-1">
              Delete mandi?
            </h2>
            <p className="text-sm text-muted mb-5">
              This removes <span className="font-medium">{deleteTarget.name}</span> and
              can't be undone. Any active queue for it should be cleared first.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium text-muted hover:bg-surface-soft"
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