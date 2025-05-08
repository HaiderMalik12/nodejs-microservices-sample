import { connectRabbitMQ } from '@inventory/config/rabbitmq';
import { updateProduct } from '@inventory/v1/services/products';
import { validateUpdateProduct } from '@inventory/v1/validations/products';

export async function consumeOrderMessages() {
    try {
        const channel = await connectRabbitMQ();

        // Assert exchange for order events
        await channel.assertExchange('order', 'topic', { durable: true });

        // Assert exchange for inventory events
        await channel.assertExchange('inventory', 'topic', { durable: true });

        const q = await channel.assertQueue('', { exclusive: true });
        await channel.bindQueue(q.queue, 'order', 'order.created');

        channel.consume(q.queue, async (msg) => {
            if (msg) {
                const payload = JSON.parse(msg.content.toString());
                try {
                    // Validate and update product
                    await validateUpdateProduct(payload);
                    console.log('Inventory Service received:', payload);
                    await updateProduct(payload);

                    // Publish inventory.status.updated event
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

                    console.log('Published inventory.status.updated:', inventoryUpdateEvent);

                    // Acknowledge the message
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

                    console.log('Published inventory.status.updated with failure:', inventoryUpdateFailureEvent);

                    // Acknowledge the message even if it failed
                    channel.ack(msg);
                }
            }
        });

        console.log('Inventory Service listening to order.created');
    } catch (error) {
        console.error('Error consuming order messages:', error);
        throw new Error('Failed to consume order messages. Please try again later.');
    }
}