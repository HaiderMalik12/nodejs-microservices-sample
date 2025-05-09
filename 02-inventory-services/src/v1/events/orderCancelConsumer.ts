import { connectRabbitMQ } from '@inventory/config/rabbitmq';
import { updateProductQuantity } from '../services/products';

export async function consumeOrderCancelledMessages() {
    try {
        const channel = await connectRabbitMQ();

        // Assert the order exchange
        await channel.assertExchange('order', 'topic', { durable: true });

        const q = await channel.assertQueue('', { exclusive: true });
        await channel.bindQueue(q.queue, 'order', 'order.cancelled');

        console.log('Inventory Service listening to order.cancelled');

        // Consume messages
        channel.consume(q.queue, async (msg) => {
            if (msg) {
                const payload = JSON.parse(msg.content.toString());
                console.log('Inventory Service received order.cancelled:', payload);

                try {
                    // Rollback inventory
                    await updateProductQuantity({ _id: payload.productId, quantity: payload.quantity });

                    // Acknowledge the message
                    channel.ack(msg);
                } catch (error) {
                    console.error('Error processing order.cancelled:', error);

                    // Reject the message (optionally requeue)
                    channel.nack(msg, false, false);
                }
            }
        });
    } catch (error) {
        console.error('Error consuming order.cancelled messages:', error);
    }
}