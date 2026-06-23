import { useState, useEffect } from 'react';
import { Table, Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useGetMyOrdersQuery } from '../slices/ordersApiSlice';
import { useGetFavoritesQuery, useRemoveFavoriteMutation } from '../slices/favoritesApiSlice';
import { Image } from 'react-bootstrap';

const ProfileScreen = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { userInfo } = useSelector((state) => state.auth);
    const { data: orders, isLoading, error } = useGetMyOrdersQuery();

    useEffect(() => {
        if (userInfo) {
            setName(userInfo.name);
            setEmail(userInfo.email);
        } else {
            navigate('/login');
        }
    }, [navigate, userInfo]);

    const submitHandler = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert('Passwords do not match');
        } else {
            alert('Profile update functionality coming soon!');
        }
    };

    return (
        <Row>
            <Col md={3}>
                <h2>User Profile</h2>
                <Form onSubmit={submitHandler}>
                    <Form.Group className="mb-3" controlId="name">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="name"
                            placeholder="Enter name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        ></Form.Control>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="email">
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        ></Form.Control>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        ></Form.Control>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="confirmPassword">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Confirm password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        ></Form.Control>
                    </Form.Group>

                    <Button type="submit" variant="primary">
                        Update
                    </Button>
                </Form>
            </Col>
            <Col md={9}>
                <h2>My Orders</h2>
                {isLoading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <div className="alert alert-danger">{error?.data?.message || error.error}</div>
                ) : (
                    <Table striped hover responsive className='table-sm'>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>DATE</th>
                                <th>TOTAL</th>
                                <th>PAID</th>
                                <th>DELIVERED</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order._id}>
                                    <td>{order._id}</td>
                                    <td>{order.createdAt.substring(0, 10)}</td>
                                    <td>₹{order.totalPrice}</td>
                                    <td>
                                        {order.isPaid ? (
                                            order.paidAt.substring(0, 10)
                                        ) : (
                                            <i className='fas fa-times' style={{ color: 'red' }}></i>
                                        )}
                                    </td>
                                    <td>
                                        {order.isDelivered ? (
                                            order.deliveredAt.substring(0, 10)
                                        ) : (
                                            <i className='fas fa-times' style={{ color: 'red' }}></i>
                                        )}
                                    </td>
                                    <td>
                                        <Button className='btn-sm' variant='light' onClick={() => navigate(`/order/${order._id}`)}>
                                            Details
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </Col>
            <Col md={12} className="mt-5">
                <h2>My Favorites</h2>
                <FavoritesList />
            </Col>
        </Row>
    );
};

const FavoritesList = () => {
    const { userInfo } = useSelector((state) => state.auth);
    const { data: favorites, isLoading, error } = useGetFavoritesQuery(undefined, { skip: !userInfo });
    const [removeFavorite] = useRemoveFavoriteMutation();
    const navigate = useNavigate();

    if (isLoading) return <p>Loading...</p>;
    if (error) return <div className="alert alert-danger">{error?.data?.message || error.error}</div>;
    if (!favorites || favorites.length === 0) return <div className="alert alert-info">No favorites yet</div>;

    return (
        <Table striped hover responsive className='table-sm'>
            <thead>
                <tr>
                    <th>IMAGE</th>
                    <th>PRODUCT</th>
                    <th>PRICE</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {favorites.map((fav) => (
                    <tr key={fav._id}>
                        <td>
                            <Image src={fav.productId?.image} alt={fav.productId?.title} fluid rounded style={{ height: '40px' }} />
                        </td>
                        <td>{fav.productId?.title}</td>
                        <td>₹{fav.productId?.price}</td>
                        <td>
                            <Button className='btn-sm mx-2' variant='light' onClick={() => navigate(`/product/${fav.productId._id}`)}>
                                View
                            </Button>
                            <Button className='btn-sm' variant='danger' onClick={() => removeFavorite(fav.productId._id)}>
                                <i className='fas fa-trash'></i>
                            </Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
};

export default ProfileScreen;
