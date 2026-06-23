import { Navbar, Nav, Container, NavDropdown, Badge } from 'react-bootstrap';
import { FaShoppingCart, FaUser, FaBell, FaHeart } from 'react-icons/fa';
import { LinkContainer } from 'react-router-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../slices/authSlice';
import SearchBox from './SearchBox';
import { useGetNotificationsQuery, useMarkAsReadMutation } from '../slices/notificationsApiSlice';
import { useGetFavoritesQuery } from '../slices/favoritesApiSlice';

const Header = () => {
    const { userInfo } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const { data: notifications } = useGetNotificationsQuery(undefined, { skip: !userInfo });
    const [markAsRead] = useMarkAsReadMutation();

    const { data: favorites } = useGetFavoritesQuery(undefined, { skip: !userInfo });
    const favCount = favorites?.length || 0;
    const unreadCount = notifications?.filter(n => !n.isRead).length || 0;

    const logoutHandler = async () => {
        try {
            dispatch(logout());
            window.location.href = '/login';
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <header>
            <Navbar className="navbar-custom" expand="lg" collapseOnSelect fixed="top">
                <Container>
                    <LinkContainer to="/">
                        <Navbar.Brand><strong>RevShop</strong></Navbar.Brand>
                    </LinkContainer>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <SearchBox />
                        <Nav className="ms-auto" style={{ alignItems: 'center' }}>

                            {/* Cart */}
                            <LinkContainer to="/cart">
                                <Nav.Link>
                                    <FaShoppingCart className="me-1" /> Cart
                                </Nav.Link>
                            </LinkContainer>

                            {/* Wishlist — only for logged-in users */}
                            {userInfo && (
                                <LinkContainer to="/favorites">
                                    <Nav.Link>
                                        <span className="position-relative d-inline-block">
                                            <FaHeart className="text-danger" />
                                            {favCount > 0 && (
                                                <Badge
                                                    pill bg="danger"
                                                    className="position-absolute"
                                                    style={{ top: '-8px', right: '-10px', fontSize: '10px' }}
                                                >
                                                    {favCount}
                                                </Badge>
                                            )}
                                        </span>
                                        {' '}Wishlist
                                    </Nav.Link>
                                </LinkContainer>
                            )}

                            {/* Notifications */}
                            {userInfo && (
                                <NavDropdown
                                    title={
                                        <span className="position-relative">
                                            <FaBell />
                                            {unreadCount > 0 && (
                                                <Badge pill bg="danger" className="position-absolute"
                                                    style={{ top: '-8px', right: '-8px', fontSize: '10px' }}>
                                                    {unreadCount}
                                                </Badge>
                                            )}
                                        </span>
                                    }
                                    id="notifications"
                                    align="end"
                                >
                                    {!notifications || notifications.length === 0 ? (
                                        <NavDropdown.Item>No notifications</NavDropdown.Item>
                                    ) : (
                                        notifications.slice(0, 5).map(n => (
                                            <NavDropdown.Item
                                                key={n._id}
                                                onClick={() => markAsRead(n._id)}
                                                style={{ whiteSpace: 'normal', minWidth: '250px', backgroundColor: n.isRead ? 'transparent' : '#f8f9fa' }}
                                            >
                                                <div className={n.isRead ? 'text-muted' : 'fw-bold'}>{n.message}</div>
                                                <small className="text-muted">{new Date(n.createdAt).toLocaleString()}</small>
                                            </NavDropdown.Item>
                                        ))
                                    )}
                                </NavDropdown>
                            )}

                            {/* User menu */}
                            {userInfo ? (
                                <NavDropdown title={userInfo.name} id="username">
                                    <LinkContainer to="/profile">
                                        <NavDropdown.Item>Profile</NavDropdown.Item>
                                    </LinkContainer>
                                    {userInfo.role === 'seller' && (
                                        <LinkContainer to="/seller/dashboard">
                                            <NavDropdown.Item>Seller Dashboard</NavDropdown.Item>
                                        </LinkContainer>
                                    )}
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item onClick={logoutHandler}>Logout</NavDropdown.Item>
                                </NavDropdown>
                            ) : (
                                <LinkContainer to="/login">
                                    <Nav.Link><FaUser className="me-1" /> Sign In</Nav.Link>
                                </LinkContainer>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            {/* Spacer for fixed navbar */}
            <div style={{ height: '70px' }}></div>
        </header>
    );
};

export default Header;
