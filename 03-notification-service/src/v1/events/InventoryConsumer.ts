import { connectRabbitMQ } from '@notification/config/rabbitmq';
import { sendNotification } from '@notification/v1/services/notification';

export async function consumeInventoryMessages() {
    try {
        const channel = await connectRabbitMQ();

        // Assert the inventory exchange
        await channel.assertExchange('inventory', 'topic', { durable: true });

        // Create a temporary queue for this service
        const q = await channel.assertQueue('', { exclusive: true });

        // Bind the queue to the inventory.status.updated topic
        await channel.bindQueue(q.queue, 'inventory', 'inventory.status.updated');

        console.log('Notification Service listening to inventory.status.updated');

        // Consume messages from the queue
        channel.consume(q.queue, async (msg) => {
            if (msg) {
                const payload = JSON.parse(msg.content.toString());
                console.log('Notification Service received:', payload);

                try {
                    // Send notification (e.g., email, SMS, push notification)
                    await sendNotification(payload);

                    // Acknowledge the message
                    channel.ack(msg);
                } catch (error) {
                    console.error('Error processing inventory message:', error);

                    // Reject the message (optionally requeue)
                    channel.nack(msg, false, false);
                }
            }
        });
    } catch (error) {
        console.error('Error consuming inventory messages:', error);
        throw new Error('Failed to consume inventory messages. Please try again later.');
    }
}