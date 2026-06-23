import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useLoginMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [login, { isLoading, error }] = useLoginMutation();

    const { userInfo } = useSelector((state) => state.auth);

    const { search } = useLocation();
    const sp = new URLSearchParams(search);
    const redirect = sp.get('redirect') || '/';

    useEffect(() => {
        if (userInfo) {
            navigate(redirect);
        }
    }, [navigate, redirect, userInfo]);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const res = await login({ email, password }).unwrap();
            dispatch(setCredentials({ ...res }));
            navigate(redirect);
        } catch (err) {
            console.error(err?.data?.message || err.error);
        }
    };

    return (
        <Row className="justify-content-md-center mt-5">
            <Col xs={12} md={6}>
                <Card className="p-4 shadow-sm">
                    <Card.Body>
                        <h2 className="mb-4 text-center" style={{ color: 'var(--primary)' }}>Sign In to RevShop</h2>
                        {error && <div className="alert alert-danger">{error?.data?.message || error.error}</div>}

                        <Form onSubmit={submitHandler}>
                            <Form.Group className="mb-3" controlId="email">
                                <Form.Label>Email Address</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Enter email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    style={{ borderRadius: '8px' }}
                                />
                            </Form.Group>

                            <Form.Group className="mb-4" controlId="password">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Enter password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    style={{ borderRadius: '8px' }}
                                />
                            </Form.Group>

                            <div className="d-grid gap-2">
                                <Button type="submit" variant="primary" size="lg" disabled={isLoading} style={{ borderRadius: '8px' }}>
                                    {isLoading ? 'Signing In...' : 'Sign In'}
                                </Button>
                            </div>
                        </Form>

                        <Row className="py-3 text-center">
                            <Col>
                                New Customer?{' '}
                                <Link to={redirect ? `/register?redirect=${redirect}` : '/register'} style={{ color: 'var(--primary)', fontWeight: 'bold', textDecoration: 'none' }}>
                                    Register Here
                                </Link>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
};

export default LoginScreen;
