import { Request, Response, NextFunction } from 'express';
import Review from '../models/Review';
import Product from '../models/Product';

const updateProductRating = async (productId: string): Promise<void> => {
  const reviews = await Review.find({ product: productId });
  
  if (reviews.length === 0) {
    await Product.findByIdAndUpdate(productId, { rating: 0, reviewsCount: 0 });
    return;
  }

  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const avgRating = Number((totalRating / reviews.length).toFixed(1));

  await Product.findByIdAndUpdate(productId, {
    rating: avgRating,
    reviewsCount: reviews.length
  });
};

export const getProductReviews = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params; // Product ID
    const reviews = await Review.find({ product: id }).populate('user', 'name');
    res.status(200).json({ success: true, reviews });
  } catch (error) {
    next(error);
  }
};

export const createReview = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }
    const { id } = req.params; // Product ID
    const { rating, comment } = req.body;

    if (!rating || !comment) {
      res.status(400).json({ success: false, message: 'Rating and comment are required.' });
      return;
    }

    const product = await Product.findById(id);
    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found.' });
      return;
    }

    // Check if user already reviewed this product
    const alreadyReviewed = await Review.findOne({ product: id, user: req.user.id });
    if (alreadyReviewed) {
      res.status(400).json({ success: false, message: 'You have already reviewed this product.' });
      return;
    }

    const review = await Review.create({
      product: id,
      user: req.user.id,
      rating: Number(rating),
      comment
    });

    await updateProductRating(id);

    res.status(201).json({ success: true, review });
  } catch (error) {
    next(error);
  }
};

export const updateReview = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }
    const { id } = req.params; // Review ID
    const { rating, comment } = req.body;

    const review = await Review.findById(id);

    if (!review) {
      res.status(404).json({ success: false, message: 'Review not found.' });
      return;
    }

    // Verify ownership
    if (review.user.toString() !== req.user.id) {
      res.status(403).json({ success: false, message: 'Not authorized to update this review.' });
      return;
    }

    if (rating) review.rating = Number(rating);
    if (comment) review.comment = comment;

    await review.save();
    await updateProductRating(review.product.toString());

    res.status(200).json({ success: true, review });
  } catch (error) {
    next(error);
  }
};

export const deleteReview = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }
    const { id } = req.params; // Review ID

    const review = await Review.findById(id);

    if (!review) {
      res.status(404).json({ success: false, message: 'Review not found.' });
      return;
    }

    // Verify ownership or admin privileges
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      res.status(403).json({ success: false, message: 'Not authorized to delete this review.' });
      return;
    }

    const productId = review.product.toString();
    await Review.findByIdAndDelete(id);
    await updateProductRating(productId);

    res.status(200).json({ success: true, message: 'Review deleted successfully.' });
  } catch (error) {
    next(error);
  }
};
