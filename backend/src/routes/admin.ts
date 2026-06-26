import { Router } from 'express';
import {
  getDashboardAnalytics,
  getAllOrders,
  updateOrderStatus,
  getAllUsers,
  getSalesReport
} from '../controllers/adminController';
import { protect } from '../middleware/auth';
import { adminOnly } from '../middleware/admin';

const router = Router();

// Apply admin protection to all routes in this router
router.use(protect, adminOnly);

router.get('/dashboard', getDashboardAnalytics);
router.get('/orders', getAllOrders);
router.put('/orders/:id', updateOrderStatus);
router.get('/users', getAllUsers);
router.get('/reports', getSalesReport);

export default router;
