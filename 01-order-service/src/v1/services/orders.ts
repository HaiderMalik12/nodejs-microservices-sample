import { getChannel } from '@order/config/rabbitmq';
import orderModel from '@order/models/order';
import mongoose from 'mongoose';
interface CreateOrderInput {
  productId: string;
  quantity: number;
}

export async function createOrder(payload: CreateOrderInput) {
  try {
    const newOrder = await orderModel.create(payload);
    const channel = getChannel();

    if (channel) {
      const exchange = 'order';
      await channel.assertExchange(exchange, 'topic', { durable: true });
      const messagePayload = {
        _id: payload.productId,
        quantity: payload.quantity,
      };
      channel.publish(
        exchange,
        'order.created',
        Buffer.from(JSON.stringify(messagePayload)),
        { persistent: true }
      );
      console.log('Published order.created event');
    } else {
      console.warn('RabbitMQ channel not initialized. Order creation event not published.');
      // Handle this scenario (e.g., logging, retry mechanism)
    }

    return newOrder;
  } catch (error: any) {
    console.error('Error creating order:', error);
    if (error instanceof mongoose.Error.ValidationError) {
      throw new Error('Invalid order data provided.');
    }
    if (error.code === 11000) {
      throw new Error('Duplicate order detected.');
    }
    throw new Error('Failed to create order. Please try again later.');
  }
}

