import React, { useState, useEffect, useCallback } from "react";
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import UserNavbar from "../UserNavbar/UserNavbar";
import axios from 'axios'; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './UserVisitor.css';

export default function UserVisitor() {
  const [visitorRecords, setVisitorRecords] = useState([]);
  const [newVisitor, setNewVisitor] = useState({
    visitorFullName: "",
    buildingNumber: "",
    purpose: "",
    checkInDate: null,
    checkOutDate: null
  });
  const [cookies] = useCookies(['userId', 'userType']);
  const userId = cookies.userId || 0;
  const navigate = useNavigate();

  const fetchVisitorRecords = useCallback(() => {
    axios.get(`http://localhost:8084/communityhub/user/visitors/user/${userId}`)
      .then(response => {
        const sortedData = response.data.reverse();
        setVisitorRecords(sortedData);
      })
      .catch(error => console.error('Error fetching visitor records:', error));
  }, [userId]);

  useEffect(() => {
    if (userId === 0 || cookies.userType !== "RESIDENT") {
      navigate('/sign-in');
    } else {
      fetchVisitorRecords();
    }
  }, [userId, cookies.userType, navigate, fetchVisitorRecords]);

  const handleDateChange = (date, field) => {
    setNewVisitor(prevState => ({
      ...prevState,
      [field]: date
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewVisitor(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleAdd = () => {
    const errors = validateVisitor();
    const currentDate = new Date();

    if (Object.keys(errors).length === 0) {
      if (newVisitor.checkInDate < currentDate) {
        toast.error("Check-in date cannot be before current date and time.");
      } else if (newVisitor.checkOutDate <= newVisitor.checkInDate) {
        toast.error("Check-out date must be after check-in date.");
      } else {
        postVisitor();
      }
    } else {
      Object.values(errors).forEach(error => {
        toast.error(error);
      });
    }
  };

  const validateVisitor = () => {
    const errors = {};
    if (!newVisitor.visitorFullName) {
      errors.visitorFullName = "Please enter visitor name.";
    }
    if (!newVisitor.buildingNumber) {
      errors.buildingNumber = "Please enter building number.";
    }
    if (!newVisitor.purpose) {
      errors.purpose = "Please enter purpose.";
    }
    if (!newVisitor.checkInDate) {
      errors.checkInDate = "Please select check-in date.";
    }
    if (!newVisitor.checkOutDate) {
      errors.checkOutDate = "Please select check-out date.";
    } else if (newVisitor.checkOutDate <= newVisitor.checkInDate) {
      errors.checkOutDate = "Check-out date must be after check-in date.";
    }
    return errors;
  };

  const postVisitor = () => {
    axios.post(`http://localhost:8084/communityhub/user/visitors/create`, {
      ...newVisitor,
      userId: userId,
      userType: "RESIDENT"
    })
      .then(response => {
        if (response.status === 200) {
          fetchVisitorRecords();
          resetNewVisitor();
          toast.success("Visitor added successfully!");
        } else {
          throw new Error('Failed to add new visitor record');
        }
      })
      .catch(error => console.error('Error adding new visitor record:', error));
  };

  const resetNewVisitor = () => {
    setNewVisitor({
      visitorFullName: "",
      buildingNumber: "",
      purpose: "",
      checkInDate: null,
      checkOutDate: null
    });
  };

  const handleDelete = (visitorId) => {
    axios.delete(`http://localhost:8084/communityhub/user/visitors/delete/${visitorId}`)
      .then(response => {
        if (response.status === 200) {
          setVisitorRecords(visitorRecords.filter(record => record.visitorId !== visitorId));
          toast.success("Visitor deleted successfully!");
        } else {
          throw new Error('Failed to delete record');
        }
      })
      .catch(error => console.error('Error deleting visitor record:', error));
  };

  const columns = [
    { key: "visitorFullName", label: "VISITOR NAME" },
    { key: "buildingNumber", label: "BUILDING NUMBER" },
    { key: "purpose", label: "PURPOSE" },
    { key: "checkInDate", label: "CHECK-IN DATE" },
    { key: "checkOutDate", label: "CHECK-OUT DATE" },
    { key: "actionButton", label: "ACTION" }
  ];

  return (
    <div>
      <UserNavbar />
      <div className="table-container-visitor">
        <h2 id="headline_of_visitors">Visitors List</h2>
        <ToastContainer />
        <table aria-label="Visitor Records" className="table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key}>{column.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visitorRecords.map((row) => (
              <tr key={row.visitorId}>
                {columns.map((column) => (
                  <td key={column.key}>
                    {column.key === "checkInDate" || column.key === "checkOutDate" ?
                      <>
                        <DatePicker
                          selected={row[column.key] ? new Date(row[column.key]) : null}
                          onChange={(date) => handleDateChange(date, column.key)}
                          showTimeSelect
                          timeFormat="HH:mm"
                          timeIntervals={15}
                          dateFormat="MMMM d, yyyy h:mm aa"
                          disabled
                        />
                      </>
                      : column.key === "actionButton" ?
                        <button onClick={() => handleDelete(row.visitorId)}>Delete</button>
                        : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              {Object.keys(newVisitor).map((key, index) => (
                <td key={index}>
                  {key === "checkInDate" || key === "checkOutDate" ?
                    <>
                      <DatePicker
                        selected={newVisitor[key]}
                        onChange={(date) => handleDateChange(date, key)}
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={15}
                        dateFormat="MMMM d, yyyy h:mm aa"
                      />
                    </> :
                    <>
                      <input
                        type="text"
                        name={key}
                        value={newVisitor[key]}
                        onChange={handleInputChange}
                      />
                    </>
                  }
                </td>
              ))}
              <td>
                <button onClick={handleAdd}>ADD</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
