import React, { useContext, useState } from 'react';
import { Container, Form, Row, Button, Card } from "react-bootstrap";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { LOGIN_ROUTE, REGISTRATION_ROUTE, SHOP_ROUTE } from "../utils/consts";
import { login, registration } from "../http/userAPI";
import { observer } from "mobx-react-lite";
import { Context } from "../index";

const Auth = observer(() => {
    const { user } = useContext(Context);
    const location = useLocation();
    const navigate = useNavigate();
    const isLogin = location.pathname === LOGIN_ROUTE;

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const click = async () => {
        try {
          let data;
          if (isLogin) {
            data = await login(email, password);
          } else {
            data = await registration(email, password);
          }
          // Записываем в контекст данные о пользователе и роли
          user.setUser({ ...data, role: data.role }); // Должно быть role
          user.setIsAuth(true);
          navigate(SHOP_ROUTE);
        } catch (e) {
          alert(e.response?.data?.message || 'Произошла ошибка');
        }
    }

    return (
        <Container
            className="d-flex justify-content-center align-items-center"
            style={{
                height: window.innerHeight - 54,
                backgroundColor: 'white' // Белый фон для страницы
            }}
        >
            <Card
                style={{
                    width: 700, // Увеличенный размер
                    borderRadius: '15px', // Закругленные углы
                    padding: '30px', // Увеличенный отступ
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Тень
                }}
                className="shadow-lg rounded"
            >
                <h2 className="text-center mb-4" style={{ color: 'blue' }}>{isLogin ? 'Авторизация' : "Регистрация"}</h2>
                <Form className="d-flex flex-column">
                    <Form.Control
                        className="mt-3"
                        placeholder="Введите ваш email..."
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        type="email"
                        required
                    />
                    <Form.Control
                        className="mt-3"
                        placeholder="Введите ваш пароль..."
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        type="password"
                        required
                    />
                    <Row className="d-flex justify-content-between mt-3 pl-3 pr-3">
                        {isLogin ? (
                            <div style={{ color: 'blue' }}>
                                Нет аккаунта? <NavLink to={REGISTRATION_ROUTE} style={{ color: 'blue' }}>Зарегистрируйся!</NavLink>
                            </div>
                        ) : (
                            <div style={{ color: 'blue' }}>
                                Есть аккаунт? <NavLink to={LOGIN_ROUTE} style={{ color: 'blue' }}>Войдите!</NavLink>
                            </div>
                        )}
                        <Button
                            variant={"outline-primary"} // Синий цвет для кнопки
                            onClick={click}
                            className="mt-2 w-100"
                            style={{
                                transition: 'all 0.3s ease',
                                backgroundColor: 'transparent',
                                borderColor: 'blue',
                                color: 'blue',
                                borderRadius: '10px', // Закругленные углы кнопки
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.transform = 'scale(1.05)';
                                e.target.style.backgroundColor = 'blue';
                                e.target.style.color = 'white';
                                e.target.style.borderColor = 'blue';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'scale(1)';
                                e.target.style.backgroundColor = 'transparent';
                                e.target.style.color = 'blue';
                                e.target.style.borderColor = 'blue';
                            }}
                        >
                            {isLogin ? 'Войти' : 'Регистрация'}
                        </Button>
                    </Row>
                </Form>
            </Card>
        </Container>
    );
});

export default Auth;
