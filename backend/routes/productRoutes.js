import express from 'express';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct, createProductReview, deleteReview } from '../controllers/productController.js';
import { protect, sellerOptions } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getProducts).post(protect, sellerOptions, createProduct);
router.route('/:id').get(getProductById).put(protect, sellerOptions, updateProduct).delete(protect, sellerOptions, deleteProduct);
router.route('/:id/reviews').post(protect, createProductReview);
router.route('/:id/reviews/:reviewId').delete(protect, deleteReview);

export default router;
