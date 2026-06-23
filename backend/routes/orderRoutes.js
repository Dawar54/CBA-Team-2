import express from 'express';
import { addOrderItems, getMyOrders, getOrderById, getSellerOrders } from '../controllers/orderController.js';
import { protect, sellerOptions } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, addOrderItems);
router.route('/myorders').get(protect, getMyOrders);
router.route('/sellerorders').get(protect, sellerOptions, getSellerOrders);
router.route('/:id').get(protect, getOrderById);

export default router;
