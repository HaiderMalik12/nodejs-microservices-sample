import { publishNotificationSentEvent } from "@notification/v1/events/publishNotification";

export async function sendNotification(payload: { _id: string, quantity: number, status: string, error?: string }) {
  const { _id, quantity, status, error } = payload;

  console.log(`Sending notification for product ${_id}`);
  console.log(`Quantity: ${quantity}, Status: ${status}`);

  if (status === 'failed') {
    console.error(`Error in inventory update: ${error}`);
  }

  // Add email/SMS/notification logic here
  // e.g., integrate with an email service like nodemailer, Twilio, etc.

  await publishNotificationSentEvent({
    recipient: 'jane@gamil.com',
    type: 'inventory-update',
    status: 'sent'
  });
}