
import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useCookies } from 'react-cookie';
import { useNavigate, Link } from 'react-router-dom'; // Import useNavigate
import './UserNavbar.css';

const UserNavbar = () => {
  const [showModal, setShowModal] = useState(false);
  const [, , removeCookie] = useCookies(['userId', 'userType']);
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSignOut = () => {
    // Remove userId and userType cookies upon sign-out
    removeCookie('userId', { path: '/' });
    removeCookie('userType', { path: '/' });
    // Close the modal
    setShowModal(false);
    // Display success message and navigate to '/' after 1.5 seconds
    setTimeout(() => {
      // Navigate to '/'
      navigate('/');
    }, 100);
  };

  const handleSignOutLinkClick = (event) => {
    event.preventDefault(); // Prevent the default behavior of the link
    setShowModal(true); // Show the confirmation modal
  };

  return (
    <div>
      <div className="navbar-container">
        <div className="navbar-logo">Residential Community Hub</div>
        <div className="navbar-links">
          <Link to="/user-dashboard" className="navbar-link">Dashboard</Link>
          <Link to="/user-dashboard/notification" className="navbar-link">Notification</Link>
          <Link to="/user-dashboard/visitor" className="navbar-link">Visitor</Link>
          <Link to="/user-dashboard/maintenance" className="navbar-link">Maintenance</Link>
          <Link to="/" className="navbar-link" onClick={handleSignOutLinkClick}>SignOut</Link>
        </div>
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

export default UserNavbar;

