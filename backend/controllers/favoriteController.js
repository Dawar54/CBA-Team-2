import Favorite from '../models/Favorite.js';

// @desc    Add product to favorites
// @route   POST /api/favorites
// @access  Private
export const addFavorite = async (req, res) => {
    try {
        const { productId } = req.body;
        const exists = await Favorite.findOne({ userId: req.user._id, productId });
        if (exists) {
            return res.status(400).json({ message: 'Already in favorites' });
        }
        const favorite = await Favorite.create({ userId: req.user._id, productId });
        res.status(201).json(favorite);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Remove product from favorites
// @route   DELETE /api/favorites/:productId
// @access  Private
export const removeFavorite = async (req, res) => {
    try {
        const favorite = await Favorite.findOne({ userId: req.user._id, productId: req.params.productId });
        if (favorite) {
            await favorite.deleteOne();
            res.json({ message: 'Favorite removed' });
        } else {
            res.status(404).json({ message: 'Favorite not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user favorites
// @route   GET /api/favorites
// @access  Private
export const getMyFavorites = async (req, res) => {
    try {
        const favorites = await Favorite.find({ userId: req.user._id }).populate('productId');
        res.json(favorites);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
