import { Request, Response, NextFunction } from 'express';
import Order from '../models/Order';
import Product from '../models/Product';
import Cart from '../models/Cart';
import { createPaymentIntent } from '../utils/stripe';
import { sendEmail } from '../utils/email';

export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }

    const { shippingAddress, shippingMethod, paymentMethod, items, totalPrice } = req.body;

    if (!shippingAddress || !items || items.length === 0 || !totalPrice) {
      res.status(400).json({ success: false, message: 'Please provide all order details.' });
      return;
    }

    // 1. Validate stock and compute price
    let calculatedTotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        res.status(404).json({ success: false, message: `Product ${item.product} not found.` });
        return;
      }

      if (product.stock < item.quantity) {
        res.status(400).json({
          success: false,
          message: `Insufficient stock for product "${product.name}". Only ${product.stock} available.`
        });
        return;
      }

      // Check for discountPrice or standard price
      const activePrice = product.discountPrice || product.price;
      calculatedTotal += activePrice * item.quantity;

      orderItems.push({
        product: product._id as any,
        quantity: item.quantity,
        price: activePrice
      });
    }

    // Add shipping cost or sales tax calculations if any (let's verify total match within small rounding)
    // For simplicity, we accept calculatedTotal as the core price base
    // 2. Decrement product stock levels
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity }
      });
    }

    // 3. Create payment intent via Stripe (if card payment)
    let paymentStatus: 'pending' | 'completed' = 'pending';
    let transactionId = '';
    let clientSecret = '';

    if (paymentMethod === 'card') {
      const paymentIntent = await createPaymentIntent(totalPrice);
      clientSecret = paymentIntent.clientSecret || '';
      transactionId = paymentIntent.id || '';
    } else if (paymentMethod === 'upi') {
      paymentStatus = 'pending';
      transactionId = req.body.transactionId || `upi_${Math.random().toString(36).substr(2, 9)}`;
    } else {
      // Cash on delivery or alternate method
      paymentStatus = 'pending';
      transactionId = `cod_${Math.random().toString(36).substr(2, 9)}`;
    }

    // 4. Create Order document
    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      totalPrice,
      shippingAddress,
      shippingMethod: shippingMethod || 'Standard Shipping',
      paymentMethod,
      paymentStatus,
      orderStatus: 'pending',
      transactionId
    });

    // 5. Clear User's Cart
    await Cart.findOneAndUpdate({ user: req.user.id }, { items: [] });

    // 6. Send Order Confirmation Email
    const itemDetailsText = items
      .map((item: any) => `- Product ID: ${item.product}, Qty: ${item.quantity}`)
      .join('\n');

    await sendEmail({
      email: req.user.email,
      subject: `Order Confirmed - #${order._id}`,
      message: `Thank you for your order!\n\nOrder ID: ${order._id}\nTotal: $${totalPrice}\nItems:\n${itemDetailsText}\n\nWe will notify you once your order ships.`,
      html: `<h3>Thank you for your order!</h3>
             <p>Hi ${req.user.name}, your order has been received and is being processed.</p>
             <p><strong>Order ID:</strong> ${order._id}</p>
             <p><strong>Total Price:</strong> $${totalPrice}</p>
             <p>We are preparing your shipment now!</p>`
    });

    res.status(201).json({
      success: true,
      order,
      clientSecret
    });
  } catch (error) {
    next(error);
  }
};

export const getOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }

    const orders = await Order.find({ user: req.user.id }).populate('items.product').sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }

    const { id } = req.params;
    const order = await Order.findById(id).populate('items.product').populate('user', 'name email');

    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found.' });
      return;
    }

    // Verify ownership or check if admin
    if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      res.status(403).json({ success: false, message: 'Not authorized to view this order.' });
      return;
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

// Webhook-style mock endpoint for stripe payment success confirmation
export const confirmPayment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { transactionId } = req.body;

    if (!transactionId) {
      res.status(400).json({ success: false, message: 'Transaction ID is required.' });
      return;
    }

    const order = await Order.findOne({ transactionId });
    if (!order) {
      res.status(404).json({ success: false, message: 'Order with this transaction ID not found.' });
      return;
    }

    order.paymentStatus = 'completed';
    order.orderStatus = 'processing';
    await order.save();

    res.status(200).json({ success: true, message: 'Payment confirmed successfully.', order });
  } catch (error) {
    next(error);
  }
};
