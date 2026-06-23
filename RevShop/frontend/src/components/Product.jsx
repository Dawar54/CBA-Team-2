import { Link } from 'react-router-dom';
import { Card, Badge } from 'react-bootstrap';

const Product = ({ product }) => {
    return (
        <Card className="my-3 p-3 rounded shadow-sm h-100 product-card">
            <Link to={`/product/${product._id}`}>
                <Card.Img src={product.image} variant="top" style={{ height: '200px', objectFit: 'cover' }} />
            </Link>

            <Card.Body className="d-flex flex-column">
                <Link to={`/product/${product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <Card.Title as="div" className="product-title mb-2">
                        <strong>{product.title}</strong>
                    </Card.Title>
                </Link>
                <div className="mb-2 text-muted small">{product.category}</div>
                <Card.Text as="div" className="mb-3">
                    <div className="d-flex align-items-center">
                        {product.rating} <i className="ms-1 fas fa-star text-warning"></i>
                        <span className="ms-2">({product.numReviews} reviews)</span>
                    </div>
                </Card.Text>

                <Card.Text as="h3" className="mt-auto d-flex align-items-center">
                    <span className="product-price">${(product.price).toFixed(2)}</span>
                    {product.mrp > product.price && (
                        <span className="mrp-crossed">${product.mrp.toFixed(2)}</span>
                    )}
                    {product.discount > 0 && (
                        <Badge bg="success" className="ms-auto">{product.discount}% OFF</Badge>
                    )}
                </Card.Text>
            </Card.Body>
        </Card>
    );
};

export default Product;
