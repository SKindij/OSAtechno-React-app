import React, { useState, useEffect, lazy, startTransition } from 'react';
import { Helmet } from "react-helmet";
import { Container, Row, Col, Button, Card, Form, ButtonGroup, ButtonToolbar, InputGroup } from 'react-bootstrap';
import { FaEye } from 'react-icons/fa';
import { BsFillBadgeAdFill } from 'react-icons/bs';
import DataService from '../../services/DataService';
import OrderForm from '../order/OrderForm';
import './Pages.scss';
const ProductDetails = lazy( () => import('./ProductDetails') );

const ResidentialGatesPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
	
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [showProductDetails, setShowProductDetails] = useState(false);
	
  const [selectedAdBtn, setSelectedAdBtn] = useState(false);
  const [selectedProductQuantity, setSelectedProductQuantity] = useState(0);	
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showOrderForm, setShowOrderForm] = useState(false);
// function of obtaining goods from database
  useEffect( () => {
    const fetchProducts = async () => {
      try {
        const residentialProducts = await DataService.getResidentialProducts();
        setProducts(residentialProducts);
        setFilteredProducts(residentialProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, [] );
// functionality of filtering groups of accessories
  const filterProducts = (category) => {
    if (category === 'All categories') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter( (product) => product.category === category );
      setFilteredProducts(filtered);
    }
  };
// functions of managing modal window of additional info about product
  const selectProductId = (productId) => {
    setSelectedProductId(productId);
  };
  const handleOpenProductDetails = (productId) => {
    setSelectedProductId(productId);
    startTransition(() => { setShowProductDetails(true); });
  };
  const handleCloseProductDetails = () => {
    setSelectedProductId(null);
    setShowProductDetails(false);
  };
// functionality for collecting desired goods
  const handleQuantityChange = (event) => {
    const value = parseInt(event.target.value, 10) || 0;
    setSelectedProductQuantity(value);
  };
  const handleAddClick = async (event) => {
    event.preventDefault();
    try {
      const selectedProduct = await DataService.getGatesById(selectedProductId);
      // Updating the list of selected products
      const updatedSelectedProducts = [...selectedProducts];
      const existingProductIndex = updatedSelectedProducts.findIndex(
        (product) => product.id === selectedProductId
      );
      if (existingProductIndex !== -1) {
        // The product already exists, update its quantity
        updatedSelectedProducts[existingProductIndex].quantity += selectedProductQuantity;
      } else {
        // Add a new product to the list
        updatedSelectedProducts.push({
          id: selectedProductId,
          name: selectedProduct.name,
          article: selectedProduct.article,
          price: selectedProduct.price,
          quantity: selectedProductQuantity,
          unit: selectedProduct.unit,
        });
      }
      setSelectedProducts(updatedSelectedProducts);
      console.log(`User add ${selectedProductQuantity} of ${selectedProduct.name}`);
    } catch (error) {
      console.error('Error fetching selected product:', error);
    }
  };
  const handleToggleSelected = () => {
    setSelectedAdBtn(!selectedAdBtn);
  };
// functions of managing modal window of order form
  const handleOpenOrderForm = () => {   
    startTransition(() => { setShowOrderForm(true); });
  };
  const handleCloseOrderForm = () => {   
    setShowOrderForm(false);
  };
// clear all fields and remove visual effects from buttons
  const handleClearSelectedAccessories = () => {
    setSelectedProductQuantity(0);
    setSelectedProducts([]);
  };

  return (
    <main className='main-page'>
      <Helmet>
        <meta name="description"
          content="Discover our collection of high-quality residential gates. Choose from various designs and materials. 
          Enhance the security and aesthetics of your home. Request a quote now!"
        />
        <meta name="keywords" 
	        content="residential gates, home gates, gate designs, gate materials, security gates" />
        <title>Residential gates</title>
        <link rel="canonical" href="https://osatechno.com/residential" />
      </Helmet>
    <Container className={ `card-wrapper ${showProductDetails ? 'blur' : ''}` }>
      <h1>Accessories for residential garage doors</h1>
      <Row className="mb-4">       
        <Col>
          <ButtonToolbar aria-label="Product categories">
            <ButtonGroup className="me-2">
              <Button variant="success" onClick={() => filterProducts('All categories')} className="me-2">
                All categories
              </Button>
            </ButtonGroup>
            <ButtonGroup>
              <Button variant="info" onClick={() => filterProducts('On Shaft')} className="me-2">
                On Shaft
              </Button>{' '}
              <Button variant="info" onClick={() => filterProducts('On Panel')} className="me-2">
                On Panel
              </Button>{' '}
              <Button variant="info" onClick={() => filterProducts('Railsystem')} className="me-2">
                Railsystem
              </Button>
            </ButtonGroup>
          </ButtonToolbar>
        </Col>
      </Row>
      <Row>
       {filteredProducts.map( (product) => (
        <Col key={product.id} xs={12} md={6} lg={4} xl={3}>
          <Card className={`product-card ${selectedProductId === product.id ? 'product-card-highlight' : ''}`}
            onClick={() => selectProductId(product.id)}
          >
            <Card.Header>{product.name}</Card.Header>
            <div className="product-image-container">
              <Card.Img className="product-image" variant="top" 
                src={product.imageA} alt={product.name}
                width="500" height="375"/>
            </div>
            <Card.Body>
              <Card.Text>Article: {product.article}</Card.Text>
              <Card.Text>Price: {product.price}€</Card.Text>
            </Card.Body>
            <Card.Footer>
              <Row>
                <Col xs={12} md={9}>
                  <Form.Group controlId={`quantity_${product.id}`}>
                  <InputGroup>
                    <Form.Control aria-label="Need for spare parts"
                      type="number" min={0} step={1} pattern="[0-9]+"
                      inputMode="numeric"
                      value={selectedProductQuantity}
                      onChange={handleQuantityChange}
                    />
                    <InputGroup.Text>{product.unit}</InputGroup.Text>
                    <Button variant={selectedAdBtn ? 'warning' : 'outline-warning'} onClick={handleToggleSelected}>
                      <Form.Check type="checkbox" id="addToCartCheckbox"
                        checked={selectedAdBtn} aria-label="Add item to Selected Products"
                        onChange={handleToggleSelected}
                        onClick={handleAddClick}
                        label={<BsFillBadgeAdFill />} />
                    </Button>
                  </InputGroup>
                  </Form.Group>
                </Col>
                <Col xs={12} md={3} className="d-flex justify-content-center">
                  <Button variant="outline-success" className="product-button"
                    onClick={() => handleOpenProductDetails(product.id)}
                    aria-label="Open product details">
                    <FaEye />
                  </Button>
                </Col>
              </Row>
            </Card.Footer>
          </Card>
        </Col>
       ) )}        
      </Row>
      {selectedProductId && showProductDetails && (
        <ProductDetails 
          onClose={handleCloseProductDetails} 
          productId={selectedProductId} />
      )}
      <div className="d-grid gap-2">
      <Button variant="outline-success" size="lg"
        onClick={() => handleOpenOrderForm()}
        aria-label="Open windwow with order form">
          Open windwow with order form
      </Button>
      <Button variant="outline-danger" size="lg"
        onClick={handleClearSelectedAccessories}>
          Clear the list of selected accessories
      </Button>
      </div>             
      {showOrderForm && (
        < OrderForm 
          onClose={handleCloseOrderForm} 
          selectedProducts={selectedProducts} 
          setSelectedProducts={setSelectedProducts} />
      )}   
    </Container>
    </main>
  );
};
export default ResidentialGatesPage;