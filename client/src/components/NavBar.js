import React, { useContext } from 'react';
import { Context } from "../index";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { NavLink, useNavigate } from "react-router-dom";
import {
    ADMIN_ROUTE, LOGIN_ROUTE, SHOP_ROUTE, PROFILE_ROUTE,
    MANAGER_ROUTE
} from "../utils/consts";
import {
    Button, Container, Form, FormControl, InputGroup
} from "react-bootstrap";
import { observer } from "mobx-react-lite";
import { BsCart, BsPerson, BsSearch, BsBoxArrowRight } from 'react-icons/bs';

const NavBar = observer(() => {
    const { user } = useContext(Context);
    const navigate = useNavigate();

    const logOut = () => {
        localStorage.removeItem('token');
        user.setUser({});
        user.setIsAuth(false);
    };

    return (
        <Navbar
            expand="lg"
            className="text-white"
            style={{
                backgroundColor: '#0d6efd',
                borderRadius: '16px',
                margin: '10px',
                padding: '10px 20px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
            }}
        >
            <Container>
                {/* Логотип */}
                <NavLink
                    to={SHOP_ROUTE}
                    className="navbar-brand fs-4 fw-semibold text-white"
                >
                    Магазин Спорта
                </NavLink>

                <Navbar.Toggle aria-controls="main-navbar-nav" className="bg-white" />
                <Navbar.Collapse id="main-navbar-nav">
                    <Nav className="ms-auto d-flex align-items-center gap-2 flex-wrap">
                        {/* Поиск */}
                        <Form className="d-flex me-3" style={{ minWidth: '250px' }}>
                            <InputGroup>
                                <FormControl
                                    type="search"
                                    placeholder="Поиск..."
                                    className="rounded-start"
                                />
                                <Button variant="light">
                                    <BsSearch />
                                </Button>
                            </InputGroup>
                        </Form>

                        {user.isAuth ? (
                            <>
                                {user.user.role === 'ADMIN' && (
                                    <Button
                                        variant="outline-light"
                                        onClick={() => navigate(ADMIN_ROUTE)}
                                    >
                                        Админ
                                    </Button>
                                )}
                                {user.user.role === 'MANAGER' && (
                                    <Button
                                        variant="outline-light"
                                        onClick={() => navigate(MANAGER_ROUTE)}
                                    >
                                        Менеджер
                                    </Button>
                                )}
                                <Button
                                    variant="outline-light"
                                    onClick={() => navigate(PROFILE_ROUTE)}
                                    title="Профиль"
                                >
                                    <BsPerson />
                                </Button>
                                <Button
                                    variant="outline-light"
                                    onClick={() => navigate('/basket')}
                                    title="Корзина"
                                >
                                    <BsCart />
                                </Button>
                                <Button
                                    variant="outline-light"
                                    onClick={logOut}
                                    title="Выйти"
                                >
                                    <BsBoxArrowRight />
                                </Button>
                            </>
                        ) : (
                            <Button
                                variant="outline-light"
                                onClick={() => navigate(LOGIN_ROUTE)}
                            >
                                Войти
                            </Button>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
});

export default NavBar;
