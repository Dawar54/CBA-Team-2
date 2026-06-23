import { Row, Col, Card, Table, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useGetSellerOrdersQuery } from '../slices/ordersApiSlice';
import { useGetProductsQuery, useDeleteProductMutation } from '../slices/productsApiSlice';

const SellerDashboard = () => {
    const navigate = useNavigate();

    // We fetch all products and filter locally for MVP
    const { data: allProducts, isLoading: loadingProducts, error: errorProducts, refetch } = useGetProductsQuery('');
    const { data: orders, isLoading: loadingOrders, error: errorOrders } = useGetSellerOrdersQuery();

    const [deleteProduct, { isLoading: loadingDelete }] = useDeleteProductMutation();

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const myProducts = allProducts?.filter(p => p.sellerId === userInfo?._id) || [];

    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await deleteProduct(id).unwrap();
                refetch();
                alert('Product deleted successfully');
            } catch (err) {
                alert(err?.data?.message || err.error);
            }
        }
    };

    const editHandler = (id) => {
        navigate(`/seller/product/${id}/edit`);
    };

    return (
        <>
            <Row className='align-items-center'>
                <Col>
                    <h2 style={{ color: 'var(--primary)', fontWeight: 'bold' }} className="mt-4 mb-4">Seller Dashboard</h2>
                </Col>
                <Col className='text-end'>
                    <Button className='my-3' onClick={() => navigate('/seller/product/new/edit')}>
                        <i className='fas fa-plus'></i> Create Product
                    </Button>
                </Col>
            </Row>

            <Row>
                <Col md={12}>
                    <Card className="shadow-sm border-0 mb-4" style={{ borderRadius: '12px' }}>
                        <Card.Header className="bg-white border-0 pt-4 pb-0">
                            <h4 style={{ color: 'var(--dark)' }}>My Products</h4>
                        </Card.Header>
                        <Card.Body>
                            {loadingProducts || loadingDelete ? <p>Loading...</p> : errorProducts ? <div className="alert alert-danger">Error loading products</div> : (
                                <Table hover responsive className="table-sm">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>NAME</th>
                                            <th>PRICE</th>
                                            <th>CATEGORY</th>
                                            <th>STOCK</th>
                                            <th>ACTIONS</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {myProducts.map((product) => (
                                            <tr key={product._id}>
                                                <td>{product._id.substring(0, 5)}...</td>
                                                <td>{product.title}</td>
                                                <td>₹{product.price}</td>
                                                <td>{product.category}</td>
                                                <td>{product.stock}</td>
                                                <td>
                                                    <Button variant="light" className="btn-sm me-2" onClick={() => editHandler(product._id)}>Edit</Button>
                                                    <Button variant="danger" className="btn-sm" onClick={() => deleteHandler(product._id)}>Delete</Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            )}
                        </Card.Body>
                    </Card>
                </Col>


                <Col md={12}>
                    <Card className="shadow-sm border-0 mb-4" style={{ borderRadius: '12px' }}>
                        <Card.Header className="bg-white border-0 pt-4 pb-0">
                            <h4 style={{ color: 'var(--dark)' }}>Recent Orders for My Products</h4>
                        </Card.Header>
                        <Card.Body>
                            {loadingOrders ? <p>Loading...</p> : errorOrders ? <div className="alert alert-danger">Error loading orders</div> : (
                                <Table hover responsive className="table-sm">
                                    <thead>
                                        <tr>
                                            <th>ORDER ID</th>
                                            <th>USER</th>
                                            <th>DATE</th>
                                            <th>TOTAL</th>
                                            <th>DELIVERED</th>
                                            <th>ACTIONS</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders?.map((order) => (
                                            <tr key={order._id}>
                                                <td>{order._id.substring(0, 5)}...</td>
                                                <td>{order.buyerId && order.buyerId.name}</td>
                                                <td>{order.createdAt.substring(0, 10)}</td>
                                                <td>₹{order.totalPrice}</td>
                                                <td>
                                                    {order.isDelivered ? (
                                                        order.deliveredAt.substring(0, 10)
                                                    ) : (
                                                        <i className="fas fa-times" style={{ color: 'red' }}></i>
                                                    )}
                                                </td>
                                                <td>
                                                    <Button variant="light" className="btn-sm">Details</Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default SellerDashboard;
