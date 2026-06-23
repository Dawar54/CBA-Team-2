import { Row, Col } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import Product from '../components/Product';
import { useGetProductsQuery } from '../slices/productsApiSlice';

const HomeScreen = () => {
    const { keyword } = useParams();
    const { data: products, isLoading, error } = useGetProductsQuery(keyword || '');

    return (
        <>
            <h1 className="my-4" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Latest Premium Products</h1>
            {isLoading ? (
                <h2>Loading...</h2>
            ) : error ? (
                <div className="alert alert-danger">{error?.data?.message || error.error}</div>
            ) : (
                <Row>
                    {products.map((product) => (
                        <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                            <Product product={product} />
                        </Col>
                    ))}
                </Row>
            )}
        </>
    );
};

export default HomeScreen;
