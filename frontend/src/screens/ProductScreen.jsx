import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Row, Col, Image, ListGroup, Card, Button, Form, Badge } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useGetProductDetailsQuery, useCreateReviewMutation, useDeleteReviewMutation } from '../slices/productsApiSlice';
import { addToCart } from '../slices/cartSlice';
import { useGetFavoritesQuery, useAddFavoriteMutation, useRemoveFavoriteMutation } from '../slices/favoritesApiSlice';

// ─── Star Picker Component ────────────────────────────────────────────────────
const StarPicker = ({ value, onChange }) => {
    const [hovered, setHovered] = useState(0);
    return (
        <div className="star-picker" role="group" aria-label="Star rating picker">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    className={`star-btn ${star <= (hovered || value) ? 'active' : ''}`}
                    onMouseEnter={() => setHovered(star)}
                    onMouseLeave={() => setHovered(0)}
                    onClick={() => onChange(star)}
                    aria-label={`${star} star`}
                >
                    <i className="fas fa-star" />
                </button>
            ))}
            {value > 0 && (
                <span className="star-label ms-2">
                    {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][value]}
                </span>
            )}
        </div>
    );
};

// ─── Display Stars (read-only) ────────────────────────────────────────────────
const StarDisplay = ({ rating, size = '' }) => (
    <span className={`star-display ${size}`}>
        {[1, 2, 3, 4, 5].map((i) => (
            <i
                key={i}
                className={`fas fa-star ${i <= Math.round(rating) ? 'text-warning' : 'text-muted'}`}
            />
        ))}
    </span>
);

// ─── Toast Notification ───────────────────────────────────────────────────────
const Toast = ({ message, type, onClose }) => (
    <div className={`rev-toast rev-toast-${type}`}>
        <i className={`fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} me-2`} />
        {message}
        <button className="rev-toast-close" onClick={onClose}>&times;</button>
    </div>
);

// ─── Rating Distribution Bars ─────────────────────────────────────────────────
const RatingBars = ({ reviews }) => {
    const total = reviews.length;
    return (
        <div className="rating-bars">
            {[5, 4, 3, 2, 1].map((star) => {
                const count = reviews.filter((r) => Math.round(r.rating) === star).length;
                const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                return (
                    <div key={star} className="rating-bar-row">
                        <span className="rating-bar-label">{star} <i className="fas fa-star text-warning" /></span>
                        <div className="rating-bar-track">
                            <div className="rating-bar-fill" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="rating-bar-count">{count}</span>
                    </div>
                );
            })}
        </div>
    );
};

// ─── Review Avatar ────────────────────────────────────────────────────────────
const ReviewAvatar = ({ name }) => {
    const initials = name ? name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) : '?';
    const colors = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#0EA5E9'];
    const color = colors[initials.charCodeAt(0) % colors.length];
    return (
        <div className="review-avatar" style={{ backgroundColor: color }}>
            {initials}
        </div>
    );
};

// ─── Main ProductScreen ───────────────────────────────────────────────────────
const ProductScreen = () => {
    const { id: productId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [qty, setQty] = useState(1);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3500);
    };

    const { data: product, isLoading, error, refetch } = useGetProductDetailsQuery(productId);
    const { userInfo } = useSelector((state) => state.auth);

    const [createReview, { isLoading: loadingReview }] = useCreateReviewMutation();
    const [deleteReview, { isLoading: deletingReview }] = useDeleteReviewMutation();

    const { data: favorites } = useGetFavoritesQuery(undefined, { skip: !userInfo });
    const [addFavorite] = useAddFavoriteMutation();
    const [removeFavorite] = useRemoveFavoriteMutation();

    const isFavorite = favorites?.some((f) => f.productId?._id === productId);

    const favoriteHandler = async () => {
        if (!userInfo) { navigate('/login'); return; }
        if (isFavorite) {
            await removeFavorite(productId);
            showToast('Removed from wishlist', 'error');
        } else {
            await addFavorite({ productId });
            showToast('Added to wishlist! ❤️');
        }
    };

    const addToCartHandler = () => {
        dispatch(addToCart({ ...product, qty }));
        navigate('/cart');
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        if (!rating) { showToast('Please select a star rating', 'error'); return; }
        if (!comment.trim()) { showToast('Please write a comment', 'error'); return; }
        try {
            await createReview({ productId, rating, comment }).unwrap();
            refetch();
            showToast('Review submitted successfully! 🎉');
            setRating(0);
            setComment('');
        } catch (err) {
            showToast(err?.data?.message || 'Something went wrong', 'error');
        }
    };

    const deleteReviewHandler = async (reviewId) => {
        try {
            await deleteReview({ productId, reviewId }).unwrap();
            refetch();
            showToast('Review deleted');
        } catch (err) {
            showToast(err?.data?.message || 'Could not delete review', 'error');
        }
    };

    const userReview = userInfo && product?.reviews?.find(
        (r) => r.buyerId?._id === userInfo?._id || r.buyerId === userInfo?._id
    );

    return (
        <>
            {/* Toast */}
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            <Link className="btn btn-light my-3" to="/">
                <i className="fas fa-arrow-left me-2" />Go Back
            </Link>

            {isLoading ? (
                <div className="d-flex justify-content-center py-5">
                    <div className="spinner-border text-primary" role="status" />
                </div>
            ) : error ? (
                <div className="alert alert-danger">{error?.data?.message || error.error}</div>
            ) : (
                <>
                    {/* ── Product Details ── */}
                    <Row>
                        <Col md={5}>
                            <Image src={product.image} alt={product.title} fluid style={{ borderRadius: '16px' }} />
                        </Col>
                        <Col md={4}>
                            <ListGroup variant="flush">
                                <ListGroup.Item className="border-0 bg-transparent">
                                    <div className="d-flex justify-content-between align-items-start">
                                        <h3 className="mb-1">{product.title}</h3>
                                        <button
                                            className={`fav-heart-btn ${isFavorite ? 'active' : ''}`}
                                            onClick={favoriteHandler}
                                            title={isFavorite ? 'Remove from wishlist' : 'Add to wishlist'}
                                        >
                                            <i className={`${isFavorite ? 'fas' : 'far'} fa-heart`} />
                                        </button>
                                    </div>
                                    {product.discount > 0 && (
                                        <Badge bg="success" className="mt-1">{product.discount}% OFF</Badge>
                                    )}
                                </ListGroup.Item>

                                <ListGroup.Item className="border-0 bg-transparent">
                                    <div className="d-flex align-items-center gap-2">
                                        <StarDisplay rating={product?.rating || 0} />
                                        <span className="fw-bold">{(product?.rating || 0).toFixed(1)}</span>
                                        <span className="text-muted">({product?.numReviews || 0} {product?.numReviews === 1 ? 'review' : 'reviews'})</span>
                                    </div>
                                </ListGroup.Item>

                                <ListGroup.Item className="border-0 bg-transparent">
                                    <span className="product-price fs-2">₹{product.price.toFixed(2)}</span>
                                    {product.mrp > product.price && (
                                        <span className="mrp-crossed fs-5 ms-2">₹{product.mrp.toFixed(2)}</span>
                                    )}
                                </ListGroup.Item>

                                <ListGroup.Item className="border-0 bg-transparent text-muted">
                                    {product.description}
                                </ListGroup.Item>

                                <ListGroup.Item className="border-0 bg-transparent">
                                    <span className="badge bg-light text-dark border">
                                        <i className="fas fa-tag me-1 text-primary" />
                                        {product.category}
                                    </span>
                                </ListGroup.Item>
                            </ListGroup>
                        </Col>

                        <Col md={3}>
                            <Card className="border-0 shadow-sm" style={{ borderRadius: '16px', backgroundColor: 'var(--light)' }}>
                                <ListGroup variant="flush" className="bg-transparent">
                                    <ListGroup.Item className="bg-transparent">
                                        <Row>
                                            <Col>Price:</Col>
                                            <Col><strong>₹{product.price.toFixed(2)}</strong></Col>
                                        </Row>
                                    </ListGroup.Item>
                                    <ListGroup.Item className="bg-transparent">
                                        <Row>
                                            <Col>Status:</Col>
                                            <Col>
                                                {product.stock > 0 ? (
                                                    <span className="text-success fw-bold">In Stock ({product.stock})</span>
                                                ) : (
                                                    <span className="text-danger fw-bold">Out Of Stock</span>
                                                )}
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                    {product.stock > 0 && (
                                        <ListGroup.Item className="bg-transparent">
                                            <Row>
                                                <Col>Qty</Col>
                                                <Col>
                                                    <Form.Control
                                                        as="select"
                                                        value={qty}
                                                        onChange={(e) => setQty(Number(e.target.value))}
                                                        style={{ borderRadius: '8px' }}
                                                    >
                                                        {[...Array(Math.min(product.stock, 10)).keys()].map((x) => (
                                                            <option key={x + 1} value={x + 1}>{x + 1}</option>
                                                        ))}
                                                    </Form.Control>
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                    )}
                                    <ListGroup.Item className="bg-transparent text-center p-3">
                                        <Button
                                            className="w-100 py-2 btn-primary mb-2"
                                            disabled={product.stock === 0}
                                            onClick={addToCartHandler}
                                            style={{ borderRadius: '10px' }}
                                        >
                                            <i className="fas fa-cart-plus me-2" />Add To Cart
                                        </Button>
                                        <Button
                                            variant={isFavorite ? 'outline-danger' : 'outline-secondary'}
                                            className="w-100 py-2"
                                            onClick={favoriteHandler}
                                            style={{ borderRadius: '10px' }}
                                        >
                                            <i className={`${isFavorite ? 'fas' : 'far'} fa-heart me-2`} />
                                            {isFavorite ? 'Saved to Wishlist' : 'Save to Wishlist'}
                                        </Button>
                                    </ListGroup.Item>
                                </ListGroup>
                            </Card>
                        </Col>
                    </Row>

                    {/* ── Reviews Section ── */}
                    <Row className="mt-5">
                        <Col md={12}>
                            <h2 className="mb-4 section-heading">
                                <i className="fas fa-star text-warning me-2" />
                                Reviews & Ratings
                            </h2>
                        </Col>

                        {/* Rating Summary + Bars */}
                        {product.reviews && product.reviews.length > 0 && (
                            <Col md={4} className="mb-4">
                                <div className="rating-summary-card">
                                    <div className="rating-big">{(product?.rating || 0).toFixed(1)}</div>
                                    <StarDisplay rating={product?.rating || 0} size="lg" />
                                    <div className="text-muted mt-1">{product?.numReviews || 0} {product?.numReviews === 1 ? 'review' : 'reviews'}</div>
                                    <div className="mt-3">
                                        <RatingBars reviews={product.reviews} />
                                    </div>
                                </div>
                            </Col>
                        )}

                        {/* Review Cards */}
                        <Col md={product.reviews && product.reviews.length > 0 ? 8 : 12}>
                            {product.reviews && product.reviews.length === 0 && (
                                <div className="empty-reviews">
                                    <i className="fas fa-comment-slash" />
                                    <p>No reviews yet. Be the first to share your thoughts!</p>
                                </div>
                            )}

                            <ListGroup variant="flush" className="review-list">
                                {product.reviews && product.reviews.map((review) => {
                                    const isOwn = userInfo && review.buyerId && (review.buyerId?._id === userInfo?._id || review.buyerId === userInfo?._id);
                                    return (
                                        <ListGroup.Item key={review._id} className="review-card bg-transparent border-0 mb-3">
                                            <div className="d-flex gap-3">
                                                <ReviewAvatar name={review.buyerId?.name || 'User'} />
                                                <div className="flex-grow-1">
                                                    <div className="d-flex justify-content-between align-items-start">
                                                        <div>
                                                            <strong>{review.buyerId?.name || 'Unknown User'}</strong>
                                                            {isOwn && <span className="badge bg-primary ms-2 small">You</span>}
                                                            <div className="d-flex align-items-center gap-2 mt-1">
                                                                <StarDisplay rating={review.rating} />
                                                                <span className="text-muted small">
                                                                    {new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        {isOwn && (
                                                            <button
                                                                className="review-delete-btn"
                                                                onClick={() => deleteReviewHandler(review._id)}
                                                                disabled={deletingReview}
                                                                title="Delete your review"
                                                            >
                                                                <i className="fas fa-trash-alt" />
                                                            </button>
                                                        )}
                                                    </div>
                                                    <p className="review-comment mb-0 mt-2">{review.comment}</p>
                                                </div>
                                            </div>
                                        </ListGroup.Item>
                                    );
                                })}
                            </ListGroup>

                            {/* Write Review Form */}
                            <div className="write-review-box mt-4">
                                <h4 className="mb-3">
                                    <i className="fas fa-pencil-alt me-2 text-primary" />
                                    Write a Review
                                </h4>

                                {!userInfo ? (
                                    <div className="alert alert-info">
                                        Please <Link to="/login">sign in</Link> to write a review
                                    </div>
                                ) : userReview ? (
                                    <div className="alert alert-success">
                                        <i className="fas fa-check-circle me-2" />
                                        You've already reviewed this product. Delete your review above to write a new one.
                                    </div>
                                ) : (
                                    <Form onSubmit={submitHandler}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-semibold">Your Rating</Form.Label>
                                            <StarPicker value={rating} onChange={setRating} />
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-semibold">Your Review</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={3}
                                                value={comment}
                                                onChange={(e) => setComment(e.target.value)}
                                                placeholder="Share your experience with this product..."
                                                style={{ borderRadius: '10px', resize: 'none' }}
                                            />
                                        </Form.Group>
                                        <Button
                                            type="submit"
                                            variant="primary"
                                            disabled={loadingReview}
                                            style={{ borderRadius: '10px', paddingInline: '2rem' }}
                                        >
                                            {loadingReview ? (
                                                <><span className="spinner-border spinner-border-sm me-2" />Submitting...</>
                                            ) : (
                                                <><i className="fas fa-paper-plane me-2" />Submit Review</>
                                            )}
                                        </Button>
                                    </Form>
                                )}
                            </div>
                        </Col>
                    </Row>
                </>
            )}
        </>
    );
};

export default ProductScreen;
