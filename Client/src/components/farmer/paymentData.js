const MOCK_PAYMENTS = [
  {
    id: "PAY-001",
    procurementId: "A098",
    crop: "Wheat",
    cropHindi: "गेहूं",
    mandi: "Meerut Procurement Centre",
    date: "18 August 2026",
    amount: 10800,
    status: "paid",
    paymentDate: "20 August 2026",
    method: "Direct Benefit Transfer (DBT)",
    methodHindi: "प्रत्यक्ष लाभ अंतरण (डीबीटी)",
    account: "****4412",
  },
  {
    id: "PAY-002",
    procurementId: "A096",
    crop: "Rice",
    cropHindi: "चावल",
    mandi: "Modinagar Krishi Mandi",
    date: "02 August 2026",
    amount: 7200,
    status: "pending",
  },
  {
    id: "PAY-003",
    procurementId: "A091",
    crop: "Maize",
    cropHindi: "मक्का",
    mandi: "Meerut Procurement Centre",
    date: "21 July 2026",
    amount: 5600,
    status: "paid",
    paymentDate: "24 July 2026",
    method: "Direct Benefit Transfer (DBT)",
    methodHindi: "प्रत्यक्ष लाभ अंतरण (डीबीटी)",
    account: "****4412",
  },
];

// Replace this isolated source with a real payment API when one is available.
export function getMockPayments() {
  return Promise.resolve(MOCK_PAYMENTS);
}

export function calculatePaymentSummary(payments) {
  return payments.reduce(
    (summary, payment) => {
      if (payment.status === "paid") summary.totalPaid += payment.amount;
      if (payment.status === "pending") summary.pending += payment.amount;
      summary.totalRecords += 1;
      return summary;
    },
    { totalPaid: 0, pending: 0, totalRecords: 0 }
  );
}