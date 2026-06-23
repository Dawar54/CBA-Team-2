import { Row, Col, Container, Button } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Product from '../components/Product';
import { useGetProductsQuery } from '../slices/productsApiSlice';
import { FaArrowRight } from 'react-icons/fa';

const HomeScreen = () => {
    const { keyword } = useParams();
    const { data: products, isLoading, error } = useGetProductsQuery(keyword || '');

    return (
        <div className="home-screen-wrapper">
            {!keyword && (
                <div className="hero-section text-center text-white d-flex align-items-center justify-content-center flex-column">
                    <Container>
                        <h1 className="display-3 fw-bold mb-4 hero-title">Discover Premium Quality Products</h1>
                        <p className="lead mb-5 hero-subtitle">Elevate your lifestyle with our exclusive collection. Curated just for you.</p>
                        <Button variant="light" size="lg" className="hero-btn rounded-pill px-5 py-3 fw-bold" onClick={() => window.scrollTo({ top: document.getElementById('products').offsetTop - 100, behavior: 'smooth' })}>
                            Shop Now <FaArrowRight className="ms-2" />
                        </Button>
                    </Container>
                </div>
            )}

            <Container id="products" className="py-5">
                <div className="d-flex justify-content-between align-items-end mb-4">
                    <div>
                        <h2 className="section-title fw-bold m-0">{keyword ? 'Search Results' : 'Trending Now'}</h2>
                        <div className="title-underline"></div>
                    </div>
                    {keyword && <Link to="/" className="btn btn-outline-primary rounded-pill">Go Back</Link>}
                </div>

                {isLoading ? (
                    <div className="d-flex justify-content-center py-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : error ? (
                    <div className="alert alert-danger shadow-sm rounded-4">{error?.data?.message || error.error}</div>
                ) : !products || products.length === 0 ? (
                    <div className="text-center py-5 empty-state">
                        <i className="fas fa-box-open fa-4x text-muted mb-3"></i>
                        <h3 className="fw-bold">No Products Found</h3>
                        <p className="text-muted">We couldn't find anything matching your criteria.</p>
                    </div>
                ) : (
                    <Row className="g-4">
                        {products.map((product) => (
                            <Col key={product._id} sm={12} md={6} lg={4} xl={3} className="d-flex">
                                <Product product={product} />
                            </Col>
                        ))}
                    </Row>
                )}
            </Container>
        </div>
    );
};

export default HomeScreen;
