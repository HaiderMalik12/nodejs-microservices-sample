import { connectRabbitMQ } from '@notification/config/rabbitmq';

interface NotificationInput {
    recipient: string;
    type: string;
    status: string;
    error?: string;
}

export async function publishNotificationSentEvent(notification: NotificationInput) {
    const channel = await connectRabbitMQ();
    await channel.assertExchange('notification', 'topic', { durable: true });

    const eventPayload = {
        recipient: notification.recipient,
        type: notification.type,
        status: notification.status, // 'sent' or 'failed'
        timestamp: new Date().toISOString(),
        error: notification.error || null,
    };

    channel.publish(
        'notification',
        'notification.sent',
        Buffer.from(JSON.stringify(eventPayload))
    );

    await channel.close();
}