import orderModel from '@order/models/order';
import mongoose from 'mongoose';
interface CreateOrderInput {
  productId: string;
  quantity: number;
}

export async function createOrder(payload: CreateOrderInput) {
  try {
    return await orderModel.create(payload)
  }
  catch (error: any) {
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
