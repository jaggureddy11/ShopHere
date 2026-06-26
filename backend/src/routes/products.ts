import { Router } from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories
} from '../controllers/productController';
import { protect } from '../middleware/auth';
import { adminOnly } from '../middleware/admin';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Set up simple local storage uploader for dev
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

const router = Router();

// Public routes
router.get('/', getProducts);
router.get('/categories', getCategories);
router.get('/:id', getProductById);

// Admin-only routes
router.post('/', protect, adminOnly, upload.array('images', 5), createProduct);
router.put('/:id', protect, adminOnly, upload.array('images', 5), updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

export default router;
