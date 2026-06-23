import Product from '../models/Product.js';
import ProductReview from '../models/Review.js';

// @desc    Fetch all products (Browse/Catalog)
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
    try {
        const keyword = req.query.keyword
            ? {
                title: {
                    $regex: req.query.keyword,
                    $options: 'i',
                },
            }
            : {};

        const products = await Product.find({ ...keyword });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Fetch single product detail
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('sellerId', 'name email businessDetails');

        if (product) {
            const reviews = await ProductReview.find({ productId: product._id }).populate('buyerId', 'name');
            res.json({ ...product._doc, reviews });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Seller
export const createProduct = async (req, res) => {
    try {
        const { title, description, price, mrp, discount, category, stock, threshold, image } = req.body;

        const product = new Product({
            title,
            description,
            price,
            mrp,
            discount,
            category,
            stock,
            threshold,
            image: image || '/images/sample.jpg',
            sellerId: req.user._id,
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Seller
export const updateProduct = async (req, res) => {
    try {
        const { title, description, price, mrp, discount, category, stock, threshold, image } = req.body;

        const product = await Product.findById(req.params.id);

        if (product) {
            if (product.sellerId.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'Not authorized to update this product' });
            }

            product.title = title || product.title;
            product.description = description || product.description;
            product.price = price || product.price;
            product.mrp = mrp || product.mrp;
            product.discount = discount || product.discount;
            product.category = category || product.category;
            product.stock = stock !== undefined ? stock : product.stock;
            product.threshold = threshold !== undefined ? threshold : product.threshold;
            product.image = image || product.image;

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Seller
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            if (product.sellerId.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'Not authorized to delete this product' });
            }
            await Product.deleteOne({ _id: product._id });
            res.json({ message: 'Product removed' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
export const createProductReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const product = await Product.findById(req.params.id);

        if (product) {
            // Check if user already reviewed this product
            const alreadyReviewed = await ProductReview.findOne({
                productId: product._id,
                buyerId: req.user._id,
            });

            if (alreadyReviewed) {
                return res.status(400).json({ message: 'You have already reviewed this product' });
            }

            const review = {
                buyerId: req.user._id,
                productId: product._id,
                rating: Number(rating),
                comment,
            };

            const newReview = await ProductReview.create(review);

            // Recalculate average rating
            const reviews = await ProductReview.find({ productId: product._id });
            product.numReviews = reviews.length;
            product.rating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

            await product.save();
            res.status(201).json({ message: 'Review added', review: newReview });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a review
// @route   DELETE /api/products/:id/reviews/:reviewId
// @access  Private
export const deleteReview = async (req, res) => {
    try {
        const review = await ProductReview.findById(req.params.reviewId);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        if (review.buyerId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to delete this review' });
        }

        await review.deleteOne();

        // Recalculate product rating
        const product = await Product.findById(req.params.id);
        if (product) {
            const reviews = await ProductReview.find({ productId: product._id });
            product.numReviews = reviews.length;
            product.rating = reviews.length > 0
                ? reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length
                : 0;
            await product.save();
        }

        res.json({ message: 'Review removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
