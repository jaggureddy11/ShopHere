import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  quantity: number;
  price: number;
}

export interface IShippingAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  items: IOrderItem[];
  totalPrice: number;
  shippingAddress: IShippingAddress;
  shippingMethod: string;
  paymentMethod: string;
  paymentStatus: 'pending' | 'completed' | 'failed';
  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  transactionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 }
});

const ShippingAddressSchema = new Schema<IShippingAddress>({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true }
});

const OrderSchema = new Schema<IOrder>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  items: [OrderItemSchema],
  totalPrice: { type: Number, required: true, min: 0 },
  shippingAddress: { type: ShippingAddressSchema, required: true },
  shippingMethod: { type: String, default: 'Standard Shipping' },
  paymentMethod: { type: String, required: true, default: 'card' },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  orderStatus: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  transactionId: { type: String }
}, {
  timestamps: true
});

OrderSchema.index({ user: 1 });
OrderSchema.index({ createdAt: -1 });

export default mongoose.model<IOrder>('Order', OrderSchema);
