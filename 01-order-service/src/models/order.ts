import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
  _id: string
  productId: string,
  quantity: number
}

const OrderSchema = new Schema<IOrder>(
  {
    productId: { type: String, required: true },
    quantity: { type: Number, required: true },
  },
  { timestamps: true }
);
const orderModel = mongoose.model<IOrder>('orders', OrderSchema);

export default orderModel;
