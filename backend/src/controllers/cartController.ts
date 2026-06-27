import { Request, Response, NextFunction } from 'express';
import Cart, { ICart } from '../models/Cart';
import Product from '../models/Product';
import { HydratedDocument } from 'mongoose';

// Helper: atomically gets or creates a cart for the given userId.
// findOneAndUpdate with upsert:true + new:true always returns a document,
// so we can safely cast to HydratedDocument<ICart> (non-null guaranteed).
async function getOrCreateCart(userId: string): Promise<HydratedDocument<ICart>> {
  const cart = await Cart.findOneAndUpdate(
    { user: userId },
    { $setOnInsert: { user: userId, items: [], expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) } },
    { upsert: true, new: true }
  );
  return cart as HydratedDocument<ICart>;
}

export const getCart = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }

    const cart = await getOrCreateCart(req.user.id);
    await cart.populate('items.product');

    res.status(200).json({ success: true, cart });
  } catch (error) {
    next(error);
  }
};

export const addItemToCart = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      res.status(400).json({ success: false, message: 'Product ID is required.' });
      return;
    }

    const product = await Product.findById(productId);
    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found.' });
      return;
    }

    const cart = await getOrCreateCart(req.user.id);

    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += Number(quantity);
    } else {
      cart.items.push({
        product: productId,
        quantity: Number(quantity),
        addedAt: new Date()
      });
    }

    cart.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    await cart.save();

    const populatedCart = await cart.populate('items.product');
    res.status(200).json({ success: true, cart: populatedCart });
  } catch (error) {
    next(error);
  }
};

export const updateCartItem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (quantity === undefined || Number(quantity) < 1) {
      res.status(400).json({ success: false, message: 'Valid quantity is required.' });
      return;
    }

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      res.status(404).json({ success: false, message: 'Cart not found.' });
      return;
    }

    const item = cart.items.find(
      i => i._id?.toString() === itemId || i.product.toString() === itemId
    );

    if (!item) {
      res.status(404).json({ success: false, message: 'Item not found in cart.' });
      return;
    }

    item.quantity = Number(quantity);
    cart.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    await cart.save();

    const populatedCart = await cart.populate('items.product');
    res.status(200).json({ success: true, cart: populatedCart });
  } catch (error) {
    next(error);
  }
};

export const removeCartItem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }
    const { itemId } = req.params;

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      res.status(404).json({ success: false, message: 'Cart not found.' });
      return;
    }

    cart.items = cart.items.filter(
      item => item._id?.toString() !== itemId && item.product.toString() !== itemId
    ) as any;

    cart.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    await cart.save();

    const populatedCart = await cart.populate('items.product');
    res.status(200).json({ success: true, cart: populatedCart });
  } catch (error) {
    next(error);
  }
};

export const clearCart = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }

    const cart = await Cart.findOne({ user: req.user.id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }

    res.status(200).json({ success: true, message: 'Cart cleared successfully.' });
  } catch (error) {
    next(error);
  }
};
