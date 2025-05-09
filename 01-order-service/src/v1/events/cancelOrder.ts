import { connectRabbitMQ } from '@order/config/rabbitmq';


interface CancelOrderInput {
    _id: string;
    reason?: string;
    productId: string;
    quantity: string;
}
export async function publishOrderCancelledEvent(order: CancelOrderInput) {
    const channel = await connectRabbitMQ();

    // Assert the order exchange
    await channel.assertExchange('order', 'topic', { durable: true });

    // Create the event payload
    const eventPayload = {
        orderId: order._id,
        productId: order.productId,
        quantity: order.quantity,
        reason: order.reason || 'User cancelled the order',
        timestamp: new Date().toISOString(),
    };

    // Publish the event
    channel.publish(
        'order',
        'order.cancelled',
        Buffer.from(JSON.stringify(eventPayload))
    );

    console.log('Published order.cancelled:', eventPayload);

    // Close the channel
    await channel.close();
}