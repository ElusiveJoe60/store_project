import React, { useContext, useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Image } from 'react-bootstrap';
import { observer } from 'mobx-react-lite';
import { Context } from '../index';
import { BsHeart, BsBoxSeam, BsGear, BsPersonCircle, BsCartPlus } from 'react-icons/bs';
import profileImage from '../assets/profile.png';
import { fetchFavorites, removeFavorite } from '../http/ProductAPI';

const ProfilePage = observer(() => {
  const { user } = useContext(Context);
  const [newName, setNewName] = useState(user.user.name || '');
  const [newEmail, setNewEmail] = useState(user.user.email || '');
  const [newPassword, setNewPassword] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [addedToBasket, setAddedToBasket] = useState(false);

  useEffect(() => {
    if (user.isAuth) {
      fetchFavorites()
        .then(data => setFavorites(data))
        .catch(err => console.error('Ошибка при загрузке избранного', err));
    }
  }, [user.isAuth]);

  const handleRemoveFavorite = async (deviceId) => {
    try {
      await removeFavorite(deviceId);
      setFavorites(prev => prev.filter(item => item.deviceId !== deviceId));
    } catch (error) {
      console.error('Ошибка при удалении из избранного', error);
    }
  };

  const handleAddToBasket = (e, device) => {
    e.stopPropagation();
    console.log('Добавлено в корзину:', device);
    setAddedToBasket(true);
    setTimeout(() => setAddedToBasket(false), 2000);
  };

  const handleUpdate = () => {
    alert('Данные обновлены!');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    user.setUser({});
    user.setIsAuth(false);
    alert('Вы вышли из аккаунта');
  };

  return (
    <Container style={styles.page}>
      <Row style={styles.mainRow}>
        <Col md={4} style={styles.sidebar}>
          <div style={styles.profileCard}>
            <Image src={profileImage} roundedCircle width={120} height={120} style={styles.profileImage} />
            <h4 style={styles.userName}>{user.user.name || 'Пользователь'}</h4>
            <p style={styles.userEmail}>{user.user.email}</p>
            <Button variant="outline-danger" style={styles.logoutButton} onClick={handleLogout}>Выйти</Button>
          </div>
          <div style={styles.navMenu}>
            <Button variant="link" style={styles.navLink} onClick={() => setActiveTab('profile')}>
              <BsPersonCircle /> Мои данные
            </Button>
            <Button variant="link" style={styles.navLink} onClick={() => setActiveTab('favorites')}>
              <BsHeart /> Избранное
            </Button>
            <Button variant="link" style={styles.navLink} onClick={() => setActiveTab('orders')}>
              <BsBoxSeam /> История заказов
            </Button>
            <Button variant="link" style={styles.navLink} onClick={() => setActiveTab('settings')}>
              <BsGear /> Настройки
            </Button>
          </div>
        </Col>

        <Col md={8} style={styles.content}>
          {activeTab === 'profile' && (
            <Card style={styles.card}>
              <h3 style={styles.sectionTitle}>Редактировать профиль</h3>
              <Form style={styles.form}>
                <Form.Group className="mb-3">
                  <Form.Label>Новый email</Form.Label>
                  <Form.Control
                    type="email"
                    value={newEmail}
                    placeholder="example@mail.com"
                    onChange={e => setNewEmail(e.target.value)}
                    style={styles.input}
                  />
                </Form.Group>
                <Form.Group className="mb-4">
                  <Form.Label>Новый пароль</Form.Label>
                  <Form.Control
                    type="password"
                    value={newPassword}
                    placeholder="Введите новый пароль"
                    onChange={e => setNewPassword(e.target.value)}
                    style={styles.input}
                  />
                </Form.Group>
                <Button variant="outline-success" style={styles.saveButton} onClick={handleUpdate}>
                  Сохранить изменения
                </Button>
              </Form>
            </Card>
          )}

          {activeTab === 'favorites' && (
            <Card style={styles.card}>
              <h3 style={styles.sectionTitle}>Избранное</h3>
              {favorites.length === 0 ? (
                <p style={styles.noFavorites}>У вас пока нет избранных товаров.</p>
              ) : (
                favorites.map(fav => (
                  <Card key={fav.id} style={styles.favoriteCard}>
                    <Row>
                      <Col md={3}>
                        <Image
                          src={process.env.REACT_APP_API_URL + fav.device.img}
                          style={styles.favoriteImage}
                          alt={fav.device?.name}
                        />
                      </Col>
                      <Col md={9} style={styles.favoriteDetails}>
                        <h5 style={styles.favoriteTitle}>{fav.device?.name || 'Неизвестное устройство'}</h5>
                        {fav.device?.sale_price && <div>Цена: {fav.device.sale_price} руб.</div>}
                        <Button
                          variant="outline-success"
                          style={styles.favoriteButton}
                          onClick={(e) => handleAddToBasket(e, fav.device)}
                        >
                          {addedToBasket ? 'В корзине' : 'Добавить в корзину'}
                        </Button>
                        <Button
                          variant="outline-danger"
                          style={styles.favoriteButton}
                          onClick={() => handleRemoveFavorite(fav.deviceId)}
                        >
                          Удалить
                        </Button>
                      </Col>
                    </Row>
                  </Card>
                ))
              )}
            </Card>
          )}

          {activeTab === 'orders' && (
            <Card style={styles.card}>
              <h3 style={styles.sectionTitle}>История заказов</h3>
              <p style={styles.noContent}>История заказов будет отображаться здесь.</p>
            </Card>
          )}

          {activeTab === 'settings' && (
            <Card style={styles.card}>
              <h3 style={styles.sectionTitle}>Настройки аккаунта</h3>
              <p style={styles.noContent}>Здесь можно будет управлять настройками аккаунта.</p>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
});

const styles = {
  page: {
    backgroundColor: '#1a1a1a',
    color: '#fff',
    minHeight: '100vh',
    padding: '3rem 1rem',
  },
  mainRow: {
    display: 'flex',
    flexDirection: 'row',
    gap: '2rem',
  },
  sidebar: {
    flex: 1,
    backgroundColor: '#222',
    borderRadius: '10px',
    padding: '2rem',
  },
  profileCard: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  profileImage: {
    objectFit: 'cover',
    border: '4px solid #444',
    marginBottom: '1rem',
  },
  userName: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#fff',
  },
  userEmail: {
    color: '#bbb',
    marginBottom: '1rem',
  },
  logoutButton: {
    width: '100%',
    borderRadius: '30px',
    padding: '0.75rem',
    color: '#f44336',
  },
  navMenu: {
    marginTop: '2rem',
  },
  navLink: {
    color: '#bbb',
    fontSize: '1.1rem',
    textAlign: 'left',
    padding: '0.75rem',
    width: '100%',
    borderRadius: '10px',
    transition: '0.3s',
  },
  content: {
    flex: 3,
    padding: '2rem',
  },
  card: {
    backgroundColor: '#222',
    padding: '2rem',
    borderRadius: '10px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  },
  sectionTitle: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
  },
  form: {
    marginTop: '1rem',
  },
  input: {
    backgroundColor: '#333',
    color: '#fff',
    borderRadius: '8px',
  },
  saveButton: {
    marginTop: '1rem',
    borderRadius: '25px',
    padding: '0.75rem 2rem',
    fontSize: '1.1rem',
  },
  noFavorites: {
    color: '#bbb',
    fontSize: '1.1rem',
  },
  favoriteCard: {
    backgroundColor: '#333',
    marginBottom: '1.5rem',
    padding: '1rem',
    borderRadius: '10px',
  },
  favoriteImage: {
    width: '100%',
    height: '180px',
    objectFit: 'contain',
    borderRadius: '8px',
  },
  favoriteDetails: {
    paddingLeft: '1rem',
  },
  favoriteTitle: {
    fontSize: '1.2rem',
    color: '#fff',
  },
  favoriteButton: {
    marginTop: '0.75rem',
    borderRadius: '20px',
    width: '48%',
  },
  noContent: {
    color: '#bbb',
    fontSize: '1.1rem',
  },
};

export default ProfilePage;