import productModel, { IProduct } from '@inventory/models/product';
import mongoose from 'mongoose';

interface UpdateProductInput {
  _id: string;
  quantity: number;
}

interface CreateProductInput {
  name: string;
  quantity: number;
  price: number;
}

export async function createProduct(payload: CreateProductInput) {
  try {
    return await productModel.create(payload);
  }
  catch (error: any) {
    console.error('Error creating product:', error);
    throw new Error('Failed to create product. Please try again later.');
  }
}


export async function updateProduct(payload: UpdateProductInput) {
  try {
    return await productModel.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(payload._id) }, {
      $inc: { quantity: -payload.quantity },
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


export async function updateProductQuantity(payload: UpdateProductInput) {
  try {
    return await productModel.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(payload._id) }, {
      $inc: { quantity: payload.quantity },
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
    console.error('Error updating product Quantity:', error);
    throw new Error('Failed to update product quantity. Please try again later.');
  }
}
