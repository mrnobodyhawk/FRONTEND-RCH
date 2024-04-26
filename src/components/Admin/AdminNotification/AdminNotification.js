import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './AdminNotification.css';
import "react-datepicker/dist/react-datepicker.css";
import AdminNavbar from '../AdminNavbar/AdminNavbar';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

const AdminNotification = () => {
    const [notifications, setNotifications] = useState([]);
    const [formData, setFormData] = useState({
        notificationId: null,
        notificationTitle: '',
        notificationDescription: '',
        dateOfPost: null,
        adminId: '',
    });
    const notificationRef = useRef(null);
    const [cookies] = useCookies(['userId', 'userType']);

    const navigate = useNavigate();

    useEffect(() => {
        if (cookies.userId === 0 || cookies.userType !== "ADMIN") {
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = {};
        if (!formData.notificationTitle) {
            errors.notificationTitle = "Please enter notification title.";
        }
        if (!formData.notificationDescription) {
            errors.notificationDescription = "Please enter notification description.";
        }

        if (Object.keys(errors).length === 0) {
            try {
                const currentDate = new Date();
                formData.dateOfPost = currentDate.toISOString();
                formData.adminId = cookies.userId;

                if (formData.notificationId) {
                    await axios.put(`http://localhost:8085/communityhub/user/notification/update/${formData.notificationId}`, formData);
                    toast.success("Notification updated!");
                } else {
                    await axios.post('http://localhost:8085/communityhub/user/notification/create', formData);
                    toast.success("Created a notice!");
                }
                fetchNotifications();
                setFormData({
                    notificationId: null,
                    notificationTitle: '',
                    notificationDescription: '',
                    dateOfPost: null,
                    adminId: '',
                });
            } catch (error) {
                console.error('Error creating/updating notification:', error);
            }
        } else {
            toast.error("Please fill in all details");
        }
    };

    const handleDelete = async (notificationId) => {
        try {
            await axios.delete(`http://localhost:8085/communityhub/user/notification/delete/${notificationId}`);
            toast.success("Notification deleted!");
            fetchNotifications();
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    const handleEdit = (notification) => {
        setFormData({
            notificationId: notification.notificationId,
            notificationTitle: notification.notificationTitle,
            notificationDescription: notification.notificationDescription,
            dateOfPost: notification.dateOfPost,
        });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
        return date.toLocaleDateString('en-US', options);
    };

    const animateNotification = () => {
        if (notificationRef.current) {
            notificationRef.current.classList.add('admin-notification-animation');
            setTimeout(() => {
                notificationRef.current.classList.remove('admin-notification-animation');
            }, 1000); // Adjust timing as needed
        }
    };

    useEffect(() => {
        animateNotification();
    }, [notifications]);

    return (
        <div className='admin-notification-main'>
            <AdminNavbar />
            <div className="admin-notification-container">
                <div className="admin-notification-card admin-create-notification">
                    <h2>{formData.notificationId ? 'Update Notification' : 'Create New Notification'}</h2>
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label>Title:</label>
                            <input type="text" name="notificationTitle" value={formData.notificationTitle} onChange={handleInputChange} />
                        </div>
                        <div>
                            <label>Description:</label>
                            <textarea name="notificationDescription" value={formData.notificationDescription} onChange={handleInputChange} />
                        </div>
                        <br />
                        <button type="submit">{formData.notificationId ? 'Update' : 'Create'}</button>
                    </form>
                </div>
                {notifications.map((notification, index) => (
                    <div
                        key={notification.notificationId}
                        className={`admin-notification-card ${index % 3 === 0 ? 'admin-left' : index % 3 === 1 ? 'admin-middle' : 'admin-right'}`}
                        ref={index === notifications.length - 1 ? notificationRef : null}
                    >
                        <div className="admin-notification-header">
                            <span className="admin-notification-title">{notification.notificationTitle}</span>
                            <div className='admin-edit-delete-button-for-notification'>
                                <button onClick={() => handleEdit(notification)}>Edit</button>
                                <button onClick={() => handleDelete(notification.notificationId)}>Delete</button>
                            </div>
                        </div>
                        <div className="admin-notification-description">{notification.notificationDescription}</div>
                        <div className="admin-notification-date">{formatDate(notification.dateOfPost)}</div>
                    </div>
                ))}
            </div>
            <ToastContainer />
        </div>
    );
}

export default AdminNotification;

/*
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './AdminNotification.css';
import "react-datepicker/dist/react-datepicker.css";
import AdminNavbar from '../AdminNavbar/AdminNavbar';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

const AdminNotification = () => {
    const [notifications, setNotifications] = useState([]);
    const [formData, setFormData] = useState({
        notificationId: null,
        notificationTitle: '',
        notificationDescription: '',
        dateOfPost: null,
        adminId: '',
    });
    const [validationErrors, setValidationErrors] = useState({});
    const notificationRef = useRef(null);
    const [cookies] = useCookies(['userId', 'userType']);

    const navigate = useNavigate();

    useEffect(() => {
        if (cookies.userId === 0 || cookies.userType !== "ADMIN") {
            navigate('/sign-in');
        } else {
            fetchNotifications();
        }
    }, [cookies.userId, cookies.userType, navigate]);

    const fetchNotifications = async () => {
        try {
            const response = await axios.get('http://localhost:8085/communityhub/user/notification/getAll');
            const sortedNotifications = response.data.sort((a, b) => new Date(b.dateOfPost) - new Date(a.dateOfPost));
            setNotifications(sortedNotifications);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const handleDateChange = (date, key) => {
        setFormData(prevState => ({
            ...prevState,
            [key]: date
        }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = {};
        if (!formData.notificationTitle) {
            errors.notificationTitle = "Please enter notification title.";
        }
        if (!formData.notificationDescription) {
            errors.notificationDescription = "Please enter notification description.";
        }

        if (Object.keys(errors).length === 0) {
            try {
                const currentDate = new Date();
                formData.dateOfPost = currentDate.toISOString();
                formData.adminId = cookies.userId;

                if (formData.notificationId) {
                    await axios.put(`http://localhost:8085/communityhub/user/notification/update/${formData.notificationId}`, formData);
                    toast.success("Notification updated!");
                } else {
                    await axios.post('http://localhost:8085/communityhub/user/notification/create', formData);
                    toast.success("Created a notice!");
                }
                fetchNotifications();
                setFormData({
                    notificationId: null,
                    notificationTitle: '',
                    notificationDescription: '',
                    dateOfPost: null,
                    adminId: '',
                });
            } catch (error) {
                console.error('Error creating/updating notification:', error);
            }
        } else {
            toast.error("Please fill in all details");
            setValidationErrors(errors);
        }
    };

    const handleDelete = async (notificationId) => {
        try {
            await axios.delete(`http://localhost:8085/communityhub/user/notification/delete/${notificationId}`);
            toast.success("Notification deleted!");
            fetchNotifications();
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    const handleEdit = (notification) => {
        setFormData({
            notificationId: notification.notificationId,
            notificationTitle: notification.notificationTitle,
            notificationDescription: notification.notificationDescription,
            dateOfPost: notification.dateOfPost,
        });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
        return date.toLocaleDateString('en-US', options);
    };

    const animateNotification = () => {
        if (notificationRef.current) {
            notificationRef.current.classList.add('admin-notification-animation');
            setTimeout(() => {
                notificationRef.current.classList.remove('admin-notification-animation');
            }, 1000); // Adjust timing as needed
        }
    };

    useEffect(() => {
        animateNotification();
    }, [notifications]);

    return (
        <div className='admin-notification-main'>
            <AdminNavbar />
            <div className="admin-notification-container">
                <div className="admin-notification-card admin-create-notification">
                    <h2>{formData.notificationId ? 'Update Notification' : 'Create New Notification'}</h2>
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label>Title:</label>
                            <input type="text" name="notificationTitle" value={formData.notificationTitle} onChange={handleInputChange} />
                        </div>
                        <div>
                            <label>Description:</label>
                            <textarea name="notificationDescription" value={formData.notificationDescription} onChange={handleInputChange} />
                        </div>
                        <br />
                        <button type="submit">{formData.notificationId ? 'Update' : 'Create'}</button>
                    </form>
                </div>
                {notifications.map((notification, index) => (
                    <div
                        key={notification.notificationId}
                        className={`admin-notification-card ${index % 3 === 0 ? 'admin-left' : index % 3 === 1 ? 'admin-middle' : 'admin-right'}`}
                        ref={index === notifications.length - 1 ? notificationRef : null}
                    >
                        <div className="admin-notification-header">
                            <span className="admin-notification-title">{notification.notificationTitle}</span>
                            <div className='admin-edit-delete-button-for-notification'>
                                <button onClick={() => handleEdit(notification)}>Edit</button>
                                <button onClick={() => handleDelete(notification.notificationId)}>Delete</button>
                            </div>
                        </div>
                        <div className="admin-notification-description">{notification.notificationDescription}</div>
                        <div className="admin-notification-date">{formatDate(notification.dateOfPost)}</div>
                    </div>
                ))}
            </div>
            <ToastContainer />
        </div>
    );
}

export default AdminNotification;
*/