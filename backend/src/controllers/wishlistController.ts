import { Request, Response, NextFunction } from 'express';
import Wishlist from '../models/Wishlist';
import Product from '../models/Product';

export const getWishlist = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }

    let wishlist = await Wishlist.findOne({ user: req.user.id }).populate('products');

    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: req.user.id,
        products: []
      });
    }

    res.status(200).json({ success: true, wishlist });
  } catch (error) {
    next(error);
  }
};

export const addToWishlist = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found.' });
      return;
    }

    let wishlist = await Wishlist.findOne({ user: req.user.id });

    if (!wishlist) {
      wishlist = new Wishlist({
        user: req.user.id,
        products: []
      });
    }

    if (!wishlist.products.includes(productId as any)) {
      wishlist.products.push(productId as any);
      await wishlist.save();
    }

    const populatedWishlist = await wishlist.populate('products');
    res.status(200).json({ success: true, wishlist: populatedWishlist });
  } catch (error) {
    next(error);
  }
};

export const removeFromWishlist = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }
    const { productId } = req.params;

    const wishlist = await Wishlist.findOne({ user: req.user.id });

    if (!wishlist) {
      res.status(404).json({ success: false, message: 'Wishlist not found.' });
      return;
    }

    wishlist.products = wishlist.products.filter(
      id => id.toString() !== productId
    );

    await wishlist.save();
    const populatedWishlist = await wishlist.populate('products');
    res.status(200).json({ success: true, wishlist: populatedWishlist });
  } catch (error) {
    next(error);
  }
};
