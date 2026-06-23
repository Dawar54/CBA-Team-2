import { Link, useNavigate } from 'react-router-dom';
import { Row, Col, ListGroup, Image, Form, Button, Card } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart } from '../slices/cartSlice';

const CartScreen = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const cart = useSelector((state) => state.cart);
    const { cartItems } = cart;

    const addToCartHandler = async (product, qty) => {
        dispatch(addToCart({ ...product, qty }));
    };

    const removeFromCartHandler = async (id) => {
        dispatch(removeFromCart(id));
    };

    const checkoutHandler = () => {
        navigate('/login?redirect=/shipping');
    };

    return (
        <Row className="mt-4">
            <Col md={8}>
                <h2 style={{ color: 'var(--primary)', fontWeight: 'bold', marginBottom: '20px' }}>Shopping Cart</h2>
                {cartItems.length === 0 ? (
                    <div className="alert alert-info">
                        Your cart is empty <Link to="/">Go Back</Link>
                    </div>
                ) : (
                    <ListGroup variant="flush">
                        {cartItems.map((item) => (
                            <ListGroup.Item key={item._id} className="mb-3 border-0 shadow-sm p-3" style={{ borderRadius: '12px' }}>
                                <Row className="align-items-center">
                                    <Col md={2}>
                                        <Image src={item.image} alt={item.title} fluid rounded />
                                    </Col>
                                    <Col md={4}>
                                        <Link to={`/product/${item._id}`} style={{ textDecoration: 'none', color: 'inherit', fontWeight: 'bold' }}>
                                            {item.title}
                                        </Link>
                                    </Col>
                                    <Col md={2} className="product-price fs-5">${item.price.toFixed(2)}</Col>
                                    <Col md={2}>
                                        <Form.Control
                                            as="select"
                                            value={item.qty}
                                            onChange={(e) => addToCartHandler(item, Number(e.target.value))}
                                            style={{ borderRadius: '8px' }}
                                        >
                                            {[...Array(item.stock).keys()].map((x) => (
                                                <option key={x + 1} value={x + 1}>
                                                    {x + 1}
                                                </option>
                                            ))}
                                        </Form.Control>
                                    </Col>
                                    <Col md={2}>
                                        <Button type="button" variant="light" onClick={() => removeFromCartHandler(item._id)}>
                                            <FaTrash className="text-danger" />
                                        </Button>
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                )}
            </Col>
            <Col md={4}>
                <Card className="shadow-sm border-0" style={{ borderRadius: '12px' }}>
                    <ListGroup variant="flush">
                        <ListGroup.Item>
                            <h3>
                                Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)}) items
                            </h3>
                            <div className="fs-4 fw-bold mt-2" style={{ color: 'var(--dark)' }}>
                                ${cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}
                            </div>
                        </ListGroup.Item>
                        <ListGroup.Item className="text-center p-3">
                            <Button
                                type="button"
                                className="btn-primary w-100 py-2"
                                disabled={cartItems.length === 0}
                                onClick={checkoutHandler}
                                style={{ borderRadius: '8px' }}
                            >
                                Proceed To Checkout
                            </Button>
                        </ListGroup.Item>
                    </ListGroup>
                </Card>
            </Col>
        </Row>
    );
};

export default CartScreen;
