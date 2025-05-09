import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
  _id: string
  productId: string,
  quantity: number;
  status?: string;
  cancelReason: string;
}

const OrderSchema = new Schema<IOrder>(
  {
    productId: { type: String, required: true },
    quantity: { type: Number, required: true },
    status: { type: String, enum: ['cancelled', 'delivered'] },
    cancelReason: { type: String }
  },
  { timestamps: true }
);
const orderModel = mongoose.model<IOrder>('orders', OrderSchema);

export default orderModel;
