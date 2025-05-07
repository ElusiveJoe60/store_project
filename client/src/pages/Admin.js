import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Tabs, Tab, Button, Form, Modal } from 'react-bootstrap';
import { BsPhone, BsTags, BsLayers, BsGraphUp, BsFillFileTextFill } from 'react-icons/bs';
import CreateBrand from '../components/modals/CreateBrand';
import CreateDevice from '../components/modals/CreateDevice';
import CreateType from '../components/modals/CreateType';
import UserList from '../components/UserList';
import { getStats, getUserReport, getRolesReport } from '../http/dashboardAPI';
import { Context } from '../index';

const Admin = () => {
  const { user } = useContext(Context);

  const [brandVisible, setBrandVisible] = useState(false);
  const [typeVisible, setTypeVisible] = useState(false);
  const [deviceVisible, setDeviceVisible] = useState(false);
  const [stats, setStats] = useState({ usersCount: 0, ordersCount: 0, totalQuantity: 0 });
  const [reportData, setReportData] = useState(null);
  const [rolesData, setRolesData] = useState(null);
  const [showReport, setShowReport] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [activeTab, setActiveTab] = useState('catalog');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getStats();
        setStats(data);
      } catch (e) {
        console.error('Ошибка при получении статистики:', e);
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    if (user.isAuth) {
      generateReport();
    }
  }, [user.isAuth]);

  const generateReport = async () => {
    setLoading(true);
    try {
      const [userData, roleReport] = await Promise.all([
        getUserReport(fromDate, toDate),
        getRolesReport(fromDate, toDate)
      ]);
      setReportData(userData);
      setRolesData(roleReport);
      setShowReport(true);
    } catch (e) {
      console.error('Ошибка при создании отчётов:', e);
      alert('Ошибка при создании отчётов. Проверьте логи сервера.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="admin-container">
      <Row className="justify-content-between align-items-center mb-4">
        <Col md={3}>
          <h2 className="text-white">Админ-панель</h2>
        </Col>
        <Col md={3} className="text-right">
          <Button className="logout-btn">Выйти</Button>
        </Col>
      </Row>

      <Tabs activeKey={activeTab} onSelect={setActiveTab} id="admin-tabs" className="mb-4">
        <Tab eventKey="catalog" title="Каталог" className="tab-content">
          <Row className="g-4 justify-content-center mt-3">
            <Col md={4}>
              <Card onClick={() => setTypeVisible(true)} className="hover-card shadow-sm">
                <Card.Body>
                  <Card.Title>Добавить тип</Card.Title>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card onClick={() => setBrandVisible(true)} className="hover-card shadow-sm">
                <Card.Body>
                  <Card.Title>Добавить бренд</Card.Title>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card onClick={() => setDeviceVisible(true)} className="hover-card shadow-sm">
                <Card.Body>
                  <Card.Title>Добавить товар</Card.Title>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>

        <Tab eventKey="users" title="Пользователи">
          <UserList />
        </Tab>

        <Tab eventKey="dashboard" title="Статистика">
          <Row className="g-4 justify-content-center mt-3">
            <Col md={4}>
              <Card className="dashboard-card">
                <Card.Body>
                  <Card.Title>Пользователей</Card.Title>
                  <Card.Text>{stats.usersCount}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="dashboard-card">
                <Card.Body>
                  <Card.Title>Заказов</Card.Title>
                  <Card.Text>{stats.ordersCount}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="dashboard-card">
                <Card.Body> 
                  <Card.Title>Общее количество товаров</Card.Title>
                  <Card.Text>{stats.totalQuantity}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="mt-4">
            <Col md={8} className="mx-auto">
              <Card className="filter-card shadow-sm">
                <h5 className="mb-3">Фильтр по дате</h5>
                <Form>
                  <Row>
                    <Col>
                      <Form.Group controlId="fromDate">
                        <Form.Label>От</Form.Label>
                        <Form.Control
                          type="date"
                          value={fromDate}
                          onChange={(e) => setFromDate(e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group controlId="toDate">
                        <Form.Label>До</Form.Label>
                        <Form.Control
                          type="date"
                          value={toDate}
                          onChange={(e) => setToDate(e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                    <Col md="auto" className="d-flex align-items-end">
                      <Button onClick={generateReport} disabled={loading} className="generate-btn">
                        {loading ? 'Генерация...' : 'Создать отчёты'}
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </Card>
            </Col>
          </Row>

          {showReport && reportData && rolesData && (
            <Row className="mt-4 g-4 justify-content-center">
              <Col md={6}>
                <Card className="shadow-sm">
                  <Card.Body>
                    <h5 className="mb-3">Отчёт по активности пользователей</h5>
                    <p><strong>Дата отчёта:</strong> {reportData.date}</p>
                    <p><strong>Период:</strong> {reportData.period}</p>
                    <p><strong>Всего регистраций:</strong> {reportData.totalRegistrations}</p>
                    <p><strong>Всего пользователей:</strong> {reportData.totalUsers}</p>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={6}>
                <Card className="shadow-sm">
                  <Card.Body>
                    <h5 className="mb-3">Отчёт по ролям пользователей</h5>
                    <p><strong>Дата отчёта:</strong> {rolesData.date}</p>
                    <p><strong>Период:</strong> {rolesData.period}</p>
                    <p><strong>Всего пользователей:</strong> {rolesData.total}</p>
                    <p><strong>Пользователей с ролью user:</strong> {rolesData.user}</p>
                    <p><strong>Менеджеров:</strong> {rolesData.manager}</p>
                    <p><strong>Админов:</strong> {rolesData.admin}</p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}
        </Tab>
      </Tabs>

      <CreateBrand show={brandVisible} onHide={() => setBrandVisible(false)} />
      <CreateDevice show={deviceVisible} onHide={() => setDeviceVisible(false)} />
      <CreateType show={typeVisible} onHide={() => setTypeVisible(false)} />

      <style jsx="true">{`
        .admin-container {
          color: white;
          padding: 2rem;
          border-radius: 10px;
        }
        .hover-card {
          cursor: pointer;
          background-color: #2c3e50;
          border-radius: 10px;
          transition: background-color 0.3s ease;
        }
        .hover-card:hover {
          background-color: #34495e;
        }
        .dashboard-card {
          background-color: #2c3e50;
          border-radius: 10px;
          color: white;
        }
        .filter-card {
          background-color: #34495e;
          padding: 1.5rem;
          border-radius: 10px;
        }
        .generate-btn {
          background-color: #16a085;
          border: none;
          border-radius: 20px;
          color: white;
          width: 100%;
        }
        .logout-btn {
          background-color: #e74c3c;
          border: none;
          padding: 10px 20px;
          border-radius: 20px;
          color: white;
          font-weight: bold;
        }
        .tab-content {
          padding: 2rem;
          background-color: #34495e;
          border-radius: 10px;
        }
      `}</style>
    </Container>
  );
};

export default Admin;
