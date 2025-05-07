import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
    return (
        <footer
            style={{
                backgroundColor: '#0d6efd',
                color: 'white',
                borderRadius: '16px',
                margin: '20px',
                padding: '20px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
            }}
        >
            <Container>
                <Row>
                    <Col className="text-center">
                        <p className="mb-0 fw-light">© 2025 Магазин Спорта — Все права защищены</p>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;
