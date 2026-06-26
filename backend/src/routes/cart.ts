import { Router } from 'express';
import {
  getCart,
  addItemToCart,
  updateCartItem,
  removeCartItem,
  clearCart
} from '../controllers/cartController';
import { protect } from '../middleware/auth';

const router = Router();

router.use(protect);

router.route('/')
  .get(getCart)
  .delete(clearCart);

router.post('/items', addItemToCart);

router.route('/items/:itemId')
  .put(updateCartItem)
  .delete(removeCartItem);

export default router;
