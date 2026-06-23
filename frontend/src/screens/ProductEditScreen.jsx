import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useGetProductDetailsQuery, useCreateProductMutation, useUpdateProductMutation } from '../slices/productsApiSlice';

const ProductEditScreen = () => {
    const { id: productId } = useParams();
    const isEditMode = productId !== 'new';

    const [title, setTitle] = useState('');
    const [price, setPrice] = useState(0);
    const [mrp, setMrp] = useState(0);
    const [image, setImage] = useState('');
    const [category, setCategory] = useState('');
    const [stock, setStock] = useState(0);
    const [description, setDescription] = useState('');
    const [threshold, setThreshold] = useState(5);
    const [discount, setDiscount] = useState(0);

    const { data: product, isLoading, error } = useGetProductDetailsQuery(productId, { skip: !isEditMode });

    const [createProduct, { isLoading: loadingCreate }] = useCreateProductMutation();
    const [updateProduct, { isLoading: loadingUpdate }] = useUpdateProductMutation();

    const navigate = useNavigate();

    useEffect(() => {
        if (isEditMode && product) {
            setTitle(product.title);
            setPrice(product.price);
            setMrp(product.mrp);
            setImage(product.image);
            setCategory(product.category);
            setStock(product.stock);
            setDescription(product.description);
            setThreshold(product.threshold);
            setDiscount(product.discount);
        }
    }, [isEditMode, product]);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const productData = {
                title, price, mrp, image, category, stock, description, threshold, discount
            };

            if (isEditMode) {
                await updateProduct({ _id: productId, ...productData }).unwrap();
                alert('Product updated');
            } else {
                await createProduct(productData).unwrap();
                alert('Product created');
            }
            navigate('/seller/dashboard');
        } catch (err) {
            alert(err?.data?.message || err.error);
        }
    };

    return (
        <>
            <Link to='/seller/dashboard' className='btn btn-light my-3'>
                Go Back
            </Link>
            <Row className="justify-content-md-center mb-5">
                <Col md={8}>
                    <h2>{isEditMode ? 'Edit Product' : 'Create Product'}</h2>
                    {isLoading ? (
                        <p>Loading...</p>
                    ) : error ? (
                        <div className="alert alert-danger">{error?.data?.message || error.error}</div>
                    ) : (
                        <Form onSubmit={submitHandler}>
                            <Form.Group controlId='title' className="mb-3">
                                <Form.Label>Title</Form.Label>
                                <Form.Control
                                    type='text'
                                    placeholder='Enter title'
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                ></Form.Control>
                            </Form.Group>

                            <Row>
                                <Col md={6}>
                                    <Form.Group controlId='price' className="mb-3">
                                        <Form.Label>Price</Form.Label>
                                        <Form.Control
                                            type='number'
                                            placeholder='Enter price'
                                            value={price}
                                            onChange={(e) => setPrice(Number(e.target.value))}
                                            required
                                        ></Form.Control>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group controlId='mrp' className="mb-3">
                                        <Form.Label>MRP</Form.Label>
                                        <Form.Control
                                            type='number'
                                            placeholder='Enter MRP'
                                            value={mrp}
                                            onChange={(e) => setMrp(Number(e.target.value))}
                                            required
                                        ></Form.Control>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Form.Group controlId='image' className="mb-3">
                                <Form.Label>Image URL (Optional)</Form.Label>
                                <Form.Control
                                    type='text'
                                    placeholder='Enter image URL'
                                    value={image}
                                    onChange={(e) => setImage(e.target.value)}
                                ></Form.Control>
                            </Form.Group>

                            <Row>
                                <Col md={6}>
                                    <Form.Group controlId='category' className="mb-3">
                                        <Form.Label>Category</Form.Label>
                                        <Form.Control
                                            type='text'
                                            placeholder='Enter category'
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            required
                                        ></Form.Control>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group controlId='stock' className="mb-3">
                                        <Form.Label>Count In Stock</Form.Label>
                                        <Form.Control
                                            type='number'
                                            placeholder='Enter countInStock'
                                            value={stock}
                                            onChange={(e) => setStock(Number(e.target.value))}
                                            required
                                        ></Form.Control>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={6}>
                                    <Form.Group controlId='threshold' className="mb-3">
                                        <Form.Label>Stock Threshold (for alerts)</Form.Label>
                                        <Form.Control
                                            type='number'
                                            placeholder='Enter threshold'
                                            value={threshold}
                                            onChange={(e) => setThreshold(Number(e.target.value))}
                                            required
                                        ></Form.Control>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group controlId='discount' className="mb-3">
                                        <Form.Label>Discount %</Form.Label>
                                        <Form.Control
                                            type='number'
                                            placeholder='Enter discount'
                                            value={discount}
                                            onChange={(e) => setDiscount(Number(e.target.value))}
                                        ></Form.Control>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Form.Group controlId='description' className="mb-3">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    as='textarea'
                                    rows={3}
                                    placeholder='Enter description'
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                ></Form.Control>
                            </Form.Group>

                            <Button
                                type='submit'
                                variant='primary'
                                className='mt-2'
                                disabled={loadingCreate || loadingUpdate}
                                style={{ borderRadius: '8px', padding: '10px 30px' }}
                            >
                                {isEditMode ? 'Update' : 'Create'}
                            </Button>

                            {(loadingCreate || loadingUpdate) && <p className="mt-2">Processing...</p>}
                        </Form>
                    )}
                </Col>
            </Row>
        </>
    );
};

export default ProductEditScreen;
