import { Router } from 'express';
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist
} from '../controllers/wishlistController';
import { protect } from '../middleware/auth';

const router = Router();

router.use(protect);

router.route('/')
  .get(getWishlist);

router.route('/:productId')
  .post(addToWishlist)
  .delete(removeFromWishlist);

export default router;
