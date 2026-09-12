const MOCK_NOTIFICATIONS = [
  {
    id: "notification-slot-confirmed",
    type: "slot",
    titleKey: "slotConfirmed",
    messageKey: "slotConfirmedMessage",
    timeKey: "today930",
    unread: true,
    destination: "/farmer/book",
  },
  {
    id: "notification-queue-update",
    type: "queue",
    titleKey: "queueUpdate",
    messageKey: "queueUpdateMessage",
    timeKey: "today1015",
    unread: true,
    destination: "/farmer/queue",
  },
  {
    id: "notification-payment-received",
    type: "payment",
    titleKey: "paymentReceived",
    messageKey: "paymentReceivedMessage",
    timeKey: "aug20",
    unread: false,
    destination: "/farmer/payment/PAY-001",
  },
  {
    id: "notification-procurement-completed",
    type: "procurement",
    titleKey: "procurementCompleted",
    messageKey: "procurementCompletedMessage",
    timeKey: "aug18",
    unread: false,
    destination: "/farmer/procurement/A098",
  },
  {
    id: "notification-mandi-schedule",
    type: "schedule",
    titleKey: "mandiSchedule",
    messageKey: "mandiScheduleMessage",
    timeKey: "aug16",
    unread: false,
    destination: "/farmer/book",
  },
];

// Replace this isolated source with a real notification API later.
export function getMockNotifications() {
  return Promise.resolve(MOCK_NOTIFICATIONS);
}