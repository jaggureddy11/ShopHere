import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: mongoose.Types.ObjectId;
  subcategory?: string;
  images: string[];
  stock: number;
  rating: number;
  reviewsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  discountPrice: { type: Number, min: 0 },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  subcategory: { type: String, trim: true },
  images: [{ type: String }],
  stock: { type: Number, required: true, default: 0, min: 0 },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviewsCount: { type: Number, default: 0, min: 0 }
}, {
  timestamps: true
});

// Index for search & filters
ProductSchema.index({ name: 'text', description: 'text' });
ProductSchema.index({ category: 1 });
ProductSchema.index({ price: 1 });

export default mongoose.model<IProduct>('Product', ProductSchema);
