import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useRegisterMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';

const RegisterScreen = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('buyer');
    const [businessDetails, setBusinessDetails] = useState('');
    const [message, setMessage] = useState(null);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [register, { isLoading, error }] = useRegisterMutation();

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
        if (password !== confirmPassword) {
            setMessage('Passwords do not match');
        } else {
            try {
                const payload = { name, email, password, role };
                if (role === 'seller') {
                    payload.businessDetails = businessDetails;
                }
                const res = await register(payload).unwrap();
                dispatch(setCredentials({ ...res }));
                navigate(redirect);
            } catch (err) {
                setMessage(err?.data?.message || err.error);
            }
        }
    };

    return (
        <Row className="justify-content-md-center mt-4 mb-5">
            <Col xs={12} md={6}>
                <Card className="p-4 shadow-sm">
                    <Card.Body>
                        <h2 className="mb-4 text-center" style={{ color: 'var(--primary)' }}>Create an Account</h2>
                        {message && <div className="alert alert-danger">{message}</div>}

                        <Form onSubmit={submitHandler}>
                            <Form.Group className="mb-3" controlId="name">
                                <Form.Label>Full Name</Form.Label>
                                <Form.Control type="text" placeholder="Enter name" value={name} onChange={(e) => setName(e.target.value)} required style={{ borderRadius: '8px' }} />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="email">
                                <Form.Label>Email Address</Form.Label>
                                <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ borderRadius: '8px' }} />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="role">
                                <Form.Label>I want to:</Form.Label>
                                <Form.Select
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    style={{ borderRadius: '8px' }}
                                >
                                    <option value="buyer">Buy Products</option>
                                    <option value="seller">Sell Products</option>
                                </Form.Select>
                            </Form.Group>

                            {role === 'seller' && (
                                <Form.Group className="mb-3" controlId="businessDetails">
                                    <Form.Label>Business Details / Store Name</Form.Label>
                                    <Form.Control type="text" placeholder="Enter business info" value={businessDetails} onChange={(e) => setBusinessDetails(e.target.value)} required style={{ borderRadius: '8px' }} />
                                </Form.Group>
                            )}

                            <Form.Group className="mb-3" controlId="password">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ borderRadius: '8px' }} />
                            </Form.Group>

                            <Form.Group className="mb-4" controlId="confirmPassword">
                                <Form.Label>Confirm Password</Form.Label>
                                <Form.Control type="password" placeholder="Confirm password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required style={{ borderRadius: '8px' }} />
                            </Form.Group>

                            <div className="d-grid gap-2">
                                <Button type="submit" variant="primary" size="lg" disabled={isLoading} style={{ borderRadius: '8px' }}>
                                    {isLoading ? 'Registering...' : 'Register'}
                                </Button>
                            </div>
                        </Form>

                        <Row className="py-3 text-center">
                            <Col>
                                Already have an account?{' '}
                                <Link to={redirect ? `/login?redirect=${redirect}` : '/login'} style={{ color: 'var(--primary)', fontWeight: 'bold', textDecoration: 'none' }}>
                                    Sign In
                                </Link>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
};

export default RegisterScreen;
