import { Router } from 'express';
import {
  createOrder,
  getOrders,
  getOrderById,
  confirmPayment
} from '../controllers/orderController';
import { protect } from '../middleware/auth';

const router = Router();

router.use(protect);

router.route('/')
  .post(createOrder)
  .get(getOrders);

router.post('/confirm-payment', confirmPayment);

router.route('/:id')
  .get(getOrderById);

export default router;
