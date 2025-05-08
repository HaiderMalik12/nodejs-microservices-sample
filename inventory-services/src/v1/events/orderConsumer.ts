import { connectRabbitMQ } from '@inventory/config/rabbitmq';
import { updateProduct } from '../services/products';
import { validateUpdateProduct } from '../validations/products';

export async function consumeOrderMessages() {
    try {
        const channel = await connectRabbitMQ();
        await channel.assertExchange('order', 'topic', { durable: true });
        const q = await channel.assertQueue('', { exclusive: true });
        await channel.bindQueue(q.queue, 'order', 'order.created');

        channel.consume(q.queue, async (msg) => {
            if (msg) {
                const payload = JSON.parse(msg.content.toString());
                await validateUpdateProduct(payload);
                console.log('Inventory Service received:', payload);
                await updateProduct({ _id: payload._id, quantity: payload.quantity });
                channel.ack(msg);
            }
        });

        console.log('Inventory Service listening to order.created');
    }
    catch (error) {
        console.error('Error consuming order messages:', error);
        throw new Error('Failed to consume order messages. Please try again later.');
    }
}