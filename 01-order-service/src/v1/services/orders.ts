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
    } else {
      console.warn('RabbitMQ channel not initialized. Order creation event not published.');
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

export async function cancelOrder(orderId: string, payload: { reason: string }) {
  try {
    const order = await orderModel.findById(new mongoose.Types.ObjectId(orderId));
    if (!order) {
      throw new Error('Order not found');
    }
    order.status = 'cancelled';
    order.cancelReason = payload.reason;
    await order.save();

    const channel = getChannel();
    if (channel) {
      const exchange = 'order';
      await channel.assertExchange(exchange, 'topic', { durable: true });
      const cancelPayload = {
        _id: order._id,
        reason: payload.reason,
        productId: order.productId,
        quantity: order.quantity,
      };
      channel.publish(
        exchange,
        'order.cancelled',
        Buffer.from(JSON.stringify(cancelPayload)),
        { persistent: true }
      );
    } else {
      console.warn('RabbitMQ channel not initialized. Order cancellation event not published.');
    }

    return order;
  } catch (error: any) {
    console.error('Error cancelling order:', error);
    throw new Error('Failed to cancel order. Please try again later.');
  }
}

