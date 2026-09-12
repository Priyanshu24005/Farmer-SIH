import { ArrowLeft, Sprout } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Minimal placeholder for Farmer routes that are navigation targets but not yet
// built (Book Slot, Queue, History, Payments). Keeps the bottom nav functional
// without faking any feature.
export default function FarmerComingSoon() {
  const navigate = useNavigate();
  return (
    <main className="min-h-screen bg-[#f5f7ef] px-5 py-10 text-[#173c29] dark:bg-[#10271c] dark:text-[#f5f7ef]">
      <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center text-center">
        <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e7f1d4] text-[#236b3f] dark:bg-[#1e4b32] dark:text-[#d7f1a2]">
          <Sprout size={27} aria-hidden="true" />
        </span>
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.14em] text-[#5d8241] dark:text-[#bddb89]">Farmer-SIH</p>
        <h1 className="m-0 text-2xl font-bold">Coming soon</h1>
        <p className="mt-3 max-w-sm text-sm leading-6 text-[#58705f] dark:text-[#b4c6b8]">
          This Farmer feature will be added in an upcoming task.
        </p>
        <button
          type="button"
          className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#236b3f] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#195530]"
          onClick={() => navigate("/farmer")}
        >
          <ArrowLeft size={17} aria-hidden="true" />
          Back to Home
        </button>
      </div>
    </main>
  );
}
