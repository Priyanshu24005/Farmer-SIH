const MOCK_PROCUREMENT_HISTORY = [
  {
    id: "procurement-18-aug-2026",
    date: "18 Aug 2026",
    dateValue: "2026-08-18",
    mandi: "Meerut Procurement Centre",
    crop: "Wheat",
    quantity: "450 kg",
    amount: 10800,
    status: "completed",
  },
  {
    id: "procurement-02-aug-2026",
    date: "02 Aug 2026",
    dateValue: "2026-08-02",
    mandi: "Muzaffarnagar Procurement Centre",
    crop: "Rice",
    quantity: "300 kg",
    amount: 7200,
    status: "completed",
  },
  {
    id: "procurement-21-jul-2026",
    date: "21 Jul 2026",
    dateValue: "2026-07-21",
    mandi: "Meerut Procurement Centre",
    crop: "Maize",
    quantity: "250 kg",
    amount: 5600,
    status: "payment-pending",
  },
];

// Replace this isolated source with a real history API when one is available.
export function getMockProcurementHistory() {
  return Promise.resolve(MOCK_PROCUREMENT_HISTORY);
}

export const PROCUREMENT_HISTORY_CROPS = ["Wheat", "Rice", "Maize"];