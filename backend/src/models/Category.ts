import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  description: { type: String },
  image: { type: String }
}, {
  timestamps: true
});

export default mongoose.model<ICategory>('Category', CategorySchema);
