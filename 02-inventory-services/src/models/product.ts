import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  _id: string
  name: string,
  quantity: number;
  price: number;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
  },
  { timestamps: true }
);
const productModel = mongoose.model<IProduct>('products', ProductSchema);

export default productModel;
