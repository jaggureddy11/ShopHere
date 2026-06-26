export interface IAddress {
  _id?: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'admin';
  addresses: IAddress[];
}

export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

export interface IProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: ICategory | string;
  subcategory?: string;
  images: string[];
  stock: number;
  rating: number;
  reviewsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface IReview {
  _id: string;
  product: string;
  user: {
    _id: string;
    name: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ICartItem {
  _id?: string;
  product: IProduct;
  quantity: number;
  addedAt: string;
}

export interface ICart {
  _id: string;
  user: string;
  items: ICartItem[];
  expiresAt: string;
}

export interface IOrderItem {
  _id?: string;
  product: IProduct;
  quantity: number;
  price: number;
}

export interface IOrder {
  _id: string;
  user: IUser | string;
  items: IOrderItem[];
  totalPrice: number;
  shippingAddress: Omit<IAddress, 'isDefault'>;
  shippingMethod: string;
  paymentMethod: string;
  paymentStatus: 'pending' | 'completed' | 'failed';
  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  transactionId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IAnalytics {
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  totalRevenue: number;
}
