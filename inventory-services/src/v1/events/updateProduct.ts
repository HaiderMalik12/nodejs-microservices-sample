import productModel, { IProduct } from '@product/models/product';
import mongoose from 'mongoose';

interface UpdateProductInput {
  _id: string;
  name?: string;
  price?: number;
  quantity?: number;
}

export async function updateProduct(payload: UpdateProductInput) {
  try {
    return await productModel.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(payload._id) }, {
      name: payload.name,
      price: payload.price,
      quantity: payload.quantity
    }, {
      new: true,
      runValidators: true
    }).then((result: IProduct | null) => {
      if (!result) {
        throw new Error('Product not found');
      }
      return result;
    })
  }
  catch (error: any) {
    console.error('Error updating product:', error);
    throw new Error('Failed to update product. Please try again later.');
  }
}
