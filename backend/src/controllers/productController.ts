import { Request, Response, NextFunction } from 'express';
import Product from '../models/Product';
import Category from '../models/Category';
import { uploadImage } from '../utils/cloudinary';

export const getProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { page = 1, limit = 9, category, subcategory, search, minPrice, maxPrice, sort } = req.query;

    const query: any = {};

    // Category filter
    if (category) {
      const catDoc = await Category.findOne({ slug: category as string });
      if (catDoc) {
        query.category = catDoc._id;
      } else {
        // If not found, return empty set
        res.status(200).json({ success: true, count: 0, totalPages: 0, products: [] });
        return;
      }
    }

    // Subcategory filter
    if (subcategory) {
      query.subcategory = subcategory as string;
    }

    // Price range filters
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Search query matching
    if (search) {
      query.$text = { $search: search as string };
    }

    // Sort order definition
    let sortQuery: any = { createdAt: -1 }; // Default: Newest arrivals first
    if (sort) {
      const sortStr = sort as string;
      if (sortStr === 'price-low') sortQuery = { price: 1 };
      else if (sortStr === 'price-high') sortQuery = { price: -1 };
      else if (sortStr === 'rating') sortQuery = { rating: -1 };
    }

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));

    const totalProducts = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('category', 'name slug')
      .sort(sortQuery)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: products.length,
      totalPages: Math.ceil(totalProducts / limitNum),
      currentPage: pageNum,
      totalProducts,
      products
    });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id).populate('category', 'name slug');

    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found.' });
      return;
    }

    res.status(200).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, description, price, discountPrice, category, subcategory, stock } = req.body;

    if (!name || !description || !price || !category || stock === undefined) {
      res.status(400).json({ success: false, message: 'Please provide all required fields.' });
      return;
    }

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      res.status(404).json({ success: false, message: 'Selected category does not exist.' });
      return;
    }

    const images: string[] = [];
    if (req.files && Array.isArray(req.files)) {
      for (const file of req.files) {
        const url = await uploadImage(file.path);
        images.push(url);
      }
    } else if (req.body.images && Array.isArray(req.body.images)) {
      images.push(...req.body.images);
    }

    const product = await Product.create({
      name,
      description,
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : undefined,
      category,
      subcategory,
      stock: Number(stock),
      images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=800']
    });

    res.status(201).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description, price, discountPrice, category, subcategory, stock, images } = req.body;

    const product = await Product.findById(id);
    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found.' });
      return;
    }

    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        res.status(404).json({ success: false, message: 'Selected category does not exist.' });
        return;
      }
      product.category = category;
    }

    if (name) product.name = name;
    if (description) product.description = description;
    if (price !== undefined) product.price = Number(price);
    if (discountPrice !== undefined) product.discountPrice = discountPrice ? Number(discountPrice) : undefined;
    if (subcategory !== undefined) product.subcategory = subcategory;
    if (stock !== undefined) product.stock = Number(stock);

    if (images && Array.isArray(images)) {
      product.images = images;
    }

    if (req.files && Array.isArray(req.files)) {
      const newImages: string[] = [];
      for (const file of req.files) {
        const url = await uploadImage(file.path);
        newImages.push(url);
      }
      if (newImages.length > 0) {
        product.images = newImages; // Overwrite or push depending on client request, here we overwrite if new files are sent
      }
    }

    await product.save();

    res.status(200).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found.' });
      return;
    }

    res.status(200).json({ success: true, message: 'Product deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

export const getCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const categories = await Category.find({});
    res.status(200).json({ success: true, categories });
  } catch (error) {
    next(error);
  }
};
