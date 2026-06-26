import { Router } from 'express';
import {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview
} from '../controllers/reviewController';
import { protect } from '../middleware/auth';

const router = Router();

// Retrieve reviews for a product
router.get('/product/:id', getProductReviews);

// Add review to a product
router.post('/product/:id', protect, createReview);

// Edit/remove reviews
router.route('/:id')
  .put(protect, updateReview)
  .delete(protect, deleteReview);

export default router;
