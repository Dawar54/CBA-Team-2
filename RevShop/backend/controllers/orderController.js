import Order from '../models/Order.js';
import Notification from '../models/Notification.js';
import Product from '../models/Product.js';
import Favorite from '../models/Favorite.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const addOrderItems = async (req, res) => {
    try {
        const {
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
        } = req.body;

        if (orderItems && orderItems.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        } else {
            const order = new Order({
                orderItems,
                buyerId: req.user._id,
                shippingAddress,
                paymentMethod,
                itemsPrice,
                taxPrice,
                shippingPrice,
                totalPrice,
            });

            const createdOrder = await order.save();

            // Notify Buyer
            await Notification.create({
                userId: req.user._id,
                message: `Your order ${createdOrder._id} has been placed successfully!`,
                type: 'order',
            });

            // Notify Sellers and Manage Stock
            for (const item of orderItems) {
                const product = await Product.findById(item.productId);
                if (product) {
                    product.stock -= item.qty;
                    await product.save();

                    // Low Stock Alert to Seller
                    if (product.stock <= product.threshold && product.stock > 0) {
                        await Notification.create({
                            userId: product.sellerId,
                            message: `Low stock alert: ${product.title} has only ${product.stock} units left.`,
                            type: 'inventory',
                        });
                    }

                    // Out of Stock Alert to Seller and Favorited Buyers
                    if (product.stock <= 0) {
                        // Seller Alert
                        await Notification.create({
                            userId: product.sellerId,
                            message: `Out of stock alert: ${product.title} is now out of stock.`,
                            type: 'inventory',
                        });

                        // Buyer Favorites Alert
                        const favorites = await Favorite.find({ productId: product._id });
                        for (const fav of favorites) {
                            await Notification.create({
                                userId: fav.userId,
                                message: `An item in your favorites, ${product.title}, is now out of stock.`,
                                type: 'inventory',
                            });
                        }
                    }
                }
            }

            res.status(201).json(createdOrder);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ buyerId: req.user._id });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('buyerId', 'name email')
            .populate('orderItems.sellerId', 'name email businessDetails');

        if (order) {
            res.json(order);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get orders for seller's products
// @route   GET /api/orders/sellerorders
// @access  Private/Seller
export const getSellerOrders = async (req, res) => {
    try {
        // Find orders where at least one orderItem has the matching sellerId
        const orders = await Order.find({ 'orderItems.sellerId': req.user._id })
            .populate('buyerId', 'name email');

        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
