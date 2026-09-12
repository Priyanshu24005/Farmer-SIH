const MOCK_PAYMENT_DETAILS = {
  "PAY-001": {
    id: "PAY-001",
    procurementId: "A098",
    status: "paid",
    amount: "₹10,800",
    paymentDate: "20 August 2026",
    method: "Direct Benefit Transfer (DBT)",
    methodHindi: "प्रत्यक्ष लाभ अंतरण (डीबीटी)",
    account: "****4412",
    transactionId: "TXN-8F42K91",
    referenceNumber: "DBT-20260820-098",
    crop: "Wheat",
    cropHindi: "गेहूं",
    quantity: "450 kg",
    qualityGrade: "Grade A",
    mandi: "Meerut Procurement Centre",
    procurementDate: "18 August 2026",
    token: "A098",
  },
};

// Replace this isolated lookup with a real payment-details API later.
export function getMockPaymentDetails(id) {
  return MOCK_PAYMENT_DETAILS[id] || null;
}

export const PAYMENT_DETAIL_STATUSES = ["paid", "pending", "failed"];