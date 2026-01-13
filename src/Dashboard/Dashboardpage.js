import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { API_URL } from '../utils/Function';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShop, faUsers } from '@fortawesome/free-solid-svg-icons';

export default function Dashboardpage() {
  const [stats, setStats] = useState({
    loading: true,
    error: null,
    totalBookings: 0,
    totalUsers: 0,
    statusCounts: {
      pending: 0,
      onProgress: 0,
      completed: 0,
      cancelled: 0
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingsResponse, usersResponse] = await Promise.all([
          fetch(`${API_URL}/booking/getBooking.php`),
          fetch(`${API_URL}/users/getUser.php`)
        ]);

        // Check if responses are successful
        if (!bookingsResponse.ok) throw new Error('Failed to fetch bookings');
        if (!usersResponse.ok) throw new Error('Failed to fetch users');

        const bookingsData = await bookingsResponse.json();
        const usersData = await usersResponse.json();

        // Verify data structure
        if (!bookingsData.data || !usersData.data) {
          throw new Error('Invalid data format from API');
        }

        // Calculate status counts
        const statusCounts = {
          pending: 0,
          onProgress: 0,
          completed: 0,
          cancelled: 0
        };

        bookingsData.data.forEach(booking => {
          const status = parseInt(booking.status);
          if (status === 1) statusCounts.pending++;
          else if (status === 2) statusCounts.onProgress++;
          else if (status === 3) statusCounts.completed++;
          else if (status === 4) statusCounts.cancelled++;
        });

        setStats({
          loading: false,
          error: null,
          totalBookings: bookingsData.data.length,
          totalUsers: usersData.data.length,
          statusCounts
        });

      } catch (error) {
        console.error('Fetch error:', error);
        setStats(prev => ({
          ...prev,
          loading: false,
          error: error.message
        }));
      }
    };

    fetchData();
  }, []);

  if (stats.loading) {
    return (
      <Container className="text-center py-5">
        <div className="text-center mt-5">
          <Spinner animation="border" role="status" style={{ color: '#020403' }}>
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-2" style={{ color: '#020403' }}>Loading...</p>
        </div>
      </Container>
    );
  }

  if (stats.error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <h2>Error Loading Dashboard</h2>
          <p>{stats.error}</p>
          <button
            className="btn btn-primary"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4 px-4">
      <h1 className="text-center mb-4">Admin Dashboard</h1>

      <Row className="g-4 mb-4">
        {/* Overview Cards */}
        <Col lg={3} md={6}>
          <Card className="h-100 shadow border-0 rounded-3">
            <Card.Body className="text-center">
              <div className="d-flex align-items-center justify-content-center mb-3">
                <div className="rounded-circle bg-primary bg-opacity-10 p-3">
                  <FontAwesomeIcon icon={faShop} />
                </div>
              </div>
              <Card.Title>Total Orders</Card.Title>
              <Card.Text className="display-4 fw-bold text-primary">
                {stats.totalBookings}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={3} md={6}>
          <Card className="h-100 shadow border-0 rounded-3">
            <Card.Body className="text-center">
              <div className="d-flex align-items-center justify-content-center mb-3">
                <div className="rounded-circle bg-success bg-opacity-10 p-3">
                  <FontAwesomeIcon icon={faUsers} />
                </div>
              </div>
              <Card.Title>Total Users</Card.Title>
              <Card.Text className="display-4 fw-bold text-success">
                {stats.totalUsers}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6} md={12}>
          <Card className="h-100 shadow border-0 rounded-3">
            <Card.Body>
              <h4 className="text-center mb-4">Orders by Status</h4>
              <Row className="g-3 text-center">
                <Col xs={6}>
                  <Card className="border-0 bg-warning bg-opacity-10">
                    <Card.Body>
                      <i className="fas fa-clock text-warning mb-2"></i>
                      <h5>Pending</h5>
                      <h3 className="fw-bold text-warning">{stats.statusCounts.pending}</h3>
                    </Card.Body>
                  </Card>
                </Col>
                <Col xs={6}>
                  <Card className="border-0 bg-info bg-opacity-10">
                    <Card.Body>
                      <i className="fas fa-spinner text-info mb-2"></i>
                      <h5>On Progress</h5>
                      <h3 className="fw-bold text-info">{stats.statusCounts.onProgress}</h3>
                    </Card.Body>
                  </Card>
                </Col>
                <Col xs={6}>
                  <Card className="border-0 bg-success bg-opacity-10">
                    <Card.Body>
                      <i className="fas fa-check-circle text-success mb-2"></i>
                      <h5>Completed</h5>
                      <h3 className="fw-bold text-success">{stats.statusCounts.completed}</h3>
                    </Card.Body>
                  </Card>
                </Col>
                <Col xs={6}>
                  <Card className="border-0 bg-danger bg-opacity-10">
                    <Card.Body>
                      <i className="fas fa-times-circle text-danger mb-2"></i>
                      <h5>Cancelled</h5>
                      <h3 className="fw-bold text-danger">{stats.statusCounts.cancelled}</h3>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4 mb-4">
        <Col md={12}>
          <Card className="shadow border-0 rounded-3">
            <Card.Body>
              <h4 className="mb-4 text-center">Status Distribution</h4>
              {stats.totalBookings > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Pending', value: stats.statusCounts.pending, color: '#ffc107' },
                        { name: 'On Progress', value: stats.statusCounts.onProgress, color: '#17a2b8' },
                        { name: 'Completed', value: stats.statusCounts.completed, color: '#28a745' },
                        { name: 'Cancelled', value: stats.statusCounts.cancelled, color: '#dc3545' }
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {[
                        { name: 'Pending', value: stats.statusCounts.pending, color: '#ffc107' },
                        { name: 'On Progress', value: stats.statusCounts.onProgress, color: '#17a2b8' },
                        { name: 'Completed', value: stats.statusCounts.completed, color: '#28a745' },
                        { name: 'Cancelled', value: stats.statusCounts.cancelled, color: '#dc3545' }
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} Orders`, 'Count']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-5 text-muted">
                  <i className="fas fa-chart-pie fa-3x mb-3"></i>
                  <h5>No bookings data available</h5>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <div style={{ height: '80px' }}></div>
    </Container>
  );
}