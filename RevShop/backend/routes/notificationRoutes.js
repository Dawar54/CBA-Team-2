import express from 'express';
import { getNotifications, markNotificationAsRead } from '../controllers/notificationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, getNotifications);
router.route('/:id').put(protect, markNotificationAsRead);

export default router;
