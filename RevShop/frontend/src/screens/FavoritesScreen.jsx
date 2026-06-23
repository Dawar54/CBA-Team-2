import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Row, Col, Button, Badge } from 'react-bootstrap';
import { useGetFavoritesQuery, useRemoveFavoriteMutation } from '../slices/favoritesApiSlice';
import { addToCart } from '../slices/cartSlice';
import { useState } from 'react';

const Toast = ({ message, type, onClose }) => (
    <div className={`rev-toast rev-toast-${type}`}>
        <i className={`fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} me-2`} />
        {message}
        <button className="rev-toast-close" onClick={onClose}>&times;</button>
    </div>
);

const StarDisplay = ({ rating }) => (
    <span>
        {[1, 2, 3, 4, 5].map((i) => (
            <i key={i} className={`fas fa-star small ${i <= Math.round(rating) ? 'text-warning' : 'text-muted'}`} />
        ))}
    </span>
);

const FavoritesScreen = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { userInfo } = useSelector((state) => state.auth);
    const [toast, setToast] = useState(null);

    const { data: favorites, isLoading, error } = useGetFavoritesQuery(undefined, {
        skip: !userInfo,
    });
    const [removeFavorite] = useRemoveFavoriteMutation();

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const removeHandler = async (productId) => {
        await removeFavorite(productId);
        showToast('Removed from wishlist');
    };

    const addToCartHandler = (product) => {
        dispatch(addToCart({ ...product, qty: 1 }));
        showToast('Added to cart! 🛒');
    };

    if (!userInfo) {
        return (
            <div className="favorites-empty-state">
                <i className="fas fa-heart-broken" />
                <h3>Sign in to view your Wishlist</h3>
                <Link to="/login" className="btn btn-primary mt-3" style={{ borderRadius: '10px' }}>
                    Sign In
                </Link>
            </div>
        );
    }

    return (
        <div className="favorites-screen">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            <div className="d-flex align-items-center mb-4 gap-3">
                <h2 className="mb-0 section-heading">
                    <i className="fas fa-heart text-danger me-2" />
                    My Wishlist
                </h2>
                {favorites && favorites.length > 0 && (
                    <Badge bg="danger" pill style={{ fontSize: '0.9rem' }}>
                        {favorites.length} {favorites.length === 1 ? 'item' : 'items'}
                    </Badge>
                )}
            </div>

            {isLoading ? (
                <div className="d-flex justify-content-center py-5">
                    <div className="spinner-border text-primary" role="status" />
                </div>
            ) : error ? (
                <div className="alert alert-danger">{error?.data?.message || 'Failed to load favorites'}</div>
            ) : favorites && favorites.length === 0 ? (
                <div className="favorites-empty-state">
                    <i className="far fa-heart" />
                    <h3>Your wishlist is empty</h3>
                    <p className="text-muted">Save items you love and come back to order them later.</p>
                    <Link to="/" className="btn btn-primary mt-2" style={{ borderRadius: '10px' }}>
                        <i className="fas fa-shopping-bag me-2" />Browse Products
                    </Link>
                </div>
            ) : (
                <Row>
                    {favorites.map((fav) => {
                        const product = fav.productId;
                        if (!product) return null;
                        return (
                            <Col key={fav._id} sm={12} md={6} lg={4} xl={3} className="mb-4">
                                <div className="wishlist-card">
                                    {/* Product Image */}
                                    <Link to={`/product/${product._id}`} className="wishlist-card-img-link">
                                        <img
                                            src={product.image || '/images/sample.jpg'}
                                            alt={product.title}
                                            className="wishlist-card-img"
                                        />
                                        {product.discount > 0 && (
                                            <span className="wishlist-discount-badge">{product.discount}% OFF</span>
                                        )}
                                    </Link>

                                    {/* Card Body */}
                                    <div className="wishlist-card-body">
                                        <Link to={`/product/${product._id}`} className="wishlist-card-title">
                                            {product.title}
                                        </Link>

                                        <div className="d-flex align-items-center gap-2 my-1">
                                            <StarDisplay rating={product.rating} />
                                            <span className="text-muted small">({product.numReviews})</span>
                                        </div>

                                        <div className="d-flex align-items-baseline gap-2 mb-2">
                                            <span className="wishlist-price">${product.price?.toFixed(2)}</span>
                                            {product.mrp > product.price && (
                                                <span className="wishlist-mrp">${product.mrp?.toFixed(2)}</span>
                                            )}
                                        </div>

                                        <div className="mb-3">
                                            {product.stock > 0 ? (
                                                <span className="badge bg-success-subtle text-success">
                                                    <i className="fas fa-circle-check me-1" />In Stock
                                                </span>
                                            ) : (
                                                <span className="badge bg-danger-subtle text-danger">
                                                    <i className="fas fa-circle-xmark me-1" />Out of Stock
                                                </span>
                                            )}
                                        </div>

                                        <Button
                                            variant="primary"
                                            className="w-100 mb-2 wishlist-action-btn"
                                            disabled={product.stock === 0}
                                            onClick={() => addToCartHandler(product)}
                                        >
                                            <i className="fas fa-cart-plus me-2" />
                                            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                                        </Button>

                                        <Button
                                            variant="outline-danger"
                                            className="w-100 wishlist-action-btn"
                                            onClick={() => removeHandler(product._id)}
                                        >
                                            <i className="fas fa-heart-broken me-2" />Remove
                                        </Button>
                                    </div>
                                </div>
                            </Col>
                        );
                    })}
                </Row>
            )}
        </div>
    );
};

export default FavoritesScreen;
