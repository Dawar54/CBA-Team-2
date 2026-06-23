import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    mrp: {
        type: Number,
        required: true,
    },
    discount: {
        type: Number,
        default: 0,
    },
    category: {
        type: String,
        required: true,
    },
    image: {
        type: String,
    },
    stock: {
        type: Number,
        required: true,
        default: 0,
    },
    threshold: {
        type: Number,
        required: true,
        default: 5, // notify when stock drops below this
    },
    rating: {
        type: Number,
        required: true,
        default: 0,
    },
    numReviews: {
        type: Number,
        required: true,
        default: 0,
    },
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
export default Product;
