import { Request, Response, NextFunction } from 'express';
import Order from '../models/Order';
import Product from '../models/Product';
import User from '../models/User';

export const getDashboardAnalytics = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const totalOrders = await Order.countDocuments({});
    const totalProducts = await Product.countDocuments({});
    const totalUsers = await User.countDocuments({ role: 'customer' });

    // Aggregate total revenue
    const revenueResult = await Order.aggregate([
      { $match: { paymentStatus: 'completed' } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);

    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    // Fetch recent 5 orders
    const recentOrders = await Order.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      analytics: {
        totalOrders,
        totalProducts,
        totalUsers,
        totalRevenue
      },
      recentOrders
    });
  } catch (error) {
    next(error);
  }
};

export const getAllOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { status } = req.query;
    const query: any = {};
    if (status) {
      query.orderStatus = status;
    }

    const orders = await Order.find(query)
      .populate('user', 'name email')
      .populate('items.product')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, orders });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { orderStatus, paymentStatus } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found.' });
      return;
    }

    if (orderStatus) order.orderStatus = orderStatus;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    await order.save();

    res.status(200).json({ success: true, message: 'Order updated successfully.', order });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.status(200).json({ success: true, users });
  } catch (error) {
    next(error);
  }
};

export const getSalesReport = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Generate simple sales analytics report: revenue by day for the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const salesByDay = await Order.aggregate([
      {
        $match: {
          paymentStatus: 'completed',
          createdAt: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$totalPrice' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({ success: true, report: salesByDay });
  } catch (error) {
    next(error);
  }
};
