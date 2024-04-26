import React, { useState, useEffect } from 'react';
import axios from 'axios';
import logo from '../../Media/Gifs/dog.gif';
import './UserNotification.css';
import UserNavbar from '../UserNavbar/UserNavbar';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

const UserNotification = () => {
  const [notifications, setNotifications] = useState([]);
  const [cookies] = useCookies(['userId', 'userType']);
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if userId is not 0 and userType is not "RESIDENT"
    if (cookies.userId !== 0 && cookies.userType !== "RESIDENT") {
      navigate('/sign-in');
    } else {
      fetchNotifications();
    }
  }, [cookies.userId, cookies.userType, navigate]);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get('http://localhost:8085/communityhub/user/notification/getAll');
      const sortedNotifications = response.data.reverse();
      setNotifications(sortedNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className='user-notification-main'>
      <UserNavbar />

      <div className="notification-container">
        <h2 id="headline_of_notifictaions">IMPORTANT NOTICE</h2>
        {notifications.length === 0 ? (
          <div className="no-notifications-message">
            <div className="no-records-message">Nothing new notifications posted!😕</div>
            <div className="emoji">
              <img src={logo} className="dog" alt="wait" />
            </div>

          </div>
        ) : (
          notifications.map(notification => (
            <div key={notification.notificationId} className="notification-card">
              <div className="notification-header">
                <span className="notification-title">{notification.notificationTitle}</span>
                <span className="notification-posted-by">Posted by {notification.postedBy}</span>
              </div>
              <div className="notification-description">{notification.notificationDescription}</div>
              <div className="notification-date">{formatDate(notification.dateOfPost)}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default UserNotification;
