
import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useCookies } from 'react-cookie';
import { useNavigate, Link } from 'react-router-dom'; // Import useNavigate
import './AdminNavbar.css';

const AdminNavbar = () => {
  const [showModal, setShowModal] = useState(false);
  const [, , removeCookie] = useCookies(['userId', 'userType']);
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSignOut = () => {
    // Remove userId and userType cookies upon sign-out
    removeCookie('userId', { path: '/' });
    removeCookie('userType', { path: '/' });
    // Close the modal
    setShowModal(false);
    // Display success message and navigate to '/dashboard' after 1.5 seconds
    setTimeout(() => {
      // Navigate to '/dashboard'
      navigate('/');
    }, 100);
  };

  const handleSignOutLinkClick = (event) => {
    event.preventDefault(); // Prevent the default behavior of the link
    setShowModal(true); // Show the confirmation modal
  };

  return (
    <div className="admin-navbar-container">
      <div className="admin-navbar-logo">Residential Community Hub | ADMIN</div>
      <div className="admin-navbar-links">
        <Link to="/admin-dashboard" className="admin-navbar-link">Dashboard</Link>
        <Link to="/admin-dashboard/notification" className="admin-navbar-link">Notification</Link>
        <Link to="/admin-dashboard/visitor" className="admin-navbar-link">Visitor</Link>
        <Link to="/admin-dashboard/maintenance" className="admin-navbar-link">Maintenance</Link>
        <Link to="/" className="admin-navbar-link" onClick={handleSignOutLinkClick}>SignOut</Link>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Are you sure you want to sign out?</Modal.Title>
        </Modal.Header>
        <Modal.Footer>
          <Button variant="primary" onClick={handleSignOut}>Yes</Button>
          <Button variant="secondary" onClick={() => setShowModal(false)}>No</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default AdminNavbar;

