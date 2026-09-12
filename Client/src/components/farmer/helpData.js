export const SUPPORT_HELPLINE = {
  number: "1800-XXX-XXXX",
  isConfigured: false,
};

export const HELP_FAQS = [
  { id: "book-slot", questionKey: "faqBookQuestion", answerKey: "faqBookAnswer" },
  { id: "queue", questionKey: "faqQueueQuestion", answerKey: "faqQueueAnswer" },
  { id: "payment", questionKey: "faqPaymentQuestion", answerKey: "faqPaymentAnswer" },
  { id: "mobile", questionKey: "faqMobileQuestion", answerKey: "faqMobileAnswer" },
  { id: "cancelled", questionKey: "faqCancelledQuestion", answerKey: "faqCancelledAnswer" },
];

export const HELP_CATEGORIES = [
  { id: "book", icon: "calendar", titleKey: "bookSlot", descriptionKey: "bookSlotHelp", destination: "/farmer/book" },
  { id: "queue", icon: "queue", titleKey: "liveQueue", descriptionKey: "liveQueueHelp", destination: "/farmer/queue" },
  { id: "payment", icon: "payment", titleKey: "payment", descriptionKey: "paymentHelp", destination: "/farmer/payments" },
  { id: "account", icon: "account", titleKey: "account", descriptionKey: "accountHelp", destination: "/farmer/profile" },
];