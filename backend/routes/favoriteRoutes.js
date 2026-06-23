import express from 'express';
import { addFavorite, removeFavorite, getMyFavorites } from '../controllers/favoriteController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, addFavorite).get(protect, getMyFavorites);
router.route('/:productId').delete(protect, removeFavorite);

export default router;
