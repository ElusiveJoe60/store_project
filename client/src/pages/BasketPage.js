import React from 'react';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import { BsXCircle, BsChevronUp, BsChevronDown } from 'react-icons/bs';
import { useBasket } from '../context/BasketContext';

const BasketPage = () => {
  const { basketItems, removeFromBasket, updateQuantity } = useBasket();

  const adjustQty = (id, qty) => {
    if (qty >= 1) {
      updateQuantity(id, qty);
    }
  };

  const totalPrice = basketItems.reduce(
    (acc, item) => acc + item.sale_price * item.quantity,
    0
  );

  return (
    <Container style={{ paddingTop: 50, paddingBottom: 40 }}>
      
      <h3 style={{ textAlign: 'center', marginBottom: 35, color: '#2c3e50' }}>
        Содержимое корзины
      </h3>

      <Col md={5}>
          <div
            style={{
              backgroundColor: '#dff9fb',
              padding: 25,
              borderRadius: 12,
              boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
            }}
          >
            <h4 style={{ marginBottom: 20 }}>Итоги заказа</h4>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 17,
                marginBottom: 15,
                fontWeight: '500',
              }}
            >
              <span>Сумма к оплате:</span>
              <span>{totalPrice} ₽</span>
            </div>
            <Button
              variant="primary"
              style={{
                width: '100%',
                backgroundColor: '#0984e3',
                borderColor: '#0984e3',
              }}
            >
              Завершить покупку
            </Button>
          </div>
        </Col>

      <Row>
        <Col md={7}>
          {basketItems.length === 0 ? (
            <div
              style={{
                padding: 35,
                borderRadius: 8,
                backgroundColor: '#ffeaa7',
                textAlign: 'center',
                fontSize: 18,
                marginTop: 15,
              }}
            >
              Здесь пока ничего нет
            </div>
          ) : (
            basketItems.map((item) => (
              <div
                key={item.id}
                style={{
                  marginBottom: 25,
                  padding: 20,
                  backgroundColor: '#f1f2f6',
                  borderRadius: 10,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 20,
                  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.06)',
                }}
              >
                <img
                  src={process.env.REACT_APP_API_URL + item.img}
                  alt={item.name}
                  style={{
                    width: 90,
                    height: 90,
                    objectFit: 'cover',
                    borderRadius: 6,
                    border: '2px solid #dcdde1',
                  }}
                />
                <div style={{ flexGrow: 1 }}>
                  <h5 style={{ marginBottom: 6 }}>{item.name}</h5>
                  <div style={{ color: '#636e72', marginBottom: 10 }}>
                    {item.sale_price} ₽
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Button
                      variant="outline-dark"
                      onClick={() => adjustQty(item.id, item.quantity + 1)}
                    >
                      <BsChevronUp />
                    </Button>
                    <Form.Control
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        adjustQty(item.id, Number(e.target.value))
                      }
                      style={{
                        width: 60,
                        textAlign: 'center',
                        borderColor: '#ced6e0',
                      }}
                    />
                    <Button
                      variant="outline-dark"
                      onClick={() => adjustQty(item.id, item.quantity - 1)}
                    >
                      <BsChevronDown />
                    </Button>
                  </div>
                </div>
                <div>
                  <Button
                    variant="outline-danger"
                    onClick={() => removeFromBasket(item.id)}
                  >
                    <BsXCircle /> Удалить
                  </Button>
                </div>
              </div>
            ))
          )}
        </Col>

        
      </Row>
    </Container>
  );
};

export default BasketPage;
