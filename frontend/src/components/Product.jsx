import { Link } from 'react-router-dom';
import { Card, Badge } from 'react-bootstrap';

const Product = ({ product }) => {
    return (
        <Card className="my-3 rounded shadow-sm h-100 product-card border-0">
            <Link to={`/product/${product._id}`} className="img-wrapper d-block position-relative overflow-hidden" style={{ borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }}>
                <Card.Img src={product.image} variant="top" className="card-img" style={{ height: '220px', objectFit: 'cover', transition: 'transform 0.5s ease' }} />
                {product.discount > 0 && (
                    <Badge bg="danger" className="position-absolute top-0 start-0 m-3 px-3 py-2 rounded-pill shadow-sm" style={{ zIndex: 1 }}>
                        {product.discount}% OFF
                    </Badge>
                )}
            </Link>

            <Card.Body className="d-flex flex-column p-4">
                <Link to={`/product/${product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <Card.Title as="div" className="product-title mb-2">
                        <strong>{product.title}</strong>
                    </Card.Title>
                </Link>
                <div className="mb-2 text-muted small">{product.category}</div>
                <Card.Text as="div" className="mb-3">
                    <div className="d-flex align-items-center">
                        {product.rating ? product.rating.toFixed(1) : '0.0'} <i className="ms-1 fas fa-star text-warning"></i>
                        <span className="ms-2">({product.numReviews || 0} reviews)</span>
                    </div>
                </Card.Text>

                <Card.Text as="h3" className="mt-auto d-flex align-items-baseline">
                    <span className="product-price fs-4 fw-bold text-primary">₹{(product.price).toFixed(2)}</span>
                    {product.mrp > product.price && (
                        <span className="mrp-crossed ms-2 text-muted text-decoration-line-through fs-6">₹{product.mrp.toFixed(2)}</span>
                    )}
                </Card.Text>
            </Card.Body>
        </Card>
    );
};

export default Product;
