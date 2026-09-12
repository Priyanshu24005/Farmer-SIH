// =============================================================================
// FARMER DASHBOARD DATA — TEMPORARY MOCK (development only)
// =============================================================================
// This is the SINGLE isolated place holding dashboard sample data. It is NOT
// coming from the backend. Each block documents the real endpoint that should
// replace it once the auth layer exposes the logged-in farmer's id.
//
// Backend reality (verified in this repo):
//   REAL, EXISTS  -> GET  /tokens/farmer/:farmerId   (active token + history)
//   REAL, EXISTS  -> GET  /tokens/mandi/:mandiId/queue (live queue position)
//   MISSING       -> no payments API (Token model has no payment fields)
//   MISSING       -> no /auth/me; only the JWT is persisted, so the farmer _id
//                    needed to call /tokens/farmer/:farmerId is not yet wired.
//
// To go live later: fetch GET /tokens/farmer/<id> and map the response here;
// no dashboard component needs to change.
// =============================================================================

// Toggle to preview the empty state without editing components.
export const HAS_ACTIVE_TOKEN = true;

// Maps to a "waiting" record from GET /tokens/farmer/:farmerId + its mandi queue.
export const mockActiveToken = {
  tokenNumber: "A104",
  mandiName: "Meerut Procurement Centre",
  crop: "Wheat",
  date: "18 September 2026",
  status: "waiting",
  tokensAhead: 12,
  estimatedWaitMinutes: 35,
};

// Total procurements = count of served tokens from /tokens/farmer/:farmerId.
// Pending payments = MISSING backend; placeholder only.
export const mockStats = {
  totalProcurements: 24,
  pendingPaymentsInr: 12500,
};

// Recent activity = MISSING as a dedicated feed; would be derived from tokens
// (+ a future payments API). Placeholder only.
export const mockRecentActivity = [
  {
    id: "act-1",
    type: "payment",
    titleKey: "paymentReceived",
    detail: "₹10,800 · Wheat procurement",
    detailHi: "₹10,800 · गेहूं खरीद",
    whenKey: "today",
  },
  {
    id: "act-2",
    type: "procurement",
    titleKey: "procurementCompleted",
    detail: "Meerut Procurement Centre",
    detailHi: "मेरठ खरीद केंद्र",
    whenKey: "date18Aug",
  },
];
