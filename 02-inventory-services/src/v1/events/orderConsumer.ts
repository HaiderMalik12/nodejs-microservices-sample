import { connectRabbitMQ } from '@inventory/config/rabbitmq';
import { updateProduct } from '@inventory/v1/services/products';
import { validateUpdateProduct } from '@inventory/v1/validations/products';

export async function consumeOrderMessages() {
    try {
        const channel = await connectRabbitMQ();
        await channel.assertExchange('order', 'topic', { durable: true });
        await channel.assertExchange('inventory', 'topic', { durable: true });

        const q = await channel.assertQueue('', { exclusive: true });
        await channel.bindQueue(q.queue, 'order', 'order.created');

        channel.consume(q.queue, async (msg) => {
            if (msg) {
                const payload = JSON.parse(msg.content.toString());
                try {
                    await validateUpdateProduct(payload);
                    await updateProduct(payload);
                    const inventoryUpdateEvent = {
                        _id: payload._id,
                        quantity: payload.quantity,
                        status: 'updated', // Or other status logic
                    };

                    channel.publish(
                        'inventory',
                        'inventory.status.updated',
                        Buffer.from(JSON.stringify(inventoryUpdateEvent))
                    );
                    channel.ack(msg);
                } catch (error: any) {
                    console.error('Error processing order:', error);

                    // Publish inventory.status.updated with failure status
                    const inventoryUpdateFailureEvent = {
                        _id: payload._id,
                        quantity: payload.quantity,
                        status: 'failed', // Failure status
                        error: error.message,
                    };

                    channel.publish(
                        'inventory',
                        'inventory.status.updated',
                        Buffer.from(JSON.stringify(inventoryUpdateFailureEvent))
                    );
                    channel.ack(msg);
                }
            }
        });
    } catch (error) {
        console.error('Error consuming order messages:', error);
        throw new Error('Failed to consume order messages. Please try again later.');
    }
}