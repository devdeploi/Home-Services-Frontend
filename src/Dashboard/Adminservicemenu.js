import { faArrowLeft, faEdit, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState, useEffect } from 'react';
import { Button,  Form, Modal, Spinner, Alert, Row, Col } from 'react-bootstrap';
import { API_URL } from '../utils/Function';
import { Link } from 'react-router-dom';
import Footeradmin from './footeradmin';



export default function Adminservicemenu() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [formData, setFormData] = useState({ serv_name: '', image: null });
  const [editData, setEditData] = useState({ serv_id: '', serv_name: '', image: null });
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch(`${API_URL}/service/getAllService.php`);
      const data = await response.json();
      if (data.status === 200) {
        setServices(data.data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to fetch services');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (serv_id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        const response = await fetch(`${API_URL}/service/deleteService.php`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ serv_id })
        });
        const data = await response.json();
        if (data.status === 200) {
          setServices(services.filter(service => service.serv_id !== serv_id));
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError('Failed to delete service');
      }
    }
  };

 const handleCreate = async (e) => {
  e.preventDefault();
  const formDataToSend = new FormData();
  formDataToSend.append('serv_name', formData.serv_name);
  formDataToSend.append('image', formData.image);

  try {
    const response = await fetch(`${API_URL}/service/createService.php`, {
      method: 'POST',
      body: formDataToSend
    });
    const data = await response.json();
    if (data.status === 200) {
      // Extract relevant fields from the response
      const newService = {
        serv_id: data.serv_id,
        serv_name: data.serv_name,
        image_url: data.image_url
      };
      setServices([...services, newService]);
      setShowCreate(false);
      setFormData({ serv_name: '', image: null });
    } else {
      setError(data.message);
    }
  } catch (err) {
    setError('Failed to create service');
  }
};

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('serv_id', editData.serv_id);
    if (editData.serv_name) formData.append('serv_name', editData.serv_name);
    if (editData.image) formData.append('image', editData.image);

    try {
      const response = await fetch(`${API_URL}/service/updateService.php`, {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      if (data.status === 200) {
        setServices(services.map(service => 
          service.serv_id === editData.serv_id ? { ...service, ...data } : service
        ));
        setShowEdit(false);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to update service');
    }
  };

  const handleImageChange = (e, isEdit = false) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (isEdit) {
          setEditData({ ...editData, image: file });
          setImagePreview(reader.result);
        } else {
          setFormData({ ...formData, image: file });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="container py-4">
     <div className="sticky-top bg-white py-3">
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <h5 className="mb-0 text-primary fw-bold">
      <Link to="/dashboard" className="text-decoration-none" style={{ color: '#000080' }}>
        <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
        Back
      </Link>
    </h5>
    
    <Button
      style={{ backgroundColor: '#000080', borderColor: '#000080' }}
      className=""
      onClick={() => setShowCreate(true)}
    >
      <FontAwesomeIcon icon={faPlus} />
    </Button>
  </div>
</div>

      <Row className="mb-4">
        <Col>
          <h2 className="fw-bold text-center" style={{ color: '#000080' }}>Manage Services</h2>
          
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <Spinner animation="border" />
      ) : (
        <Row className="g-3">
          {services.map(service => (
            <Col key={service.serv_id} xs={6}>
              <div className="border rounded-3 p-3 text-center shadow-sm bg-white h-100">
                <div
                  className="mb-2"
                  style={{
                    height: '60px',
                    backgroundImage: `url(${service.image_url})`,
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                  }}
                ></div>
                <div style={{ color: '#000080' }} className="fw-medium small">
                  {service.serv_name}
                </div>
                <div className="d-flex justify-content-center gap-2 mt-2">
                  <Button 
                    variant="warning" 
                    size="sm"
                    onClick={() => {
                      setEditData(service);
                      setImagePreview(service.image_url);
                      setShowEdit(true);
                    }}
                  >
                    <FontAwesomeIcon icon={faEdit}/>
                  </Button>
                  <Button 
                    variant="danger" 
                    size="sm"
                    onClick={() => handleDelete(service.serv_id)}
                  >
                     <FontAwesomeIcon icon={faTrash}/>
                  </Button>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      )}


      {/* Create Modal */}
      <Modal show={showCreate} onHide={() => setShowCreate(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Service</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleCreate}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Service Name</Form.Label>
              <Form.Control 
                type="text" 
                required
                value={formData.serv_name}
                onChange={(e) => setFormData({ ...formData, serv_name: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Image</Form.Label>
              <Form.Control 
                type="file" 
                accept="image/*"
                onChange={(e) => handleImageChange(e)}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowCreate(false)}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              Create
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Edit Modal */}
      <Modal show={showEdit} onHide={() => setShowEdit(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Service</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleUpdate}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Service Name</Form.Label>
              <Form.Control 
                type="text" 
                value={editData.serv_name}
                onChange={(e) => setEditData({ ...editData, serv_name: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Image</Form.Label>
              <Form.Control 
                type="file" 
                accept="image/*"
                onChange={(e) => handleImageChange(e, true)}
              />
              {imagePreview && (
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="mt-2 img-fluid"
                  style={{ maxHeight: '100px' }}
                />
              )}
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEdit(false)}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
      <div style={{height:'100px'}}></div>
      <Footeradmin/>
    </div>
  );
}