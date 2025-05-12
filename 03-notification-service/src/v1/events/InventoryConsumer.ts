import { connectRabbitMQ } from '@notification/config/rabbitmq';
import { sendNotification } from '@notification/v1/services/notification';

export async function consumeInventoryMessages() {
    try {
        const channel = await connectRabbitMQ();
        await channel.assertExchange('inventory', 'topic', { durable: true });
        const q = await channel.assertQueue('', { exclusive: true });
        await channel.bindQueue(q.queue, 'inventory', 'inventory.status.updated');
        channel.consume(q.queue, async (msg) => {
            if (msg) {
                const payload = JSON.parse(msg.content.toString());
                try {
                    await sendNotification(payload);
                    channel.ack(msg);
                } catch (error) {
                    console.error('Error processing inventory message:', error);
                    channel.nack(msg, false, false);
                }
            }
        });
    } catch (error) {
        console.error('Error consuming inventory messages:', error);
        throw new Error('Failed to consume inventory messages. Please try again later.');
    }
}