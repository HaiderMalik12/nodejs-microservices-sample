import productModel, { IProduct } from '@inventory/models/product';
import mongoose from 'mongoose';

interface UpdateProductInput {
  _id: string;
  quantity: number;
}

export async function updateProduct(payload: UpdateProductInput) {
  try {
    return await productModel.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(payload._id) }, {
      quantity: payload.quantity
    }, {
      new: true,
      upsert: true,
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
