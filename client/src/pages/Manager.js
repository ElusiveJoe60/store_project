import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Button, Form, Dropdown } from 'react-bootstrap';
import { BsSearch, BsClockHistory } from 'react-icons/bs';
import { fetchOrders, updateOrderStatus } from '../http/orderAPI';
import { Context } from '../index';

const Manager = () => {
  const { user } = useContext(Context);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState({ from: '', to: '' });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const ordersData = await fetchOrders();
        setOrders(ordersData);
      } catch (error) {
        alert('Ошибка загрузки заказов');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders(orders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch {
      alert('Ошибка обновления статуса');
    }
  };

  const filteredOrders = orders.filter(order => {
    const searchMatch =
      searchQuery === '' ||
      order.id.toString().includes(searchQuery) ||
      order.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user.name?.toLowerCase().includes(searchQuery.toLowerCase());

    const statusMatch = statusFilter === 'all' || order.status === statusFilter;

    let dateMatch = true;
    if (dateFilter.from) dateMatch = dateMatch && new Date(order.createdAt) >= new Date(dateFilter.from);
    if (dateFilter.to) dateMatch = dateMatch && new Date(order.createdAt) <= new Date(dateFilter.to);

    return searchMatch && statusMatch && dateMatch;
  });

  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setDateFilter({ from: '', to: '' });
  };

  const getColor = (status) => {
    switch (status) {
      case 'pending': return '#f9ca24';
      case 'processing': return '#00cec9';
      case 'shipped': return '#0984e3';
      case 'delivered': return '#00b894';
      case 'cancelled': return '#d63031';
      default: return '#b2bec3';
    }
  };

  return (
    <Container style={{ paddingTop: 40, paddingBottom: 60 }}>
      <h2 style={{ textAlign: 'center', marginBottom: 30, color: '#2d3436' }}>📦 Панель управления заказами</h2>

      {/* Фильтры */}
      <div style={{
        backgroundColor: '#dfe6e9',
        padding: 20,
        borderRadius: 12,
        marginBottom: 30,
        boxShadow: '0 3px 8px rgba(0,0,0,0.1)'
      }}>
        <Row className="g-3">
          <Col md={5}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <BsSearch />
              <Form.Control
                placeholder="Поиск по email, имени или номеру"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </Col>
          <Col md={3}>
            <Form.Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Все статусы</option>
              <option value="pending">Ожидает</option>
              <option value="processing">В работе</option>
              <option value="shipped">Отправлен</option>
              <option value="delivered">Доставлен</option>
              <option value="cancelled">Отменён</option>
            </Form.Select>
          </Col>
          <Col md={4}>
            <Row className="g-2">
              <Col>
                <Form.Control
                  type="date"
                  value={dateFilter.from}
                  onChange={(e) => setDateFilter({ ...dateFilter, from: e.target.value })}
                />
              </Col>
              <Col>
                <Form.Control
                  type="date"
                  value={dateFilter.to}
                  onChange={(e) => setDateFilter({ ...dateFilter, to: e.target.value })}
                />
              </Col>
            </Row>
          </Col>
        </Row>
        <div className="mt-3 text-end">
          <Button variant="dark" onClick={resetFilters}>
            Сбросить
          </Button>
        </div>
      </div>

      {/* Список заказов */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 50 }}>
          <div className="spinner-border" role="status" />
        </div>
      ) : (
        <div>
          {filteredOrders.length === 0 ? (
            <div style={{
              backgroundColor: '#ffeaa7',
              padding: 30,
              borderRadius: 10,
              textAlign: 'center',
              fontSize: 18
            }}>
              Заказы не найдены
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {filteredOrders.map(order => (
                <div key={order.id} style={{
                  border: `2px solid ${getColor(order.status)}`,
                  padding: 20,
                  borderRadius: 12,
                  backgroundColor: '#f8f9fa',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                    <div>
                      <strong>Заказ #{order.id}</strong>
                      <div style={{ fontSize: 13, color: '#636e72' }}>{new Date(order.createdAt).toLocaleString()}</div>
                    </div>
                    <div>
                      <span style={{
                        backgroundColor: getColor(order.status),
                        padding: '5px 10px',
                        borderRadius: 20,
                        color: '#fff',
                        fontSize: 13
                      }}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    <strong>Клиент:</strong> {order.user.name || '—'} ({order.user.email})
                  </div>
                  <div style={{ marginBottom: 10 }}>
                    <strong>Сумма:</strong> {order.totalPrice} ₽
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <Dropdown>
                      <Dropdown.Toggle size="sm" variant="secondary">
                        Изменить статус
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(status => (
                          <Dropdown.Item key={status} onClick={() => handleStatusChange(order.id, status)}>
                            {status}
                          </Dropdown.Item>
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </Container>
  );
};

export default Manager;
