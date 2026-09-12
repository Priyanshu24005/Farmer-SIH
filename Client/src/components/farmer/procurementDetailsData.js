const PROCUREMENT_DETAILS = {
  A098: {
    id: "A098",
    status: "completed",
    tokenNumber: "A098",
    date: "18 August 2026",
    crop: "Wheat",
    cropHindi: "गेहूं",
    grade: "Grade A (Sharbati)",
    quantityKg: "450 kg",
    quantityQuintals: "4.50 Quintals",
    acceptedQuantity: "450 kg (4.5 Qtl)",
    amount: "₹10,800",
    rate: "₹2,400 / Qt",
    mandi: "Meerut Procurement Centre",
    location: "Meerut, Uttar Pradesh",
    mandiAddress: "Hapur Road, Mandi Yard, Meerut, Uttar Pradesh",
    verificationNote: "Weighment and quality inspection verified by Meerut Mandi in-charge.",
    paymentDate: "20 August 2026",
    paymentMethod: "Direct Benefit Transfer (DBT)",
    account: "****4412",
  },
};

const PROCUREMENT_ID_ALIASES = {
  "procurement-18-aug-2026": "A098",
};

// Replace this isolated lookup with a real procurement-details API later.
export function getMockProcurementDetails(id) {
  const resolvedId = PROCUREMENT_ID_ALIASES[id] || id;
  return PROCUREMENT_DETAILS[resolvedId] || null;
}

export const PROCUREMENT_DETAIL_STATUSES = ["completed", "pending", "cancelled"];